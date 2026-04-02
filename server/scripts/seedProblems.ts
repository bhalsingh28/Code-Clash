import mongoose from "mongoose";
import Problem from "../models/Problem";

const problems = [
  {
    title: "Two Sum",
    description:
      "Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target. You may assume each input has exactly one solution.",
    difficulty: "Easy",
    testCases: [
      { input: "[1,2, 9]", output: "5" },
      { input: "[3,2,4, 6]", output: "5" },
      { input: "[3,3, 6]", output: "5" },
    ],
  },
  {
    title: "Reverse String",
    description: "Write a function that reverses a string.",
    difficulty: "Easy",
    testCases: [
      { input: '["hello"]', output: '"olleh"' },
      { input: '["world"]', output: '"dlrow"' },
      { input: '["a"]', output: '"a"' },
    ],
  },
  {
    title: "Palindrome Number",
    description:
      "Determine if an integer is a palindrome. An integer is a palindrome when it reads the same backward as forward.",
    difficulty: "Easy",
    testCases: [
      { input: "[121]", output: "true" },
      { input: "[-121]", output: "false" },
      { input: "[10]", output: "false" },
    ],
  },
  {
    title: "Contains Duplicate",
    description:
      "Given an integer array nums, return true if any value appears at least twice in the array.",
    difficulty: "Easy",
    testCases: [
      { input: "[[1,2,3,1]]", output: "true" },
      { input: "[[1,2,3,4]]", output: "false" },
      { input: "[[1,1]]", output: "true" },
    ],
  },
  {
    title: "Valid Parentheses",
    description:
      "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    difficulty: "Medium",
    testCases: [
      { input: '["()"]', output: "true" },
      { input: '["()[]{}"]', output: "true" },
      { input: '["(]"]', output: "false" },
    ],
  },
  {
    title: "Longest Substring Without Repeating Characters",
    description:
      "Given a string s, find the length of the longest substring without repeating characters.",
    difficulty: "Medium",
    testCases: [
      { input: '["abcabcbb"]', output: "3" },
      { input: '["bbbbb"]', output: "1" },
      { input: '["pwwkew"]', output: "3" },
    ],
  },
  {
    title: "Maximum Subarray",
    description:
      "Given an integer array nums, find the contiguous subarray which has the largest sum.",
    difficulty: "Medium",
    testCases: [
      { input: "[[-2,1,-3,4,-1,2,1,-5,4]]", output: "6" },
      { input: "[[5,4,-1,7,8]]", output: "23" },
      { input: "[[-1]]", output: "-1" },
    ],
  },
  {
    title: "Binary Search",
    description:
      "Given a sorted array of integers and a target, write a function to search for the target in the array. If found, return its index. Otherwise, return -1.",
    difficulty: "Easy",
    testCases: [
      { input: "[[-1,0,3,5,9,12], 9]", output: "4" },
      { input: "[[-1,0,3,5,9,12], 13]", output: "-1" },
      { input: "[[5], 5]", output: "0" },
    ],
  },
  {
    title: "Remove Duplicates from Sorted Array",
    description:
      "Given a sorted array, remove the duplicates in-place such that each element appears only once, and return the new length.",
    difficulty: "Easy",
    testCases: [
      { input: "[[1,1,2]]", output: "2" },
      { input: "[[0,0,1,1,1,2,2,3,3,4]]", output: "5" },
      { input: "[[]]", output: "0" },
    ],
  },
  {
    title: "Sum of Two Numbers",
    description:
      "Given two numbers, return their sum without using the + operator.",
    difficulty: "Medium",
    testCases: [
      { input: "[2, 3]", output: "5" },
      { input: "[10, 20]", output: "30" },
      { input: "[0, 0]", output: "0" },
    ],
  },
  {
    title: "Factorial",
    description: "Given a number n, return the factorial of n.",
    difficulty: "Easy",
    testCases: [
      { input: "[5]", output: "120" },
      { input: "[0]", output: "1" },
      { input: "[3]", output: "6" },
    ],
  },
  {
    title: "Fibonacci Number",
    description: "Given n, return the nth Fibonacci number.",
    difficulty: "Easy",
    testCases: [
      { input: "[2]", output: "1" },
      { input: "[3]", output: "2" },
      { input: "[4]", output: "3" },
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
