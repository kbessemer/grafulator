import React from 'react';
import PermanentDrawerRight from "./components/Drawer";
import GetUsers from './components/GetUsers';
import AddUser from './AddUser';

function Users() {

  return (
    <div>
        <PermanentDrawerRight />
        <AddUser />
        <h3>User List:</h3>
        <GetUsers />
    </div>
    )
}

export default Users