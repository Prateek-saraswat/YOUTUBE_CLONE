// src/pages/ChannelPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api.js";
import VideoCard from "../components/VideoCard.jsx";
import { FiUpload } from "react-icons/fi";
import { useAuth } from "../context/authContext.jsx";
import Swal from "sweetalert2";

const ChannelPage = () => {
  // Get channel id from URL ( /channel/:id )
  const { id } = useParams();
  // Used for page navigation
  const navigate = useNavigate();
  // Get logged-in user from Auth Context
  const { user, updateUser } = useAuth();
  // Store channel data
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  // Check if logged-in user is the owner of the channel
  const [isOwner, setIsOwner] = useState(false);

  // Show create channel form
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Show edit channel form
  const [showEditForm, setShowEditForm] = useState(false);

  // Form state for creating a new channel
  const [channelForm, setChannelForm] = useState({
    channelName: "",
    description: "",
    channelBanner: "",
  });

  // Form state for editing an existing channel
  const [editChannelForm, setEditChannelForm] = useState({
    channelName: "",
    description: "",
    channelBanner: "",
  });

  // Error message for form
  const [formError, setFormError] = useState("");

  // Store video id that is currently being deleted
  const [deletingVideoId, setDeletingVideoId] = useState(null);

    // Runs when component loads OR id/user changes
  useEffect(() => {
    const fetchChannel = async () => {
            // If route is /channel/create -> show create form
      if (id === "create") {
        setShowCreateForm(true);
        setLoading(false);
        return;
      }

      // reset form view
      setShowCreateForm(false);

      try {
        setLoading(true);
        // Call backend API to get channel details
        const { data } = await API.get(`/channels/${id}`);

        setChannel(data);
        // Check if current user is the owner of the channel
        if (user && data.owner) {
          const ownerId = data.owner._id || data.owner;
          setIsOwner(ownerId.toString() === user._id.toString());
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchChannel();
  }, [id, user]);

    // Handle channel creation
  const handleCreateChannel = async (e) => {
    e.preventDefault();
    setFormError("");

    try {
            // Send create request to backend
      const res = await API.post("/channels", channelForm);
      const channel = res.data;

      if (!channel || !channel._id) {
        throw new Error("Invalid response");
      }

      updateUser({ channels: [channel._id] });

      navigate(`/channel/${channel._id}`, { replace: true });
    } catch (err) {
      console.error(err);
      setFormError(err.response?.data?.message || "Channel creation failed");
    }
  };

  const handleUpdateChannel = async (e) => {
    e.preventDefault();
    // Prevent update if channel not loaded
    if (!channel) return;

    try {
      await API.put(`/channels/edit-channel/${channel._id}`, editChannelForm);

      setChannel((prev) => ({
        ...prev,
        channelName: editChannelForm.channelName,
        description: editChannelForm.description,
        channelBanner: editChannelForm.channelBanner,
      }));

      setShowEditForm(false);

      Swal.fire({
        icon: "success",
        title: "Channel updated!",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Update channel error:", err);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Failed to update channel",
      });
    }
  };

  // Handle deleting a video from the channel
  const handleDeleteVideo = async (videoId) => {
    if (deletingVideoId) return;
    // Show confirmation popup
    const result = await Swal.fire({
      title: "Delete video?",
      text: "This video will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Delete",
    });

    if (!result.isConfirmed) return;

    try {
      setDeletingVideoId(videoId);

      await API.delete(`/videos/${videoId}`);

      setChannel((prev) => ({
        ...prev,
        videos: prev.videos.filter((v) => v._id !== videoId),
      }));

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Video deleted successfully",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      const message = err.response?.data?.message || "Failed to delete video";

      Swal.fire({
        icon: "error",
        title: "Error",
        text: message,
      });

      console.log(err);
    } finally {
      setDeletingVideoId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-red-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (showCreateForm || id === "create") {
    return (
      <div className="max-w-md mx-auto mt-10 border-2 border-black p-5.5 rounded-4xl ">
        <h2 className="text-xl font-semibold mb-4 text-black">
          Create Channel
        </h2>

        {formError && (
          <div className="bg-red-100 text-red-600 p-2 rounded mb-3">
            {formError}
          </div>
        )}

        <form onSubmit={handleCreateChannel} className="space-y-3">
          <input
            type="text"
            placeholder="Channel Name"
            className="w-full border p-2 rounded text-black"
            value={channelForm.channelName}
            onChange={(e) =>
              setChannelForm({ ...channelForm, channelName: e.target.value })
            }
          />

          <textarea
            placeholder="Description"
            className="w-full border p-2 rounded text-black"
            value={channelForm.description}
            onChange={(e) =>
              setChannelForm({ ...channelForm, description: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Banner URL"
            className="w-full border p-2 rounded text-black"
            value={channelForm.channelBanner}
            onChange={(e) =>
              setChannelForm({
                ...channelForm,
                channelBanner: e.target.value,
              })
            }
          />

          <button className="bg-blue-500 text-black w-full py-2 rounded-2xl">
            Create Channel
          </button>
        </form>
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="text-center mt-10 text-black">Channel not found</div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
      {/* Banner */}
      <div className="h-48 w-full overflow-hidden rounded">
        <img
          src={channel.channelBanner || "https://placehold.co/1200x300"}
          className="w-full h-full object-cover"
          alt="Channel Banner"
        />
      </div>

      {/* Channel Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-4 md:gap-6 mt-6 border-b pb-6">
        <img
          className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover bg-gray-200 flex-shrink-0"
          src={
            channel.owner?.avatar ||
            `https://ui-avatars.com/api/?name=${
              channel.channelName || "C"
            }&background=random&color=fff&size=128`
          }
          alt={channel.channelName}
          onError={(e) => {
            e.target.src =
              "https://ui-avatars.com/api/?name=C&background=333&color=fff&size=128";
          }}
        />

        <div className="flex-1">
          <h1 className="text-2xl font-bold text-black">
            {channel.channelName}
          </h1>
          <p className="text-gray-700 text-sm mt-1">
            {channel.subscribers} subscribers • {channel.videos?.length} videos
          </p>
          {channel.description && (
            <p className="text-gray-700 text-sm mt-2">{channel.description}</p>
          )}
        </div>

        <div className="flex flex-wrap justify-center md:justify-end gap-3 w-full md:w-auto md:ml-auto mt-2 md:mt-0">
          <button className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-full text-sm font-medium transition">
            Subscribe
          </button>

          {isOwner && (
            <>
              <button
                onClick={() => navigate(`/channel/${channel._id}/upload`)}
                className="flex items-center gap-2 bg-red-500 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-red-600 transition"
              >
                <FiUpload />
                Upload
              </button>

              <button
                onClick={() => {
                  setEditChannelForm({
                    channelName: channel.channelName || "",
                    description: channel.description || "",
                    channelBanner: channel.channelBanner || "",
                  });
                  setShowEditForm(true);
                }}
                className="bg-blue-500 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-blue-600 transition"
              >
                Edit Channel
              </button>
            </>
          )}
        </div>
      </div>

      {/* Edit Channel Form */}
      {showEditForm && (
        <div className="bg-white p-6 rounded mt-6 text-black border-2">
          <h2 className="text-lg font-semibold mb-4 text-black">
            Edit Channel
          </h2>

          <form
            onSubmit={handleUpdateChannel}
            className="flex flex-col gap-3 text-black"
          >
            <label>Channel Name</label>
            <input
              type="text"
              placeholder="Channel Name"
              value={editChannelForm.channelName}
              onChange={(e) =>
                setEditChannelForm({
                  ...editChannelForm,
                  channelName: e.target.value,
                })
              }
              className="border p-2 rounded"
            />

            <label>Description</label>
            <textarea
              placeholder="Description"
              value={editChannelForm.description}
              onChange={(e) =>
                setEditChannelForm({
                  ...editChannelForm,
                  description: e.target.value,
                })
              }
              className="border p-2 rounded"
              rows={3}
            />

            <label>Banner URL</label>
            <input
              type="text"
              placeholder="Banner URL"
              value={editChannelForm.channelBanner}
              onChange={(e) =>
                setEditChannelForm({
                  ...editChannelForm,
                  channelBanner: e.target.value,
                })
              }
              className="border p-2 rounded "
            />

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Save
              </button>

              <button
                type="button"
                onClick={() => setShowEditForm(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Videos */}
      <h2 className="text-lg font-semibold mt-6 mb-4">Videos</h2>

      {channel.videos?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {channel.videos.map((video) => (
            <div key={video._id} className="relative group">
              {isOwner && (
                <div className="absolute right-2 top-2 flex gap-2 z-10">
                  <button
                    className="bg-blue-500 text-white px-2 py-1 text-xs rounded hover:bg-blue-600"
                    onClick={() =>
                      navigate(`/channel/${channel._id}/edit/${video._id}`)
                    }
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDeleteVideo(video._id)}
                    disabled={deletingVideoId === video._id}
                    className="bg-red-500 text-white px-2 py-1 text-xs rounded hover:bg-red-600 disabled:opacity-50"
                  >
                    {deletingVideoId === video._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              )}

              <VideoCard video={video} channelContext={channel} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-700 mt-10">No videos uploaded</p>
      )}
    </div>
  );
};

export default ChannelPage;
