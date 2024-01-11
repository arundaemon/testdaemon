import React, { useEffect, useState } from 'react'
import Page from "../Page";
import { TextField, Button, Box } from "@mui/material";
import _ from 'lodash';
import toast from 'react-hot-toast';
import { createCustomerResponse, updateCustomerResponse } from '../../config/services/customerResponse';

const CreateCustomerResponse = ({ showCreateSubject, updateObj, fetchSubjectList }) => {
    const [customerResponse, setSubjectName] = useState()
    const [dataToAdd, setDataToAdd] = useState({});
    const [newUpdateObj, setNewUpdateObj] = useState(updateObj)
    const validSubjectName = new RegExp('^[A-Za-z0-9 ]+$');


    const validateAddSubject = (data) => {
        let { customerResponse } = data

        if (!customerResponse) {
            toast.error('Fill Customer Response!')
            return false
        }
        else if (!/^[^\s].*/.test(customerResponse)) {
            toast.error('Enter a valid Customer Response!')
            return false
        }
        else if (!validSubjectName.test(customerResponse)) {
            toast.error('Enter a Reason Customer Response!')
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
        createCustomerResponse(data)
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
            filledDetails.customerResponse = customerResponse;
            if (validateAddSubject(filledDetails)) {
                addSubject(filledDetails)
                setSubjectName('')
                showCreateSubject()
            }
        }
        else {

            newUpdateObj.customerResponse = customerResponse
            // console.log(newUpdateObj, '...this is update obj')
            updateCustomerResponse (newUpdateObj)
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
                <h4 className='heading' >Manage Customer Response</h4>
                <div style={{ marginTop: '40px' }}>
                    <b>Customer Response</b>
                </div>
                <div >
                    <TextField required name="Customer Response" type="text" id="outlined-basic" variant="outlined" value={customerResponse} onChange={handleSubjectName} defaultValue={updateObj?.customerResponse} />
                </div>

                <Box className='employ-btn-group' mt={2}>
                    <Button variant='outlined' onClick={showCreateSubject}>Cancel</Button>
                    <Button variant='contained' onClick={handleSubmit} >Submit</Button>
                </Box>
            </Page>

        </div>
    )
}
export default CreateCustomerResponse