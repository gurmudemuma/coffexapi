package shared

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"sync"
	"time"
)

// ResponseCode represents standardized response codes
type ResponseCode string

const (
	CodeSuccess            ResponseCode = "SUCCESS"
	CodeValidationFailed   ResponseCode = "VALIDATION_FAILED"
	CodeDocumentNotFound   ResponseCode = "DOCUMENT_NOT_FOUND"
	CodeInvalidRequest     ResponseCode = "INVALID_REQUEST"
	CodeInternalError      ResponseCode = "INTERNAL_ERROR"
	CodeUnauthorized       ResponseCode = "UNAUTHORIZED"
	CodeRateLimitExceeded  ResponseCode = "RATE_LIMIT_EXCEEDED"
	CodeServiceUnavailable ResponseCode = "SERVICE_UNAVAILABLE"
)

// ValidatorConfig holds configuration for different validator types with enhanced settings
type ValidatorConfig struct {
	ValidatorType     string            `json:"validatorType"`
	Port              string            `json:"port"`
	Host              string            `json:"host"`
	ValidHashes       map[string]bool   `json:"validHashes"`
	Endpoint          string            `json:"endpoint"`
	HealthCheckPath   string            `json:"healthCheckPath"`
	Timeout           time.Duration     `json:"timeout"`
	RetryAttempts     int               `json:"retryAttempts"`
	TLSEnabled        bool              `json:"tlsEnabled"`
	AuthEnabled       bool              `json:"authEnabled"`
	APIKey            string            `json:"apiKey,omitempty"`
	RateLimitEnabled  bool              `json:"rateLimitEnabled"`
	MaxRequestsPerMin int               `json:"maxRequestsPerMin"`
	Metadata          map[string]string `json:"metadata,omitempty"`
	Environment       string            `json:"environment"`
}

// StandardResponse represents the standard API response format
type StandardResponse struct {
	Success      bool         `json:"success"`
	Code         ResponseCode `json:"code"`
	Message      string       `json:"message"`
	Data         interface{}  `json:"data,omitempty"`
	Timestamp    int64        `json:"timestamp"`
	RequestID    string       `json:"requestId,omitempty"`
	ResponseTime string       `json:"responseTime,omitempty"`
	Version      string       `json:"version,omitempty"`
}

// ValidationResponse represents the standard validation response format
type ValidationResponse struct {
	Valid        bool     `json:"valid"`
	Reasons      []string `json:"reasons"`
	Confidence   float64  `json:"confidence"`
	ValidatedAt  int64    `json:"validatedAt"`
	ValidatedBy  string   `json:"validatedBy"`
	DocumentHash string   `json:"documentHash"`
	Metadata     map[string]interface{} `json:"metadata,omitempty"`
}

// ApprovalRequest represents a document approval request
type ApprovalRequest struct {
	DocumentHash string `json:"documentHash"`
	ExportId     string `json:"exportId"`
	Action       string `json:"action"` // "APPROVE" or "REJECT"
	Comments     string `json:"comments"`
	ReviewedBy   string `json:"reviewedBy"`
	Metadata     map[string]interface{} `json:"metadata,omitempty"`
}

// ApprovalResponse represents the approval action response
type ApprovalResponse struct {
	Success      bool                   `json:"success"`
	Message      string                 `json:"message"`
	Timestamp    int64                  `json:"timestamp"`
	ApprovalId   string                 `json:"approvalId,omitempty"`
	ExportId     string                 `json:"exportId"`
	Action       string                 `json:"action"`
	ReviewedBy   string                 `json:"reviewedBy"`
	Metadata     map[string]interface{} `json:"metadata,omitempty"`
}

// Metrics holds service metrics
type Metrics struct {
	TotalRequests        int64 `json:"totalRequests"`
	SuccessfulRequests   int64 `json:"successfulRequests"`
	FailedRequests       int64 `json:"failedRequests"`
	ValidationRequests   int64 `json:"validationRequests"`
	ApprovalRequests     int64 `json:"approvalRequests"`
	AverageResponseTime  int64 `json:"averageResponseTime"`
	LastRequestTimestamp int64 `json:"lastRequestTimestamp"`
	Uptime               int64 `json:"uptime"`
}

