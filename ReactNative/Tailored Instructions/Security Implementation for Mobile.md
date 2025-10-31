# Security Implementation for Mobile

This document details the mobile-specific security implementation for EchoinWhispr, ensuring end-to-end encryption, secure key management, and protection against mobile-specific threats while maintaining the core anonymity and decentralization principles.

## Core Security Principles

### End-to-End Encryption
- **No Plaintext**: Message content never exists unencrypted on device or network
- **Client-Side Encryption**: All encryption/decryption happens client-side
- **Forward Secrecy**: Each conversation uses unique encryption keys
- **Perfect Forward Secrecy**: Compromised keys don't affect past conversations

### Anonymity Protection
- **No Account Linking**: Hedera Account IDs never stored with messages
- **Unlinkable Conversations**: Separate conversations remain unlinkable
- **Metadata Minimization**: Minimal metadata collection and storage
- **No Tracking**: No analytics or tracking that could compromise anonymity

## Key Management

### Private Key Storage
```jsx
import EncryptedStorage from 'react-native-encrypted-storage';
import * as Keychain from 'react-native-keychain';

class KeyManager {
  // iOS: Store in Keychain with biometric protection
  // Android: Store in Keystore
  static async storePrivateKey(privateKey, useBiometrics = false) {
    const options = {
      accessControl: useBiometrics ? 
        Keychain.ACCESS_CONTROL.BIOMETRY_ANY : 
        Keychain.ACCESS_CONTROL.NONE,
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
      authenticationType: Keychain.AUTHENTICATION_TYPE.BIOMETRICS,
    };
    
    await Keychain.setGenericPassword(
      'EchoinWhispr_PrivateKey',
      privateKey,
      options
    );
  }
  
  static async getPrivateKey() {
    try {
      const credentials = await Keychain.getGenericPassword();
      return credentials.password;
    } catch (error) {
      throw new Error('Biometric authentication required');
    }
  }
  
  static async deletePrivateKey() {
    await Keychain.resetGenericPassword();
  }
}
```

### Key Generation and Rotation
```jsx
import ecies from 'eciesjs';
import { v4 as uuidv4 } from 'react-native-uuid';

class EncryptionManager {
  static async generateKeyPair() {
    const privateKey = ecies.generatePrivateKey();
    const publicKey = ecies.getPublicKey(privateKey);
    
    // Generate deterministic mail hash from public key
    const mailHash = await this.generateMailHash(publicKey);
    
    return { privateKey, publicKey, mailHash };
  }
  
  static async generateMailHash(publicKey) {
    const hashBuffer = await crypto.subtle.digest('SHA-256', publicKey);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 64);
  }
  
  static generateReplyHash() {
    return uuidv4().replace(/-/g, '').substring(0, 64);
  }
}
```

## Message Encryption Flow

### Outgoing Message Encryption
```jsx
class MessageEncryption {
  static async encryptMessage(messageObject, recipientPublicKey) {
    // 1. Serialize message object
    const messageJson = JSON.stringify(messageObject);
    
    // 2. Encrypt with recipient's public key
    const encrypted = ecies.encrypt(recipientPublicKey, Buffer.from(messageJson));
    
    // 3. Convert to hex for IPFS storage
    return encrypted.toString('hex');
  }
  
  static async createMessageObject(text, imageCid = null) {
    return {
      type: imageCid ? 'text/image' : 'text',
      text_content: text,
      image_cid: imageCid,
      timestamp: Date.now(),
      version: '1.0'
    };
  }
}
```

