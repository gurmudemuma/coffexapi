package shared

import (
	"encoding/json"
	"fmt"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// Role represents a role in the system
type Role struct {
	Name        string   `json:"name"`
	Permissions []string `json:"permissions"`
}

// Action represents a specific action that can be performed on a resource
type Action string

const (
	CreateExport Action = "CreateExport"
	ReadExport   Action = "ReadExport"
	UpdateExport Action = "UpdateExport"
	DeleteExport Action = "DeleteExport"

	ValidateLicense Action = "ValidateLicense"
	ValidateInvoice Action = "ValidateInvoice"
	ValidateQuality Action = "ValidateQuality"
	ValidateShipping Action = "ValidateShipping"
)

// AuthUtils provides authorization-related utility functions
type AuthUtils struct{}

// NewAuthUtils creates a new AuthUtils instance
func NewAuthUtils() *AuthUtils {
	return &AuthUtils{}
}

// CheckPermission checks if a user with the given MSP ID has the required permission
func (a *AuthUtils) CheckPermission(ctx contractapi.TransactionContextInterface, mspID string, action Action) (bool, error) {
	// In a real-world scenario, you would fetch the user's role from a dedicated identity management system
	// or from the user's certificate attributes. For simplicity, we'll use a hardcoded mapping here.
	role, err := getRoleForMSPID(mspID)
	if err != nil {
		return false, err
	}

	for _, p := range role.Permissions {
		if p == string(action) {
			return true, nil
		}
	}

	return false, nil
}

// getRoleForMSPID returns the role for a given MSP ID
func getRoleForMSPID(mspID string) (*Role, error) {
	switch mspID {
	case "ExporterOrgMSP":
		return &Role{
			Name: "Exporter",
			Permissions: []string{
				string(CreateExport),
				string(ReadExport),
			},
		}, nil
	case "NationalBankMSP":
		return &Role{
			Name: "NationalBank",
			Permissions: []string{
				string(ReadExport),
				string(ValidateLicense),
			},
		}, nil
	case "ExporterBankMSP":
		return &Role{
			Name: "ExporterBank",
			Permissions: []string{
				string(ReadExport),
				string(ValidateInvoice),
			},
		}, nil
	case "CoffeeAuthorityMSP":
		return &Role{
			Name: "CoffeeAuthority",
			Permissions: []string{
				string(ReadExport),
				string(ValidateQuality),
			},
		}, nil
	case "CustomsMSP":
		return &Role{
			Name: "Customs",
			Permissions: []string{
				string(ReadExport),
				string(ValidateShipping),
			},
		}, nil
	default:
		return nil, fmt.Errorf("unknown MSP ID: %s", mspID)
	}
}
