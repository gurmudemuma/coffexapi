package shared

import (
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"
	"time"
)

// ValidatorType represents different types of document validators
type ValidatorType string

const (
	LicenseValidator  ValidatorType = "LICENSE"
	InvoiceValidator  ValidatorType = "INVOICE"
	QualityValidator  ValidatorType = "QUALITY"
	ShippingValidator ValidatorType = "SHIPPING"
)

// String returns the string representation of ValidatorType
func (vt ValidatorType) String() string {
	return string(vt)
}

// IsValid checks if the validator type is valid
func (vt ValidatorType) IsValid() bool {
	switch vt {
	case LicenseValidator, InvoiceValidator, QualityValidator, ShippingValidator:
		return true
	default:
		return false
	}
}

// SystemConfig holds system-wide configuration
type SystemConfig struct {
	NetworkName        string            `json:"networkName"`
	ChannelName        string            `json:"channelName"`
	ChaincodeName      string            `json:"chaincodeName"`
	ChaincodeVersion   string            `json:"chaincodeVersion"`
	Environment        string            `json:"environment"` // dev, staging, prod
	LogLevel           string            `json:"logLevel"`
	Validators         map[ValidatorType]*ValidatorConfig `json:"validators"`
	Timeouts           TimeoutConfig     `json:"timeouts"`
	Security           SecurityConfig    `json:"security"`
	IPFS               IPFSConfig        `json:"ipfs"`
	DatabaseConfig     DatabaseConfig    `json:"database"`
}

// TimeoutConfig holds timeout configurations
type TimeoutConfig struct {
	ValidationTimeout    time.Duration `json:"validationTimeout"`
	TransactionTimeout   time.Duration `json:"transactionTimeout"`
	ConnectionTimeout    time.Duration `json:"connectionTimeout"`
	RetryAttempts        int           `json:"retryAttempts"`
	RetryBackoffSeconds  int           `json:"retryBackoffSeconds"`
}

// SecurityConfig holds security-related configurations
type SecurityConfig struct {
	TLSEnabled         bool   `json:"tlsEnabled"`
	CertPath           string `json:"certPath"`
	KeyPath            string `json:"keyPath"`
	CACertPath         string `json:"caCertPath"`
	EncryptionEnabled  bool   `json:"encryptionEnabled"`
	HashAlgorithm      string `json:"hashAlgorithm"`
}

// IPFSConfig holds IPFS-related configurations
type IPFSConfig struct {
	APIEndpoint      string `json:"apiEndpoint"`
	GatewayEndpoint  string `json:"gatewayEndpoint"`
	Timeout          time.Duration `json:"timeout"`
	EncryptionKey    string `json:"encryptionKey,omitempty"`
	MaxFileSize      int64  `json:"maxFileSize"`
}

// DatabaseConfig holds database-related configurations
type DatabaseConfig struct {
	CouchDBEnabled   bool              `json:"couchDbEnabled"`
	CouchDBEndpoints map[string]string `json:"couchDbEndpoints"`
	IndexingEnabled  bool              `json:"indexingEnabled"`
	BackupEnabled    bool              `json:"backupEnabled"`
}

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

// Validate validates the validator configuration
func (vc *ValidatorConfig) Validate() error {
	if vc.ValidatorType == "" {
		return fmt.Errorf("validator type is required")
	}
	
	if vc.Port == "" {
		return fmt.Errorf("port is required")
	}
	
	if vc.Host == "" {
		vc.Host = "localhost" // default
	}
	
	if vc.HealthCheckPath == "" {
		vc.HealthCheckPath = "/health" // default
	}
	
	if vc.Timeout == 0 {
		vc.Timeout = 30 * time.Second // default
	}
	
	if vc.RetryAttempts == 0 {
		vc.RetryAttempts = 3 // default
	}
	
	if vc.MaxRequestsPerMin == 0 {
		vc.MaxRequestsPerMin = 60 // default
	}
	
	return nil
}

