import { BadRequestException } from "../common/utils/errors/errors.js";

export const validation = (schema) => {
  return (req, res, next) => {
    const errors = [];
    for (const key of Object.keys(schema) || []) {
      const validation = schema[key].validate(req[key], { abortEarly: false });
      if (validation.error) {
        errors.push({
          key,
          details: validation.error.details.map((ele) => {
            return { path: ele.path, message: ele.message };
          }),
        });
      }
    }
    if (errors.length) {
      throw BadRequestException({
        message: "validation error",
        extra: errors,
      });
    }
    next();
  };
};
