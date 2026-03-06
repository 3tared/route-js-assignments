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

export const JWT_ACCESS_ADMIN_SECRET_KEY =
  process.env.JWT_ACCESS_ADMIN_SECRET_KEY;
export const JWT_ACCESS_USER_SECRET_KEY =
  process.env.JWT_ACCESS_USER_SECRET_KEY;
export const JWT_REFRESH_ADMIN_SECRET_KEY =
  process.env.JWT_REFRESH_ADMIN_SECRET_KEY;
export const JWT_REFRESH_USER_SECRET_KEY =
  process.env.JWT_REFRESH_USER_SECRET_KEY;
export const JWT_REFRESH_EXPIRES_IN = parseInt(
  process.env.JWT_REFRESH_EXPIRES_IN,
);
export const JWT_ACCESS_EXPIRES_IN = parseInt(
  process.env.JWT_ACCESS_EXPIRES_IN,
);
export const WEB_CLIENT_ID = process.env.WEB_CLIENT_ID;
