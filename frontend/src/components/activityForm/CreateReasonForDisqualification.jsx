import React, { useEffect, useState } from 'react'
import Page from "../Page";
import { TextField, Button, Box } from "@mui/material";
import _ from 'lodash';
import toast from 'react-hot-toast';
import { createReasonForDisqualifiction, updateReasonForDisqualification } from '../../config/services/reasonForDisqualification';

const CreateReasonForDisqualifiction = ({ showCreateSubject, updateObj, fetchSubjectList }) => {
    const [reasonForDisqualification, setSubjectName] = useState()
    const [dataToAdd, setDataToAdd] = useState({});
    const [newUpdateObj, setNewUpdateObj] = useState(updateObj)
    const validSubjectName = new RegExp('^[A-Za-z0-9 ]+$');


    const validateAddSubject = (data) => {
        let { reasonForDisqualification } = data

        if (!reasonForDisqualification) {
            toast.error('Fill Reason for Disqualification!')
            return false
        }
        else if (!/^[^\s].*/.test(reasonForDisqualification)) {
            toast.error('Enter a valid Reason for Disqualification!')
            return false
        }
        else if (!validSubjectName.test(reasonForDisqualification)) {
            toast.error('Enter a Reason for Disqualification!')
            return false
        }
        else {
            return true
        }
    }

    const handleSubjectName = (e) => {
        setSubjectName(e.target.value)
    }


    const addSubject = async (data) => {
        createReasonForDisqualifiction(data)
            .then((res) => {
                if (res?.result) {
                    toast.success(res?.message)
                    fetchSubjectList(true)
                }
                else if (res?.data?.statusCode === 0) {
                    let { errorMessage } = res?.data?.error
                    toast.error(errorMessage)
                }
                else {
                    console.error(res);
                }
            })
            .catch((error) => console.log(error, '...errror'))
    }

    const handleSubmit = () => {
        if (_.isEmpty(newUpdateObj)) {
            let filledDetails = _.cloneDeep(dataToAdd)
            filledDetails.reasonForDisqualification = reasonForDisqualification;
            if (validateAddSubject(filledDetails)) {
                addSubject(filledDetails)
                setSubjectName('')
                showCreateSubject()
            }
        }
        else {

            let { reasonForDisqualificationId } = newUpdateObj
            newUpdateObj.reasonForDisqualification = reasonForDisqualification
            // console.log(newUpdateObj, '...this is update obj')
            updateReasonForDisqualification(newUpdateObj)
                .then(res => {
                    // console.log(res, 'this is response')
                    if (res?.result) {
                        toast.success(res?.message);
                        fetchSubjectList(true);
                        setSubjectName('')
                        showCreateSubject()
                        setNewUpdateObj({})
                    }
                    else if (res?.data?.statusCode === 0) {
                        let { errorMessage } = res?.data?.error
                        toast.error(errorMessage)
                    }

                })

        }

    }

    return (

        <div className='add-matrix create-activity'>
            <Page title="Extramarks | Reason For Disqualification" className="main-container  datasets_container">
                <h4 className='heading' >Manage Reason For Disqualification</h4>
                <div style={{ marginTop: '40px' }}>
                    <b>Reason For Disqualification</b>
                </div>
                <div >
                    <TextField required name="reasonForDisqualification" type="text" id="outlined-basic" variant="outlined" value={reasonForDisqualification} onChange={handleSubjectName} defaultValue={updateObj?.reasonForDisqualification} />
                </div>

                <Box className='employ-btn-group' mt={2}>
                    <Button variant='outlined' onClick={showCreateSubject}>Cancel</Button>
                    <Button variant='contained' onClick={handleSubmit} >Submit</Button>
                </Box>
            </Page>

        </div>
    )
}
export default CreateReasonForDisqualifiction