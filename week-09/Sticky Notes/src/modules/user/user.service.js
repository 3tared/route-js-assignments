import { ErrorDublicate, ErrorNotFound } from "../../common/utils/index.js";
import { UserModel } from "../../DB/model/user.model.js";

export const UpdateUser = async (req) => {
  const { userId } = req.user;
  const { email, age, name } = req.body;
  const user = await UserModel.findById(userId).select("-phone");
  if (!user) {
    throw ErrorNotFound("User Not Found");
  }
  const checkEmail = await UserModel.findOne({
    $and: [{ email }, { _id: { $ne: userId } }],
  });

  if (checkEmail) {
    throw ErrorDublicate("Email Already Exist");
  }
  const updatedUser = await UserModel.updateOne(
    { _id: userId },
    { $set: { email, age, name }, $inc: { __v: 1 } },
    { runValidators: true },
  );
  console.log(updatedUser);
  return updatedUser;
};
export const DeleteUser = async (req) => {
  const { userId } = req.user;
  const user = await UserModel.findById(userId).select("-phone");
  if (!user) {
    throw ErrorNotFound("User Not Found");
  }
  const deletedUser = await UserModel.deleteOne({ _id: userId });
  return deletedUser;
};
export const GetLoggedInUser = async (req) => {
  const { userId } = req.user;
  const user = await UserModel.findById(userId).select("+password");
  if (!user) {
    throw ErrorNotFound("User Not Found");
  }
  return user;
};
