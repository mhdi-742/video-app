import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { Plus } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import UploadModal from "../components/UploadModal";
import VideoCard from "../components/VideoCard";
import VideoPlayer from "../components/VideoPlayer";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [videos, setVideos] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [socket, setSocket] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    fetchVideos();

    const newSocket = io("http://localhost:5000");
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

  const fetchVideos = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/videos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setVideos(res.data);
    } catch (err) {
      console.error("Failed to fetch videos", err);
      if (err.response && err.response.status === 401) {
        alert("Session expired. Please login again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 md:p-12">
      <header className="flex justify-between items-center mb-10 border-b border-gray-700 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-blue-500">VideoVault</h1>
          <p className="text-gray-400 text-sm mt-1">
            Welcome back, {user?.username}
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-bold transition"
          >
            <Plus size={20} /> Upload Video
          </button>
          <button
            onClick={logout}
            className="text-gray-400 hover:text-white transition"
          >
            Logout
          </button>
        </div>
      </header>

      {videos.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          <p className="text-xl">No videos uploaded yet.</p>
          <p className="text-sm">Click "Upload Video" to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((video) => (
            <VideoCard
              key={video._id}
              video={video}
              onPlay={(vid) => setSelectedVideo(vid)}
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
