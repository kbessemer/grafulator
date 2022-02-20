import logo from './opteev_logo.png';
import React from 'react';
import './App.css';
import GetUsers from "./GetUsers";
import UploadFile from "./UploadFile";
import PermanentDrawerRight from "./Drawer";


function Dashboard() {
  return (
    <div>
      <div className="App">
        <header className="App-header">
          <PermanentDrawerRight />
          <UploadFile />
        </header>
      </div>
    </div>
  );
}

export default Dashboard;
