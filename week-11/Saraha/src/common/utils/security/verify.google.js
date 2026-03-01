import { OAuth2Client } from "google-auth-library";
import { WEB_CLIENT_ID } from "../../../../config/config.service.js";
import { BadRequestException } from "../errors/errors.js";
export const verifyGoogleAccount = async (idToken) => {
  const client = new OAuth2Client();
  const ticket = await client.verifyIdToken({
    idToken,
    audience: WEB_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  if (!payload?.email_verified) {
    throw BadRequestException({ message: "Failed To Verify By Google" });
  }
  return payload;
};
