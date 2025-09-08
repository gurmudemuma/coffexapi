/// <reference types="vite/client" />

// Environment variable types are now defined in src/types/env.d.ts
// This file is kept for backward compatibility

interface ImportMetaEnv extends import('./types/env').ImportMetaEnv {}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
