import React, {useState, useEffect} from 'react';
import { Box, Grid, Typography, useTheme, Button, TextField, Alert, LinearProgress, FormControlLabel, Checkbox, Dialog, DialogTitle, FormControl, CircularProgress, AlertTitle } from "@mui/material";
import { Controller, useForm, useController, useFieldArray } from "react-hook-form";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faX} from "@fortawesome/free-solid-svg-icons";
import { doc, collection, updateDoc, onSnapshot, runTransaction, getDoc, deleteDoc, setDoc } from "firebase/firestore";
import {auth, db} from "../../utils/firebaseSetup"
import { useContext } from 'react';
import { UserContext } from '../../utils/UserContext';
import AboutMeList from '../../pages/AboutMeList/AboutMeList';


function EditListDialog(props){
    const {openEditList, handleCloseEditList, profileAboutMeList} = props

      const theme = useTheme();

      const {guestUser} = useContext(UserContext)


const [isUpdateLoading, setIsUpdateLoading] = useState(false)

      const [successAlert, setSuccessAlert] = useState(null)


 const handleAlert = () => {
        switch(successAlert){
            case null:
return <Alert
sx={{
    padding: "0 2rem"
}}
 severity="warning" icon={false}>
<AlertTitle>Loading...</AlertTitle>
<CircularProgress color="inherit" /></Alert>;
            case "success": 
        return <Alert severity="success" icon={false}>
<AlertTitle>List Successfully Updated</AlertTitle>
<FontAwesomeIcon icon={faCheck} color="green" size="xl"/></Alert>;
        case "fail": 
        return <Alert severity="error" icon={false}>
<AlertTitle>List Failed to Update. Please Try Again.</AlertTitle>
<FontAwesomeIcon icon={faX} color="red" size="xl"/></Alert>;
        default:
            return <Alert severity="error" icon={false}>
            <AlertTitle>List Failed to Update. Please Try Again.</AlertTitle>
            <FontAwesomeIcon icon={faX} color="red" size="xl"/></Alert>;;
        }
      }

       useEffect(() => {
        const alertTimer = 
            setTimeout(() => {
                if (successAlert) {
                handleCloseEditList()
                // setOpen(false)
                setIsUpdateLoading(false)
                setSuccessAlert(null)
                }
            }, [3000])
        

        return () => {
        clearTimeout(alertTimer);
      };
    }, [successAlert])

    return (
         <>
             <Dialog onClose={handleCloseEditList} open={openEditList}>
             <Box
             sx={{
                bgcolor: theme.palette.lightGrayPrimary.main,
                padding: isUpdateLoading && 3,
                 paddingTop: !isUpdateLoading ? "6rem" : "1rem",     
      minHeight: "100vh",
      textAlign: "center",
             }}
             >
             {guestUser && <Alert severity="error"
             sx={{
                width: "18rem",
                margin: "auto",
             }}
             >Cannot edit list as a guest.</Alert>
}
             { isUpdateLoading ? <Box
             sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
             }}
             >{handleAlert()}</Box> :
              <AboutMeList
              setIsUpdateLoading={setIsUpdateLoading}
              setSuccessAlert={setSuccessAlert}
              profileAboutMeList={profileAboutMeList}
              />
               }
         </Box>
         </Dialog>
        </>
    )
}

export default EditListDialog