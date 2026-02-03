import crypto from "node:crypto";
import { ENCRYPTION_KEY } from "../../../../config/config.service.js";

const ALGORITHM = "aes-256-gcm";
const KEY = Buffer.from(ENCRYPTION_KEY, "hex");

export const encrypt = (text) => {
  if (!text) return text;

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag();

  return iv.toString("hex") + ":" + authTag.toString("hex") + ":" + encrypted;
};

export const decrypt = (encryptedData) => {
  if (!encryptedData || !encryptedData.includes(":")) return encryptedData;

  try {
    const parts = encryptedData.split(":");
    const iv = Buffer.from(parts[0], "hex");
    const authTag = Buffer.from(parts[1], "hex");
    const encrypted = parts[2];

    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    console.error("Decryption failed:", error.message);
    return encryptedData;
  }
};
