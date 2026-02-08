import { Router } from "express";
import { login, signup } from "./auth.service.js";
import { SuccessfullResponse } from "../../common/utils/response/index.js";
const router = Router();
router.post("/signup", async (req, res, next) => {
  const account = await signup(req.body);
  return SuccessfullResponse({ res, status: 201, data: { account } });
});
router.post("/login", async (req, res, next) => {
  const account = await login(req.body);
  return SuccessfullResponse({ res, data: { account } });
});

export default router;
