import { Box, Grid, Typography, useTheme, Button, TextField, Alert } from "@mui/material";
import React, { useContext, useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { UserContext } from "../../utils/UserContext";
import { sceneryImagesList } from "../../utils/data";
import { updateProfile } from "firebase/auth"
import { addDoc, collection, doc, deleteDoc, writeBatch, setDoc } from "firebase/firestore";
import { db, auth } from "../../utils/firebaseSetup";
import { useState } from "react";
import { redirect, useLocation, useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import { PROFILE_TYPES } from '../../utils/constants'


function SignupForm() {

const theme = useTheme()

const {
createAccount,
setGuestUser,
guestUser,
viewingUser,
setViewingUser,
personalTraits,
myDetails,
    personalInterests,
    personalProfessions,
    setGuestTraits,
     setGuestInterests,
   setGuestProfessions,
    setGuestDetails,
    guestTraits,
     guestInterests,
   guestProfessions,
    guestDetails,
    resetGuestInfo
  } = useContext(UserContext);


      const [signupError, setSignupError] = useState("")
      const [listCollectionCreated, setListCollectionCreated] = useState(false)

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
        firstName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  let randomIndex = Math.floor(Math.random() * sceneryImagesList.length) 

  const randomSceneryImg = sceneryImagesList[randomIndex]


function mapAuthCodeToMessage(authCode) {
  switch (authCode) {
    case "auth/invalid-password":
      return "Password provided is not corrected";

    case "auth/invalid-email":
      return "Email provided is invalid";

    // Many more authCode mapping here...

    default:
      return "";
  }
}

    const onSubmit = async (data) => {
        
setSignupError("")

if (isValid) {
        try {
        // await createAccount(data.email, data.password)
        
        const { user } = await createAccount(data.email, data.password)
    await updateProfile(user, {
      displayName: data.firstName
    });
    await setDoc(doc(db, "users", `${user.uid}`), {
        uid: user.uid,
        name: data.firstName,
        email: data.email,
        sceneryImg: randomSceneryImg,
        personalTraits: guestUser ? guestTraits : personalTraits,
    personalInterests: guestUser ? guestInterests : personalInterests,
    personalProfessions: guestUser ? guestProfessions : personalProfessions,
    })

// Prevents creating "virtual" (ghost) collection/docs
    await setDoc(doc(db, `friends/${user.uid}`), {
        exists: true,
    })
    // 

    await setDoc(doc(db, `family/${user.uid}`), {
        exists: true,
    })

    await setDoc(doc(db, `colleagues/${user.uid}`), {
        exists: true,
    })

   
    const batch = writeBatch(db)
if (!listCollectionCreated) {
  
  if (guestUser){
  
   await guestDetails.forEach((data, index) => {
        const docRef = doc(db, `users/${user.uid}/detailsList/detail${index + 1}`)

        batch.set(docRef, data)
    })

    await batch.commit().then(() => {
        setListCollectionCreated(true)
    }).catch((err) => {
        console.error("batch write failed: ", err)
        setListCollectionCreated(false)
    })
} else {
  await myDetails.forEach((data, index) => {
        const docRef = doc(db, `users/${user.uid}/detailsList/detail${index + 1}`)

        batch.set(docRef, data)
    })

    await batch.commit().then(() => {
        setListCollectionCreated(true)
    }).catch((err) => {
        console.error("batch write failed: ", err)
        setListCollectionCreated(false)
    })
}

}
    
        alert ("User Created Successfully")
        resetGuestInfo()
        setViewingUser({
            uid: auth?.currentUser?.uid,
            profileType: PROFILE_TYPES.CURRENT
            })
        navigate(`/profile/${auth?.currentUser?.uid}`)   

        } catch (err) {
            
            setSignupError(err.message)

      }
      

setListCollectionCreated(false)
      }
      
    }
   
 
  return (
    <>
   <Header/>
    <Box component="main" 
    sx={{
      paddingTop: "6rem",
      paddingBottom: "3rem",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      minHeight: "100vh",
      textAlign: "center",
      background: theme.palette.lightGrayPrimary.main,
    }}
    >
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
    <Box component="form" sx={{
           '& .MuiTextField-root': { m: 1, width: '25ch' },
        }}
        onSubmit={handleSubmit(onSubmit)}
       >
    <Grid container direction="column" justifyContent="center" alignItems="center" spacing={1}>

<Grid item>
<Typography variant="h6" component="h2" sx={{
    fontWeight: 400,
}}>Please enter your info.</Typography>
</Grid>

<Grid item xs={6} md={8}>
            <Controller
              control={control}
              name="firstName"
              rules={{
                required: {
                  value: true,
                  message: "First name is Required",
                },
              }}
              // get the field state
              render={({ field, fieldState: { error, invalid } }) => (
                <TextField
                id="firstName" label="First Name"
                type="text"
                margin="normal"
                sx={{
                    [theme.breakpoints.down("sm")]: {
    width: "17rem",
  },
                }}
                  {...field}
                  required
                  //  is error ??
                  error={errors.firstName ? true : false}
                  // show helper text if it is invalid
                />
              )}
            />
            <Typography variant="body2" color="textSecondary">
              {errors.firstName?.message}
            </Typography>
          </Grid>


        <Grid item xs={6} md={8}>
            <Controller
              control={control}
              name="email"
              rules={{
                required: {
                  value: true,
                  message: "Email is Required",
                },
                pattern: {
                  value: /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
                  message: "Email is Invalid",
                },
              }}
              // get the field state
              render={({ field, fieldState: { error, invalid } }) => (
                <TextField
                id="email" label="Email"
                sx={{
                    [theme.breakpoints.down("sm")]: {
    width: "17rem",
  },
                }}
                  {...field}
                  required
                  //  is error ??
                  error={errors.email ? true : false}
                  // show helper text if it is invalid
                />
              )}
            />
            <Typography variant="body2" color="textSecondary">
              {errors.email?.message}
            </Typography>
          </Grid>

          <Grid item xs={6} md={8}>
            <Controller
              control={control}
              name="password"
              rules={{
                required: {
                  value: true,
                  message: "Password is Required",
                },
                minLength: {
          value: 8,
          message: "Password must be at least 8 characters"
          },
          maxLength: {
          value: 20,
          message: "Password can only be up to 20 characters"
          },
              }}
              // get the field state
              render={({ field, fieldState: { error, invalid } }) => (
                <TextField
                id="password" label="Password" 
                type="password"
                 helperText="Minimum: 8 characters, Maximum: 20 characters"
                sx={{
                    [theme.breakpoints.down("sm")]: {
    width: "17rem",
  },
                }}
                  {...field}
                  required
                  //  is error ??
                  error={errors.password ? true : false}
                  // show helper text if it is invalid
                />
              )}
            />
            <Typography variant="body2" color="textSecondary">
              {errors.password?.message}
            </Typography>
          </Grid>

<Grid item>
          <Controller
              control={control}
              name="confirmPassword"
              rules={{
                required: {
                  value: true,
                  message: "Please confirm your password",
                },
                validate: {
                    validatePassword: value =>
           value === watch("password", "") || "Passwords do not match"
                },
              }}
              // get the field state
              render={({ field, fieldState: { error, invalid } }) => (
                <TextField
                autoComplete='off'
                id="confirmPassword" label="Confirm Password"
                type="password"
                onPaste={(e) =>{
           e.preventDefault();
           return false
           }}
                sx={{
                    [theme.breakpoints.down("sm")]: {
    width: "17rem",
  },
                }}
                  {...field}
                  required
                  //  is error ??
                  error={errors.confirmPassword ? true : false}
                  // show helper text if it is invalid
                />
              )}
            />
            <Typography variant="body2" color="textSecondary">
              {errors.confirmPassword?.message}
            </Typography>
          </Grid>

         { signupError && <Grid item>
          <Alert severity="error">{signupError}</Alert>
          </Grid>}


          <Grid item>
            <Button 
            color="oliveGreenPrimary"
            disabled={isSubmitting || Object.keys(formState.dirtyFields).length !== 4}
            type="submit">
              Sign Up
            </Button>
          </Grid>

    {location.pathname !== "/signup" && <Grid item>
          <Button variant="text"
          sx={{
             color: theme.palette.orangePrimary.dark,
            "&:hover": {
                textDecoration: "underline",
            }
          }}

          onClick={() => {
            setGuestUser(true)
setGuestTraits(personalTraits)
     setGuestInterests(personalInterests)
   setGuestProfessions(personalProfessions)
    setGuestDetails(myDetails)
            setViewingUser({
            uid: "guest",
            profileType: PROFILE_TYPES.GUEST
            })
        navigate("/profile/guest")
      }}
          >Actually, I'd rather continue as a guest</Button>
          </Grid>}
          
      </Grid>
      </Box>
    </Box>
    </>
  );
}

export default SignupForm;