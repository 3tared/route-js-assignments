import { createLoginCredentials } from "../../common/utils/security/index.js";
export const profile = async (user) => {
  return user;
};
export const rotateToken = async (user, issuer) => {
  return await createLoginCredentials(user, issuer);
};
