import React, {useState} from "react";
import { Modal, Fade, Box, Typography, Button } from "@mui/material";

const MinimalModal = (props) => {
    const {openStatus, handleModalClose,} = props;
    const [isOpen, setIsOpen] = useState(openStatus);
    return (
        <>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={isOpen}
                closeAfterTransition
                className={'modal-minimal'}
            >
                <Fade in={isOpen}>
                    <Box className="modal-container">
                        

                        <Box className="modal-body">
                               {props.children}
                        </Box>
                        
                    </Box>

                </Fade>
            </Modal>
        
        </>
    );
}


export default MinimalModal;