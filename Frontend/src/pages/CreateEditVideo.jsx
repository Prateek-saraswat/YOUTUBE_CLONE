// src/pages/CreateEditVideo.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext.jsx";
import API from "../api/api.js";
import { FiUploadCloud, FiX, FiCheck } from "react-icons/fi";
import { MdOutlineVideoLibrary } from "react-icons/md";

const CATEGORIES = [
  "Music", "Gaming", "Education", "Sports",
  "News", "Entertainment", "Science & Tech", "Comedy",
];

//  Reusable field wrapper 
const Field = ({ label, required, hint, children }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
    <label
      style={{
        fontSize: "14px",
        fontWeight: 500,
        color: "#0f0f0f",
        fontFamily: "'Roboto','Arial',sans-serif",
      }}
    >
      {label}
      {required && <span style={{ color: "#cc0000", marginLeft: "2px" }}>*</span>}
    </label>
    {children}
    {hint && (
      <span style={{ fontSize: "12px", color: "#606060", fontFamily: "'Roboto','Arial',sans-serif" }}>
        {hint}
      </span>
    )}
  </div>
);

// ── Shared input styles ────────────────────────────────────────────────────
const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  fontSize: "14px",
  color: "#0f0f0f",
  fontFamily: "'Roboto','Arial',sans-serif",
  background: "#fff",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.15s",
};

const focusStyle = (e) => (e.target.style.borderColor = "#065fd4");
const blurStyle  = (e) => (e.target.style.borderColor = "#ccc");

