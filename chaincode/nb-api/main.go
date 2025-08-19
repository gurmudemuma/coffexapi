package main

import (
	"log"
	"os"

	"github.com/coffex/chaincode/shared"
)

func main() {
	// Get configuration for license validator
	config := shared.GetConfigForType(shared.LicenseValidator)
	
	// Override with environment variables if provided
	if envHashes := shared.GetValidHashesFromEnv("VALID_LICENSES"); len(envHashes) > 0 {
		config.ValidHashes = envHashes
	}
	
	if port := os.Getenv("PORT"); port != "" {
		config.Port = port
	}

	// Create and start validator service
	validator := shared.NewValidatorService(config)
	
	log.Printf("NB API Validator running on port %s\n", config.Port)
	
	if err := validator.StartServer(); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}