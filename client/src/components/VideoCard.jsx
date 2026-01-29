import {
  Trash2,
  Play,
  FileVideo,
  Clock,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";

const VideoCard = ({ video, onPlay, onDelete, currentUser }) => {
  const formatSize = (bytes) => {
    const num = Number(bytes);
    if (!bytes || isNaN(num) || num === 0) return "Unknown Size";

    if (num >= 1024 * 1024 * 1024) {
      return (num / (1024 * 1024 * 1024)).toFixed(2) + " GB";
    }
    return (num / (1024 * 1024)).toFixed(2) + " MB";
  };

  const canDelete =
    currentUser?.role === "admin" ||
    (currentUser?.role === "editor" &&
      currentUser?.id === video.uploader?._id) ||
    (currentUser?.role === "editor" && currentUser?.id === video.uploader);

  const getStatusBadge = (status) => {
    switch (status) {
      case "processed":
        return (
          <span className="bg-green-900 text-green-300 text-xs px-2 py-1 rounded flex items-center gap-1">
            <ShieldCheck size={12} /> Ready
          </span>
        );
      case "flagged":
        return (
          <span className="bg-red-900 text-red-300 text-xs px-2 py-1 rounded flex items-center gap-1">
            <ShieldAlert size={12} /> Flagged
          </span>
        );
      default:
        return (
          <span className="bg-yellow-900 text-yellow-300 text-xs px-2 py-1 rounded flex items-center gap-1">
            <Clock size={12} /> Processing
          </span>
        );
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-gray-500 transition group relative">
      {canDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (window.confirm("Delete this video?")) onDelete(video._id);
          }}
          className="absolute top-2 right-2 z-20 bg-black/50 hover:bg-red-600 text-white p-1.5 rounded-full transition opacity-0 group-hover:opacity-100"
          title="Delete Video"
        >
          <Trash2 size={16} />
        </button>
      )}

      <div className="h-40 bg-gray-900 flex items-center justify-center relative">
        <FileVideo size={48} className="text-gray-600" />

        {video.status === "processed" && video.sensitivity === "safe" && (
          <button
            onClick={() => onPlay(video)}
            className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center"
          >
            <div className="bg-blue-600 p-3 rounded-full hover:scale-110 transition">
              <Play fill="white" className="text-white ml-1" />
            </div>
          </button>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3
            className="font-bold text-white truncate pr-2"
            title={video.title}
          >
            {video.title}
          </h3>
          {getStatusBadge(video.status)}
        </div>

        <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
          <span>{new Date(video.uploadDate).toLocaleDateString()}</span>
          <span>{formatSize(video.size)}</span>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
