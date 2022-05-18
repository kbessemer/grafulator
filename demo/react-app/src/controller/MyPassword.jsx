// GRAFULATOR
// Last Modified: May 17, 2022
// Authored and Developed by: Kyle Bessemer
// LinkedIn: https://www.linkedin.com/in/kyle-bessemer-606a7a1b2/
// GitHub: https://github.com/kbessemer

import React from 'react';
import { Box, LinearProgress } from '@mui/material';
import AlertSnackbar from './AlertSnackbar';
import MyAppBar from './AppBar';
import SERVERIP from '../constants';

// MyPassword component
function MyPassword(props) {

    // React hooks
    const [formPass, setFormPass] = React.useState("");
    const [formNewPass, setFormNewPass] = React.useState("");
    const [formNewPass2, setFormNewPass2] = React.useState("");
    const [myState, setMyState] = React.useState({});
  
    // Request body
    var passBody = {
      password: formPass,
      newPassword: formNewPass,
      session: localStorage.getItem('session-id')
    };
  
    // Function for changing password, sends request to backend
    function PasswordPost(event) {
      event.preventDefault();
      setMyState({Loading: false, DisabledError: true})
      setTimeout(() => setMyState({DisabledError: false}), 3000);
      return
    }
  
    // Handlers for change password form input
    function handlePass(event) {
      setFormPass(event.target.value);
    }
    function handleNewPass(event) {
      setFormNewPass(event.target.value);
    }
    function handleNewPass2(event) {
      setFormNewPass2(event.target.value);
    }
  
    // Return statement for mypassword component, consists of alerts and a change password form
    return (
      props.myState.isUploaded
        ? <div className="Content-Box-Password-Uploaded">
            <div className="Graph-List">
              <div className="Content-Header"><img width="48px" height="48px" className="icon" src="images/lock.png"></img><h3>Password Management</h3></div>
              {myState.FieldsError ? <AlertSnackbar open={true} message="All fields required!" severity="error"/> : null}
              {myState.DisabledError ? <AlertSnackbar open={true} message="Disabled in demo version!" severity="error"/> : null}
              {myState.PasswordError ? <AlertSnackbar open={true} message="Incorrect password!" severity="error"/> : null}
              {myState.PasswordMismatch ? <AlertSnackbar open={true} message="New passwords do not match!" severity="error"/> : null}
              {myState.SessionError ? <AlertSnackbar open={true} message="Session has expired! Login again" severity="error"/> : null}
              {myState.Success ? <AlertSnackbar open={true} message="Password changed!" severity="success"/> : null}
              {myState.Loading ? <Box sx={{ width: '100%' }}>
                      <LinearProgress />
                    </Box> : null}
              <form className="formStyle8">
                <ul>
                  <li>
                      <label htmlFor="password">Current Password</label>
                      <input type="password" name="password" maxLength="100" value={formPass} onChange={handlePass}/>
                  </li>
                  <li>
                      <label htmlFor="new password">New Password</label>
                      <input type="password" name="new password" maxLength="100" value={formNewPass} onChange={handleNewPass}/>
                  </li>
                  <li>
                      <label htmlFor="verify new password">Verify New Password</label>
                      <input type="password" name="verify new password" maxLength="100" value={formNewPass2} onChange={handleNewPass2}/>
                  </li>
                  <li>
                      <button onClick={PasswordPost} className="dropbtn">SUBMIT</button>
                  </li>
                </ul>
              </form>
            </div>
          </div>
        : <div className="Content-Box-Password">
             <div className="Graph-List">
             <div className="Content-Header"><img class="Header-Icon" width="48px" height="48px" src="images/lock.png"></img><h3>Password Management</h3></div>
              {myState.FieldsError ? <AlertSnackbar open={true} message="All fields required!" severity="error"/> : null}
              {myState.DisabledError ? <AlertSnackbar open={true} message="Disabled in demo version!" severity="error"/> : null}
              {myState.PasswordError ? <AlertSnackbar open={true} message="Incorrect password!" severity="error"/> : null}
              {myState.PasswordMismatch ? <AlertSnackbar open={true} message="New passwords do not match!" severity="error"/> : null}
              {myState.SessionError ? <AlertSnackbar open={true} message="Session has expired! Login again" severity="error"/> : null}
              {myState.Success ? <AlertSnackbar open={true} message="Password changed!" severity="success"/> : null}
              {myState.Loading ? <Box sx={{ width: '100%' }}>
                      <LinearProgress />
                    </Box> : null}
              <form className="formStyle8">
                <ul>
                  <li>
                      <label htmlFor="password">Current Password</label>
                      <input type="password" name="password" maxLength="100" value={formPass} onChange={handlePass}/>
                  </li>
                  <li>
                      <label htmlFor="new password">New Password</label>
                      <input type="password" name="new password" maxLength="100" value={formNewPass} onChange={handleNewPass}/>
                  </li>
                  <li>
                      <label htmlFor="verify new password">Verify New Password</label>
                      <input type="password" name="verify new password" maxLength="100" value={formNewPass2} onChange={handleNewPass2}/>
                  </li>
                  <li>
                      <button onClick={PasswordPost} className="dropbtn">SUBMIT</button>
                  </li>
                </ul>
              </form>
            </div>
          </div>
    )
  }

  export default MyPassword;