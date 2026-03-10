import { useState, useEffect, Suspense, lazy } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { Route, Routes } from "react-router-dom";
import ErrorPage from "./pages/ErrorPage";

// Lazy imports
const Register = lazy(() => import("./pages/Register"));
const Login = lazy(() => import("./pages/Login"));
const Home = lazy(() => import("./pages/Home"));
const VideoPlayer = lazy(() => import("./pages/VideoPlayer"));
const ChannelPage = lazy(() => import("./pages/ChannelPage"));
const CreateEditVideo = lazy(() => import("./pages/CreateEditVideo"));

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-white">
      <Header onToggleSidebar={toggleSidebar} />

      <div className="flex pt-14">
        <Sidebar isOpen={sidebarOpen} />

        <main
          className={`flex-1 px-3 py-4 sm:px-4 sm:py-5 lg:px-6 transition-all duration-300 min-w-0
           ${sidebarOpen ? "lg:ml-60" : "lg:ml-16"}`}
        >
          <Suspense fallback={<div className="text-center mt-10">Loading...</div>}>
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
    </div>
  );
}

export default App;