// ValidatorService provides common validation functionality with enhanced features
type ValidatorService struct {
	config      ValidatorConfig
	logger      *log.Logger
	metrics     *Metrics
	metricsLock sync.RWMutex
	startTime   time.Time
	version     string
}

// NewValidatorService creates a new validator service with the given config and enhanced features
func NewValidatorService(config ValidatorConfig) *ValidatorService {
	return &ValidatorService{
		config:    config,
		logger:    log.New(os.Stdout, fmt.Sprintf("[%s-VALIDATOR] ", strings.ToUpper(config.ValidatorType)), log.LstdFlags|log.Lshortfile),
		metrics:   &Metrics{},
		startTime: time.Now(),
		version:   getEnvOrDefault("VALIDATOR_VERSION", "1.0.0"),
	}
}

// Helper functions

func getEnvOrDefault(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func (v *ValidatorService) generateRequestID() string {
	return fmt.Sprintf("%s-%d-%d", v.config.ValidatorType, time.Now().UnixNano(), os.Getpid())
}

func (v *ValidatorService) updateMetrics(success bool, duration time.Duration) {
	v.metricsLock.Lock()
	defer v.metricsLock.Unlock()
	
	v.metrics.TotalRequests++
	v.metrics.LastRequestTimestamp = time.Now().Unix()
	
	if success {
		v.metrics.SuccessfulRequests++
	} else {
		v.metrics.FailedRequests++
	}
	
	// Update average response time (simple moving average)
	if v.metrics.TotalRequests == 1 {
		v.metrics.AverageResponseTime = duration.Milliseconds()
	} else {
		v.metrics.AverageResponseTime = (v.metrics.AverageResponseTime + duration.Milliseconds()) / 2
	}
	
	v.metrics.Uptime = time.Since(v.startTime).Milliseconds()
}

// writeStandardResponse writes a standardized JSON response
func (v *ValidatorService) writeStandardResponse(w http.ResponseWriter, statusCode int, success bool, code ResponseCode, message string, data interface{}, requestID string, startTime time.Time) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("X-Validator-Type", v.config.ValidatorType)
	w.Header().Set("X-Request-ID", requestID)
	w.Header().Set("X-Version", v.version)
	w.WriteHeader(statusCode)
	
	response := StandardResponse{
		Success:      success,
		Code:         code,
		Message:      message,
		Data:         data,
		Timestamp:    time.Now().Unix(),
		RequestID:    requestID,
		ResponseTime: time.Since(startTime).String(),
		Version:      v.version,
	}
	
	if err := json.NewEncoder(w).Encode(response); err != nil {
		v.logger.Printf("Error encoding response: %v", err)
	}
}

// enableCORS adds CORS headers to responses with enhanced configuration
func (v *ValidatorService) enableCORS(w http.ResponseWriter, r *http.Request) {
	allowedOrigins := getEnvOrDefault("CORS_ALLOWED_ORIGINS", "*")
	allowedMethods := getEnvOrDefault("CORS_ALLOWED_METHODS", "GET, POST, PUT, DELETE, OPTIONS")
	allowedHeaders := getEnvOrDefault("CORS_ALLOWED_HEADERS", "Content-Type, Authorization, X-Request-ID")
	
	w.Header().Set("Access-Control-Allow-Origin", allowedOrigins)
	w.Header().Set("Access-Control-Allow-Methods", allowedMethods)
	w.Header().Set("Access-Control-Allow-Headers", allowedHeaders)
	w.Header().Set("Access-Control-Expose-Headers", "X-Request-ID, X-Response-Time, X-Validator-Type")
	w.Header().Set("Access-Control-Max-Age", "86400")
}

