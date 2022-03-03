// GRAFULATOR
// Last Modified: March 3, 2022
// Authored and Developed by: Kyle Bessemer
// LinkedIn: https://www.linkedin.com/in/kyle-bessemer-606a7a1b2/
// GitHub: https://github.com/kbessemer

import React from 'react';
import PermanentDrawerRight from "./components/Drawer";
import GetUsers from './components/GetUsers';

function Users() {

  return (
    <div>
        <div className="logo">
          <img src="images/logo.png"></img>
        </div>
        <PermanentDrawerRight />
        <GetUsers />
    </div>
    )
}

export default Users