
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
  questionType:{
    type:String
  },
  questionLevel:{
    type:Number,
    min:1,
    max:3,
    default:1
  }
},{timestamps:true});




export const Question = mongoose.model("Question", questionSchema)
