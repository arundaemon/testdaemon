import React, { useEffect, useState,useMemo } from 'react';
import { makeStyles } from '@mui/styles';
import { Typography, Button, Box, Modal,Fade } from "@mui/material";
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
        minWidth: '200px',
        borderRadius: '4px',
        textAlign: 'center',
        padding: "20px"
    },
    modalTitle: {
        fontSize: '18px',
        textAlign: "left"

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
export default function DeleteModal({modalOpenFlag,onCancel,onSubmit,deleteMsg}) {
    const classes = useStyles();
    return (<Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={modalOpenFlag}
        closeAfterTransition
        >
        <Fade in={modalOpenFlag}>
            <Box className={classes.modalPaper + " modal-box modal-md"} id="transition-modal-title">
                <div >
                    <Typography style={{ whiteSpace: "pre-line" }} variant="subtitle1" className={classes.modalTitle} >
                        {deleteMsg}
                    </Typography>
                </div>
                {/* <Box className="modal-content text-left"> */}
                <Box style={{ marginBottom: 0, marginRight: 0 }} className="modal-footer text-right" >
                    <Button onClick={onCancel} className={" report_form_ui_btn cancel mr-2"} color="primary" variant="outlined" > Cancel </Button>
                    <Button onClick={onSubmit} color="primary" autoFocus className={" report_form_ui_btn submit"} variant="contained"> Ok </Button>
                </Box>
                {/* </Box> */}
            </Box>
        </Fade>
        </Modal>)
}