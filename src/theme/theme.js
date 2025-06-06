import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#6B2FB3',
      light: '#8B4FD3',
      dark: '#4B1093',
    },
    secondary: {
      main: '#FF69B4',
      light: '#FF89C4',
      dark: '#DF49A4',
    },
    background: {
      default: '#ffffff',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});