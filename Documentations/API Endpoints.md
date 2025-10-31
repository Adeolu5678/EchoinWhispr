# API Endpoints Documentation

## Overview

EchoinWhispr is a decentralized anonymous messaging platform built on the Hedera network. The system architecture combines smart contract-based user management with off-chain encrypted messaging through IPFS and Hedera Consensus Service (HCS). API endpoints are implemented through a hybrid approach:

- **Decentralized Endpoints**: Smart contract functions deployed on Hedera for user registration, subscription management, and profile queries
- **Web API Routes**: RESTful endpoints for client-server interactions like user search
- **External Services**: Integration with IPFS for content storage, Hedera services for consensus and identity, and encryption utilities for end-to-end security

All messaging is end-to-end encrypted using ECIES, with content stored on IPFS and message metadata submitted to HCS for consensus timestamping.

## Smart Contract Functions (Decentralized Endpoints)

The core smart contract `EchoinWhispr.sol` provides decentralized user management and subscription functionality. All functions are deployed on the Hedera network and interact directly with the blockchain.

### User Registration and Management

#### `registerUser(string _career, string[] _interests, string _mood, bytes _publicKey, bytes32 _mailHash)`
- **Description**: Registers a new user and creates their anonymous persona profile
- **Parameters**:
  - `_career`: User's career (e.g., "Software Engineer")
  - `_interests`: Array of user interests (e.g., ["DeFi", "NFTs"])
  - `_mood`: Current mood status (e.g., "Creative")
  - `_publicKey`: ECIES public key for encryption (bytes)
  - `_mailHash`: Anonymous hash for receiving messages (bytes32)
- **Returns**: None
- **Events**: Emits `UserRegistered(address indexed user)`

#### `editUserPersona(string _career, string[] _interests, string _mood)`
- **Description**: Updates an existing user's persona information
- **Parameters**:
  - `_career`: Updated career string
  - `_interests`: Updated interests array
  - `_mood`: Updated mood string
- **Returns**: None
- **Events**: Emits `PersonaUpdated(address indexed user)`
- **Requirements**: User must be registered

### Subscription Management

#### `subscribeWithHBAR() payable`
- **Description**: Subscribes user to premium features using HBAR payment
- **Parameters**: None (payment sent as msg.value)
- **Returns**: None
- **Events**: Emits `SubscriptionGranted(address indexed user, uint expiresOn)`
- **Requirements**: Payment must match `hbarSubscriptionPrice`, user must be registered

#### `subscribeWithHTS()`
- **Description**: Subscribes user to premium features using HTS token payment
- **Parameters**: None
- **Returns**: None
- **Events**: Emits `SubscriptionGranted(address indexed user, uint expiresOn)`
- **Requirements**: User must approve contract as spender first, user must be registered

### Query Functions

#### `checkSubscription(address _user) view returns (bool)`
- **Description**: Checks if a user's subscription is currently active
- **Parameters**:
  - `_user`: Hedera account address to check
- **Returns**: Boolean indicating subscription status

#### `getPersona(address _user) view returns (UserProfile)`
- **Description**: Retrieves a user's complete anonymous persona
- **Parameters**:
  - `_user`: Hedera account address
- **Returns**: UserProfile struct containing career, interests, mood, publicKey, mailHash, and subscription info

#### `getPublicKey(address _user) view returns (bytes)`
- **Description**: Retrieves user's ECIES public key for encryption
- **Parameters**:
  - `_user`: Hedera account address
- **Returns**: Public key as bytes
- **Requirements**: User must exist

#### `getMailHash(address _user) view returns (bytes32)`
- **Description**: Retrieves user's anonymous mail hash for messaging
- **Parameters**:
  - `_user`: Hedera account address
- **Returns**: Mail hash as bytes32
- **Requirements**: User must exist

#### `findMoodMatch(string _mood) view returns (address)`
- **Description**: Finds a random user with matching mood for anonymous matching
- **Parameters**:
  - `_mood`: Mood string to match
- **Returns**: Hedera account address of matched user, or address(0) if no match

#### `getUserCount() view returns (uint)`
- **Description**: Returns total number of registered users
- **Parameters**: None
- **Returns**: Total user count

#### `getUsers(uint _page, uint _pageSize) view returns (address[])`
- **Description**: Retrieves paginated list of user addresses for client-side search
- **Parameters**:
  - `_page`: Page number (0-based)
  - `_pageSize`: Number of addresses per page
- **Returns**: Array of Hedera account addresses

### Admin Functions

