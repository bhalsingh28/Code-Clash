import "dotenv/config";
import express from "express";
import cors from "cors";
import connetDB from "./db";
import roomRoutes from "./routes/roomRoutes";
import problemRoutes from "./routes/problemRoutes";
import gameRoutes from "./routes/gameRoutes";
import { createServer } from "http";
import { Server } from "socket.io";
import Room from "./models/Room";
import Problem from "./models/Problem";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Create HTTP server for Socket.IO
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
  },
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/rooms", roomRoutes);
app.use("/problems", problemRoutes);
app.use("/game", gameRoutes);

// Connect DB
connetDB();

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Backend is running..." });
});

// Socket.IO Events
const userRooms = new Map<string, string>();

io.on("connection", (socket) => {
  // console.log(`User connected: ${socket.id}`);

  socket.on("join_room", async (data: { roomId: string; userId: string }) => {
    socket.join(data.roomId);
    userRooms.set(socket.id, data.roomId);
    io.to(data.roomId).emit("user_joined", {
      userId: data.userId,
      message: `${data.userId} joined the room`,
    });

    // Check if game should start (when 2 players are in room)
    try {
      const room = await Room.findById(data.roomId);
      if (room && room.gameStatus === "playing" && room.problemId) {
        const problem = await Problem.findById(room.problemId);
        if (problem) {
          io.to(data.roomId).emit("game_started", {
            problem: {
              _id: problem._id.toString(),
              title: problem.title,
              description: problem.description,
              difficulty: problem.difficulty,
              testCases: problem.testCases,
            },
            startedAt: room.startedAt,
            timerMinutes: room.timerMinutes,
          });
          // console.log(`🎮 Game started in room ${data.roomId}`);
        }
      }
    } catch (err) {
      console.error("Error checking game status:", err);
    }
  });

  socket.on(
    "code_update",
    (data: { roomId: string; userId: string; code: string }) => {
      socket.to(data.roomId).emit("opponent_code_update", {
        userId: data.userId,
        code: data.code,
      });
    },
  );

  socket.on("game_started", (data: { roomId: string; problem: any }) => {
    io.to(data.roomId).emit("game_started", { problem: data.problem });
  });

  socket.on(
    "code_submitted",
    (data: { roomId: string; userId: string; isCorrect: boolean }) => {
      io.to(data.roomId).emit("submission_received", {
        userId: data.userId,
        isCorrect: data.isCorrect,
      });
    },
  );

  socket.on("game_finished", (data: { roomId: string; winner: string }) => {
    io.to(data.roomId).emit("game_finished", { winner: data.winner });
  });

  socket.on("disconnect", () => {
    const roomId = userRooms.get(socket.id);
    if (roomId) {
      io.to(roomId).emit("user_left", { message: "Opponent left the room" });
      userRooms.delete(socket.id);
    }
    // console.log(`User disconnected: ${socket.id}`);
  });
});

httpServer.listen(PORT);

// Access to XMLHttpRequest at 'https://code-clash-v1.onrender.com/socket.io/?EIO=4&transport=polling&t=pwvnz7gt'
// from origin 'https://codeclash-78fr.onrender.com' has been blocked by CORS policy:
// The 'Access-Control-Allow-Origin' header has a value 'http://localhost:5173' that is not equal to the supplied origin.
