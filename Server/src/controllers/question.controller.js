// question.controller.js
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Question } from "../models/questions.model.js";

const addQuestion = asyncHandler(async (req, res) => {
  const { question, options, correctOption } = req.body;
  
  const existingQuestion = await Question.findOne({ question });
  if (existingQuestion) {
    throw new ApiError(400, "Question already exists");
  }

  const newQuestion = await Question.create({ question, options, correctOption });
  if (!newQuestion) {
    throw new ApiError(500, "Failed to add question");
  }

  res.status(201).json(new ApiResponse(201, newQuestion, "Question added successfully"));
});
const getQuizQuestions = asyncHandler(async (req, res) => {
  try {
    
    const questions = await Question.aggregate([
      { $sample: { size: 5 } },
      { $project: { correctOption: 0 } }
    ]);
    
    if (!questions || questions.length === 0) {
      throw new ApiError(404, "No questions found");
    }

    res.status(200).json(new ApiResponse(200, questions, "Quiz questions retrieved successfully"));
  } catch (error) {
    throw new ApiError(500, "Internal server error");
  }
});



export { addQuestion,getQuizQuestions };
