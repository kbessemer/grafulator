// GRAFULATOR
// Last Modified: March 3, 2022
// Authored and Developed by: Kyle Bessemer
// LinkedIn: https://www.linkedin.com/in/kyle-bessemer-606a7a1b2/
// GitHub: https://github.com/kbessemer

import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import LogoutIcon from '@mui/icons-material/Logout';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import InfoIcon from '@mui/icons-material/Info';
import { Link } from "react-router-dom";

// Setup drawer width
const drawerWidth = 240;

// Return a permanent navigation drawer on left side of screen
export default function PermanentDrawerRight() {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: '#1d1f23',
            color: "#fff"
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <List>
            {/* Dashboard link */}
            <Link style={{ textDecoration: "none", color: "white" }} to="/dashboard">
                <ListItem button key="dashboard">
                    <ListItemIcon>
                        <DashboardIcon style={{ color: "white" }}/>
                    </ListItemIcon>
                    <ListItemText primary="Dashboard" />
                </ListItem>
            </Link>

            {/* Users link */}
            <Link style={{ textDecoration: "none", color: "white" }} to="/users">
                <ListItem button key="users">
                    <ListItemIcon>
                        <GroupIcon style={{ color: "white" }}/>
                    </ListItemIcon>
                    <ListItemText primary="Users" />
                </ListItem>
            </Link>

            {/* My Password link */}
            <Link style={{ textDecoration: "none", color: "white" }} to="/mypassword">
                <ListItem button key="mypassword">
                    <ListItemIcon>
                        <VpnKeyIcon style={{ color: "white" }}/>
                    </ListItemIcon>
                    <ListItemText primary="My Password" />
                </ListItem>
            </Link>

            {/* About & Help link */}
            <Link style={{ textDecoration: "none", color: "white" }} to="/about">
                <ListItem button key="about">
                    <ListItemIcon>
                        <InfoIcon style={{ color: "white" }}/>
                    </ListItemIcon>
                    <ListItemText primary="About & Help" />
                </ListItem>
            </Link>

            {/* Sign Out link */}
            <Link style={{ textDecoration: "none", color: "white" }} to="/signout">
                <ListItem button key="signout">
                    <ListItemIcon>
                        <LogoutIcon style={{ color: "white" }}/>
                    </ListItemIcon>
                    <ListItemText primary="Sign Out" />
                </ListItem>
            </Link>

        </List>
      </Drawer>
    </Box>
  );
}