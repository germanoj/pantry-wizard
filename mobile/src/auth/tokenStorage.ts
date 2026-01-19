import { getItem, setItem, removeItem } from "@/src/lib/storage";

const TOKEN_KEY = "authToken";

export async function getToken() {
  return await getItem(TOKEN_KEY);
}

export async function setToken(token: string) {
  await setItem(TOKEN_KEY, token);
}

export async function clearToken() {
  await removeItem(TOKEN_KEY);
}
