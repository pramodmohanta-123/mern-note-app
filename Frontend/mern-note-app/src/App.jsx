import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import axios from "axios";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      // No token means user is not logged in
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await axios.get("/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Token is valid, so store user
        setUser(data);
      } catch (error) {
        // Token is invalid or expired
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Show loading screen while checking login
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-xl text-white">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-500">
      <Navbar user={user} setUser={setUser} />

      <Routes>
        {/* Login Page */}
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/" replace />
            ) : (
              <Login setUser={setUser} />
            )
          }
        />

        {/* Register Page */}
        <Route
          path="/register"
          element={
            user ? (
              <Navigate to="/" replace />
            ) : (
              <Register />
            )
          }
        />

        {/* Home / Notes Page */}
        <Route
          path="/"
          element={
            user ? (
              <Home />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Unknown URL */}
        <Route
          path="*"
          element={
            <Navigate to={user ? "/" : "/login"} replace />
          }
        />
      </Routes>
    </div>
  );
}

export default App;