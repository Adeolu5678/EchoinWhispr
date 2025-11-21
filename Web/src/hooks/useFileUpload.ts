'use client';

import { useState, useCallback } from 'react';
import { uploadFile, getFileUrl, deleteFile } from '../lib/fileStorage';
import { validateFile } from '../lib/fileValidation';

/**
 * File upload state interface
 */
export interface FileUploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  storageId: string | null;
  url: string | null;
}

/**
 * File upload result interface
 */
export interface FileUploadResult {
  storageId: string;
  url: string;
}

/**
 * Custom hook for handling file uploads with Convex file storage.
 * Provides state management, validation, and error handling for file operations.
 */
export function useFileUpload() {
  const [state, setState] = useState<FileUploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    storageId: null,
    url: null,
  });

  /**
   * Resets the upload state to initial values
   */
  const reset = useCallback(() => {
    setState({
      isUploading: false,
      progress: 0,
      error: null,
      storageId: null,
      url: null,
    });
  }, []);

  /**
   * Uploads a file with validation and progress tracking
   * @param file - The File object to upload
   * @returns Promise<FileUploadResult> - The upload result with storage ID and URL
   */
  const upload = useCallback(async (file: File): Promise<FileUploadResult> => {
    try {
      // Reset state
      setState(prev => ({
        ...prev,
        isUploading: true,
        progress: 0,
        error: null,
      }));

      // Validate file
      const validation = await validateFile(file);
      if (!validation.isValid) {
        throw new Error(validation.error || 'File validation failed');
      }

      // Update progress to indicate validation passed
      setState(prev => ({ ...prev, progress: 10 }));

      // Upload file
      const storageId = await uploadFile(file);

      // Update progress to indicate upload completed
      setState(prev => ({ ...prev, progress: 80 }));

      // Get public URL
      const url = await getFileUrl(storageId);

      // Update state with success
      setState(prev => ({
        ...prev,
        isUploading: false,
        progress: 100,
        storageId,
        url,
      }));

      return { storageId, url };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setState(prev => ({
        ...prev,
        isUploading: false,
        progress: 0,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  /**
   * Deletes an uploaded file
   * @param storageId - The storage ID of the file to delete
   */
  const remove = useCallback(async (storageId: string): Promise<void> => {
    try {
      await deleteFile(storageId);
      // Reset state if the deleted file was the current one
      setState(prev => {
        if (prev.storageId === storageId) {
          return {
            isUploading: false,
            progress: 0,
            error: null,
            storageId: null,
            url: null,
          };
        }
        return prev;
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Delete failed';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    }
  }, []);

  /**
   * Clears any error state
   */
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    // State
    ...state,

    // Actions
    upload,
    remove,
    reset,
    clearError,
  };
}