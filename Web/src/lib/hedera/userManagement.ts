import { HederaSmartContracts } from './smartContracts';
import { HederaWalletService } from './walletConnect';

export interface UserProfile {
  career: string;
  interests: string[];
  currentMood: string;
  publicKey: string;
  mailHash: string;
  subscriptionEnds: number;
  isInitialized: boolean;
}

export interface UserRegistrationData {
  career: string;
  interests: string[];
  currentMood: string;
  publicKey: string;
  mailHash: string;
}

export class UserManagementService {
  private static instance: UserManagementService;
  private smartContracts: HederaSmartContracts | null = null;
  private walletService: HederaWalletService;

  constructor() {
    this.walletService = HederaWalletService.getInstance();
  }

  static getInstance(): UserManagementService {
    if (!UserManagementService.instance) {
      UserManagementService.instance = new UserManagementService();
    }
    return UserManagementService.instance;
  }

  /**
   * Initialize smart contracts service with wallet credentials
   */
  private async initializeSmartContracts(): Promise<void> {
    if (!this.smartContracts) {
      const accountId = this.walletService.getAccountId();
      if (!accountId) {
        throw new Error('Wallet not connected');
      }

      // In production, get private key from wallet securely
      // For now, using a mock private key - this should be handled by wallet
      const privateKey = process.env.NEXT_PUBLIC_HEDERA_PRIVATE_KEY || '';
      if (!privateKey) {
        throw new Error('Private key not configured');
      }

      this.smartContracts = new HederaSmartContracts(
        process.env.NEXT_PUBLIC_HEDERA_NETWORK || 'testnet',
        accountId,
        privateKey
      );
    }
  }

  /**
   * Register a new user on-chain
   */
  async registerUser(registrationData: UserRegistrationData): Promise<{ transactionId: string }> {
    try {
      console.log('[DEBUG] Starting user registration process');

      await this.initializeSmartContracts();

      if (!this.smartContracts) {
        throw new Error('Smart contracts not initialized');
      }

      const accountId = this.walletService.getAccountId();
      if (!accountId) {
        throw new Error('Wallet not connected');
      }

      console.log(`[DEBUG] Registering user with account ID: ${accountId}`);

      // Check if user already exists
      const existingProfile = await this.getUserProfile(accountId);
      if (existingProfile.isInitialized) {
        throw new Error('User already registered');
      }

      // Debug logging for parameters
      console.log('[DEBUG] Registration parameters:', {
        career: registrationData.career,
        interests: registrationData.interests,
        currentMood: registrationData.currentMood,
        publicKey: registrationData.publicKey,
        mailHash: registrationData.mailHash,
        accountId: accountId
      });

      // Validate parameters match contract expectations
      if (!registrationData.career || registrationData.career.length > 100) {
        throw new Error(`Invalid career parameter: "${registrationData.career}" (length: ${registrationData.career?.length || 0}, max: 100)`);
      }
      if (!registrationData.interests || registrationData.interests.length === 0 || registrationData.interests.length > 10) {
        throw new Error(`Invalid interests parameter: ${registrationData.interests?.length || 0} interests, must be 1-10`);
      }
      if (!registrationData.currentMood || registrationData.currentMood.length > 50) {
        throw new Error(`Invalid currentMood parameter: "${registrationData.currentMood}" (length: ${registrationData.currentMood?.length || 0}, max: 50)`);
      }
      if (!registrationData.publicKey || registrationData.publicKey.length === 0) {
        throw new Error('Invalid publicKey parameter: cannot be empty');
      }
      if (!registrationData.mailHash || registrationData.mailHash.length === 0) {
        throw new Error('Invalid mailHash parameter: cannot be empty');
      }

      // Validate interests are from the allowed list
      const validInterests = ["DeFi", "NFTs", "Gaming", "AI", "Web3", "Crypto", "Art", "Music", "Sports", "Travel"];
      for (const interest of registrationData.interests) {
        if (!validInterests.includes(interest)) {
          throw new Error(`Invalid interest: "${interest}". Must be one of: ${validInterests.join(', ')}`);
        }
      }

      // Define the high gas limit for this complex transaction
      const HIGH_REGISTRATION_GAS = 1_000_000;

      console.log(`[DEBUG] Executing registerUser contract function with gas limit: ${HIGH_REGISTRATION_GAS}`);

      // Register user on-chain
      const result = await this.smartContracts.executeContractFunction(
        process.env.NEXT_PUBLIC_CONTRACT_ID || '',
        'registerUser',
        [
          registrationData.career,
          registrationData.interests,
          registrationData.currentMood,
          registrationData.publicKey,
          registrationData.mailHash
        ],
        HIGH_REGISTRATION_GAS
      );

      console.log(`[DEBUG] User registration successful, transaction ID: ${result.transactionId}`);
      return { transactionId: result.transactionId };
    } catch (error) {
      console.error('[ERROR] User registration failed:', error);
      if (error instanceof Error) {
        console.error(`[ERROR] Error message: ${error.message}`);
        console.error(`[ERROR] Error stack:`, error.stack);
      }
      throw error;
    }
  }

