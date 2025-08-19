FROM golang:1.18-alpine

WORKDIR /app

RUN apk add --no-cache git

COPY go.mod go.sum ./
COPY vendor ./vendor

COPY . .

RUN go build -mod=vendor -o /api-gateway

EXPOSE 8000

CMD ["/api-gateway"]