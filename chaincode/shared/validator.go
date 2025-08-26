package shared

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"
)

// ValidatorConfig holds configuration for different validator types
type ValidatorConfig struct {
	ValidHashes map[string]bool
	ValidatorType string
	Port string
}

// ValidationResponse represents the standard response format
type ValidationResponse struct {
	Valid   bool     `json:"valid"`
	Reasons []string `json:"reasons"`
}

// ApprovalRequest represents a document approval request
type ApprovalRequest struct {
	DocumentHash string `json:"documentHash"`
	ExportId     string `json:"exportId"`
	Action       string `json:"action"` // "APPROVE" or "REJECT"
	Comments     string `json:"comments"`
	ReviewedBy   string `json:"reviewedBy"`
}

// ApprovalResponse represents the approval action response
type ApprovalResponse struct {
	Success   bool   `json:"success"`
	Message   string `json:"message"`
	Timestamp string `json:"timestamp"`
}

// ValidatorService provides common validation functionality
type ValidatorService struct {
	config ValidatorConfig
}

// NewValidatorService creates a new validator service with the given config
func NewValidatorService(config ValidatorConfig) *ValidatorService {
	return &ValidatorService{config: config}
}

// enableCORS adds CORS headers to responses
func (v *ValidatorService) enableCORS(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
}

// ValidateHandler is the standard HTTP handler for document validation
func (v *ValidatorService) ValidateHandler(w http.ResponseWriter, r *http.Request) {
	// Enable CORS
	v.enableCORS(w, r)
	if r.Method == "OPTIONS" {
		return
	}
	
	hash := r.URL.Query().Get("hash")
	valid, exists := v.config.ValidHashes[hash]

	response := ValidationResponse{
		Valid:   valid && exists,
		Reasons: []string{},
	}

	if !exists {
		response.Reasons = append(response.Reasons, "Document not found in registry")
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// StartServer starts the HTTP server with the validation handler
func (v *ValidatorService) StartServer() error {
	http.HandleFunc("/validate", v.ValidateHandler)
	http.HandleFunc("/approve", v.ApprovalHandler)
	http.HandleFunc("/health", v.HealthHandler)
	port := v.config.Port
	if port == "" {
		port = os.Getenv("PORT")
		if port == "" {
			port = "8080"
		}
	}
	
	return http.ListenAndServe(":"+port, nil)
}

// ApprovalHandler handles document approval/rejection requests
func (v *ValidatorService) ApprovalHandler(w http.ResponseWriter, r *http.Request) {
	// Enable CORS
	v.enableCORS(w, r)
	if r.Method == "OPTIONS" {
		return
	}
	
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req ApprovalRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Validate the document hash exists in our registry
	valid, exists := v.config.ValidHashes[req.DocumentHash]
	if !exists {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(ApprovalResponse{
			Success: false,
			Message: "Document not found in registry",
			Timestamp: getCurrentTimestamp(),
		})
		return
	}

	if !valid {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(ApprovalResponse{
			Success: false,
			Message: "Document is invalid and cannot be approved",
			Timestamp: getCurrentTimestamp(),
		})
		return
	}

	// Process the approval/rejection
	var message string
	switch req.Action {
	case "APPROVE":
		message = fmt.Sprintf("Document approved by %s: %s", req.ReviewedBy, req.Comments)
	case "REJECT":
		message = fmt.Sprintf("Document rejected by %s: %s", req.ReviewedBy, req.Comments)
	default:
		http.Error(w, "Invalid action. Must be APPROVE or REJECT", http.StatusBadRequest)
		return
	}

	// In a real implementation, this would record the approval on the blockchain
	// For now, we'll just return success
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(ApprovalResponse{
		Success: true,
		Message: message,
		Timestamp: getCurrentTimestamp(),
	})
}

// HealthHandler provides a health check endpoint
func (v *ValidatorService) HealthHandler(w http.ResponseWriter, r *http.Request) {
	// Enable CORS
	v.enableCORS(w, r)
	if r.Method == "OPTIONS" {
		return
	}
	
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status": "healthy",
		"validator_type": v.config.ValidatorType,
		"timestamp": getCurrentTimestamp(),
	})
}

// GetValidHashesFromEnv loads valid hashes from environment variables
// Format: VALID_HASHES=hash1,hash2,hash3
func GetValidHashesFromEnv(envKey string) map[string]bool {
	hashesStr := os.Getenv(envKey)
	if hashesStr == "" {
		return make(map[string]bool)
	}

	hashes := make(map[string]bool)
	// Parse comma-separated hashes
	for _, hash := range strings.Split(hashesStr, ",") {
		hashes[strings.TrimSpace(hash)] = true
	}
	return hashes
}

// getCurrentTimestamp returns the current timestamp in ISO format
func getCurrentTimestamp() string {
	return time.Now().UTC().Format(time.RFC3339)
}
