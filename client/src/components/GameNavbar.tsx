import logoIcon from "../assets/logo.png";
import profilePic from "../assets/profile.jpeg";
import clock from "../assets/clock.svg";

type GameNavbarProps = {
  timeLeft: number;
};

export default function GameNavbar({ timeLeft }: GameNavbarProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };
  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-gray-800 bg-primary-black backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img className="w-7 h-7 rounded-full" src={logoIcon} alt="" />
            <div>
              <span className="text-xl text-white font-bold">Code</span>
              <span className="text-xl text-red font-bold">Clash</span>
            </div>
          </div>
          <div className="flex gap-2 justify-center items-center">
            <img className="w-7 h-7" src={clock} alt="" />
            <span className="font-bold text-lg f-10 text-white">
              Time Left : {formatTime(timeLeft)}
            </span>
          </div>

          <div className="hidden md:flex justify-center items-center gap-5">
            <button className="w-6 h-6 rounded-full overflow-hidden hover:ring-2 hover:ring-gray-500 transition">
              <img
                src={profilePic}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
