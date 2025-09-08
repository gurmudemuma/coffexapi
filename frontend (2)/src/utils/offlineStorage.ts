import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface DocumentData {
  id?: number;
  type: string;
  file: File;
  timestamp: number;
  status: 'pending' | 'synced' | 'error';
  error?: string;
}

interface PendingSubmission {
  id?: number;
  data: Record<string, any>;
  timestamp: number;
  status: 'pending' | 'syncing' | 'synced' | 'error';
  error?: string;
}

interface OfflineDB extends DBSchema {
  documents: {
    key: number;
    value: DocumentData;
    indexes: { 'by-type': string; 'by-status': string };
  };
  submissions: {
    key: number;
    value: PendingSubmission;
    indexes: { 'by-status': string };
  };
  settings: {
    key: string;
    value: any;
  };
}

const DB_NAME = 'coffex-offline';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<OfflineDB>> | null = null;

const getDB = async () => {
  if (!dbPromise) {
    dbPromise = openDB<OfflineDB>(DB_NAME, DB_VERSION, {
      upgrade(db: IDBPDatabase<OfflineDB>) {
        // Create documents store
        const documentStore = db.createObjectStore('documents', {
          keyPath: 'id',
          autoIncrement: true,
        });
        documentStore.createIndex('by-type', 'type');
        documentStore.createIndex('by-status', 'status');

        // Create submissions store
        const submissionStore = db.createObjectStore('submissions', {
          keyPath: 'id',
          autoIncrement: true,
        });
        submissionStore.createIndex('by-status', 'status');

        // Create settings store
        db.createObjectStore('settings');
      },
    });
  }
  return dbPromise;
};

export const saveDocument = async (
  type: string,
  file: File
): Promise<number> => {
  const db = await getDB();
  const tx = db.transaction('documents', 'readwrite');
  const id = await tx.store.add({
    type,
    file,
    timestamp: Date.now(),
    status: 'pending',
  });
  await tx.done;
  return id as number;
};

export const getPendingDocuments = async (): Promise<DocumentData[]> => {
  const db = await getDB();
  return db.getAllFromIndex('documents', 'by-status', 'pending');
};

export const markDocumentAsSynced = async (id: number) => {
  const db = await getDB();
  const tx = db.transaction('documents', 'readwrite');
  const doc = await tx.store.get(id);
  if (doc) {
    doc.status = 'synced';
    await tx.store.put(doc);
  }
  await tx.done;
};

export const markDocumentAsError = async (id: number, error: string) => {
  const db = await getDB();
  const tx = db.transaction('documents', 'readwrite');
  const doc = await tx.store.get(id);
  if (doc) {
    doc.status = 'error';
    doc.error = error;
    await tx.store.put(doc);
  }
  await tx.done;
};

export const savePendingSubmission = async (
  data: Record<string, any>
): Promise<number> => {
  const db = await getDB();
  const tx = db.transaction('submissions', 'readwrite');
  const id = await tx.store.add({
    data,
    timestamp: Date.now(),
    status: 'pending',
  });
  await tx.done;
  return id as number;
};

export const getPendingSubmissions = async (): Promise<PendingSubmission[]> => {
  const db = await getDB();
  return db.getAllFromIndex('submissions', 'by-status', 'pending');
};

export const updateSubmissionStatus = async (
  id: number,
  status: 'syncing' | 'synced' | 'error',
  error?: string
) => {
  const db = await getDB();
  const tx = db.transaction('submissions', 'readwrite');
  const submission = await tx.store.get(id);
  if (submission) {
    submission.status = status;
    if (error) {
      submission.error = error;
    }
    await tx.store.put(submission);
  }
  await tx.done;
};

export const getSetting = async <T>(key: string): Promise<T | undefined> => {
  const db = await getDB();
  return db.get('settings', key);
};

export const setSetting = async (key: string, value: any) => {
  const db = await getDB();
  await db.put('settings', value, key);
};

export const isOnline = () => {
  return navigator.onLine;
};

export const getPendingOperations = async (): Promise<boolean> => {
  const db = await getDB();
  const [pendingDocs, pendingSubmissions] = await Promise.all([
    db.getAllFromIndex('documents', 'by-status', 'pending'),
    db.getAllFromIndex('submissions', 'by-status', 'pending'),
  ]);

  return pendingDocs.length > 0 || pendingSubmissions.length > 0;
};

// Set up online/offline event listeners
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    // Trigger sync when coming back online
    // The actual sync logic will be implemented in the sync service
    console.log('Online - starting sync...');
  });

  window.addEventListener('offline', () => {
    console.log('Offline - working in offline mode');
  });
}