  /**
   * Get user profile by wallet address
   */
  async getUserProfile(walletAddress: string): Promise<UserProfile> {
    await this.initializeSmartContracts();

    if (!this.smartContracts) {
      throw new Error('Smart contracts not initialized');
    }

    try {
      const profile = await this.smartContracts.getUserProfile(walletAddress);

      // Transform the result to match our interface
      return {
        career: profile.career || '',
        interests: profile.interests || [],
        currentMood: profile.currentMood || '',
        publicKey: profile.publicKey ? Buffer.from(profile.publicKey).toString('hex') : '',
        mailHash: profile.mailHash ? Buffer.from(profile.mailHash).toString('hex') : '',
        subscriptionEnds: Number(profile.subscriptionEnds) || 0,
        isInitialized: profile.isInitialized || false
      };
    } catch (error) {
      // If user doesn't exist, return default profile
      if (error instanceof Error && error.message.includes('User does not exist')) {
        return {
          career: '',
          interests: [],
          currentMood: '',
          publicKey: '',
          mailHash: '',
          subscriptionEnds: 0,
          isInitialized: false
        };
      }
      throw error;
    }
  }

  /**
   * Check if user is authenticated (registered and wallet connected)
   */
  async isUserAuthenticated(walletAddress: string): Promise<boolean> {
    try {
      const profile = await this.getUserProfile(walletAddress);
      return profile.isInitialized;
    } catch (error) {
      console.error('Error checking user authentication:', error);
      return false;
    }
  }

  /**
   * Update user persona
   */
  async updateUserPersona(updates: {
    career?: string;
    interests?: string[];
    currentMood?: string;
  }): Promise<{ transactionId: string }> {
    try {
      console.log('[DEBUG] Starting user persona update');

      await this.initializeSmartContracts();

      if (!this.smartContracts) {
        throw new Error('Smart contracts not initialized');
      }

      const accountId = this.walletService.getAccountId();
      if (!accountId) {
        throw new Error('Wallet not connected');
      }

      console.log(`[DEBUG] Updating persona for account: ${accountId}`);

      // Get current profile to merge updates
      const currentProfile = await this.getUserProfile(accountId);
      if (!currentProfile.isInitialized) {
        throw new Error('User not registered');
      }

      const updatedCareer = updates.career ?? currentProfile.career;
      const updatedInterests = updates.interests ?? currentProfile.interests;
      const updatedMood = updates.currentMood ?? currentProfile.currentMood;

      console.log('[DEBUG] Update parameters:', {
        career: updatedCareer,
        interests: updatedInterests,
        currentMood: updatedMood
      });

      // Validate updated parameters
      if (updatedCareer && updatedCareer.length > 100) {
        throw new Error(`Invalid career parameter: length ${updatedCareer.length}, max allowed 100`);
      }
      if (updatedInterests && (updatedInterests.length === 0 || updatedInterests.length > 10)) {
        throw new Error(`Invalid interests parameter: length ${updatedInterests.length}, must be 1-10`);
      }
      if (updatedMood && updatedMood.length > 50) {
        throw new Error(`Invalid currentMood parameter: length ${updatedMood.length}, max allowed 50`);
      }

      // Validate interests are from the allowed list
      if (updatedInterests) {
        const validInterests = ["DeFi", "NFTs", "Gaming", "AI", "Web3", "Crypto", "Art", "Music", "Sports", "Travel"];
        for (const interest of updatedInterests) {
          if (!validInterests.includes(interest)) {
            throw new Error(`Invalid interest: "${interest}". Must be one of: ${validInterests.join(', ')}`);
          }
        }
      }

      // Gas Limit for updating the user persona
      const HIGH_UPDATE_GAS = 1_000_000;

      console.log(`[DEBUG] Executing editUserPersona contract function with gas limit: ${HIGH_UPDATE_GAS}`);

      const result = await this.smartContracts.executeContractFunction(
        process.env.NEXT_PUBLIC_CONTRACT_ID || '',
        'editUserPersona',
        [updatedCareer, JSON.stringify(updatedInterests), updatedMood],
        HIGH_UPDATE_GAS
      );

      console.log(`[DEBUG] User persona update successful, transaction ID: ${result.transactionId}`);
      return { transactionId: result.transactionId };
    } catch (error) {
      console.error('[ERROR] User persona update failed:', error);
      if (error instanceof Error) {
        console.error(`[ERROR] Error message: ${error.message}`);
        console.error(`[ERROR] Error stack:`, error.stack);
      }
      throw error;
    }
  }

