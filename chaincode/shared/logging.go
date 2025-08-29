package shared

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"os"
	"runtime"
	"strings"
	"sync"
	"time"
)

// LogLevel represents the severity level of a log entry
type LogLevel int

const (
	DEBUG LogLevel = iota
	INFO
	WARN
	ERROR
	FATAL
)

// String returns the string representation of the log level
func (l LogLevel) String() string {
	switch l {
	case DEBUG:
		return "DEBUG"
	case INFO:
		return "INFO"
	case WARN:
		return "WARN"
	case ERROR:
		return "ERROR"
	case FATAL:
		return "FATAL"
	default:
		return "UNKNOWN"
	}
}

// LogEntry represents a structured log entry
type LogEntry struct {
	Timestamp   time.Time              `json:"timestamp"`
	Level       string                 `json:"level"`
	Service     string                 `json:"service"`
	Message     string                 `json:"message"`
	RequestID   string                 `json:"requestId,omitempty"`
	UserID      string                 `json:"userId,omitempty"`
	Operation   string                 `json:"operation,omitempty"`
	Duration    string                 `json:"duration,omitempty"`
	Error       string                 `json:"error,omitempty"`
	Metadata    map[string]interface{} `json:"metadata,omitempty"`
	File        string                 `json:"file,omitempty"`
	Line        int                    `json:"line,omitempty"`
	Function    string                 `json:"function,omitempty"`
	TraceID     string                 `json:"traceId,omitempty"`
	SpanID      string                 `json:"spanId,omitempty"`
	Environment string                 `json:"environment"`
}

// Logger provides structured logging with multiple outputs and levels
type Logger struct {
	service     string
	environment string
	level       LogLevel
	outputs     []io.Writer
	mu          sync.RWMutex
	hooks       []LogHook
	context     map[string]interface{}
}

// LogHook allows external systems to hook into logging events
type LogHook interface {
	Execute(entry *LogEntry) error
}

// MetricsHook collects metrics from log entries
type MetricsHook struct {
	metrics map[string]*Metric
	mu      sync.RWMutex
}

// Metric represents a simple metric counter
type Metric struct {
	Count     int64     `json:"count"`
	LastValue float64   `json:"lastValue"`
	UpdatedAt time.Time `json:"updatedAt"`
}

// Execute implements the LogHook interface for metrics collection
func (mh *MetricsHook) Execute(entry *LogEntry) error {
	mh.mu.Lock()
	defer mh.mu.Unlock()
	
	if mh.metrics == nil {
		mh.metrics = make(map[string]*Metric)
	}
	
	// Count log entries by level
	levelKey := fmt.Sprintf("log.%s.count", strings.ToLower(entry.Level))
	if metric, exists := mh.metrics[levelKey]; exists {
		metric.Count++
		metric.UpdatedAt = time.Now()
	} else {
		mh.metrics[levelKey] = &Metric{
			Count:     1,
			UpdatedAt: time.Now(),
		}
	}
	
	// Count errors by operation
	if entry.Level == "ERROR" && entry.Operation != "" {
		errorKey := fmt.Sprintf("error.%s.count", entry.Operation)
		if metric, exists := mh.metrics[errorKey]; exists {
			metric.Count++
			metric.UpdatedAt = time.Now()
		} else {
			mh.metrics[errorKey] = &Metric{
				Count:     1,
				UpdatedAt: time.Now(),
			}
		}
	}
	
	// Track duration metrics
	if entry.Duration != "" {
		if duration, err := time.ParseDuration(entry.Duration); err == nil {
			durationKey := fmt.Sprintf("duration.%s.ms", entry.Operation)
			if metric, exists := mh.metrics[durationKey]; exists {
				metric.LastValue = float64(duration.Nanoseconds()) / 1e6
				metric.Count++
				metric.UpdatedAt = time.Now()
			} else {
				mh.metrics[durationKey] = &Metric{
					Count:     1,
					LastValue: float64(duration.Nanoseconds()) / 1e6,
					UpdatedAt: time.Now(),
				}
			}
		}
	}
	
	return nil
}

// GetMetrics returns all collected metrics
func (mh *MetricsHook) GetMetrics() map[string]*Metric {
	mh.mu.RLock()
	defer mh.mu.RUnlock()
	
	// Deep copy to prevent concurrent access issues
	result := make(map[string]*Metric)
	for k, v := range mh.metrics {
		result[k] = &Metric{
			Count:     v.Count,
			LastValue: v.LastValue,
			UpdatedAt: v.UpdatedAt,
		}
	}
	return result
}

