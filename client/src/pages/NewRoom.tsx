import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import CreateRoom from "../components/CreateRoom";
import "../newStyles.css";
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

function NewRoom() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("userId");
    return saved || "Guest";
  });
  const [createRoom, setCreateRoom] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const navigate = useNavigate();
  // Save user to localStorage
  useEffect(() => {
    localStorage.setItem("userId", user);
  }, [user]);

  const fetchRooms = async () => {
    try {
      const data = await getRooms();
      setRooms(data);
      console.log(data);
    } catch (err) {
      console.error("Failed to fetch rooms", err);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleJoinRoom = async (roomId: string) => {
    const room = rooms.find((r) => r._id == roomId);
    if (!room) {
      alert("Room not found");
      return;
    }
    // if (room?.participants.includes(user)) {
    //   alert("You have already joined this room!");
    //   return;
    // }
    try {
      await joinRoom(roomId, user);
      localStorage.setItem("currentRoomId", roomId);
      navigate(`/room/${roomId}`);
    } catch (err) {
      console.error("Failed to join room", err);
    }
  };

  return (
    <>
      <div>
        <Navbar />
        <div className="min-h-screen bg-primary-black text-white">
          {/* Hero Section */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="mx-15">
              <div className="mb-8 flex-col items-start">
                <h1 className="text-6xl font-bold mb-5">
                  <span className="bg-clip-text text-red">Room</span>
                </h1>
                <h2 className="text-4xl text-white font-bold mb-5">
                  Create or Join Coding Battles
                </h2>
                <p className="text-gray-white text-lg max-w-2xl mb-8">
                  Challenge your friend in real time contests, solve problems
                  together, and climb live leaderboard
                </p>
              </div>

              <div className="flex flex-2 justify-between">
                <div className="join-room">
                  <div className="head">
                    <img src="" alt="" />
                    <div>
                      <h2>Join Room</h2>
                      <p>Enter an invite code</p>
                    </div>
                  </div>
                  <input
                    onChange={(e) => setJoinCode(e.target.value)}
                    type="text"
                    placeholder="Enter Room Code"
                  />
                  <button onClick={() => handleJoinRoom(joinCode)}>
                    Join Room
                  </button>
                </div>

                <div className="create-room">
                  <div className="head">
                    <img src="" alt="" />
                    <div>
                      <h2>Create Room</h2>
                      <p>Start a private coding room and invite your friend</p>
                    </div>
                  </div>
                  <ul>
                    <li>Generate invite code</li>
                    <li>Choose Problem Difficulty</li>
                    <li>Set Timer</li>
                    <li>Live Leader board</li>
                  </ul>
                  <button onClick={() => setCreateRoom(true)}>
                    Create Room
                  </button>
                  {createRoom && (
                    <CreateRoom
                      user={user}
                      onClose={() => setCreateRoom(false)}
                    />
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default NewRoom;
