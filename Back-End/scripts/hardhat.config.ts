import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../Web/.env.local') });

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.18",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hederaTestnet: {
      url: process.env.HEDERA_RPC_URL || "https://testnet.hashio.io/api",
      accounts: process.env.NEXT_PUBLIC_HEDERA_PRIVATE_KEY ? [process.env.NEXT_PUBLIC_HEDERA_PRIVATE_KEY] : [],
      gasPrice: 20000000000, // 20 gwei
    },
    hederaMainnet: {
      url: "https://mainnet.hashio.io/api",
      accounts: process.env.NEXT_PUBLIC_HEDERA_PRIVATE_KEY ? [process.env.NEXT_PUBLIC_HEDERA_PRIVATE_KEY] : [],
      gasPrice: 20000000000,
    }
  },
  paths: {
    sources: "../smart-contracts",
    artifacts: "./artifacts",
    cache: "./cache"
  }
};

export default config;