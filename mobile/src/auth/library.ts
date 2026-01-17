import axios, { isAxiosError } from "axios";

const API = process.env.EXPO_PUBLIC_API_URL;
//console.log("API baseURL:", API);

if (!API) throw new Error("Missing API");

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
    message:
      data?.message ||
      data?.error ||
      err.message ||
      "Request failed",
    code: data?.code,
    };
  }
  return {
    message: err instanceof Error ? err.message : String(err),
  };
}

////////////
//login API
////////////

export async function apiLogin(email: string, password: string) {
  try {
    const res = await client.post<AuthResponse>("/auth/login", {
      email,
      password,
    });
    return res.data;
  } catch (err) {
    throw getErrorMessage(err);
  }
}

//////////
//register api
//////////

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
    return res.data;
  } catch (err) {
    throw getErrorMessage(err);
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
    throw getErrorMessage(err);
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
    throw getErrorMessage(err);
  }
}

//deactivate api//

export async function apiDeactivateAccount(token: string) {
  try {
    const res = await client.post<{ ok: boolean }>(
      "/users/me/deactivate",
      {}, // no body
      { headers: authHeaders(token) }
    );
    return res.data;
  } catch (err) {
    throw getErrorMessage(err);
  }
}


//reactive api//
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
