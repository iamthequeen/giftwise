import React, {useState, useEffect, useContext} from "react";
import { Box, Grid, Typography, useTheme, Button, TextField, ButtonGroup, Chip, Stack, ListItem, ListItemButton, ListItemAvatar, ListItemText, List, Avatar } from "@mui/material";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faAngleUp, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { fullTraitsList, fullInterestsList, fullProfessionsList } from "../../utils/data";
import { UserContext } from "../../utils/UserContext";
import {Link, useNavigate} from 'react-router-dom'
import { PROFILE_TYPES } from '../../utils/constants'
import {db} from "../../utils/firebaseSetup"
import { getDocs, collection, query, where } from "firebase/firestore"


function MyLists(props){
    const { myGroups, otherProfileGroups, areMyGroupsLoading } = props
    const theme = useTheme()

     const [expanded, setExpanded] = useState("");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const { guestUser, currentUser, viewingUser, setViewingUser} = useContext(UserContext)

  const navigate = useNavigate()


    const accordionsInfo = [
        {
            id: 1,
            title: "Family",
            list: viewingUser.profileType !== PROFILE_TYPES.OTHER ? myGroups?.family : otherProfileGroups?.family,
        },
        {
            id: 2,
            title: "Friends",
            list: viewingUser.profileType !== PROFILE_TYPES.OTHER ? myGroups?.friends : otherProfileGroups?.friends,
        },
        {
            id: 3,
            title: "Colleagues",
            list: viewingUser.profileType !== PROFILE_TYPES.OTHER ? myGroups?.colleagues : otherProfileGroups?.colleagues,
        },
    ]



    const profileAccordions = accordionsInfo.map((info) => (
        <Accordion disableGutters key={info.id} expanded={expanded === info.title} onChange={handleChange(info.title)}
        sx={{
            maxWidth: "26rem",
            width: "26rem",
    bgcolor: theme.palette.lightGreenPrimary.light,
    [theme.breakpoints.down('sm')]: {
        maxWidth: "24rem",
        width: "24rem",
    },
    [theme.breakpoints.down(475)]: {
        maxWidth: "18rem",
        width: "18rem"
    },
        }}
        >
        <AccordionSummary
          expandIcon={<FontAwesomeIcon icon={faAngleDown} />}
          aria-controls={`${info.title}-content`}
          id={`${info.title}-header`}
        >
          <Typography>{info.title}</Typography>
        </AccordionSummary>
       <AccordionDetails>
       { areMyGroupsLoading ?  <Typography>Loading...</Typography> : (
        info.list.length === 0 ? <Typography>None yet!</Typography> 
        :
        <List>
        {info.list.map(person => (
<ListItem key={person.uid} disablePadding>
<ListItemButton sx={{
    "&:hover": {
        bgcolor: theme.palette.lightGreenPrimary.main
    }
}}
onClick={() => {
    if (person.uid !== "guest") {
            setViewingUser({
            uid: person.uid,
            profileType: person.uid === currentUser?.uid ? PROFILE_TYPES.CURRENT : PROFILE_TYPES.OTHER
            })
            } else {
                setViewingUser({
            uid: person.uid,
            profileType: PROFILE_TYPES.GUEST
            })
            
        }
        navigate(`/profile/${person.uid}`)
        }}
>
<ListItemAvatar>
<Avatar
alt={person.name}
  src={person.uid === currentUser?.uid || person.uid === "guest" ? "" : `/images/avatars/${person?.imgName}`}
/>
</ListItemAvatar>
<ListItemText primary={person.name} />
</ListItemButton>
</ListItem>
        )
        )
        }
        </List>)
        }
        </AccordionDetails>
        </Accordion>
    ))

    return (
        <>

{profileAccordions}

        </>
    )
} 

export default MyLists