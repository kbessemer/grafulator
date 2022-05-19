// GRAFULATOR
// Last Modified: May 17, 2022
// Authored and Developed by: Kyle Bessemer
// LinkedIn: https://www.linkedin.com/in/kyle-bessemer-606a7a1b2/
// GitHub: https://github.com/kbessemer

import React from 'react';
import { useNavigate } from "react-router-dom";
import { Box, LinearProgress } from '@mui/material';
import AlertSnackbar from '../controller/AlertSnackbar';
import { Buffer } from 'buffer';
import SERVERIP from '../constants.js';

// Login form component
function LoginForm() {

    // Setup variables and react hooks
    const [formUser, setFormUser] = React.useState("admin");
    const [formPass, setFormPass] = React.useState("p@$Sw0rD!@#");
    const [myState, setMyState] = React.useState({});
    let navigate = useNavigate();
  
    // Do this on screen load
    React.useEffect(() => {
      AutoLogin();
    }, [])

    // Body of login request
    var loginBody = {
      username: formUser,
      password: formPass
    };
  
    // Function for backend login api call
    function LoginPost(event) {
      event.preventDefault();
      setMyState({Loading: true});
      // Verify all fields have been filled out
      if (formUser === "" || formPass === "") {
        setMyState({Loading: false, FieldsError: true})
        setTimeout(() => setMyState({FieldsError: false}), 3000);
        return
      }
      // Setup basic auth
      let user = 'us3r!@#';
      let pass = 'jgJG0923)@lf.FKJ!@kfKJG)0#';
      let auth = 'Basic ' + new Buffer(user + ':' + pass).toString('base64')
      var url = SERVERIP + 'login';
      // Fetch request to backend
      fetch(url, {
        method: 'post',
        body: JSON.stringify(loginBody),
        headers: {
          'Authorization': auth
        },
      }).then(response => response.json())
      .then(json => {
        // On success response
        if (json.Success) {
          localStorage.setItem('session-id', json.Token);
          // Forward to dashboard screen
          navigate("../dashboard", { replace: true });
        } else {
          // On error response - bad password
          if (json.Error === "Bad password") {
            setMyState({Loading: false, PasswordError: true});
            setTimeout(() => setMyState({PasswordError: false}), 3000);
          // On error response - no user found
          } else if (json.Error === "No user found") {
            setMyState({Loading: false, UserError: true});
            setTimeout(() => setMyState({UserError: false}), 3000);
          }
        }
      });
    }
  
    // Handlers for login form input
    function handleUser(event) {
      setFormUser(event.target.value);
    }
    function handlePass(event) {
      setFormPass(event.target.value);
    }

    // This function checks the user's browser for a saved session id then sends a request to the backend
    // to see if the token is still valid, if valid the user is auto logged in
    function AutoLogin() {
      var token = localStorage.getItem('session-id');
      if (token != null || token == null) {
        setMyState({Loading: true, tryLogin: true})
        var url = SERVERIP + 'autologin';
        // Fetch to backend api
        fetch(url, {
            headers: {
              'Authorization': token
            },
          })
            .then(res => res.json())
            .then(
              (result) => {
                // On success response
                if (result.Success) {
                  setMyState({Loading: false, tryLogin: false})
                  // Forward to dashboard
                  navigate("../dashboard", { replace: true });
                } else {
                  // If not successful, notify the user they must login again
                  setMyState({Loading: false, tryLogin: false, autoLoginFail: true})
                  setTimeout(() => setMyState({autoLoginFail: false}), 3000);
                }
              },
              (error) => {
                console.log(error);
              }
            )
        return
      }
    }
  
    // Return statement for login form, consists of alerts, logo, a loading indicator, and a login form
    return (
      <div>
        <img src="images/logo.png" alt="logo" />
        {myState.FieldsError ? <AlertSnackbar open={true} message="All fields required!" severity="error"/> : null}
        {myState.PasswordError ? <AlertSnackbar open={true} message="Incorrect password!" severity="error"/> : null}
        {myState.UserError ? <AlertSnackbar open={true} message="User not found!" severity="error"/> : null}
        {myState.tryLogin ? <AlertSnackbar open={true} message="Trying to restore previous login session..." severity="warning"/> : null}
        {myState.autoLoginFail ? <AlertSnackbar open={true} message="Could not restore previous session! Login again" severity="error"/> : null}
        <div className="Login-Box">
          <form className="formStyle7">
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
                  <input type="submit" value="LOGIN" onClick={LoginPost}/>
              </li>
            </ul>
            {myState.Loading ? <Box sx={{ width: '100%' }}>
              <LinearProgress />
            </Box> : null}
          </form>
        </div>
      </div>
    )
  }

  export default LoginForm;