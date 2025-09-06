package shared

import (
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

	ValidateLicense  Action = "ValidateLicense"
	ValidateInvoice  Action = "ValidateInvoice"
	ValidateQuality  Action = "ValidateQuality"
	ValidateShipping Action = "ValidateShipping"

	// New approval actions
	ViewAllExports      Action = "ViewAllExports"
	ViewApprovalChannel Action = "ViewApprovalChannel"
	ManageApprovalChain Action = "ManageApprovalChain"
	SupervisorAccess    Action = "SupervisorAccess"
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
				string(ViewApprovalChannel),
			},
		}, nil
	case "ExporterBankMSP":
		return &Role{
			Name: "ExporterBank",
			Permissions: []string{
				string(ReadExport),
				string(ValidateInvoice),
				string(ViewApprovalChannel),
				string(ViewAllExports),
				string(SupervisorAccess),
				string(ManageApprovalChain),
			},
		}, nil
	case "CoffeeAuthorityMSP":
		return &Role{
			Name: "CoffeeAuthority",
			Permissions: []string{
				string(ReadExport),
				string(ValidateQuality),
				string(ViewApprovalChannel),
			},
		}, nil
	case "CustomsMSP":
		return &Role{
			Name: "Customs",
			Permissions: []string{
				string(ReadExport),
				string(ValidateShipping),
				string(ViewApprovalChannel),
			},
		}, nil
	case "BankSupervisorMSP":
		return &Role{
			Name: "BankSupervisor",
			Permissions: []string{
				string(ReadExport),
				string(ViewAllExports),
				string(SupervisorAccess),
				string(ManageApprovalChain),
				string(ViewApprovalChannel),
				string(ValidateLicense),
				string(ValidateInvoice),
				string(ValidateQuality),
				string(ValidateShipping),
			},
		}, nil
	default:
		return nil, fmt.Errorf("unknown MSP ID: %s", mspID)
	}
}

// CheckChannelAccess verifies if a user can access a specific approval channel
func (a *AuthUtils) CheckChannelAccess(ctx contractapi.TransactionContextInterface, mspID string, channelOrg string) (bool, error) {
	// Users can only access their own organization's channel
	expectedMSP := channelOrg + "MSP"
	if mspID == expectedMSP {
		return true, nil
	}

	// Bank supervisors can access any channel
	if mspID == "ExporterBankMSP" || mspID == "BankSupervisorMSP" {
		return a.CheckPermission(ctx, mspID, SupervisorAccess)
	}

	return false, nil
}

// CheckDocumentVisibility verifies if a user can view a specific document
func (a *AuthUtils) CheckDocumentVisibility(ctx contractapi.TransactionContextInterface, mspID string, exporterMSP string, documentType string) (bool, error) {
	// Exporters can only see their own documents
	if mspID == exporterMSP {
		return true, nil
	}

	// Bank supervisors can see all documents
	if mspID == "ExporterBankMSP" || mspID == "BankSupervisorMSP" {
		if hasPermission, err := a.CheckPermission(ctx, mspID, SupervisorAccess); err != nil || !hasPermission {
			return false, err
		}
		return true, nil
	}

	// Approvers can only see documents they are responsible for
	switch documentType {
	case "LICENSE":
		return mspID == "NationalBankMSP", nil
	case "INVOICE":
		return mspID == "ExporterBankMSP", nil
	case "QUALITY":
		return mspID == "CoffeeAuthorityMSP", nil
	case "SHIPPING":
		return mspID == "CustomsMSP", nil
	default:
		return false, fmt.Errorf("unknown document type: %s", documentType)
	}
}
