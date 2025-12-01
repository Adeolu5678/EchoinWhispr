'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@/lib/convex';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Send, Image as ImageIcon } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Id } from '@/lib/convex';
import Image from 'next/image';

export default function ConversationPage() {
  const params = useParams();
  const conversationId = params.id as Id<'conversations'>;
  
  const user = useQuery(api.users.getCurrentUser);
  const conversation = useQuery(api.conversations.getConversation, { conversationId });
  const messages = useQuery(api.conversations.getMessages, { conversationId });
  
  const sendMessage = useMutation(api.conversations.sendMessage);

  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (conversation === undefined || messages === undefined || user === undefined) {
    return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading...</div>;
  }

  if (conversation === null) {
    return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Conversation not found.</div>;
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await sendMessage({
        conversationId,
        content: newMessage,
      });
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 p-4 flex items-center">
        <Link href="/dashboard" className="text-slate-400 hover:text-white mr-4 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-bold text-white">
            {conversation.type === 'direct' ? 'Direct Message' : 
             conversation.type === 'interview' ? 'Interview Chat' : 'Conversation'}
          </h1>
          <p className="text-xs text-slate-500">
            ID: {conversation._id.slice(0, 8)}...
          </p>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-slate-500 mt-10">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === user?._id;
            return (
              <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] rounded-lg p-3 ${
                  isMe ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-slate-800 text-slate-200 rounded-bl-none'
                }`}>
                  {msg.imageUrl && (
                    <Image 
                      src={msg.imageUrl} 
                      alt="Attachment" 
                      width={300} 
                      height={200} 
                      className="max-w-full rounded mb-2 h-auto" 
                    />
                  )}
                  <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                  <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-indigo-200' : 'text-slate-400'}`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-slate-900 border-t border-slate-800 p-4">
        <form onSubmit={handleSendMessage} className="flex gap-2 max-w-4xl mx-auto">
          <button 
            type="button"
            className="p-2 text-slate-400 hover:text-white transition-colors"
            title="Upload Image (Coming Soon)"
          >
            <ImageIcon className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-slate-950 border border-slate-700 rounded-full px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
          />
          <button 
            type="submit"
            disabled={!newMessage.trim()}
            className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}