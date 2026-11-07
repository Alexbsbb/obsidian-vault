# Build Stage
FROM golang:1.22-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache git ca-certificates tzdata

# Copy go mod files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o zapsender-api .

# Final Stage
FROM alpine:latest

# Install runtime dependencies
RUN apk --no-cache add ca-certificates tzdata

WORKDIR /root/

# Copy binary from builder
COPY --from=builder /app/zapsender-api .

# Create directories for data persistence
RUN mkdir -p /app/data /app/sessions /app/logs

# Set environment variables
ENV SERVER_PORT=8080
ENV CLIENT_NAME=ZapSenderAPI
ENV GLOBAL_API_KEY=zapsender-secret-key

# Expose ports
EXPOSE 8080 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:8080/health || exit 1

# Run the application
CMD ["./zapsender-api"]