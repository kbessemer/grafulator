import React from 'react';
import './App.css';
import { Box, LinearProgress } from '@mui/material';
import AlertSnackbar from './components/alerts/AlertSnackbar';
import PermanentDrawerRight from "./components/Drawer";

function LoginForm() {

    const [formPass, setFormPass] = React.useState("");
    const [formNewPass, setFormNewPass] = React.useState("");
    const [formNewPass2, setFormNewPass2] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const [isPasswordError, setIsPasswordError] = React.useState(false);
    const [isPassMismatchError, setIsPassMismatchError] = React.useState(false);
    const [isSuccess, setIsSuccess] = React.useState(false);
    const [isSessionError, setIsSessionError] = React.useState(false);
  
    var passBody = {
      password: formPass,
      newPassword: formNewPass,
      session: localStorage.getItem('session-id')
    };
  
    function PasswordPost(event) {
      setIsPasswordError(false);
      setIsPassMismatchError(false);
      setIsSuccess(false);
      setIsLoading(true);
      if (formNewPass !== formNewPass2) {
        setIsLoading(false);
        setIsPassMismatchError(true);
        event.preventDefault();
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
            setIsSuccess(true);
            setIsLoading(false);
        } else {
          if (json.Error === "Bad password") {
            setIsPasswordError(true);
            setIsLoading(false);
          } else if (json.Error === "Bad token") {
              setIsSessionError(true);
              setIsLoading(false);
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
        {isPasswordError ? <AlertSnackbar open={true} message="Incorrect password!" severity="error"/> : null}
        {isPassMismatchError ? <AlertSnackbar open={true} message="New passwords do not match!" severity="error"/> : null}
        {isSessionError ? <AlertSnackbar open={true} message="Session has expired! Login again" severity="error"/> : null}
        {isSuccess ? <AlertSnackbar open={true} message="Password changed!" severity="success"/> : null}
        {isLoading ? <Box sx={{ width: '100%' }}>
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