import { createTheme } from "@mui/material/styles";
import { Plus_Jakarta_Sans } from "next/font/google";

export const plus = Plus_Jakarta_Sans({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Helvetica", "Arial", "sans-serif"],
});

export const baselightTheme = createTheme({
  direction: "ltr",
  palette: {
    mode: "light",
    primary: {
      main: '#2C7A7B',
      light: "#4FD1C5",
      dark: "#285E61",
    },
    secondary: {
      main: '#D8A39D',
      light: "#E8B9B4",
      dark: "#C37F76",
    },
    success: {
      main: "#4caf50",
      light: "#81c784",
      dark: "#388e3c",
      contrastText: "#ffffff",
    },
    info: {
      main: "#539BFF",
      light: "#EBF3FE",
      dark: "#1682d4",
      contrastText: "#ffffff",
    },
    error: {
      main: "#FA896B",
      light: "#FDEDE8",
      dark: "#f3704d",
      contrastText: "#ffffff",
    },
    warning: {
      main: "#FFAE1F",
      light: "#FEF5E5",
      dark: "#ae8e59",
      contrastText: "#ffffff",
    },
    grey: {
      100: "#F2F6FA",
      200: "#EAEFF4",
      300: "#DFE5EF",
      400: "#7C8FAC",
      500: "#5A6A85",
      600: "#2A3547",
    },
    text: {
      primary: "#2A3547",
      secondary: "#5A6A85",
    },
    action: {
      disabledBackground: "rgba(73,82,88,0.12)",
      hoverOpacity: 0.02,
      hover: "#f6f9fc",
    },
    divider: "#e5eaef",
  },
  typography: {
    fontFamily: plus.style.fontFamily,
    h1: { fontWeight: 600, fontSize: "2.25rem", lineHeight: "2.75rem" },
    h2: { fontWeight: 600, fontSize: "1.875rem", lineHeight: "2.25rem" },
    h3: { fontWeight: 600, fontSize: "1.5rem", lineHeight: "1.75rem" },
    h4: { fontWeight: 600, fontSize: "1.3125rem", lineHeight: "1.6rem" },
    h5: { fontWeight: 600, fontSize: "1.125rem", lineHeight: "1.6rem" },
    h6: { fontWeight: 600, fontSize: "1rem", lineHeight: "1.2rem" },
    button: { textTransform: "capitalize", fontWeight: 400 },
    body1: { fontSize: "0.875rem", fontWeight: 400, lineHeight: "1.334rem" },
    body2: { fontSize: "0.75rem", fontWeight: 400, lineHeight: "1rem" },
    subtitle1: { fontSize: "0.875rem", fontWeight: 400 },
    subtitle2: { fontSize: "0.875rem", fontWeight: 400 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ".MuiPaper-elevation9, .MuiPopover-root .MuiPaper-elevation": {
          boxShadow:
            "rgb(145 158 171 / 30%) 0px 0px 2px 0px, rgb(145 158 171 / 12%) 0px 12px 24px -4px !important",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: "7px" },
      },
    },
  },
});

// -------------------
// 🌙 Dark Theme
// -------------------
export const basedarkTheme = createTheme({
  direction: "ltr",
  palette: {
    mode: "dark",
    primary: {
      main: '#4FD1C5', 
      light: "#7EE3DA",
      dark: "#319795",
    },
    secondary: {
      main: "#ECC94B",  
      light: "#F6E397",
      dark: "#B2892D",
    },
    success: {
      main: "#4caf50",
      light: "#81c784",
      dark: "#388e3c",
      contrastText: "#ffffff",
    },
    info: {
      main: "#64B5F6",
      light: "#90CAF9",
      dark: "#1976D2",
      contrastText: "#ffffff",
    },
    error: {
      main: "#F87171",
      light: "#FCA5A5",
      dark: "#EF4444",
      contrastText: "#ffffff",
    },
    warning: {
      main: "#FBBF24",
      light: "#FCD34D",
      dark: "#B45309",
      contrastText: "#ffffff",
    },
    grey: {
      100: "#1E293B",
      200: "#334155",
      300: "#475569",
      400: "#94A3B8",
      500: "#CBD5E1",
      600: "#E2E8F0",
    },
    text: {
      primary: "#E2E8F0",
      secondary: "#94A3B8",
    },
    background: {
      default: "#0F172A",  // main app background
      paper: "#1E293B",    // cards, modals, etc.
    },
    action: {
      disabledBackground: "rgba(255,255,255,0.12)",
      hoverOpacity: 0.08,
      hover: "rgba(255,255,255,0.05)",
    },
    divider: "rgba(255,255,255,0.12)",
  },
  typography: {
    fontFamily: plus.style.fontFamily,
    h1: { fontWeight: 600, fontSize: "2.25rem", lineHeight: "2.75rem" },
    h2: { fontWeight: 600, fontSize: "1.875rem", lineHeight: "2.25rem" },
    h3: { fontWeight: 600, fontSize: "1.5rem", lineHeight: "1.75rem" },
    h4: { fontWeight: 600, fontSize: "1.3125rem", lineHeight: "1.6rem" },
    h5: { fontWeight: 600, fontSize: "1.125rem", lineHeight: "1.6rem" },
    h6: { fontWeight: 600, fontSize: "1rem", lineHeight: "1.2rem" },
    button: { textTransform: "capitalize", fontWeight: 400 },
    body1: { fontSize: "0.875rem", fontWeight: 400, lineHeight: "1.334rem" },
    body2: { fontSize: "0.75rem", fontWeight: 400, lineHeight: "1rem" },
    subtitle1: { fontSize: "0.875rem", fontWeight: 400 },
    subtitle2: { fontSize: "0.875rem", fontWeight: 400 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#0F172A",
          color: "#E2E8F0",
        },
        ".MuiPaper-elevation9, .MuiPopover-root .MuiPaper-elevation": {
          boxShadow:
            "rgb(0 0 0 / 40%) 0px 0px 2px 0px, rgb(0 0 0 / 25%) 0px 12px 24px -4px !important",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "7px",
          backgroundColor: "#1E293B",
        },
      },
    },
  },
});