### Incoming Message Decryption
```jsx
class MessageDecryption {
  static async decryptMessage(encryptedHex, privateKey) {
    try {
      // 1. Convert hex to buffer
      const encrypted = Buffer.from(encryptedHex, 'hex');
      
      // 2. Decrypt with private key
      const decrypted = ecies.decrypt(privateKey, encrypted);
      
      // 3. Parse JSON
      const messageObject = JSON.parse(decrypted.toString());
      
      // 4. Validate message structure
      this.validateMessageObject(messageObject);
      
      return messageObject;
    } catch (error) {
      throw new Error('Failed to decrypt message');
    }
  }
  
  static validateMessageObject(obj) {
    if (!obj.type || !obj.text_content || !obj.timestamp) {
      throw new Error('Invalid message format');
    }
  }
}
```

## Secure Storage Implementation

### Encrypted Local Storage
```jsx
import EncryptedStorage from 'react-native-encrypted-storage';

class SecureStorage {
  static async storeConversationData(conversationId, data) {
    const key = `conversation_${conversationId}`;
    const encryptedData = await this.encryptData(JSON.stringify(data));
    await EncryptedStorage.setItem(key, encryptedData);
  }
  
  static async getConversationData(conversationId) {
    const key = `conversation_${conversationId}`;
    const encryptedData = await EncryptedStorage.getItem(key);
    if (!encryptedData) return null;
    
    const decryptedData = await this.decryptData(encryptedData);
    return JSON.parse(decryptedData);
  }
  
  static async encryptData(data) {
    // Use device-specific encryption key
    const key = await this.getDeviceKey();
    // Implement AES encryption
    return encryptedData;
  }
  
  static async getDeviceKey() {
    // Generate/retrieve device-specific key
    let key = await EncryptedStorage.getItem('device_key');
    if (!key) {
      key = await this.generateDeviceKey();
      await EncryptedStorage.setItem('device_key', key);
    }
    return key;
  }
}
```

## Network Security

### Certificate Pinning
```jsx
// For IPFS gateways and Hedera endpoints
import { create } from 'ipfs-http-client';

const ipfsClient = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  // Certificate pinning would be implemented at native level
  // iOS: TrustKit or custom URLSessionDelegate
  // Android: Network Security Config with certificate pins
});
```

### Request Signing and Verification
```jsx
class NetworkSecurity {
  static async signRequest(payload, privateKey) {
    const message = JSON.stringify(payload);
    const signature = await this.signMessage(message, privateKey);
    return {
      ...payload,
      signature,
      timestamp: Date.now()
    };
  }
  
  static async verifyHCSMessage(message) {
    // Verify message structure and hashes
    if (!message.to_hash || !message.from_key || !message.cid) {
      throw new Error('Invalid HCS message structure');
    }
    
    // Verify hash formats (64 character hex)
    const hashRegex = /^[a-f0-9]{64}$/;
    if (!hashRegex.test(message.to_hash)) {
      throw new Error('Invalid hash format');
    }
    
    return true;
  }
}
```

## Mobile-Specific Security Measures

### App Protection
```jsx
import JailMonkey from 'jail-monkey';
import { Platform } from 'react-native';

class AppSecurity {
  static async checkDeviceIntegrity() {
    if (Platform.OS === 'android') {
      const isJailBroken = JailMonkey.isJailBroken();
      const isOnExternalStorage = JailMonkey.isOnExternalStorage();
      const canMockLocation = JailMonkey.canMockLocation();
      
      if (isJailBroken || isOnExternalStorage || canMockLocation) {
        throw new Error('Device integrity compromised');
      }
    }
    
    if (Platform.OS === 'ios') {
      const isJailBroken = JailMonkey.isJailBroken();
      if (isJailBroken) {
        throw new Error('Device jailbroken');
      }
    }
  }
  
  static async enableAppLock() {
    // Implement auto-lock after inactivity
    // Use react-native-background-timer for background checks
  }
}
```

