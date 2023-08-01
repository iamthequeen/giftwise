import { Box, Grid, Typography, useTheme, Button, Avatar, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListItemAvatar, Alert, Stack, Chip, Card, CardMedia, CardContent, CardActions, Divider, Skeleton, ButtonGroup } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../utils/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faScroll, faCircleChevronRight, faGear, faUser, faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import MyLists from "../../../components/MyLists/MyLists";
import {auth, storage, db} from "../../../utils/firebaseSetup"
import Header from "../../../components/Header/Header";
import {sceneryImagesList, fullTraitsList, fullInterestsList, fullProfessionsList} from "../../../utils/data"
import {Link, useParams} from 'react-router-dom'
import {Image} from "mui-image"
import "./ProfilePage.css"
import {ref, getDownloadURL} from "firebase/storage"
import EditGroupDialog from "../../../components/EditGroupDialog/EditGroupDialog"
import EditTraitsDialog from "../../../components/EditTraitsDialog/EditTraitsDialog"
import EditListDialog from "../../../components/EditListDialog/EditListDialog"
import ProfileSettings from "../../../components/ProfileSettings/ProfileSettings"
import { doc, onSnapshot, query, where, collection, updateDoc, runTransaction, getDoc, getDocs, deleteDoc, setDoc } from "firebase/firestore";
import { PROFILE_TYPES } from "../../../utils/constants";

const initialGroups = [
        {
            id: 1,
            name: "Friends",
            inGroup: false,
        },
        {
            id: 2,
            name: "Family",
            inGroup: false,
        },
        {
            id: 3,
            name: "Colleagues",
            inGroup: false,
        }
    ]