// ValidateHandler is the enhanced HTTP handler for document validation
func (v *ValidatorService) ValidateHandler(w http.ResponseWriter, r *http.Request) {
	startTime := time.Now()
	requestID := v.generateRequestID()
	
	// Enable CORS
	v.enableCORS(w, r)
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}
	
	// Log request
	v.logger.Printf("[%s] %s %s from %s - Started", requestID, r.Method, r.URL.Path, r.RemoteAddr)
	
	// Method validation
	if r.Method != http.MethodGet {
		v.writeStandardResponse(w, http.StatusMethodNotAllowed, false, CodeInvalidRequest,
			"Method not allowed. Only GET is supported.", nil, requestID, startTime)
		v.updateMetrics(false, time.Since(startTime))
		return
	}
	
	// Extract and validate hash parameter
	hash := r.URL.Query().Get("hash")
	if hash == "" {
		v.writeStandardResponse(w, http.StatusBadRequest, false, CodeInvalidRequest,
			"Missing required parameter: hash", nil, requestID, startTime)
		v.updateMetrics(false, time.Since(startTime))
		return
	}
	
	// Validate hash format (basic validation)
	if len(hash) < 8 || len(hash) > 128 {
		v.writeStandardResponse(w, http.StatusBadRequest, false, CodeInvalidRequest,
			"Invalid hash format. Hash length must be between 8 and 128 characters.", nil, requestID, startTime)
		v.updateMetrics(false, time.Since(startTime))
		return
	}
	
	// Check if hash exists in registry
	valid, exists := v.config.ValidHashes[hash]
	if !exists {
		v.logger.Printf("[%s] Document hash not found in registry: %s", requestID, hash)
		
		validationResponse := ValidationResponse{
			Valid:        false,
			Reasons:      []string{"Document not found in registry"},
			Confidence:   0.0,
			ValidatedAt:  time.Now().Unix(),
			ValidatedBy:  v.config.ValidatorType,
			DocumentHash: hash,
			Metadata: map[string]interface{}{
				"registrySize": len(v.config.ValidHashes),
				"validator":    v.config.ValidatorType,
			},
		}
		
		v.writeStandardResponse(w, http.StatusOK, true, CodeDocumentNotFound,
			"Document validation completed", validationResponse, requestID, startTime)
		v.updateMetrics(true, time.Since(startTime))
		v.metrics.ValidationRequests++
		return
	}
	
	// Document found, return validation result
	confidence := 1.0
	reasons := []string{}
	code := CodeSuccess
	
	if !valid {
		reasons = append(reasons, "Document failed validation checks")
		confidence = 0.0
		code = CodeValidationFailed
	}
	
	validationResponse := ValidationResponse{
		Valid:        valid,
		Reasons:      reasons,
		Confidence:   confidence,
		ValidatedAt:  time.Now().Unix(),
		ValidatedBy:  v.config.ValidatorType,
		DocumentHash: hash,
		Metadata: map[string]interface{}{
			"registrySize": len(v.config.ValidHashes),
			"validator":    v.config.ValidatorType,
			"requestTime":  startTime.Unix(),
		},
	}
	
	v.logger.Printf("[%s] Document validation completed: hash=%s, valid=%t", requestID, hash, valid)
	
	v.writeStandardResponse(w, http.StatusOK, true, code,
		"Document validation completed", validationResponse, requestID, startTime)
	v.updateMetrics(true, time.Since(startTime))
	v.metrics.ValidationRequests++
}

// StartServer starts the HTTP server with the validation handler and enhanced features
func (v *ValidatorService) StartServer() error {
	// Set up routes
	http.HandleFunc("/validate", v.ValidateHandler)
	http.HandleFunc("/approve", v.ApprovalHandler)
	http.HandleFunc("/health", v.HealthHandler)
	http.HandleFunc("/metrics", v.MetricsHandler)
	http.HandleFunc("/status", v.StatusHandler)
	
	// Determine port
	port := v.config.Port
	if port == "" {
		port = os.Getenv("PORT")
		if port == "" {
			port = "8080"
		}
	}
	
	v.logger.Printf("Starting %s validator service on port %s (version: %s)", v.config.ValidatorType, port, v.version)
	v.logger.Printf("Environment: %s, Registry size: %d documents", v.config.Environment, len(v.config.ValidHashes))
	v.logger.Printf("Available endpoints: /validate, /approve, /health, /metrics, /status")
	
	// Create server with timeouts
	server := &http.Server{
		Addr:           ":" + port,
		ReadTimeout:    30 * time.Second,
		WriteTimeout:   30 * time.Second,
		IdleTimeout:    120 * time.Second,
		MaxHeaderBytes: 1 << 20, // 1 MB
	}
	
	return server.ListenAndServe()
}

