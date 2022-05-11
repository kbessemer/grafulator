// GRAFULATOR
// Last Modified: March 3, 2022
// Authored and Developed by: Kyle Bessemer
// LinkedIn: https://www.linkedin.com/in/kyle-bessemer-606a7a1b2/
// GitHub: https://github.com/kbessemer

import React from 'react';
import UploadFile from "../model/UploadFile";
import MyAppBar from '../controller/AppBar';

// Dashboard component
function Dashboard(props) {
  // Return statement, consists of the logo, navigation drawer, and uploadfile component
  return (
    <div>
      <MyAppBar setTheme={props.setTheme} theme={props.theme} theme2={props.theme2}/>
      <div className="dashboard">
        <UploadFile />
      </div>
    </div>
  );
}

export default Dashboard;
