# EchoinWhispr Client-Side Utilities

This package provides client-side utilities for end-to-end encryption and decentralized storage operations used in the EchoinWhispr dApp.

## Installation

```bash
npm install
```

## Building

```bash
npm run build
```

## Usage

### Encryption Service

```typescript
import { [`EncryptionService`](Back-End/utilities/src/encryption.ts:8) } from 'echoinwhispr-utilities';

// Create encryption service instance
const encryption = new EncryptionService();

// Get public key for smart contract storage
const publicKeyBytes = encryption.getPublicKeyBytes();

// Encrypt a message for a recipient
const encrypted = encryption.encryptMessage(
  "Hello, world!",
  "0x04..." // recipient's public key hex
);

// Decrypt a received message
const decrypted = encryption.decryptMessage(encrypted);
```

### IPFS Service

```typescript
import { [`createIPFSService`](Back-End/utilities/src/ipfs.ts:151) } from 'echoinwhispr-utilities';

// Create IPFS service instance
const ipfs = createIPFSService(); // Uses Infura by default

// Upload an image
const imageCid = await ipfs.uploadImage(imageFile);

// Upload encrypted message
const messageCid = await ipfs.uploadEncryptedMessage(encryptedData);

// Download content
const content = await ipfs.downloadContent(messageCid);

// Download image as blob URL for display
const imageUrl = await ipfs.downloadImageAsBlobUrl(imageCid);
```

### Complete Message Flow

```typescript
import { [`EncryptionService`](Back-End/utilities/src/encryption.ts:8), [`createIPFSService`](Back-End/utilities/src/ipfs.ts:151), [`MessageObject`](Back-End/utilities/src/encryption.ts:94) } from 'echoinwhispr-utilities';

// Setup services
const encryption = new EncryptionService();
const ipfs = createIPFSService();

// Create message object
const message: MessageObject = {
  type: "text/image",
  text_content: "Check out this design!",
  image_cid: undefined // Will be set after image upload
};

// Upload image first (if any)
let image_cid: string | undefined;
if (imageFile) {
  image_cid = await ipfs.uploadImage(imageFile);
  message.image_cid = image_cid;
}

// Encrypt the message
const encrypted = encryption.encryptMessageObject(message, recipientPublicKey);

// Upload encrypted message
const { main_cid } = await ipfs.uploadMessageWithImage(null, encrypted);

// Now you can submit main_cid to HCS
```

## API Reference

### [`EncryptionService`](Back-End/utilities/src/encryption.ts:8)

- [`getPublicKeyBytes()`](Back-End/utilities/src/encryption.ts:21): Returns public key as Uint8Array for contract storage
- [`getPublicKeyHex()`](Back-End/utilities/src/encryption.ts:28): Returns public key as hex string
- [`encryptMessage(message, recipientKey)`](Back-End/utilities/src/encryption.ts:38): Encrypt string message
- [`decryptMessage(encrypted)`](Back-End/utilities/src/encryption.ts:49): Decrypt message
- [`encryptMessageObject(obj, recipientKey)`](Back-End/utilities/src/encryption.ts:60): Encrypt JSON object
- [`decryptMessageObject(encrypted)`](Back-End/utilities/src/encryption.ts:70): Decrypt and parse JSON object
- `static [`generateMailHash(address, salt)`](Back-End/utilities/src/encryption.ts:81)`: Generate anonymous mail hash

### [`IPFSService`](Back-End/utilities/src/ipfs.ts:8)

- [`uploadImage(file)`](Back-End/utilities/src/ipfs.ts:20): Upload image file to IPFS
- [`uploadEncryptedMessage(data)`](Back-End/utilities/src/ipfs.ts:40): Upload encrypted data to IPFS
- [`downloadContent(cid)`](Back-End/utilities/src/ipfs.ts:60): Download content as Uint8Array
- [`downloadContentAsString(cid)`](Back-End/utilities/src/ipfs.ts:88): Download content as string
- [`downloadImageAsBlobUrl(cid)`](Back-End/utilities/src/ipfs.ts:98): Download image and return blob URL
- [`pinContent(cid)`](Back-End/utilities/src/ipfs.ts:108): Pin content for persistence
- [`uploadMessageWithImage(imageFile, encryptedMessage)`](Back-End/utilities/src/ipfs.ts:124): Upload both image and message

## Dependencies

- `eciesjs`: Elliptic Curve Integrated Encryption Scheme
- `ipfs-http-client`: IPFS HTTP client for uploads/downloads
- `uuid`: For generating conversation IDs

## Security Notes

- Private keys are generated client-side and never leave the user's device
- All encryption/decryption happens locally ensuring privacy
- IPFS uploads are content-addressed and immutable for censorship resistance
- Messages are end-to-end encrypted before IPFS upload
- No central servers or data collection points