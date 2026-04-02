import { Request, Response } from "express";
import Room from "../models/Room";
import Problem from "../models/Problem";
import Submission from "../models/Submission";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// Get random problem by difficulty
export const getRandomProblem = async (req: Request, res: Response) => {
  try {
    const { difficulty } = req.query;
    const query = difficulty ? { difficulty } : {};

    const count = await Problem.countDocuments(query);
    if (count === 0) {
      return res.status(404).json({ error: "No problems found" });
    }

    const random = Math.floor(Math.random() * count);
    const problem = await Problem.findOne(query).skip(random);

    res.json(problem);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch problem" });
  }
};

// Start game - assign problem to room
export const startGame = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.body;
    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    if (room.participants.length < 2) {
      return res.status(400).json({ error: "Need 2 players to start game" });
    }

    // Get random problem
    const count = await Problem.countDocuments({
      difficulty: room.difficulty,
    });
    const random = Math.floor(Math.random() * count);
    const problem = await Problem.findOne({
      difficulty: room.difficulty,
    }).skip(random);

    if (!problem) {
      return res.status(404).json({ error: "No problems found" });
    }

    // Update room
    room.gameStatus = "playing";
    room.problemId = (problem._id as any).toString();
    room.startedAt = new Date();
    await room.save();

    res.json({
      success: true,
      room,
      problem: {
        _id: (problem._id as any).toString(),
        title: problem.title,
        description: problem.description,
        difficulty: problem.difficulty,
        testCases: problem.testCases,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to start game" });
  }
};

// Submit code - validate and check if correct
export const submitCode = async (req: Request, res: Response) => {
  try {
    const { roomId, userId, code } = req.body;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    if (room.gameStatus !== "playing") {
      return res.status(400).json({ error: "Game is not in progress" });
    }

    const problem = await Problem.findById(room.problemId);
    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    // Validate C++ code against test cases
    const isCorrect = await validateCppCode(code, problem);

    // Save submission
    const submission = await Submission.create({
      roomId,
      userId,
      code,
      isCorrect,
    });

    // If correct and room doesn't have winner, set winner
    if (isCorrect && !room.winner) {
      room.winner = userId;
      room.gameStatus = "finished";
      await room.save();
    }

    res.json({
      success: true,
      isCorrect,
      submission,
      roomStatus: room,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit code" });
  }
};

// Get game status
export const getGameStatus = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    const problem = room.problemId
      ? await Problem.findById(room.problemId)
      : null;
    const submissions = await Submission.find({ roomId });

    res.json({
      room,
      problem: problem
        ? {
            _id: (problem._id as any).toString(),
            title: problem.title,
            description: problem.description,
            difficulty: problem.difficulty,
            testCases: problem.testCases,
          }
        : null,
      submissions: submissions.map((s) => ({
        userId: s.userId,
        isCorrect: s.isCorrect,
        submittedAt: s.submittedAt,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get game status" });
  }
};

// Validate C++ code using Judge0 API
async function validateCppCode(code: string, problem: any): Promise<boolean> {
  try {
    if (!hasFunction(code)) {
      console.log("❌ No valid class/function found");
      return false;
    }

    if (!hasLogic(code)) {
      console.log("❌ No logic found");
      return false;
    }

    if (!problem.testCases || problem.testCases.length === 0) {
      console.log("⚠️ No test cases available");
      return true;
    }

    // Build Judge0 endpoint from env
    const protocol = process.env.JUDGE0_PROTOCOL || "https";
    const host = process.env.JUDGE0_HOST;
    const port = process.env.JUDGE0_PORT ? `:${process.env.JUDGE0_PORT}` : "";
    const baseUrl = `${protocol}://${host}${port}`;

    if (!host) {
      console.error("❌ JUDGE0_HOST not configured in .env");
      return false;
    }

    const apiKey = process.env.JUDGE0_API_KEY;
    const hasAuth = apiKey && apiKey.trim().length > 0;

    console.log(`📡 Using Judge0: ${baseUrl}`);

    // Test against all test cases
    let allCorrect = true;

    for (let i = 0; i < problem.testCases.length; i++) {
      const testCase = problem.testCases[i];

      // Wrap code in main function for testing
      const fullCode = `
#include <bits/stdc++.h>
using namespace std;

${code}

int main() {
    Solution sol;
    ${testCase.input ? `cout << sol.${testCase.input} << endl;` : ""}
    return 0;
}
`;

      try {
        // Submit to Judge0 API
        const headers: any = {
          "Content-Type": "application/json",
        };

        // Add auth headers if API key is provided
        if (hasAuth) {
          headers["x-rapidapi-key"] = apiKey;
          headers["x-rapidapi-host"] = host;
        }

        const response = await fetch(`${baseUrl}/submissions?base64_encoded=true&wait=false`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            language_id: 54, // C++
            source_code: fullCode,
            stdin: testCase.input || "",
            expected_output: testCase.output || "",
          }),
        });

        if (!response.ok) {
          console.error(`❌ Submission failed: ${response.statusText}`);
          return false;
        }

        const submission = (await response.json()) as any;
        const token = submission.token;
        console.log(`📤 Test case ${i + 1} token: ${token}`);

        if (!token) {
          console.error("❌ No token received from Judge0");
          console.error("Response:", submission);
          return false;
        }

        // Poll for result (up to 30 attempts, 500ms each)
        // Poll for result (up to 50 attempts, 1000ms each = ~50 seconds)
        let result: any;
        for (let attempt = 0; attempt < 50; attempt++) {
          await new Promise((resolve) => setTimeout(resolve, 1000));

          const resultResponse = await fetch(
            `${baseUrl}/submissions/${token}?base64_encoded=true`,
            {
              headers: hasAuth ? {
                "x-rapidapi-key": apiKey,
                "x-rapidapi-host": host,
              } : {},
            },
          );

          result = (await resultResponse.json()) as any;

          // Decode base64 fields if present
          if (result.stdout) result.stdout = Buffer.from(result.stdout, 'base64').toString();
          if (result.stderr) result.stderr = Buffer.from(result.stderr, 'base64').toString();
          if (result.compile_output) result.compile_output = Buffer.from(result.compile_output, 'base64').toString();

          if (result.error) {
            console.log(`⚠️ Attempt ${attempt + 1}: Error - ${result.error}`);
          } else if (!result.status) {
            console.log(`⏳ Attempt ${attempt + 1}: Waiting... Keys: ${Object.keys(result).join(", ")}`);
          } else {
            console.log(`⏳ Attempt ${attempt + 1}: Status = ${result.status?.description} (${result.status?.id})`);
          }

          // Status: 1=In Queue, 2=Processing, 3=Accepted, 4=Wrong Answer, etc.
          if (result.status && result.status.id > 2) {
            console.log(`✅ Got result on attempt ${attempt + 1}`);
            break;
          }
        }

        console.log(`\nFinal result:`, JSON.stringify(result, null, 2));
        console.log(`Status: ${result.status?.description || "NOT RECEIVED"}`);
        console.log(`Output: "${result.stdout || ""}" | Expected: "${testCase.output}"`);

        if (result.status?.id !== 3) {
          console.log(`❌ Test case ${i + 1} failed!`);
          if (result.compile_output) console.log(`Compile error: ${result.compile_output}`);
          if (result.stderr) console.log(`Runtime error: ${result.stderr}`);
          allCorrect = false;
          break; // Stop testing if any test case fails
        }
      } catch (error) {
        console.error(`❌ Error testing case ${i + 1}:`, (error as any).message);
        return false;
      }
    }

    if (allCorrect) {
      console.log("✅ All test cases passed!");
    }

    return allCorrect;
  } catch (error) {
    console.error("❌ Validation error:", (error as any).message);
    return false;
  }
}

// Check if code has a class or function definition
function hasFunction(code: string): boolean {
  // Look for class or function patterns in C++
  const patterns = [
    /class\s+\w+\s*\{/, // class Solution {
    /(?:int|string|bool|double|float|void|vector<\w+>)\s+\w+\s*\([^)]*\)\s*\{/, // function
  ];

  return patterns.some((pattern) => pattern.test(code));
}

// Check if code has actual logic (not just stub)
function hasLogic(code: string): boolean {
  // Remove comments
  let cleanCode = code
    .replace(/\/\*[\s\S]*?\*\//g, "") // Remove /* */ comments
    .replace(/\/\/.*$/gm, ""); // Remove // comments

  // Check for common control flow and operations
  const hasControlFlow =
    cleanCode.includes("if") ||
    cleanCode.includes("for") ||
    cleanCode.includes("while") ||
    cleanCode.includes("switch");

  const hasOperations =
    cleanCode.includes("=") ||
    cleanCode.includes("+") ||
    cleanCode.includes("-") ||
    cleanCode.includes("*") ||
    cleanCode.includes("/");

  const hasReturn = cleanCode.includes("return");

  // Remove "YOUR CODE HERE" comment
  cleanCode = cleanCode.replace(/\/\/.*YOUR CODE HERE.*/g, "");

  // Get content between first { and last }
  const firstBrace = cleanCode.indexOf("{");
  const lastBrace = cleanCode.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    return false;
  }

  const body = cleanCode.substring(firstBrace + 1, lastBrace);
  const bodyWithoutWhitespace = body.replace(/\s+/g, "");

  // Check if body has meaningful content (more than just empty braces)
  const hasContent = bodyWithoutWhitespace.length > 5;

  return (hasControlFlow || hasOperations || hasReturn) && hasContent;
}
