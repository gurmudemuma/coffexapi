package shared

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// ApprovalChannelManager manages private approval channels for organizations
type ApprovalChannelManager struct {
	blockchainUtils *BlockchainUtils
}

// NewApprovalChannelManager creates a new approval channel manager
func NewApprovalChannelManager() *ApprovalChannelManager {
	return &ApprovalChannelManager{
		blockchainUtils: NewBlockchainUtils(),
	}
}

// CreateOrganizationChannels creates private data collections for each organization
func (acm *ApprovalChannelManager) CreateOrganizationChannels(ctx contractapi.TransactionContextInterface) error {
	organizations := []OrganizationType{
		OrgNationalBank,
		OrgExporterBank,
		OrgCoffeeAuthority,
		OrgCustoms,
		OrgBankSupervisor,
	}

	for _, org := range organizations {
		channel := ApprovalChannel{
			ID:            fmt.Sprintf("channel_%s", string(org)),
			Organization:  org,
			MSPAccess:     []string{string(org) + "MSP"},
			DocumentTypes: GetDocumentTypesForOrganization(org),
			CreatedAt:     time.Now(),
		}

		// Store channel configuration in private data collection
		channelBytes, err := json.Marshal(channel)
		if err != nil {
			return fmt.Errorf("failed to marshal channel config: %v", err)
		}

		collectionName := fmt.Sprintf("approvalChannel_%s", string(org))
		if err := ctx.GetStub().PutPrivateData(collectionName, channel.ID, channelBytes); err != nil {
			return fmt.Errorf("failed to store channel config: %v", err)
		}
	}

	return nil
}

// AssignApprovalToChannel assigns an approval stage to the appropriate organization channel
func (acm *ApprovalChannelManager) AssignApprovalToChannel(
	ctx contractapi.TransactionContextInterface,
	exportID string,
	documentType DocumentType,
	documentHash string,
	metadata map[string]interface{},
) error {
	// Determine the organization responsible for this document type
	org := getOrganizationForDocumentType(documentType)
	collectionName := fmt.Sprintf("approvalChannel_%s", string(org))

	// Create approval assignment
	assignment := map[string]interface{}{
		"exportId":     exportID,
		"documentType": string(documentType),
		"documentHash": documentHash,
		"metadata":     metadata,
		"assignedAt":   time.Now(),
		"status":       string(StageStatusPending),
	}

	assignmentBytes, err := json.Marshal(assignment)
	if err != nil {
		return fmt.Errorf("failed to marshal assignment: %v", err)
	}

	// Store in organization's private channel
	assignmentKey := fmt.Sprintf("assignment_%s_%s", exportID, string(documentType))
	if err := ctx.GetStub().PutPrivateData(collectionName, assignmentKey, assignmentBytes); err != nil {
		return fmt.Errorf("failed to store assignment: %v", err)
	}

	// Update channel's pending approvals list
	return acm.updateChannelPendingList(ctx, org, assignmentKey, true)
}

// GetPendingApprovalsForOrganization retrieves pending approvals for a specific organization
func (acm *ApprovalChannelManager) GetPendingApprovalsForOrganization(
	ctx contractapi.TransactionContextInterface,
	org OrganizationType,
) ([]map[string]interface{}, error) {
	collectionName := fmt.Sprintf("approvalChannel_%s", string(org))

	// Get all pending assignments
	iterator, err := ctx.GetStub().GetPrivateDataByPartialCompositeKey(collectionName, "assignment", []string{})
	if err != nil {
		return nil, fmt.Errorf("failed to get pending approvals: %v", err)
	}
	defer iterator.Close()

	var approvals []map[string]interface{}
	for iterator.HasNext() {
		result, err := iterator.Next()
		if err != nil {
			return nil, err
		}

		var assignment map[string]interface{}
		if err := json.Unmarshal(result.Value, &assignment); err != nil {
			continue // Skip invalid entries
		}

		// Only include pending assignments
		if status, exists := assignment["status"]; exists && status == string(StageStatusPending) {
			approvals = append(approvals, assignment)
		}
	}

	return approvals, nil
}

