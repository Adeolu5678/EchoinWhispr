import {
  AccountId,
  Client,
  ContractCallQuery,
  ContractCreateTransaction,
  ContractExecuteTransaction,
  ContractFunctionParameters,
  Hbar,
  PrivateKey
} from '@hashgraph/sdk';

export class HederaSmartContracts {
  private client: Client;

  constructor(network: string, accountId: string, privateKey: string) {
    console.log(`[DEBUG] Initializing HederaSmartContracts with network: ${network}, accountId: ${accountId}`);
    this.client = this.initializeClient(network, accountId, privateKey);
  }

  /**
   * Convert Hedera account ID to Ethereum-style address
   * @param accountId - Hedera account ID (e.g., "0.0.7115331")
   * @returns Ethereum-style address (40 characters, hex)
   */
  private convertToEthereumAddress(accountId: string): string {
    const account = AccountId.fromString(accountId);
    return account.toSolidityAddress();
  }

  private initializeClient(network: string, accountId: string, privateKey: string): Client {
    console.log(`[DEBUG] Initializing Hedera client for network: ${network}`);
    console.log(`[DEBUG] Account ID: ${accountId}`);

    if (!accountId || !privateKey) {
      throw new Error('Account ID and private key are required for client initialization');
    }

    const client = network === 'testnet' ? Client.forTestnet() : Client.forMainnet();
    client.setOperator(accountId, PrivateKey.fromString(privateKey));
    client.setMaxQueryPayment(new Hbar(500));

    console.log(`[DEBUG] Hedera client initialized successfully`);
    return client;
  }

  async deployContract(bytecode: string, constructorParams: string[] = []): Promise<string> {
    try {
      console.log(`[DEBUG] Deploying contract with bytecode length: ${bytecode.length}`);
      console.log(`[DEBUG] Constructor parameters:`, constructorParams);

      if (!bytecode || bytecode.length === 0) {
        throw new Error('Bytecode cannot be empty');
      }

      const transaction = new ContractCreateTransaction()
        .setBytecode(new Uint8Array(Buffer.from(bytecode, 'hex')))
        .setGas(100000)
        .setConstructorParameters(
          new ContractFunctionParameters().addStringArray(constructorParams)
        )
        .setMaxTransactionFee(new Hbar(30));

      console.log(`[DEBUG] Executing contract deployment transaction...`);
      const txResponse = await transaction.execute(this.client);
      const receipt = await txResponse.getReceipt(this.client);

      const contractId = receipt.contractId?.toString() || '';
      console.log(`[DEBUG] Contract deployed successfully with ID: ${contractId}`);
      return contractId;
    } catch (error) {
      console.error(`[ERROR] Contract deployment failed:`, error);
      if (error instanceof Error) {
        console.error(`[ERROR] Error message: ${error.message}`);
      }
      throw error;
    }
  }

