import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Question } from "../models/questions.model.js";
import { Quiz } from "../models/quizz.model.js";

const submitQuiz = asyncHandler(async (req, res) => {
  const { questions } = req.body;
  const userId = req.user._id;

  if (!questions || !Array.isArray(questions) || questions.length === 0) {
    throw new ApiError(400, "Invalid input data");
  }

  const totalQuestions = questions.length;

  // Calculate score based on attempted questions
  let score = 0;
  let attemptedQuestions = 0;
  for (const q of questions) {
    if (q.selectedOption !== null) {
      attemptedQuestions++;
      const question = await Question.findById(q.questionId);
      if (question && question.correctOption === q.selectedOption) {
        score += 1; // Add 1 point for each correct answer
      }
    }
  }

  // Calculate total score as percentage of attempted questions
  const totalScore = (score* 100 / totalQuestions) ;

  const quiz = await Quiz.create({ userId, questions, score, totalScore, totalQuestions });
  if (!quiz) {
    throw new ApiError(500, "Failed to save quiz results");
  }

  res.status(201).json(new ApiResponse(201, quiz, "Quiz submitted successfully"));
});


const getUserQuizzes = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const quizzes = await Quiz.find({ userId });
  if (!quizzes || quizzes.length === 0) {
    throw new ApiError(404, "No quizzes found for this user");
  }

  res.status(200).json(new ApiResponse(200, quizzes, "User quizzes retrieved successfully"));
});

const getQuizById = asyncHandler(async (req, res) => {
  const quizId = req.params.id;

  // Find the quiz by ID and populate the questions
  const quiz = await Quiz.findById(quizId).populate({
    path: 'questions.questionId',
    model: 'Question',
    select: 'question options correctOption'
  });

  if (!quiz) {
    throw new ApiError(404, "Quiz not found");
  }

  // Transform the quiz data to include the correct option and user-selected option
  const transformedQuiz = {
    _id: quiz._id,
    userId: quiz.userId,
    score: quiz.score,
    createdAt: quiz.createdAt,
    updatedAt: quiz.updatedAt,
    questions: quiz.questions.map(q => ({
      questionId: q.questionId._id,
      question: q.questionId.question,
      options: q.questionId.options,
      correctOption: q.questionId.correctOption,
      selectedOption: q.selectedOption
    }))
  };

  res.status(200).json(new ApiResponse(200, transformedQuiz, "Quiz retrieved successfully"));
});

export { submitQuiz,getUserQuizzes,getQuizById };
