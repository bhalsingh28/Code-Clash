import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import CreateRoom from "../components/CreateRoom";
import "../newStyles.css";
import { getRooms, joinRoom } from "../api/roomApi";
import { useNavigate } from "react-router-dom";
import join from "../assets/join.svg";
import plus from "../assets/plus.svg";
import fight from "../assets/fight.svg";

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

  // Fetch available rooms
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

  // Join room
  const handleJoinRoom = async (roomId: string) => {
    const room = rooms.find((r) => r._id === roomId);

    if (!room) {
      alert("Room not found");
      return;
    }

    try {
      await joinRoom(roomId, user);

      localStorage.setItem("currentRoomId", roomId);

      navigate(`/room/${roomId}`);
    } catch (err) {
      console.error("Failed to join room", err);
    }
  };

  return (
    <div className="min-h-screen bg-primary-black text-white">
      <Navbar />

      <main className="min-h-[calc(100vh-64px)]">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="mx-0 lg:mx-15">
            {/* ================= HERO SECTION ================= */}
            <div className="mb-8">
              <h1 className="text-5xl sm:text-6xl font-bold mb-5">
                <span className="bg-clip-text text-red">Room</span>
              </h1>

              <h2 className="text-3xl sm:text-4xl text-white font-bold mb-5">
                Create or Join Coding Battles.
              </h2>

              <p className="text-gray-white text-lg max-w-2xl mb-8">
                Challenge your friend in real time contests, solve problems
                together, and climb live leaderboard.
              </p>
            </div>

            {/* ================= ROOM CARDS ================= */}
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-15">
              {/* JOIN ROOM */}
              <div className="border border-gray-600 rounded-xl flex flex-1 flex-col min-w-0 bg-[#1b1b1f]">
                <div className="flex items-center gap-4 sm:gap-6 p-3">
                  <div className="flex items-center justify-center size-10 border bg-blue-100 rounded-[8px] ml-2 shrink-0">
                    <img className="size-8" src={join} alt="Join room" />
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-blue-600 font-bold">Join Room</h2>

                    <p className="text-sm sm:text-base">
                      Enter code to join existing room
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 p-4">
                  <input
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    type="text"
                    placeholder="Enter Room Code"
                    className="border border-gray-700 flex-1 min-w-0 rounded-lg p-2 bg-transparent outline-none focus:border-blue-600"
                  />

                  <button
                    className="bg-blue-700 hover:bg-blue-600 transition text-white font-bold px-4 py-2 rounded-lg whitespace-nowrap"
                    onClick={() => handleJoinRoom(joinCode)}
                  >
                    Join Room
                  </button>
                </div>
              </div>

              {/* CREATE ROOM */}
              <div className="border border-gray-600 rounded-xl flex flex-1 flex-col min-w-0 bg-[#1b1b1f]">
                <div className="flex items-center gap-4 sm:gap-6 p-3">
                  <div className="flex items-center justify-center size-10 border bg-red-100 rounded-[8px] ml-2 shrink-0">
                    <img className="size-8" src={plus} alt="Create room" />
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-[#DF301C] font-bold">Create Room</h2>

                    <p className="text-sm sm:text-base">
                      Start a private coding room and invite your friend
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 p-4">
                  <button
                    className="bg-[#DF301C] hover:bg-[#ef3823] transition text-white flex-1 font-bold px-4 py-2 rounded-lg"
                    onClick={() => setCreateRoom(true)}
                  >
                    Create Room
                  </button>
                </div>
              </div>
            </div>

            <section className="mt-15">
              {/* Divider */}
              <div className="w-full h-px bg-gray-800 mb-10" />

              {/* Heading */}
              <div className="text-center mb-10">
                <p className="text-[#DF301C] font-semibold tracking-widest text-xl uppercase mb-3">
                  Simple & Fast
                </p>

                <h2 className="text-3xl sm:text-4xl font-bold">How It Works</h2>

                <p className="text-gray-white mt-3">
                  Get into a coding battle in three simple steps.
                </p>
              </div>

              {/* Steps */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* STEP 1 */}
                <div className="relative border border-gray-700 rounded-xl p-7 bg-[#1b1b1f] hover:border-gray-500 transition">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-4xl font-black text-[#DF301C]">
                      01
                    </span>

                    <div className="size-10 rounded-full bg-[#2a1715] border border-[#DF301C]/40 flex items-center justify-center">
                      <span className="text-[#DF301C] font-bold">+</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold mb-2">Create</h3>

                  <p className="text-gray-white leading-relaxed">
                    Create a private coding room and get your unique room code.
                  </p>
                </div>

                {/* STEP 2 */}
                <div className="relative border border-gray-700 rounded-xl p-7 bg-[#1b1b1f] hover:border-gray-500 transition">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-4xl font-black text-blue-600">
                      02
                    </span>

                    <div className="size-10 rounded-full bg-[#171e32] border border-blue-600/40 flex items-center justify-center">
                      <span className="text-blue-500 font-bold">→</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold mb-2">Invite</h3>

                  <p className="text-gray-white leading-relaxed">
                    Share your room code with a friend and bring them into the
                    battle.
                  </p>
                </div>

                {/* STEP 3 */}
                <div className="relative border border-gray-700 rounded-xl p-7 bg-[#1b1b1f] hover:border-gray-500 transition">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-4xl font-black text-[#22c55e]">
                      03
                    </span>

                    <div className="size-10 rounded-full bg-[#152a1b] border border-[#22c55e]/40 flex items-center justify-center">
                      <img className="size-6" src={fight} alt="" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold mb-2">Compete</h3>

                  <p className="text-gray-white leading-relaxed">
                    Solve problems together, race against the clock, and see who
                    comes out on top.
                  </p>
                </div>
              </div>
            </section>

            <section className="mt-16 mb-12">
              <div className="relative overflow-hidden border border-gray-700 rounded-2xl bg-[#1b1b1f] px-6 py-12 sm:px-10 text-center">
                {/* Decorative background */}
                <div className="absolute -top-24 -right-24 size-64 rounded-full bg-[#DF301C]/10 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 size-64 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

                <div className="relative">
                  <p className="text-[#DF301C] font-semibold tracking-widest text-sm uppercase mb-3">
                    Your next battle starts here
                  </p>

                  <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                    Ready to Clash?
                  </h2>

                  <p className="text-gray-white max-w-xl mx-auto mb-7">
                    Create a room, invite your friend, and find out who really
                    codes faster.
                  </p>

                  <button
                    onClick={() => setCreateRoom(true)}
                    className="bg-[#DF301C] hover:bg-[#ef3823] transition text-white font-bold px-8 py-3 rounded-lg"
                  >
                    Create Your First Room
                  </button>
                </div>
              </div>
            </section>
          </div>
        </section>
      </main>

      {/* CREATE ROOM MODAL */}
      {createRoom && (
        <CreateRoom user={user} onClose={() => setCreateRoom(false)} />
      )}
    </div>
  );
}

export default NewRoom;
