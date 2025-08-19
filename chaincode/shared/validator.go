package shared

import (
	"encoding/json"
	"net/http"
	"os"
	"strings"
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

// ValidatorService provides common validation functionality
type ValidatorService struct {
	config ValidatorConfig
}

// NewValidatorService creates a new validator service with the given config
func NewValidatorService(config ValidatorConfig) *ValidatorService {
	return &ValidatorService{config: config}
}

// ValidateHandler is the standard HTTP handler for document validation
func (v *ValidatorService) ValidateHandler(w http.ResponseWriter, r *http.Request) {
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
	port := v.config.Port
	if port == "" {
		port = os.Getenv("PORT")
		if port == "" {
			port = "8080"
		}
	}
	
	return http.ListenAndServe(":"+port, nil)
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