// ApprovalHandler handles document approval/rejection requests with enhanced functionality
func (v *ValidatorService) ApprovalHandler(w http.ResponseWriter, r *http.Request) {
	startTime := time.Now()
	requestID := v.generateRequestID()
	
	// Enable CORS
	v.enableCORS(w, r)
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}
	
	v.logger.Printf("[%s] %s %s from %s - Approval request started", requestID, r.Method, r.URL.Path, r.RemoteAddr)
	
	// Method validation
	if r.Method != http.MethodPost {
		v.writeStandardResponse(w, http.StatusMethodNotAllowed, false, CodeInvalidRequest,
			"Method not allowed. Only POST is supported.", nil, requestID, startTime)
		v.updateMetrics(false, time.Since(startTime))
		return
	}
	
	// Parse request body
	var req ApprovalRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		v.logger.Printf("[%s] Failed to decode approval request: %v", requestID, err)
		v.writeStandardResponse(w, http.StatusBadRequest, false, CodeInvalidRequest,
			"Invalid request body. Expected JSON format.", nil, requestID, startTime)
		v.updateMetrics(false, time.Since(startTime))
		return
	}
	
	// Validate required fields
	if req.DocumentHash == "" {
		v.writeStandardResponse(w, http.StatusBadRequest, false, CodeInvalidRequest,
			"Missing required field: documentHash", nil, requestID, startTime)
		v.updateMetrics(false, time.Since(startTime))
		return
	}
	
	if req.Action != "APPROVE" && req.Action != "REJECT" {
		v.writeStandardResponse(w, http.StatusBadRequest, false, CodeInvalidRequest,
			"Invalid action. Must be 'APPROVE' or 'REJECT'.", nil, requestID, startTime)
		v.updateMetrics(false, time.Since(startTime))
		return
	}
	
	// Validate the document hash exists in our registry
	valid, exists := v.config.ValidHashes[req.DocumentHash]
	if !exists {
		v.logger.Printf("[%s] Approval request for unknown document: %s", requestID, req.DocumentHash)
		
		approvalResp := ApprovalResponse{
			Success:    false,
			Message:    "Document not found in registry",
			Timestamp:  time.Now().Unix(),
			ExportId:   req.ExportId,
			Action:     req.Action,
			ReviewedBy: req.ReviewedBy,
			Metadata: map[string]interface{}{
				"reason": "Document hash not found in validator registry",
				"validator": v.config.ValidatorType,
			},
		}
		
		v.writeStandardResponse(w, http.StatusOK, false, CodeDocumentNotFound,
			"Document not found in registry", approvalResp, requestID, startTime)
		v.updateMetrics(true, time.Since(startTime))
		v.metrics.ApprovalRequests++
		return
	}
	
	// Check if document is valid for approval
	if req.Action == "APPROVE" && !valid {
		v.logger.Printf("[%s] Attempted to approve invalid document: %s", requestID, req.DocumentHash)
		
		approvalResp := ApprovalResponse{
			Success:    false,
			Message:    "Document is invalid and cannot be approved",
			Timestamp:  time.Now().Unix(),
			ExportId:   req.ExportId,
			Action:     req.Action,
			ReviewedBy: req.ReviewedBy,
			Metadata: map[string]interface{}{
				"reason": "Document failed validation checks",
				"validator": v.config.ValidatorType,
			},
		}
		
		v.writeStandardResponse(w, http.StatusOK, false, CodeValidationFailed,
			"Document is invalid and cannot be approved", approvalResp, requestID, startTime)
		v.updateMetrics(true, time.Since(startTime))
		v.metrics.ApprovalRequests++
		return
	}
	
	// Process the approval/rejection
	approvalID := fmt.Sprintf("%s-%s-%d", v.config.ValidatorType, req.Action, time.Now().UnixNano())
	message := fmt.Sprintf("Document %s by %s: %s", strings.ToLower(req.Action), req.ReviewedBy, req.Comments)
	
	approvalResp := ApprovalResponse{
		Success:    true,
		Message:    message,
		Timestamp:  time.Now().Unix(),
		ApprovalId: approvalID,
		ExportId:   req.ExportId,
		Action:     req.Action,
		ReviewedBy: req.ReviewedBy,
		Metadata: map[string]interface{}{
			"validator": v.config.ValidatorType,
			"comments":  req.Comments,
			"requestId": requestID,
		},
	}
	
	v.logger.Printf("[%s] Document %s processed: hash=%s, action=%s, reviewer=%s",
		requestID, strings.ToLower(req.Action), req.DocumentHash, req.Action, req.ReviewedBy)
	
	v.writeStandardResponse(w, http.StatusOK, true, CodeSuccess,
		"Approval processed successfully", approvalResp, requestID, startTime)
	v.updateMetrics(true, time.Since(startTime))
	v.metrics.ApprovalRequests++
}

