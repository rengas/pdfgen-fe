import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

import Login  from './components/Login/Login';
import Register from "./components/Register/Register";
import Reset from "./components/Reset/Reset";
import Dashboard from "./components/Dashboard/Dashboard";
import AddDesign from "./components/AddDesign/AddDesign";
import { auth, logout } from "./config/firebase";
import './App.css';

function App() {
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (loading) return;
    // if (!user) return navigate("/");
    
    if (user) {
      console.log(user.accessToken);
    }
  }, [user, loading]);

  return (
    <div className="app">
      {
        user && <div className="app__header">
          <a href="javascript:void(0)" className="app__logout" onClick={logout}>Logout</a>
        </div>
      }
      <div className={`app__body ${user ? 'logged_in' : ''}`}>
        <Router>
          <Routes>
            <Route exact path="/" element={<Login />} />
            <Route exact path="/register" element={<Register />} />
            <Route exact path="/reset" element={<Reset />} />
            <Route exact path="/dashboard" element={<Dashboard />} />
            <Route exact path="/add-design" element={<AddDesign />} />
          </Routes>
        </Router>
      </div>
    </div>
  )
}

export default App
