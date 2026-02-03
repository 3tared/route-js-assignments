import { Router } from "express";
import { login, signup } from "./auth.service.js";
import { SuccessfullResponse } from "../../common/utils/response/index.js";
import { verifyToken } from "../../middlewares/auth.js";
const router = Router();
router.post("/users/sign-up", async (req, res, next) => {
  const user = await signup(req.body);
  return SuccessfullResponse({
    res,
    status: 201,
    message: "User Added Successfully",
    data: user,
  });
});
router.post("/users/log-in", async (req, res, next) => {
  const user = await login(req.body);
  return SuccessfullResponse({
    res,
    message: "Login Successfully",
    data: user,
  });
});

export default router;
