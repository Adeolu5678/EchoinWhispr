# Non-Functional Requirements for Frontend Implementation

This document outlines the non-functional requirements that must be implemented in the web frontend to ensure it meets the performance, security, usability, and scalability standards specified in the NFRs document.

## Performance & Scalability

### Client-Side Load Optimization

#### HCS Stream Filtering
- **Requirement**: The client application must handle large HCS topic streams efficiently
- **Implementation**:
  - Use Web Workers for background HCS message processing
  - Implement efficient filtering logic to avoid blocking the main thread
  - Cache processed messages locally to reduce redundant processing
  - Limit subscription to recent messages (last 24-48 hours) to reduce memory usage

```typescript
// Efficient HCS filtering implementation
class HCSMessageProcessor {
  private activeHashes: Set<string> = new Set();
  private messageCache: Map<string, ProcessedMessage> = new Map();

  addActiveHash(hash: string) {
    this.activeHashes.add(hash);
  }

  removeActiveHash(hash: string) {
    this.activeHashes.delete(hash);
  }

  processMessage(rawMessage: HCSMessage): ProcessedMessage | null {
    const payload = JSON.parse(rawMessage.contents);

    // Quick filter check
    if (!this.activeHashes.has(payload.to_hash)) {
      return null;
    }

    // Check cache to avoid duplicate processing
    const cacheKey = `${payload.cid}-${payload.convo_id}`;
    if (this.messageCache.has(cacheKey)) {
      return this.messageCache.get(cacheKey)!;
    }

    // Process and cache
    const processed = this.decryptAndParse(payload);
    this.messageCache.set(cacheKey, processed);

    return processed;
  }
}
```

#### Image Loading Optimization
- **Requirement**: Implement lazy-loading for image-heavy conversations
- **Implementation**:
  - Use Intersection Observer API for lazy loading
  - Implement progressive image loading with blur placeholders
  - Cache loaded images in IndexedDB for offline access
  - Limit concurrent image downloads to prevent bandwidth saturation

```typescript
// Lazy image loading implementation
class LazyImageLoader {
  private observer: IntersectionObserver;

  constructor() {
    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      { rootMargin: '50px' }
    );
  }

  observe(imageElement: HTMLImageElement) {
    this.observer.observe(imageElement);
  }

  private async handleIntersection(entries: IntersectionObserverEntry[]) {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        await this.loadImage(img);
        this.observer.unobserve(img);
      }
    }
  }

  private async loadImage(img: HTMLImageElement): Promise<void> {
    const src = img.dataset.src!;
    return new Promise((resolve, reject) => {
      img.src = src;
      img.onload = () => {
        img.classList.add('loaded');
        resolve();
      };
      img.onerror = reject;
    });
  }
}
```

### Memory Management
- **Limit cached data**: Implement LRU cache for user profiles and messages
- **Clean up event listeners**: Properly remove HCS subscriptions when components unmount
- **Optimize re-renders**: Use React.memo and useMemo for expensive operations

## Security & Anonymity

### No Plaintext Storage
- **Requirement**: At no point shall unencrypted message content touch local storage or browser cache
- **Implementation**:
  - Never store decrypted messages in localStorage or IndexedDB
  - Clear decrypted content from memory immediately after display
  - Use secure contexts for all cryptographic operations

### Client-Side Encryption Enforcement
- **Requirement**: All message content encrypted client-side using ECIES
- **Implementation**:
  - Generate encryption keys client-side only
  - Never transmit private keys to any server
  - Validate encryption before HCS submission

```typescript
// Secure message encryption workflow
class MessageEncryptor {
  private privateKey: string;

  constructor(privateKey: string) {
    this.privateKey = privateKey;
  }

  async encryptForRecipient(
    message: MessageObject,
    recipientPublicKey: string
  ): Promise<string> {
    // Validate inputs
    if (!message.text_content && !message.image_cid) {
      throw new Error('Message must contain text or image');
    }

    // Create canonical message format
    const canonicalMessage = {
      type: message.image_cid ? 'text/image' : 'text',
      text_content: message.text_content || '',
      image_cid: message.image_cid || null,
      timestamp: Date.now()
    };

    // Encrypt
    const messageJson = JSON.stringify(canonicalMessage);
    const encrypted = encrypt(recipientPublicKey, Buffer.from(messageJson));

    return encrypted.toString('hex');
  }

  async decryptReceived(encryptedHex: string): Promise<MessageObject> {
    try {
      const encrypted = Buffer.from(encryptedHex, 'hex');
      const decrypted = decrypt(this.privateKey, encrypted);
      const message = JSON.parse(decrypted.toString());

      // Clear decrypted data from memory after use
      setTimeout(() => {
        // Allow garbage collection
        decrypted.fill(0);
      }, 100);

      return message;
    } catch (error) {
      throw new Error('Failed to decrypt message');
    }
  }
}
```

### Unlinkable Conversations
- **Requirement**: Conversations must remain unlinkable
- **Implementation**:
  - Generate unique reply hashes for each conversation
  - Never reuse hashes across different conversations
  - Implement proper hash cleanup after conversations end

## Usability & Accessibility

### Web2 Familiarity
- **Requirement**: Abstract all Web3 complexity
- **Implementation**:
  - Hide technical terms (HCS, IPFS, CID) from users
  - Provide clear, familiar language in wallet prompts
  - Implement seamless wallet connection flow

