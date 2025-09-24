package main

import (
	"encoding/json"
	"fmt"
	"strings"

	"github.com/coffex/chaincode/shared"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// DocumentMetadata contains IPFS and validation information for a document
type DocumentMetadata struct {
	Hash        string `json:"hash"`        // SHA-256 hash of the original document
	IPFSCID     string `json:"ipfsCid"`     // IPFS Content Identifier
	IPFSURL     string `json:"ipfsUrl"`     // IPFS Gateway URL
	IV          string `json:"iv"`          // Initialization Vector for decryption
	Encrypted   bool   `json:"encrypted"`   // Whether the document is encrypted
	UploadedAt  int64  `json:"uploadedAt"`  // Timestamp when document was uploaded to IPFS
	ContentType string `json:"contentType"` // MIME type of the document
	Size        int64  `json:"size"`        // Size of the document in bytes
}

type ExportRequest struct {
	ExportID  string                      `json:"exportId"`
	Documents map[string]DocumentMetadata `json:"documents"` // docType -> DocumentMetadata
	Exporter  string                      `json:"exporter"`  // MSP ID of the exporter
	Timestamp int64                       `json:"timestamp"` // When the export was created
	Status    string                      `json:"status"`    // Status of the export
}

type SmartContract struct {
	blockchainUtils    *shared.BlockchainUtils
	authUtils          *shared.AuthUtils
	approvalChannelMgr *shared.ApprovalChannelManager
	userManagement     *shared.UserManagement
}

func NewSmartContract() *SmartContract {
	return &SmartContract{
		blockchainUtils:    shared.NewBlockchainUtils(),
		authUtils:          shared.NewAuthUtils(),
		approvalChannelMgr: shared.NewApprovalChannelManager(),
		userManagement:     shared.NewUserManagement(),
	}
}

// InitLedger initializes the ledger with sample data
func (s *SmartContract) InitLedger(ctx contractapi.TransactionContextInterface) error {
	// Initialize the ledger with default configurations
	
	// Create default admin users for each organization
	defaultUsers := []struct {
		ID           string
		Username     string
		Password     string
		Organization string
		Role         string
	}{
		{"admin-nb", "admin@nationalbank.com", "admin123", "NationalBank", "admin"},
		{"admin-eb", "admin@exporterbank.com", "admin123", "ExporterBank", "admin"},
		{"admin-ca", "admin@coffeeauthority.com", "admin123", "CoffeeAuthority", "admin"},
		{"admin-customs", "admin@customs.com", "admin123", "Customs", "admin"},
	}

	for _, user := range defaultUsers {
		err := s.userManagement.CreateUser(ctx, user.ID, user.Username, user.Password, user.Organization, user.Role)
		if err != nil {
			return fmt.Errorf("failed to create default user %s: %v", user.Username, err)
		}
	}

	// Initialize approval channel configurations
	if err := s.approvalChannelMgr.InitializeChannels(ctx); err != nil {
		return fmt.Errorf("failed to initialize approval channels: %v", err)
	}

	// Set up initial permissions and configurations
	if err := s.authUtils.InitializePermissions(ctx); err != nil {
		return fmt.Errorf("failed to initialize permissions: %v", err)
	}

	return nil
}

// GetAllExports returns all export requests (for testing and admin purposes)
func (s *SmartContract) GetAllExports(ctx contractapi.TransactionContextInterface) ([]byte, error) {
	callerMSP, err := ctx.GetClientIdentity().GetMSPID()
	if err != nil {
		return nil, fmt.Errorf("failed to get MSP ID: %v", err)
	}

	// Check if caller has permission to view all exports
	authorized, err := s.authUtils.CheckPermission(ctx, callerMSP, shared.ViewAllExports)
	if err != nil {
		return nil, fmt.Errorf("failed to check permission: %v", err)
	}
	if !authorized {
		return nil, fmt.Errorf("unauthorized: insufficient permissions to view all exports")
	}

	iterator, err := ctx.GetStub().GetPrivateDataByRange("exportRequests", "", "")
	if err != nil {
		return nil, fmt.Errorf("failed to get export requests: %v", err)
	}
	defer iterator.Close()

	var exports []ExportRequest
	for iterator.HasNext() {
		result, err := iterator.Next()
		if err != nil {
			return nil, err
		}

		var exportRequest ExportRequest
		if err := json.Unmarshal(result.Value, &exportRequest); err != nil {
			continue // Skip invalid entries
		}

		exports = append(exports, exportRequest)
	}

	resultBytes, err := json.Marshal(exports)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal exports: %v", err)
	}

	return resultBytes, nil
}

