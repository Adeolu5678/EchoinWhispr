import 'package:flutter/material.dart';

class AppColors {
  // Brand Colors
  static const Color primary = Color(0xFF3F3D56); // Whisper Indigo
  static const Color accent = Color(0xFF00C2FF); // Echo Cyan
  
  // Backgrounds
  static const Color background = Color(0xFF0A0A0B);
  static const Color surface = Color(0xFF141416); // Slightly lighter than background
  static const Color card = Color(0xFF111113); // Card background
  
  // Text
  static const Color textPrimary = Color(0xFFFAFAFA); // Almost white
  static const Color textSecondary = Color(0xFF94949D); // Muted-foreground
  
  // States
  static const Color error = Color(0xFFEF4444);
  static const Color success = Color(0xFF10B981);
  static const Color warning = Color(0xFFF59E0B);
  static const Color info = Color(0xFF00C2FF);

  // Gradients
  static const LinearGradient primaryGradient = LinearGradient(
    colors: [primary, Color(0xFF2D2B3F)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient accentGradient = LinearGradient(
    colors: [Color(0xFF66D9FF), accent, Color(0xFF00A5D9)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
}
