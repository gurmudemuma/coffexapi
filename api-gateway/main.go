package main

import (
	"bytes"
	"crypto/aes"
	"crypto/cipher"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"mime/multipart"
	"net/http"
	"strings"
	"sync"
	"time"
)

// ExportData represents a submitted export with its documents
type ExportData struct {
	ExportID  string                  `json:"exportId"`
	Documents map[string]DocumentInfo `json:"documents"`
	Exporter  string                  `json:"exporter"`
	Timestamp time.Time               `json:"timestamp"`
	Status    string                  `json:"status"`
}

// DocumentInfo represents document metadata
type DocumentInfo struct {
	Hash        string `json:"hash"`
	IPFSCID     string `json:"ipfsCid"`
	IPFSURL     string `json:"ipfsUrl"`
	IV          string `json:"iv"`
	Key         string `json:"key"` // Encryption key for decryption
	Encrypted   bool   `json:"encrypted"`
	ContentType string `json:"contentType"`
	Size        int64  `json:"size"`
}

// ApprovalRequest represents an approval request from an approver
type ApprovalRequest struct {
	DocumentHash string `json:"documentHash"`
	ExportID     string `json:"exportId"`
	Action       string `json:"action"` // "APPROVE" or "REJECT"
	Comments     string `json:"comments"`
	ReviewedBy   string `json:"reviewedBy"`
}

// ApprovalStageInfo represents detailed approval stage information
type ApprovalStageInfo struct {
	ID           string     `json:"id"`
	ExportID     string     `json:"exportId"`
	DocumentType string     `json:"documentType"`
	Organization string     `json:"organization"`
	StageOrder   int        `json:"stageOrder"`
	Status       string     `json:"status"`
	AssignedTo   string     `json:"assignedTo"`
	ReviewedBy   string     `json:"reviewedBy"`
	ReviewDate   *time.Time `json:"reviewDate"`
	Comments     string     `json:"comments"`
	CreatedAt    time.Time  `json:"createdAt"`
	UpdatedAt    time.Time  `json:"updatedAt"`
	DocumentHash string     `json:"documentHash"`
	ExporterName string     `json:"exporterName"`
	UrgencyLevel string     `json:"urgencyLevel"`
}

// BankSupervisorViewData represents the supervisor dashboard data
type BankSupervisorViewData struct {
	ExportID        string             `json:"exportId"`
	ExporterName    string             `json:"exporterName"`
	TotalStages     int                `json:"totalStages"`
	CompletedStages int                `json:"completedStages"`
	CurrentStage    *ApprovalStageInfo `json:"currentStage"`
	OverallStatus   string             `json:"overallStatus"`
	Documents       []DocumentInfo     `json:"documents"`
	LastActivity    time.Time          `json:"lastActivity"`
	Timeline        []ApprovalActivity `json:"timeline"`
}

// ApprovalActivity represents timeline activity
type ApprovalActivity struct {
	Type         string    `json:"type"`
	Organization string    `json:"organization"`
	ReviewedBy   string    `json:"reviewedBy"`
	Comments     string    `json:"comments"`
	Timestamp    time.Time `json:"timestamp"`
	DocumentType string    `json:"documentType"`
}

// CompletedApproval represents a completed approval
type CompletedApproval struct {
	ID           string    `json:"id"`
	ExportID     string    `json:"exportId"`
	DocumentHash string    `json:"documentHash"`
	Action       string    `json:"action"`
	Comments     string    `json:"comments"`
	ReviewedBy   string    `json:"reviewedBy"`
	Organization string    `json:"organization"`
	Timestamp    time.Time `json:"timestamp"`
}

// In-memory storage for documents and metadata
var (
	documentStorage    = make(map[string][]byte)
	unencryptedStorage = make(map[string][]byte) // For approver access
	documentMetadata   = make(map[string]map[string]interface{})
	documentMutex      sync.RWMutex

	// In-memory storage for submitted exports
	submittedExports = make(map[string]ExportData)
	exportsMutex     sync.RWMutex

	// Sample data storage for testing
	sampleExports = make(map[string]map[string]interface{})
	sampleMutex   sync.RWMutex

	// Approvals storage (store individual approvals keyed by ID)
	completedApprovals = make(map[string]CompletedApproval)
	approvalsMutex     sync.RWMutex
)

// enableCORS adds CORS headers to allow cross-origin requests
func enableCORS(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-User-Role, X-Organization")

	// Handle preflight requests
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}
}

// corsWrapper wraps handlers with CORS support
func corsWrapper(handler http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		enableCORS(w, r)
		if r.Method == "OPTIONS" {
			return
		}
		handler(w, r)
	}
}

func main() {
	// API endpoints with CORS support
	http.HandleFunc("/api/auth/login", corsWrapper(loginHandler))
	http.HandleFunc("/api/documents", corsWrapper(uploadDocumentHandler))
	http.HandleFunc("/api/documents/upload", corsWrapper(uploadDocumentToDbHandler))
	http.HandleFunc("/api/documents/", corsWrapper(viewDocumentHandler))
	http.HandleFunc("/api/exports", corsWrapper(submitExportHandler))
	http.HandleFunc("/api/pending-approvals", corsWrapper(pendingApprovalsHandler))
	http.HandleFunc("/api/completed-approvals", corsWrapper(completedApprovalsHandler))
	http.HandleFunc("/api/exports/list", corsWrapper(listExportsHandler)) // Debug endpoint
	http.HandleFunc("/approve", corsWrapper(approveHandler))              // Document approval endpoint
	// Multi-channel approval endpoints
	http.HandleFunc("/api/approval-channels/pending", corsWrapper(getOrganizationPendingApprovalsHandler))
	// Summary endpoint used by approver dashboards (BaseDashboard)
	http.HandleFunc("/api/approval-channels/summary", corsWrapper(getApprovalChannelsSummaryHandler))
	http.HandleFunc("/api/approval-channels/submit-decision", corsWrapper(submitApprovalDecisionHandler))
	http.HandleFunc("/api/supervisor/exports", corsWrapper(getBankSupervisorExportsHandler))
	http.HandleFunc("/api/supervisor/export/", corsWrapper(getBankSupervisorViewHandler))
	http.HandleFunc("/api/approval-chain/", corsWrapper(getApprovalChainHandler))
	// Exporter dashboard endpoints
	http.HandleFunc("/api/exporter/dashboard", corsWrapper(getExporterDashboardHandler))
	http.HandleFunc("/api/exporter/requests", corsWrapper(getExporterRequestsHandler))
	http.HandleFunc("/api/exporter/request/", corsWrapper(getExporterRequestDetailHandler))
	// Minimal submission notifier used by frontend to reflect new exports immediately
	http.HandleFunc("/api/exporter/submit", corsWrapper(handleExporterSubmitNotify))
	http.HandleFunc("/api/test/create-sample-data", corsWrapper(createSampleDataHandler))
	http.HandleFunc("/api/ipfs/upload", corsWrapper(ipfsUploadProxyHandler))
	http.HandleFunc("/health", corsWrapper(healthHandler))

	// Start HTTP server
	fmt.Println("API Gateway running on port 8000 with CORS enabled")
	if err := http.ListenAndServe(":8000", nil); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
	// Mock implementation for demonstration
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"token": "mock-auth-token"})
}

func uploadDocumentHandler(w http.ResponseWriter, r *http.Request) {
	// Mock implementation for demonstration
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"cid": "mock-cid"})
}

// submitExportHandler handles export submissions and ensures approvers can access documents
func submitExportHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Parse the export request
	var exportRequest map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&exportRequest); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Extract export data
	exportID := fmt.Sprintf("EXP-%d", time.Now().UnixNano()/1000000)
	if id, exists := exportRequest["exportId"]; exists {
		if idStr, ok := id.(string); ok {
			exportID = idStr
		}
	}

	// Create export data structure
	exportData := ExportData{
		ExportID:  exportID,
		Documents: make(map[string]DocumentInfo),
		Exporter:  "Coffee Exporter Co.", // Default exporter name
		Timestamp: time.Now(),
		Status:    "SUBMITTED",
	}

	// Extract exporter info if provided
	if exporter, exists := exportRequest["exporter"]; exists {
		if exporterStr, ok := exporter.(string); ok {
			exportData.Exporter = exporterStr
		}
	}

	// Extract documents if provided
	if docs, exists := exportRequest["documents"]; exists {
		if docsMap, ok := docs.(map[string]interface{}); ok {
			for docType, docData := range docsMap {
				if docInfo, ok := docData.(map[string]interface{}); ok {
					document := DocumentInfo{}
					if hash, exists := docInfo["hash"]; exists {
						if hashStr, ok := hash.(string); ok {
							document.Hash = hashStr
						}
					}
					if cid, exists := docInfo["ipfsCid"]; exists {
						if cidStr, ok := cid.(string); ok {
							document.IPFSCID = cidStr
						}
					}
					if url, exists := docInfo["ipfsUrl"]; exists {
						if urlStr, ok := url.(string); ok {
							document.IPFSURL = urlStr
						}
					}
					if iv, exists := docInfo["iv"]; exists {
						if ivStr, ok := iv.(string); ok {
							document.IV = ivStr
						}
					}
					if key, exists := docInfo["key"]; exists {
						if keyStr, ok := key.(string); ok {
							document.Key = keyStr
						}
					}
					if encrypted, exists := docInfo["encrypted"]; exists {
						if encBool, ok := encrypted.(bool); ok {
							document.Encrypted = encBool
						}
					}
					if contentType, exists := docInfo["contentType"]; exists {
						if ctStr, ok := contentType.(string); ok {
							document.ContentType = ctStr
						}
					}
					if size, exists := docInfo["size"]; exists {
						if sizeFloat, ok := size.(float64); ok {
							document.Size = int64(sizeFloat)
						}
					}
					exportData.Documents[docType] = document

					// Store unencrypted version for approver access
					// This ensures approvers can view documents without manual decryption
					if document.IPFSCID != "" {
						// Process document synchronously to ensure it's available immediately
						log.Printf("Processing document %s for export %s", document.IPFSCID, exportID)

						// Try to fetch and decrypt the document for approver access
						if document.Encrypted && document.Key != "" && document.IV != "" {
							log.Printf("Document %s is encrypted, attempting to decrypt", document.IPFSCID)
							unencryptedBytes, err := fetchAndDecryptDocument(document.IPFSCID, document.Key, document.IV)
							if err == nil {
								// Store the unencrypted version for approver access
								documentMutex.Lock()
								unencryptedStorage[document.IPFSCID] = unencryptedBytes
								documentMetadata[document.IPFSCID] = map[string]interface{}{
									"fileName":     fmt.Sprintf("%s-%s.pdf", exportID, docType),
									"fileSize":     len(unencryptedBytes),
									"contentType":  "application/pdf",
									"uploadTime":   time.Now(),
									"exportId":     exportID,
									"documentType": docType,
									"encrypted":    false,
								}
								documentMutex.Unlock()
								log.Printf("Stored unencrypted version of document %s for approver access (size: %d)", document.IPFSCID, len(unencryptedBytes))
							} else {
								log.Printf("Warning: Could not fetch/decrypt document %s for approver access: %v", document.IPFSCID, err)

								// Even if decryption fails, try to fetch the encrypted version for fallback
								documentBytes, fetchErr := fetchDocumentFromIPFS(document.IPFSCID)
								if fetchErr == nil {
									documentMutex.Lock()
									unencryptedStorage[document.IPFSCID] = documentBytes
									documentMetadata[document.IPFSCID] = map[string]interface{}{
										"fileName":     fmt.Sprintf("%s-%s.pdf", exportID, docType),
										"fileSize":     len(documentBytes),
										"contentType":  document.ContentType,
										"uploadTime":   time.Now(),
										"exportId":     exportID,
										"documentType": docType,
										"encrypted":    true, // Mark as encrypted
									}
									documentMutex.Unlock()
									log.Printf("Stored encrypted version of document %s for approver access (decryption failed) (size: %d)", document.IPFSCID, len(documentBytes))
								} else {
									log.Printf("Warning: Could not fetch document %s for approver access: %v", document.IPFSCID, fetchErr)
								}
							}
						} else {
							// For non-encrypted documents, try to fetch and store directly
							// This ensures all documents are available for approvers
							log.Printf("Document %s is not encrypted, fetching directly", document.IPFSCID)
							documentBytes, err := fetchDocumentFromIPFS(document.IPFSCID)
							if err == nil {
								documentMutex.Lock()
								unencryptedStorage[document.IPFSCID] = documentBytes
								documentMetadata[document.IPFSCID] = map[string]interface{}{
									"fileName":     fmt.Sprintf("%s-%s.pdf", exportID, docType),
									"fileSize":     len(documentBytes),
									"contentType":  document.ContentType,
									"uploadTime":   time.Now(),
									"exportId":     exportID,
									"documentType": docType,
									"encrypted":    false,
								}
								documentMutex.Unlock()
								log.Printf("Stored document %s for approver access (size: %d)", document.IPFSCID, len(documentBytes))
							} else {
								log.Printf("Warning: Could not fetch document %s for approver access: %v", document.IPFSCID, err)
							}
						}
					}
				}
			}
		}
	}

	// Store the export data
	exportsMutex.Lock()
	submittedExports[exportID] = exportData
	exportsMutex.Unlock()

	fmt.Printf("Stored export %s with %d documents\n", exportID, len(exportData.Documents))

	// Return success response
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusAccepted)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":   "accepted",
		"exportId": exportID,
		"message":  fmt.Sprintf("Export submitted with %d documents", len(exportData.Documents)),
	})
}

