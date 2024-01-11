import { Button, TextField, Typography, Grid, Modal, Fade, Box } from '@mui/material'// component
import { makeStyles } from '@mui/styles'
import { useState } from 'react';
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
        padding: '8px 16px'
    },
    containedButton: {
        color: '#fff',
        fontSize: '14px',
        border: '1px solid #F45E29',
        borderRadius: '4px',
        fontWeight: 'normal',
        padding: '8px 16px'
    },
    modalHeading: {
        fontSize: 22
    }
}));

export default function CycleAddEditPage(props) {
    const { saveCycle, recordForEdit, openPopup, handleCloseEditPopup, handleOnChange, typeOptions, selectedType, setSelectedType } = props
    const classes = useStyles();

    return (
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
                        <div className={classes.modalTitle}>Create a Cycle</div>
                        <div>
                            <Typography style={{ textAlign: 'left', marginBottom: 10, fontSize: '16px' }} variant="subtitle2">Cycle Name *</Typography>
                            <TextField fullWidth value={recordForEdit?.cycleName} className="report_form_ui_input" name="cycleName" onChange={handleOnChange} inputProps={{ maxLength: 20 }} />
                            <Typography style={{ textAlign: 'left', marginBottom: 10, fontSize: '16px' }} variant="subtitle2">Type *</Typography>
                            <Select
                                value={selectedType}
                                options={typeOptions}
                                onChange={setSelectedType}
                                isClearable={true}
                            />
                            <div style={{ marginBottom: 0, marginRight: 0 }} className="modal-footer">
                                <Button onClick={handleCloseEditPopup} className={classes.outlineButton + " report_form_ui_btn cancel mr-2"} color="primary" variant="outlined">Cancel</Button>
                                <Button onClick={saveCycle} color="primary" autoFocus className={classes.containedButton + " report_form_ui_btn submit"} variant="contained">Submit And Map With Journey</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Fade>
        </Modal>
    )
}
