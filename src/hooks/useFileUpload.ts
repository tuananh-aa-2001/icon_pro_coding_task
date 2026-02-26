import { useState, useCallback } from 'react'
import { FileUploadState } from '../types/importExport'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const SUPPORTED_TYPES = ['text/csv', 'application/json', '.csv', '.json']

export const useFileUpload = () => {
  const [uploadState, setUploadState] = useState<FileUploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    fileName: null,
    fileSize: null
  })

  const validateFile = useCallback((file: File): string | null => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return `File size exceeds 10MB limit. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`
    }

    // Check file type
    const extension = '.' + file.name.split('.').pop()?.toLowerCase()
    if (!SUPPORTED_TYPES.includes(file.type) && !SUPPORTED_TYPES.includes(extension)) {
      return 'Invalid file type. Please upload a CSV or JSON file.'
    }

    return null
  }, [])

  const uploadFile = useCallback(async (file: File): Promise<File> => {
    setUploadState({
      isUploading: true,
      progress: 0,
      error: null,
      fileName: file.name,
      fileSize: file.size
    })

    try {
      // Validate file
      const validationError = validateFile(file)
      if (validationError) {
        throw new Error(validationError)
      }

      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadState(prev => ({ ...prev, progress: i }))
        await new Promise(resolve => setTimeout(resolve, 50))
      }

      setUploadState(prev => ({ ...prev, isUploading: false, progress: 100 }))
      return file

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed'
      setUploadState({
        isUploading: false,
        progress: 0,
        error: errorMessage,
        fileName: file.name,
        fileSize: file.size
      })
      throw error
    }
  }, [validateFile])

  const resetUpload = useCallback(() => {
    setUploadState({
      isUploading: false,
      progress: 0,
      error: null,
      fileName: null,
      fileSize: null
    })
  }, [])

  return {
    uploadState,
    uploadFile,
    resetUpload,
    validateFile
  }
}
