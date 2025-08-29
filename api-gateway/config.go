package main

import (
	"encoding/json"
	"fmt"
	"os"
	"os/exec"
	"strconv"
	"strings"
	"time"
)

// GatewayConfig holds the configuration for the API Gateway
type GatewayConfig struct {
	// Server configuration
	Host        string        `json:"host"`
	Port        int           `json:"port"`
	Version     string        `json:"version"`
	BasePath    string        `json:"basePath"`
	Timeout     time.Duration `json:"timeout"`
	Environment string        `json:"environment"`
	
	// CORS configuration
	CORS CORSConfig `json:"cors"`
	
	// Rate limiting configuration
	RateLimit RateLimitConfig `json:"rateLimit"`
	
	// Authentication configuration
	Auth AuthConfig `json:"auth"`
	
	// Validator endpoints
	Validators map[string]ValidatorEndpoint `json:"validators"`
	
	// Monitoring configuration
	Monitoring MonitoringConfig `json:"monitoring"`
}

// CORSConfig holds CORS-related configuration
type CORSConfig struct {
	AllowedOrigins []string `json:"allowedOrigins"`
	AllowedMethods []string `json:"allowedMethods"`
	AllowedHeaders []string `json:"allowedHeaders"`
	MaxAge         int      `json:"maxAge"`
}

// RateLimitConfig holds rate limiting configuration
type RateLimitConfig struct {
	Enabled               bool          `json:"enabled"`
	WindowMs              time.Duration `json:"windowMs"`
	MaxRequests           int           `json:"maxRequests"`
	SkipSuccessfulRequests bool          `json:"skipSuccessfulRequests"`
}

// AuthConfig holds authentication configuration
type AuthConfig struct {
	Enabled      bool          `json:"enabled"`
	JWTSecret    string        `json:"jwtSecret"`
	JWTExpiresIn time.Duration `json:"jwtExpiresIn"`
	BcryptRounds int           `json:"bcryptRounds"`
}

// ValidatorEndpoint holds validator service endpoint configuration
type ValidatorEndpoint struct {
	Type     string        `json:"type"`
	Host     string        `json:"host"`
	Port     int           `json:"port"`
	Endpoint string        `json:"endpoint"`
	Timeout  time.Duration `json:"timeout"`
}

// MonitoringConfig holds monitoring and logging configuration
type MonitoringConfig struct {
	HealthCheckInterval time.Duration `json:"healthCheckInterval"`
	MetricsEnabled      bool          `json:"metricsEnabled"`
	MetricsPort         int           `json:"metricsPort"`
	LogLevel            string        `json:"logLevel"`
}

