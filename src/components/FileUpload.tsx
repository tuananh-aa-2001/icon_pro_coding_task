import React, { useRef, useCallback } from 'react'
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  LinearProgress,
  Alert,
  IconButton,
  useTheme,
  alpha
} from '@mui/material'
import { 
  CloudUpload as UploadIcon,
  Close as CloseIcon,
  InsertDriveFile as FileIcon
} from '@mui/icons-material'
import { useFileUpload } from '../hooks/useFileUpload'

interface FileUploadProps {
  onFileSelect: (file: File) => void
  acceptedTypes?: string[]
  maxSize?: number
  disabled?: boolean
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  acceptedTypes = ['.csv', '.json'],
  maxSize = 10 * 1024 * 1024, // 10MB
  disabled = false
}) => {
  const theme = useTheme()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { uploadState, uploadFile, resetUpload } = useFileUpload()

  const handleFileSelect = useCallback(async (file: File) => {
    try {
      await uploadFile(file)
      onFileSelect(file)
    } catch (error) {
      // Error is handled in the upload state
      console.error('File upload failed:', error)
    }
  }, [uploadFile, onFileSelect])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (disabled || uploadState.isUploading) return

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }, [disabled, uploadState.isUploading, handleFileSelect])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }, [handleFileSelect])

  const handleClick = useCallback(() => {
    if (!disabled && !uploadState.isUploading) {
      fileInputRef.current?.click()
    }
  }, [disabled, uploadState.isUploading])

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const isDragActive = false // Could be tracked with state if needed

  return (
    <Box sx={{ width: '100%' }}>
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
        disabled={disabled}
      />

      <Paper
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        sx={{
          p: 4,
          border: `2px dashed ${
            isDragActive 
              ? theme.palette.primary.main 
              : theme.palette.divider
          }`,
          borderRadius: 2,
          textAlign: 'center',
          cursor: disabled || uploadState.isUploading ? 'not-allowed' : 'pointer',
          backgroundColor: isDragActive 
            ? alpha(theme.palette.primary.main, 0.04)
            : 'transparent',
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: disabled || uploadState.isUploading
              ? 'transparent'
              : alpha(theme.palette.action.hover, 0.04),
            borderColor: disabled || uploadState.isUploading
              ? theme.palette.divider
              : theme.palette.primary.main
          },
          opacity: disabled ? 0.6 : 1
        }}
      >
        <Box sx={{ mb: 2 }}>
          <UploadIcon 
            sx={{ 
              fontSize: 48, 
              color: isDragActive 
                ? theme.palette.primary.main 
                : theme.palette.action.disabled 
            }} 
          />
        </Box>

        <Typography variant="h6" gutterBottom>
          {uploadState.isUploading ? 'Uploading...' : 'Drop file here or click to browse'}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Supported formats: CSV, JSON (Max size: {formatFileSize(maxSize)})
        </Typography>

        {!disabled && !uploadState.isUploading && (
          <Button variant="outlined" component="span">
            Choose File
          </Button>
        )}
      </Paper>

      {uploadState.fileName && (
        <Box sx={{ mt: 2 }}>
          <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <FileIcon sx={{ color: theme.palette.primary.main }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" fontWeight="medium">
                {uploadState.fileName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {uploadState.fileSize && formatFileSize(uploadState.fileSize)}
              </Typography>
            </Box>
            <IconButton 
              size="small" 
              onClick={resetUpload}
              disabled={uploadState.isUploading}
            >
              <CloseIcon />
            </IconButton>
          </Paper>
        </Box>
      )}

      {uploadState.isUploading && (
        <Box sx={{ mt: 2 }}>
          <LinearProgress 
            variant="determinate" 
            value={uploadState.progress} 
            sx={{ height: 6, borderRadius: 3 }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            {uploadState.progress}% uploaded
          </Typography>
        </Box>
      )}

      {uploadState.error && (
        <Box sx={{ mt: 2 }}>
          <Alert 
            severity="error" 
            onClose={resetUpload}
            action={
              <IconButton size="small" onClick={resetUpload}>
                <CloseIcon fontSize="small" />
              </IconButton>
            }
          >
            {uploadState.error}
          </Alert>
        </Box>
      )}
    </Box>
  )
}

export default FileUpload
