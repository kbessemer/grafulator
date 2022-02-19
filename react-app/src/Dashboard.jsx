import logo from './opteev_logo.png';
import React from 'react';
import './App.css';
import GetUsers from "./GetUsers";
import UploadFile from "./UploadFile";


function Dashboard() {
  return (
    <div className="App">
      <header className="App-header">
        <UploadFile />
        <h3>User List:</h3>
        <GetUsers />
      </header>
    </div>
  );
}

export default Dashboard;
