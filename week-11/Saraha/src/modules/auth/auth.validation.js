import joi from "joi";
import { generalValidationFields } from "../../common/utils/validation.js";

export const login = {
  body: joi
    .object({
      email: generalValidationFields.email.required(),
      password: generalValidationFields.password.required(),
    })
    .required(),
};
export const signup = {
  body: login.body
    .append()
    .keys({
      username: generalValidationFields.username.required(),
      email: generalValidationFields.email.required(),
      phone: generalValidationFields.phone.required(),
      password: generalValidationFields.password.required(),
      confirmPassword: generalValidationFields
        .confirmPassword("password")
        .required(),
    })
    .required(),
};
