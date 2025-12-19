const API_BASE_URL = "http://10.0.11.159:3000";

export async function generateRecipes(pantryText: string) {
  console.log("generateRecipes called");
  const res = await fetch(`${API_BASE_URL}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pantryText }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }

  return res.json();
}
