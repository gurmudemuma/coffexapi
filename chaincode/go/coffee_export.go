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
}

func NewSmartContract() *SmartContract {
	return &SmartContract{
		blockchainUtils:    shared.NewBlockchainUtils(),
		authUtils:          shared.NewAuthUtils(),
		approvalChannelMgr: shared.NewApprovalChannelManager(),
	}
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
