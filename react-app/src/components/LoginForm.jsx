import React from 'react';
import '../App.css';
import { useNavigate } from "react-router-dom";
import { Box, LinearProgress } from '@mui/material';
import AlertSnackbar from './alerts/AlertSnackbar';

function LoginForm() {

    const [formUser, setFormUser] = React.useState("");
    const [formPass, setFormPass] = React.useState("");
    const [isLoginLoading, setIsLoginLoading] = React.useState(false);
    const [isPasswordError, setIsPasswordError] = React.useState(false);
    const [isUserError, setIsUserError] = React.useState(false);
    let navigate = useNavigate();
  
    var loginBody = {
      username: formUser,
      password: formPass
    };
  
    function LoginPost(event) {
      setIsPasswordError(false);
      setIsUserError(false);
      setIsLoginLoading(true);
      fetch('http://192.168.1.94:8081/login', {
        method: 'post',
        body: JSON.stringify(loginBody)
      }).then(response => response.json())
      .then(json => {
        if (json.Success) {
          localStorage.setItem('session-id', json.Token);
          console.log("Logged In!");
          navigate("../dashboard", { replace: true });
        } else {
          if (json.Error === "Bad password") {
            setIsPasswordError(true);
            setIsLoginLoading(false);
          } else if (json.Error === "No user found") {
            setIsUserError(true);
            setIsLoginLoading(false);
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
        {isPasswordError ? <AlertSnackbar open={true} message="Incorrect password!" severity="error"/> : null}
        {isUserError ? <AlertSnackbar open={true} message="User not found!" severity="error"/> : null}
        <form className="form-style-7">
          <ul>
            <li>
                <label htmlFor="username">Username</label>
                <input type="text" name="username" maxLength="100" value={formUser} onChange={handleUser}/>
                <span>Enter your username here</span>
            </li>
            <li>
                <label htmlFor="password">Password</label>
                <input type="password" name="password" maxLength="100" value={formPass} onChange={handlePass}/>
                <span>Enter your password here</span>
            </li>
            <li>
                <input type="submit" value="LOGIN" onClick={LoginPost}/>
            </li>
          </ul>
          {isLoginLoading ? <Box sx={{ width: '100%' }}>
            <LinearProgress />
          </Box> : null}
        </form>

      </div>
    )
  }

  export default LoginForm;