import React from 'react'
import { 
  Box, 
  CircularProgress, 
  Typography, 
  useTheme,
  alpha
} from '@mui/material'

interface LoadingStateProps {
  message?: string
  size?: number
  showBackdrop?: boolean
}

const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
  size = 40,
  showBackdrop = false
}) => {
  const theme = useTheme()

  const content = (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      gap: 2,
      p: 3
    }}>
      <CircularProgress size={size} />
      <Typography 
        variant="body2" 
        color="text.secondary"
        sx={{ textAlign: 'center' }}
      >
        {message}
      </Typography>
    </Box>
  )

  if (showBackdrop) {
    return (
      <Box sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: alpha(theme.palette.background.default, 0.8),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: theme.zIndex.modal + 1
      }}>
        {content}
      </Box>
    )
  }

  return content
}

export default LoadingState
