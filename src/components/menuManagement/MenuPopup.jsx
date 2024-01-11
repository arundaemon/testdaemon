import { useEffect } from 'react';
import { Button, TextField, Typography, Grid, Modal, Fade, Box, FormGroup, FormControlLabel, Checkbox } from '@mui/material'
import { useForm } from "../useForm";
import { makeStyles } from '@mui/styles'
import ReactSelect from 'react-select';

const initialFValues = {
    _id: 0,
    roleName: ''
}

const menuOrderOptions = [
    { label: 1, value: 1 }, { label: 2, value: 2 }, { label: 3, value: 3 }, { label: 4, value: 4 }, { label: 5, value: 5 }, { label: 6, value: 6 }, { label: 7, value: 7 }, { label: 8, value: 8 }, { label: 9, value: 9 }, { label: 10, value: 10 },
    { label: 11, value: 11 }, { label: 12, value: 12 }, { label: 13, value: 13 }, { label: 14, value: 14 }, { label: 15, value: 16 }, { label: 17, value: 17 }, { label: 18, value: 18 }, { label: 19, value: 19 }, { label: 20, value: 20 },
    { label: 21, value: 21 }, { label: 22, value: 22 }, { label: 23, value: 23 }, { label: 24, value: 24 }, { label: 25, value: 25 }, { label: 26, value: 26 }, { label: 27, value: 27 }, { label: 28, value: 28 }, { label: 29, value: 29 }, { label: 30, value: 30 }
]

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'auto'
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

export default function MenuPopup(props) {
    const { addOrEdit, recordForEdit, openPopup, handleCloseEditPopup, handleOnChange, allMenusList, handleSelectParentMenu, allProjectsList, handleSelectProject, handleSelectMenuOrder, handleOtpVerify } = props
    const classes = useStyles();

    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('roleName' in fieldValues) {
            temp.roleName = fieldValues.roleName ? "" : "This field is required."
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


    useEffect(() => {
        if (recordForEdit != null)
            setValues({
                ...recordForEdit
            })
    }, [recordForEdit, setValues])

    // console.log('recordForEdit...menuorder', recordForEdit?.menuOrderIndex);

    return (
        <Modal
            className={classes.modal}
            open={openPopup}
            closeAfterTransition
        >
            <Fade in={openPopup}>
                <Box className={classes.modalPaper + " modal-box modal-md"} id="transition-modal-title">
                    <Box className="modal-header p-1">
                        <Typography variant="subtitle1" className={classes.modalTitle + " modal-header-title"} >Menu Details</Typography>
                    </Box>
                    <Box className="modal-content-simple text-left">
                        <Grid container mb={2} spacing={2} >
                            <Grid item xs={12} sm={6} md={6} lg={6} >
                                <Typography className="text-small label" variant="subtitle2">Menu Name *</Typography>
                                <TextField fullWidth value={recordForEdit?.name} className="report_form_ui_input" name="name" onChange={handleOnChange} />
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6} >
                                <Typography className="text-small label" variant="subtitle2">Menu Route *</Typography>
                                <TextField fullWidth value={recordForEdit?.route} className="report_form_ui_input" name="route" onChange={handleOnChange} />
                            </Grid>
                        </Grid>

                        <Grid container mb={2} spacing={2} >
                            <Grid item xs={12} sm={6} md={6} lg={6} >
                                <Typography className="text-small label" variant="subtitle2" mt={1}>Parent Menu</Typography>
                                <ReactSelect
                                    classNamePrefix="select"
                                    options={allMenusList?.filter(menuObj => menuObj?._id !== recordForEdit?._id)} //Don't include same menu in parent menu list
                                    value={recordForEdit?.parentMenu}
                                    onChange={handleSelectParentMenu}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6} md={6} lg={6} >
                                <Typography className="text-small label" variant="subtitle2" mt={1}>Project *</Typography>
                                <ReactSelect
                                    classNamePrefix="select"
                                    options={allProjectsList} //Don't include same menu in parent menu list
                                    value={recordForEdit?.projectId}
                                    onChange={handleSelectProject}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6} md={6} lg={6} >
                                <Typography className="text-small label" variant="subtitle2" mt={1}>Menu Order</Typography>
                                <ReactSelect
                                    classNamePrefix="select"
                                    options={menuOrderOptions}
                                    value={{ label: recordForEdit?.menuOrderIndex, value: recordForEdit?.menuOrderIndex }}
                                    onChange={handleSelectMenuOrder}

                                />
                            </Grid>
                            <Grid item xs={12} sm={4} md={4} lg={4} >
                                <Typography className="text-small label" variant="subtitle2" mt={1}> Icon URL </Typography>
                                <TextField fullWidth value={recordForEdit?.iconUrl} className="report_form_ui_input" name="iconUrl" onChange={handleOnChange} />
                            </Grid>
                        </Grid>

                        <Grid container mb={2} spacing={2} >


                            <Grid item xs={12} sm={4} md={4} lg={4} >
                                <Typography className="text-small label" variant="subtitle2" mt={1}> Redirection </Typography>
                                <FormGroup>
                                    <FormControlLabel onChange={handleOnChange} name='externalRedirection' control={<Checkbox checked={recordForEdit?.externalRedirection} />} label='External Url' />
                                </FormGroup>
                            </Grid>

                            <Grid item xs={12} sm={4} md={4} lg={4} >
                                <Typography className="text-small label" variant="subtitle2" mt={1}> Is HRM Menu </Typography>
                                <FormGroup>
                                    <FormControlLabel onChange={handleOnChange} name='isHrmMenu' control={<Checkbox checked={recordForEdit?.isHrmMenu} />} label='' />
                                </FormGroup>
                            </Grid>
                            <Grid item xs={12} sm={4} md={4} lg={4} >
                                <Typography className="text-small label" variant="subtitle2" mt={1}> Verify OTP </Typography>
                                <FormGroup>
                                    <FormControlLabel onChange={handleOtpVerify} name='isHrmMenu' control={<Checkbox checked={recordForEdit?.otpVerify} />} label='' />
                                </FormGroup>
                            </Grid>
                        </Grid>

                        {recordForEdit?.isHrmMenu ? <Grid container mb={2} spacing={2} >
                            <Grid item xs={12} sm={6} md={6} lg={6} >
                                <Typography className="text-small label" variant="subtitle2">landing Page</Typography>
                                <TextField fullWidth value={recordForEdit?.landingPage} className="report_form_ui_input" name="landingPage" onChange={handleOnChange} />
                            </Grid>
                        </Grid> : null}


                        <Box className="modal-footer text-right" >
                            <Button onClick={handleCloseEditPopup} className={classes.outlineButton + " report_form_ui_btn cancel mr-2"} color="primary" variant="outlined" > Cancel </Button>
                            <Button onClick={addOrEdit} color="primary" autoFocus className={classes.containedButton + " report_form_ui_btn submit"} variant="contained"> Submit </Button>
                        </Box>
                    </Box>
                </Box>
            </Fade>
        </Modal>
    )
}