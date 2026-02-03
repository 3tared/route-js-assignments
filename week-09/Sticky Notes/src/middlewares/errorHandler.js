import { NODE_ENV } from "../../config/config.service.js";

export const GlobalError = (error, req, res, next) => {
  const status = error.statusCode || error.status || error.cause?.status || 500;
  return res.status(status).json({
    error_message:
      status == 500
        ? "something went wrong"
        : (error.message ?? "something went wrong"),
    stack: NODE_ENV == "development" ? error.stack : undefined,
  });
};
