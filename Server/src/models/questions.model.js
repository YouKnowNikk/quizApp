
import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
    validate: [options => options.length === 4, 'Question must have exactly 4 options'],
  },
  correctOption: {
    type: Number,
    required: true,
    min: 0,
    max: 3,
  },
},{timestamps:true});




export const Question = mongoose.model("Question", questionSchema)
