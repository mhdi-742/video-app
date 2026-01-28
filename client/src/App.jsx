import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext.jsx";
import { useContext } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
};

{
  /*const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  return (
    <div className="min-h-screen bg-gray-900 text-white p-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">Video Dashboard</h1>
        <div className="flex items-center gap-4">
          <span>Welcome, {user.username}</span>
          <button onClick={logout} className="bg-red-500 px-4 py-2 rounded">
            Logout
          </button>
        </div>
      </div>
      <div className="border-2 border-dashed border-gray-700 h-64 flex items-center justify-center rounded-lg">
        <p className="text-gray-500">Video List Coming Soon...</p>
      </div>
    </div>
  );
};*/
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
