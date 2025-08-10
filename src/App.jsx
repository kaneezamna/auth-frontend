import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

export default function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [profile, setProfile] = useState(null);
  const [mode, setMode] = useState("login");

  const backendURL = import.meta.env.VITE_BACKEND_URL;

  function register(e) {
    e.preventDefault();
    axios.post(`${backendURL}/register`, { name, email, password })
      .then(() => {
        alert("Registered!");
        setMode("login");
      });
  }

  function login(e) {
    e.preventDefault();
    axios.post(`${backendURL}/login`, { email, password })
      .then(res => {
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
      })
      .catch(() => alert("Invalid credentials"));
  }

  function getProfile() {
    axios.get(`${backendURL}/profile`, { headers: { Authorization: token } })
      .then(res => setProfile(res.data));
  }

  function logout() {
    localStorage.removeItem("token");
    setToken("");
    setProfile(null);
  }

  useEffect(() => {
    if (token) getProfile();
  }, [token]);

  return (
    <div className="app-container">
      <div className="card">
        {!token ? (
          <>
            <h2>{mode === "login" ? "Login" : "Register"}</h2>
            <form onSubmit={mode === "login" ? login : register}>
              {mode === "register" && (
                <input type="text" placeholder="Name" onChange={e => setName(e.target.value)} required />
              )}
              <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} required />
              <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required />
              <button type="submit">{mode === "login" ? "Login" : "Register"}</button>
            </form>
            <p>
              {mode === "login" ? (
                <>
                  Don't have an account?{" "}
                  <span className="link" onClick={() => setMode("register")}>Register</span>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <span className="link" onClick={() => setMode("login")}>Login</span>
                </>
              )}
            </p>
          </>
        ) : (
          <>
            <h2>Welcome, {profile?.name}</h2>
            <p>{profile?.email}</p>
            <button className="logout" onClick={logout}>Logout</button>
          </>
        )}
      </div>
    </div>
  );
}
