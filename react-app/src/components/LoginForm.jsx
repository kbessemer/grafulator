import React from 'react';
import { useNavigate } from "react-router-dom";
import { Box, LinearProgress } from '@mui/material';
import AlertSnackbar from './alerts/AlertSnackbar';
import { Buffer } from 'buffer';
import SERVERIP from '../constants.js';

function LoginForm() {

    const utf8 = require('utf8');
    const [formUser, setFormUser] = React.useState("");
    const [formPass, setFormPass] = React.useState("");
    const [myState, setMyState] = React.useState({});
    let navigate = useNavigate();
  
    var loginBody = {
      username: formUser,
      password: formPass
    };
  
    function LoginPost(event) {
      setMyState({Loading: true});
      let user = 'kyle';
      let pass = 'bessemer!';
      let auth = 'Basic ' + new Buffer(user + ':' + pass).toString('base64')
      console.log(auth);
      var url = SERVERIP + 'login';
      fetch(url, {
        method: 'post',
        body: JSON.stringify(loginBody),
        headers: {
          'Authorization': auth
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
      }).then(response => response.json())
      .then(json => {
        if (json.Success) {
          localStorage.setItem('session-id', json.Token);
          console.log("Logged In!");
          navigate("../dashboard", { replace: true });
        } else {
          if (json.Error === "Bad password") {
            setMyState({Loading: false, PasswordError: true});
            setTimeout(() => setMyState({PasswordError: false}), 3000);
          } else if (json.Error === "No user found") {
            setMyState({Loading: false, UserError: true});
            setTimeout(() => setMyState({UserError: false}), 3000);
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

    React.useEffect(() => {
      AutoLogin();
    }, [])

    function AutoLogin() {
      var token = localStorage.getItem('session-id');
      if (token != null) {
        setMyState({Loading: true, tryLogin: true})
        var url = SERVERIP + 'autologin';
        fetch(url, {
            headers: {
              'Authorization': token
              // 'Content-Type': 'application/x-www-form-urlencoded',
            },
          })
            .then(res => res.json())
            .then(
              (result) => {
                if (result.Success) {
                  setMyState({Loading: false, tryLogin: false})
                  navigate("../dashboard", { replace: true });
                } else {
                  setMyState({Loading: false, tryLogin: false, autoLoginFail: true})
                  setTimeout(() => setMyState({autoLoginFail: false}), 3000);
                }
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
    }
  
    return (
      <div>
        {myState.PasswordError ? <AlertSnackbar open={true} message="Incorrect password!" severity="error"/> : null}
        {myState.UserError ? <AlertSnackbar open={true} message="User not found!" severity="error"/> : null}
        {myState.tryLogin ? <AlertSnackbar open={true} message="Trying to restore previous login session..." severity="warning"/> : null}
        {myState.autoLoginFail ? <AlertSnackbar open={true} message="Could not restore previous session! Login again" severity="error"/> : null}
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
    )
  }

  export default LoginForm;