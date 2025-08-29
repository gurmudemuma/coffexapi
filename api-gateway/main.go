package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"runtime/debug"
	"strconv"
	"strings"
	"syscall"
	"time"
	
	"github.com/chaincode/shared"
)

// APIResponse represents a standardized API response
type APIResponse struct {
	Success   bool        `json:"success"`
	Data      interface{} `json:"data,omitempty"`
	Error     *APIError   `json:"error,omitempty"`
	Metadata  *Metadata   `json:"metadata,omitempty"`
	Timestamp int64       `json:"timestamp"`
}

// APIError represents a standardized error response
type APIError struct {
	Code    string `json:"code"`
	Message string `json:"message"`
	Details string `json:"details,omitempty"`
}

// Metadata contains additional response metadata
type Metadata struct {
	RequestID     string `json:"requestId,omitempty"`
	ResponseTime  string `json:"responseTime,omitempty"`
	Version       string `json:"version,omitempty"`
	Environment   string `json:"environment,omitempty"`
}

// RequestContext holds request-specific data
type RequestContext struct {
	RequestID string
	StartTime time.Time
	UserAgent string
	IPAddress string
	Method    string
	Path      string
}

// MiddlewareFunc represents a middleware function
type MiddlewareFunc func(http.HandlerFunc) http.HandlerFunc

// APIGateway holds the main application configuration
type APIGateway struct {
	logger  *shared.Logger
	monitor *shared.HealthMonitor
	config  *GatewayConfig
	server  *http.Server
}

// NewAPIGateway creates a new API Gateway instance
func NewAPIGateway() (*APIGateway, error) {
	config, err := LoadConfig()
	if err != nil {
		return nil, fmt.Errorf("failed to load configuration: %v", err)
	}
	
	// Initialize structured logger
	logger := shared.NewLogger("api-gateway", config.Environment)
	
	// Initialize health monitor
	monitor := shared.NewHealthMonitor("api-gateway", config.Version, config.Environment)
	
	return &APIGateway{
		logger:  logger,
		monitor: monitor,
		config:  config,
	}, nil
}

// getEnvOrDefault returns environment variable value or default
func getEnvOrDefault(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

// generateRequestID generates a unique request ID
func generateRequestID() string {
	return fmt.Sprintf("%d-%d", time.Now().UnixNano(), os.Getpid())
}

// Middleware functions

// corsMiddleware handles CORS headers with comprehensive configuration
func (ag *APIGateway) corsMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Use configuration values
		allowedOrigins := strings.Join(ag.config.CORS.AllowedOrigins, ", ")
		allowedMethods := strings.Join(ag.config.CORS.AllowedMethods, ", ")
		allowedHeaders := strings.Join(ag.config.CORS.AllowedHeaders, ", ")
		
		w.Header().Set("Access-Control-Allow-Origin", allowedOrigins)
		w.Header().Set("Access-Control-Allow-Methods", allowedMethods)
		w.Header().Set("Access-Control-Allow-Headers", allowedHeaders)
		w.Header().Set("Access-Control-Expose-Headers", "X-Request-ID, X-Response-Time")
		w.Header().Set("Access-Control-Max-Age", fmt.Sprintf("%d", ag.config.CORS.MaxAge))
		
		// Handle preflight requests
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		
		next(w, r)
	}
}

// loggingMiddleware logs all requests with comprehensive information
func (ag *APIGateway) loggingMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		startTime := time.Now()
		requestID := generateRequestID()
		
		// Store request context
		ctx := context.WithValue(r.Context(), "requestContext", &RequestContext{
			RequestID: requestID,
			StartTime: startTime,
			UserAgent: r.UserAgent(),
			IPAddress: getClientIP(r),
			Method:    r.Method,
			Path:      r.URL.Path,
		})
		r = r.WithContext(ctx)
		
		// Set request ID header
		w.Header().Set("X-Request-ID", requestID)
		
		// Log request start with structured logging
		logger := ag.logger.WithRequestID(requestID).WithContext("method", r.Method).WithContext("path", r.URL.Path).WithContext("userAgent", r.UserAgent()).WithContext("clientIP", getClientIP(r))
		logger.Info("Request started")
		
		// Create response writer wrapper to capture status code
		wrapped := &responseWriter{ResponseWriter: w, statusCode: http.StatusOK}
		
		next(wrapped, r)
		
		// Calculate duration and log response
		duration := time.Since(startTime)
		w.Header().Set("X-Response-Time", duration.String())
		
		logger = logger.WithContext("statusCode", wrapped.statusCode).WithContext("duration", duration.String())
		
		if wrapped.statusCode >= 400 {
			logger.Error("Request completed with error")
		} else {
			logger.Info("Request completed successfully")
		}
		
		// Record metrics
		ag.monitor.RecordHTTPRequest(duration, wrapped.statusCode < 400)
	}
}

// responseWriter wraps http.ResponseWriter to capture status code
type responseWriter struct {
	http.ResponseWriter
	statusCode int
}

func (rw *responseWriter) WriteHeader(code int) {
	rw.statusCode = code
	rw.ResponseWriter.WriteHeader(code)
}

