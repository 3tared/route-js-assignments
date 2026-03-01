import mongoose from "mongoose";
import { DB_URI } from "../../config/config.service.js";

export const authenticateDB = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log(`DB Connected Successfully`);
  } catch (error) {
    console.log(`Failed To Connect To The Db Error:${error}`);
  }
};
