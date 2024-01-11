import React from 'react';
import { Grid, Modal, Box, Typography, Button } from "@mui/material";
import PostAddIcon from '@mui/icons-material/PostAdd';

export const ApprovalAlert = () => {
  return (
        <Modal
            open={true}
            // onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
          <Box>
            <Typography>Your Request has Submitted For Approval.</Typography>
          </Box>
        </Modal>
  )
}