function ProfilePage() {

const theme = useTheme()

const { profileId } = useParams()


const { currentUser, userFirstName, guestUser, viewingUser, setViewingUser, findUser, fetchMyGroups, fetchOtherUserGroups, personalTraits, personalInterests, personalProfessions, setPersonalTraits,
    setPersonalInterests,
    setPersonalProfessions, profileAboutMeList, setProfileAboutMeList, myDetails, guestTraits,
     guestInterests,
   guestProfessions,
    guestDetails} = useContext(UserContext)

// For modal/dialog components
  const [openEditGroup, setOpenEditGroup] = useState(false);
  const handleOpenEditGroup = () => setOpenEditGroup(true);
    const handleCloseEditGroup = () => setOpenEditGroup(false);


  const [openEditTraits, setOpenEditTraits] = useState(false);
  const handleOpenEditTraits = () => setOpenEditTraits(true);
    const handleCloseEditTraits = () => setOpenEditTraits(false);


      const [openEditList, setOpenEditList] = useState(false);
  const handleOpenEditList = () => setOpenEditList(true);
    const handleCloseEditList = () => setOpenEditList(false);


const [isDataLoading, setIsDataLoading] = useState(true)
const [scenery, setScenery] = useState("")

const [pageData, setPageData] = useState({
    name: "",
    email: "",
    uid: "",
    sceneryImg: null,
    personalTraits: [],
    personalInterests: [],
    personalProfessions: [],
})

const [usersGroups, setUsersGroups] = useState(initialGroups)
    const [initialLoad, setInitialLoad] = useState(true)

    const [personalDataLoading, setPersonalDataLoading] = useState(true)
const [myGroups, setMyGroups] = useState({
    friends: [],
    family: [],
    colleagues: []
})

const [otherProfileGroups, setOtherProfileGroups] = useState({
    friends: [],
    family: [],
    colleagues: []
})


const [areMyGroupsLoading, setAreMyGroupsLoading] = useState(true)


  const [selectedItems, setSelectedItems] = useState([]);
    const [mutuals, setMutuals] = useState([]);

//   if viewingUser = current, all current user data
// viewing user = other, other data but should know current user's groups AND other users groups

 const friendsDocRef = doc(db, `friends/${guestUser ? "guest" : currentUser?.uid}/usersFriends/${viewingUser.uid}`)
    const familyDocRef = doc(db, `family/${guestUser ? "guest" : currentUser?.uid}/usersFamily/${viewingUser.uid}`)
    const colleaguesDocRef = doc(db, `colleagues/${guestUser ? "guest" : currentUser?.uid}/usersColleagues/${viewingUser.uid}`)




const handleMutuals = () => {
  if (viewingUser.profileType === PROFILE_TYPES.OTHER) {
    const isMyFriend = myGroups.friends.some((item) => item.uid === viewingUser.uid)
    const isMyFam = myGroups.family.some((item) => item.uid === viewingUser.uid)
    const isMyColl = myGroups.colleagues.some((item) => item.uid === viewingUser.uid)
  

  const amYourFriend = otherProfileGroups.friends.some((item) => guestUser ? item.uid === "guest" : item.uid === currentUser?.uid)
    const amYourFam = otherProfileGroups.family.some((item) => guestUser ? item.uid === "guest" : item.uid === currentUser?.uid)
    const amYourColl = otherProfileGroups.colleagues.some((item) => guestUser ? item.uid === "guest" : item.uid === currentUser?.uid)
  

  const mutualsArr = []

  if (isMyFriend && amYourFriend) {
    mutualsArr.push("Friends")
  }

  if (isMyFam && amYourFam) {
    mutualsArr.push("Family")
  }

  if (isMyColl && amYourColl) {
    mutualsArr.push("Colleagues")
  }

  setMutuals(mutualsArr)
}
}
    
    const initialChecks = async () => {

   

    const friendsDocSnap = await getDoc(friendsDocRef)
    const familyDocSnap = await getDoc(familyDocRef)
    const colleaguesDocSnap = await getDoc(colleaguesDocRef)

    const updatedGroupsArr = []

usersGroups.map(group => {
    if (group.name === "Friends" && friendsDocSnap.exists()) {
        updatedGroupsArr.push({ ...group, inGroup: true})
    } else if (group.name === "Friends" && !friendsDocSnap.exists()){
        updatedGroupsArr.push({...group, inGroup: false})
    }
    })

    usersGroups.map(group => {
    if (group.name === "Family" && familyDocSnap.exists()) {
        updatedGroupsArr.push({ ...group, inGroup: true})
    } else if (group.name === "Family" && !familyDocSnap.exists()){
        updatedGroupsArr.push({...group, inGroup: false})
    }
    })


    usersGroups.map(group => {
    if (group.name === "Colleagues" && colleaguesDocSnap.exists()) {
        updatedGroupsArr.push({ ...group, inGroup: true})
    } else if (group.name === "Colleagues" && !colleaguesDocSnap.exists()){
        updatedGroupsArr.push({...group, inGroup: false})
    }
    })

    const updatedSelectArr = []

     if (friendsDocSnap.exists()) {
      updatedSelectArr.push("Friends")
    } 

    if (familyDocSnap.exists()) {
      updatedSelectArr.push("Family")
    } 

if (colleaguesDocSnap.exists()) {
  updatedSelectArr.push("Colleagues")
    }



         setUsersGroups(updatedGroupsArr)
        setSelectedItems(updatedSelectArr)

    }

const retrieveAboutMeList = async () => {

const aboutMeArr = []

const detailsRef = collection(db, `${ viewingUser.profileType === PROFILE_TYPES.CURRENT ? "users" : "fakeProfiles" }/${viewingUser.uid}/${viewingUser.profileType === PROFILE_TYPES.CURRENT ? "detailsList" : "details"}`)
if (viewingUser.profileType === PROFILE_TYPES.CURRENT) {
  try {
    const querySnapshot = await getDocs(detailsRef);


querySnapshot.forEach((doc) => {
    
    aboutMeArr.push({id: doc.id,...doc.data()})

});
  } catch (err) {
    console.error("There's been an error: ", err)
  }
} else if (viewingUser.profileType === PROFILE_TYPES.GUEST) {
setProfileAboutMeList(guestDetails)
} else {
  try {
    const publicQ = query(detailsRef, where("access", "array-contains", "Anyone"))
const friendsQ = query(detailsRef, where("access", "array-contains", "Friends"))
const collsQ = query(detailsRef, where("access", "array-contains", "Colleagues"))
const famQ = query(detailsRef, where("access", "array-contains", "Family"))

const collsArr = otherProfileGroups.colleagues
const friendsArr = otherProfileGroups.friends
const famArr = otherProfileGroups.family



const publicQSnap = await getDocs(publicQ);
const friendsQSnap = await getDocs(friendsQ);
const collsQSnap = await getDocs(collsQ);
const famQSnap = await getDocs(famQ);

let isFriend = friendsArr.some((item) => {return guestUser ? item.uid === "guest" : item.uid === currentUser?.uid})
let isColl = collsArr.some((item) => {return guestUser ? item.uid === "guest" : item.uid === currentUser?.uid})
let isFam = famArr.some((item) => {return guestUser ? item.uid === "guest" : item.uid === currentUser?.uid})


publicQSnap.forEach((doc) => {
    
    aboutMeArr.push({id: doc.id,...doc.data()})

});


if (isColl) {
  collsQSnap.forEach(doc => {
    aboutMeArr.push({id: doc.id,...doc.data()})
  })
}

if (isFriend) {
  friendsQSnap.forEach(doc => {
    aboutMeArr.push({id: doc.id,...doc.data()})
  })
}

if (isFam) {
  famQSnap.forEach(doc => {
    aboutMeArr.push({id: doc.id,...doc.data()})
  })
}

  } catch (err) {
    console.error("There's been an error: ", err)
  }
}
 
if (viewingUser.profileType !== PROFILE_TYPES.GUEST){
setProfileAboutMeList(aboutMeArr)
}
setIsDataLoading(false)
}

const retrieveGroups = async () => {
        // Retrieve groups for the current user
        const groups = await fetchMyGroups();
        setMyGroups({...groups})
        if (viewingUser.profileType === PROFILE_TYPES.OTHER){
        // Retrieve groups for the other user
        const otherGroups = await fetchOtherUserGroups();
        setOtherProfileGroups({...otherGroups})
      }
      setAreMyGroupsLoading(false)
      // retrieveAboutMeList()
    
    };

    const handlePersonalData = () => {
       const traits = pageData.personalTraits.map((trait) => {
    let officialTraits = fullTraitsList.find((t) => t.name === trait)
    return officialTraits
  })

  const interests = pageData.personalInterests.map((interest) => {
    let officialInterests = fullInterestsList.find((i) => i.name === interest)
    return officialInterests
  })

  const professions = pageData.personalProfessions.map((prof) => {
    let officialProfessions = fullProfessionsList.find((p) => p.name === prof)
    return officialProfessions
  })

setPersonalTraits(pageData.personalTraits)
    setPersonalInterests(pageData.personalInterests)
    setPersonalProfessions(pageData.personalProfessions)
    setPersonalDataLoading(false)
    }


const fetchUserData = async () => {
    // setIsLoading(true)
     try {
      const res = await findUser()
    setPageData({...res})

    } catch (error) {
      console.error("There's been an error: ", error)
    }
    retrieveGroups()
}

const handleImgDownload = async () => {
const sceneryRef = ref(storage, `sceneryImages/${pageData?.sceneryImg?.srcName}`);


// Get the download URL
getDownloadURL(sceneryRef)
  .then((url) => {
    // Insert url into an <img> tag to "download"
    setScenery(url) 
  })
  .catch((error) => {
    // A full list of error codes is available at
    // https://firebase.google.com/docs/storage/web/handle-errors
    switch (error.code) {
      case 'storage/object-not-found':
         console.error("File doesn't exist")
        break;
      case 'storage/unauthorized':
         console.error("User doesn't have permission to access the object")
        break;
      case 'storage/canceled':
        console.error("User canceled the upload")
        break;
      case 'storage/unknown':
        console.error("Unknown error occurred, inspect the server response")
        break;
        default: 
        console.error("There's been an error")
    }
  });
}

const resetProfilePage = () => {
  setScenery("")
  setPageData({
        name: "",
    email: "",
    uid: "",
    sceneryImg: null,
    personalTraits: [],
    personalInterests: [],
    personalProfessions: [],
      })
      setProfileAboutMeList([])
}


useEffect(() => {
   if (!areMyGroupsLoading && profileAboutMeList.length === 0) {
retrieveAboutMeList()
handleMutuals()
      }
}, [areMyGroupsLoading, profileAboutMeList])



// This is for when user presses a different user on from their groups list, and tries to go back to their own profile page
useEffect(() => {
  setIsDataLoading(true)
  
         resetProfilePage()

   if (profileId === auth?.currentUser?.uid){
    setViewingUser({
      uid: auth?.currentUser?.uid,
      profileType: PROFILE_TYPES.CURRENT,
    })
       
} else if (profileId === "guest") {
setViewingUser({
      uid: "guest",
      profileType: PROFILE_TYPES.GUEST,
    })
} else {
setViewingUser({
      uid: profileId,
      profileType: PROFILE_TYPES.OTHER,
    })
}

  
handlePageData()
  // optional chaining
  // if (auth?.currentUser && !gotUserData) {
  // fetchUserData()
  // }
}, [profileId])

useEffect(() => {
    if (auth?.currentUser && viewingUser.profileType === PROFILE_TYPES.CURRENT) {

     const userDocRef = doc(db, `users/${auth?.currentUser?.uid}`)

const unsubscribe = onSnapshot(userDocRef, (userDoc) => {
  const updatedTraits = userDoc.data().personalTraits;
  const updatedInterests = userDoc.data().personalInterests
  const updatedProfs = userDoc.data().personalProfessions;
 
      setPersonalTraits(updatedTraits)
      setPersonalInterests(updatedInterests)
      setPersonalProfessions(updatedProfs)
  },
  (error) => {
    console.error("There's been an error: ", error)
  }
  );

return () => {
unsubscribe()
}
}
}, [])

useEffect(() => {
    if (!isDataLoading && viewingUser.profileType === PROFILE_TYPES.CURRENT) {
        handleImgDownload() 
        handlePersonalData()
    }
}, [isDataLoading, currentUser])

// useEffect(() => {
// if (viewingUser.profileType === PROFILE_TYPES.CURRENT && !isDataLoading) {
 
// }
// }, [viewingUser, isDataLoading])





const handlePageData = () => {
    setAreMyGroupsLoading(true)
    switch(viewingUser.profileType){
        case PROFILE_TYPES.GUEST: 
        setPageData({
            name: userFirstName,
    email: null,
    uid: "guest",
    sceneryImgSrcName: null,
    personalTraits: guestTraits,
    personalInterests: guestInterests,
    personalProfessions: guestProfessions,
        });
        setScenery("/images/scenery/daytime-city-view.jpg")
        // setIsDataLoading(false)
        retrieveGroups()
        break;
        case "current user": 
        fetchUserData()
        // setPageData(userData);
        break;
        case "other user":
        fetchUserData()
        setScenery("/images/scenery/purple-sunset-santorini.jpg")
        break;
        default: 
        console.error("There's been an error with the scenery image!")
    }
}

const tagsInfo = [
    {
            id: 1,
            title: "Personality Traits",
            bgcolor: theme.palette.orangePrimary.main,
            textColor: theme.palette.orangePrimary.darker,
            arrayState: pageData.personalTraits,
        },
        {
            id: 2,
            title: "Interests/Hobbies",
            bgcolor: theme.palette.lightGreenPrimary.main,
            textColor: theme.palette.lightGreenPrimary.darker,
            arrayState: pageData.personalInterests,
        },
        {
            id: 3,
            title: "Professions",
            bgcolor: theme.palette.aquaPrimary.main,
            textColor: theme.palette.aquaPrimary.darker,
            arrayState: pageData.personalProfessions,
        },
]

const tagsElements = tagsInfo.map(tag => (
    <Grid item key={tag?.id}>
      <Typography variant="body2">My {tag.title}:</Typography>
            <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            justifyContent="center"
            sx={{
              gap: "0.35rem",
            }}
          >
        {tag.arrayState.map(item => (
<Chip variant="filled" key={item} label={item}
sx={{
    bgcolor: tag.bgcolor,
    color: tag.textColor,
    fontWeight: 600,
}}
 />
        ))}
        </Stack>
        </Grid>
))


 
 
 const aboutMeElements = profileAboutMeList.map((item) => (
   
            <ListItem key={viewingUser.profileType !== PROFILE_TYPES.GUEST ? item?.id : item?.placeholderId}>
            <ListItemText primary={`${item.title}: ${item.description}`}
            // secondary={viewingUser.profileType !== PROFILE_TYPES.OTHER && `Can be seen by ~ ${item.access?.join(', ')}`}
            secondary={`Can be seen by ~ ${item.access?.join(', ')}`}
            />
            </ListItem>
        
    )
 )


  return (
    <>
    <Header/>
    <Box component="main" 
    sx={{
      padding: "7rem 0.5rem",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      minHeight: "100vh",
    //   minWidth: "100vw",
      textAlign: "center",
      background: theme.palette.lightGrayPrimary.main,
      position: "relative",
      flexShrink: 0,
      alignItems: "stretch",
    }}
    >
    <Grid container justifyContent="center" alignItems="center" flexBasis="auto" flexGrow={1} direction="column" spacing={4}>
 {guestUser && 
 <Grid item>
 <Alert severity="error">Please <Link
 style={{
              color: "rgb(95, 33, 32)",
              alignSelf: "center"
            }}
            to="/signup">create an account</Link> to save your details.</Alert>
            </Grid>
}

{isDataLoading ? <Typography>Loading...</Typography> : <>
        <Grid item>
        <Card sx={{  maxWidth: "50rem",
    bgcolor: theme.palette.lightGreenPrimary.light,
    [theme.breakpoints.down('md')]: {
        maxWidth: "30rem"
    },
    [theme.breakpoints.down('sm')]: {
        maxWidth: "24rem"
    },
    [theme.breakpoints.down(475)]: {
        maxWidth: "18rem"
    },}}>
    {!scenery ?
    (
        <Skeleton 
        sx={{ 
            // height: 140
            height: "16rem",
              [theme.breakpoints.down('md')]: {
        height: "12rem"
    },
    [theme.breakpoints.down('sm')]: {
        height: "10rem"
    },
    [theme.breakpoints.down(475)]: {
        height: "8rem"
    },
            }}
         animation="wave" variant="rectangular" />
    ) 
    :
    ( <CardMedia
        sx={{ 
            // height: 140
            height: "16rem",
              [theme.breakpoints.down('md')]: {
        height: "12rem"
    },
    [theme.breakpoints.down('sm')]: {
        height: "10rem"
    },
    [theme.breakpoints.down(475)]: {
        height: "8rem"
    },
            }}
        image={scenery}
        title="scenery"
      /> )
      }
      <CardContent>
      <Avatar 
      alt={viewingUser.profileType === PROFILE_TYPES.OTHER ? pageData.name : ""} 
      src={viewingUser.profileType === PROFILE_TYPES.OTHER ? `/images/avatars/${pageData?.imgName}` : ""}
      sx={{
        bgcolor: theme.palette.lightGreenPrimary.main,
        width: 80,
        height: 80,
        margin: "1rem auto",
        zIndex: 4,
        marginTop: "-50px",
          [theme.breakpoints.down('md')]: {
         width: 70,
        height: 70,
    },
    [theme.breakpoints.down('sm')]: {
        width: 60,
        height: 60,
    },
    [theme.breakpoints.down(475)]: {
       width: 50,
        height: 50,
    },
      }}
      >
      </Avatar>
        <Typography gutterBottom variant="h5" component="div">
          {pageData.name}
        </Typography>
       {viewingUser.profileType === PROFILE_TYPES.OTHER && 
       <>
       <Typography component="span" gutterBottom
        sx={{
            backgroundColor: theme.palette.lightPinkPrimary.main,
            padding: "5px 10px",
        }}
        >{!initialLoad ? `In My Group: ${selectedItems.length > 0 ? selectedItems.join(', ') : "N/A"}` : "..."}</Typography>
{mutuals.length > 0 && <Typography component="div" variant="subtitle1" sx={{
  color: theme.palette.oliveGreenPrimary.main
}} >Mutual: {mutuals.join(", ")}</Typography>}
        </>
        }
       <Grid container  justifyContent="center" alignItems="center" direction="column" spacing={2}
       sx={{
        marginTop: "0rem"
       }}
       >
      {tagsElements}
</Grid>
      </CardContent>
      <CardActions sx={{
        justifyContent:"center",
        marginBottom: "1rem",
      }}>
      {viewingUser.profileType !== PROFILE_TYPES.OTHER ? <ButtonGroup
  disableElevation
  variant="contained"
  aria-label="Profile editing buttons"
  orientation="vertical"

 
>
 <Grid
          container
          item
          justifyContent="center"
          alignItems="center"
          spacing={2}
          direction="column"
        >
<Grid item>
  <Button 
  color="lightPinkPrimary"
  onClick={handleOpenEditTraits}
  >Edit Traits</Button>
 </Grid> 
 <Grid item>
 <Button color="lightBrownPrimary"
 onClick={handleOpenEditList}
 >Edit List</Button>
  </Grid> 
  </Grid>
</ButtonGroup> : <Button color="lightPinkPrimary"
        onClick={handleOpenEditGroup}
        >Add/Remove from Group</Button>}
      {/*  <Button color="lightPinkPrimary"
        onClick={handleOpenEditGroup}
        >{viewingUser.profileType !== PROFILE_TYPES.OTHER ? "Edit Profile" : "Add/Remove from Group"}</Button> */}
      </CardActions>
      <Divider>More About Me</Divider>
      <CardContent>
      <List
      sx={{
         listStyleType: 'disc',
 pl: 2,
 '& .MuiListItem-root': {
  display: 'list-item',
 },
      }}
      >
      {aboutMeElements}
      </List>
      </CardContent>
    </Card>
        </Grid>

<Grid item>
<MyLists
myGroups={myGroups}
otherProfileGroups={otherProfileGroups}
areMyGroupsLoading={areMyGroupsLoading}
/>
</Grid>
</>
}

      </Grid>
    </Box>
  {viewingUser.profileType !== PROFILE_TYPES.OTHER ? 
  <>
  <EditTraitsDialog
  openEditTraits={openEditTraits}
  handleCloseEditTraits={handleCloseEditTraits}
  pageData={pageData}
  setPageData={setPageData}
  />
  <EditListDialog
  openEditList={openEditList}
  handleCloseEditList={handleCloseEditList}
  profileAboutMeList={profileAboutMeList}
  />
  </>
  :
   <EditGroupDialog
                openEditGroup={openEditGroup}
                handleCloseEditGroup={handleCloseEditGroup}
                selectedItems={selectedItems} setSelectedItems={setSelectedItems}
                initialChecks={initialChecks}
                friendsDocRef={friendsDocRef}
    familyDocRef={familyDocRef}
    colleaguesDocRef={colleaguesDocRef}
    usersGroups={usersGroups}
    setUsersGroups={setUsersGroups}
    initialGroups={initialGroups}
    initialLoad={initialLoad}
    setInitialLoad={setInitialLoad}
            />}
    </>
  );
}

export default ProfilePage;
