import React, {useState, useContext, useEffect} from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import { Grid, useTheme } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Image } from 'mui-image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import ConfirmLogoutModal from "../ConfirmLogoutModal/ConfirmLogoutModal"
import { UserContext } from "../../utils/UserContext"
import { auth } from "../../utils/firebaseSetup"
import { PROFILE_TYPES } from '../../utils/constants'


const drawerWidth = 240;
const navItemsIfSignedOut = [
  {
    id: 1,
    name: 'Create Account',
    link: '/createaccount',
  },
  {
    id: 2,
    name: 'Log In',
    link: '/login',
  }, ];

  

  const navItemsIfGuest = [
  {
    id: 1,
    name: 'My Guest Account',
    link: '/profile/guest',
  }
  ,
  {
    id: 2,
    name: 'Explore',
    link: '/explore',
  },
  {
    id: 3,
    name: 'Log In',
    link: '/login',
  }, 
  {
    id: 4,
    name: 'Log Out',
    link: '/logout',
  },
  ];

function Header(props) {
    const { window } = props

    const {currentUser, guestUser,
    handleOpenModal, setViewingUser} = useContext(UserContext)

    const navItemsIfSignedIn = [
  {
    id: 1,
    name: 'My Account',
    link: `/profile/${auth?.currentUser?.uid}`,
  },
  {
    id: 2,
    name: 'Explore',
    link: '/explore',
  },
 {
    id: 3,
    name: 'Log Out',
    link: '/logout',
  },
   ];

    const [currentNav, setCurrentNav] = useState(navItemsIfSignedOut)


    const navigate = useNavigate()
    const location = useLocation()



useEffect(() => {
    // (auth?.currentUser || guestUser) ? setCurrentNav(navItemsIfSignedIn) : setCurrentNav(navItemsIfSignedOut)

    if (auth?.currentUser) {
    setCurrentNav(navItemsIfSignedIn)
} else if (guestUser) {
    setCurrentNav(navItemsIfGuest)
} else {
    setCurrentNav(navItemsIfSignedOut)
}


}, [currentUser, guestUser])


    const theme = useTheme()
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center',  }}>
<Box
sx={{
    paddingTop: "1rem",
}}
>
    <img src="/images/giftwise-logo.png" alt="" width="200" height="80" />
    </Box>
      <Typography variant="h6" sx={{ my: 2 }}>
      <Link to="/" style={{
              textDecoration: "none",
              color: "#000"
            }}>
            GiftWise
            </Link>
      </Typography>
      <List>
        {currentNav.map((item) => (
          <ListItem key={item.id}
          sx={{
            justifyContent: "center",
            WebkitJustifyContent: "center",
            "&:hover": {
            bgcolor: theme.palette.aquaPrimary.light,
         } }}
          >
          <Link to={item.name !== "Log Out" ? item.link : ""}
          onClick={(() => {
                if (item.name === "Log Out") {
                handleOpenModal()
                }

                if (item.name === "My Account") {
                    setViewingUser({
            uid: auth?.currentUser?.uid,
            profileType: PROFILE_TYPES.CURRENT
            })
                }

                if (item.name === "My Guest Account") {
                    setViewingUser({
            uid: "guest",
            profileType: PROFILE_TYPES.GUEST
            })
                }
            })}
            style={{
                color: "#000",
                textDecoration: "none",
            }}
          >
              <ListItemText primary={item.name} />
            </Link>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar component="nav"
      sx={{
        bgcolor: "transparent",
        boxShadow: "none",
        position: "absolute",
      }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: location.pathname !== "/myaccount" && { sm: 'none' } }}
          >
            <FontAwesomeIcon icon={faBars} color="#000" size="xl" />
          </IconButton>
          
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: location.pathname === "/myaccount" ? "none" : { xs: 'none', sm: 'block' } }}
          >
            <Link to="/" style={{
              textDecoration: "none",
              color: theme.palette.blackPrimary.main,
            }}>
            GiftWise
            </Link>
          </Typography>
          
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {currentNav.map((item) => (
              <Link to={item.name !== "Log Out" ? item.link : ""} key={item.id} 
              onClick={(() => {
                  if (item.name === "Log Out") {
                handleOpenModal()
                }

                if (item.name === "My Account") {
                    setViewingUser({
            uid: auth?.currentUser?.uid,
            profileType: PROFILE_TYPES.CURRENT
            })
                }

                if (item.name === "My Guest Account") {
                    setViewingUser({
            uid: "guest",
            profileType: PROFILE_TYPES.GUEST
            })
                }

                
            })}
               >
                <Button variant="text" sx={{ color: theme.palette.blackPrimary.main, marginRight: "0.5rem", border: `1px solid ${theme.palette.blackPrimary.main}`, }}
                 >
                
                {item.name}
              </Button>
              </Link>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="nav"
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <ConfirmLogoutModal/>
    </Box>
  );
}
export default Header;