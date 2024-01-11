import { React, useEffect } from "react";
import { Button, TextField, Typography, Grid, Modal, Fade, Box } from '@mui/material'// component
import { makeStyles } from '@mui/styles';
import { useNavigate } from "react-router-dom";
import { isDuplicateStage } from "../../config/services/stages";
import toast from 'react-hot-toast';
import Select from 'react-select';


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
        padding: "20px"
    },
    modalTitle: {
        fontSize: "20px",
        fontWeight: "600",
        marginBottom: "10px",
        textAlign: 'centre'
    },
    outlineButton: {
        color: '#85888A',
        fontSize: '14px',
        border: '1px solid #DEDEDE',
        borderRadius: '4px',
        fontWeight: 'normal',
        marginRight: '10px',
        // padding: '0.5rem 1.5rem'
        padding: '8px 16px'
    },
    containedButton: {
        color: '#fff',
        fontSize: '14px',
        border: '1px solid #F45E29',
        borderRadius: '4px',
        fontWeight: 'normal',
        // padding: '0.5rem 1.5rem'
        padding: '8px 16px'
    }
}));

export default function AddStageModal(props) {
    let { openPopup, recordForEdit, handleCloseEditPopup, handleOnChange, handleSaveButton, selectedType, setSelectedType, typeOptions } = props;
    const classes = useStyles();
    const navigate = useNavigate();


    const routeChange = async () => {

        if (!recordForEdit.stageName) {
            toast.error('Fill Stage Name')
            return;
        }
        isDuplicateStage({ stageName: recordForEdit.stageName })
            .then(res => {
                if (res?.data?.statusCode === 0) {
                    toast.error(res?.data?.error?.errorMessage)
                    return;
                }
                let url = `/authorised/cycle-stage-mapping/${recordForEdit.stageName}`;

                if (recordForEdit._id) {
                    url = `${url}/${recordForEdit._id}`
                }
                navigate(url);
            }).catch((err) => {
                console.log(err);
            })


    }

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

                    <div className={classes.modalPaper + " modal-box modal-md"} id="transition-modal-title">
                        <div>
                            <div className={classes.modalTitle} >Request to add a stage</div>

                            <div>
                                <Typography style={{ textAlign: 'left' }} variant="subtitle2">Stage Name *</Typography>

                                <TextField fullWidth value={recordForEdit?.stageName} className="report_form_ui_input" name="stageName" onChange={handleOnChange} inputProps={{ maxLength: 20 }} />
                                <Typography style={{ textAlign: 'left', marginBottom: 10, fontSize: '16px' }} variant="subtitle2">Type *</Typography>
                                <Select
                                    value={selectedType}
                                    options={typeOptions}
                                    onChange={setSelectedType}
                                    isClearable={true}
                                />
                                <div style={{ marginBottom: 0 }} className="modal-footer text-right" >
                                    <Button onClick={handleCloseEditPopup} className={classes.outlineButton + " report_form_ui_btn cancel mr-2"} color="primary" variant="outlined" > Cancel </Button>
                                    <Button onClick={handleSaveButton} color="primary" autoFocus className={classes.containedButton + " report_form_ui_btn submit"} variant="contained"> Submit And Map With Cycle </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* </Box> */}
                </Fade>
            </Modal>
        </>
    )
}