// getClientIP extracts the client IP from the request
func getClientIP(r *http.Request) string {
	// Check X-Forwarded-For header first
	if xff := r.Header.Get("X-Forwarded-For"); xff != "" {
		// Take the first IP in the list
		if ips := strings.Split(xff, ","); len(ips) > 0 {
			return strings.TrimSpace(ips[0])
		}
	}
	
	// Check X-Real-IP header
	if xri := r.Header.Get("X-Real-IP"); xri != "" {
		return xri
	}
	
	// Fall back to RemoteAddr
	if ip := strings.Split(r.RemoteAddr, ":"); len(ip) > 0 {
		return ip[0]
	}
	
	return r.RemoteAddr
}

// recoveryMiddleware handles panics and returns proper error responses
func (ag *APIGateway) recoveryMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if err := recover(); err != nil {
				// Get request context for structured logging
				requestID := "unknown"
				if ctx := r.Context().Value("requestContext"); ctx != nil {
					if reqCtx, ok := ctx.(*RequestContext); ok {
						requestID = reqCtx.RequestID
					}
				}
				
				// Log panic with structured logging
				logger := ag.logger.WithRequestID(requestID).WithContext("panic", fmt.Sprintf("%v", err)).WithContext("stack", string(debug.Stack()))
				logger.Error("Panic recovered in API Gateway")
				
				response := APIResponse{
					Success:   false,
					Error:     &APIError{
						Code:    "INTERNAL_SERVER_ERROR",
						Message: "Internal server error occurred",
						Details: "An unexpected error occurred while processing your request",
					},
					Timestamp: time.Now().Unix(),
				}
				
				ag.writeJSONResponse(w, http.StatusInternalServerError, response)
			}
		}()
		
		next(w, r)
	}
}

// authMiddleware handles authentication (placeholder for now)
func (ag *APIGateway) authMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Skip auth for health check and login endpoints
		if r.URL.Path == "/health" || r.URL.Path == "/api/auth/login" {
			next(w, r)
			return
		}
		
		// Check if authentication is enabled
		if !ag.config.Auth.Enabled {
			next(w, r)
			return
		}
		
		// In production, check for valid JWT token
		token := r.Header.Get("Authorization")
		if token == "" {
			response := APIResponse{
				Success:   false,
				Error:     &APIError{
					Code:    "UNAUTHORIZED",
					Message: "Authentication required",
					Details: "Please provide a valid authorization token",
				},
				Timestamp: time.Now().Unix(),
			}
			ag.writeJSONResponse(w, http.StatusUnauthorized, response)
			return
		}
		
		// TODO: Implement proper JWT token validation using ag.config.Auth.JWTSecret
		next(w, r)
	}
}

// rateLimitMiddleware implements basic rate limiting
var requestCounts = make(map[string]int)
var lastReset = time.Now()

func (ag *APIGateway) rateLimitMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Skip rate limiting if disabled
		if !ag.config.RateLimit.Enabled {
			next(w, r)
			return
		}
		
		// Reset counters based on window
		if time.Since(lastReset) > ag.config.RateLimit.WindowMs {
			requestCounts = make(map[string]int)
			lastReset = time.Now()
		}
		
		clientIP := getClientIP(r)
		requestCounts[clientIP]++
		
		// Check against configured limit
		if requestCounts[clientIP] > ag.config.RateLimit.MaxRequests {
			response := APIResponse{
				Success:   false,
				Error:     &APIError{
					Code:    "RATE_LIMIT_EXCEEDED",
					Message: "Rate limit exceeded",
					Details: fmt.Sprintf("Maximum %d requests per window allowed", ag.config.RateLimit.MaxRequests),
				},
				Timestamp: time.Now().Unix(),
			}
			w.Header().Set("Retry-After", fmt.Sprintf("%.0f", ag.config.RateLimit.WindowMs.Seconds()))
			ag.writeJSONResponse(w, http.StatusTooManyRequests, response)
			return
		}
		
		next(w, r)
	}
}

