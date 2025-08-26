package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"
)

// enableCORS adds CORS headers to allow cross-origin requests
func enableCORS(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
	
	// Handle preflight requests
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}
}

// corsWrapper wraps handlers with CORS support
func corsWrapper(handler http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		enableCORS(w, r)
		if r.Method == "OPTIONS" {
			return
		}
		handler(w, r)
	}
}

func main() {
	// API endpoints with CORS support
	http.HandleFunc("/api/auth/login", corsWrapper(loginHandler))
	http.HandleFunc("/api/documents", corsWrapper(uploadDocumentHandler))
	http.HandleFunc("/api/exports", corsWrapper(submitExportHandler))
	http.HandleFunc("/api/pending-approvals", corsWrapper(pendingApprovalsHandler))
	http.HandleFunc("/api/completed-approvals", corsWrapper(completedApprovalsHandler))
	http.HandleFunc("/health", corsWrapper(healthHandler))

	// Start HTTP server
	fmt.Println("API Gateway running on port 8000 with CORS enabled")
	if err := http.ListenAndServe(":8000", nil); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
	// Mock implementation for demonstration
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"token": "mock-auth-token"})
}

func uploadDocumentHandler(w http.ResponseWriter, r *http.Request) {
	// Mock implementation for demonstration
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"cid": "mock-cid"})
}

func submitExportHandler(w http.ResponseWriter, r *http.Request) {
	// Mock implementation for demonstration
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusAccepted)
	json.NewEncoder(w).Encode(map[string]string{"status": "accepted", "exportId": "EXP-2024-" + fmt.Sprintf("%d", time.Now().Unix())})
}

// pendingApprovalsHandler returns mock pending approvals for development
func pendingApprovalsHandler(w http.ResponseWriter, r *http.Request) {
	org := r.URL.Query().Get("org")
	
	// Mock data for development - replace with real blockchain queries
	mockApprovals := map[string]interface{}{
		"pendingApprovals": []map[string]interface{}{
			{
				"id":          "1",
				"exportId":    "EXP-2024-001",
				"docType":     getDocTypeForOrg(org),
				"hash":        "a1b2c3d4e5f6789012345",
				"exporterName": "Colombian Coffee Co.",
				"timestamp":   time.Now().Format(time.RFC3339),
				"urgencyLevel": "HIGH",
			},
			{
				"id":          "2",
				"exportId":    "EXP-2024-002",
				"docType":     getDocTypeForOrg(org),
				"hash":        "x9y8z7w6v5u4t3s2r1q0",
				"exporterName": "Brazilian Beans Ltd.",
				"timestamp":   time.Now().Add(-1 * time.Hour).Format(time.RFC3339),
				"urgencyLevel": "MEDIUM",
			},
		},
	}
	
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(mockApprovals)
}

// completedApprovalsHandler returns mock completed approvals for development
func completedApprovalsHandler(w http.ResponseWriter, r *http.Request) {
	org := r.URL.Query().Get("org")
	
	// Mock data for development - replace with real blockchain queries
	mockCompletedApprovals := map[string]interface{}{
		"completedApprovals": []map[string]interface{}{
			{
				"id":          "3",
				"exportId":    "EXP-2024-003",
				"docType":     getDocTypeForOrg(org),
				"hash":        "completed123",
				"exporterName": "Test Exporter",
				"timestamp":   time.Now().Add(-2 * time.Hour).Format(time.RFC3339),
				"status":      "APPROVED",
				"reviewedBy":  org + " Officer",
				"reviewDate":  time.Now().Add(-1 * time.Hour).Format(time.RFC3339),
				"comments":    "Document approved after review",
			},
		},
	}
	
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(mockCompletedApprovals)
}

// healthHandler provides a health check endpoint
func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":    "healthy",
		"service":   "api-gateway",
		"timestamp": time.Now().Format(time.RFC3339),
	})
}

// getDocTypeForOrg returns the document type that an organization is responsible for
func getDocTypeForOrg(org string) string {
	switch org {
	case "national-bank":
		return "LICENSE"
	case "exporter-bank":
		return "INVOICE"
	case "quality-authority":
		return "QUALITY"
	case "customs":
		return "SHIPPING"
	default:
		return "LICENSE"
	}
}