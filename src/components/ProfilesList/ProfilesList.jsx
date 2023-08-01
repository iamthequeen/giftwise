import { Box, Grid, Typography, Tab, List, ListItem, ListItemText, ListItemButton, useTheme, Stack, Chip, Tabs, Card, CardMedia, CardContent, CardActions, Divider, Button, Skeleton } from '@mui/material';
import React, {useState, useEffect, useContext} from 'react';
import {db, storage} from "../../utils/firebaseSetup"
import { getDocs, collection } from "firebase/firestore"
import {UserContext} from "../../utils/UserContext"
import {Link, useNavigate} from 'react-router-dom'
import {auth} from "../../utils/firebaseSetup"
import { PROFILE_TYPES } from '../../utils/constants'
import {ref, getDownloadURL, listAll} from "firebase/storage"



function ProfilesList() {

    const theme = useTheme()

    const navigate = useNavigate()

    const { guestUser, currentUser, setViewingUser } = useContext(UserContext)

    const [allProfilesLoading, setAllProfilesLoading] = useState(true)
    const [profilesList, setProfilesList] = useState([])

const [profileImages, setProfileImages] = useState([])

    const [imagesLoading, setImagesLoading] = useState(true)

const tempData = [
    {
        id: 1,
        name: "Sohan",
        link: 'https://images.unsplash.com/photo-1569913486515-b74bf7751574?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1378&q=80',
    },
    {
        id: 2,
        name: "Nico",
        link: 'https://images.unsplash.com/photo-1519699391638-2c1858ed0a8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80',
    },
    {
        id: 3,
        name: "Al",
        link: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80',
    },
    {
        id: 4,
        name: "Gabriella",
        link: 'https://images.unsplash.com/photo-1526510747491-58f928ec870f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80',
    },
    {
        id: 5,
        name: "Ramia",
        link: 'https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1530&q=80',
    },
    {
        id: 6,
        name: "Greg",
        link: 'https://images.unsplash.com/flagged/photo-1573603867003-89f5fd7a7576?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=446&q=80',
    },
    {
        id: 7,
        name: "Steph",
        link: 'https://images.unsplash.com/photo-1630230594977-b0fc93663733?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=436&q=80',
    }
]


    const profilesCollectionRef = collection(db, "fakeProfiles")

     const getProfilesList = async () => {
            try {
                const profilesData = await getDocs(profilesCollectionRef) 
                const filteredProfilesData = profilesData.docs.map(doc => ({...doc.data(), uid: doc.id,}))
                setProfilesList(filteredProfilesData)
                setAllProfilesLoading(false)
            } catch (err){
                console.error(err)
            }
        }

       

        const handleImgDownload = async () => {

// Create a reference under which you want to list
const avatarListRef = ref(storage, 'avatarImages');
// Find all the prefixes and items.
let updatedProfiles;
let updatedArr;
listAll(avatarListRef).then((res) => {
    res.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
                const matchingImage = profilesList.find(({ imgName }) => imgName === item.name);

 updatedProfiles = profilesList?.map(profile => {
        //   const matchingImage = profilesList.find(({ imgName }) => item.name === imgName);
          if (matchingImage) {
            return {
              ...profile,
              url
            }
          } else { 
          return profile;
          }
        });
        

        })
    })
}).catch((err) => {
    console.error(err)
})
setProfilesList(updatedArr)
    setImagesLoading(false)

// loop over profile images and add proper link to profile list arr of objs
}



    useEffect(() => {
        getProfilesList()
// setting()
    }, [])





    // useEffect(() => {

    //     if (!allProfilesLoading && imagesLoading) {
    //         handleImgDownload()
    //     }

    // }, [allProfilesLoading])


    const profilesBtns = profilesList.map((profile, index) => (
        <Grid item key={profile.uid}>
        <Card sx={{  
    border: `2px solid ${theme.palette.whiteTertiary.main}`,

    }}>
{/*    {imagesLoading ?
     (
        <Skeleton 
        sx={{ 
            height: "10rem",
            width: "10rem",
            border: `2px solid ${theme.palette.whiteTertiary.main}`,
            }}
         animation="wave" variant="rectangular" />
    ) 
    :
     ( */}
         <CardMedia
        sx={{ 
            height: "10rem",
            width: "10rem",
            border: `2px solid ${theme.palette.whiteTertiary.main}`,
            }}
        image={`/images/avatars/${profile.imgName}`}
        title={profile.name}
      / >
   {/*   )
      }  */}
      <CardContent
      sx={{
        paddingBottom: 1,
      }}
      >{profile.name}</CardContent>
      <CardActions sx={{
        justifyContent:"center",
        marginBottom: "1rem",
        padding: 0,
      }}>
        <Button color="lightGreenPrimary"
        sx={{
            padding: "4px 10px",
        }}
        onClick={() => {
            setViewingUser({
            uid: profile.uid,
            profileType: PROFILE_TYPES.OTHER
            })
            navigate(`/profile/${profile.uid}`)
        }
        }
        >Visit Profile</Button>
      </CardActions>
    </Card>
</Grid>
    ))

  
    return (
        <Box sx={{
            margin: "0 1rem",
        }}>
 
{allProfilesLoading ? <Typography>Loading...</Typography> : 
<Grid container justifyContent="center" alignItems="center" flexGrow={1} spacing={3.5}>
  {profilesBtns}  
</Grid> 
}



        </Box>
    )
}

export default ProfilesList;