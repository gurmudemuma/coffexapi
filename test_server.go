package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
	"sync"
	"time"
)

var (
	sampleData = make(map[string]map[string]interface{})
	dataMutex  sync.RWMutex
)

func enableCORS(w http.ResponseWriter, r *http.Request) {
	origin := r.Header.Get("Origin")
	if origin == "" || origin == "null" {
		w.Header().Set("Access-Control-Allow-Origin", "*")
	} else {
		w.Header().Set("Access-Control-Allow-Origin", origin)
	}
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
}

// approvalPendingHandler returns a list of pending approvals for a given org
// Example: GET /api/approval-channels/pending?org=exporter-bank
func approvalPendingHandler(w http.ResponseWriter, r *http.Request) {
	enableCORS(w, r)
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}
	if r.Method != "GET" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	org := r.URL.Query().Get("org")
	if org == "" {
		org = "exporter-bank"
	}

	resp := map[string]interface{}{
		"organization": org,
		"totalPending": 0,
		"items":        []interface{}{},
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

// approvalSummaryHandler returns counts per status for approver dashboards
// Example: GET /api/approval-channels/summary?org=exporter-bank
func approvalSummaryHandler(w http.ResponseWriter, r *http.Request) {
	enableCORS(w, r)
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}
	if r.Method != "GET" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	org := r.URL.Query().Get("org")
	if org == "" {
		org = "exporter-bank"
	}

	resp := map[string]interface{}{
		"organization": org,
		"pending":      0,
		"approved":     0,
		"rejected":     0,
		"total":        0,
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

func createSampleData(w http.ResponseWriter, r *http.Request) {
	enableCORS(w, r)
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	samples := []map[string]interface{}{
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

	dataMutex.Lock()
	for _, sample := range samples {
		exportId := sample["exportId"].(string)
		sampleData[exportId] = sample
		fmt.Printf("Created: %s\n", exportId)
	}
	dataMutex.Unlock()

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"message": "Sample data created",
		"count":   len(samples),
	})
}

func getDashboard(w http.ResponseWriter, r *http.Request) {
	enableCORS(w, r)
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	exporterFilter := r.URL.Query().Get("exporter")
	if exporterFilter == "" {
		exporterFilter = "Coffee Exporter Co."
	}

	var total, pending, approved, rejected int

	dataMutex.RLock()
	for _, data := range sampleData {
		exporterName, ok := data["exporterName"].(string)
		if !ok || exporterName != exporterFilter {
			continue
		}

		total++
		status, _ := data["status"].(string)
		switch strings.ToUpper(status) {
		case "PENDING":
			pending++
		case "APPROVED":
			approved++
		case "REJECTED":
			rejected++
		}
	}
	dataMutex.RUnlock()

	result := map[string]interface{}{
		"totalRequests":   total,
		"pendingApproval": pending,
		"approved":        approved,
		"rejected":        rejected,
		"recentRequests":  []interface{}{},
		"notifications":   []interface{}{},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}

func getRequests(w http.ResponseWriter, r *http.Request) {
	enableCORS(w, r)
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	exporterFilter := r.URL.Query().Get("exporter")
	statusFilter := r.URL.Query().Get("status")
	if exporterFilter == "" {
		exporterFilter = "Coffee Exporter Co."
	}

	var requests []map[string]interface{}

	dataMutex.RLock()
	for _, data := range sampleData {
		exporterName, ok := data["exporterName"].(string)
		if !ok || exporterName != exporterFilter {
			continue
		}

		status, _ := data["status"].(string)
		if statusFilter != "" && statusFilter != "all" && strings.ToLower(status) != strings.ToLower(statusFilter) {
			continue
		}

		requests = append(requests, data)
	}
	dataMutex.RUnlock()

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"requests": requests,
		"total":    len(requests),
	})
}

