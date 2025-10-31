'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '../../../../../design-system/components/Button';
import { Input } from '../../../../../design-system/components/Input';
import { EncryptionService, MessageObject, HCSMessagePayload } from '../../../lib/encryption';
import { IPFSService } from '../../../lib/ipfs';
import { HederaConsensusService } from '../../../lib/hedera/consensusService';
import { HederaSmartContracts } from '../../../lib/hedera/smartContracts';

// Types for whisper data
interface Whisper {
  id: string;
  from: string;
  content: string;
  timestamp: string;
  isNew?: boolean;
}

interface WhisperRequest {
  id: string;
  from: string;
  preview: string;
  timestamp: string;
}

const WhispersPage: React.FC = () => {
  // State management
  const [activeTab, setActiveTab] = useState<'chats' | 'requests'>('chats');
  const [whispers, setWhispers] = useState<Whisper[]>([]);
  const [requests, setRequests] = useState<WhisperRequest[]>([]);
  const [newWhisperText, setNewWhisperText] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isComposing, setIsComposing] = useState(false);

  // Services
  const [encryptionService] = useState(() => new EncryptionService());
  const [ipfsService] = useState(() => new IPFSService());
  const [consensusService] = useState(() => new HederaConsensusService(
    process.env.NEXT_PUBLIC_HEDERA_NETWORK || 'testnet',
    process.env.NEXT_PUBLIC_HEDERA_ACCOUNT_ID || '',
    process.env.NEXT_PUBLIC_HEDERA_PRIVATE_KEY || ''
  ));
  const [smartContracts] = useState(() => new HederaSmartContracts(
    process.env.NEXT_PUBLIC_HEDERA_NETWORK || 'testnet',
    process.env.NEXT_PUBLIC_HEDERA_ACCOUNT_ID || '',
    process.env.NEXT_PUBLIC_HEDERA_PRIVATE_KEY || ''
  ));

  // Initialize services on mount
  useEffect(() => {
    const initializeServices = async () => {
      try {
        // Set topic ID if available
        if (process.env.NEXT_PUBLIC_WHISPER_TOPIC_ID) {
          consensusService.setWhisperTopicId(process.env.NEXT_PUBLIC_WHISPER_TOPIC_ID);
        }

        // Load existing whispers (mock data for now)
        loadWhispers();

        // Set up real-time updates (polling every 30 seconds)
        const interval = setInterval(() => {
          loadWhispers();
        }, 30000);

        return () => clearInterval(interval);
      } catch (err) {
        console.error('Failed to initialize services:', err);
        setError('Failed to initialize messaging services');
      }
    };

    initializeServices();
  }, [consensusService]);

  const loadWhispers = async () => {
    try {
      // Fetch whispers from HCS/Mirror Node
      const whispersData = await consensusService.getUserConversations();

      // Transform the data to match our interface
      const transformedWhispers: Whisper[] = whispersData.map((whisper: any) => ({
        id: whisper.id,
        from: whisper.from,
        content: whisper.lastMessage,
        timestamp: whisper.timestamp,
        isNew: whisper.unreadCount > 0
      }));

      // Fetch pending requests
      const requestsData = await consensusService.getPendingWhisperRequests();
      const transformedRequests: WhisperRequest[] = requestsData.map((req: any) => ({
        id: req.id,
        from: req.from,
        preview: req.preview,
        timestamp: req.timestamp
      }));

      setWhispers(transformedWhispers);
      setRequests(transformedRequests);
    } catch (err) {
      console.error('Failed to load whispers:', err);
      setError('Failed to load messages');
    }
  };

  const sendWhisper = async () => {
    if (!newWhisperText.trim() && !selectedImage || !selectedRecipient) {
      setError('Please enter a message or attach an image and select a recipient');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get recipient's public key from smart contract
      const recipientPublicKey = await smartContracts.getUserPublicKey(selectedRecipient);

      // Create message object
      const messageObject: MessageObject = {
        type: selectedImage ? 'text/image' : 'text',
        text_content: newWhisperText.trim(),
        image_cid: undefined, // Will be set after image upload
      };

      // Encrypt message
      const encryptedData = encryptionService.encryptMessageObject(messageObject, recipientPublicKey);

      // Upload to IPFS (with image if provided)
      setIsUploadingImage(true);
      const { image_cid, main_cid: initialMainCid } = await ipfsService.uploadMessageWithImage(selectedImage, encryptedData);
      let main_cid = initialMainCid;
      setIsUploadingImage(false);

      // If image was uploaded, update the message object and re-upload the encrypted message
      if (image_cid) {
        messageObject.image_cid = image_cid;
        // Re-encrypt with updated message object
        const updatedEncryptedData = encryptionService.encryptMessageObject(messageObject, recipientPublicKey);
        // Re-upload the updated encrypted message to IPFS
        main_cid = await ipfsService.uploadEncryptedMessage(updatedEncryptedData);
        await ipfsService.pinContent(main_cid);
      }

      // Generate conversation ID
      const convoId = crypto.randomUUID();

      // Create HCS payload
      const payload: HCSMessagePayload = {
        to_hash: await smartContracts.getUserMailHash(selectedRecipient),
        reply_hash: '0x0000000000000000000000000000000000000000000000000000000000000000', // No reply
        from_key: encryptionService.getPublicKeyHex(),
        cid: main_cid,
        convo_id: convoId,
      };

      // Submit to HCS
      await consensusService.submitWhisperMessage(payload);

      // Reset form
      setNewWhisperText('');
      setSelectedRecipient('');
      setSelectedImage(null);
      setIsComposing(false);

      // Refresh whispers
      await loadWhispers();

    } catch (err) {
      console.error('Failed to send whisper:', err);
      let errorMessage = 'Failed to send message';

      if (err instanceof Error) {
        if (err.message.includes('IPFS')) {
          errorMessage = 'Failed to upload image. Please try again.';
        } else if (err.message.includes('encrypt')) {
          errorMessage = 'Failed to encrypt message. Please try again.';
        } else if (err.message.includes('HCS') || err.message.includes('consensus')) {
          errorMessage = 'Failed to submit message to network. Please try again.';
        } else {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
      setIsUploadingImage(false);
    }
  };

  const acceptRequest = async (requestId: string) => {
    try {
      // Accept the whisper request by updating the conversation state
      // This would typically involve calling a smart contract function or updating HCS
      await consensusService.acceptWhisperRequest(requestId);
      setRequests(prev => prev.filter(req => req.id !== requestId));
      setError(null);
      // Refresh whispers to show the new conversation
      await loadWhispers();
    } catch (err) {
      console.error('Failed to accept request:', err);
      setError('Failed to accept whisper request');
    }
  };

  return (
    <div className="text-white">
      {/* Tabs */}
      <div className="flex bg-neutral-800 border-b border-neutral-700">
        <button
          onClick={() => setActiveTab('chats')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'chats'
              ? 'text-primary-500 border-b-2 border-primary-500'
              : 'text-neutral-400 hover:text-neutral-300'
          }`}
        >
          Chats
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${
            activeTab === 'requests'
              ? 'text-primary-500 border-b-2 border-primary-500'
              : 'text-neutral-400 hover:text-neutral-300'
          }`}
        >
          Requests
          {requests.length > 0 && (
            <span className="ml-2 bg-accent-500 text-white text-xs rounded-full px-2 py-1">
              {requests.length}
            </span>
          )}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'chats' ? (
          <div className="p-4">
            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                <span className="ml-3 text-neutral-400">
                  {isUploadingImage ? 'Uploading image...' : 'Sending whisper...'}
                </span>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-error-500/10 border border-error-500/20 rounded-lg p-4 mb-4">
                <p className="text-error-400">{error}</p>
              </div>
            )}

            {/* Compose Button */}
            {!isComposing && (
              <div className="mb-4">
                <Button
                  onClick={() => setIsComposing(true)}
                  className="w-full"
                  variant="primary"
                >
                  New Whisper
                </Button>
              </div>
            )}

            {/* Compose Form */}
            {isComposing && (
              <div className="bg-neutral-800 rounded-lg p-4 mb-4 border border-neutral-700">
                <h3 className="text-lg font-semibold text-neutral-100 mb-4">New Whisper</h3>

                <div className="space-y-4">
                  <Input
                    label="Recipient (Hedera Account ID)"
                    value={selectedRecipient}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelectedRecipient(e.target.value)}
                    placeholder="0.0.123456"
                    className="bg-neutral-700 border-neutral-600 text-white"
                  />

                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      Message
                    </label>
                    <textarea
                      value={newWhisperText}
                      onChange={(e) => setNewWhisperText(e.target.value)}
                      placeholder="Type your encrypted reply..."
                      className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                      rows={4}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      Attach Image (Optional)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setSelectedImage(file);
                        }
                      }}
                      className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-600 file:text-white hover:file:bg-primary-700"
                    />
                    {selectedImage && (
                      <div className="mt-2 flex items-center space-x-2">
                        <img
                          src={URL.createObjectURL(selectedImage)}
                          alt="Selected"
                          className="w-16 h-16 object-cover rounded-md border border-neutral-600"
                        />
                        <div className="flex-1">
                          <p className="text-sm text-neutral-300">{selectedImage.name}</p>
                          <p className="text-xs text-neutral-500">{(selectedImage.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                        <Button
                          onClick={() => setSelectedImage(null)}
                          size="sm"
                          variant="outline"
                          className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={sendWhisper}
                      loading={isLoading}
                      disabled={!newWhisperText.trim() || !selectedRecipient}
                      variant="primary"
                    >
                      Send Whisper
                    </Button>
                    <Button
                      onClick={() => {
                        setIsComposing(false);
                        setNewWhisperText('');
                        setSelectedRecipient('');
                        setSelectedImage(null);
                        setError(null);
                      }}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Whispers List */}
            <div className="space-y-2">
              {whispers.map((whisper) => (
                <div
                  key={whisper.id}
                  className="bg-neutral-800 rounded-lg p-4 border border-neutral-700 hover:bg-neutral-750 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-neutral-700 rounded-full flex items-center justify-center">
                        <span className="text-neutral-400 text-sm">?</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-neutral-100">{whisper.from}</h4>
                        <p className="text-sm text-neutral-400 mt-1">{whisper.content}</p>
                      </div>
                    </div>
                    <span className="text-xs text-neutral-600">
                      {new Date(whisper.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}

              {whispers.length === 0 && !isLoading && (
                <div className="text-center py-8">
                  <p className="text-neutral-400">No whispers yet. Start a conversation!</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-4">
            {/* Requests List */}
            <div className="space-y-2">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="bg-neutral-800 rounded-lg p-4 border border-neutral-700"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-neutral-700 rounded-full flex items-center justify-center">
                        <span className="text-neutral-400 text-sm">?</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-neutral-100">{request.from}</h4>
                        <p className="text-sm text-neutral-400 mt-1">{request.preview}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => acceptRequest(request.id)}
                      size="sm"
                      variant="primary"
                    >
                      Accept
                    </Button>
                  </div>
                </div>
              ))}

              {requests.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-neutral-400">No whisper requests.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhispersPage;