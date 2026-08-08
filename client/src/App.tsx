import { BrowserRouter, Routes, Route } from "react-router-dom";
import NewHome from "./pages/NewHome";
import NewRoom from "./pages/NewRoom";
import Game from "./components/Game";
import { LoginForm } from "./components/login-form";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<NewHome />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/room" element={<NewRoom />} />
        <Route path="/room/:roomId" element={<Game />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
