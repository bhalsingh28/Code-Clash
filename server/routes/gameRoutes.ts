import { Router } from "express";
import {
  getRandomProblem,
  startGame,
  submitCode,
  getGameStatus,
} from "../controllers/gameController";

const router = Router();

router.get("/problem/random", getRandomProblem);
router.post("/room/:roomId", startGame);
router.post("/submit", submitCode);
router.get("/:roomId/status", getGameStatus);

export default router;
