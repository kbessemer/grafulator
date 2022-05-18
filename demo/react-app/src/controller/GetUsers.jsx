// GRAFULATOR
// Last Modified: May 17, 2022
// Authored and Developed by: Kyle Bessemer
// LinkedIn: https://www.linkedin.com/in/kyle-bessemer-606a7a1b2/
// GitHub: https://github.com/kbessemer

import React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { LinearProgress } from '@mui/material';
import AlertSnackbar from '../controller/AlertSnackbar';
import Tooltip from '@mui/material/Tooltip';
import SERVERIP from '../constants.js';

// Users page component
function GetUsers() {

    // Setup react hooks
    const [userList, setUserList] = React.useState([]);
    const [myState, setMyState] = React.useState({});

    // Style for add user modal
    const style = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 600,
      bgcolor: '#1d1f23',
      border: '2px solid #2e363f',
      boxShadow: 24,
    };

    // Do this on screen load
    React.useEffect(() => {
      
    }, [])

    // Function for filtering the user list table (search)
    function FilterTable() {
      // Declare variables
      var input, filter, table, tr, td, i, txtValue;
      input = document.getElementById("myFilter");
      filter = input.value.toUpperCase();
      table = document.getElementById("UserTable");
      tr = table.getElementsByTagName("tr");
    
      // Loop through all table rows, and hide those who don't match the search query
      for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
          txtValue = td.textContent || td.innerText;
          if (txtValue.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = "";
          } else {
            tr[i].style.display = "none";
          }
        }
      }
    }

    // Return statement for add user screen, consists of a loading indicator, search box, AddUser function, and a user table
    return (
        <div className="Graph-List">
            <div className="Content-Header"><img class="Header-Icon" width="48px" height="48px" src="images/users.png"></img><h3>User Management</h3></div>
            {myState.Loading ? <Box sx={{ width: '100%' }}>
              <LinearProgress />
            </Box> : null}
            <form className="formStyle8">
              <ul>
                <li>
                    <label htmlFor="myFilter">Search</label>
                    <input type="text" id="myFilter" onKeyUp={FilterTable} placeholder="...by username"/>
                </li>
                <li>
                </li>
              </ul>
            </form>
            <br></br>
            <table id="UserTable">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Last Login</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>admin</td><td>-</td></tr>
              </tbody>
            </table>
        </div>
    )
}

export default GetUsers