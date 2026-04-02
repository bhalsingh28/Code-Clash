import mongoose, { Schema, Document } from "mongoose";

export interface ISubmission extends Document {
  roomId: string;
  userId: string;
  code: string;
  isCorrect: boolean;
  submittedAt: Date;
}

const SubmissionSchema = new Schema<ISubmission>(
  {
    roomId: { type: String, required: true },
    userId: { type: String, required: true },
    code: { type: String, required: true },
    isCorrect: { type: Boolean, default: false },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export default mongoose.model<ISubmission>("Submission", SubmissionSchema);
