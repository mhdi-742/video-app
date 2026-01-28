import { useState } from "react";
import axios from "axios";
import { X, Upload, CheckCircle, AlertCircle } from "lucide-react";

const UploadModal = ({ onClose, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("video", file);
    formData.append("title", title);

    setUploading(true);
    setError("");

    try {
      // Get token from storage for Authorization
      const token = localStorage.getItem("token");

      await axios.post("http://localhost:5000/api/videos/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // Sends User ID
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          setProgress(percent);
        },
      });

      // Reset and Notify Parent
      setUploading(false);
      onUploadSuccess();
      onClose();
    } catch (err) {
      setUploading(false);
      setError("Upload failed. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md border border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Upload Video</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X />
          </button>
        </div>

        {error && (
          <div className="bg-red-500/20 text-red-200 p-3 rounded mb-4 flex items-center gap-2">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-gray-400 mb-1 text-sm">
              Video Title
            </label>
            <input
              type="text"
              required
              className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white focus:border-blue-500 outline-none"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:bg-gray-700/50 transition cursor-pointer relative">
            <input
              type="file"
              accept="video/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) => setFile(e.target.files[0])}
            />
            {file ? (
              <div className="text-green-400 flex flex-col items-center gap-2">
                <CheckCircle size={32} />
                <span className="font-medium truncate max-w-[200px]">
                  {file.name}
                </span>
              </div>
            ) : (
              <div className="text-gray-400 flex flex-col items-center gap-2">
                <Upload size={32} />
                <span>Click to Select Video</span>
              </div>
            )}
          </div>

          {uploading && (
            <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
              <p className="text-right text-xs text-gray-400 mt-1">
                {progress}% Uploaded
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={uploading || !file}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-2 rounded transition"
          >
            {uploading ? "Uploading..." : "Start Upload"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;