// HealthHandler provides a comprehensive health check endpoint
func (v *ValidatorService) HealthHandler(w http.ResponseWriter, r *http.Request) {
	startTime := time.Now()
	requestID := v.generateRequestID()
	
	// Enable CORS
	v.enableCORS(w, r)
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}
	
	if r.Method != http.MethodGet {
		v.writeStandardResponse(w, http.StatusMethodNotAllowed, false, CodeInvalidRequest,
			"Method not allowed. Only GET is supported.", nil, requestID, startTime)
		return
	}
	
	// Perform health checks
	healthData := map[string]interface{}{
		"status":         "healthy",
		"validatorType":  v.config.ValidatorType,
		"version":        v.version,
		"environment":    v.config.Environment,
		"uptime":         time.Since(v.startTime).String(),
		"uptimeSeconds":  time.Since(v.startTime).Seconds(),
		"registrySize":   len(v.config.ValidHashes),
		"configuration": map[string]interface{}{
			"port":              v.config.Port,
			"host":              v.config.Host,
			"tlsEnabled":        v.config.TLSEnabled,
			"authEnabled":       v.config.AuthEnabled,
			"rateLimitEnabled":  v.config.RateLimitEnabled,
			"maxRequestsPerMin": v.config.MaxRequestsPerMin,
		},
		"endpoints": []string{
			"/validate",
			"/approve",
			"/health",
			"/metrics",
			"/status",
		},
		"lastCheck": time.Now().Unix(),
	}
	
	v.writeStandardResponse(w, http.StatusOK, true, CodeSuccess,
		"Service is healthy", healthData, requestID, startTime)
	v.updateMetrics(true, time.Since(startTime))
}

// MetricsHandler provides service metrics endpoint
func (v *ValidatorService) MetricsHandler(w http.ResponseWriter, r *http.Request) {
	startTime := time.Now()
	requestID := v.generateRequestID()
	
	// Enable CORS
	v.enableCORS(w, r)
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}
	
	if r.Method != http.MethodGet {
		v.writeStandardResponse(w, http.StatusMethodNotAllowed, false, CodeInvalidRequest,
			"Method not allowed. Only GET is supported.", nil, requestID, startTime)
		return
	}
	
	// Get current metrics
	v.metricsLock.RLock()
	currentMetrics := *v.metrics
	v.metricsLock.RUnlock()
	
	// Calculate success rate
	successRate := 0.0
	if currentMetrics.TotalRequests > 0 {
		successRate = float64(currentMetrics.SuccessfulRequests) / float64(currentMetrics.TotalRequests) * 100
	}
	
	metricsData := map[string]interface{}{
		"validatorType":       v.config.ValidatorType,
		"version":             v.version,
		"totalRequests":       currentMetrics.TotalRequests,
		"successfulRequests":  currentMetrics.SuccessfulRequests,
		"failedRequests":      currentMetrics.FailedRequests,
		"validationRequests":  currentMetrics.ValidationRequests,
		"approvalRequests":    currentMetrics.ApprovalRequests,
		"averageResponseTime": currentMetrics.AverageResponseTime,
		"lastRequestTime":     currentMetrics.LastRequestTimestamp,
		"uptime":              currentMetrics.Uptime,
		"successRate":         successRate,
		"registrySize":        len(v.config.ValidHashes),
		"collectedAt":         time.Now().Unix(),
	}
	
	v.writeStandardResponse(w, http.StatusOK, true, CodeSuccess,
		"Metrics retrieved successfully", metricsData, requestID, startTime)
	v.updateMetrics(true, time.Since(startTime))
}

