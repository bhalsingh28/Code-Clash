import mongoose, { Schema, Document } from "mongoose";

export interface ITestCase {
  input: string;
  output: string;
}

export interface IProblem extends Document {
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  testCases: ITestCase[];
  createdAt: Date;
}

const TestCaseSchema = new Schema<ITestCase>({
  input: { type: String, required: true },
  output: { type: String, required: true },
});

const ProblemSchema = new Schema<IProblem>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
    testCases: [TestCaseSchema],
  },
  { timestamps: true },
);

export default mongoose.model<IProblem>("Problem", ProblemSchema);
