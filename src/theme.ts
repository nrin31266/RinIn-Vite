// src/theme.js
import { createTheme } from '@mui/material/styles';

const rootStyles = getComputedStyle(document.documentElement);

// Lấy từng CSS variable
const primaryColor       = rootStyles.getPropertyValue('--primary-color').trim();
const secondaryColor     = rootStyles.getPropertyValue('--secondary-color').trim();
const primaryColorDark   = rootStyles.getPropertyValue('--primary-color-dark').trim();
const backgroundColor    = rootStyles.getPropertyValue('--background-color').trim();
const textColor          = rootStyles.getPropertyValue('--text-color').trim();
const textColorLight     = rootStyles.getPropertyValue('--text-color-light').trim();

const theme = createTheme({

  palette: {
    primary: {
      main:  primaryColor,
      dark:  primaryColorDark,
      contrastText: textColorLight,
    },
    secondary: {
      main:  secondaryColor,
      contrastText: textColorLight,
    },
    background: {
      default: backgroundColor,
      paper:   '#FFFFFF',
    },
    text: {
      primary:   textColor,
      secondary: textColorLight,
    },
  },
  typography: {
    fontFamily: '"Poppins", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          color: textColorLight,
        },
      },
    },
    
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: backgroundColor,
        },
      },
    },
    
    
  },
  
});

export default theme;
