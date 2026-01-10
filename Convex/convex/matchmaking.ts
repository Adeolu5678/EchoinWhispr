import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

/**
 * Interest-Based Matchmaking Module
 * 
 * Matches users based on overlapping interests using a weighted scoring algorithm:
 * - Shared Interests: ×3 weight
 * - Same Career: ×2 weight
 * - Compatible Mood: ×1 weight
 */

// Helper function to calculate match score between two users
function calculateMatchScore(
  user1: {
    interests?: string[];
    career?: string;
    mood?: string;
  },
  user2: {
    interests?: string[];
    career?: string;
    mood?: string;
  }
): { score: number; sharedInterests: string[] } {
  let score = 0;
  const sharedInterests: string[] = [];

  // Calculate shared interests (×3 weight each)
  const user1Interests = user1.interests || [];
  const user2Interests = user2.interests || [];
  
  for (const interest of user1Interests) {
    if (user2Interests.includes(interest.toLowerCase()) || 
        user2Interests.some(i => i.toLowerCase() === interest.toLowerCase())) {
      sharedInterests.push(interest);
      score += 3;
    }
  }

  // Same career bonus (×2)
  if (user1.career && user2.career && 
      user1.career.toLowerCase() === user2.career.toLowerCase()) {
    score += 2;
  }

  // Compatible mood bonus (×1)
  if (user1.mood && user2.mood) {
    // Same mood = full bonus
    if (user1.mood === user2.mood) {
      score += 1;
    }
    // Complementary moods (e.g., mentor matching)
    const complementaryMoods: Record<string, string[]> = {
      'anxious': ['calm', 'supportive'],
      'curious': ['knowledgeable', 'excited'],
      'lonely': ['friendly', 'outgoing'],
      'motivated': ['ambitious', 'driven'],
    };
    if (complementaryMoods[user1.mood]?.includes(user2.mood)) {
      score += 0.5;
    }
  }

  return { score, sharedInterests };
}

// Find a compatible random match for the current user
export const findRandomMatch = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get current user
    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!currentUser) {
      throw new Error("User not found");
    }

    // Get recent matches (last 24 hours) to avoid repeats
    const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
    const recentMatches = await ctx.db
      .query("matchHistory")
      .withIndex("by_user_time", (q) => 
        q.eq("userId", currentUser._id).gt("createdAt", twentyFourHoursAgo)
      )
      .collect();
    
    const recentMatchedIds = new Set(recentMatches.map(m => m.matchedUserId));

    // Get active users (optimizing: recently updated users only)
    const allUsers = await ctx.db
      .query("users")
      .withIndex("by_updated_at")
      .order("desc")
      .take(100); // Limit to 100 active users for performance
    const eligibleUsers = allUsers.filter(u => 
      u._id !== currentUser._id && 
      !recentMatchedIds.has(u._id) &&
      (u.interests?.length ?? 0) > 0 // Only users with interests
    );

    if (eligibleUsers.length === 0) {
      return null; // No eligible matches
    }

    // Calculate scores for all eligible users
    const scoredUsers = eligibleUsers.map(user => ({
      user,
      ...calculateMatchScore(currentUser, user)
    }));

    // Sort by score descending
    scoredUsers.sort((a, b) => b.score - a.score);

    // Get top 10 and randomly select one for variety
    const topMatches = scoredUsers.slice(0, Math.min(10, scoredUsers.length));
    const randomIndex = Math.floor(Math.random() * topMatches.length);
    const selectedMatch = topMatches[randomIndex];

    // Record the match
    await ctx.db.insert("matchHistory", {
      userId: currentUser._id,
      matchedUserId: selectedMatch.user._id,
      score: selectedMatch.score,
      sharedInterests: selectedMatch.sharedInterests,
      createdAt: Date.now(),
    });

    // Return match info (without revealing identity)
    return {
      matchId: selectedMatch.user._id,
      score: selectedMatch.score,
      sharedInterests: selectedMatch.sharedInterests,
      matchCareer: selectedMatch.user.career,
      matchMood: selectedMatch.user.mood,
      // Don't return username or other identifying info
    };
  },
});

// Get recent match history for the user
export const getRecentMatches = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!currentUser) {
      return [];
    }

    const limit = args.limit || 10;
    const matches = await ctx.db
      .query("matchHistory")
      .withIndex("by_user", (q) => q.eq("userId", currentUser._id))
      .order("desc")
      .take(limit);

    return matches;
  },
});

// Check if user has already been matched with another user today
export const hasRecentlyMatched = query({
  args: {
    targetUserId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return false;
    }

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!currentUser) {
      return false;
    }

    const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
    const recentMatch = await ctx.db
      .query("matchHistory")
      .withIndex("by_user_time", (q) => 
        q.eq("userId", currentUser._id).gt("createdAt", twentyFourHoursAgo)
      )
      .filter((q) => q.eq(q.field("matchedUserId"), args.targetUserId))
      .first();

    return recentMatch !== null;
  },
});

// Get match statistics for the user
export const getMatchStats = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!currentUser) {
      return null;
    }

    const allMatches = await ctx.db
      .query("matchHistory")
      .withIndex("by_user", (q) => q.eq("userId", currentUser._id))
      .collect();

    // Calculate stats
    const totalMatches = allMatches.length;
    const avgScore = totalMatches > 0 
      ? allMatches.reduce((sum, m) => sum + m.score, 0) / totalMatches 
      : 0;
    
    // Find most common shared interests
    const interestCounts: Record<string, number> = {};
    allMatches.forEach(m => {
      m.sharedInterests?.forEach(interest => {
        interestCounts[interest] = (interestCounts[interest] || 0) + 1;
      });
    });
    
    const topInterests = Object.entries(interestCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([interest]) => interest);

    // Matches in last 7 days
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const weeklyMatches = allMatches.filter(m => m.createdAt > weekAgo).length;

    return {
      totalMatches,
      avgScore: Math.round(avgScore * 10) / 10,
      topInterests,
      weeklyMatches,
    };
  },
});
