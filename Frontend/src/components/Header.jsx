// src/components/Header.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMenu, FiSearch, FiUser, FiLogOut, FiMic, FiX } from "react-icons/fi";
import { MdVideoLibrary } from "react-icons/md";
import { useAuth } from "../context/authContext.jsx";
import { AiOutlineBell } from "react-icons/ai";
import { HiOutlinePlus } from "react-icons/hi";

// YouTube full SVG logo
const YoutubeSVGLogo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="90" height="20" viewBox="0 0 93 20" aria-hidden="true">
    <path d="M14.4848 20C14.4848 20 23.5695 20 25.8229 19.4C27.0917 19.06 28.0459 18.08 28.3808 16.87C29 14.65 29 9.98 29 9.98C29 9.98 29 5.34 28.3808 3.14C28.0459 1.9 27.0917 0.94 25.8229 0.61C23.5695 0 14.4848 0 14.4848 0C14.4848 0 5.42037 0 3.17711 0.61C1.9286 0.94 0.954148 1.9 0.59888 3.14C0 5.34 0 9.98 0 9.98C0 9.98 0 14.65 0.59888 16.87C0.954148 18.08 1.9286 19.06 3.17711 19.4C5.42037 20 14.4848 20 14.4848 20Z" fill="#FF0033"/>
    <path d="M19 10L11.5 5.75V14.25L19 10Z" fill="white"/>
    <path d="M37.1384 18.8999V13.4399L40.6084 2.09994H38.0184L36.6984 7.24994C36.3984 8.42994 36.1284 9.65994 35.9284 10.7999H35.7684C35.6584 9.79994 35.3384 8.48994 35.0184 7.22994L33.7384 2.09994H31.1484L34.5684 13.4399V18.8999H37.1384Z" fill="#0f0f0f"/>
    <path d="M44.1003 6.29994C41.0703 6.29994 40.0303 8.04994 40.0303 11.8199V13.6099C40.0303 16.9899 40.6803 19.1099 44.0403 19.1099C47.3503 19.1099 48.0603 17.0899 48.0603 13.6099V11.8199C48.0603 8.44994 47.3803 6.29994 44.1003 6.29994ZM45.3903 14.7199C45.3903 16.3599 45.1003 17.3899 44.0503 17.3899C43.0203 17.3899 42.7303 16.3499 42.7303 14.7199V10.6799C42.7303 9.27994 42.9303 8.02994 44.0503 8.02994C45.2303 8.02994 45.3903 9.34994 45.3903 10.6799V14.7199Z" fill="#0f0f0f"/>
    <path d="M52.2713 19.0899C53.7313 19.0899 54.6413 18.4799 55.3913 17.3799H55.5013L55.6113 18.8999H57.6012V6.53994H54.9613V16.4699C54.6812 16.9599 54.0312 17.3199 53.4212 17.3199C52.6512 17.3199 52.4113 16.7099 52.4113 15.6899V6.53994H49.7812V15.8099C49.7812 17.8199 50.3613 19.0899 52.2713 19.0899Z" fill="#0f0f0f"/>
    <path d="M62.8261 18.8999V4.14994H65.8661V2.09994H57.1761V4.14994H60.2161V18.8999H62.8261Z" fill="#0f0f0f"/>
    <path d="M67.8728 19.0899C69.3328 19.0899 70.2428 18.4799 70.9928 17.3799H71.1028L71.2128 18.8999H73.2028V6.53994H70.5628V16.4699C70.2828 16.9599 69.6328 17.3199 69.0228 17.3199C68.2528 17.3199 68.0128 16.7099 68.0128 15.6899V6.53994H65.3828V15.8099C65.3828 17.8199 65.9628 19.0899 67.8728 19.0899Z" fill="#0f0f0f"/>
    <path d="M80.6744 6.26994C79.3944 6.26994 78.4744 6.82994 77.8644 7.73994H77.7344C77.8144 6.53994 77.8744 5.51994 77.8744 4.70994V1.43994H75.3244L75.3144 12.1799L75.3244 18.8999H77.5444L77.7344 17.6999H77.8044C78.3944 18.5099 79.3044 19.0199 80.5144 19.0199C82.5244 19.0199 83.3844 17.2899 83.3844 13.6099V11.6999C83.3844 8.25994 82.9944 6.26994 80.6744 6.26994ZM80.7644 13.6099C80.7644 15.9099 80.4244 17.2799 79.3544 17.2799C78.8544 17.2799 78.1644 17.0399 77.8544 16.5899V9.23994C78.1244 8.53994 78.7244 8.02994 79.3944 8.02994C80.4744 8.02994 80.7644 9.33994 80.7644 11.7299V13.6099Z" fill="#0f0f0f"/>
    <path d="M92.6517 11.4999C92.6517 8.51994 92.3517 6.30994 88.9217 6.30994C85.6917 6.30994 84.9717 8.45994 84.9717 11.6199V13.7899C84.9717 16.8699 85.6317 19.1099 88.8417 19.1099C91.3817 19.1099 92.6917 17.8399 92.5417 15.3799L90.2917 15.2599C90.2617 16.7799 89.9117 17.3999 88.9017 17.3999C87.6317 17.3999 87.5717 16.1899 87.5717 14.3899V13.5499H92.6517V11.4999ZM88.8617 7.96994C90.0817 7.96994 90.1717 9.11994 90.1717 11.0699V12.0799H87.5717V11.0699C87.5717 9.13994 87.6517 7.96994 88.8617 7.96994Z" fill="#0f0f0f"/>
  </svg>
);

