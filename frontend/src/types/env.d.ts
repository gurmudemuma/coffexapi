/// <reference types="vite/client" />

interface ImportMetaEnv {
  // IPFS Configuration
  
  
  // API Configuration
  readonly VITE_API_BASE_URL: string;
  
  // Application Settings
  readonly VITE_APP_ENV: 'development' | 'staging' | 'production';
  
  // Feature Flags
  readonly VITE_FEATURE_IPFS_UPLOAD: string; // boolean as string
  readonly VITE_FEATURE_OFFLINE_MODE: string; // boolean as string
  
  // Security Settings
  readonly VITE_SESSION_TIMEOUT: string; // number as string (minutes)
  
  // Analytics & Monitoring
  readonly VITE_ENABLE_ANALYTICS: string; // boolean as string
  readonly VITE_ANALYTICS_ID?: string;
  
  // Development Settings
  readonly VITE_DEBUG_LOGGING: string; // boolean as string
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