func submitExporterRequest(w http.ResponseWriter, r *http.Request) {
	enableCORS(w, r)
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid JSON body", http.StatusBadRequest)
		return
	}

	exporterName, _ := req["exporterName"].(string)
	if strings.TrimSpace(exporterName) == "" {
		http.Error(w, "exporterName is required", http.StatusBadRequest)
		return
	}

	exportId, _ := req["exportId"].(string)
	if exportId == "" {
		exportId = fmt.Sprintf("EXP-%d", time.Now().UnixNano()/1e6)
	}

	referenceNumber, _ := req["referenceNumber"].(string)
	if referenceNumber == "" {
		referenceNumber = fmt.Sprintf("REF-%s", exportId)
	}

	totalValue, _ := req["totalValue"].(float64)
	destinationCountry, _ := req["destinationCountry"].(string)
	documentCountFloat, _ := req["documentCount"].(float64)
	documentCount := int(documentCountFloat)
	if documentCount <= 0 {
		documentCount = 4
	}

	now := time.Now().Format(time.RFC3339)

	entry := map[string]interface{}{
		"exportId":           exportId,
		"referenceNumber":    referenceNumber,
		"exporterName":       exporterName,
		"status":             "pending",
		"submissionDate":     now,
		"lastUpdated":        now,
		"currentApprover":    "National Bank",
		"progressPercent":    10,
		"documentCount":      documentCount,
		"totalValue":         totalValue,
		"destinationCountry": destinationCountry,
	}

	dataMutex.Lock()
	sampleData[exportId] = entry
	dataMutex.Unlock()

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"exportId": exportId,
		"data":     entry,
	})
}

func getRequestDetail(w http.ResponseWriter, r *http.Request) {
	enableCORS(w, r)
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}
	if r.Method != "GET" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	parts := strings.Split(strings.TrimPrefix(r.URL.Path, "/api/exporter/request/"), "/")
	if len(parts) == 0 || parts[0] == "" {
		http.Error(w, "missing exportId", http.StatusBadRequest)
		return
	}
	exportId := parts[0]

	dataMutex.RLock()
	entry, ok := sampleData[exportId]
	dataMutex.RUnlock()
	if !ok {
		http.Error(w, "not found", http.StatusNotFound)
		return
	}

	status, _ := entry["status"].(string)
	referenceNumber, _ := entry["referenceNumber"].(string)
	exporterName, _ := entry["exporterName"].(string)
	totalValue, _ := entry["totalValue"].(float64)
	destinationCountry, _ := entry["destinationCountry"].(string)
	lastUpdated, _ := entry["lastUpdated"].(string)
	submissionDate, _ := entry["submissionDate"].(string)
	progressPercent, _ := entry["progressPercent"].(int)
	currentApprover, _ := entry["currentApprover"].(string)

	detail := map[string]interface{}{
		"exportId":        exportId,
		"referenceNumber": referenceNumber,
		"submissionDate":  submissionDate,
		"status":          strings.ToUpper(status),
		"documents": []map[string]interface{}{
			{"type": "license", "displayName": "Export License", "status": "PENDING", "approverOrg": "National Bank", "comments": ""},
			{"type": "invoice", "displayName": "Commercial Invoice", "status": "PENDING", "approverOrg": "Exporter Bank", "comments": ""},
			{"type": "qualityCert", "displayName": "Quality Certificate", "status": "PENDING", "approverOrg": "Coffee Authority", "comments": ""},
			{"type": "shipping", "displayName": "Shipping Documents", "status": "PENDING", "approverOrg": "Customs", "comments": ""},
		},
		"auditTrail": []map[string]interface{}{
			{"timestamp": submissionDate, "action": "SUBMITTED", "actor": exporterName, "organization": exporterName, "documentType": "ALL", "comments": "", "description": "Export request submitted"},
		},
		"currentApprover": currentApprover,
		"canResubmit":     strings.ToUpper(status) == "REJECTED",
		"progressPercent": progressPercent,
		"exporterName":    exporterName,
		"totalValue":      totalValue,
		"destinationCountry": destinationCountry,
		"lastUpdated":     lastUpdated,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(detail)
}

func updateRequestStatus(w http.ResponseWriter, r *http.Request) {
	enableCORS(w, r)
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}
	if r.Method != "PUT" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	parts := strings.Split(strings.TrimPrefix(r.URL.Path, "/api/exporter/requests/"), "/")
	if len(parts) == 0 || parts[0] == "" {
		http.Error(w, "missing exportId", http.StatusBadRequest)
		return
	}
	exportId := parts[0]

	var body struct{ Status string `json:"status"` }
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "invalid JSON body", http.StatusBadRequest)
		return
	}
	if body.Status == "" {
		http.Error(w, "status is required", http.StatusBadRequest)
		return
	}

	norm := strings.ToLower(body.Status)
	if norm != "pending" && norm != "approved" && norm != "rejected" {
		http.Error(w, "invalid status", http.StatusBadRequest)
		return
	}

	dataMutex.Lock()
	entry, ok := sampleData[exportId]
	if ok {
		entry["status"] = norm
		entry["lastUpdated"] = time.Now().Format(time.RFC3339)
		if norm == "approved" {
			entry["progressPercent"] = 100
			entry["currentApprover"] = "Completed"
		}
		sampleData[exportId] = entry
	}
	dataMutex.Unlock()

	if !ok {
		http.Error(w, "not found", http.StatusNotFound)
		return
	}
}

