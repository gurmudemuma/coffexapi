package main

import (
	"context"
	"crypto/ecdsa"
	"crypto/rsa"
	"crypto/tls"
	"crypto/x509"
	"encoding/json"
	"encoding/pem"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/hyperledger/fabric-gateway/pkg/client"
	"github.com/hyperledger/fabric-gateway/pkg/identity"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials"
)

var contract *client.Contract
var tlsClient *http.Client

func main() {
	// The gRPC client connection should be shared by all Gateway connections to this endpoint
	clientConnection, err := newGrpcConnection()
	if err != nil {
		log.Fatalf("Failed to create gRPC connection: %v", err)
	}
	defer clientConnection.Close()

	id, err := newIdentity()
	if err != nil {
		log.Fatalf("Failed to create identity: %v", err)
	}

	sign, err := newSign()
	if err != nil {
		log.Fatalf("Failed to create sign: %v", err)
	}

	// Create a Gateway connection for a specific client identity
	gw, err := client.Connect(
		id,
		client.WithSign(sign),
		client.WithClientConnection(clientConnection),
		// Default timeouts for different gRPC calls
		client.WithEvaluateTimeout(5*time.Second),
		client.WithEndorseTimeout(15*time.Second),
		client.WithSubmitTimeout(5*time.Second),
		client.WithCommitStatusTimeout(1*time.Minute),
	)
	if err != nil {
		log.Fatalf("Failed to connect to gateway: %v", err)
	}
	defer gw.Close()

	network := gw.GetNetwork("coffeechannel")
	contract = network.GetContract("coffeeexport")

	// Create a TLS client to communicate with validator services
	tlsClient, err = newTLSClient()
	if err != nil {
		log.Fatalf("Failed to create TLS client: %v", err)
	}

	// Start event listener in a separate goroutine
	go startEventListener(network)

	// API endpoints
	http.HandleFunc("/api/auth/login", loginHandler)
	http.HandleFunc("/api/documents", uploadDocumentHandler)
	http.HandleFunc("/api/exports", submitExportHandler)

	// Start HTTP server
	fmt.Println("API Gateway running on port 8000")
	if err := http.ListenAndServe(":8000", nil); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
	// This is a mock implementation for demonstration purposes
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"token": "mock-auth-token"})
}

func uploadDocumentHandler(w http.ResponseWriter, r *http.Request) {
	// This is a mock implementation for demonstration purposes
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"cid": "mock-cid"})
}

func submitExportHandler(w http.ResponseWriter, r *http.Request) {
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Failed to read request body", http.StatusBadRequest)
		return
	}

	_, err = contract.SubmitTransaction("SubmitExport", string(body))
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to submit transaction: %v", err), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusAccepted)
}

func startEventListener(network *client.Network) {
	events, err := network.ChaincodeEvents(context.Background(), "export")
	if err != nil {
		log.Fatalf("Failed to start chaincode event listening: %v", err)
	}

	// Create a channel to dispatch events to workers
	eventChannel := make(chan *client.ChaincodeEvent, 100)

	// Start a pool of worker goroutines
	const numWorkers = 4
	for i := 0; i < numWorkers; i++ {
		go validationWorker(eventChannel)
	}

	// Process events in a goroutine
	go func() {
		for event := range events {
			if event.EventName == "validate_document" {
				eventChannel <- event
			}
		}
	}()
}

func validationWorker(events <-chan *client.ChaincodeEvent) {
	for event := range events {
		handleValidationEvent(event)
	}
}

type ValidationEvent struct {
	ExportID string `json:"exportId"`
	Data     struct {
		DocType string `json:"docType"`
		Hash    string `json:"hash"`
	} `json:"data"`
}

