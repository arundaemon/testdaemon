//#region module
import React from 'react'
import { Dialog, DialogTitle, DialogContent, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import Controls from './controls/Controls'
import CloseIcon from '@mui/icons-material/Close'
//#endregion

export default function Popup(props) {
  const { dialog, content } = props.calculatedFieldPopUp
    ? props.calculatedFieldPopUp.popupStyle
    : {}
  const { style } = props

  const useStyles = makeStyles((theme) => ({
    dialogWrapper: {
      padding: theme.spacing(0),
      // position: 'absolute',
      top: theme.spacing(0),
      ...(dialog && { width: dialog.width }),
      ...(dialog && { height: dialog.height }),
      ...dialog,
      ...style
    },
  }))

  const { title, children, openPopup, setOpenPopup, showCross = true } = props
  const classes = useStyles()

  return (
    // <Dialog open={openPopup} maxWidth="md" classes={{ paper: classes.dialogWrapper }} className="custom-modal">
    <Dialog open={openPopup} maxWidth="lg"  classes={{ paper: classes.dialogWrapper }} className="custom-modal">
      <DialogTitle className={classes.dialogTitle+" custom-modal-header"}>
        <div style={{ display: 'flex' }}>
          <Typography variant="h6" component="div" style={{ flexGrow: 1 }}> {title} </Typography>
          {showCross ?
            <Controls.ActionButton color="red" variant="contained" onClick={() => { setOpenPopup(false) }}>
              <CloseIcon />
            </Controls.ActionButton> : null}
        </div>
      </DialogTitle>

      <DialogContent dividers  style={content}> {children}</DialogContent>
    </Dialog>
  )
}