// fetchAndDecryptDocument fetches a document from IPFS and decrypts it
func fetchAndDecryptDocument(cid, key, iv string) ([]byte, error) {
	log.Printf("Attempting to fetch and decrypt document %s", cid)

	// Try to fetch from local IPFS gateway
	ipfsURL := fmt.Sprintf("http://ipfs:8080/ipfs/%s", cid)
	log.Printf("Fetching document from IPFS URL: %s", ipfsURL)
	resp, err := http.Get(ipfsURL)

	if err != nil {
		// Fallback to public gateway
		log.Printf("Local IPFS fetch failed, trying public gateway for %s", cid)
		ipfsURL = fmt.Sprintf("https://ipfs.io/ipfs/%s", cid)
		resp, err = http.Get(ipfsURL)
	}

	if err != nil {
		return nil, fmt.Errorf("failed to fetch document from IPFS: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("failed to fetch document from IPFS: status %d", resp.StatusCode)
	}

	// Read the encrypted data
	log.Printf("Successfully fetched document %s from IPFS, reading data", cid)
	encryptedData, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read document data: %v", err)
	}

	log.Printf("Read %d bytes of encrypted data for document %s", len(encryptedData), cid)

	// Decrypt the data
	log.Printf("Attempting to decrypt document %s with key length %d and IV length %d", cid, len(key), len(iv))
	decryptedData, err := decryptDocument(encryptedData, key, iv)
	if err != nil {
		return nil, fmt.Errorf("failed to decrypt document: %v", err)
	}

	log.Printf("Successfully decrypted document %s, result size: %d bytes", cid, len(decryptedData))

	return decryptedData, nil
}

// fetchDocumentFromIPFS fetches a document from IPFS without decryption
func fetchDocumentFromIPFS(cid string) ([]byte, error) {
	// Try to fetch from local IPFS gateway
	ipfsURL := fmt.Sprintf("http://ipfs:8080/ipfs/%s", cid)
	resp, err := http.Get(ipfsURL)

	if err != nil {
		// Fallback to public gateway
		ipfsURL = fmt.Sprintf("https://ipfs.io/ipfs/%s", cid)
		resp, err = http.Get(ipfsURL)
	}

	if err != nil {
		return nil, fmt.Errorf("failed to fetch document from IPFS: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("failed to fetch document from IPFS: status %d", resp.StatusCode)
	}

	// Read the data
	data, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read document data: %v", err)
	}

	return data, nil
}

// pendingApprovalsHandler returns pending approvals for the organization
func pendingApprovalsHandler(w http.ResponseWriter, r *http.Request) {
	org := r.URL.Query().Get("org")
	docTypeForOrg := getDocTypeForOrg(org)

	// Get real submitted exports
	exportsMutex.RLock()
	var pendingApprovals []map[string]interface{}

	for exportID, exportData := range submittedExports {
		// Check if this export has documents for this organization
		for docType, docInfo := range exportData.Documents {
			if docType == docTypeForOrg {
				// Use IPFS CID as hash if hash is empty
				documentHash := docInfo.Hash
				if documentHash == "" {
					documentHash = docInfo.IPFSCID
				}

				// Create approval item for this document
				approval := map[string]interface{}{
					"id":           exportID + "_" + docType,
					"exportId":     exportID,
					"docType":      getDisplayDocType(docType), // Use display format
					"hash":         documentHash,               // Use CID as hash if hash is empty
					"ipfsCid":      docInfo.IPFSCID,
					"ipfsUrl":      docInfo.IPFSURL,
					"iv":           docInfo.IV,
					"key":          docInfo.Key, // Include encryption key for document viewing
					"exporterName": exportData.Exporter,
					"timestamp":    exportData.Timestamp.Format(time.RFC3339),
					"urgencyLevel": "HIGH", // Set based on business logic
					"contentType":  docInfo.ContentType,
					"size":         docInfo.Size,
					"encrypted":    docInfo.Encrypted,
				}
				pendingApprovals = append(pendingApprovals, approval)
			}
		}
	}
	exportsMutex.RUnlock()

	// Debug logging
	fmt.Printf("[%s] Found %d pending approvals for %s (document type: %s)\n", time.Now().Format("15:04:05"), len(pendingApprovals), org, docTypeForOrg)

	// If no real data, provide helpful message
	if len(pendingApprovals) == 0 {
		fmt.Printf("No pending approvals found for %s (document type: %s)\n", org, docTypeForOrg)
		fmt.Printf("Available exports: %d\n", len(submittedExports))

		// Show what exports we have for debugging
		for id, export := range submittedExports {
			fmt.Printf("Export %s has document types: ", id)
			for docType := range export.Documents {
				fmt.Printf("%s ", docType)
			}
			fmt.Println()
		}
	}

	response := map[string]interface{}{
		"pendingApprovals": pendingApprovals,
		"organization":     org,
		"documentType":     docTypeForOrg,
		"totalExports":     len(submittedExports),
		"debug": map[string]interface{}{
			"foundDocuments": len(pendingApprovals),
			"searchingFor":   docTypeForOrg,
		},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// listExportsHandler returns all submitted exports for debugging
func listExportsHandler(w http.ResponseWriter, r *http.Request) {
	exportsMutex.RLock()
	allExports := make(map[string]ExportData)
	for k, v := range submittedExports {
		allExports[k] = v
	}
	exportsMutex.RUnlock()

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"exports": allExports,
		"count":   len(allExports),
	})
}

// approveHandler processes document approval/rejection requests
func approveHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Parse the approval request
	var approvalReq ApprovalRequest
	if err := json.NewDecoder(r.Body).Decode(&approvalReq); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Validate required fields
	if approvalReq.DocumentHash == "" || approvalReq.ExportID == "" || approvalReq.Action == "" {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"success": false,
			"message": "Missing required fields: documentHash, exportId, and action are required",
		})
		return
	}

	// Validate action
	if approvalReq.Action != "APPROVED" && approvalReq.Action != "REJECTED" {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"success": false,
			"message": "Invalid action. Must be APPROVED or REJECTED",
		})
		return
	}

	// Check if the document exists in submitted exports
	exportsMutex.RLock()
	exportData, exportExists := submittedExports[approvalReq.ExportID]
	exportsMutex.RUnlock()

	if !exportExists {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"success": false,
			"message": "Export not found in registry",
		})
		return
	}

	// Find the document with matching hash
	documentFound := false
	for _, docInfo := range exportData.Documents {
		// Check both hash and IPFS CID (since we use CID as hash when hash is empty)
		if docInfo.Hash == approvalReq.DocumentHash || docInfo.IPFSCID == approvalReq.DocumentHash {
			documentFound = true
			break
		}
	}

	if !documentFound {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"success": false,
			"message": "Document not found in registry",
		})
		return
	}

	// Create completion record
	approvalID := fmt.Sprintf("%s_%s_%d", approvalReq.ExportID, approvalReq.DocumentHash, time.Now().UnixNano())
	completedApproval := CompletedApproval{
		ID:           approvalID,
		ExportID:     approvalReq.ExportID,
		DocumentHash: approvalReq.DocumentHash,
		Action:       approvalReq.Action,
		Comments:     approvalReq.Comments,
		ReviewedBy:   approvalReq.ReviewedBy,
		Timestamp:    time.Now(),
	}

	// Store the completed approval
	approvalsMutex.Lock()
	completedApprovals[approvalID] = completedApproval
	approvalsMutex.Unlock()

	fmt.Printf("Document %s %s by %s for export %s\n", approvalReq.DocumentHash, approvalReq.Action, approvalReq.ReviewedBy, approvalReq.ExportID)

	// Return success response
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success":    true,
		"message":    fmt.Sprintf("Document %s successfully", strings.ToLower(approvalReq.Action)),
		"approvalId": approvalID,
		"timestamp":  completedApproval.Timestamp.Format(time.RFC3339),
	})

	// TODO: In a real implementation, this would also:
	// 1. Call the blockchain to record the approval
	// 2. Emit events for other services
	// 3. Update the export status if all required approvals are complete
}