// loadConfigFromJS loads configuration from the Node.js configuration module
func loadConfigFromJS() (*GatewayConfig, error) {
	// Create a Node.js script to extract the configuration
	script := `
const config = require('../config/system-config.js');

// Extract API Gateway specific configuration
const gatewayConfig = {
	host: config.SystemConfig.API_GATEWAY.HOST,
	port: config.SystemConfig.API_GATEWAY.PORT,
	version: config.SystemConfig.API_GATEWAY.VERSION,
	basePath: config.SystemConfig.API_GATEWAY.BASE_PATH,
	timeout: config.SystemConfig.API_GATEWAY.TIMEOUT,
	environment: config.SystemConfig.ENVIRONMENT,
	cors: config.SystemConfig.API_GATEWAY.CORS,
	rateLimit: config.SystemConfig.API_GATEWAY.RATE_LIMIT,
	auth: config.SystemConfig.API_GATEWAY.AUTH,
	validators: config.SystemConfig.VALIDATORS,
	monitoring: {
		healthCheckInterval: config.SystemConfig.MONITORING.HEALTH_CHECK_INTERVAL,
		metricsEnabled: config.SystemConfig.MONITORING.METRICS_ENABLED,
		metricsPort: config.SystemConfig.MONITORING.METRICS_PORT,
		logLevel: config.SystemConfig.MONITORING.LOGGING.LEVEL
	}
};

console.log(JSON.stringify(gatewayConfig, null, 2));
`
	
	// Write the script to a temporary file
	tmpFile := "/tmp/extract-config.js"
	if err := os.WriteFile(tmpFile, []byte(script), 0644); err != nil {
		return nil, fmt.Errorf("failed to write config extraction script: %v", err)
	}
	defer os.Remove(tmpFile)
	
	// Execute the Node.js script
	cmd := exec.Command("node", tmpFile)
	cmd.Dir = "/workspaces/coffexapi/api-gateway" // Set working directory
	output, err := cmd.Output()
	if err != nil {
		// If Node.js is not available or fails, fall back to environment variables
		return loadConfigFromEnv(), nil
	}
	
	// Parse the JSON output
	var jsConfig map[string]interface{}
	if err := json.Unmarshal(output, &jsConfig); err != nil {
		return nil, fmt.Errorf("failed to parse config JSON: %v", err)
	}
	
	// Convert to GatewayConfig
	config := &GatewayConfig{}
	
	// Server configuration
	config.Host = getStringValue(jsConfig, "host", "localhost")
	config.Port = getIntValue(jsConfig, "port", 8000)
	config.Version = getStringValue(jsConfig, "version", "2.0.0")
	config.BasePath = getStringValue(jsConfig, "basePath", "/api")
	config.Timeout = time.Duration(getIntValue(jsConfig, "timeout", 30000)) * time.Millisecond
	config.Environment = getStringValue(jsConfig, "environment", "development")
	
	// CORS configuration
	if corsData, ok := jsConfig["cors"].(map[string]interface{}); ok {
		config.CORS = CORSConfig{
			AllowedOrigins: getStringArrayValue(corsData, "ALLOWED_ORIGINS", []string{"*"}),
			AllowedMethods: getStringArrayValue(corsData, "ALLOWED_METHODS", []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}),
			AllowedHeaders: getStringArrayValue(corsData, "ALLOWED_HEADERS", []string{"Content-Type", "Authorization", "X-Request-ID"}),
			MaxAge:         getIntValue(corsData, "MAX_AGE", 86400),
		}
	}
	
	// Rate limit configuration
	if rateLimitData, ok := jsConfig["rateLimit"].(map[string]interface{}); ok {
		config.RateLimit = RateLimitConfig{
			Enabled:               getBoolValue(rateLimitData, "ENABLED", true),
			WindowMs:              time.Duration(getIntValue(rateLimitData, "WINDOW_MS", 60000)) * time.Millisecond,
			MaxRequests:           getIntValue(rateLimitData, "MAX_REQUESTS", 100),
			SkipSuccessfulRequests: getBoolValue(rateLimitData, "SKIP_SUCCESSFUL_REQUESTS", false),
		}
	}
	
	// Auth configuration
	if authData, ok := jsConfig["auth"].(map[string]interface{}); ok {
		config.Auth = AuthConfig{
			Enabled:      getBoolValue(authData, "ENABLED", false),
			JWTSecret:    getStringValue(authData, "JWT_SECRET", "default-secret"),
			JWTExpiresIn: 24 * time.Hour, // Parse duration from string if needed
			BcryptRounds: getIntValue(authData, "BCRYPT_ROUNDS", 12),
		}
	}
	
	// Validators configuration
	config.Validators = make(map[string]ValidatorEndpoint)
	if validatorsData, ok := jsConfig["validators"].(map[string]interface{}); ok {
		for name, validatorInfo := range validatorsData {
			if validatorMap, ok := validatorInfo.(map[string]interface{}); ok {
				config.Validators[name] = ValidatorEndpoint{
					Type:     getStringValue(validatorMap, "TYPE", "UNKNOWN"),
					Host:     getStringValue(validatorMap, "HOST", "localhost"),
					Port:     getIntValue(validatorMap, "PORT", 8080),
					Endpoint: getStringValue(validatorMap, "ENDPOINT", ""),
					Timeout:  time.Duration(getIntValue(validatorMap, "TIMEOUT", 30000)) * time.Millisecond,
				}
			}
		}
	}
	
	// Monitoring configuration
	if monitoringData, ok := jsConfig["monitoring"].(map[string]interface{}); ok {
		config.Monitoring = MonitoringConfig{
			HealthCheckInterval: time.Duration(getIntValue(monitoringData, "healthCheckInterval", 30000)) * time.Millisecond,
			MetricsEnabled:      getBoolValue(monitoringData, "metricsEnabled", true),
			MetricsPort:         getIntValue(monitoringData, "metricsPort", 9090),
			LogLevel:            getStringValue(monitoringData, "logLevel", "info"),
		}
	}
	
	return config, nil
}

