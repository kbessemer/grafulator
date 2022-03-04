// GRAFULATOR
// Last Modified: March 3, 2022
// Authored and Developed by: Kyle Bessemer
// LinkedIn: https://www.linkedin.com/in/kyle-bessemer-606a7a1b2/
// GitHub: https://github.com/kbessemer

import React from 'react';
import { Box, LinearProgress } from '@mui/material';
import AlertSnackbar from './components/alerts/AlertSnackbar';
import PermanentDrawerRight from "./components/Drawer";
import SERVERIP from './constants';

// MyPassword component
function MyPassword() {

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
      setMyState({Loading: true})
      // Verify all fields have been filled out
      if (formPass === "" || formNewPass === "" || formNewPass2 === "") {
        setMyState({Loading: false, FieldsError: true})
        setTimeout(() => setMyState({FieldsError: false}), 3000);
        return
      }
      // Verify passwords match
      if (formNewPass != formNewPass2) {
        setMyState({Loading: false, PasswordMismatch: true})
        event.preventDefault();
        setTimeout(() => setMyState({PasswordMismatch: false}), 3000);
        return
    }
      var url = SERVERIP + 'mypassword';
      // Fetch request to backend
      fetch(url, {
        method: 'post',
        body: JSON.stringify(passBody),
        headers: {
            'Authorization': localStorage.getItem('session-id')
          },
      }).then(response => response.json())
      .then(json => {
        // On success response
        if (json.Success) {
          setMyState({Loading: false, Success: true})
          setTimeout(() => setMyState({Success: false}), 3000);
        } else {
          // On error response - bad password
          if (json.Error === "Bad password") {
            setMyState({Loading: false, PasswordError: true})
            setTimeout(() => setMyState({PasswordError: false}), 3000);
          // On error response - bad token
          } else if (json.Error === "Bad token") {
              setMyState({Loading: false, SessionError: true})
              setTimeout(() => setMyState({SessionError: false}), 3000);
          }
        }
      });
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
      <div>
        <div className="logo">
          <img src="images/logo.png"></img>
        </div>
        <PermanentDrawerRight />
        {myState.FieldsError ? <AlertSnackbar open={true} message="All fields required!" severity="error"/> : null}
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
                <input type="submit" value="SUBMIT" onClick={PasswordPost}/>
            </li>
          </ul>
        </form>

      </div>
    )
  }

  export default MyPassword;