import { ethers } from 'hardhat';
import * as fs from 'fs';
import * as path from 'path';
import { network } from 'hardhat';

// Configuration
const HBAR_PRICE = ethers.parseEther('10'); // 10 HBAR in wei (Hedera uses wei-like units)
const HTS_PRICE = 1000000; // Example HTS price in smallest denomination
const HTS_TOKEN_ADDRESS = process.env.HTS_TOKEN_ADDRESS || '0x0000000000000000000000000000000000000000'; // Placeholder

/**
 * Deploys the EchoinWhispr smart contract to Hedera network
 */
async function main() {
  console.log('Starting deployment of EchoinWhispr contract...');

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying from account: ${deployer.address}`);
  console.log(`Account balance: ${(await ethers.provider.getBalance(deployer.address)).toString()}`);

  // Get the contract factory
  const EchoinWhispr = await ethers.getContractFactory('EchoinWhispr');

  // Deploy contract
  console.log('Deploying contract...');
  const contract = await EchoinWhispr.deploy(HBAR_PRICE, HTS_PRICE, HTS_TOKEN_ADDRESS);

  console.log('Waiting for deployment confirmation...');
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log(`EchoinWhispr contract deployed at: ${contractAddress}`);

  // Verify deployment by calling a view function
  const owner = await contract.owner();
  console.log(`Contract owner: ${owner}`);

  // Save deployment info
  const deploymentInfo = {
    contractAddress,
    deployer: deployer.address,
    network: network.name,
    chainId: network.config.chainId,
    timestamp: new Date().toISOString(),
    constructorArgs: {
      hbarPrice: HBAR_PRICE.toString(),
      htsPrice: HTS_PRICE.toString(),
      htsTokenAddress: HTS_TOKEN_ADDRESS
    }
  };

  const deploymentPath = path.join(__dirname, 'deployment.json');
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));

  console.log(`Deployment info saved to ${deploymentPath}`);
  console.log('Deployment completed successfully!');
}

// Run deployment
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});