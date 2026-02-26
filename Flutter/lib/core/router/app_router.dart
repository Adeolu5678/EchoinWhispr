import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'router_notifier.dart';
import '../../features/authentication/presentation/providers/auth_provider.dart';
import '../../features/authentication/presentation/screens/sign_in_screen.dart';
import '../../features/authentication/presentation/screens/sign_up_screen.dart';
import '../../features/authentication/presentation/screens/onboarding_screen.dart';
import '../../features/users/presentation/screens/search_screen.dart';
import '../../features/users/presentation/screens/mood_match_screen.dart';
import '../../features/inbox/presentation/screens/inbox_screen.dart';
import '../../features/profile/presentation/screens/profile_screen.dart';
import '../../shared/widgets/bottom_nav_bar.dart';

// Keys for Navigation
final _rootNavigatorKey = GlobalKey<NavigatorState>();
final _searchNavigatorKey = GlobalKey<NavigatorState>();
final _moodNavigatorKey = GlobalKey<NavigatorState>();
final _inboxNavigatorKey = GlobalKey<NavigatorState>();
final _profileNavigatorKey = GlobalKey<NavigatorState>();

final appRouterProvider = Provider<GoRouter>((ref) {
  final notifier = ref.watch(routerNotifierProvider);
  final authState = ref.watch(authStateProvider);

  return GoRouter(
    navigatorKey: _rootNavigatorKey,
    initialLocation: '/search',
    refreshListenable: notifier,
    redirect: (context, state) {
      final user = authState.value;
      final isAuthenticated = user != null;
      final isAuthRoute =
          state.matchedLocation == '/sign-in' ||
          state.matchedLocation == '/sign-up';
      final isOnboardingRoute = state.matchedLocation == '/onboarding';

      if (authState.isLoading) return null;

      if (!isAuthenticated && !isAuthRoute) {
        return '/sign-in';
      }

      if (isAuthenticated) {
        if (!user.isOnboardingComplete) {
          return isOnboardingRoute ? null : '/onboarding';
        }

        if (isOnboardingRoute || isAuthRoute) {
          return '/search';
        }
      }

      return null;
    },
    routes: [
      // Auth Routes (No Shell)
      GoRoute(
        path: '/sign-in',
        builder: (context, state) => const SignInScreen(),
      ),
      GoRoute(
        path: '/sign-up',
        builder: (context, state) => const SignUpScreen(),
      ),
      GoRoute(
        path: '/onboarding',
        builder: (context, state) => const OnboardingScreen(),
      ),

      // Main Shell Routes (Indexed Stack)
      StatefulShellRoute.indexedStack(
        builder: (context, state, navigationShell) {
          return Scaffold(
            body: navigationShell,
            bottomNavigationBar: EchoinWhisprBottomNavBar(
              navigationShell: navigationShell,
            ),
          );
        },
        branches: [
          // Tab 1: Discover / Search
          StatefulShellBranch(
            navigatorKey: _searchNavigatorKey,
            routes: [
              GoRoute(
                path: '/search',
                builder: (context, state) => const SearchScreen(),
              ),
            ],
          ),

          // Tab 2: Mood Match
          StatefulShellBranch(
            navigatorKey: _moodNavigatorKey,
            routes: [
              GoRoute(
                path: '/mood',
                builder: (context, state) => const MoodMatchScreen(),
              ),
            ],
          ),

          // Tab 3: Inbox
          StatefulShellBranch(
            navigatorKey: _inboxNavigatorKey,
            routes: [
              GoRoute(
                path: '/inbox',
                builder: (context, state) => const InboxScreen(),
              ),
            ],
          ),

          // Tab 4: Profile
          StatefulShellBranch(
            navigatorKey: _profileNavigatorKey,
            routes: [
              GoRoute(
                path: '/profile',
                builder: (context, state) => const ProfileScreen(),
              ),
            ],
          ),
        ],
      ),
    ],
  );
});
