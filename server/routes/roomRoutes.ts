import { Router } from "express";
import {
  getRooms,
  createRoom,
  joinRoom,
  deleteRoom,
} from "../controllers/roomController";

const router = Router();

router.get("/", getRooms);
router.post("/", createRoom);
router.put("/:id/join", joinRoom);
router.delete("/:id", deleteRoom);

export default router;
