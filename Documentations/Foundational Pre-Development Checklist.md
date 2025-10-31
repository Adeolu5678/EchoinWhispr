# Foundational Pre-Development Checklist

Version: 1.0
Date: August 28, 2025
Author: Specs Engineer AI
This document outlines the critical, non-platform-specific foundational steps that must be completed before active development begins for the EchoinWhispr decentralized dApp. These steps are designed to streamline collaboration, prevent technical debt, and ensure a robust and scalable architecture leveraging Hedera's decentralized network, IPFS storage, ECIES encryption, and anonymous messaging features.

1. Unified Project Management & Communication Hub
Establish a Single Source of Truth for Tasks: Set up a project management board (e.g., GitHub Projects, Jira, Trello) to track all features, bugs, and tasks for the Web frontend, Back-End smart contracts and utilities, and decentralized infrastructure.
Create a Central Communication Channel: Establish a dedicated channel (e.g., Slack, Discord) for all project-related communication. This prevents information silos and ensures all stakeholders are aligned on decentralized dApp development.

2. Monorepo & Scripting Strategy
Leverage the Monorepo: The current directory structure is a monorepo. Formally adopt this strategy. This means the single [`package.json`](package.json) at the project root manages all dependencies, and pnpm will be the package manager of choice.
Standardize Commands: Define a set of unified scripts in the root [`package.json`](package.json) to manage all sub-projects. For example:
pnpm dev:web: To run the Next.js web app.
pnpm deploy:contracts: To deploy smart contracts to Hedera network using Hardhat.
pnpm build:utilities: To build the Back-End utilities (encryption, IPFS, etc.).
pnpm install: To install all dependencies for all sub-projects simultaneously.
Why?: This approach simplifies dependency management, ensures consistency, and makes it easier for developers to switch between components without complex environment setups.

3. Backend & API Management (Hedera Deployment & Smart Contracts)
Finalize Hedera Network Setup: Before coding, ensure Hedera testnet/mainnet accounts are configured, and Hedera SDK is integrated for consensus services, identity services, smart contracts, and token services.
Deploy Smart Contracts: Use Hardhat to deploy the [`EchoinWhispr.sol`](Back-End/smart-contracts/EchoinWhispr.sol) smart contract to Hedera. This provides the core logic for anonymous messaging and decentralized identity.
Establish HCS Topic Setup: Create and configure Hedera Consensus Service (HCS) topics for timestamped messaging and consensus timestamping to ensure immutable, anonymous message ordering.
Set up IPFS Configuration: Configure IPFS nodes for decentralized file storage, integrating with the utilities in [`ipfs.ts`](Back-End/utilities/src/ipfs.ts) for storing encrypted message attachments.
Client-Side Encryption Setup: Implement ECIES encryption using the utilities in [`encryption.ts`](Back-End/utilities/src/encryption.ts) for end-to-end encryption of messages and user data.

4. Design System & Brand Assets
Centralize Design: Leverage the existing design-system folder as the single "source of truth" for the entire EchoinWhispr brand. This contains:
Color Palette: All primary, secondary, and accent colors defined in [`colors.ts`](design-system/tokens/colors.ts).
Typography: All fonts, sizes, and weights (e.g., defined in design-system/tokens/typography.ts).
Spacing & Layout Grids: Standardized padding and margin values in design-system/tokens/spacing.ts.
Component Library: Definitions for all common components (buttons, inputs, cards) in [`components/`](design-system/components/).
Unified Asset Repository: Create a centralized folder for all brand assets (logos, icons, etc.). This ensures all developers pull from the same, up-to-date source.

5. Continuous Integration / Continuous Deployment (CI/CD)
Automate Everything: Set up a CI/CD pipeline (e.g., using GitHub Actions, CircleCI, or GitLab CI) for the Web app, Back-End scripts, and smart contract deployments.
Minimum Pipeline Stages: Your CI pipeline should, at a minimum, automatically:
Run the tests for the project.
Check for linting and formatting issues.
Build the application for its target platform(s).
Deployment: Set up automatic deployment to Hedera testnet for smart contracts and staging environment for the Web app on every main branch push. This ensures a consistent, shippable version of the dApp is always available for testing and review.

6. Documentation & Knowledge Base
Create a Project Wiki: Establish a central repository for all documentation that doesn't belong in the code itself. This could be a GitHub Wiki or a similar platform.
What to Document:
Architecture Diagrams: High-level diagrams of the Hedera-based decentralized architecture, including HCS topics, IPFS integration, and encryption flows.
Setup Guides: Step-by-step instructions for new developers to get the project running locally, including Hedera account setup and WalletConnect configuration.
Decision Logs: A record of key technical and design decisions and the rationale behind them, such as choosing Hedera for consensus and IPFS for storage.
Troubleshooting: Common issues and their solutions for decentralized infrastructure.

7. Comprehensive Testing Strategy
Three Layers of Testing: Before writing any major feature, define a clear testing strategy that includes:
Unit Tests: To test individual functions and methods (e.g., encryption utilities, IPFS upload logic, Hedera SDK interactions).
Component/Widget Tests: To test UI components in isolation, using the design-system components.
End-to-End (E2E) Tests: To test the full user flow from a user's perspective (e.g., connecting wallet, sending anonymous whispers, receiving messages via HCS).
By addressing these foundational elements, you're not just preparing to build the application—you're preparing to build a maintainable, scalable, and collaborative decentralized dApp.

8. Decentralized App Specific Foundations
Wallet Integration: Set up WalletConnect for seamless wallet connections, integrating with [`walletConnect.ts`](Web/src/lib/hedera/walletConnect.ts).
Decentralized Identity Management: Configure Hedera identity services for user DID creation and verification.
Token Services Setup: Initialize Hedera token services for any future token-based features (e.g., subscription tokens).
Consensus Timestamping: Ensure HCS topics are configured for timestamping all messages to maintain chronological order without revealing identities.
IPFS Node Configuration: Set up dedicated IPFS nodes or use pinning services for reliable, decentralized storage of message data.
Encryption Key Management: Establish secure key generation and management protocols for ECIES encryption, ensuring keys are never stored on centralized servers.
