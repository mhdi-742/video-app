import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Users, Video, Trash2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [videos, setVideos] = useState([]);
  //const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (activeTab === "users" && user?.role === "admin") fetchUsers();
    else fetchVideos();
  }, [activeTab]);

  const fetchUsers = async () => {
    const res = await axios.get("http://localhost:5000/api/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers(res.data);
  };

  const fetchVideos = async () => {
    const res = await axios.get("http://localhost:5000/api/videos", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setVideos(res.data);
  };

  const changeRole = async (id, newRole) => {
    await axios.patch(
      `http://localhost:5000/api/users/${id}/role`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
      {
        role: newRole,
      },
    );
    setUsers(users.map((u) => (u._id === id ? { ...u, role: newRole } : u)));
  };

  const deleteVideo = async (id) => {
    if (!window.confirm("Admin Delete: Are you sure?")) return;
    await axios.delete(`http://localhost:5000/api/videos/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setVideos(videos.filter((v) => v._id !== id));
  };

  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  } else {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <Link
          to="/"
          className="flex items-center gap-2 text-gray-400 mb-6 hover:text-white"
        >
          <ArrowLeft size={20} /> Back to Dashboard
        </Link>

        <h1 className="text-3xl font-bold text-red-500 mb-6">
          🛡️ Admin Control Center
        </h1>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 rounded ${activeTab === "users" ? "bg-blue-600" : "bg-gray-700"}`}
          >
            <Users className="inline mr-2" /> Manage Users
          </button>
          <button
            onClick={() => setActiveTab("videos")}
            className={`px-4 py-2 rounded ${activeTab === "videos" ? "bg-blue-600" : "bg-gray-700"}`}
          >
            <Video className="inline mr-2" /> Manage All Videos
          </button>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          {activeTab === "users" ? (
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400 border-b border-gray-700">
                  <th className="pb-3">Username</th>
                  <th className="pb-3">Email</th>
                  <th className="pb-3">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr
                    key={u._id}
                    className="border-b border-gray-700 last:border-0"
                  >
                    <td className="py-3">{u.username}</td>
                    <td className="py-3 text-gray-400">{u.email}</td>
                    <td className="py-3">
                      <select
                        value={u.role}
                        onChange={(e) => changeRole(u._id, e.target.value)}
                        className="bg-gray-900 border border-gray-600 rounded p-1"
                      >
                        <option value="viewer">Viewer</option>
                        <option value="editor">Editor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400 border-b border-gray-700">
                  <th className="pb-3">Video Title</th>
                  <th className="pb-3">Owner</th>
                  <th className="pb-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {videos.map((v) => (
                  <tr
                    key={v._id}
                    className="border-b border-gray-700 last:border-0"
                  >
                    <td className="py-3">{v.title}</td>
                    <td className="py-3 text-blue-400">
                      {v.uploader?.username || "Unknown"}
                    </td>
                    <td className="py-3">
                      <button
                        onClick={() => deleteVideo(v._id)}
                        className="text-red-500 hover:text-red-400"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  }
};

export default AdminDashboard;
