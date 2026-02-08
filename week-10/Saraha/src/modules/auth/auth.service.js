import {
  ConflictException,
  NotFoundException,
} from "../../common/utils/errors/index.js";
import { create, findOne } from "../../DB/index.js";
import { UserModel } from "../../DB/models/index.js";

export const signup = async (inputs) => {
  const { username, email, password, phone } = inputs;
  const checkEmailExist = await findOne({
    model: UserModel,
    filter: { email },
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
export const login = async (inputs) => {
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
  return user;
};
