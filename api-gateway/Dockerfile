FROM golang:1.18-alpine

WORKDIR /app

RUN apk add --no-cache git

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o /api-gateway

EXPOSE 8000

CMD ["/api-gateway"]