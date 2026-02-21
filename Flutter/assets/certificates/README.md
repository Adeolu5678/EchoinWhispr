# SSL Certificates for Certificate Pinning

This directory contains SSL certificates used for certificate pinning in the application.

## Production Certificate Setup

1. **Export the server certificate** (PEM format):
   ```bash
   openssl s_client -connect gregarious-puma-353.convex.cloud:443 -showcerts < /dev/null | sed -n '/BEGIN CERTIFICATE/,/END CERTIFICATE/p' > convex_server.pem
   ```

2. **Get the SPKI SHA-256 fingerprint** for public key pinning:
   ```bash
   openssl x509 -noout -pubkey -in convex_server.pem | openssl pkey -pubin -outform der | openssl dgst -sha256 -binary | openssl base64
   ```

   Or for hex format:
   ```bash
   openssl x509 -noout -pubkey -in convex_server.pem | openssl pkey -pubin -outform der | openssl dgst -sha256 -hex | sed 's/^.* //'
   ```

3. **Place the certificate file** in this directory as `convex_server.pem`

## Build Configuration

Enable SSL pinning at build time:

```bash
flutter build apk --dart-define=ENABLE_SSL_PINNING=true --dart-define=SSL_PINNED_SPKI_HASHES=<your-hash-here>
```

For multiple SPKI hashes (backup keys), comma-separate them:
```bash
flutter build apk --dart-define=ENABLE_SSL_PINNING=true --dart-define=SSL_PINNED_SPKI_HASHES=hash1,hash2,hash3
```

## Security Notes

- **Never commit production certificates to version control**. Add certificate files to `.gitignore`.
- **SPKI pinning is preferred** over full certificate pinning because it survives certificate renewal (as long as the key pair remains the same).
- **Always have backup pins** to prevent app breakage if the server certificate changes.
- **Test thoroughly** before deploying to production.

## Certificate Rotation

When the server certificate changes:

1. If the public key remains the same, SPKI pinning will continue to work - just update the PEM file.
2. If the public key changes, update both:
   - The PEM certificate file in this directory
   - The `SSL_PINNED_SPKI_HASHES` environment variable

## Development Mode

In development, SSL pinning can be disabled:

```bash
flutter run --dart-define=ENABLE_SSL_PINNING=false
```

Warnings will be logged in release builds if pinning is disabled or certificates are missing.