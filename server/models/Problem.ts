import mongoose, { Schema, Document } from "mongoose";

export interface IProblem extends Document {
  roomId: string; // reference to the room
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  participants: string[]; // users in that room
}

const ProblemSchema = new Schema<IProblem>(
  {
    roomId: { type: String, required: true }, // can later be ObjectId if you have a Room model
    title: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
    participants: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model<IProblem>("Problem", ProblemSchema);
