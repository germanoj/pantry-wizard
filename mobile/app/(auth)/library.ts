const API = process.env.EXPO_PUBLIC_API_URL;

if (!API) {
  throw new Error("Missing API");
}

type AuthResponse = { token: string };

export async function apiLogin(email: string, password: string) {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.message || "Login failed");
  }

  return data as AuthResponse;
}

export async function apiRegister(username: string, email: string, password: string) {
  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.message || "Registration failed");
  }

  return data as AuthResponse;
}
console.log("API URL:", API);
