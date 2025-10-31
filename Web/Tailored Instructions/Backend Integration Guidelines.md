# Backend Integration Guidelines

This document provides detailed instructions for integrating the web frontend with the decentralized backend systems as specified in the System Architecture and Design documentation.

## Architecture Overview

The frontend must integrate with a fully serverless, decentralized stack:

- **Identity & Auth**: Hedera Accounts via WalletConnect
- **State & Logic**: Hedera Smart Contract (EVM)
- **Data Storage**: IPFS/Filecoin for large data
- **Consensus & Routing**: Hedera Consensus Service (HCS)
- **Data Reading**: Hedera Mirror Nodes

## Technology Stack Integration

### Core SDKs

#### Hedera SDK (hedera-sdk-js)
```typescript
import { Client, AccountId, PrivateKey, ContractCallQuery, ContractExecuteTransaction, TopicMessageSubmitTransaction, TopicMessageQuery } from '@hashgraph/sdk';

// Initialize client
const client = Client.forTestnet(); // or forMainnet()
client.setOperator(accountId, privateKey);
```

#### Ethers.js for EVM Contracts
```typescript
import { ethers } from 'ethers';

// Connect to Hedera's JSON-RPC relay
const provider = new ethers.providers.JsonRpcProvider('https://testnet.hashio.io/api');
const signer = new ethers.Wallet(privateKey, provider);

// Contract instance
const contract = new ethers.Contract(contractAddress, abi, signer);
```

#### IPFS Client
```typescript
import { create } from 'ipfs-http-client';

// Connect to IPFS node (Infura, Pinata, or local)
const ipfs = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: `Bearer ${process.env.INFURA_PROJECT_SECRET}`
  }
});
```

#### ECIES Encryption
```typescript
import { encrypt, decrypt } from 'eciesjs';

// Generate keypair (client-side only)
const keypair = crypto.generateKeyPairSync('ec', {
  namedCurve: 'secp256k1',
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
});
```

## Smart Contract Integration

### Contract Functions

#### User Profile Management
```typescript
// Read user profile
async function getUserProfile(accountId: string) {
  const result = await contract.getPersona(accountId);
  return {
    career: result[0],
    interests: result[1],
    currentMood: result[2],
    publicKey: result[3],
    mailHash: result[4],
    subscriptionEnds: result[5]
  };
}

// Check if user is initialized
async function isUserInitialized(accountId: string): Promise<boolean> {
  return await contract.isInitialized(accountId);
}

// Register new user
async function registerUser(profileData: UserProfile) {
  const tx = await contract.registerUser(
    profileData.career,
    profileData.interests,
    profileData.currentMood,
    profileData.publicKey,
    profileData.mailHash
  );
  return await tx.wait();
}

// Update profile
async function updateProfile(profileData: Partial<UserProfile>) {
  const tx = await contract.updatePersona(
    profileData.career,
    profileData.interests,
    profileData.currentMood
  );
  return await tx.wait();
}
```

#### Subscription Management
```typescript
// Check subscription status
async function checkSubscription(accountId: string): Promise<boolean> {
  const subscriptionEnds = await contract.getSubscriptionEnds(accountId);
  return Date.now() / 1000 < subscriptionEnds;
}

// Subscribe with HBAR
async function subscribeWithHBAR(amount: number) {
  const tx = await contract.subscribeWithHBAR({
    value: ethers.utils.parseEther(amount.toString())
  });
  return await tx.wait();
}

// Subscribe with HTS token
async function subscribeWithHTS(tokenId: string, amount: number) {
  const tx = await contract.subscribeWithHTS(tokenId, amount);
  return await tx.wait();
}
```

#### Search and Discovery
```typescript
// Get all user profiles (for search)
async function getAllPersonas(): Promise<UserProfile[]> {
  // This would typically be done via Mirror Node queries
  // or by maintaining a local index
  const totalUsers = await contract.getTotalUsers();
  const profiles = [];

  for (let i = 0; i < totalUsers; i++) {
    const accountId = await contract.getUserAtIndex(i);
    const profile = await getUserProfile(accountId);
    profiles.push({ ...profile, accountId });
  }

  return profiles;
}
```

