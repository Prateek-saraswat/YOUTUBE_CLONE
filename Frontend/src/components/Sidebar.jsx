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

// ── Sidebar sections matching YouTube's guide structure ──
const sidebarSections = [
  {
    // Section 1: Primary nav (no title)
    items: [
      { icon: <AiFillHome size={22} />, label: "Home", path: "/" },
      { icon: <SiYoutubeshorts size={22} />, label: "Shorts", path: "#" },
      { icon: <MdSubscriptions size={22} />, label: "Subscriptions", path: "#" },
      { icon: <MdVideoLibrary size={22} />, label: "Library", path: "#" },
    ],
  },
  {
    // Section 2: "You" section
    title: "You",
    items: [
      { icon: <MdHistory size={22} />, label: "History", path: "#" },
      { icon: <MdPlaylistPlay size={22} />, label: "Playlists", path: "#" },
      { icon: <MdWatchLater size={22} />, label: "Watch Later", path: "#" },
      { icon: <MdThumbUp size={22} />, label: "Liked Videos", path: "#" },
      { icon: <MdVideoLibrary size={22} />, label: "Your Videos", path: "#" },
      { icon: <MdDownload size={22} />, label: "Downloads", path: "#" },
    ],
  },
  {
    // Section 3: "Explore" section
    title: "Explore",
    items: [
      { icon: <MdExplore size={22} />, label: "Explore", path: "#" },
    ],
  },
  {
    // Section 4: Settings / misc (no title)
    items: [
      { icon: <MdSettings size={22} />, label: "Settings", path: "#" },
    ],
  },
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
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 lg:hidden z-40" />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-14 left-0 bottom-0
          bg-white text-[#0f0f0f] overflow-y-auto overflow-x-hidden
          transition-all duration-300 z-50 no-scrollbar
          ${isOpen
            ? "w-60 translate-x-0"         // full sidebar
            : "w-16 -translate-x-full lg:translate-x-0"  
            // hidden on mobile, mini sidebar on desktop
          }`}
      >
        {/* ── Render each section ── */}
        {sidebarSections.map((section, sIdx) => (
          <div key={sIdx}>

            {/* Section divider (between sections, not before first) */}
            {sIdx > 0 && isOpen && (
              <div className="border-t border-gray-200 my-3 mx-0" />
            )}

            {/* Section title (only shown in expanded mode) */}
            {section.title && isOpen && (
              <p className="px-3 pt-3 pb-1 text-sm font-semibold text-[#0f0f0f]">
                {section.title}
              </p>
            )}

            {/* Section items */}
            {section.items.map((item, iIdx) => {
              const isActive =
                item.path !== "#" &&
                location.pathname === item.path &&
                !location.search;

              return isOpen ? (
                /* ── EXPANDED MODE: icon + label in a row ── */
                <Link
                  key={iIdx}
                  to={item.path || "#"}
                  className={`flex items-center gap-6 px-3 h-10 mx-1 rounded-xl
                    text-sm font-medium cursor-pointer transition-colors duration-100
                    hover:bg-[#f2f2f2]
                    ${isActive ? "bg-[#f2f2f2] font-semibold" : ""}`}
                >
                  {/* Sidebar Icon */}
                  <span className="text-[#0f0f0f] flex-shrink-0">
                    {item.icon}
                  </span>
                  {/* Sidebar Label */}
                  <span className="truncate">{item.label}</span>
                </Link>
              ) : (
                /* ── MINI MODE (desktop only): icon stacked above tiny label ── */
                <Link
                  key={iIdx}
                  to={item.path || "#"}
                  className={`flex flex-col items-center justify-center gap-1
                    py-3 w-full rounded-xl cursor-pointer transition-colors duration-100
                    hover:bg-[#f2f2f2]
                    ${isActive ? "bg-[#f2f2f2] font-semibold" : ""}`}
                >
                  {/* Sidebar Icon */}
                  <span className="text-[#0f0f0f]">{item.icon}</span>
                  {/* Mini Label */}
                  <span className="text-[10px] text-[#0f0f0f] text-center leading-tight px-1 truncate w-full text-center">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        ))}
      </aside>
    </>
  );
};

// Export sidebar component
export default Sidebar;