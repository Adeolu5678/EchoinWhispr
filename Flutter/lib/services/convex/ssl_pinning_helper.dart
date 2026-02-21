import 'dart:io';
import 'package:dio/dio.dart';
import 'package:dio/io.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import '../../core/constants/api_constants.dart';

class SslPinningException implements Exception {
  final String message;
  final String? expectedHash;
  final String? receivedHash;

  SslPinningException({
    required this.message,
    this.expectedHash,
    this.receivedHash,
  });

  @override
  String toString() =>
      'SslPinningException: $message${expectedHash != null ? ' (expected: $expectedHash)' : ''}${receivedHash != null ? ' (received: $receivedHash)' : ''}';
}

class SslPinningHelper {
  static bool _initialized = false;
  static Uint8List? _cachedCertificateBytes;
  static bool _certificateLoaded = false;

  static bool get isPinningEnabled => ApiConstants.sslPinningEnabled;

  static bool get hasCertificate => _certificateLoaded;

  static Future<void> initialize() async {
    if (_initialized) return;

    if (isPinningEnabled) {
      try {
        _cachedCertificateBytes =
            (await rootBundle.load(ApiConstants.sslCertificatePath))
                .buffer
                .asUint8List();
        _certificateLoaded = true;
        debugPrint('SSL Pinning: Certificate loaded successfully');
      } catch (e) {
        _certificateLoaded = false;
        if (kReleaseMode) {
          debugPrint(
            '⚠️ SSL Pinning WARNING: ENABLE_SSL_PINNING is true but certificate not found at ${ApiConstants.sslCertificatePath}',
          );
        } else {
          debugPrint(
            'SSL Pinning: Certificate not found at ${ApiConstants.sslCertificatePath} (development mode, this is expected)',
          );
        }
      }
    }

    _initialized = true;
  }

  static String _getSpkiSha256Fingerprint(X509Certificate cert) {
    final derBytes = cert.der;
    final spkiDer = _extractSubjectPublicKeyInfo(derBytes);
    final sha256Hash = sha256Convert(spkiDer);
    return sha256Hash;
  }

  static Uint8List _extractSubjectPublicKeyInfo(Uint8List derBytes) {
    int offset = 0;

    if (derBytes[offset] != 0x30) {
      throw const FormatException('Invalid certificate: expected SEQUENCE tag');
    }
    offset++;

    offset += _parseLength(derBytes, offset);

    if (derBytes[offset] != 0x30) {
      throw const FormatException('Invalid certificate: expected TBSCertificate');
    }
    offset++;

    offset += _parseLength(derBytes, offset);

    offset = _skipVersion(derBytes, offset);
    offset = _skipSerialNumber(derBytes, offset);
    offset = _skipSignatureAlgorithm(derBytes, offset);
    offset = _skipIssuer(derBytes, offset);
    offset = _skipValidity(derBytes, offset);
    offset = _skipSubject(derBytes, offset);

    if (derBytes[offset] != 0x30) {
      throw const FormatException('Invalid certificate: expected SubjectPublicKeyInfo');
    }
    int spkiStart = offset;
    offset++;

    int spkiLength = _parseLength(derBytes, offset);
    int lengthBytes = _getLengthBytes(derBytes, offset);
    int spkiEnd = spkiStart + 1 + lengthBytes + spkiLength;

    return Uint8List.sublistView(derBytes, spkiStart, spkiEnd);
  }

  static int _parseLength(Uint8List bytes, int offset) {
    int firstByte = bytes[offset];
    if (firstByte < 0x80) {
      return firstByte;
    }
    int numBytes = firstByte & 0x7F;
    int length = 0;
    for (int i = 0; i < numBytes; i++) {
      length = (length << 8) | bytes[offset + 1 + i];
    }
    return length;
  }

  static int _getLengthBytes(Uint8List bytes, int offset) {
    int firstByte = bytes[offset];
    if (firstByte < 0x80) {
      return 1;
    }
    return 1 + (firstByte & 0x7F);
  }

  static int _skipVersion(Uint8List bytes, int offset) {
    if (bytes[offset] == 0xA0) {
      offset++;
      offset += _getLengthBytes(bytes, offset);
      offset += _parseLength(bytes, offset - _getLengthBytes(bytes, offset - 1) + 1);
    }
    return offset;
  }

  static int _skipSerialNumber(Uint8List bytes, int offset) {
    return _skipTag(bytes, offset);
  }

  static int _skipSignatureAlgorithm(Uint8List bytes, int offset) {
    return _skipTag(bytes, offset);
  }

  static int _skipIssuer(Uint8List bytes, int offset) {
    return _skipTag(bytes, offset);
  }

  static int _skipValidity(Uint8List bytes, int offset) {
    return _skipTag(bytes, offset);
  }

  static int _skipSubject(Uint8List bytes, int offset) {
    return _skipTag(bytes, offset);
  }

  static int _skipTag(Uint8List bytes, int offset) {
    offset++;
    int length = _parseLength(bytes, offset);
    int lengthBytes = _getLengthBytes(bytes, offset);
    return offset + lengthBytes + length;
  }

