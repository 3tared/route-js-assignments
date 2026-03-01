import { Router } from "express";
import { profile, rotateToken } from "./user.service.js";
import { SuccessfullResponse } from "../../common/utils/response/index.js";
import { authentication, authorization } from "../../middleware/index.js";
import { TokenTypeEnum } from "../../common/emuns/security.enum.js";
import { endpoint } from "./user.authorization.js";
const router = Router();

router.get(
  "/",
  authentication(),
  authorization(endpoint.profile),
  async (req, res, next) => {
    const userProfile = await profile(req.user);
    return SuccessfullResponse({ res, data: { userProfile } });
  },
);
router.get(
  "/rotate",
  authentication(TokenTypeEnum.refresh),
  async (req, res, next) => {
    const result = await rotateToken(req.user, `${req.protocol}://${req.host}`);
    return SuccessfullResponse({ res, data: { result } });
  },
);
export default router;
