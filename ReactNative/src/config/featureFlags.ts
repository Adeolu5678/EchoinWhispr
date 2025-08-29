// Feature flags for React Native
export const FEATURE_FLAGS = {
  IMAGE_UPLOAD: false,
  VOICE_MESSAGES: false,
  GROUP_WHISPERS: false,
  WHISPER_REACTIONS: false,
  WHISPER_REPLIES: false,
  PUSH_NOTIFICATIONS: false,
  OFFLINE_MODE: false,
} as const

export type FeatureFlag = keyof typeof FEATURE_FLAGS