import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Send an echo request to initiate conversation evolution
 * This is a placeholder function for the deferred CONVERSATION_EVOLUTION feature
 */
export const sendEchoRequest = mutation({
  args: {
    whisperId: v.id("whispers"),
  },
  handler: async (ctx, args) => {
    // Placeholder implementation - feature is disabled for MVP
    // TODO: Implement when CONVERSATION_EVOLUTION feature flag is enabled
    throw new Error("Conversation evolution feature is not yet implemented");
  },
});

/**
 * Accept an echo request to reveal identities and start conversation
 * This is a placeholder function for the deferred CONVERSATION_EVOLUTION feature
 */
export const acceptEchoRequest = mutation({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    // Placeholder implementation - feature is disabled for MVP
    // TODO: Implement when CONVERSATION_EVOLUTION feature flag is enabled
    throw new Error("Conversation evolution feature is not yet implemented");
  },
});

/**
 * Reject an echo request to decline conversation evolution
 * This is a placeholder function for the deferred CONVERSATION_EVOLUTION feature
 */
export const rejectEchoRequest = mutation({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    // Placeholder implementation - feature is disabled for MVP
    // TODO: Implement when CONVERSATION_EVOLUTION feature flag is enabled
    throw new Error("Conversation evolution feature is not yet implemented");
  },
});

/**
 * Get pending echo requests for the current user
 * This is a placeholder function for the deferred CONVERSATION_EVOLUTION feature
 */
export const getEchoRequests = query({
  args: {},
  handler: async (ctx) => {
    // Placeholder implementation - feature is disabled for MVP
    // TODO: Implement when CONVERSATION_EVOLUTION feature flag is enabled
    return [];
  },
});