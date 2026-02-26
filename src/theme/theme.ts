import { createTheme } from '@mui/material/styles'
import { ThemeMode } from '../types/theme'

// Extend the theme to accept custom values
declare module '@mui/material/styles' {
  interface Theme {
    custom: {
      border: {
        main: string;
      };
    };
  }
  interface ThemeOptions {
    custom?: {
      border?: {
        main?: string;
      };
    };
  }
}

// Light theme configuration
const lightTheme = {
  palette: {
    mode: 'light' as const,
    primary: {
      main: '#1976d2', // Modern Blue
      dark: '#1565c0', // Darker Blue
      light: '#42a5f5', // Lighter Blue
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#00acc1', // Teal
      dark: '#0097a7',
      light: '#26c6da',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f5f7fa', // Light gray-blue
      paper: '#ffffff',
    },
    text: {
      primary: '#1a237e', // Dark blue text
      secondary: '#546e7a', // Gray-blue
    },
    error: {
      main: '#f44336', // Standard red
    },
    warning: {
      main: '#ff9800', // Orange
    },
    success: {
      main: '#4caf50', // Green
    },
    info: {
      main: '#2196f3', // Light blue
    },
  },
  custom: {
    border: {
      main: '#e0e7ff', // Light blue border
    },
  },
}

// Dark theme configuration
const darkTheme = {
  palette: {
    mode: 'dark' as const,
    primary: {
      main: '#42a5f5', // Lighter blue for dark mode
      dark: '#1976d2', // Standard blue
      light: '#64b5f6', // Even lighter blue
      contrastText: '#000000',
    },
    secondary: {
      main: '#26c6da', // Lighter teal for dark mode
      dark: '#00acc1', // Standard teal
      light: '#4dd0e1', // Even lighter teal
      contrastText: '#000000',
    },
    background: {
      default: '#0d1117', // GitHub dark background
      paper: '#161b22', // Dark paper
    },
    text: {
      primary: '#f0f6fc', // Light text
      secondary: '#8b949e', // Muted text
    },
    error: {
      main: '#f85149', // GitHub red
    },
    warning: {
      main: '#ffab70', // Light orange
    },
    success: {
      main: '#3fb950', // GitHub green
    },
    info: {
      main: '#58a6ff', // GitHub blue
    },
  },
  custom: {
    border: {
      main: '#30363d', // Dark border
    },
  },
}

// Common theme configuration (shared between light and dark)
const commonTheme = {
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      '"Roboto"',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.3,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.4,
    },
  },
  shape: {
    borderRadius: 12, // More modern, rounded corners
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          borderRadius: 12,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 600,
          fontSize: '0.875rem',
          letterSpacing: '0.025em',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          padding: '8px 16px',
        },
        contained: {
          boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.4)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-input': {
            fontSize: '1rem',
            transition: 'all 0.2s ease',
          },
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            transition: 'all 0.2s ease',
            '& fieldset': {
              borderColor: (theme: any) => theme.custom.border.main,
            },
            '&:hover fieldset': {
              borderColor: (theme: any) => theme.palette.primary.main,
            },
            '&.Mui-focused fieldset': {
              borderColor: (theme: any) => theme.palette.primary.main,
              boxShadow: (theme: any) => `0 0 0 3px ${theme.palette.primary.main}20`,
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 6,
        },
      },
    },
  },
}

// Create theme based on mode
export const createAppTheme = (mode: ThemeMode) => {
  const themeConfig = mode === 'dark' ? darkTheme : lightTheme
  
  return createTheme({
    ...themeConfig,
    ...commonTheme,
    // Merge custom components with mode-specific overrides
    components: {
      ...commonTheme.components,
      // Dark mode specific component overrides
      ...(mode === 'dark' && {
        MuiCard: {
          styleOverrides: {
            root: {
              ...commonTheme.components.MuiCard.styleOverrides.root,
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
              backgroundColor: darkTheme.palette.background.paper,
            },
          },
        },
        MuiTextField: {
          styleOverrides: {
            root: {
              ...commonTheme.components.MuiTextField.styleOverrides.root,
              '& .MuiOutlinedInput-root': {
                ...commonTheme.components.MuiTextField.styleOverrides.root['& .MuiOutlinedInput-root'],
                '& fieldset': {
                  borderColor: darkTheme.custom.border.main,
                },
                '&:hover fieldset': {
                  borderColor: darkTheme.palette.primary.main,
                },
                '&.Mui-focused fieldset': {
                  borderColor: darkTheme.palette.primary.main,
                  boxShadow: `inset 0 0 0 2px ${darkTheme.palette.primary.main}20`,
                },
              },
            },
          },
        },
      }),
    },
  })
}

// Export the default theme (light mode)
export const theme = createAppTheme('light')
