import { createContext, useState, useEffect } from "react";
import { createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "./firebaseSetup";
import LoadingScreen from "../components/ui/LoadingScreen/LoadingScreen";
import { doc, getDoc, getDocs, collection, onSnapshot } from "firebase/firestore";
import { PROFILE_TYPES, FORM_STEPS} from './constants'
import { useLocalStorage } from "./useLocalStorage";


export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  //   User Info
 
 const [userFirstName, setUserFirstName] = useState("Guest");

  const [guestUser, setGuestUser] = useLocalStorage("isGuestUser", false);

// const [currentUser, setCurrentUser] = useState(null);

const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('authUser')))

const [profileAboutMeList, setProfileAboutMeList] = useState([])

 const [hasDoneFormBefore, setHasDoneFormBefore] = useState(false)

// const [viewingUser, setViewingUser] = useState({
//     id: "",
//     profileType: ""
// });

// const [viewingUser, setViewingUser] = useState(JSON.parse(localStorage.getItem('viewingUserInfo')));

const [viewingUser, setViewingUser] = useLocalStorage("viewingUserInfo", {
    uid: "",
    profileType: "",
});

const [ formStep, setFormStep ] = useState(FORM_STEPS.TRAITS)

const [justLoggedOut, setJustLoggedOut] = useState(false);

  const [ personalTraits, setPersonalTraits ] = useState([])

  const [ personalInterests, setPersonalInterests ] = useState([])

  const [ personalProfessions, setPersonalProfessions ] = useState([])

const [myDetails, setMyDetails] = useState([])

const [ guestTraits, setGuestTraits ] = useLocalStorage("tempTraits", [])

  const [ guestInterests, setGuestInterests ] = useLocalStorage("tempInterests", [])

  const [ guestProfessions, setGuestProfessions ] = useLocalStorage("tempProfessions", [])

const [guestDetails, setGuestDetails] = useLocalStorage("tempDetails", [])

 useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
        
localStorage.setItem('authUser', JSON.stringify(user))
    //   setCurrentUser(user ? user : null)
      
    setCurrentUser(user)   
    }
    
    ,
     () => {
          localStorage.removeItem('authUser');
          setCurrentUser(null);
        }
    )
    return () => {
      unsubscribe()
    }
  })


// User functions
const resetData = () => {
          setViewingUser({
            uid: "", 
            profileType: "",
          });
          setPersonalInterests([])
          setPersonalProfessions([])
          setPersonalTraits([])
          setMyDetails([])

          setGuestTraits([])
          setGuestInterests([])
          setGuestProfessions([])
          setGuestDetails([])

          setProfileAboutMeList([])
          setHasDoneFormBefore(false)
          setFormStep(FORM_STEPS.TRAITS)
}

const resetGuestInfo = () => {
  setGuestUser(false)
  setGuestTraits([])
     setGuestInterests([])
   setGuestProfessions([])
    setGuestDetails([])
}

 const findUser = async () => {
    const docRef = doc(db, `${ viewingUser.profileType === PROFILE_TYPES.CURRENT ? "users" : "fakeProfiles" }/${viewingUser.uid}`)
    const docSnap = await getDoc(docRef)

    let res

    if (docSnap.exists()) {
        res = {...docSnap.data()}
    }

    
    return res

}

const [guestData, setGuestData] = useState({
  name: userFirstName,
    email: null,
    uid: "guest",
    sceneryImgSrcName: null,
    personalTraits,
    personalInterests,
    personalProfessions,
})


 const fetchMyGroups = async () => {

const friendsArr = []
const familyArr = []
const colleaguesArr = []

let myGroupsRes;

  try {
  const friendsQuerySnapshot = await getDocs(collection(db, `friends/${guestUser ? "guest" : currentUser?.uid}/usersFriends`));

  const familyQuerySnapshot = await getDocs(collection(db, `family/${guestUser ? "guest" : currentUser?.uid}/usersFamily`));

  const colleaguesQuerySnapshot = await getDocs(collection(db, `colleagues/${guestUser ? "guest" : currentUser?.uid}/usersColleagues`));

   
if (!friendsQuerySnapshot.empty) {

    for (let friendDoc of friendsQuerySnapshot.docs) {
     let docRef = doc(db, `fakeProfiles/${friendDoc.id}`)
    let docSnap = await getDoc(docRef)

    let res

    if (docSnap.exists()) {
        res = {...docSnap.data()}
        friendsArr.push(res)
    }
}
}

if (!familyQuerySnapshot.empty) {

    for (let familyDoc of familyQuerySnapshot.docs) {
     let docRef = doc(db, `fakeProfiles/${familyDoc.id}`)
    let docSnap = await getDoc(docRef)

    let res

    if (docSnap.exists()) {
        res = {...docSnap.data()}
        familyArr.push(res)
    }
}
}

if (!colleaguesQuerySnapshot.empty) {

    for (let colleagueDoc of colleaguesQuerySnapshot.docs) {
     let docRef = doc(db, `fakeProfiles/${colleagueDoc.id}`)
    let docSnap = await getDoc(docRef)

    let res

    if (docSnap.exists()) {
        res = {...docSnap.data()}
        colleaguesArr.push(res)
    }
    
  }
}



  } catch (err) {
    console.error("There's been an error: ", err)
  }

myGroupsRes = {
    friends: friendsArr,
    family: familyArr,
    colleagues: colleaguesArr,
}


return myGroupsRes
}

