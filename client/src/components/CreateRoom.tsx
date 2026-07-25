import "../styles/CreateRoom.css";
import { useState } from "react";
import { createRoom, joinRoom } from "../api/roomApi";
import { useNavigate } from "react-router-dom";

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
      console.error("Falied to create room", err);
    }
  };

  const handleJoinBattle = async () => {
    try {
      navigate(`/room/${roomCode}`);
    } catch (err) {
      console.error("Falied to create room", err);
    }
  };

  return (
    <>
      <div className="overlay">
        <div className="modal">
          <button onClick={onClose}>X</button>
          <div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateRoom();
              }}
            >
              <label htmlFor="difficulty">Problem Difficulty: </label>
              <select
                id="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>

              <label htmlFor="timer">Time Limit: </label>
              <select
                id="timer"
                value={timer}
                onChange={(e) => setTimer(e.target.value)}
              >
                <option value="15">15 Minutes</option>
                <option value="20">20 Minutes</option>
                <option value="30">30 Minutes</option>
              </select>
              <button type="submit">Create</button>
            </form>
            {isRoomCreated && (
              <div>
                <span>Share Room Code To your Friend : {roomCode}</span>
              </div>
            )}

            <button onClick={handleJoinBattle}>Join Battle</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateRoom;
