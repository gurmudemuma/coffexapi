package shared

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"log"
	"strings"
	"time"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// EventType represents different types of blockchain events
type EventType string

const (
	EventValidateDocument EventType = "validate_document"
	EventExportApproved   EventType = "export_approved"
	EventExportRejected   EventType = "export_rejected"
	EventPaymentReleased  EventType = "payment_released"
	EventSystemError      EventType = "system_error"
)

// BlockchainEvent represents a standard blockchain event with enhanced metadata
type BlockchainEvent struct {
	EventType    EventType   `json:"eventType"`
	ExportID     string      `json:"exportId"`
	TransactionID string     `json:"transactionId"`
	Data         interface{} `json:"data"`
	Timestamp    int64       `json:"timestamp"`
	Severity     string      `json:"severity,omitempty"` // INFO, WARN, ERROR
	Source       string      `json:"source,omitempty"`   // Originating service
	Hash         string      `json:"hash,omitempty"`     // Event content hash for integrity
}

// ValidationResult represents a validation result with enhanced tracking
type ValidationResult struct {
	Valid         bool      `json:"valid"`
	Reasons       []string  `json:"reasons"`
	ValidatedBy   string    `json:"validatedBy"`
	Timestamp     int64     `json:"timestamp"`
	Confidence    float64   `json:"confidence,omitempty"` // Validation confidence score (0.0-1.0)
	ReviewedBy    string    `json:"reviewedBy,omitempty"` // Human reviewer if applicable
	DocumentHash  string    `json:"documentHash"`
	ValidationID  string    `json:"validationId"`        // Unique validation identifier
	Metadata      map[string]interface{} `json:"metadata,omitempty"` // Additional validation metadata
}

// BlockchainUtils provides common blockchain operations with enhanced functionality
type BlockchainUtils struct {
	logger *log.Logger
}

// NewBlockchainUtils creates a new blockchain utilities instance
func NewBlockchainUtils() *BlockchainUtils {
	return &BlockchainUtils{
		logger: log.New(log.Writer(), "[BLOCKCHAIN] ", log.LstdFlags|log.Lshortfile),
	}
}

// NewBlockchainUtilsWithLogger creates a new blockchain utilities instance with custom logger
func NewBlockchainUtilsWithLogger(logger *log.Logger) *BlockchainUtils {
	return &BlockchainUtils{
		logger: logger,
	}
}

// generateEventHash generates a SHA256 hash of the event content for integrity verification
func (b *BlockchainUtils) generateEventHash(event *BlockchainEvent) string {
	eventCopy := *event
	eventCopy.Hash = "" // Exclude hash field from hash calculation
	
	eventBytes, err := json.Marshal(eventCopy)
	if err != nil {
		b.logger.Printf("Failed to marshal event for hashing: %v", err)
		return ""
	}
	
	hash := sha256.Sum256(eventBytes)
	return hex.EncodeToString(hash[:])
}

// validateEventData validates event data consistency
func (b *BlockchainUtils) validateEventData(eventType EventType, data interface{}) error {
	switch eventType {
	case EventValidateDocument:
		if data == nil {
			return fmt.Errorf("validation event requires data")
		}
		dataMap, ok := data.(map[string]string)
		if !ok {
			return fmt.Errorf("validation event data must be map[string]string")
		}
		if dataMap["docType"] == "" || dataMap["hash"] == "" {
			return fmt.Errorf("validation event requires docType and hash")
		}
	case EventExportApproved, EventExportRejected:
		if data == nil {
			return fmt.Errorf("export status event requires data")
		}
		dataMap, ok := data.(map[string]interface{})
		if !ok {
			return fmt.Errorf("export status event data must be map[string]interface{}")
		}
		if _, exists := dataMap["approved"]; !exists {
			return fmt.Errorf("export status event requires approved field")
		}
	}
	return nil
}

// EmitValidationEvent emits a validation event to the blockchain with enhanced metadata
func (b *BlockchainUtils) EmitValidationEvent(ctx contractapi.TransactionContextInterface, exportID, docType, hash string) error {
	if exportID == "" || docType == "" || hash == "" {
		return fmt.Errorf("emitValidationEvent: all parameters (exportID, docType, hash) are required")
	}
	
	// Validate document type
	validDocTypes := []string{"LICENSE", "INVOICE", "QUALITY", "SHIPPING"}
	var isValidDocType bool
	for _, validType := range validDocTypes {
		if strings.ToUpper(docType) == validType {
			isValidDocType = true
			break
		}
	}
	if !isValidDocType {
		return fmt.Errorf("invalid document type: %s. Valid types: %v", docType, validDocTypes)
	}
	
	txID := ctx.GetStub().GetTxID()
	
	event := BlockchainEvent{
		EventType:     EventValidateDocument,
		ExportID:      exportID,
		TransactionID: txID,
		Data: map[string]string{
			"docType": strings.ToUpper(docType),
			"hash":    hash,
		},
		Timestamp: time.Now().Unix(),
		Severity:  "INFO",
		Source:    "smart-contract",
	}
	
	// Generate event hash for integrity
	event.Hash = b.generateEventHash(&event)
	
	// Validate event data
	if err := b.validateEventData(event.EventType, event.Data); err != nil {
		b.logger.Printf("Event validation failed: %v", err)
		return fmt.Errorf("event validation failed: %v", err)
	}
	
	eventBytes, err := json.Marshal(event)
	if err != nil {
		b.logger.Printf("Failed to marshal validation event: %v", err)
		return fmt.Errorf("failed to marshal event: %v", err)
	}
	
	b.logger.Printf("Emitting validation event for export %s, docType %s, hash %s", exportID, docType, hash)
	
	return ctx.GetStub().SetEvent(string(EventValidateDocument), eventBytes)
}