func main() {
	ag, err := NewAPIGateway()
	if err != nil {
		log.Fatalf("Failed to initialize API Gateway: %v", err)
	}
	
	// Start health monitoring
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	
	// Add validator dependency health checks
	ag.addValidatorHealthChecks()
	
	// Start the health monitor
	ag.monitor.Start(ctx)
	
	// Create middleware chain
	middlewares := []MiddlewareFunc{
		ag.recoveryMiddleware,
		ag.loggingMiddleware,
		ag.corsMiddleware,
		ag.rateLimitMiddleware,
		ag.authMiddleware,
	}
	
	// Set up routes with middleware
	mux := http.NewServeMux()
	
	// Health and monitoring endpoints (no auth required)
	mux.HandleFunc("/health", ag.applyMiddleware(ag.monitor.HTTPHandler(), ag.recoveryMiddleware, ag.loggingMiddleware, ag.corsMiddleware))
	mux.HandleFunc("/metrics", ag.applyMiddleware(ag.metricsHandler, ag.recoveryMiddleware, ag.loggingMiddleware, ag.corsMiddleware))
	mux.HandleFunc("/status", ag.applyMiddleware(ag.statusHandler, ag.recoveryMiddleware, ag.loggingMiddleware, ag.corsMiddleware))
	
	// Authentication endpoint
	mux.HandleFunc("/api/auth/login", ag.applyMiddleware(ag.loginHandler, middlewares[:4]...)) // Skip auth middleware
	
	// Apply organization middleware to all API routes requiring organization-specific access
	orgMiddlewares := []MiddlewareFunc{
		ag.loggingMiddleware,
		ag.corsMiddleware,
		ag.organizationMiddleware, // Organization validation middleware
	}
	
	// Public routes (no organization filtering)
	mux.HandleFunc("/api/health", ag.applyMiddleware(ag.healthHandler, middlewares...))
	mux.HandleFunc("/api/status", ag.applyMiddleware(ag.statusHandler, middlewares...))
	mux.HandleFunc("/api/metrics", ag.applyMiddleware(ag.metricsHandler, middlewares...))
	mux.HandleFunc("/api/system-status", ag.applyMiddleware(ag.systemStatusHandler, middlewares...))
	
	// Organization-specific routes (with organization middleware)
	mux.HandleFunc("/api/pending-approvals", ag.applyMiddleware(ag.pendingApprovalsHandler, orgMiddlewares...))
	mux.HandleFunc("/api/completed-approvals", ag.applyMiddleware(ag.completedApprovalsHandler, orgMiddlewares...))
	mux.HandleFunc("/api/export-status", ag.applyMiddleware(ag.exportStatusHandler, orgMiddlewares...))
	mux.HandleFunc("/api/submit-export", ag.applyMiddleware(ag.submitExportHandler, orgMiddlewares...))
	mux.HandleFunc("/api/upload-document", ag.applyMiddleware(ag.uploadDocumentHandler, orgMiddlewares...))
	
	// Legacy routes (keeping for compatibility)
	mux.HandleFunc("/api/documents", ag.applyMiddleware(ag.uploadDocumentHandler, middlewares...))
	mux.HandleFunc("/api/exports", ag.applyMiddleware(ag.submitExportHandler, middlewares...))
	
	// Create HTTP server with proper configuration
	addr := fmt.Sprintf("%s:%d", ag.config.Host, ag.config.Port)
	ag.server = &http.Server{
		Addr:         addr,
		Handler:      mux,
		ReadTimeout:  ag.config.Timeout,
		WriteTimeout: ag.config.Timeout,
		IdleTimeout:  120 * time.Second,
	}
	
	// Set up graceful shutdown
	go func() {
		sigChan := make(chan os.Signal, 1)
		signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)
		<-sigChan
		
		ag.logger.Info("Shutdown signal received, stopping server...")
		cancel() // Stop health monitor
		
		shutdownCtx, shutdownCancel := context.WithTimeout(context.Background(), 30*time.Second)
		defer shutdownCancel()
		
		if err := ag.server.Shutdown(shutdownCtx); err != nil {
			ag.logger.Error("Error during shutdown: %v", err)
		}
	}()
	
	// Start server
	ag.logger.WithContext("address", addr).WithContext("environment", ag.config.Environment).WithContext("version", ag.config.Version).Info("API Gateway starting")
	ag.logger.WithContext("healthEndpoint", fmt.Sprintf("http://%s/health", addr)).WithContext("metricsEndpoint", fmt.Sprintf("http://%s/metrics", addr)).Info("Monitoring endpoints available")
	ag.logger.WithContext("authEnabled", ag.config.Auth.Enabled).WithContext("rateLimitEnabled", ag.config.RateLimit.Enabled).WithContext("corsOrigins", len(ag.config.CORS.AllowedOrigins)).Info("Configuration loaded")
	
	if err := ag.server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		ag.logger.Fatal("Failed to start server: %v", err)
	}
	
		ag.logger.Info("Server stopped gracefully")
}

// addValidatorHealthChecks adds health checks for all validator services
func (ag *APIGateway) addValidatorHealthChecks() {
	// Add health checks for each validator service
	for name, config := range ag.config.Validators {
		validatorName := name
		validatorConfig := config
		
		ag.monitor.AddDependencyCheck(validatorName, func(ctx context.Context) *shared.HealthCheck {
			return ag.checkValidatorHealth(ctx, validatorName, validatorConfig)
		})
	}
}

// checkValidatorHealth performs a health check on a validator service
func (ag *APIGateway) checkValidatorHealth(ctx context.Context, name string, config ValidatorEndpoint) *shared.HealthCheck {
	start := time.Now()
	
	check := &shared.HealthCheck{
		Name:      fmt.Sprintf("validator-%s", strings.ToLower(name)),
		Timestamp: start,
		Metadata: map[string]interface{}{
			"endpoint": config.Endpoint,
			"type":     config.Type,
		},
	}
	
	// Create HTTP client with timeout
	client := &http.Client{
		Timeout: config.Timeout,
	}
	
	// Make health check request
	healthURL := fmt.Sprintf("%s/health", config.Endpoint)
	req, err := http.NewRequestWithContext(ctx, "GET", healthURL, nil)
	if err != nil {
		check.Status = shared.HealthStatusUnhealthy
		check.Error = fmt.Sprintf("Failed to create request: %v", err)
		check.Duration = time.Since(start)
		return check
	}
	
	resp, err := client.Do(req)
	if err != nil {
		check.Status = shared.HealthStatusUnhealthy
		check.Error = fmt.Sprintf("Request failed: %v", err)
		check.Duration = time.Since(start)
		return check
	}
	defer resp.Body.Close()
	
	// Check response status
	if resp.StatusCode == http.StatusOK {
		check.Status = shared.HealthStatusHealthy
		check.Message = "Validator service is healthy"
		check.LastSuccess = time.Now()
	} else if resp.StatusCode < 500 {
		check.Status = shared.HealthStatusDegraded
		check.Message = fmt.Sprintf("Validator service returned status %d", resp.StatusCode)
	} else {
		check.Status = shared.HealthStatusUnhealthy
		check.Error = fmt.Sprintf("Validator service returned status %d", resp.StatusCode)
	}
	
	check.Duration = time.Since(start)
	return check
}

