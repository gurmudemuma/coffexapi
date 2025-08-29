package main

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"
	"time"

	"github.com/chaincode/shared"
)

// Test configuration
var testConfig = &APIGatewayConfig{
	Host:        "localhost",
	Port:        8000,
	Environment: "test",
	Version:     "test-1.0.0",
	Timeout:     30 * time.Second,
	Auth: AuthConfig{
		Enabled:   false, // Disabled for testing
		JWTSecret: "test-secret",
	},
	RateLimit: RateLimitConfig{
		Enabled:     false, // Disabled for testing
		MaxRequests: 100,
		WindowMs:    time.Minute,
	},
	CORS: CORSConfig{
		AllowedOrigins: []string{"http://localhost:3000"},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{"*"},
		Enabled:        true,
	},
	Monitoring: MonitoringConfig{
		Enabled: true,
		Port:    9090,
	},
	Validators: []ValidatorEndpoint{
		{
			Name:     "test-validator",
			URL:      "http://localhost:8080/validate",
			Type:     "LICENSE",
			Timeout:  10 * time.Second,
			Enabled:  true,
			Priority: 1,
		},
	},
}

// Setup test environment
func setupTest() *APIGateway {
	// Initialize test logger
	shared.InitDefaultLogger("api-gateway-test", "test")
	
	ag := &APIGateway{
		config: testConfig,
		logger: shared.GetDefaultLogger(),
		monitor: shared.NewHealthMonitor("api-gateway-test", "test-1.0.0", "test"),
	}
	
	return ag
}

// TestMain sets up and tears down test environment
func TestMain(m *testing.M) {
	// Setup
	code := m.Run()
	
	// Teardown
	os.Exit(code)
}

// Test API Gateway initialization
func TestNewAPIGateway(t *testing.T) {
	tests := []struct {
		name        string
		setupEnv    func()
		expectError bool
	}{
		{
			name: "successful initialization",
			setupEnv: func() {
				os.Setenv("ENVIRONMENT", "test")
			},
			expectError: false,
		},
		{
			name: "missing environment",
			setupEnv: func() {
				os.Unsetenv("ENVIRONMENT")
			},
			expectError: false, // Should use default
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			tt.setupEnv()
			
			ag, err := NewAPIGateway()
			
			if tt.expectError && err == nil {
				t.Errorf("Expected error but got none")
			}
			if !tt.expectError && err != nil {
				t.Errorf("Unexpected error: %v", err)
			}
			if !tt.expectError && ag == nil {
				t.Errorf("Expected APIGateway instance but got nil")
			}
		})
	}
}

// Test health endpoint
func TestHealthHandler(t *testing.T) {
	ag := setupTest()
	
	req, err := http.NewRequest("GET", "/health", nil)
	if err != nil {
		t.Fatal(err)
	}
	
	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(ag.monitor.HTTPHandler())
	
	handler.ServeHTTP(rr, req)
	
	// Check status code
	if status := rr.Code; status != http.StatusOK {
		t.Errorf("Handler returned wrong status code: got %v want %v", status, http.StatusOK)
	}
	
	// Check content type
	expected := "application/json"
	if contentType := rr.Header().Get("Content-Type"); contentType != expected {
		t.Errorf("Handler returned wrong content type: got %v want %v", contentType, expected)
	}
	
	// Check response body structure
	var response map[string]interface{}
	err = json.Unmarshal(rr.Body.Bytes(), &response)
	if err != nil {
		t.Errorf("Failed to parse response JSON: %v", err)
	}
	
	// Verify required fields
	if _, exists := response["status"]; !exists {
		t.Errorf("Response missing 'status' field")
	}
	if _, exists := response["timestamp"]; !exists {
		t.Errorf("Response missing 'timestamp' field")
	}
	if _, exists := response["service"]; !exists {
		t.Errorf("Response missing 'service' field")
	}
}

