package shared

// ValidatorType represents different types of document validators
type ValidatorType string

const (
	LicenseValidator  ValidatorType = "LICENSE"
	InvoiceValidator  ValidatorType = "INVOICE"
	QualityValidator  ValidatorType = "QUALITY"
	ShippingValidator ValidatorType = "SHIPPING"
)

// DefaultConfigs provides default configurations for each validator type
func DefaultConfigs() map[ValidatorType]ValidatorConfig {
	return map[ValidatorType]ValidatorConfig{
		LicenseValidator: {
			ValidatorType: "LICENSE",
			Port:         "8080",
			ValidHashes: map[string]bool{
				"a1b2c3d4": true,
				"e5f6g7h8": true,
			},
		},
		InvoiceValidator: {
			ValidatorType: "INVOICE",
			Port:         "5000",
			ValidHashes: map[string]bool{
				"x9y8z7": true,
				"w6v5u4": false, // Invalid invoice
			},
		},
		QualityValidator: {
			ValidatorType: "QUALITY",
			Port:         "8081",
			ValidHashes: map[string]bool{
				"q1w2e3r4": true,
				"t5y6u7i8": true,
			},
		},
		ShippingValidator: {
			ValidatorType: "SHIPPING",
			Port:         "8082",
			ValidHashes: map[string]bool{
				"s1h2i3p4": true,
				"p5i6n7g8": true,
			},
		},
	}
}

// GetConfigForType returns configuration for a specific validator type
func GetConfigForType(validatorType ValidatorType) ValidatorConfig {
	configs := DefaultConfigs()
	if config, exists := configs[validatorType]; exists {
		return config
	}
	
	// Return default config if type not found
	return ValidatorConfig{
		ValidatorType: string(validatorType),
		Port:         "8080",
		ValidHashes:  make(map[string]bool),
	}
}
