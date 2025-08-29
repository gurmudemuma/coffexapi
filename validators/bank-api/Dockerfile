# Build stage
FROM golang:1.21 AS builder

WORKDIR /app

# Copy module files for the validator
COPY validators/bank-api/go.mod validators/bank-api/go.sum ./

# Copy the entire shared module to match the replace directive
COPY chaincode/shared /app/chaincode/shared

# Now that the local dependency from the 'replace' directive exists, download all other dependencies
RUN go mod download

# Copy the validator's source code
COPY validators/bank-api/ ./

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

# Final stage
FROM alpine:3.18

WORKDIR /app

# Copy the binary from the builder stage
COPY --from=builder /app/main .

# Command to run the application
CMD ["./main"]
