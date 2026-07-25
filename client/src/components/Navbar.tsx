import logoIcon from "../assets/logo.png";
import profilePic from "../assets/profile.jpeg";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <>
      {/* Navbar */}

      <nav className="sticky top-0 z-50 border-b border-gray-800 bg-primary-black backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img className="w-7 h-7 rounded-full" src={logoIcon} alt="" />
            <span className="text-xl text-red font-bold">CodeClash</span>
          </div>

          <div className="hidden md:flex justify-center items-center gap-5">
            <Link to="/" className="text-red font-medium">
              Home
            </Link>
            <Link to="/room" className="text-white hover:text-red transition">
              Room
            </Link>
            <Link
              to="/Online-Compiler"
              className="text-white hover:text-red transition"
            >
              Online Compiler
            </Link>
            <Link
              to="/practise"
              className="text-white hover:text-red transition"
            >
              Practise
            </Link>

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

export default Navbar;