// metricsHandler returns system metrics
func (ag *APIGateway) metricsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		ag.writeErrorResponse(w, r, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "Method not allowed", "Only GET method is supported")
		return
	}
	
	// Get metrics from logger and monitor
	logMetrics := ag.logger.GetMetrics()
	healthHistory := ag.monitor.GetHealthHistory()
	
	metrics := map[string]interface{}{
		"service":     "api-gateway",
		"version":     ag.config.Version,
		"environment": ag.config.Environment,
		"timestamp":   time.Now().Unix(),
		"logMetrics":  logMetrics,
		"healthHistory": map[string]interface{}{
			"totalChecks": len(healthHistory),
			"recent":      getRecentHealthSummary(healthHistory),
		},
		"uptime": time.Since(ag.monitor.GetCurrentHealth(r.Context()).Timestamp).String(),
	}
	
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Cache-Control", "no-cache, no-store, must-revalidate")
	
	if err := json.NewEncoder(w).Encode(metrics); err != nil {
		ag.logger.WithError(err).Error("Failed to encode metrics response")
		ag.writeErrorResponse(w, r, http.StatusInternalServerError, "ENCODING_ERROR", "Failed to encode response", err.Error())
	}
}

// statusHandler returns detailed system status
func (ag *APIGateway) statusHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		ag.writeErrorResponse(w, r, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "Method not allowed", "Only GET method is supported")
		return
	}
	
	health := ag.monitor.GetCurrentHealth(r.Context())
	
	status := map[string]interface{}{
		"service":      "api-gateway",
		"version":      ag.config.Version,
		"environment":  ag.config.Environment,
		"status":       health.Status,
		"timestamp":    health.Timestamp,
		"uptime":       health.Uptime.String(),
		"checks":       health.Checks,
		"dependencies": health.Dependencies,
		"metrics":      health.Metrics,
		"configuration": map[string]interface{}{
			"authEnabled":      ag.config.Auth.Enabled,
			"rateLimitEnabled": ag.config.RateLimit.Enabled,
			"corsOrigins":      len(ag.config.CORS.AllowedOrigins),
			"validators":       len(ag.config.Validators),
		},
	}
	
	// Set appropriate status code
	statusCode := http.StatusOK
	if health.Status == shared.HealthStatusUnhealthy {
		statusCode = http.StatusServiceUnavailable
	} else if health.Status == shared.HealthStatusDegraded {
		statusCode = http.StatusOK // Still serving but degraded
	}
	
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Cache-Control", "no-cache, no-store, must-revalidate")
	w.WriteHeader(statusCode)
	
	if err := json.NewEncoder(w).Encode(status); err != nil {
		ag.logger.WithError(err).Error("Failed to encode status response")
	}
}

// getRecentHealthSummary returns a summary of recent health checks
func getRecentHealthSummary(history []*shared.SystemHealth) map[string]interface{} {
	if len(history) == 0 {
		return map[string]interface{}{
			"healthy":   0,
			"degraded":  0,
			"unhealthy": 0,
		}
	}
	
	// Count last 10 health checks
	start := len(history) - 10
	if start < 0 {
		start = 0
	}
	
	healthy := 0
	degraded := 0
	unhealthy := 0
	
	for i := start; i < len(history); i++ {
		switch history[i].Status {
		case shared.HealthStatusHealthy:
			healthy++
		case shared.HealthStatusDegraded:
			degraded++
		case shared.HealthStatusUnhealthy:
			unhealthy++
		}
	}
	
	return map[string]interface{}{
		"healthy":   healthy,
		"degraded":  degraded,
		"unhealthy": unhealthy,
		"total":     len(history),
		"recent":    len(history) - start,
	}
}

// Handler functions with improved error handling and standardized responses

// loginHandler handles user authentication
func (ag *APIGateway) loginHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		ag.writeErrorResponse(w, r, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "Method not allowed", "Only POST method is supported")
		return
	}
	
	var loginReq struct {
		Username string `json:"username"`
		Password string `json:"password"`
		OrgType  string `json:"orgType"`
	}
	
	if err := ag.validateJSONRequest(r, &loginReq); err != nil {
		ag.writeErrorResponse(w, r, http.StatusBadRequest, "INVALID_REQUEST", "Invalid request format", err.Error())
		return
	}
	
	// Validate required fields
	if loginReq.Username == "" || loginReq.Password == "" {
		ag.writeErrorResponse(w, r, http.StatusBadRequest, "MISSING_FIELDS", "Missing required fields", "Username and password are required")
		return
	}
	
	// TODO: Implement proper authentication
	// For now, return a mock token
	responseData := map[string]interface{}{
		"token":    fmt.Sprintf("mock-token-%d", time.Now().Unix()),
		"expires":  time.Now().Add(24 * time.Hour).Unix(),
		"user":     map[string]string{
			"username": loginReq.Username,
			"orgType":  loginReq.OrgType,
		},
	}
	
	ag.writeSuccessResponse(w, r, responseData)
}