  /**
   * Check subscription status
   */
  async checkSubscription(walletAddress: string): Promise<boolean> {
    try {
      console.log(`[DEBUG] Checking subscription status for address: ${walletAddress}`);

      await this.initializeSmartContracts();

      if (!this.smartContracts) {
        throw new Error('Smart contracts not initialized');
      }

      const result = await this.smartContracts.queryContractFunction(
        process.env.NEXT_PUBLIC_CONTRACT_ID || '',
        'checkSubscription',
        [walletAddress]
      );

      console.log(`[DEBUG] Subscription check result for ${walletAddress}: ${Boolean(result)}`);
      return Boolean(result);
    } catch (error) {
      console.error(`[ERROR] Failed to check subscription for ${walletAddress}:`, error);
      throw error;
    }
  }

  /**
   * Subscribe with HBAR
   */
  async subscribeWithHBAR(amount: number): Promise<{ transactionId: string }> {
    try {
      console.log(`[DEBUG] Subscribing with HBAR, amount: ${amount} tinybars`);

      await this.initializeSmartContracts();

      if (!this.smartContracts) {
        throw new Error('Smart contracts not initialized');
      }

      // Check if user exists before attempting subscription
      const accountId = this.walletService.getAccountId();
      if (!accountId) {
        throw new Error('Wallet not connected');
      }

      const userProfile = await this.getUserProfile(accountId);
      if (!userProfile.isInitialized) {
        throw new Error('User must be registered before subscribing');
      }

      console.log(`[DEBUG] User verified, proceeding with HBAR subscription`);

      const result = await this.smartContracts.subscribeWithHBAR(amount);
      console.log(`[DEBUG] HBAR subscription successful: ${result.transactionId}`);
      return { transactionId: result.transactionId };
    } catch (error) {
      console.error(`[ERROR] HBAR subscription failed:`, error);
      if (error instanceof Error) {
        console.error(`[ERROR] Error message: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Subscribe with HTS token
   */
  async subscribeWithHTS(amount: number): Promise<{ transactionId: string }> {
    try {
      console.log(`[DEBUG] Subscribing with HTS token, amount: ${amount}`);

      await this.initializeSmartContracts();

      if (!this.smartContracts) {
        throw new Error('Smart contracts not initialized');
      }

      // Check if user exists before attempting subscription
      const accountId = this.walletService.getAccountId();
      if (!accountId) {
        throw new Error('Wallet not connected');
      }

      const userProfile = await this.getUserProfile(accountId);
      if (!userProfile.isInitialized) {
        throw new Error('User must be registered before subscribing');
      }

      console.log(`[DEBUG] User verified, proceeding with HTS subscription`);

      const result = await this.smartContracts.subscribeWithHTS(amount);
      console.log(`[DEBUG] HTS subscription successful: ${result.transactionId}`);
      return { transactionId: result.transactionId };
    } catch (error) {
      console.error(`[ERROR] HTS subscription failed:`, error);
      if (error instanceof Error) {
        console.error(`[ERROR] Error message: ${error.message}`);
      }
      throw error;
    }
  }
}