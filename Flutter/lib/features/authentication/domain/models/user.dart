import 'package:freezed_annotation/freezed_annotation.dart';

part 'user.freezed.dart';
part 'user.g.dart';

@freezed
class User with _$User {
  const factory User({
    // ignore: invalid_annotation_target
    @JsonKey(name: '_id') required String id,
    required String clerkId,
    required String username,
    required String email,
    String? firstName,
    String? lastName,
    String? displayName,
    String? imageUrl,
    // Profile Fields
    String? career,
    @Default([]) List<String> interests,
    String? mood,
    String? lifePhase,
    @Default(false) bool needsUsernameSelection,
    // Timestamps
    required double createdAt,
    required double updatedAt, // Convex returns numbers (usually milliseconds)
  }) = _User;

  const User._();

  factory User.fromJson(Map<String, dynamic> json) => _$UserFromJson(json);

  bool get isOnboardingComplete {
    return career != null &&
        career!.isNotEmpty &&
        interests.isNotEmpty &&
        mood != null &&
        mood!.isNotEmpty &&
        lifePhase != null &&
        lifePhase!.isNotEmpty;
  }
}