## HCS Integration

### Message Submission
```typescript
// Submit encrypted message to HCS
async function submitHCSMessage(messageData: HCSMessagePayload) {
  const topicId = process.env.HCS_TOPIC_ID;

  const message = {
    to_hash: messageData.to_hash,
    reply_hash: messageData.reply_hash,
    from_key: messageData.from_key,
    cid: messageData.cid,
    convo_id: messageData.convo_id
  };

  const tx = await new TopicMessageSubmitTransaction()
    .setTopicId(topicId)
    .setMessage(JSON.stringify(message))
    .execute(client);

  return await tx.getReceipt(client);
}
```

### Message Subscription
```typescript
// Subscribe to HCS topic for real-time messages
async function subscribeToHCS() {
  const topicId = process.env.HCS_TOPIC_ID;
  const mirrorNodeUrl = 'https://testnet.mirrornode.hedera.com';

  const query = new TopicMessageQuery()
    .setTopicId(topicId)
    .setStartTime(Date.now()) // Subscribe from now
    .subscribe(client, (message) => {
      handleIncomingMessage(message);
    });

  return query;
}

// Handle incoming messages
async function handleIncomingMessage(message: any) {
  const payload = JSON.parse(message.contents);

  // Check if message is for this user
  if (payload.to_hash === userMailHash || activeReplyHashes.includes(payload.to_hash)) {
    // Fetch and decrypt message
    const decryptedMessage = await fetchAndDecryptMessage(payload.cid);

    // Update UI
    updateMessageUI(decryptedMessage, payload.convo_id);
  }
}
```

## IPFS Integration

### File Upload
```typescript
// Upload text content to IPFS
async function uploadToIPFS(content: string): Promise<string> {
  const result = await ipfs.add(content);
  return result.cid.toString();
}

// Upload file to IPFS
async function uploadFileToIPFS(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const result = await ipfs.add(buffer);
  return result.cid.toString();
}
```

### Content Retrieval
```typescript
// Fetch content from IPFS
async function fetchFromIPFS(cid: string): Promise<string> {
  const stream = ipfs.cat(cid);
  let content = '';

  for await (const chunk of stream) {
    content += new TextDecoder().decode(chunk);
  }

  return content;
}

// Fetch and display image
async function loadImageFromIPFS(cid: string, imgElement: HTMLImageElement) {
  const url = `https://ipfs.io/ipfs/${cid}`;
  imgElement.src = url;
  imgElement.onload = () => imgElement.classList.add('loaded');
}
```

## Encryption Implementation

### Message Encryption Flow
```typescript
// Encrypt message for recipient
async function encryptMessage(message: MessageObject, recipientPublicKey: string): Promise<string> {
  const messageJson = JSON.stringify(message);
  const encrypted = encrypt(recipientPublicKey, Buffer.from(messageJson));
  return encrypted.toString('hex');
}

// Decrypt received message
async function decryptMessage(encryptedHex: string): Promise<MessageObject> {
  const encrypted = Buffer.from(encryptedHex, 'hex');
  const decrypted = decrypt(userPrivateKey, encrypted);
  return JSON.parse(decrypted.toString());
}
```

### Key Management
```typescript
// Generate user keypair (one-time, client-side)
function generateUserKeys(): { publicKey: string, privateKey: string } {
  const keypair = crypto.generateKeyPairSync('ec', {
    namedCurve: 'secp256k1',
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
  });

  return {
    publicKey: keypair.publicKey,
    privateKey: keypair.privateKey
  };
}

// Generate mail hash (permanent anonymous identifier)
function generateMailHash(publicKey: string): string {
  return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(publicKey));
}