// GetFullEndpoint returns the complete endpoint URL
func (vc *ValidatorConfig) GetFullEndpoint() string {
	protocol := "http"
	if vc.TLSEnabled {
		protocol = "https"
	}
	return fmt.Sprintf("%s://%s:%s", protocol, vc.Host, vc.Port)
}

// GetValidationEndpoint returns the validation endpoint URL
func (vc *ValidatorConfig) GetValidationEndpoint() string {
	return fmt.Sprintf("%s/validate", vc.GetFullEndpoint())
}

// GetHealthCheckEndpoint returns the health check endpoint URL
func (vc *ValidatorConfig) GetHealthCheckEndpoint() string {
	return fmt.Sprintf("%s%s", vc.GetFullEndpoint(), vc.HealthCheckPath)
}

// DefaultConfigs provides default configurations for each validator type with comprehensive settings
func DefaultConfigs() map[ValidatorType]*ValidatorConfig {
	return map[ValidatorType]*ValidatorConfig{
		LicenseValidator: {
			ValidatorType:     "LICENSE",
			Port:             "8080",
			Host:             "localhost",
			HealthCheckPath:  "/health",
			Timeout:          30 * time.Second,
			RetryAttempts:    3,
			TLSEnabled:       false,
			AuthEnabled:      false,
			RateLimitEnabled: true,
			MaxRequestsPerMin: 60,
			ValidHashes: map[string]bool{
				"a1b2c3d4e5f6789012345": true,
				"e5f6g7h8901234567890a": true,
			},
			Environment: getEnvOrDefault("ENVIRONMENT", "development"),
			Metadata: map[string]string{
				"organization": "National Bank",
				"responsibility": "Export License Validation",
			},
		},
		InvoiceValidator: {
			ValidatorType:     "INVOICE",
			Port:             "5000",
			Host:             "localhost",
			HealthCheckPath:  "/health",
			Timeout:          30 * time.Second,
			RetryAttempts:    3,
			TLSEnabled:       false,
			AuthEnabled:      false,
			RateLimitEnabled: true,
			MaxRequestsPerMin: 60,
			ValidHashes: map[string]bool{
				"x9y8z7w6v5u4t3s2r1q0": true,
				"w6v5u4t3s2r1q0p9o8n7": true,
			},
			Environment: getEnvOrDefault("ENVIRONMENT", "development"),
			Metadata: map[string]string{
				"organization": "Exporter Bank",
				"responsibility": "Invoice Validation",
			},
		},
		QualityValidator: {
			ValidatorType:     "QUALITY",
			Port:             "8081",
			Host:             "localhost",
			HealthCheckPath:  "/health",
			Timeout:          30 * time.Second,
			RetryAttempts:    3,
			TLSEnabled:       false,
			AuthEnabled:      false,
			RateLimitEnabled: true,
			MaxRequestsPerMin: 60,
			ValidHashes: map[string]bool{
				"q1w2e3r4t5y6u7i8o9p0": true,
				"t5y6u7i8o9p0a1s2d3f4": true,
			},
			Environment: getEnvOrDefault("ENVIRONMENT", "development"),
			Metadata: map[string]string{
				"organization": "Coffee Quality Authority",
				"responsibility": "Quality Certificate Validation",
			},
		},
		ShippingValidator: {
			ValidatorType:     "SHIPPING",
			Port:             "8082",
			Host:             "localhost",
			HealthCheckPath:  "/health",
			Timeout:          30 * time.Second,
			RetryAttempts:    3,
			TLSEnabled:       false,
			AuthEnabled:      false,
			RateLimitEnabled: true,
			MaxRequestsPerMin: 60,
			ValidHashes: map[string]bool{
				"s1h2i3p4p5i6n7g8d9o0": true,
				"p5i6n7g8d9o0c1u2m3e4": true,
			},
			Environment: getEnvOrDefault("ENVIRONMENT", "development"),
			Metadata: map[string]string{
				"organization": "Customs Authority",
				"responsibility": "Shipping Documents Validation",
			},
		},
	}
}

