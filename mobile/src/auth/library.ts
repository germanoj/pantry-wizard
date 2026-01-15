import axios from "axios";

const API = process.env.EXPO_PUBLIC_API_URL;
//console.log("API baseURL:", API);

if (!API) throw new Error("Missing API");

export type User = {
  id: string;
  username: string;
  email: string;
};

type AuthResponse = { 
  token: string; 
  user?: User;
}; //changed from user? any to User, trying to connect

const client = axios.create({
  baseURL: API,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

function authHeaders(token: string) {
  return {Authorization: `Bearer ${token}`};
}

function getErrorMessage(err: unknown) {
  if (axios.isAxiosError(err)) {
    // server responded with JSON like { message: "..." }
    const msg =
      (err.response?.data as any)?.message ||
      (err.response?.data as any)?.error ||
      err.message;
    return msg;
  }
  return err instanceof Error ? err.message : String(err);
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
    throw new Error(getErrorMessage(err));
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

////update username ////

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
