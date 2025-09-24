package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
)

// ExportData represents the data for an export submission
type ExportData struct {
	ExportID string `json:"exportId"`
	// Add other fields as necessary
}

// ApprovalRequest represents the data for an approval decision
type ApprovalRequest struct {
	ExportID     string `json:"exportId"`
	DocumentHash string `json:"documentHash"`
	Action       string `json:"action"`
	Comments     string `json:"comments"`
	ReviewedBy   string `json:"reviewedBy"`
}

// DocumentInfo represents metadata about a document stored on IPFS
type DocumentInfo struct {
	IPFSCID     string `json:"ipfsCid"`
	ContentType string `json:"contentType"`
	Size        int64  `json:"size"`
}

type User struct {
	ID           string `json:"id"`
	Username     string `json:"username"`
	Password     string `json:"password"`
	Organization string `json:"organization"`
	Role         string `json:"role"`
}

func getOrganizationSummaryHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		sendError(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	org := r.URL.Query().Get("org")
	if org == "" {
		sendError(w, "Organization parameter is required", http.StatusBadRequest)
		return
	}

	network, err := fabricGateway.GetNetwork(appConfig.Fabric.ChannelName)
	if err != nil {
		sendError(w, fmt.Sprintf("Failed to get network: %v", err), http.StatusInternalServerError)
		return
	}

	contract := network.GetContract(appConfig.Fabric.ChaincodeName)
	result, err := contract.EvaluateTransaction("GetPendingApprovalsForOrganization", org)
	if err != nil {
		sendError(w, fmt.Sprintf("Failed to evaluate transaction: %v", err), http.StatusInternalServerError)
		return
	}

	var summary map[string]interface{}
	if err := json.Unmarshal(result, &summary); err != nil {
		sendError(w, fmt.Sprintf("Failed to unmarshal chaincode result: %v", err), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(summary)
}

func submitExportHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		sendError(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var exportRequest ExportData
	if err := json.NewDecoder(r.Body).Decode(&exportRequest); err != nil {
		sendError(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	requestJSON, err := json.Marshal(exportRequest)
	if err != nil {
		sendError(w, "Failed to marshal request", http.StatusInternalServerError)
		return
	}

	network, err := fabricGateway.GetNetwork(appConfig.Fabric.ChannelName)
	if err != nil {
		sendError(w, fmt.Sprintf("Failed to get network: %v", err), http.StatusInternalServerError)
		return
	}

	contract := network.GetContract(appConfig.Fabric.ChaincodeName)
	_, err = contract.SubmitTransaction("SubmitExport", string(requestJSON))
	if err != nil {
		sendError(w, fmt.Sprintf("Failed to submit transaction: %v", err), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusAccepted)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":   "accepted",
		"exportId": exportRequest.ExportID,
	})
}

func submitApprovalDecisionHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		sendError(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var approvalReq ApprovalRequest
	if err := json.NewDecoder(r.Body).Decode(&approvalReq); err != nil {
		sendError(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	network, err := fabricGateway.GetNetwork(appConfig.Fabric.ChannelName)
	if err != nil {
		sendError(w, fmt.Sprintf("Failed to get network: %v", err), http.StatusInternalServerError)
		return
	}

	contract := network.GetContract(appConfig.Fabric.ChaincodeName)
	_, err = contract.SubmitTransaction("SubmitApprovalDecision", approvalReq.ExportID, approvalReq.DocumentHash, approvalReq.Action, approvalReq.Comments, approvalReq.ReviewedBy)
	if err != nil {
		sendError(w, fmt.Sprintf("Failed to submit transaction: %v", err), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusAccepted)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status": "accepted",
	})
}

func getExporterDashboardHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		sendError(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	exporterID := r.URL.Query().Get("exporterId")
	if exporterID == "" {
		sendError(w, "exporterId parameter is required", http.StatusBadRequest)
		return
	}

	network, err := fabricGateway.GetNetwork(appConfig.Fabric.ChannelName)
	if err != nil {
		sendError(w, fmt.Sprintf("Failed to get network: %v", err), http.StatusInternalServerError)
		return
	}

	contract := network.GetContract(appConfig.Fabric.ChaincodeName)
	result, err := contract.EvaluateTransaction("GetExporterDashboard", exporterID)
	if err != nil {
		sendError(w, fmt.Sprintf("Failed to evaluate transaction: %v", err), http.StatusInternalServerError)
		return
	}

	var dashboardData map[string]interface{}
	if err := json.Unmarshal(result, &dashboardData); err != nil {
		sendError(w, fmt.Sprintf("Failed to unmarshal chaincode result: %v", err), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(dashboardData)
}

func getExporterRequestsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		sendError(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	exporterID := r.URL.Query().Get("exporterId")
	if exporterID == "" {
		sendError(w, "exporterId parameter is required", http.StatusBadRequest)
		return
	}

	network, err := fabricGateway.GetNetwork(appConfig.Fabric.ChannelName)
	if err != nil {
		sendError(w, fmt.Sprintf("Failed to get network: %v", err), http.StatusInternalServerError)
		return
	}

	contract := network.GetContract(appConfig.Fabric.ChaincodeName)
	result, err := contract.EvaluateTransaction("GetExporterRequests", exporterID)
	if err != nil {
		sendError(w, fmt.Sprintf("Failed to evaluate transaction: %v", err), http.StatusInternalServerError)
		return
	}

	var requests []map[string]interface{}
	if err := json.Unmarshal(result, &requests); err != nil {
		sendError(w, fmt.Sprintf("Failed to unmarshal chaincode result: %v", err), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(requests)
}

func getExporterRequestDetailHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		sendError(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	exportID := r.URL.Query().Get("exportId")
	if exportID == "" {
		sendError(w, "exportId parameter is required", http.StatusBadRequest)
		return
	}

	network, err := fabricGateway.GetNetwork(appConfig.Fabric.ChannelName)
	if err != nil {
		sendError(w, fmt.Sprintf("Failed to get network: %v", err), http.StatusInternalServerError)
		return
	}

	contract := network.GetContract(appConfig.Fabric.ChaincodeName)
	result, err := contract.EvaluateTransaction("GetExporterRequestDetail", exportID)
	if err != nil {
		sendError(w, fmt.Sprintf("Failed to evaluate transaction: %v", err), http.StatusInternalServerError)
		return
	}

	var requestDetail map[string]interface{}
	if err := json.Unmarshal(result, &requestDetail); err != nil {
		sendError(w, fmt.Sprintf("Failed to unmarshal chaincode result: %v", err), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(requestDetail)
}

func getBankSupervisorExportsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		sendError(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	network, err := fabricGateway.GetNetwork(appConfig.Fabric.ChannelName)
	if err != nil {
		sendError(w, fmt.Sprintf("Failed to get network: %v", err), http.StatusInternalServerError)
		return
	}

	contract := network.GetContract(appConfig.Fabric.ChaincodeName)
	result, err := contract.EvaluateTransaction("GetAllExportsForSupervisor")
	if err != nil {
		sendError(w, fmt.Sprintf("Failed to evaluate transaction: %v", err), http.StatusInternalServerError)
		return
	}

	var exports []map[string]interface{}
	if err := json.Unmarshal(result, &exports); err != nil {
		sendError(w, fmt.Sprintf("Failed to unmarshal chaincode result: %v", err), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(exports)
}

func getBankSupervisorViewHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		sendError(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	exportID := r.URL.Query().Get("exportId")
	if exportID == "" {
		sendError(w, "exportId parameter is required", http.StatusBadRequest)
		return
	}

	network, err := fabricGateway.GetNetwork(appConfig.Fabric.ChannelName)
	if err != nil {
		sendError(w, fmt.Sprintf("Failed to get network: %v", err), http.StatusInternalServerError)
		return
	}

	contract := network.GetContract(appConfig.Fabric.ChaincodeName)
	result, err := contract.EvaluateTransaction("GetBankSupervisorView", exportID)
	if err != nil {
		sendError(w, fmt.Sprintf("Failed to evaluate transaction: %v", err), http.StatusInternalServerError)
		return
	}

	var view map[string]interface{}
	if err := json.Unmarshal(result, &view); err != nil {
		sendError(w, fmt.Sprintf("Failed to unmarshal chaincode result: %v", err), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(view)
}

func getCompletedApprovalsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		sendError(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	org := r.URL.Query().Get("org")
	if org == "" {
		sendError(w, "Organization parameter is required", http.StatusBadRequest)
		return
	}

	network, err := fabricGateway.GetNetwork(appConfig.Fabric.ChannelName)
	if err != nil {
		sendError(w, fmt.Sprintf("Failed to get network: %v", err), http.StatusInternalServerError)
		return
	}

	contract := network.GetContract(appConfig.Fabric.ChaincodeName)
	result, err := contract.EvaluateTransaction("GetCompletedApprovalsForOrganization", org)
	if err != nil {
		sendError(w, fmt.Sprintf("Failed to evaluate transaction: %v", err), http.StatusInternalServerError)
		return
	}

	var completedApprovals []map[string]interface{}
	if err := json.Unmarshal(result, &completedApprovals); err != nil {
		sendError(w, fmt.Sprintf("Failed to unmarshal chaincode result: %v", err), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{"completedApprovals": completedApprovals})
}

func searchHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		sendError(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	query := r.URL.Query().Get("q")
	if query == "" {
		sendError(w, "Query parameter is required", http.StatusBadRequest)
		return
	}

	network, err := fabricGateway.GetNetwork(appConfig.Fabric.ChannelName)
	if err != nil {
		sendError(w, fmt.Sprintf("Failed to get network: %v", err), http.StatusInternalServerError)
		return
	}

	contract := network.GetContract(appConfig.Fabric.ChaincodeName)
	result, err := contract.EvaluateTransaction("SearchDocuments", query)
	if err != nil {
		sendError(w, fmt.Sprintf("Failed to evaluate transaction: %v", err), http.StatusInternalServerError)
		return
	}

	var searchResults []map[string]interface{}
	if err := json.Unmarshal(result, &searchResults); err != nil {
		sendError(w, fmt.Sprintf("Failed to unmarshal chaincode result: %v", err), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{"results": searchResults})
}

func getActivityLogHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		sendError(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	org := r.URL.Query().Get("org")
	if org == "" {
		sendError(w, "Organization parameter is required", http.StatusBadRequest)
		return
	}

	network, err := fabricGateway.GetNetwork(appConfig.Fabric.ChannelName)
	if err != nil {
		sendError(w, fmt.Sprintf("Failed to get network: %v", err), http.StatusInternalServerError)
		return
	}

	contract := network.GetContract(appConfig.Fabric.ChaincodeName)
	result, err := contract.EvaluateTransaction("GetActivityLog", org)
	if err != nil {
		sendError(w, fmt.Sprintf("Failed to evaluate transaction: %v", err), http.StatusInternalServerError)
		return
	}

	var activityLog []map[string]interface{}
	if err := json.Unmarshal(result, &activityLog); err != nil {
		sendError(w, fmt.Sprintf("Failed to unmarshal chaincode result: %v", err), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{"log": activityLog})
}

func viewDocumentHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		sendError(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	documentHash := strings.TrimPrefix(r.URL.Path, "/api/documents/")
	if documentHash == "" {
		sendError(w, "Document hash is required", http.StatusBadRequest)
		return
	}

	exportID := r.URL.Query().Get("exportId")
	if exportID == "" {
		sendError(w, "exportId parameter is required", http.StatusBadRequest)
		return
	}

	network, err := fabricGateway.GetNetwork(appConfig.Fabric.ChannelName)
	if err != nil {
		sendError(w, fmt.Sprintf("Failed to get network: %v", err), http.StatusInternalServerError)
		return
	}

	contract := network.GetContract(appConfig.Fabric.ChaincodeName)
	result, err := contract.EvaluateTransaction("GetDocumentMetadata", exportID, documentHash)
	if err != nil {
		sendError(w, fmt.Sprintf("Failed to evaluate transaction: %v", err), http.StatusInternalServerError)
		return
	}

	var docInfo DocumentInfo
	if err := json.Unmarshal(result, &docInfo); err != nil {
		sendError(w, fmt.Sprintf("Failed to unmarshal chaincode result: %v", err), http.StatusInternalServerError)
		return
	}

	// Fetch document from IPFS
	ipfsURL := fmt.Sprintf("http://localhost:8080/ipfs/%s", docInfo.IPFSCID)
	resp, err := http.Get(ipfsURL)
	if err != nil {
		sendError(w, fmt.Sprintf("Failed to fetch document from IPFS: %v", err), http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	w.Header().Set("Content-Type", docInfo.ContentType)
	w.Header().Set("Content-Length", fmt.Sprintf("%d", docInfo.Size))
	io.Copy(w, resp.Body)
}

func getApprovalChainHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		sendError(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	exportID := strings.TrimPrefix(r.URL.Path, "/api/approval-chain/")
	if exportID == "" {
		sendError(w, "exportId parameter is required", http.StatusBadRequest)
		return
	}

	network, err := fabricGateway.GetNetwork(appConfig.Fabric.ChannelName)
	if err != nil {
		sendError(w, fmt.Sprintf("Failed to get network: %v", err), http.StatusInternalServerError)
		return
	}

	contract := network.GetContract(appConfig.Fabric.ChaincodeName)
	result, err := contract.EvaluateTransaction("GetApprovalChain", exportID)
	if err != nil {
		sendError(w, fmt.Sprintf("Failed to evaluate transaction: %v", err), http.StatusInternalServerError)
		return
	}

	var approvalChain map[string]interface{}
	if err := json.Unmarshal(result, &approvalChain); err != nil {
		sendError(w, fmt.Sprintf("Failed to unmarshal chaincode result: %v", err), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(approvalChain)
}

func ipfsProxyHandler(w http.ResponseWriter, r *http.Request) {
	// Trim the /api/ipfs prefix and prepend the correct IPFS API v0 path
	targetPath := strings.TrimPrefix(r.URL.Path, "/api/ipfs")
	ipfsAPIPath := "/api/v0" + targetPath

	// Construct the full IPFS API URL
	ipfsURL := fmt.Sprintf("http://ipfs:5001%s", ipfsAPIPath)

	// Include query parameters from the original request
	if r.URL.RawQuery != "" {
		ipfsURL = fmt.Sprintf("%s?%s", ipfsURL, r.URL.RawQuery)
	}

	proxyReq, err := http.NewRequest(r.Method, ipfsURL, r.Body)
	if err != nil {
		sendError(w, fmt.Sprintf("Failed to create proxy request: %v", err), http.StatusInternalServerError)
		return
	}

	proxyReq.Header = r.Header

	client := &http.Client{}
	proxyResp, err := client.Do(proxyReq)
	if err != nil {
		sendError(w, fmt.Sprintf("Failed to proxy request to IPFS: %v", err), http.StatusInternalServerError)
		return
	}
	defer proxyResp.Body.Close()

	for key, values := range proxyResp.Header {
		for _, value := range values {
			w.Header().Add(key, value)
		}
	}

	w.WriteHeader(proxyResp.StatusCode)
	io.Copy(w, proxyResp.Body)
}

func registerUserHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		sendError(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var user User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		sendError(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	network, err := fabricGateway.GetNetwork(appConfig.Fabric.ChannelName)
	if err != nil {
		sendError(w, fmt.Sprintf("Failed to get network: %v", err), http.StatusInternalServerError)
		return
	}

	contract := network.GetContract(appConfig.Fabric.ChaincodeName)
	_, err = contract.SubmitTransaction("CreateUser", user.ID, user.Username, user.Password, user.Organization, user.Role)
	if err != nil {
		sendError(w, fmt.Sprintf("Failed to create user: %v", err), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":  "success",
		"message": "User created successfully",
	})
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		sendError(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var creds User
	if err := json.NewDecoder(r.Body).Decode(&creds); err != nil {
		sendError(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	network, err := fabricGateway.GetNetwork(appConfig.Fabric.ChannelName)
	if err != nil {
		sendError(w, fmt.Sprintf("Failed to get network: %v", err), http.StatusInternalServerError)
		return
	}

	contract := network.GetContract(appConfig.Fabric.ChaincodeName)

	// Create admin user if it doesn't exist
	if creds.Username == "admin" {
		_, err := contract.EvaluateTransaction("GetUser", "admin")
		if err != nil {
			// User does not exist, create it
			_, err = contract.SubmitTransaction("CreateUser", "admin", "admin", "password", "Admin", "admin")
			if err != nil {
				sendError(w, fmt.Sprintf("Failed to create admin user: %v", err), http.StatusInternalServerError)
				return
			}
		}
	}

	result, err := contract.EvaluateTransaction("GetUser", creds.Username)
	if err != nil {
		sendError(w, fmt.Sprintf("Failed to get user: %v", err), http.StatusUnauthorized)
		return
	}

	var user User
	if err := json.Unmarshal(result, &user); err != nil {
		sendError(w, fmt.Sprintf("Failed to unmarshal user data: %v", err), http.StatusInternalServerError)
		return
	}

	if user.Password != creds.Password {
		sendError(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	token, err := generateJWT(user)
	if err != nil {
		sendError(w, fmt.Sprintf("Failed to generate token: %v", err), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"token": token})
}
