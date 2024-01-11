import React from "react";
import { FormControl, Select, MenuItem, FormHelperText, Typography, Box, Checkbox, ListItemText} from "@mui/material";
import { ReactComponent as DropDownIcon } from "../../assets/icons/icon-angle-down.svg"


const InputMultiSelect  = (props) => {
    const { helperText, labelName, options, handleChange } = props;

    const [selectedValue, setSelectedValue] = React.useState(null);

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
                        className="report_form_ui_input_select pl-0 form-input-multiselect"
                        multiple
                        IconComponent={() => <DropDownIcon className="form-select-icon" />}
                        value={selectedValue ?? []}
                        renderValue={(selected) => selected.map(item => item?.label).join(", ")}
                        onChange={(e) => handleUpdate(e)}
                        MenuProps={{
                            classes: {
                                root: 'form-input-multiselect'
                            },
                            anchorOrigin: {
                              vertical: "bottom",
                              horizontal: "left"
                            },
                            transformOrigin: {
                              vertical: "top",
                              horizontal: "left"
                            },
                            getContentAnchorEl: null
                        }}
                    >
                        {
                            options?.map((item, i) => (
                                <MenuItem className='menu-item-small' key={i} value={item}>
                                    <Checkbox className="form_checkbox" checked={selectedValue?.indexOf(item) > -1} />
                                    <ListItemText className="text-small" primary={item?.label} />
                                </MenuItem>
                            ))
                        }
                    </Select>

                <FormHelperText id="outlined-text-helper-text">{helperText}</FormHelperText>
            </FormControl>
        </Box>
                
        </>
    )
}

export default InputMultiSelect;