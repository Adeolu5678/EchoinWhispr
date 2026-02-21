import 'dart:async';
import 'dart:ui';

import 'package:echoinwhispr/core/constants/api_constants.dart';
import 'package:echoinwhispr/core/router/app_router.dart';
import 'package:echoinwhispr/core/theme/app_theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

void main() {
  // Global error handling for uncaught exceptions
  runZonedGuarded(
    () {
      // Handle Flutter framework errors
      FlutterError.onError = (FlutterErrorDetails details) {
        FlutterError.presentError(details);
        // Log to console in debug mode
        debugPrint('Flutter Error: ${details.exceptionAsString()}');
        debugPrint('Stack trace: ${details.stack}');
      };

      // Handle async errors not caught by Flutter framework
      PlatformDispatcher.instance.onError = (error, stack) {
        debugPrint('Uncaught async error: $error');
        debugPrint('Stack trace: $stack');
        return true;
      };

      // Validate API configuration in debug mode
      ApiConstants.validateConfiguration();

      runApp(const ProviderScope(child: EchoinWhisprApp()));
    },
    (error, stack) {
      debugPrint('Uncaught error in runZonedGuarded: $error');
      debugPrint('Stack trace: $stack');
    },
  );
}

class EchoinWhisprApp extends ConsumerWidget {
  const EchoinWhisprApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(appRouterProvider);

    return MaterialApp.router(
      title: 'EchoinWhispr',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.darkTheme,
      routerConfig: router,
    );
  }
}
