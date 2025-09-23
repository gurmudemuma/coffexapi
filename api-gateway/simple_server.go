//go:build ignore

package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"sync"
	"time"
)

// Sample data storage
var (
	sampleExports = make(map[string]map[string]interface{})
	sampleMutex   sync.RWMutex
)

// ExporterDashboardData represents the dashboard overview
type ExporterDashboardData struct {
	TotalRequests   int                     `json:"totalRequests"`
	PendingApproval int                     `json:"pendingApproval"`
	Approved        int                     `json:"approved"`
	Rejected        int                     `json:"rejected"`
	RecentRequests  []ExporterRequestInfo   `json:"recentRequests"`
	Notifications   []DashboardNotification `json:"notifications"`
}

// ExporterRequestInfo represents a request in the list
type ExporterRequestInfo struct {
	ExportID           string  `json:"exportId"`
	ReferenceNumber    string  `json:"referenceNumber"`
	SubmissionDate     string  `json:"submissionDate"`
	Status             string  `json:"status"`
	CurrentApprover    string  `json:"currentApprover"`
	LastUpdated        string  `json:"lastUpdated"`
	DocumentCount      int     `json:"documentCount"`
	ProgressPercent    int     `json:"progressPercent"`
	ExporterName       string  `json:"exporterName"`
	UrgencyLevel       string  `json:"urgencyLevel"`
	DestinationCountry string  `json:"destinationCountry"`
	TotalValue         float64 `json:"totalValue"`
}

// DashboardNotification represents a notification
type DashboardNotification struct {
	ID        string `json:"id"`
	Type      string `json:"type"`
	ExportID  string `json:"exportId"`
	Title     string `json:"title"`
	Message   string `json:"message"`
	Timestamp string `json:"timestamp"`
	IsRead    bool   `json:"isRead"`
	Priority  string `json:"priority"`
}

// enableCORS adds CORS headers
func enableCORS(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
	w.Header().Set("Access-Control-Max-Age", "86400")

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}
}

// corsWrapper wraps handlers with CORS
func corsWrapper(handler http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		enableCORS(w, r)
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		handler(w, r)
	}
}

func main() {
	// Serve static files (including test-api.html)
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/" {
			http.ServeFile(w, r, "test-api.html")
			return
		}
		http.ServeFile(w, r, "."+r.URL.Path)
	})

	// API Routes
	http.HandleFunc("/api/exporter/dashboard", corsWrapper(getExporterDashboardHandler))
	http.HandleFunc("/api/exporter/requests", corsWrapper(getExporterRequestsHandler))
	http.HandleFunc("/api/test/create-sample-data", corsWrapper(createSampleDataHandler))
	http.HandleFunc("/health", corsWrapper(healthHandler))

	fmt.Println("Server running on http://localhost:8000")
	fmt.Println("Open http://localhost:8000 to test the API")
	if err := http.ListenAndServe(":8000", nil); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}

// createSampleDataHandler creates sample export data
func createSampleDataHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	sampleRequests := []map[string]interface{}{
		{
			"exportId":           "EXP-2024-001",
			"referenceNumber":    "REF-001-2024",
			"exporterName":       "Coffee Exporter Co.",
			"status":             "pending",
			"submissionDate":     time.Now().AddDate(0, 0, -5).Format(time.RFC3339),
			"lastUpdated":        time.Now().AddDate(0, 0, -1).Format(time.RFC3339),
			"currentApprover":    "National Bank",
			"progressPercent":    25,
			"documentCount":      4,
			"totalValue":         50000,
			"destinationCountry": "Germany",
		},
		{
			"exportId":           "EXP-2024-002",
			"referenceNumber":    "REF-002-2024",
			"exporterName":       "Coffee Exporter Co.",
			"status":             "approved",
			"submissionDate":     time.Now().AddDate(0, 0, -10).Format(time.RFC3339),
			"lastUpdated":        time.Now().AddDate(0, 0, -2).Format(time.RFC3339),
			"currentApprover":    "Completed",
			"progressPercent":    100,
			"documentCount":      4,
			"totalValue":         75000,
			"destinationCountry": "USA",
		},
		{
			"exportId":           "EXP-2024-003",
			"referenceNumber":    "REF-003-2024",
			"exporterName":       "Coffee Exporter Co.",
			"status":             "rejected",
			"submissionDate":     time.Now().AddDate(0, 0, -7).Format(time.RFC3339),
			"lastUpdated":        time.Now().AddDate(0, 0, -3).Format(time.RFC3339),
			"currentApprover":    "Coffee Authority",
			"progressPercent":    50,
			"documentCount":      4,
			"totalValue":         30000,
			"destinationCountry": "Japan",
		},
		{
			"exportId":           "EXP-2024-004",
			"referenceNumber":    "REF-004-2024",
			"exporterName":       "Coffee Exporter Co.",
			"status":             "pending",
			"submissionDate":     time.Now().AddDate(0, 0, -3).Format(time.RFC3339),
			"lastUpdated":        time.Now().Format(time.RFC3339),
			"currentApprover":    "Exporter Bank",
			"progressPercent":    75,
			"documentCount":      4,
			"totalValue":         60000,
			"destinationCountry": "Netherlands",
		},
	}

	sampleMutex.Lock()
	for _, req := range sampleRequests {
		exportId := req["exportId"].(string)
		sampleExports[exportId] = req
		fmt.Printf("Created sample export request: %s\n", exportId)
	}
	sampleMutex.Unlock()

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"message": "Sample data created successfully",
		"count":   len(sampleRequests),
	})
}