  static String sha256Convert(Uint8List data) {
    final digest = _sha256(data);
    return digest.map((b) => b.toRadixString(16).padLeft(2, '0').toUpperCase()).join(':');
  }

  static Uint8List _sha256(Uint8List data) {
    final bytes = ByteData.view(data.buffer);
    final words = <int>[];

    for (var i = 0; i < bytes.lengthInBytes; i += 4) {
      words.add(bytes.getUint32(i, Endian.big));
    }

    final hash = _sha256Impl(words, data.length * 8);
    final result = Uint8List(32);
    final resultData = ByteData.view(result.buffer);
    for (var i = 0; i < 8; i++) {
      resultData.setUint32(i * 4, hash[i], Endian.big);
    }
    return result;
  }

  static List<int> _sha256Impl(List<int> message, int bitLength) {
    final k = [
      0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1,
      0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
      0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786,
      0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
      0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147,
      0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
      0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b,
      0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
      0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a,
      0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
      0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ];

    var h0 = 0x6a09e667, h1 = 0xbb67ae85, h2 = 0x3c6ef372, h3 = 0xa54ff53a;
    var h4 = 0x510e527f, h5 = 0x9b05688c, h6 = 0x1f83d9ab, h7 = 0x5be0cd19;

    final paddedLength = ((bitLength + 64) ~/ 512 + 1) * 16;
    final padded = List<int>.filled(paddedLength, 0);
    for (var i = 0; i < message.length; i++) {
      padded[i] = message[i];
    }
    padded[message.length] = 0x80000000;

    final lastWordIndex = paddedLength - 1;
    final totalBits = bitLength;
    padded[lastWordIndex - 1] = (totalBits >>> 32) & 0xFFFFFFFF;
    padded[lastWordIndex] = totalBits & 0xFFFFFFFF;

    for (var chunkStart = 0; chunkStart < paddedLength; chunkStart += 16) {
      final w = List<int>.filled(64, 0);
      for (var i = 0; i < 16; i++) {
        w[i] = padded[chunkStart + i];
      }
      for (var i = 16; i < 64; i++) {
        final s0 = _rotr(w[i - 15], 7) ^ _rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3);
        final s1 = _rotr(w[i - 2], 17) ^ _rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10);
        w[i] = (w[i - 16] + s0 + w[i - 7] + s1) & 0xFFFFFFFF;
      }

      var a = h0, b = h1, c = h2, d = h3, e = h4, f = h5, g = h6, h = h7;

      for (var i = 0; i < 64; i++) {
        final s1 = _rotr(e, 6) ^ _rotr(e, 11) ^ _rotr(e, 25);
        final ch = (e & f) ^ ((~e) & g);
        final temp1 = (h + s1 + ch + k[i] + w[i]) & 0xFFFFFFFF;
        final s0 = _rotr(a, 2) ^ _rotr(a, 13) ^ _rotr(a, 22);
        final maj = (a & b) ^ (a & c) ^ (b & c);
        final temp2 = (s0 + maj) & 0xFFFFFFFF;

        h = g;
        g = f;
        f = e;
        e = (d + temp1) & 0xFFFFFFFF;
        d = c;
        c = b;
        b = a;
        a = (temp1 + temp2) & 0xFFFFFFFF;
      }

