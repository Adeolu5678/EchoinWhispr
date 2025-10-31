# Backend Integration for Mobile

This document outlines the React Native implementation of EchoinWhispr's decentralized backend architecture, focusing on Hedera network integration, IPFS storage, and client-side encryption for mobile devices.

## Architecture Overview

The mobile app implements a fully serverless architecture using:

- **Hedera Smart Contract Service (HCS)**: For state management and consensus
- **Hedera Consensus Service**: For message routing and timestamping
- **IPFS/Filecoin**: For decentralized storage
- **Client-side ECIES encryption**: For end-to-end security

## Core Dependencies

### React Native Libraries
```json
{
  "@hashgraph/sdk": "^2.24.0",
  "ethers": "^5.7.2",
  "eciesjs": "^0.3.15",
  "ipfs-http-client": "^60.0.0",
  "react-native-wallet-connect": "^1.8.0",
  "react-native-encrypted-storage": "^4.0.3",
  "react-native-uuid": "^2.0.1"
}
```

### Platform-Specific Setup
- **iOS**: Add Hedera SDK via CocoaPods
- **Android**: Add Hedera SDK dependencies to build.gradle

## Wallet Integration

### WalletConnect Setup
```jsx
import WalletConnect from 'react-native-wallet-connect';
import { HederaSDK } from '@hashgraph/sdk';

const connectWallet = async () => {
  const session = await WalletConnect.init({
    bridge: 'https://bridge.walletconnect.org',
    clientMeta: {
      name: 'EchoinWhispr',
      description: 'Decentralized Anonymous Social Network',
      url: 'https://echoinwhispr.com',
      icons: ['https://echoinwhispr.com/icon.png']
    }
  });
  
  // Connect to Hedera-compatible wallet (HashPack)
  const connection = await session.connect({
    chainId: 'hedera-mainnet', // or testnet
    accounts: []
  });
  
  return connection;
};
```

### Account Management
```jsx
const initializeUser = async (accountId) => {
  // Check if user profile exists
  const isInitialized = await checkUserRegistration(accountId);
  
  if (!isInitialized) {
    // Generate client-side keys
    const { publicKey, privateKey } = await generateECIESKeyPair();
    const mailHash = await generateMailHash(publicKey);
    
    // Store private key securely
    await EncryptedStorage.setItem('privateKey', privateKey);
    
    return { publicKey, mailHash };
  }
  
  return null;
};
```

## Smart Contract Integration

### Contract Interface
```jsx
import { ethers } from 'ethers';
import EchoinWhisprABI from './EchoinWhisprABI.json';

const CONTRACT_ADDRESS = '0x...'; // Deployed contract address
const HEDERA_JSON_RPC_URL = 'https://testnet.hashio.io/api';

class ContractService {
  constructor() {
    this.provider = new ethers.providers.JsonRpcProvider(HEDERA_JSON_RPC_URL);
    this.contract = new ethers.Contract(CONTRACT_ADDRESS, EchoinWhisprABI, this.provider);
  }
  
  async getUserProfile(accountId) {
    try {
      const profile = await this.contract.getUserProfile(accountId);
      return {
        career: profile.career,
        interests: profile.interests,
        currentMood: profile.currentMood,
        publicKey: profile.publicKey,
        mailHash: profile.mailHash,
        subscriptionEnds: profile.subscriptionEnds
      };
    } catch (error) {
      console.error('Failed to get user profile:', error);
      throw error;
    }
  }
  
  async registerUser(accountId, profileData, signer) {
    const contractWithSigner = this.contract.connect(signer);
    
    const tx = await contractWithSigner.registerUser(
      accountId,
      profileData.career,
      profileData.interests,
      profileData.currentMood,
      profileData.publicKey,
      profileData.mailHash
    );
    
    await tx.wait();
    return tx;
  }
  
  async checkSubscription(accountId) {
    const subscriptionEnds = await this.contract.getSubscriptionEnds(accountId);
    const now = Math.floor(Date.now() / 1000);
    return subscriptionEnds > now;
  }
}
```

## HCS Message Handling

### HCS Subscription Setup
```jsx
import { Client, TopicMessageQuery } from '@hashgraph/sdk';

class HCSService {
  constructor() {
    this.client = Client.forTestnet(); // or mainnet
    this.topicId = '0.0.123456'; // Conversation topic ID
  }
  
  async subscribeToMessages(mailHash, replyHashes, onMessage) {
    new TopicMessageQuery()
      .setTopicId(this.topicId)
      .subscribe(this.client, (message) => {
        const payload = JSON.parse(Buffer.from(message.contents).toString());
        
        // Check if message is for this user
        if (payload.to_hash === mailHash || replyHashes.includes(payload.to_hash)) {
          onMessage(payload);
        }
      });
  }
  
  async sendMessage(payload, signer) {
    const message = Buffer.from(JSON.stringify(payload));
    
    const transaction = new TopicMessageSubmitTransaction()
      .setTopicId(this.topicId)
      .setMessage(message)
      .setTransactionMemo('EchoinWhispr Conversation Message');
    
    const txResponse = await transaction.execute(this.client);
    const receipt = await txResponse.getReceipt(this.client);
    
    return receipt;
  }
}
```

## IPFS Integration

