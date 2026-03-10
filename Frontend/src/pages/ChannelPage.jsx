// src/pages/ChannelPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api.js";
import VideoCard from "../components/VideoCard.jsx";
import { FiUpload, FiEdit2 } from "react-icons/fi";
import { HiDotsVertical } from "react-icons/hi";
import { useAuth } from "../context/authContext.jsx";
import Swal from "sweetalert2";

// ── Helpers ────────────────────────────────────────────────────────────────
const formatSubs = (n) => {
  if (!n) return "0";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2).replace(/\.?0+$/, "") + "M";
  if (n >= 1_000)     return (n / 1_000).toFixed(1).replace(".0", "") + "K";
  return n.toString();
};

// ── Tabs ───────────────────────────────────────────────────────────────────
const TABS = ["Home", "Videos", "Playlists", "About"];

// ── Input field used in both forms ────────────────────────────────────────
const Field = ({ label, value, onChange, type = "text", rows }) => (
  <div className="flex flex-col gap-1">
    <label
      style={{
        fontSize: "12px",
        fontWeight: 500,
        color: "#606060",
        fontFamily: "'Roboto','Arial',sans-serif",
      }}
    >
      {label}
    </label>
    {rows ? (
      <textarea
        rows={rows}
        value={value}
        onChange={onChange}
        style={{
          border: "1px solid #ccc",
          borderRadius: "4px",
          padding: "8px 12px",
          fontSize: "14px",
          color: "#0f0f0f",
          fontFamily: "'Roboto','Arial',sans-serif",
          resize: "vertical",
          outline: "none",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#065fd4")}
        onBlur={(e)  => (e.target.style.borderColor = "#ccc")}
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={onChange}
        style={{
          border: "1px solid #ccc",
          borderRadius: "4px",
          padding: "8px 12px",
          fontSize: "14px",
          color: "#0f0f0f",
          fontFamily: "'Roboto','Arial',sans-serif",
          outline: "none",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#065fd4")}
        onBlur={(e)  => (e.target.style.borderColor = "#ccc")}
      />
    )}
  </div>
);

// ── YT-style pill button ───────────────────────────────────────────────────
const Pill = ({ children, onClick, primary = false, danger = false, small = false, type = "button" }) => {
  const bg = primary ? "#065fd4" : danger ? "#f2f2f2" : "#f2f2f2";
  const color = primary ? "#fff" : danger ? "#cc0000" : "#0f0f0f";
  return (
    <button
      type={type}
      onClick={onClick}
      style={{
        background: bg,
        color,
        border: "none",
        borderRadius: "20px",
        padding: small ? "0 12px" : "0 16px",
        height: small ? "32px" : "36px",
        fontFamily: "'Roboto','Arial',sans-serif",
        fontWeight: 500,
        fontSize: small ? "13px" : "14px",
        cursor: "pointer",
        whiteSpace: "nowrap",
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        transition: "background 0.15s",
      }}
      onMouseEnter={(e) => {
        if (primary)       e.currentTarget.style.background = "#0356c3";
        else if (danger)   e.currentTarget.style.background = "#fce8e6";
        else               e.currentTarget.style.background = "#e5e5e5";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = bg;
      }}
    >
      {children}
    </button>
  );
};

// ── Modal wrapper ──────────────────────────────────────────────────────────
const Modal = ({ title, onClose, children }) => (
  <div
    style={{
      position: "fixed", inset: 0, zIndex: 50,
      background: "rgba(0,0,0,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "16px",
    }}
  >
    <div
      style={{
        background: "#fff",
        borderRadius: "12px",
        padding: "24px",
        width: "100%",
        maxWidth: "480px",
        fontFamily: "'Roboto','Arial',sans-serif",
        boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
      }}
    >
      <div className="flex items-center justify-between mb-5">
        <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#0f0f0f", margin: 0 }}>
          {title}
        </h2>
        <button
          onClick={onClose}
          style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: "22px", color: "#606060", lineHeight: 1,
          }}
        >
          ×
        </button>
      </div>
      {children}
    </div>
  </div>
);

// ══════════════════════════════════════════════════════════════════════════
//  MAIN PAGE
// ══════════════════════════════════════════════════════════════════════════
const ChannelPage = () => {
  const { id }              = useParams();
  const navigate            = useNavigate();
  const { auth, updateUser } = useAuth();

  const [channel,          setChannel]          = useState(null);
  const [loading,          setLoading]          = useState(true);
  const [isOwner,          setIsOwner]          = useState(false);
  const [activeTab,        setActiveTab]        = useState("Videos");
  const [subscribed,       setSubscribed]       = useState(false);
  const [showCreateForm,   setShowCreateForm]   = useState(false);
  const [showEditForm,     setShowEditForm]     = useState(false);
  const [deletingVideoId,  setDeletingVideoId]  = useState(null);
  const [formError,        setFormError]        = useState("");

  const [channelForm, setChannelForm] = useState({
    channelName: "", description: "", channelBanner: "",
  });
  const [editChannelForm, setEditChannelForm] = useState({
    channelName: "", description: "", channelBanner: "",
  });

  useEffect(() => {
    const fetchChannel = async () => {
      if (id === "create") { setShowCreateForm(true); setLoading(false); return; }
      setShowCreateForm(false);
      try {
        setLoading(true);
        const { data } = await API.get(`/channels/${id}`);
        setChannel(data);
        if (auth && data.owner) {
          const ownerId = data.owner._id || data.owner;
          setIsOwner(ownerId.toString() === auth.user.id.toString());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchChannel();
  }, [id, auth]);

  const handleCreateChannel = async (e) => {
    e.preventDefault();
    setFormError("");
    try {
      const res = await API.post("/channels", channelForm);
      const created = res.data.channel;
      if (!created?._id) throw new Error("Invalid response");
      updateUser({ channel: created._id });
      navigate(`/channel/${created._id}`, { replace: true });
    } catch (err) {
      setFormError(err.response?.data?.message || "Channel creation failed");
    }
  };

  const handleUpdateChannel = async (e) => {
    e.preventDefault();
    if (!channel) return;
    try {
      await API.put(`/channels/${channel._id}`, editChannelForm);
      setChannel((prev) => ({ ...prev, ...editChannelForm }));
      setShowEditForm(false);
      Swal.fire({ icon: "success", title: "Channel updated!", timer: 1500, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.response?.data?.message || "Failed to update channel" });
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (deletingVideoId) return;
    const result = await Swal.fire({
      title: "Delete video?",
      text: "This video will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#cc0000",
      cancelButtonColor: "#606060",
      confirmButtonText: "Delete",
    });
    if (!result.isConfirmed) return;
    try {
      setDeletingVideoId(videoId);
      await API.delete(`/videos/${videoId}`);
      setChannel((prev) => ({ ...prev, videos: prev.videos.filter((v) => v._id !== videoId) }));
      Swal.fire({ icon: "success", title: "Deleted!", timer: 1500, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.response?.data?.message || "Failed to delete video" });
    } finally {
      setDeletingVideoId(null);
    }
  };

  // ── Loading ──
  if (loading) {
    return (
      <div className="flex justify-center items-center h-60">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin" />
      </div>
    );
  }

  // ── Create channel form ──
  if (showCreateForm || id === "create") {
    return (
      <div
        style={{
          maxWidth: "480px",
          margin: "48px auto",
          padding: "32px",
          border: "1px solid #e5e5e5",
          borderRadius: "12px",
          fontFamily: "'Roboto','Arial',sans-serif",
        }}
      >
        <h2 style={{ fontSize: "22px", fontWeight: 600, color: "#0f0f0f", marginBottom: "24px" }}>
          Create your channel
        </h2>

        {formError && (
          <div style={{ background: "#fce8e6", color: "#cc0000", padding: "10px 14px", borderRadius: "6px", fontSize: "14px", marginBottom: "16px" }}>
            {formError}
          </div>
        )}

        <form onSubmit={handleCreateChannel} className="flex flex-col gap-4">
          <Field
            label="Channel name"
            value={channelForm.channelName}
            onChange={(e) => setChannelForm({ ...channelForm, channelName: e.target.value })}
          />
          <Field
            label="Description"
            value={channelForm.description}
            onChange={(e) => setChannelForm({ ...channelForm, description: e.target.value })}
            rows={3}
          />
          <Field
            label="Banner URL"
            value={channelForm.channelBanner}
            onChange={(e) => setChannelForm({ ...channelForm, channelBanner: e.target.value })}
          />
          <div className="flex justify-end gap-3 mt-2">
            <Pill onClick={() => navigate(-1)}>Cancel</Pill>
            <Pill primary type="submit">Create channel</Pill>
          </div>
        </form>
      </div>
    );
  }

  if (!channel) {
    return (
      <div style={{ textAlign: "center", padding: "80px 16px", fontFamily: "'Roboto','Arial',sans-serif", color: "#0f0f0f" }}>
        Channel not found
      </div>
    );
  }

  const videoCount = channel.videos?.length || 0;

  return (
    <div style={{ fontFamily: "'Roboto','Arial',sans-serif", color: "#0f0f0f", maxWidth: "1284px", margin: "0 auto" }}>

      {/* ── BANNER ── */}
      <div style={{ width: "100%", aspectRatio: "32/9", maxHeight: "200px", overflow: "hidden", background: "#e5e5e5" }}>
        <img
          src={channel.channelBanner || "https://placehold.co/2560x424/e5e5e5/aaa?text=+"}
          alt="Channel banner"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          onError={(e) => { e.target.src = "https://placehold.co/2560x424/e5e5e5/aaa?text=+"; }}
        />
      </div>

      {/* ── CHANNEL HEADER ── */}
      <div style={{ padding: "16px 24px 0 24px" }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-6 pb-4" style={{ borderBottom: "1px solid #e5e5e5" }}>

          {/* Avatar */}
          <img
            src={
              channel.owner?.avatar ||
              `https://ui-avatars.com/api/?name=${channel.channelName || "C"}&background=606060&color=fff&size=160`
            }
            alt={channel.channelName}
            style={{
              width: "80px", height: "80px",
              borderRadius: "50%",
              objectFit: "cover",
              flexShrink: 0,
              background: "#e5e5e5",
            }}
            onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=C&background=606060&color=fff&size=160"; }}
          />

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h1 style={{ fontSize: "24px", fontWeight: 700, lineHeight: "32px", margin: "0 0 4px" }}>
              {channel.channelName}
            </h1>
            <p style={{ fontSize: "14px", color: "#606060", margin: "0 0 6px", lineHeight: "20px" }}>
              @{(channel.channelName || "channel").toLowerCase().replace(/\s+/g, "")}
              &nbsp;•&nbsp;
              <strong style={{ color: "#0f0f0f" }}>{formatSubs(channel.subscribers)}</strong> subscribers
              &nbsp;•&nbsp;
              <strong style={{ color: "#0f0f0f" }}>{videoCount}</strong> video{videoCount !== 1 ? "s" : ""}
            </p>
            {channel.description && (
              <p style={{ fontSize: "14px", color: "#606060", margin: 0, lineHeight: "20px", maxWidth: "600px" }}
                 className="line-clamp-2">
                {channel.description}
              </p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-wrap flex-shrink-0">
            {isOwner ? (
              <>
                <Pill onClick={() => navigate(`/channel/${channel._id}/upload`)}>
                  <FiUpload size={15} /> Upload
                </Pill>
                <Pill
                  onClick={() => {
                    setEditChannelForm({
                      channelName: channel.channelName || "",
                      description: channel.description || "",
                      channelBanner: channel.channelBanner || "",
                    });
                    setShowEditForm(true);
                  }}
                >
                  <FiEdit2 size={14} /> Customise channel
                </Pill>
              </>
            ) : (
              <>
                <button
                  onClick={() => setSubscribed((p) => !p)}
                  style={{
                    background: subscribed ? "#f2f2f2" : "#0f0f0f",
                    color: subscribed ? "#0f0f0f" : "#fff",
                    border: "none",
                    borderRadius: "20px",
                    padding: "0 16px",
                    height: "36px",
                    fontWeight: 500,
                    fontSize: "14px",
                    cursor: "pointer",
                    transition: "background 0.15s",
                    fontFamily: "'Roboto','Arial',sans-serif",
                  }}
                >
                  {subscribed ? "Subscribed" : "Subscribe"}
                </button>
                {/* Bell icon after subscribed */}
                {subscribed && (
                  <button
                    style={{
                      width: "36px", height: "36px",
                      borderRadius: "50%",
                      background: "#f2f2f2",
                      border: "none",
                      cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "18px",
                    }}
                  >🔔</button>
                )}
              </>
            )}
          </div>
        </div>

        {/* ── TABS ── */}
        <div
          className="flex gap-0 overflow-x-auto"
          style={{ borderBottom: "1px solid #e5e5e5", marginTop: 0 }}
        >
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: "none",
                border: "none",
                borderBottom: activeTab === tab ? "2px solid #0f0f0f" : "2px solid transparent",
                padding: "12px 16px",
                cursor: "pointer",
                fontFamily: "'Roboto','Arial',sans-serif",
                fontWeight: activeTab === tab ? 500 : 400,
                fontSize: "14px",
                color: activeTab === tab ? "#0f0f0f" : "#606060",
                whiteSpace: "nowrap",
                transition: "color 0.15s",
                marginBottom: "-1px",
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ padding: "24px" }}>

        {/* Videos tab (default) */}
        {(activeTab === "Videos" || activeTab === "Home") && (
          <>
            {videoCount === 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "80px 16px",
                  color: "#606060",
                  gap: "12px",
                }}
              >
                <span style={{ fontSize: "48px" }}>📭</span>
                <p style={{ fontSize: "16px", margin: 0 }}>No videos uploaded yet</p>
                {isOwner && (
                  <Pill primary onClick={() => navigate(`/channel/${channel._id}/upload`)}>
                    <FiUpload size={15} /> Upload your first video
                  </Pill>
                )}
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                  gap: "16px",
                }}
              >
                {channel.videos.map((video) => (
                  <div key={video._id} style={{ position: "relative" }}>
                    {/* Owner controls overlay */}
                    {isOwner && (
                      <div
                        style={{
                          position: "absolute",
                          top: "8px",
                          right: "8px",
                          zIndex: 10,
                          display: "flex",
                          gap: "6px",
                          opacity: 0,
                          transition: "opacity 0.15s",
                        }}
                        className="owner-actions"
                      >
                        <button
                          onClick={() => navigate(`/channel/${channel._id}/edit/${video._id}`)}
                          style={{
                            background: "rgba(0,0,0,0.75)",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            padding: "4px 10px",
                            fontSize: "12px",
                            cursor: "pointer",
                            fontFamily: "'Roboto','Arial',sans-serif",
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteVideo(video._id)}
                          disabled={deletingVideoId === video._id}
                          style={{
                            background: "rgba(204,0,0,0.85)",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            padding: "4px 10px",
                            fontSize: "12px",
                            cursor: "pointer",
                            fontFamily: "'Roboto','Arial',sans-serif",
                            opacity: deletingVideoId === video._id ? 0.5 : 1,
                          }}
                        >
                          {deletingVideoId === video._id ? "Deleting…" : "Delete"}
                        </button>
                      </div>
                    )}
                    <div className="video-card-wrapper">
                      <VideoCard video={video} channelContext={channel} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* About tab */}
        {activeTab === "About" && (
          <div style={{ maxWidth: "600px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "12px" }}>Description</h3>
            <p style={{ fontSize: "14px", color: "#606060", lineHeight: "22px", whiteSpace: "pre-wrap" }}>
              {channel.description || "No description provided."}
            </p>
            <div style={{ marginTop: "24px", borderTop: "1px solid #e5e5e5", paddingTop: "20px" }}>
              <p style={{ fontSize: "14px", color: "#606060" }}>
                <strong style={{ color: "#0f0f0f" }}>Subscribers:</strong>&nbsp;
                {formatSubs(channel.subscribers)}
              </p>
              <p style={{ fontSize: "14px", color: "#606060", marginTop: "6px" }}>
                <strong style={{ color: "#0f0f0f" }}>Videos:</strong>&nbsp;{videoCount}
              </p>
            </div>
          </div>
        )}

        {/* Playlists tab placeholder */}
        {activeTab === "Playlists" && (
          <div style={{ textAlign: "center", padding: "80px 16px", color: "#606060" }}>
            <span style={{ fontSize: "48px" }}>📋</span>
            <p style={{ fontSize: "16px", marginTop: "12px" }}>No playlists yet</p>
          </div>
        )}
      </div>

      {/* ── EDIT CHANNEL MODAL ── */}
      {showEditForm && (
        <Modal title="Edit channel" onClose={() => setShowEditForm(false)}>
          <form onSubmit={handleUpdateChannel} className="flex flex-col gap-4">
            <Field
              label="Channel name"
              value={editChannelForm.channelName}
              onChange={(e) => setEditChannelForm({ ...editChannelForm, channelName: e.target.value })}
            />
            <Field
              label="Description"
              value={editChannelForm.description}
              onChange={(e) => setEditChannelForm({ ...editChannelForm, description: e.target.value })}
              rows={3}
            />
            <Field
              label="Banner URL"
              value={editChannelForm.channelBanner}
              onChange={(e) => setEditChannelForm({ ...editChannelForm, channelBanner: e.target.value })}
            />
            <div className="flex justify-end gap-3 mt-2">
              <Pill onClick={() => setShowEditForm(false)}>Cancel</Pill>
              <button
                type="submit"
                style={{
                  background: "#065fd4", color: "#fff",
                  border: "none", borderRadius: "20px",
                  padding: "0 20px", height: "36px",
                  fontFamily: "'Roboto','Arial',sans-serif",
                  fontWeight: 500, fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                Save
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* CSS: show owner action buttons on card hover */}
      <style>{`
        .video-card-wrapper:hover ~ * .owner-actions,
        .video-card-wrapper:hover + .owner-actions,
        div:hover > .owner-actions { opacity: 1 !important; }
        div:hover > .video-card-wrapper ~ .owner-actions { opacity: 1 !important; }
        .video-card-wrapper:hover { z-index: 1; }
        [style*="position: relative"]:hover .owner-actions { opacity: 1 !important; }
      `}</style>
    </div>
  );
};

export default ChannelPage;
