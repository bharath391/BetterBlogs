import { Schema, model, Types, Document } from 'mongoose';

interface ILimiting {
  limit: number;
  startTime: Date;
}

interface ISocialAccounts {
  instagram: string;
  facebook: string;
  linkedin: string;
  x: string;
  github: string;
}

interface IUser extends Document {
  name: string;
  email: string;
  password: String;
  age: number;
  bio?: string;
  profession?: string;
  country: string;
  socialAccounts: ISocialAccounts;
  myBlogs: Types.ObjectId[];
  savedBlogs: Types.ObjectId[];
  likedBlogs: Types.ObjectId[];
  drafts: Types.ObjectId[];
  blogPostLimit: ILimiting;
  commentPostLimit: ILimiting;
  notifications: string[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    age: { type: Number, required: true },
    bio: { type: String },
    profession: { type: String },
    country: { type: String},
    socialAccounts: {
      instagram: { type: String },
      facebook: { type: String },
      linkedin: { type: String },
      x: { type: String },
      github: { type: String },
    },
    likedBlogs: [{ type: Types.ObjectId, ref: "Blog" }],
    savedBlogs: [{ type: Types.ObjectId, ref: "Blog" }],
    myBlogs: [{ type: Types.ObjectId, ref: "Blog" }],
    drafts: [{ type: Types.ObjectId, ref: "Blog" }],
    blogPostLimit: {
      limit: { type: Number, default: 5 },
      startTime: { type: Date}
    },
    commentPostLimit: {
      limit: { type: Number, default: 3 },
      startTime: { type: Date}
    },
    notifications: {
      type: [String],
      maxLength: 10    
    }

  },
  { timestamps: true }
);

const userCollection = model<IUser>('User', userSchema);

export { IUser, userCollection };
