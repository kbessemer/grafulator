import React from 'react';
import './App.css';
import LoginForm from './components/LoginForm';
import Dashboard from './Dashboard';
import Users from './Users';
import MyPassword from './MyPassword';
import SignOut from './SignOut';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { GlobalStyles } from "./globalStyles";
import { lightTheme, darkTheme } from "./Theme"
import Tooltip from '@mui/material/Tooltip';

function App() {

  const [theme, setTheme] = React.useState('light');
  const [myState, setMyState] = React.useState({});

  function themeToggler() {
    if (theme === 'light') {
      setTheme('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      setTheme('light');
      localStorage.setItem('theme', 'light');
    }
  }

  React.useEffect(() => {
    var lsTheme = localStorage.getItem('theme');
    if (lsTheme === 'dark') {
      setTheme('dark');
    } else if (lsTheme === 'light') {
      setTheme('light');
    }
  }, [])

  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <GlobalStyles/>
      <Router>
        <div className="App">
          <header className="App-header">
            <div className="logo">
              <img src="images/opteev_logo.png" width="235" height="42" alt="logo" />
              <span className="theme">
                {theme === 'dark' ? <Tooltip title="Light Theme"><a onClick={themeToggler} href="#"><img src="images/light.png"/></a></Tooltip> : <Tooltip title="Dark Theme"><a onClick={themeToggler} href="#"><img className="moon" src="images/moon.png"/></a></Tooltip>}
              </span>
            </div>
            <p> </p>
            <Routes>
              <Route path="/" element={<LoginForm />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/users" element={<Users />} />
              <Route path="/mypassword" element={<MyPassword />} />
              <Route path="/signout" element={<SignOut />} />
            </Routes>
          </header>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
