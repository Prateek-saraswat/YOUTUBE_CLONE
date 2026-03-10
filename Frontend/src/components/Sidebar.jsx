// src/components/Sidebar.jsx

// Import navigation utilities from React Router
import { Link, useLocation } from "react-router-dom";

// Import icons used in sidebar menu
import { AiFillHome } from "react-icons/ai";
import {
  MdExplore,
  MdSubscriptions,
  MdVideoLibrary,
  MdHistory,
  MdWatchLater,
  MdThumbUp,
  MdPlaylistPlay,
  MdSettings,
  MdDownload,
} from "react-icons/md";
import { SiYoutubeshorts } from "react-icons/si";


// Sidebar menu configuration
// Each object represents one menu item
const sidebarItems = [
  { icon: <AiFillHome />, label: "Home", path: "/" },
  { icon: <MdExplore />, label: "Explore" },
  { icon: <SiYoutubeshorts />, label: "Shorts" },
  { icon: <MdSubscriptions />, label: "Subscriptions" },

  // Divider line between sections
  { divider: true },

  { icon: <MdVideoLibrary />, label: "Library" },
  { icon: <MdHistory />, label: "History" },
  { icon: <MdWatchLater />, label: "Watch Later" },
  { icon: <MdThumbUp />, label: "Liked Videos" },
  { icon: <MdVideoLibrary />, label: "Your Videos" },
  { icon: <MdHistory />, label: "History" },
  { icon: <MdPlaylistPlay />, label: "Playlist" },

  { divider: true },

  { icon: <MdSettings />, label: "Settings" },
  { icon: <MdDownload />, label: "Downloads" },
];


// Sidebar component
// isOpen -> determines if sidebar is expanded or collapsed
const Sidebar = ({ isOpen }) => {

  // Get current URL path (used to highlight active menu)
  const location = useLocation();

  return (
    <>
      {/* Overlay (only for mobile) */}
      {/* When sidebar is open on mobile, a background overlay appears */}
      {isOpen && <div className="fixed inset-0 bg-white lg:hidden z-40" />}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-14 left-0 bottom-0
        bg-white text-black overflow-y-auto 
        overflow-x-hidden transition-all duration-300 z-50
        ${
          isOpen
            ? "w-60 translate-x-0" // full sidebar
            : "w-16 -translate-x-full lg:translate-x-0" 
            // hidden on mobile, mini sidebar on desktop
        }`}
      >

        {/* Loop through sidebar items */}
        {sidebarItems.map((item, index) => {

          // If item is a divider, render a horizontal line
          if (item.divider) {
            return isOpen ? (
              <div key={index} className="border-t border-gray-700 my-3 mx-4" />
            ) : null;
          }

          // Check if the current route matches this menu item
          const isActive =
            location.pathname === item.path && !location.search;

          return (
            <Link
              key={index}
              to={item.path}

              // Dynamic styling
              className={`flex flex-col items-center gap-1 px-2 py-3 text-sm hover:bg-gray-200 transition
                ${isOpen ? "flex-row gap-4 px-6 py-2" : ""}
                ${isActive ? "bg-gray-200 font-medium" : ""}`}
            >
              {/* Sidebar Icon */}
              <span className="text-xl">{item.icon}</span>

              {/* Sidebar Label */}
              {isOpen ? (
                // Full sidebar (icon + label)
                <span>{item.label}</span>
              ) : (
                // Mini sidebar (small label under icon)
                <span className="text-[10px] text-gray-400 text-center mt-1">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </aside>
    </>
  );
};

// Export sidebar component
export default Sidebar;