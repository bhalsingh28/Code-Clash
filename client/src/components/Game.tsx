import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getGameStatus, submitCode, deleteRoom } from "../api/roomApi";
import MonacoEditor from "./MonacoEditor";
import GameNavbar from "./GameNavbar";
import io, { Socket } from "socket.io-client";
import PopWindow from "./PopWindow";
import Problem from "./Problem";
import Chat from "./Chat";

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
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [showDescription, setShowDescription] = useState(true);

  useEffect(() => {
    console.log("GAME RENDER");
  });

  useEffect(() => {
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected:", newSocket.id);
      console.log("roomId =", roomId);
      console.log("currentUser =", currentUser);

      if (roomId) {
        console.log("Emitting join_room");
        newSocket.emit("join_room", {
          roomId,
          userId: currentUser,
        });
      } else {
        console.log("roomId is falsy");
      }
    });

    newSocket.on("game_started", (data) => {
      setProblem(data.problem);
      if (data.startedAt && data.timerMinutes) {
        const startTime = new Date(data.startedAt).getTime();
        const totalSeconds = data.timerMinutes * 60;
        const elapsedSeconds = (Date.now() - startTime) / 1000;
        const remaining = Math.max(0, totalSeconds - elapsedSeconds);
        setTimeLeft(remaining);
        // if (remaining === 0) {
        //   setGameFinished(true);
        //   setShowPopup(true);
        //   setPopupMessage("Time's up!");
        //   handleLeave();
        // }
      }
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
    if (timeLeft === 0) {
      setGameFinished(true);
      console.log("Time's up!");
      setShowPopup(true);
      setPopupMessage("Time's up!");
      handleLeave();
    }

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
      // Show loading popup
      setPopupMessage("Running Testcases, Please Wait.");
      setShowPopup(true);

      const result = await submitCode(roomId, currentUser, code);

      if (!result.isCorrect) {
        setPopupMessage("Testcases failed");
        return;
      }

      // Correct answer
      setShowPopup(false);

      if (!winner) {
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

      setPopupMessage("Something went wrong");
    }
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

  const toggleChat = () => {
    setShowDescription(false);
    setShowChat(true);
  };

  const toggleDescription = () => {
    setShowChat(false);
    setShowDescription(true);
  };

  const handleLeave = async () => {
    try {
      await deleteRoom(roomId);
      navigate("/");
    } catch (err) {
      console.error("Failed to leave room", err);
    }
  };

  return (
    <div className="min-h-screen bg-primary-black text-white">
      <section className="h-screen flex flex-col">
        <GameNavbar timeLeft={timeLeft} />

        <div className="flex flex-1 gap-5 px-5 py-2 overflow-hidden">
          {/* Left Panel */}
          <div className="w-1/3 bg-secondary-black rounded-4xl flex flex-col overflow-hidden">
            <div className="px-6 py-4 flex">
              <button
                onClick={toggleDescription}
                className="bg-white text-black mr-4 px-2 rounded-[7px]"
              >
                Description
              </button>
              <button
                onClick={toggleChat}
                className="bg-white text-black px-2 rounded-[7px]"
              >
                Chat
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6">
              {problem ? (
                <>{showChat ? <Chat /> : <Problem problem={problem} />}</>
              ) : (
                <span className="text-xl">
                  Waiting for other player to Join...
                </span>
              )}
            </div>

            {/* Fixed Bottom */}
            <div className="shrink-0 border-t border-neutral-700 p-4">
              <button
                className="w-full rounded-xl bg-red-600 py-3 font-semibold hover:bg-red-700 transition"
                onClick={handleLeave}
              >
                Leave Room
              </button>
              <button></button>
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-2/3 min-h-0 flex flex-col gap-2 overflow-hidden">
            <div className="flex-[7] min-h-0 rounded-2xl bg-secondary-black overflow-hidden">
              {/* Monaco Editor */}

              <MonacoEditor
                problemTitle={problem?.title}
                onSubmit={handleSubmitCode}
                disabled={gameFinished}
                isSubmitted={hasSubmitted}
              />
            </div>
            {showPopup && (
              <PopWindow
                message={popupMessage}
                onClose={() => setShowPopup(false)}
              />
            )}
            <div className="flex-[3] min-h-0 rounded-2xl bg-secondary-black p-4 overflow-y-auto">
              {" "}
              <strong className="mx-2">Test Cases</strong>
              <div className="mt-2">
                {problem ? (
                  <>
                    {problem.testCases.map((tc, idx) => (
                      <div
                        key={idx}
                        className="mb-2 rounded-xl bg-primary-black p-2"
                      >
                        <p className="ml-2 flex-1">
                          <strong>Input:</strong> {tc.input}
                        </p>

                        <p className="mt-1 ml-2">
                          <strong>Output:</strong> {tc.output}
                        </p>
                      </div>
                    ))}
                  </>
                ) : (
                  <p>Waiting for other player to join.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Game;