// GetExport returns a specific export request by ID
func (s *SmartContract) GetExport(ctx contractapi.TransactionContextInterface, exportID string) ([]byte, error) {
	callerMSP, err := ctx.GetClientIdentity().GetMSPID()
	if err != nil {
		return nil, fmt.Errorf("failed to get MSP ID: %v", err)
	}

	// Get export request from private data
	exportRequestBytes, err := ctx.GetStub().GetPrivateData("exportRequests", exportID)
	if err != nil {
		return nil, fmt.Errorf("failed to read export request: %v", err)
	}
	if exportRequestBytes == nil {
		return nil, fmt.Errorf("export request %s does not exist", exportID)
	}

	var exportRequest ExportRequest
	if err := json.Unmarshal(exportRequestBytes, &exportRequest); err != nil {
		return nil, fmt.Errorf("failed to unmarshal export request: %v", err)
	}

	// Check if caller has permission to view this export
	if exportRequest.Exporter != callerMSP {
		// Check if caller is a bank supervisor or has other viewing permissions
		authorized, err := s.authUtils.CheckPermission(ctx, callerMSP, shared.ViewExport)
		if err != nil {
			return nil, fmt.Errorf("failed to check permission: %v", err)
		}
		if !authorized {
			return nil, fmt.Errorf("unauthorized: insufficient permissions to view this export")
		}
	}

	return exportRequestBytes, nil
}

// CreateExport creates a new export request (alias for SubmitExport for consistency)
func (s *SmartContract) CreateExport(ctx contractapi.TransactionContextInterface, requestJSON string) error {
	return s.SubmitExport(ctx, requestJSON)
}

// UpdateExportStatus updates the status of an export request
func (s *SmartContract) UpdateExportStatus(ctx contractapi.TransactionContextInterface, exportID string, newStatus string) error {
	callerMSP, err := ctx.GetClientIdentity().GetMSPID()
	if err != nil {
		return fmt.Errorf("failed to get MSP ID: %v", err)
	}

	// Check permission to update export status
	authorized, err := s.authUtils.CheckPermission(ctx, callerMSP, shared.UpdateExportStatus)
	if err != nil {
		return fmt.Errorf("failed to check permission: %v", err)
	}
	if !authorized {
		return fmt.Errorf("unauthorized: insufficient permissions to update export status")
	}

	// Get current export request
	exportRequestBytes, err := ctx.GetStub().GetPrivateData("exportRequests", exportID)
	if err != nil {
		return fmt.Errorf("failed to read export request: %v", err)
	}
	if exportRequestBytes == nil {
		return fmt.Errorf("export request %s does not exist", exportID)
	}

	var exportRequest ExportRequest
	if err := json.Unmarshal(exportRequestBytes, &exportRequest); err != nil {
		return fmt.Errorf("failed to unmarshal export request: %v", err)
	}

	// Update status
	exportRequest.Status = newStatus

	// Store updated export request
	updatedRequestBytes, err := json.Marshal(exportRequest)
	if err != nil {
		return fmt.Errorf("failed to marshal updated export request: %v", err)
	}

	if err := ctx.GetStub().PutPrivateData("exportRequests", exportID, updatedRequestBytes); err != nil {
		return fmt.Errorf("failed to store updated export request: %v", err)
	}

	// Emit status update event
	if err := s.blockchainUtils.EmitStatusUpdateEvent(ctx, exportID, newStatus); err != nil {
		return fmt.Errorf("failed to emit status update event: %v", err)
	}

	return nil
}

