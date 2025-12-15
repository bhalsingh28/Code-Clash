import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import RoomPage from "./components/RoomPage";
import "./styles.css";
import Problem from "./components/Problem";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:roomId" element={<RoomPage />} />
        <Route path="/problem" element={<Problem />} />
      </Routes>
    </Router>
  );
}

export default App;