// GetConfigForType returns configuration for a specific validator type with environment overrides
func GetConfigForType(validatorType ValidatorType) *ValidatorConfig {
	configs := DefaultConfigs()
	if config, exists := configs[validatorType]; exists {
		// Apply environment variable overrides
		config = applyEnvironmentOverrides(config, validatorType)
		return config
	}
	
	// Return default config if type not found
	defaultConfig := &ValidatorConfig{
		ValidatorType:     string(validatorType),
		Port:             "8080",
		Host:             "localhost",
		HealthCheckPath:  "/health",
		Timeout:          30 * time.Second,
		RetryAttempts:    3,
		ValidHashes:      make(map[string]bool),
		Environment:      getEnvOrDefault("ENVIRONMENT", "development"),
	}
	
	return applyEnvironmentOverrides(defaultConfig, validatorType)
}

// applyEnvironmentOverrides applies environment variable overrides to configuration
func applyEnvironmentOverrides(config *ValidatorConfig, validatorType ValidatorType) *ValidatorConfig {
	envPrefix := strings.ToUpper(string(validatorType))
	
	// Override port
	if port := os.Getenv(envPrefix + "_PORT"); port != "" {
		config.Port = port
	}
	
	// Override host
	if host := os.Getenv(envPrefix + "_HOST"); host != "" {
		config.Host = host
	}
	
	// Override timeout
	if timeoutStr := os.Getenv(envPrefix + "_TIMEOUT"); timeoutStr != "" {
		if timeout, err := time.ParseDuration(timeoutStr); err == nil {
			config.Timeout = timeout
		}
	}
	
	// Override TLS setting
	if tlsStr := os.Getenv(envPrefix + "_TLS_ENABLED"); tlsStr != "" {
		config.TLSEnabled = strings.ToLower(tlsStr) == "true"
	}
	
	// Override auth setting
	if authStr := os.Getenv(envPrefix + "_AUTH_ENABLED"); authStr != "" {
		config.AuthEnabled = strings.ToLower(authStr) == "true"
	}
	
	// Override API key
	if apiKey := os.Getenv(envPrefix + "_API_KEY"); apiKey != "" {
		config.APIKey = apiKey
	}
	
	// Override retry attempts
	if retryStr := os.Getenv(envPrefix + "_RETRY_ATTEMPTS"); retryStr != "" {
		if retries, err := strconv.Atoi(retryStr); err == nil && retries > 0 {
			config.RetryAttempts = retries
		}
	}
	
	// Override valid hashes from environment
	if hashesStr := os.Getenv("VALID_" + envPrefix + "_HASHES"); hashesStr != "" {
		config.ValidHashes = parseValidHashes(hashesStr)
	}
	
	// Validate and set defaults
	if err := config.Validate(); err != nil {
		log.Printf("Configuration validation warning for %s: %v", validatorType, err)
	}
	
	return config
}

// parseValidHashes parses comma-separated valid hashes from environment
func parseValidHashes(hashesStr string) map[string]bool {
	hashes := make(map[string]bool)
	for _, hash := range strings.Split(hashesStr, ",") {
		hash = strings.TrimSpace(hash)
		if hash != "" {
			hashes[hash] = true
		}
	}
	return hashes
}

