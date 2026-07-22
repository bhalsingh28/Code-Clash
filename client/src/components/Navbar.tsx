import logoIcon from "../assets/logo.png";
import profilePic from "../assets/profile.jpeg";

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
            <a href="#" className="text-red font-medium">
              Home
            </a>
            <a href="#" className="text-white hover:text-red transition">
              Online Compiler
            </a>
            <a href="#" className="text-white hover:text-red transition">
              Problems
            </a>
            <a href="#" className="text-white hover:text-red transition">
              Practise
            </a>
            <a href="#" className="text-white hover:text-red transition">
              Room
            </a>
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
