package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/hyperledger/fabric-sdk-go/pkg/gateway"
	"github.com/rs/cors"
)

var (
	fabricGateway *gateway.Gateway
	appConfig     *Config
)

func main() {
	// Load config
	var err error
	appConfig, err = LoadConfig("config.yaml")
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// Initialize Fabric gateway
	fabricGateway, err = setupFabricGateway(appConfig)
	if err != nil {
		log.Fatalf("Failed to setup Fabric gateway: %v", err)
	}
	defer fabricGateway.Close()

	// Create a new router
	router := http.NewServeMux()

	// API endpoints
	router.HandleFunc("/api/auth/login", loginHandler)
	router.HandleFunc("/api/auth/register", registerUserHandler)

	authRouter := http.NewServeMux()
	authRouter.HandleFunc("/api/approval-channels/summary", getOrganizationSummaryHandler)
	authRouter.HandleFunc("/api/exports", submitExportHandler)
	authRouter.HandleFunc("/api/approval-channels/submit-decision", submitApprovalDecisionHandler)
	authRouter.HandleFunc("/api/exporter/dashboard", getExporterDashboardHandler)
	authRouter.HandleFunc("/api/exporter/requests", getExporterRequestsHandler)
	authRouter.HandleFunc("/api/exporter/request/", getExporterRequestDetailHandler)
	authRouter.HandleFunc("/api/supervisor/exports", getBankSupervisorExportsHandler)
	authRouter.HandleFunc("/api/supervisor/export/", getBankSupervisorViewHandler)
	authRouter.HandleFunc("/api/documents/", viewDocumentHandler)
	authRouter.HandleFunc("/api/approval-chain/", getApprovalChainHandler)
	authRouter.HandleFunc("/api/completed-approvals", getCompletedApprovalsHandler)
	authRouter.HandleFunc("/api/search", searchHandler)
	authRouter.HandleFunc("/api/activity-log", getActivityLogHandler)

	// IPFS proxy needs to be handled by the main router to have CORS middleware applied
	router.HandleFunc("/api/ipfs/", ipfsProxyHandler)

	router.Handle("/api/", jwtMiddleware(authRouter))

	// Start HTTP server with CORS middleware
	fmt.Printf("API Gateway running on port %s with CORS enabled\n", appConfig.Server.Port)

	c := cors.New(cors.Options{
		AllowedOrigins: appConfig.Server.Cors.AllowedOrigins,
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{"Content-Type", "Authorization", "X-User-Role", "X-Organization", "X-Requested-With"},
	})

	server := &http.Server{
		Addr:    ":" + appConfig.Server.Port,
		Handler: c.Handler(router),
	}

	if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatal("Failed to start server:", err)
	}
}
