import { resolve } from "node:path";
import { config } from "dotenv";

export const NODE_ENV = process.env.NODE_ENV;

const envPath = {
  development: `.env.development`,
  production: `.env.production`,
};

config({ path: resolve(`./config/${envPath[NODE_ENV]}`) });

export const port = process.env.PORT ?? 3000;
export const SALT = process.env.SALT;
export const DB_URI = process.env.DB_URI;
export const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
export const SIGNING_KEY = process.env.SIGNING_KEY;
export const JWT_SECRET = process.env.JWT_SECRET;
