import { encrypt, decrypt, PrivateKey, PublicKey } from 'eciesjs';

/**
 * Client-side ECIES encryption utilities for EchoinWhispr
 * Handles end-to-end encryption of messages using Elliptic Curve Integrated Encryption Scheme
 */

export class EncryptionService {
  private privateKey: PrivateKey;
  private publicKey: PublicKey;

  constructor() {
    // Generate a new key pair for the user
    this.privateKey = new PrivateKey();
    this.publicKey = this.privateKey.publicKey;
  }

  /**
   * Get the public key as bytes for storage in smart contract
   */
  getPublicKeyBytes(): Uint8Array {
    return this.publicKey.toBytes();
  }

  /**
   * Get the public key as hex string
   */
  getPublicKeyHex(): string {
    return this.publicKey.toHex();
  }

  /**
   * Encrypt a message for a recipient using their public key
   * @param message - The plaintext message to encrypt
   * @param recipientPublicKeyHex - Recipient's public key in hex format
   * @returns Encrypted message as Uint8Array
   */
  encryptMessage(message: string, recipientPublicKeyHex: string): Uint8Array {
    const recipientPublicKey = PublicKey.fromHex(recipientPublicKeyHex);
    const messageBytes = new TextEncoder().encode(message);
    return encrypt(recipientPublicKey.toBytes(), messageBytes);
  }

  /**
   * Decrypt a message using the user's private key
   * @param encryptedMessage - The encrypted message as Uint8Array
   * @returns Decrypted plaintext message
   */
  decryptMessage(encryptedMessage: Uint8Array): string {
    const decryptedBytes = decrypt(this.privateKey.toBytes(), encryptedMessage);
    return new TextDecoder().decode(decryptedBytes);
  }

  /**
   * Encrypt a message object (JSON) for a recipient
   * @param messageObject - The message object to encrypt
   * @param recipientPublicKeyHex - Recipient's public key in hex format
   * @returns Encrypted message as Uint8Array
   */
  encryptMessageObject(messageObject: any, recipientPublicKeyHex: string): Uint8Array {
    const jsonString = JSON.stringify(messageObject);
    return this.encryptMessage(jsonString, recipientPublicKeyHex);
  }

  /**
   * Decrypt a message and parse as JSON object
   * @param encryptedMessage - The encrypted message as Uint8Array
   * @returns Decrypted message object
   */
  decryptMessageObject(encryptedMessage: Uint8Array): any {
    const jsonString = this.decryptMessage(encryptedMessage);
    return JSON.parse(jsonString);
  }

  /**
   * Generate a random mail hash for anonymous messaging
   * @param userAddress - User's Hedera account ID
   * @param salt - Random salt for uniqueness
   * @returns Promise resolving to keccak256 hash as bytes32 hex string
   */
  static async generateMailHash(userAddress: string, salt: string): Promise<string> {
    const input = userAddress + salt;
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data); // Using SHA-256 as Web Crypto API doesn't have keccak256
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
}

/**
 * Message object structure for encryption
 */
export interface MessageObject {
  type: 'text' | 'text/image';
  text_content: string;
  image_cid?: string; // IPFS CID of the image, or null
}

/**
 * HCS message payload structure
 */
export interface HCSMessagePayload {
  to_hash: string; // bytes32
  reply_hash: string; // bytes32
  from_key: string; // hex string of public key
  cid: string; // IPFS CID of encrypted message
  convo_id: string; // UUID
}