// ProcessApprovalDecision processes an approval decision and updates the channel
func (acm *ApprovalChannelManager) ProcessApprovalDecision(
	ctx contractapi.TransactionContextInterface,
	org OrganizationType,
	exportID string,
	documentType DocumentType,
	decision ApprovalStageStatus,
	reviewedBy string,
	comments string,
) error {
	collectionName := fmt.Sprintf("approvalChannel_%s", string(org))
	assignmentKey := fmt.Sprintf("assignment_%s_%s", exportID, string(documentType))

	// Get the current assignment
	assignmentBytes, err := ctx.GetStub().GetPrivateData(collectionName, assignmentKey)
	if err != nil {
		return fmt.Errorf("failed to get assignment: %v", err)
	}

	var assignment map[string]interface{}
	if err := json.Unmarshal(assignmentBytes, &assignment); err != nil {
		return fmt.Errorf("failed to unmarshal assignment: %v", err)
	}

	// Update assignment with decision
	assignment["status"] = string(decision)
	assignment["reviewedBy"] = reviewedBy
	assignment["comments"] = comments
	assignment["reviewedAt"] = time.Now()

	// Store updated assignment
	updatedBytes, err := json.Marshal(assignment)
	if err != nil {
		return fmt.Errorf("failed to marshal updated assignment: %v", err)
	}

	if err := ctx.GetStub().PutPrivateData(collectionName, assignmentKey, updatedBytes); err != nil {
		return fmt.Errorf("failed to update assignment: %v", err)
	}

	// Remove from pending list if approved or rejected
	if decision == StageStatusApproved || decision == StageStatusRejected {
		if err := acm.updateChannelPendingList(ctx, org, assignmentKey, false); err != nil {
			return fmt.Errorf("failed to update pending list: %v", err)
		}
	}

	// Store approval result in global ledger for bank supervisor visibility
	return acm.storeGlobalApprovalResult(ctx, exportID, documentType, decision, reviewedBy, comments, org)
}

// GetBankSupervisorView provides global overview for bank supervisors
func (acm *ApprovalChannelManager) GetBankSupervisorView(
	ctx contractapi.TransactionContextInterface,
	exportID string,
) (*BankSupervisorView, error) {
	// Get export data from public ledger
	exportBytes, err := ctx.GetStub().GetState(fmt.Sprintf("export_%s", exportID))
	if err != nil {
		return nil, fmt.Errorf("failed to get export data: %v", err)
	}

	if exportBytes == nil {
		return nil, fmt.Errorf("export not found: %s", exportID)
	}

	// Parse export data
	var exportData map[string]interface{}
	if err := json.Unmarshal(exportBytes, &exportData); err != nil {
		return nil, fmt.Errorf("failed to parse export data: %v", err)
	}

	// Get approval chain
	chainBytes, err := ctx.GetStub().GetState(fmt.Sprintf("approval_chain_%s", exportID))
	if err != nil {
		return nil, fmt.Errorf("failed to get approval chain: %v", err)
	}

	var chain ApprovalChain
	if chainBytes != nil {
		if err := json.Unmarshal(chainBytes, &chain); err != nil {
			return nil, fmt.Errorf("failed to parse approval chain: %v", err)
		}
	}

	// Get approval timeline
	timeline, err := acm.getApprovalTimeline(ctx, exportID)
	if err != nil {
		return nil, fmt.Errorf("failed to get approval timeline: %v", err)
	}

	// Calculate progress
	completedStages := 0
	for _, stage := range chain.Stages {
		if stage.Status == StageStatusApproved {
			completedStages++
		}
	}

	// Build supervisor view
	view := &BankSupervisorView{
		ExportID:        exportID,
		ExporterName:    getStringFromMap(exportData, "exporter"),
		TotalStages:     len(chain.Stages),
		CompletedStages: completedStages,
		CurrentStage:    chain.GetCurrentStage(),
		OverallStatus:   chain.OverallStatus,
		Documents:       buildDocumentInfoList(exportData, chain.Stages),
		LastActivity:    getLastActivityTime(timeline),
		Timeline:        timeline,
	}

	return view, nil
}

// GetAllExportsForSupervisor returns all exports for bank supervisor oversight
func (acm *ApprovalChannelManager) GetAllExportsForSupervisor(
	ctx contractapi.TransactionContextInterface,
) ([]BankSupervisorView, error) {
	// Get all export IDs from the ledger
	iterator, err := ctx.GetStub().GetStateByPartialCompositeKey("export", []string{})
	if err != nil {
		return nil, fmt.Errorf("failed to get exports: %v", err)
	}
	defer iterator.Close()

	var supervisorViews []BankSupervisorView
	for iterator.HasNext() {
		result, err := iterator.Next()
		if err != nil {
			continue
		}

		// Extract export ID from the key
		exportID := extractExportIDFromKey(result.Key)
		if exportID == "" {
			continue
		}

		// Get supervisor view for this export
		view, err := acm.GetBankSupervisorView(ctx, exportID)
		if err != nil {
			continue // Skip exports with errors
		}

		supervisorViews = append(supervisorViews, *view)
	}

	return supervisorViews, nil
}

// updateChannelPendingList updates the pending approvals list for a channel
func (acm *ApprovalChannelManager) updateChannelPendingList(
	ctx contractapi.TransactionContextInterface,
	org OrganizationType,
	assignmentKey string,
	add bool,
) error {
	collectionName := fmt.Sprintf("approvalChannel_%s", string(org))
	channelKey := fmt.Sprintf("channel_%s", string(org))

	// Get current channel data
	channelBytes, err := ctx.GetStub().GetPrivateData(collectionName, channelKey)
	if err != nil {
		return fmt.Errorf("failed to get channel data: %v", err)
	}

	var channel ApprovalChannel
	if channelBytes != nil {
		if err := json.Unmarshal(channelBytes, &channel); err != nil {
			return fmt.Errorf("failed to parse channel data: %v", err)
		}
	}

	// Update pending approvals list
	if add {
		channel.PendingApprovals = append(channel.PendingApprovals, assignmentKey)
	} else {
		// Remove from list
		for i, key := range channel.PendingApprovals {
			if key == assignmentKey {
				channel.PendingApprovals = append(channel.PendingApprovals[:i], channel.PendingApprovals[i+1:]...)
				break
			}
		}
	}

	// Store updated channel
	updatedChannelBytes, err := json.Marshal(channel)
	if err != nil {
		return fmt.Errorf("failed to marshal updated channel: %v", err)
	}

	return ctx.GetStub().PutPrivateData(collectionName, channelKey, updatedChannelBytes)
}

