import React, {useState, useEffect} from 'react';
import { Box, Grid, Typography, useTheme, Button, TextField, Alert, IconButton, List, ListItem, ListItemText, FormControlLabel, Checkbox, Accordion, AccordionSummary, AccordionDetails, Stack, FormControl, FormLabel } from "@mui/material";
import { redirect, useLocation, useNavigate } from "react-router-dom";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faMinus, faPlus, faAngleDown} from "@fortawesome/free-solid-svg-icons";
import AccessCheckboxes from '../../components/AccessCheckboxes/AccessCheckboxes';
import { useContext } from 'react';
import { UserContext } from '../../utils/UserContext';
import { FORM_STEPS } from '../../utils/constants';
import { db, auth } from "../../utils/firebaseSetup";
import { addDoc, collection, doc, deleteDoc, writeBatch, setDoc } from "firebase/firestore";



function AboutMeList(props){
  const {profileAboutMeList, setIsUpdateLoading, setSuccessAlert,} = props
    const theme = useTheme()
const {setFormStep, myDetails, setMyDetails, currentUser, unsubList, guestUser} = useContext(UserContext)
    const [formError, setFormError] = useState("")
    const [selectedAccess, setSelectedAccess] = useState([])

    const [tempId, setTempId] = useState(1)

    const location = useLocation()
const navigate = useNavigate()
  const {
    handleSubmit,
    watch,
    control,
    trigger,
    dirtyFields,
    formState: { errors, isDirty, isValid, isSubmitting },
    formState,
  } = useForm({
    defaultValues: {
    detailsList: currentUser ? profileAboutMeList : [
        {
          placeholderId: tempId,
            title: "",
            description: "",
            access: []
        }
    ]
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: 'detailsList',
    control,
    rules: {
        required: 'Please enter at least 1 item'
    }
  })

     

   const onSubmit = async (data) => {
const newDetails = data.detailsList
if (isValid) {
  if (location.pathname === "/createaccount") {
    
    setMyDetails(newDetails)
    
        setFormStep(FORM_STEPS.SIGN_UP)
    } else if (currentUser) {
    
      setIsUpdateLoading(true)

try {
 const batch = writeBatch(db)

// delete all documents within "detailsList" collection 
   await myDetails.forEach((info, index) => {
        const docRef = doc(db, `users/${currentUser.uid}/detailsList/detail${index + 1}`)
        batch.delete(docRef, info)
    })

    await batch.commit().then(() => {
        return ;
    }).catch((err) => {
        console.error("batch write failed when deleting docs: ", err)
    })

    // then add all new documents into the collection

} catch (err) {
console.error(err)
}

try {
   const batch = writeBatch(db)

  await newDetails.forEach((info, index) => {
        const docRef = doc(db, `users/${currentUser.uid}/detailsList/detail${index + 1}`)
        batch.set(docRef, info)
    })

    await batch.commit().then(() => {
        return ;
    }).catch((err) => {
        console.error("batch write failed when adding new docs: ", err)
    })
    setSuccessAlert("success")
} catch (err) {
console.error(err)
setSuccessAlert("fail")
}
   unsubList()
      } 
      } 
      
    }

    const accessList = [
        {
            id: 1,
            name: "Anyone"
        },
        {
            id: 2,
            name: "Only me"
        },
        {
            id: 3,
            name: "Family"
        },
        {
            id: 4,
            name: "Friends"
        },
        {
            id: 5,
            name: "Colleagues"
        },
    ]
   

  const formFields = fields.map((field, index) => (
    <Grid item container direction="row" justifyContent="center" alignItems="center" key={field.id}>
<Box sx={{
    border: "1px solid black",
    padding: "0.5rem 1rem",
}}
>
<Grid item container direction="column" justifyContent="center" alignItems="center" spacing={1}>
    <Grid item container direction={{xs: "column", sm: "column" ,md: "row"}} justifyContent="center" alignItems="center" flexWrap="nowrap" spacing={1}>
    <Grid item>
    <Controller
              control={control}
              name={`detailsList.${index}.title`}
              rules={{
                required: {
                  value: true,
                  message: "Title is Required",
                },
              }}
              // get the field state
              render={({ field, fieldState: { error, invalid } }) => (
                <TextField
                id={`title${index}`} label="Title"
                margin="normal"
                sx={{
                    width: "15rem",
                    [theme.breakpoints.down("sm")]: {
    width: "13rem",
  },
  [theme.breakpoints.down(350)]: {
    width: "10rem",
  },
                }}
                  {...field}
                  required
                  //  is error ??
                  error={errors.detailsList?.[index]?.title ? true : false}
                  // show helper text if it is invalid
                />
              )}
            />
            <Typography variant="body2" color="textSecondary">
              {errors.detailsList?.[index]?.title?.message}
            </Typography>
    </Grid>

    <Grid item>
    <Controller
              control={control}
              name={`detailsList.${index}.description`}
              rules={{
                required: {
                  value: true,
                  message: "Description is Required",
                },
              }}
              // get the field state
              render={({ field, fieldState: { error, invalid } }) => (
                <TextField
                id={`description${index}`} label="Description"
                margin="normal"
                sx={{
                    width: "20rem",
                    [theme.breakpoints.down("sm")]: {
    width: "17rem",
  },
  [theme.breakpoints.down(350)]: {
    width: "11rem",
  },
                }}
                  {...field}
                  required
                  //  is error ??
                  error={errors.detailsList?.[index]?.description ? true : false}
                  // show helper text if it is invalid
                />
              )}
            />
            <Typography variant="body2" color="textSecondary">
              {errors.detailsList?.[index]?.description?.message}
            </Typography>
    </Grid>
</Grid>
     <Grid item container direction={{ xs: "column", md: "row"}} justifyContent="center" alignItems="center" flexWrap="nowrap" spacing={1}>
     <Grid item>
     <Accordion disableGutters
     sx={{
        border: errors.detailsList?.[index]?.access ? "1px solid red" : "none",
     }}
     >
        <AccordionSummary
          expandIcon={<FontAwesomeIcon icon={faAngleDown} />}
          aria-controls={"access-form-content"}
          id={"access-form-header"}
        >
          <Typography>Who can view this: </Typography>
        </AccordionSummary>
        <AccordionDetails>
           <FormControl
        error={errors.detailsList?.[index]?.access ? true : false}
        component="fieldset"
        variant="standard"
      >
        <FormLabel component="legend">Select who can view this: </FormLabel>
     <AccessCheckboxes
     options={accessList}
     control={control}
     name={`detailsList.${index}.access`}
     />
     </FormControl>
     <Typography variant="body2" color="textSecondary">{errors.detailsList?.[index]?.access?.message}</Typography>
        </AccordionDetails>
        </Accordion>
     </Grid>

</Grid>
</Grid>
    <Grid item container direction="column" justifyContent="center" alignItems="center"
    >
    <IconButton
    onClick={() => {
        remove(index)
    }}
    >
    <FontAwesomeIcon icon={faTrash}/>
    </IconButton>
    </Grid>
    </Box>
    </Grid>
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
        component="h2"
        variant="h4"
        sx={{
          color: theme.palette.oliveGreenPrimary.main,
    padding: "0.5rem 0",
    fontWeight: 800,
    fontFamily: "serif",
        }}
        >Create an account</Typography>
        </>
        }
    <Typography variant="h6" component="h3" sx={{
    fontWeight: 400,
}}>{location.pathname === "/createaccount" ? "Step 2:" : "Update List"}</Typography>

<Box component="form" 
        onSubmit={handleSubmit(onSubmit)}
       >
    <Grid container direction="column" justifyContent="center" alignItems="center" spacing={1}>

<Grid item>
<Typography variant="body1" component="h2" sx={{
    fontWeight: 400,
}}>Enter info about you that could make gift picking easier. (Examples below)</Typography>
</Grid>

<Grid item>
<List
sx={{
    listStyleType: "disc",
    pl: 2,
 '& .MuiListItem-root': {
  display: 'list-item',
 },
}}
>
<ListItem disablePadding>
<ListItemText
primary="Favorite Author"
secondary="Dale Carnegie"
/>
</ListItem>
<ListItem disablePadding>
<ListItemText
primary="Place I want to travel to"
secondary="Spain"
/>
</ListItem>
<ListItem disablePadding>
<ListItemText
primary="Shirt size"
secondary="Medium Women's"
/>
</ListItem>
</List>
</Grid>


{formFields}

<Grid item>
<IconButton
type="button"
color="blackPrimary"
size="large"
sx={{
    margin: "1rem",
    bgcolor: theme.palette.lightPinkPrimary.main,
    padding: "0.8rem",
    "&:hover": {
        bgcolor: theme.palette.lightPinkPrimary.dark,
    }
}}

onClick={() => {
  const nextCount = tempId + 1;
setTempId(nextCount);
    append({ 
      placeholderId: nextCount,
        title: "",
            description: "",
            // access: []
            })
}}
>
<FontAwesomeIcon icon={faPlus} size="xs" />
</IconButton>
</Grid>
         { formError && <Grid item>
          <Alert severity="error">{formError}</Alert>
          </Grid>}

{errors.detailsList?.root?.message && <Grid item>
          <Alert severity="error">{errors.detailsList?.root?.message}</Alert>
          </Grid>}

          <Grid item>
            <Button 
            color="oliveGreenPrimary"
            disabled={isSubmitting || guestUser}
            type="submit">
              {location.pathname === "/createaccount" ? "Continue" : "Save"}
            </Button>
          </Grid>


      </Grid>
      </Box>
    </Box>
    )
}

export default AboutMeList