func main() {
    http.HandleFunc("/api/test/create-sample-data", createSampleData)
    http.HandleFunc("/api/exporter/submit", submitExporterRequest)
    http.HandleFunc("/api/exporter/dashboard", getDashboard)
    http.HandleFunc("/api/exporter/requests", getRequests)
    http.HandleFunc("/api/exporter/request/", getRequestDetail)
    http.HandleFunc("/api/exporter/requests/", updateRequestStatus)

    // Stubs to satisfy portal calls
    http.HandleFunc("/api/documents/upload", documentsUploadHandler)
    http.HandleFunc("/api/exports", exportsSubmitHandler)
    http.HandleFunc("/api/approval-channels/pending", approvalPendingHandler)
    http.HandleFunc("/api/approval-channels/summary", approvalSummaryHandler)

    fmt.Println("Test server running on http://localhost:8000")
    log.Fatal(http.ListenAndServe(":8000", nil))
}

// documentsUploadHandler accepts a multipart upload and returns success
func documentsUploadHandler(w http.ResponseWriter, r *http.Request) {
    enableCORS(w, r)
    if r.Method == "OPTIONS" {
        w.WriteHeader(http.StatusOK)
        return
    }
    if r.Method != "POST" {
        http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
        return
    }

    // Parse a reasonably large form (50MB)
    _ = r.ParseMultipartForm(50 << 20)
    ipfsCid := ""
    if r.MultipartForm != nil {
        if vals, ok := r.MultipartForm.Value["ipfsCid"]; ok && len(vals) > 0 {
            ipfsCid = vals[0]
        }
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(map[string]interface{}{
        "success": true,
        "message": "uploaded",
        "ipfsCid": ipfsCid,
    })
}

// exportsSubmitHandler accepts an export submission and returns a txHash. It also
// stores/updates the request in memory so the dashboard reflects the change.
func exportsSubmitHandler(w http.ResponseWriter, r *http.Request) {
    enableCORS(w, r)
    if r.Method == "OPTIONS" {
        w.WriteHeader(http.StatusOK)
        return
    }
    if r.Method != "POST" {
        http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
        return
    }

    var body struct {
        ExportId  string                 `json:"exportId"`
        Exporter  string                 `json:"exporter"`
        Documents map[string]interface{} `json:"documents"`
        Timestamp int64                  `json:"timestamp"`
    }
    if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
        http.Error(w, "invalid JSON body", http.StatusBadRequest)
        return
    }
    if body.ExportId == "" {
        body.ExportId = fmt.Sprintf("EXP-%d", time.Now().UnixNano()/1e6)
    }
    // For UI testing, normalize all submissions to the default exporter that the
    // dashboard uses, so totals update immediately regardless of portal input.
    // If you want to respect the submitted exporter, remove this normalization
    // and pass the matching exporterName to ExporterDashboard instead.
    body.Exporter = "Coffee Exporter Co."

    now := time.Now().Format(time.RFC3339)

    // Upsert into in-memory store so dashboard updates
    dataMutex.Lock()
    entry, ok := sampleData[body.ExportId]
    if !ok {
        entry = map[string]interface{}{
            "exportId":        body.ExportId,
            "referenceNumber": fmt.Sprintf("REF-%s", body.ExportId),
            "documentCount":   4,
            "progressPercent": 15,
            "totalValue":      0,
            "destinationCountry": "N/A",
        }
    }
    entry["exporterName"] = body.Exporter
    entry["status"] = "pending"
    entry["submissionDate"] = now
    entry["lastUpdated"] = now
    entry["currentApprover"] = "National Bank"
    sampleData[body.ExportId] = entry
    dataMutex.Unlock()

    // Return a deterministic fake txHash for demo
    txHash := fmt.Sprintf("tx-%s", body.ExportId)

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(map[string]interface{}{
        "txHash":   txHash,
        "exportId": body.ExportId,
        "success":  true,
    })
}
