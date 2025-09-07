import Problem from "../models/Problem";
import { Router } from "express";

const router = Router();

// Get Prblems
router.get("/", async (req, res) => {
  try {
    const problems = await Problem.find();
    res.json(problems);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch Problem" });
  }
});

export default router;
