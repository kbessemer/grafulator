import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import InfoIcon from '@mui/icons-material/Info';
import MoreIcon from '@mui/icons-material/MoreVert';
import GroupIcon from '@mui/icons-material/Group';
import HomeIcon from '@mui/icons-material/Home';
import CoronavirusIcon from '@mui/icons-material/Coronavirus';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ModalUnstyled from '@mui/base/ModalUnstyled';
import { useNavigate, Link } from "react-router-dom";
import SettingsIcon from '@mui/icons-material/Settings';
import Tooltip from '@mui/material/Tooltip';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import BadgeUnstyled from '@mui/base/BadgeUnstyled';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

export default function MyAppBar(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
    const [searchResults, setSearchResults] = React.useState([]);
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    let navigate = useNavigate();
    const [adminStatus, setAdminStatus] = React.useState(false);
    const [superStatus, setSuperStatus] = React.useState(false);
    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    React.useEffect(() => {
      
    }, [])
  
    const handleProfileMenuOpen = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleMobileMenuClose = () => {
      setMobileMoreAnchorEl(null);
    };
  
    const handleMenuClose = () => {
      setAnchorEl(null);
      handleMobileMenuClose();
    };
  
    const handleMobileMenuOpen = (event) => {
      setMobileMoreAnchorEl(event.currentTarget);
    };

    const StyledBadge = styled(BadgeUnstyled)`
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      color: props.theme2 === false ? '#358d1c9e' : '#aeff98';
      font-size: 14px;
      font-variant: tabular-nums;
      list-style: none;
      font-feature-settings: 'tnum';
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
        'Helvetica Neue', Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
        'Segoe UI Symbol';
      position: relative;
      display: inline-block;
      line-height: 1;

      & .MuiBadge-badge {
        z-index: auto;
        min-width: 20px;
        height: 20px;
        padding: 0 6px;
        color: #fff;
        font-weight: 400;
        font-size: 12px;
        line-height: 20px;
        white-space: nowrap;
        text-align: center;
        background: #ff4d4f;
        border-radius: 10px;
        box-shadow: 0 0 0 1px #fff;
      }

      & .MuiBadge-dot {
        padding: 0;
        z-index: auto;
        min-width: 6px;
        width: 6px;
        height: 6px;
        background: #ff4d4f;
        border-radius: 100%;
        box-shadow: 0 0 0 1px #fff;
      }

      & .MuiBadge-anchorOriginTopRight {
        position: absolute;
        top: 0;
        right: 0;
        transform: translate(50%, -50%);
        transform-origin: 100% 0;
      }
    `;

    const MaterialUISwitch = styled(Switch)(({ theme }) => ({
      width: 62,
      height: 34,
      padding: 7,
      '& .MuiSwitch-switchBase': {
        margin: 1,
        padding: 0,
        transform: 'translateX(6px)',
        '&.Mui-checked': {
          color: '#fff',
          transform: 'translateX(22px)',
          '& .MuiSwitch-thumb:before': {
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
              '#000',
            )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
          },
          '& + .MuiSwitch-track': {
            opacity: 1,
            backgroundColor: props.theme2 === false ? '#abb8cf' : '#3e434c',
          },
        },
      },
      '& .MuiSwitch-thumb': {
        backgroundColor: props.theme2 === false ? '#5994FF' : '#5994FF',
        width: 32,
        height: 32,
        '&:before': {
          content: "''",
          position: 'absolute',
          width: '100%',
          height: '100%',
          left: 0,
          top: 0,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
            '#fff',
          )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
        },
      },
      '& .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: props.theme2 === false ? '#abb8cf' : '#3e434c',
        borderRadius: 20 / 2,
      },
    }));

  function AdminStatus() {
    if (localStorage.getItem('admin') === 'true') {
      setAdminStatus(true);
    } else {
      setAdminStatus(false);
    }

    if (localStorage.getItem('super') === 'true') {
      setSuperStatus(true);
    } else {
      setSuperStatus(false);
    }    
  }

  function BadgeContent() {
    return (
      <Box
        component="span"
        sx={{
          width: 42,
          height: 42,
          borderRadius: '2px',
          background: '#eee',
          display: 'inline-block',
          verticalAlign: 'middle',
        }}
      />
    );
  }
  
    const menuId = 'primary-search-account-menu';
    const renderMenu = (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        id={menuId}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={isMenuOpen}
        onClose={handleMenuClose}
      >
        <Link style={{ textDecoration: "none", color: "#5994FF"}} to="/signout">
          <MenuItem onClick={handleMenuClose}>Sign Out</MenuItem>
        </Link>
      </Menu>
    );
  
    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
      <Menu
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        id={mobileMenuId}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={isMobileMenuOpen}
        onClose={handleMobileMenuClose}
      >
        <MenuItem>
          <IconButton size="large" color="primary">
            <GroupIcon/>
          </IconButton>
        </MenuItem>
        <MenuItem onClick={handleProfileMenuOpen}>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            color="primary"
          >
            <AccountCircle />
          </IconButton>
          <p>Profile</p>
        </MenuItem>
      </Menu>
    );
  
    return (
      <Box sx={{ flexGrow: 1 }}>
        <AppBar sx={{
            bgcolor: props.theme2 === false ? '#7d8697' : '#1d1f23',
          }}
          position="static">
          <Toolbar>
            GRAFULATOR
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Link style={{ textDecoration: "none" }} to="/dashboard">
                <Tooltip title="Dashboard">
                  <IconButton size="large" color="primary">
                    <HomeIcon />
                  </IconButton>
                </Tooltip>
              </Link>
              <Link style={{ textDecoration: "none" }} to="/about">
                <Tooltip title="About">
                  <IconButton size="large" color="primary">
                    <InfoIcon />
                  </IconButton>
                </Tooltip>
              </Link>
              <Tooltip title="Settings">
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="primary"
                >
                  <SettingsIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </Box>
            <div className="left-indent">
            <Tooltip title="Toggle Theme">
              <FormControlLabel
                control={<MaterialUISwitch sx={{ m: 1 }} onChange={props.setTheme} checked={props.theme2} />}
                label=""
              />
            </Tooltip>
            </div>
          </Toolbar>
        </AppBar>
        {renderMenu}
      </Box>
    );
  }