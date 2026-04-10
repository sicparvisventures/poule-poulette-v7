/**
 * Edge-safe admin session checks for middleware (no node:crypto).
 * Must stay in sync with {@link ./admin.ts} session digest algorithm.
 */
import { ADMIN_SESSION_COOKIE } from "./admin-constants";

export { ADMIN_SESSION_COOKIE };

export function isAdminConfigured(): boolean {
  return (process.env.ADMIN_PASSWORD ?? "").length > 0;
}

async function sha256HexUtf8(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function hexToU8(hex: string): Uint8Array | null {
  if (hex.length % 2 !== 0) return null;
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) {
    const byte = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16);
    if (Number.isNaN(byte)) return null;
    out[i] = byte;
  }
  return out;
}

function timingSafeEqualBytes(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a[i]! ^ b[i]!;
  }
  return diff === 0;
}

async function expectedSessionDigestHex(): Promise<string> {
  const password = process.env.ADMIN_PASSWORD ?? "";
  if (!password) return "";
  return sha256HexUtf8(`pp-admin:${password}`);
}

export async function isValidAdminSession(
  sessionValue: string | undefined,
): Promise<boolean> {
  if (!sessionValue) return false;
  const expected = await expectedSessionDigestHex();
  if (!expected) return false;

  const a = hexToU8(sessionValue);
  const b = hexToU8(expected);
  if (!a || !b) return false;

  return timingSafeEqualBytes(a, b);
}