#### Wallet Prompt Obfuscation
```typescript
// User-friendly transaction descriptions
const TRANSACTION_MESSAGES = {
  REGISTER: 'Create your anonymous profile on EchoinWhispr',
  UPDATE_PROFILE: 'Update your profile information',
  SEND_MESSAGE: 'Send your anonymous message',
  SUBSCRIBE: 'Subscribe to unlimited messaging',
  ACCEPT_ECHO: 'Accept conversation request'
};

function getUserFriendlyMessage(action: keyof typeof TRANSACTION_MESSAGES): string {
  return TRANSACTION_MESSAGES[action];
}
```

### Transaction Feedback
- **Requirement**: Clear and descriptive wallet prompts
- **Implementation**:
  - Show loading states during blockchain operations
  - Provide clear success/error messages
  - Implement transaction progress indicators

### Responsive Design
- **Mobile-first approach**: Ensure all interactions work on mobile devices
- **Touch targets**: Minimum 44px touch targets for mobile
- **Gesture support**: Implement swipe gestures for navigation where appropriate

## Cost & Gas Efficiency

### Read-Heavy Optimization
- **Requirement**: Leverage free Mirror Node queries
- **Implementation**:
  - Cache user directory data locally
  - Implement incremental sync for profile updates
  - Use efficient querying patterns

```typescript
// Efficient user directory management
class UserDirectoryManager {
  private users: Map<string, CachedUserProfile> = new Map();
  private lastSync: number = 0;
  private readonly SYNC_INTERVAL = 5 * 60 * 1000; // 5 minutes

  async getUserProfile(accountId: string): Promise<UserProfile> {
    const cached = this.users.get(accountId);

    if (cached && this.isValidCache(cached)) {
      return cached.profile;
    }

    // Fetch from contract
    const profile = await fetchUserProfileFromContract(accountId);

    // Cache the result
    this.users.set(accountId, {
      profile,
      timestamp: Date.now(),
      version: profile.version || 1
    });

    return profile;
  }

  private isValidCache(cached: CachedUserProfile): boolean {
    return Date.now() - cached.timestamp < this.SYNC_INTERVAL;
  }

  async syncDirectory(): Promise<void> {
    if (Date.now() - this.lastSync < this.SYNC_INTERVAL) {
      return;
    }

    // Incremental sync - only fetch changed users
    const changedUsers = await getRecentlyChangedUsers(this.lastSync);
    for (const accountId of changedUsers) {
      await this.getUserProfile(accountId); // This will update cache
    }

    this.lastSync = Date.now();
  }
}
```

### Write-Light Operations
- **Requirement**: Minimize on-chain writes
- **Implementation**:
  - Batch profile updates where possible
  - Cache subscription status locally
  - Implement optimistic updates for better UX

## Decentralization

### No Central Server Dependency
- **Requirement**: Core functionality must not rely on centralized servers
- **Implementation**:
  - All data operations go directly to Hedera/IPFS
  - Implement fallback mechanisms for IPFS node failures
  - Use multiple IPFS gateways for redundancy

```typescript
// Decentralized IPFS access with fallbacks
class DecentralizedIPFSClient {
  private gateways = [
    'https://ipfs.io/ipfs/',
    'https://gateway.pinata.cloud/ipfs/',
    'https://cloudflare-ipfs.com/ipfs/',
    'https://dweb.link/ipfs/'
  ];

  async fetchContent(cid: string): Promise<string> {
    for (const gateway of this.gateways) {
      try {
        const response = await fetch(`${gateway}${cid}`, {
          timeout: 5000 // 5 second timeout
        });

        if (response.ok) {
          return await response.text();
        }
      } catch (error) {
        console.warn(`Gateway ${gateway} failed:`, error);
        continue;
      }
    }

    throw new Error('All IPFS gateways failed');
  }
}
```

### Offline Resilience
- **Implementation**:
  - Cache essential data for offline access
  - Queue outgoing messages when offline
  - Show appropriate offline indicators
  - Sync when connection is restored

## Performance Metrics

### Target Performance Benchmarks
- **Initial Load**: < 3 seconds
- **Message Send**: < 5 seconds (including IPFS upload and HCS submission)
- **Search Results**: < 1 second (cached)
- **Image Load**: < 2 seconds (lazy loaded)
- **Memory Usage**: < 50MB for typical usage

### Monitoring Implementation
```typescript
// Performance monitoring
class PerformanceMonitor {
  static measureOperation<T>(
    name: string,
    operation: () => Promise<T>
  ): Promise<T> {
    const start = performance.now();

    return operation().finally(() => {
      const duration = performance.now() - start;
      console.log(`${name} took ${duration.toFixed(2)}ms`);

      // Send to analytics if needed
      if (duration > 5000) {
        reportSlowOperation(name, duration);
      }
    });
  }
}
```

## Error Handling and Resilience

### Graceful Degradation
- **Network failures**: Show cached data with "offline" indicators
- **IPFS failures**: Retry with different gateways
- **Contract errors**: Clear error messages without technical details
- **Encryption failures**: Fallback to secure error states

### User Feedback
- **Loading states**: Always show progress for async operations
- **Error boundaries**: Prevent crashes from propagating to user
- **Retry mechanisms**: Allow users to retry failed operations
- **Helpful messaging**: Guide users through error recovery

## References
- [Non-Functional Requirements (NFRs)](Documentations/Software Specification Documentation (SSD)/5. Non-Functional Requirements (NFRs).md)
- [System Architecture and Design](Documentations/Software Specification Documentation (SSD)/2. System Architecture and Design.md)