import "../styles/CreateRoom.css";
import { useState } from "react";
import { createRoom, joinRoom } from "../api/roomApi";
import { useNavigate } from "react-router-dom";
import copy from "../assets/copy.svg";
import toast, { Toaster } from "react-hot-toast";

type CreateRoomProps = {
  onClose: () => void;
  user: string;
};

function CreateRoom({ user, onClose }: CreateRoomProps) {
  const [difficulty, setDifficulty] = useState("Medium");
  const [timer, setTimer] = useState("30");
  const [roomCode, setRoomCode] = useState("");
  const [isRoomCreated, setIsRoomCreated] = useState(false);

  const navigate = useNavigate();

  const handleCreateRoom = async () => {
    try {
      const room = await createRoom(difficulty, parseInt(timer));

      await joinRoom(room._id, user);

      localStorage.setItem("currentRoomId", room._id);

      setRoomCode(room._id);
      setIsRoomCreated(true);
    } catch (err) {
      console.error("Failed to create room", err);
    }
  };

  const handleJoinBattle = () => {
    if (!roomCode) return;

    navigate(`/room/${roomCode}`);
  };

  const handleCopy = async () => {
    const code = roomCode || "";
    await navigator.clipboard.writeText(code);
    toast("Copied");
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2>Create Room</h2>
          </div>

          <button className="close-button" onClick={onClose} type="button">
            ×
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreateRoom();
          }}
        >
          <div className="form-group">
            <label htmlFor="difficulty">Problem Difficulty</label>

            <select
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="timer">Time Limit</label>

            <select
              id="timer"
              value={timer}
              onChange={(e) => setTimer(e.target.value)}
            >
              <option value="15">15 Minutes</option>
              <option value="20">20 Minutes</option>
              <option value="30">30 Minutes</option>
            </select>
          </div>

          <button className="create-button" type="submit">
            Create Room
          </button>
        </form>

        {/* Room Created */}
        {isRoomCreated && (
          <div className="room-created">
            <p>Room created! Share this code with your friend:</p>
            <div className="room-code flex flex-1 items-center justify-center gap-4">
              {roomCode}
              <button
                className="p-1.5 hover:bg-[#1E1E1E] hover:rounded-2xl"
                type="button"
                onClick={handleCopy}
                title="Copy Code"
              >
                <Toaster
                  toastOptions={{
                    duration: 1500,
                    style: {
                      background: "#363636",
                      color: "#fff",
                    },
                  }}
                />
                <img className="h-5 w-5" src={copy} alt="" />
              </button>
            </div>

            <button
              className="join-button"
              onClick={handleJoinBattle}
              type="button"
            >
              Join Battle
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateRoom;
