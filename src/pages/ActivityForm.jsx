import React, { useState } from "react";
import { Container } from "@mui/material";
import toast from 'react-hot-toast';
import _ from 'lodash'
import { useParams } from "react-router-dom";
import { submitActivityForm } from "../config/services/formActivity";
import Page from "../components/Page";
import ActivityFormComponent from "../components/activityForm/ActivityForm";
import { FORMS_LIST } from "../constants/ActivityForm";


export default function ActivityForm({id}) {
  // const { id } = useParams();
  // console.log(id);
  const selectedForm = FORMS_LIST[id];
  // console.log(selectedForm);

  const requiredFieldValues = [
    'conversationWith',
    'name',
    'buyingDeposition',
    'languageIssue',
    'followUpDate',
    'followUpTime',
    'comments'
  ]

  

  const validateFormFields = (fieldDetails) => {
      let { conversationWith, name, comments} = fieldDetails

      if (_.isEmpty(conversationWith)) {
          toast.error('Fill Conversation Fields!')
          return false
      }
      else if (!name) {
          toast.error('Fill name fields!')
          return false
      }
      else if (!comments) {
          toast.error('Fill the comments !')
          return false
      }
      else {
          return true
      }
  }

  const handleFormSubmit = (data,resetValues) =>{
    if(validateFormFields(data)){
      // console.log("data in activity form",data);
      const formDetails = {...data}
      submitActivityForm(formDetails)
        .then((res) =>{
          // console.log("data after submission activity form",res)
          if (res?.result) {
            toast.success(res?.message)
            resetValues()
          } else if (res?.data?.statusCode === 0) {
            let { errorMessage } = res?.data?.error
            toast.error(errorMessage)
          }
          else {
              console.error(res);
          }
        })
        .catch((error) =>{
          console.log("error inside activity form",error)
        })
    }
  }

  return (
    <>
      <Page
        title="Extramarks | User Management"
        className="main-container datasets_container"
      >
        <Container className="table_max_width">
          <h1>Activity Form</h1>
          <ActivityFormComponent 
            {...selectedForm} 
            id={id} 
            // requiredFieldValues={requiredFieldValues}
            handleFormSubmit={handleFormSubmit}
          />
        </Container>
      </Page>
    </>
  );
}