// loadConfigFromEnv loads configuration from environment variables as fallback
func loadConfigFromEnv() *GatewayConfig {
	return &GatewayConfig{
		Host:        getEnvOrDefault("API_GATEWAY_HOST", "localhost"),
		Port:        getEnvIntOrDefault("API_GATEWAY_PORT", 8000),
		Version:     getEnvOrDefault("API_VERSION", "2.0.0"),
		BasePath:    getEnvOrDefault("API_BASE_PATH", "/api"),
		Timeout:     time.Duration(getEnvIntOrDefault("API_TIMEOUT", 30000)) * time.Millisecond,
		Environment: getEnvOrDefault("ENVIRONMENT", "development"),
		
		CORS: CORSConfig{
			AllowedOrigins: strings.Split(getEnvOrDefault("CORS_ALLOWED_ORIGINS", "*"), ","),
			AllowedMethods: strings.Split(getEnvOrDefault("CORS_ALLOWED_METHODS", "GET,POST,PUT,DELETE,OPTIONS"), ","),
			AllowedHeaders: strings.Split(getEnvOrDefault("CORS_ALLOWED_HEADERS", "Content-Type,Authorization,X-Request-ID"), ","),
			MaxAge:         getEnvIntOrDefault("CORS_MAX_AGE", 86400),
		},
		
		RateLimit: RateLimitConfig{
			Enabled:               getEnvBoolOrDefault("RATE_LIMIT_ENABLED", true),
			WindowMs:              time.Duration(getEnvIntOrDefault("RATE_LIMIT_WINDOW_MS", 60000)) * time.Millisecond,
			MaxRequests:           getEnvIntOrDefault("RATE_LIMIT_MAX_REQUESTS", 100),
			SkipSuccessfulRequests: getEnvBoolOrDefault("RATE_LIMIT_SKIP_SUCCESS", false),
		},
		
		Auth: AuthConfig{
			Enabled:      getEnvBoolOrDefault("AUTH_ENABLED", false),
			JWTSecret:    getEnvOrDefault("JWT_SECRET", "default-secret-change-in-production"),
			JWTExpiresIn: 24 * time.Hour,
			BcryptRounds: getEnvIntOrDefault("BCRYPT_ROUNDS", 12),
		},
		
		Validators: map[string]ValidatorEndpoint{
			"NATIONAL_BANK": {
				Type:     "LICENSE",
				Host:     getEnvOrDefault("NATIONAL_BANK_HOST", "localhost"),
				Port:     getEnvIntOrDefault("NATIONAL_BANK_PORT", 8080),
				Endpoint: getEnvOrDefault("NATIONAL_BANK_ENDPOINT", "http://localhost:8080"),
				Timeout:  time.Duration(getEnvIntOrDefault("NATIONAL_BANK_TIMEOUT", 30000)) * time.Millisecond,
			},
			"EXPORTER_BANK": {
				Type:     "INVOICE",
				Host:     getEnvOrDefault("EXPORTER_BANK_HOST", "localhost"),
				Port:     getEnvIntOrDefault("EXPORTER_BANK_PORT", 5000),
				Endpoint: getEnvOrDefault("EXPORTER_BANK_ENDPOINT", "http://localhost:5000"),
				Timeout:  time.Duration(getEnvIntOrDefault("EXPORTER_BANK_TIMEOUT", 30000)) * time.Millisecond,
			},
			"QUALITY_AUTHORITY": {
				Type:     "QUALITY",
				Host:     getEnvOrDefault("QUALITY_AUTHORITY_HOST", "localhost"),
				Port:     getEnvIntOrDefault("QUALITY_AUTHORITY_PORT", 8081),
				Endpoint: getEnvOrDefault("QUALITY_AUTHORITY_ENDPOINT", "http://localhost:8081"),
				Timeout:  time.Duration(getEnvIntOrDefault("QUALITY_AUTHORITY_TIMEOUT", 30000)) * time.Millisecond,
			},
			"CUSTOMS": {
				Type:     "SHIPPING",
				Host:     getEnvOrDefault("CUSTOMS_HOST", "localhost"),
				Port:     getEnvIntOrDefault("CUSTOMS_PORT", 8082),
				Endpoint: getEnvOrDefault("CUSTOMS_ENDPOINT", "http://localhost:8082"),
				Timeout:  time.Duration(getEnvIntOrDefault("CUSTOMS_TIMEOUT", 30000)) * time.Millisecond,
			},
		},
		
		Monitoring: MonitoringConfig{
			HealthCheckInterval: time.Duration(getEnvIntOrDefault("HEALTH_CHECK_INTERVAL", 30000)) * time.Millisecond,
			MetricsEnabled:      getEnvBoolOrDefault("METRICS_ENABLED", true),
			MetricsPort:         getEnvIntOrDefault("METRICS_PORT", 9090),
			LogLevel:            getEnvOrDefault("LOG_LEVEL", "info"),
		},
	}
}

// Helper functions for type conversion and safe access

func getStringValue(data map[string]interface{}, key, defaultValue string) string {
	if val, ok := data[key].(string); ok {
		return val
	}
	return defaultValue
}

func getIntValue(data map[string]interface{}, key string, defaultValue int) int {
	if val, ok := data[key].(float64); ok {
		return int(val)
	}
	if val, ok := data[key].(int); ok {
		return val
	}
	return defaultValue
}

func getBoolValue(data map[string]interface{}, key string, defaultValue bool) bool {
	if val, ok := data[key].(bool); ok {
		return val
	}
	return defaultValue
}

func getStringArrayValue(data map[string]interface{}, key string, defaultValue []string) []string {
	if val, ok := data[key].([]interface{}); ok {
		result := make([]string, len(val))
		for i, v := range val {
			if str, ok := v.(string); ok {
				result[i] = str
			}
		}
		return result
	}
	return defaultValue
}

func getEnvIntOrDefault(key string, defaultValue int) int {
	if value := os.Getenv(key); value != "" {
		if intValue, err := strconv.Atoi(value); err == nil {
			return intValue
		}
	}
	return defaultValue
}

func getEnvBoolOrDefault(key string, defaultValue bool) bool {
	if value := os.Getenv(key); value != "" {
		return strings.ToLower(value) == "true"
	}
	return defaultValue
}

// LoadConfig loads the configuration from the centralized config system
func LoadConfig() (*GatewayConfig, error) {
	// Try to load from the centralized JS config first
	if config, err := loadConfigFromJS(); err == nil {
		return config, nil
	}
	
	// Fall back to environment variables
	return loadConfigFromEnv(), nil
}