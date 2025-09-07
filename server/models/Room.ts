import mongoose, { Schema, Document } from "mongoose";

export interface IRoom extends Document {
  name: string;
  participants: string[]; // User IDs for now, later real users
  createAt: Date;
}

const RoomSchema = new Schema<IRoom>(
  {
    name: { type: String, required: true },
    participants: [{ type: String }], // later: ObjectID ref to user
  },
  { timestamps: true }
);

export default mongoose.model<IRoom>("Room", RoomSchema);
