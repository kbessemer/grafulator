import React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { LinearProgress } from '@mui/material';
import AlertSnackbar from './alerts/AlertSnackbar';

function GetUsers() {

    const [userList, setUserList] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isDeleteLoading, setIsDeleteLoading] = React.useState(false);
    const [isSessionError, setIsSessionError] = React.useState(false);
    const [isSuccessDeleted, setIsSuccessDeleted] = React.useState();
    const [isSuccessAdded, setIsSuccessAdded] = React.useState();

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
      setIsSuccessDeleted(false);
      setIsSuccessAdded(false);
      setIsDeleteLoading(true);
      setIsSessionError(false);
      fetch('http://192.168.1.94:8081/deleteuser', {
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
          setIsDeleteLoading(false);
          setIsSuccessDeleted(true);
          GetUserList();
        } else {
            if (json.Error === "Bad token") {
              setIsDeleteLoading(false);
              setIsSessionError(true)
              return
            }
            setIsDeleteLoading(false);
        }
      });
    }
    
    function AddUser() {
      const [open, setOpen] = React.useState(false);
      const handleOpen = () => setOpen(true);
      const handleClose = () => setOpen(false);
      const [isPasswordError, setIsPasswordError] = React.useState(false);
      const [isExistsError, setIsExistsError] = React.useState(false);
      const [formUser, setFormUser] = React.useState("");
      const [formPass, setFormPass] = React.useState("");
      const [formPass2, setFormPass2] = React.useState("");
    
      var addBody = {
        username: formUser,
        password: formPass
      };
    
      function AddUserPost(event) {
        if (isSuccessAdded) {
          setIsSuccessAdded(!isSuccessAdded);
        }
        if (isSuccessDeleted) {
          setIsSuccessDeleted(!isSuccessDeleted);
        }
        if (isExistsError) {
          setIsExistsError(!isExistsError);
        }
        if (isPasswordError) {
          setIsPasswordError(!isPasswordError);
        }
        if (isSessionError) {
          setIsSessionError(!isSessionError);
        }
        if (formPass != formPass2) {
            handleClose();
            setIsLoading(false);
            setIsPasswordError(true);
            event.preventDefault();
            return
        }
        fetch('http://192.168.1.94:8081/newuser', {
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
            setIsSuccessAdded(true);
            GetUserList()
          } else {
              if (json.Error === "User exists") {
                handleClose();
                setIsExistsError(true)
                return
              } else if (json.Error === "Bad token") {
                handleClose();
                setIsSessionError(true)
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
          {isPasswordError ? <AlertSnackbar open={true} message="Passwords do not match!" severity="error"/> : null}
          {isExistsError ? <AlertSnackbar open={true} message="User already exists!" severity="error"/> : null}
          {isSessionError ? <AlertSnackbar open={true} message="Session has expired! Login again" severity="error"/> : null}
          {isSuccessDeleted ? <AlertSnackbar open={true} message="User deleted!" severity="success"/> : null}
          {isSuccessAdded ? <AlertSnackbar open={true} message="User added!" severity="success"/> : null}
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
                    <label htmlFor="username">User</label>
                    <input type="text" name="username" maxLength="100" value={formUser} onChange={handleUser}/>
                    <span>Enter the username here</span>
                </li>
                <li>
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" maxLength="100" value={formPass} onChange={handlePass}/>
                    <span>Enter the password here</span>
                </li>
                <li>
                    <label htmlFor="password verify">Verify Password</label>
                    <input type="password" name="password verify" maxLength="100" value={formPass2} onChange={handlePass2}/>
                    <span>Re-enter the password here</span>
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
      fetch("http://192.168.1.94:8081/getusers", {
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
            <form className="form-style-8">
              <ul>
                <li>
                    <label htmlFor="myFilter">Search</label>
                    <input type="text" id="myFilter" onKeyUp={FilterTable}/>
                    <span>Filter the user list here</span>
                </li>
                <li>
                </li>
              </ul>
            </form>
            {isDeleteLoading ? <Box sx={{ width: '100%' }}>
                <div><LinearProgress /><br></br></div>
              </Box> : null}
            {isLoading ? <Box sx={{ width: '100%' }}>
                <div><LinearProgress /><br></br></div>
              </Box> : null}
            <AddUser />
            <br></br>
            <table id="UserTable">
              <tr>
                <th>Username</th>
                <th>Last Login</th>
                <th>Delete</th>
              </tr>
              {userList.map((user, index) => { return ( <tr key={index}><td>{user.username}</td><td>{user.LastLogin}</td><td><input className="delete-user" value="" type="submit" onClick={() => DeleteUserPost(user.username)}/></td></tr>)})}
            </table>
        </div>
    )
}

export default GetUsers