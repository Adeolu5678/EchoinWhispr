# EchoinWhispr Smart Contract Deployment Scripts

This directory contains scripts for deploying and interacting with the EchoinWhispr decentralized smart contracts on the Hedera network.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with your configuration:
```env
HEDERA_RPC_URL=https://testnet.hashio.io/api
PRIVATE_KEY=your_private_key_here
HTS_TOKEN_ADDRESS=0x0000000000000000000000000000000000000000
```

## Usage

### Compile Contracts
```bash
npm run compile
```

### Deploy to Testnet
```bash
npm run deploy
```

### Deploy to Mainnet
```bash
npx hardhat run scripts/deploy.ts --network hederaMainnet
```

## Files

- [`hardhat.config.ts`](Back-End/scripts/hardhat.config.ts) - Hardhat configuration for Hedera networks
- [`deploy.ts`](Back-End/scripts/deploy.ts) - Deployment script for the EchoinWhispr contract
- [`package.json`](Back-End/scripts/package.json) - Dependencies and scripts
- [`deployment.json`](Back-End/scripts/deployment.json) - Generated deployment information (after deployment)

## Notes

- Ensure your Hedera account has sufficient HBAR for deployment costs
- The contract is deployed with placeholder HTS token address - update for production use
- Deployment info is saved to `deployment.json` for reference and contract interaction
- All deployments follow decentralized best practices with no central control points