// ══════════════════════════════════════════════════════════════════════════
const CreateEditVideo = () => {
  const { channelId, videoId } = useParams();
  const navigate               = useNavigate();
  const { auth }               = useAuth();
  const isEditing              = Boolean(videoId);

  const [formData, setFormData] = useState({
    title: "", description: "", videoUrl: "", thumbnailUrl: "", category: "Education",
  });
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const [saved,   setSaved]   = useState(false);

  useEffect(() => {
    if (isEditing) {
      API.get(`/videos/${videoId}`)
        .then(({ data }) => setFormData({
          title:        data.title,
          description:  data.description || "",
          videoUrl:     data.videoUrl,
          thumbnailUrl: data.thumbnailUrl,
          category:     data.category,
        }))
        .catch((err) => console.error("Failed to fetch video:", err));
    }
  }, [videoId, isEditing]);

  if (!auth) { navigate("/login"); return null; }

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!formData.title.trim() || !formData.videoUrl.trim() || !formData.thumbnailUrl.trim()) {
      setError("Title, Video URL, and Thumbnail URL are required.");
      return;
    }
    try {
      setLoading(true);
      if (isEditing) {
        await API.put(`/videos/${videoId}`, formData);
      } else {
        await API.post("/videos", formData);
      }
      setSaved(true);
      setTimeout(() => navigate(`/channel/${channelId}`), 900);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save video.");
    } finally {
      setLoading(false);
    }
  };

  const charLeft = 100 - (formData.title?.length || 0);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fff",
        fontFamily: "'Roboto','Arial',sans-serif",
      }}
    >
      {/* ── Top bar ── */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          background: "#fff",
          borderBottom: "1px solid #e5e5e5",
          padding: "0 24px",
          height: "56px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Left: icon + title */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <MdOutlineVideoLibrary size={22} color="#606060" />
          <span style={{ fontSize: "16px", fontWeight: 500, color: "#0f0f0f" }}>
            {isEditing ? "Edit video" : "Upload video"}
          </span>
        </div>

        {/* Right: Cancel + Save */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            type="button"
            onClick={() => navigate(`/channel/${channelId}`)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0 14px",
              height: "36px",
              borderRadius: "18px",
              fontSize: "14px",
              fontWeight: 500,
              color: "#0f0f0f",
              fontFamily: "'Roboto','Arial',sans-serif",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f2f2f2")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
          >
            Cancel
          </button>

          <button
            form="video-form"
            type="submit"
            disabled={loading || saved}
            style={{
              background: saved ? "#0d652d" : "#065fd4",
              color: "#fff",
              border: "none",
              borderRadius: "18px",
              padding: "0 18px",
              height: "36px",
              fontSize: "14px",
              fontWeight: 500,
              cursor: loading || saved ? "default" : "pointer",
              fontFamily: "'Roboto','Arial',sans-serif",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              opacity: loading ? 0.7 : 1,
              transition: "background 0.2s",
            }}
          >
            {saved ? (
              <><FiCheck size={15} /> Saved</>
            ) : loading ? (
              <>
                <span
                  style={{
                    width: "14px", height: "14px",
                    border: "2px solid rgba(255,255,255,0.4)",
                    borderTopColor: "#fff",
                    borderRadius: "50%",
                    display: "inline-block",
                    animation: "yt-spin 0.7s linear infinite",
                  }}
                />
                Saving…
              </>
            ) : (
              isEditing ? "Save changes" : "Upload"
            )}
          </button>
        </div>
      </div>

      {/* ── Page body ── */}
      <div
        style={{
          maxWidth: "960px",
          margin: "0 auto",
          padding: "32px 24px 80px",
          display: "grid",
          gridTemplateColumns: "1fr 280px",
          gap: "32px",
          alignItems: "start",
        }}
        className="!grid-cols-1 lg:!grid-cols-[1fr_280px]"
      >

        {/* ── LEFT: form ── */}
        <form
          id="video-form"
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "24px" }}
        >
          {/* Error banner */}
          {error && (
            <div
              style={{
                background: "#fce8e6",
                border: "1px solid #f28b82",
                borderRadius: "6px",
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
              }}
            >
              <span style={{ fontSize: "14px", color: "#c5221f" }}>{error}</span>
              <button
                type="button"
                onClick={() => setError("")}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#c5221f" }}
              >
                <FiX size={16} />
              </button>
            </div>
          )}

          {/* Title */}
          <Field label="Title" required hint={`${charLeft} characters remaining`}>
            <input
              type="text"
              name="title"
              maxLength={100}
              placeholder="Add a title that describes your video"
              value={formData.title}
              onChange={handleChange}
              style={inputStyle}
              onFocus={focusStyle}
              onBlur={blurStyle}
            />
          </Field>

          {/* Description */}
          <Field label="Description">
            <textarea
              name="description"
              rows={5}
              placeholder="Tell viewers about your video (type @ to mention a channel)"
              value={formData.description}
              onChange={handleChange}
              style={{ ...inputStyle, resize: "vertical", minHeight: "120px" }}
              onFocus={focusStyle}
              onBlur={blurStyle}
            />
          </Field>

          {/* Video URL */}
          <Field
            label="Video URL"
            required
            hint="Use a YouTube embed URL — e.g. https://www.youtube.com/embed/VIDEO_ID"
          >
            <input
              type="text"
              name="videoUrl"
              placeholder="https://www.youtube.com/embed/VIDEO_ID"
              value={formData.videoUrl}
              onChange={handleChange}
              style={inputStyle}
              onFocus={focusStyle}
              onBlur={blurStyle}
            />
          </Field>

          {/* Thumbnail URL */}
          <Field
            label="Thumbnail"
            required
            hint="Use a direct image URL — e.g. https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg"
          >
            <input
              type="text"
              name="thumbnailUrl"
              placeholder="https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg"
              value={formData.thumbnailUrl}
              onChange={handleChange}
              style={inputStyle}
              onFocus={focusStyle}
              onBlur={blurStyle}
            />

            {/* Thumbnail preview */}
            {formData.thumbnailUrl && (
              <div
                style={{
                  marginTop: "10px",
                  width: "220px",
                  aspectRatio: "16/9",
                  borderRadius: "8px",
                  overflow: "hidden",
                  background: "#e5e5e5",
                  border: "1px solid #e5e5e5",
                }}
              >
                <img
                  src={formData.thumbnailUrl}
                  alt="Thumbnail preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              </div>
            )}
          </Field>

          {/* Category */}
          <Field label="Category" required>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              style={{ ...inputStyle, cursor: "pointer" }}
              onFocus={focusStyle}
              onBlur={blurStyle}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </Field>
        </form>

        {/* ── RIGHT: info panel ── */}
        <div
          style={{
            border: "1px solid #e5e5e5",
            borderRadius: "12px",
            overflow: "hidden",
            fontSize: "13px",
            color: "#606060",
            fontFamily: "'Roboto','Arial',sans-serif",
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "#f9f9f9",
              borderBottom: "1px solid #e5e5e5",
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <FiUploadCloud size={18} color="#606060" />
            <span style={{ fontWeight: 500, fontSize: "14px", color: "#0f0f0f" }}>
              {isEditing ? "Editing video" : "Video details"}
            </span>
          </div>

          {/* Tips */}
          <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
            <TipRow icon="" title="Title" body="A good title is clear, specific, and around 60 characters." />
            <TipRow icon="" title="Thumbnail" body="Use a 16:9 image (1280×720px) for best quality." />
            <TipRow icon="" title="Video URL" body="Paste a YouTube embed link." />
            <TipRow icon="" title="Category" body="Choose the category that best describes your content." />

            <div style={{ borderTop: "1px solid #e5e5e5", paddingTop: "14px" }}>
              <p style={{ margin: 0, lineHeight: "20px" }}>
                Required fields are marked with a <span style={{ color: "#cc0000" }}>*</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Spinner keyframe */}
      <style>{`
        @keyframes yt-spin { to { transform: rotate(360deg); } }
        @media (max-width: 1023px) {
          .\\!grid-cols-1 { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 1024px) {
          .lg\\:\\!grid-cols-\\[1fr_280px\\] { grid-template-columns: 1fr 280px !important; }
        }
      `}</style>
    </div>
  );
};

// ── Small tip row used in the side panel ──────────────────────────────────
const TipRow = ({ icon, title, body }) => (
  <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
    <span style={{ fontSize: "16px", flexShrink: 0, marginTop: "1px" }}>{icon}</span>
    <div>
      <p style={{ margin: "0 0 2px", fontWeight: 500, fontSize: "13px", color: "#0f0f0f" }}>{title}</p>
      <p style={{ margin: 0, fontSize: "12px", lineHeight: "18px" }}>{body}</p>
    </div>
  </div>
);

export default CreateEditVideo;