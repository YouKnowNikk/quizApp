import { Router } from "express";
import {  userRegistration,userLogin } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/register").post(upload.single("profilePicture"),userRegistration);
router.route("/login").post(userLogin)

export default router 