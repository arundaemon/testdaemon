import { FormControl, Select, MenuItem } from "@mui/material";
import { ReactComponent as DropDownIcon } from "../../assets/icons/icon-angle-down.svg"

const SelectBasicFilter = ({label = '', placeholder, options, value, disabled = false, handleChange}) => {

    
    return (
        <FormControl>
            <Select
                variant="outlined"
                disabled={disabled}
                className='filter-select-basic'
                size="small"
                value={value}
                displayEmpty
                onChange={handleChange}
                renderValue={
                    value !== "" ? undefined : () => <div className='filter-select-basic-placeholder'>{placeholder}</div>
                }
                IconComponent={DropDownIcon}
                >
                    <MenuItem className="menu-item menu-item-none" value={""}>None</MenuItem>
                {
                options?.length && options?.map(((f,i) => (
                    <MenuItem key={i} className="menu-item" value={f}>{f}</MenuItem>
                )))   
                
                }
            </Select>
        </FormControl>
    )
}

export default SelectBasicFilter;