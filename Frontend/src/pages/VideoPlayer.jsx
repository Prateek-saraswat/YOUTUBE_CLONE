// src/pages/VideoPlayer.jsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api.js";
import CommentSection from "../components/CommentSection.jsx";
import {
  AiOutlineLike,
  AiFillLike,
  AiOutlineDislike,
  AiFillDislike,
} from "react-icons/ai";
import { useAuth } from "../context/authContext.jsx";
import { FiShare2 } from "react-icons/fi";
import { MdDownload } from "react-icons/md";

const formatViews = (views) => {
  if (views >= 1000000) return (views / 1000000).toFixed(1) + "M";
  if (views >= 1000) return (views / 1000).toFixed(1) + "K";
  return views?.toString() || "0";
};

const VideoPlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth } = useAuth();

  const [video, setVideo] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userLiked, setUserLiked] = useState(false);
  const [userDisliked, setUserDisliked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true);
        const { data } = await API.get(`/videos/${id}`);
        setVideo(data);
        setLikes(data.likes?.length || 0);
        setDislikes(data.dislikes?.length || 0);

        if (auth) {
          setUserLiked(data.likes?.includes(auth.user.id));
          setUserDisliked(data.dislikes?.includes(auth.user.id));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchSuggestions = async () => {
      try {
        const { data } = await API.get("/videos");

        // console.log("Suggestions response:", data);

        const videosArray = Array.isArray(data) ? data : [];

        const filtered = videosArray.filter((v) => v._id !== id).slice(0, 8);

        setSuggestions(filtered);
      } catch (err) {
        console.error("Failed to fetch suggestions:", err);
      }
    };

    if (id) {
      fetchVideo();
      fetchSuggestions();
    }
  }, [id, auth]);

  const handleLike = async () => {
    if (!auth) return navigate("/login");
    if (likeLoading) return; // prevent multiple clicks

    try {
      setLikeLoading(true);
      const { data } = await API.put(`/videos/${id}/like`);
      setLikes(data.likes);
      setDislikes(data.dislikes);
      setUserLiked(data.likesList?.includes(auth.user.id));
      setUserDisliked(data.dislikesList?.includes(auth.user.id));
    } catch (err) {
      console.error("Like failed", err);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleDislike = async () => {
    if (!auth) return navigate("/login");
    if (likeLoading) return;
    try {
      setLikeLoading(true);
      const { data } = await API.put(`/videos/${id}/dislike`);
      setLikes(data.likes);
      setDislikes(data.dislikes);
      setUserLiked(data.likesList?.includes(auth.user.id));
      setUserDisliked(data.dislikesList?.includes(auth.user.id));
    } catch (err) {
      console.error("Dislike failed", err);
    } finally {
      setLikeLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="w-10 h-10 border-4 border-gray-700 border-t-red-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="text-center py-20 text-gray-400">Video not found</div>
    );
  }
  const description = video.description || "No description available.";

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6 px-4 py-4">
      {/* Left Section */}
      <div>
        {/* Video */}
        <div className="aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
          {video.videoUrl?.includes("youtube.com") ||
          video.videoUrl?.includes("youtu.be") ? (
            <iframe
              src={video.videoUrl}
              title={video.title}
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          ) : (
            <video
              src={video.videoUrl}
              title={video.title}
              controls
              autoPlay
              className="w-full h-full object-contain bg-black"
            >
              Your browser does not support the video tag.
            </video>
          )}
        </div>

        {/* Title */}
        <h1 className="text-xl font-semibold text-black mt-4">{video.title}</h1>

        {/* Channel + Like */}
        <div className="flex justify-between items-center mt-4 border-b border-gray-700 pb-4 flex-wrap gap-3">
          {/* Channel */}
          <div className="flex items-center justify-between mt-4">
            {/* Left Side - Channel Info */}
            <div className="flex items-center gap-3">
              <img
                src={
                  video.uploader?.avatar ||
                  `https://ui-avatars.com/api/?name=${video.channel?.channelName}`
                }
                className="w-10 h-10 rounded-full object-cover cursor-pointer"
                onClick={() => navigate(`/channel/${video.channel?._id}`)}
                alt="channel avatar"
              />

              <div>
                <div
                  className="text-black font-medium cursor-pointer"
                  onClick={() => navigate(`/channel/${video.channel?._id}`)}
                >
                  {video.channel?.channelName}
                </div>
                <div className="text-sm text-gray-700">
                  {video.channel?.subscribers || 0} subscribers
                </div>
              </div>
            </div>

            {/* Right Side - Dummy Subscribe Button */}
            <button
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 ml-4.5 
                                 rounded-full text-sm font-medium transition"
            >
              Subscribe
            </button>
          </div>

          {/* Like / Dislike */}
          <div className="flex gap-2">
            <button
              onClick={handleLike}
              disabled={likeLoading}
              className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm ${
                userLiked
                  ? "bg-white text-black"
                  : "bg-gray-800 text-white hover:bg-gray-700"
              } ${likeLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {userLiked ? <AiFillLike /> : <AiOutlineLike />}
              {likes}
            </button>

            <button
              onClick={handleDislike}
              disabled={likeLoading}
              className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm ${
                userDisliked
                  ? "bg-white text-black"
                  : "bg-gray-800 text-white hover:bg-gray-700"
              } ${likeLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {userDisliked ? <AiFillDislike /> : <AiOutlineDislike />}
              {dislikes}
            </button>

        <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-full">
          <FiShare2 /> 
        </button>

        <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-full">
          <MdDownload /> 
        </button>
          </div>
        </div>

        {/* Description */}

        <div className="mt-4 bg-white p-4 rounded-lg">
          <div className="text-sm font-medium text-black mb-2">
            {formatViews(video.views)} views •{" "}
            {new Date(video.createdAt).toLocaleDateString()}
          </div>
          <p className="text-sm text-gray-950 whitespace-pre-wrap bg-gray-200 p-2.5 rounded-2xl">
            {expanded ? description : description.slice(0, 120)}

            {description.length > 120 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="ml-2 text-blue-400 hover:underline"
              >
                {expanded ? "Show less" : "Show more"}
              </button>
            )}
          </p>
        </div>

        {/* Comments */}
        <CommentSection videoId={id} />
      </div>

      {/* Right Section - Suggestions */}
      <div className="flex flex-col gap-3">
        {suggestions.map((s) => (
          <div
            key={s._id}
            onClick={() => navigate(`/video/${s._id}`)}
            className="flex gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-md"
          >
            <div className="w-40 aspect-video bg-white text-black rounded-md overflow-hidden">
              <img
                src={s.thumbnailUrl}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="text-sm font-medium text-black line-clamp-2">
                {s.title}
              </div>
              <div className="text-xs text-gray-700">
                {s.channel?.channelName}
              </div>
              <div className="text-xs text-gray-700">
                {formatViews(s.views)} views
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoPlayer;
