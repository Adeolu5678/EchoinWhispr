/**
 * TypeScript interfaces and types for the Profile feature.
 *
 * This file defines all data structures used in profile management,
 * including Convex database records, form data, and component props.
 */

// Using string types for MVP foundation since Id types are generated.
export type ProfileId = string;
export type UserId = string;

/**
 * Profile record as stored in Convex database.
 * Represents a user's profile information.
 */
export interface Profile {
  /** Unique identifier for the profile record */
  _id: ProfileId;
  /** Reference to the user this profile belongs to */
  userId: UserId;
  /** User's biography text (optional, max 280 characters) */
  bio?: string;
  /** User's career field (optional) */
  career?: string;
  /** User's interests (optional) */
  interests?: string[];
  /** User's current mood (optional) */
  mood?: string;
  /** URL to user's profile picture (optional, for future feature) */
  avatarUrl?: string;
  /** Whether this profile is publicly visible */
  isPublic: boolean;
  /** Timestamp when profile was created */
  _creationTime: number;
  /** Timestamp when profile was last updated */
  updatedAt: number;
}

/**
 * Data structure for updating profile information.
 * Used in mutation functions to update profile fields.
 */
export interface ProfileUpdateData {
  /** Biography text to update (optional) */
  bio?: string;
  /** Career field to update (optional) */
  career?: string;
  /** Interests to update (optional) */
  interests?: string[];
  /** Mood to update (optional) */
  mood?: string;
  /** Avatar URL to update (optional, for future feature) */
  avatarUrl?: string;
  /** Display name to update (optional) */
  displayName?: string;
}

/**
 * Form data structure for profile editing forms.
 * Contains only the fields that can be edited by the user.
 */
export interface ProfileFormData {
  /** Biography text input by user */
  bio?: string;
  /** Career input by user */
  career?: string;
  /** Interests input by user (comma separated string for form handling) */
  interests?: string;
  /** Mood input by user */
  mood?: string;
  /** Display name input by user */
  displayName: string;
}

/**
 * Props for ProfileAvatar component.
 * Displays user's avatar or fallback initials.
 */
export interface ProfileAvatarProps {
  /** User's display name for generating initials fallback */
  displayName?: string;
  /** URL to user's avatar image (optional) */
  avatarUrl?: string;
  /** Size of the avatar in pixels */
  size?: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Props for ProfileBio component.
 * Displays user's biography in read-only mode.
 */
export interface ProfileBioProps {
  /** Biography text to display */
  bio?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Props for ProfileForm component.
 * Form for editing profile bio with validation.
 */
export interface ProfileFormProps {
  /** Initial bio value */
  initialBio?: string;
  /** Initial career value */
  initialCareer?: string;
  /** Initial interests value */
  initialInterests?: string[];
  /** Initial mood value */
  initialMood?: string;
  /** Initial display name value */
  initialDisplayName?: string;
  /** Callback when form is successfully submitted */
  onSubmit: (data: ProfileFormData) => Promise<void>;
  /** Callback when user cancels editing */
  onCancel: () => void;
  /** Whether the form is currently submitting */
  isSubmitting?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Props for ProfileScreen component.
 * Main profile screen component that manages view/edit modes.
 */
export interface ProfileScreenProps {
  /** Current user's profile data */
  profile?: Profile;
  /** User's display name from Clerk */
  displayName?: string;
  /** User's username from Clerk */
  username?: string;
  /** User's career */
  career?: string;
  /** User's interests */
  interests?: string[];
  /** User's mood */
  mood?: string;
  /** Whether profile data is currently loading */
  isLoading?: boolean;
  /** Error message if profile loading failed */
  error?: string;
  /** Additional CSS classes */
  className?: string;
}