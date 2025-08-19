import { create } from 'ipfs-http-client';
import * as aesjs from 'aes-js';

// Initialize IPFS client
const projectId = process.env.REACT_APP_INFURA_PROJECT_ID;
const projectSecret = process.env.REACT_APP_INFURA_PROJECT_SECRET;
const auth =
  'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const ipfs = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
});

type EncryptedFile = {
  iv: string;
  ciphertext: string;
  key: string;
};

/**
 * Encrypts a file using AES-256-CBC
 */
const encryptFile = async (
  file: File,
  secretKey: string
): Promise<EncryptedFile> => {
  const arrayBuffer = await file.arrayBuffer();
  const fileBytes = new Uint8Array(arrayBuffer);

  // Generate a random initialization vector
  const iv = window.crypto.getRandomValues(new Uint8Array(16));

  // Convert secret key to bytes (32 bytes for AES-256)
  const keyBytes = new TextEncoder().encode(
    secretKey.padEnd(32, '0').slice(0, 32)
  );

  // Encrypt the file
  const aesCbc = new aesjs.ModeOfOperation.cbc(keyBytes, iv);
  const encryptedBytes = aesCbc.encrypt(aesjs.padding.pkcs7.pad(fileBytes));

  return {
    iv: Buffer.from(iv).toString('hex'),
    ciphertext: Buffer.from(encryptedBytes).toString('hex'),
    key: secretKey,
  };
};

/**
 * Uploads a file to IPFS with encryption
 */
export const uploadToIPFS = async (file: File, secretKey: string) => {
  try {
    // Encrypt the file before uploading
    const encryptedFile = await encryptFile(file, secretKey);

    // Convert encrypted data to a buffer
    const encryptedBuffer = Buffer.from(JSON.stringify(encryptedFile));

    // Add to IPFS
    const { cid } = await ipfs.add(encryptedBuffer, {
      pin: true,
    });

    // Return the IPFS hash and encryption details
    return {
      cid: cid.toString(),
      url: `https://ipfs.io/ipfs/${cid}`,
      iv: encryptedFile.iv,
    };
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw new Error('Failed to upload file to IPFS');
  }
};

/**
 * Retrieves and decrypts a file from IPFS
 */
export const getFromIPFS = async (
  cid: string,
  iv: string,
  secretKey: string
): Promise<Uint8Array> => {
  try {
    // Get the encrypted file from IPFS
    const chunks = [];
    for await (const chunk of ipfs.cat(cid)) {
      chunks.push(chunk);
    }

    const encryptedData = JSON.parse(Buffer.concat(chunks).toString());

    // Decrypt the file
    const ivBytes = Uint8Array.from(Buffer.from(iv, 'hex'));
    const keyBytes = new TextEncoder().encode(
      secretKey.padEnd(32, '0').slice(0, 32)
    );
    const encryptedBytes = Uint8Array.from(
      Buffer.from(encryptedData.ciphertext, 'hex')
    );

    const aesCbc = new aesjs.ModeOfOperation.cbc(keyBytes, ivBytes);
    const decryptedBytes = aesCbc.decrypt(encryptedBytes);

    // Remove padding and return
    return aesjs.padding.pkcs7.strip(decryptedBytes);
  } catch (error) {
    console.error('Error retrieving from IPFS:', error);
    throw new Error('Failed to retrieve file from IPFS');
  }
};

/**
 * Generates a secure random key for encryption
 */
export const generateEncryptionKey = (): string => {
  const array = new Uint8Array(32); // 256 bits
  window.crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join(
    ''
  );
};
