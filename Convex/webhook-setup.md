# Clerk Webhook Integration Setup Guide

This guide explains how to configure Clerk webhooks to sync user data with your Convex backend.

## Overview

The webhook integration handles the following Clerk events:
- `user.created` - When a new user signs up
- `user.updated` - When user profile information is updated
- `user.deleted` - When a user account is deleted

## Webhook Endpoint URL

Your webhook endpoint URL should be:
```
https://youthful-sandpiper-909.convex.cloud/actions/webhooks:clerkWebhook
```

**Note:** This is your production deployment URL. For development, use:
```
https://gregarious-puma-353.convex.cloud/actions/webhooks:clerkWebhook
```

## Clerk Dashboard Configuration

1. Go to your [Clerk Dashboard](https://dashboard.clerk.com/)
2. Navigate to **Webhooks** in the sidebar
3. Click **Add Endpoint**
4. Enter the webhook endpoint URL from above
5. Select the following events:
   - `user.created`
   - `user.updated`
   - `user.deleted`
6. Click **Create**

## Webhook Secret Configuration

1. After creating the webhook endpoint, Clerk will provide a **Signing Secret**
2. Copy this secret
3. Update your `Convex/.env.local` file:
   ```env
   CLERK_WEBHOOK_SECRET=your_actual_webhook_secret_here
   ```
4. **Important:** Never commit the webhook secret to version control

## Environment Variables

Make sure your `Convex/.env.local` file contains:

```env
# Clerk webhook configuration
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret_here
```

## Testing the Integration

1. Deploy your Convex functions:
   ```bash
   cd Convex
   npx convex deploy
   ```

2. In Clerk Dashboard, you can send test events to verify the webhook is working

3. Check Convex logs for webhook processing:
   ```bash
   npx convex logs
   ```

## Security Features

- **Signature Verification**: All webhook requests are verified using HMAC-SHA256
- **Event Validation**: Only configured events are processed
- **Error Handling**: Failed webhook processing is logged and handled gracefully

## Troubleshooting

### Common Issues

1. **Invalid Signature Error**
   - Verify the `CLERK_WEBHOOK_SECRET` is correctly set
   - Ensure the secret matches exactly what Clerk provided

2. **Webhook Not Receiving Events**
   - Check that the endpoint URL is correct
   - Verify the webhook is enabled in Clerk Dashboard
   - Ensure the selected events match what you're testing

3. **User Data Not Syncing**
   - Check Convex logs for error messages
   - Verify the user schema matches Clerk's user object structure
   - Ensure the webhook action is properly deployed

### Debugging

Enable debug logging by checking the Convex dashboard logs:
```bash
npx convex dashboard
```

## User Data Mapping

The webhook maps Clerk user data to Convex users table:

| Clerk Field | Convex Field | Notes |
|-------------|-------------|-------|
| `id` | `clerkId` | Clerk's unique user identifier |
| `email_addresses[0].email_address` | `email` | Primary email address |
| `username` or generated | `username` | Username (generated from email if not provided) |
| `first_name` | `firstName` | Optional |
| `last_name` | `lastName` | Optional |

## Production Deployment

For production deployment:

1. Update the webhook URL to use your production Convex deployment
2. Set the webhook secret in your production environment
3. Test thoroughly with production Clerk instance
4. Monitor webhook delivery in Clerk Dashboard

## Support

If you encounter issues:
1. Check Convex logs for detailed error messages
2. Verify webhook configuration in Clerk Dashboard
3. Ensure environment variables are properly set
4. Test with Clerk's webhook testing tools