func (s *SmartContract) SubmitExport(ctx contractapi.TransactionContextInterface, requestJSON string) error {
	callerMSP, err := ctx.GetClientIdentity().GetMSPID()
	if err != nil {
		return fmt.Errorf("failed to get MSP ID: %v", err)
	}

	authorized, err := s.authUtils.CheckPermission(ctx, callerMSP, shared.CreateExport)
	if err != nil {
		return fmt.Errorf("failed to check permission: %v", err)
	}
	if !authorized {
		return fmt.Errorf("unauthorized export submission attempt")
	}

	var req ExportRequest
	if err := json.Unmarshal([]byte(requestJSON), &req); err != nil {
		return fmt.Errorf("invalid request format")
	}

	// Store export request in private data (visible to exporter and bank)
	if err := ctx.GetStub().PutPrivateData("exportRequests", req.ExportID, []byte(requestJSON)); err != nil {
		return err
	}

	// Set initial status
	req.Status = "SUBMITTED"

	// Create approval chain for this export
	documentTypes := make([]shared.DocumentType, 0, len(req.Documents))
	for docType := range req.Documents {
		documentTypes = append(documentTypes, shared.DocumentType(docType))
	}

	approvalChain := shared.NewApprovalChain(req.ExportID, callerMSP, documentTypes)

	// Store approval chain
	chainJSON, err := approvalChain.ToJSON()
	if err != nil {
		return fmt.Errorf("failed to serialize approval chain: %v", err)
	}
	if err := ctx.GetStub().PutState(fmt.Sprintf("approval_chain_%s", req.ExportID), []byte(chainJSON)); err != nil {
		return fmt.Errorf("failed to store approval chain: %v", err)
	}

	// Trigger parallel validations using shared utilities
	for docType, doc := range req.Documents {
		// Store document metadata in private data collection
		docKey := fmt.Sprintf("%s_%s", req.ExportID, docType)
		docBytes, err := json.Marshal(doc)
		if err != nil {
			return fmt.Errorf("failed to marshal document metadata: %v", err)
		}

		// Store document metadata in private data collection
		if err := ctx.GetStub().PutPrivateData("exportDocuments", docKey, docBytes); err != nil {
			return fmt.Errorf("failed to store document metadata: %v", err)
		}

		// Assign to appropriate approval channel
		if err := s.approvalChannelMgr.AssignApprovalToChannel(
			ctx, req.ExportID, shared.DocumentType(docType), doc.Hash,
			map[string]interface{}{
				"ipfsCid":     doc.IPFSCID,
				"ipfsUrl":     doc.IPFSURL,
				"contentType": doc.ContentType,
				"size":        doc.Size,
				"encrypted":   doc.Encrypted,
				"exporter":    req.Exporter,
			},
		); err != nil {
			return fmt.Errorf("failed to assign to approval channel: %v", err)
		}

		// Emit validation event with both hash and IPFS CID
		if err := s.blockchainUtils.EmitValidationEvent(ctx, req.ExportID, docType, doc.Hash); err != nil {
			return fmt.Errorf("failed to emit validation event: %v", err)
		}
	}

	return nil
}

