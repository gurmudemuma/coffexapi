package shared

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"runtime"
	"sync"
	"time"
)

// HealthStatus represents the health status of a component
type HealthStatus string

const (
	HealthStatusHealthy   HealthStatus = "healthy"
	HealthStatusUnhealthy HealthStatus = "unhealthy"
	HealthStatusDegraded  HealthStatus = "degraded"
	HealthStatusUnknown   HealthStatus = "unknown"
)

// HealthCheck represents a single health check
type HealthCheck struct {
	Name        string                 `json:"name"`
	Status      HealthStatus           `json:"status"`
	Message     string                 `json:"message,omitempty"`
	Duration    time.Duration          `json:"duration"`
	Timestamp   time.Time              `json:"timestamp"`
	Metadata    map[string]interface{} `json:"metadata,omitempty"`
	Error       string                 `json:"error,omitempty"`
	LastSuccess time.Time              `json:"lastSuccess,omitempty"`
	LastFailure time.Time              `json:"lastFailure,omitempty"`
}

// HealthCheckFunc defines a function that performs a health check
type HealthCheckFunc func(ctx context.Context) *HealthCheck

// SystemHealth represents the overall system health
type SystemHealth struct {
	Status       HealthStatus             `json:"status"`
	Timestamp    time.Time                `json:"timestamp"`
	Service      string                   `json:"service"`
	Version      string                   `json:"version"`
	Environment  string                   `json:"environment"`
	Uptime       time.Duration            `json:"uptime"`
	Checks       map[string]*HealthCheck  `json:"checks"`
	Metrics      map[string]interface{}   `json:"metrics"`
	Dependencies map[string]*HealthCheck  `json:"dependencies,omitempty"`
}

// SystemMetrics holds system performance metrics
type SystemMetrics struct {
	CPU struct {
		Usage   float64 `json:"usage"`
		Cores   int     `json:"cores"`
		Threads int     `json:"threads"`
	} `json:"cpu"`
	
	Memory struct {
		Used      uint64  `json:"used"`
		Total     uint64  `json:"total"`
		Available uint64  `json:"available"`
		Percent   float64 `json:"percent"`
	} `json:"memory"`
	
	Goroutines int `json:"goroutines"`
	
	HTTP struct {
		RequestsTotal   int64   `json:"requestsTotal"`
		RequestsSuccess int64   `json:"requestsSuccess"`
		RequestsFailed  int64   `json:"requestsFailed"`
		AvgResponseTime float64 `json:"avgResponseTime"`
	} `json:"http"`
	
	Application struct {
		RequestsPerSecond float64                `json:"requestsPerSecond"`
		ErrorRate         float64                `json:"errorRate"`
		CustomMetrics     map[string]interface{} `json:"customMetrics"`
	} `json:"application"`
}

// HealthMonitor manages health checks and system monitoring
type HealthMonitor struct {
	service     string
	version     string
	environment string
	startTime   time.Time
	logger      *Logger
	
	checks       map[string]HealthCheckFunc
	dependencies map[string]HealthCheckFunc
	metrics      *SystemMetrics
	
	mu sync.RWMutex
	
	// Monitoring configuration
	checkInterval     time.Duration
	checkTimeout      time.Duration
	metricsInterval   time.Duration
	healthHistory     []*SystemHealth
	maxHistoryEntries int
	
	// HTTP metrics tracking
	httpMetrics struct {
		requestsTotal   int64
		requestsSuccess int64
		requestsFailed  int64
		responseTimes   []time.Duration
		mu              sync.RWMutex
	}
}

// NewHealthMonitor creates a new health monitor
func NewHealthMonitor(service, version, environment string) *HealthMonitor {
	monitor := &HealthMonitor{
		service:           service,
		version:           version,
		environment:       environment,
		startTime:         time.Now(),
		logger:            NewLogger(fmt.Sprintf("%s-monitor", service), environment),
		checks:            make(map[string]HealthCheckFunc),
		dependencies:      make(map[string]HealthCheckFunc),
		metrics:           &SystemMetrics{},
		checkInterval:     30 * time.Second,
		checkTimeout:      10 * time.Second,
		metricsInterval:   60 * time.Second,
		maxHistoryEntries: 100,
	}
	
	// Add default health checks
	monitor.AddCheck("basic", monitor.basicHealthCheck)
	monitor.AddCheck("memory", monitor.memoryHealthCheck)
	monitor.AddCheck("goroutines", monitor.goroutineHealthCheck)
	
	return monitor
}

// AddCheck adds a health check
func (hm *HealthMonitor) AddCheck(name string, check HealthCheckFunc) {
	hm.mu.Lock()
	defer hm.mu.Unlock()
	hm.checks[name] = check
}

