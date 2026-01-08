/**
 * Unit tests for file validation utilities
 */

import {
  validateFileType,
  validateFileSize,
  validateFile,
  MAX_FILE_SIZE,
  SUPPORTED_IMAGE_TYPES,
} from '../fileValidation';

// Mock URL.createObjectURL and URL.revokeObjectURL for tests
global.URL.createObjectURL = jest.fn(() => 'mock-url');
global.URL.revokeObjectURL = jest.fn();

describe('fileValidation', () => {
  describe('validateFileType', () => {
    it('should accept valid image types', () => {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      
      validTypes.forEach(type => {
        const file = new File([''], 'test.jpg', { type });
        const result = validateFileType(file);
        expect(result.isValid).toBe(true);
        expect(result.error).toBeUndefined();
      });
    });

    it('should reject invalid file types', () => {
      const invalidFile = new File([''], 'test.pdf', { type: 'application/pdf' });
      const result = validateFileType(invalidFile);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should reject files with empty type', () => {
      const noTypeFile = new File([''], 'test', { type: '' });
      const result = validateFileType(noTypeFile);
      
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateFileSize', () => {
    it('should accept files under the size limit', () => {
      const smallFile = new File(['x'.repeat(1000)], 'small.jpg', { type: 'image/jpeg' });
      const result = validateFileSize(smallFile);
      
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject files over the size limit', () => {
      // Create a mock file that appears to exceed size limit
      const largeFile = new File(['x'], 'large.jpg', { type: 'image/jpeg' });
      Object.defineProperty(largeFile, 'size', { value: MAX_FILE_SIZE + 1 });
      
      const result = validateFileSize(largeFile);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('exceeds');
    });

    it('should accept files exactly at size limit', () => {
      const exactFile = new File(['x'], 'exact.jpg', { type: 'image/jpeg' });
      Object.defineProperty(exactFile, 'size', { value: MAX_FILE_SIZE });
      
      const result = validateFileSize(exactFile);
      
      expect(result.isValid).toBe(true);
    });
  });

  describe('validateFile (integration)', () => {
    it('should pass validation for valid files', async () => {
      const validFile = new File(['test content'], 'test.png', { type: 'image/png' });
      Object.defineProperty(validFile, 'size', { value: 1024 }); // 1KB
      
      const result = await validateFile(validFile);
      
      expect(result.isValid).toBe(true);
    });

    it('should fail for invalid file type', async () => {
      const invalidFile = new File([''], 'test.exe', { type: 'application/exe' });
      Object.defineProperty(invalidFile, 'size', { value: 1024 });
      
      const result = await validateFile(invalidFile);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should fail for oversized files', async () => {
      const largeFile = new File([''], 'test.png', { type: 'image/png' });
      Object.defineProperty(largeFile, 'size', { value: MAX_FILE_SIZE + 1000 });
      
      const result = await validateFile(largeFile);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('constants', () => {
    it('should export MAX_FILE_SIZE', () => {
      expect(MAX_FILE_SIZE).toBeDefined();
      expect(typeof MAX_FILE_SIZE).toBe('number');
      expect(MAX_FILE_SIZE).toBeGreaterThan(0);
    });

    it('should export SUPPORTED_IMAGE_TYPES', () => {
      expect(SUPPORTED_IMAGE_TYPES).toBeDefined();
      expect(Array.isArray(SUPPORTED_IMAGE_TYPES)).toBe(true);
      expect(SUPPORTED_IMAGE_TYPES.length).toBeGreaterThan(0);
    });

    it('should define expected image types', () => {
      expect(SUPPORTED_IMAGE_TYPES).toContain('image/jpeg');
      expect(SUPPORTED_IMAGE_TYPES).toContain('image/png');
      expect(SUPPORTED_IMAGE_TYPES).toContain('image/webp');
    });

    it('MAX_FILE_SIZE should be 5MB', () => {
      expect(MAX_FILE_SIZE).toBe(5 * 1024 * 1024);
    });
  });
});
