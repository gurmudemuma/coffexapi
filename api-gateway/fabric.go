
package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"path/filepath"

	"github.com/hyperledger/fabric-sdk-go/pkg/core/config"
	"github.com/hyperledger/fabric-sdk-go/pkg/gateway"
)

func setupFabricGateway(cfg *Config) (*gateway.Gateway, error) {
	log.Println("============ Setting up Fabric Gateway ============")
	os.Setenv("DISCOVERY_AS_LOCALHOST", "true")
	wallet, err := gateway.NewFileSystemWallet("wallet")
	if err != nil {
		return nil, fmt.Errorf("failed to create wallet: %v", err)
	}

	if !wallet.Exists("appUser") {
		err = populateWallet(wallet)
		if err != nil {
			return nil, fmt.Errorf("failed to populate wallet contents: %v", err)
		}
	}

	gw, err := gateway.Connect(
		gateway.WithConfig(config.FromFile(filepath.Clean(cfg.Fabric.ConnectionProfile))),
		gateway.WithIdentity(wallet, "appUser"),
	)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to gateway: %v", err)
	}

	return gw, nil
}

func populateWallet(wallet *gateway.Wallet) error {
	log.Println("Populating wallet with user credentials")
	credPath := filepath.Join(
		"..",
		"network",
		"organizations",
		"peerOrganizations",
		"nationalbank.com",
		"users",
		"Admin@nationalbank.com",
		"msp",
	)

	certPath := filepath.Join(credPath, "signcerts", "Admin@nationalbank.com-cert.pem")
	// read the certificate file
	cert, err := ioutil.ReadFile(filepath.Clean(certPath))
	if err != nil {
		return err
	}

	keyDir := filepath.Join(credPath, "keystore")
	// there's a single file in this dir containing the private key
	files, err := ioutil.ReadDir(keyDir)
	if err != nil {
		return err
	}
	if len(files) != 1 {
		return fmt.Errorf("keystore folder should have contain one file")
	}
	keyPath := filepath.Join(keyDir, files[0].Name())
	key, err := ioutil.ReadFile(filepath.Clean(keyPath))
	if err != nil {
		return err
	}

	identity := gateway.NewX509Identity("NationalBankMSP", string(cert), string(key))

	return wallet.Put("appUser", identity)
}
