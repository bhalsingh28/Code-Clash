import logoIcon from "../assets/logo.png";
import profilePic from "../assets/profile.jpeg";
import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <>
      {/* Navbar */}

      <nav className="sticky top-0 z-50 border-b border-gray-800 bg-primary-black backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img
              className="cursor-pointer w-7 h-7 rounded-full"
              src={logoIcon}
              alt=""
            />
            <div>
              <NavLink to="/">
                <span className="text-xl text-white font-bold">Code</span>
                <span className="text-xl text-red font-bold">Clash</span>
              </NavLink>
            </div>
          </div>

          <div className="hidden md:flex justify-center items-center gap-5">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-red font-medium"
                  : "text-white hover:text-red transition"
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/room"
              className={({ isActive }) =>
                isActive
                  ? "text-red font-medium"
                  : "text-white hover:text-red transition"
              }
            >
              Room
            </NavLink>

            <NavLink
              to="/Online-Compiler"
              className={({ isActive }) =>
                isActive
                  ? "text-red font-medium"
                  : "text-white hover:text-red transition"
              }
            >
              Online Compiler
            </NavLink>

            <NavLink
              to="/practise"
              className={({ isActive }) =>
                isActive
                  ? "text-red font-medium"
                  : "text-white hover:text-red transition"
              }
            >
              Practise
            </NavLink>

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
