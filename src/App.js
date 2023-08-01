import React, { useContext, useEffect } from "react";
import { Box, Button, ButtonGroup, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { UserContext } from "./utils/UserContext";
import { auth } from "./utils/firebaseSetup";
import LoadingScreen from "./components/ui/LoadingScreen/LoadingScreen";
import AboutMeList from "./pages/AboutMeList/AboutMeList"
import LogoutPage from "./pages/routes/LogoutPage/LogoutPage"
import LandingPage from "./pages/routes/LandingPage/LandingPage"
import ProfilePage from "./pages/routes/ProfilePage/ProfilePage"
import { Route, Routes } from 'react-router-dom'
import LoginForm from "./components/LoginForm/LoginForm";
import SignupForm from "./components/SignupForm/SignupForm";
import ErrorPage from "./pages/routes/ErrorPage/ErrorPage";
import SignupProcess from "./pages/routes/SignupProcess/SignupProcess";
import ProtectLogout from "./pages/routes/ProtectLogout/ProtectLogout";
import ProtectedRoute from "./pages/routes/ProtectedRoute/ProtectedRoute";
import ProtectSignup from "./pages/routes/ProtectSignup/ProtectSignup";
import {useLocation} from 'react-router-dom'
import UpdateProfile from "./pages/UpdateProfile/UpdateProfile";
import ExplorePage from "./pages/routes/ExplorePage/ExplorePage";


function App() {

    const {
        currentUser, viewingUser,
    } = useContext(UserContext)


    const theme = createTheme({
         typography: {
      button: {
        fontWeight: 400,
        textTransform: "none",
      },
    },
        components: {
      MuiButton: {
        defaultProps: {
          variant: "contained",
          disableElevation: true,
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            color: "#000",
          },
        },
      },
      MuiIcon: {
        styleOverrides: {
          root: {
            width: "40px",
            height: "40px",
          },
        },
      },
    //   MuiBottomNavigationAction: {
    //     styleOverrides: {
    //       root: {
    //         '& .Mui-selected': {
    //       color: '#655FB1',
    //     },
    //       },
    //     },
    //   },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            transition: "none",
            "&:hover": {
              backgroundColor: "#090c9b",
            },
          },
        },
      },
    },
        palette: {
            mode: "light",
            // giftwise palette:
            lightGrayPrimary: {
                main: "#e7e7e7",
                contrastText: "#000"
            },
            oliveGreenPrimary: {
                light: "#B3AD94",
                main: "#837d5d",
                dark: "#5F5A44",
                contrastText: "#fff",
            },
            blackPrimary: {
                main: "#000",
                contrastText: "#FFF",
            },
            whitePrimary: {
                main: "#FFF",
                contrastText: "#000"
            },
           lightYellowPrimary: {
                main: "#fefae0",
                contrastText: "#000"
            },
            orangePrimary: {
                light: "#ECD6C1",
                main: "#D4A373",
                dark: "#AC7035",
                darker: "#8c5c28",
                contrastText: "#000"
            },
            lightGreenPrimary: {
                light: "#EEF1E4",
                main: "#CCD5AE",
                dark: "#A2B36B",
                darker: "#8fa253",
                contrastText: "#000",
            },
            aquaPrimary: {
                light: "#90DEDF",
                main: "#39C3C6",
                dark: "#257D7E",
                darker: "#1c5e5f",
                contrastText: "#000",
            },
            lightBrownPrimary: {
                light: "#DFD4CE",
                main: "#B49A8C",
                dark: "#886959",
                darker: "#6f5649",
                contrastText: "#000",
            },
            lightPinkPrimary: {
                light: "#FEEDEB",
                main: "#FCB9B2",
                dark: "#F97162",
                darker: "#F73B26",
                contrastText: "#000"
            },
            // faithflow palette:
            whiteSecondary: {
                main: "#FFECE0",
                contrastText: "#000"
            },
            bluePrimary: {
                main: "rgba(186, 207, 255, 0.74)",
                contrastText: "#000"
            },
            lightBluePrimary: {
                main: "#A5C8E4",
                contrastText: "#000"
            },
            darkBluePrimary: {
                main: "#655FB1",
                contrastText: "#fff"
            },
            darkBlueSecondary: {
                main: "#0E133C",
                light: "#26339e",
                contrastText: "#fff"
            },
            darkGrayPrimary: {
                main: "#454545",
                contrastText: "#fff"
            },
            darkGraySecondary: {
                main: "#787878",
                dark: "#2f2f2f",
                contrastText: "#fff"
            },
            whiteTertiary: {
                main: "#F6F6F6",
                contrastText: "#000"
            },
            lightBlueSecondary: {
                dark: "#0E133C",
                main: "#26339e",
                contrastText: "#fff"
            },
            redPrimary: {
                main: "#FF0000",
                contrastText: "#000"
            },
            yellowPrimary: {
                main: "#FFDF02",
                contrastText: "#000",
            },
            beigePrimary: {
              main: "#f4eed7",
              contrastText: "#000",
          },
            text: {
        primary:"#000"
      },
        }
    })



  return (
    <ThemeProvider theme={theme}>
     <CssBaseline>
        <Box
          sx={{
            position: "absolute",
            display: "flex",
            flexDirection: "column",
            left: 0,
            top: 0,
            minHeight: "100vh",
            width: "100vw",
            background: "#000",
          }}
        >

  <Routes>
         

<Route exact={true} path="/" element={<LandingPage />}/> 
             <Route path="/explore" element={
             <ProtectedRoute>
            <ExplorePage />
            </ProtectedRoute>}/>       
         
         <Route path="/login" element={<LoginForm/>} />

         <Route path="/logout" element={
            <ProtectLogout>
            <LogoutPage/>
            </ProtectLogout>} />

            <Route path="/createaccount" element={<SignupProcess/>} />

                        <Route path="/signup" element={<ProtectSignup>
                            <SignupForm/>
                            </ProtectSignup>} />

           

<Route path="/profile/:profileId" element={
            <ProtectedRoute>
            <ProfilePage/>
            </ProtectedRoute>} />

            <Route path="/settings" element={
            <ProtectedRoute>
            <ProfilePage/>
            </ProtectedRoute>} />

         <Route path="*" element={<ErrorPage />}/>

         </Routes>
         
        </Box>
        </CssBaseline>
    </ThemeProvider>
  );
}

export default App;