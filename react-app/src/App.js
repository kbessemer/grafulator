import logo from './opteev_logo.png';
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
import moon from './moon.png';
import light from './light.png';

function App() {
  
  const [theme, setTheme] = React.useState('dark');
  const themeToggler = () => {
    theme === 'light' ? setTheme('dark') : setTheme('light')
  }

  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <GlobalStyles/>
      <Router>
        <div className="App">
          <header className="App-header">
            <img src={logo} width="470" height="85" alt="logo" />
            {theme === 'dark' ? <a onClick={themeToggler}><img src={light}/></a> : <a onClick={themeToggler}><img src={moon}/></a>}
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
