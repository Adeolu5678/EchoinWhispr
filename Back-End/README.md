# EchoinWhispr Back-End

This directory contains the complete decentralized back-end implementation for the EchoinWhispr dApp, built on Hedera services with IPFS storage and end-to-end encryption.

## Architecture Overview

EchoinWhispr implements a fully decentralized, serverless architecture with five key layers:

1. **Identity & Auth**: Hedera Accounts via WalletConnect for decentralized identity
2. **State & Logic**: Hedera Smart Contract Service (Solidity EVM) for trust-by-design governance
3. **Data Storage**: IPFS/Filecoin for decentralized content storage
4. **Consensus & Routing**: Hedera Consensus Service (HCS) for immutable message routing
5. **Data Reading**: Hedera Mirror Nodes for transparent, censorship-resistant queries

## Directory Structure

```
Back-End/
├── smart-contracts/     # Solidity contracts
│   └── [EchoinWhispr.sol](Back-End/smart-contracts/EchoinWhispr.sol) # Main contract for personas, subscriptions, matching
├── scripts/            # Deployment and interaction scripts
│   ├── [deploy.ts](Back-End/scripts/deploy.ts)       # Hardhat deployment script
│   ├── [hardhat.config.ts](Back-End/scripts/hardhat.config.ts)
│   └── [package.json](Back-End/scripts/package.json)
├── utilities/          # Client-side utilities
│   ├── src/
│   │   ├── [encryption.ts](Back-End/utilities/src/encryption.ts) # ECIES encryption service
│   │   ├── [ipfs.ts](Back-End/utilities/src/ipfs.ts)      # IPFS upload/download service
│   │   └── [index.ts](Back-End/utilities/src/index.ts)     # Main exports
│   └── [package.json](Back-End/utilities/package.json)
└── README.md
```

## MVP Features Implemented

### ✅ Decentralized Authentication
- Hedera WalletConnect integration for trust-by-design identity
- Account ID as permanent, censorship-resistant identifier

### ✅ Persona Management
- Anonymous persona profiles with career, interests, and mood
- On-chain storage ensuring immutability and transparency
- Profile editing while preserving permanent cryptographic identifiers

### ✅ Subscription Service
- HBAR and HTS token payments for decentralized monetization
- 30-day subscription periods with automatic renewal options

### ✅ Discovery & Matching
- Merit-based search by career and interests
- Pseudorandom mood-based matching for serendipitous connections

### ✅ Anonymous Conversations
- End-to-end ECIES encryption ensuring privacy
- Rich media support (images, files) via IPFS
- HCS-based message routing for immutable timestamps
- Decentralized content storage with no central points of failure

## Smart Contract Details

**Contract Address**: Deployed on Hedera testnet/mainnet
**Key Functions**:
- [`registerUser()`](Back-End/smart-contracts/EchoinWhispr.sol:105): Create anonymous persona with encryption keys
- [`editUserPersona()`](Back-End/smart-contracts/EchoinWhispr.sol:132): Update profile while preserving anonymity
- [`subscribeWithHBAR()`](Back-End/smart-contracts/EchoinWhispr.sol:165)/[`subscribeWithHTS()`](Back-End/smart-contracts/EchoinWhispr.sol:174): Premium subscriptions via decentralized tokens
- [`findMoodMatch()`](Back-End/smart-contracts/EchoinWhispr.sol:221): Random mood-based matching for merit-based networking
- [`getUsers()`](Back-End/smart-contracts/EchoinWhispr.sol:255): Paginated user search by career and interests

## Client-Side Utilities

### Encryption Service
- ECIES key pair generation
- Message encryption/decryption
- Mail hash generation for anonymous messaging

### IPFS Service
- Image upload and storage
- Encrypted message upload
- Content download and retrieval
- Automatic content pinning

## Deployment

### Prerequisites
- Node.js 18+
- Hedera testnet account with HBAR
- IPFS gateway access (Infura/Pinata)

