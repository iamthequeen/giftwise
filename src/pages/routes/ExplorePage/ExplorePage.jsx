import { Box, Grid, Typography, List, ListItem, ListItemText, ListItemButton, useTheme, Stack, Chip, Alert } from '@mui/material';
import React, {useState, useEffect, useContext} from 'react';
import ProfilesList from "../../../components/ProfilesList/ProfilesList"
import Header from '../../../components/Header/Header';
import { UserContext } from "../../../utils/UserContext";
import {Link} from 'react-router-dom'


function ExplorePage() {

    const theme = useTheme()

    const { guestUser } = useContext(UserContext)

    useEffect(() => {
      window.scrollTo(0,0)
    }, [])
    
    

    return (
        <>
        <Header/>
        <Box
        component="main" 
    sx={{
      padding: "6rem 0",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      minHeight: "100vh",
      textAlign: "center",
      background: theme.palette.lightGrayPrimary.main,
    }}
    
        >
        <Grid container justifyContent="center"
alignItems="center" direction="column" spacing={4}>
{guestUser && <Alert severity="error">Please <Link
 style={{
              color: "rgb(95, 33, 32)"
            }}
            to="/signup">create an account</Link> to save your details.</Alert>
}
<Grid item><Typography component="h1" variant="h3"
 sx={{
    textDecoration: "underline",
 }}
 >Explore</Typography></Grid>
<Grid item> 
 <ProfilesList/> 
</Grid>

        </Grid>
        </Box>
        </>
    )
}

export default ExplorePage;