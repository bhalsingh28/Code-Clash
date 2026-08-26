import Room from "../models/Room";
import { Request, Response } from "express";

// Fetch All Rooms
export const getRooms = async (req: Request, res: Response) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch rooms" });
  }
};

// Create a new Room
export const createRoom = async (req: Request, res: Response) => {
  try {
    const { difficulty = "Medium", timerMinutes = 30 } = req.body;
    const room = await Room.create({
      difficulty,
      timerMinutes,
      participants: [],
    });
    res.json(room);
  } catch (err) {
    res.status(500).json({ error: "Failed to create room" });
  }
};

// Join a Room
export const joinRoom = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { user } = req.body;
    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }
    // Check for already joined

    // if (room.participants.includes(user)) {
    //   return res.status(400).json({ error: "User already joined" });
    // }
    // Add user
    room.participants.push(user);

    // If 2 players joined, automatically start game
    if (room.participants.length === 2) {
      room.gameStatus = "playing";
      room.startedAt = new Date();

      // Get random problem
      const Problem = require("../models/Problem").default;
      const count = await Problem.countDocuments({
        difficulty: room.difficulty,
      });
      if (count > 0) {
        const random = Math.floor(Math.random() * count);
        const problem = await Problem.findOne({
          difficulty: room.difficulty,
        }).skip(random);
        if (problem) {
          room.problemId = problem._id.toString();
        }
      }
    }

    await room.save();
    res.json(room);
  } catch (err) {
    res.status(500).json({ error: "Failed to join room" });
  }
};

export const deleteRoom = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }
    await room.deleteOne();
    res.json({ message: "Room deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete the room" });
  }
};
