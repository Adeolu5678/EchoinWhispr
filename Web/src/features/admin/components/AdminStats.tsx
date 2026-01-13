'use client';

import { Users, MessageSquare, Shield, Clock, Activity, UserPlus } from 'lucide-react';

interface AdminStatsProps {
  stats: {
    totalUsers: number;
    totalWhispers: number;
    whispersToday: number;
    pendingAdminRequests: number;
    totalAdmins: number;
    activeConversations: number;
  } | null;
  isLoading: boolean;
}

export function AdminStats({ stats, isLoading }: AdminStatsProps) {
  const statCards = [
    {
      label: 'Total Users',
      value: stats?.totalUsers ?? 0,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
    },
    {
      label: 'Total Whispers',
      value: stats?.totalWhispers ?? 0,
      icon: MessageSquare,
      color: 'from-purple-500 to-purple-600',
    },
    {
      label: 'Whispers Today',
      value: stats?.whispersToday ?? 0,
      icon: Activity,
      color: 'from-green-500 to-green-600',
    },
    {
      label: 'Pending Requests',
      value: stats?.pendingAdminRequests ?? 0,
      icon: Clock,
      color: 'from-amber-500 to-amber-600',
    },
    {
      label: 'Total Admins',
      value: stats?.totalAdmins ?? 0,
      icon: Shield,
      color: 'from-red-500 to-red-600',
    },
    {
      label: 'Active Conversations',
      value: stats?.activeConversations ?? 0,
      icon: UserPlus,
      color: 'from-cyan-500 to-cyan-600',
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="glass rounded-xl p-4 animate-pulse border border-white/10"
          >
            <div className="h-8 w-8 bg-white/10 rounded-lg mb-3" />
            <div className="h-6 w-16 bg-white/10 rounded mb-1" />
            <div className="h-4 w-20 bg-white/10 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statCards.map((stat) => (
        <div
          key={stat.label}
          className="glass rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300 group"
        >
          <div
            className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
          >
            <stat.icon className="w-5 h-5 text-white" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {stat.value.toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
