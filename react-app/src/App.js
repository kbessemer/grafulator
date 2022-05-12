// GRAFULATOR
// Last Modified: March 3, 2022
// Authored and Developed by: Kyle Bessemer
// LinkedIn: https://www.linkedin.com/in/kyle-bessemer-606a7a1b2/
// GitHub: https://github.com/kbessemer

import React from 'react';
import LoginForm from './view/LoginForm';
import Dashboard from './view/Dashboard';
import Users from './view/Users';
import MyPassword from './controller/MyPassword';
import SignOut from './view/SignOut';
import About from './view/About';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { GlobalStyles } from "./globalStyles";
import { lightTheme, darkTheme } from "./Theme"
import { createTheme, ThemeProvider as ThemeProvider2 } from '@mui/material/styles';

// Main App function
function App() {

  // React hooks
  const [theme, setTheme] = React.useState('light');
  const [theme2, setTheme2] = React.useState('false');
  const [myState, setMyState] = React.useState({});

  // Do this on screen load
  React.useEffect(() => {
    var lsTheme = localStorage.getItem('theme');
    if (lsTheme === 'dark') {
      setTheme('dark');
      setTheme2(true);
    } else if (lsTheme === 'light') {
      setTheme('light');
      setTheme2(false);
    }
  }, [])

  const rTheme = createTheme({
    palette: {
      text: {
        primary: theme2 === false ? '#1d1f23' : '#7d8697',
        secondary: theme2 === false ? '#1d1f23' : '#7d8697',
      },
      primary: {
        main: theme2 === false ? '#1d1f23' : '#7d8697',
      },
      secondary: {
        main: '#000',
      },
    },
  });

  // Function for changing the theme to either dark or light
  function themeToggler() {
    if (theme === 'light') {
      setTheme('dark');
      localStorage.setItem('theme', 'dark');
      setTheme2(true);
    } else {
      setTheme('light');
      localStorage.setItem('theme', 'light');
      setTheme2(false);
    }
  }

  // Return statement for App function, sets up app theme, and the app router which defines URL's for additional pages
  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <GlobalStyles/>
      <Router>
        <ThemeProvider2 theme={rTheme}>
          <div className="App">
            <header className="App-header">
              <Routes>
                <Route path="/dashboard" element={<Dashboard setTheme={themeToggler} theme={theme} theme2={theme2}/>} />
                <Route path="/users" element={<Users setTheme={themeToggler} theme={theme} theme2={theme2}/>} />
                <Route path="/mypassword" element={<MyPassword setTheme={themeToggler} theme={theme} theme2={theme2}/>} />
                <Route path="/signout" element={<SignOut setTheme={themeToggler} theme={theme} theme2={theme2}/>} />
                <Route path="/about" element={<About setTheme={themeToggler} theme={theme} theme2={theme2}/>} />
              </Routes>
            </header>
          </div>
          <div class="login-screen">
            <Routes>
              <Route path="/" element={<LoginForm />} />
            </Routes>
          </div>
        </ThemeProvider2>
      </Router>
    </ThemeProvider>
  );
}

export default App;