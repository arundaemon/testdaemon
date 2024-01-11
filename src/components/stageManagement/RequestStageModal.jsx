import React from "react";
import { Button, TextField, Typography, Grid, Modal, Fade, Box } from '@mui/material'
import toast from 'react-hot-toast';
import { makeStyles } from '@mui/styles'
//import ReactSelect from 'react-select';

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

export default function RequestStageModal(props) {
    let { openPopup, recordForEdit, handleCloseEditPopup, handleOnChange, edit } = props;


    const classes = useStyles();


    return(
        <>
           <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={openPopup}
            closeAfterTransition
        >
            <Fade in={openPopup}>
                <Box className={classes.modalPaper + " modal-box modal-md"} id="transition-modal-title">
                    <Box className="modal-header p-1" >
                        <Typography variant="subtitle1" className={classes.modalTitle + " modal-header-title"} >Request to add Status</Typography>
                    </Box>
                    <Box className="modal-content text-left">
                        <Grid container mb={2} spacing={2} >
                            <Grid item xs={12} sm={6} md={6} lg={6} >
                                <Typography className="text-small label" variant="subtitle2" mt={1}> Stage Name </Typography>
                                <TextField fullWidth value={recordForEdit?.stageName} className="report_form_ui_input" name="statusName" onChange={handleOnChange} />
                            </Grid>
                        </Grid>                      
                        <Box className="modal-footer text-right" >
                            <Button onClick={handleCloseEditPopup} className={classes.outlineButton + " report_form_ui_btn cancel mr-2"} color="primary" variant="outlined" > Cancel </Button>
                            <Button onClick={()=>console.log('submit clicked')} color="primary" autoFocus className={classes.containedButton + " report_form_ui_btn submit"} variant="contained"> Submit </Button>
                        </Box>
                    </Box>
                </Box>
            </Fade>
        </Modal>
        </>
    )
}