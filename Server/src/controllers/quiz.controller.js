import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Quiz } from "../models/quizz.model.js";
import { Question } from "../models/questions.model.js";

const getQuizAttempts = asyncHandler(async (req, res) => {
  const { userId, quizId, answers } = req.body;
  
  
  const Quiz = await Quiz.create({ userId, quizId, answers });

  let score = 0;
 
  for (const answer of answers) {
    const question = await Question.findById(answer.questionId);
    if (!question) {
      throw new ApiError(404, `Question with ID ${answer.questionId} not found`);
    }
    if (question.correctOption === answer.selectedOption) {
      score += 10; 
    }
  }
  Quiz.score = score;
  await Quiz.save();

  res.status(201).json(new ApiResponse(201, Quiz, "Quiz attempt submitted successfully"));
});



const getUserQuizAttempts  = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const QuizAttempts = await Quiz.find({ userId }).populate('quizId', 'questions');
  res.status(200).json(new ApiResponse(200, QuizAttempts, "User quiz attempts retrieved successfully"));
});



const getQuizAttemptDetails = asyncHandler(async (req, res) => {
  const QuizId = req.params.QuizId;

  const Quiz = await Quiz.findById(QuizId).populate('quizId', 'questions');

  if (!Quiz) {
    throw new ApiError(404, "Quiz attempt not found");
  }

  res.status(200).json(new ApiResponse(200, Quiz, "Quiz attempt details retrieved successfully"));
});

export {getQuizAttempts,getQuizAttemptDetails,getUserQuizAttempts}



