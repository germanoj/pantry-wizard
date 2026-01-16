import axios from "axios";
import { API_BASE_URL } from "@/src/config/api";
import * as SecureStore from "expo-secure-store";

const API = API_BASE_URL;
console.log("API baseURL:", API);

if (!API) throw new Error("Missing EXPO_PUBLIC_API_BASE_URL");

type AuthResponse = { token: string; user?: any };

const client = axios.create({
  baseURL: API,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}` };
}

function getErrorMessage(err: unknown) {
  if (axios.isAxiosError(err)) {
    const msg =
      (err.response?.data as any)?.message ||
      (err.response?.data as any)?.error ||
      err.message;
    return msg;
  }
  return err instanceof Error ? err.message : String(err);
}

// ===== login =====
export async function apiLogin(email: string, password: string) {
  try {
    const res = await client.post<AuthResponse>("/auth/login", {
      email,
      password,
    });

    // ✅ Persist token for later API calls (save recipes, fetch saved recipes)
    await SecureStore.setItemAsync("authToken", res.data.token);

    return res.data;
  } catch (err) {
    throw new Error(getErrorMessage(err));
  }
}

// ===== register =====
export async function apiRegister(
  username: string,
  email: string,
  password: string
) {
  try {
    const res = await client.post<AuthResponse>("/auth/register", {
      username,
      email,
      password,
    });

    // ✅ Persist token (your server returns token on successful register)
    await SecureStore.setItemAsync("authToken", res.data.token);

    return res.data;
  } catch (err) {
    throw new Error(getErrorMessage(err));
  }
}

///get user from token ////

export async function apiMe(token: string) {
  try {
    // try one route first (fallback added below)
    const res = await client.get<User>("/auth/me", {
      headers: authHeaders(token),
    });
    return res.data;
  } catch (err) {
    throw new Error(getErrorMessage(err));
  }
}

////update username so users can change their name in the system!! ////

export async function apiUpdateUsername(token: string, username: string) {
  try {
    const res = await client.patch<User>(
      "/users/me",
      { username },
      { headers: authHeaders(token) }
    );
    return res.data;
  } catch (err) {
    throw new Error(getErrorMessage(err));
  }
}
