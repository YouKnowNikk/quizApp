import { Router } from "express";
import { getQuizAttemptDetails,getQuizAttempts,getUserQuizAttempts } from "../controllers/quiz.controller.js";
import { verifyUser } from "../middlewares/auth.middleware.js";
const router = Router();

router.route('/quizattempts').post(verifyUser,getQuizAttempts)
router.route('/getquizdetails').post(verifyUser,getQuizAttemptDetails)
router.route('/userbsedquizdetails').post(verifyUser,getUserQuizAttempts)
export default router 