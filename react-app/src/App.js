import logo from './opteev_logo.png';
import React from 'react';
import './App.css';
import LoginForm from './LoginForm';
import Dashboard from './Dashboard';
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <img src={logo} width="945" height="170" alt="logo" />
          <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
