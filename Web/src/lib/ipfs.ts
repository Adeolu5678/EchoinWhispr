import { create, IPFSHTTPClient } from 'ipfs-http-client';

/**
 * Client-side IPFS utilities for EchoinWhispr
 * Handles uploading and downloading content to/from IPFS network
 */

export class IPFSService {
  private client: IPFSHTTPClient;

  constructor(ipfsGatewayUrl: string = 'https://ipfs.infura.io:5001') {
    this.client = create({ url: ipfsGatewayUrl });
  }

  /**
   * Upload raw image file to IPFS
   * @param file - The image file to upload
   * @returns Promise resolving to IPFS CID of the uploaded image
   */
  async uploadImage(file: File): Promise<string> {
    try {
      const result = await this.client.add({
        path: file.name,
        content: file.stream() as any // File.stream() returns a ReadableStream
      });

      console.log(`Image uploaded to IPFS: ${result.cid.toString()}`);
      return result.cid.toString();
    } catch (error) {
      console.error('Failed to upload image to IPFS:', error);
      throw new Error('IPFS image upload failed');
    }
  }

  /**
   * Upload encrypted message data to IPFS
   * @param encryptedData - The encrypted message as Uint8Array
   * @returns Promise resolving to IPFS CID of the encrypted message
   */
  async uploadEncryptedMessage(encryptedData: Uint8Array): Promise<string> {
    try {
      const result = await this.client.add({
        path: 'message.enc',
        content: encryptedData
      });

      console.log(`Encrypted message uploaded to IPFS: ${result.cid.toString()}`);
      return result.cid.toString();
    } catch (error) {
      console.error('Failed to upload encrypted message to IPFS:', error);
      throw new Error('IPFS encrypted message upload failed');
    }
  }

  /**
   * Download content from IPFS by CID
   * @param cid - The IPFS content identifier
   * @returns Promise resolving to the content as Uint8Array
   */
  async downloadContent(cid: string): Promise<Uint8Array> {
    try {
      const chunks: Uint8Array[] = [];
      for await (const chunk of this.client.cat(cid)) {
        chunks.push(chunk);
      }

      // Concatenate all chunks
      const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
      const result = new Uint8Array(totalLength);
      let offset = 0;
      for (const chunk of chunks) {
        result.set(chunk, offset);
        offset += chunk.length;
      }

      return result;
    } catch (error) {
      console.error(`Failed to download content from IPFS (CID: ${cid}):`, error);
      throw new Error('IPFS content download failed');
    }
  }

  /**
   * Download and convert content to string
   * @param cid - The IPFS content identifier
   * @returns Promise resolving to content as string
   */
  async downloadContentAsString(cid: string): Promise<string> {
    const data = await this.downloadContent(cid);
    return new TextDecoder().decode(data);
  }

  /**
   * Download image from IPFS and create a Blob URL
   * @param cid - The IPFS content identifier of the image
   * @returns Promise resolving to Blob URL for the image
   */
  async downloadImageAsBlobUrl(cid: string): Promise<string> {
    const data = await this.downloadContent(cid);
    const blob = new Blob([data as BlobPart]);
    return URL.createObjectURL(blob);
  }

  /**
   * Pin content to ensure persistence (if supported by gateway)
   * @param cid - The IPFS content identifier to pin
   */
  async pinContent(cid: string): Promise<void> {
    try {
      await this.client.pin.add(cid);
      console.log(`Content pinned: ${cid}`);
    } catch (error) {
      console.warn(`Failed to pin content ${cid}:`, error);
      // Pinning might not be supported by all gateways, so we don't throw
    }
  }

  /**
   * Upload both image and encrypted message in sequence
   * @param imageFile - The image file to upload (optional)
   * @param encryptedMessage - The encrypted message data
   * @returns Promise resolving to object with image_cid and main_cid
   */
  async uploadMessageWithImage(
    imageFile: File | null,
    encryptedMessage: Uint8Array
  ): Promise<{ image_cid?: string; main_cid: string }> {
    let image_cid: string | undefined;

    // Upload image first if provided
    if (imageFile) {
      image_cid = await this.uploadImage(imageFile);
      // Optionally pin the image
      await this.pinContent(image_cid);
    }

    // Upload encrypted message
    const main_cid = await this.uploadEncryptedMessage(encryptedMessage);
    // Pin the main content
    await this.pinContent(main_cid);

    return { image_cid, main_cid };
  }
}

/**
 * Utility function to create IPFS service instance
 * @param gatewayUrl - Optional custom IPFS gateway URL
 * @returns Configured IPFSService instance
 */
export function createIPFSService(gatewayUrl?: string): IPFSService {
  return new IPFSService(gatewayUrl);
}