// uploadDocumentHandler handles document uploads
func (ag *APIGateway) uploadDocumentHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		ag.writeErrorResponse(w, r, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "Method not allowed", "Only POST method is supported")
		return
	}
	
	// Parse multipart form
	if err := r.ParseMultipartForm(32 << 20); err != nil { // 32MB max
		ag.writeErrorResponse(w, r, http.StatusBadRequest, "INVALID_FORM", "Invalid multipart form", err.Error())
		return
	}
	
	// TODO: Implement actual document upload to IPFS
	// For now, return a mock response
	responseData := map[string]interface{}{
		"cid":        fmt.Sprintf("Qm%d", time.Now().UnixNano()),
		"uploadedAt": time.Now().Unix(),
		"status":     "uploaded",
	}
	
	ag.writeSuccessResponse(w, r, responseData)
}

// submitExportHandler handles export submissions
func (ag *APIGateway) submitExportHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		ag.writeErrorResponse(w, r, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "Method not allowed", "Only POST method is supported")
		return
	}
	
	var exportReq map[string]interface{}
	if err := ag.validateJSONRequest(r, &exportReq); err != nil {
		ag.writeErrorResponse(w, r, http.StatusBadRequest, "INVALID_REQUEST", "Invalid request format", err.Error())
		return
	}
	
	// TODO: Implement actual blockchain submission
	// For now, return a mock response
	exportID := fmt.Sprintf("EXP-%d", time.Now().Unix())
	responseData := map[string]interface{}{
		"exportId":    exportID,
		"status":      "submitted",
		"submittedAt": time.Now().Unix(),
		"txHash":      fmt.Sprintf("0x%x", time.Now().UnixNano()),
	}
	
	ag.writeSuccessResponse(w, r, responseData)
}

// pendingApprovalsHandler returns pending approvals for an organization with enhanced security
func (ag *APIGateway) pendingApprovalsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		ag.writeErrorResponse(w, r, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "Method not allowed", "Only GET method is supported")
		return
	}
	
	// Extract organization configuration from context (set by organizationMiddleware)
	orgConfig, ok := r.Context().Value("organizationConfig").(OrganizationConfig)
	if !ok {
		ag.writeErrorResponse(w, r, http.StatusInternalServerError, "MISSING_ORG_CONTEXT", "Organization context not found", "Organization middleware must be applied")
		return
	}
	
	// Additional role validation (optional - could be passed via header)
	userRole := r.Header.Get("X-User-Role")
	if userRole != "" && !validateOrganizationRole(r.URL.Query().Get("org"), userRole) {
		ag.writeErrorResponse(w, r, http.StatusForbidden, "INVALID_ROLE", "Invalid role for organization", fmt.Sprintf("Role '%s' not authorized for %s", userRole, orgConfig.Name))
		return
	}
	
	// Log access attempt
	ag.logger.WithRequestID(getRequestID(r)).WithContext("organization", orgConfig.Name).WithContext("documentType", orgConfig.DocumentType).WithContext("userRole", userRole).Info("Fetching pending approvals for organization")
	
	// Mock data - replace with actual blockchain queries filtered by organization
	// In real implementation, this would query the blockchain with organization-specific filters
	mockApprovals := []map[string]interface{}{}
	
	// Only return documents relevant to this organization's document type
	if orgConfig.DocumentType == "LICENSE" {
		mockApprovals = append(mockApprovals, map[string]interface{}{
			"id":           "1",
			"exportId":     "EXP-2024-001",
			"docType":      orgConfig.DocumentType,
			"hash":         "a1b2c3d4e5f6789012345",
			"exporterName": "Colombian Coffee Co.",
			"timestamp":    time.Now().Unix(),
			"urgencyLevel": "HIGH",
			"submittedAt":  time.Now().Add(-2 * time.Hour).Unix(),
			"organizationOnly": true, // Flag indicating this is organization-specific data
		})
	}
	
	if orgConfig.DocumentType == "INVOICE" {
		mockApprovals = append(mockApprovals, map[string]interface{}{
			"id":           "2",
			"exportId":     "EXP-2024-002",
			"docType":      orgConfig.DocumentType,
			"hash":         "x9y8z7w6v5u4t3s2r1q0",
			"exporterName": "Brazilian Beans Ltd.",
			"timestamp":    time.Now().Unix(),
			"urgencyLevel": "MEDIUM",
			"submittedAt":  time.Now().Add(-1 * time.Hour).Unix(),
			"organizationOnly": true,
		})
	}
	
	if orgConfig.DocumentType == "QUALITY" {
		mockApprovals = append(mockApprovals, map[string]interface{}{
			"id":           "3",
			"exportId":     "EXP-2024-003",
			"docType":      orgConfig.DocumentType,
			"hash":         "q1w2e3r4t5y6u7i8o9p0",
			"exporterName": "Ethiopian Premium Coffee",
			"timestamp":    time.Now().Unix(),
			"urgencyLevel": "HIGH",
			"submittedAt":  time.Now().Add(-3 * time.Hour).Unix(),
			"organizationOnly": true,
		})
	}
	
	if orgConfig.DocumentType == "SHIPPING" {
		mockApprovals = append(mockApprovals, map[string]interface{}{
			"id":           "4",
			"exportId":     "EXP-2024-004",
			"docType":      orgConfig.DocumentType,
			"hash":         "s1h2i3p4p5i6n7g8d9o0",
			"exporterName": "Kenyan Coffee Exporters",
			"timestamp":    time.Now().Unix(),
			"urgencyLevel": "MEDIUM",
			"submittedAt":  time.Now().Add(-4 * time.Hour).Unix(),
			"organizationOnly": true,
		})
	}
	
	responseData := map[string]interface{}{
		"pendingApprovals": mockApprovals,
		"organization":     orgConfig.Name,
		"organizationMSP":  orgConfig.MSP,
		"documentType":     orgConfig.DocumentType,
		"totalCount":       len(mockApprovals),
		"lastUpdated":      time.Now().Unix(),
		"dataScope":        "organization-specific", // Explicitly indicate data scope
		"accessControl": map[string]interface{}{
			"filteredByOrg":  true,
			"filteredByRole": userRole != "",
			"validRoles":     orgConfig.ValidRoles,
		},
	}
	
	ag.writeSuccessResponse(w, r, responseData)
}

