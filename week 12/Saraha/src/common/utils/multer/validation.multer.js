export const fileFieldValidation = {
  image: ["image/jpeg", "image/jpg", "image/png"],
  video: ["video/mp4"],
};
export const fileValidate = (validatation = []) => {
  return (req, file, cb) => {
    if (!validatation.includes(file.mimetype)) {
      return cb(
        new Error("Invalid File Type", { cause: { status: 400 } }),
        false,
      );
    }
    return cb(null, true);
  };
};
