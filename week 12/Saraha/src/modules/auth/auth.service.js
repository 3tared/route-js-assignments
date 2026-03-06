import { providersEnums } from "../../common/emuns/user.enums.js";
import {
  ConflictException,
  NotFoundException,
} from "../../common/utils/errors/index.js";
import {
  createLoginCredentials,
  verifyGoogleAccount,
} from "../../common/utils/security/index.js";
import { create, findOne } from "../../DB/index.js";
import { UserModel } from "../../DB/models/index.js";

export const signup = async (inputs) => {
  const { username, email, password, phone } = inputs;
  const checkEmailExist = await findOne({
    model: UserModel,
    filter: { email, providers: providersEnums.System },
  });
  if (checkEmailExist) {
    throw ConflictException({ message: "Email Already Exist" });
  }
  const user = await create({
    model: UserModel,
    data: { username, email, password, phone },
  });
  return user;
};
export const login = async (inputs, issuer) => {
  const { email, password } = inputs;
  const user = await findOne({
    model: UserModel,
    filter: { email },
  });
  if (!user) {
    throw NotFoundException({ message: "Invalid Email Or Password" });
  }
  const matchPassword = await user.comparePassword(password);
  if (!matchPassword) {
    throw NotFoundException({ message: "Invalid Email Or Password" });
  }

  return await createLoginCredentials(user, issuer);
};
export const loginWithGmail = async (idToken, issuer) => {
  const payload = await verifyGoogleAccount(idToken);
  const user = await findOne({
    model: UserModel,
    filter: { email: payload.email, providers: providersEnums.Google },
  });
  if (!user) {
    throw NotFoundException({ message: "Not Registerd Account" });
  }

  return await createLoginCredentials(user, issuer);
};

export const signupWithGmail = async (idToken, issuer) => {
  const payload = await verifyGoogleAccount(idToken);
  const checkExist = await findOne({
    model: UserModel,
    filter: { email: payload.email },
  });
  if (checkExist) {
    if (checkExist.providers != providersEnums.Google) {
      throw ConflictException({ message: "Invalid Login Provider" });
    }
    return { status: 200, credentials: await loginWithGmail(idToken, issuer) };
  }

  const user = await create({
    model: UserModel,
    data: {
      firstName: payload.given_name,
      lastName: payload.family_name,
      email: payload.email,
      providers: providersEnums.Google,
      profilePicture: payload.picture,
      confirmEmail: new Date(),
    },
  });

  return {
    status: 201,
    credentials: await createLoginCredentials(user, issuer),
  };
};
