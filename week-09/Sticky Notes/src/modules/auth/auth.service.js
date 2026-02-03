import { JWT_SECRET } from "../../../config/config.service.js";
import jwt from "jsonwebtoken";
import {
  ErrorDublicate,
  ErrorUnauthorized,
} from "../../common/utils/error/index.js";
import { UserModel } from "../../DB/model/user.model.js";

export const signup = async (data) => {
  const { name, email, password, phone, age } = data;
  const checkEmail = await UserModel.findOne({ email });
  if (checkEmail) {
    throw ErrorDublicate("Email Already Exist");
  }
  const user = await UserModel.create([{ name, email, password, phone, age }], {
    select: "password",
  });
  return user;
};
export const login = async (data) => {
  const { email, password } = data;
  const user = await UserModel.findOne({ email }).select("+password");
  if (!user) {
    throw ErrorUnauthorized("Invalid Email Or Password");
  }
  const checkPassword = await user.comparePassword(password);
  if (!checkPassword) {
    throw ErrorUnauthorized("Invalid Email Or Password");
  }
  const payload = {
    userId: user._id,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

  return token;
};
