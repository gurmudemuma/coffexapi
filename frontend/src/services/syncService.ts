import {
  getPendingDocuments,
  markDocumentAsSynced,
  markDocumentAsError,
  getPendingSubmissions,
  updateSubmissionStatus,
  isOnline,
} from '../utils/offlineStorage';

// Import your API client or fetch utilities
import { api } from '@/lib/api';

class SyncService {
  private isSyncing = false;
  private syncInterval: NodeJS.Timeout | null = null;

  // Start the sync service
  public start() {
    // Initial sync check
    this.syncIfOnline();

    // Set up periodic sync (every 30 seconds)
    this.syncInterval = setInterval(() => this.syncIfOnline(), 30000);

    // Listen for online/offline events
    if (typeof window !== 'undefined') {
      window.addEventListener('online', this.handleOnline);
    }
  }

  // Stop the sync service
  public stop() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }

    if (typeof window !== 'undefined') {
      window.removeEventListener('online', this.handleOnline);
    }
  }

  // Handle online event
  private handleOnline = () => {
    console.log('Network is back online, starting sync...');
    this.syncIfOnline();
  };

  // Check if online and start sync if true
  private async syncIfOnline() {
    if (isOnline() && !this.isSyncing) {
      try {
        this.isSyncing = true;
        await this.syncDocuments();
        await this.syncSubmissions();
      } catch (error) {
        console.error('Sync error:', error);
      } finally {
        this.isSyncing = false;
      }
    }
  }

  // Sync pending documents
  private async syncDocuments() {
    const pendingDocs = await getPendingDocuments();

    for (const doc of pendingDocs) {
      try {
        // Create FormData to send the file
        const formData = new FormData();
        formData.append('file', doc.file);
        formData.append('type', doc.type);

        // Upload the file using the correct API endpoint
        // Note: We need to pass the actual File object, not FormData
        const response = await api.uploadDocument(doc.file);

        // Mark as synced if successful
        await markDocumentAsSynced(doc.id!);

        console.log(`Document ${doc.id} synced successfully`);
      } catch (error) {
        console.error(`Error syncing document ${doc.id}:`, error);
        await markDocumentAsError(
          doc.id!,
          error instanceof Error ? error.message : 'Failed to upload document'
        );
      }
    }
  }

  // Sync pending form submissions
  private async syncSubmissions() {
    const pendingSubmissions = await getPendingSubmissions();

    for (const submission of pendingSubmissions) {
      try {
        // Update status to syncing
        await updateSubmissionStatus(submission.id!, 'syncing');

        // Submit the export data using the correct API method
        const response = await api.submitExport(submission.data);

        // Mark as synced if successful
        await updateSubmissionStatus(submission.id!, 'synced');

        console.log(`Submission ${submission.id} synced successfully`);
      } catch (error) {
        console.error(`Error syncing submission ${submission.id}:`, error);
        await updateSubmissionStatus(
          submission.id!,
          'error',
          error instanceof Error ? error.message : 'Failed to submit form'
        );
      }
    }
  }

  // Check if there are pending sync operations
  public async hasPendingOperations(): Promise<boolean> {
    const [pendingDocs, pendingSubmissions] = await Promise.all([
      getPendingDocuments(),
      getPendingSubmissions(),
    ]);

    return pendingDocs.length > 0 || pendingSubmissions.length > 0;
  }
}

// Export a singleton instance
export const syncService = new SyncService();

// Start the sync service when the module loads
if (typeof window !== 'undefined') {
  syncService.start();
}
