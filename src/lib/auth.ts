export const ADMIN_SESSION_COOKIE = "admin_session";

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function adminSessionToken(): Promise<string | null> {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  return sha256Hex(password);
}

export async function isValidAdminSession(cookieValue: string | undefined): Promise<boolean> {
  if (!cookieValue) return false;
  const expected = await adminSessionToken();
  if (!expected) return false;
  return cookieValue === expected;
}
