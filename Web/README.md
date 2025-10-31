# EchoinWhispr: Web Application

This directory contains the Next.js web application for EchoinWhispr, a fully decentralized social dApp on Hedera that enables anonymous persona-based connections with end-to-end encryption.

## Overview

The EchoinWhispr web application provides a Web2-friendly user experience for Web3 decentralized social networking. Users can create anonymous personas, connect based on shared interests and career paths, and engage in encrypted conversations - all without revealing their real identities or relying on centralized servers.

## Key Features

- **Hedera Wallet Authentication**: Secure decentralized identity management
- **Persona Management**: Create and manage anonymous profiles with career, interests, and mood
- **Subscription Service**: Premium features via HTS token payments
- **Search & Matching**: Find connections by career, interests, and mood
- **Anonymous Conversations**: End-to-end encrypted messaging with rich media support
- **Decentralized Architecture**: No central servers - all data on Hedera/IPFS

## Technology Stack

- **Framework**: Next.js with React
- **Styling**: Tailwind CSS with Shadcn UI components
- **Blockchain Integration**: Hedera SDK for wallet connection and smart contracts
- **Encryption**: Client-side ECIES encryption
- **Storage**: IPFS for content, HCS for messaging
- **Authentication**: Hedera WalletConnect
- **Hosting**: Decentralized hosting solutions

## Core Functionality (MVP)

- **Wallet Authentication**: Connect Hedera wallet for decentralized identity
- **Persona Creation**: Set up anonymous profile with career, interests, and mood
- **Profile Management**: Edit persona details (except permanent identifiers)
- **Subscription Management**: Handle HTS token-based premium subscriptions
- **User Discovery**: Search and browse other users by career/interests
- **Mood Matching**: Random connections based on current mood
- **Anonymous Messaging**: Send and receive encrypted messages with rich media
- **Conversation Management**: View and manage ongoing anonymous conversations

## Architecture

The web application follows a client-side heavy architecture:

1. **Client-Side Encryption**: All sensitive data encrypted before network transmission
2. **Direct Blockchain Interaction**: Smart contract calls for user registration, subscriptions, and matching
3. **IPFS Integration**: Content storage and retrieval for messages and media
4. **HCS Messaging**: Consensus-based message routing and timestamping
5. **No Backend Servers**: Fully decentralized, serverless architecture

## Development Workflow

- **AI-Assisted Development**: Code generation with human oversight
- **Feature Flags**: Modular feature enablement for iterative development
- **Testing**: Comprehensive testing across authentication, encryption, and blockchain interactions
- **Security**: Client-side key management, end-to-end encryption validation

## Getting Started

1. Install dependencies: `pnpm install`
2. Set up environment variables for Hedera and IPFS
3. Run development server: `pnpm dev`
4. Connect Hedera wallet for testing

## Project Structure

```
Web/
├── src/
│   ├── app/                 # Next.js app router pages
│   ├── components/          # Reusable UI components
│   ├── features/            # Feature-specific modules
│   ├── lib/                 # Utilities and integrations
│   └── hooks/               # Custom React hooks
├── public/                  # Static assets
└── tailwind.config.js       # Tailwind configuration
```

## Security Considerations

- Private keys never leave user devices
- All encryption/decryption happens client-side
- Content addressed storage prevents tampering
- Immutable audit trails via HCS consensus
- No central points of failure or data collection

## Future Enhancements

- Advanced matching algorithms
- Group conversations
- Voice/video messaging
- Cross-platform synchronization
- Enhanced privacy controls