// StoreValidationResult stores a validation result in the blockchain with comprehensive tracking
func (b *BlockchainUtils) StoreValidationResult(
	ctx contractapi.TransactionContextInterface,
	exportID string,
	docType string,
	valid bool,
	reasons []string,
	validatedBy string,
) error {
	if exportID == "" || docType == "" || validatedBy == "" {
		return fmt.Errorf("storeValidationResult: exportID, docType, and validatedBy are required")
	}
	
	validationKey := fmt.Sprintf("validation_%s_%s", exportID, strings.ToUpper(docType))
	validationID := fmt.Sprintf("%s_%s_%d", exportID, docType, time.Now().UnixNano())
	txID := ctx.GetStub().GetTxID()
	
	// Check if validation already exists
	existingResultBytes, err := ctx.GetStub().GetState(validationKey)
	if err != nil {
		b.logger.Printf("Error checking existing validation: %v", err)
		return fmt.Errorf("failed to check existing validation: %v", err)
	}
	
	if existingResultBytes != nil {
		b.logger.Printf("Warning: Overwriting existing validation for %s", validationKey)
	}
	
	// Calculate confidence score based on reasons
	confidence := 1.0
	if !valid && len(reasons) > 0 {
		// Lower confidence if there are multiple failure reasons
		confidence = 1.0 / float64(len(reasons)+1)
	}
	
	result := ValidationResult{
		Valid:         valid,
		Reasons:       reasons,
		ValidatedBy:   validatedBy,
		Timestamp:     time.Now().Unix(),
		Confidence:    confidence,
		DocumentHash:  "", // To be set by caller if available
		ValidationID:  validationID,
		Metadata: map[string]interface{}{
			"transactionId": txID,
			"docType":       strings.ToUpper(docType),
			"exportId":      exportID,
		},
	}
	
	resultBytes, err := json.Marshal(result)
	if err != nil {
		b.logger.Printf("Failed to marshal validation result: %v", err)
		return fmt.Errorf("failed to marshal validation result: %v", err)
	}
	
	b.logger.Printf("Storing validation result for export %s, docType %s, valid: %t", exportID, docType, valid)
	
	// Store the validation result
	if err := ctx.GetStub().PutState(validationKey, resultBytes); err != nil {
		b.logger.Printf("Failed to store validation result: %v", err)
		return fmt.Errorf("failed to store validation result: %v", err)
	}
	
	// Store additional index for validation history
	historyKey := fmt.Sprintf("validation_history_%s_%s", exportID, validationID)
	if err := ctx.GetStub().PutState(historyKey, resultBytes); err != nil {
		b.logger.Printf("Failed to store validation history: %v", err)
		// Don't fail the main operation if history storage fails
	}
	
	return nil
}

// GetValidationResult retrieves a validation result from the blockchain with enhanced error handling
func (b *BlockchainUtils) GetValidationResult(ctx contractapi.TransactionContextInterface, exportID, docType string) (*ValidationResult, error) {
	if exportID == "" || docType == "" {
		return nil, fmt.Errorf("getValidationResult: exportID and docType are required")
	}
	
	validationKey := fmt.Sprintf("validation_%s_%s", exportID, strings.ToUpper(docType))
	
	b.logger.Printf("Retrieving validation result for key: %s", validationKey)
	
	resultBytes, err := ctx.GetStub().GetState(validationKey)
	if err != nil {
		b.logger.Printf("Failed to get validation result for %s: %v", validationKey, err)
		return nil, fmt.Errorf("failed to get validation result: %v", err)
	}
	
	if resultBytes == nil {
		b.logger.Printf("No validation result found for %s", validationKey)
		return nil, nil
	}
	
	var result ValidationResult
	if err := json.Unmarshal(resultBytes, &result); err != nil {
		b.logger.Printf("Failed to unmarshal validation result for %s: %v", validationKey, err)
		return nil, fmt.Errorf("failed to unmarshal validation result: %v", err)
	}
	
	b.logger.Printf("Retrieved validation result for %s: valid=%t, validatedBy=%s", validationKey, result.Valid, result.ValidatedBy)
	
	return &result, nil
}

