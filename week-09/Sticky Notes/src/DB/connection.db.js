import mongoose from "mongoose";
import { DB_URI } from "../../config/config.service.js";
import { UserModel } from "./model/user.model.js";
import { NoteModel } from "./model/note.model.js";

export const authenticateDB = async () => {
  try {
    await mongoose.connect(DB_URI);
    await UserModel.syncIndexes();
    await NoteModel.syncIndexes();
    console.log("Connected To The DB Successfully");
  } catch (error) {
    console.log(`failed to connect to the db error:${error}`);
  }
};
