# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.

# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Preserve line number information for debugging stack traces.
-keepattributes SourceFile,LineNumberTable

# If you keep the line number information, uncomment this to hide the original source file name.
# -renamesourcefileattribute SourceFile

## Flutter wrapper
-keep class io.flutter.app.** { *; }
-keep class io.flutter.plugin.**  { *; }
-keep class io.flutter.util.**  { *; }
-keep class io.flutter.view.**  { *; }
-keep class io.flutter.**  { *; }
-keep class io.flutter.plugins.**  { *; }

## Dio HTTP client
-keep class okhttp3.** { *; }
-keep interface okhttp3.** { *; }
-dontwarn okhttp3.**
-dontwarn okio.**

## Riverpod
-keep class * extends com.google.gson.TypeAdapter
-keepattributes Signature
-keepattributes *Annotation*

## JSON serialization
-keepattributes *Annotation*,Signature
-dontnote kotlinx.serialization.SerializationKt
-keep,includedescriptorclasses class com.echoinwhispr.echoinwhispr.**$$serializer { *; }
-keepclassmembers class com.echoinwhispr.echoinwhispr.** {
    *** Companion;
}
-keepclasseswithmembers class com.echoinwhispr.echoinwhispr.** {
    kotlinx.serialization.KSerializer serializer(...);
}

## Freezed models
-keepclassmembers class * {
    @com.google.gson.annotations.SerializedName <fields>;
}

## Flutter Secure Storage
-keep class androidx.security.crypto.** { *; }

## Clerk SDK (if using native Android SDK)
-keep class com.clerk.** { *; }
-dontwarn com.clerk.**
