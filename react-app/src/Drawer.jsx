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
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from '@mui/material/styles';
import { Link } from "react-router-dom";

const drawerWidth = 240;

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
            bgcolor: "#1d1f23",
            color: "#fff"
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <List>
            <Link style={{ textDecoration: "none", color: "white" }} to="/dashboard">
                <ListItem button key="dashboard">
                    <ListItemIcon>
                        <DashboardIcon style={{ color: "white" }}/>
                    </ListItemIcon>
                    <ListItemText primary="Dashboard" />
                </ListItem>
            </Link>

            <Link style={{ textDecoration: "none", color: "white" }} to="/users">
                <ListItem button key="users">
                    <ListItemIcon>
                        <GroupIcon style={{ color: "white" }}/>
                    </ListItemIcon>
                    <ListItemText primary="Users" />
                </ListItem>
            </Link>

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