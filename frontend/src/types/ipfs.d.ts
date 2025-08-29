import { IPFSHTTPClient } from 'ipfs-http-client';

declare module 'ipfs-http-client' {
  interface IPFSHTTPClient {
    add: (content: any, options?: any) => Promise<{ path: string; cid: any; size: number }>;
    cat: (cid: string) => AsyncIterable<Uint8Array>;
  }
}

declare module '../services/ipfsService' {
  interface IPFSOptions {
    signal?: AbortSignal;
  }
}
