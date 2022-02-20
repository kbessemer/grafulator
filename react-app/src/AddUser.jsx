import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Alert from '@mui/material/Alert';
import { LinearProgress } from '@mui/material';
import PasswordMismatch from './components/alerts/PasswordMismatch';
import UserExists from './components/alerts/UserExists';
import SessionError from './components/alerts/Session';

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

export default function AddUser() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isPasswordError, setIsPasswordError] = React.useState(false);
  const [isExistsError, setIsExistsError] = React.useState(false);
  const [isSessionError, setIsSessionError] = React.useState(false);
  const [formUser, setFormUser] = React.useState("");
  const [formPass, setFormPass] = React.useState("");
  const [formPass2, setFormPass2] = React.useState("");

  var addBody = {
    username: formUser,
    password: formPass
  };

  function AddUserPost(event) {
    setIsLoading(true);
    setIsExistsError(false)
    setIsPasswordError(false)
    setIsSessionError(false)
    if (formPass != formPass2) {
        handleClose();
        setIsLoading(false);
        setIsPasswordError(true);
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
        setIsLoading(false);
        window.location.reload();
      } else {
          if (json.Error === "User exists") {
            handleClose();
            setIsLoading(false);
            setIsExistsError(true)
            return
          } else if (json.Error === "Bad token") {
            handleClose();
            setIsLoading(false);
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
      {isPasswordError ? <PasswordMismatch open={true}/> : null}
      {isExistsError ? <UserExists open={true}/> : null}
      {isSessionError ? <SessionError open={true}/> : null}
        <br></br>
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
                <input type="text" name="username" maxLength="100" value={formUser} onChange={handleUser}/>
                <span>Enter the username here</span>
            </li>
            <li>
                <input type="password" name="password" maxLength="100" value={formPass} onChange={handlePass}/>
                <span>Enter the password here</span>
            </li>
            <li>
                <input type="password" name="password verify" maxLength="100" value={formPass2} onChange={handlePass2}/>
                <span>Re-enter the password here</span>
            </li>
            <li>
                <input type="submit" value="ADD USER" onClick={AddUserPost}/>
            </li>
          </ul>
          {isLoading ? <Box sx={{ width: '100%' }}>
            <LinearProgress />
          </Box> : null}
        </form>
      </Box>
      </Modal>
    </div>
  );
}