import { Box, Grid, Typography } from "@mui/material"
import ReactSelect from "react-select"
import {useStyles} from '../../../css/ClaimForm-css'
import { useState } from "react"


export const CommonDetailForm = () => {


  const classes = useStyles()


  const [amount, setAmount] = useState(null)

  const [uploadData,setUpload] = useState(null)

  return(
    <>
      <Grid item md={4} xs={12}>
        <Typography className={classes.label}>Amount</Typography>
          <input className={classes.inputStyle} name="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
      </Grid>

      <Grid item md={4} xs={12}>
        <Typography className={classes.label}>School Management</Typography>
          <input className={classes.inputStyle} type="file" onChange={(e) => setUpload(e.target.files[0])} />
      </Grid>
    </>
  )
}