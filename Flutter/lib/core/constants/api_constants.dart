import 'package:flutter/foundation.dart';

class ApiConstants {
  // Base URLs - Loaded from environment variables
  // Pass these at build time with: flutter run --dart-define=CONVEX_URL=https://...
  
  // Development defaults (used when no --dart-define is provided)
  static const String _devConvexUrl = 'https://gregarious-puma-353.convex.cloud';
  static const String _devClerkPublishableKey = 'pk_test_cHJlY2lvdXMtaGFyZS00NC5jbGVyay5hY2NvdW50cy5kZXYk';
  static const String _devClerkFrontendApi = 'https://precious-hare-44.clerk.accounts.dev';
  
  // Production values (reference)
  static const String _prodConvexUrl = 'https://youthful-sandpiper-909.convex.cloud';

  static const String convexUrl = String.fromEnvironment(
    'CONVEX_URL',
    defaultValue: _devConvexUrl,
  );

  static const String clerkPublishableKey = String.fromEnvironment(
    'CLERK_PUBLISHABLE_KEY',
    defaultValue: _devClerkPublishableKey,
  );

  static const String clerkFrontendApi = String.fromEnvironment(
    'CLERK_FRONTEND_API',
    defaultValue: _devClerkFrontendApi,
  );

  static const bool sslPinningEnabled = bool.fromEnvironment(
    'ENABLE_SSL_PINNING',
    defaultValue: false,
  );

  static const String sslCertificatePath = 'assets/certificates/convex_server.pem';

  static const String sslPinnedSpkiHashesRaw = String.fromEnvironment(
    'SSL_PINNED_SPKI_HASHES',
    defaultValue: '',
  );

  static List<String> get sslPinnedSpkiSha256Hashes =>
      sslPinnedSpkiHashesRaw.split(',').where((h) => h.isNotEmpty).toList();

  // Endpoints
  static const String convexFunctionEndpoint = '$convexUrl/api/function';

  // Storage Keys
  static const String tokenKey = 'clerk_session_token';
  static const String userIdKey = 'clerk_user_id';
  static const String sessionIdKey = 'clerk_session_id';

  // Check if using development defaults
  static bool get isUsingDevelopmentDefaults => 
      convexUrl == _devConvexUrl &&
      clerkPublishableKey == _devClerkPublishableKey;

  // Check if using production configuration
  static bool get isProductionConfig => convexUrl == _prodConvexUrl;

  // Validation helper - warns in debug if using default values
  static void validateConfiguration() {
    assert(() {
      if (isUsingDevelopmentDefaults) {
        debugPrint(
          '⚠️ WARNING: Using DEVELOPMENT environment defaults.\n'
          '   For production builds, use:\n'
          '   flutter build --dart-define=CONVEX_URL=https://youthful-sandpiper-909.convex.cloud\n'
          '   See README_ENV.md for more details.',
        );
      } else if (isProductionConfig) {
        debugPrint(
          '✅ INFO: Using PRODUCTION configuration.\n'
          '   CONVEX_URL: $convexUrl',
        );
      } else {
        debugPrint(
          '✅ INFO: Using custom configuration.\n'
          '   CONVEX_URL: $convexUrl',
        );
      }
      return true;
    }());
  }
}