### Deploy Contract
```bash
cd scripts
npm install
cp .env.example .env  # Configure your keys
npm run deploy
```

### Build Utilities
```bash
cd utilities
npm install
npm run build
```

## Hedera Best Practices

### Smart Contract
- ✅ Gas optimization with efficient data structures for cost-effective operations
- ✅ Access control with modifiers ensuring trust-by-design governance
- ✅ Event logging for complete transparency and auditability
- ✅ Input validation and error handling for robust decentralized operations
- ✅ Upgradeable design patterns (owner controls) for future enhancements

### Client Integration
- ✅ Client-side encryption ensuring private keys never leave user devices
- ✅ Minimal on-chain data storage preserving anonymity
- ✅ Content-addressed storage (IPFS) for immutable, decentralized content
- ✅ Consensus-based messaging (HCS) for censorship-resistant communication

### Security & Privacy
- ✅ End-to-end encryption protecting all user communications
- ✅ Anonymous by design with persona-based networking
- ✅ Immutable audit trail via HCS for transparent dispute resolution
- ✅ No central points of failure or data collection

## Usage in Frontend

```typescript
import { EncryptionService, createIPFSService } from './Back-End/utilities/src';

// Initialize services
const encryption = new EncryptionService();
const ipfs = createIPFSService();

// Register user
const publicKey = encryption.getPublicKeyBytes();
const mailHash = await EncryptionService.generateMailHash(accountId, salt);

// Send encrypted message
const message = { type: 'text', text_content: 'Hello!' };
const encrypted = encryption.encryptMessageObject(message, recipientKey);
const { main_cid } = await ipfs.uploadMessageWithImage(null, encrypted);
```

// Example usage of EncryptionService class
const encryption = new EncryptionService();
const publicKeyBytes = encryption.getPublicKeyBytes();
const publicKeyHex = encryption.getPublicKeyHex();

// Encrypt a message
const encryptedMessage = encryption.encryptMessage('Hello, World!', recipientPublicKeyHex);

// Decrypt a message
const decryptedMessage = encryption.decryptMessage(encryptedMessage);

// Encrypt a message object
const messageObject = { type: 'text', text_content: 'Hello!' };
const encryptedObject = encryption.encryptMessageObject(messageObject, recipientPublicKeyHex);

// Decrypt a message object
const decryptedObject = encryption.decryptMessageObject(encryptedObject);

// Generate mail hash
const mailHash = await EncryptionService.generateMailHash(userAddress, salt);

// Example usage of IPFSService class
const ipfs = createIPFSService();

// Upload an image
const imageCid = await ipfs.uploadImage(imageFile);

// Upload encrypted message
const messageCid = await ipfs.uploadEncryptedMessage(encryptedData);

// Download content
const content = await ipfs.downloadContent(cid);

// Download content as string
const contentString = await ipfs.downloadContentAsString(cid);

// Download image as blob URL
const blobUrl = await ipfs.downloadImageAsBlobUrl(cid);

// Pin content
await ipfs.pinContent(cid);

// Upload message with image
const result = await ipfs.uploadMessageWithImage(imageFile, encryptedMessage);

## Testing

```bash
cd scripts
npm run test  # Contract tests (when implemented)

cd utilities
npm run test  # Utility tests (when implemented)
```

## Environment Variables

Create `.env` files in respective directories:

**scripts/.env**:
```
HEDERA_RPC_URL=https://testnet.hashio.io/api
PRIVATE_KEY=your_deployer_private_key
HTS_TOKEN_ADDRESS=0x...
```

**utilities/.env** (if needed):
```
IPFS_GATEWAY=https://ipfs.infura.io:5001
```

## Contributing

1. Follow Solidity style guide
2. Add comprehensive comments
3. Test all functions thoroughly
4. Update documentation

## License

MIT License - see contract header for details.