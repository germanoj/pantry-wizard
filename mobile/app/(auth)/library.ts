import axios from "axios";

const API = process.env.EXPO_PUBLIC_API_URL;
console.log("API baseURL:", API);

if (!API) throw new Error("Missing EXPO_PUBLIC_API_URL");

type AuthResponse = { token: string; user?: any }; //guard, optional for a user to exist

const client = axios.create({
  baseURL: API,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

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
    const res = await client.post<AuthResponse>("/auth/login", { email, password });
    return res.data;
  } catch (err) {
    throw new Error(getErrorMessage(err));
  }
}

//////////
//register api
//////////


export async function apiRegister(username: string, email: string, password: string) {
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
