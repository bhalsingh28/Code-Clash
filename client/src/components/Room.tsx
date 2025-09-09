import { useEffect, useState } from "react";
import { getRooms, joinRoom } from "../api/roomApi";

interface RoomProps {
  user: string;
  refreshFlag: number;
  onRefresh?: () => void;
}

export interface RoomType {
  _id: string;
  name: string;
  participants: string[];
}

const Room: React.FC<RoomProps> = ({ user, refreshFlag, onRefresh }) => {
  const [rooms, setRooms] = useState<RoomType[]>([]);

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
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("Failed to join room", err);
    }
  };

  return (
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
    </div>
  );
};

export default Room;
