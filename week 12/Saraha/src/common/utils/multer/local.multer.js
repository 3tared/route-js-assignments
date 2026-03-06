import multer from "multer";
import { resolve } from "node:path";
import { randomUUID } from "node:crypto";
import { existsSync, mkdirSync } from "node:fs";
import { fileValidate } from "./validation.multer.js";

export const localFileUpload = ({
  filePath = "general",
  validation = [],
  maxSize = 5,
} = {}) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const pathName = resolve(`../uploads/${filePath}`);
      if (!existsSync(pathName)) {
        mkdirSync(pathName, { recursive: true });
      }
      cb(null, pathName);
    },
    filename: function (req, file, cb) {
      const fileName = randomUUID() + "_" + file.originalname;
      file.finalPath = `uploads/${filePath}/${fileName}`;
      cb(null, fileName);
    },
  });
  return multer({
    fileFilter: fileValidate(validation),
    storage,
    limits: { fileSize: maxSize * 1024 * 1024 },
  });
};
