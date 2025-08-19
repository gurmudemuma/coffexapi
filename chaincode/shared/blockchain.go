package shared

import (
	"encoding/json"
	"fmt"
	"time"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// BlockchainEvent represents a standard blockchain event
type BlockchainEvent struct {
	EventType string      `json:"eventType"`
	ExportID  string      `json:"exportId"`
	Data      interface{} `json:"data"`
	Timestamp int64       `json:"timestamp"`
}

// ValidationResult represents a validation result
type ValidationResult struct {
	Valid       bool     `json:"valid"`
	Reasons     []string `json:"reasons"`
	ValidatedBy string   `json:"validatedBy"`
	Timestamp   int64    `json:"timestamp"`
}

// BlockchainUtils provides common blockchain operations
type BlockchainUtils struct{}

// NewBlockchainUtils creates a new blockchain utilities instance
func NewBlockchainUtils() *BlockchainUtils {
	return &BlockchainUtils{}
}

// EmitValidationEvent emits a validation event to the blockchain
func (b *BlockchainUtils) EmitValidationEvent(ctx contractapi.TransactionContextInterface, exportID, docType, hash string) error {
	event := BlockchainEvent{
		EventType: "validate_document",
		ExportID:  exportID,
		Data: map[string]string{
			"docType": docType,
			"hash":    hash,
		},
		Timestamp: time.Now().Unix(),
	}
	
	eventBytes, err := json.Marshal(event)
	if err != nil {
		return fmt.Errorf("failed to marshal event: %v", err)
	}
	
	return ctx.GetStub().SetEvent("validate_document", eventBytes)
}

// StoreValidationResult stores a validation result in the blockchain
func (b *BlockchainUtils) StoreValidationResult(
	ctx contractapi.TransactionContextInterface,
	exportID string,
	docType string,
	valid bool,
	reasons []string,
	validatedBy string,
) error {
	validationKey := fmt.Sprintf("validation_%s_%s", exportID, docType)
	
	result := ValidationResult{
		Valid:       valid,
		Reasons:     reasons,
		ValidatedBy: validatedBy,
		Timestamp:   time.Now().Unix(),
	}
	
	resultBytes, err := json.Marshal(result)
	if err != nil {
		return fmt.Errorf("failed to marshal validation result: %v", err)
	}
	
	return ctx.GetStub().PutState(validationKey, resultBytes)
}

// GetValidationResult retrieves a validation result from the blockchain
func (b *BlockchainUtils) GetValidationResult(ctx contractapi.TransactionContextInterface, exportID, docType string) (*ValidationResult, error) {
	validationKey := fmt.Sprintf("validation_%s_%s", exportID, docType)
	
	resultBytes, err := ctx.GetStub().GetState(validationKey)
	if err != nil {
		return nil, fmt.Errorf("failed to get validation result: %v", err)
	}
	
	if resultBytes == nil {
		return nil, nil
	}
	
	var result ValidationResult
	if err := json.Unmarshal(resultBytes, &result); err != nil {
		return nil, fmt.Errorf("failed to unmarshal validation result: %v", err)
	}
	
	return &result, nil
}

// EmitExportEvent emits an export approval/rejection event
func (b *BlockchainUtils) EmitExportEvent(ctx contractapi.TransactionContextInterface, exportID string, approved bool) error {
	eventType := "export_rejected"
	if approved {
		eventType = "export_approved"
	}
	
	event := BlockchainEvent{
		EventType: eventType,
		ExportID:  exportID,
		Data: map[string]bool{
			"approved": approved,
		},
		Timestamp: time.Now().Unix(),
	}
	
	eventBytes, err := json.Marshal(event)
	if err != nil {
		return fmt.Errorf("failed to marshal export event: %v", err)
	}
	
	return ctx.GetStub().SetEvent(eventType, eventBytes)
}
