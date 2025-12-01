'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { useParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Id } from '@convex/_generated/dataModel';
import { Send, User, Hash } from 'lucide-react';
import Link from 'next/link';

export default function WorkspacePage() {
  const params = useParams();
  const workspaceId = params.id as Id<'workspaces'>;
  
  const user = useQuery(api.users.getCurrentUser);
  const workspace = useQuery((api as any).workspaces.get, { id: workspaceId });
  const messages = useQuery((api as any).messages.list, { workspaceId }) || [];
  const sendMessage = useMutation((api as any).messages.send);

  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!workspace || !user) return null;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    await sendMessage({
      workspaceId,
      content: newMessage,
    });
    setNewMessage('');
  };

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="p-4 border-b border-slate-800">
          <h1 className="font-bold text-lg truncate">{workspace.name}</h1>
          <Link href={`/projects/${workspace.projectId}`} className="text-xs text-indigo-400 hover:text-indigo-300">
            View Project
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-6">
            <h2 className="text-xs font-semibold text-slate-500 uppercase mb-2">Channels</h2>
            <div className="flex items-center gap-2 px-2 py-1.5 bg-slate-800/50 rounded text-slate-200 text-sm">
              <Hash className="w-4 h-4 text-slate-400" />
              general
            </div>
          </div>

          <div>
            <h2 className="text-xs font-semibold text-slate-500 uppercase mb-2">Members</h2>
            <div className="space-y-1">
              {workspace.members?.map((memberId: any) => (
                <MemberItem key={memberId} memberId={memberId} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="h-14 border-b border-slate-800 flex items-center px-6 bg-slate-900/50 backdrop-blur-sm">
          <Hash className="w-5 h-5 text-slate-400 mr-2" />
          <span className="font-bold">general</span>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg: any) => (
            <MessageItem key={msg._id} message={msg} currentUserId={user._id} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Message #general"
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 outline-none"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function MemberItem({ memberId }: { memberId: Id<'users'> }) {
  const user = useQuery(api.users.getUser, { id: memberId });
  if (!user) return null;

  return (
    <div className="flex items-center gap-2 px-2 py-1.5 text-slate-300 text-sm hover:bg-slate-800/50 rounded cursor-pointer">
      <div className={`w-2 h-2 rounded-full ${user.role === 'entrepreneur' ? 'bg-indigo-500' : 'bg-emerald-500'}`} />
      {user.firstName || user.username}
    </div>
  );
}

function MessageItem({ message, currentUserId }: any) {
  const sender = useQuery(api.users.getUser, { id: message.senderId });
  const isMe = message.senderId === currentUserId;

  if (!sender) return null;

  return (
    <div className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0 overflow-hidden">
        {sender.avatarUrl ? (
          <img src={sender.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          <User className="w-4 h-4 text-slate-400" />
        )}
      </div>
      <div className={`max-w-[70%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-sm font-medium text-slate-200">{sender.firstName || sender.username}</span>
          <span className="text-xs text-slate-500">{new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <div className={`px-4 py-2 rounded-2xl text-sm ${
          isMe ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-200 rounded-tl-none'
        }`}>
          {message.content}
        </div>
      </div>
    </div>
  );
}
