import React from 'react';
import PermanentDrawerRight from "./Drawer";
import GetUsers from './GetUsers';

function Users() {

  return (
    <div>
        <PermanentDrawerRight />
        <h3>User List:</h3>
        <GetUsers />
    </div>
    )
}

export default Users