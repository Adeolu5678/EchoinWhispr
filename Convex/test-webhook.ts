// Test script for Clerk webhook integration
// Run with: node test-webhook.ts

import * as crypto from 'crypto';

// Define interfaces for type safety
interface EmailAddress {
  id: string;
  object: string;
  email_address: string;
  verification: {
    status: string;
  };
}

interface TestUserData {
  id: string;
  object: string;
  created_at: number;
  updated_at: number;
  email_addresses: EmailAddress[];
  first_name: string;
  last_name: string;
  username: string;
}

interface TestPayload {
  type: string;
  data: TestUserData;
}

interface SignatureResult {
  signature: string;
  svixId: string;
  svixTimestamp: string;
  body: string;
}

// Test data simulating a Clerk user.created event
const testUserData: TestUserData = {
  id: 'user_2abc123def456',
  object: 'user',
  created_at: Date.now(),
  updated_at: Date.now(),
  email_addresses: [
    {
      id: 'idn_2abc123def456',
      object: 'email_address',
      email_address: 'test@example.com',
      verification: {
        status: 'verified',
      },
    },
  ],
  first_name: 'Test',
  last_name: 'User',
  username: 'testuser',
};

const testPayload: TestPayload = {
  type: 'user.created',
  data: testUserData,
};

// Simulate webhook signature generation
function generateTestSignature(payload: TestPayload, secret: string): SignatureResult {
  const svixId = 'msg_1234567890';
  const svixTimestamp = Math.floor(Date.now() / 1000).toString();
  const body = JSON.stringify(payload);

  const signedContent = `${svixId}.${svixTimestamp}.${body}`;
  const signature = crypto
    .createHmac('sha256', secret)
    .update(signedContent)
    .digest('base64');

  return {
    signature: `v1,${signature}`,
    svixId,
    svixTimestamp,
    body,
  };
}

// Test the webhook signature generation
function testWebhookSignature(): void {
  const secret = process.env.CLERK_WEBHOOK_SECRET || 'test_secret_key';

  console.log('=== Webhook Signature Test ===');
  console.log('Test Payload:', JSON.stringify(testPayload, null, 2));
  console.log('');

  const { signature, svixId, svixTimestamp, body } = generateTestSignature(
    testPayload,
    secret
  );

  console.log('Generated Signature Components:');
  console.log('- Svix ID:', svixId);
  console.log('- Svix Timestamp:', svixTimestamp);
  console.log('- Signature:', signature);
  console.log('');

  // Simulate verification
  const signedContent = `${svixId}.${svixTimestamp}.${body}`;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(signedContent)
    .digest('base64');

  console.log('Verification Test:');
  console.log('- Expected Signature:', expectedSignature);
  console.log('- Signature Valid:', signature.includes(expectedSignature));
  console.log('');

  console.log('=== Test Headers for Manual Testing ===');
  console.log(`svix-id: ${svixId}`);
  console.log(`svix-timestamp: ${svixTimestamp}`);
  console.log(`svix-signature: ${signature}`);
  console.log('');

  console.log('=== Test Body ===');
  console.log(body);
}

// Instructions for testing
function printInstructions(): void {
  console.log('=== Testing Instructions ===');
  console.log('');
  console.log('1. Set your CLERK_WEBHOOK_SECRET environment variable:');
  console.log('   export CLERK_WEBHOOK_SECRET=your_actual_secret');
  console.log('');
  console.log('2. Run this test script:');
  console.log('   node test-webhook.ts');
  console.log('');
  console.log(
    '3. Use the generated headers and body to test your webhook endpoint'
  );
  console.log('');
  console.log('4. Test with curl:');
  console.log(
    `   curl -X POST https://your-convex-deployment.convex.cloud/actions/webhooks:clerkWebhook \\`
  );
  console.log(`        -H "Content-Type: application/json" \\`);
  console.log(`        -H "svix-id: msg_1234567890" \\`);
  console.log(`        -H "svix-timestamp: 1234567890" \\`);
  console.log(`        -H "svix-signature: v1,generated_signature" \\`);
  console.log(`        -d '${JSON.stringify(testPayload)}'`);
  console.log('');
  console.log('5. Check Convex logs for processing results:');
  console.log('   npx convex logs');
}

// Run tests
if (import.meta.url === `file://${process.argv[1]}`) {
  testWebhookSignature();
  console.log('');
  printInstructions();
}

export { generateTestSignature, testUserData, testPayload };