// storeGlobalApprovalResult stores approval results on public ledger for supervisor visibility
func (acm *ApprovalChannelManager) storeGlobalApprovalResult(
	ctx contractapi.TransactionContextInterface,
	exportID string,
	documentType DocumentType,
	decision ApprovalStageStatus,
	reviewedBy string,
	comments string,
	org OrganizationType,
) error {
	result := map[string]interface{}{
		"exportId":     exportID,
		"documentType": string(documentType),
		"decision":     string(decision),
		"reviewedBy":   reviewedBy,
		"comments":     comments,
		"organization": string(org),
		"timestamp":    time.Now(),
	}

	resultBytes, err := json.Marshal(result)
	if err != nil {
		return fmt.Errorf("failed to marshal approval result: %v", err)
	}

	resultKey := fmt.Sprintf("approval_result_%s_%s", exportID, string(documentType))
	return ctx.GetStub().PutState(resultKey, resultBytes)
}

// getApprovalTimeline retrieves the approval timeline for an export
func (acm *ApprovalChannelManager) getApprovalTimeline(
	ctx contractapi.TransactionContextInterface,
	exportID string,
) ([]ApprovalActivity, error) {
	iterator, err := ctx.GetStub().GetStateByPartialCompositeKey("approval_result", []string{exportID})
	if err != nil {
		return nil, err
	}
	defer iterator.Close()

	var timeline []ApprovalActivity
	for iterator.HasNext() {
		result, err := iterator.Next()
		if err != nil {
			continue
		}

		var approvalResult map[string]interface{}
		if err := json.Unmarshal(result.Value, &approvalResult); err != nil {
			continue
		}

		activity := ApprovalActivity{
			Type:         getStringFromMap(approvalResult, "decision"),
			Organization: OrganizationType(getStringFromMap(approvalResult, "organization")),
			ReviewedBy:   getStringFromMap(approvalResult, "reviewedBy"),
			Comments:     getStringFromMap(approvalResult, "comments"),
			DocumentType: DocumentType(getStringFromMap(approvalResult, "documentType")),
		}

		// Parse timestamp
		if ts, exists := approvalResult["timestamp"]; exists {
			if timeStr, ok := ts.(string); ok {
				if parsedTime, err := time.Parse(time.RFC3339, timeStr); err == nil {
					activity.Timestamp = parsedTime
				}
			}
		}

		timeline = append(timeline, activity)
	}

	return timeline, nil
}

// Helper functions
func getStringFromMap(data map[string]interface{}, key string) string {
	if value, exists := data[key]; exists {
		if str, ok := value.(string); ok {
			return str
		}
	}
	return ""
}

func buildDocumentInfoList(exportData map[string]interface{}, stages []ApprovalStage) []DocumentInfo {
	var documents []DocumentInfo

	// Extract documents from export data
	if docs, exists := exportData["documents"]; exists {
		if docsMap, ok := docs.(map[string]interface{}); ok {
			for docType, docData := range docsMap {
				if docInfo, ok := docData.(map[string]interface{}); ok {
					// Find corresponding stage
					var status ApprovalStageStatus = StageStatusPending
					var assignedOrg OrganizationType
					for _, stage := range stages {
						if string(stage.DocumentType) == docType {
							status = stage.Status
							assignedOrg = stage.Organization
							break
						}
					}

					doc := DocumentInfo{
						Type:        DocumentType(docType),
						Hash:        getStringFromMap(docInfo, "hash"),
						IPFSCID:     getStringFromMap(docInfo, "ipfsCid"),
						Status:      status,
						AssignedOrg: assignedOrg,
					}

					if size, exists := docInfo["size"]; exists {
						if sizeFloat, ok := size.(float64); ok {
							doc.Size = int64(sizeFloat)
						}
					}

					documents = append(documents, doc)
				}
			}
		}
	}

	return documents
}

func getLastActivityTime(timeline []ApprovalActivity) time.Time {
	if len(timeline) == 0 {
		return time.Now()
	}

	latest := timeline[0].Timestamp
	for _, activity := range timeline {
		if activity.Timestamp.After(latest) {
			latest = activity.Timestamp
		}
	}

	return latest
}

func extractExportIDFromKey(key string) string {
	// Extract export ID from composite key format "export~{exportID}~"
	// This is a simplified extraction - in practice, use proper composite key parsing
	if len(key) > 7 && key[:7] == "export_" {
		return key[7:]
	}
	return ""
}