### File Upload Service
```jsx
import { create } from 'ipfs-http-client';

class IPFSService {
  constructor() {
    this.client = create({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https',
      headers: {
        authorization: `Bearer ${process.env.INFURA_PROJECT_ID}:${process.env.INFURA_PROJECT_SECRET}`
      }
    });
  }
  
  async uploadFile(file) {
    try {
      const result = await this.client.add(file);
      return result.cid.toString();
    } catch (error) {
      console.error('IPFS upload failed:', error);
      throw error;
    }
  }
  
  async downloadFile(cid) {
    try {
      const chunks = [];
      for await (const chunk of this.client.cat(cid)) {
        chunks.push(chunk);
      }
      return Buffer.concat(chunks);
    } catch (error) {
      console.error('IPFS download failed:', error);
      throw error;
    }
  }
}
```

## Encryption Service

### ECIES Implementation
```jsx
import ecies from 'eciesjs';

class EncryptionService {
  static async generateKeyPair() {
    const privateKey = ecies.generatePrivateKey();
    const publicKey = ecies.getPublicKey(privateKey);
    return { privateKey, publicKey };
  }
  
  static async encryptMessage(publicKey, message) {
    const encrypted = ecies.encrypt(publicKey, Buffer.from(message));
    return encrypted.toString('hex');
  }
  
  static async decryptMessage(privateKey, encryptedMessage) {
    const decrypted = ecies.decrypt(privateKey, Buffer.from(encryptedMessage, 'hex'));
    return decrypted.toString();
  }
  
  static async generateMailHash(publicKey) {
    const hash = await crypto.subtle.digest('SHA-256', publicKey);
    return Buffer.from(hash).toString('hex').substring(0, 64);
  }
}
```

## Conversation Flow Implementation

### Message Sending Workflow
```jsx
class ConversationService {
  constructor() {
    this.contractService = new ContractService();
    this.hcsService = new HCSService();
    this.ipfsService = new IPFSService();
    this.encryptionService = EncryptionService;
  }
  
  async sendWhisper(recipientAccountId, message, imageUri = null) {
    // 1. Get recipient's public key and mail hash
    const recipientProfile = await this.contractService.getUserProfile(recipientAccountId);
    
    // 2. Generate conversation ID and reply hash
    const convoId = uuidv4();
    const replyHash = await this.generateReplyHash();
    
    // 3. Handle image upload if present
    let imageCid = null;
    if (imageUri) {
      const imageFile = await this.processImage(imageUri);
      imageCid = await this.ipfsService.uploadFile(imageFile);
    }
    
    // 4. Create and encrypt message object
    const messageObject = {
      type: imageUri ? 'text/image' : 'text',
      text_content: message,
      image_cid: imageCid
    };
    
    const encryptedMessage = await this.encryptionService.encryptMessage(
      recipientProfile.publicKey,
      JSON.stringify(messageObject)
    );
    
    // 5. Upload encrypted message to IPFS
    const mainCid = await this.ipfsService.uploadFile(Buffer.from(encryptedMessage));
    
    // 6. Create HCS payload
    const hcsPayload = {
      to_hash: recipientProfile.mailHash,
      reply_hash: replyHash,
      from_key: await this.getMyPublicKey(),
      cid: mainCid,
      convo_id: convoId
    };
    
    // 7. Submit to HCS
    await this.hcsService.sendMessage(hcsPayload);
    
    // 8. Store reply hash locally
    await this.storeReplyHash(replyHash);
    
    return convoId;
  }
  
  async receiveMessage(hcsPayload) {
    // 1. Download encrypted message from IPFS
    const encryptedMessage = await this.ipfsService.downloadFile(hcsPayload.cid);
    
    // 2. Decrypt with private key
    const privateKey = await EncryptedStorage.getItem('privateKey');
    const decryptedMessage = await this.encryptionService.decryptMessage(
      privateKey,
      encryptedMessage.toString()
    );
    
    const messageObject = JSON.parse(decryptedMessage);
    
    // 3. Handle image if present
    if (messageObject.image_cid) {
      const imageData = await this.ipfsService.downloadFile(messageObject.image_cid);
      // Process and display image
    }
    
    // 4. Store conversation data
    await this.storeConversationData(hcsPayload.convo_id, {
      replyHash: hcsPayload.reply_hash,
      targetKey: hcsPayload.from_key,
      message: messageObject
    });
    
    return messageObject;
  }
}
```

## Subscription Management

### Payment Integration
```jsx
class SubscriptionService {
  async subscribeWithHBAR(accountId, durationDays = 30) {
    const amount = this.calculateHBARAmount(durationDays);
    
    const transaction = new TransferTransaction()
      .addHbarTransfer(accountId, new Hbar(-amount))
      .addHbarTransfer(SUBSCRIPTION_WALLET, new Hbar(amount));
    
    const receipt = await transaction.execute(client);
    await this.contractService.activateSubscription(accountId, durationDays);
    
    return receipt;
  }
  
  async subscribeWithHTS(accountId, tokenId, amount) {
    const transaction = new TokenTransferTransaction()
      .setTokenId(tokenId)
      .addTokenTransfer(accountId, -amount)
      .addTokenTransfer(SUBSCRIPTION_WALLET, amount);
    
    const receipt = await transaction.execute(client);
    await this.contractService.activateSubscription(accountId, 30); // 30 days
    
    return receipt;
  }
}
```

## Error Handling and Resilience

### Network Error Handling
```jsx
const withRetry = async (operation, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
};
```

### Offline Support
- Implement local storage for pending messages
- Queue operations for when network is available
- Show appropriate offline UI states

## Performance Optimization

### Caching Strategy
- Cache user profiles locally
- Store conversation history in encrypted local storage
- Implement IPFS content caching

### Background Processing
- Use React Native's BackgroundTask API for message syncing
- Implement push notifications for new messages
- Handle app state changes (foreground/background)

This backend integration ensures the React Native app fully implements EchoinWhispr's decentralized architecture while providing a smooth mobile user experience.