func (s *SmartContract) RecordValidationResult(
	ctx contractapi.TransactionContextInterface,
	exportID string,
	docType string,
	valid bool,
	reasons []string,
) error {
	callerMSP, err := ctx.GetClientIdentity().GetMSPID()
	if err != nil {
		return fmt.Errorf("failed to get MSP ID: %v", err)
	}

	authorized, err := s.authUtils.CheckPermission(ctx, callerMSP, getActionForDocType(docType))
	if err != nil {
		return fmt.Errorf("failed to check permission: %v", err)
	}
	if !authorized {
		return fmt.Errorf("unauthorized validation attempt")
	}

	// Store validation result using shared utilities
	if err := s.blockchainUtils.StoreValidationResult(ctx, exportID, docType, valid, reasons, callerMSP); err != nil {
		return fmt.Errorf("failed to store validation result: %v", err)
	}

	// Check if all validations are complete
	if s.checkAllValidationsComplete(ctx, exportID) {
		approved := s.isFullyApproved(ctx, exportID)
		if err := s.blockchainUtils.EmitExportEvent(ctx, exportID, approved); err != nil {
			return fmt.Errorf("failed to emit export event: %v", err)
		}
	}

	return nil
}

func (s *SmartContract) checkAllValidationsComplete(ctx contractapi.TransactionContextInterface, exportID string) bool {
	// Get the export request from private data
	exportRequestBytes, err := ctx.GetStub().GetPrivateData("exportRequests", exportID)
	if err != nil || exportRequestBytes == nil {
		return false
	}

	var exportRequest ExportRequest
	if err := json.Unmarshal(exportRequestBytes, &exportRequest); err != nil {
		return false
	}

	// Check if all documents have a validation result
	for docType := range exportRequest.Documents {
		validationResult, err := s.blockchainUtils.GetValidationResult(ctx, exportID, docType)
		if err != nil || validationResult == nil {
			return false
		}
	}

	return true
}

func (s *SmartContract) isFullyApproved(ctx contractapi.TransactionContextInterface, exportID string) bool {
	// Get the export request from private data
	exportRequestBytes, err := ctx.GetStub().GetPrivateData("exportRequests", exportID)
	if err != nil || exportRequestBytes == nil {
		return false
	}

	var exportRequest ExportRequest
	if err := json.Unmarshal(exportRequestBytes, &exportRequest); err != nil {
		return false
	}

	// Check if all validations are successful
	for docType := range exportRequest.Documents {
		validationResult, err := s.blockchainUtils.GetValidationResult(ctx, exportID, docType)
		if err != nil || validationResult == nil || !validationResult.Valid {
			return false
		}
	}

	return true
}
func getActionForDocType(docType string) shared.Action {
	switch docType {
	case "LICENSE":
		return shared.ValidateLicense
	case "INVOICE":
		return shared.ValidateInvoice
	case "QUALITY":
		return shared.ValidateQuality
	case "SHIPPING":
		return shared.ValidateShipping
	default:
		return ""
	}
}

// SubmitApprovalDecision processes an approval decision through the multi-channel system
func (s *SmartContract) SubmitApprovalDecision(
	ctx contractapi.TransactionContextInterface,
	exportID string,
	documentType string,
	decision string, // "APPROVED" or "REJECTED"
	comments string,
	reviewedBy string,
) error {
	callerMSP, err := ctx.GetClientIdentity().GetMSPID()
	if err != nil {
		return fmt.Errorf("failed to get MSP ID: %v", err)
	}

	// Check permission for this document type
	authorized, err := s.authUtils.CheckPermission(ctx, callerMSP, getActionForDocType(documentType))
	if err != nil {
		return fmt.Errorf("failed to check permission: %v", err)
	}
	if !authorized {
		return fmt.Errorf("unauthorized approval attempt")
	}

	// Determine organization from MSP
	org := getOrganizationFromMSP(callerMSP)
	if org == "" {
		return fmt.Errorf("unknown organization: %s", callerMSP)
	}

	// Process approval decision through channel manager
	var approvalStatus shared.ApprovalStageStatus
	if decision == "APPROVED" {
		approvalStatus = shared.StageStatusApproved
	} else if decision == "REJECTED" {
		approvalStatus = shared.StageStatusRejected
	} else {
		return fmt.Errorf("invalid decision: %s", decision)
	}

	if err := s.approvalChannelMgr.ProcessApprovalDecision(
		ctx,
		shared.OrganizationType(org),
		exportID,
		shared.DocumentType(documentType),
		approvalStatus,
		reviewedBy,
		comments,
	); err != nil {
		return fmt.Errorf("failed to process approval decision: %v", err)
	}

	// Update approval chain
	if err := s.updateApprovalChain(ctx, exportID, documentType, approvalStatus, reviewedBy, comments); err != nil {
		return fmt.Errorf("failed to update approval chain: %v", err)
	}

	return nil
}

