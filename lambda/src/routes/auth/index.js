import express from "express";
import { loginValidator, registerValidator } from "../../validators/index.js";
import { rateLimit, checkValidation } from "../../middlewares/index.js";
import * as controllers from "../../controllers/auth/index.js";

const router = express.Router();

router.post("/login", ...checkValidation(loginValidator), controllers.login);
router.post(
  "/register",
  // ...checkValidation(registerValidator),
  controllers.register
);
router.post("/logout", controllers.logout);
router.get("/newAccessToken", controllers.newAccessToken);
router.get("/renewRefreshToken", controllers.renewRefreshToken);
router.post("/verifyEmailCode", rateLimit, controllers.verifyEmailCode);
router.post("/resendEmailCode", rateLimit, controllers.resendEmailCode);
router.post("/googleAuth", controllers.googleAuth);
router.post("/onBoardQuestions", controllers.onBoardQuestions);
router.post("/passwordReset", rateLimit, controllers.passwordReset);
router.post("/isEmailExists", controllers.isEmailExists);

export default router;
