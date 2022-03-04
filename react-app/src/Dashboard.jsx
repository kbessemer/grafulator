// GRAFULATOR
// Last Modified: March 3, 2022
// Authored and Developed by: Kyle Bessemer
// LinkedIn: https://www.linkedin.com/in/kyle-bessemer-606a7a1b2/
// GitHub: https://github.com/kbessemer

import React from 'react';
import UploadFile from "./components/UploadFile";
import PermanentDrawerRight from "./components/Drawer";

// Dashboard component
function Dashboard() {
  // Return statement, consists of the logo, navigation drawer, and uploadfile component
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
