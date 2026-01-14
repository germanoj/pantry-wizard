//dont need his anymore???

import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "token";

export async function mockRegister(email: string, password: string) {
  if (!email.includes("@")) {
    throw new Error("Invalid email");
  }
  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }
  return { ok: true };
}

export async function mockLogin(email: string, password: string) {
  const fakeToken = `fake-token-${Date.now()}`;
  await AsyncStorage.setItem(TOKEN_KEY, fakeToken);
  return { token: fakeToken };
}

export async function logout() {
  await AsyncStorage.removeItem(TOKEN_KEY);
}

export async function getToken() {
  return AsyncStorage.getItem(TOKEN_KEY);
}