// getExporterDashboardHandler returns dashboard overview
func getExporterDashboardHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	exporterFilter := r.URL.Query().Get("exporter")
	if exporterFilter == "" {
		exporterFilter = "Coffee Exporter Co."
	}

	var totalRequests, pendingApproval, approved, rejected int
	var recentRequests []ExporterRequestInfo

	sampleMutex.RLock()
	for exportID, exportData := range sampleExports {
		exporterName, ok := exportData["exporterName"].(string)
		if !ok || exporterName != exporterFilter {
			continue
		}

		totalRequests++

		status, _ := exportData["status"].(string)
		switch strings.ToUpper(status) {
		case "PENDING":
			pendingApproval++
		case "APPROVED":
			approved++
		case "REJECTED":
			rejected++
		}

		// Build request info
		submissionDate, _ := exportData["submissionDate"].(string)
		lastUpdated, _ := exportData["lastUpdated"].(string)
		currentApprover, _ := exportData["currentApprover"].(string)
		referenceNumber, _ := exportData["referenceNumber"].(string)
		documentCount, _ := exportData["documentCount"].(int)
		progressPercent, _ := exportData["progressPercent"].(int)
		totalValue, _ := exportData["totalValue"].(int)
		destinationCountry, _ := exportData["destinationCountry"].(string)

		request := ExporterRequestInfo{
			ExportID:           exportID,
			ReferenceNumber:    referenceNumber,
			SubmissionDate:     submissionDate,
			Status:             strings.ToUpper(status),
			CurrentApprover:    currentApprover,
			LastUpdated:        lastUpdated,
			DocumentCount:      documentCount,
			ProgressPercent:    progressPercent,
			ExporterName:       exporterName,
			UrgencyLevel:       "HIGH",
			DestinationCountry: destinationCountry,
			TotalValue:         float64(totalValue),
		}

		recentRequests = append(recentRequests, request)
	}
	sampleMutex.RUnlock()

	if len(recentRequests) > 5 {
		recentRequests = recentRequests[:5]
	}

	dashboard := ExporterDashboardData{
		TotalRequests:   totalRequests,
		PendingApproval: pendingApproval,
		Approved:        approved,
		Rejected:        rejected,
		RecentRequests:  recentRequests,
		Notifications:   []DashboardNotification{},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(dashboard)
}

// getExporterRequestsHandler returns filtered requests
func getExporterRequestsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	exporterFilter := r.URL.Query().Get("exporter")
	statusFilter := r.URL.Query().Get("status")
	search := r.URL.Query().Get("search")
	if exporterFilter == "" {
		exporterFilter = "Coffee Exporter Co."
	}

	var requests []ExporterRequestInfo

	sampleMutex.RLock()
	for exportID, exportData := range sampleExports {
		exporterName, ok := exportData["exporterName"].(string)
		if !ok || exporterName != exporterFilter {
			continue
		}

		status, _ := exportData["status"].(string)
		statusUpper := strings.ToUpper(status)

		// Apply status filter
		if statusFilter != "" && statusFilter != "all" && strings.ToLower(statusUpper) != strings.ToLower(statusFilter) {
			continue
		}

		referenceNumber, _ := exportData["referenceNumber"].(string)

		// Apply search filter
		if search != "" {
			if !strings.Contains(strings.ToLower(exportID), strings.ToLower(search)) &&
				!strings.Contains(strings.ToLower(referenceNumber), strings.ToLower(search)) {
				continue
			}
		}

		// Extract fields
		submissionDate, _ := exportData["submissionDate"].(string)
		lastUpdated, _ := exportData["lastUpdated"].(string)
		currentApprover, _ := exportData["currentApprover"].(string)
		documentCount, _ := exportData["documentCount"].(int)
		progressPercent, _ := exportData["progressPercent"].(int)
		totalValue, _ := exportData["totalValue"].(int)
		destinationCountry, _ := exportData["destinationCountry"].(string)

		request := ExporterRequestInfo{
			ExportID:           exportID,
			ReferenceNumber:    referenceNumber,
			SubmissionDate:     submissionDate,
			Status:             statusUpper,
			CurrentApprover:    currentApprover,
			LastUpdated:        lastUpdated,
			DocumentCount:      documentCount,
			ProgressPercent:    progressPercent,
			ExporterName:       exporterName,
			UrgencyLevel:       "HIGH",
			DestinationCountry: destinationCountry,
			TotalValue:         float64(totalValue),
		}

		requests = append(requests, request)
	}
	sampleMutex.RUnlock()

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"requests": requests,
		"total":    len(requests),
		"filters": map[string]interface{}{
			"exporter": exporterFilter,
			"status":   statusFilter,
			"search":   search,
		},
	})
}

// healthHandler provides health check
func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "healthy"})
}
