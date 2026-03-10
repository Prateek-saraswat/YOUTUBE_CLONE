// src/components/Header.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMenu, FiSearch, FiUser, FiLogOut, FiMic } from "react-icons/fi";
import { FaYoutube } from "react-icons/fa";
import { MdVideoLibrary } from "react-icons/md";
import { useAuth } from "../context/authContext.jsx";
import { AiOutlineBell } from "react-icons/ai";

// onToggleSidebar -> function passed from parent to open/close sidebar
const Header = ({ onToggleSidebar }) => {
  // Get user data and logout function from Auth Context
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  // State to control user dropdown visibility
  const [showDropdown, setShowDropdown] = useState(false);

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    // Navigate to homepage with search query
    navigate(`/?search=${encodeURIComponent(searchQuery)}`);
  };

  // Handle user sign out
  const handleSignOut = () => {
    logout(); // remove user session
    setShowDropdown(false); // close dropdown
    navigate("/"); // redirect to homepage
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-white flex items-center justify-between px-4 border-b border-gray-200 z-50 text-black">
      {/* LEFT SECTION */}
      {/* Contains sidebar toggle button and YouTube logo */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="text-xl p-2 rounded-full hover:bg-gray-100 cursor-pointer"
        >
          <FiMenu />
        </button>
        {/* YouTube Logo + Home Link */}
        <Link
          to="/"
          className="flex items-center gap-1 font-semibold text-lg flex-shrink-0"
        >
          <FaYoutube className="text-red-600 text-2xl" />
          <span className="hidden sm:block">YouTube</span>
        </Link>
      </div>

      {/* CENTER */}
      <div className="flex-1 max-w-2xl mx-2 sm:mx-4 min-w-0">
        <form onSubmit={handleSearch} className="flex items-center">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 w-full min-w-0 px-3 sm:px-4 py-2 sm:py-2.5 bg-white text-black border border-gray-300 rounded-l-full focus:outline-none text-sm"
          />

          <button
            type="submit"
            className="px-5 py-3 bg-gray-100 border border-l-0 border-gray-300 rounded-r-full hover:bg-gray-200 active:scale-95 cursor-pointer"
          >
            <FiSearch />
          </button>

          <button
            type="button"
            className="hidden md:flex items-center justify-center ml-3 w-10 h-10 bg-gray-100 rounded-full hover:bg-gray-200"
          >
            <FiMic className="text-lg" />
          </button>

          <button
            type="button"
            className="hidden md:flex items-center justify-center ml-3 w-10 h-10 hover:bg-gray-100 rounded-full"
          >
            <AiOutlineBell className="text-xl" />
          </button>
        </form>
      </div>

      {/* RIGHT SECTION */}
      {/* Displays user profile or login button */}
      <div className="relative flex items-center flex-shrink-0">
        {user ? (
          <>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 hover:bg-gray-100 p-1 rounded-full"
            >
              <img
                src={
                  user.avatar ||
                  `https://ui-avatars.com/api/?name=${user.username}`
                }
                alt={user.username}
                className="w-8 h-8 rounded-full"
              />
              <span className="hidden md:block">{user.username}</span>
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-35 w-44 bg-white border border-gray-200 rounded-md shadow-lg">
                <Link
                  to={
                    user.channels?.length
                      ? `/channel/${user.channels[0]}`
                      : "/channel/create"
                  }
                  onClick={() => setShowDropdown(false)}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                >
                  <MdVideoLibrary /> My Channel
                </Link>

                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 w-full text-left"
                >
                  <FiLogOut /> Sign Out
                </button>
              </div>
            )}
          </>
        ) : (
          /* Sign In Button (shown when user not logged in) */
          <Link
            to="/login"
            className="flex items-center justify-center gap-1 px-2 sm:px-4 py-1.5 border border-blue-500 text-blue-500 rounded-full text-sm hover:bg-blue-50 whitespace-nowrap"
          >
            <FiUser />
            <span className="hidden sm:block rounded-full">Sign in</span>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