// StatusHandler provides detailed service status information
func (v *ValidatorService) StatusHandler(w http.ResponseWriter, r *http.Request) {
	startTime := time.Now()
	requestID := v.generateRequestID()
	
	// Enable CORS
	v.enableCORS(w, r)
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}
	
	if r.Method != http.MethodGet {
		v.writeStandardResponse(w, http.StatusMethodNotAllowed, false, CodeInvalidRequest,
			"Method not allowed. Only GET is supported.", nil, requestID, startTime)
		return
	}
	
	// Get current metrics for status calculation
	v.metricsLock.RLock()
	currentMetrics := *v.metrics
	v.metricsLock.RUnlock()
	
	// Determine service status
	serviceStatus := "healthy"
	statusDetails := []string{}
	
	// Check if service has been recently active
	if currentMetrics.LastRequestTimestamp > 0 {
		lastRequestAge := time.Now().Unix() - currentMetrics.LastRequestTimestamp
		if lastRequestAge > 3600 { // 1 hour
			statusDetails = append(statusDetails, "No recent activity")
		}
	}
	
	// Check error rate
	if currentMetrics.TotalRequests > 10 {
		errorRate := float64(currentMetrics.FailedRequests) / float64(currentMetrics.TotalRequests) * 100
		if errorRate > 50 {
			serviceStatus = "degraded"
			statusDetails = append(statusDetails, fmt.Sprintf("High error rate: %.1f%%", errorRate))
		}
	}
	
	statusData := map[string]interface{}{
		"status":          serviceStatus,
		"validatorType":   v.config.ValidatorType,
		"version":         v.version,
		"environment":     v.config.Environment,
		"startTime":       v.startTime.Unix(),
		"uptime":          time.Since(v.startTime).String(),
		"statusDetails":   statusDetails,
		"capabilities": []string{
			"document_validation",
			"approval_processing",
			"metrics_collection",
			"health_monitoring",
		},
		"registryInfo": map[string]interface{}{
			"totalDocuments": len(v.config.ValidHashes),
			"validDocuments": v.countValidDocuments(),
		},
		"lastUpdated": time.Now().Unix(),
	}
	
	v.writeStandardResponse(w, http.StatusOK, true, CodeSuccess,
		"Service status retrieved successfully", statusData, requestID, startTime)
	v.updateMetrics(true, time.Since(startTime))
}

// countValidDocuments counts how many documents in the registry are marked as valid
func (v *ValidatorService) countValidDocuments() int {
	count := 0
	for _, valid := range v.config.ValidHashes {
		if valid {
			count++
		}
	}
	return count
}

// GetValidHashesFromEnv loads valid hashes from environment variables with enhanced parsing
func GetValidHashesFromEnv(envKey string) map[string]bool {
	hashesStr := os.Getenv(envKey)
	if hashesStr == "" {
		return make(map[string]bool)
	}

	hashes := make(map[string]bool)
	// Parse comma-separated hashes, supporting both valid and invalid markers
	for _, hashEntry := range strings.Split(hashesStr, ",") {
		hashEntry = strings.TrimSpace(hashEntry)
		if hashEntry == "" {
			continue
		}
		
		// Support format: "hash" or "hash:true" or "hash:false"
		parts := strings.Split(hashEntry, ":")
		hash := strings.TrimSpace(parts[0])
		valid := true // Default to valid
		
		if len(parts) > 1 {
			validStr := strings.TrimSpace(strings.ToLower(parts[1]))
			valid = validStr == "true" || validStr == "1" || validStr == "yes"
		}
		
		hashes[hash] = valid
	}
	return hashes
}
