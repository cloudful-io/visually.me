// /lib/encryption.ts
import crypto from "crypto";

// Structure of a single encrypted field stored as JSON
export interface EncryptedField {
  key_version: string;
  ciphertext: string;
  iv: string;
  tag: string;
}

// -------------------------------
// 1. Load all master keys into a key ring
// -------------------------------
const MASTER_KEY_RING: Record<string, Buffer> = {};

for (const [envName, envValue] of Object.entries(process.env)) {
  if (envName.startsWith("APP_ENCRYPTION_MASTER_KEY_")) {
    const version = envName.replace("APP_ENCRYPTION_MASTER_KEY_", "");
    MASTER_KEY_RING[version] = Buffer.from(envValue!, "hex");
  }
}

// The currently active version used for new encryptions
export const ACTIVE_KEY_VERSION =
  process.env.APP_ENCRYPTION_ACTIVE_KEY_VERSION ?? "v1";

if (!MASTER_KEY_RING[ACTIVE_KEY_VERSION]) {
  throw new Error(
    `Active key version ${ACTIVE_KEY_VERSION} missing in env.`
  );
}

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;

// -------------------------------
// 2. Derive a per-user key from versioned master key
// -------------------------------
export function deriveUserKey(
  userId: string,
  keyVersion: string
): Buffer {
  const master = MASTER_KEY_RING[keyVersion];
  if (!master) {
    throw new Error(`Master key for version "${keyVersion}" not found`);
  }

  const salt = Buffer.from(userId, "utf8");
  const info = Buffer.from(`user-attr-key:${keyVersion}`, "utf8");

  const keyMaterial = crypto.hkdfSync(
    "sha256",
    master,
    salt,
    info,
    32
  );

  return Buffer.from(keyMaterial); 
}

// -------------------------------
// 3. Encrypt (always using ACTIVE_KEY_VERSION)
// -------------------------------
export function encryptForUser(userId: string, plaintext: string) {
  const keyVersion = ACTIVE_KEY_VERSION;
  const key = deriveUserKey(userId, keyVersion);

  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  cipher.setAAD(Buffer.from(userId, "utf8"));

  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);

  const tag = cipher.getAuthTag();

  return {
    key_version: keyVersion,
    iv: iv.toString("base64"),
    tag: tag.toString("base64"),
    ciphertext: encrypted.toString("base64"),
  };
}

// -------------------------------
// 4. Decrypt (automatically selects correct key version)
// -------------------------------
export function decryptForUser(
  userId: string,
  payload: {
    key_version: string;
    iv: string;
    tag: string;
    ciphertext: string;
  }
): string {
  const { key_version, iv, tag, ciphertext } = payload;

  const key = deriveUserKey(userId, key_version);
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    key,
    Buffer.from(iv, "base64")
  );

  decipher.setAAD(Buffer.from(userId, "utf8"));
  decipher.setAuthTag(Buffer.from(tag, "base64"));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(ciphertext, "base64")),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}
