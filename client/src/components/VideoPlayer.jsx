import { X } from "lucide-react";

const VideoPlayer = ({ video, onClose }) => {
  const videoUrl = `https://video-app-production-d10a.up.railway.app/api/videos/stream/${video.filename}`;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      <div className="relative w-full max-w-4xl bg-black rounded-lg overflow-hidden shadow-2xl border border-gray-800">
        <div className="flex justify-between items-center p-4 bg-gray-900">
          <h3 className="text-white font-bold truncate pr-4">{video.title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="aspect-video bg-black">
          <video controls autoPlay className="w-full h-full" src={videoUrl}>
            Your browser does not support the video tag.
          </video>
        </div>

        <div className="p-4 bg-gray-900 text-sm text-gray-400">
          Playing via HTTP Range Stream •{" "}
          {video.sensitivity === "safe"
            ? "✅ Safe Content"
            : "⚠️ Flagged Content"}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
