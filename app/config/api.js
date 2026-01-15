import Constants from "expo-constants";

const extra =
  (Constants.expoConfig?.extra as any) ||
  (Constants.manifest2?.extra as any) ||
  {};

export const API_BASE_URL =
  extra.API_BASE_URL || "https://pantry-wizard-api.onrender.com";

  console.log("📱 MOBILE API_BASE_URL (from Constants.extra):", API_BASE_URL);