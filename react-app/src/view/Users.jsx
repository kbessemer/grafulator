// GRAFULATOR
// Last Modified: March 3, 2022
// Authored and Developed by: Kyle Bessemer
// LinkedIn: https://www.linkedin.com/in/kyle-bessemer-606a7a1b2/
// GitHub: https://github.com/kbessemer

import React from 'react';
import MyAppBar from '../controller/AppBar';
import GetUsers from '../model/GetUsers';

// Users screen
function Users(props) {

  // Return statement, consists of a logo, navigation drawer, and getusers component
  return (
    <div>
        <MyAppBar setTheme={props.setTheme} theme={props.theme} theme2={props.theme2}/>
        <div className="dashboard">
          <GetUsers />
        </div>
    </div>
    )
}

export default Users