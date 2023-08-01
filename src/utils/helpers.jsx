import SignupForm from "../components/SignupForm/SignupForm";
import UpdateProfile from "../pages/UpdateProfile/UpdateProfile";
import AboutMeList from "../pages/AboutMeList/AboutMeList";
import { Typography } from "@mui/material";
import { collection, getDocs, getDoc, query, where, doc } from "firebase/firestore";
import { db, auth } from "./firebaseSetup";
import ProfilePage from "../pages/routes/ProfilePage/ProfilePage";
import { FORM_STEPS } from "./constants";


export const getCurrentFormStep = (step) => {
  switch (step) {
    case FORM_STEPS.TRAITS:
      return <UpdateProfile />;
      case FORM_STEPS.LIST:
      return <AboutMeList />;
    case FORM_STEPS.SIGN_UP:
      return <SignupForm /> ;
    default:
      return <Typography variant="h1">Invalid Step. Please refresh the page</Typography>;
  }
};


export const findUser = async (profileType, userId) => {
    // const userCollectionRef = collection(db, "users")
    // const userQuery = query(userCollectionRef, where("uid", "==", auth.currentUser.uid))
    // const docRefs = await getDocs(userQuery)
    // const docRef = doc(db, `users/${auth?.currentUser?.uid}`)
    const docRef = profileType === "current" ? doc(db, `users/${userId}`) : doc(db, `fakeProfiles/${userId}`)
    const docSnap = await getDoc(docRef)

    let res

    if (docSnap.exists()) {
        res = {...docSnap.data()}
    }

    // docRefs.forEach(doc => {
    //     // res.push({
    //     //     documentId: doc.id, 
    //     //     ...doc.data()
    //     // })
    //     res = {
    //         documentId: doc.id, 
    //         ...doc.data()
    //     }
    // })
    return res

}

