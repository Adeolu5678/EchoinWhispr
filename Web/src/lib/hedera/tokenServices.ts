import {
  Client,
  TokenCreateTransaction,
  TokenMintTransaction,
  TransferTransaction,
  Hbar,
  PrivateKey
} from '@hashgraph/sdk';

export class HederaTokenServices {
  private client: Client;

  constructor(network: string, accountId: string, privateKey: string) {
    this.client = this.initializeClient(network, accountId, privateKey);
  }

  private initializeClient(network: string, accountId: string, privateKey: string): Client {
    const client = network === 'testnet' ? Client.forTestnet() : Client.forMainnet();
    client.setOperator(accountId, PrivateKey.fromString(privateKey));
    return client;
  }

  async createToken(
    name: string,
    symbol: string,
    initialSupply: number,
    decimals: number = 0
  ): Promise<string> {
    const transaction = new TokenCreateTransaction()
      .setTokenName(name)
      .setTokenSymbol(symbol)
      .setTreasuryAccountId(this.client.operatorAccountId!)
      .setInitialSupply(initialSupply)
      .setDecimals(decimals)
      .setMaxTransactionFee(new Hbar(30));

    const txResponse = await transaction.execute(this.client);
    const receipt = await txResponse.getReceipt(this.client);

    return receipt.tokenId?.toString() || '';
  }

  async transferTokens(
    tokenId: string,
    recipientId: string,
    amount: number
  ): Promise<void> {
    const transaction = new TransferTransaction()
      .addTokenTransfer(tokenId, this.client.operatorAccountId!, -amount)
      .addTokenTransfer(tokenId, recipientId, amount)
      .setMaxTransactionFee(new Hbar(30));

    await transaction.execute(this.client);
  }

  async mintTokens(tokenId: string, amount: number): Promise<void> {
    const transaction = new TokenMintTransaction()
      .setTokenId(tokenId)
      .setAmount(amount)
      .setMaxTransactionFee(new Hbar(30));

    await transaction.execute(this.client);
  }

  async transferHbar(recipientId: string, amount: number): Promise<void> {
    const transaction = new TransferTransaction()
      .addHbarTransfer(this.client.operatorAccountId!, new Hbar(-amount))
      .addHbarTransfer(recipientId, new Hbar(amount))
      .setMaxTransactionFee(new Hbar(30));

    await transaction.execute(this.client);
  }
}