const fetchOtherUserGroups = async () => {

const friendsArr = []
const familyArr = []
const colleaguesArr = []

let otherGroupsRes;

  try {
  const friendsQuerySnapshot = await getDocs(collection(db, `friends/${viewingUser.uid}/usersFriends`));

  const familyQuerySnapshot = await getDocs(collection(db, `family/${viewingUser.uid}/usersFamily`));

  const colleaguesQuerySnapshot = await getDocs(collection(db, `colleagues/${viewingUser.uid}/usersColleagues`));

   
if (!friendsQuerySnapshot.empty) {

    for (let friendDoc of friendsQuerySnapshot.docs) {
     let docRef1 = doc(db, `fakeProfiles/${friendDoc.id}`)
    let docSnap1 = await getDoc(docRef1)

    let docRef2 = doc(db, `users/${friendDoc.id}`)
    let docSnap2 = await getDoc(docRef2)

    let res

    if (docSnap1.exists()) {
        res = {...docSnap1.data()}
        friendsArr.push(res)
    } else if (docSnap2.exists() && docSnap2.data().uid === currentUser?.uid) {
        res = {...docSnap2.data()}
        friendsArr.push(res)
    } else if (friendDoc.id === "guest" && guestUser){
      res = {...guestData}
      friendsArr.push(res)
    }
}
}

if (!familyQuerySnapshot.empty) {

    for (let familyDoc of familyQuerySnapshot.docs) {
     let docRef1 = doc(db, `fakeProfiles/${familyDoc.id}`)
    let docSnap1 = await getDoc(docRef1)

    let docRef2 = doc(db, `users/${familyDoc.id}`)
    let docSnap2 = await getDoc(docRef2)

    let res

    if (docSnap1.exists()) {
        res = {...docSnap1.data()}
        familyArr.push(res)
    } else if (docSnap2.exists() && docSnap2.data().uid === currentUser?.uid) {
        res = {...docSnap2.data()}
        familyArr.push(res)
    } else if (familyDoc.id === "guest" && guestUser){
      res = {...guestData}
      familyArr.push(res)
    }
}
}

if (!colleaguesQuerySnapshot.empty) {

    for (let colleagueDoc of colleaguesQuerySnapshot.docs) {
     let docRef1 = doc(db, `fakeProfiles/${colleagueDoc.id}`)
    let docSnap1 = await getDoc(docRef1)

    let docRef2 = doc(db, `users/${colleagueDoc.id}`)
    let docSnap2 = await getDoc(docRef2)

    let res

    if (docSnap1.exists()) {
        res = {...docSnap1.data()}
        colleaguesArr.push(res)
    } else if (docSnap2.exists() && docSnap2.data().uid === currentUser?.uid) {
        res = {...docSnap2.data()}
        colleaguesArr.push(res)
    } else if (colleagueDoc.id === "guest" && guestUser){
      res = {...guestData}
      colleaguesArr.push(res)
    }
  }
}



  } catch (err) {
    console.error("There's been an error: ", err)
  }

otherGroupsRes = {
    friends: friendsArr,
    family: familyArr,
    colleagues: colleaguesArr,
}

return otherGroupsRes
}

const unsubTraits = () => {

     const userDocRef = doc(db, `users/${currentUser?.uid}`)

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

const unsubList = () => {

     const listCollectionRef = collection(db, `users/${currentUser?.uid}/detailsList`)

const unsubscribe = onSnapshot(listCollectionRef, (snapshot) => {
  const updatedList = []

  snapshot.forEach((detailDoc) => {
    updatedList.push(detailDoc.data())
  })
 
      setProfileAboutMeList(updatedList)
  },
  (error) => {
    console.error("There's been an error: ", error)
  }
  );

return () => {
unsubscribe()
}

}


const createAccount = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password)
    };

    const login = (email, password) => {
   return signInWithEmailAndPassword(auth ,email, password)
  }



  const logout = () => {
    if (guestUser) {
        setGuestUser(false)
    } else {
    return signOut(auth)
    }
  }

 

// Confirm Logout Modal

     const [openConfirmModal, setOpenConfirmModal] = useState(false);

  const handleOpenModal = () => {
    setOpenConfirmModal(true);
  };

  const handleCloseModal = () => {
    setOpenConfirmModal(false);
  };

  // Values
  const val = {
    userFirstName, setUserFirstName,
    viewingUser, setViewingUser,
    personalTraits, setPersonalTraits,
    personalInterests, setPersonalInterests, 
personalProfessions, setPersonalProfessions,
    currentUser, 
    guestUser, setGuestUser,
    createAccount,
    justLoggedOut, setJustLoggedOut,
    login,
    logout,
    hasDoneFormBefore, setHasDoneFormBefore,
    openConfirmModal, setOpenConfirmModal,
    handleOpenModal, handleCloseModal,
    findUser,
    formStep, setFormStep,
    myDetails, setMyDetails,
    fetchMyGroups, fetchOtherUserGroups,
    unsubTraits, profileAboutMeList, setProfileAboutMeList, unsubList, resetData,
    guestTraits, setGuestTraits,
    guestInterests, setGuestInterests,
    guestProfessions, setGuestProfessions,
    guestDetails, setGuestDetails,
  resetGuestInfo
  };

  return <UserContext.Provider value={val}>{children}</UserContext.Provider>;
};