import axios, { isAxiosError } from "axios";
import { API_BASE_URL } from "@/src/config/api";
import * as SecureStore from "expo-secure-store";

const API = API_BASE_URL;
console.log("API baseURL:", API);

// Expo public env var guard
if (!API) throw new Error("Missing EXPO_PUBLIC_API_BASE_URL");

export type User = {
  id: string;
  username: string;
  email: string;
};

export type AuthError = {
  message: string;
  code?: string;
};

type AuthResponse = {
  token: string;
  user?: User;
};

const client = axios.create({
  baseURL: API,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}` };
}

function getErrorMessage(err: unknown): AuthError {
  if (isAxiosError(err)) {
    const data = err.response?.data as any;
    return {
      message: data?.message || data?.error || err.message || "Request failed",
      code: data?.code,
    };
  }

  return {
    message: err instanceof Error ? err.message : String(err),
  };
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
    throw getErrorMessage(err);
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
    throw getErrorMessage(err);
  }
}

// ===== me =====
export async function apiMe(token: string) {
  try {
    const res = await client.get<User>("/auth/me", {
      headers: authHeaders(token),
    });
    return res.data;
  } catch (err) {
    throw getErrorMessage(err);
  }
}

// ===== update username =====
export async function apiUpdateUsername(token: string, username: string) {
  try {
    const res = await client.patch<User>(
      "/users/me",
      { username },
      { headers: authHeaders(token) }
    );
    return res.data;
  } catch (err) {
    throw getErrorMessage(err);
  }
}

// ===== deactivate =====
export async function apiDeactivateAccount(token: string) {
  try {
    const res = await client.post<{ ok: boolean }>(
      "/users/me/deactivate",
      {},
      { headers: authHeaders(token) }
    );
    return res.data;
  } catch (err) {
    throw getErrorMessage(err);
  }
}

// ===== reactivate =====
export async function apiReactivate(email: string, password: string) {
  try {
    const res = await client.post<AuthResponse>("/auth/reactivate", {
      email,
      password,
    });
    return res.data; // { token, user }
  } catch (err) {
    throw getErrorMessage(err);
  }
}
