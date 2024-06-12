// question.controller.js
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Question } from "../models/questions.model.js";

const addQuestion = asyncHandler(async (req, res) => {
  const { question, options, correctOption, questionType, questionLevel } = req.body;

  if (!questionType) {
    throw new ApiError(400, "Question type is required");
  }

  if (questionLevel !== undefined && (questionLevel < 1 || questionLevel > 3)) {
    throw new ApiError(400, "Question level must be between 1 and 3");
  }

  const existingQuestion = await Question.findOne({ question });
  if (existingQuestion) {
    throw new ApiError(400, "Question already exists");
  }

  const newQuestion = await Question.create({ question, options, correctOption, questionType, questionLevel });
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

const getCustomizeQuestions = asyncHandler(async (req, res) => {
  try {
    const { requirements } = req.query;

    if (!requirements) {
      throw new ApiError(400, "Requirements parameter is required");
    }

    const reqArray = JSON.parse(requirements); // Expecting a JSON array of objects with { questionType, questionLevel, count }
    let questions = [];

    for (const req of reqArray) {
      const filter = { questionType: req.questionType };

      if (req.questionLevel !== undefined) {
        filter.questionLevel = req.questionLevel;
      }

      const count = req.count !== undefined ? req.count : 10;

      const typeQuestions = await Question.aggregate([
        { $match: filter },
        { $sample: { size: count } },
        { $project: { correctOption: 0 } }
      ]);

      questions = questions.concat(typeQuestions);
    }

    if (!questions || questions.length === 0) {
      throw new ApiError(404, "No questions found");
    }

    res.status(200).json(new ApiResponse(200, questions, "Custom quiz questions retrieved successfully"));
  } catch (error) {
    throw new ApiError(500, "Internal server error");
  }
});

export { addQuestion,getQuizQuestions,getCustomizeQuestions };
