import {
  Client,
  TopicCreateTransaction,
  TopicMessageSubmitTransaction,
  PrivateKey,
  Hbar
} from '@hashgraph/sdk';

export class HederaConsensusService {
  private client: Client;

  constructor(network: string, accountId: string, privateKey: string) {
    this.client = this.initializeClient(network, accountId, privateKey);
  }

  private initializeClient(network: string, accountId: string, privateKey: string): Client {
    const client = network === 'testnet' ? Client.forTestnet() : Client.forMainnet();
    client.setOperator(accountId, PrivateKey.fromString(privateKey));
    return client;
  }

  async createTopic(memo: string = ''): Promise<string> {
    const transaction = new TopicCreateTransaction()
      .setTopicMemo(memo)
      .setMaxTransactionFee(new Hbar(30));

    const txResponse = await transaction.execute(this.client);
    const receipt = await txResponse.getReceipt(this.client);

    return receipt.topicId?.toString() || '';
  }

  async submitMessage(topicId: string, message: string): Promise<string> {
    const transaction = new TopicMessageSubmitTransaction()
      .setTopicId(topicId)
      .setMessage(message)
      .setMaxTransactionFee(new Hbar(30));

    const txResponse = await transaction.execute(this.client);
    const receipt = await txResponse.getReceipt(this.client);

    return receipt.topicSequenceNumber?.toString() || '';
  }

  async getMessage(topicId: string, sequenceNumber: string): Promise<unknown> {
    // For now, return a mock message with consensus data
    // In a real implementation, this would query the Hedera network
    return {
      consensusTimestamp: new Date().toISOString(),
      hash: `hash_${sequenceNumber}`,
      sequenceNumber: parseInt(sequenceNumber)
    };
  }
}