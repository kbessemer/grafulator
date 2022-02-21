import logo from './opteev_logo.png';
import React from 'react';
import './App.css';
import LoginForm from './components/LoginForm';
import Dashboard from './Dashboard';
import Users from './Users';
import MyPassword from './MyPassword';
import SignOut from './SignOut';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <img src={logo} width="470" height="85" alt="logo" />
        </header>
        <body className="App-header">
        <p> </p>
          <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/mypassword" element={<MyPassword />} />
            <Route path="/signout" element={<SignOut />} />
          </Routes>
        </body>
      </div>
    </Router>
  );
}

export default App;
