import { createRoom } from "../api/roomApi";
import { useEffect, useState } from "react";
import { getRooms, joinRoom } from "../api/roomApi";
import { useNavigate } from "react-router-dom";

export interface RoomType {
  _id: string;
  name: string;
  participants: string[];
  difficulty: string;
  timerMinutes: number;
  gameStatus: string;
}

function Room() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("userId");
    return saved || "Guest";
  });
  const [newRoomName, setNewRoomName] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [timer, setTimer] = useState("30");
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showJoinForm, setJoinForm] = useState(false);
  const navigate = useNavigate();

  // Save user to localStorage
  useEffect(() => {
    localStorage.setItem("userId", user);
  }, [user]);

  const handleCreateRoom = async () => {
    if (!newRoomName.trim()) return;
    try {
      const room = await createRoom(newRoomName, difficulty, parseInt(timer));
      setNewRoomName("");
      setDifficulty("Medium");
      setTimer("30");
      setShowForm(false);

      // Join the room and navigate to game
      await joinRoom(room._id, user);
      localStorage.setItem("currentRoomId", room._id);
      navigate(`/game/${room._id}`);
    } catch (err) {
      console.error("Failed to create room", err);
    }
  };

  const fetchRooms = async () => {
    try {
      const data = await getRooms();
      setRooms(data);
    } catch (err) {
      console.error("Failed to fetch rooms", err);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleJoin = async (roomId: string) => {
    const room = rooms.find((r) => r._id === roomId);
    if (room?.participants.includes(user)) {
      alert("You have already joined this room!");
      return;
    }
    try {
      await joinRoom(roomId, user);
      localStorage.setItem("currentRoomId", roomId);
      navigate(`/game/${roomId}`);
    } catch (err) {
      console.error("Failed to join room", err);
    }
  };

  return (
    <>
      <div className="user-section">
        <label htmlFor="username">Username:</label>
        <input
          id="username"
          type="text"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          placeholder="Enter your username"
          maxLength={20}
        />
      </div>

      <div>
        {!showForm ? (
          <button
            onClick={() => {
              setShowForm(true);
              setJoinForm(false);
            }}
          >
            Create Room
          </button>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCreateRoom();
            }}
          >
            <label htmlFor="roomName">Room Name:</label>
            <input
              id="roomName"
              name="roomName"
              type="text"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              placeholder="Enter Room Name"
              autoComplete="off"
            />

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
            <button type="button" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </form>
        )}
      </div>

      <div>
        {!showJoinForm ? (
          <button
            onClick={() => {
              setJoinForm(true);
              setShowForm(false);
              fetchRooms();
            }}
          >
            Join Room
          </button>
        ) : (
          <div>
            <h2>Available Rooms</h2>
            {rooms.length === 0 ? (
              <p>No rooms available. Create one!</p>
            ) : (
              <ul>
                {rooms.map((room) => (
                  <li key={room._id}>
                    <strong>{room.name}</strong> - {room.difficulty} (
                    {room.timerMinutes}min)
                    <br />
                    Players: {room.participants.length}/2
                    <button
                      onClick={() => {
                        handleJoin(room._id);
                      }}
                      disabled={
                        room.participants.includes(user) ||
                        room.gameStatus !== "waiting"
                      }
                    >
                      {room.participants.includes(user)
                        ? "Joined"
                        : room.gameStatus === "waiting"
                        ? "Join"
                        : "In Progress"}
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <button type="button" onClick={() => setJoinForm(false)}>
              Cancel
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default Room;
