import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../../core/constants/api_constants.dart';

final secureStorageProvider = Provider<SecureStorageService>((ref) {
  // Configure platform-specific security options
  const androidOptions = AndroidOptions(encryptedSharedPreferences: true);
  const iosOptions = IOSOptions(
    accessibility: KeychainAccessibility.first_unlock,
  );
  return SecureStorageService(
    const FlutterSecureStorage(aOptions: androidOptions, iOptions: iosOptions),
  );
});

class SecureStorageService {
  final FlutterSecureStorage _storage;

  SecureStorageService(this._storage);

  Future<void> saveToken(String token) async {
    await _storage.write(key: ApiConstants.tokenKey, value: token);
  }

  Future<String?> getToken() async {
    return await _storage.read(key: ApiConstants.tokenKey);
  }

  Future<void> deleteToken() async {
    await _storage.delete(key: ApiConstants.tokenKey);
  }

  Future<void> saveSessionId(String sessionId) async {
    await _storage.write(key: ApiConstants.sessionIdKey, value: sessionId);
  }

  Future<String?> getSessionId() async {
    return await _storage.read(key: ApiConstants.sessionIdKey);
  }

  Future<void> deleteSessionId() async {
    await _storage.delete(key: ApiConstants.sessionIdKey);
  }

  Future<void> saveUserId(String userId) async {
    await _storage.write(key: ApiConstants.userIdKey, value: userId);
  }

  Future<String?> getUserId() async {
    return await _storage.read(key: ApiConstants.userIdKey);
  }

  Future<void> clearAll() async {
    await _storage.deleteAll();
  }
}
