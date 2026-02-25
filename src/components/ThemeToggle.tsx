import React from 'react'
import { IconButton, useTheme, Box } from '@mui/material'
import { LightMode as LightModeIcon, DarkMode as DarkModeIcon } from '@mui/icons-material'
import { useTheme as useAppTheme } from '../context/ThemeContext'

interface ThemeToggleProps {
  size?: 'small' | 'medium' | 'large'
  showLabel?: boolean
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  size = 'medium', 
  showLabel = false 
}) => {
  const { mode, toggleTheme } = useAppTheme()
  const theme = useTheme()
  
  const isDark = mode === 'dark'
  const iconSize = size === 'small' ? 20 : size === 'large' ? 30 : 24
  
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <IconButton
        onClick={toggleTheme}
        size={size}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        sx={{
          backgroundColor: theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.1)' 
            : 'rgba(0, 0, 0, 0.05)',
          color: theme.palette.text.primary,
          border: `1px solid ${theme.palette.divider}`,
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.2)'
              : 'rgba(0, 0, 0, 0.1)',
            transform: 'scale(1.05)',
          },
          '&:active': {
            transform: 'scale(0.95)',
          },
        }}
      >
        {isDark ? (
          <LightModeIcon sx={{ fontSize: iconSize }} />
        ) : (
          <DarkModeIcon sx={{ fontSize: iconSize }} />
        )}
      </IconButton>
      
      {showLabel && (
        <Box
          component="span"
          sx={{
            fontSize: '0.875rem',
            color: theme.palette.text.secondary,
            textTransform: 'capitalize',
            userSelect: 'none',
          }}
        >
          {mode}
        </Box>
      )}
    </Box>
  )
}

export default ThemeToggle
