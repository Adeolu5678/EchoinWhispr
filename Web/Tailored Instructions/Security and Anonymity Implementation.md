# Security and Anonymity Implementation Guide

This document provides critical security and anonymity implementation guidelines for the EchoinWhispr web frontend, ensuring compliance with the NFRs and maintaining user privacy.

## Core Security Principles

### No Plaintext Data Exposure
- **Never** store unencrypted message content in:
  - localStorage
  - sessionStorage
  - IndexedDB
  - Browser cache
  - Console logs (in production)
- **Never** transmit unencrypted data to any network endpoint
- **Always** encrypt data client-side before any transmission

### End-to-End Encryption Enforcement
- All message content must be encrypted using ECIES (Elliptic Curve Integrated Encryption Scheme)
- Encryption keys must be generated and stored client-side only
- Private keys must never leave the user's device
- Public keys are the only cryptographic material stored on-chain

## Cryptographic Implementation

### Key Generation and Management
```typescript
// Secure key generation (client-side only)
class KeyManager {
  private static instance: KeyManager;
  private keyPair: { publicKey: string; privateKey: string } | null = null;

  static getInstance(): KeyManager {
    if (!KeyManager.instance) {
      KeyManager.instance = new KeyManager();
    }
    return KeyManager.instance;
  }

  async generateKeyPair(): Promise<{ publicKey: string; privateKey: string }> {
    if (this.keyPair) {
      return this.keyPair;
    }

    // Generate ECDSA keypair using Web Crypto API
    const keyPair = await crypto.subtle.generateKey(
      {
        name: 'ECDSA',
        namedCurve: 'P-256'
      },
      true, // extractable
      ['sign', 'verify']
    );

    // Export public key
    const publicKeyBuffer = await crypto.subtle.exportKey('spki', keyPair.publicKey);
    const publicKey = btoa(String.fromCharCode(...new Uint8Array(publicKeyBuffer)));

    // Export private key (keep secure)
    const privateKeyBuffer = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
    const privateKey = btoa(String.fromCharCode(...new Uint8Array(privateKeyBuffer)));

    this.keyPair = { publicKey, privateKey };
    return this.keyPair;
  }

  getPublicKey(): string | null {
    return this.keyPair?.publicKey || null;
  }

  // Private key should never be exposed outside this class
  private getPrivateKey(): string | null {
    return this.keyPair?.privateKey || null;
  }

  async signMessage(message: string): Promise<string> {
    if (!this.keyPair) {
      throw new Error('Key pair not generated');
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(message);

    const privateKey = await crypto.subtle.importKey(
      'pkcs8',
      Uint8Array.from(atob(this.keyPair.privateKey), c => c.charCodeAt(0)),
      { name: 'ECDSA', namedCurve: 'P-256' },
      false,
      ['sign']
    );

    const signature = await crypto.subtle.sign('ECDSA', privateKey, data);
    return btoa(String.fromCharCode(...new Uint8Array(signature)));
  }
}
```

### Message Encryption/Decryption
```typescript
// Secure message encryption using ECIES
class MessageCrypto {
  private keyManager: KeyManager;

  constructor(keyManager: KeyManager) {
    this.keyManager = keyManager;
  }

  async encryptMessage(
    message: MessageObject,
    recipientPublicKey: string
  ): Promise<string> {
    // Validate message content
    if (!message.text_content && !message.image_cid) {
      throw new Error('Message must contain text or image');
    }

    // Create canonical message format
    const canonicalMessage = {
      type: message.image_cid ? 'text/image' : 'text',
      text_content: message.text_content || '',
      image_cid: message.image_cid || null,
      timestamp: Date.now(),
      version: '1.0'
    };

    // Convert to JSON
    const messageJson = JSON.stringify(canonicalMessage);

    // Encrypt using ECIES
    const encrypted = encrypt(recipientPublicKey, Buffer.from(messageJson));

    // Return as hex string
    return encrypted.toString('hex');
  }

  async decryptMessage(encryptedHex: string): Promise<MessageObject> {
    try {
      const keyManager = KeyManager.getInstance();
      const privateKey = keyManager['getPrivateKey'](); // Access private method

      if (!privateKey) {
        throw new Error('Private key not available');
      }

      // Decrypt using ECIES
      const encrypted = Buffer.from(encryptedHex, 'hex');
      const decrypted = decrypt(privateKey, encrypted);

      // Parse JSON
      const message: MessageObject = JSON.parse(decrypted.toString());

      // Immediately clear decrypted data from memory
      this.secureClear(decrypted);

      return message;
    } catch (error) {
      throw new Error('Failed to decrypt message: ' + error.message);
    }
  }

  private secureClear(buffer: Buffer): void {
    // Overwrite buffer with zeros
    for (let i = 0; i < buffer.length; i++) {
      buffer[i] = 0;
    }

    // Schedule garbage collection hint
    setTimeout(() => {
      if (global.gc) {
        global.gc();
      }
    }, 100);
  }
}
```

