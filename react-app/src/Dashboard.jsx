import React from 'react';
import UploadFile from "./components/UploadFile";
import PermanentDrawerRight from "./components/Drawer";


function Dashboard() {
  return (
    <div>
      <div className="logo">
        <img src="images/opteev_logo.png" width="235" height="42" alt="logo" />
      </div>
      <PermanentDrawerRight />
      <UploadFile />
    </div>
  );
}

export default Dashboard;
