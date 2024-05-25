import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      questions: [{
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Question',
          required: true,
        },
        selectedOption: {
          type: Number,
          default:null
        },
      }],
      score: {
        type: Number,
        default: 0,
      },
      totalScore: {
        type: Number,
        default: 0,
      },
      totalQuestions: {
        type: Number,
        default: 0,
      },
    }, { timestamps: true });
export const Quiz = mongoose.model("Quiz", quizSchema)