### Hash Generation for Anonymity
```typescript
// Generate anonymous identifiers
class AnonymityManager {
  static generateMailHash(publicKey: string): string {
    // Create a deterministic hash from public key
    const encoder = new TextEncoder();
    const data = encoder.encode(publicKey);
    return crypto.subtle.digest('SHA-256', data)
      .then(hash => {
        const hashArray = Array.from(new Uint8Array(hash));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      });
  }

  static generateReplyHash(): string {
    // Generate cryptographically secure random hash
    const randomBytes = crypto.getRandomValues(new Uint8Array(32));
    return crypto.subtle.digest('SHA-256', randomBytes)
      .then(hash => {
        const hashArray = Array.from(new Uint8Array(hash));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      });
  }

  static generateConversationId(): string {
    // Use UUID v4 for conversation threading
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}
```

## Conversation Anonymity

### Unlinkable Conversation Management
```typescript
// Manage conversation anonymity
class ConversationManager {
  private activeReplyHashes: Set<string> = new Set();
  private conversationMap: Map<string, ConversationContext> = new Map();

  // Track active reply hashes for HCS filtering
  addActiveReplyHash(hash: string): void {
    this.activeReplyHashes.add(hash);
  }

  removeActiveReplyHash(hash: string): void {
    this.activeReplyHashes.delete(hash);
  }

  isActiveReplyHash(hash: string): boolean {
    return this.activeReplyHashes.has(hash);
  }

  // Store conversation context (never store decrypted content)
  storeConversationContext(
    convoId: string,
    context: ConversationContext
  ): void {
    this.conversationMap.set(convoId, {
      ...context,
      // Ensure no sensitive data is stored
      lastMessage: undefined // Never store message content
    });
  }

  getConversationContext(convoId: string): ConversationContext | null {
    return this.conversationMap.get(convoId) || null;
  }

  // Clean up when conversation ends
  endConversation(convoId: string): void {
    const context = this.conversationMap.get(convoId);
    if (context) {
      // Remove reply hash from active set
      this.activeReplyHashes.delete(context.replyToHash);
      this.conversationMap.delete(convoId);
    }
  }
}

interface ConversationContext {
  convoId: string;
  replyToHash: string;
  replyToKey: string;
  participantPublicKey: string;
  created: number;
  lastActivity: number;
}
```

## HCS Message Security

### Secure HCS Payload Construction
```typescript
// Construct HCS messages without exposing content
class HCSMessageBuilder {
  async buildWhisperMessage(
    recipientMailHash: string,
    encryptedContentCid: string,
    conversationId: string
  ): Promise<HCSMessagePayload> {
    const replyHash = await AnonymityManager.generateReplyHash();
    const publicKey = KeyManager.getInstance().getPublicKey();

    if (!publicKey) {
      throw new Error('Public key not available');
    }

    return {
      to_hash: recipientMailHash,
      reply_hash: replyHash,
      from_key: publicKey,
      cid: encryptedContentCid,
      convo_id: conversationId
    };
  }

  async buildReplyMessage(
    targetReplyHash: string,
    targetPublicKey: string,
    encryptedContentCid: string,
    conversationId: string
  ): Promise<HCSMessagePayload> {
    const newReplyHash = await AnonymityManager.generateReplyHash();
    const publicKey = KeyManager.getInstance().getPublicKey();

    if (!publicKey) {
      throw new Error('Public key not available');
    }

    return {
      to_hash: targetReplyHash,
      reply_hash: newReplyHash,
      from_key: publicKey,
      cid: encryptedContentCid,
      convo_id: conversationId
    };
  }
}

interface HCSMessagePayload {
  to_hash: string;
  reply_hash: string;
  from_key: string;
  cid: string;
  convo_id: string;
}
```