// completedApprovalsHandler returns mock completed approvals for development
func completedApprovalsHandler(w http.ResponseWriter, r *http.Request) {
	org := r.URL.Query().Get("org")

	// Mock data for development - replace with real blockchain queries
	completedApprovals := map[string]interface{}{
		"completedApprovals": []map[string]interface{}{
			{
				"id":           "3",
				"exportId":     "EXP-2024-003",
				"docType":      getDocTypeForOrg(org),
				"hash":         "completed123",
				"exporterName": "Test Exporter",
				"timestamp":    time.Now().Add(-2 * time.Hour).Format(time.RFC3339),
				"status":       "APPROVED",
				"reviewedBy":   org + " Officer",
				"reviewDate":   time.Now().Add(-1 * time.Hour).Format(time.RFC3339),
				"comments":     "Document approved after review",
			},
		},
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(completedApprovals)
}

func createSampleDataHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Create sample export requests
	sampleRequests := []map[string]interface{}{
		{
			"exportId":           "EXP-2024-001",
			"referenceNumber":    "REF-001-2024",
			"exporterName":       "Coffee Exporter Co.",
			"status":             "pending",
			"submissionDate":     time.Now().AddDate(0, 0, -5).Format(time.RFC3339),
			"lastUpdated":        time.Now().AddDate(0, 0, -1).Format(time.RFC3339),
			"currentApprover":    "National Bank",
			"progressPercent":    25,
			"documentCount":      4,
			"totalValue":         50000,
			"destinationCountry": "Germany",
		},
		{
			"exportId":           "EXP-2024-002",
			"referenceNumber":    "REF-002-2024",
			"exporterName":       "Coffee Exporter Co.",
			"status":             "approved",
			"submissionDate":     time.Now().AddDate(0, 0, -10).Format(time.RFC3339),
			"lastUpdated":        time.Now().AddDate(0, 0, -2).Format(time.RFC3339),
			"currentApprover":    "Completed",
			"progressPercent":    100,
			"documentCount":      4,
			"totalValue":         75000,
			"destinationCountry": "USA",
		},
		{
			"exportId":           "EXP-2024-003",
			"referenceNumber":    "REF-003-2024",
			"exporterName":       "Coffee Exporter Co.",
			"status":             "rejected",
			"submissionDate":     time.Now().AddDate(0, 0, -7).Format(time.RFC3339),
			"lastUpdated":        time.Now().AddDate(0, 0, -3).Format(time.RFC3339),
			"currentApprover":    "Coffee Authority",
			"progressPercent":    50,
			"documentCount":      4,
			"totalValue":         30000,
			"destinationCountry": "Japan",
		},
		{
			"exportId":           "EXP-2024-004",
			"referenceNumber":    "REF-004-2024",
			"exporterName":       "Coffee Exporter Co.",
			"status":             "pending",
			"submissionDate":     time.Now().AddDate(0, 0, -3).Format(time.RFC3339),
			"lastUpdated":        time.Now().Format(time.RFC3339),
			"currentApprover":    "Exporter Bank",
			"progressPercent":    75,
			"documentCount":      4,
			"totalValue":         60000,
			"destinationCountry": "Netherlands",
		},
	}

	// Store sample data in memory (in a real app, this would go to blockchain/database)
	sampleMutex.Lock()
	for _, req := range sampleRequests {
		exportId := req["exportId"].(string)
		sampleExports[exportId] = req
		fmt.Printf("Created sample export request: %s\n", exportId)
	}
	sampleMutex.Unlock()

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"message": "Sample data created successfully",
		"count":   len(sampleRequests),
	})
}

// healthHandler provides a health check endpoint
func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "healthy"})
}

// ipfsUploadProxyHandler proxies IPFS upload requests to avoid CORS issues
func ipfsUploadProxyHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Parse multipart form
	err := r.ParseMultipartForm(32 << 20) // 32MB max
	if err != nil {
		log.Printf("Failed to parse multipart form: %v", err)
		http.Error(w, "Failed to parse form", http.StatusBadRequest)
		return
	}

	// Get the uploaded file
	file, handler, err := r.FormFile("file")
	if err != nil {
		log.Printf("No file in form: %v", err)
		http.Error(w, "No file uploaded", http.StatusBadRequest)
		return
	}
	defer file.Close()

	// Read file content
	fileBytes, err := io.ReadAll(file)
	if err != nil {
		log.Printf("Failed to read file: %v", err)
		http.Error(w, "Failed to read file", http.StatusInternalServerError)
		return
	}

	log.Printf("Received file upload: %s (%d bytes)", handler.Filename, len(fileBytes))

	// Create a new multipart form for IPFS
	var requestBody bytes.Buffer
	writer := multipart.NewWriter(&requestBody)

	// Add the file to the form
	fileWriter, err := writer.CreateFormFile("file", handler.Filename)
	if err != nil {
		log.Printf("Failed to create form file: %v", err)
		http.Error(w, "Failed to prepare IPFS request", http.StatusInternalServerError)
		return
	}

	_, err = fileWriter.Write(fileBytes)
	if err != nil {
		log.Printf("Failed to write file to form: %v", err)
		http.Error(w, "Failed to prepare IPFS request", http.StatusInternalServerError)
		return
	}

	writer.Close()

	// Make request to local IPFS node
	ipfsURL := "http://ipfs:5001/api/v0/add?stream-channels=true&progress=false"
	log.Printf("Forwarding request to IPFS: %s", ipfsURL)

	req, err := http.NewRequest("POST", ipfsURL, &requestBody)
	if err != nil {
		log.Printf("Failed to create IPFS request: %v", err)
		http.Error(w, "Failed to create IPFS request", http.StatusInternalServerError)
		return
	}

	req.Header.Set("Content-Type", writer.FormDataContentType())

	// Make the request to IPFS
	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		log.Printf("IPFS request failed: %v", err)
		http.Error(w, "IPFS upload failed", http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	// Read IPFS response
	ipfsResponse, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Printf("Failed to read IPFS response: %v", err)
		http.Error(w, "Failed to read IPFS response", http.StatusInternalServerError)
		return
	}

	log.Printf("IPFS response status: %d", resp.StatusCode)
	log.Printf("IPFS response: %s", string(ipfsResponse))

	// Forward the IPFS response to the client
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(resp.StatusCode)
	w.Write(ipfsResponse)
}

func handleExporterSubmitNotify(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var notifyData map[string]interface{}
	err := json.NewDecoder(r.Body).Decode(&notifyData)
	if err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	exportId, ok := notifyData["exportId"].(string)
	if !ok || exportId == "" {
		http.Error(w, "Missing export ID", http.StatusBadRequest)
		return
	}

	// Create a new export entry with pending status
	exportsMutex.Lock()
	submittedExports[exportId] = ExportData{
		ExportID:  exportId,
		Status:    "pending",
		Exporter:  "Coffee Exporter Co.",
		Timestamp: time.Now(),
		Documents: make(map[string]DocumentInfo),
	}
	exportsMutex.Unlock()

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"message": "Export submission notification received",
	})
}

// ... (rest of the code remains the same)
func getDocTypeForOrg(org string) string {
	switch org {
	case "national-bank":
		return "license" // Frontend uses lowercase
	case "exporter-bank":
		return "invoice"
	case "quality-authority":
		return "qualityCert"
	case "customs":
		return "other" // Shipping documents stored as "other"
	default:
		return "license"
	}
}

// getDisplayDocType returns the display name for document types
func getDisplayDocType(docType string) string {
	switch docType {
	case "license":
		return "LICENSE"
	case "invoice":
		return "INVOICE"
	case "qualityCert":
		return "QUALITY"
	case "other":
		return "SHIPPING"
	default:
		return strings.ToUpper(docType)
	}
}

// Database document storage

// uploadDocumentToDbHandler handles document uploads to database storage
func uploadDocumentToDbHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Parse multipart form
	err := r.ParseMultipartForm(10 << 20) // 10MB max
	if err != nil {
		http.Error(w, "Failed to parse form", http.StatusBadRequest)
		return
	}

	// Get the uploaded file
	file, handler, err := r.FormFile("document")
	if err != nil {
		http.Error(w, "No file uploaded", http.StatusBadRequest)
		return
	}
	defer file.Close()

	// Read file content
	fileBytes := make([]byte, handler.Size)
	_, err = file.Read(fileBytes)
	if err != nil {
		http.Error(w, "Failed to read file", http.StatusInternalServerError)
		return
	}

	// Generate document ID (allow override with provided CID)
	overrideID := r.FormValue("overrideId")
	ipfsCid := r.FormValue("ipfsCid")
	documentID := fmt.Sprintf("doc_%d_%d", time.Now().UnixNano(), handler.Size)
	if overrideID != "" {
		documentID = overrideID
	} else if ipfsCid != "" {
		documentID = ipfsCid
	}

	// Check if this is an encrypted document by looking for encryption parameters
	iv := r.FormValue("iv")
	key := r.FormValue("key")
	encrypted := r.FormValue("encrypted") == "true"

	// Store document and metadata
	documentMutex.Lock()

	if encrypted && iv != "" && key != "" {
		// This is an encrypted document, store both encrypted and unencrypted versions
		// Store the encrypted version
		documentStorage[documentID] = fileBytes

		// Try to decrypt and store the unencrypted version for approver access
		unencryptedBytes, err := decryptDocument(fileBytes, key, iv)
		if err == nil {
			unencryptedStorage[documentID] = unencryptedBytes
			log.Printf("Stored both encrypted and unencrypted versions of document: %s", documentID)
		} else {
			log.Printf("Warning: Could not decrypt document %s for approver access: %v", documentID, err)
			// Still store the encrypted version
			documentStorage[documentID] = fileBytes
		}
	} else {
		// This is an unencrypted document, store it directly
		documentStorage[documentID] = fileBytes
		unencryptedStorage[documentID] = fileBytes // Also store in unencrypted storage
		log.Printf("Stored unencrypted document: %s", documentID)
	}

	// Store metadata
	documentMetadata[documentID] = map[string]interface{}{
		"fileName":     handler.Filename,
		"fileSize":     handler.Size,
		"contentType":  handler.Header.Get("Content-Type"),
		"uploadTime":   time.Now(),
		"exportId":     r.FormValue("exportId"),
		"documentType": r.FormValue("documentType"),
		"encrypted":    encrypted,
		"iv":           iv,
		"key":          key,
		"ipfsCid":      ipfsCid,
	}

	documentMutex.Unlock()

	log.Printf("Document uploaded successfully: %s (%s, %d bytes)", documentID, handler.Filename, handler.Size)

	// Return success response
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success":    true,
		"documentId": documentID,
		"checksum":   fmt.Sprintf("%x", len(fileBytes)), // Simple checksum
		"message":    "Document uploaded successfully",
	})
}

