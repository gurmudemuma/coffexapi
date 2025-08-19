package main

import (
	"encoding/json"
	"fmt"

	"github.com/coffex/chaincode/shared"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// DocumentMetadata contains IPFS and validation information for a document
type DocumentMetadata struct {
	Hash        string `json:"hash"`         // SHA-256 hash of the original document
	IPFSCID     string `json:"ipfsCid"`      // IPFS Content Identifier
	IPFSURL     string `json:"ipfsUrl"`      // IPFS Gateway URL
	IV          string `json:"iv"`           // Initialization Vector for decryption
	Encrypted   bool   `json:"encrypted"`    // Whether the document is encrypted
	UploadedAt  int64  `json:"uploadedAt"`   // Timestamp when document was uploaded to IPFS
	ContentType string `json:"contentType"`  // MIME type of the document
	Size        int64  `json:"size"`         // Size of the document in bytes
}

type ExportRequest struct {
	ExportID       string                     `json:"exportId"`
	Documents      map[string]DocumentMetadata `json:"documents"` // docType -> DocumentMetadata
	Exporter       string                     `json:"exporter"`  // MSP ID of the exporter
	Timestamp      int64                      `json:"timestamp"` // When the export was created
	Status         string                     `json:"status"`    // Status of the export
}

type SmartContract struct {
	blockchainUtils *shared.BlockchainUtils
	authUtils       *shared.AuthUtils
}

func NewSmartContract() *SmartContract {
	return &SmartContract{
		blockchainUtils: shared.NewBlockchainUtils(),
		authUtils:       shared.NewAuthUtils(),
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