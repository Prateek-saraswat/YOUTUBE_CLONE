import { useState, useEffect, Suspense, lazy } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { Route, Routes, useLocation } from "react-router-dom";
import ErrorPage from "./pages/ErrorPage";

// Lazy imports
const Register = lazy(() => import("./pages/Register"));
const Login = lazy(() => import("./pages/Login"));
const Home = lazy(() => import("./pages/Home"));
const VideoPlayer = lazy(() => import("./pages/VideoPlayer"));
const ChannelPage = lazy(() => import("./pages/ChannelPage"));
const CreateEditVideo = lazy(() => import("./pages/CreateEditVideo"));

function App() {
  // Get current route location
  const location = useLocation();
   // Sidebar state (open/close)
  // Default: open on large screens
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  // Check if the current page is login or register page
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  useEffect(() => {
     // Handle responsive sidebar behavior on window resize
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
   // Add resize event listener
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
     // Main application container
    <div className="flex flex-col min-h-screen bg-white text-white">
      {/* Hide Header on login/register pages */}
      {!isAuthPage && <Header onToggleSidebar={toggleSidebar} />}

      {isAuthPage ? (
        <main className="flex-1 min-w-0">
           {/* Suspense shows loading fallback while lazy components load */}
          <Suspense fallback={<div className="text-center mt-10 text-black">Loading...</div>}>
            <Routes>
                {/* Application Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/video/:id" element={<VideoPlayer />} />
              <Route path="/channel/:id" element={<ChannelPage />} />
              <Route path="/channel/:channelId/upload" element={<CreateEditVideo />} />
              <Route path="/channel/:channelId/edit/:videoId" element={<CreateEditVideo />} />
              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </Suspense>
        </main>
      ) : (
        <div className="flex pt-14">
          <Sidebar isOpen={sidebarOpen} />

          <main
            className={`flex-1 px-3 py-4 sm:px-4 sm:py-5 lg:px-6 transition-all duration-300 min-w-0
             ${sidebarOpen ? "lg:ml-60" : "lg:ml-16"}`}
          >
            <Suspense fallback={<div className="text-center mt-10 text-black">Loading...</div>}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/video/:id" element={<VideoPlayer />} />
                <Route path="/channel/:id" element={<ChannelPage />} />
                <Route path="/channel/:channelId/upload" element={<CreateEditVideo />} />
                <Route path="/channel/:channelId/edit/:videoId" element={<CreateEditVideo />} />
                <Route path="*" element={<ErrorPage />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      )}
    </div>
  );
}

export default App;
