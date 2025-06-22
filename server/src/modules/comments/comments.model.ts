import { Schema, model, Types, Document } from 'mongoose';


interface Icomment extends Document {
  content: string,
  userId: Types.ObjectId,
  likes: number,
  replies: Types.ObjectId[],
  createdAt: Date,
  updatedAt: Date
}

const commentSchema = new Schema<Icomment>({
  content: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  likes: {
    type: Number,
    default: 0
  },
  replies: {
    type: [{ type: Schema.Types.ObjectId, ref: "Comments" }],
    default: [],
  }

}, { timestamps: true });

const commentCollection = model('Comment', commentSchema);

export { Icomment, commentCollection };

