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
    const room = await Room.findByIdAndUpdate(
      id,
      { $push: { participants: user } },
      { new: true }
    );
    res.json(room);
  } catch (err) {
    res.status(500).json({ error: "Failed to create room" });
  }
};