// viewDocumentHandler handles document viewing requests for IPFS documents
func viewDocumentHandler(w http.ResponseWriter, r *http.Request) {
	// Parse URL to get document hash and action
	// Expected formats:
	// /api/documents/{documentHash}?action=view
	// /api/documents/{documentHash}/{action}

	path := strings.TrimPrefix(r.URL.Path, "/api/documents/")
	pathParts := strings.Split(path, "/")

	if len(pathParts) == 0 || pathParts[0] == "" {
		http.Error(w, "Document hash is required", http.StatusBadRequest)
		return
	}

	documentHash := pathParts[0]

	// Get action from URL parameter or path
	action := r.URL.Query().Get("action")
	if action == "" && len(pathParts) > 1 {
		action = pathParts[1]
	}
	if action == "" {
		action = "view" // Default action
	}

	fmt.Printf("Document viewing request: hash=%s, action=%s\n", documentHash, action)

	// Get user role and organization for access control
	userRole := r.Header.Get("X-User-Role")
	organization := r.Header.Get("X-Organization")

	fmt.Printf("Access request from role=%s, org=%s\n", userRole, organization)

	// Method 1: Check unencrypted storage first (for approver access)
	documentMutex.RLock()
	unencryptedBytes, unencryptedExists := unencryptedStorage[documentHash]
	metadata, metaExists := documentMetadata[documentHash]
	documentMutex.RUnlock()

	if unencryptedExists && metaExists {
		// Serve from unencrypted storage for approver access
		contentType := "application/pdf"
		if ct, ok := metadata["contentType"].(string); ok && ct != "" {
			contentType = ct
		}

		w.Header().Set("Content-Type", contentType)
		w.Header().Set("Content-Length", fmt.Sprintf("%d", len(unencryptedBytes)))

		if action == "download" {
			fileName := "document.pdf"
			if fn, ok := metadata["fileName"].(string); ok {
				fileName = fn
			}
			w.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=\"%s\"", fileName))
		}

		w.Write(unencryptedBytes)
		fmt.Printf("Document %s served from unencrypted storage for approver access\n", documentHash)
		return
	}

	// Method 2: Try to find document in submitted exports
	exportsMutex.RLock()
	var foundDocument *DocumentInfo

	for _, exportData := range submittedExports {
		for _, docInfo := range exportData.Documents {
			// Check both hash and IPFS CID
			if docInfo.Hash == documentHash || docInfo.IPFSCID == documentHash {
				foundDocument = &docInfo
				break
			}
		}
		if foundDocument != nil {
			break
		}
	}
	exportsMutex.RUnlock()

	if foundDocument == nil {
		// Method 3: Check database storage (encrypted version)
		documentMutex.RLock()
		fileBytes, exists := documentStorage[documentHash]
		metadata, metaExists := documentMetadata[documentHash]
		documentMutex.RUnlock()

		if exists && metaExists {
			// Serve from database storage
			contentType := "application/pdf"
			if ct, ok := metadata["contentType"].(string); ok && ct != "" {
				contentType = ct
			}

			w.Header().Set("Content-Type", contentType)
			w.Header().Set("Content-Length", fmt.Sprintf("%d", len(fileBytes)))

			if action == "download" {
				fileName := "document.pdf"
				if fn, ok := metadata["fileName"].(string); ok {
					fileName = fn
				}
				w.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=\"%s\"", fileName))
			}

			w.Write(fileBytes)
			fmt.Printf("Document %s served from database storage\n", documentHash)
			return
		}

		// Document not found
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"success": false,
			"error":   "Document not found",
			"message": "The requested document could not be found in the system",
			"hash":    documentHash,
		})
		return
	}

	// Found document in exports - check if we have an unencrypted version for approvers
	documentMutex.RLock()
	unencryptedBytes, unencryptedExists = unencryptedStorage[foundDocument.IPFSCID]
	documentMutex.RUnlock()

	if unencryptedExists {
		// Serve unencrypted version for approver access
		contentType := "application/pdf"
		if foundDocument.ContentType != "" {
			contentType = foundDocument.ContentType
		}

		w.Header().Set("Content-Type", contentType)
		w.Header().Set("Content-Length", fmt.Sprintf("%d", len(unencryptedBytes)))

		if action == "download" {
			fileName := fmt.Sprintf("document-%s.pdf", foundDocument.IPFSCID[:8])
			w.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=\"%s\"", fileName))
		}

		w.Write(unencryptedBytes)
		fmt.Printf("Unencrypted document %s served for approver access\n", foundDocument.IPFSCID)
		return
	}

	// Method 4: Try IPFS access with decryption if available
	if foundDocument.Encrypted && foundDocument.Key != "" && foundDocument.IV != "" {
		fmt.Printf("Attempting decryption access for encrypted document\n")

		// For approvers, we should provide a way to access the document without manual decryption
		// Let's try to fetch and decrypt the document server-side for approver access
		if userRole == "APPROVER" || userRole == "BANK_SUPERVISOR" || userRole == "BANK" {
			fmt.Printf("Approver access detected, attempting server-side decryption\n")

			// Try to fetch from local IPFS gateway
			ipfsURL := fmt.Sprintf("http://ipfs:8080/ipfs/%s", foundDocument.IPFSCID)
			resp, err := http.Get(ipfsURL)

			if err != nil {
				// Fallback to public gateway
				ipfsURL = fmt.Sprintf("https://ipfs.io/ipfs/%s", foundDocument.IPFSCID)
				resp, err = http.Get(ipfsURL)
			}

			if err == nil && resp.StatusCode == http.StatusOK {
				// Read the encrypted data
				encryptedData, err := io.ReadAll(resp.Body)
				resp.Body.Close()

				if err == nil {
					// Try to decrypt server-side for approver access
					decryptedData, err := decryptDocument(encryptedData, foundDocument.Key, foundDocument.IV)
					if err == nil {
						// Successfully decrypted, serve to approver
						contentType := "application/pdf"
						if foundDocument.ContentType != "" {
							contentType = foundDocument.ContentType
						}

						w.Header().Set("Content-Type", contentType)
						w.Header().Set("Content-Length", fmt.Sprintf("%d", len(decryptedData)))

						if action == "download" {
							fileName := fmt.Sprintf("document-%s.pdf", foundDocument.IPFSCID[:8])
							w.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=\"%s\"", fileName))
						}

						w.Write(decryptedData)

						// Also store the decrypted version for future access
						documentMutex.Lock()
						unencryptedStorage[foundDocument.IPFSCID] = decryptedData
						documentMetadata[foundDocument.IPFSCID] = map[string]interface{}{
							"fileName":     fmt.Sprintf("document-%s.pdf", foundDocument.IPFSCID[:8]),
							"fileSize":     len(decryptedData),
							"contentType":  contentType,
							"uploadTime":   time.Now(),
							"exportId":     "", // We don't have export ID here
							"documentType": "", // We don't have document type here
							"encrypted":    false,
						}
						documentMutex.Unlock()

						fmt.Printf("Document %s decrypted and served to approver\n", foundDocument.IPFSCID)
						return
					} else {
						fmt.Printf("Server-side decryption failed: %v\n", err)
					}
				}
			}
		}

		// For non-approvers or if server-side decryption fails, return instructions for frontend decryption
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"success":   false,
			"encrypted": true,
			"message":   "Document is encrypted and requires frontend decryption",
			"ipfsCid":   foundDocument.IPFSCID,
			"key":       foundDocument.Key,
			"iv":        foundDocument.IV,
			"hint":      "Use frontend IPFS service with decryption keys",
		})
		return
	}

	// Method 5: Try multiple IPFS gateways (unencrypted)
	fmt.Printf("Attempting direct IPFS access via multiple gateways for unencrypted document\n")

	gateways := []string{
		"http://ipfs:8080/ipfs/%s",
		"http://localhost:8080/ipfs/%s",
		"https://ipfs.io/ipfs/%s",
		"https://cloudflare-ipfs.com/ipfs/%s",
		"https://gateway.pinata.cloud/ipfs/%s",
	}

	var resp *http.Response
	var err error
	var lastStatus int
	for _, tpl := range gateways {
		ipfsURL := fmt.Sprintf(tpl, foundDocument.IPFSCID)
		resp, err = http.Get(ipfsURL)
		if err == nil && resp != nil && resp.StatusCode == http.StatusOK {
			defer resp.Body.Close()
			// Successfully retrieved from IPFS
			contentType := "application/pdf"
			if foundDocument.ContentType != "" {
				contentType = foundDocument.ContentType
			}

			w.Header().Set("Content-Type", contentType)
			if contentLength := resp.Header.Get("Content-Length"); contentLength != "" {
				w.Header().Set("Content-Length", contentLength)
			}

			if action == "download" {
				fileName := fmt.Sprintf("document-%s.pdf", foundDocument.IPFSCID[:8])
				w.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=\"%s\"", fileName))
			}

			w.WriteHeader(http.StatusOK)
			_, copyErr := io.Copy(w, resp.Body)
			if copyErr != nil {
				fmt.Printf("Error copying response: %v\n", copyErr)
			}
			fmt.Printf("Document %s served from IPFS successfully via %s\n", documentHash, tpl)
			return
		}
		if resp != nil {
			lastStatus = resp.StatusCode
			resp.Body.Close()
		}
	}

	// If we reach here, all gateways failed
	w.Header().Set("Content-Type", "application/json")
	if lastStatus == http.StatusNotFound {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"success": false,
			"error":   "Document not found in IPFS",
			"message": "Document exists in registry but not accessible via IPFS",
			"ipfsCid": foundDocument.IPFSCID,
		})
		return
	}
	w.WriteHeader(http.StatusServiceUnavailable)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": false,
		"error":   "IPFS access failed",
		"message": "Unable to retrieve document from IPFS via any gateway",
		"ipfsCid": foundDocument.IPFSCID,
	})
	return
}

