package shared

import (
	"encoding/json"
	"fmt"
	"time"
)

// UserRole defines the different user roles in the system
type UserRole string

const (
	RoleExporter   UserRole = "EXPORTER"
	RoleApprover   UserRole = "APPROVER"
	RoleBank       UserRole = "BANK"
	RoleSupervisor UserRole = "SUPERVISOR"
)

// ApprovalStageStatus represents the status of each approval stage
type ApprovalStageStatus string

const (
	StageStatusPending  ApprovalStageStatus = "PENDING"
	StageStatusInReview ApprovalStageStatus = "IN_REVIEW"
	StageStatusApproved ApprovalStageStatus = "APPROVED"
	StageStatusRejected ApprovalStageStatus = "REJECTED"
	StageStatusSkipped  ApprovalStageStatus = "SKIPPED"
)

// OrganizationType defines the different organization types
type OrganizationType string

const (
	OrgNationalBank    OrganizationType = "NATIONAL_BANK"
	OrgExporterBank    OrganizationType = "EXPORTER_BANK"
	OrgCoffeeAuthority OrganizationType = "COFFEE_AUTHORITY"
	OrgCustoms         OrganizationType = "CUSTOMS"
	OrgBankSupervisor  OrganizationType = "BANK_SUPERVISOR"
)

// DocumentType defines the document types for approval
type DocumentType string

const (
	DocTypeLicense  DocumentType = "LICENSE"
	DocTypeInvoice  DocumentType = "INVOICE"
	DocTypeQuality  DocumentType = "QUALITY"
	DocTypeShipping DocumentType = "SHIPPING"
)

// ApprovalStage represents a single stage in the approval workflow
type ApprovalStage struct {
	ID             string              `json:"id"`
	ExportID       string              `json:"exportId"`
	DocumentType   DocumentType        `json:"documentType"`
	Organization   OrganizationType    `json:"organization"`
	StageOrder     int                 `json:"stageOrder"`
	Status         ApprovalStageStatus `json:"status"`
	AssignedTo     string              `json:"assignedTo"` // MSP ID or user identifier
	ReviewedBy     string              `json:"reviewedBy"` // Actual reviewer
	ReviewDate     *time.Time          `json:"reviewDate"`
	Comments       string              `json:"comments"`
	RequiredFields []string            `json:"requiredFields"` // Fields required for this stage
	CreatedAt      time.Time           `json:"createdAt"`
	UpdatedAt      time.Time           `json:"updatedAt"`
}

// ApprovalChain manages the complete approval workflow for an export
type ApprovalChain struct {
	ID            string              `json:"id"`
	ExportID      string              `json:"exportId"`
	ExporterMSP   string              `json:"exporterMsp"`
	Stages        []ApprovalStage     `json:"stages"`
	CurrentStage  int                 `json:"currentStage"`
	OverallStatus ApprovalStageStatus `json:"overallStatus"`
	CreatedAt     time.Time           `json:"createdAt"`
	UpdatedAt     time.Time           `json:"updatedAt"`
	CompletedAt   *time.Time          `json:"completedAt"`
}

// ApprovalChannel represents a private channel for each approver
type ApprovalChannel struct {
	ID               string           `json:"id"`
	Organization     OrganizationType `json:"organization"`
	MSPAccess        []string         `json:"mspAccess"`        // MSP IDs that can access this channel
	DocumentTypes    []DocumentType   `json:"documentTypes"`    // Document types this channel handles
	PendingApprovals []string         `json:"pendingApprovals"` // ApprovalStage IDs
	CreatedAt        time.Time        `json:"createdAt"`
}

// BankSupervisorView provides global oversight for bank users
type BankSupervisorView struct {
	ExportID        string              `json:"exportId"`
	ExporterName    string              `json:"exporterName"`
	TotalStages     int                 `json:"totalStages"`
	CompletedStages int                 `json:"completedStages"`
	CurrentStage    *ApprovalStage      `json:"currentStage"`
	OverallStatus   ApprovalStageStatus `json:"overallStatus"`
	Documents       []DocumentInfo      `json:"documents"`
	LastActivity    time.Time           `json:"lastActivity"`
	Timeline        []ApprovalActivity  `json:"timeline"`
}

// DocumentInfo represents document metadata for supervisor view
type DocumentInfo struct {
	Type        DocumentType        `json:"type"`
	Hash        string              `json:"hash"`
	IPFSCID     string              `json:"ipfsCid"`
	Size        int64               `json:"size"`
	Status      ApprovalStageStatus `json:"status"`
	AssignedOrg OrganizationType    `json:"assignedOrg"`
}

// ApprovalActivity represents timeline activity for supervisor tracking
type ApprovalActivity struct {
	Type         string           `json:"type"` // "SUBMITTED", "REVIEWED", "APPROVED", "REJECTED"
	Organization OrganizationType `json:"organization"`
	ReviewedBy   string           `json:"reviewedBy"`
	Comments     string           `json:"comments"`
	Timestamp    time.Time        `json:"timestamp"`
	DocumentType DocumentType     `json:"documentType"`
}

// ApprovalPermissions defines what each role can access
type ApprovalPermissions struct {
	Role            UserRole         `json:"role"`
	CanViewExports  []string         `json:"canViewExports"`  // Export IDs or "ALL" for supervisors
	CanViewChannels []string         `json:"canViewChannels"` // Channel IDs
	CanApprove      []DocumentType   `json:"canApprove"`      // Document types they can approve
	Organization    OrganizationType `json:"organization"`
}

