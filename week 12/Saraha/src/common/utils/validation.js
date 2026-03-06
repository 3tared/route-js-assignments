import joi from "joi";

export const generalValidationFields = {
  username: joi
    .string()
    .pattern(new RegExp(/^[A-Z]{1}[a-z]{1,24}\s[A-Z]{1}[a-z]{1,24}$/))
    .min(4)
    .max(25)
    .messages({
      "any.required": "Username Is Required",
      "string.min": "Username Must Be Between 4 Charaters To 25",
      "string.max": "Username Must Be Between 4 Charaters To 25",
    }),
  email: joi
    .string()
    .email({
      minDomainSegments: 2,
      maxDomainSegments: 3,
      tlds: { allow: ["com", "net"] },
    })
    .messages({
      "any.required": "Email Is Required",
      "string.email": "Email Must Be A Formatted Email Like example@test.com",
    }),
  phone: joi.string().pattern(new RegExp(/^(00201|\+201|01)(0|1|2|5)\d{8}$/)),
  password: joi
    .string()
    .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,16}$/)),
  confirmPassword: function (path = "password") {
    return joi.string().valid(joi.ref(path));
  },
  file: function (validation = []) {
    return joi.object().keys({
      fieldname: joi.string().required(),
      originalname: joi.string().required(),
      encoding: joi.string().required(),
      mimetype: joi
        .string()
        .valid(...Object.values(validation))
        .required(),
      finalPath: joi.string().required(),
      destination: joi.string().required(),
      filename: joi.string().required(),
      path: joi.string().required(),
      size: joi.number().required(),
    });
  },
};
