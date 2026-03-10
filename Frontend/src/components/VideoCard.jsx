// src/components/VideoCard.jsx
// Import navigation hook from React Router
// Used to navigate to video or channel page
import { useNavigate } from "react-router-dom";

// Function to format view count like YouTube
// Example: 1500 -> 1.5K, 2000000 -> 2.0M
const formatViews = (views) => {
  if (views >= 1000000) return (views / 1000000).toFixed(1) + "M";
  if (views >= 1000) return (views / 1000).toFixed(1) + "K";
  return views.toString();
};

// Function to convert date into "time ago" format
// Example: Today, 2 days ago, 1 week ago
const formatTimeAgo = (dateStr) => {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now - date; // difference in milliseconds
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)); // convert to days

  if (diffDays < 1) return "Today";
    // less than 7 days
  if (diffDays < 7)
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    // less than 30 days and similar
  if (diffDays < 30)
    return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? "s" : ""
      } ago`;
  if (diffDays < 365)
    return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? "s" : ""
      } ago`;

  return `${Math.floor(diffDays / 365)} year${Math.floor(diffDays / 365) > 1 ? "s" : ""
    } ago`;
};

// VideoCard component
// video -> video data object
// channelContext -> fallback channel data when video channel not populated
const VideoCard = ({ video, channelContext }) => {
  const navigate = useNavigate();

  // on click going to video/video_Id api
  const handleClick = () => {
    navigate(`/video/${video._id}`);
  };

  // Navigate to channel page when channel name is clicked
  // stopPropagation prevents triggering video click
  const handleChannelClick = (e) => {
    e.stopPropagation();
    if (video.channel?._id) {
      navigate(`/channel/${video.channel._id}`);
    }
  };

  return (
      // Whole card clickable
    <div
      className="cursor-pointer rounded-lg overflow-hidden transition-transform duration-200 hover:-translate-y-1 group text-black"
      onClick={handleClick}
    >
      {/* Thumbnail */}
      <div className="relative w-full aspect-video overflow-hidden rounded-lg bg-white text-black">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          // Lazy loading improves performance
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.target.src =
              "https://placehold.co/640x360/272727/aaa?text=No+Thumbnail";
          }}
        />
      </div>

      {/* Content */}
      <div className="flex gap-3 pt-3 px-1 pb-1">
        {/* Channel Avatar */}
        <img
          className="w-9 h-9 rounded-full flex-shrink-0 object-cover bg-white"
          src={
            video.uploader?.avatar ||
            video.channel?.owner?.avatar ||
            channelContext?.owner?.avatar ||
            channelContext?.avatar ||
            `https://ui-avatars.com/api/?name=${video.channel?.channelName || channelContext?.channelName || "C"
            }&background=random&color=fff&size=64`
          }
          alt={video.channel?.channelName || channelContext?.channelName}
                    // Fallback thumbnail if image fails
          onError={(e) => {
            e.target.src =
              "https://ui-avatars.com/api/?name=C&background=333&color=fff&size=64";
          }}
        />

        <div className="flex-1 min-w-0">
          {/* Title */}
          <h3 className="text-sm font-medium leading-snug text-black line-clamp-2 mb-1">
            {video.title}
          </h3>

          {/* Channel Name */}
          <div
            className="text-xs text-gray-500 hover:text-black transition"
            onClick={handleChannelClick}
          >
            {video.channel?.channelName || channelContext?.channelName || "Unknown Channel"}
          </div>

          {/* Views & Time */}
          <div className="text-xs text-gray-700 flex gap-2">
            <span>{formatViews(video.views)} views</span>
            <span>•</span>
            <span>{formatTimeAgo(video.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;