// decryptDocument decrypts AES-256-CBC encrypted data
func decryptDocument(encryptedData []byte, keyHex, ivHex string) ([]byte, error) {
	log.Printf("Starting decryption process with key length %d and IV length %d", len(keyHex), len(ivHex))
	log.Printf("Encrypted data length: %d bytes", len(encryptedData))

	// Convert hex key and IV to bytes
	keyBytes, err := hex.DecodeString(keyHex)
	if err != nil {
		return nil, fmt.Errorf("invalid key format: %v", err)
	}
	log.Printf("Key bytes length: %d", len(keyBytes))

	ivBytes, err := hex.DecodeString(ivHex)
	if err != nil {
		return nil, fmt.Errorf("invalid IV format: %v", err)
	}
	log.Printf("IV bytes length: %d", len(ivBytes))

	// Validate key and IV lengths
	if len(keyBytes) != 32 {
		return nil, fmt.Errorf("invalid key length: expected 32 bytes, got %d", len(keyBytes))
	}

	if len(ivBytes) != 16 {
		return nil, fmt.Errorf("invalid IV length: expected 16 bytes, got %d", len(ivBytes))
	}

	// Create AES cipher
	block, err := aes.NewCipher(keyBytes)
	if err != nil {
		return nil, fmt.Errorf("failed to create cipher: %v", err)
	}

	// Check if data length is valid for CBC mode
	if len(encryptedData)%aes.BlockSize != 0 {
		return nil, fmt.Errorf("invalid data length for CBC mode: %d bytes", len(encryptedData))
	}

	// Decrypt
	log.Printf("Creating CBC decrypter and decrypting data")
	mode := cipher.NewCBCDecrypter(block, ivBytes)
	decrypted := make([]byte, len(encryptedData))
	mode.CryptBlocks(decrypted, encryptedData)
	log.Printf("Decryption completed, result length: %d bytes", len(decrypted))

	// Remove PKCS7 padding
	log.Printf("Removing PKCS7 padding")
	decrypted, err = pkcs7Unpad(decrypted)
	if err != nil {
		log.Printf("Failed to remove padding: %v", err)
		// Try to analyze the decrypted data to see what went wrong
		if len(decrypted) > 0 {
			// Check first few bytes to see if it looks like a PDF
			if len(decrypted) >= 4 {
				pdfHeader := []byte{0x25, 0x50, 0x44, 0x46} // %PDF
				headerMatch := true
				for i := 0; i < 4; i++ {
					if decrypted[i] != pdfHeader[i] {
						headerMatch = false
						break
					}
				}
				if headerMatch {
					log.Printf("Decrypted data appears to start with PDF header, but padding removal failed")
					// Try manual padding removal
					if len(decrypted) > 0 {
						paddingByte := decrypted[len(decrypted)-1]
						if int(paddingByte) <= 16 && int(paddingByte) > 0 {
							log.Printf("Attempting manual padding removal with padding byte %d", paddingByte)
							manualResult := decrypted[:len(decrypted)-int(paddingByte)]
							log.Printf("Manual padding removal result length: %d bytes", len(manualResult))
							// Check if this looks like a valid PDF
							if len(manualResult) >= 4 {
								headerMatch = true
								for i := 0; i < 4; i++ {
									if manualResult[i] != pdfHeader[i] {
										headerMatch = false
										break
									}
								}
								if headerMatch {
									log.Printf("Manual padding removal successful, returning result")
									return manualResult, nil
								}
							}
						}
					}
				} else {
					log.Printf("Decrypted data does not start with PDF header")
				}
			}
		}
		return nil, fmt.Errorf("failed to remove padding: %v", err)
	}

	log.Printf("Successfully removed padding, final result length: %d bytes", len(decrypted))

	return decrypted, nil
}

// pkcs7Unpad removes PKCS7 padding
func pkcs7Unpad(data []byte) ([]byte, error) {
	if len(data) == 0 {
		return nil, fmt.Errorf("data is empty")
	}

	padding := int(data[len(data)-1])
	log.Printf("PKCS7 unpad: data length %d, padding byte value %d", len(data), padding)

	if padding > len(data) {
		return nil, fmt.Errorf("invalid padding: padding value %d is greater than data length %d", padding, len(data))
	}

	if padding > aes.BlockSize {
		return nil, fmt.Errorf("invalid padding: padding value %d is greater than block size %d", padding, aes.BlockSize)
	}

	// Check if all padding bytes are correct
	for i := len(data) - padding; i < len(data); i++ {
		if data[i] != byte(padding) {
			return nil, fmt.Errorf("invalid padding: byte at position %d is %d, expected %d", i, data[i], padding)
		}
	}

	result := data[:len(data)-padding]
	log.Printf("PKCS7 unpad successful, result length %d", len(result))
	return result, nil
}

// getOrganizationPendingApprovalsHandler returns pending approvals for a specific organization channel
func getOrganizationPendingApprovalsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	org := r.URL.Query().Get("org")
	if org == "" {
		http.Error(w, "Organization parameter required", http.StatusBadRequest)
		return
	}

	// Transform organization format
	orgType := getOrgTypeFromString(org)
	if orgType == "" {
		http.Error(w, "Invalid organization", http.StatusBadRequest)
		return
	}

	// Get user role for access control
	userRole := r.Header.Get("X-User-Role")
	isSupervisor := userRole == "BANK_SUPERVISOR" || userRole == "BANK"

	// Get pending approvals from storage
	exportsMutex.RLock()
	var pendingApprovals []ApprovalStageInfo

	for exportID, exportData := range submittedExports {
		for docType, docInfo := range exportData.Documents {
			// Check document visibility based on role and organization
			canSeeDocument := false

			if isSupervisor {
				// Bank supervisors can see all documents
				canSeeDocument = true
			} else {
				// Regular approvers only see documents assigned to their organization
				canSeeDocument = shouldOrganizationHandleDocument(orgType, docType)
			}

			if canSeeDocument {
				// Check if this document has already been approved
				alreadyApproved := false

				approvalsMutex.RLock()
				for _, approval := range completedApprovals {
					if approval.ExportID == exportID &&
						(approval.DocumentHash == docInfo.Hash || approval.DocumentHash == docInfo.IPFSCID) &&
						approval.Action == "APPROVE" {
						alreadyApproved = true
						break
					}
				}
				approvalsMutex.RUnlock()

				// Only include pending (not yet approved) documents
				if !alreadyApproved {
					// Create approval stage info
					approval := ApprovalStageInfo{
						ID:           fmt.Sprintf("stage_%s_%s", exportID, docType),
						ExportID:     exportID,
						DocumentType: getDocumentDisplayName(docType),
						Organization: getOrganizationForDocType(docType),
						Status:       "PENDING",
						AssignedTo:   getOrganizationForDocType(docType) + "MSP",
						DocumentHash: getDocumentHash(docInfo),
						ExporterName: exportData.Exporter,
						UrgencyLevel: "HIGH",
						CreatedAt:    exportData.Timestamp,
						UpdatedAt:    exportData.Timestamp,
						StageOrder:   getStageOrder(docType),
					}
					pendingApprovals = append(pendingApprovals, approval)
				}
			}
		}
	}
	exportsMutex.RUnlock()

	// Sort by creation date (newest first)
	for i := 0; i < len(pendingApprovals)-1; i++ {
		for j := i + 1; j < len(pendingApprovals); j++ {
			if pendingApprovals[i].CreatedAt.Before(pendingApprovals[j].CreatedAt) {
				pendingApprovals[i], pendingApprovals[j] = pendingApprovals[j], pendingApprovals[i]
			}
		}
	}

	// Log for debugging
	fmt.Printf("[%s] Organization: %s (%s) - Found %d pending approvals (Role: %s)\n",
		time.Now().Format("15:04:05"), org, orgType, len(pendingApprovals), userRole)

	// Return organization-specific pending approvals
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"organization":     org,
		"organizationType": orgType,
		"pendingApprovals": pendingApprovals,
		"count":            len(pendingApprovals),
	})
}

func getApprovalChannelsSummaryHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Initialize counters per organization
	type counts struct{ Pending, Approved, Rejected int }
	summary := map[string]counts{
		"national-bank":     {0, 0, 0},
		"exporter-bank":     {0, 0, 0},
		"quality-authority": {0, 0, 0},
		"customs":           {0, 0, 0},
	}

	// Build a quick lookup of approvals by export and organization
	approvalsMutex.RLock()
	approvalsByExportOrg := make(map[string]map[string][]CompletedApproval) // exportID -> orgType -> []approvals
	for _, a := range completedApprovals {
		if approvalsByExportOrg[a.ExportID] == nil {
			approvalsByExportOrg[a.ExportID] = make(map[string][]CompletedApproval)
		}
		approvalsByExportOrg[a.ExportID][a.Organization] = append(approvalsByExportOrg[a.ExportID][a.Organization], a)
	}
	approvalsMutex.RUnlock()

	// Helper to map docType to org slug and org type
	mapDocType := func(docType string) (orgSlug, orgType string) {
		switch docType {
		case "license":
			return "national-bank", "NATIONAL_BANK"
		case "invoice":
			return "exporter-bank", "EXPORTER_BANK"
		case "qualityCert":
			return "quality-authority", "COFFEE_AUTHORITY"
		case "other":
			return "customs", "CUSTOMS"
		default:
			return "", ""
		}
	}

	// Count approved/rejected by scanning approvals
	approvalsMutex.RLock()
	for _, a := range completedApprovals {
		// Map org type to slug
		var orgSlug string
		switch a.Organization {
		case "NATIONAL_BANK":
			orgSlug = "national-bank"
		case "EXPORTER_BANK":
			orgSlug = "exporter-bank"
		case "COFFEE_AUTHORITY":
			orgSlug = "quality-authority"
		case "CUSTOMS":
			orgSlug = "customs"
		default:
			orgSlug = ""
		}
		if orgSlug == "" {
			continue
		}
		c := summary[orgSlug]
		if a.Action == "APPROVE" || a.Action == "APPROVED" {
			c.Approved++
		} else if a.Action == "REJECT" || a.Action == "REJECTED" {
			c.Rejected++
		}
		summary[orgSlug] = c
	}
	approvalsMutex.RUnlock()

	// Count pending as documents without a decision for their responsible org
	exportsMutex.RLock()
	for exportID, exportData := range submittedExports {
		for docType, docInfo := range exportData.Documents {
			orgSlug, orgType := mapDocType(docType)
			if orgSlug == "" {
				continue
			}
			// Check if there's an approval for this doc by this org
			decided := false
			approvalsMutex.RLock()
			for _, appr := range approvalsByExportOrg[exportID][orgType] {
				// Match by document hash or CID
				if appr.DocumentHash == getDocumentHash(docInfo) {
					if appr.Action == "APPROVE" || appr.Action == "APPROVED" || appr.Action == "REJECT" || appr.Action == "REJECTED" {
						decided = true
						break
					}
				}
			}
			approvalsMutex.RUnlock()
			if !decided {
				c := summary[orgSlug]
				c.Pending++
				summary[orgSlug] = c
			}
		}
	}
	exportsMutex.RUnlock()

	// Totals
	totals := counts{}
	for _, c := range summary {
		totals.Pending += c.Pending
		totals.Approved += c.Approved
		totals.Rejected += c.Rejected
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"summary":     summary,
		"totals":      totals,
		"generatedAt": time.Now().Format(time.RFC3339),
	})
}

