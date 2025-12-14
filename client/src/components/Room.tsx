import { createRoom } from "../api/roomApi";
import { useEffect, useState } from "react";
import { getRooms, joinRoom } from "../api/roomApi";
import { useNavigate } from "react-router-dom";

export interface RoomType {
  _id: string;
  name: string;
  participants: string[];
}

function Room() {
  const [user, setUser] = useState("Guest");
  const [newRoomName, setNewRoomName] = useState("");
  const [refreshFlag, setRefreshFlag] = useState(0);
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showJoinForm, setJoinForm] = useState(false);

  const handleCreateRoom = async () => {
    if (!newRoomName.trim()) return;
    try {
      await createRoom(newRoomName);
      setNewRoomName("");
      setRefreshFlag((prev) => prev + 1);
    } catch (err) {
      console.error("Failed to create room", err);
    }
    setShowForm(false);
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
  }, [refreshFlag]);

  const handleJoin = async (roomId: string) => {
    const room = rooms.find((r) => r._id === roomId);
    if (room?.participants.includes(user)) {
      alert("You have already joined this room!");
      return;
    }
    try {
      await joinRoom(roomId, user);
      fetchRooms();
    } catch (err) {
      console.error("Failed to join room", err);
    }
  };

  return (
    <>
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
              e.preventDefault(); // stop page reload
              handleCreateRoom();
            }}
          >
            <label htmlFor="roomName">Room Name:</label>
            <input
              id="roomName"
              name="roomName"
              type="text"
              value={newRoomName} // use newRoomName
              onChange={(e) => setNewRoomName(e.target.value)} // update newRoomName
              placeholder="Enter Room Name"
              autoComplete="off"
            />

            <label htmlFor="problemType">Problem Type : </label>
            <select name="difficulty" id="difficulty">
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <label htmlFor="timer">Timer : </label>
            <select name="timer" id="timer">
              <option value="10">10 Minutes</option>
              <option value="15">15 Minutes</option>
              <option value="20">20 Minutes</option>
              <option value="25">25 Minutes</option>
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
            }}
          >
            Join Room
          </button>
        ) : (
          <div>
            <h2>Available Rooms</h2>
            <ul>
              {rooms.map((room) => (
                <li key={room._id}>
                  {room.name} ({room.participants.length} participants)
                  <button
                    onClick={() => handleJoin(room._id)}
                    disabled={room.participants.includes(user)}
                  >
                    {room.participants.includes(user) ? "Joined" : "Join"}
                  </button>
                </li>
              ))}
            </ul>

            <form
              onSubmit={(e) => {
                e.preventDefault(); // stop page reload
                handleCreateRoom();
              }}
            >
              <button type="button" onClick={() => setJoinForm(false)}>
                Cancel
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}

export default Room;
