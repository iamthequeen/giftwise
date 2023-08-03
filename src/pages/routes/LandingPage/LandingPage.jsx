import { Box, Grid, Typography, useTheme, Button,Paper, Avatar } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../utils/UserContext";
import Header from "../../../components/Header/Header"
import {Image} from "mui-image"
import {useLocation, useNavigate} from 'react-router-dom'
import LoadingScreen from "../../../components/ui/LoadingScreen/LoadingScreen";

 

function LandingPage() {


const { currentUser, guestUser } = useContext(UserContext)

useEffect(() => {
    window.scrollTo(0,0)
  }, [])

    const boxItemsData = [
        {
            id: 1,
            name: "Create Personal Profiles",
            description: "Easily store and manage important information about yourself, such as your clothing/shoe size, favorite color, favorite music, and more!",
        },
        {
            id: 2,
            name: "Customizable Privacy Settings",
            description: "Control who sees what by assigning different privacy levels to your contact groups, ensuring that each relationship remains as personal as you want it to be.",
        },
        {
            id: 3,
            name: "**Effortless Gift Recommendations",
            description: "Our intelligent system suggests thoughtful gift ideas based on your contacts' preferences, making gift shopping a breeze.",
        },
        {
            id: 4,
            name: "**Desired Gifts List and Favorite Shops",
            description: "Keep track of your own wish list and share your favorite shops and products with your contacts for seamless gift inspiration.",
        }
    ]

const theme = useTheme()
 
  return (
    <>
    <Header/> 
    <Box component="main" 
    sx={{
      padding: "7rem 1rem",
      minHeight: "100vh",
      textAlign: "center",
      background: theme.palette.lightGrayPrimary.main,
    }}
    >
    <Grid container alignItems="center"
    sx={{
        maxWidth: 980,
        [theme.breakpoints.up("md")]: {
            margin: "auto",
        }
    }}
     direction={{xs: "column-reverse", md: "row"}} spacing={2}  >

    <Grid item xs={6}
>
<Typography variant="h4" component="h1"
sx={{
    textAlign: "left",
    margin: "auto",
    fontWeight: 600,
    fontFamily: "serif",
    [theme.breakpoints.down("md")]: {
        textAlign: "center",
        maxWidth: "25rem"
    }
}}
>Simplify Gift Giving and Personal Connections</Typography>
<Typography variant="body1"
sx={{
    textAlign: "left",
    margin: "auto",
    color: theme.palette.darkGrayPrimary.main,
    [theme.breakpoints.down("md")]: {
        textAlign: "center",
        maxWidth: "20rem"
    }
}}
>Say goodbye to guesswork and let us help you discover the perfect gifts for your loved ones!</Typography>
<Button color="oliveGreenPrimary"
sx={{
    marginTop: "1rem",
    fontWeight: 500,
    fontSize: "1rem",
}}
>Get Started</Button>
</Grid>
      <Grid item xs={6}>
      <Image src="https://images.unsplash.com/photo-1673897969233-e706f4b522ed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=581&q=80" alt="" sx={{
        margin: 'auto',
  display: 'block',
  maxWidth: 400,
      }} />
      </Grid>

      </Grid>

<Grid container alignItems="center" justifyContent="center" direction="column" spacing={2} sx={{
    marginTop: "3rem",
}}>
<Grid item>
<Typography color="textPrimary" component="h2" variant="body1"
sx={{
    color: theme.palette.oliveGreenPrimary.main,
    fontWeight: 600,
}}
>Our job is to help you:</Typography>
</Grid>
   <Grid item xs={6}
>
<Typography variant="h5" component="h3"
sx={{
    textAlign: "center",
    margin: "auto",
    fontWeight: 600,
    fontFamily: "serif",

}}
>Break free from the stress of gift shopping.</Typography>
<Typography variant="body1"
sx={{
    margin: "auto",
    color: theme.palette.darkGrayPrimary.main,
        textAlign: "center",
        maxWidth: "30rem",
}}
>GiftWise takes the anxiety out of finding the perfect gifts by offering personalized recommendations tailored to your loved ones' tastes. Enjoy a stress-free gifting experience.</Typography>
</Grid>
<Grid container item alignItems={{xs: "center", sm: "center",md: "stretch"}} justifyContent="center" direction={{xs: "column", sm: "column", md: "row"}} spacing={2}>
{boxItemsData.map((item) => (
          <Grid
            item
            xs={3}
            // xs={12}
            // md={3.5}
            // minHeight={300}
            key={item.id}
          >
          <Paper
          sx={{
            p: 3,
            minHeight: "15rem",
            textAlign: "left",
            // maxHeight: "30rem",
             borderRadius: "0.6rem",
             "&:hover": {
                bgcolor: theme.palette.oliveGreenPrimary.main,
                color: theme.palette.oliveGreenPrimary.contrastText,
             },
             [theme.breakpoints.down("md")]: {
        textAlign: "center",
        maxWidth: "20rem",
        minHeight: "10rem",
    }
          }}
          >
           <Typography component="h3" variant="h6"
           >{item.name}</Typography>
            <Typography variant="body2">{item.description}</Typography>
            </Paper>
          </Grid>
        ))}
</Grid>
      
      <Grid item>
      <Typography>** = Coming soon!</Typography>
      </Grid>
 </Grid>
{/* <TestimonialsCarousel/> */}

    </Box>
    </>
  );
}

export default LandingPage;
