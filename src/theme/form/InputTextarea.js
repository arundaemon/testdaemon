import React from "react";
import { FormControl, OutlinedInput, FormHelperText, Typography, Box } from "@mui/material";


const InputTextarea  = (props) => {
    const { helperText, labelName, rows=4, handleChange, value } = props;

    return (
        <>
        <Box className="form-input-container">
            <FormControl  sx={{ m: 1, width: '25ch' }} variant="outlined">
                <Typography className="form-input-label" variant="body2" >{labelName}</Typography>
                <OutlinedInput
                    multiline
                    rows={rows}
                    id="outlined-adornment-text"
                    aria-describedby="outlined-weight-helper-text"
                    inputProps={{
                        'aria-label': 'text',
                    }}
                    className="form-input-text"
                    onChange={handleChange}
                    value={value}
                />
                <FormHelperText id="outlined-text-helper-text">{helperText}</FormHelperText>
            </FormControl>
        </Box>
                
        </>
    )
}

export default InputTextarea;