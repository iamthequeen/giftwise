import React, {useState, useEffect} from 'react';
import { Box, Grid, Typography, useTheme, Button, TextField, Alert, LinearProgress, FormControlLabel, Checkbox, Dialog, DialogTitle,  FormGroup, FormControl, CircularProgress, AlertTitle } from "@mui/material";
import { Controller, useForm, useController, useFieldArray } from "react-hook-form";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faX} from "@fortawesome/free-solid-svg-icons";
import { doc, collection, updateDoc, onSnapshot, runTransaction, getDoc, deleteDoc, setDoc } from "firebase/firestore";
import {auth, db} from "../../utils/firebaseSetup"
import { useContext } from 'react';
import { UserContext } from '../../utils/UserContext';



function EditGroupDialog(props){
const { handleCloseEditGroup, openEditGroup, selectedItems, setSelectedItems,
                initialChecks,
                friendsDocRef,
    familyDocRef,
    colleaguesDocRef, usersGroups, setUsersGroups, initialGroups, initialLoad, setInitialLoad } = props 

const {currentUser, viewingUser, guestUser} = useContext(UserContext)
 const { handleSubmit, setValue, control, reset, formState, formState: { isSubmitting, isSubmitSuccessful } } = useForm({
        defaultValues: {
            friends: usersGroups[0].inGroup,
            family: usersGroups[1].inGroup,
            colleagues: usersGroups[2].inGroup,
            // friends: false,
            // family: false,
            // colleagues: false,
        }
    });

  const theme = useTheme();

    // const [initialLoad, setInitialLoad] = useState(true)

const [isUpdateLoading, setIsUpdateLoading] = useState(false)
    const [formNowDirty, setFormNowDirty] = useState(false)

      const [successAlert, setSuccessAlert] = useState(null)

      const [alertDetails, setAlertDetails] = useState({
        type: "",
        title: "",
        color: "",
      })

//   const [selectedItems, setSelectedItems] = useState([]);



useEffect(() => {
    if (formState.isSubmitSuccessful) {
      reset({ keepDefaultValues: true });
      setFormNowDirty(false)
    }
  }, [formState, reset]);


   // we are handling the selection manually here
    const handleSelect = (groupName) => {
        if (!selectedItems.includes(groupName)) {
            setSelectedItems((prevItems) => [...prevItems, groupName]);
        } else {
            setSelectedItems((prevItems) =>
      prevItems.filter((val) => val !== groupName)
    );
        }
         
    
    };

  

    useEffect(() => {
        // Checks box initially if user is already in any groups
        initialChecks()
        setInitialLoad(false)
    }, [])

 
    const onSubmit = async (data) => {

        setIsUpdateLoading(true)
if (guestUser) {

setUsersGroups(usersGroups.map(group => {

    if (selectedItems.includes(group.name)) {
        return { ...group, inGroup: true}
    } else {
        return {...group, inGroup: false}
    }
}))
} else
{
      
const friendsDocSnap = await getDoc(friendsDocRef)
    const familyDocSnap = await getDoc(familyDocRef)
    const colleaguesDocSnap = await getDoc(colleaguesDocRef)

try {
 
// checking if the user is already in friends group but the checkbox "Friends" has been unchecked, meaning they should be removed from the "Friends" group. Otherwise, if "Friends" was checked  but the doc doesn't exist, add the user to the 'Friends" collection
    if (friendsDocSnap.exists() && !selectedItems.includes("Friends")){
        await deleteDoc(friendsDocRef);
    } else if (!friendsDocSnap.exists() && selectedItems.includes("Friends")){
        // await setDoc(doc(db, `friends/${currentUser.uid}/usersFriends/${viewingUser.uid}`), {})
        await setDoc(friendsDocRef, {
            isFriend: true
        })
    }

    if (familyDocSnap.exists() && !selectedItems.includes("Family")){
        await deleteDoc(familyDocRef);
    } else if (!familyDocSnap.exists() && selectedItems.includes("Family")){
        // await setDoc(doc(db, `family/${currentUser.uid}/usersFamily/${viewingUser.uid}`), {})
        await setDoc(familyDocRef, {
            isFamily: true
        })
    }

    if (colleaguesDocSnap.exists() && !selectedItems.includes("Colleagues")){
        await deleteDoc(colleaguesDocRef);
    } else if (!colleaguesDocSnap.exists() && selectedItems.includes("Colleagues")){
        // await setDoc(doc(db, `colleagues/${currentUser.uid}/usersColleagues/${viewingUser.uid}`), {})
        await setDoc(colleaguesDocRef, {
            isColleague: true
        })
    }

   setSuccessAlert("success")
    
} catch (err) {
    console.error("Everything failed:", err)
     setSuccessAlert("fail")
}

}
    }

   


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
<AlertTitle>Groups Successfully Updated</AlertTitle>
<FontAwesomeIcon icon={faCheck} color="green" size="xl"/></Alert>;
        case "fail": 
        return <Alert severity="error" icon={false}>
<AlertTitle>Groups Failed to Update. Please Try Again.</AlertTitle>
<FontAwesomeIcon icon={faX} color="red" size="xl"/></Alert>;
        default:
            return <Alert severity="error" icon={false}>
            <AlertTitle>Groups Failed to Update. Please Try Again.</AlertTitle>
            <FontAwesomeIcon icon={faX} color="red" size="xl"/></Alert>;
        }
      }



useEffect(() => {
        const alertTimer = 
            setTimeout(() => {
                if (successAlert) {
                handleCloseEditGroup()
                setIsUpdateLoading(false)
                setSuccessAlert(null)
                }
            }, [3000])
        

        return () => {
        clearTimeout(alertTimer);
      };
    }, [successAlert])

   
    
 const formElements = initialGroups.map((group) => (
        <FormControlLabel
            key={group.id}
            control={
                <Controller
                name={group.name}
                    render={({ }) => {
                        return (
                            <Checkbox
                               name={group.name} 
                                checked={selectedItems.includes(group.name)}
                                disabled={guestUser}
                                onChange={() => {
                                    handleSelect(group.name)
                                    setFormNowDirty(true)
                                }}
                            />
                        );
                    }}
                    control={control}
                />
            }
            label={group.name}

        />
    ))



    return (
         <>
             <Dialog onClose={handleCloseEditGroup} open={openEditGroup}>
             <Box
             component="form" 
        onSubmit={handleSubmit(onSubmit)}
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
             >Cannot edit groups as a guest.</Alert>
}
             { isUpdateLoading ? <Box
             sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
             }}
             >{handleAlert()}</Box> :
              <FormControl sx={{
                            margin: 3,
                            marginBottom: 0,
                        }} component="fieldset" variant="standard"
                        >
                        <Typography variant="h5" component="legend" sx={{
                                fontWeight: 500,
                            }}>What group(s) would you like this user to be in?</Typography>

         <FormGroup
         sx={{
            margin: "auto",
            paddingTop: "1rem"
        }}
         >
        {initialLoad ? <Typography>Loading...</Typography> : formElements}
         </FormGroup> 
         <Button
                            sx={{
                                bgcolor: theme.palette.darkBluePrimary.main,
                            }}
                            // disabled={Object.keys(formState.touchedFields).length === 0}
                            disabled={!formNowDirty || isSubmitting || guestUser}
                            type="submit"
                        >Done</Button>
         </FormControl> }
         </Box>
         </Dialog>
        </>
    )
}

export default EditGroupDialog;