// GetPendingApprovalsForOrganization returns pending approvals for a specific organization
func (s *SmartContract) GetPendingApprovalsForOrganization(
	ctx contractapi.TransactionContextInterface,
	organization string,
) ([]byte, error) {
	callerMSP, err := ctx.GetClientIdentity().GetMSPID()
	if err != nil {
		return nil, fmt.Errorf("failed to get MSP ID: %v", err)
	}

	// Verify caller belongs to the requested organization
	expectedMSP := organization + "MSP"
	if callerMSP != expectedMSP {
		return nil, fmt.Errorf("unauthorized access to organization data")
	}

	org := shared.OrganizationType(strings.ToUpper(organization))
	approvals, err := s.approvalChannelMgr.GetPendingApprovalsForOrganization(ctx, org)
	if err != nil {
		return nil, fmt.Errorf("failed to get pending approvals: %v", err)
	}

	result, err := json.Marshal(map[string]interface{}{
		"organization":     organization,
		"pendingApprovals": approvals,
		"count":            len(approvals),
	})
	if err != nil {
		return nil, fmt.Errorf("failed to marshal result: %v", err)
	}

	return result, nil
}

// GetBankSupervisorView returns global overview for bank supervisors
func (s *SmartContract) GetBankSupervisorView(
	ctx contractapi.TransactionContextInterface,
	exportID string,
) ([]byte, error) {
	callerMSP, err := ctx.GetClientIdentity().GetMSPID()
	if err != nil {
		return nil, fmt.Errorf("failed to get MSP ID: %v", err)
	}

	// Only bank supervisors can access this view
	if !isBankSupervisor(callerMSP) {
		return nil, fmt.Errorf("unauthorized: only bank supervisors can access this view")
	}

	view, err := s.approvalChannelMgr.GetBankSupervisorView(ctx, exportID)
	if err != nil {
		return nil, fmt.Errorf("failed to get supervisor view: %v", err)
	}

	result, err := json.Marshal(view)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal supervisor view: %v", err)
	}

	return result, nil
}

// GetAllExportsForSupervisor returns all exports for bank supervisor oversight
func (s *SmartContract) GetAllExportsForSupervisor(
	ctx contractapi.TransactionContextInterface,
) ([]byte, error) {
	callerMSP, err := ctx.GetClientIdentity().GetMSPID()
	if err != nil {
		return nil, fmt.Errorf("failed to get MSP ID: %v", err)
	}

	// Only bank supervisors can access this view
	if !isBankSupervisor(callerMSP) {
		return nil, fmt.Errorf("unauthorized: only bank supervisors can access this view")
	}

	views, err := s.approvalChannelMgr.GetAllExportsForSupervisor(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get all exports: %v", err)
	}

	result, err := json.Marshal(map[string]interface{}{
		"exports": views,
		"count":   len(views),
	})
	if err != nil {
		return nil, fmt.Errorf("failed to marshal exports: %v", err)
	}

	return result, nil
}

