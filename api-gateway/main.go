package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
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
	Timestamp    time.Time `json:"timestamp"`
}

// In-memory storage for submitted exports (in production, use a database)
var (
	submittedExports   = make(map[string]ExportData)
	exportsMutex       = sync.RWMutex{}
	completedApprovals = make(map[string]CompletedApproval)
	approvalsMutex     = sync.RWMutex{}
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
	http.HandleFunc("/api/approval-channels/submit-decision", corsWrapper(submitApprovalDecisionHandler))
	http.HandleFunc("/api/supervisor/exports", corsWrapper(getBankSupervisorExportsHandler))
	http.HandleFunc("/api/supervisor/export/", corsWrapper(getBankSupervisorViewHandler))
	http.HandleFunc("/api/approval-chain/", corsWrapper(getApprovalChainHandler))
	// Exporter dashboard endpoints
	http.HandleFunc("/api/exporter/dashboard", corsWrapper(getExporterDashboardHandler))
	http.HandleFunc("/api/exporter/requests", corsWrapper(getExporterRequestsHandler))
	http.HandleFunc("/api/exporter/request/", corsWrapper(getExporterRequestDetailHandler))
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
	json.NewEncoder(w).Encode(map[string]string{
		"status":   "accepted",
		"exportId": exportID,
		"message":  fmt.Sprintf("Export submitted with %d documents", len(exportData.Documents)),
	})
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
	mockCompletedApprovals := map[string]interface{}{
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
	json.NewEncoder(w).Encode(mockCompletedApprovals)
}

// healthHandler provides a health check endpoint
func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":    "healthy",
		"service":   "api-gateway",
		"timestamp": time.Now().Format(time.RFC3339),
	})
}

