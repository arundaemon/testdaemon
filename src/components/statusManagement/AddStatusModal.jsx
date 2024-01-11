import { React, useEffect } from "react";
import { Button, TextField, Typography, Grid, Modal, Fade, Box } from '@mui/material'// component
import { useForm } from "../useForm";
import { makeStyles } from '@mui/styles'
import { useNavigate } from 'react-router-dom'
import ReactSelect from 'react-select';
import { useState } from "react";
import { getAllStages } from '../../config/services/stages'

const initialFValues = {
    _id: 0,
    statusName: '',
    stageId: ''
}

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'auto',
        height: 'auto'
    },
    modalPaper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #fff',
        boxShadow: '0px 0px 4px #0000001A',
        minWidth: '300px',
        borderRadius: '4px',
        textAlign: 'center',
    },
    modalTitle: {
        fontSize: '18px',
    },
    outlineButton: {
        color: '#85888A',
        fontSize: '14px',
        border: '1px solid #DEDEDE',
        borderRadius: '4px',
        fontWeight: 'normal',
        marginRight: '10px',
        padding: '0.5rem 1.5rem'
    },
    containedButton: {
        color: '#fff',
        fontSize: '14px',
        border: '1px solid #F45E29',
        borderRadius: '4px',
        fontWeight: 'normal',
        padding: '0.5rem 1.5rem'
    }
}));

const stage = [{ id: '63206080d06b7262562a6247', name: 'stage1' }, { id: '63206089d06b7262562a6249', name: 'stage2' }]


export default function AddStatusModal(props) {
    const [allStageList, setAllStageList] = useState([]);

    const { list, recordForEdit, openPopup, checkDuplicateStatus, stageId, handleCloseEditPopup, handleOnChange, addOrEdit, handleSelectStageName, selectedType, setSelectedType, typeOptions } = props
    const classes = useStyles();



    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('statusName' in fieldValues) {
            temp.statusName = fieldValues.statusName ? "" : "This field is required."
        }
        if ('stageId' in fieldValues) {
            temp.stageId = fieldValues.stageId ? '' : 'This field is required.'
        }

        setErrors({
            ...temp
        })

        if (fieldValues === values)
            return Object.values(temp).every(x => x === "")
    }

    const {
        values,
        setValues,
        errors,
        setErrors,
    } = useForm(initialFValues, true, validate);

    // const [createdBy, setCreatedBy] = useState(JSON.parse(localStorage.getItem('userData'))?.username);
    // const [createdBy_Uuid] = useState(JSON.parse(localStorage.getItem('userData'))?.uuid);
    // const [modifiedBy, setModifiedBy] = useState(JSON.parse(localStorage.getItem('userData'))?.username);
    // const [modifiedBy_Uuid] = useState(JSON.parse(localStorage.getItem('userData'))?.uuid);
    // console.log(createdBy,'createdBy')




    const fetchAllStageList = () => {
        getAllStages()
            .then((res) => {
                if (res?.result) {
                    res?.result?.map(stageObj => {
                        stageObj.label = stageObj?.stageName
                        stageObj.value = stageObj._id
                        return stageObj;
                    })
                    setAllStageList(res?.result)
                }
            })
            .catch(err => console.error(err))
    }

    useEffect(() => {
        if (recordForEdit != null)
            setValues({
                ...recordForEdit
            })
    }, [recordForEdit, setValues])

    useEffect(() => fetchAllStageList(), [])

    return (
        <>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={openPopup}
                closeAfterTransition
            >
                <Fade in={openPopup}>
                    <Box >
                        {/* <Box className="modal-header p-1" >
                        <Typography variant="subtitle1" className={classes.modalTitle + " modal-header-title"} >Add a Status</Typography>
                    </Box> */}
                        <Box className="modal-content text-left box-popup-styles" style={{ height: '331px' }}>
                            <Grid container mb={2} spacing={2} >
                                <Grid item xs={12} sm={6} md={6} lg={6} className='box-status-model'>
                                    <Typography className="box-add-text label" mt={1}>Stage Name</Typography>
                                    <ReactSelect
                                        classNamePrefix="select"
                                        options={allStageList}
                                        className='box-status-select'
                                        value={recordForEdit?.stageId?.id}
                                        onChange={handleSelectStageName}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container mb={2} spacing={2} >
                                <Grid item xs={12} sm={6} md={6} lg={6} className='box-status-model'>
                                    <Typography className="box-add-text label" variant="subtitle2" mt={1}> Status Name </Typography>
                                    <TextField fullWidth value={recordForEdit?.statusName} className="report_form_ui_input" name="statusName" onChange={handleOnChange} />
                                </Grid>
                            </Grid>
                            <Typography style={{ textAlign: 'left', marginBottom: 10, fontSize: '16px' }} variant="subtitle2">Type *</Typography>
                            <ReactSelect
                                value={selectedType}
                                options={typeOptions}
                                onChange={setSelectedType}
                                isClearable={true}
                            />
                            <Box className="modal-footer text-right footer-styles-btn">
                                <Button onClick={handleCloseEditPopup} className={classes.outlineButton + " report_form_ui_btn cancel mr-2"} color="primary" variant="outlined" > Cancel </Button>
                                <Button onClick={addOrEdit} color="primary" autoFocus className={classes.containedButton + " report_form_ui_btn submit"} variant="contained"> Submit </Button>
                            </Box>
                        </Box>
                    </Box>
                </Fade>
            </Modal>
        </>
    )
}