// submitApprovalDecisionHandler processes approval decisions through the multi-channel system
func submitApprovalDecisionHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var decision ApprovalRequest
	if err := json.NewDecoder(r.Body).Decode(&decision); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Get organization from query parameter
	org := r.URL.Query().Get("org")
	if org == "" {
		http.Error(w, "Organization parameter required", http.StatusBadRequest)
		return
	}

	orgType := getOrgTypeFromString(org)
	if orgType == "" {
		http.Error(w, "Invalid organization", http.StatusBadRequest)
		return
	}

	// Validate payload fields
	if strings.TrimSpace(decision.ExportID) == "" {
		http.Error(w, "Missing exportId", http.StatusBadRequest)
		return
	}
	if strings.TrimSpace(decision.DocumentHash) == "" {
		http.Error(w, "Missing documentHash", http.StatusBadRequest)
		return
	}
	if decision.Action == "" {
		http.Error(w, "Missing action (APPROVE or REJECT)", http.StatusBadRequest)
		return
	}

	// Normalize action
	action := strings.ToUpper(decision.Action)
	if action != "APPROVE" && action != "REJECT" && action != "APPROVED" && action != "REJECTED" {
		http.Error(w, "Invalid action. Use APPROVE or REJECT", http.StatusBadRequest)
		return
	}
	if action == "APPROVED" {
		action = "APPROVE"
	}
	if action == "REJECTED" {
		action = "REJECT"
	}

	// Server-side log for diagnosis
	fmt.Printf("[submit-decision] org=%s (%s) exportId=%s docHash=%s action=%s reviewedBy=%s\n",
		org, orgType, decision.ExportID, decision.DocumentHash, action, decision.ReviewedBy)

	// Process the decision
	approvalsMutex.Lock()
	approvalKey := fmt.Sprintf("%s_%s_%s", decision.ExportID, decision.DocumentHash, orgType)
	completedApproval := CompletedApproval{
		ID:           approvalKey,
		ExportID:     decision.ExportID,
		DocumentHash: decision.DocumentHash,
		Action:       action,
		Comments:     decision.Comments,
		ReviewedBy:   decision.ReviewedBy,
		Organization: orgType,
		Timestamp:    time.Now(),
	}
	completedApprovals[approvalKey] = completedApproval
	approvalsMutex.Unlock()

	// Return success response
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":  "success",
		"message": "Approval decision processed",
		"id":      approvalKey,
	})
}

// getBankSupervisorExportsHandler returns all exports for bank supervisor oversight
func getBankSupervisorExportsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Check if requester is authorized (simplified - in production, verify JWT/auth)
	userRole := r.Header.Get("X-User-Role")
	if userRole != "BANK_SUPERVISOR" && userRole != "BANK" {
		http.Error(w, "Unauthorized: Bank supervisor access required", http.StatusForbidden)
		return
	}

	exportsMutex.RLock()
	var supervisorViews []BankSupervisorViewData

	for exportID, exportData := range submittedExports {
		// Calculate approval progress
		totalStages := len(exportData.Documents)
		completedStages := 0

		// Count completed approvals
		approvalsMutex.RLock()
		for _, approval := range completedApprovals {
			if approval.ExportID == exportID && approval.Action == "APPROVE" {
				completedStages++
			}
		}
		approvalsMutex.RUnlock()

		// Create supervisor view
		view := BankSupervisorViewData{
			ExportID:        exportID,
			ExporterName:    exportData.Exporter,
			TotalStages:     totalStages,
			CompletedStages: completedStages,
			OverallStatus:   getOverallStatus(completedStages, totalStages),
			Documents:       convertToDocumentInfoList(exportData.Documents),
			LastActivity:    exportData.Timestamp,
		}

		supervisorViews = append(supervisorViews, view)
	}
	exportsMutex.RUnlock()

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"exports": supervisorViews,
		"count":   len(supervisorViews),
	})
}

// getBankSupervisorViewHandler returns detailed view for a specific export
func getBankSupervisorViewHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Extract export ID from URL path
	path := strings.TrimPrefix(r.URL.Path, "/api/supervisor/export/")
	exportID := strings.Split(path, "/")[0]
	if exportID == "" {
		http.Error(w, "Export ID required", http.StatusBadRequest)
		return
	}

	// Check authorization
	userRole := r.Header.Get("X-User-Role")
	if userRole != "BANK_SUPERVISOR" && userRole != "BANK" {
		http.Error(w, "Unauthorized: Bank supervisor access required", http.StatusForbidden)
		return
	}

	exportsMutex.RLock()
	exportData, exists := submittedExports[exportID]
	exportsMutex.RUnlock()

	if !exists {
		http.Error(w, "Export not found", http.StatusNotFound)
		return
	}

	// Build detailed supervisor view with timeline
	timeline := buildApprovalTimeline(exportID)
	totalStages := len(exportData.Documents)
	completedStages := countCompletedApprovals(exportID)

	view := BankSupervisorViewData{
		ExportID:        exportID,
		ExporterName:    exportData.Exporter,
		TotalStages:     totalStages,
		CompletedStages: completedStages,
		OverallStatus:   getOverallStatus(completedStages, totalStages),
		Documents:       convertToDocumentInfoList(exportData.Documents),
		LastActivity:    getLastActivityTime(timeline),
		Timeline:        timeline,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(view)
}

// getApprovalChainHandler returns the approval chain for an export
func getApprovalChainHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	path := strings.TrimPrefix(r.URL.Path, "/api/approval-chain/")
	exportID := strings.Split(path, "/")[0]
	if exportID == "" {
		http.Error(w, "Export ID required", http.StatusBadRequest)
		return
	}

	exportsMutex.RLock()
	exportData, exists := submittedExports[exportID]
	exportsMutex.RUnlock()

	if !exists {
		http.Error(w, "Export not found", http.StatusNotFound)
		return
	}

	// Build approval chain
	var stages []ApprovalStageInfo
	stageOrder := 1
	for docType, docInfo := range exportData.Documents {
		org := getOrganizationForDocType(docType)
		stage := ApprovalStageInfo{
			ID:           fmt.Sprintf("stage_%s_%s_%d", exportID, docType, stageOrder),
			ExportID:     exportID,
			DocumentType: docType,
			Organization: org,
			StageOrder:   stageOrder,
			Status:       getStageStatus(exportID, docType),
			AssignedTo:   org + "MSP",
			DocumentHash: docInfo.Hash,
			ExporterName: exportData.Exporter,
			CreatedAt:    exportData.Timestamp,
			UpdatedAt:    exportData.Timestamp,
		}
		stages = append(stages, stage)
		stageOrder++
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"exportId":      exportID,
		"stages":        stages,
		"currentStage":  0,
		"overallStatus": getOverallStatus(countCompletedApprovals(exportID), len(stages)),
	})
}

// Helper functions for multi-channel approval system
func getOrgTypeFromString(org string) string {
	switch org {
	case "national-bank":
		return "NATIONAL_BANK"
	case "exporter-bank":
		return "EXPORTER_BANK"
	case "coffee-authority":
		return "COFFEE_AUTHORITY"
	case "customs":
		return "CUSTOMS"
	default:
		return ""
	}
}

// Helper functions for document and approval management

// getDocumentHash returns the appropriate hash for a document (prefer hash, fallback to IPFS CID)
func getDocumentHash(docInfo DocumentInfo) string {
	if docInfo.Hash != "" {
		return docInfo.Hash
	}
	return docInfo.IPFSCID
}

// getStageOrder returns the order of approval stages based on document type
func getStageOrder(docType string) int {
	switch docType {
	case "license":
		return 1
	case "invoice":
		return 2
	case "qualityCert":
		return 3
	case "other":
		return 4
	default:
		return 99
	}
}

// isDocumentVisibleToUser checks if a user can see a specific document based on role and organization
func isDocumentVisibleToUser(userRole, userOrg, docType string) bool {
	// Bank supervisors can see all documents
	if userRole == "BANK_SUPERVISOR" || userRole == "BANK" {
		return true
	}

	// Regular approvers can only see documents assigned to their organization
	return shouldOrganizationHandleDocument(userOrg, docType)
}

// isDocumentAlreadyApproved checks if a document has been approved by the responsible organization
func isDocumentAlreadyApproved(exportID string, docInfo DocumentInfo, orgType string) bool {
	approvalsMutex.RLock()
	defer approvalsMutex.RUnlock()

	documentHash := getDocumentHash(docInfo)
	for _, approval := range completedApprovals {
		if approval.ExportID == exportID &&
			approval.DocumentHash == documentHash &&
			approval.Action == "APPROVE" {
			return true
		}
	}
	return false
}

func shouldOrganizationHandleDocument(orgType, docType string) bool {
	switch orgType {
	case "NATIONAL_BANK":
		return docType == "license"
	case "EXPORTER_BANK":
		return docType == "invoice"
	case "COFFEE_AUTHORITY":
		return docType == "qualityCert"
	case "CUSTOMS":
		return docType == "other"
	default:
		return false
	}
}

// getOrganizationForDocType returns the organization responsible for a specific document type
func getOrganizationForDocType(docType string) string {
	switch docType {
	case "license":
		return "NATIONAL_BANK"
	case "invoice":
		return "EXPORTER_BANK"
	case "qualityCert":
		return "COFFEE_AUTHORITY"
	case "other":
		return "CUSTOMS"
	default:
		return "NATIONAL_BANK" // Default fallback
	}
}

// getDocumentDisplayName returns user-friendly document type names
func getDocumentDisplayName(docType string) string {
	switch docType {
	case "license":
		return "Export License"
	case "invoice":
		return "Commercial Invoice"
	case "qualityCert":
		return "Quality Certificate"
	case "other":
		return "Shipping Documents"
	default:
		return docType
	}
}

func getOverallStatus(completed, total int) string {
	if completed == 0 {
		return "PENDING"
	} else if completed == total {
		return "APPROVED"
	} else {
		return "IN_PROGRESS"
	}
}

func convertToDocumentInfoList(docs map[string]DocumentInfo) []DocumentInfo {
	var result []DocumentInfo
	for _, doc := range docs {
		result = append(result, doc)
	}
	return result
}

func buildApprovalTimeline(exportID string) []ApprovalActivity {
	var timeline []ApprovalActivity

	approvalsMutex.RLock()
	for _, approval := range completedApprovals {
		if approval.ExportID == exportID {
			activity := ApprovalActivity{
				Type:       approval.Action,
				ReviewedBy: approval.ReviewedBy,
				Comments:   approval.Comments,
				Timestamp:  approval.Timestamp,
			}
			timeline = append(timeline, activity)
		}
	}
	approvalsMutex.RUnlock()

	return timeline
}

func countCompletedApprovals(exportID string) int {
	count := 0
	approvalsMutex.RLock()
	for _, approval := range completedApprovals {
		if approval.ExportID == exportID && approval.Action == "APPROVE" {
			count++
		}
	}
	approvalsMutex.RUnlock()
	return count
}

func getLastActivityTime(timeline []ApprovalActivity) time.Time {
	if len(timeline) == 0 {
		return time.Now()
	}

	latest := timeline[0].Timestamp
	for _, activity := range timeline {
		if activity.Timestamp.After(latest) {
			latest = activity.Timestamp
		}
	}
	return latest
}

func getStageStatus(exportID, docType string) string {
	approvalsMutex.RLock()
	defer approvalsMutex.RUnlock()

	for _, approval := range completedApprovals {
		if approval.ExportID == exportID {
			// Simple check - in production, match by document hash and organization
			if approval.Action == "APPROVE" {
				return "APPROVED"
			} else if approval.Action == "REJECT" {
				return "REJECTED"
			}
		}
	}
	return "PENDING"
}