### Biometric Authentication
```jsx
import TouchID from 'react-native-touch-id';

class BiometricAuth {
  static async authenticate(reason = 'Access your encrypted messages') {
    const config = {
      title: 'Authentication Required',
      imageColor: '#00A3FF',
      imageErrorColor: '#FF3B30',
      sensorDescription: 'Touch sensor',
      sensorErrorDescription: 'Failed',
      cancelText: 'Cancel',
    };
    
    try {
      await TouchID.authenticate(reason, config);
      return true;
    } catch (error) {
      return false;
    }
  }
  
  static async isSupported() {
    try {
      const biometryType = await TouchID.getSupportedBiometryType();
      return biometryType !== null;
    } catch (error) {
      return false;
    }
  }
}
```

## Data Sanitization and Secure Deletion

### Secure Data Wipe
```jsx
class DataSanitizer {
  static async wipeSensitiveData() {
    // Clear all encrypted storage
    await EncryptedStorage.clear();
    
    // Clear Keychain
    await Keychain.resetGenericPassword();
    
    // Clear conversation cache
    await this.clearConversationCache();
    
    // Clear image cache
    await this.clearImageCache();
  }
  
  static async secureDeleteFile(filePath) {
    // Overwrite file with random data before deletion
    const randomData = crypto.getRandomValues(new Uint8Array(1024));
    await RNFS.writeFile(filePath, randomData.toString(), 'ascii');
    await RNFS.unlink(filePath);
  }
}
```

## Runtime Security Checks

### Memory Protection
```jsx
class MemorySecurity {
  static preventScreenshot() {
    // iOS: Prevent screenshots in sensitive screens
    if (Platform.OS === 'ios') {
      // Implementation using native module
    }
  }
  
  static clearClipboard() {
    // Clear clipboard after copying sensitive data
    Clipboard.setString('');
  }
  
  static preventScreenRecording() {
    // Detect and respond to screen recording
    // Implementation using native modules
  }
}
```

## Audit and Compliance

### Security Logging
```jsx
class SecurityLogger {
  static async logSecurityEvent(event, details) {
    const logEntry = {
      timestamp: Date.now(),
      event,
      details,
      deviceId: await this.getAnonymousDeviceId()
    };
    
    // Store locally for audit purposes
    await SecureStorage.storeSecurityLog(logEntry);
    
    // In debug mode, send to monitoring service
    if (__DEV__) {
      console.log('Security Event:', logEntry);
    }
  }
  
  static async getAnonymousDeviceId() {
    // Generate anonymous device identifier
    const deviceInfo = await DeviceInfo.getUniqueId();
    const hash = await crypto.subtle.digest('SHA-256', deviceInfo);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
  }
}
```

## Emergency Security Features

### Panic Button
```jsx
class EmergencySecurity {
  static async emergencyWipe() {
    // Immediate wipe of all sensitive data
    await DataSanitizer.wipeSensitiveData();
    
    // Log emergency action
    await SecurityLogger.logSecurityEvent('emergency_wipe', {});
    
    // Exit app
    RNExitApp.exitApp();
  }
  
  static async fakeAppLock() {
    // Display fake lock screen to hide app contents
    // Implementation using overlay
  }
}
```

## Testing and Validation

### Security Test Suite
```jsx
class SecurityTests {
  static async runSecurityTests() {
    // Test key generation
    const keys = await EncryptionManager.generateKeyPair();
    assert(keys.privateKey && keys.publicKey && keys.mailHash);
    
    // Test encryption/decryption roundtrip
    const testMessage = { text: 'test' };
    const encrypted = await MessageEncryption.encryptMessage(testMessage, keys.publicKey);
    const decrypted = await MessageDecryption.decryptMessage(encrypted, keys.privateKey);
    assert.deepEqual(testMessage, decrypted);
    
    // Test secure storage
    await SecureStorage.storeConversationData('test', { data: 'test' });
    const retrieved = await SecureStorage.getConversationData('test');
    assert(retrieved.data === 'test');
  }
}
```

This comprehensive security implementation ensures that the EchoinWhispr mobile app maintains the highest standards of encryption, anonymity, and data protection while being optimized for mobile platforms.