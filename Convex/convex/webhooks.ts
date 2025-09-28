import { action, ActionCtx } from './_generated/server';
import { api } from './_generated/api';
import { v } from 'convex/values';
import { Webhook } from 'svix';
import { WebhookEvent, UserJSON } from '@clerk/clerk-sdk-node';

// Webhook handler for Clerk events
export const clerkWebhook = action({
  args: {
    body: v.string(),
    headers: v.any(),
  },
  handler: async (ctx, args) => {
    const { body, headers } = args;

    // Verify webhook signature for security
    const event = await verifyWebhookSignature(body, headers);
    if (!event) {
      console.error('Invalid webhook signature');
      throw new Error('Unauthorized webhook request');
    }

    try {
      const { type, data } = event;

      console.log(`Received Clerk webhook: ${type}`);

      switch (type) {
        case 'user.created':
          await handleUserCreated(ctx, data);
          break;
        case 'user.updated':
          await handleUserUpdated(ctx, data);
          break;
    case "user.deleted":
      {
        const data: UserDeletedEventData = {
          id: event.data.id,
          deleted: event.data.deleted,
          object: "user",
        };
        await handleUserDeleted(ctx, data);
      }
      break;
        default:
          console.log(`Unhandled webhook event type: ${type}`);
      }

      return { success: true, eventType: type };
    } catch (error) {
      console.error('Error processing webhook:', error);
      throw new Error('Failed to process webhook');
    }
  },
});

/**
 * Verify a Clerk webhook by validating Svix signatures and return the parsed event.
 *
 * @param body - The raw request body used for signature verification
 * @param headers - Request headers expected to include `svix-id`, `svix-timestamp`, and `svix-signature`
 * @returns The verified `WebhookEvent` when the webhook secret is configured and the Svix headers and signature are valid, `null` otherwise
 */
async function verifyWebhookSignature(
  body: string,
  headers: Record<string, string | string[] | undefined>
): Promise<WebhookEvent | null> {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('CLERK_WEBHOOK_SECRET not configured');
    return null;
  }

  const svix_id = headers['svix-id'] as string;
  const svix_timestamp = headers['svix-timestamp'] as string;
  const svix_signature = headers['svix-signature'] as string;

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return null;
  }

  const wh = new Webhook(webhookSecret);

  try {
    const event = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
    return event;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return null;
  }
}

/**
 * Create or update an application user from Clerk 'user.created' webhook data.
 *
 * If the Clerk payload lacks a primary email address the function logs an error and returns without creating a user.
 *
 * @param userData - Clerk user payload (contains `id`, `email_addresses`, `first_name`, `last_name`, `username`) from the webhook event
 * @throws Rethrows any error encountered while running the mutation to create or update the user
 */
async function handleUserCreated(ctx: ActionCtx, userData: UserJSON) {
  try {
    const {
      id: clerkId,
      email_addresses,
      first_name,
      last_name,
      username,
    } = userData;

    // Extract primary email
    const primaryEmail = email_addresses?.[0]?.email_address;
    if (!primaryEmail) {
      console.error('No email found for user:', clerkId);
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
    console.error('Error handling user creation:', error);
    throw error;
  }
}

/**
 * Processes a Clerk user update event and creates or updates the corresponding application user record.
 *
 * Extracts the primary email from the Clerk user data, derives a username from the email if none is provided,
 * and calls the back-end mutation to create or update the user. If no primary email is present, the function logs
 * and returns without making changes.
 *
 * @param userData - Clerk `UserJSON` payload containing user fields such as `id`, `email_addresses`, `first_name`, `last_name`, and `username`
 * @throws Rethrows any error encountered while running the create-or-update mutation or during processing
 */
async function handleUserUpdated(ctx: ActionCtx, userData: UserJSON) {
  try {
    const {
      id: clerkId,
      email_addresses,
      first_name,
      last_name,
      username,
    } = userData;

    // Extract primary email
    const primaryEmail = email_addresses?.[0]?.email_address;
    if (!primaryEmail) {
      console.error('No email found for user:', clerkId);
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
    console.error('Error handling user update:', error);
    throw error;
  }
}

interface UserDeletedEventData {
  id?: string;
  object: 'user';
  deleted: boolean;
}

/**
 * Handle a Clerk user deletion event by locating the local user and logging a deletion request.
 *
 * Validates that the webhook payload contains a Clerk user ID, looks up the corresponding local
 * user by that Clerk ID, logs when no matching user is found, and logs a deletion request when
 * a matching user is present. This function does not perform any deletion by itself.
 *
 * @param userData - Event data from Clerk; expected to include `id` (the Clerk user ID)
 * @throws Error when the Clerk user ID (`id`) is undefined in `userData`
 * @throws Any error encountered while querying or processing the user lookup
 */
async function handleUserDeleted(
  ctx: ActionCtx,
  userData: UserDeletedEventData
) {
  try {
    const { id: clerkId } = userData;
    if (clerkId === undefined) {
      throw new Error("Clerk ID is undefined in webhook event data.");
    }

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
    console.error('Error handling user deletion:', error);
    throw error;
  }
}

/**
 * Create a username derived from an email address.
 *
 * @param email - The email address to derive the username from
 * @returns The local part of `email` with all non-alphanumeric characters removed and converted to lowercase
 */
function generateUsernameFromEmail(email: string): string {
  const [localPart] = email.split('@');
  // Remove special characters and ensure uniqueness
  return localPart.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
}
