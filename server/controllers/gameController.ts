import { Request, Response } from "express";
import Room from "../models/Room";
import Problem from "../models/Problem";
import Submission from "../models/Submission";

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

async function validateCppCode(code: string, problem: any): Promise<boolean> {
  try {
    if (!problem?.testCases?.length) {
      console.log("⚠️ No test cases found");
      return true;
    }

    const headers = {
      "Content-Type": "application/json",
      "X-RapidAPI-Key": process.env.RapidAPI_Key,
      "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
    };

    const baseUrl = "https://judge0-ce.p.rapidapi.com";

    for (let i = 0; i < problem.testCases.length; i++) {
      const tc = problem.testCases[i];

      console.log(`🧪 Running test case ${i + 1}`);

      const response = await fetch(
        `${baseUrl}/submissions?base64_encoded=false&wait=true`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            language_id: 54, // C++ (GCC)
            source_code: code,
            stdin: tc.input,
          }),
        },
      );

      if (!response.ok) {
        // console.error("Judge0 request failed:", response.status);
        console.error("Judge0 request failed:", response.status);

        console.log(
          "Request URL:",
          `${baseUrl}/submissions?base64_encoded=false&wait=true`,
        );
        console.log("Headers:", headers);
        console.log("Body:", {
          language_id: 54,
          source_code: code,
          stdin: tc.input,
        });
        return false;
      }

      const result: any = await response.json();

      // Compilation Error
      if (result.compile_output) {
        console.log("❌ Compilation Error");
        console.log(result.compile_output);
        return false;
      }

      // Runtime Error
      if (result.stderr) {
        console.log("❌ Runtime Error");
        console.log(result.stderr);
        return false;
      }

      const actual = (result.stdout || "").trim();
      const expected = (tc.output || "").trim();

      if (actual !== expected) {
        console.log(`❌ Wrong Answer on Test Case ${i + 1}`);
        console.log(`Input: ${tc.input}`);
        console.log(`Expected: ${expected}`);
        console.log(`Actual: ${actual}`);
        return false;
      }

      console.log(`✅ Test Case ${i + 1} Passed`);
    }

    console.log("🎉 All Test Cases Passed");
    return true;
  } catch (error) {
    console.error("Validation Error:", (error as any).message);
    return false;
  }
}