## Secure Storage Guidelines

### What to Store Locally
- **Allowed**: Public keys, mail hashes, reply hashes, conversation IDs, timestamps
- **Allowed**: Encrypted CIDs, cached user profiles (public data only)
- **Forbidden**: Private keys, decrypted message content, unencrypted images

### Secure Local Storage Implementation
```typescript
// Secure local storage wrapper
class SecureStorage {
  private static readonly PREFIX = 'echoinwhispr_';

  static setItem(key: string, value: any): void {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(this.PREFIX + key, serialized);
    } catch (error) {
      console.error('Failed to store item:', error);
    }
  }

  static getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(this.PREFIX + key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Failed to retrieve item:', error);
      return null;
    }
  }

  static removeItem(key: string): void {
    localStorage.removeItem(this.PREFIX + key);
  }

  // Securely clear all app data
  static clearAll(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  }
}

// Usage examples
SecureStorage.setItem('user_public_key', publicKey);
SecureStorage.setItem('active_reply_hashes', Array.from(activeHashes));
SecureStorage.setItem('daily_whisper_count', { count: 3, date: '2025-01-01' });
```

## Network Security

### Content Security Policy (CSP)
```html
<!-- Strict CSP for security -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https: blob:;
  connect-src 'self' https://testnet.hashio.io https://ipfs.infura.io https://testnet.mirrornode.hedera.com;
  frame-src 'none';
  object-src 'none';
  base-uri 'self';
  form-action 'none';
">
```

### Secure Headers
- **HSTS**: Enforce HTTPS
- **X-Frame-Options**: Prevent clickjacking
- **X-Content-Type-Options**: Prevent MIME sniffing
- **Referrer-Policy**: Control referrer information

## Input Validation and Sanitization

### Message Content Validation
```typescript
// Validate message content before encryption
class MessageValidator {
  static validateTextContent(text: string): boolean {
    // Check length limits
    if (text.length > 10000) {
      return false;
    }

    // Check for malicious content (basic)
    const maliciousPatterns = [
      /<script/i,
      /javascript:/i,
      /data:text/i,
      /vbscript:/i
    ];

    return !maliciousPatterns.some(pattern => pattern.test(text));
  }

  static validateImageFile(file: File): boolean {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return false;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return false;
    }

    return true;
  }

  static sanitizeTextContent(text: string): string {
    // Basic HTML escaping
    return text
      .replace(/&/g, '&')
      .replace(/</g, '<')
      .replace(/>/g, '>')
      .replace(/"/g, '"')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }
}
```

## Error Handling and Logging

### Secure Error Handling
```typescript
// Never expose sensitive information in errors
class SecureErrorHandler {
  static handleError(error: Error, context: string): void {
    // Sanitize error message
    const safeMessage = this.sanitizeErrorMessage(error.message);

    // Log safely (never include user data)
    console.error(`[${context}] ${safeMessage}`);

    // Report to monitoring (if implemented)
    this.reportError(safeMessage, context);
  }

  private static sanitizeErrorMessage(message: string): string {
    // Remove any potential sensitive data
    return message
      .replace(/0x[a-fA-F0-9]{40}/g, '[ACCOUNT_ID]') // Hedera account IDs
      .replace(/0x[a-fA-F0-9]{64}/g, '[HASH]') // Hashes
      .replace(/-----BEGIN.*-----END.*-----/gs, '[KEY_DATA]'); // Key material
  }

  private static reportError(message: string, context: string): void {
    // Send to error monitoring service (implement as needed)
    // Ensure no sensitive data is included
  }
}
```

## References
- [Non-Functional Requirements (NFRs)](Documentations/Software Specification Documentation (SSD)/5. Non-Functional Requirements (NFRs).md)
- [Detailed Functional Workflows](Documentations/Software Specification Documentation (SSD)/4. Detailed Functional Workflows.md)
- [System Architecture and Design](Documentations/Software Specification Documentation (SSD)/2. System Architecture and Design.md)