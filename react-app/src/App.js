import logo from './opteev_logo.png';
import React from 'react';
import './App.css';
import LoginForm from './components/LoginForm';
import Dashboard from './Dashboard';
import Users from './Users';
import SignOut from './SignOut';
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <img src={logo} width="470" height="85" alt="logo" />
          <br></br><br></br>
        </header>
        <body className="App-header">
          <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/signout" element={<SignOut />} />
          </Routes>
        </body>
      </div>
    </Router>
  );
}

export default App;
