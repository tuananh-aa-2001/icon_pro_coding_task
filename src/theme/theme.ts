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
      main: '#8b7355',
      dark: '#6b5543',
      light: '#a89968',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#2a2a28',
      dark: '#1a1a18',
      light: '#3a3a38',
      contrastText: '#ffffff',
    },
    background: {
      default: '#fafaf8',
      paper: '#ffffff',
    },
    text: {
      primary: '#2a2a28',
      secondary: '#6b6b67',
    },
    error: {
      main: '#9c3e3e',
    },
  },
  custom: {
    border: {
      main: '#e8e6e1',
    },
  },
}

// Dark theme configuration
const darkTheme = {
  palette: {
    mode: 'dark' as const,
    primary: {
      main: '#a89968',
      dark: '#8b7355',
      light: '#c4b583',
      contrastText: '#000000',
    },
    secondary: {
      main: '#e8e6e1',
      dark: '#d4d0c8',
      light: '#faf8f4',
      contrastText: '#000000',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#e8e6e1',
      secondary: '#b8b5b0',
    },
    error: {
      main: '#cf6679',
    },
  },
  custom: {
    border: {
      main: '#4a4a4a',
    },
  },
}

// Common theme configuration (shared between light and dark)
const commonTheme = {
  typography: {
    fontFamily: [
      'Georgia',
      'serif',
    ].join(','),
    h1: {
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'sans-serif',
      ].join(','),
      fontWeight: 600,
    },
    body1: {
      fontFamily: [
        'Georgia',
        'serif',
      ].join(','),
      fontSize: '0.9rem',
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          borderRadius: 8,
          transition: 'all 0.3s ease',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 4,
          fontFamily: 'Georgia, serif',
          fontWeight: 500,
          letterSpacing: '0.5px',
          transition: 'all 0.2s ease',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-input': {
            fontFamily: 'Georgia, serif',
            fontSize: '0.9rem',
            transition: 'all 0.2s ease',
          },
          '& .MuiOutlinedInput-root': {
            transition: 'all 0.2s ease',
            '& fieldset': {
              borderColor: (theme: any) => theme.custom.border.main,
            },
            '&:hover fieldset': {
              borderColor: (theme: any) => theme.palette.primary.main,
            },
            '&.Mui-focused fieldset': {
              borderColor: (theme: any) => theme.palette.primary.main,
              boxShadow: (theme: any) => `inset 0 0 0 2px ${theme.palette.primary.main}20`,
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s ease',
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
