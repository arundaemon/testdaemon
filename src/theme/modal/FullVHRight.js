import React, { useEffect, useState } from "react";
import { Modal, Fade, Box, Typography, Button } from "@mui/material";
import { LoadingButton } from '@mui/lab';
import { ReactComponent as CloseIcon } from '../../assets/icons/icon-modal-cancel.svg';
import MinimizeIcon from '../../assets/icons/icon-minimize.svg'

const FullVHRight = (props) => {
    const [isSubmitting, setSubmitting] = useState(false)
    const { openStatus, submitFlag, handleSubmit, headerTitle, headerSubtitle = null, align = 'right', handleModalClose, disableHeader = false, handleMinimize } = props;

    const onSubmit = () => {
        setSubmitting(true)
        handleSubmit(setSubmitting)
    }



    return (
        <>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={openStatus}
                closeAfterTransition
                className={'modal-full-vh-right'}
            >
                <Fade in={openStatus}>
                    <Box className="modal-container">
                        <Box className="modal-header">
                            {
                                !disableHeader ?
                                    <Box className="modal-header-content">
                                        <Typography className="modal-header-title" variant="body2" component="h2">{headerTitle}</Typography>
                                        <Typography className="modal-header-subtitle" >{headerSubtitle}</Typography>
                                    </Box>
                                    : null
                            }
                            {props.minimizeModal ?
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end' }} onClick={handleMinimize}>
                                        <img style={{ height: 20, width: 20, cursor:'pointer' }} src={MinimizeIcon} />
                                    </div>
                                </div> : null
                            }
                        </Box>

                        <Box className="modal-body">
                            {props.children}
                        </Box>
                        <Box className={'modal-footer ' + align}>
                            <LoadingButton className={submitFlag ? 'form-btn submit' : 'form-btn submit'} onClick={submitFlag ? () => { } : onSubmit} variant="contained" loading={isSubmitting}>Submit</LoadingButton>
                            {/*<Button variant="contained" className={submitFlag?'form-btn submit':'form-btn submit'} onClick={submitFlag?() => {}:handleSubmit}>Submit</Button> */}
                        </Box>
                    </Box>

                </Fade>
            </Modal>

        </>
    );
}


export default FullVHRight;