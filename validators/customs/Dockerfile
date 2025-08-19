# Build stage
FROM golang:1.21 as builder

WORKDIR /app

# Copy module files for the validator
COPY validators/customs/go.mod validators/customs/go.sum ./

# Copy the entire shared module, which is a local dependency
COPY chaincode/shared ./chaincode/shared

# Now that the local dependency from the 'replace' directive exists, download all other dependencies
RUN go mod download

# Copy the validator's source code
COPY validators/customs/ ./

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

# Final stage
FROM alpine:3.18

WORKDIR /app

# Copy the binary from the builder stage
COPY --from=builder /app/main .

# Command to run the application
CMD ["./main"]