import {
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
    this.client = this.initializeClient(network, accountId, privateKey);
  }

  private initializeClient(network: string, accountId: string, privateKey: string): Client {
    const client = network === 'testnet' ? Client.forTestnet() : Client.forMainnet();
    client.setOperator(accountId, PrivateKey.fromString(privateKey));
    return client;
  }

  async deployContract(bytecode: string, constructorParams: string[] = []): Promise<string> {
    const transaction = new ContractCreateTransaction()
      .setBytecode(new Uint8Array(Buffer.from(bytecode, 'hex')))
      .setGas(100000)
      .setConstructorParameters(
        new ContractFunctionParameters().addStringArray(constructorParams)
      )
      .setMaxTransactionFee(new Hbar(30));

    const txResponse = await transaction.execute(this.client);
    const receipt = await txResponse.getReceipt(this.client);

    return receipt.contractId?.toString() || '';
  }

  async executeContractFunction(
    contractId: string,
    functionName: string,
    params: string[] = [],
    gas: number = 30000
  ): Promise<{ transactionId: string; result: unknown }> {
    const transaction = new ContractExecuteTransaction()
      .setContractId(contractId)
      .setGas(gas)
      .setFunction(functionName, new ContractFunctionParameters().addStringArray(params))
      .setMaxTransactionFee(new Hbar(30));

    const txResponse = await transaction.execute(this.client);
    const record = await txResponse.getRecord(this.client);

    return {
      transactionId: record.transactionId.toString(),
      result: record.contractFunctionResult
    };
  }

  async queryContractFunction(
    contractId: string,
    functionName: string,
    params: string[] = []
  ): Promise<unknown> {
    const query = new ContractCallQuery()
      .setContractId(contractId)
      .setGas(30000)
      .setFunction(functionName, new ContractFunctionParameters().addStringArray(params))
      .setMaxQueryPayment(new Hbar(30));

    const response = await query.execute(this.client);
    return response;
  }
}