// AddDependencyCheck adds a dependency health check
func (hm *HealthMonitor) AddDependencyCheck(name string, check HealthCheckFunc) {
	hm.mu.Lock()
	defer hm.mu.Unlock()
	hm.dependencies[name] = check
}

// RemoveCheck removes a health check
func (hm *HealthMonitor) RemoveCheck(name string) {
	hm.mu.Lock()
	defer hm.mu.Unlock()
	delete(hm.checks, name)
}

// Start begins the health monitoring process
func (hm *HealthMonitor) Start(ctx context.Context) {
	hm.logger.Info("Starting health monitor for service %s", hm.service)
	
	// Start periodic health checks
	healthTicker := time.NewTicker(hm.checkInterval)
	metricsTicker := time.NewTicker(hm.metricsInterval)
	
	go func() {
		defer healthTicker.Stop()
		defer metricsTicker.Stop()
		
		for {
			select {
			case <-ctx.Done():
				hm.logger.Info("Health monitor stopped")
				return
			case <-healthTicker.C:
				hm.performHealthChecks(ctx)
			case <-metricsTicker.C:
				hm.collectMetrics()
			}
		}
	}()
}

// performHealthChecks runs all registered health checks
func (hm *HealthMonitor) performHealthChecks(ctx context.Context) {
	hm.mu.RLock()
	checks := make(map[string]HealthCheckFunc)
	dependencies := make(map[string]HealthCheckFunc)
	
	for name, check := range hm.checks {
		checks[name] = check
	}
	for name, check := range hm.dependencies {
		dependencies[name] = check
	}
	hm.mu.RUnlock()
	
	health := &SystemHealth{
		Timestamp:    time.Now(),
		Service:      hm.service,
		Version:      hm.version,
		Environment:  hm.environment,
		Uptime:       time.Since(hm.startTime),
		Checks:       make(map[string]*HealthCheck),
		Dependencies: make(map[string]*HealthCheck),
		Metrics:      make(map[string]interface{}),
	}
	
	// Run health checks with timeout
	checkCtx, cancel := context.WithTimeout(ctx, hm.checkTimeout)
	defer cancel()
	
	var wg sync.WaitGroup
	var mu sync.Mutex
	
	// Execute all checks concurrently
	for name, check := range checks {
		wg.Add(1)
		go func(name string, check HealthCheckFunc) {
			defer wg.Done()
			result := check(checkCtx)
			mu.Lock()
			health.Checks[name] = result
			mu.Unlock()
		}(name, check)
	}
	
	// Execute dependency checks
	for name, check := range dependencies {
		wg.Add(1)
		go func(name string, check HealthCheckFunc) {
			defer wg.Done()
			result := check(checkCtx)
			mu.Lock()
			health.Dependencies[name] = result
			mu.Unlock()
		}(name, check)
	}
	
	wg.Wait()
	
	// Determine overall health status
	health.Status = hm.calculateOverallHealth(health.Checks, health.Dependencies)
	
	// Add current metrics
	hm.collectMetrics()
	health.Metrics = map[string]interface{}{
		"cpu":         hm.metrics.CPU,
		"memory":      hm.metrics.Memory,
		"goroutines":  hm.metrics.Goroutines,
		"http":        hm.metrics.HTTP,
		"application": hm.metrics.Application,
	}
	
	// Store in history
	hm.addToHistory(health)
	
	// Log health status
	if health.Status == HealthStatusHealthy {
		hm.logger.Debug("Health check completed: %s", health.Status)
	} else {
		hm.logger.Warn("Health check completed: %s", health.Status)
	}
}

// calculateOverallHealth determines the overall health based on individual checks
func (hm *HealthMonitor) calculateOverallHealth(checks, dependencies map[string]*HealthCheck) HealthStatus {
	hasUnhealthy := false
	hasDegraded := false
	
	// Check main health checks
	for _, check := range checks {
		switch check.Status {
		case HealthStatusUnhealthy:
			return HealthStatusUnhealthy // Any unhealthy check makes the system unhealthy
		case HealthStatusDegraded:
			hasDegraded = true
		}
	}
	
	// Check dependencies (less critical)
	for _, check := range dependencies {
		switch check.Status {
		case HealthStatusUnhealthy:
			hasDegraded = true // Unhealthy dependencies degrade the system
		case HealthStatusDegraded:
			hasDegraded = true
		}
	}
	
	if hasUnhealthy {
		return HealthStatusUnhealthy
	}
	if hasDegraded {
		return HealthStatusDegraded
	}
	return HealthStatusHealthy
}