// NewApprovalChain creates a new approval chain for an export
func NewApprovalChain(exportID, exporterMSP string, documentTypes []DocumentType) *ApprovalChain {
	chain := &ApprovalChain{
		ID:            fmt.Sprintf("chain_%s", exportID),
		ExportID:      exportID,
		ExporterMSP:   exporterMSP,
		Stages:        []ApprovalStage{},
		CurrentStage:  0,
		OverallStatus: StageStatusPending,
		CreatedAt:     time.Now(),
		UpdatedAt:     time.Now(),
	}

	// Create stages for each document type
	stageOrder := 1
	for _, docType := range documentTypes {
		org := getOrganizationForDocumentType(docType)
		stage := ApprovalStage{
			ID:           fmt.Sprintf("stage_%s_%s_%d", exportID, string(docType), stageOrder),
			ExportID:     exportID,
			DocumentType: docType,
			Organization: org,
			StageOrder:   stageOrder,
			Status:       StageStatusPending,
			AssignedTo:   string(org) + "MSP",
			CreatedAt:    time.Now(),
			UpdatedAt:    time.Now(),
		}
		chain.Stages = append(chain.Stages, stage)
		stageOrder++
	}

	return chain
}

// GetCurrentStage returns the current active stage
func (ac *ApprovalChain) GetCurrentStage() *ApprovalStage {
	if ac.CurrentStage >= 0 && ac.CurrentStage < len(ac.Stages) {
		return &ac.Stages[ac.CurrentStage]
	}
	return nil
}

// AdvanceToNextStage moves to the next stage in the chain
func (ac *ApprovalChain) AdvanceToNextStage() {
	if ac.CurrentStage < len(ac.Stages)-1 {
		ac.CurrentStage++
		ac.UpdatedAt = time.Now()
	} else {
		// All stages completed
		now := time.Now()
		ac.CompletedAt = &now
		ac.OverallStatus = StageStatusApproved
	}
}

// UpdateStageStatus updates the status of a specific stage
func (ac *ApprovalChain) UpdateStageStatus(stageID string, status ApprovalStageStatus, reviewedBy, comments string) error {
	for i, stage := range ac.Stages {
		if stage.ID == stageID {
			ac.Stages[i].Status = status
			ac.Stages[i].ReviewedBy = reviewedBy
			ac.Stages[i].Comments = comments
			now := time.Now()
			ac.Stages[i].ReviewDate = &now
			ac.Stages[i].UpdatedAt = now
			ac.UpdatedAt = now

			// Update overall status based on individual stage results
			if status == StageStatusRejected {
				ac.OverallStatus = StageStatusRejected
			} else if status == StageStatusApproved {
				// Check if all stages are approved
				allApproved := true
				for _, s := range ac.Stages {
					if s.Status != StageStatusApproved && s.Status != StageStatusSkipped {
						allApproved = false
						break
					}
				}
				if allApproved {
					ac.OverallStatus = StageStatusApproved
					now := time.Now()
					ac.CompletedAt = &now
				}
			}
			return nil
		}
	}
	return fmt.Errorf("stage not found: %s", stageID)
}

// GetStagesByOrganization returns stages assigned to a specific organization
func (ac *ApprovalChain) GetStagesByOrganization(org OrganizationType) []ApprovalStage {
	var stages []ApprovalStage
	for _, stage := range ac.Stages {
		if stage.Organization == org {
			stages = append(stages, stage)
		}
	}
	return stages
}

// ToJSON converts ApprovalChain to JSON string
func (ac *ApprovalChain) ToJSON() (string, error) {
	bytes, err := json.Marshal(ac)
	if err != nil {
		return "", err
	}
	return string(bytes), nil
}

// FromJSON creates ApprovalChain from JSON string
func (ac *ApprovalChain) FromJSON(jsonStr string) error {
	return json.Unmarshal([]byte(jsonStr), ac)
}

// getOrganizationForDocumentType maps document types to organizations
func getOrganizationForDocumentType(docType DocumentType) OrganizationType {
	switch docType {
	case DocTypeLicense:
		return OrgNationalBank
	case DocTypeInvoice:
		return OrgExporterBank
	case DocTypeQuality:
		return OrgCoffeeAuthority
	case DocTypeShipping:
		return OrgCustoms
	default:
		return OrgNationalBank // Default fallback
	}
}

// GetDocumentTypesForOrganization returns document types handled by an organization
func GetDocumentTypesForOrganization(org OrganizationType) []DocumentType {
	switch org {
	case OrgNationalBank:
		return []DocumentType{DocTypeLicense}
	case OrgExporterBank:
		return []DocumentType{DocTypeInvoice}
	case OrgCoffeeAuthority:
		return []DocumentType{DocTypeQuality}
	case OrgCustoms:
		return []DocumentType{DocTypeShipping}
	case OrgBankSupervisor:
		return []DocumentType{DocTypeLicense, DocTypeInvoice, DocTypeQuality, DocTypeShipping} // Can see all
	default:
		return []DocumentType{}
	}
}

// CreateApprovalPermissions creates permissions for a role
func CreateApprovalPermissions(role UserRole, org OrganizationType, mspID string) ApprovalPermissions {
	permissions := ApprovalPermissions{
		Role:         role,
		Organization: org,
	}

	switch role {
	case RoleExporter:
		permissions.CanViewExports = []string{mspID} // Can only see their own exports
		permissions.CanApprove = []DocumentType{}    // Cannot approve
	case RoleApprover:
		permissions.CanViewExports = []string{} // Will be populated based on assigned documents
		permissions.CanApprove = GetDocumentTypesForOrganization(org)
	case RoleBank, RoleSupervisor:
		permissions.CanViewExports = []string{"ALL"} // Can see all exports
		permissions.CanApprove = GetDocumentTypesForOrganization(org)
	}

	return permissions
}