// Test metrics endpoint
func TestMetricsHandler(t *testing.T) {
	ag := setupTest()
	
	req, err := http.NewRequest("GET", "/metrics", nil)
	if err != nil {
		t.Fatal(err)
	}
	
	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(ag.metricsHandler)
	
	handler.ServeHTTP(rr, req)
	
	// Check status code
	if status := rr.Code; status != http.StatusOK {
		t.Errorf("Handler returned wrong status code: got %v want %v", status, http.StatusOK)
	}
	
	// Check response structure
	var response map[string]interface{}
	err = json.Unmarshal(rr.Body.Bytes(), &response)
	if err != nil {
		t.Errorf("Failed to parse response JSON: %v", err)
	}
	
	// Verify metrics structure
	if _, exists := response["service"]; !exists {
		t.Errorf("Response missing 'service' field")
	}
	if _, exists := response["timestamp"]; !exists {
		t.Errorf("Response missing 'timestamp' field")
	}
}

// Test CORS middleware
func TestCORSMiddleware(t *testing.T) {
	ag := setupTest()
	
	tests := []struct {
		name           string
		origin         string
		method         string
		expectedStatus int
		expectCORSHeaders bool
	}{
		{
			name:           "allowed origin",
			origin:         "http://localhost:3000",
			method:         "GET",
			expectedStatus: http.StatusOK,
			expectCORSHeaders: true,
		},
		{
			name:           "disallowed origin",
			origin:         "http://malicious-site.com",
			method:         "GET",
			expectedStatus: http.StatusOK, // CORS doesn't block, browser does
			expectCORSHeaders: false,
		},
		{
			name:           "preflight request",
			origin:         "http://localhost:3000",
			method:         "OPTIONS",
			expectedStatus: http.StatusOK,
			expectCORSHeaders: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req, err := http.NewRequest(tt.method, "/health", nil)
			if err != nil {
				t.Fatal(err)
			}
			
			if tt.origin != "" {
				req.Header.Set("Origin", tt.origin)
			}
			
			rr := httptest.NewRecorder()
			
			// Create a test handler wrapped with CORS middleware
			testHandler := ag.corsMiddleware(func(w http.ResponseWriter, r *http.Request) {
				w.WriteHeader(http.StatusOK)
				w.Write([]byte("OK"))
			})
			
			testHandler.ServeHTTP(rr, req)
			
			// Check status code
			if status := rr.Code; status != tt.expectedStatus {
				t.Errorf("Handler returned wrong status code: got %v want %v", status, tt.expectedStatus)
			}
			
			// Check CORS headers
			corsHeader := rr.Header().Get("Access-Control-Allow-Origin")
			if tt.expectCORSHeaders && corsHeader == "" {
				t.Errorf("Expected CORS headers but none found")
			}
			if !tt.expectCORSHeaders && corsHeader != "" && tt.origin != "http://localhost:3000" {
				t.Errorf("Unexpected CORS headers for disallowed origin")
			}
		})
	}
}

// Test logging middleware
func TestLoggingMiddleware(t *testing.T) {
	ag := setupTest()
	
	req, err := http.NewRequest("GET", "/test", nil)
	if err != nil {
		t.Fatal(err)
	}
	
	rr := httptest.NewRecorder()
	
	// Create a test handler wrapped with logging middleware
	testHandler := ag.loggingMiddleware(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	})
	
	testHandler.ServeHTTP(rr, req)
	
	// Check that request context was added
	if req.Context().Value("requestContext") == nil {
		t.Errorf("Expected request context to be added")
	}
	
	// Check response
	if status := rr.Code; status != http.StatusOK {
		t.Errorf("Handler returned wrong status code: got %v want %v", status, http.StatusOK)
	}
}

// Test recovery middleware
func TestRecoveryMiddleware(t *testing.T) {
	ag := setupTest()
	
	req, err := http.NewRequest("GET", "/panic", nil)
	if err != nil {
		t.Fatal(err)
	}
	
	rr := httptest.NewRecorder()
	
	// Create a test handler that panics, wrapped with recovery middleware
	testHandler := ag.recoveryMiddleware(func(w http.ResponseWriter, r *http.Request) {
		panic("test panic")
	})
	
	testHandler.ServeHTTP(rr, req)
	
	// Check that panic was recovered and error response returned
	if status := rr.Code; status != http.StatusInternalServerError {
		t.Errorf("Handler returned wrong status code: got %v want %v", status, http.StatusInternalServerError)
	}
	
	// Check error response structure
	var response APIResponse
	err = json.Unmarshal(rr.Body.Bytes(), &response)
	if err != nil {
		t.Errorf("Failed to parse error response JSON: %v", err)
	}
	
	if response.Success {
		t.Errorf("Expected Success to be false for panic response")
	}
	if response.Error == nil {
		t.Errorf("Expected Error to be present in panic response")
	}
}

