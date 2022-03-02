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