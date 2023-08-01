import React, {useState, useEffect} from 'react';
import { Box, Grid, Typography, useTheme, Button, TextField, Alert, LinearProgress, FormControlLabel, Checkbox, Dialog, DialogTitle, FormControl, CircularProgress, AlertTitle } from "@mui/material";
import { Controller, useForm, useController, useFieldArray } from "react-hook-form";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faX} from "@fortawesome/free-solid-svg-icons";
import { doc, collection, updateDoc, onSnapshot, runTransaction, getDoc, deleteDoc, setDoc } from "firebase/firestore";
import {auth, db} from "../../utils/firebaseSetup"
import { useContext } from 'react';
import { UserContext } from '../../utils/UserContext';
import UpdateProfile from '../../pages/UpdateProfile/UpdateProfile';

function EditTraitsDialog(props){
    const {openEditTraits, handleCloseEditTraits, pageData, setPageData} = props

      const theme = useTheme();

const { guestUser} = useContext(UserContext)


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
<AlertTitle>Traits Successfully Updated</AlertTitle>
<FontAwesomeIcon icon={faCheck} color="green" size="xl"/></Alert>;
        case "fail": 
        return <Alert severity="error" icon={false}>
<AlertTitle>Traits Failed to Update. Please Try Again.</AlertTitle>
<FontAwesomeIcon icon={faX} color="red" size="xl"/></Alert>;
        default:
        return <Alert severity="error" icon={false}>
<AlertTitle>List Failed to Update. Please Try Again.</AlertTitle>
<FontAwesomeIcon icon={faX} color="red" size="xl"/></Alert>;
        }
      }

      useEffect(() => {
        const alertTimer = 
            setTimeout(() => {
                if (successAlert) {
                handleCloseEditTraits()
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
             <Dialog onClose={handleCloseEditTraits} open={openEditTraits}>
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
             >Cannot edit traits as a guest.</Alert>
}
             { isUpdateLoading ? <Box
             sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
             }}
             >{handleAlert()}</Box> :
              <UpdateProfile
              setIsUpdateLoading={setIsUpdateLoading}
              setSuccessAlert={setSuccessAlert}
              pageData={pageData}
              setPageData={setPageData}
              />
               }
         </Box>
         </Dialog>
        </>
    )
}

export default EditTraitsDialog