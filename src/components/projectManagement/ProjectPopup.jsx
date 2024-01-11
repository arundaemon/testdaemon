import { Button, TextField, Typography, Grid, Modal, Fade, Box } from '@mui/material'// component
import { makeStyles } from '@mui/styles'

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

export default function ProjectPopup(props) {
    const { addOrEdit, recordForEdit, openPopup, handleCloseEditPopup, handleOnChange } = props
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
                {/* <Box className={classes.modalPaper + " modal-box modal-md"} id="transition-modal-title"> */}
                {/* <Box className="modal-header p-1" >
                        <Typography variant="subtitle1" className={classes.modalTitle + " modal-header-title"} >Project Details</Typography>
                    </Box> */}
                <Box className="modal-content text-left box-popup-styles" style={{ padding: '0.3rem 2.5rem 1rem' }} >
                    <Grid container mb={2} spacing={2} className='box-container-styles' >
                        <Typography className="label" variant="subtitle2" style={{ margin: '5px 5px' }}>Project Name *</Typography>
                        <TextField fullWidth value={recordForEdit?.projectName} className="report_form_ui_input" name="projectName" onChange={handleOnChange} />
                    </Grid>

                    <Grid container mb={2} spacing={2} className='box-container-styles2'>
                        <Typography className="label box-container-text" variant="subtitle2" style={{ margin: '5px 5px' }}>Project Description</Typography>
                        <TextField fullWidth value={recordForEdit?.projectDescription} className="report_form_ui_input" name="projectDescription" onChange={handleOnChange} />
                    </Grid>

                    <Box className="modal-footer text-right box-container-btn" >
                        <Button onClick={handleCloseEditPopup} className={classes.outlineButton + " report_form_ui_btn cancel mr-2"} color="primary" variant="outlined" > Cancel </Button>
                        <Button onClick={addOrEdit} color="primary" autoFocus className={classes.containedButton + " report_form_ui_btn submit"} variant="contained"> Submit </Button>
                    </Box>
                </Box>
                {/* </Box> */}
            </Fade>
        </Modal>
    )
}