func handleValidationEvent(event *client.ChaincodeEvent) {
	var validationEvent ValidationEvent
	err := json.Unmarshal(event.Payload, &validationEvent)
	if err != nil {
		log.Printf("Failed to unmarshal event payload: %v", err)
		return
	}

	docType := validationEvent.Data.DocType
	hash := validationEvent.Data.Hash
	exportID := validationEvent.ExportID

	// Get validator endpoint from environment variable
	validatorEndpoint := os.Getenv(fmt.Sprintf("%s_VALIDATOR_ENDPOINT", strings.ToUpper(docType)))
	if validatorEndpoint == "" {
		log.Printf("Validator endpoint for %s not configured", docType)
		return
	}

	// Call validator service
	resp, err := tlsClient.Get(fmt.Sprintf("%s?hash=%s", validatorEndpoint, hash))
	if err != nil {
		log.Printf("Failed to call validator service: %v", err)
		return
	}
	defer resp.Body.Close()

	var validationResponse struct {
		Valid   bool     `json:"valid"`
		Reasons []string `json:"reasons"`
	}
	err = json.NewDecoder(resp.Body).Decode(&validationResponse)
	if err != nil {
		log.Printf("Failed to decode validation response: %v", err)
		return
	}

	// Submit validation result to chaincode
	reasonsJSON, _ := json.Marshal(validationResponse.Reasons)
	_, err = contract.SubmitTransaction(
		"RecordValidationResult",
		exportID,
		docType,
		fmt.Sprintf("%t", validationResponse.Valid),
		string(reasonsJSON),
	)
	if err != nil {
		log.Printf("Failed to submit validation result: %v", err)
	}
}

func newGrpcConnection() (*grpc.ClientConn, error) {
	peerEndpoint := "peer0.exporterbank.com:8051"
	tlsCertPath := "/etc/hyperledger/fabric/tls/ca.crt"

	caCert, err := ioutil.ReadFile(tlsCertPath)
	if err != nil {
		return nil, fmt.Errorf("failed to read CA certificate: %w", err)
	}
	certPool := x509.NewCertPool()
	if !certPool.AppendCertsFromPEM(caCert) {
		return nil, fmt.Errorf("failed to add CA certificate to pool")
	}

	creds := credentials.NewClientTLSFromCert(certPool, "peer0.exporterbank.com")

	return grpc.Dial(peerEndpoint, grpc.WithTransportCredentials(creds))
}

func newIdentity() (*identity.X509Identity, error) {
	mspID := "ExporterBankMSP"
	certPath := "/etc/hyperledger/fabric/users/User1@exporterbank.com/msp/signcerts/User1@exporterbank.com-cert.pem"

	certPEM, err := ioutil.ReadFile(certPath)
	if err != nil {
		return nil, fmt.Errorf("failed to read certificate file: %v (path: %s)", err, certPath)
	}

	block, _ := pem.Decode(certPEM)
	if block == nil {
		return nil, fmt.Errorf("failed to parse certificate PEM")
	}

	cert, err := x509.ParseCertificate(block.Bytes)
	if err != nil {
		return nil, fmt.Errorf("failed to parse certificate: %v", err)
	}

	return identity.NewX509Identity(mspID, cert)
}

func newSign() (identity.Sign, error) {
	keyPath := "/etc/hyperledger/fabric/users/User1@exporterbank.com/msp/keystore/priv_sk"

	keyPEM, err := ioutil.ReadFile(keyPath)
	if err != nil {
		return nil, fmt.Errorf("failed to read private key file: %v (path: %s)", err, keyPath)
	}

	block, _ := pem.Decode(keyPEM)
	if block == nil {
		return nil, fmt.Errorf("failed to parse private key PEM")
	}

	// Parse the private key
	key, err := x509.ParsePKCS8PrivateKey(block.Bytes)
	if err != nil {
		// Try PKCS1 if PKCS8 fails
		key, err = x509.ParsePKCS1PrivateKey(block.Bytes)
		if err != nil {
			return nil, fmt.Errorf("failed to parse private key: %v", err)
		}
	}

	switch k := key.(type) {
	case *ecdsa.PrivateKey:
		signer, err := identity.NewPrivateKeySign(k)
		if err != nil {
			return nil, fmt.Errorf("failed to create ECDSA signer: %v", err)
		}
		return signer, nil
	case *rsa.PrivateKey:
		signer, err := identity.NewPrivateKeySign(k)
		if err != nil {
			return nil, fmt.Errorf("failed to create RSA signer: %v", err)
		}
		return signer, nil
	default:
		return nil, fmt.Errorf("unsupported private key type: %T", key)
	}
}

func newTLSClient() (*http.Client, error) {
	tlsCertPath := "/etc/hyperledger/fabric/tls/ca.crt"
	caCert, err := ioutil.ReadFile(tlsCertPath)
	if err != nil {
		return nil, fmt.Errorf("failed to read TLS CA certificate: %v (path: %s)", err, tlsCertPath)
	}
	caCertPool := x509.NewCertPool()
	caCertPool.AppendCertsFromPEM(caCert)

	return &http.Client{
		Transport: &http.Transport{
			TLSClientConfig: &tls.Config{
				RootCAs: caCertPool,
			},
		},
	}, nil
}