// ExporterDashboardData represents the exporter dashboard overview
type ExporterDashboardData struct {
	TotalRequests   int                     `json:"totalRequests"`
	PendingApproval int                     `json:"pendingApproval"`
	Approved        int                     `json:"approved"`
	Rejected        int                     `json:"rejected"`
	RecentRequests  []ExporterRequestInfo   `json:"recentRequests"`
	Notifications   []DashboardNotification `json:"notifications"`
}

// ExporterRequestInfo represents a request in the exporter's view
type ExporterRequestInfo struct {
	ExportID           string    `json:"exportId"`
	ReferenceNumber    string    `json:"referenceNumber"`
	SubmissionDate     time.Time `json:"submissionDate"`
	Status             string    `json:"status"`          // DRAFT, PENDING, APPROVED, REJECTED
	CurrentApprover    string    `json:"currentApprover"` // Who is currently reviewing
	LastUpdated        time.Time `json:"lastUpdated"`
	DocumentCount      int       `json:"documentCount"`
	ProgressPercent    int       `json:"progressPercent"`
	ExporterName       string    `json:"exporterName"`
	UrgencyLevel       string    `json:"urgencyLevel"`
	DestinationCountry string    `json:"destinationCountry"`
	TotalValue         float64   `json:"totalValue"`
}

// ExporterRequestDetail represents detailed view of a request
type ExporterRequestDetail struct {
	ExportID           string               `json:"exportId"`
	ReferenceNumber    string               `json:"referenceNumber"`
	SubmissionDate     time.Time            `json:"submissionDate"`
	Status             string               `json:"status"`
	Documents          []DocumentStatusInfo `json:"documents"`
	AuditTrail         []AuditTrailEntry    `json:"auditTrail"`
	CurrentApprover    string               `json:"currentApprover"`
	CanResubmit        bool                 `json:"canResubmit"`
	ProgressPercent    int                  `json:"progressPercent"`
	ExporterName       string               `json:"exporterName"`
	TotalValue         float64              `json:"totalValue"`
	DestinationCountry string               `json:"destinationCountry"`
}

// DocumentStatusInfo represents document status in exporter view
type DocumentStatusInfo struct {
	Type           string     `json:"type"`
	DisplayName    string     `json:"displayName"`
	Status         string     `json:"status"` // PENDING, APPROVED, REJECTED
	ApproverOrg    string     `json:"approverOrg"`
	LastReviewDate *time.Time `json:"lastReviewDate"`
	Comments       string     `json:"comments"`
	Hash           string     `json:"hash"`
	IPFSCID        string     `json:"ipfsCid"`
	Size           int64      `json:"size"`
}

// AuditTrailEntry represents an entry in the audit trail
type AuditTrailEntry struct {
	Timestamp    time.Time `json:"timestamp"`
	Action       string    `json:"action"`       // SUBMITTED, FORWARDED, APPROVED, REJECTED
	Actor        string    `json:"actor"`        // Who performed the action
	Organization string    `json:"organization"` // Which organization
	DocumentType string    `json:"documentType"`
	Comments     string    `json:"comments"`
	Description  string    `json:"description"` // Human-readable description
}

// DashboardNotification represents a notification for the exporter
type DashboardNotification struct {
	ID        string    `json:"id"`
	Type      string    `json:"type"` // APPROVAL, REJECTION, UPDATE
	ExportID  string    `json:"exportId"`
	Title     string    `json:"title"`
	Message   string    `json:"message"`
	Timestamp time.Time `json:"timestamp"`
	IsRead    bool      `json:"isRead"`
	Priority  string    `json:"priority"` // HIGH, MEDIUM, LOW
}

// getExporterDashboardHandler returns dashboard overview for exporters
func getExporterDashboardHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// In production, get exporter ID from authentication
	exporterFilter := r.URL.Query().Get("exporter")
	if exporterFilter == "" {
		exporterFilter = "Coffee Exporter Co." // Default for demo
	}

	exportsMutex.RLock()
	defer exportsMutex.RUnlock()

	// Calculate dashboard metrics from both sample data and real submitted exports
	var totalRequests, pendingApproval, approved, rejected int
	var recentRequests []ExporterRequestInfo

	// 1) Sample data (dev/testing)
	sampleMutex.RLock()
	for exportID, exportData := range sampleExports {
		exporterName, ok := exportData["exporterName"].(string)
		if !ok {
			continue
		}
		if exporterFilter != "" && !strings.EqualFold(exporterFilter, "all") && !strings.EqualFold(exporterName, exporterFilter) {
			continue
		}

		totalRequests++
		status, _ := exportData["status"].(string)
		switch strings.ToUpper(status) {
		case "PENDING":
			pendingApproval++
		case "APPROVED":
			approved++
		case "REJECTED":
			rejected++
		}

		submissionDateStr, _ := exportData["submissionDate"].(string)
		lastUpdatedStr, _ := exportData["lastUpdated"].(string)
		submissionDate := time.Now()
		if t, err := time.Parse(time.RFC3339, submissionDateStr); err == nil {
			submissionDate = t
		}
		lastUpdated := time.Now()
		if t, err := time.Parse(time.RFC3339, lastUpdatedStr); err == nil {
			lastUpdated = t
		}
		currentApprover, _ := exportData["currentApprover"].(string)
		referenceNumber, _ := exportData["referenceNumber"].(string)
		documentCount, _ := exportData["documentCount"].(int)
		progressPercent, _ := exportData["progressPercent"].(int)
		totalValue, _ := exportData["totalValue"].(int)
		destinationCountry, _ := exportData["destinationCountry"].(string)

		recentRequests = append(recentRequests, ExporterRequestInfo{
			ExportID:           exportID,
			ReferenceNumber:    referenceNumber,
			SubmissionDate:     submissionDate,
			Status:             strings.ToUpper(status),
			CurrentApprover:    currentApprover,
			LastUpdated:        lastUpdated,
			DocumentCount:      documentCount,
			ProgressPercent:    progressPercent,
			ExporterName:       exporterName,
			UrgencyLevel:       "HIGH",
			DestinationCountry: destinationCountry,
			TotalValue:         float64(totalValue),
		})
	}
	sampleMutex.RUnlock()

	// 2) Real submitted exports
	exportsMutex.RLock()
	for exportID, exportData := range submittedExports {
		if exporterFilter != "" && !strings.EqualFold(exporterFilter, "all") && !strings.EqualFold(exportData.Exporter, exporterFilter) {
			continue
		}

		totalRequests++
		status := strings.ToUpper(calculateExportStatus(exportID))
		switch status {
		case "PENDING":
			pendingApproval++
		case "APPROVED":
			approved++
		case "REJECTED":
			rejected++
		}

		lastUpdated := getLastUpdateTime(exportID)
		recentRequests = append(recentRequests, ExporterRequestInfo{
			ExportID:           exportID,
			ReferenceNumber:    generateReferenceNumber(exportID),
			SubmissionDate:     exportData.Timestamp,
			Status:             status,
			CurrentApprover:    getCurrentApprover(exportID),
			LastUpdated:        lastUpdated,
			DocumentCount:      len(exportData.Documents),
			ProgressPercent:    calculateProgressPercent(exportID),
			ExporterName:       exportData.Exporter,
			UrgencyLevel:       "HIGH",
			DestinationCountry: "International",
			TotalValue:         0,
		})
	}
	exportsMutex.RUnlock()

	// Limit to recent requests (last 5)
	if len(recentRequests) > 5 {
		recentRequests = recentRequests[:5]
	}

	// Generate notifications
	notifications := generateDashboardNotifications(exporterFilter)

	dashboard := ExporterDashboardData{
		TotalRequests:   totalRequests,
		PendingApproval: pendingApproval,
		Approved:        approved,
		Rejected:        rejected,
		RecentRequests:  recentRequests,
		Notifications:   notifications,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(dashboard)
}

func getExporterRequestsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Query parameters
	exporterFilter := r.URL.Query().Get("exporter")
	statusFilter := r.URL.Query().Get("status")
	search := r.URL.Query().Get("search")
	if exporterFilter == "" {
		exporterFilter = "Coffee Exporter Co." // Default for demo
	}

	exportsMutex.RLock()
	defer exportsMutex.RUnlock()

	var requests []ExporterRequestInfo

	// 1) Sample data
	sampleMutex.RLock()
	for exportID, exportData := range sampleExports {
		exporterName, ok := exportData["exporterName"].(string)
		// Respect exporter=all and do case-insensitive comparison
		if !ok || (exporterFilter != "" && !strings.EqualFold(exporterFilter, "all") && !strings.EqualFold(exporterName, exporterFilter)) {
			continue
		}

		status, _ := exportData["status"].(string)
		statusUpper := strings.ToUpper(status)
		if statusFilter != "" && statusFilter != "all" && strings.ToLower(statusUpper) != strings.ToLower(statusFilter) {
			continue
		}

		referenceNumber, _ := exportData["referenceNumber"].(string)
		if search != "" {
			if !strings.Contains(strings.ToLower(exportID), strings.ToLower(search)) &&
				!strings.Contains(strings.ToLower(referenceNumber), strings.ToLower(search)) {
				continue
			}
		}

		submissionDateStr, _ := exportData["submissionDate"].(string)
		lastUpdatedStr, _ := exportData["lastUpdated"].(string)
		submissionDate := time.Now()
		if t, err := time.Parse(time.RFC3339, submissionDateStr); err == nil {
			submissionDate = t
		}
		lastUpdated := time.Now()
		if t, err := time.Parse(time.RFC3339, lastUpdatedStr); err == nil {
			lastUpdated = t
		}
		currentApprover, _ := exportData["currentApprover"].(string)
		documentCount, _ := exportData["documentCount"].(int)
		progressPercent, _ := exportData["progressPercent"].(int)
		totalValue, _ := exportData["totalValue"].(int)
		destinationCountry, _ := exportData["destinationCountry"].(string)

		requests = append(requests, ExporterRequestInfo{
			ExportID:           exportID,
			ReferenceNumber:    referenceNumber,
			SubmissionDate:     submissionDate,
			Status:             statusUpper,
			CurrentApprover:    currentApprover,
			LastUpdated:        lastUpdated,
			DocumentCount:      documentCount,
			ProgressPercent:    progressPercent,
			ExporterName:       exporterName,
			UrgencyLevel:       "HIGH",
			DestinationCountry: destinationCountry,
			TotalValue:         float64(totalValue),
		})
	}
	sampleMutex.RUnlock()

	// 2) Real submitted exports
	exportsMutex.RLock()
	for exportID, exportData := range submittedExports {
		// Respect exporter=all and do case-insensitive comparison
		if exporterFilter != "" && !strings.EqualFold(exporterFilter, "all") && !strings.EqualFold(exportData.Exporter, exporterFilter) {
			continue
		}

		status := strings.ToUpper(calculateExportStatus(exportID))
		if statusFilter != "" && statusFilter != "all" && strings.ToLower(status) != strings.ToLower(statusFilter) {
			continue
		}

		ref := generateReferenceNumber(exportID)
		if search != "" {
			if !strings.Contains(strings.ToLower(exportID), strings.ToLower(search)) &&
				!strings.Contains(strings.ToLower(ref), strings.ToLower(search)) {
				continue
			}
		}

		requests = append(requests, ExporterRequestInfo{
			ExportID:           exportID,
			ReferenceNumber:    ref,
			SubmissionDate:     exportData.Timestamp,
			Status:             status,
			CurrentApprover:    getCurrentApprover(exportID),
			LastUpdated:        getLastUpdateTime(exportID),
			DocumentCount:      len(exportData.Documents),
			ProgressPercent:    calculateProgressPercent(exportID),
			ExporterName:       exportData.Exporter,
			UrgencyLevel:       "HIGH",
			DestinationCountry: "International",
			TotalValue:         0,
		})
	}
	exportsMutex.RUnlock()

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"requests": requests,
		"total":    len(requests),
		"filters": map[string]interface{}{
			"exporter": exporterFilter,
			"status":   statusFilter,
			"search":   search,
		},
	})
}

