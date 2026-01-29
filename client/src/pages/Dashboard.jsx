import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { Plus, Search, Shield } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import UploadModal from "../components/UploadModal";
import VideoCard from "../components/VideoCard";
import VideoPlayer from "../components/VideoPlayer";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [videos, setVideos] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [socket, setSocket] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterSafe, setFilterSafe] = useState(false);

  useEffect(() => {
    fetchVideos();

    const newSocket = io("https://video-app-production-d10a.up.railway.app");
    setSocket(newSocket);

    newSocket.on("video_processed", (data) => {
      setVideos((prevVideos) =>
        prevVideos.map((vid) =>
          vid._id === data.videoId
            ? { ...vid, status: data.status, sensitivity: data.sensitivity }
            : vid,
        ),
      );
    });

    return () => newSocket.close();
  }, []);

  const handleDelete = async (videoId) => {
    try {
      await axios.delete(
        `https://video-app-production-d10a.up.railway.app/api/videos/${videoId}`,
      );
      setVideos((prev) => prev.filter((v) => v._id !== videoId));
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete");
    }
  };

  const fetchVideos = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `https://video-app-production-d10a.up.railway.app/api/videos?search=${search}&sortBy=${sortBy}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setVideos(res.data);
    } catch (err) {
      console.error("Failed to fetch videos", err);
      if (err.response && err.response.status === 401) {
        alert("Session expired. Please login again.");
      }
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchVideos();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [search, sortBy]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 md:p-12">
      <header className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-gray-700 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-blue-500">VideoVault</h1>
          <p className="text-gray-400 text-sm mt-1">
            Welcome back, {user?.username}{" "}
            <span className="text-xs bg-gray-700 px-2 py-0.5 rounded uppercase ml-2">
              {user?.role}
            </span>
          </p>
        </div>

        <div className="flex gap-4">
          {user?.role !== "viewer" && (
            <button
              onClick={() => setShowUpload(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-bold transition"
            >
              <Plus size={20} /> Upload Video
            </button>
          )}

          {/* 2. SHOW ADMIN BUTTON FOR ADMINS */}
          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-bold transition"
            >
              <Shield size={20} /> Admin Panel
            </Link>
          )}

          <button
            onClick={logout}
            className="text-gray-400 hover:text-white transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* SEARCH AND FILTER BAR (No changes needed here) */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-gray-800 p-4 rounded-lg border border-gray-700">
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search videos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 rounded-lg py-2 px-4 pl-10 text-white focus:outline-none focus:border-blue-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm hidden sm:inline">
              Sort By:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-900 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none text-sm"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="size_desc">Size (Largest)</option>
              <option value="size_asc">Size (Smallest)</option>
            </select>
          </div>

          <label className="flex items-center cursor-pointer gap-2 select-none">
            <input
              type="checkbox"
              checked={filterSafe}
              onChange={() => setFilterSafe(!filterSafe)}
              className="w-4 h-4 rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-600"
            />
            <span className="text-sm text-gray-300">Safe Only</span>
          </label>
        </div>
      </div>

      {videos.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          <p className="text-xl">No videos found.</p>
          <p className="text-sm">
            Try adjusting your search or upload a new video.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos
            .filter((video) => !filterSafe || video.sensitivity === "safe")
            .map((video) => (
              <VideoCard
                key={video._id}
                video={video}
                onPlay={(vid) => setSelectedVideo(vid)}
                onDelete={handleDelete}
                currentUser={user}
              />
            ))}
        </div>
      )}

      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onUploadSuccess={fetchVideos}
        />
      )}
      {selectedVideo && (
        <VideoPlayer
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;