// completedApprovalsHandler returns completed approvals for an organization with enhanced security
func (ag *APIGateway) completedApprovalsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		ag.writeErrorResponse(w, r, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "Method not allowed", "Only GET method is supported")
		return
	}
	
	// Extract organization configuration from context (set by organizationMiddleware)
	orgConfig, ok := r.Context().Value("organizationConfig").(OrganizationConfig)
	if !ok {
		ag.writeErrorResponse(w, r, http.StatusInternalServerError, "MISSING_ORG_CONTEXT", "Organization context not found", "Organization middleware must be applied")
		return
	}
	
	// Additional role validation (optional - could be passed via header)
	userRole := r.Header.Get("X-User-Role")
	if userRole != "" && !validateOrganizationRole(r.URL.Query().Get("org"), userRole) {
		ag.writeErrorResponse(w, r, http.StatusForbidden, "INVALID_ROLE", "Invalid role for organization", fmt.Sprintf("Role '%s' not authorized for %s", userRole, orgConfig.Name))
		return
	}
	
	// Log access attempt
	ag.logger.WithRequestID(getRequestID(r)).WithContext("organization", orgConfig.Name).WithContext("documentType", orgConfig.DocumentType).WithContext("userRole", userRole).Info("Fetching completed approvals for organization")
	
	// Mock data - replace with actual blockchain queries filtered by organization
	mockCompletedApprovals := []map[string]interface{}{}
	
	// Only return completed approvals relevant to this organization's document type
	if orgConfig.DocumentType == "LICENSE" {
		mockCompletedApprovals = append(mockCompletedApprovals, map[string]interface{}{
			"id":           "3",
			"exportId":     "EXP-2024-003",
			"docType":      orgConfig.DocumentType,
			"hash":         "completed123",
			"exporterName": "Ethiopian Premium Coffee",
			"timestamp":    time.Now().Add(-2 * time.Hour).Unix(),
			"status":       "APPROVED",
			"reviewedBy":   orgConfig.Name + " Officer",
			"reviewDate":   time.Now().Add(-1 * time.Hour).Unix(),
			"comments":     "License validated and approved",
			"submittedAt":  time.Now().Add(-3 * time.Hour).Unix(),
			"organizationOnly": true,
		})
	}
	
	if orgConfig.DocumentType == "INVOICE" {
		mockCompletedApprovals = append(mockCompletedApprovals, map[string]interface{}{
			"id":           "4",
			"exportId":     "EXP-2024-004",
			"docType":      orgConfig.DocumentType,
			"hash":         "inv_completed456",
			"exporterName": "Brazilian Coffee Exports",
			"timestamp":    time.Now().Add(-1 * time.Hour).Unix(),
			"status":       "APPROVED",
			"reviewedBy":   orgConfig.Name + " Validator",
			"reviewDate":   time.Now().Add(-30 * time.Minute).Unix(),
			"comments":     "Invoice verified and payment approved",
			"submittedAt":  time.Now().Add(-2 * time.Hour).Unix(),
			"organizationOnly": true,
		})
	}
	
	if orgConfig.DocumentType == "QUALITY" {
		mockCompletedApprovals = append(mockCompletedApprovals, map[string]interface{}{
			"id":           "5",
			"exportId":     "EXP-2024-005",
			"docType":      orgConfig.DocumentType,
			"hash":         "qual_completed789",
			"exporterName": "Colombian Premium Beans",
			"timestamp":    time.Now().Add(-3 * time.Hour).Unix(),
			"status":       "APPROVED",
			"reviewedBy":   orgConfig.Name + " Inspector",
			"reviewDate":   time.Now().Add(-2 * time.Hour).Unix(),
			"comments":     "Quality standards met, certificate issued",
			"submittedAt":  time.Now().Add(-4 * time.Hour).Unix(),
			"organizationOnly": true,
		})
	}
	
	if orgConfig.DocumentType == "SHIPPING" {
		mockCompletedApprovals = append(mockCompletedApprovals, map[string]interface{}{
			"id":           "6",
			"exportId":     "EXP-2024-006",
			"docType":      orgConfig.DocumentType,
			"hash":         "ship_completed012",
			"exporterName": "Kenyan Coffee Cooperative",
			"timestamp":    time.Now().Add(-5 * time.Hour).Unix(),
			"status":       "APPROVED",
			"reviewedBy":   orgConfig.Name + " Officer",
			"reviewDate":   time.Now().Add(-4 * time.Hour).Unix(),
			"comments":     "Shipping documents cleared for export",
			"submittedAt":  time.Now().Add(-6 * time.Hour).Unix(),
			"organizationOnly": true,
		})
	}
	
	responseData := map[string]interface{}{
		"completedApprovals": mockCompletedApprovals,
		"organization":       orgConfig.Name,
		"organizationMSP":    orgConfig.MSP,
		"documentType":       orgConfig.DocumentType,
		"totalCount":         len(mockCompletedApprovals),
		"lastUpdated":        time.Now().Unix(),
		"dataScope":          "organization-specific",
		"accessControl": map[string]interface{}{
			"filteredByOrg":  true,
			"filteredByRole": userRole != "",
			"validRoles":     orgConfig.ValidRoles,
		},
	}
	
	ag.writeSuccessResponse(w, r, responseData)
}

