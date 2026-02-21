import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:echoinwhispr/main.dart'; // Import main to access EchoinWhisprApp

void main() {
  testWidgets('App renders without crashing', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    // Wrap in ProviderScope as main.dart does
    await tester.pumpWidget(const ProviderScope(child: EchoinWhisprApp()));

    // Verify that we are on Splash or Sign In logic (since no auth)
    // Just finding a Container or verifying no error is good for "renders".
    expect(find.byType(MaterialApp), findsOneWidget);
  });
}
