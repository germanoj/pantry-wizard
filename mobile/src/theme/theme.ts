export type Theme = {
  mode: "light" | "dark";

  // core colors
  background: string;      // app background
  surface: string;         // cards / panels
  surface2: string;        // slightly elevated surface
  border: string;

  primary: string;         // main brand color (buttons, highlights)
  primaryText: string;     // text/icons on primary
  accent: string;          // magic “spark” (CTAs, highlights)
  accent2: string;         // secondary accent (success/potion)

  text: string;            // main text
  textMuted: string;       // secondary text
  textOnSurface: string;   // text on cards

  // semantic
  success: string;
  warning: string;
  danger: string;

  // shadows/overlays (handy for modals)
  overlay: string;
};

export const lightTheme: Theme = {
  mode: "light",

  background: "#FBF8FF",   // cream parchment
  surface: "#F0EBFF",      // lavender mist
  surface2: "#FFFFFF",     // crisp card
  border: "#DDD6FF",

  primary: "#7B6CF6",      // soft purple
  primaryText: "#FFFFFF",
  accent: "#FFCC66",       // honey gold
  accent2: "#5EC9A8",      // sage mint

  text: "#3B3754",         // plum gray
  textMuted: "#7A7699",    // dusty lavender
  textOnSurface: "#3B3754",

  success: "#37C991",
  warning: "#FFB020",
  danger: "#FF5A6A",

  overlay: "rgba(10, 10, 25, 0.45)",
};

export const darkTheme: Theme = {
  mode: "dark",

  background: "#171733",   // deep indigo
  surface: "#24245A",      // soft purple
  surface2: "#2E2E6D",     // elevated surface
  border: "#3A3A86",

  primary: "#8B7CF6",      // lavender purple
  primaryText: "#0F1026",  // dark ink on bright purple
  accent: "#FFD36A",       // butter gold
  accent2: "#6EE7C8",      // mint potion

  text: "#F6F6FF",         // soft white
  textMuted: "#C8C7E8",    // lavender gray
  textOnSurface: "#F6F6FF",

  success: "#46E2A6",
  warning: "#FFC24A",
  danger: "#FF6B7A",

  overlay: "rgba(0, 0, 0, 0.55)",
};

// Optional: consistent radii & spacing
export const ui = {
  radius: {
    sm: 10,
    md: 16,
    lg: 22,
    pill: 999,
  },
  spacing: {
    xs: 6,
    sm: 10,
    md: 16,
    lg: 24,
    xl: 32,
  },
};