// GetValidationHistory retrieves all validation attempts for an export
func (b *BlockchainUtils) GetValidationHistory(ctx contractapi.TransactionContextInterface, exportID string) ([]*ValidationResult, error) {
	if exportID == "" {
		return nil, fmt.Errorf("getValidationHistory: exportID is required")
	}
	
	historyPrefix := fmt.Sprintf("validation_history_%s_", exportID)
	resultsIterator, err := ctx.GetStub().GetStateByPartialCompositeKey("validation_history", []string{exportID})
	if err != nil {
		b.logger.Printf("Failed to get validation history for %s: %v", exportID, err)
		return nil, fmt.Errorf("failed to get validation history: %v", err)
	}
	defer resultsIterator.Close()
	
	var history []*ValidationResult
	for resultsIterator.HasNext() {
		response, err := resultsIterator.Next()
		if err != nil {
			b.logger.Printf("Error iterating validation history: %v", err)
			continue
		}
		
		var result ValidationResult
		if err := json.Unmarshal(response.Value, &result); err != nil {
			b.logger.Printf("Error unmarshaling validation history item: %v", err)
			continue
		}
		
		history = append(history, &result)
	}
	
	return history, nil
}

// EmitExportEvent emits an export approval/rejection event with comprehensive metadata
func (b *BlockchainUtils) EmitExportEvent(ctx contractapi.TransactionContextInterface, exportID string, approved bool) error {
	if exportID == "" {
		return fmt.Errorf("emitExportEvent: exportID is required")
	}
	
	var eventType EventType
	var severity string
	if approved {
		eventType = EventExportApproved
		severity = "INFO"
	} else {
		eventType = EventExportRejected
		severity = "WARN"
	}
	
	txID := ctx.GetStub().GetTxID()
	
	event := BlockchainEvent{
		EventType:     eventType,
		ExportID:      exportID,
		TransactionID: txID,
		Data: map[string]interface{}{
			"approved":    approved,
			"finalStatus": map[string]interface{}{
				"approved":  approved,
				"timestamp": time.Now().Unix(),
				"txId":      txID,
			},
		},
		Timestamp: time.Now().Unix(),
		Severity:  severity,
		Source:    "smart-contract",
	}
	
	// Generate event hash for integrity
	event.Hash = b.generateEventHash(&event)
	
	// Validate event data
	if err := b.validateEventData(event.EventType, event.Data); err != nil {
		b.logger.Printf("Export event validation failed: %v", err)
		return fmt.Errorf("event validation failed: %v", err)
	}
	
	eventBytes, err := json.Marshal(event)
	if err != nil {
		b.logger.Printf("Failed to marshal export event: %v", err)
		return fmt.Errorf("failed to marshal export event: %v", err)
	}
	
	b.logger.Printf("Emitting export event for %s: approved=%t", exportID, approved)
	
	return ctx.GetStub().SetEvent(string(eventType), eventBytes)
}

// EmitPaymentEvent emits a payment release event
func (b *BlockchainUtils) EmitPaymentEvent(ctx contractapi.TransactionContextInterface, exportID string, amount float64, currency string) error {
	if exportID == "" {
		return fmt.Errorf("emitPaymentEvent: exportID is required")
	}
	
	txID := ctx.GetStub().GetTxID()
	
	event := BlockchainEvent{
		EventType:     EventPaymentReleased,
		ExportID:      exportID,
		TransactionID: txID,
		Data: map[string]interface{}{
			"amount":   amount,
			"currency": currency,
			"txId":     txID,
		},
		Timestamp: time.Now().Unix(),
		Severity:  "INFO",
		Source:    "smart-contract",
	}
	
	// Generate event hash for integrity
	event.Hash = b.generateEventHash(&event)
	
	eventBytes, err := json.Marshal(event)
	if err != nil {
		b.logger.Printf("Failed to marshal payment event: %v", err)
		return fmt.Errorf("failed to marshal payment event: %v", err)
	}
	
	b.logger.Printf("Emitting payment event for %s: amount=%.2f %s", exportID, amount, currency)
	
	return ctx.GetStub().SetEvent(string(EventPaymentReleased), eventBytes)
}

// EmitSystemErrorEvent emits a system error event for monitoring
func (b *BlockchainUtils) EmitSystemErrorEvent(ctx contractapi.TransactionContextInterface, exportID, errorMsg, source string) error {
	txID := ctx.GetStub().GetTxID()
	
	event := BlockchainEvent{
		EventType:     EventSystemError,
		ExportID:      exportID,
		TransactionID: txID,
		Data: map[string]interface{}{
			"error":  errorMsg,
			"source": source,
			"txId":   txID,
		},
		Timestamp: time.Now().Unix(),
		Severity:  "ERROR",
		Source:    source,
	}
	
	// Generate event hash for integrity
	event.Hash = b.generateEventHash(&event)
	
	eventBytes, err := json.Marshal(event)
	if err != nil {
		b.logger.Printf("Failed to marshal system error event: %v", err)
		return fmt.Errorf("failed to marshal system error event: %v", err)
	}
	
	b.logger.Printf("Emitting system error event for %s: %s", exportID, errorMsg)
	
	return ctx.GetStub().SetEvent(string(EventSystemError), eventBytes)
}
