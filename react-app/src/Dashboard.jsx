import React from 'react';
import UploadFile from "./components/UploadFile";
import PermanentDrawerRight from "./components/Drawer";


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
