import Room from "./components/Room";
import Profile from "./components/Profile";
import "./styles.css";

function App() {
  return (
    <>
      <div className="hero">
        <Profile />
        <Room />
      </div>
    </>
  );
}

export default App;
