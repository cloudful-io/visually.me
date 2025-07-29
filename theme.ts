
  "use client";
  import { createTheme } from '@mui/material/styles';

  const theme = createTheme({
    cssVariables: {
      colorSchemeSelector: 'data-toolpad-color-scheme',
    },
    colorSchemes: {
      light: {
        palette: {
          primary: {
            main: '#2C7A7B',
            contrastText: '#ffffff',
          },
          secondary: {
            main: '#D8A39D',
            contrastText: '#ffffff',
          },
          background: {
            default: '#ffffff',
            paper: '#ffffff',
          },
        },
      },
      dark: {
        palette: {
          primary: {
            main: '#4FD1C5', 
            contrastText: '#000000',
          },
          secondary: {
            main: '#D8A39D',
            contrastText: '#000000',
          },
          background: {
            default: '#121212',
            paper: '#1e1e1e',
          },
        },
      },
    },
  });

  export default theme;
  