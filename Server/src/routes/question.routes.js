import { Router } from "express";
import { addQuestion,getQuizQuestions } from "../controllers/question.controller.js";
import { verifyUser } from "../middlewares/auth.middleware.js";
const router = Router();

router.route('/addquestions').post(verifyUser,addQuestion)
router.route('/getquestions').post(verifyUser,getQuizQuestions)
export default router 