// NewLogger creates a new structured logger
func NewLogger(service, environment string) *Logger {
	logger := &Logger{
		service:     service,
		environment: environment,
		level:       INFO,
		outputs:     []io.Writer{os.Stdout},
		context:     make(map[string]interface{}),
	}
	
	// Add metrics hook by default
	metricsHook := &MetricsHook{}
	logger.AddHook(metricsHook)
	
	// Set log level from environment
	if levelStr := os.Getenv("LOG_LEVEL"); levelStr != "" {
		logger.SetLevel(parseLogLevel(levelStr))
	}
	
	return logger
}

// parseLogLevel parses a log level string
func parseLogLevel(level string) LogLevel {
	switch strings.ToUpper(level) {
	case "DEBUG":
		return DEBUG
	case "INFO":
		return INFO
	case "WARN", "WARNING":
		return WARN
	case "ERROR":
		return ERROR
	case "FATAL":
		return FATAL
	default:
		return INFO
	}
}

// SetLevel sets the minimum log level
func (l *Logger) SetLevel(level LogLevel) {
	l.mu.Lock()
	defer l.mu.Unlock()
	l.level = level
}

// AddOutput adds an output writer for logs
func (l *Logger) AddOutput(output io.Writer) {
	l.mu.Lock()
	defer l.mu.Unlock()
	l.outputs = append(l.outputs, output)
}

// AddHook adds a log hook
func (l *Logger) AddHook(hook LogHook) {
	l.mu.Lock()
	defer l.mu.Unlock()
	l.hooks = append(l.hooks, hook)
}

// WithContext adds context to the logger
func (l *Logger) WithContext(key string, value interface{}) *Logger {
	l.mu.Lock()
	defer l.mu.Unlock()
	
	// Create a new logger with the same configuration
	newLogger := &Logger{
		service:     l.service,
		environment: l.environment,
		level:       l.level,
		outputs:     l.outputs,
		hooks:       l.hooks,
		context:     make(map[string]interface{}),
	}
	
	// Copy existing context and add new value
	for k, v := range l.context {
		newLogger.context[k] = v
	}
	newLogger.context[key] = value
	
	return newLogger
}

// WithRequestID adds request ID to log context
func (l *Logger) WithRequestID(requestID string) *Logger {
	return l.WithContext("requestId", requestID)
}

// WithUserID adds user ID to log context
func (l *Logger) WithUserID(userID string) *Logger {
	return l.WithContext("userId", userID)
}

// WithOperation adds operation name to log context
func (l *Logger) WithOperation(operation string) *Logger {
	return l.WithContext("operation", operation)
}

// WithError adds error to log context
func (l *Logger) WithError(err error) *Logger {
	if err != nil {
		return l.WithContext("error", err.Error())
	}
	return l
}

// log writes a log entry
func (l *Logger) log(level LogLevel, message string, args ...interface{}) {
	l.mu.RLock()
	defer l.mu.RUnlock()
	
	// Check if this level should be logged
	if level < l.level {
		return
	}
	
	// Get caller information
	_, file, line, _ := runtime.Caller(2)
	pc, _, _, _ := runtime.Caller(2)
	funcName := runtime.FuncForPC(pc).Name()
	
	// Create log entry
	entry := &LogEntry{
		Timestamp:   time.Now().UTC(),
		Level:       level.String(),
		Service:     l.service,
		Message:     fmt.Sprintf(message, args...),
		File:        file,
		Line:        line,
		Function:    funcName,
		Environment: l.environment,
		Metadata:    make(map[string]interface{}),
	}
	
	// Add context to entry
	for k, v := range l.context {
		switch k {
		case "requestId":
			if str, ok := v.(string); ok {
				entry.RequestID = str
			}
		case "userId":
			if str, ok := v.(string); ok {
				entry.UserID = str
			}
		case "operation":
			if str, ok := v.(string); ok {
				entry.Operation = str
			}
		case "error":
			if str, ok := v.(string); ok {
				entry.Error = str
			}
		case "duration":
			if str, ok := v.(string); ok {
				entry.Duration = str
			}
		case "traceId":
			if str, ok := v.(string); ok {
				entry.TraceID = str
			}
		case "spanId":
			if str, ok := v.(string); ok {
				entry.SpanID = str
			}
		default:
			entry.Metadata[k] = v
		}
	}
	
	// Execute hooks
	for _, hook := range l.hooks {
		go func(h LogHook) {
			if err := h.Execute(entry); err != nil {
				// Log hook error to stderr to avoid infinite loop
				fmt.Fprintf(os.Stderr, "Log hook error: %v\n", err)
			}
		}(hook)
	}
	
	// Format and write log entry
	l.writeEntry(entry)
}

