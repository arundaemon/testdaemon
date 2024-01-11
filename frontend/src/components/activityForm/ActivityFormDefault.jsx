import React,{useState, useEffect} from 'react'
import { Box, Typography, Button } from "@mui/material";

import { makeStyles } from "@mui/styles";
import Select from "react-select";
import FullVHRight from '../../theme/modal/FullVHRight';
import InputText from '../../theme/form/InputText';
import InputSelect from '../../theme/form/InputSelect';
import InputTextarea from '../../theme/form/InputTextarea';

import { subjectOptions, buyingDepositionOptions, appointmentStatusOptions } from '../../constants/ActivityForm';
import { getActivityFormNumber } from "../../config/services/activityFormMapping";


const ActivityFormDefault = ({open,submit,leadStageStatus,formList,setFormList, handleModalClose}) => {
    //const [open, setOpen] = useState(true);
    const [scroll, setScroll] = useState("paper");
    const [subjectName, setSubjectName] = useState({});
    const [subjectList,setSubjectList] = useState(subjectOptions)
    const [buyingDespositionList,setDespositionList] = useState(buyingDepositionOptions)
    const [appointmentStatusList,setAppointmentList] = useState(appointmentStatusOptions)
    const [buyingDeposition, setBuyingDeposition] = useState({})
    const [appointmentStatus, setAppointmentStatus] = useState({})
  
    const customStyles = {
      control: (base) => ({
        ...base,
        height: "54px",
        minHeight: "54px",
      }),
    };

    const SELECT = ({ options, onChange, placeholder = "Select", ...props }) => (
        <Select
          classNamePrefix="select"
          placeholder="Select"
          options={options}
          components={{
            IndicatorSeparator: () => null,
          }}
          onChange={onChange}
          style={customStyles}
          {...props}
        />
      );

    const handleSubjectChange = (subjectObj) => {
     // console.log(subjectObj)
      setSubjectName(subjectObj)
      let list = formList.filter(obj => obj.subject == subjectObj.value)
      let uniqueNames = [...new Set(["",...list.map(obj => obj.buyingDesposition)])]
      let despositionList = uniqueNames.map(obj => {return (obj)?{label:obj,value:obj}:{label:"Select",value:""}})
      setDespositionList([...new Set(despositionList)]) 
      uniqueNames = [...new Set(["",...list.map(obj => obj.appointmentStatus)])]
      let appointmentList = uniqueNames.map(obj => {return (obj)?{label:obj,value:obj}:{label:"Select",value:""}})
      setAppointmentList([...new Set(appointmentList)])
    }


    const handleSubmit = (e) =>{
      e.preventDefault();
        let data = {
            subjectName,
            buyingDeposition,
            appointmentStatus
        }
        
        submit(data)
    }

    const fetchActivityFormList = () => {
      if(leadStageStatus.stageName){
        let obj = {
          stageName:leadStageStatus.stageName.trim(),
          statusName:leadStageStatus.statusName.trim()
        }
        getActivityFormNumber(obj)
          .then(
            res => {
              let data = res.result
              setFormList(data)
              //console.log('List Default',data)
              if(data.length > 0){
                let uniqueNames = [...new Set(data.map(obj => {return obj.subject}))]
                let subjectlist = uniqueNames.map(obj => {return {label:obj,value:obj}})
                setSubjectList([...new Set(subjectlist)])
                uniqueNames = [...new Set(["",...data.map(obj => obj.buyingDesposition)])]
                let despositionList = uniqueNames.map(obj => {return (obj)?{label:obj,value:obj}:{label:"Select",value:""}})
                setDespositionList([...new Set(despositionList)])
                uniqueNames = [...new Set(["",...data.map(obj => obj.appointmentStatus)])]
                let appointmentList = uniqueNames.map(obj => {return (obj)?{label:obj,value:obj}:{label:"Select",value:""}})
                setAppointmentList([...new Set(appointmentList)])
                let obj = data[0]
                if(obj.subjectPreFilled){
                  setSubjectName({label:obj.subject,value:obj.subject})
                }else{
                  setSubjectName({label:"Select Subject",value:""})
                }
              }
            }
          )
      }        
    }

    useEffect(() => {
      
      fetchActivityFormList()
    },[leadStageStatus])
    
  return (
    <>
      <FullVHRight openStatus={open} headerTitle="Form 2" headerSubtitle="Loremsipum Loremsipum" handleSubmit={handleSubmit} handleModalClose={handleModalClose}
        disableHeader={true} >
          <>

            <InputSelect labelName={'Subject'} options={subjectList}
              handleChange={handleSubjectChange} value={subjectName} />

            {buyingDespositionList.filter(obj => obj.value).length > 0 && <InputSelect labelName={'Buying Desposition'} options={buyingDespositionList}
              handleChange={setBuyingDeposition} value={buyingDeposition} />}

            {appointmentStatusList.filter(obj => obj.value).length > 0 &&
                <InputSelect labelName={'Appointment Status'} options={appointmentStatusList}
                  handleChange={setAppointmentStatus} value={appointmentStatus} />

            }

            
            
          </>

      </FullVHRight>
    </>
      
   
           

  )
}

export default ActivityFormDefault;