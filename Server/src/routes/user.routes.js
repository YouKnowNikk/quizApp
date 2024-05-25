import { Router } from "express";
import {  userRegistration,userLogin,getUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

import { verifyUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(upload.single("profilePicture"),userRegistration);
router.route("/login").post(userLogin)
router.route("/getuser").get(verifyUser,getUser)
export default router 