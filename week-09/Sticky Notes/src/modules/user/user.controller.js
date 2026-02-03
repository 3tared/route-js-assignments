import { Router } from "express";
import { DeleteUser, GetLoggedInUser, UpdateUser } from "./user.service.js";
import { SuccessfullResponse } from "../../common/utils/index.js";
import { verifyToken } from "../../middlewares/auth.js";
const router = Router();

router.patch("/", verifyToken, async (req, res, next) => {
  const updatedUser = await UpdateUser(req);
  return SuccessfullResponse({
    res,
    message: "User Updated Successfully",
    data: updatedUser,
  });
});
router.delete("/", verifyToken, async (req, res, next) => {
  const deletedUser = await DeleteUser(req);
  return SuccessfullResponse({
    res,
    message: "User Deleted Successfully",
    data: deletedUser,
  });
});
router.get("/", verifyToken, async (req, res, next) => {
  const user = await GetLoggedInUser(req);
  return SuccessfullResponse({
    res,
    data: user,
  });
});
export default router;
