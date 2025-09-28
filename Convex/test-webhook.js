// Test script for Clerk webhook integration
// Run with: node test-webhook.js

const crypto = require('crypto');

// Test data simulating a Clerk user.created event
const testUserData = {
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

const testPayload = {
  type: 'user.created',
  data: testUserData,
};

/**
 * Create a Svix-style test webhook signature and corresponding header values for a payload.
 * @param {Object} payload - The webhook payload to be serialized and signed.
 * @param {string} secret - The secret used to compute the HMAC-SHA256 signature.
 * @returns {{signature: string, svixId: string, svixTimestamp: string, body: string}} Object with:
 *  - `signature`: header-ready signature in the format `v1,<base64_signature>`,
 *  - `svixId`: fixed message id used in the signed content,
 *  - `svixTimestamp`: Unix timestamp (seconds) used in the signed content,
 *  - `body`: JSON stringified payload used to compute the signature.
 */
function generateTestSignature(payload, secret) {
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

/**
 * Log a simulated Clerk webhook signature, its verification result, and the corresponding test headers and body to the console.
 *
 * Reads CLERK_WEBHOOK_SECRET from the environment (falls back to a test key) to generate and verify the signature, then prints the payload, generated signature components, expected signature, verification status, headers for manual testing, and the JSON body.
 */
function testWebhookSignature() {
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

/**
 * Print step-by-step instructions for running the webhook test and using the generated headers and body to manually invoke the endpoint.
 *
 * Logs guidance for setting the CLERK_WEBHOOK_SECRET environment variable, running the test script, a curl example with header placeholders, and how to check Convex logs.
 */
function printInstructions() {
  console.log('=== Testing Instructions ===');
  console.log('');
  console.log('1. Set your CLERK_WEBHOOK_SECRET environment variable:');
  console.log('   export CLERK_WEBHOOK_SECRET=your_actual_secret');
  console.log('');
  console.log('2. Run this test script:');
  console.log('   node test-webhook.js');
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
if (require.main === module) {
  testWebhookSignature();
  console.log('');
  printInstructions();
}

module.exports = {
  generateTestSignature,
  testUserData,
  testPayload,
};
