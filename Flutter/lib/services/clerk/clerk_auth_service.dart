import 'dart:convert';

import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:echoinwhispr/core/constants/api_constants.dart';
import 'package:echoinwhispr/services/storage/secure_storage_service.dart';

final clerkAuthServiceProvider = Provider<ClerkAuthService>((ref) {
  final storage = ref.watch(secureStorageProvider);
  return ClerkAuthService(Dio(), storage);
});

class ClerkAuthService {
  final Dio _dio;
  final SecureStorageService _storage;
  bool _isRefreshing = false;

  ClerkAuthService(this._dio, this._storage) {
    _dio.options.baseUrl = ApiConstants.clerkFrontendApi;
    _dio.options.queryParameters = {'__clerk_api_version': '2021-02-05'};
    _dio.options.queryParameters['publishable_key'] =
        ApiConstants.clerkPublishableKey;
    _dio.options.connectTimeout = const Duration(seconds: 30);
    _dio.options.receiveTimeout = const Duration(seconds: 30);
    _dio.interceptors.add(_AuthInterceptor(this));
  }

  bool isTokenExpired(String token) {
    try {
      final parts = token.split('.');
      if (parts.length != 3) return true;
      
      final payload = utf8.decode(base64Url.decode(base64Url.normalize(parts[1])));
      final payloadMap = json.decode(payload) as Map<String, dynamic>;
      
      if (payloadMap.containsKey('exp')) {
        final expiry = payloadMap['exp'] as int;
        final now = DateTime.now().millisecondsSinceEpoch ~/ 1000;
        return now >= expiry;
      }
      return true;
    } catch (e) {
      debugPrint('Error parsing token expiry: $e');
      return true;
    }
  }

  Future<String?> getSessionId() async {
    return await _storage.getSessionId();
  }

  Future<bool> refreshToken() async {
    if (_isRefreshing) return false;
    
    _isRefreshing = true;
    try {
      final sessionId = await _storage.getSessionId();
      if (sessionId == null) {
        debugPrint('No session ID found for token refresh');
        await signOut();
        return false;
      }

      final newToken = await _getSessionToken(sessionId);
      if (newToken == null) {
        debugPrint('Failed to get new token during refresh');
        await signOut();
        return false;
      }

      await _storage.saveToken(newToken);
      debugPrint('Token refreshed successfully');
      return true;
    } catch (e) {
      debugPrint('Error refreshing token: $e');
      await signOut();
      return false;
    } finally {
      _isRefreshing = false;
    }
  }

  /// Sign In with email and password
  Future<void> signIn({
    required String identifier,
    required String password,
  }) async {
    try {
      final response = await _dio.post(
        '/v1/client/sign_ins',
        data: {'identifier': identifier, 'password': password},
        options: Options(contentType: Headers.formUrlEncodedContentType),
      );

      final data = response.data;
      if (data['status'] == 'complete') {
        final sessionId = data['created_session_id'];
        await _activateSession(sessionId);
      } else {
        throw Exception('Sign in not complete: ${data['status']}');
      }
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  /// Sign Up with email, password, and username
  Future<void> signUp({
    required String email,
    required String password,
    required String username,
  }) async {
    try {
      final response = await _dio.post(
        '/v1/client/sign_ups',
        data: {
          'email_address': email,
          'password': password,
          'username': username,
        },
        options: Options(contentType: Headers.formUrlEncodedContentType),
      );

      final data = response.data;

      if (data['status'] == 'complete') {
        final sessionId = data['created_session_id'];
        await _activateSession(sessionId);
      } else if (data['status'] == 'missing_requirements') {
        throw Exception(
          'Sign up requires additional verification not implemented in this MVP.',
        );
      }
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  Future<void> _activateSession(String sessionId) async {
    final token = await _getSessionToken(sessionId);
    if (token != null) {
      await _storage.saveToken(token);
      await _storage.saveSessionId(sessionId);
      try {
        await _dio.post(
          '/v1/client/sessions/$sessionId/touch',
          options: Options(contentType: Headers.formUrlEncodedContentType),
        );
      } catch (e) {
        debugPrint('Warning: Failed to touch session: $e');
      }
    } else {
      throw Exception('Failed to retrieve session token');
    }
  }

  Future<String?> _getSessionToken(String sessionId) async {
    try {
      final response = await _dio.post(
        '/v1/client/sessions/$sessionId/tokens',
        options: Options(contentType: Headers.formUrlEncodedContentType),
      );
      return response.data['jwt'];
    } catch (e) {
      debugPrint('Error getting session token: $e');
      return null;
    }
  }

  Future<void> signOut() async {
    await _storage.deleteToken();
    await _storage.deleteSessionId();
    try {
      await _dio.get('/v1/client/sign_out');
    } catch (e) {
      debugPrint('Error during sign out request: $e');
    }
  }

  Future<bool> isAuthenticated() async {
    final token = await _storage.getToken();
    return token != null;
  }

  Future<String?> getToken() => _storage.getToken();

  Exception _handleError(DioException e) {
    return Exception(e.response?.data['errors']?[0]?['message'] ?? e.message);
  }
}

class _AuthInterceptor extends Interceptor {
  final ClerkAuthService _authService;

  _AuthInterceptor(this._authService);

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) async {
    if (err.response?.statusCode == 401) {
      final refreshToken = err.requestOptions.extra['retryWithRefresh'] != true;
      
      if (refreshToken) {
        final success = await _authService.refreshToken();
        if (success) {
          final newToken = await _authService.getToken();
          if (newToken != null) {
            try {
              final response = await _authService._dio.fetch(
                err.requestOptions.copyWith(
                  extra: {...err.requestOptions.extra, 'retryWithRefresh': true},
                  headers: {
                    ...err.requestOptions.headers,
                    'Authorization': 'Bearer $newToken',
                  },
                ),
              );
              return handler.resolve(response);
            } catch (e) {
              return handler.next(err);
            }
          }
        }
      }
    }
    return handler.next(err);
  }
}
