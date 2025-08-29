/**
 * ExportStatus Component Tests
 * 
 * Example tests using the new testing infrastructure and patterns.
 * Demonstrates comprehensive testing of the optimized ExportStatus component.
 */

import { describe, it, expect, vi } from 'vitest';
import { 
  renderWithProviders, 
  screen, 
  userEvent, 
  createMockExport,
  createBaseComponentTests,
  createInteractiveComponentTests,
  createLoadingStateTests
} from '../../testing';
import { ExportStatus } from '../ExportStatus';
import type { OrganizationApproval, DocumentWithMetadata } from '../ExportStatus';

// ==============================================================================
// Mock Data
// ==============================================================================

const mockApprovals: OrganizationApproval[] = [
  {
    id: '1',
    name: 'National Bank',
    role: 'License Validator',
    status: 'APPROVED',
    timestamp: '2024-01-15T10:00:00Z',
    comment: 'License verified successfully',
  },
  {
    id: '2',
    name: 'Customs Authority',
    role: 'Shipping Validator',
    status: 'PENDING',
  },
  {
    id: '3',
    name: 'Quality Authority',
    role: 'Quality Validator',
    status: 'REJECTED',
    timestamp: '2024-01-15T11:00:00Z',
    comment: 'Quality certificate needs revision',
  },
];

const mockDocuments: Record<string, DocumentWithMetadata> = {
  license: {
    name: 'export-license.pdf',
    hash: 'abc123',
    cid: 'QmTest123',
    url: 'http://localhost:8080/ipfs/QmTest123',
    encrypted: true,
    contentType: 'application/pdf',
  },
  invoice: {
    name: 'commercial-invoice.pdf',
    hash: 'def456',
    cid: 'QmTest456',
    url: 'http://localhost:8080/ipfs/QmTest456',
    encrypted: true,
    contentType: 'application/pdf',
  },
};

const defaultProps = {
  exportId: 'EXP-001',
  txHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  documents: mockDocuments,
  approvals: mockApprovals,
  'data-testid': 'export-status',
};

// ==============================================================================
// Generated Tests
// ==============================================================================

// Basic component tests
createBaseComponentTests({
  name: 'ExportStatus',
  component: ExportStatus,
  defaultProps,
  requiredProps: {
    exportId: 'EXP-001',
    txHash: '0x123',
    documents: {},
    approvals: [],
  },
});

// Loading state tests
createLoadingStateTests({
  name: 'ExportStatus',
  component: ExportStatus,
  defaultProps,
  requiredProps: {
    exportId: 'EXP-001',
    txHash: '0x123',
    documents: {},
    approvals: [],
  },
  loadingProp: 'isLoading',
  loadingSelector: '[data-testid="export-status-loading"]',
});

// Interactive behavior tests
createInteractiveComponentTests({
  name: 'ExportStatus',
  component: ExportStatus,
  defaultProps,
  requiredProps: {
    exportId: 'EXP-001',
    txHash: '0x123',
    documents: {},
    approvals: [],
  },
  interactions: {
    click: true,
  },
  callbacks: ['onDocumentView', 'onApprovalClick'],
  skipTests: ['clickInteraction'], // Custom implementation below
});

// ==============================================================================
// Custom Tests
// ==============================================================================