// collectMetrics gathers system metrics
func (hm *HealthMonitor) collectMetrics() {
	var memStats runtime.MemStats
	runtime.ReadMemStats(&memStats)
	
	hm.mu.Lock()
	defer hm.mu.Unlock()
	
	// CPU metrics (simplified - in production you'd use a proper CPU monitoring library)
	hm.metrics.CPU.Cores = runtime.NumCPU()
	hm.metrics.CPU.Threads = runtime.GOMAXPROCS(0)
	
	// Memory metrics
	hm.metrics.Memory.Used = memStats.Alloc
	hm.metrics.Memory.Total = memStats.Sys
	hm.metrics.Memory.Available = memStats.Sys - memStats.Alloc
	if hm.metrics.Memory.Total > 0 {
		hm.metrics.Memory.Percent = float64(hm.metrics.Memory.Used) / float64(hm.metrics.Memory.Total) * 100
	}
	
	// Goroutine metrics
	hm.metrics.Goroutines = runtime.NumGoroutine()
	
	// HTTP metrics
	hm.httpMetrics.mu.RLock()
	hm.metrics.HTTP.RequestsTotal = hm.httpMetrics.requestsTotal
	hm.metrics.HTTP.RequestsSuccess = hm.httpMetrics.requestsSuccess
	hm.metrics.HTTP.RequestsFailed = hm.httpMetrics.requestsFailed
	
	// Calculate average response time
	if len(hm.httpMetrics.responseTimes) > 0 {
		var total time.Duration
		for _, d := range hm.httpMetrics.responseTimes {
			total += d
		}
		hm.metrics.HTTP.AvgResponseTime = float64(total.Nanoseconds()) / float64(len(hm.httpMetrics.responseTimes)) / 1e6 // Convert to milliseconds
	}
	hm.httpMetrics.mu.RUnlock()
	
	// Application metrics
	if hm.metrics.HTTP.RequestsTotal > 0 {
		hm.metrics.Application.ErrorRate = float64(hm.metrics.HTTP.RequestsFailed) / float64(hm.metrics.HTTP.RequestsTotal) * 100
	}
}

// addToHistory adds a health check result to the history
func (hm *HealthMonitor) addToHistory(health *SystemHealth) {
	hm.mu.Lock()
	defer hm.mu.Unlock()
	
	hm.healthHistory = append(hm.healthHistory, health)
	
	// Maintain maximum history size
	if len(hm.healthHistory) > hm.maxHistoryEntries {
		hm.healthHistory = hm.healthHistory[1:]
	}
}

// GetCurrentHealth returns the current health status
func (hm *HealthMonitor) GetCurrentHealth(ctx context.Context) *SystemHealth {
	hm.mu.RLock()
	checks := make(map[string]HealthCheckFunc)
	dependencies := make(map[string]HealthCheckFunc)
	
	for name, check := range hm.checks {
		checks[name] = check
	}
	for name, check := range hm.dependencies {
		dependencies[name] = check
	}
	hm.mu.RUnlock()
	
	health := &SystemHealth{
		Timestamp:    time.Now(),
		Service:      hm.service,
		Version:      hm.version,
		Environment:  hm.environment,
		Uptime:       time.Since(hm.startTime),
		Checks:       make(map[string]*HealthCheck),
		Dependencies: make(map[string]*HealthCheck),
		Metrics:      make(map[string]interface{}),
	}
	
	// Run checks with timeout
	checkCtx, cancel := context.WithTimeout(ctx, hm.checkTimeout)
	defer cancel()
	
	var wg sync.WaitGroup
	var mu sync.Mutex
	
	// Execute all checks concurrently
	for name, check := range checks {
		wg.Add(1)
		go func(name string, check HealthCheckFunc) {
			defer wg.Done()
			result := check(checkCtx)
			mu.Lock()
			health.Checks[name] = result
			mu.Unlock()
		}(name, check)
	}
	
	for name, check := range dependencies {
		wg.Add(1)
		go func(name string, check HealthCheckFunc) {
			defer wg.Done()
			result := check(checkCtx)
			mu.Lock()
			health.Dependencies[name] = result
			mu.Unlock()
		}(name, check)
	}
	
	wg.Wait()
	
	// Determine overall health
	health.Status = hm.calculateOverallHealth(health.Checks, health.Dependencies)
	
	// Add current metrics
	hm.collectMetrics()
	health.Metrics = map[string]interface{}{
		"cpu":         hm.metrics.CPU,
		"memory":      hm.metrics.Memory,
		"goroutines":  hm.metrics.Goroutines,
		"http":        hm.metrics.HTTP,
		"application": hm.metrics.Application,
	}
	
	return health
}

// GetHealthHistory returns the health check history
func (hm *HealthMonitor) GetHealthHistory() []*SystemHealth {
	hm.mu.RLock()
	defer hm.mu.RUnlock()
	
	// Return a copy to prevent modifications
	history := make([]*SystemHealth, len(hm.healthHistory))
	copy(history, hm.healthHistory)
	return history
}

