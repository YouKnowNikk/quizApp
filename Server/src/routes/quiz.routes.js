import { Router } from "express";
import { submitQuiz ,getUserQuizzes, getQuizById} from "../controllers/quiz.controller.js";
import { verifyUser } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/submission").post(verifyUser,submitQuiz);
router.route("/user-quizzes").get(verifyUser,getUserQuizzes)
router.route("/quiz/:id").get(verifyUser,getQuizById)
export default router 