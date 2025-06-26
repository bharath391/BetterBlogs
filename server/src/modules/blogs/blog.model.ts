import { Schema, model, Types, Document } from "mongoose";

interface Iblog extends Document {
  title: string;
  content: string;
  saves: number;
  views: Types.ObjectId[];
  likes: Types.ObjectId[];
  likesCount: number;
  comments: Types.ObjectId[];
  topics: string[];
  shareCount: number;
  isDraft: Boolean;
  createdAt: Date;
  updatedAt: Date;
  thumbnail: string;
}

const blogSchema = new Schema(
  {
    title: {
      type: String,
      requires: true,
    },
    content: {
      type: String,
      required: true,
    },
    saves: {
      type: Number,
      default: 0,
    },
    comments: {
      type: [{ type: Types.ObjectId, ref: "Comment", required: true }],
      default: [],
    },
    likes: {
      type: [{ type: Types.ObjectId, ref: "User", required: true }],
      default: [],
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    views: {
      type: [{ type: Types.ObjectId, ref: "User", required: true }],
      default: [],
    },
    topics: {
      type: [String],
      default: [],
    },
    shareCount: {
      type: Number,
      default: 0,
    },
    isDraft: {
      type: Boolean,
      default: false,
    },
    thumbnail: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

const blogCollection = model("Blog", blogSchema);

export { Iblog, blogCollection };
