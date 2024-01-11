//#region module
import React from 'react'
import { TextField } from '@mui/material';
//#endregion

export default function Input(props) {
    const { name, label, value,error=null, onChange, ...other } = props;
    
    return (
        <TextField
            variant="outlined"
            label={label}
            autoComplete="new-password"
            name={name}
            value={value}
            onChange={onChange}
            {...other}
            {...(error && {error:true,helperText:error})}
        />
    )
}
