import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getGameStatus, submitCode } from "../api/roomApi";
import CodeEditor from "./CodeEditor";
import "../styles/Game.css";
import io, { Socket } from "socket.io-client";

interface Problem {
  _id: string;
  title: string;
  description: string;
  difficulty: string;
  testCases: Array<{ input: string; output: string }>;
}

interface Submission {
  userId: string;
  isCorrect: boolean;
  submittedAt: string;
}

interface RoomData {
  _id: string;
  name: string;
  participants: string[];
  gameStatus: string;
  winner: string | null;
  timerMinutes: number;
  startedAt: string;
}

function Game() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState<RoomData | null>(null);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [winner, setWinner] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [currentUser] = useState(localStorage.getItem("userId") || "Guest");
  const [gameFinished, setGameFinished] = useState(false);

  useEffect(() => {
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    newSocket.on("game_started", (data) => {
      setProblem(data.problem);
    });

    newSocket.on("submission_received", (data) => {
      if (data.userId === currentUser) {
        setHasSubmitted(true);
      }
      if (data.isCorrect && !winner) {
        setWinner(data.userId);
        setGameFinished(true);
      }
    });

    newSocket.on("game_finished", (data) => {
      setWinner(data.winner);
      setGameFinished(true);
    });

    if (roomId) {
      newSocket.emit("join_room", { roomId, userId: currentUser });
      fetchGameStatus();
    }

    return () => {
      newSocket.close();
    };
  }, [roomId, currentUser]);

  const fetchGameStatus = async () => {
    if (!roomId) return;
    try {
      const data = await getGameStatus(roomId);
      setRoom(data.room);
      setProblem(data.problem);

      if (data.room.startedAt) {
        const startTime = new Date(data.room.startedAt).getTime();
        const totalSeconds = data.room.timerMinutes * 60;
        const elapsedSeconds = (Date.now() - startTime) / 1000;
        const remaining = Math.max(0, totalSeconds - elapsedSeconds);
        setTimeLeft(remaining);

        if (remaining === 0) {
          setGameFinished(true);
        }
      }

      setSubmissions(data.submissions);
      if (data.room.winner) {
        setWinner(data.room.winner);
        setGameFinished(true);
      }
    } catch (err) {
      console.error("Failed to fetch game status", err);
    }
  };

  // Timer countdown
  useEffect(() => {
    if (!problem || gameFinished) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          setGameFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [problem, gameFinished]);

  const handleSubmitCode = async (code: string) => {
    if (!roomId) return;
    try {
      const result = await submitCode(roomId, currentUser, code);
      if (result.isCorrect && !winner) {
        setWinner(currentUser);
        setGameFinished(true);
        socket?.emit("code_submitted", {
          roomId,
          userId: currentUser,
          isCorrect: true,
        });
      }
      setHasSubmitted(true);
    } catch (err) {
      console.error("Failed to submit code", err);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (gameFinished && winner) {
    return (
      <div className="game-finished">
        <h1>🎉 Game Over!</h1>
        <h2>{winner === currentUser ? "You Won! 🏆" : `${winner} Won!`}</h2>
        <button onClick={() => navigate("/")}>Back to Home</button>
      </div>
    );
  }

  return (
    <div className="game-container">
      <div className="game-header">
        <h1>Code Clash - {room?.name}</h1>
        <div className="timer">⏱️ {formatTime(timeLeft)}</div>
      </div>

      <div className="game-content">
        <div className="problem-section">
          <div className="problem-card">
            {problem ? (
              <>
                <h2>{problem.title}</h2>
                <p className={`difficulty ${problem.difficulty.toLowerCase()}`}>
                  Difficulty: {problem.difficulty}
                </p>
                <div className="problem-description">
                  <h3>Problem Statement:</h3>
                  <p>{problem.description}</p>
                </div>
                <div className="test-cases">
                  <h3>Test Cases:</h3>
                  {problem.testCases.map((tc, idx) => (
                    <div key={idx} className="test-case">
                      <p>
                        <strong>Input:</strong> {tc.input}
                      </p>
                      <p>
                        <strong>Output:</strong> {tc.output}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p>Loading problem...</p>
            )}
          </div>
        </div>

        <div className="editor-section">
          <CodeEditor
            problemTitle={problem?.title}
            onSubmit={handleSubmitCode}
            disabled={gameFinished}
            isSubmitted={hasSubmitted}
          />
        </div>

        <div className="status-section">
          <div className="players-info">
            <h3>Players:</h3>
            {room?.participants.map((participant) => (
              <div key={participant} className="player-status">
                <span>{participant}</span>
                {submissions.find((s) => s.userId === participant) && (
                  <span className="status-badge">
                    {submissions.find((s) => s.userId === participant)
                      ?.isCorrect
                      ? "✅ Correct"
                      : "❌ Wrong"}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Game;
