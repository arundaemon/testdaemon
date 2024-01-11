import React,{useState,useEffect} from "react";
import {Typography, Button,Box,Modal } from "@mui/material";
import ReactSelect from "react-select";
import toast from 'react-hot-toast';
import _ from 'lodash';
import { getStageList } from "../../config/services/stages";
import { getAllStatus} from "../../config/services/status";
import { getRuleList } from '../../config/services/rules';
import { v4 as uuidv4 } from 'uuid';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    borderRadius:1,
    boxShadow: 24,
    p: 4,
  };

export default function AddStageStatusModal({
        showModal,
        closeModal,
        getModalData,
        currentObj
    }){
        const [stageValue, setStageValue] = useState({})
        const [statusValue, setStatusValue] = useState({})
        const [stageList, setStageList] = useState([])
        const [statusList, setStatusList] = useState([])
        const [actualStageList, setActualStageList] = useState([])
        const [actualStatusList, setActualStatusList] = useState([])
        const [ruleList, setRuleList] = useState([])
        const [rule, setRule] = useState({})
        // console.log("id inside modal",id)

        const handeStageChange = (e) =>{
            setStageValue(e);
            setStatusValue({})
        }
 
        const handleModalSubmit = (e) =>{
             e.preventDefault();
             let paramsObj ={
                stageValue: stageValue.value,
                statusValue: statusValue.value,
                ruleId:rule.value
             }
             if(validation(paramsObj)){
                   //console.log(rule)
                   let value = `${stageValue.label} ${statusValue.label}`
                   let data ={
                    stage:actualStageList.find(obj => obj.stageName == stageValue.label),
                    status:actualStatusList.find(obj => obj.statusName == statusValue.label),
                    parent:currentObj.name,
                    ruleId:rule.value,
                    ruleName:rule.label
                   }
                   getModalData(data)
                   resetModalValues();
                   closeModal()
             }
        }

        const resetModalValues = () =>{
            setStageValue('')
            setStatusValue('')
            setRule('')
        }

        const handleCloseModal = () =>{
            resetModalValues();
            closeModal();
        }

        const validation = (data) =>{
            const {stageValue,statusValue,ruleId} =  data;
            if (!stageValue) {
                toast.error('Fill stageValue Field !')
                return false
            }
            else if (!statusValue) {
                toast.error('Fill statusValue Field !')
                return false
            }else if (!ruleId) {
              toast.error('Fill Rule Field !')
              return false
            }
            else {
                return true
            }
        }

        const fetchStageList = () => {
            let params = {status:1}
            getStageList(params)
              .then((res) => {
                //console.log("getAllStages res",res)
                if (res?.result) {
                  const modifiedStageList = res.result.map((stage) => {
                    stage.label = stage.stageName
                    stage.value = stage._id
                    return stage
                  })
                  setStageList(modifiedStageList)
                  setActualStageList(res.result)
                } else {
                  console.error(res)
                }
              })
        }

        const fetchStatusList = () => {
          let data = { stageId: stageValue.value }
          getAllStatus(data)
            .then((res) => {
              if (res?.result) {
                const modifiedStatusList = res.result.filter(obj => obj.statusName != currentObj.statusName).map((status) => {
                  status.label = status.statusName
                  status.value = status._id
                  return status                  
                })
                //console.log(modifiedStatusList)
                setStatusList(modifiedStatusList)
                setActualStatusList(res.result)
              } else {
                console.error(res)
              }
            })
        }
         
        const fetchRuleList = async () => {
          getRuleList()
            .then((res) => {
              if (res?.result) {                
                const modifiedRuleList = res.result.map((rule) => {
                  rule.label = rule.ruleName
                  rule.value = rule._id
                  return rule
                })
                //console.log('Rule',modifiedRuleList)
                setRuleList(modifiedRuleList);
              }
            })
            .catch(err => console.error(err))
        }
    
        useEffect(() => {
            fetchStageList();
            fetchRuleList();
            // fetchStatusList();
          }, [])

        useEffect(() => {
          if (!(_.isEmpty(stageValue))) {
            fetchStatusList()
          }
        }, [stageValue])
        
        // console.log("showModal======",showModal)
    return(
        <Modal
            open={showModal}
            // onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" textAlign={'center'}>Add a Stage/Status</Typography>
            <Box sx={{margin:"20px 0px 20px 0px"}}>
                <Typography sx={{marginBottom:"10px"}}>Stage Name</Typography>
                <ReactSelect
                    classNamePrefix="select"
                    placeholder="Select"
                    options={stageList}
                    components={{
                    IndicatorSeparator: () => null,
                    }}
                    value={stageValue}
                    onChange={handeStageChange}
                    // style={customStyles}
                />
            </Box>
            <Box>
                <Typography sx={{marginBottom:"10px"}}>Status Name</Typography>
                <ReactSelect
                    classNamePrefix="select"
                    placeholder="Select"
                    options={statusList}
                    components={{
                    IndicatorSeparator: () => null,
                    }}
                    value={statusValue}
                    onChange={e =>setStatusValue(e)}
                    // style={customStyles}
                />
            </Box>
            <Box>
              <Typography sx={{marginBottom:"10px"}}>Apply Rule</Typography>
              <ReactSelect
                classNamePrefix="select"
                placeholder="Select"
                options={ruleList}
                components={{
                  IndicatorSeparator: () => null,
                }}
                value={rule}
                onChange={ e => setRule(e)}
              />
            </Box>
            <Box sx={{display:"flex",justifyContent:"center",margin:"20px 0px 0px 0px"}}>
                <Button 
                    variant="outlined" 
                    sx={{margin:"0px 10px 0px 0px"}} 
                    onClick={handleCloseModal}>
                        Cancel
                </Button>
                <Button variant="contained" onClick={handleModalSubmit}>Submit</Button>
            </Box>
            </Box>
        </Modal>
    )
}