// getEnvOrDefault returns environment variable value or default
func getEnvOrDefault(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

// LoadSystemConfig loads the complete system configuration with environment overrides
func LoadSystemConfig() *SystemConfig {
	return &SystemConfig{
		NetworkName:      getEnvOrDefault("NETWORK_NAME", "coffee-export-network"),
		ChannelName:      getEnvOrDefault("CHANNEL_NAME", "coffee-channel"),
		ChaincodeName:    getEnvOrDefault("CHAINCODE_NAME", "coffee-export"),
		ChaincodeVersion: getEnvOrDefault("CHAINCODE_VERSION", "1.0"),
		Environment:      getEnvOrDefault("ENVIRONMENT", "development"),
		LogLevel:         getEnvOrDefault("LOG_LEVEL", "INFO"),
		Validators:       DefaultConfigs(),
		Timeouts: TimeoutConfig{
			ValidationTimeout:   parseDurationOrDefault("VALIDATION_TIMEOUT", 60*time.Second),
			TransactionTimeout:  parseDurationOrDefault("TRANSACTION_TIMEOUT", 30*time.Second),
			ConnectionTimeout:   parseDurationOrDefault("CONNECTION_TIMEOUT", 10*time.Second),
			RetryAttempts:       parseIntOrDefault("RETRY_ATTEMPTS", 3),
			RetryBackoffSeconds: parseIntOrDefault("RETRY_BACKOFF_SECONDS", 2),
		},
		Security: SecurityConfig{
			TLSEnabled:        parseBoolOrDefault("TLS_ENABLED", true),
			CertPath:          getEnvOrDefault("CERT_PATH", "/etc/ssl/certs"),
			KeyPath:           getEnvOrDefault("KEY_PATH", "/etc/ssl/private"),
			CACertPath:        getEnvOrDefault("CA_CERT_PATH", "/etc/ssl/ca"),
			EncryptionEnabled: parseBoolOrDefault("ENCRYPTION_ENABLED", true),
			HashAlgorithm:     getEnvOrDefault("HASH_ALGORITHM", "SHA256"),
		},
		IPFS: IPFSConfig{
			APIEndpoint:     getEnvOrDefault("IPFS_API_ENDPOINT", "http://localhost:5001"),
			GatewayEndpoint: getEnvOrDefault("IPFS_GATEWAY_ENDPOINT", "http://localhost:8080"),
			Timeout:         parseDurationOrDefault("IPFS_TIMEOUT", 60*time.Second),
			EncryptionKey:   os.Getenv("IPFS_ENCRYPTION_KEY"),
			MaxFileSize:     parseInt64OrDefault("IPFS_MAX_FILE_SIZE", 100*1024*1024), // 100MB
		},
		DatabaseConfig: DatabaseConfig{
			CouchDBEnabled:  parseBoolOrDefault("COUCHDB_ENABLED", true),
			IndexingEnabled: parseBoolOrDefault("INDEXING_ENABLED", true),
			BackupEnabled:   parseBoolOrDefault("BACKUP_ENABLED", false),
			CouchDBEndpoints: map[string]string{
				"nationalbank":    getEnvOrDefault("COUCHDB_NATIONALBANK_ENDPOINT", "http://localhost:15984"),
				"exporterbank":    getEnvOrDefault("COUCHDB_EXPORTERBANK_ENDPOINT", "http://localhost:15985"),
				"coffeeauthority": getEnvOrDefault("COUCHDB_COFFEEAUTHORITY_ENDPOINT", "http://localhost:15986"),
				"customs":         getEnvOrDefault("COUCHDB_CUSTOMS_ENDPOINT", "http://localhost:15987"),
			},
		},
	}
}

// Helper functions for parsing environment variables
func parseDurationOrDefault(key string, defaultValue time.Duration) time.Duration {
	if str := os.Getenv(key); str != "" {
		if duration, err := time.ParseDuration(str); err == nil {
			return duration
		}
	}
	return defaultValue
}

func parseIntOrDefault(key string, defaultValue int) int {
	if str := os.Getenv(key); str != "" {
		if value, err := strconv.Atoi(str); err == nil {
			return value
		}
	}
	return defaultValue
}

func parseInt64OrDefault(key string, defaultValue int64) int64 {
	if str := os.Getenv(key); str != "" {
		if value, err := strconv.ParseInt(str, 10, 64); err == nil {
			return value
		}
	}
	return defaultValue
}

func parseBoolOrDefault(key string, defaultValue bool) bool {
	if str := os.Getenv(key); str != "" {
		return strings.ToLower(str) == "true"
	}
	return defaultValue
}
