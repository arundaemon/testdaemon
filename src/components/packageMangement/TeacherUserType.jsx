import { FormControl, ListItemText, MenuItem, Radio, Select, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import moment from 'moment';
import * as React from "react";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { handleKeyDown, handlePaste } from "../../helper/randomFunction";
import { useStyles } from "../../css/SchoolDetail-css";


const UserType = (props) => {
    let { durationTypeList, getuserTypeList, userTypeId, updateUserType, featureList, setFeatureList } = props
    const classes = useStyles();
    const [duration, setDuration] = useState([])
    const [durationValue, setDurationValue] = useState([])
    const [newFeatureArr, setNewFeatureArr] = useState(featureList || [])

    const handleDurationChange = (event, index) => {

        const { value } = event.target.value;

        const newDurationArray = [...duration];
        newDurationArray[index] = event.target.value;
        setDuration(newDurationArray);
        const newDurationValue = [...durationValue]
        newDurationValue[index] = ""
        setDurationValue(newDurationValue);

    }


    const handleDurationValueChange = (index, event, type) => {
        if (type === 'text') {
            const newDurationArray = [...durationValue];
            newDurationArray[index] = event.target.value;
            setDurationValue(newDurationArray);
        }
        else {
            let formatedDate = moment(event).format('YYYY-MM-DD')
            const newDurationArray = [...durationValue];
            newDurationArray[index] = formatedDate;
            setDurationValue(newDurationArray);
        }

    };


    const handleRemove = (indexToRemove) => {
        // const updatedFeatureList = [...featureList];
        // updatedFeatureList.splice(indexToRemove, 1);
        // setFeatureList(updatedFeatureList);
        const updatedFeatureList = [...newFeatureArr];
        let newUpdatedFeatureList = updatedFeatureList.filter((obj, index) => index !== indexToRemove)
        // updatedFeatureList.splice(indexToRemove, 1);
        setNewFeatureArr(newUpdatedFeatureList)
        setFeatureList(newUpdatedFeatureList);

    };


    useEffect(() => {
        const combinedArray = newFeatureArr?.map((element, index) => ({
            feature_id: element?.feature_id?.toString(),
            feature_duration_type_id: duration[index]?.id?.toString(),
            feature_duration_value: durationValue[index],
            userTypeId: userTypeId?.toString()
        }));

        getuserTypeList(combinedArray)

    }, [duration, durationValue]);


    const [dumy, setDumy] = useState([])
    useEffect(() => {
        let newARr = []
        let data = updateUserType
        if (data?.entity_user_types?.length > 0) {
            data?.entity_user_types?.[0]?.user_type_details?.map((item, index) => {
                let durationObj = {
                    id: item?.feature_duration_type_id,
                    name: item?.feature_duration_type,
                    status: 1
                }
                let durationval = item?.feature_duration_value
                setDuration((prevDuration) => [...prevDuration, durationObj]);
                setDurationValue((prevDurationValue) => [...prevDurationValue, durationval]);
            })
        }

        updateUserType?.entity_user_types?.map((user_data) => {
            user_data?.user_type_details?.map((item) => {
                newARr.push(item)
            })
        })
        setDumy(newARr)
    }, [updateUserType]);



    const getValue = (data, dumy) => {
        let result = dumy?.filter((obj) => obj.feature_id === data.feature_id)
        if (result.length) {
            return result[0].feature_duration_value
        }
        return ""
    }

    const getDurationValue = (data, dumy) => {
        let result = dumy?.filter((obj) => obj.feature_id === data.feature_id)
        if (result.length) {
            return result[0].feature_duration_type
        }
        return ""
    }


    return (
        <TableContainer component={Paper}>
            <Table aria-label="simple table" className="custom-table datasets-table">
                <TableHead>
                    <TableRow className="cm_table_head">
                        <TableCell> <div className='tableHeadCell'> Sr.No </div></TableCell>
                        <TableCell> <div className='tableHeadCell'> Feature Name  </div></TableCell>
                        <TableCell> <div className='tableHeadCell'> Duration Type </div></TableCell>
                        <TableCell> <div className='tableHeadCell'> Duration Value</div></TableCell>
                        <TableCell> <div className='tableHeadCell'> Action </div></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.entries(updateUserType)?.length === 0 && newFeatureArr && newFeatureArr?.length > 0 && newFeatureArr?.map((data, i) => (
                        <TableRow
                            key={i}
                            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">{i + 1}</TableCell>
                            <TableCell>
                                <TextField sx={{ "& input": { height: "10px" } }} disabled type="text" id="outlined-basic" variant="outlined" value={data?.feature_name} defaultValue="Class"
                                />
                            </TableCell>
                            <TableCell>
                                <FormControl sx={{ m: 0.5, width: 250 }}>
                                    <Select
                                        labelId="demo-multiple-checkbox-label"
                                        id={`demo-multiple-checkbox-${data?.feature_name}`}
                                        className={classes.selectForm}
                                        value={duration[i] || null}
                                        onChange={(event) => handleDurationChange(event, i)}
                                        renderValue={(selected) => selected.name}
                                    >
                                        {durationTypeList?.map((item) => (
                                            <MenuItem key={item?.id} value={item}>
                                                <Radio checked={duration[i]?.id === item.id} />
                                                <ListItemText primary={item?.name} />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </TableCell>
                            <TableCell>
                                {duration[i]?.id === 1 ?
                                    <DatePicker
                                        className={classes.dateNew}
                                        key={i}
                                        selected={durationValue[i] ? new Date(durationValue[i]) : null}
                                        onChange={(date) => handleDurationValueChange(i, date, 'dateformat')}
                                        minDate={new Date()}
                                        onKeyDown={(e) => {
                                            e.preventDefault();
                                        }}
                                        onChangeRaw={(e) => e.preventDefault()}
                                    />
                                    :
                                    <TextField
                                        key={i}
                                        sx={{ "& input": { height: "10px" } }}
                                        required
                                        name="Duration1"
                                        type="number"
                                        placeholder="Enter Number of Days"
                                        id="outlined-basic"
                                        variant="outlined"
                                        value={durationValue[i]}
                                        onChange={(event) => handleDurationValueChange(i, event, 'text')}
                                        onKeyDown={handleKeyDown}
                                        onPaste={handlePaste}
                                    />
                                }

                            </TableCell>

                            <TableCell className="edit-cell action-cell">
                                <Button className='form_icon' onClick={() => handleRemove(i)}>X</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                    {Object.entries(updateUserType)?.length > 0 && newFeatureArr?.map((data, i) => {
                        return (
                            <TableRow
                                key={i}
                                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">{i + 1}</TableCell>
                                <TableCell>
                                    <TextField sx={{ "& input": { height: "10px" } }} disabled type="text" id="outlined-basic" variant="outlined" value={data?.feature_name} defaultValue="Class"
                                    />
                                </TableCell>

                                <TableCell>
                                    <FormControl sx={{ m: 0.5, width: 250 }}>
                                        <Select
                                            labelId="demo-multiple-checkbox-label"
                                            id={`demo-multiple-checkbox-${data?.feature_name}`}
                                            className={classes.selectForm}
                                            value={getDurationValue(data, dumy) || null}
                                            onChange={(event) => handleDurationChange(event, i)}
                                            renderValue={(selected) => selected}

                                        >
                                            {durationTypeList?.map((item) => (
                                                <MenuItem key={item?.id} value={item}>
                                                    <Radio checked={duration[i]?.id === item.id} />
                                                    <ListItemText primary={item?.name} />
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </TableCell>

                                <TableCell>
                                    {duration[i]?.id === 1 ?
                                        <DatePicker
                                            className={classes.dateNew}
                                            key={i}
                                            selected={durationValue[i] ? new Date(durationValue[i]) : null}
                                            onChange={(date) => handleDurationValueChange(i, date, 'dateformat')}
                                            minDate={new Date()}
                                            onKeyDown={(e) => {
                                                e.preventDefault();
                                            }}
                                            onChangeRaw={(e) => e.preventDefault()}
                                        />
                                        :
                                        <TextField
                                            key={i}
                                            sx={{ "& input": { height: "10px" } }}
                                            required
                                            name="Duration1"
                                            type="number"
                                            placeholder="Enter Number of Days"
                                            id="outlined-basic"
                                            variant="outlined"
                                            // value={durationValue[i]}
                                            value={getValue(data, dumy) || ""}
                                            onChange={(event) => handleDurationValueChange(i, event, 'text')}
                                            onKeyDown={handleKeyDown}
                                            onPaste={handlePaste}
                                        />
                                    }

                                </TableCell>

                                <TableCell className="edit-cell action-cell">
                                    <Button className='form_icon' onClick={() => handleRemove(i)}>X</Button>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </TableContainer >
    );
}

export default UserType
