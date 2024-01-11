import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { fetchLeadOwner } from '../../config/services/leadDetails';
import { DisplayLoader } from "../../helper/Loader";
import ProfileData from "./ProfileData";
import moment from 'moment';
import CubeDataset from "../../config/interface"
import ViewProfileData from './LeadProfileData';


export default function LeadListing() {
  const [leadObj, setLeadObj] = useState(null)
  const [owner, setOwner] = useState(null)
  const {leadId} = useParams()

  const fetchLead = async () => {
    let params = {leadId}
    let data = await fetchLeadOwner(params)
    data = data?.result
    //console.log('LeadData',data)
    if(data){
      let leadObj = {
        leadId: "",
        name: "",
        email: "",
        offline: false,
        source: "",
        subSource: "",
        mobile: "",
        city: "",
        state: "",
        dnd: false,
        otpVerified: false,
        leadOwner: "",
        type: "",
        createDate: new Date(),
        // registrationDate: '',
        appDownloadDate: "",
        registrationDate: "",
        assignedToRoleName: "",
        dndStatus:"",
        stageName: "",
        statusName: ""
      }
      leadObj.leadId = data?.[CubeDataset.Leadassigns.leadId]
      leadObj.name = data?.[CubeDataset.Leadassigns.name]
      leadObj.mobile = data?.[CubeDataset.Leadassigns.mobile]?.replace('-', '')
      leadObj.actualMobile = data?.[CubeDataset.Leadassigns.mobile]
      leadObj.city = data?.[CubeDataset.Leadassigns.city]
      leadObj.state = data?.[CubeDataset.Leadassigns.state]
      leadObj.stageName = data?.[CubeDataset.Leadassigns.stageName]
      leadObj.statusName = data?.[CubeDataset.Leadassigns.statusName]
      leadObj.userType = data?.[CubeDataset.Leadassigns.userType]
      leadObj.countryCode = data?.[CubeDataset.Leadassigns.countryCode]
      leadObj.createDate = moment(new Date(data?.[CubeDataset.Leadassigns.createdAt]))
      leadObj.type = data?.[CubeDataset.Leadassigns.type]
      leadObj.email = data?.[CubeDataset.Leadassigns.email]
      leadObj.assignedToRoleName = data?.[CubeDataset.Leadassigns.assignedToRoleName]
      leadObj.dndStatus=data?.[CubeDataset.Leadassigns.dndStatus]
      if (data?.[CubeDataset.Leadassigns.registrationDate] !== null && data?.[CubeDataset.Leadassigns.registrationDate] !== undefined) {
        leadObj.registrationDate = moment(new Date(data?.[CubeDataset.Leadassigns.registrationDate]));
      }
      if (data?.[CubeDataset.Leadassigns.type] === "offline") {
        leadObj.offline = true
      }
      setLeadObj(leadObj)
      setOwner(data)
      //console.log()
    }else{
      setOwner('noData')
    }  
  }


  useEffect(() => {
    fetchLead()
  }, [])

 
  return (
    <>
      {

      }
      {!owner ?
        <div
          style={{
            position: "absolute",
            height: "80vh",
            width: "90vw",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: 'red'
          }}>
          {DisplayLoader()}
        </div>        
        :
        (owner == 'noData' ?
        <div
          style={{
            position: "absolute",
            height: "80vh",
            width: "90vw",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: 'red'
          }}>
          {'No Lead Found'}
        </div>
        :
        <ViewProfileData leadProfileData={owner} leadObj={leadObj} />
        )
      }
    </>
  );
};