// RecordHTTPRequest records HTTP request metrics
func (hm *HealthMonitor) RecordHTTPRequest(duration time.Duration, success bool) {
	hm.httpMetrics.mu.Lock()
	defer hm.httpMetrics.mu.Unlock()
	
	hm.httpMetrics.requestsTotal++
	
	if success {
		hm.httpMetrics.requestsSuccess++
	} else {
		hm.httpMetrics.requestsFailed++
	}
	
	// Store response time (keep last 1000 requests)
	hm.httpMetrics.responseTimes = append(hm.httpMetrics.responseTimes, duration)
	if len(hm.httpMetrics.responseTimes) > 1000 {
		hm.httpMetrics.responseTimes = hm.httpMetrics.responseTimes[1:]
	}
}

// Default health check implementations

// basicHealthCheck performs a basic health check
func (hm *HealthMonitor) basicHealthCheck(ctx context.Context) *HealthCheck {
	start := time.Now()
	
	check := &HealthCheck{
		Name:      "basic",
		Status:    HealthStatusHealthy,
		Message:   "Service is running",
		Timestamp: start,
		Metadata:  make(map[string]interface{}),
	}
	
	check.Duration = time.Since(start)
	check.LastSuccess = time.Now()
	
	return check
}

// memoryHealthCheck checks memory usage
func (hm *HealthMonitor) memoryHealthCheck(ctx context.Context) *HealthCheck {
	start := time.Now()
	
	var memStats runtime.MemStats
	runtime.ReadMemStats(&memStats)
	
	check := &HealthCheck{
		Name:      "memory",
		Timestamp: start,
		Metadata: map[string]interface{}{
			"allocMB":    float64(memStats.Alloc) / 1024 / 1024,
			"sysMB":      float64(memStats.Sys) / 1024 / 1024,
			"numGC":      memStats.NumGC,
			"goroutines": runtime.NumGoroutine(),
		},
	}
	
	// Check memory usage thresholds
	allocMB := float64(memStats.Alloc) / 1024 / 1024
	sysMB := float64(memStats.Sys) / 1024 / 1024
	
	if sysMB > 1024 { // > 1GB system memory
		check.Status = HealthStatusDegraded
		check.Message = fmt.Sprintf("High system memory usage: %.2f MB", sysMB)
	} else if allocMB > 512 { // > 512MB allocated
		check.Status = HealthStatusDegraded
		check.Message = fmt.Sprintf("High allocated memory: %.2f MB", allocMB)
	} else {
		check.Status = HealthStatusHealthy
		check.Message = fmt.Sprintf("Memory usage normal: %.2f MB allocated, %.2f MB system", allocMB, sysMB)
		check.LastSuccess = time.Now()
	}
	
	check.Duration = time.Since(start)
	return check
}

// goroutineHealthCheck checks goroutine count
func (hm *HealthMonitor) goroutineHealthCheck(ctx context.Context) *HealthCheck {
	start := time.Now()
	
	goroutines := runtime.NumGoroutine()
	
	check := &HealthCheck{
		Name:      "goroutines",
		Timestamp: start,
		Metadata: map[string]interface{}{
			"count": goroutines,
		},
	}
	
	if goroutines > 1000 {
		check.Status = HealthStatusDegraded
		check.Message = fmt.Sprintf("High goroutine count: %d", goroutines)
	} else if goroutines > 10000 {
		check.Status = HealthStatusUnhealthy
		check.Message = fmt.Sprintf("Critical goroutine count: %d", goroutines)
	} else {
		check.Status = HealthStatusHealthy
		check.Message = fmt.Sprintf("Goroutine count normal: %d", goroutines)
		check.LastSuccess = time.Now()
	}
	
	check.Duration = time.Since(start)
	return check
}

// HTTPHandler returns an HTTP handler for health checks
func (hm *HealthMonitor) HTTPHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		
		ctx, cancel := context.WithTimeout(r.Context(), hm.checkTimeout)
		defer cancel()
		
		health := hm.GetCurrentHealth(ctx)
		
		// Set appropriate status code
		statusCode := http.StatusOK
		if health.Status == HealthStatusUnhealthy {
			statusCode = http.StatusServiceUnavailable
		} else if health.Status == HealthStatusDegraded {
			statusCode = http.StatusOK // Still serving but degraded
		}
		
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Cache-Control", "no-cache, no-store, must-revalidate")
		w.WriteHeader(statusCode)
		
		if err := json.NewEncoder(w).Encode(health); err != nil {
			hm.logger.Error("Failed to encode health response: %v", err)
		}
		
		// Record the request
		hm.RecordHTTPRequest(time.Since(start), statusCode < 400)
	}
}