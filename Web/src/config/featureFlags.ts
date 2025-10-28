/**
 * Feature flags for the EchoinWhispr Web application.
 *
 * This file manages the state of all deferred features as part of the foundation-first approach.
 * All deferred features are set to false for the MVP phase to ensure a lean release.
 * These flags control the conditional rendering and activation of UI elements, routes, and logic
 * related to deferred features. Usage: Wrap deferred feature code in if (FEATURE_FLAGS.FLAG_NAME) checks.
 *
 * Refer to Software Specification Documentation (SSD)/3. Functional Requirements (MVP & Future Iterations).md
 * for detailed descriptions of each deferred feature.
 */

export const FEATURE_FLAGS = {
  /**
   * Enables the ability for a recipient of a Whisper to "Echo" it back, initiating a two-way,
   * conversation.
   * Foundation: UI placeholders (e.g., "Echo Back" button) and Convex schema extensions (conversations table).
   */
  CONVERSATION_EVOLUTION: true,

  /**
   * Enables the ability for users to attach images to whispers.
   * Foundation: UI icon/placeholder in compose screen and whispers table schema extension (imageUrl field).
   */
  IMAGE_UPLOADS: true,

  /**
   * Enables the ability for users to upload and display profile pictures.
   * Foundation: UI section for profile picture in profile screen and users table schema extension (profileImageUrl field).
   */
  PROFILE_PICTURES: true,

  /**
   * Enables comprehensive user profile management features beyond basic authentication,
   * including editing display name, bio, and other personal settings.
   * Foundation: Read-only profile screen with structured fields ready for editing conversion.
   */
  USER_PROFILE_EDITING: true,

  /**
   * Enables real-time alerts to users for new whispers, conversation updates, etc.
   * Foundation: Integration of necessary modules for push notifications and push token storage in users table.
   */
  PUSH_NOTIFICATIONS: true,

  /**
   * Enables future integration of location-specific functionalities (e.g., sharing location in a whisper).
   * Foundation: Code to request location permissions and whispers table schema extension (location field).
   */
  LOCATION_BASED_FEATURES: true,

  /**
   * Enables the ability for users to send and manage friend requests, view friends list,
   * and interact with other users through the friends system.
   * Foundation: UI for friends page, search, requests, and list with Convex schema and functions.
   */
  FRIENDS: true,
   /**
    * Enables the ability for users to continue their own whisper threads by replying to their own whispers,
    * enabling storytelling and long-form content creation while bypassing the 280-character limit.
    * Foundation: UI placeholders for chain indicators and reply buttons, Convex schema extensions (chainId, parentWhisperId, chainOrder, isChainStart fields).
    */
   WHISPER_CHAINS: true,

   /**
    * Enables the ability for users to send mystery whispers, where the recipient is revealed only after they respond.
    * Foundation: UI placeholders for mystery whisper options and Convex schema extensions (isMystery field).
    */
   MYSTERY_WHISPERS: true,

   /**
    * Enables persona profiles with verification capabilities using Hedera attestations.
    * Foundation: UI placeholders for persona fields, verification badge, and Convex schema extensions (career, skills, expertise, verified, attestationId fields).
    */
   PERSONA_PROFILES_VERIFICATION: true,

   /**
    * Enables interest-based anonymous matching using Hedera smart contracts.
    * Foundation: Convex schema extensions (interests field in users, matches table), UI placeholders for interests input and match section, Hedera integration hooks.
    */
   INTEREST_BASED_MATCHING: true,

   /**
    * Enables random anonymous messaging using Hedera equitable distribution.
    * Foundation: Convex schema extensions (randomMessageCount field in users, randomMessages table), UI placeholders for random messaging option, Hedera integration hooks.
    */
   RANDOM_ANONYMOUS_MESSAGING: true,
    /**
     * Enables career-focused user search and whispers using Hedera verifiable searches.
     * Foundation: Convex schema extensions (careerSearchEnabled field in users, careerWhispers table), UI placeholders for career search filters and results, Hedera integration hooks.
     */
    CAREER_FOCUSED_SEARCH_WHISPERS: true,

    /**
     * Enables AI-generated headings for whispers to provide context and categorization.
     * Foundation: Convex schema extensions (heading field in whispers table), UI placeholders for heading display and generation button, AI integration hooks.
     */
    AI_GENERATED_WHISPER_HEADINGS: true,

    /**
     * Enables subscription model for enhanced access using Hedera payments.
     * Foundation: Convex schema extensions (subscriptionTier, subscriptionExpiresAt, unlimitedMessages, unlimitedMatches fields in users table), UI placeholders for subscription tiers and Hedera payment buttons, Hedera integration hooks.
     */
    SUBSCRIPTION_MODEL_ENHANCED_ACCESS: true,

    /**
     * Enables Hedera-based decentralized identity verification.
     * Foundation: Convex schema extensions (didId, didDocument, verificationStatus, communityMemberships fields in users table), UI placeholders for DID creation and verification buttons, Hedera integration hooks.
     */
    HEDERA_BASED_DECENTRALIZED_IDENTITY_VERIFICATION: true,

    /**
     * Enables tokenized whisper rewards and tipping using Hedera Token Services.
     * Foundation: Convex schema extensions (tokenBalance, earnedTokens fields in users table, tokenTransactions table), UI placeholders for token balance display and tipping buttons, Hedera integration hooks.
     */
    TOKENIZED_WHISPER_REWARDS_AND_TIPPING: true,

    /**
     * Enables immutable whisper timestamping via Hedera Consensus Service.
     * Foundation: Convex schema extensions (consensusTimestamp, consensusHash, consensusTopicId fields in whispers table), UI placeholders for timestamp display and verification button, Hedera Consensus Service integration hooks.
     */
    IMMUTABLE_WHISPER_TIMESTAMPING_VIA_CONSENSUS_SERVICE: true,
     /**
      * Enables Hedera-powered anonymous community governance.
      * Foundation: Convex schema extensions (governanceProposals table), UI placeholders for governance dashboard with proposal list and voting buttons, Hedera smart contract governance integration hooks.
      */
     HEDERA_POWERED_ANONYMOUS_COMMUNITY_GOVERNANCE: true,

     /**
      * Enables mood-based random connections.
      * Foundation: Convex schema extensions (mood field in users, moodConnections table), UI placeholders for mood selector and matcher components, daily limit tracking with subscription override.
      */
      /**
       * Enables Tinder-like swiping for romance feature.
       * Foundation: Convex schema extensions (romanceSwipeLimits, swipeHistory tables), UI components for swipeable persona cards, gesture handling, daily limit tracking with subscription override.
       */
      TINDER_LIKE_SWIPING_FOR_ROMANCE: true,

      /**
       * Enables mutual matching system where both users must express interest before a match is created.
       * Foundation: Enhanced matches table with mutual confirmation fields, UI components for match notifications and dashboard, hooks for interest confirmation and match creation.
       */
      MUTUAL_MATCHING_SYSTEM: true,
     MOOD_BASED_CONNECTIONS: true,

     /**
      * Enables daily limits and subscription integration across all features.
      * Foundation: Unified usageLimits table, UsageTracker component, subscription override checks, daily reset logic.
      */
      /**
       * Enables enhanced friend whispering feature allowing users to send anonymous whispers to friends by username.
       * Foundation: friendWhispers table, FriendWhisperComposer component, username validation and friend verification logic.
       */
      ENHANCED_FRIEND_WHISPERING: true,
    DAILY_LIMITS_SUBSCRIPTION_INTEGRATION: true,
} as const;

/**
 * Type representing all available feature flag keys.
 * Used for type-safe access to feature flags throughout the application.
 */
export type FeatureFlag = keyof typeof FEATURE_FLAGS;