// updateApprovalChain updates the approval chain with the latest decision
func (s *SmartContract) updateApprovalChain(
	ctx contractapi.TransactionContextInterface,
	exportID string,
	documentType string,
	status shared.ApprovalStageStatus,
	reviewedBy string,
	comments string,
) error {
	// Get current approval chain
	chainBytes, err := ctx.GetStub().GetState(fmt.Sprintf("approval_chain_%s", exportID))
	if err != nil {
		return fmt.Errorf("failed to get approval chain: %v", err)
	}

	if chainBytes == nil {
		return fmt.Errorf("approval chain not found: %s", exportID)
	}

	var chain shared.ApprovalChain
	if err := json.Unmarshal(chainBytes, &chain); err != nil {
		return fmt.Errorf("failed to parse approval chain: %v", err)
	}

	// Find and update the corresponding stage
	for _, stage := range chain.Stages {
		if string(stage.DocumentType) == documentType {
			stageID := stage.ID
			if err := chain.UpdateStageStatus(stageID, status, reviewedBy, comments); err != nil {
				return fmt.Errorf("failed to update stage status: %v", err)
			}
			break
		}
	}

	// Store updated chain
	updatedChainJSON, err := chain.ToJSON()
	if err != nil {
		return fmt.Errorf("failed to serialize updated chain: %v", err)
	}

	return ctx.GetStub().PutState(fmt.Sprintf("approval_chain_%s", exportID), []byte(updatedChainJSON))
}

// Helper functions
func getOrganizationFromMSP(mspID string) string {
	switch mspID {
	case "NationalBankMSP":
		return "NATIONAL_BANK"
	case "ExporterBankMSP":
		return "EXPORTER_BANK"
	case "CoffeeAuthorityMSP":
		return "COFFEE_AUTHORITY"
	case "CustomsMSP":
		return "CUSTOMS"
	default:
		return ""
	}
}

func isBankSupervisor(mspID string) bool {
	// Bank supervisors can be from ExporterBankMSP or a dedicated supervisor MSP
	return mspID == "ExporterBankMSP" || mspID == "BankSupervisorMSP"
}

func (s *SmartContract) GetDocumentMetadata(ctx contractapi.TransactionContextInterface, exportID string, documentHash string) (*DocumentMetadata, error) {
	exportRequestBytes, err := ctx.GetStub().GetPrivateData("exportRequests", exportID)
	if err != nil {
		return nil, fmt.Errorf("failed to read export request from world state: %v", err)
	}
	if exportRequestBytes == nil {
		return nil, fmt.Errorf("export request %s does not exist", exportID)
	}

	var exportRequest ExportRequest
	if err := json.Unmarshal(exportRequestBytes, &exportRequest); err != nil {
		return nil, fmt.Errorf("failed to unmarshal export request: %v", err)
	}

	for _, doc := range exportRequest.Documents {
		if doc.Hash == documentHash {
			return &doc, nil
		}
	}

	return nil, fmt.Errorf("document with hash %s not found in export request %s", documentHash, exportID)
}

func (s *SmartContract) CreateUser(ctx contractapi.TransactionContextInterface, id, username, password, organization, role string) error {
	return s.userManagement.CreateUser(ctx, id, username, password, organization, role)
}

func (s *SmartContract) Login(ctx contractapi.TransactionContextInterface, username, password string) (string, error) {
	user, err := s.userManagement.GetUser(ctx, username)
	if err != nil {
		return "", err
	}

	// In a real application, you would compare the hashed password
	if user.PasswordHash != password {
		return "", fmt.Errorf("invalid credentials")
	}

	// For simplicity, we are returning the user object as a string.
	// In a real application, you would return a JWT token.
	userBytes, err := json.Marshal(user)
	if err != nil {
		return "", fmt.Errorf("failed to marshal user: %v", err)
	}

	return string(userBytes), nil
}

