import { Router } from "express";
import { getRooms, createRoom, joinRoom } from "../controllers/roomController";

const router = Router();

router.get("/", getRooms);
router.post("/", createRoom);
router.get("/:id/join", joinRoom);

export default router;
