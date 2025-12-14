import Problem from "./Problem";
import Profile from "./Profile";
import Room from "./Room";

function Home() {
  return (
    <div className="hero">
      <Profile />
      <Room />
      <Problem />
    </div>
  );
}

export default Home;
