import { TokenTypeEnum } from "../common/emuns/security.enum.js";
import {
  BadRequestException,
  ForbiddenException,
} from "../common/utils/errors/errors.js";
import { decodeToken } from "../common/utils/security/index.js";

export const authentication = (tokenType = TokenTypeEnum.access) => {
  return async (req, res, next) => {
    if (!req?.headers?.authorization) {
      throw BadRequestException({ message: "Missing Authorization Key" });
    }
    const { authorization } = req.headers;
    const [flag, credentials] = authorization.split(" ");
    if (!flag || !credentials) {
      throw BadRequestException({ message: "Missing Authorization Parts" });
    }
    const { user, decoded } = await decodeToken({
      token: credentials,
      tokenType,
    });
    ((req.user = user), (req.decoded = decoded));
    next();
  };
};
export const authorization = (accessRoles = []) => {
  return async (req, res, next) => {
    if (!accessRoles.includes(req.user.role)) {
      throw ForbiddenException({ message: "Not Allowed User" });
    }
    next();
  };
};
