import { useQuery } from 'convex/react';
import { api } from '@/lib/convex';
import type { FriendRequest, SentFriendRequest } from '../types';

/**
 * Hook to fetch the current user's friend requests.
 *
 * Combines both received and sent friend requests using Convex queries.
 * Returns pending requests that the user has received and requests
 * they have sent that are still pending.
 *
 * @returns Object containing received and sent requests arrays and loading state
 *
 * @example
 * ```tsx
 * const { receivedRequests, sentRequests, isLoading } = useFriendRequests();
 *
 * if (isLoading) return <div>Loading requests...</div>;
 *
 * return (
 *   <div>
 *     <h2>Received Requests ({receivedRequests.length})</h2>
 *     {receivedRequests.map(request => (
 *       <FriendRequestCard key={request._id} request={request} />
 *     ))}
 *
 *     <h2>Sent Requests ({sentRequests.length})</h2>
 *     {sentRequests.map(request => (
 *       <SentFriendRequestCard key={request._id} request={request} />
 *     ))}
 *   </div>
 * );
 * ```
 */
export const useFriendRequests = () => {
  // Fetch received friend requests
  const receivedData = useQuery(api.friends.getPendingRequests);

  // Fetch sent friend requests
  const sentData = useQuery(api.friends.getSentRequests);

  // Transform received requests data
  const receivedRequests: FriendRequest[] = receivedData?.map(requestData => ({
    _id: requestData._id,
    userId: requestData.userId,
    friendId: requestData.friendId,
    status: requestData.status,
    createdAt: requestData.createdAt,
    updatedAt: requestData.updatedAt,
    message: requestData.message,
    sender: requestData.sender ? {
      _id: requestData.sender._id,
      username: requestData.sender.username,
      email: requestData.sender.email,
      firstName: requestData.sender.firstName,
      lastName: requestData.sender.lastName,
      friendshipId: requestData._id,
    } : undefined,
    friendshipId: requestData.friendshipId,
  })) || [];

  // Transform sent requests data
  const sentRequests: SentFriendRequest[] = sentData?.map(requestData => ({
    _id: requestData._id,
    userId: requestData.userId,
    friendId: requestData.friendId,
    status: requestData.status,
    createdAt: requestData.createdAt,
    updatedAt: requestData.updatedAt,
    message: requestData.message,
    recipient: requestData.recipient ? {
      _id: requestData.recipient._id,
      username: requestData.recipient.username,
      email: requestData.recipient.email,
      firstName: requestData.recipient.firstName,
      lastName: requestData.recipient.lastName,
      friendshipId: requestData._id,
    } : undefined,
    friendshipId: requestData.friendshipId,
  })) || [];

  return {
    receivedRequests,
    sentRequests,
    isLoading: receivedData === undefined || sentData === undefined,
  };
};