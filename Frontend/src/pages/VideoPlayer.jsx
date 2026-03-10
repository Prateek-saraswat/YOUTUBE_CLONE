// src/pages/VideoPlayer.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api.js";
import CommentSection from "../components/CommentSection.jsx";
import { useAuth } from "../context/authContext.jsx";
import {
  AiOutlineLike, AiFillLike,
  AiOutlineDislike, AiFillDislike,
} from "react-icons/ai";
import { FiShare2, FiScissors } from "react-icons/fi";
import { MdDownload, MdOutlinePlaylistAdd } from "react-icons/md";
import { HiDotsHorizontal } from "react-icons/hi";

// ── Helpers ────────────────────────────────────────────────────────────────

const formatViews = (v) => {
  if (!v) return "0";
  if (v >= 1_000_000) return (v / 1_000_000).toFixed(1).replace(".0", "") + "M";
  if (v >= 1_000)     return (v / 1_000).toFixed(1).replace(".0", "") + "K";
  return v.toString();
};

const formatFullViews = (v) =>
  v ? Number(v).toLocaleString() : "0";

const formatTimeAgo = (dateStr) => {
  const diffMs = Date.now() - new Date(dateStr);
  const days   = Math.floor(diffMs / 86_400_000);
  if (days < 1)   return "Today";
  if (days < 7)   return `${days} day${days > 1 ? "s" : ""} ago`;
  if (days < 30)  { const w = Math.floor(days/7);  return `${w} week${w>1?"s":""} ago`;  }
  if (days < 365) { const m = Math.floor(days/30); return `${m} month${m>1?"s":""} ago`; }
  const y = Math.floor(days/365); return `${y} year${y>1?"s":""} ago`;
};

const formatSubs = (n) => {
  if (!n) return "0";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2).replace(/\.?0+$/, "") + "M";
  if (n >= 1_000)     return (n / 1_000).toFixed(1).replace(".0", "") + "K";
  return n.toString();
};

// ── Sub-components ─────────────────────────────────────────────────────────

/** Joined Like / Dislike pill — exact YouTube design */
const LikeDislikePill = ({
  likes, dislikes, userLiked, userDisliked, loading, onLike, onDislike,
}) => (
  <div
    className="flex items-center rounded-full overflow-hidden select-none"
    style={{ background: "#f2f2f2", height: "36px" }}
  >
    {/* Like */}
    <button
      onClick={onLike}
      disabled={loading}
      className="flex items-center gap-[6px] px-4 h-full font-medium text-sm hover:bg-[#e5e5e5] transition-colors disabled:opacity-50"
      style={{
        fontFamily: "'Roboto','Arial',sans-serif",
        fontWeight: 500,
        fontSize: "14px",
        color: "#0f0f0f",
        background: userLiked ? "#e5e5e5" : "transparent",
        border: "none",
        cursor: "pointer",
      }}
    >
      {userLiked
        ? <AiFillLike size={18} />
        : <AiOutlineLike size={18} />}
      <span>{formatViews(likes)}</span>
    </button>

    {/* Divider */}
    <div style={{ width: "1px", height: "60%", background: "#ccc" }} />

    {/* Dislike */}
    <button
      onClick={onDislike}
      disabled={loading}
      className="flex items-center gap-[6px] px-4 h-full font-medium text-sm hover:bg-[#e5e5e5] transition-colors disabled:opacity-50"
      style={{
        fontFamily: "'Roboto','Arial',sans-serif",
        fontWeight: 500,
        fontSize: "14px",
        color: "#0f0f0f",
        background: userDisliked ? "#e5e5e5" : "transparent",
        border: "none",
        cursor: "pointer",
      }}
    >
      {userDisliked
        ? <AiFillDislike size={18} />
        : <AiOutlineDislike size={18} />}
    </button>
  </div>
);

/** Gray action pill — Share / Download / Clip / Save */
const ActionPill = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-[6px] px-4 rounded-full h-9 font-medium text-sm transition-colors"
    style={{
      background: "#f2f2f2",
      border: "none",
      cursor: "pointer",
      fontFamily: "'Roboto','Arial',sans-serif",
      fontWeight: 500,
      fontSize: "14px",
      color: "#0f0f0f",
      height: "36px",
      whiteSpace: "nowrap",
    }}
    onMouseEnter={(e) => (e.currentTarget.style.background = "#e5e5e5")}
    onMouseLeave={(e) => (e.currentTarget.style.background = "#f2f2f2")}
  >
    {icon}
    <span className="hidden sm:inline">{label}</span>
  </button>
);

