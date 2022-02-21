import React from 'react';
import './App.css';
import { Box, LinearProgress } from '@mui/material';
import AlertSnackbar from './components/alerts/AlertSnackbar';
import PermanentDrawerRight from "./components/Drawer";

function LoginForm() {

    const [formPass, setFormPass] = React.useState("");
    const [formNewPass, setFormNewPass] = React.useState("");
    const [formNewPass2, setFormNewPass2] = React.useState("");
    const [myState, setMyState] = React.useState({});
  
    var passBody = {
      password: formPass,
      newPassword: formNewPass,
      session: localStorage.getItem('session-id')
    };
  
    function PasswordPost(event) {
      setMyState({Loading: true})
      if (formNewPass != formNewPass2) {
        setMyState({Loading: false, PasswordMismatch: true})
        event.preventDefault();
        setTimeout(() => setMyState({PasswordMismatch: false}), 3000);
        return
    }
      fetch('http://192.168.1.94:8081/mypassword', {
        method: 'post',
        body: JSON.stringify(passBody),
        headers: {
            'Authorization': localStorage.getItem('session-id')
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
      }).then(response => response.json())
      .then(json => {
        if (json.Success) {
          setMyState({Loading: false, Success: true})
            setTimeout(() => setMyState({Success: false}), 3000);
        } else {
          if (json.Error === "Bad password") {
            setMyState({Loading: false, PasswordError: true})
            setTimeout(() => setMyState({PasswordError: false}), 3000);
          } else if (json.Error === "Bad token") {
              setMyState({Loading: false, SessionError: true})
              setTimeout(() => setMyState({SessionError: false}), 3000);
          }
        }
      });
  
      event.preventDefault();
    }
  
    function handlePass(event) {
      setFormPass(event.target.value);
    }

    function handleNewPass(event) {
        setFormNewPass(event.target.value);
    }

    function handleNewPass2(event) {
        setFormNewPass2(event.target.value);
    }
  
    return (
      <div>
        <PermanentDrawerRight />
        {myState.PasswordError ? <AlertSnackbar open={true} message="Incorrect password!" severity="error"/> : null}
        {myState.PasswordMismatch ? <AlertSnackbar open={true} message="New passwords do not match!" severity="error"/> : null}
        {myState.SessionError ? <AlertSnackbar open={true} message="Session has expired! Login again" severity="error"/> : null}
        {myState.Success ? <AlertSnackbar open={true} message="Password changed!" severity="success"/> : null}
        {myState.Loading ? <Box sx={{ width: '100%' }}>
                <LinearProgress />
              </Box> : null}
        <form className="form-style-7">
          <ul>
            <li>
                <label htmlFor="password">Current Password</label>
                <input type="password" name="password" maxLength="100" value={formPass} onChange={handlePass}/>
                <span>Enter your current password here</span>
            </li>
            <li>
                <label htmlFor="new password">New Password</label>
                <input type="password" name="new password" maxLength="100" value={formNewPass} onChange={handleNewPass}/>
                <span>Enter your new password here</span>
            </li>
            <li>
                <label htmlFor="verify new password">Verify New Password</label>
                <input type="password" name="verify new password" maxLength="100" value={formNewPass2} onChange={handleNewPass2}/>
                <span>Re-enter your new password here</span>
            </li>
            <li>
                <input type="submit" value="SUBMIT" onClick={PasswordPost}/>
            </li>
          </ul>
        </form>

      </div>
    )
  }

  export default LoginForm;