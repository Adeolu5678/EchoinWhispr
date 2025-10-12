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
   * mutually revealed conversation where both parties' identities become known.
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
} as const;

/**
 * Type representing all available feature flag keys.
 * Used for type-safe access to feature flags throughout the application.
 */
export type FeatureFlag = keyof typeof FEATURE_FLAGS;
