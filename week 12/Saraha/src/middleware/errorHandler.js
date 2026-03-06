import multer from "multer";
import { NODE_ENV } from "../../config/config.service.js";

export const GlobalError = (error, req, res, next) => {
  let status = error.cause?.status ?? 500;

  const mood = NODE_ENV === "production";
  const defaultErrorMessage = "something went wrong Sever error";
  const displayErrorMessage = error.message || defaultErrorMessage;

  if (error instanceof multer.MulterError) {
    status = 400;
  }

  return res.status(status).json({
    status,
    errorMessage: mood
      ? status == 500
        ? defaultErrorMessage
        : displayErrorMessage
      : displayErrorMessage,
    extra: error?.cause?.extra,
    stack: mood ? undefined : error.stack,
  });
};
