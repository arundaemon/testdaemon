import React from "react";
import { FormControl, OutlinedInput, InputAdornment, FormHelperText, Typography, Box } from "@mui/material";


const InputText  = (props) => {
    const { helperText, labelName, endIcon=null, handleChange, value,disabled = false } = props;

    return (
        <>
        <Box className="form-input-container">
            <FormControl  sx={{ m: 1, width: '25ch' }} variant="outlined">
                <Typography className="form-input-label" variant="body2" >{labelName}</Typography>
                <OutlinedInput
                    id="outlined-adornment-text"
                    endAdornment={<InputAdornment position="end">{endIcon}</InputAdornment>}
                    aria-describedby="outlined-weight-helper-text"
                    inputProps={{
                        'aria-label': 'text',
                    }}
                    className="form-input-text"
                    onChange={handleChange}
                    value={value}
                    disabled={disabled}
                />
                <FormHelperText id="outlined-text-helper-text" >{helperText}</FormHelperText>
            </FormControl>
        </Box>
                
        </>
    )
}

export default InputText;