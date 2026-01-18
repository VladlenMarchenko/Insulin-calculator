import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Calculator from "./pages/Calculator";
import History from "./pages/History";
import Profile from "./pages/Profile";
import Patients from "./pages/Patients";
import PatientProfile from "./pages/PatientProfile"; // ✅ НОВОЕ

import BottomNav from "./components/BottomNav";
import "./App.css";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));

  const handleLogin = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);
    setToken(data.token);
    setRole(data.role);
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setRole(null);
  };

  if (!token) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login onLogin={handleLogin} />} />
          <Route
            path="/register"
            element={<Register setToken={setToken} setRole={setRole} />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {role === "patient" && (
          <>
            <Route path="/calculator" element={<Calculator token={token} />} />
            <Route path="/history" element={<History token={token} />} />
          </>
        )}

        <Route
          path="/profile"
          element={<Profile token={token} role={role} />}
        />

        {role === "doctor" && (
          <>
            <Route path="/patients" element={<Patients token={token} />} />
            <Route
              path="/patients/:id"
              element={<PatientProfile token={token} />}
            />
          </>
        )}

        <Route path="*" element={<Navigate to="/profile" />} />
      </Routes>

      <BottomNav role={role} onLogout={logout} />
    </BrowserRouter>
  );
}

export default App;
