import React from 'react';
import PermanentDrawerRight from "./components/Drawer";
import GetUsers from './components/GetUsers';

function Users() {

  return (
    <div>
        <div className="logo">
          <img src="images/opteev_logo.png" width="235" height="42" alt="logo" />
        </div>
        <PermanentDrawerRight />
        <GetUsers />
    </div>
    )
}

export default Users