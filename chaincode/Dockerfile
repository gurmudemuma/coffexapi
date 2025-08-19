FROM golang:1.18-alpine AS builder

# Install build dependencies
RUN apk add --no-cache git gcc musl-dev

# Set working directory
WORKDIR /workspace

# Copy go mod files
COPY chaincode/go/go.mod chaincode/go/go.sum ./

# Copy the shared module
COPY chaincode/shared /workspace/shared

# Download dependencies
RUN go mod download

# Copy the rest of the application
COPY chaincode/go /workspace

# Build the application
RUN go build -o chaincode

# Use a minimal image for the final container
FROM alpine:latest

WORKDIR /app

# Copy the binary from builder
COPY --from=builder /workspace/chaincode .

# Command to run the application
CMD ["./chaincode"]
