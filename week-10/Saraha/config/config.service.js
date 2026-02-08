import { resolve } from "node:path";
import { config } from "dotenv";

const envPath = {
  development: `.env.development`,
  production: `.env.production`,
};

export const NODE_ENV = process.env.NODE_ENV;
config({ path: resolve(`./config/${envPath[NODE_ENV]}`) });

export const port = process.env.PORT ?? 3000;

export const DB_URI = process.env.DB_URI;

export const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
export const IV = parseInt(process.env.IV ?? "16");
export const SALT_ROUND = parseInt(process.env.SALT_ROUND ?? "12");
