import { Autocomplete, MenuItem } from '@mui/material';
import Select from 'react-select';
export default function JourneyOperator({ onChangeFn, selectedValue, list }) {
    return <div>
        <Select
            className="cm_rprt_setting_content report_form_ui_input_select report_search_visual_dataset"
            onChange={onChangeFn}
            options={list}
            getOptionLabel={(option) => option.label}
            getOptionValue={(option) => option.label}
            value={selectedValue}
        >
            {/* {
                list.map(
                    obj => (
                        <MenuItem
                            key={`${obj.value}-${obj.label}`}
                            value={obj}
                        >
                            {obj.label}
                        </MenuItem>
                    )
                )
            } */}
        </Select>
    </div>
}