import express from "express";
import cors from "cors";
import connetDB from "./db";
import roomRoutes from "./routes/roomRoutes";
import problemRoutes from "./routes/problemRoutes";

const app = express();
const PORT = 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/rooms", roomRoutes);
app.use("/problems", problemRoutes);

// Connect DB
connetDB();

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Backend is running ✅" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