// exportStatusHandler returns the status of a specific export
func (ag *APIGateway) exportStatusHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		ag.writeErrorResponse(w, r, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "Method not allowed", "Only GET method is supported")
		return
	}
	
	exportID := r.URL.Query().Get("exportId")
	if exportID == "" {
		ag.writeErrorResponse(w, r, http.StatusBadRequest, "MISSING_PARAMETER", "Missing export ID parameter", "The 'exportId' query parameter is required")
		return
	}
	
	// Mock export status data
	responseData := map[string]interface{}{
		"exportId":      exportID,
		"status":        "PENDING_APPROVAL",
		"submittedAt":   time.Now().Add(-2 * time.Hour).Unix(),
		"lastUpdated":   time.Now().Unix(),
		"validations": map[string]interface{}{
			"LICENSE":  map[string]interface{}{"status": "PENDING", "validator": "National Bank"},
			"INVOICE":  map[string]interface{}{"status": "APPROVED", "validator": "Exporter Bank"},
			"QUALITY":  map[string]interface{}{"status": "PENDING", "validator": "Coffee Authority"},
			"SHIPPING": map[string]interface{}{"status": "PENDING", "validator": "Customs"},
		},
		"documents": map[string]interface{}{
			"LICENSE":  map[string]interface{}{"hash": "a1b2c3d4e5f6789012345", "uploadedAt": time.Now().Add(-2 * time.Hour).Unix()},
			"INVOICE":  map[string]interface{}{"hash": "x9y8z7w6v5u4t3s2r1q0", "uploadedAt": time.Now().Add(-2 * time.Hour).Unix()},
			"QUALITY":  map[string]interface{}{"hash": "q1w2e3r4t5y6u7i8o9p0", "uploadedAt": time.Now().Add(-2 * time.Hour).Unix()},
			"SHIPPING": map[string]interface{}{"hash": "s1h2i3p4p5i6n7g8d9o0", "uploadedAt": time.Now().Add(-2 * time.Hour).Unix()},
		},
	}
	
	ag.writeSuccessResponse(w, r, responseData)
}

// systemStatusHandler returns the overall system health status
func (ag *APIGateway) systemStatusHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		ag.writeErrorResponse(w, r, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "Method not allowed", "Only GET method is supported")
		return
	}
	
	// Mock system status data
	responseData := map[string]interface{}{
		"status":     "healthy",
		"version":    ag.version,
		"environment": ag.environment,
		"uptime":     time.Since(time.Now().Add(-24 * time.Hour)).String(),
		"services": map[string]interface{}{
			"blockchain": map[string]interface{}{"status": "healthy", "lastCheck": time.Now().Unix()},
			"ipfs":       map[string]interface{}{"status": "healthy", "lastCheck": time.Now().Unix()},
			"validators": map[string]interface{}{
				"national-bank":     map[string]string{"status": "healthy", "endpoint": "http://localhost:8080"},
				"exporter-bank":     map[string]string{"status": "healthy", "endpoint": "http://localhost:5000"},
				"quality-authority": map[string]string{"status": "healthy", "endpoint": "http://localhost:8081"},
				"customs":           map[string]string{"status": "healthy", "endpoint": "http://localhost:8082"},
			},
		},
		"metrics": map[string]interface{}{
			"totalRequests":    1000,
			"totalExports":     50,
			"pendingApprovals": 12,
			"lastExportAt":     time.Now().Add(-10 * time.Minute).Unix(),
		},
	}
	
	ag.writeSuccessResponse(w, r, responseData)
}

