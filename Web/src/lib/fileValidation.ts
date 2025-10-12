/**
 * File validation utilities for the EchoinWhispr Web application.
 * Provides comprehensive validation for file uploads including type, size, and dimension checks.
 */

/**
 * Supported file types for image uploads
 */
export const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
] as const;

/**
 * Maximum file size in bytes (5MB)
 */
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Maximum image dimensions (for validation)
 */
export const MAX_IMAGE_DIMENSIONS = {
  width: 4096,
  height: 4096,
} as const;

/**
 * File validation result interface
 */
export interface FileValidationResult {
  isValid: boolean;
  error?: string;
  details?: {
    type?: string;
    size?: number;
    dimensions?: { width: number; height: number };
  };
}

/**
 * Validates file type against supported image types
 * @param file - The file to validate
 * @returns Validation result
 */
export function validateFileType(file: File): FileValidationResult {
  if (!SUPPORTED_IMAGE_TYPES.includes(file.type as typeof SUPPORTED_IMAGE_TYPES[number])) {
    return {
      isValid: false,
      error: `Unsupported file type. Supported types: ${SUPPORTED_IMAGE_TYPES.join(', ')}`,
      details: { type: file.type },
    };
  }

  return { isValid: true };
}

/**
 * Validates file size against maximum allowed size
 * @param file - The file to validate
 * @returns Validation result
 */
export function validateFileSize(file: File): FileValidationResult {
  if (file.size > MAX_FILE_SIZE) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    const maxSizeMB = (MAX_FILE_SIZE / (1024 * 1024)).toFixed(0);

    return {
      isValid: false,
      error: `File size (${sizeMB}MB) exceeds maximum allowed size (${maxSizeMB}MB)`,
      details: { size: file.size },
    };
  }

  return { isValid: true };
}

/**
 * Validates image dimensions (optional, for client-side preview)
 * @param file - The image file to validate
 * @returns Promise resolving to validation result
 */
export async function validateImageDimensions(file: File): Promise<FileValidationResult> {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/')) {
      resolve({
        isValid: false,
        error: 'File is not an image',
        details: { type: file.type },
      });
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      const { width, height } = img;

      if (width > MAX_IMAGE_DIMENSIONS.width || height > MAX_IMAGE_DIMENSIONS.height) {
        resolve({
          isValid: false,
          error: `Image dimensions (${width}x${height}) exceed maximum allowed (${MAX_IMAGE_DIMENSIONS.width}x${MAX_IMAGE_DIMENSIONS.height})`,
          details: { dimensions: { width, height } },
        });
      } else {
        resolve({
          isValid: true,
          details: { dimensions: { width, height } },
        });
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({
        isValid: false,
        error: 'Unable to read image dimensions',
      });
    };

    img.src = url;
  });
}

/**
 * Comprehensive file validation combining all checks
 * @param file - The file to validate
 * @param options - Validation options
 * @returns Promise resolving to validation result
 */
export async function validateFile(
  file: File,
  options: {
    checkDimensions?: boolean;
  } = {}
): Promise<FileValidationResult> {
  // Validate file type
  const typeResult = validateFileType(file);
  if (!typeResult.isValid) {
    return typeResult;
  }

  // Validate file size
  const sizeResult = validateFileSize(file);
  if (!sizeResult.isValid) {
    return sizeResult;
  }

  // Optionally validate dimensions
  if (options.checkDimensions) {
    const dimensionResult = await validateImageDimensions(file);
    if (!dimensionResult.isValid) {
      return dimensionResult;
    }
  }

  return { isValid: true };
}

/**
 * Validates multiple files
 * @param files - Array of files to validate
 * @param options - Validation options
 * @returns Promise resolving to array of validation results
 */
export async function validateFiles(
  files: File[],
  options: {
    checkDimensions?: boolean;
    maxFiles?: number;
  } = {}
): Promise<FileValidationResult[]> {
  const { maxFiles = 10 } = options;

  if (files.length > maxFiles) {
    return [{
      isValid: false,
      error: `Too many files selected. Maximum ${maxFiles} files allowed.`,
    }];
  }

  const results = await Promise.all(
    files.map(file => validateFile(file, options))
  );

  return results;
}

/**
 * Gets file extension from filename
 * @param filename - The filename
 * @returns File extension (lowercase)
 */
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

/**
 * Checks if file extension matches supported types
 * @param filename - The filename
 * @returns Whether the extension is supported
 */
export function isSupportedFileExtension(filename: string): boolean {
  const extension = getFileExtension(filename);
  const supportedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];

  return supportedExtensions.includes(extension);
}

/**
 * Formats file size for display
 * @param bytes - File size in bytes
 * @returns Formatted size string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Gets MIME type from file extension
 * @param extension - File extension
 * @returns MIME type or null if unknown
 */
export function getMimeTypeFromExtension(extension: string): string | null {
  const mimeTypes: Record<string, string> = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'webp': 'image/webp',
    'gif': 'image/gif',
  };

  return mimeTypes[extension.toLowerCase()] || null;
}