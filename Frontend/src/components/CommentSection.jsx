// src/components/CommentSection.jsx – Comments with CRUD
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api/api.js";
import { useAuth } from "../context/authContext.jsx";
import Swal from "sweetalert2";

// Function to convert a date into a time.
// Example: "2 min ago", "3 days ago"

const timeAgo = (dateStr) => {
  const now = new Date(); // current date and time
  const date = new Date(dateStr); // convert input string to Date object
  const diff = Math.floor((now - date) / 1000);   // Calculate difference in seconds

  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} days ago`;
  return `${Math.floor(diff / 2592000)} months ago`;
};

// CommentSection Component
// This component handles displaying, adding, editing, and deleting comments
const CommentSection = ({ videoId }) => {
  const { auth } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        
        setLoading(true);
        // Call backend API to get comments for this video
        const { data } = await API.get(`/comments/${videoId}`);
        setComments(data);
      } catch (err) {
        console.error("Failed to fetch comments:", err);
      } finally {
        setLoading(false);
      }
    };
        // Only fetch if videoId exists
    if (videoId) fetchComments();
  }, [videoId]);

  // Add comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    // Prevent empty comments
    if (!newComment.trim()) return;

    try {
      setCommentLoading(true);

      const { data } = await API.post(`/comments/${videoId}`, {
        text: newComment,
      });
      // Add new comment at the top of list
      setComments([data.comment, ...comments]);
      // Clear input field
      setNewComment("");
    } catch (err) {
      const message = err.response?.data?.message || "Failed to add comment";
      // Show error popup
      Swal.fire({
        icon: "error",
        title: "Error",
        text: message,
        confirmButtonColor: "#2563eb",
      });
    } finally {
      setCommentLoading(false);
    }
  };

  // Edit comment
  const handleEditComment = async (commentId) => {
    if (!editText.trim()) return;

    try {
      setEditLoading(true);
      // Send updated text to backend
      const { data } = await API.put(`/comments/${commentId}`, {
        text: editText,
      });
      // Update comment in UI
      setComments(comments.map((c) => (c._id === commentId ? data.comment : c)));

      setEditingId(null);
      setEditText("");
    } catch (err) {
      const message = err.response?.data?.message || "Failed to edit comment";

      Swal.fire({
        icon: "error",
        title: "Error",
        text: message,
        confirmButtonColor: "#2563eb",
      });

      console.error("Failed to edit comment:", err);
    } finally {
      setEditLoading(false);
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId) => {
    // Show confirmation dialog
    const result = await Swal.fire({
      title: "Delete comment?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Delete",
    });
  
    if (!result.isConfirmed) return;
  
    try {
      // delete api call
      await API.delete(`/comments/${commentId}`);
      // Remove deleted comment from UI
      setComments(comments.filter((c) => c._id !== commentId));
  
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Your comment has been deleted.",
        timer: 1500,
        showConfirmButton: false,
      });
  
    } catch (err) {
  
      const message =
        err.response?.data?.message || "Failed to delete comment";
  
      Swal.fire({
        icon: "error",
        title: "Error",
        text: message,
        confirmButtonColor: "#2563eb",
      });
  
      console.error("Failed to delete comment:", err);
    }
  };

  // Start editing
  const startEditing = (comment) => {
    // Set the comment ID being edited
    setEditingId(comment._id);
    // Pre-fill edit input with existing comment text
    setEditText(comment.text);
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-6 text-black">
        {comments.length} Comments
      </h3>

      {/* Add Comment */}
      {auth ? (
        <div className="flex gap-3 mb-6 items-start">
          <img
            className="w-10 h-10 rounded-full object-cover"
            src={
              auth.user.avatar ||
              `https://ui-avatars.com/api/?name=${auth.user.name}&background=0D8ABC&color=fff`
            }
            alt={auth.user.name}
          />

          <form className="flex-1" onSubmit={handleAddComment}>
            <input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full py-2 border-b border-gray-600 text-sm text-black bg-transparent focus:outline-none focus:border-white"
            />

            {newComment.trim() && (
              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setNewComment("")}
                  className="px-4 py-2 text-sm text-gray-700 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={!newComment.trim() || commentLoading}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-full hover:bg-blue-700 disabled:opacity-50"
                >
                  {commentLoading ? "Posting..." : "Comment"}
                </button>
              </div>
            )}
          </form>
        </div>
      ) : (
        <div className="text-center text-gray-400 text-sm m-1.5">
          <Link to="/login" className="text-blue-500 hover:underline">
            Sign in
          </Link>{" "}
          to add a comment
        </div>
      )}

      {/* Loader */}
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-4 border-gray-600 border-t-white rounded-full animate-spin"></div>
        </div>
      ) : (
        comments.map((comment) => (
          <div className="flex gap-3 mb-4" key={comment._id}>
            <img
              className="w-10 h-10 rounded-full object-cover"
              src={
                comment.user?.avatar ||
                `https://ui-avatars.com/api/?name=${
                  comment.user?.username || "U"
                }&background=333&color=fff`
              }
              alt={comment.user?.username}
            />

            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium text-black">
                  @{comment.user?.username}
                </span>
                <span className="text-gray-900 text-xs">
                  {timeAgo(comment.createdAt)}
                </span>
              </div>

              {editingId === comment._id ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleEditComment(comment._id);
                  }}
                >
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full mt-2 border-b border-gray-600 bg-transparent text-black focus:outline-none"
                  />

                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="text-sm text-gray-700 hover:text-white"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={!editText.trim() || editLoading}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full hover:bg-blue-700 disabled:opacity-50"
                    >
                      {editLoading ? "Saving..." : "Save"}
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <p className="text-sm text-black mt-1">{comment.text}</p>

                  {auth && auth.user.id === comment.user?._id && (
                    <div className="flex gap-3 mt-1 text-xs text-gray-700">
                      <button
                        onClick={() => startEditing(comment)}
                        className="hover:text-black"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="hover:text-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default CommentSection;