#### `setHbarPrice(uint _newPrice)`
- **Description**: Updates HBAR subscription price
- **Parameters**:
  - `_newPrice`: New price in tinybars
- **Requirements**: Only callable by owner

#### `setHtsPrice(uint _newPrice)`
- **Description**: Updates HTS token subscription price
- **Parameters**:
  - `_newPrice`: New price in token units
- **Requirements**: Only callable by owner

#### `setHtsTokenAddress(address _newToken)`
- **Description**: Updates accepted HTS token address
- **Parameters**:
  - `_newToken`: New HTS token contract address
- **Requirements**: Only callable by owner

#### `withdrawHBAR()`
- **Description**: Withdraws accumulated HBAR payments to owner
- **Parameters**: None
- **Requirements**: Only callable by owner

#### `withdrawHTS()`
- **Description**: Withdraws accumulated HTS token payments to owner
- **Parameters**: None
- **Requirements**: Only callable by owner

## Web API Routes

The web application provides RESTful API endpoints for client-server interactions, primarily using Convex as the backend database.

### Search API

#### `POST /api/search`
- **Description**: Searches for users by username or email with pagination
- **Authentication**: Required (Clerk JWT)
- **Request Body**:
  ```json
  {
    "query": "search term",
    "limit": 20,
    "offset": 0
  }
  ```
- **Parameters**:
  - `query`: Search string (2-100 characters)
  - `limit`: Results per page (1-100, default: 20)
  - `offset`: Pagination offset (default: 0)
- **Response**: Array of matching user objects
- **Error Codes**:
  - 400: Invalid query, limit, or offset
  - 401: Unauthorized
  - 404: User data not found
  - 500: Server error

## External Services

### IPFS Integration

The system integrates with IPFS for decentralized content storage of encrypted messages and images.

#### Content Upload
- **uploadImage(file: File)**: Uploads image files to IPFS, returns CID
- **uploadEncryptedMessage(data: Uint8Array)**: Uploads encrypted message data, returns CID
- **uploadMessageWithImage(imageFile, encryptedData)**: Uploads both image and message, returns both CIDs

#### Content Retrieval
- **downloadContent(cid: string)**: Downloads content by CID as Uint8Array
- **downloadContentAsString(cid: string)**: Downloads and decodes as string
- **downloadImageAsBlobUrl(cid: string)**: Downloads image and creates blob URL

#### Content Management
- **pinContent(cid: string)**: Pins content to ensure persistence

### Hedera Services Integration

#### Consensus Service (HCS)
- **createWhisperTopic()**: Creates dedicated HCS topic for anonymous messaging
- **submitWhisperMessage(payload)**: Submits encrypted message metadata to HCS
- **subscribeToWhispers(onMessage, filterHashes)**: Subscribes to real-time message notifications

#### Smart Contract Service
- **getUserProfile(userAddress)**: Queries user profile from smart contract
- **getUserMailHash(userAddress)**: Retrieves user's mail hash
- **getUserPublicKey(userAddress)**: Gets user's public encryption key
- **subscribeWithHBAR(amount)**: Handles HBAR subscription payments
- **subscribeWithHTS(amount)**: Handles HTS token subscription payments

#### Identity Services
- **createDID(publicKey)**: Creates Hedera-based DID
- **createAttestation(issuerId, subjectId, claims)**: Creates verifiable attestations
- **verifyDID(didId)**: Verifies DID validity
- **verifyAttestation(attestationId)**: Verifies attestation validity

#### Token Services
- **createToken(name, symbol, supply, decimals)**: Creates new HTS tokens
- **transferTokens(tokenId, recipientId, amount)**: Transfers HTS tokens
- **transferHbar(recipientId, amount)**: Transfers HBAR

#### Wallet Integration
- **connectWallet()**: Connects Hedera-compatible wallet
- **signMessage(message)**: Signs messages using connected wallet

### Encryption Services

Client-side ECIES encryption utilities for end-to-end message security.

#### Message Encryption
- **encryptMessage(message, recipientPublicKey)**: Encrypts text message
- **encryptMessageObject(messageObject, recipientPublicKey)**: Encrypts JSON message object
- **decryptMessage(encryptedData)**: Decrypts message using private key
- **decryptMessageObject(encryptedData)**: Decrypts and parses JSON object

#### Key Management
- **getPublicKeyBytes()**: Returns public key as bytes for smart contract storage
- **getPublicKeyHex()**: Returns public key as hex string
- **generateMailHash(userAddress, salt)**: Generates anonymous mail hash