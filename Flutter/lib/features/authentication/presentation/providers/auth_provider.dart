import 'package:echoinwhispr/core/constants/convex_functions.dart';
import 'package:echoinwhispr/features/authentication/domain/models/user.dart';
import 'package:echoinwhispr/services/clerk/clerk_auth_service.dart';
import 'package:echoinwhispr/services/convex/convex_client.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final authStateProvider = AsyncNotifierProvider<AuthState, User?>(
  AuthState.new,
);

class AuthState extends AsyncNotifier<User?> {
  @override
  Future<User?> build() async {
    final authService = ref.watch(clerkAuthServiceProvider);

    // Check if we have an authenticated user
    if (await authService.isAuthenticated()) {
      return _fetchConvexUser();
    }
    return null;
  }

  Future<User?> _fetchConvexUser() async {
    try {
      final convexClient = ref.read(convexClientProvider);
      // Use constant instead of magic string
      final userData = await convexClient.mutation<Map<String, dynamic>>(
        ConvexFunctions.getUser,
      );

      return User.fromJson(userData);
    } catch (e) {
      state = AsyncError(e, StackTrace.current);
      return null;
    }
  }

  /// Sign in with email and password
  Future<void> signIn(String identifier, String password) async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() async {
      final authService = ref.read(clerkAuthServiceProvider);
      await authService.signIn(identifier: identifier, password: password);
      return _fetchConvexUser();
    });
  }

  /// Sign up with email, password, and username
  Future<void> signUp(String username, String email, String password) async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() async {
      final authService = ref.read(clerkAuthServiceProvider);
      await authService.signUp(
        email: email,
        password: password,
        username: username,
      );
      return _fetchConvexUser();
    });
  }

  /// Complete onboarding with user preferences
  Future<void> completeOnboarding({
    required String career,
    required String lifePhase,
    required String mood,
    required List<String> interests,
  }) async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() async {
      final convexClient = ref.read(convexClientProvider);
      
      // Update profile using constants
      await convexClient.mutation(
        ConvexFunctions.updateProfile,
        args: {
          'career': career,
          'mood': mood,
          'interests': interests,
        },
      );
      
      // Update life phase
      await convexClient.mutation(
        ConvexFunctions.updateLifePhase,
        args: {'lifePhase': lifePhase},
      );

      return _fetchConvexUser();
    });
  }

  /// Sign out the current user
  Future<void> signOut() async {
    state = const AsyncLoading();
    final authService = ref.read(clerkAuthServiceProvider);
    await authService.signOut();
    state = const AsyncData(null);
  }
}