// Test rate limiting middleware
func TestRateLimitMiddleware(t *testing.T) {
	// Enable rate limiting for this test
	ag := setupTest()
	ag.config.RateLimit.Enabled = true
	ag.config.RateLimit.MaxRequests = 2
	ag.config.RateLimit.WindowMs = time.Minute
	
	// Reset the rate limit state
	requestCounts = make(map[string]int)
	lastReset = time.Now()
	
	testHandler := ag.rateLimitMiddleware(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	})
	
	// First request should succeed
	req1, _ := http.NewRequest("GET", "/test", nil)
	rr1 := httptest.NewRecorder()
	testHandler.ServeHTTP(rr1, req1)
	
	if status := rr1.Code; status != http.StatusOK {
		t.Errorf("First request failed: got %v want %v", status, http.StatusOK)
	}
	
	// Second request should succeed
	req2, _ := http.NewRequest("GET", "/test", nil)
	rr2 := httptest.NewRecorder()
	testHandler.ServeHTTP(rr2, req2)
	
	if status := rr2.Code; status != http.StatusOK {
		t.Errorf("Second request failed: got %v want %v", status, http.StatusOK)
	}
	
	// Third request should be rate limited
	req3, _ := http.NewRequest("GET", "/test", nil)
	rr3 := httptest.NewRecorder()
	testHandler.ServeHTTP(rr3, req3)
	
	if status := rr3.Code; status != http.StatusTooManyRequests {
		t.Errorf("Third request should be rate limited: got %v want %v", status, http.StatusTooManyRequests)
	}
}

// Test document upload handler
func TestUploadDocumentHandler(t *testing.T) {
	ag := setupTest()
	
	// Create test request body
	requestBody := map[string]interface{}{
		"documentHash": "test-hash-123",
		"documentType": "license",
		"metadata": map[string]interface{}{
			"filename": "test.pdf",
			"size":     1024,
		},
	}
	
	jsonBody, _ := json.Marshal(requestBody)
	req, err := http.NewRequest("POST", "/api/documents", bytes.NewBuffer(jsonBody))
	if err != nil {
		t.Fatal(err)
	}
	
	req.Header.Set("Content-Type", "application/json")
	
	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(ag.uploadDocumentHandler)
	
	handler.ServeHTTP(rr, req)
	
	// Check status code (should accept the request)
	if status := rr.Code; status != http.StatusCreated && status != http.StatusOK {
		t.Errorf("Handler returned unexpected status code: got %v", status)
	}
	
	// Check response structure
	var response APIResponse
	err = json.Unmarshal(rr.Body.Bytes(), &response)
	if err != nil {
		t.Errorf("Failed to parse response JSON: %v", err)
	}
}

// Test middleware chain application
func TestApplyMiddleware(t *testing.T) {
	ag := setupTest()
	
	middlewares := []MiddlewareFunc{
		ag.recoveryMiddleware,
		ag.loggingMiddleware,
		ag.corsMiddleware,
	}
	
	finalHandler := func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("final"))
	}
	
	wrappedHandler := ag.applyMiddleware(finalHandler, middlewares...)
	
	req, err := http.NewRequest("GET", "/test", nil)
	if err != nil {
		t.Fatal(err)
	}
	
	rr := httptest.NewRecorder()
	wrappedHandler.ServeHTTP(rr, req)
	
	// Check that all middleware was applied successfully
	if status := rr.Code; status != http.StatusOK {
		t.Errorf("Middleware chain failed: got %v want %v", status, http.StatusOK)
	}
	
	if body := rr.Body.String(); body != "final" {
		t.Errorf("Final handler not reached: got %v want %v", body, "final")
	}
}

