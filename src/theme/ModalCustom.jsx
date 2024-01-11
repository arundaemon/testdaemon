import { memo, useState, useRef, useEffect } from "react";
import { Box, Button, Typography, Modal, Fade } from "@mui/material";
import { ReactComponent as IconClose } from "./../assets/icons/icon-modal-close.svg";

const ModalCustom = ({
  children,
  modalTitle = null,
  modalDescription = null,
  theme = "standard",
  isModalOpened,
  headerAligment = "left",
  headerMobileAlignment = "left",
  hasHeaderBorder = true,
  modalSize = "medium",
  modalMobileSize = "medium",
  handleModalSubmit = null,
  cancelText = "Cancel",
  submitText = "Submit",
  hasCloseIcon = true,
  handleClose = null,
  mobileActionButtonSize = "medium",
  handleCloseMeeting,
  submitActionEnabled = true,
  className = null,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(isModalOpened ?? false);
  const modalRef = useRef(null);
  const headerAlignmentCSSOptions = {
    left: "header-left-aligned",
    right: "header-right-aligned",
    center: "header-center-aligned",
  };
  const mobileHeaderAlignmentCSSOptions = {
    left: "mobile-header-left-aligned",
    right: "mobile-header-right-aligned",
    center: "mobile-header-center-aligned",
  };
  const headerSizeCSSOptions = {
    small: "modal-size-small",
    medium: "modal-size-medium",
    large: "modal-size-large",
    full: "modal-size-full",
  };

  // headerAligment options can be 'left', 'right' and 'center'
  // modalSize options can be small(300px), medium(650px), large(850px), full(100%)

  const handleModalClose = () => {
    handleCloseMeeting(false);
    setIsModalOpen(false);
    handleClose();
  };

  return (
    <Modal
      open={isModalOpen}
      onClose={handleModalClose}
      aria-labelledby="crm-modal-title"
      aria-describedby="crm-modal-description"
      className={`crm-modal ` + className}
      ref={modalRef}
    >
      <Fade in={isModalOpen}>
        <Box
          className={
            `crm-modal-container` +
            ` ` +
            headerAlignmentCSSOptions[headerAligment] +
            ` ` +
            mobileHeaderAlignmentCSSOptions[headerMobileAlignment] +
            ` ` +
            headerSizeCSSOptions[modalSize] +
            ` ` +
            (hasHeaderBorder ? `has-header-border` : ``) +
            ` ` +
            modalSize +
            ` mobile-action-btn-size-` +
            mobileActionButtonSize +
            ` mobile-modal-size-` +
            modalMobileSize +
            ` ` +
            theme
          }
        >
          <Box className="crm-modal-box">
            {hasCloseIcon ? (
              <Box className="crm-modal-close-icon" onClick={handleModalClose}>
                <IconClose />
              </Box>
            ) : null}

            {modalTitle ? (
              <Box className="crm-modal-header">
                <Typography
                  className="crm-modal-title"
                  id="crm-modal-title"
                  component="h2"
                >
                  {modalTitle}{" "}
                </Typography>
                {modalDescription ? (
                  <Typography component="p" className="crm-modal-description">
                    {modalDescription}
                  </Typography>
                ) : null}
              </Box>
            ) : null}

            <Box className="crm-modal-content">{children}</Box>

            {handleModalSubmit && submitActionEnabled ? (
              <Box className="crm-modal-footer">
                <Box className="crm-modal-footer-action">
                  <Button
                    className="crm-btn crm-btn-outline"
                    onClick={handleModalClose}
                  >
                    {cancelText}
                  </Button>
                  <Button
                    className="crm-btn crm-btn-primary"
                    onClick={handleModalSubmit}
                  >
                    {submitText}
                  </Button>
                </Box>
              </Box>
            ) : null}
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default memo(ModalCustom);
