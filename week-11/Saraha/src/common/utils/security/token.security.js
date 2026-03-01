import jwt from "jsonwebtoken";
import {
  JWT_ACCESS_ADMIN_SECRET_KEY,
  JWT_ACCESS_EXPIRES_IN,
  JWT_ACCESS_USER_SECRET_KEY,
  JWT_REFRESH_ADMIN_SECRET_KEY,
  JWT_REFRESH_EXPIRES_IN,
  JWT_REFRESH_USER_SECRET_KEY,
} from "../../../../config/config.service.js";
import { RoleEnum } from "../../emuns/user.enums.js";
import { AudienceEnum, TokenTypeEnum } from "../../emuns/security.enum.js";
import {
  BadRequestException,
  UnauthorizedException,
} from "../errors/errors.js";
import { findOne } from "../../../DB/database.repository.js";
import { UserModel } from "../../../DB/models/user.model.js";

export const generateToken = async ({
  payload = {},
  secret = JWT_ACCESS_USER_SECRET_KEY,
  options = {},
} = {}) => {
  return jwt.sign(payload, secret, options);
};
export const verifyToken = async ({
  token,
  secret = JWT_ACCESS_USER_SECRET_KEY,
  options = {},
} = {}) => {
  return jwt.verify(token, secret, options);
};
export const getTokenSignature = async (role) => {
  let accessSignature = null;
  let refreshSignature = null;
  let audience = AudienceEnum.User;

  switch (role) {
    case RoleEnum.Admin:
      accessSignature = JWT_ACCESS_ADMIN_SECRET_KEY;
      refreshSignature = JWT_REFRESH_ADMIN_SECRET_KEY;
      audience = AudienceEnum.Admin;
      break;
    default:
      accessSignature = JWT_ACCESS_USER_SECRET_KEY;
      refreshSignature = JWT_REFRESH_USER_SECRET_KEY;
      audience = AudienceEnum.User;
      break;
  }
  return { accessSignature, refreshSignature, audience };
};
export const getSignatureLevel = async (audienceType) => {
  let signatureLevel;
  switch (audienceType) {
    case AudienceEnum.Admin:
      signatureLevel = RoleEnum.Admin;
      break;
    default:
      signatureLevel = RoleEnum.User;
      break;
  }
  return signatureLevel;
};
export const createLoginCredentials = async (user, issuer) => {
  const { accessSignature, refreshSignature, audience } =
    await getTokenSignature(user.role);
  const access_token = await generateToken({
    payload: {
      sub: user._id,
    },
    secret: accessSignature,
    options: {
      issuer,
      audience: [TokenTypeEnum.access, audience],
      expiresIn: JWT_ACCESS_EXPIRES_IN,
    },
  });
  const refresh_token = await generateToken({
    payload: {
      sub: user._id,
    },
    secret: refreshSignature,
    options: {
      issuer,
      audience: [TokenTypeEnum.refresh, audience],
      expiresIn: JWT_REFRESH_EXPIRES_IN,
    },
  });
  return { access_token, refresh_token };
};

export const decodeToken = async ({
  token,
  tokenType = TokenTypeEnum.access,
} = {}) => {
  const decoded = jwt.decode(token);
  if (!decoded?.aud?.length) {
    throw BadRequestException({
      message: "Failed To Decode The Token No Aud",
    });
  }
  const [decodedTokenType, audienceType] = decoded.aud;
  if (decodedTokenType !== tokenType) {
    throw BadRequestException({ message: `Invalid token type` });
  }
  const signatureLevel = await getSignatureLevel(audienceType);
  const { accessSignature, refreshSignature } =
    await getTokenSignature(signatureLevel);
  const verifiedData = await verifyToken({
    token,
    secret:
      tokenType == TokenTypeEnum.refresh ? refreshSignature : accessSignature,
  });
  const user = await findOne({
    model: UserModel,
    filter: { _id: verifiedData.sub },
  });
  if (!user) {
    throw UnauthorizedException({ message: "Not Register Account" });
  }
  return user;
};
