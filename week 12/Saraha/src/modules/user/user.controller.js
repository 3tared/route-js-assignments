import { Router } from "express";
import {
  logout,
  profile,
  profileCoverImages,
  profileImage,
  rotateToken,
} from "./user.service.js";
import { SuccessfullResponse } from "../../common/utils/response/index.js";
import {
  authentication,
  authorization,
  validation,
} from "../../middleware/index.js";
import { TokenTypeEnum } from "../../common/emuns/security.enum.js";
import { endpoint } from "./user.authorization.js";
import { localFileUpload } from "../../common/utils/multer/local.multer.js";
import { fileFieldValidation } from "../../common/utils/multer/validation.multer.js";
import * as validators from "./user.validation.js";
const router = Router();

router.post("/logout", authentication(), async (req, res, next) => {
  const status = await logout(req.body, req.user, req.decoded);
  return SuccessfullResponse({ res, status });
});

router.patch(
  "/profile-image",
  authentication(),
  localFileUpload({
    filePath: "users/profile",
    validation: fileFieldValidation.image,
  }).single("attachment"),
  validation(validators.profileImage),
  async (req, res, next) => {
    const account = await profileImage(req.file, req.user);
    return SuccessfullResponse({ res, message: { account } });
  },
);
router.patch(
  "/profile-cover-images",
  authentication(),
  localFileUpload({
    filePath: "users/profile/cover",
    validation: fileFieldValidation.image,
  }).array("attachments", 5),
  validation(validators.profileCoverImage),
  async (req, res, next) => {
    const account = await profileCoverImages(req.files, req.user);
    return SuccessfullResponse({ res, message: { account } });
  },
);
router.get(
  "/",
  authentication(),
  authorization(endpoint.profile),
  async (req, res, next) => {
    const userProfile = await profile(req.user);
    return SuccessfullResponse({ res, data: { userProfile } });
  },
);
router.post(
  "/rotate",
  authentication(TokenTypeEnum.refresh),
  async (req, res, next) => {
    const credentials = await rotateToken(
      req.user,
      req.decoded,
      `${req.protocol}://${req.host}`,
    );
    return SuccessfullResponse({ res, data: { credentials } });
  },
);
export default router;