// getDocTypeForOrg returns the document type that an organization is responsible for
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
var (
	documentStorage  = make(map[string][]byte) // In-memory document storage
	documentMetadata = make(map[string]map[string]interface{})
	documentMutex    = sync.RWMutex{}
)

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

	// Generate document ID
	documentID := fmt.Sprintf("doc_%d_%d", time.Now().UnixNano(), handler.Size)

	// Store document and metadata
	documentMutex.Lock()
	documentStorage[documentID] = fileBytes
	documentMetadata[documentID] = map[string]interface{}{
		"fileName":     handler.Filename,
		"fileSize":     handler.Size,
		"contentType":  handler.Header.Get("Content-Type"),
		"uploadTime":   time.Now(),
		"exportId":     r.FormValue("exportId"),
		"documentType": r.FormValue("documentType"),
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
	
	// Method 1: Try to find document in submitted exports
	exportsMutex.RLock()
	var foundDocument *DocumentInfo
	var exportID string
	
	for eID, exportData := range submittedExports {
		for _, docInfo := range exportData.Documents {
			// Check both hash and IPFS CID
			if docInfo.Hash == documentHash || docInfo.IPFSCID == documentHash {
				foundDocument = &docInfo
				exportID = eID
				break
			}
		}
		if foundDocument != nil {
			break
		}
	}
	exportsMutex.RUnlock()
	
	if foundDocument == nil {
		// Method 2: Check database storage
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
	
	// Found document in exports - handle IPFS access
	fmt.Printf("Found document in export %s: CID=%s, Encrypted=%t\n", exportID, foundDocument.IPFSCID, foundDocument.Encrypted)
	
	// Method 3: Try IPFS access with decryption if available
	if foundDocument.Encrypted && foundDocument.Key != "" && foundDocument.IV != "" {
		fmt.Printf("Attempting decryption access for encrypted document\n")
		
		// For now, return instructions for decryption since we don't have the decryption logic in Go
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
	
	// Method 4: Try direct IPFS access (unencrypted)
	fmt.Printf("Attempting direct IPFS access for unencrypted document\n")
	
	// Try to fetch from local IPFS gateway
	ipfsURL := fmt.Sprintf("http://localhost:8090/ipfs/%s", foundDocument.IPFSCID)
	resp, err := http.Get(ipfsURL)
	
	if err != nil {
		// Fallback to public gateway
		ipfsURL = fmt.Sprintf("https://ipfs.io/ipfs/%s", foundDocument.IPFSCID)
		resp, err = http.Get(ipfsURL)
	}
	
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusServiceUnavailable)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"success": false,
			"error":   "IPFS access failed",
			"message": "Unable to retrieve document from IPFS",
			"ipfsCid": foundDocument.IPFSCID,
		})
		return
	}
	defer resp.Body.Close()
	
	if resp.StatusCode != http.StatusOK {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"success": false,
			"error":   "Document not found in IPFS",
			"message": "Document exists in registry but not accessible via IPFS",
			"ipfsCid": foundDocument.IPFSCID,
		})
		return
	}
	
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
	
	// Copy the IPFS response to the client
	w.WriteHeader(http.StatusOK)
	_, err = io.Copy(w, resp.Body)
	if err != nil {
		fmt.Printf("Error copying response: %v\n", err)
	}
	
	fmt.Printf("Document %s served from IPFS successfully\n", documentHash)
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
		"userRole":         userRole,
		"isSupervisor":     isSupervisor,
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

	// Process the decision
	approvalsMutex.Lock()
	approvalKey := fmt.Sprintf("%s_%s_%s", decision.ExportID, decision.DocumentHash, orgType)
	completedApproval := CompletedApproval{
		ID:           approvalKey,
		ExportID:     decision.ExportID,
		DocumentHash: decision.DocumentHash,
		Action:       decision.Action,
		Comments:     decision.Comments,
		ReviewedBy:   decision.ReviewedBy,
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

	// Calculate dashboard metrics
	var totalRequests, pendingApproval, approved, rejected int
	var recentRequests []ExporterRequestInfo

	for exportID, exportData := range submittedExports {
		// Filter by exporter if specified
		if exportData.Exporter != exporterFilter {
			continue
		}

		totalRequests++

		// Calculate status
		status := calculateExportStatus(exportID)
		switch status {
		case "PENDING":
			pendingApproval++
		case "APPROVED":
			approved++
		case "REJECTED":
			rejected++
		}

		// Build request info
		request := ExporterRequestInfo{
			ExportID:           exportID,
			ReferenceNumber:    generateReferenceNumber(exportID),
			SubmissionDate:     exportData.Timestamp,
			Status:             status,
			CurrentApprover:    getCurrentApprover(exportID),
			LastUpdated:        getLastUpdateTime(exportID),
			DocumentCount:      len(exportData.Documents),
			ProgressPercent:    calculateProgressPercent(exportID),
			ExporterName:       exportData.Exporter,
			UrgencyLevel:       "HIGH",          // Default for demo
			DestinationCountry: "International", // Default for demo
			TotalValue:         0,               // Default for demo
		}

		recentRequests = append(recentRequests, request)
	}

	// Sort by submission date (most recent first)
	for i := 0; i < len(recentRequests)-1; i++ {
		for j := i + 1; j < len(recentRequests); j++ {
			if recentRequests[i].SubmissionDate.Before(recentRequests[j].SubmissionDate) {
				recentRequests[i], recentRequests[j] = recentRequests[j], recentRequests[i]
			}
		}
	}

	// Limit to recent 10 requests
	if len(recentRequests) > 10 {
		recentRequests = recentRequests[:10]
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

// getExporterRequestsHandler returns paginated list of exporter requests
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

	for exportID, exportData := range submittedExports {
		// Filter by exporter
		if exportData.Exporter != exporterFilter {
			continue
		}

		// Calculate status
		status := calculateExportStatus(exportID)

		// Apply status filter
		if statusFilter != "" && statusFilter != "all" && status != statusFilter {
			continue
		}

		// Apply search filter
		if search != "" {
			if !strings.Contains(strings.ToLower(exportID), strings.ToLower(search)) &&
				!strings.Contains(strings.ToLower(generateReferenceNumber(exportID)), strings.ToLower(search)) {
				continue
			}
		}

		request := ExporterRequestInfo{
			ExportID:           exportID,
			ReferenceNumber:    generateReferenceNumber(exportID),
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
		}

		requests = append(requests, request)
	}

	// Sort by submission date (most recent first)
	for i := 0; i < len(requests)-1; i++ {
		for j := i + 1; j < len(requests); j++ {
			if requests[i].SubmissionDate.Before(requests[j].SubmissionDate) {
				requests[i], requests[j] = requests[j], requests[i]
			}
		}
	}

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
