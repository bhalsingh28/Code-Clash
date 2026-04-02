import mongoose, { Schema, Document } from "mongoose";

export interface IRoom extends Document {
  name: string;
  participants: string[];
  difficulty: "Easy" | "Medium" | "Hard";
  timerMinutes: number;
  problemId: string | null;
  gameStatus: "waiting" | "playing" | "finished";
  startedAt: Date | null;
  winner: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const RoomSchema = new Schema<IRoom>(
  {
    name: { type: String, required: true },
    participants: [{ type: String }],
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },
    timerMinutes: { type: Number, default: 30 },
    problemId: { type: String, default: null },
    gameStatus: {
      type: String,
      enum: ["waiting", "playing", "finished"],
      default: "waiting",
    },
    startedAt: { type: Date, default: null },
    winner: { type: String, default: null },
  },
  { timestamps: true },
);

export default mongoose.model<IRoom>("Room", RoomSchema);
