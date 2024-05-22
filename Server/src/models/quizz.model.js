import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    questions: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true,
    }],
    userAnswers: [{
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true,
      },
      selectedOption: {
        type: Number,
        required: true,
      },
    }],
    score: {
      type: Number,
      default: 0,
    },
  }, { timestamps: true });
export const Quiz = mongoose.model("Quiz", quizSchema)
