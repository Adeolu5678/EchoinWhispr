// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'user.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$UserImpl _$$UserImplFromJson(Map<String, dynamic> json) => _$UserImpl(
  id: json['_id'] as String,
  clerkId: json['clerkId'] as String,
  username: json['username'] as String,
  email: json['email'] as String,
  firstName: json['firstName'] as String?,
  lastName: json['lastName'] as String?,
  displayName: json['displayName'] as String?,
  imageUrl: json['imageUrl'] as String?,
  career: json['career'] as String?,
  interests:
      (json['interests'] as List<dynamic>?)?.map((e) => e as String).toList() ??
      const [],
  mood: json['mood'] as String?,
  lifePhase: json['lifePhase'] as String?,
  needsUsernameSelection: json['needsUsernameSelection'] as bool? ?? false,
  createdAt: (json['createdAt'] as num).toDouble(),
  updatedAt: (json['updatedAt'] as num).toDouble(),
);

Map<String, dynamic> _$$UserImplToJson(_$UserImpl instance) =>
    <String, dynamic>{
      '_id': instance.id,
      'clerkId': instance.clerkId,
      'username': instance.username,
      'email': instance.email,
      'firstName': instance.firstName,
      'lastName': instance.lastName,
      'displayName': instance.displayName,
      'imageUrl': instance.imageUrl,
      'career': instance.career,
      'interests': instance.interests,
      'mood': instance.mood,
      'lifePhase': instance.lifePhase,
      'needsUsernameSelection': instance.needsUsernameSelection,
      'createdAt': instance.createdAt,
      'updatedAt': instance.updatedAt,
    };
