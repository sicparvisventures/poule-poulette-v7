import crypto from "node:crypto";

import { ADMIN_SESSION_COOKIE } from "./admin-constants";

export { ADMIN_SESSION_COOKIE };

function digest(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD ?? "";
}

export function isAdminConfigured() {
  return getAdminPassword().length > 0;
}

export function createAdminSessionValue(password: string) {
  return digest(`pp-admin:${password}`);
}

export function getExpectedAdminSessionValue() {
  const password = getAdminPassword();
  if (!password) return "";
  return createAdminSessionValue(password);
}

export function isValidAdminPassword(input: string) {
  const expected = getAdminPassword();
  if (!expected || !input) return false;

  const inputBuffer = Buffer.from(input);
  const expectedBuffer = Buffer.from(expected);
  if (inputBuffer.length !== expectedBuffer.length) return false;

  return crypto.timingSafeEqual(inputBuffer, expectedBuffer);
}

export function isValidAdminSession(sessionValue: string | undefined) {
  if (!sessionValue) return false;
  const expected = getExpectedAdminSessionValue();
  if (!expected) return false;

  const inputBuffer = Buffer.from(sessionValue);
  const expectedBuffer = Buffer.from(expected);
  if (inputBuffer.length !== expectedBuffer.length) return false;

  return crypto.timingSafeEqual(inputBuffer, expectedBuffer);
}
