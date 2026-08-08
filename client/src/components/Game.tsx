import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getGameStatus, submitCode } from "../api/roomApi";
import MonacoEditor from "./MonacoEditor";
import GameNavbar from "./GameNavbar";
// import "../styles/Game.css";
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
      // console.log("1. callind handleSubmitCode");
      // console.log("isCorrect : ", result.isCorrect);
      // console.log("wrongTestCases : ", result.wrongTestCases);
      // console.log("error : ", result.error);

      if (result.wrongTestCases && result.wrongTestCases.length > 0) {
        console.log("Test cases failed");
      } else {
        console.log("Test cases passed");
      }

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
    // <div>
    //   <GameNavbar timeLeft={timeLeft} />
    //   <div className="game-container">
    //     <div className="game-content">
    //       <div className="problem-section">
    //         <div className="problem-card">
    //           {problem ? (
    //             <>
    //               <h2>{problem.title}</h2>
    //               <p
    //                 className={`difficulty ${problem.difficulty.toLowerCase()}`}
    //               >
    //                 Difficulty: {problem.difficulty}
    //               </p>
    //               <div className="problem-description">
    //                 <h3>Problem Statement:</h3>
    //                 <p>{problem.description}</p>
    //               </div>
    //               <div className="test-cases">
    //                 <h3>Test Cases:</h3>
    //                 {problem.testCases.map((tc, idx) => (
    //                   <div key={idx} className="test-case">
    //                     <p>
    //                       <strong>Input:</strong> {tc.input}
    //                     </p>
    //                     <p>
    //                       <strong>Output:</strong> {tc.output}
    //                     </p>
    //                   </div>
    //                 ))}
    //               </div>
    //             </>
    //           ) : (
    //             <p>Loading problem solve</p>
    //           )}
    //         </div>
    //       </div>

    //       <div>
    //         <MonacoEditor
    //           problemTitle={problem?.title}
    //           onSubmit={handleSubmitCode}
    //           disabled={gameFinished}
    //           isSubmitted={hasSubmitted}
    //         />
    //       </div>

    //       <div className="status-section">
    //         <div className="players-info">
    //           <h3>Players:</h3>
    //           {room?.participants.map((participant) => (
    //             <div key={participant} className="player-status">
    //               <span>{participant}</span>
    //               {submissions.find((s) => s.userId === participant) && (
    //                 <span className="status-badge">
    //                   {submissions.find((s) => s.userId === participant)
    //                     ?.isCorrect
    //                     ? "✅ Correct"
    //                     : "❌ Wrong"}
    //                 </span>
    //               )}
    //             </div>
    //           ))}
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>

    // -----------------NEW CSS--------------------------

    <div className="min-h-screen bg-primary-black text-white">
      <section className="h-screen flex flex-col">
        <GameNavbar timeLeft={timeLeft} />

        <div className="flex flex-1 gap-5 px-5 py-2 overflow-hidden">
          {/* Left Panel */}
          <div className="w-1/3 bg-secondary-black rounded-4xl flex flex-col overflow-hidden">
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {problem ? (
                <>
                  <h2 className="text-2xl font-bold">{problem.title}</h2>

                  <p
                    className={`difficulty ${problem.difficulty.toLowerCase()} mt-2`}
                  >
                    <strong>Difficulty : </strong>
                    {problem.difficulty == "Easy" && (
                      <strong className="text-green-400">Easy</strong>
                    )}
                    {problem.difficulty == "Medium" && (
                      <strong className="text-yellow-400">Easy</strong>
                    )}
                    {problem.difficulty == "Hard" && (
                      <strong className="text-red-400">Hard</strong>
                    )}
                  </p>
                  <hr className="mt-2" />

                  <div className="mt-2">
                    <h3 className="text-lg font-semibold mb-2">
                      Problem Statement
                    </h3>

                    <p className="whitespace-pre-wrap leading-7">
                      {problem.description}
                    </p>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Test Cases</h3>

                    {problem.testCases.map((tc, idx) => (
                      <div
                        key={idx}
                        className="mb-4 rounded-xl bg-primary-black p-4"
                      >
                        <p>
                          <strong>Input:</strong> {tc.input}
                        </p>

                        <p className="mt-2">
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

            {/* Fixed Bottom */}
            <div className="shrink-0 border-t border-neutral-700 p-4">
              <button className="w-full rounded-xl bg-red-600 py-3 font-semibold hover:bg-red-700 transition">
                Leave Room
              </button>
              <button></button>
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-2/3 flex flex-col gap-2 overflow-hidden">
            <div className="h-7/10 flex-1 rounded-2xl bg-secondary-black mb-2">
              {/* Monaco Editor */}

              <MonacoEditor
                problemTitle={problem?.title}
                onSubmit={handleSubmitCode}
                disabled={gameFinished}
                isSubmitted={hasSubmitted}
              />
            </div>

            <div className="h-3/10 rounded-2xl bg-secondary-black p-4 overflow-y-auto">
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
                  <p>Loading</p>
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
