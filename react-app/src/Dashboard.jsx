import React from 'react';
import UploadFile from "./components/UploadFile";
import PermanentDrawerRight from "./components/Drawer";


function Dashboard() {
  return (
    <div>
      <div className="logo">
        <img src="images/logo.png"></img>
      </div>
      <PermanentDrawerRight />
      <UploadFile />
    </div>
  );
}

export default Dashboard;