// Generate reply hash (temporary conversation identifier)
function generateReplyHash(): string {
  return ethers.utils.keccak256(ethers.utils.randomBytes(32));
}
```

## Conversation Flow Implementation

### Initiating a Conversation
```typescript
async function sendWhisper(recipientAccountId: string, message: string, imageFile?: File) {
  // 1. Get recipient info
  const recipientProfile = await getUserProfile(recipientAccountId);
  const recipientPublicKey = recipientProfile.publicKey;
  const recipientMailHash = recipientProfile.mailHash;

  // 2. Generate conversation data
  const convoId = uuidv4();
  const replyHash = generateReplyHash();

  // 3. Handle image upload if present
  let imageCid = null;
  if (imageFile) {
    imageCid = await uploadFileToIPFS(imageFile);
  }

  // 4. Create message object
  const messageObject = {
    type: imageFile ? 'text/image' : 'text',
    text_content: message,
    image_cid: imageCid
  };

  // 5. Encrypt message
  const encryptedMessage = await encryptMessage(messageObject, recipientPublicKey);

  // 6. Upload encrypted message to IPFS
  const mainCid = await uploadToIPFS(encryptedMessage);

  // 7. Create HCS payload
  const hcsPayload = {
    to_hash: recipientMailHash,
    reply_hash: replyHash,
    from_key: userPublicKey,
    cid: mainCid,
    convo_id: convoId
  };

  // 8. Submit to HCS
  await submitHCSMessage(hcsPayload);

  // 9. Store reply hash locally
  addToActiveReplyHashes(replyHash);

  // 10. Update local daily count
  incrementDailyWhisperCount();
}
```

### Replying to a Conversation
```typescript
async function replyToConversation(convoId: string, message: string, imageFile?: File) {
  // 1. Get conversation context
  const conversation = getConversationById(convoId);
  const targetHash = conversation.replyToHash;
  const targetKey = conversation.replyToKey;

  // 2. Generate new reply hash
  const newReplyHash = generateReplyHash();

  // 3. Handle image upload
  let imageCid = null;
  if (imageFile) {
    imageCid = await uploadFileToIPFS(imageFile);
  }

  // 4. Create and encrypt message
  const messageObject = {
    type: imageFile ? 'text/image' : 'text',
    text_content: message,
    image_cid: imageCid
  };

  const encryptedMessage = await encryptMessage(messageObject, targetKey);
  const mainCid = await uploadToIPFS(encryptedMessage);

  // 5. Create HCS payload
  const hcsPayload = {
    to_hash: targetHash,
    reply_hash: newReplyHash,
    from_key: userPublicKey,
    cid: mainCid,
    convo_id: convoId
  };

  // 6. Submit to HCS
  await submitHCSMessage(hcsPayload);

  // 7. Update conversation context
  updateConversationReplyData(convoId, newReplyHash, targetKey);
}
```

## Error Handling and Resilience

### Network Error Handling
```typescript
async function withRetry<T>(operation: () => Promise<T>, maxRetries = 3): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
```

### Offline Handling
```typescript
// Queue operations for when connection is restored
const operationQueue: Array<() => Promise<void>> = [];

function queueOperation(operation: () => Promise<void>) {
  operationQueue.push(operation);
}

async function processQueue() {
  while (operationQueue.length > 0) {
    const operation = operationQueue.shift();
    if (operation) {
      try {
        await operation();
      } catch (error) {
        // Re-queue failed operations
        operationQueue.unshift(operation);
        break;
      }
    }
  }
}
```

## Performance Optimizations

### Caching Strategy
```typescript
// Cache user profiles locally
const profileCache = new Map<string, { profile: UserProfile, timestamp: number }>();

async function getCachedUserProfile(accountId: string): Promise<UserProfile> {
  const cached = profileCache.get(accountId);
  if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) { // 5 minutes
    return cached.profile;
  }

  const profile = await getUserProfile(accountId);
  profileCache.set(accountId, { profile, timestamp: Date.now() });
  return profile;
}
```

### Lazy Loading
```typescript
// Lazy load images in conversations
function lazyLoadImages() {
  const images = document.querySelectorAll('img[data-src]');

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        img.src = img.dataset.src!;
        img.classList.remove('lazy');
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach(img => imageObserver.observe(img));
}
```

## References
- [System Architecture and Design](Documentations/Software Specification Documentation (SSD)/2. System Architecture and Design.md)
- [Detailed Functional Workflows](Documentations/Software Specification Documentation (SSD)/4. Detailed Functional Workflows.md)
- [Smart Contract Specification](Documentations/Software Specification Documentation (SSD)/3. Data Models & Smart Contract Specification.md)