// Test configuration loading
func TestLoadConfiguration(t *testing.T) {
	tests := []struct {
		name    string
		envVars map[string]string
		expect  func(*APIGatewayConfig) bool
	}{
		{
			name: "default configuration",
			envVars: map[string]string{
				"ENVIRONMENT": "test",
			},
			expect: func(config *APIGatewayConfig) bool {
				return config.Environment == "test"
			},
		},
		{
			name: "custom port",
			envVars: map[string]string{
				"PORT": "9000",
			},
			expect: func(config *APIGatewayConfig) bool {
				return config.Port == 9000
			},
		},
		{
			name: "auth enabled",
			envVars: map[string]string{
				"AUTH_ENABLED": "true",
				"JWT_SECRET":   "custom-secret",
			},
			expect: func(config *APIGatewayConfig) bool {
				return config.Auth.Enabled && config.Auth.JWTSecret == "custom-secret"
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// Set environment variables
			for key, value := range tt.envVars {
				os.Setenv(key, value)
			}
			defer func() {
				// Clean up environment variables
				for key := range tt.envVars {
					os.Unsetenv(key)
				}
			}()
			
			config := loadConfiguration()
			
			if !tt.expect(config) {
				t.Errorf("Configuration expectation failed")
			}
		})
	}
}

// Benchmark tests
func BenchmarkHealthHandler(b *testing.B) {
	ag := setupTest()
	handler := http.HandlerFunc(ag.monitor.HTTPHandler())
	
	req, _ := http.NewRequest("GET", "/health", nil)
	
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		rr := httptest.NewRecorder()
		handler.ServeHTTP(rr, req)
	}
}

func BenchmarkMiddlewareChain(b *testing.B) {
	ag := setupTest()
	
	middlewares := []MiddlewareFunc{
		ag.recoveryMiddleware,
		ag.loggingMiddleware,
		ag.corsMiddleware,
	}
	
	finalHandler := func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	}
	
	wrappedHandler := ag.applyMiddleware(finalHandler, middlewares...)
	req, _ := http.NewRequest("GET", "/test", nil)
	
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		rr := httptest.NewRecorder()
		wrappedHandler.ServeHTTP(rr, req)
	}
}

// Integration tests
func TestAPIGatewayIntegration(t *testing.T) {
	if testing.Short() {
		t.Skip("Skipping integration test in short mode")
	}
	
	ag := setupTest()
	
	// Start test server
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch r.URL.Path {
		case "/health":
			ag.monitor.HTTPHandler()(w, r)
		case "/metrics":
			ag.metricsHandler(w, r)
		default:
			w.WriteHeader(http.StatusNotFound)
		}
	}))
	defer server.Close()
	
	// Test health endpoint
	resp, err := http.Get(server.URL + "/health")
	if err != nil {
		t.Fatalf("Failed to get health endpoint: %v", err)
	}
	defer resp.Body.Close()
	
	if resp.StatusCode != http.StatusOK {
		t.Errorf("Health endpoint returned wrong status: got %v want %v", resp.StatusCode, http.StatusOK)
	}
	
	// Test metrics endpoint
	resp, err = http.Get(server.URL + "/metrics")
	if err != nil {
		t.Fatalf("Failed to get metrics endpoint: %v", err)
	}
	defer resp.Body.Close()
	
	if resp.StatusCode != http.StatusOK {
		t.Errorf("Metrics endpoint returned wrong status: got %v want %v", resp.StatusCode, http.StatusOK)
	}
}

// Test utilities
func TestGetClientIP(t *testing.T) {
	tests := []struct {
		name     string
		headers  map[string]string
		remoteAddr string
		expected string
	}{
		{
			name: "X-Forwarded-For header",
			headers: map[string]string{
				"X-Forwarded-For": "192.168.1.100",
			},
			remoteAddr: "10.0.0.1:12345",
			expected:   "192.168.1.100",
		},
		{
			name: "X-Real-IP header",
			headers: map[string]string{
				"X-Real-IP": "192.168.1.200",
			},
			remoteAddr: "10.0.0.1:12345",
			expected:   "192.168.1.200",
		},
		{
			name:       "Remote address fallback",
			headers:    map[string]string{},
			remoteAddr: "10.0.0.1:12345",
			expected:   "10.0.0.1:12345",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req, _ := http.NewRequest("GET", "/test", nil)
			
			for key, value := range tt.headers {
				req.Header.Set(key, value)
			}
			req.RemoteAddr = tt.remoteAddr
			
			result := getClientIP(req)
			if result != tt.expected {
				t.Errorf("getClientIP() = %v, want %v", result, tt.expected)
			}
		})
	}
}