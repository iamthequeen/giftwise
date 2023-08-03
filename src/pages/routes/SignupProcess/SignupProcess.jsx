import React, { useContext, useEffect } from "react";
import { getCurrentFormStep } from "../../../utils/helpers";
import { UserContext } from "../../../utils/UserContext";
import Header from "../../../components/Header/Header";
import { FORM_STEPS } from "../../../utils/constants";


function SignupProcess() {
   
       const { formStep } = useContext(UserContext)


       useEffect(() => {
        window.scrollTo(0,0)
      }, [])

  return (
    <>
    <Header />
    {getCurrentFormStep(formStep)} 
    </>
  );
}

export default SignupProcess;