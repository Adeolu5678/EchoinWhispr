import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/constants/api_constants.dart';
import '../storage/secure_storage_service.dart';
import 'ssl_pinning_helper.dart';

final convexClientProvider = Provider<ConvexClient>((ref) {
  final storage = ref.watch(secureStorageProvider);
  final dio = Dio();
  SslPinningHelper.configureDioAdapterSync(dio);
  SslPinningHelper.validatePinningConfiguration();
  return ConvexClient(dio, storage);
});

class ConvexClient {
  final Dio _dio;
  final SecureStorageService _storage;

  ConvexClient(this._dio, this._storage) {
    _dio.options.baseUrl = ApiConstants.convexUrl;
    _dio.options.connectTimeout = const Duration(seconds: 30);
    _dio.options.receiveTimeout = const Duration(seconds: 30);
  }

  Future<T> query<T>(String functionName, {Map<String, dynamic>? args}) async {
    return _execute<T>('query', functionName, args: args);
  }

  Future<T> mutation<T>(
    String functionName, {
    Map<String, dynamic>? args,
  }) async {
    return _execute<T>('mutation', functionName, args: args);
  }

  Future<T> _execute<T>(
    String type,
    String functionName, {
    Map<String, dynamic>? args,
  }) async {
    try {
      final token = await _storage.getToken();

      final options = Options(
        headers: {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Bearer $token',
        },
      );

      final response = await _dio.post(
        '/api/$type',
        data: {
          'path': functionName,
          'args': args ?? {},
          'format': 'json',
        },
        options: options,
      );

      final responseData = response.data;
      if (responseData is Map<String, dynamic> &&
          responseData.containsKey('value')) {
        final value = responseData['value'];
        if (value is T) {
          return value;
        } else {
          try {
            return value as T;
          } catch (e) {
            debugPrint('Type cast error: Expected $T but got ${value.runtimeType}');
            rethrow;
          }
        }
      } else {
        throw Exception('Unexpected Convex response format: $responseData');
      }
    } on SslPinningException catch (e) {
      debugPrint('SSL Pinning Error: $e');
      throw Exception('Secure connection failed: Certificate validation error');
    } on DioException catch (e) {
      final errorData = e.response?.data;
      final errorMessage =
          errorData?['errorMessage'] ?? errorData?['message'] ?? e.message;
      debugPrint('Convex Error: $errorMessage');
      throw Exception('Convex Error: $errorMessage');
    } catch (e) {
      debugPrint('Unexpected error in Convex client: $e');
      rethrow;
    }
  }
}
