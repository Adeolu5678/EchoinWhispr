'use client';

import React, { useState, useEffect } from 'react';
import { Button, Input } from '../../../components';
import { EncryptionService, MessageObject, HCSMessagePayload } from '../../../lib/encryption';
import { IPFSService } from '../../../lib/ipfs';
import { HederaConsensusService } from '../../../lib/hedera/consensusService';
import { HederaSmartContracts } from '../../../lib/hedera/smartContracts';

// Types for inbox data
interface Conversation {
  id: string;
  with: string;
  lastMessage: string;
  timestamp: string;
  unreadCount?: number;
}

interface ConversationRequest {
  id: string;
  from: string;
  preview: string;
  timestamp: string;
  fullMessage?: string;
}

interface ChatMessage {
  id: string;
  text: string;
  timestamp: string;
  isFromMe: boolean;
  imageUrl?: string;
}

const InboxPage: React.FC = () => {
  // State management
  const [activeTab, setActiveTab] = useState<'chats' | 'requests'>('chats');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [requests, setRequests] = useState<ConversationRequest[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<ConversationRequest | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);

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

        // Load conversations and requests
        await loadConversations();
        await loadRequests();
      } catch (err) {
        console.error('Failed to initialize services:', err);
        setError('Failed to initialize messaging services');
      }
    };

    initializeServices();
  }, [consensusService]);

  const loadConversations = async () => {
    try {
      setIsLoading(true);
      // Fetch conversations from HCS/Mirror Node
      const conversationsData = await consensusService.getUserConversations();

      // Transform the data to match our interface
      const transformedConversations: Conversation[] = conversationsData.map((conv: any) => ({
        id: conv.id,
        with: conv.with,
        lastMessage: conv.lastMessage,
        timestamp: conv.timestamp,
        unreadCount: conv.unreadCount
      }));

      setConversations(transformedConversations);
    } catch (err) {
      console.error('Failed to load conversations:', err);
      setError('Failed to load conversations');
    } finally {
      setIsLoading(false);
    }
  };

  const loadRequests = async () => {
    try {
      // Fetch pending whisper requests from HCS/Mirror Node
      const requestsData = await consensusService.getPendingWhisperRequests();

      // Transform the data to match our interface
      const transformedRequests: ConversationRequest[] = requestsData.map((req: any) => ({
        id: req.id,
        from: req.from,
        preview: req.preview,
        timestamp: req.timestamp,
        fullMessage: req.fullMessage
      }));

      setRequests(transformedRequests);
    } catch (err) {
      console.error('Failed to load requests:', err);
      setError('Failed to load requests');
    }
  };

  const loadChatMessages = async (conversationId: string) => {
    try {
      // Fetch messages for the conversation from HCS/Mirror Node
      const messagesData = await consensusService.getConversationMessages(conversationId);

      // Decrypt messages and transform to match our interface
      const transformedMessages: ChatMessage[] = await Promise.all(
        messagesData.map(async (msg: any) => {
          let decryptedText = msg.text;
          try {
            // Decrypt the message if it's encrypted
            if (msg.encryptedData) {
              decryptedText = encryptionService.decryptMessageObject(msg.encryptedData);
              decryptedText = decryptedText.text_content || decryptedText;
            }
          } catch (decryptError) {
            console.warn('Failed to decrypt message:', decryptError);
            decryptedText = '[Encrypted message - decryption failed]';
          }

          return {
            id: msg.id,
            text: decryptedText,
            timestamp: msg.timestamp,
            isFromMe: msg.isFromMe,
            imageUrl: msg.imageUrl
          };
        })
      );

      setChatMessages(transformedMessages);
    } catch (err) {
      console.error('Failed to load chat messages:', err);
      setError('Failed to load messages');
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) {
      setError('Please enter a message');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Check daily limit from smart contract
      const dailyLimitReached = await smartContracts.checkDailyLimit();
      if (dailyLimitReached) {
        setShowPaywall(true);
        return;
      }

      // Get recipient's public key from smart contract
      const recipientPublicKey = await smartContracts.getUserPublicKey(selectedConversation.with);

      // Create message object
      const messageObject: MessageObject = {
        type: 'text',
        text_content: newMessage.trim(),
      };

      // Encrypt message
      const encryptedData = encryptionService.encryptMessageObject(messageObject, recipientPublicKey);

      // Upload to IPFS
      const { main_cid } = await ipfsService.uploadMessageWithImage(null, encryptedData);

      // Generate conversation ID
      const convoId = selectedConversation.id;

      // Create HCS payload
      const payload: HCSMessagePayload = {
        to_hash: await smartContracts.getUserMailHash(selectedConversation.with),
        reply_hash: '0x0000000000000000000000000000000000000000000000000000000000000000', // No reply
        from_key: encryptionService.getPublicKeyHex(),
        cid: main_cid,
        convo_id: convoId,
      };

      // Submit to HCS
      await consensusService.submitWhisperMessage(payload);

      // Add message to local state
      const newMsg: ChatMessage = {
        id: crypto.randomUUID(),
        text: newMessage.trim(),
        timestamp: new Date().toISOString(),
        isFromMe: true,
      };
      setChatMessages(prev => [...prev, newMsg]);

      // Reset form
      setNewMessage('');

      // Update conversation timestamp
      setConversations(prev => prev.map(conv =>
        conv.id === selectedConversation.id
          ? { ...conv, lastMessage: newMessage.trim(), timestamp: new Date().toISOString() }
          : conv
      ));

    } catch (err) {
      console.error('Failed to send message:', err);
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const acceptRequest = async (requestId: string) => {
    try {
      const request = requests.find(r => r.id === requestId);
      if (!request) return;

      // Move request to conversations
      const newConversation: Conversation = {
        id: crypto.randomUUID(),
        with: request.from,
        lastMessage: request.preview,
        timestamp: request.timestamp,
      };

      setConversations(prev => [newConversation, ...prev]);
      setRequests(prev => prev.filter(r => r.id !== requestId));

      // Navigate to conversation
      setSelectedConversation(newConversation);
      setSelectedRequest(null);
      await loadChatMessages(newConversation.id);

    } catch (err) {
      console.error('Failed to accept request:', err);
      setError('Failed to accept whisper request');
    }
  };

  const handleConversationClick = async (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setSelectedRequest(null);
    await loadChatMessages(conversation.id);
  };

  const handleRequestClick = (request: ConversationRequest) => {
    setSelectedRequest(request);
    setSelectedConversation(null);
  };

  const handleBack = () => {
    setSelectedConversation(null);
    setSelectedRequest(null);
    setChatMessages([]);
  };

  const subscribeWithHBAR = async () => {
    try {
      setIsLoading(true);
      await smartContracts.subscribeWithHBAR(1000000000); // 1 HBAR in tinybars
      setShowPaywall(false);
      // Refresh conversations or show success message
    } catch (err) {
      console.error('Failed to subscribe with HBAR:', err);
      setError('Failed to subscribe');
    } finally {
      setIsLoading(false);
    }
  };

  const subscribeWithHTS = async () => {
    try {
      setIsLoading(true);
      await smartContracts.subscribeWithHTS(100); // 100 HTS tokens
      setShowPaywall(false);
      // Refresh conversations or show success message
    } catch (err) {
      console.error('Failed to subscribe with HTS:', err);
      setError('Failed to subscribe');
    } finally {
      setIsLoading(false);
    }
  };

  // Render conversation view
  if (selectedConversation) {
    return (
      <div className="min-h-screen bg-neutral-900 text-white flex flex-col">
        {/* Header */}
        <div className="bg-neutral-800 p-4 border-b border-neutral-700 flex items-center">
          <button
            onClick={handleBack}
            className="mr-4 text-primary-500 hover:text-primary-400"
          >
            ←
          </button>
          <h1 className="text-xl font-bold text-neutral-100">
            Chat with {selectedConversation.with}
          </h1>
        </div>

        {/* Chat Window */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isFromMe ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  message.isFromMe
                    ? 'bg-primary-500 text-white'
                    : 'bg-neutral-800 text-neutral-100'
                }`}
              >
                {message.imageUrl && (
                  <img src={message.imageUrl} alt="Attachment" className="rounded-lg mb-2 max-w-full" />
                )}
                <p>{message.text}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div className="bg-neutral-800 p-4 border-t border-neutral-700">
          <div className="flex items-center space-x-2">
            <button className="text-primary-500 hover:text-primary-400 p-2">
              📎
            </button>
            <Input
              value={newMessage}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewMessage(e.target.value)}
              placeholder="Type your encrypted reply..."
              className="flex-1 bg-neutral-700 border-neutral-600 text-white rounded-full px-4"
              onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && sendMessage()}
            />
            <Button
              onClick={sendMessage}
              loading={isLoading}
              disabled={!newMessage.trim()}
              variant="primary"
              size="sm"
              className="rounded-full"
            >
              ✈️
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Render request view
  if (selectedRequest) {
    return (
      <div className="min-h-screen bg-neutral-900 text-white flex flex-col">
        {/* Header */}
        <div className="bg-neutral-800 p-4 border-b border-neutral-700 flex items-center">
          <button
            onClick={handleBack}
            className="mr-4 text-primary-500 hover:text-primary-400"
          >
            ←
          </button>
          <h1 className="text-xl font-bold text-neutral-100">New Whisper</h1>
        </div>

        {/* Info Box */}
        <div className="p-4">
          <div className="bg-neutral-800 rounded-lg p-4 border border-neutral-700">
            <p className="text-neutral-400 text-sm">
              This is a new Whisper. Accept to move it to your main chat list.
            </p>
          </div>
        </div>

        {/* Message Content */}
        <div className="flex-1 p-4">
          <div className="bg-neutral-900 rounded-lg p-4">
            <p className="text-neutral-100">{selectedRequest.fullMessage}</p>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-neutral-800 p-4 border-t border-neutral-700">
          <Button
            onClick={() => acceptRequest(selectedRequest.id)}
            variant="primary"
            className="w-full"
          >
            Accept Conversation
          </Button>
        </div>
      </div>
    );
  }

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
                <span className="ml-3 text-neutral-400">Please, wait while your messages are being updated...</span>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-error-500/10 border border-error-500/20 rounded-lg p-4 mb-4">
                <p className="text-error-400">{error}</p>
              </div>
            )}

            {/* Conversations List */}
            <div className="space-y-2">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => handleConversationClick(conversation)}
                  className="bg-neutral-800 rounded-lg p-4 border border-neutral-700 hover:bg-neutral-750 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-neutral-700 rounded-full flex items-center justify-center">
                        <span className="text-neutral-400 text-sm">?</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-neutral-100">{conversation.with}</h4>
                        <p className="text-sm text-neutral-400 mt-1">{conversation.lastMessage}</p>
                      </div>
                    </div>
                    <span className="text-xs text-neutral-600">
                      {new Date(conversation.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}

              {conversations.length === 0 && !isLoading && (
                <div className="text-center py-8">
                  <p className="text-neutral-400">No conversations yet. Start chatting!</p>
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
                  onClick={() => handleRequestClick(request)}
                  className="bg-neutral-800 rounded-lg p-4 border border-neutral-700 hover:bg-neutral-750 transition-colors cursor-pointer"
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
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.stopPropagation();
                        acceptRequest(request.id);
                      }}
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

      {/* Paywall Modal */}
      {showPaywall && (
        <div className="fixed inset-0 bg-neutral-900/80 flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-800 rounded-lg p-6 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="text-warning-500 text-4xl mb-4">⏰</div>
              <h2 className="text-xl font-bold text-neutral-100 mb-2">Daily Whisper Limit Reached</h2>
              <p className="text-neutral-400 text-sm mb-2">
                You have used your 5 free Whispers for today. This limit resets in 14 hours.
              </p>
              <p className="text-neutral-100 text-sm">
                To send unlimited new Whispers, get a 30-day subscription.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-neutral-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-neutral-100 font-semibold">[X] HBAR (30 Days)</span>
                </div>
                <Button
                  onClick={subscribeWithHBAR}
                  loading={isLoading}
                  variant="primary"
                  className="w-full"
                >
                  Subscribe with HBAR
                </Button>
              </div>

              <div className="bg-neutral-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-neutral-100 font-semibold">[X] HTS (30 Days)</span>
                </div>
                <Button
                  onClick={subscribeWithHTS}
                  loading={isLoading}
                  variant="primary"
                  className="w-full"
                >
                  Subscribe with HTS
                </Button>
              </div>

              <button
                onClick={() => setShowPaywall(false)}
                className="w-full text-neutral-400 hover:text-neutral-300 text-sm underline"
              >
                No thanks, I&apos;ll wait.
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InboxPage;