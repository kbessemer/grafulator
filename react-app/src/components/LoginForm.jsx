import React from 'react';
import { useNavigate } from "react-router-dom";
import { Box, LinearProgress } from '@mui/material';
import AlertSnackbar from './alerts/AlertSnackbar';
import { Buffer } from 'buffer'

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
      fetch('http://192.168.1.94:8081/login', {
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
  
    return (
      <div>
        {myState.PasswordError ? <AlertSnackbar open={true} message="Incorrect password!" severity="error"/> : null}
        {myState.UserError ? <AlertSnackbar open={true} message="User not found!" severity="error"/> : null}
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