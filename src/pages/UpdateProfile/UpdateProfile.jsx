import React, {useState, useEffect, useContext} from "react";
import { Box, Grid, Typography, useTheme, Button, TextField, ButtonGroup, Chip, Stack, Alert, AlertTitle } from "@mui/material";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faCheck, faX } from "@fortawesome/free-solid-svg-icons";
import { fullTraitsList, fullInterestsList, fullProfessionsList } from "../../utils/data";
import { UserContext } from "../../utils/UserContext";
import {useLocation} from 'react-router-dom'
import { FORM_STEPS } from "../../utils/constants";
import { db } from "../../utils/firebaseSetup";
import { doc, onSnapshot, query, where, collection, updateDoc, runTransaction, getDoc, getDocs, deleteDoc, setDoc } from "firebase/firestore";



function UpdateProfile(props){
    const {setIsUpdateLoading, setSuccessAlert, pageData, setPageData} = props
    const theme = useTheme()

     const [expanded, setExpanded] = useState("");

     const location = useLocation()

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const { currentUser, guestUser, personalTraits, setPersonalTraits,
    personalInterests, setPersonalInterests, 
personalProfessions, setPersonalProfessions,setFormStep, unsubTraits} = useContext(UserContext)


const handleTraitsUpdate = async () => {
    setIsUpdateLoading(true)
    const docRef = doc(db, `users/${currentUser.uid}`);

try {
    await updateDoc(docRef, {
        personalTraits,
        personalInterests,
        personalProfessions,
    })

    setSuccessAlert("success")
} catch (err) {
    console.error(err)
    setSuccessAlert("fail")
}

unsubTraits()
setPageData({
    ...pageData,
    personalTraits,
    personalInterests,
    personalProfessions
})
}

    


const handleChipClick = (listTitle, chipTitle, arrayName) => {
    switch(listTitle){ 
        case "Personality Traits":
        !arrayName.includes(chipTitle) ?
        setPersonalTraits((prev) => [...prev,chipTitle]) : setPersonalTraits((prev) => prev.filter((val) => val !== chipTitle));
        break;
        case "Interests/Hobbies":
        !arrayName.includes(chipTitle) ?
        setPersonalInterests((prev) => [...prev,chipTitle]) : setPersonalInterests((prev) => prev.filter((val) => val !== chipTitle));
        break;
        case "Professions":
        !arrayName.includes(chipTitle) ?
        setPersonalProfessions((prev) => [...prev,chipTitle]) : setPersonalProfessions((prev) => prev.filter((val) => val !== chipTitle));
        break;
        default:
        console.error("There's been an error!")
    }
}

    const accordionsInfo = [
        {
            id: 1,
            title: "Personality Traits",
            bgcolor: theme.palette.orangePrimary.main,
            buttonColor: theme.palette.orangePrimary.dark,
            list: fullTraitsList,
            arrayState: personalTraits,
        },
        {
            id: 2,
            title: "Interests/Hobbies",
            bgcolor: theme.palette.lightGreenPrimary.main,
            buttonColor: theme.palette.lightGreenPrimary.dark,
            list: fullInterestsList,
            arrayState: personalInterests,
        },
        {
            id: 3,
            title: "Professions",
            bgcolor: theme.palette.aquaPrimary.main,
            buttonColor: theme.palette.aquaPrimary.dark,
            list: fullProfessionsList,
            arrayState: personalProfessions ,
        },
    ]

    const profileAccordions = accordionsInfo.map((info) => (
        <Accordion disableGutters key={info.id} expanded={expanded === info.title} onChange={handleChange(info.title)}
        sx={{
            bgcolor: info.bgcolor,
            maxWidth: "40rem",
        }}
        >
        <AccordionSummary
          expandIcon={expanded === info.title ? <FontAwesomeIcon icon={faMinus} /> : <FontAwesomeIcon icon={faPlus} />}
          aria-controls={`${info.title}-content`}
          id={`${info.title}-header`}
        >
          <Typography>{info.title}</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            justifyContent="center"
            sx={{
              gap: "0.35rem",
            }}
          >
        {info.list.map(item => (
<Chip variant="filled" key={item.id} disabled={guestUser} label={item.name}
sx={{
    bgcolor: info.arrayState.includes(item.name) && info.buttonColor,
    // color: (info.title === "Professions" && info.arrayState.includes(item.name)) && theme.palette.whitePrimary.main,
    "&:hover": {
        bgcolor: info.arrayState.includes(item.name) && info.buttonColor,
    }
}}
 onClick={() => {
    if (!guestUser) {
handleChipClick(info.title, item.name, info.arrayState)
    }
    
}} />
        ))}
        </Stack>
        </AccordionDetails>
        </Accordion>
    ))

    return (
        <Box component="main" 
    sx={{
        padding: location.pathname !== "/createaccount"  && 3,
      paddingTop: location.pathname === "/createaccount"  ? "6rem" : "1rem",
      display: location.pathname === "/createaccount" && "flex",
      flexDirection: location.pathname === "/createaccount" && "column",
      justifyContent: location.pathname === "/createaccount" && "center",
      minHeight: "100vh",
      textAlign: "center",
      background: theme.palette.lightGrayPrimary.main,
    }}
    >
   {location.pathname === "/createaccount" &&
   <> 
   <Alert severity="info"
   sx={{
    alignSelf: "center",
   }}
   >This information will not be viewed by real users.</Alert>

   <Typography 
        component="h1"
        variant="h4"
        sx={{
          color: theme.palette.oliveGreenPrimary.main,
    padding: "0.5rem 0",
    fontWeight: 800,
    fontFamily: "serif",
        }}
        >Create an account</Typography>
        </>}
    <Grid container direction="column" justifyContent="center" alignItems="center" spacing={2}>
    <Grid item>
    <Typography variant="h6" component="h2" sx={{
    fontWeight: 400,
}}>{location.pathname === "/createaccount" ? "Step 1:" : "Update Traits"}</Typography>
</Grid>
 <Grid item>
    <Typography variant="body1" component="h2" sx={{
    fontWeight: 400,
}}>Select at least 1 trait from each category that best describes you!</Typography>
</Grid>
<Grid item>
{profileAccordions}
</Grid>
<Grid item>
<Button color="oliveGreenPrimary"
disabled={(personalInterests.length < 1 || personalTraits.length < 1 || personalProfessions.length < 1) || guestUser}
onClick={() => {
if (location.pathname === "/createaccount") {
       setFormStep(FORM_STEPS.LIST)
       } else if (currentUser) {
        handleTraitsUpdate()
       }
}}
>{location.pathname === "/createaccount" ? "Continue" : "Save"}</Button>
</Grid>
</Grid>
        </Box>
    )
} 

export default UpdateProfile