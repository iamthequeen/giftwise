import React, {useState, useEffect} from 'react';
import { Box, Grid, Typography, useTheme, Button, TextField, Alert, IconButton, List, ListItem, ListItemText, FormControlLabel, Checkbox, Accordion, AccordionSummary, AccordionDetails, Stack, FormGroup } from "@mui/material";
import { Controller, useController, useFieldArray, useForm } from "react-hook-form";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faMinus, faPlus, faAngleDown} from "@fortawesome/free-solid-svg-icons";

function AccessCheckboxes({ options, control, name }){

const { 
    field,
    formState: { errors }
 } = useController({
    control, 
    name
})

const [value, setValue] = useState(field.value || [])



    return (
         <>
         <FormGroup
         sx={{
            margin: "auto",
        }}
         >

         <Controller
          control={control}
          rules={{
                required: {
                  value: true,
                  message: "Check at least 1 box.",
                },
                }}
  name={name}
  render={({  }) => (
    options.map((access, index) => (
         <FormControlLabel
            key={access.id}
            
            label={access.name}
control={
    <Checkbox name={access.name} 
    checked={value.includes(access.name)} 
    {...field}
    value={access.name} onChange={(e) => {
        const checked = e.target.checked
        const accessName = e.target.value
        const valueCopy = [...value]
        let updatedValue;

        if (checked && (accessName === "Only me" || accessName === "Anyone")) {
            // only have array with "Only me" or "Anyone" if it's checked
            updatedValue = [accessName]
        } else if (checked) {
            // add string to array if it's checked but doesn't have the value of "Only me" or "Anyone" 
            valueCopy[index] = accessName
            updatedValue = valueCopy.filter(item => item !== "Only me" && item !== "Anyone")
        } else if (!checked) {
            //  if any value has been unchecked, remoove its value from the array
            valueCopy[index] = null
            updatedValue = valueCopy.filter(item => item !== accessName)
        }

// update checkbox value
// anyone: ["anyone"]
// only me: ["only me"]
// friends, colleagues, family: [friends, colleagues, family]


const finalValues = updatedValue.filter(viewer => viewer)
// send data to react hook form
field.onChange(finalValues)

// update local state
setValue(finalValues)
    }} />
}
        />
    ))
  )}
          />

         </FormGroup>
        </>
    )
}

export default AccessCheckboxes;

