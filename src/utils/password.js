async function sha256Hex(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function hashPassword(password) {
  return sha256Hex(password);
}

export async function verifyPassword(password, passwordHash) {
  const h = await sha256Hex(password);
  return h === passwordHash;
}