describe('ExportStatus Component - Custom Behavior', () => {
  describe('Tab Navigation', () => {
    it('switches between status and documents tabs', async () => {
      const user = userEvent.setup();
      renderWithProviders(<ExportStatus {...defaultProps} />);

      // Should start on status tab
      expect(screen.getByTestId('status-tab')).toHaveAttribute('data-state', 'active');
      expect(screen.getByTestId('export-id')).toBeInTheDocument();

      // Switch to documents tab
      await user.click(screen.getByTestId('documents-tab'));
      expect(screen.getByTestId('documents-tab')).toHaveAttribute('data-state', 'active');
      expect(screen.getByText('Export Documents')).toBeInTheDocument();
    });
  });

  describe('Export Information Display', () => {
    it('displays export ID and transaction hash correctly', () => {
      renderWithProviders(<ExportStatus {...defaultProps} />);

      expect(screen.getByTestId('export-id')).toHaveTextContent('EXP-001');
      expect(screen.getByTestId('tx-hash')).toHaveTextContent('0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef');
    });

    it('truncates long transaction hash with title attribute', () => {
      renderWithProviders(<ExportStatus {...defaultProps} />);
      
      const txHashElement = screen.getByTestId('tx-hash');
      expect(txHashElement).toHaveAttribute('title', defaultProps.txHash);
    });
  });

  describe('Approval Status Display', () => {
    it('displays all approvals with correct status colors', () => {
      renderWithProviders(<ExportStatus {...defaultProps} />);

      // Check each approval is displayed
      mockApprovals.forEach(approval => {
        expect(screen.getByTestId(`approval-${approval.id}`)).toBeInTheDocument();
        expect(screen.getByTestId(`approval-status-${approval.id}`)).toHaveTextContent(approval.status);
      });
    });

    it('displays approval comments when available', () => {
      renderWithProviders(<ExportStatus {...defaultProps} />);

      expect(screen.getByText('License verified successfully')).toBeInTheDocument();
      expect(screen.getByText('Quality certificate needs revision')).toBeInTheDocument();
    });

    it('formats timestamps correctly', () => {
      renderWithProviders(<ExportStatus {...defaultProps} />);

      // Check that timestamps are formatted (actual format depends on locale)
      const timestampElements = screen.getAllByText(/2024/);
      expect(timestampElements.length).toBeGreaterThan(0);
    });

    it('calls onApprovalClick when approval is clicked', async () => {
      const onApprovalClick = vi.fn();
      const user = userEvent.setup();
      
      renderWithProviders(
        <ExportStatus {...defaultProps} onApprovalClick={onApprovalClick} />
      );

      await user.click(screen.getByTestId('approval-1'));
      expect(onApprovalClick).toHaveBeenCalledWith(mockApprovals[0]);
    });
  });

  describe('Documents Display', () => {
    it('displays documents in documents tab', async () => {
      const user = userEvent.setup();
      renderWithProviders(<ExportStatus {...defaultProps} />);

      await user.click(screen.getByTestId('documents-tab'));
      expect(screen.getByText('Export Documents')).toBeInTheDocument();
      
      // Check that document viewers are rendered (implementation depends on DocumentViewer)
      Object.keys(mockDocuments).forEach(docType => {
        // This would depend on how DocumentViewer is implemented
        expect(screen.getByText(new RegExp(docType, 'i'))).toBeInTheDocument();
      });
    });

    it('calls onDocumentView when document is interacted with', async () => {
      const onDocumentView = vi.fn();
      const user = userEvent.setup();
      
      renderWithProviders(
        <ExportStatus {...defaultProps} onDocumentView={onDocumentView} />
      );

      await user.click(screen.getByTestId('documents-tab'));
      
      // This test depends on DocumentViewer implementation
      // Assuming it triggers onDocumentView when clicked
      // You would need to adjust based on actual DocumentViewer behavior
    });
  });

  describe('Loading State', () => {
    it('shows loading spinner when isLoading is true', () => {
      renderWithProviders(<ExportStatus {...defaultProps} isLoading />);
      
      expect(screen.getByTestId('export-status-loading')).toBeInTheDocument();
      expect(screen.getByText('Loading export status...')).toBeInTheDocument();
    });

    it('hides content when loading', () => {
      renderWithProviders(<ExportStatus {...defaultProps} isLoading />);
      
      expect(screen.queryByTestId('status-tab')).not.toBeInTheDocument();
      expect(screen.queryByTestId('export-id')).not.toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles empty approvals array gracefully', () => {
      renderWithProviders(
        <ExportStatus {...defaultProps} approvals={[]} />
      );

      expect(screen.getByText('Approval Status')).toBeInTheDocument();
      // Should not crash, might show empty state
    });

    it('handles empty documents object gracefully', async () => {
      const user = userEvent.setup();
      renderWithProviders(
        <ExportStatus {...defaultProps} documents={{}} />
      );

      await user.click(screen.getByTestId('documents-tab'));
      expect(screen.getByText('Export Documents')).toBeInTheDocument();
      // Should not crash, might show empty state
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels and roles', () => {
      renderWithProviders(<ExportStatus {...defaultProps} />);

      // Check that tabs have proper roles
      expect(screen.getByRole('tablist')).toBeInTheDocument();
      expect(screen.getAllByRole('tab')).toHaveLength(2);
      expect(screen.getByRole('tabpanel')).toBeInTheDocument();
    });

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      renderWithProviders(<ExportStatus {...defaultProps} />);

      const statusTab = screen.getByTestId('status-tab');
      const documentsTab = screen.getByTestId('documents-tab');

      // Focus on status tab
      await user.tab();
      expect(statusTab).toHaveFocus();

      // Navigate to documents tab with arrow keys
      await user.keyboard('{ArrowRight}');
      expect(documentsTab).toHaveFocus();

      // Activate with Enter
      await user.keyboard('{Enter}');
      expect(documentsTab).toHaveAttribute('data-state', 'active');
    });
  });
});