      h0 = (h0 + a) & 0xFFFFFFFF;
      h1 = (h1 + b) & 0xFFFFFFFF;
      h2 = (h2 + c) & 0xFFFFFFFF;
      h3 = (h3 + d) & 0xFFFFFFFF;
      h4 = (h4 + e) & 0xFFFFFFFF;
      h5 = (h5 + f) & 0xFFFFFFFF;
      h6 = (h6 + g) & 0xFFFFFFFF;
      h7 = (h7 + h) & 0xFFFFFFFF;
    }

    return [h0, h1, h2, h3, h4, h5, h6, h7];
  }

  static int _rotr(int x, int n) => ((x >>> n) | (x << (32 - n))) & 0xFFFFFFFF;

  static Future<HttpClient> createPinnedHttpClient() async {
    await initialize();

    if (!isPinningEnabled || !_certificateLoaded) {
      if (kReleaseMode && !isPinningEnabled) {
        debugPrint(
          '⚠️ SECURITY WARNING: SSL Pinning is DISABLED in release build. '
          'Enable with --dart-define=ENABLE_SSL_PINNING=true',
        );
      }
      return HttpClient();
    }

    final context = SecurityContext(withTrustedRoots: false);
    context.setTrustedCertificatesBytes(_cachedCertificateBytes!);
    return HttpClient(context: context);
  }

  static bool validateCertificateSpki(
    X509Certificate cert,
    String host,
    int port,
  ) {
    final pinnedHashes = ApiConstants.sslPinnedSpkiSha256Hashes;

    if (pinnedHashes.isEmpty) {
      if (kReleaseMode) {
        debugPrint(
          '⚠️ SSL Pinning WARNING: No SPKI hashes configured. '
          'Set --dart-define=SSL_PINNED_SPKI_HASHES=hash1,hash2',
        );
      }
      return true;
    }

    try {
      final certHash = _getSpkiSha256Fingerprint(cert);
      final normalizedCertHash = certHash.toUpperCase();

      for (final pinnedHash in pinnedHashes) {
        final normalizedPinnedHash = pinnedHash.replaceAll(' ', '').toUpperCase();
        if (normalizedCertHash == normalizedPinnedHash) {
          return true;
        }
      }

      debugPrint(
        'SSL Pinning FAILED: Certificate SPKI hash does not match any pinned hash. '
        'Host: $host, Received: $normalizedCertHash',
      );
      return false;
    } catch (e) {
      debugPrint('SSL Pinning ERROR: Failed to validate certificate: $e');
      return false;
    }
  }

  static BadCertificateCallback createBadCertificateCallback() {
    return (X509Certificate cert, String host, int port) {
      if (!isPinningEnabled) {
        if (kDebugMode) {
          debugPrint('SSL Pinning: Skipping certificate validation (disabled)');
        }
        return true;
      }

      if (!_certificateLoaded) {
        if (kReleaseMode) {
          debugPrint(
            '⚠️ SSL Pinning WARNING: Certificate not loaded, accepting connection. '
            'Host: $host',
          );
        }
        return true;
      }

      final spkiValid = validateCertificateSpki(cert, host, port);
      if (!spkiValid) {
        throw SslPinningException(
          message: 'Certificate validation failed for host: $host',
          expectedHash: ApiConstants.sslPinnedSpkiSha256Hashes.firstOrNull,
          receivedHash: _getSpkiSha256Fingerprint(cert),
        );
      }

      return true;
    };
  }

  static Future<void> configureDioAdapter(Dio dio) async {
    await initialize();

    final certBytes = _cachedCertificateBytes;
    final certLoaded = _certificateLoaded;

    dio.httpClientAdapter = IOHttpClientAdapter(
      createHttpClient: () {
        if (!isPinningEnabled) {
          if (kReleaseMode) {
            debugPrint(
              '⚠️ SECURITY WARNING: SSL Pinning is DISABLED in release build. '
              'Enable with --dart-define=ENABLE_SSL_PINNING=true',
            );
          }
          return HttpClient();
        }

        if (!certLoaded || certBytes == null) {
          if (kReleaseMode) {
            debugPrint(
              '⚠️ SSL Pinning WARNING: Certificate not loaded, using default validation.',
            );
          }
          return HttpClient();
        }

        final context = SecurityContext(withTrustedRoots: false);
        context.setTrustedCertificatesBytes(certBytes);
        final pinnedClient = HttpClient(context: context);
        pinnedClient.badCertificateCallback = createBadCertificateCallback();
        return pinnedClient;
      },
    );
  }

  static void configureDioAdapterSync(Dio dio) {
    dio.httpClientAdapter = IOHttpClientAdapter(
      createHttpClient: () {
        initialize();

        if (!isPinningEnabled) {
          if (kReleaseMode) {
            debugPrint(
              '⚠️ SECURITY WARNING: SSL Pinning is DISABLED in release build. '
              'Enable with --dart-define=ENABLE_SSL_PINNING=true',
            );
          }
          return HttpClient();
        }

        final certBytes = _cachedCertificateBytes;
        final certLoaded = _certificateLoaded;

        if (!certLoaded || certBytes == null) {
          if (kReleaseMode) {
            debugPrint(
              '⚠️ SSL Pinning WARNING: Certificate not loaded, using default validation.',
            );
          }
          return HttpClient();
        }

        final context = SecurityContext(withTrustedRoots: false);
        context.setTrustedCertificatesBytes(certBytes);
        final pinnedClient = HttpClient(context: context);
        pinnedClient.badCertificateCallback = createBadCertificateCallback();
        return pinnedClient;
      },
    );
  }

  static void validatePinningConfiguration() {
    if (kReleaseMode) {
      if (!isPinningEnabled) {
        debugPrint(
          '⚠️ SECURITY WARNING: SSL certificate pinning is DISABLED. '
          'This app is vulnerable to MITM attacks. '
          'Enable with --dart-define=ENABLE_SSL_PINNING=true',
        );
      } else if (!_certificateLoaded) {
        debugPrint(
          '⚠️ SECURITY WARNING: SSL pinning enabled but certificate not found. '
          'App will use default certificate validation.',
        );
      } else if (ApiConstants.sslPinnedSpkiSha256Hashes.isEmpty) {
        debugPrint(
          '⚠️ SSL Pinning WARNING: Certificate loaded but no SPKI hashes configured. '
          'Consider setting --dart-define=SSL_PINNED_SPKI_HASHES=hash1,hash2 '
          'for additional public key pinning.',
        );
      } else {
        debugPrint('SSL Pinning: Configuration valid');
      }
    } else {
      if (isPinningEnabled) {
        debugPrint(
          'SSL Pinning: Enabled in debug mode. '
          'Certificate: ${_certificateLoaded ? 'loaded' : 'not found'}',
        );
      }
    }
  }
}