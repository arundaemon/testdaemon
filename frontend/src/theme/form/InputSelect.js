import React from "react";
import { FormControl, Select, MenuItem, FormHelperText, Typography, Box } from "@mui/material";
import { ReactComponent as DropDownIcon } from "../../assets/icons/icon-angle-down.svg"


const InputSelect  = (props) => {
    const { helperText, labelName, options, handleChange, disabled = false } = props;

    const [selectedValue, setSelectedValue] = React.useState('');

    const handleUpdate = (e) => {
        setSelectedValue(e.target.value);
        handleChange(e.target.value)
    }

    return (
        <>
        <Box className="form-input-container">
            <FormControl  sx={{ m: 1, width: '25ch' }} variant="outlined">
                <Typography className="form-input-label" variant="body2" >{labelName}</Typography>
                  <Select 
                    onChange={handleUpdate} 
                    className="form-input-select"
                    IconComponent={DropDownIcon} 
                    value={selectedValue}
                    disabled={disabled}
                  >
                        {
                            (options?.length) ? 
                                options.map((item, i) => {
                                    return  <MenuItem className="menu-item"  value={item}>{item.label}</MenuItem>
                                })

                            : null
                                
                        }
                  </Select>
                <FormHelperText id="outlined-text-helper-text">{helperText}</FormHelperText>
            </FormControl>
        </Box>
                
        </>
    )
}

export default InputSelect;