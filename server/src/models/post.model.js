import mongoose from "mongoose";
const { model, Schema } = mongoose;

const PostSchema = new Schema(
  {
    title: {
      type: String,
      require: true,
    },
    summary: {
      type: String,
    },
    file: {
      type: String,
      require: true,
    },
    text: {
      type: String,
      require: true,
    },
    author:{
      type:Schema.Types.ObjectId,
      ref:"User"
    }
  },
  { timestamps: true }
);


export const Post = model('Post',PostSchema);