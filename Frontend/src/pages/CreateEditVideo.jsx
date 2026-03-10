// src/pages/CreateEditVideo.jsx – Create or Edit a video
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext.jsx';
import API from '../api/api.js';

const categories = [
    'Music',
    'Gaming',
    'Education',
    'Sports',
    'News',
    'Entertainment',
    'Science & Tech',
    'Comedy',
];

// create video and edit
const CreateEditVideo = () => {
    const { channelId, videoId } = useParams();
    const navigate = useNavigate();
    const { auth } = useAuth();
    const isEditing = Boolean(videoId);

    // set all data in state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        videoUrl: '',
        thumbnailUrl: '',
        category: 'Education',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // If editing, fetch existing video data
    useEffect(() => {
        if (isEditing) {
            const fetchVideo = async () => {
                try {
                    const { data } = await API.get(`/videos/${videoId}`);
                    // inputs fields data coming from backend
                    setFormData({
                        title: data.title,
                        description: data.description || '',
                        videoUrl: data.videoUrl,
                        thumbnailUrl: data.thumbnailUrl,
                        category: data.category,
                    });
                } catch (err) {
                    console.error('Failed to fetch video for editing:', err);
                }
            };
            fetchVideo();
        }
    }, [videoId, isEditing]);

    // Redirect if not logged in
    if (!auth) {
        navigate('/login');
        return null;
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!formData.title.trim() || !formData.videoUrl.trim() || !formData.thumbnailUrl.trim()) {
            setError('Title, Video URL, and Thumbnail URL are required');
            return;
        }

        try {
            setLoading(true);
            if (isEditing) {
                await API.put(`/videos/${videoId}`, formData);
            } else {
                await API.post('/videos', formData);
            }
            navigate(`/channel/${channelId}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save video');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">

  <h1 className="text-2xl font-semibold mb-8 text-black">
    {isEditing ? "Edit Video" : "Upload Video"}
  </h1>

  {error && (
    <div className="bg-red-500/10 border border-red-500 rounded p-3 text-center text-red-500 text-sm mb-4">
      {error}
    </div>
  )}

  <form className="flex flex-col gap-5" onSubmit={handleSubmit}>

    {/* Title */}
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">
        Title <span className="text-red-500">*</span>
      </label>

      <input
        type="text"
        name="title"
        placeholder="Enter video title"
        value={formData.title}
        onChange={handleChange}
        className="w-full px-4 py-3 bg-gray-50 border border-gray-600 rounded text-black focus:border-blue-500 outline-none"
      />
    </div>

    {/* Description */}
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">
        Description
      </label>

      <textarea
        name="description"
        placeholder="Tell viewers about your video"
        value={formData.description}
        onChange={handleChange}
        className="w-full px-4 py-3 bg-gray-50 border border-gray-600 rounded text-black min-h-[100px] focus:border-blue-500 outline-none"
      />
    </div>

    {/* Video URL */}
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">
        Video URL <span className="text-red-500">*</span>
      </label>

      <input
        type="text"
        name="videoUrl"
        placeholder="https://www.youtube.com/embed/VIDEO_ID"
        value={formData.videoUrl}
        onChange={handleChange}
        className="w-full px-4 py-3 bg-gray-50 border border-gray-600 rounded text-black focus:border-blue-500 outline-none"
      />

      <span className="text-xs text-gray-700">
        Use a YouTube embed URL (example: https://www.youtube.com/embed/VIDEO_ID)
      </span>
    </div>

    {/* Thumbnail */}
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">
        Thumbnail URL <span className="text-red-500">*</span>
      </label>

      <input
        type="text"
        name="thumbnailUrl"
        placeholder="https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg"
        value={formData.thumbnailUrl}
        onChange={handleChange}
        className="w-full px-4 py-3 bg-gray-50 border border-gray-600 rounded text-black focus:border-blue-500 outline-none"
      />

      <span className="text-xs text-gray-400">
        Use a direct image URL for the thumbnail
      </span>

      {formData.thumbnailUrl && (
        <div className="mt-2 w-52 aspect-video rounded overflow-hidden bg-gray-800">
          <img
            src={formData.thumbnailUrl}
            alt="Thumbnail preview"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>
      )}
    </div>

    {/* Category */}
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">
        Category <span className="text-red-500">*</span>
      </label>

      <select
        name="category"
        value={formData.category}
        onChange={handleChange}
        className="w-full px-4 py-3 bg-gray-50 border border-gray-600 rounded text-black focus:border-blue-500 outline-none"
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>

    {/* Buttons */}
    <div className="flex gap-3 justify-end pt-3">

      <button
        type="button"
        onClick={() => navigate(`/channel/${channelId}`)}
        className="px-6 py-3 rounded text-black hover:bg-gray-300 "
      >
        Cancel
      </button>

      <button
        type="submit"
        disabled={loading}
        className="px-6 py-3 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Saving..." : isEditing ? "Save Changes" : "Upload Video"}
      </button>

    </div>

  </form>
</div>
    );
};

export default CreateEditVideo;
