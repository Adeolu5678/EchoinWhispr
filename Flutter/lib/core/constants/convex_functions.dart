/// Centralized Convex function names to avoid magic strings
/// 
/// Usage: Instead of `convexClient.mutation('users:getOrCreateCurrentUser')`
/// Use: `convexClient.mutation(ConvexFunctions.getUser)`
class ConvexFunctions {
  ConvexFunctions._();

  // ============================================
  // User Functions
  // ============================================
  
  /// Get or create the current authenticated user
  static const String getUser = 'users:getOrCreateCurrentUser';
  
  /// Update user profile (career, interests, mood)
  static const String updateProfile = 'users:updateUserProfile';
  
  /// Update user's life phase
  static const String updateLifePhase = 'resonance:updateLifePhase';

  // ============================================
  // Inbox/Message Functions
  // ============================================
  
  /// Get user's inbox messages
  static const String getInbox = 'inbox:getInbox';
  
  /// Send a whisper message
  static const String sendWhisper = 'inbox:sendWhisper';
  
  /// Mark message as read
  static const String markAsRead = 'inbox:markAsRead';

  // ============================================
  // Resonance/Matching Functions
  // ============================================
  
  /// Find resonant users
  static const String findResonant = 'resonance:findResonantUsers';
  
  /// Update user preferences
  static const String updatePreferences = 'resonance:updatePreferences';

  // ============================================
  // Search Functions
  // ============================================
  
  /// Search for users
  static const String searchUsers = 'users:searchUsers';
}
