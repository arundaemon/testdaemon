import React, { useEffect, useState } from 'react'
import Page from "../Page";
import { TextField, Button, Box } from "@mui/material";
import _ from 'lodash';
import toast from 'react-hot-toast';
import { createSubject, getSubjectList, updateSubject } from '../../config/services/subject';

const CreateSubject = ({ showCreateSubject, updateObj, fetchSubjectList }) => {
    const [subjectName, setSubjectName] = useState()
    const [dataToAdd, setDataToAdd] = useState({});
    const [newUpdateObj, setNewUpdateObj] = useState(updateObj)
    const validSubjectName = new RegExp('^[A-Za-z0-9 ]+$');


    const validateAddSubject = (data) => {
        let { subjectName } = data

        if (!subjectName) {
            toast.error('Fill Subject Name !')
            return false
        }
        else if (!/^[^\s].*/.test(subjectName)) {
            toast.error('Enter a valid Subject Name !')
            return false
        }
        else if (!validSubjectName.test(subjectName)) {
            toast.error('Enter a valid Subject Name !')
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
        createSubject(data)
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
            filledDetails.subjectName = subjectName;
            if (validateAddSubject(filledDetails)) {
                addSubject(filledDetails)
                setSubjectName('')
                showCreateSubject()
            }
        }
        else {

            let { subjectId } = newUpdateObj
            newUpdateObj.subjectName = subjectName
            // console.log(newUpdateObj, '...this is update obj')
            updateSubject(newUpdateObj)
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
            <Page title="Extramarks | Create Subject" className="main-container  datasets_container">
                <h4 className='heading' >Manage Subject</h4>
                <div style={{ marginTop: '40px' }}>
                    <b>Subject Name</b>
                </div>
                <div >
                    <TextField required name="subjectName" type="text" id="outlined-basic" variant="outlined" value={subjectName} onChange={handleSubjectName} defaultValue={updateObj?.subjectName} />
                </div>

                <Box className='employ-btn-group' mt={2}>
                    <Button variant='outlined' onClick={showCreateSubject}>Cancel</Button>
                    <Button variant='contained' onClick={handleSubmit} >Submit</Button>
                </Box>
            </Page>

        </div>
    )
}
export default CreateSubject