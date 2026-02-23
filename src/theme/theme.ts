import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'light',
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
    border: {
      main: '#e8e6e1',
    },
  },
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
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-input': {
            fontFamily: 'Georgia, serif',
            fontSize: '0.9rem',
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#e8e6e1',
            },
            '&:hover fieldset': {
              borderColor: '#8b7355',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#8b7355',
              boxShadow: 'inset 0 0 0 2px rgba(139, 115, 85, 0.08)',
            },
          },
        },
      },
    },
  },
})
