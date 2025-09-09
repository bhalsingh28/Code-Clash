import { useState } from "react";
import Room from "./components/Room";
import { createRoom } from "./api/roomApi";

function App() {
  const [user, setUser] = useState("Guest");
  const [newRoomName, setNewRoomName] = useState("");
  const [refreshFlag, setRefreshFlag] = useState(0);

  const handleCreateRoom = async () => {
    if (!newRoomName.trim()) return;
    try {
      await createRoom(newRoomName);
      setNewRoomName("");
      setRefreshFlag((prev) => prev + 1);
    } catch (err) {
      console.error("Failed to create room", err);
    }
  };

  return (
    <div>
      <h1>Code-Clash Rooms</h1>
      <div>
        <input
          type="text"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          placeholder="Your name"
        />
      </div>

      <div>
        <input
          type="text"
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
          placeholder="New room name"
        />
        <button onClick={handleCreateRoom}>Create Room</button>
      </div>

      <Room
        user={user}
        refreshFlag={refreshFlag}
        onRefresh={() => setRefreshFlag((prev) => prev + 1)}
      />
    </div>
  );
}

export default App;
