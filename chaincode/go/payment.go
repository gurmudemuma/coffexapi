package main

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

func (s *SmartContract) ReleasePayment(ctx contractapi.TransactionContextInterface, exportID string) error {
	// Verify caller is exporter bank
	if err := ctx.GetClientIdentity().AssertAttributeValue("hf.Affiliation", "exporter_bank"); err != nil {
		return fmt.Errorf("only exporter bank can release payments")
	}

	// Check export is approved
	pkgBytes, err := ctx.GetStub().GetPrivateData("exportRequests", exportID)
	if err != nil {
		return err
	}
	if pkgBytes == nil {
		return fmt.Errorf("export request %s not found", exportID)
	}

	var pkg ExportRequest
	if err := json.Unmarshal(pkgBytes, &pkg); err != nil {
		return fmt.Errorf("failed to unmarshal export request: %w", err)
	}

	if pkg.Status != "APPROVED" {
		return fmt.Errorf("export %s is not approved", exportID)
	}

	// Record payment
	paymentKey := fmt.Sprintf("payment_%s", exportID)
	if err := ctx.GetStub().PutState(paymentKey, []byte(time.Now().Format(time.RFC3339))); err != nil {
		return fmt.Errorf("failed to record payment: %w", err)
	}

	// Notify SWIFT network (mock)
	if err := ctx.GetStub().SetEvent("payment_processed", []byte(exportID)); err != nil {
		return fmt.Errorf("failed to set event: %w", err)
	}
	return nil
}