// writeEntry writes the log entry to all outputs
func (l *Logger) writeEntry(entry *LogEntry) {
	// JSON format for structured logging
	jsonData, err := json.Marshal(entry)
	if err != nil {
		// Fallback to simple format if JSON marshaling fails
		fallback := fmt.Sprintf("[%s] %s %s: %s\n",
			entry.Timestamp.Format(time.RFC3339),
			entry.Level,
			entry.Service,
			entry.Message)
		
		for _, output := range l.outputs {
			fmt.Fprint(output, fallback)
		}
		return
	}
	
	// Write JSON to all outputs
	for _, output := range l.outputs {
		fmt.Fprintln(output, string(jsonData))
	}
}

// Debug logs a debug message
func (l *Logger) Debug(message string, args ...interface{}) {
	l.log(DEBUG, message, args...)
}

// Info logs an info message
func (l *Logger) Info(message string, args ...interface{}) {
	l.log(INFO, message, args...)
}

// Warn logs a warning message
func (l *Logger) Warn(message string, args ...interface{}) {
	l.log(WARN, message, args...)
}

// Error logs an error message
func (l *Logger) Error(message string, args ...interface{}) {
	l.log(ERROR, message, args...)
}

// Fatal logs a fatal message and exits
func (l *Logger) Fatal(message string, args ...interface{}) {
	l.log(FATAL, message, args...)
	os.Exit(1)
}

// Performance tracking methods

// StartOperation begins tracking an operation
func (l *Logger) StartOperation(operation string) context.Context {
	ctx := context.WithValue(context.Background(), "startTime", time.Now())
	ctx = context.WithValue(ctx, "operation", operation)
	
	l.WithOperation(operation).Debug("Operation started")
	return ctx
}

// EndOperation completes tracking an operation
func (l *Logger) EndOperation(ctx context.Context, success bool, additionalContext ...map[string]interface{}) {
	startTime, ok := ctx.Value("startTime").(time.Time)
	if !ok {
		l.Error("EndOperation called without valid context")
		return
	}
	
	operation, ok := ctx.Value("operation").(string)
	if !ok {
		operation = "unknown"
	}
	
	duration := time.Since(startTime)
	logger := l.WithOperation(operation).WithContext("duration", duration.String())
	
	// Add additional context
	for _, contextMap := range additionalContext {
		for k, v := range contextMap {
			logger = logger.WithContext(k, v)
		}
	}
	
	if success {
		logger.Info("Operation completed successfully")
	} else {
		logger.Error("Operation failed")
	}
}

// GetMetrics returns metrics from the metrics hook
func (l *Logger) GetMetrics() map[string]*Metric {
	l.mu.RLock()
	defer l.mu.RUnlock()
	
	for _, hook := range l.hooks {
		if metricsHook, ok := hook.(*MetricsHook); ok {
			return metricsHook.GetMetrics()
		}
	}
	return make(map[string]*Metric)
}

// Default logger instance
var defaultLogger *Logger

// InitDefaultLogger initializes the default logger
func InitDefaultLogger(service, environment string) {
	defaultLogger = NewLogger(service, environment)
}

// GetDefaultLogger returns the default logger
func GetDefaultLogger() *Logger {
	if defaultLogger == nil {
		defaultLogger = NewLogger("unknown", "development")
	}
	return defaultLogger
}

// Convenience functions using default logger

// Debug logs a debug message using the default logger
func Debug(message string, args ...interface{}) {
	GetDefaultLogger().Debug(message, args...)
}

// Info logs an info message using the default logger
func Info(message string, args ...interface{}) {
	GetDefaultLogger().Info(message, args...)
}

// Warn logs a warning message using the default logger
func Warn(message string, args ...interface{}) {
	GetDefaultLogger().Warn(message, args...)
}

// Error logs an error message using the default logger
func Error(message string, args ...interface{}) {
	GetDefaultLogger().Error(message, args...)
}

// Fatal logs a fatal message using the default logger and exits
func Fatal(message string, args ...interface{}) {
	GetDefaultLogger().Fatal(message, args...)
}