import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { SALT } from "../../../config/config.service.js";
import { decrypt, encrypt } from "../../common/utils/index.js";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    phone: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      validate: {
        validator: function (v) {
          if (v < 18) {
            return false;
          }
          if (v > 60) {
            return false;
          }
        },
        message: function (props) {
          return `Age Must be between 18 and 60 Not:${props.value}`;
        },
      },
    },
  },
  {
    collection: "ROUTE_USERS",
  },
);
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  const salt = await bcrypt.genSalt(parseInt(SALT));
  this.password = await bcrypt.hash(this.password, salt);
});
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
userSchema.pre("save", function () {
  if (this.isModified("phone") && this.phone) {
    this.phone = encrypt(this.phone);
  }
});
userSchema.post("find", function (docs) {
  docs.forEach((doc) => {
    if (doc.phone) doc.phone = decrypt(doc.phone);
  });
});

userSchema.post("findOne", function (doc) {
  if (doc) {
    if (doc.phone) doc.phone = decrypt(doc.phone);
  }
});

userSchema.post("findOneAndUpdate", function (doc) {
  if (doc) {
    if (doc.phone) doc.phone = decrypt(doc.phone);
  }
});
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  if (obj.phone) obj.phone = decrypt(obj.phone);
  delete obj.password;
  return obj;
};
export const UserModel =
  mongoose.models.User || mongoose.model("User", userSchema);
