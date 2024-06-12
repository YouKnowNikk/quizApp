import { Router } from "express";
import {  userRegistration,userLogin,getUser, verifyOtp, resendOtp } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

import { verifyUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(upload.single("profilePicture"),userRegistration);
router.route("/login").post(userLogin)
router.route("/getuser").get(verifyUser,getUser)
router.route("/verifyotp").post(verifyOtp)
router.route("/resendotp").post(resendOtp)
export default router 