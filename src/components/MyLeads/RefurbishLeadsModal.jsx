import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

import { Grid, Modal, Box, Typography, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Select from "react-select";
import md5 from "md5";
import _ from 'lodash';
import toast from "react-hot-toast";
import LoadingButton from '@mui/lab/LoadingButton';
import CrossIcon from "../../assets/image/crossIcn.svg";
import BredArrow from "../../assets/icons/icon-folder-remove.svg";
import FileIcon from "../../assets/icons/trial-file-icon.svg";
import FileError from "../../assets/icons/trial-file-error.svg";
import IconGreenTick from "../../assets/icons/trial-tick-icon.svg";
import { getAllStages } from "../../config/services/stages";
import { getAllStatus } from "../../config/services/status";
import { refurbishLeads } from "../../config/services/leadassign";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function RefurbishLeadsModal(props){
    let {refurbishModal, setRefurbishModal, selectedLeads, setCheckedLeads, reRenderLeadList } = props;
    const [stageList, setStageList] = useState([]);
    const [statusList, setStatusList] = useState([]);
    const [stage, setStage] = useState();
    const [status, setStatus] = useState();
    const [leadList, setLeadList] = useState([]);

    const navigate = useNavigate();

    const handleSelectStage = (e) => {
        setStage(e);
    }

    const handleSelectStatus = (e) => {
        setStatus(e);
    }

    const updatedList = (selectedLeads) => {
        selectedLeads.map(item => {
            let leadObj = {
                _id:  item['Leadassigns.Id'] ?? item._id,
                leadId:  item['Leadassigns.leadId'] ?? item.leadId,
                name:  item['Leadassigns.name'] ?? item.name,
                mobile: item['Leadassigns.mobile'] ?? item.mobile,
                email:  item['Leadassigns.email'] ?? item.email,
                city:  item['Leadassigns.city'] ?? item.city,
                sourceName:  item['Leadassigns.sourceName'] ?? item.sourceName,
                subSourceName:  item['Leadassigns.subSourceName'] ?? item.subSourceName,
                journeyName:  item['Leadassigns.journeyName'] ?? item.journeyName,
                stageName: stage?.stageName,
                statusName: status?.statusName,
                registrationDate:  item['Leadassigns.registrationDate'] ?? item.registrationDate,                
            }
            leadList.push(leadObj)


           
        })
        setLeadList([...leadList])

        updateStageStatus(leadList)
    }

    const validateFields = () => {
        if(!stage){
            toast.error('Please Select Stage')
            return false
        }
        if(!status){
            toast.error('Please Select Status')
            return false
        }
        return true
    }

    const handleSubmit = () => {
        if(validateFields()){
            updatedList(selectedLeads)
        }     
    }

    const fecthStageList = async () => {
        getAllStages()
            .then((res) => {
                if (res?.result) {
                    res?.result?.map(stageObj => {
                        stageObj.label = stageObj?.stageName
                        stageObj.value = stageObj._id
                        return stageObj;
                    })
                    setStageList(res?.result)
                }
            })
            .catch(err => console.error(err))
    }

    const fecthStatusList = async () => {
        getAllStatus()
        .then((res) => {
            if (res?.result) {
                res?.result?.map(statusObj => {
                    statusObj.label = statusObj?.statusName
                    statusObj.value = statusObj._id
                    return statusObj;
                })
                setStatusList(res?.result)
            }
        })
        .catch(err => console.error(err))
    }

    const updateStageStatus = async (data) => {
        refurbishLeads({leads: data})
            .then((res) => {
                if(res?.result){
                    toast.success(res?.message);
                    setRefurbishModal(!refurbishModal)                    
                    setStage();
                    setStatus();
                    setCheckedLeads([]);
                    setLeadList([]);
                    reRenderLeadList();


                }
            })
            .catch(error => {
                console.log(error,'.............eror');
            })

    }

    const handleClose = () => {
        setRefurbishModal(!refurbishModal)
        setLeadList([])
        setStage()
        setStatus()    
    }

    useEffect(() => {
        fecthStageList();
        fecthStatusList();
    },[])

    return (
        <>
        {refurbishModal && (
            <Modal
            open={refurbishModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
            <Box sx={style}>
                <Box align="right">
                <img
                    onClick={() => handleClose()}
                    className="crossIcon"
                    src={CrossIcon}
                    alt="crossIcon"
                />
                </Box>
                <Typography variant="h6" className="text-center">
                Change to
                </Typography><br/>
                <div style={{ display: 'flex', alignItems: 'center', marginLeft: '3rem'}}>
                    <span style={{ marginRight: '2.5rem' }}>Stage:</span>
                    <div style={{width: '150px'}}>
                    <Select value={stage} options={stageList} placeholder="Select Stage" onChange={(e) => handleSelectStage(e)}/>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginLeft: '3rem', marginTop: '1rem', widht: '600px' }}>
                    <span style={{ marginRight: '2rem' }}>Status:</span>
                    <div style={{width: '150px'}}>
                    <Select value={status} options={statusList} placeholder="Select Status" onChange={(e) => handleSelectStatus(e)}/>
                    </div>
                </div>
                <Box align="center" sx={{marginTop: '1rem'}}>
                    <Button variant="contained" type="submit" onClick={handleSubmit}>Submit</Button>              
                </Box>
            </Box>
          </Modal>
        )}
            
        </>
        
    )
}