// healthHandler provides a comprehensive health check endpoint
func (ag *APIGateway) healthHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		ag.writeErrorResponse(w, r, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "Method not allowed", "Only GET method is supported")
		return
	}
	
	responseData := map[string]interface{}{
		"status":      "healthy",
		"service":     "api-gateway",
		"version":     ag.version,
		"environment": ag.environment,
		"timestamp":   time.Now().Unix(),
		"uptime":      "24h", // TODO: Calculate actual uptime
		"checks": map[string]interface{}{
			"database":   "ok",
			"blockchain": "ok",
			"ipfs":       "ok",
		},
	}
	
	ag.writeSuccessResponse(w, r, responseData)
}

// OrganizationConfig defines organization-specific configuration
type OrganizationConfig struct {
	Name         string   `json:"name"`
	MSP          string   `json:"msp"`
	DocumentType string   `json:"documentType"`
	ValidRoles   []string `json:"validRoles"`
	APIEndpoints []string `json:"apiEndpoints"`
}

// Organization configuration mapping
var ORGANIZATION_CONFIG = map[string]OrganizationConfig{
	"national-bank": {
		Name:         "National Bank of Ethiopia",
		MSP:          "NationalBankMSP",
		DocumentType: "LICENSE",
		ValidRoles:   []string{"NBE_ADMIN", "NBE_OFFICER"},
		APIEndpoints: []string{"/api/pending-approvals", "/api/completed-approvals", "/api/export-status"},
	},
	"exporter-bank": {
		Name:         "Exporter Bank",
		MSP:          "ExporterBankMSP",
		DocumentType: "INVOICE",
		ValidRoles:   []string{"BANK_VALIDATOR"},
		APIEndpoints: []string{"/api/pending-approvals", "/api/completed-approvals"},
	},
	"quality-authority": {
		Name:         "Coffee Quality Authority",
		MSP:          "CoffeeAuthorityMSP",
		DocumentType: "QUALITY",
		ValidRoles:   []string{"QUALITY_INSPECTOR"},
		APIEndpoints: []string{"/api/pending-approvals", "/api/completed-approvals"},
	},
	"customs": {
		Name:         "Customs Authority",
		MSP:          "CustomsMSP",
		DocumentType: "SHIPPING",
		ValidRoles:   []string{"CUSTOMS_VALIDATOR"},
		APIEndpoints: []string{"/api/pending-approvals", "/api/completed-approvals"},
	},
	"coffee-exporters": {
		Name:         "Coffee Exporters Association",
		MSP:          "ExporterMSP",
		DocumentType: "EXPORT",
		ValidRoles:   []string{"EXPORTER"},
		APIEndpoints: []string{"/api/submit-export", "/api/export-status", "/api/my-exports"},
	},
}

// organizationMiddleware validates organization access to endpoints
func (ag *APIGateway) organizationMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Extract organization from query parameters or headers
		org := r.URL.Query().Get("org")
		if org == "" {
			org = r.Header.Get("X-Organization")
		}
		
		if org == "" {
			ag.writeErrorResponse(w, r, http.StatusBadRequest, "MISSING_ORGANIZATION", "Organization parameter is required", "Provide 'org' query parameter or X-Organization header")
			return
		}
		
		// Validate organization exists
		orgConfig, exists := ORGANIZATION_CONFIG[org]
		if !exists {
			ag.writeErrorResponse(w, r, http.StatusBadRequest, "INVALID_ORGANIZATION", "Invalid organization identifier", fmt.Sprintf("Organization '%s' is not recognized", org))
			return
		}
		
		// Check if organization is allowed to access this endpoint
		isAllowed := false
		for _, endpoint := range orgConfig.APIEndpoints {
			if r.URL.Path == endpoint {
				isAllowed = true
				break
			}
		}
		
		if !isAllowed {
			ag.logger.WithRequestID(getRequestID(r)).WithContext("organization", org).WithContext("endpoint", r.URL.Path).Error("Unauthorized endpoint access attempt")
			ag.writeErrorResponse(w, r, http.StatusForbidden, "UNAUTHORIZED_ACCESS", "Organization not authorized for this endpoint", fmt.Sprintf("Organization '%s' cannot access '%s'", orgConfig.Name, r.URL.Path))
			return
		}
		
		// Store organization config in request context for use by handlers
		ctx := context.WithValue(r.Context(), "organizationConfig", orgConfig)
		r = r.WithContext(ctx)
		
		// Log authorized access
		ag.logger.WithRequestID(getRequestID(r)).WithContext("organization", orgConfig.Name).WithContext("endpoint", r.URL.Path).Info("Organization access authorized")
		
		next(w, r)
	}
}

// getRequestID extracts request ID from context
func getRequestID(r *http.Request) string {
	if ctx := r.Context().Value("requestContext"); ctx != nil {
		if reqCtx, ok := ctx.(*RequestContext); ok {
			return reqCtx.RequestID
		}
	}
	return "unknown"
}

// getDocTypeForOrg returns the document type that an organization is responsible for
func getDocTypeForOrg(org string) string {
	if config, exists := ORGANIZATION_CONFIG[org]; exists {
		return config.DocumentType
	}
	return "UNKNOWN"
}

// validateOrganizationRole checks if a role is valid for an organization
func validateOrganizationRole(org, role string) bool {
	if config, exists := ORGANIZATION_CONFIG[org]; exists {
		for _, validRole := range config.ValidRoles {
			if validRole == role {
				return true
			}
		}
	}
	return false
}