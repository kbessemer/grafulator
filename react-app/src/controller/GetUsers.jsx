// GRAFULATOR
// Last Modified: March 3, 2022
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
      GetUserList();
    }, [])

    // Function for deleting a user
    function DeleteUserPost(username) {
      setMyState({Loading: true})
      var url = SERVERIP + 'deleteuser';
      var token = localStorage.getItem('session-id')
      // Make backend api call
      fetch(url, {
        method: 'post',
        body: JSON.stringify({
          username: username,
          Token: token,
        }),
        headers: {
          'Authorization': token
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
      }).then(response => response.json())
      .then(json => {
        // On success message
        if (json.Success) {
          setMyState({UserDeleted: true, Loading: false});
          GetUserList();
          setTimeout(() => setMyState({UserDeleted: false}), 3000);
        } else {
            // If response is bad token
            if (json.Error === "Bad token") {
              setMyState({SessionError: true, Loading: false})
              setTimeout(() => setMyState({SessionError: false}), 3000);
              return
            // If user tries to delete themselves
            } else if (json.Error === "Can not delete self") {
              setMyState({DeleteSelfError: true, Loading: false})
              setTimeout(() => setMyState({DeleteSelfError: false}), 3000);
            }
        }
      });
    }
    
    // Function for adding a user
    function AddUser() {
      // React hooks
      const [open, setOpen] = React.useState(false);
      const handleOpen = () => setOpen(true);
      const handleClose = () => setOpen(false);
      const [formUser, setFormUser] = React.useState("");
      const [formPass, setFormPass] = React.useState("");
      const [formPass2, setFormPass2] = React.useState("");
    
      // Body of backend api call
      var addBody = {
        username: formUser,
        password: formPass
      };
    
      // Backend api call
      function AddUserPost(event) {
        event.preventDefault();
        setMyState({Loading: true})
        // Verify all fields have been filled out
        if (formUser === "" || formPass === "" || formPass2 === "") {
          setMyState({Loading: false, FieldsError: true})
          setTimeout(() => setMyState({FieldsError: false}), 3000);
          return
        }
        // Verify passwords match
        if (formPass != formPass2) {
            handleClose();
            setMyState({PasswordMismatch: true, Loading: false});
            event.preventDefault();
            setTimeout(() => setMyState({PasswordMismatch: false}), 3000);
            return
        }
        var url = SERVERIP + 'newuser';
        // Fetch to backend api
        fetch(url, {
          method: 'post',
          body: JSON.stringify(addBody),
          headers: {
            'Authorization': localStorage.getItem('session-id')
          },
        }).then(response => response.json())
        .then(json => {
          // On success response
          if (json.Success) {
            handleClose();
            setMyState({UserAdded: true, Loading: false});
            GetUserList()
            setTimeout(() => setMyState({UserAdded: false}), 3000);
          } else {
              // On responose - user exists
              if (json.Error === "User exists") {
                handleClose();
                setMyState({UserExists: true, Loading: false})
                setTimeout(() => setMyState({UserExists: false}), 3000);
                return
              // On response - bad token
              } else if (json.Error === "Bad token") {
                handleClose();
                setMyState({SessionError: true, Loading: false})
                setTimeout(() => setMyState({SessionError: false}), 3000);
                return
              }
          }
        });
      }
    
      // Handlers for add user form input
      function handleUser(event) {
        setFormUser(event.target.value);
      }
      function handlePass(event) {
        setFormPass(event.target.value);
      }
      function handlePass2(event) {
        setFormPass2(event.target.value);
      }

      // Return statement for add user, consists of alerts and a modal popup
      return (
        <div>
          {myState.FieldsError ? <AlertSnackbar open={true} message="All fields required!" severity="error"/> : null}
          {myState.PasswordMismatch ? <AlertSnackbar open={true} message="Passwords do not match!" severity="error"/> : null}
          {myState.UserExists ? <AlertSnackbar open={true} message="User already exists!" severity="error"/> : null}
          {myState.SessionError ? <AlertSnackbar open={true} message="Session has expired! Login again" severity="error"/> : null}
          {myState.DeleteSelfError ? <AlertSnackbar open={true} message="You can not delete yourself!" severity="error"/> : null}
          {myState.UserDeleted ? <AlertSnackbar open={true} message="User deleted!" severity="success"/> : null}
          {myState.UserAdded ? <AlertSnackbar open={true} message="User added!" severity="success"/> : null}
          <div className="Add-User-Button">
            <button onClick={handleOpen} className="dropbtn">ADD USER</button>
          </div>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="add new user"
            aria-describedby="adds a new user to the application"
          >
          <Box sx={{ ...style}}>
            <form className="form-style-7">
              <ul>
                <li>
                    <label htmlFor="username">Username</label>
                    <input type="text" name="username" maxLength="100" value={formUser} onChange={handleUser}/>
                </li>
                <li>
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" maxLength="100" value={formPass} onChange={handlePass}/>
                </li>
                <li>
                    <label htmlFor="password verify">Verify Password</label>
                    <input type="password" name="password verify" maxLength="100" value={formPass2} onChange={handlePass2}/>
                </li>
                <li>
                    <button onClick={AddUserPost} className="dropbtn">ADD USER</button>
                </li>
              </ul>
            </form>
          </Box>
          </Modal>
        </div>
      );
    }

    // Function for fetching the user list from the backend
    function GetUserList() {
      var url = SERVERIP + 'getusers';
      // Backend api call
      fetch(url, {
          headers: {
            'Authorization': localStorage.getItem('session-id')
          },
        })
          .then(res => res.json())
          .then(
            (result) => {
              // On success response
              if (result.Success) {
                setUserList(result.Data);
              } else {
                // On response - bad token
                if (result.Error == "Bad token") {
                  setMyState({SessionError: true})
                  setTimeout(() => setMyState({SessionError: false}), 3000);
                  return
                }
              }
            },
            (error) => {
              console.log(error);
            }
          )
      return
    }

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
            <AddUser />
            <br></br>
            <table id="UserTable">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Last Login</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {userList.map((user, index) => { return ( <tr key={index}><td>{user.username}</td><td>{user.LastLogin}</td><td><Tooltip title="Delete User"><a onClick={() => DeleteUserPost(user.username)} href="#"><img className="icon" src="images/delete.png"></img></a></Tooltip></td></tr>)})}
              </tbody>
            </table>
        </div>
    )
}

export default GetUsers