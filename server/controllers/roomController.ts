import Room from "../models/Room";
import { Request, Response } from "express";

// Fetch All Rooms

export const getRooms = async (req: Request, res: Response) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: "Failed to create room" });
  }
};

// Create a new Room

export const createRoom = async (req: Request, res: Response) => {
  try {
    const { name, participants = [] } = req.body;
    const room = await Room.create({ name, participants });
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
    if (room.participants.includes(user)) {
      return res.status(400).json({ error: "User already joined" });
    }
    // Add user
    room.participants.push(user);
    await room.save();
    res.json(room);
  } catch (err) {
    res.status(500).json({ error: "Failed to create room" });
  }
};
