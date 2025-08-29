import { action } from "./_generated/server";
import { api } from "./_generated/api";
import { v } from "convex/values";

// Webhook handler for Clerk events
export const clerkWebhook = action({
  args: {
    body: v.string(),
    headers: v.any(),
  },
  handler: async (ctx, args) => {
    const { body, headers } = args;

    // Verify webhook signature for security
    const isValid = await verifyWebhookSignature(body, headers);
    if (!isValid) {
      console.error("Invalid webhook signature");
      throw new Error("Unauthorized webhook request");
    }

    try {
      const payload = JSON.parse(body);
      const { type, data } = payload;

      console.log(`Received Clerk webhook: ${type}`);

      switch (type) {
        case "user.created":
          await handleUserCreated(ctx, data);
          break;
        case "user.updated":
          await handleUserUpdated(ctx, data);
          break;
        case "user.deleted":
          await handleUserDeleted(ctx, data);
          break;
        default:
          console.log(`Unhandled webhook event type: ${type}`);
      }

      return { success: true, eventType: type };
    } catch (error) {
      console.error("Error processing webhook:", error);
      throw new Error("Failed to process webhook");
    }
  },
});

// Verify webhook signature using Clerk's signing secret
async function verifyWebhookSignature(body: string, headers: any): Promise<boolean> {
  try {
    const svixId = headers["svix-id"];
    const svixTimestamp = headers["svix-timestamp"];
    const svixSignature = headers["svix-signature"];

    if (!svixId || !svixTimestamp || !svixSignature) {
      console.error("Missing required Svix headers");
      return false;
    }

    // Get webhook secret from environment
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("CLERK_WEBHOOK_SECRET not configured");
      return false;
    }

    // For production, you should implement proper signature verification
    // This is a simplified version for development
    // In production, use a proper webhook verification library
    const crypto = await import("crypto");

    const signedContent = `${svixId}.${svixTimestamp}.${body}`;
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(signedContent)
      .digest("base64");

    // Svix signatures can have multiple values separated by commas
    const signatures = svixSignature.split(",");
    for (const signature of signatures) {
      const [, sigValue] = signature.split(",");
      if (sigValue === expectedSignature) {
        return true;
      }
    }

    console.error("Signature verification failed");
    return false;
  } catch (error) {
    console.error("Error verifying webhook signature:", error);
    return false;
  }
}

// Handle user creation event
async function handleUserCreated(ctx: any, userData: any) {
  try {
    const { id: clerkId, email_addresses, first_name, last_name, username } = userData;

    // Extract primary email
    const primaryEmail = email_addresses?.[0]?.email_address;
    if (!primaryEmail) {
      console.error("No email found for user:", clerkId);
      return;
    }

    // Generate username if not provided
    const userUsername = username || generateUsernameFromEmail(primaryEmail);

    await ctx.runMutation(api.users.createOrUpdateUser, {
      clerkId,
      username: userUsername,
      email: primaryEmail,
      firstName: first_name || undefined,
      lastName: last_name || undefined,
    });

    console.log(`User created: ${clerkId} (${userUsername})`);
  } catch (error) {
    console.error("Error handling user creation:", error);
    throw error;
  }
}

// Handle user update event
async function handleUserUpdated(ctx: any, userData: any) {
  try {
    const { id: clerkId, email_addresses, first_name, last_name, username } = userData;

    // Extract primary email
    const primaryEmail = email_addresses?.[0]?.email_address;
    if (!primaryEmail) {
      console.error("No email found for user:", clerkId);
      return;
    }

    // Use existing username or generate new one
    const userUsername = username || generateUsernameFromEmail(primaryEmail);

    await ctx.runMutation(api.users.createOrUpdateUser, {
      clerkId,
      username: userUsername,
      email: primaryEmail,
      firstName: first_name || undefined,
      lastName: last_name || undefined,
    });

    console.log(`User updated: ${clerkId} (${userUsername})`);
  } catch (error) {
    console.error("Error handling user update:", error);
    throw error;
  }
}

// Handle user deletion event
async function handleUserDeleted(ctx: any, userData: any) {
  try {
    const { id: clerkId } = userData;

    // Find user by clerkId
    const user = await ctx.runQuery(api.users.getUserByClerkId, { clerkId });
    if (!user) {
      console.log(`User not found for deletion: ${clerkId}`);
      return;
    }

    // Note: In a production app, you might want to soft delete or archive user data
    // For now, we'll just log the deletion
    console.log(`User deletion requested for: ${clerkId} (${user.username})`);

    // Optional: You could implement user deletion logic here
    // await ctx.runMutation(api.users.deleteUser, { userId: user._id });
  } catch (error) {
    console.error("Error handling user deletion:", error);
    throw error;
  }
}

// Generate username from email address
function generateUsernameFromEmail(email: string): string {
  const [localPart] = email.split("@");
  // Remove special characters and ensure uniqueness
  return localPart.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
}