// GetCompletedApprovalsForOrganization returns completed approvals for a specific organization
func (s *SmartContract) GetCompletedApprovalsForOrganization(
	ctx contractapi.TransactionContextInterface,
	organization string,
) ([]byte, error) {
	callerMSP, err := ctx.GetClientIdentity().GetMSPID()
	if err != nil {
		return nil, fmt.Errorf("failed to get MSP ID: %v", err)
	}

	// Verify caller belongs to the requested organization
	expectedMSP := organization + "MSP"
	if callerMSP != expectedMSP {
		return nil, fmt.Errorf("unauthorized access to organization data")
	}

	org := shared.OrganizationType(strings.ToUpper(organization))
	approvals, err := s.approvalChannelMgr.GetCompletedApprovalsForOrganization(ctx, org)
	if err != nil {
		return nil, fmt.Errorf("failed to get completed approvals: %v", err)
	}

	result, err := json.Marshal(map[string]interface{}{
		"organization":       organization,
		"completedApprovals": approvals,
		"count":              len(approvals),
	})
	if err != nil {
		return nil, fmt.Errorf("failed to marshal result: %v", err)
	}

	return result, nil
}

// SearchDocuments searches for documents based on a query string
func (s *SmartContract) SearchDocuments(ctx contractapi.TransactionContextInterface, query string) ([]byte, error) {
	iterator, err := ctx.GetStub().GetPrivateDataByRange("exportRequests", "", "")
	if err != nil {
		return nil, fmt.Errorf("failed to get export requests: %v", err)
	}
	defer iterator.Close()

	var searchResults []ExportRequest
	for iterator.HasNext() {
		result, err := iterator.Next()
		if err != nil {
			return nil, err
		}

		var exportRequest ExportRequest
		if err := json.Unmarshal(result.Value, &exportRequest); err != nil {
			continue // Skip invalid entries
		}

		if strings.Contains(strings.ToLower(exportRequest.Exporter), strings.ToLower(query)) ||
			strings.Contains(strings.ToLower(exportRequest.ExportID), strings.ToLower(query)) {
			searchResults = append(searchResults, exportRequest)
			continue
		}

		for docType, doc := range exportRequest.Documents {
			if strings.Contains(strings.ToLower(docType), strings.ToLower(query)) ||
				strings.Contains(strings.ToLower(doc.Hash), strings.ToLower(query)) ||
				strings.Contains(strings.ToLower(doc.IPFSCID), strings.ToLower(query)) {
				searchResults = append(searchResults, exportRequest)
				break
			}
		}
	}

	resultBytes, err := json.Marshal(searchResults)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal search results: %v", err)
	}

	return resultBytes, nil
}

// GetActivityLog returns a log of recent activities for a given organization
func (s *SmartContract) GetActivityLog(ctx contractapi.TransactionContextInterface, organization string) ([]byte, error) {
	callerMSP, err := ctx.GetClientIdentity().GetMSPID()
	if err != nil {
		return nil, fmt.Errorf("failed to get MSP ID: %v", err)
	}

	// Verify caller belongs to the requested organization
	expectedMSP := organization + "MSP"
	if callerMSP != expectedMSP {
		return nil, fmt.Errorf("unauthorized access to organization data")
	}

	iterator, err := ctx.GetStub().GetStateByPartialCompositeKey("approval_result", []string{})
	if err != nil {
		return nil, err
	}
	defer iterator.Close()

	var activityLog []map[string]interface{}
	for iterator.HasNext() {
		result, err := iterator.Next()
		if err != nil {
			return nil, err
		}

		var approvalResult map[string]interface{}
		if err := json.Unmarshal(result.Value, &approvalResult); err != nil {
			continue // Skip invalid entries
		}

		if org, exists := approvalResult["organization"]; exists && org == organization {
			activityLog = append(activityLog, approvalResult)
		}
	}

	resultBytes, err := json.Marshal(activityLog)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal activity log: %v", err)
	}

	return resultBytes, nil
}

func main() {
	chaincode, err := contractapi.NewChaincode(NewSmartContract())
	if err != nil {
		fmt.Printf("Error creating coffee export chaincode: %s", err.Error())
		return
	}

	if err := chaincode.Start(); err != nil {
		fmt.Printf("Error starting coffee export chaincode: %s", err.Error())
	}
}
