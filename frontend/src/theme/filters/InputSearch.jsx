import { TextField, InputAdornment, IconButton } from "@mui/material";
import { ReactComponent as InputSearchIcon } from "../../assets/icons/icon-feather-search.svg"

const InputSearchFilter = ({label = '', placeholder, value, handleChange, handleSubmit}) => {

    
    return (
        <TextField className="filter-input-search" type="search" size="small" placeholder={placeholder}
            onChange={handleChange}
            value={value}
            InputProps={{
                endAdornment: (
                <InputAdornment position="start" className="">
                    <IconButton
                        className="filter-input-search-btn"
                        onClick={handleSubmit}
                        edge="end"
                        >
                            <InputSearchIcon className="filter-input-search-icon" />
                        </IconButton>
                    
                </InputAdornment>
                ),
                classes: {
                    adornedStart: "filter-input-search-icon-box"
                }
            }} 
        />
    )
}

export default InputSearchFilter;