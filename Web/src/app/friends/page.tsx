'use client';

import { useState } from 'react';
import { Users, UserPlus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FEATURE_FLAGS } from '@/config/featureFlags';
import { FriendsList } from '@/features/friends/components';
import { useFriends, useFriendRequests, useRemoveFriend, useAcceptFriendRequest, useRejectFriendRequest } from '@/features/friends/hooks';
import { Id } from '@/lib/convex';

/**
 * Friends page component that displays friends management interface.
 *
 * Shows tabs for Friends list and Friend Requests. Only renders if FRIENDS
 * feature flag is enabled. Uses Shadcn UI components for consistent styling.
 *
 * @returns The friends page component or null if feature is disabled
 */
export default function FriendsPage() {
  const [activeTab, setActiveTab] = useState('friends');

  // Only render if feature flag is enabled
  if (!FEATURE_FLAGS.FRIENDS) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Feature Not Available</h2>
          <p className="text-gray-600">This feature is currently disabled.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Friends</h1>
        <p className="text-gray-600">Manage your friends and friend requests</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="friends" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Friends
          </TabsTrigger>
          <TabsTrigger value="requests" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Requests
          </TabsTrigger>
          <TabsTrigger value="find" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Find Friends
          </TabsTrigger>
        </TabsList>

        <TabsContent value="friends" className="mt-6">
          <FriendsTab />
        </TabsContent>

        <TabsContent value="requests" className="mt-6">
          <RequestsTab />
        </TabsContent>

        <TabsContent value="find" className="mt-6">
          <FindFriendsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

/**
 * Friends tab component showing the user's friends list.
 */
function FriendsTab() {
  const { friends, isLoading } = useFriends();
  const { removeFriend } = useRemoveFriend();

  const handleRemoveFriend = async (friendshipId: string) => {
    try {
      await removeFriend(friendshipId as Id<'friends'>);
    } catch (error) {
      // Error handling is done in the hook
      console.error('Failed to remove friend:', error);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Friends</h2>
      <FriendsList
        friends={friends}
        onRemoveFriend={handleRemoveFriend}
        isLoading={isLoading}
      />
    </div>
  );
}

/**
 * Requests tab component showing friend requests.
 */
function RequestsTab() {
  const { receivedRequests, sentRequests, isLoading } = useFriendRequests();
  const { acceptFriendRequest } = useAcceptFriendRequest();
  const { rejectFriendRequest } = useRejectFriendRequest();

  const handleAcceptRequest = async (requestId: string) => {
    try {
      await acceptFriendRequest(requestId as Id<'friends'>);
    } catch (error) {
      console.error('Failed to accept friend request:', error);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      await rejectFriendRequest(requestId as Id<'friends'>);
    } catch (error) {
      console.error('Failed to reject friend request:', error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Received Requests */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Received Requests</h3>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(2)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="h-20 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : receivedRequests.length === 0 ? (
          <div className="text-center py-8">
            <UserPlus className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">No pending friend requests</p>
          </div>
        ) : (
          <div className="space-y-4">
            {receivedRequests.map((request) => (
              <FriendRequestCard
                key={request.friendshipId}
                request={request}
                onAccept={handleAcceptRequest}
                onReject={handleRejectRequest}
                isAccepting={false} // TODO: Implement individual loading states
                isRejecting={false}
              />
            ))}
          </div>
        )}
      </div>

      {/* Sent Requests */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Sent Requests</h3>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(2)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="h-20 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : sentRequests.length === 0 ? (
          <div className="text-center py-8">
            <UserPlus className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">No sent friend requests</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sentRequests.map((request) => (
              <div key={request.friendshipId} className="p-4 border rounded-lg bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium">{request.recipient?.username || 'Unknown User'}</p>
                      <p className="text-sm text-gray-500">Request sent</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">Pending</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Find Friends tab component for discovering new friends.
 */
function FindFriendsTab() {
  return (
    <div className="text-center py-12">
      <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Find Friends</h3>
      <p className="text-gray-500 mb-6">
        Search for users to send friend requests and grow your network.
      </p>
      {/* TODO: Integrate UserSearch component here */}
      <div className="text-sm text-gray-400">
        User search component will be integrated here
      </div>
    </div>
  );
}

// Import FriendRequestCard here to avoid circular imports
import { FriendRequestCard } from '@/features/friends/components';
