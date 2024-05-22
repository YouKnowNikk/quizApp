import mongoose from "mongoose";

const userAnswerSchema = new mongoose.Schema({
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true,
    },
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true,
    },
    selectedOption: {
      type: Number,
      required: true,
      min: 0,
      max: 3,
    },
   
  });
export const Answer = mongoose.model("Answer", userAnswerSchema)