// getExporterRequestDetailHandler returns detailed view of a specific request
func getExporterRequestDetailHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Extract export ID from URL path
	path := strings.TrimPrefix(r.URL.Path, "/api/exporter/request/")
	exportID := strings.Split(path, "/")[0]
	if exportID == "" {
		http.Error(w, "Export ID required", http.StatusBadRequest)
		return
	}

	exportsMutex.RLock()
	exportData, exists := submittedExports[exportID]
	exportsMutex.RUnlock()

	if !exists {
		http.Error(w, "Export not found", http.StatusNotFound)
		return
	}

	// Build document status list
	documents := buildDocumentStatusList(exportID, exportData.Documents)

	// Build audit trail
	auditTrail := buildAuditTrail(exportID)

	// Calculate status and progress
	status := calculateExportStatus(exportID)
	progressPercent := calculateProgressPercent(exportID)

	detail := ExporterRequestDetail{
		ExportID:           exportID,
		ReferenceNumber:    generateReferenceNumber(exportID),
		SubmissionDate:     exportData.Timestamp,
		Status:             status,
		Documents:          documents,
		AuditTrail:         auditTrail,
		CurrentApprover:    getCurrentApprover(exportID),
		CanResubmit:        status == "REJECTED",
		ProgressPercent:    progressPercent,
		ExporterName:       exportData.Exporter,
		TotalValue:         0,               // Default for demo
		DestinationCountry: "International", // Default for demo
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(detail)
}

// Helper functions for exporter dashboard

func calculateExportStatus(exportID string) string {
	approvalsMutex.RLock()
	defer approvalsMutex.RUnlock()

	exportsMutex.RLock()
	exportData, exists := submittedExports[exportID]
	exportsMutex.RUnlock()

	if !exists {
		return "UNKNOWN"
	}

	totalDocs := len(exportData.Documents)
	approvedDocs := 0
	rejectedDocs := 0

	for _, approval := range completedApprovals {
		if approval.ExportID == exportID {
			if approval.Action == "APPROVE" {
				approvedDocs++
			} else if approval.Action == "REJECT" {
				rejectedDocs++
			}
		}
	}

	if rejectedDocs > 0 {
		return "REJECTED"
	}
	if approvedDocs == totalDocs {
		return "APPROVED"
	}
	return "PENDING"
}

func calculateProgressPercent(exportID string) int {
	approvalsMutex.RLock()
	defer approvalsMutex.RUnlock()

	exportsMutex.RLock()
	exportData, exists := submittedExports[exportID]
	exportsMutex.RUnlock()

	if !exists {
		return 0
	}

	totalDocs := len(exportData.Documents)
	if totalDocs == 0 {
		return 0
	}

	approvedDocs := 0
	for _, approval := range completedApprovals {
		if approval.ExportID == exportID && approval.Action == "APPROVE" {
			approvedDocs++
		}
	}

	return (approvedDocs * 100) / totalDocs
}

func getCurrentApprover(exportID string) string {
	// Get the first organization that hasn't approved yet
	exportsMutex.RLock()
	exportData, exists := submittedExports[exportID]
	exportsMutex.RUnlock()

	if !exists {
		return "N/A"
	}

	approvalsMutex.RLock()
	defer approvalsMutex.RUnlock()

	// Check which documents are pending
	for docType := range exportData.Documents {
		approved := false
		for _, approval := range completedApprovals {
			if approval.ExportID == exportID && approval.Action == "APPROVE" {
				// Simple check - in production, match by document hash
				approved = true
				break
			}
		}
		if !approved {
			return getOrganizationForDocType(docType)
		}
	}

	return "Completed"
}

func getLastUpdateTime(exportID string) time.Time {
	approvalsMutex.RLock()
	defer approvalsMutex.RUnlock()

	latestTime := time.Time{}
	for _, approval := range completedApprovals {
		if approval.ExportID == exportID {
			if approval.Timestamp.After(latestTime) {
				latestTime = approval.Timestamp
			}
		}
	}

	if latestTime.IsZero() {
		// Return submission time if no approvals yet
		exportsMutex.RLock()
		if exportData, exists := submittedExports[exportID]; exists {
			latestTime = exportData.Timestamp
		}
		exportsMutex.RUnlock()
	}

	return latestTime
}

func generateReferenceNumber(exportID string) string {
	// Generate a human-readable reference number
	if len(exportID) > 10 {
		return fmt.Sprintf("REF-%s", exportID[4:10])
	}
	return fmt.Sprintf("REF-%s", exportID)
}

func buildDocumentStatusList(exportID string, documents map[string]DocumentInfo) []DocumentStatusInfo {
	var docStatuses []DocumentStatusInfo

	for docType, docInfo := range documents {
		status := getDocumentApprovalStatus(exportID, docType)
		approverOrg := getOrganizationForDocType(docType)
		lastReviewDate, comments := getDocumentReviewInfo(exportID, docType)

		docStatus := DocumentStatusInfo{
			Type:           docType,
			DisplayName:    getDisplayDocType(docType),
			Status:         status,
			ApproverOrg:    approverOrg,
			LastReviewDate: lastReviewDate,
			Comments:       comments,
			Hash:           docInfo.Hash,
			IPFSCID:        docInfo.IPFSCID,
			Size:           docInfo.Size,
		}

		docStatuses = append(docStatuses, docStatus)
	}

	return docStatuses
}

func buildAuditTrail(exportID string) []AuditTrailEntry {
	var trail []AuditTrailEntry

	// Add submission entry
	exportsMutex.RLock()
	if exportData, exists := submittedExports[exportID]; exists {
		trail = append(trail, AuditTrailEntry{
			Timestamp:    exportData.Timestamp,
			Action:       "SUBMITTED",
			Actor:        exportData.Exporter,
			Organization: "Exporter",
			DocumentType: "All Documents",
			Comments:     "",
			Description:  "Export request submitted with all required documents",
		})
	}
	exportsMutex.RUnlock()

	// Add approval entries
	approvalsMutex.RLock()
	for _, approval := range completedApprovals {
		if approval.ExportID == exportID {
			action := "APPROVED"
			if approval.Action == "REJECT" {
				action = "REJECTED"
			}

			description := fmt.Sprintf("Document %s by %s", strings.ToLower(action), approval.ReviewedBy)

			trail = append(trail, AuditTrailEntry{
				Timestamp:    approval.Timestamp,
				Action:       action,
				Actor:        approval.ReviewedBy,
				Organization: "Approver", // In production, determine from document type
				DocumentType: "Document", // In production, get actual document type
				Comments:     approval.Comments,
				Description:  description,
			})
		}
	}
	approvalsMutex.RUnlock()

	// Sort by timestamp
	for i := 0; i < len(trail)-1; i++ {
		for j := i + 1; j < len(trail); j++ {
			if trail[i].Timestamp.After(trail[j].Timestamp) {
				trail[i], trail[j] = trail[j], trail[i]
			}
		}
	}

	return trail
}

func getDocumentApprovalStatus(exportID, docType string) string {
	approvalsMutex.RLock()
	defer approvalsMutex.RUnlock()

	for _, approval := range completedApprovals {
		if approval.ExportID == exportID {
			// In production, match by document hash and organization
			if approval.Action == "APPROVE" {
				return "APPROVED"
			} else if approval.Action == "REJECT" {
				return "REJECTED"
			}
		}
	}
	return "PENDING"
}

func getDocumentReviewInfo(exportID, docType string) (*time.Time, string) {
	approvalsMutex.RLock()
	defer approvalsMutex.RUnlock()

	for _, approval := range completedApprovals {
		if approval.ExportID == exportID {
			// In production, match by document hash and organization
			return &approval.Timestamp, approval.Comments
		}
	}
	return nil, ""
}

func generateDashboardNotifications(exporterFilter string) []DashboardNotification {
	var notifications []DashboardNotification

	// Generate sample notifications based on recent approvals
	approvalsMutex.RLock()
	for _, approval := range completedApprovals {
		// Check if this approval belongs to the exporter's exports
		exportsMutex.RLock()
		if exportData, exists := submittedExports[approval.ExportID]; exists && exportData.Exporter == exporterFilter {
			notificationType := "APPROVAL"
			title := "Document Approved"
			message := fmt.Sprintf("Your document for export %s has been approved by %s", approval.ExportID, approval.ReviewedBy)
			priority := "MEDIUM"

			if approval.Action == "REJECT" {
				notificationType = "REJECTION"
				title = "Document Rejected"
				message = fmt.Sprintf("Your document for export %s has been rejected by %s. Reason: %s", approval.ExportID, approval.ReviewedBy, approval.Comments)
				priority = "HIGH"
			}

			notification := DashboardNotification{
				ID:        fmt.Sprintf("notif_%s_%d", approval.ExportID, approval.Timestamp.Unix()),
				Type:      notificationType,
				ExportID:  approval.ExportID,
				Title:     title,
				Message:   message,
				Timestamp: approval.Timestamp,
				IsRead:    false,
				Priority:  priority,
			}

			notifications = append(notifications, notification)
		}
		exportsMutex.RUnlock()
	}
	approvalsMutex.RUnlock()

	// Sort by timestamp (most recent first)
	for i := 0; i < len(notifications)-1; i++ {
		for j := i + 1; j < len(notifications); j++ {
			if notifications[i].Timestamp.Before(notifications[j].Timestamp) {
				notifications[i], notifications[j] = notifications[j], notifications[i]
			}
		}
	}

	// Limit to 10 most recent
	if len(notifications) > 10 {
		notifications = notifications[:10]
	}

	return notifications
}
