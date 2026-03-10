import { randomBytes, createCipheriv, createDecipheriv, createHash } from "crypto";

const ALGORITHM = "aes-256-gcm";

function getKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) throw new Error("ENCRYPTION_KEY environment variable is required");
  return Buffer.from(key, "hex");
}

export function encrypt(plaintext: string): {
  encryptedValue: string;
  iv: string;
  authTag: string;
} {
  const key = getKey();
  const iv = randomBytes(16);
  const cipher = createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(plaintext, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag();

  return {
    encryptedValue: encrypted,
    iv: iv.toString("hex"),
    authTag: authTag.toString("hex"),
  };
}

export function decrypt(
  encryptedValue: string,
  iv: string,
  authTag: string
): string {
  const key = getKey();
  const decipher = createDecipheriv(ALGORITHM, key, Buffer.from(iv, "hex"));
  decipher.setAuthTag(Buffer.from(authTag, "hex"));

  let decrypted = decipher.update(encryptedValue, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

export function generateToken(): string {
  return randomBytes(32).toString("hex");
}

export function hashMachineCode(code: string): string {
  return createHash("sha256").update(code.trim().toLowerCase()).digest("hex");
}