/** Sidebar suggestion card */
// const SuggestionCard = ({ video, onClick }) => (
//   <div
//     onClick={onClick}
//     className="flex gap-2 cursor-pointer rounded-xl transition-colors"
//     style={{ padding: "4px", fontFamily: "'Roboto','Arial',sans-serif" }}
//     onMouseEnter={(e) => (e.currentTarget.style.background = "#f2f2f2")}
//     onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
//   >
//     {/* Thumbnail */}
//     <div
//       className="flex-none rounded-xl overflow-hidden bg-[#e5e5e5]"
//       style={{ width: "168px", aspectRatio: "16/9" }}
//     >
//       <img
//         src={video.thumbnailUrl}
//         alt={video.title}
//         className="w-full h-full object-cover"
//         onError={(e) => {
//           e.target.src = "https://placehold.co/640x360/272727/aaa?text=No+Thumbnail";
//         }}
//       />
//     </div>

//     {/* Meta */}
//     <div className="flex-1 min-w-0 pt-0.5 pr-1">
//       <p
//         className="line-clamp-2 mb-1"
//         style={{ fontWeight: 500, fontSize: "14px", lineHeight: "20px", color: "#0f0f0f" }}
//       >
//         {video.title}
//       </p>
//       <p style={{ fontSize: "12px", color: "#606060", lineHeight: "18px" }} className="truncate">
//         {video.channel?.channelName || "Unknown"}
//       </p>
//       <p style={{ fontSize: "12px", color: "#606060", lineHeight: "18px" }}>
//         {formatViews(video.views)} views • {formatTimeAgo(video.createdAt)}
//       </p>
//     </div>
//   </div>
// );
const SuggestionCard = ({ video, onClick }) => {
  const [hovered, setHovered] = useState(false);

  const channelName = video.channel?.channelName || "Unknown";
  // const duration    = formatDuration(video.duration);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`flex gap-2 cursor-pointer rounded-xl p-2 transition-colors duration-150 ${
        hovered ? "bg-[#f2f2f2]" : "bg-transparent"
      }`}
      style={{ fontFamily: "'Roboto','Arial',sans-serif" }}
    >
      {/* Thumbnail */}
      <div className="relative flex-none w-[168px] aspect-video rounded-xl overflow-hidden bg-[#e5e5e5]">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          loading="lazy"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "https://placehold.co/640x360/272727/aaa?text=No+Thumbnail";
          }}
        />
        
      </div>

      {/* Meta */}
      <div className="flex-1 min-w-0 flex flex-col gap-[2px] pt-0.5">
        {/* Title — 2 lines max */}
        <p className="text-[14px] font-medium text-[#0f0f0f] leading-5 line-clamp-2">
          {video.title}
        </p>

        {/* Channel name */}
        <p className="text-[12px] text-[#606060] leading-[18px] truncate mt-0.5">
          {channelName}
        </p>

        {/* Views • time */}
        <p className="text-[12px] text-[#606060] leading-[18px]">
          {formatViews(video.views)} views
          <span className="mx-1">•</span>
          {formatTimeAgo(video.createdAt)}
        </p>
      </div>
    </div>
  );
};


// ── Main page ──────────────────────────────────────────────────────────────

const VideoPlayer = () => {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const { auth }  = useAuth();

  const [video,        setVideo]        = useState(null);
  const [suggestions,  setSuggestions]  = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [likes,        setLikes]        = useState(0);
  const [dislikes,     setDislikes]     = useState(0);
  const [userLiked,    setUserLiked]    = useState(false);
  const [userDisliked, setUserDisliked] = useState(false);
  const [likeLoading,  setLikeLoading]  = useState(false);
  const [expanded,     setExpanded]     = useState(false);
  const [subscribed,   setSubscribed]   = useState(false);

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
        const arr = Array.isArray(data) ? data : [];
        setSuggestions(arr.filter((v) => v._id !== id).slice(0, 15));
      } catch (err) {
        console.error("Failed to fetch suggestions:", err);
      }
    };

    if (id) { fetchVideo(); fetchSuggestions(); }
  }, [id, auth]);

  const handleLike = async () => {
    if (!auth) return navigate("/login");
    if (likeLoading) return;
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

  // ── Loading ──
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!video) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <p style={{ fontSize: "16px", color: "#0f0f0f", fontFamily: "'Roboto','Arial',sans-serif" }}>
          Video not found
        </p>
      </div>
    );
  }

  const description   = video.description || "No description available.";
  const isYouTube     = video.videoUrl?.includes("youtube.com") || video.videoUrl?.includes("youtu.be");
  const descPreview   = description.slice(0, 150);
  const hasMoreDesc   = description.length > 150;

  return (
    <div
      className="mx-auto px-3 sm:px-4 py-4"
      style={{
        maxWidth: "1600px",
        fontFamily: "'Roboto','Arial',sans-serif",
        display: "grid",
        gridTemplateColumns: "minmax(0,1fr)",
        gap: "24px",
      }}
    >
      {/* ── TWO-COLUMN GRID on xl ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr)",
          gap: "24px",
        }}
        className="xl:!grid-cols-[minmax(0,1fr)_402px]"
      >

        {/* ════════════════════════════════════════
            LEFT COLUMN
        ════════════════════════════════════════ */}
        <div className="min-w-0 flex flex-col gap-4">

          {/* Video player */}
          <div
            className="w-full overflow-hidden"
            style={{ aspectRatio: "16/9", background: "#000", borderRadius: "12px" }}
          >
            {isYouTube ? (
              <iframe
                src={video.videoUrl}
                title={video.title}
                allowFullScreen
                className="w-full h-full"
                style={{ border: "none" }}
              />
            ) : (
              <video
                src={video.videoUrl}
                controls
                autoPlay
                className="w-full h-full"
                style={{ objectFit: "contain", background: "#000" }}
              >
                Your browser does not support the video tag.
              </video>
            )}
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: "20px",
              fontWeight: 600,
              lineHeight: "28px",
              color: "#0f0f0f",
              margin: 0,
            }}
          >
            {video.title}
          </h1>

          {/* Channel row + actions */}
          <div className="flex flex-wrap items-center justify-between gap-3">

            {/* Left: avatar + name + subs + subscribe */}
            <div className="flex items-center gap-3 flex-wrap">
              <img
                src={
                  video.uploader?.avatar ||
                  `https://ui-avatars.com/api/?name=${video.channel?.channelName || "C"}&background=606060&color=fff&size=64`
                }
                alt="channel"
                onClick={() => navigate(`/channel/${video.channel?._id}`)}
                style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover", cursor: "pointer", flexShrink: 0 }}
              />

              <div
                onClick={() => navigate(`/channel/${video.channel?._id}`)}
                className="cursor-pointer"
              >
                <p style={{ fontWeight: 600, fontSize: "15px", color: "#0f0f0f", lineHeight: "22px" }}>
                  {video.channel?.channelName || "Unknown Channel"}
                </p>
                <p style={{ fontSize: "12px", color: "#606060", lineHeight: "18px" }}>
                  {formatSubs(video.channel?.subscribers)} subscribers
                </p>
              </div>

              {/* Subscribe */}
              <button
                onClick={() => setSubscribed((p) => !p)}
                style={{
                  background: subscribed ? "#f2f2f2" : "#0f0f0f",
                  color: subscribed ? "#0f0f0f" : "#fff",
                  border: "none",
                  borderRadius: "20px",
                  padding: "0 16px",
                  height: "36px",
                  fontFamily: "'Roboto','Arial',sans-serif",
                  fontWeight: 500,
                  fontSize: "14px",
                  cursor: "pointer",
                  transition: "background 0.15s",
                  whiteSpace: "nowrap",
                }}
              >
                {subscribed ? "Subscribed" : "Subscribe"}
              </button>
            </div>

            {/* Right: Like / Dislike / Share / Download / More */}
            <div className="flex items-center gap-2 flex-wrap">
              <LikeDislikePill
                likes={likes}
                dislikes={dislikes}
                userLiked={userLiked}
                userDisliked={userDisliked}
                loading={likeLoading}
                onLike={handleLike}
                onDislike={handleDislike}
              />

              <ActionPill icon={<FiShare2 size={16} />} label="Share" />
              <ActionPill icon={<MdDownload size={18} />} label="Download" />
              <ActionPill icon={<MdOutlinePlaylistAdd size={18} />} label="Save" />

              {/* More (⋯) */}
              <button
                style={{
                  width: "36px", height: "36px",
                  background: "#f2f2f2",
                  border: "none",
                  borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer",
                  color: "#0f0f0f",
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#e5e5e5")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#f2f2f2")}
              >
                <HiDotsHorizontal size={18} />
              </button>
            </div>
          </div>

          {/* ── Description box ── */}
          <div
            style={{
              background: "#f2f2f2",
              borderRadius: "12px",
              padding: "12px 16px",
              cursor: hasMoreDesc && !expanded ? "pointer" : "default",
            }}
            onClick={() => { if (!expanded && hasMoreDesc) setExpanded(true); }}
          >
            {/* Views + date + time ago */}
            <div className="flex flex-wrap gap-x-2 mb-2">
              <span style={{ fontWeight: 500, fontSize: "14px", color: "#0f0f0f" }}>
                {formatFullViews(video.views)} views
              </span>
              <span style={{ fontWeight: 500, fontSize: "14px", color: "#0f0f0f" }}>
                {new Date(video.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
              </span>
              <span style={{ fontSize: "14px", color: "#0f0f0f" }}>
                {formatTimeAgo(video.createdAt)}
              </span>
            </div>

            {/* Description text */}
            <p
              style={{
                fontSize: "14px",
                lineHeight: "20px",
                color: "#0f0f0f",
                whiteSpace: "pre-wrap",
                margin: 0,
              }}
            >
              {expanded ? description : descPreview}
              {!expanded && hasMoreDesc && "..."}
            </p>

            {/* Toggle */}
            {hasMoreDesc && (
              <button
                onClick={(e) => { e.stopPropagation(); setExpanded((p) => !p); }}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  marginTop: "8px",
                  fontFamily: "'Roboto','Arial',sans-serif",
                  fontWeight: 500,
                  fontSize: "14px",
                  color: "#0f0f0f",
                  cursor: "pointer",
                  display: "block",
                }}
              >
                {expanded ? "Show less" : "Show more"}
              </button>
            )}
          </div>

          {/* ── Comments ── */}
          <CommentSection videoId={id} />
        </div>

        {/* ════════════════════════════════════════
            RIGHT COLUMN — Suggestions
        ════════════════════════════════════════ */}
        {/* <div className="flex flex-col gap-2">
          {suggestions.map((s) => (
            <SuggestionCard
              key={s._id}
              video={s}
              onClick={() => navigate(`/video/${s._id}`)}
            />
          ))}
        </div> */}
        <div className="flex flex-col">
  {/* Section header */}
  <div className="flex items-center justify-between mb-3 px-1">
    <h2 className="text-[16px] font-semibold text-[#0f0f0f]"
        style={{ fontFamily: "'Roboto','Arial',sans-serif" }}>
      Up next
    </h2>
    {/* Autoplay toggle — cosmetic */}
    <div className="flex items-center gap-2">
      <span className="text-[13px] text-[#606060]"
            style={{ fontFamily: "'Roboto','Arial',sans-serif" }}>
        Autoplay
      </span>
      <div className="w-9 h-5 bg-[#065fd4] rounded-full flex items-center px-[3px] cursor-pointer">
        <div className="w-3.5 h-3.5 bg-white rounded-full ml-auto" />
      </div>
    </div>
  </div>

  {/* Cards */}
  <div className="flex flex-col gap-1">
    {suggestions.length === 0 ? (
      <p className="text-[14px] text-[#606060] text-center py-8"
         style={{ fontFamily: "'Roboto','Arial',sans-serif" }}>
        No suggestions available
      </p>
    ) : (
      suggestions.map((s) => (
        <SuggestionCard
          key={s._id}
          video={s}
          onClick={() => navigate(`/video/${s._id}`)}
        />
      ))
    )}
  </div>
</div>

      </div>
    </div>
  );
};

export default VideoPlayer;