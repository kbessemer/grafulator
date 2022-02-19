import React from 'react';
import './App.css';
import { useNavigate } from "react-router-dom";

function LoginForm() {

    const [formUser, setFormUser] = React.useState("");
    const [formPass, setFormPass] = React.useState("");
    const [isLoginLoading, setIsLoginLoading] = React.useState(false);
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    let navigate = useNavigate();
  
    var loginBody = {
      username: formUser,
      password: formPass
    };
  
    function LoginPost(event) {
      setIsLoginLoading(true);
      fetch('http://192.168.1.94:8081/login', {
        method: 'post',
        body: JSON.stringify(loginBody)
      }).then(response => response.json())
      .then(json => {
        if (json.Success) {
          console.log("Logged In!");
          setIsLoginLoading(false);
          setIsLoggedIn(true);
          navigate("../dashboard", { replace: true });
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
        </form>
      </div>
    )
  }

  export default LoginForm;