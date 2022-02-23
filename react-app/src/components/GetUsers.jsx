import React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { LinearProgress } from '@mui/material';
import AlertSnackbar from './alerts/AlertSnackbar';
import Tooltip from '@mui/material/Tooltip';
import SERVERIP from '../constants.js';

function GetUsers() {

    const [userList, setUserList] = React.useState([]);
    const [myState, setMyState] = React.useState({});

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

    function DeleteUserPost(username) {
      setMyState({Loading: true})
      var url = SERVERIP + 'deleteuser';
      fetch(url, {
        method: 'post',
        body: JSON.stringify({
          username: username,
        }),
        headers: {
          'Authorization': localStorage.getItem('session-id')
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
      }).then(response => response.json())
      .then(json => {
        if (json.Success) {
          setMyState({UserDeleted: true, Loading: false});
          GetUserList();
          setTimeout(() => setMyState({UserDeleted: false}), 3000);
        } else {
            if (json.Error === "Bad token") {
              setMyState({SessionError: true, Loading: false})
              setTimeout(() => setMyState({SessionError: false}), 3000);
              return
            }
        }
      });
    }
    
    function AddUser() {
      const [open, setOpen] = React.useState(false);
      const handleOpen = () => setOpen(true);
      const handleClose = () => setOpen(false);
      const [formUser, setFormUser] = React.useState("");
      const [formPass, setFormPass] = React.useState("");
      const [formPass2, setFormPass2] = React.useState("");
    
      var addBody = {
        username: formUser,
        password: formPass
      };
    
      function AddUserPost(event) {
        setMyState({Loading: true})
        if (formPass != formPass2) {
            handleClose();
            setMyState({PasswordMismatch: true, Loading: false});
            event.preventDefault();
            setTimeout(() => setMyState({PasswordMismatch: false}), 3000);
            return
        }
        var url = SERVERIP + 'newuser';
        fetch(url, {
          method: 'post',
          body: JSON.stringify(addBody),
          headers: {
            'Authorization': localStorage.getItem('session-id')
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
        }).then(response => response.json())
        .then(json => {
          if (json.Success) {
            handleClose();
            setMyState({UserAdded: true, Loading: false});
            GetUserList()
            setTimeout(() => setMyState({UserAdded: false}), 3000);
          } else {
              if (json.Error === "User exists") {
                handleClose();
                setMyState({UserExists: true, Loading: false})
                setTimeout(() => setMyState({UserExists: false}), 3000);
                return
              } else if (json.Error === "Bad token") {
                handleClose();
                setMyState({SessionError: true, Loading: false})
                setTimeout(() => setMyState({SessionError: false}), 3000);
                return
              }
          }
        });
    
        event.preventDefault();
      }
    
      function handleUser(event) {
        setFormUser(event.target.value);
      }
    
      function handlePass(event) {
        setFormPass(event.target.value);
      }
    
      function handlePass2(event) {
        setFormPass2(event.target.value);
      }

      return (
        <div>
          {myState.PasswordMismatch ? <AlertSnackbar open={true} message="Passwords do not match!" severity="error"/> : null}
          {myState.UserExists ? <AlertSnackbar open={true} message="User already exists!" severity="error"/> : null}
          {myState.SessionError ? <AlertSnackbar open={true} message="Session has expired! Login again" severity="error"/> : null}
          {myState.UserDeleted ? <AlertSnackbar open={true} message="User deleted!" severity="success"/> : null}
          {myState.UserAdded ? <AlertSnackbar open={true} message="User added!" severity="success"/> : null}
          <input className="add-user" type="submit" value="ADD USER" onClick={handleOpen}/>
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
                    <input type="submit" value="ADD USER" onClick={AddUserPost}/>
                </li>
              </ul>
            </form>
          </Box>
          </Modal>
        </div>
      );
    }

    React.useEffect(() => {
        GetUserList();
      }, [])

    function GetUserList() {
      var url = SERVERIP + 'getusers';
      fetch(url, {
          headers: {
            'Authorization': localStorage.getItem('session-id')
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
          .then(res => res.json())
          .then(
            (result) => {
              setUserList(result.Data);
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (error) => {
              console.log(error);
            }
          )
      return
    }

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

    return (
        <div>
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