// src/components/VideoCard.jsx
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const formatViews = (views) => {
  if (!views) return "0";
  if (views >= 1_000_000) return (views / 1_000_000).toFixed(1).replace(".0", "") + "M";
  if (views >= 1_000)     return (views / 1_000).toFixed(1).replace(".0", "") + "K";
  return views.toString();
};

const formatTimeAgo = (dateStr) => {
  const diffMs = Date.now() - new Date(dateStr);
  const mins   = Math.floor(diffMs / 60_000);
  const hours  = Math.floor(diffMs / 3_600_000);
  const days   = Math.floor(diffMs / 86_400_000);
  if (mins  < 60)  return mins  <= 1 ? "Just now"    : `${mins} minutes ago`;
  if (hours < 24)  return hours === 1 ? "1 hour ago"  : `${hours} hours ago`;
  if (days  < 7)   return days  === 1 ? "1 day ago"   : `${days} days ago`;
  if (days  < 30)  { const w = Math.floor(days/7);  return w===1 ? "1 week ago"  : `${w} weeks ago`;  }
  if (days  < 365) { const m = Math.floor(days/30); return m===1 ? "1 month ago" : `${m} months ago`; }
  const y = Math.floor(days/365); return y===1 ? "1 year ago" : `${y} years ago`;
};

const formatDuration = (sec) => {
  if (!sec) return null;
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) return `${h}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
  return `${m}:${String(s).padStart(2,"0")}`;
};

const DotsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" fill="currentColor">
    <path d="M12 4a2 2 0 100 4 2 2 0 000-4Zm0 6a2 2 0 100 4 2 2 0 000-4Zm0 6a2 2 0 100 4 2 2 0 000-4Z"/>
  </svg>
);

const VerifiedIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="14" viewBox="0 0 24 24" width="14" fill="#606060">
    <path d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1Zm5.707 7.293a1 1 0 010 1.414L10 17.414l-3.707-3.707a1 1 0 111.414-1.414L10 14.586l6.293-6.293a1 1 0 011.414 0Z"/>
  </svg>
);

const VideoCard = ({ video, channelContext }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const channelName =
    video.channel?.channelName ||
    channelContext?.channelName ||
    "Unknown Channel";

  const channelId = video.channel?._id || channelContext?._id;

  const avatarSrc =
    video.uploader?.avatar        ||
    video.channel?.owner?.avatar  ||
    channelContext?.owner?.avatar ||
    channelContext?.avatar        ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(channelName[0] || "C")}&background=606060&color=fff&size=64`;

  const duration       = formatDuration(video.duration);
  const watchedPercent = video.watchedPercent ?? null;
  const isVerified     = video.channel?.verified || channelContext?.verified;

  const handleClick        = () => navigate(`/video/${video._id}`);
  const handleChannelClick = (e) => { e.stopPropagation(); if (channelId) navigate(`/channel/${channelId}`); };
  const handleMenuClick    = (e) => { e.stopPropagation(); setMenuOpen((p) => !p); };

  return (
    // w-full so it fills whatever grid column it's placed in
    <div
      className="flex flex-col w-full cursor-pointer group"
      style={{ fontFamily: "'Roboto','Arial',sans-serif" }}
      onClick={handleClick}
    >

      {/* ── THUMBNAIL — 16/9 aspect ratio, rounded-xl, scales with card width ── */}
      <div className="relative w-full aspect-video rounded-xl overflow-hidden flex-none bg-black/5">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
          onError={(e) => { e.target.src = "https://placehold.co/640x360/272727/aaa?text=No+Thumbnail"; }}
        />

        {/* Watch-progress bar */}
        {watchedPercent > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/30">
            <div className="h-full bg-red-600" style={{ width: `${watchedPercent}%` }} />
          </div>
        )}

        {/* Duration badge — exactly matching YT's badge-shape */}
        {duration && (
          <div
            className="absolute bottom-[6px] right-[6px] bg-black/85 text-white rounded select-none"
            style={{ fontSize: "12px", fontWeight: 500, lineHeight: "14px", padding: "2px 4px", letterSpacing: "0.02em" }}
          >
            {duration}
          </div>
        )}
      </div>

      {/* ── METADATA ROW — avatar | text | ⋮ ── */}
      <div className="flex flex-row items-start pt-2 gap-3 w-full relative">

        {/* Channel Avatar — 36×36, fixed, never shrinks */}
        <div
          className="flex-none w-9 h-9 rounded-full overflow-hidden cursor-pointer bg-black/5 mt-[2px]"
          onClick={handleChannelClick}
        >
          <img
            src={avatarSrc}
            alt={channelName}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=C&background=606060&color=fff&size=64"; }}
          />
        </div>

        {/* Text container — pr-6 keeps gap before ⋮ button */}
        <div className="flex flex-col gap-[2px] flex-1 min-w-0 pr-6">

          {/* Title — YT grid uses 14px/20px, weight 500, 2-line clamp */}
          <h3
            className="line-clamp-2 w-full"
            style={{
              fontWeight: 500,
              fontSize: "14px",
              lineHeight: "20px",
              color: "#0F0F0F",
              margin: 0,
              fontFamily: "'Roboto','Arial',sans-serif",
            }}
            title={video.title}
          >
            {video.title}
          </h3>

          {/* Channel name + verified badge */}
          <div
            className="flex items-center gap-[3px] mt-[2px] cursor-pointer hover:text-[#0f0f0f] transition-colors truncate"
            style={{ fontWeight: 400, fontSize: "13px", lineHeight: "18px", color: "#606060" }}
            onClick={handleChannelClick}
          >
            <span className="truncate">{channelName}</span>
            {isVerified && (
              <span className="flex-none ml-[2px]">
                <VerifiedIcon />
              </span>
            )}
          </div>

          {/* Views • Time ago */}
          <div
            className="flex items-center gap-1 flex-wrap"
            style={{ fontWeight: 400, fontSize: "13px", lineHeight: "18px", color: "#606060" }}
          >
            <span>{formatViews(video.views)} views</span>
            <span aria-hidden="true">•</span>
            <span>{formatTimeAgo(video.createdAt)}</span>
          </div>
        </div>

        {/* ⋮ Button — hidden until card hovered, top-right of metadata area */}
        <button
          onClick={handleMenuClick}
          aria-label="More actions"
          className="
            absolute top-0 right-0
            w-8 h-8 flex items-center justify-center
            rounded-full bg-transparent border-none cursor-pointer text-[#0f0f0f]
            opacity-0 group-hover:opacity-100
            transition-opacity duration-150
            hover:bg-black/10
          "
        >
          <DotsIcon />
        </button>

      </div>
    </div>
  );
};

export default VideoCard;