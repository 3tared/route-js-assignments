import { JWT_REFRESH_EXPIRES_IN } from "../../../config/config.service.js";
import { LogoutEnum } from "../../common/emuns/security.enum.js";
import { ConflictException } from "../../common/utils/errors/errors.js";
import { createLoginCredentials } from "../../common/utils/security/index.js";
import { create, deleteMany } from "../../DB/database.repository.js";
import { TokenModel } from "../../DB/models/token.model.js";

export const logout = async ({ flag }, user, { jti, iat }) => {
  let status = 200;
  switch (false) {
    case LogoutEnum.All:
      user.changeCredentialsTime = new Date();
      await user.save();
      await deleteMany({ model: TokenModel, filter: { userId: user._id } });
      break;

    default:
      await create({
        model: TokenModel,
        data: {
          userId: user._id,
          jti,
          expiresIn: new Date((iat + JWT_REFRESH_EXPIRES_IN) * 1000),
        },
      });
      status = 201;
      break;
  }
  return status;
};

export const profileImage = async (file, user) => {
  user.profilePicture = file.finalPath;
  await user.save();
  return user;
};

export const profileCoverImages = async (files, user) => {
  console.log(files.map((file) => file));
  user.ProfileCovers = files.map((file) => file.finalPath);
  await user.save();
  return user;
};
export const profile = async (user) => {
  return user;
};
export const rotateToken = async (user, { jti, iat }, issuer) => {
  if ((iat + JWT_REFRESH_EXPIRES_IN) * 1000 >= Date.now() + 30000) {
    ConflictException({ message: "Current Access Token Still Valid" });
  }
  await create({
    model: TokenModel,
    data: {
      userId: user._id,
      jti,
      expiresIn: new Date((iat + JWT_REFRESH_EXPIRES_IN) * 1000),
    },
  });
  return await createLoginCredentials(user, issuer);
};
