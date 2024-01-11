import { makeStyles } from '@mui/styles';
import { Autocomplete, TextField } from '@mui/material';
import ReactSelect from 'react-select'
import DatePicker from "react-datepicker";
import moment from 'moment';
import DateRangeIcon from '@mui/icons-material/DateRange';
const useStyles = makeStyles((theme) => ({
    conditionText: {
        // width: "30%",
        // margin: "5px"
        marginRight: '0px !important',
    }

}));
export default function JourneyValuesElement({ onChangeFn, selectedOperator, selectedField, list, valueDate, selectedValue, filterValue, searchedValue, setSearchedValue }) {
    const classes = useStyles();
    if (selectedField.type == 'time') {
        return <DatePicker
            className="dateInput"
            onChange={onChangeFn}
            selected={valueDate}
            maxDate={new Date()}
        />
    } else {
        if (selectedOperator && selectedOperator.label == 'Filter list') {
            return <ReactSelect
                closeMenuOnSelect={false}
                // className="basic-multi-select"
                isMulti
                onChange={onChangeFn}
                // value={selectedValue}
                options={list}
                onInputChange={(value) => setSearchedValue(value)}
                inputValue={searchedValue}
            />
        } else {
            return <TextField
                className={`minus valueInput ${classes.conditionText}`}
                variant="outlined"
                size='small'
                multiline
                maxRows={4}
                onChange={onChangeFn}
                value={filterValue}
            />

        }
    }
}