package main

import (
	"fmt"
	"log"
	"os"
	"github.com/coffex/chaincode/shared"
)

func main() {
	// Get validator type from environment or use default
	validatorType := os.Getenv("VALIDATOR_TYPE")
	if validatorType == "" {
		validatorType = "LICENSE"
	}

	// Get configuration for this validator type
	config := shared.GetConfigForType(shared.ValidatorType(validatorType))
	
	// Override with environment variables if provided
	if envHashes := shared.GetValidHashesFromEnv("VALID_LICENSES"); len(envHashes) > 0 {
		config.ValidHashes = envHashes
	}
	
	if port := os.Getenv("PORT"); port != "" {
		config.Port = port
	}

	// Create and start validator service
	validator := shared.NewValidatorService(config)
	
	fmt.Printf("National Bank Validator (%s) running on port %s\n", config.ValidatorType, config.Port)
	
	if err := validator.StartServer(); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}