  async executeContractFunction(
    contractId: string,
    functionName: string,
    params: (string | string[])[] = [],
    gas: number = 100000
  ): Promise<{ transactionId: string; result: unknown }> {
    try {
      console.log(`[DEBUG] Executing contract function: ${functionName}`);
      console.log(`[DEBUG] Contract ID: ${contractId}`);
      console.log(`[DEBUG] Gas limit: ${gas}`);
      console.log(`[DEBUG] Parameters:`, params);

      const functionParams = new ContractFunctionParameters();

      // Handle different parameter types for registerUser
      if (functionName === 'registerUser' && params.length === 5) {
        console.log(`[DEBUG] Processing registerUser parameters`);
        // registerUser(string career, string[] interests, string mood, bytes publicKey, bytes32 mailHash)
        const career = params[0] as string;
        const interests = params[1] as string[];
        const currentMood = params[2] as string;
        const publicKeyHex = params[3] as string;
        const mailHashHex = params[4] as string;

        console.log(`[DEBUG] Career: ${career} (length: ${career.length})`);
        console.log(`[DEBUG] Interests:`, interests);
        console.log(`[DEBUG] Current Mood: ${currentMood} (length: ${currentMood.length})`);
        console.log(`[DEBUG] Public Key Hex: ${publicKeyHex} (length: ${publicKeyHex.length})`);
        console.log(`[DEBUG] Mail Hash Hex: ${mailHashHex} (length: ${mailHashHex.length})`);

        // Validate parameters before adding to function params
        if (!career || career.length > 100) {
          throw new Error(`Invalid career parameter: length ${career.length}, max allowed 100`);
        }
        if (!interests || interests.length === 0 || interests.length > 10) {
          throw new Error(`Invalid interests parameter: length ${interests?.length || 0}, must be 1-10`);
        }
        if (!currentMood || currentMood.length > 50) {
          throw new Error(`Invalid currentMood parameter: length ${currentMood.length}, max allowed 50`);
        }
        if (!publicKeyHex || publicKeyHex.length === 0) {
          throw new Error('Invalid publicKey parameter: cannot be empty');
        }
        if (!mailHashHex || mailHashHex.length === 0) {
          throw new Error('Invalid mailHash parameter: cannot be empty');
        }

        // Validate mailHash is exactly 64 hex characters (32 bytes)
        const cleanMailHash = mailHashHex.replace(/^0x/, '');
        if (cleanMailHash.length !== 64) {
          throw new Error('Invalid mailHash parameter: must be exactly 64 hex characters (32 bytes)');
        }

        functionParams
          .addString(career)
          .addStringArray(interests)
          .addString(currentMood)
          .addBytes(Buffer.from(publicKeyHex, 'hex'))
          .addBytes32(Buffer.from(mailHashHex.replace(/^0x/, ''), 'hex'));
      } else {
        // Default behavior for other functions
        functionParams.addStringArray(params as string[]);
      }

      const transaction = new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(gas)
        .setFunction(functionName, functionParams)
        .setMaxTransactionFee(new Hbar(5));

      console.log(`[DEBUG] Executing transaction...`);
      const txResponse = await transaction.execute(this.client);
      console.log(`[DEBUG] Transaction executed, getting record...`);
      const record = await txResponse.getRecord(this.client);

      console.log(`[DEBUG] Transaction successful: ${record.transactionId.toString()}`);
      return {
        transactionId: record.transactionId.toString(),
        result: record.contractFunctionResult
      };
    } catch (error) {
      console.error(`[ERROR] Contract execution failed for function: ${functionName}`);
      console.error(`[ERROR] Error details:`, error);

      // If it's a Hedera SDK error, try to extract more details
      if (error instanceof Error) {
        console.error(`[ERROR] Error message: ${error.message}`);
        console.error(`[ERROR] Error stack:`, error.stack);
      }

      throw error;
    }
  }

