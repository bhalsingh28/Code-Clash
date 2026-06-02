import mongoose from "mongoose";
import Problem from "../models/Problem";

const problems = [
  {
    title: "Reverse String",
    description: "Write a program that reverses a string.",
    difficulty: "Easy",
    testCases: [
      { input: "hello", output: "olleh" },
      { input: "world", output: "dlrow" },
      { input: "chatgpt", output: "tpgtahc" },
    ],
  },

  {
    title: "Palindrome Number",
    description:
      "Determine whether an integer is a palindrome. Print true or false.",
    difficulty: "Easy",
    testCases: [
      { input: "121", output: "true" },
      { input: "-121", output: "false" },
      { input: "10", output: "false" },
    ],
  },

  {
    title: "Contains Duplicate",
    description:
      "Print true if the array contains duplicates, otherwise false.",
    difficulty: "Easy",
    testCases: [
      { input: "4\n1 2 3 1", output: "true" },
      { input: "4\n1 2 3 4", output: "false" },
      { input: "2\n1 1", output: "true" },
    ],
  },

  {
    title: "Valid Parentheses",
    description: "Check if the given parentheses string is valid.",
    difficulty: "Medium",
    testCases: [
      { input: "()", output: "true" },
      { input: "()[]{}", output: "true" },
      { input: "(]", output: "false" },
    ],
  },

  {
    title: "Longest Substring Without Repeating Characters",
    description:
      "Find the length of the longest substring without repeating characters.",
    difficulty: "Medium",
    testCases: [
      { input: "abcabcbb", output: "3" },
      { input: "bbbbb", output: "1" },
      { input: "pwwkew", output: "3" },
    ],
  },

  {
    title: "Maximum Subarray",
    description: "Find the maximum sum of a contiguous subarray.",
    difficulty: "Medium",
    testCases: [
      { input: "9\n-2 1 -3 4 -1 2 1 -5 4", output: "6" },
      { input: "5\n5 4 -1 7 8", output: "23" },
      { input: "1\n-1", output: "-1" },
    ],
  },

  {
    title: "Binary Search",
    description: "Given a sorted array and target, return the index or -1.",
    difficulty: "Easy",
    testCases: [
      { input: "6\n-1 0 3 5 9 12\n9", output: "4" },
      { input: "6\n-1 0 3 5 9 12\n13", output: "-1" },
      { input: "1\n5\n5", output: "0" },
    ],
  },

  {
    title: "Sum of Two Numbers",
    description: "Print the sum of two integers.",
    difficulty: "Easy",
    testCases: [
      { input: "2 3", output: "5" },
      { input: "10 20", output: "30" },
      { input: "0 0", output: "0" },
    ],
  },

  {
    title: "Factorial",
    description: "Print n factorial.",
    difficulty: "Easy",
    testCases: [
      { input: "5", output: "120" },
      { input: "0", output: "1" },
      { input: "3", output: "6" },
    ],
  },

  {
    title: "Fibonacci Number",
    description: "Print the nth Fibonacci number.",
    difficulty: "Easy",
    testCases: [
      { input: "2", output: "1" },
      { input: "3", output: "2" },
      { input: "4", output: "3" },
    ],
  },
];
const seedProblems = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/codeclash");
    console.log("✅ Connected to MongoDB");

    // Clear existing problems
    await Problem.deleteMany({});
    console.log("🗑️  Cleared existing problems");

    // Insert new problems
    const result = await Problem.insertMany(problems);
    console.log(`✅ Inserted ${result.length} problems`);

    console.log("\n📚 Problems seeded:");
    result.forEach((p, i) => {
      console.log(`  ${i + 1}. ${p.title} (${p.difficulty})`);
    });

    console.log("\n✨ Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedProblems();
