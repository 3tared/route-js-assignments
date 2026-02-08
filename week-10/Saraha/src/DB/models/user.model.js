import mongoose from "mongoose";
import { genderEnums, providersEnums } from "../../common/emuns/index.js";
import { compare, genSalt, hash } from "bcrypt";
import { SALT_ROUND } from "../../../config/config.service.js";
import { decrypt, encrypt } from "../../common/utils/security/index.js";

const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 25,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 25,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (email) => emailRegex.test(email),
        message: (props) => `${props.value} is not a valid email address`,
      },
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    gender: {
      type: Number,
      enum: Object.values(genderEnums),
      default: genderEnums.Male,
    },
    providers: {
      type: Number,
      enum: Object.values(providersEnums),
      default: providersEnums.System,
    },
    profilePicture: {
      type: String,
    },
    ProfileCovers: {
      type: [String],
    },
    confirmEmail: {
      type: Date,
    },
    changeCredentialsTime: {
      type: String,
    },
  },
  {
    collection: "ROUTE_USERS",
    timestamps: true,
    optimisticConcurrency: true,
    strict: true,
    strictQuery: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
userSchema
  .virtual("username")
  .set(function (values) {
    const [firstName, lastName] = values?.split(" ") || [];
    this.set({ firstName, lastName });
  })
  .get(function () {
    return this.firstName + " " + this.lastName;
  });

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const salt = await genSalt(SALT_ROUND);
  this.password = await hash(this.password, salt);
});
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await compare(candidatePassword, this.password);
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