  async queryContractFunction(
    contractId: string,
    functionName: string,
    params: (string | string[])[] = []
  ): Promise<unknown> {
    try {
      console.log(`[DEBUG] Querying contract function: ${functionName}`);
      console.log(`[DEBUG] Contract ID: ${contractId}`);
      console.log(`[DEBUG] Parameters:`, params);

      const functionParams = new ContractFunctionParameters();

      // Handle different parameter types for specific functions
      if (functionName === 'getPersona' && params.length === 1) {
        console.log(`[DEBUG] Converting address for getPersona: ${params[0]}`);
        // getPersona(address _user)
        functionParams.addAddress(this.convertToEthereumAddress(params[0] as string));
      } else if (functionName === 'getPublicKey' && params.length === 1) {
        console.log(`[DEBUG] Converting address for getPublicKey: ${params[0]}`);
        // getPublicKey(address _user)
        functionParams.addAddress(this.convertToEthereumAddress(params[0] as string));
      } else if (functionName === 'getMailHash' && params.length === 1) {
        console.log(`[DEBUG] Converting address for getMailHash: ${params[0]}`);
        // getMailHash(address _user)
        functionParams.addAddress(this.convertToEthereumAddress(params[0] as string));
      } else if (functionName === 'checkSubscription' && params.length === 1) {
        console.log(`[DEBUG] Converting address for checkSubscription: ${params[0]}`);
        // checkSubscription(address _user)
        functionParams.addAddress(this.convertToEthereumAddress(params[0] as string));
      } else if (functionName === 'findMoodMatch' && params.length === 1) {
        console.log(`[DEBUG] Processing findMoodMatch with mood: ${params[0]}`);
        // findMoodMatch(string _mood)
        functionParams.addString(params[0] as string);
      } else if (functionName === 'getUsers' && params.length === 2) {
        console.log(`[DEBUG] Processing getUsers with page: ${params[0]}, pageSize: ${params[1]}`);
        // getUsers(uint _page, uint _pageSize)
        functionParams.addUint256(Number(params[0])).addUint256(Number(params[1]));
      } else {
        // Default behavior for other functions
        functionParams.addStringArray(params as string[]);
      }

      const query = new ContractCallQuery()
        .setContractId(contractId)
        .setGas(100000)
        .setFunction(functionName, functionParams)
        .setMaxQueryPayment(new Hbar(5000000));

      console.log(`[DEBUG] Executing query...`);
      const response = await query.execute(this.client);
      console.log(`[DEBUG] Query successful, result:`, response);
      return response;
    } catch (error) {
      console.error(`[ERROR] Contract query failed for function: ${functionName}`);
      console.error(`[ERROR] Error details:`, error);

      // If it's a Hedera SDK error, try to extract more details
      if (error instanceof Error) {
        console.error(`[ERROR] Error message: ${error.message}`);
        console.error(`[ERROR] Error stack:`, error.stack);
      }

      throw error;
    }
  }