/*  No-Channel Modal */
const NoChannelModal = ({ onClose, onCreateChannel }) => (
  <div
    style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "rgba(0,0,0,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "16px",
      fontFamily: "'Roboto','Arial',sans-serif",
    }}
    onClick={onClose}
  >
    <div
      style={{
        background: "#fff",
        borderRadius: "12px",
        padding: "32px 28px 24px",
        width: "100%",
        maxWidth: "420px",
        boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
        position: "relative",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: "absolute", top: "14px", right: "14px",
          background: "none", border: "none", cursor: "pointer",
          color: "#606060", display: "flex", alignItems: "center",
          padding: "4px", borderRadius: "50%",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#f2f2f2")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
      >
        <FiX size={20} />
      </button>

      {/* Icon */}
      <div
        style={{
          width: "64px", height: "64px", borderRadius: "50%",
          background: "#fff0f0",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 20px",
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#cc0000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
          <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#cc0000" stroke="none"/>
        </svg>
      </div>

      {/* Text */}
      <h2
        style={{
          fontSize: "18px", fontWeight: 600, color: "#0f0f0f",
          textAlign: "center", margin: "0 0 10px",
        }}
      >
        Create a channel to get started
      </h2>
      <p
        style={{
          fontSize: "14px", color: "#606060", textAlign: "center",
          lineHeight: "22px", margin: "0 0 28px",
        }}
      >
        You need a YouTube channel to upload videos, comment, and more. Your Google Account can have multiple channels.
      </p>

      {/* Buttons */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <button
          onClick={onCreateChannel}
          style={{
            background: "#065fd4", color: "#fff",
            border: "none", borderRadius: "20px",
            height: "40px", width: "100%",
            fontFamily: "'Roboto','Arial',sans-serif",
            fontWeight: 500, fontSize: "14px",
            cursor: "pointer", transition: "background 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#0356c3")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#065fd4")}
        >
          Create channel
        </button>
        <button
          onClick={onClose}
          style={{
            background: "none", color: "#065fd4",
            border: "1px solid #065fd4", borderRadius: "20px",
            height: "40px", width: "100%",
            fontFamily: "'Roboto','Arial',sans-serif",
            fontWeight: 500, fontSize: "14px",
            cursor: "pointer", transition: "background 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#e8f0fe")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
        >
          Not now
        </button>
      </div>
    </div>
  </div>
);

/*  Header  */
const Header = ({ onToggleSidebar }) => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery,    setSearchQuery]    = useState("");
  const [showDropdown,   setShowDropdown]   = useState(false);
  const [showNoChannel,  setShowNoChannel]  = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    setShowMobileSearch(false);
  };

  const handleSignOut = () => {
    logout();
    setShowDropdown(false);
    navigate("/");
  };

  // Called when user clicks the Create button
  const handleCreateClick = (e) => {
    if (!auth.user.channel) {
      e.preventDefault();          // stop Link navigation
      setShowNoChannel(true);      // show modal instead
    }
    // if channel exists, Link navigates normally
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-14 bg-white flex items-center px-2 sm:px-4 gap-1 sm:gap-2 border-b border-gray-200 z-50 text-black">

        {showMobileSearch && (
          <div className="absolute inset-0 flex items-center gap-2 bg-white px-2 sm:hidden">
            <button
              type="button"
              onClick={() => setShowMobileSearch(false)}
              className="p-2 rounded-full hover:bg-gray-100 cursor-pointer text-gray-700"
              aria-label="Close search"
            >
              <FiX size={20} />
            </button>
            <form onSubmit={handleSearch} className="flex flex-1 items-center min-w-0">
              <div className="flex flex-1 items-center border border-gray-300 rounded-l-full px-3 py-[7px] bg-white focus-within:border-blue-400 min-w-0">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 min-w-0 bg-transparent text-sm text-black focus:outline-none placeholder-gray-500"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="flex items-center justify-center px-4 h-[38px] bg-gray-100 border border-l-0 border-gray-300 rounded-r-full hover:bg-gray-200 cursor-pointer text-gray-600"
                aria-label="Search"
              >
                <FiSearch size={18} />
              </button>
            </form>
          </div>
        )}

        {/* LEFT */}
        <div className={`flex items-center gap-2 sm:gap-3 flex-shrink-0 ${showMobileSearch ? "sm:flex hidden" : ""}`}>
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-full hover:bg-gray-100 cursor-pointer text-gray-700"
            aria-label="Toggle sidebar"
          >
            <FiMenu size={20} />
          </button>

          <Link to="/" className="flex items-center" aria-label="YouTube Home">
            <YoutubeSVGLogo />
            <sup className="hidden sm:block text-[10px] font-semibold text-gray-600 -mt-3 ml-0.5">IN</sup>
          </Link>
        </div>

        {/* CENTER — Search */}
        <div className={`hidden sm:flex flex-1 items-center justify-center px-2 sm:px-4 lg:px-8 min-w-0 ${showMobileSearch ? "sm:flex hidden" : ""}`}>
          <form onSubmit={handleSearch} className="flex flex-1 max-w-[600px] items-center">
            <div className="flex flex-1 items-center border border-gray-300 rounded-l-full px-4 py-[7px] bg-white focus-within:border-blue-400">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 min-w-0 bg-transparent text-sm text-black focus:outline-none placeholder-gray-500"
              />
            </div>
            <button
              type="submit"
              className="flex items-center justify-center px-5 h-[38px] bg-gray-100 border border-l-0 border-gray-300 rounded-r-full hover:bg-gray-200 cursor-pointer text-gray-600"
              aria-label="Search"
            >
              <FiSearch size={19} />
            </button>
            <button
              type="button"
              className="hidden md:flex items-center justify-center ml-3 w-10 h-10 bg-gray-100 rounded-full hover:bg-gray-200 cursor-pointer text-gray-700 flex-shrink-0"
              aria-label="Search with your voice"
            >
              <FiMic size={18} />
            </button>
          </form>
        </div>

        {/* RIGHT */}
        <div className={`relative flex items-center gap-0.5 sm:gap-1 flex-shrink-0 ml-auto ${showMobileSearch ? "sm:flex hidden" : ""}`}>
          {auth ? (
            <>
              <button
                type="button"
                onClick={() => setShowMobileSearch(true)}
                className="sm:hidden flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100 cursor-pointer text-gray-700"
                aria-label="Open search"
              >
                <FiSearch size={18} />
              </button>

              {/* Create button */}
              <Link
                to={auth.user.channel ? `/channel/${auth.user.channel}/upload` : "#"}
                onClick={handleCreateClick}
                className="hidden md:flex items-center gap-1.5 px-4 py-[7px] rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium whitespace-nowrap"
              >
                <HiOutlinePlus size={18} strokeWidth={2.5} />
                <span>Create</span>
              </Link>

              <Link
                to={auth.user.channel ? `/channel/${auth.user.channel}/upload` : "#"}
                onClick={handleCreateClick}
                className="hidden sm:flex md:hidden items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800"
                aria-label="Create"
              >
                <HiOutlinePlus size={18} strokeWidth={2.5} />
              </Link>

              {/* Bell */}
              <button
                type="button"
                className="relative hidden sm:flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 cursor-pointer text-gray-700"
                aria-label="Notifications"
              >
                <AiOutlineBell size={24} />
                <span className="absolute top-[5px] right-[4px] bg-red-500 text-white text-[9px] font-bold rounded-full min-w-[16px] h-[16px] flex items-center justify-center px-0.5 leading-none">
                  9+
                </span>
              </button>

              {/* Avatar */}
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden hover:ring-2 hover:ring-gray-300 cursor-pointer flex-shrink-0"
                aria-label="Account menu"
              >
                <img
                  src={auth.user.avatar || `https://ui-avatars.com/api/?name=${auth.user.name}`}
                  alt={auth.user.name}
                  className="w-full h-full object-cover rounded-full"
                />
              </button>

              {/* Dropdown */}
              {showDropdown && (
                <div className="absolute right-0 top-11 w-44 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-50">
                  <Link
                    to={auth.user.channel ? `/channel/${auth.user.channel}` : "/channel/create"}
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 text-gray-800"
                  >
                    <MdVideoLibrary size={16} /> My Channel
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 w-full text-left text-gray-800 cursor-pointer"
                  >
                    <FiLogOut size={15} /> Sign Out
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setShowMobileSearch(true)}
                className="sm:hidden flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100 cursor-pointer text-gray-700"
                aria-label="Open search"
              >
                <FiSearch size={18} />
              </button>
              <Link
                to="/login"
                className="flex items-center justify-center gap-1 px-2 sm:px-4 py-1.5 border border-blue-500 text-blue-500 rounded-full text-sm hover:bg-blue-50 whitespace-nowrap"
              >
                <FiUser />
                <span className="hidden sm:block">Sign in</span>
              </Link>
            </>
          )}
        </div>
      </header>

      {/* No-channel modal */}
      {showNoChannel && (
        <NoChannelModal
          onClose={() => setShowNoChannel(false)}
          onCreateChannel={() => {
            setShowNoChannel(false);
            navigate("/channel/create");
          }}
        />
      )}
    </>
  );
};

export default Header;
