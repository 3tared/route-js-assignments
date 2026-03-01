import { Router } from "express";
import { login, signup, signupWithGmail } from "./auth.service.js";
import { SuccessfullResponse } from "../../common/utils/response/index.js";
import * as validators from "./auth.validation.js";

import { validation } from "../../middleware/index.js";

const router = Router();

router.post(
  "/signup",
  validation(validators.signup),
  async (req, res, next) => {
    const account = await signup(req.body);
    return SuccessfullResponse({ res, status: 201, data: { account } });
  },
);
router.post("/login", validation(validators.login), async (req, res, next) => {
  const account = await login(req.body, `${req.protocol}://${req.host}`);
  return SuccessfullResponse({ res, data: { account } });
});
router.post("/signup/gmail", async (req, res, next) => {
  const { status, credentials } = await signupWithGmail(
    req.body.idToken,
    `${req.protocol}://${req.host}`,
  );
  return SuccessfullResponse({ res, status, data: { ...credentials } });
});
export default router;