  /**
   * Get user profile from smart contract
   * @param userAddress - Hedera account ID of the user
   * @returns User profile data
   */
  async getUserProfile(userAddress: string): Promise<any> {
    try {
      console.log(`[DEBUG] Getting user profile for address: ${userAddress}`);

      if (!userAddress || userAddress.trim() === '') {
        throw new Error('User address cannot be empty');
      }

      // Validate Hedera account ID format
      if (!/^0\.0\.\d+$/.test(userAddress)) {
        throw new Error(`Invalid Hedera account ID format: ${userAddress}`);
      }

      console.log(`[DEBUG] Converted Ethereum address: ${this.convertToEthereumAddress(userAddress)}`);

      const contractId = process.env.NEXT_PUBLIC_CONTRACT_ID;
      if (!contractId) {
        throw new Error('Contract ID not configured in environment variables');
      }

      console.log(`[DEBUG] Using contract ID: ${contractId}`);

      const result = await this.queryContractFunction(
        contractId,
        'getPersona',
        [userAddress] // Pass the original Hedera address, conversion happens in queryContractFunction
      );

      console.log(`[DEBUG] User profile retrieved successfully:`, result);
      return result;
    } catch (error) {
      console.error(`[ERROR] Failed to get user profile for ${userAddress}:`, error);

      // Check if this is a "user does not exist" error
      if (error instanceof Error && error.message.includes('User does not exist')) {
        console.log(`[INFO] User ${userAddress} does not exist, returning default profile`);
        return {
          career: '',
          interests: [],
          interestsCount: 0,
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
   * Get user's mail hash from smart contract
   * @param userAddress - Hedera account ID of the user
   * @returns Mail hash as bytes32 string
   */
  async getUserMailHash(userAddress: string): Promise<string> {
    const result = await this.queryContractFunction(
      process.env.NEXT_PUBLIC_CONTRACT_ID || '',
      'getMailHash',
      [this.convertToEthereumAddress(userAddress)]
    );
    return result as string;
  }

  /**
   * Get user's public key from smart contract
   * @param userAddress - Hedera account ID of the user
   * @returns Public key as hex string
   */
  async getUserPublicKey(userAddress: string): Promise<string> {
    const result = await this.queryContractFunction(
      process.env.NEXT_PUBLIC_CONTRACT_ID || '',
      'getPublicKey',
      [this.convertToEthereumAddress(userAddress)]
    );
    return result as string;
  }

  /**
   * Subscribe with HBAR payment
   * @param amount - Amount in tinybars
   * @returns Transaction result
   */
  async subscribeWithHBAR(amount: number): Promise<{ transactionId: string; result: unknown }> {
    try {
      console.log(`[DEBUG] Subscribing with HBAR, amount: ${amount} tinybars`);

      if (amount <= 0) {
        throw new Error('Subscription amount must be greater than 0');
      }

      const contractId = process.env.NEXT_PUBLIC_CONTRACT_ID;
      if (!contractId) {
        throw new Error('Contract ID not configured in environment variables');
      }

      console.log(`[DEBUG] Contract ID: ${contractId}`);

      // Check contract pricing before attempting subscription
      // Note: This would require adding a view function to get pricing, but for now we'll proceed

      const hbarAmount = new Hbar(amount / 100000000); // Convert tinybars to HBAR
      console.log(`[DEBUG] HBAR amount: ${hbarAmount.toString()}`);

      const transaction = new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(100000)
        .setFunction('subscribeWithHBAR')
        .setPayableAmount(hbarAmount)
        .setMaxTransactionFee(new Hbar(300000));

      console.log(`[DEBUG] Executing HBAR subscription transaction...`);
      const txResponse = await transaction.execute(this.client);
      const record = await txResponse.getRecord(this.client);

      console.log(`[DEBUG] HBAR subscription successful: ${record.transactionId.toString()}`);
      return {
        transactionId: record.transactionId.toString(),
        result: record
      };
    } catch (error) {
      console.error(`[ERROR] HBAR subscription failed:`, error);
      if (error instanceof Error) {
        console.error(`[ERROR] Error message: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Subscribe with HTS token payment
   * @param _amount - Amount in token units
   * @returns Transaction result
   */
  async subscribeWithHTS(_amount: number): Promise<{ transactionId: string; result: unknown }> {
    try {
      console.log(`[DEBUG] Subscribing with HTS token, amount: ${_amount}`);

      if (_amount <= 0) {
        throw new Error('Subscription amount must be greater than 0');
      }

      const contractId = process.env.NEXT_PUBLIC_CONTRACT_ID;
      if (!contractId) {
        throw new Error('Contract ID not configured in environment variables');
      }

      console.log(`[DEBUG] Contract ID: ${contractId}`);

      // Check if user has sufficient allowance before attempting subscription
      // This would require getting the user's address and checking allowance
      // For now, we'll let the contract handle the validation

      const transaction = new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(100000)
        .setFunction('subscribeWithHTS')
        .setMaxTransactionFee(new Hbar(30));

      console.log(`[DEBUG] Executing HTS subscription transaction...`);
      const txResponse = await transaction.execute(this.client);
      const record = await txResponse.getRecord(this.client);

      console.log(`[DEBUG] HTS subscription successful: ${record.transactionId.toString()}`);
      return {
        transactionId: record.transactionId.toString(),
        result: record
      };
    } catch (error) {
      console.error(`[ERROR] HTS subscription failed:`, error);
      if (error instanceof Error) {
        console.error(`[ERROR] Error message: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Approve HTS token for spending
   * @param tokenAddress - HTS token address
   * @param spender - Spender address (contract)
   * @param amount - Amount to approve
   * @returns Transaction result
   */
  async approveHTSToken(tokenAddress: string, spender: string, amount: number): Promise<{ transactionId: string; result: unknown }> {
    try {
      console.log(`[DEBUG] Approving HTS token for spending`);
      console.log(`[DEBUG] Token address: ${tokenAddress}`);
      console.log(`[DEBUG] Spender: ${spender}`);
      console.log(`[DEBUG] Amount: ${amount}`);

      const transaction = new ContractExecuteTransaction()
        .setContractId(tokenAddress)
        .setGas(100000)
        .setFunction('approve', new ContractFunctionParameters().addAddress(this.convertToEthereumAddress(spender)).addUint256(amount))
        .setMaxTransactionFee(new Hbar(30));

      console.log(`[DEBUG] Executing token approval transaction...`);
      const txResponse = await transaction.execute(this.client);
      const record = await txResponse.getRecord(this.client);

      console.log(`[DEBUG] Token approval successful: ${record.transactionId.toString()}`);
      return {
        transactionId: record.transactionId.toString(),
        result: record
      };
    } catch (error) {
      console.error(`[ERROR] HTS token approval failed:`, error);
      if (error instanceof Error) {
        console.error(`[ERROR] Error message: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Get HTS token allowance
   * @param tokenAddress - HTS token address
   * @param owner - Owner address
   * @param spender - Spender address
   * @returns Allowance amount
   */
  async getHTSTokenAllowance(tokenAddress: string, owner: string, spender: string): Promise<number> {
    try {
      console.log(`[DEBUG] Getting HTS token allowance`);
      console.log(`[DEBUG] Token: ${tokenAddress}, Owner: ${owner}, Spender: ${spender}`);

      if (!tokenAddress || !owner || !spender) {
        throw new Error('Token address, owner, and spender are required');
      }

      const result = await this.queryContractFunction(
        tokenAddress,
        'allowance',
        [owner, spender] // Pass original addresses, conversion happens in queryContractFunction
      );

      const allowance = Number(result);
      console.log(`[DEBUG] Token allowance: ${allowance}`);
      return allowance;
    } catch (error) {
      console.error(`[ERROR] Failed to get HTS token allowance:`, error);
      if (error instanceof Error) {
        console.error(`[ERROR] Error message: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Find a mood match for the current user
   * @param mood - Current mood to match
   * @returns Matching user address or null if no match
   */
  async findMoodMatch(mood: string): Promise<string | null> {
    try {
      console.log(`[DEBUG] Finding mood match for mood: ${mood}`);

      const result = await this.queryContractFunction(
        process.env.NEXT_PUBLIC_CONTRACT_ID || '',
        'findMoodMatch',
        [mood]
      );

      console.log(`[DEBUG] Mood match result:`, result);

      // The result should be an address, if it's address(0), return null
      const matchAddress = result as string;
      const isValidMatch = matchAddress && matchAddress !== '0x0000000000000000000000000000000000000000';

      console.log(`[DEBUG] Match address: ${matchAddress}, is valid: ${isValidMatch}`);
      return isValidMatch ? matchAddress : null;
    } catch (error) {
      console.error(`[ERROR] Failed to find mood match for mood "${mood}":`, error);
      throw error;
    }
  }

   /**
    * Check if user has reached daily whisper limit
    * @returns True if daily limit is reached, false otherwise
    */
   async checkDailyLimit(): Promise<boolean> {
     try {
       console.log(`[DEBUG] Checking daily whisper limit`);

       const result = await this.queryContractFunction(
         process.env.NEXT_PUBLIC_CONTRACT_ID || '',
         'checkDailyLimit'
       );

       console.log(`[DEBUG] Daily limit check result:`, result);
       return Boolean(result);
     } catch (error) {
       console.error(`[ERROR] Failed to check daily limit:`, error);
       throw error;
     }
   }

   /**
    * Search users by career and interests
    * @param career - Career filter
    * @param interests - Interests filter
    * @returns Array of matching user profiles
    */
   async searchUsers(career: string, interests: string): Promise<any[]> {
     try {
       console.log(`[DEBUG] Searching users with career: ${career}, interests: ${interests}`);

       const result = await this.queryContractFunction(
         process.env.NEXT_PUBLIC_CONTRACT_ID || '',
         'searchUsers',
         [career, interests]
       );

       console.log(`[DEBUG] Search users result:`, result);
       return result as any[];
     } catch (error) {
       console.error(`[ERROR] Failed to search users with career "${career}" and interests "${interests}":`, error);
       throw error;
     }
   }
 }