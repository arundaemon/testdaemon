import { useState, useEffect } from 'react';
import {
    List, ListItemIcon, ListItem, Typography, TextField, Box, Select, MenuItem, Button, Menu, DialogActions, DialogContent, DialogContentText,
    InputAdornment, Grid, Stack, Modal, Fade, Autocomplete, Breadcrumbs, Link, Checkbox
} from '@mui/material';
import { makeStyles, styled } from '@mui/styles';
import { ReactComponent as VisualizeIcon } from "../../assets/icons/icon-visualize.svg"
import SvgIcon from "@mui/material/SvgIcon";
import { getDataSets, getMeasuresList } from '../../config/services/reportEngineApis';
import { createRule, getRuleDetails, updateRule } from '../../config/services/rules';
import FunctionsOutlinedIcon from '@mui/icons-material/FunctionsOutlined';
import hashFill from '@iconify/icons-eva/hash-fill';
import { Icon } from '@iconify/react';
import DateRangeIcon from '@mui/icons-material/DateRange';
import LabelOutlinedIcon from '@mui/icons-material/LabelOutlined';
import _ from 'lodash';
import toast from 'react-hot-toast';
import DeleteIcon from "../../assets/icons/icon_trash.svg";
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { useNavigate, useParams } from 'react-router-dom';
import BreadcrumbArrow from '../../assets/image/bredArrow.svg';
import XRegExp from 'xregexp'
import DatePicker from "react-datepicker";
import { JourneyFilterList } from '../../helper/DataSetFunction';
import { numOperator, strOperator, defaultOperator } from '../../constants/JourneyOperator';
import JourneyOperator from '../../components/journeyOperator';
import ReactSelect from 'react-select'
import JourneyValuesElement from '../../components/journeyValueElement';
import moment from 'moment';



const ParseSvgIcon = ({ component }) => <SvgIcon component={component} width={100} height={100} />

const timeOperator = [
    { label: "In Date Range", value: "inDateRange", default: true },
    { label: "Not In Date Range", value: "notInDateRange", default: false },
    { label: "Before Date", value: "beforeDate", default: false },
    { label: "After Date", value: "afterDate", default: false },
    { label: "Today's Date", value: "todayDate", default: false },
    { label: "After Last 12 hours", value: "last12hr", default: false },
    { label: "Before Last 12 hours", value: "before12hr", default: false },
    { label: "After Last 6 hours", value: "last6hr", default: false },
    { label: "Before Last 6 hours", value: "before6hr", default: false }
]

const RootStyle = styled('div')(({ theme }) => ({
    [theme.breakpoints.up('lg')]: {
        flexShrink: 0,
    },
}))


const MainStyleWrapper = styled('div')(({ theme }) => ({
    height: '100%',
    width: '100%'
}))


const useStyles = makeStyles((theme) => ({
    autoCompleteInp: {
        fontWeight: 'normal'
    },
    searchFieldListItem: {
        paddingTop: '0.6rem',
        paddingBottom: '0.6rem',
        '&:hover': {
            background: "#f1f1f1",
            zIndex: 9,
            "& $listItemDescription": {
                visibility: 'visible'
            },
            "& $searchFieldListMoreIcon": {
                visibility: 'visible'
            }
        },

    },
    listItemDescription: {
        visibility: 'hidden',
        '&:hover': {
            visibility: 'visible'
        }
    },
}));

export default function CreateRule(props) {
    const classes = useStyles()
    const [dataSets, setDataSets] = useState([]);
    const [selectedDataSetObj, setSelectedDataSetObj] = useState({});
    const [selectedFieldObj, setSelectedFieldObj] = useState({});
    const [filterValue, setFilterValue] = useState([]);
    const [ruleName, setRuleName] = useState("");
    const [selectedOperator, setSelectedOperator] = useState({});
    const [fieldsList, setFieldsList] = useState([]);
    const [appliedFilterList, setAppliedFilterList] = useState([]);
    const [filterLogic, setFilterLogic] = useState({});
    const [flagValidation, setFlagValidation] = useState(false);
    const { ruleId } = useParams();
    const [createdBy] = useState(JSON.parse(localStorage.getItem('userData'))?.name);
    const [modifiedBy] = useState(JSON.parse(localStorage.getItem('userData'))?.name);
    const [createdBy_Uuid] = useState(JSON.parse(localStorage.getItem('userData'))?.uuid);
    const [modifiedBy_Uuid] = useState(JSON.parse(localStorage.getItem('userData'))?.uuid);
    const [flagvalid, setFlagValid] = useState(false);  //for onchange
    const [flagcheck, setFlagCheck] = useState(false)   // for validating first and error msg before submit after onchange
    const [ruleFieldName, setRuleFieldName] = useState('')
    const [valueDate, setValueDate] = useState(null);
    const [endDate, setEndDate] = useState(null)
    const [filerList, setFilterList] = useState([{}])
    const [selectedValue, setSelectedValue] = useState({})
    const [sourceParameter, setSourceParameter] = useState('')
    const [operatorList, setOperatorList] = useState([{}])
    const [flagDate, setFlagDate] = useState(false);
    const [filterArrayValues, setFilterArrayValues] = useState([])
    const [flagValue, setFlagValue] = useState(false)
    const [flagEndDate, setFlagEndDate] = useState(false)
    const [dateArray, setDateArray] = useState([])
    const [checked, setChecked] = useState(false)
    const [concurrentValue, setConcurrentValue] = useState(0)


    const CHARACTER_LIMIT = 20;

    const newRegex = new RegExp('^[0-9\(][ANDOR0-9\(\)]*[\)0-9]$')
    const mobileRegex = new RegExp('^[0-9]{10}$');
    const emailRegex = new RegExp('^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$');
    const reg = new RegExp('^[0-9]+$');

    const validateValue = (valueDataObj) => {

        // console.log(valueDataObj.value, '...........value')
        let dataType = selectedFieldObj.type;

        if (valueDataObj.dataset.dataSetName === undefined || valueDataObj.dataset.dataSetName === "") {
            toast.error('Please select the Dataset')
        }
        else if (valueDataObj.field.name === undefined || valueDataObj.field.name === "") {
            toast.error('Please select the field');
        }
        else if (valueDataObj.operator.selectedOperator.label === undefined || valueDataObj.operator.selectedOperator.label === "") {
            toast.error('Please select an operator');
        }
        else if ((selectedOperator.label === 'In Date Range' || selectedOperator.label === 'Not In Date Range') && valueDate && endDate == null) {
            toast.error('Select End Date')
            return
        }



        else if (valueDataObj?.filterValue?.length === 0 && !(selectedOperator?.value === "todayDate" || selectedOperator?.value === "last12hr" || selectedOperator?.value === "before12hr" || selectedOperator?.value === "last6hr" || selectedOperator?.value === "before6hr")) {
            if ((selectedOperator.label === 'In Date Range' || selectedOperator.label === 'Not In Date Range')) {
                if (valueDate === null) {
                    toast.error('Select Start Date')
                    return
                }
            }
            else {
                toast.error('Select Value')
                return
            }
        }
        else {

            if (dataType === "number" && valueDataObj?.filterValue?.map(value => reg.test(value)).includes(false)) {
                toast.error("Enter a valid number")
                return false
            }
            else if (dataType === "sum" && valueDataObj?.filterValue?.map(value => reg.test(value)).includes(false)) {
                toast.error("Enter a valid Number")
                return false
            }
            else if (dataType === "count" && valueDataObj?.filterValue?.map(value => reg.test(value)).includes(false)) {
                toast.error("Enter a valid Number")
                return false
            }
            else if (dataType === "countDistinct" && valueDataObj?.filterValue?.map(value => reg.test(value)).includes(false)) {
                toast.error("Enter a valid Number")
                return false
            }
            else if (dataType === "max" && valueDataObj?.filterValue?.map(value => reg.test(value)).includes(false)) {
                toast.error("Enter a valid Number")
                return false
            }
            else if (dataType === "min" && valueDataObj?.filterValue?.map(value => reg.test(value)).includes(false)) {
                toast.error("Enter a valid Number")
                return false
            }
            else if (valueDataObj?.field?.name === "mobile" && valueDataObj?.operator?.selectedOperator?.label
                !== "Filter list" && valueDataObj?.filterValue?.map(value => mobileRegex.test(value)).includes(false)) {
                toast.error("Enter a valid Mobile Number")
                return false
            }
            else if (valueDataObj?.field?.name === "email" && valueDataObj?.operator?.selectedOperator?.label !== "Filter list" && valueDataObj?.filterValue?.map(value => emailRegex.test(value)).includes(false)) {
                toast.error("Enter a valid email")
                return false
            }
            else {
                return true;
            }
        }
    }

    const navigate = useNavigate();

    const handleFilterLogic = (e) => {
        const { value } = e?.target
        let filterLogicCloned = _.cloneDeep(filterLogic)
        filterLogicCloned = { stringValue: value }
        setFilterLogic(filterLogicCloned)
        setFlagValid(false)
        setFlagCheck(false)

    }

    const fetchDatasetsList = () => {
        getDataSets()
            .then(resp => {
                if (resp?.result)
                    setDataSets(resp?.result)
                else
                    console.error(resp)
            })
    }

    useEffect(() => fetchDatasetsList(), []);

    const fetchRuleDetails = () => {
        if (!ruleId)
            return

        getRuleDetails({ ruleId })
            .then(resp => {
                if (resp?.result) {
                    let { result } = resp
                    let clonedFilters = _.cloneDeep(result?.filters)

                    clonedFilters?.map(obj => {
                        obj.dataset._id = obj?.dataset?.dataSetId
                        obj.field._id = obj?.field?.fieldId
                        return obj
                    })

                    setRuleName(result?.ruleName)
                    setFilterLogic(result?.logic)
                    setAppliedFilterList(clonedFilters)
                    if (result?.checked === true) {
                        setChecked(result?.checked)
                        setConcurrentValue(result?.concurrentValue)
                    }
                }
                else
                    console.error(resp)
            })
    }

    useEffect(() => fetchRuleDetails(), []);


    const handleSelectDataset = (e, selectedDataSet) => {
        setSelectedDataSetObj(selectedDataSet)
        setSelectedFieldObj({})
        setSelectedValue(null)
        setValueDate(null)
        setEndDate(null)
        setFlagDate(false)
        setFlagEndDate(false)
        setDateArray([])

        getMeasuresList({ dataSetId: selectedDataSet?._id })
            .then(resp => {
                if (resp?.result)
                    setFieldsList(resp?.result)
                else
                    console.error(resp)
            })
    }

    const handleSelectField = (e, selectedField) => {
        // console.log('=>..........parameter', selectedField)
        setSelectedFieldObj(selectedField)
        let selectedValues = `${selectedDataSetObj.dataSetName}.${selectedField.name}`
        //console.log(selectedValues, 'Table name')
        let dataType = selectedField.dataSetType == 'MEASURE' ? 'number' : selectedField.type
        let defaultParam = {}
        switch (dataType) {
            case 'string':
                defaultParam = strOperator.find(obj => obj.default)
                //console.log(defaultParam)
                setOperatorList(strOperator)
                break;
            case 'time':
                defaultParam = timeOperator.find(obj => obj.default)
                setOperatorList(timeOperator)
                break;
            case 'number':
                defaultParam = numOperator.find(obj => obj.default)
                setOperatorList(numOperator)
                break;
            default:
                defaultParam = defaultOperator.find(obj => obj.default)
                setOperatorList(defaultOperator)
                break;
        }
        //console.log(defaultParam, 'defaultParam')
        setSelectedOperator(defaultParam)
        setSourceParameter(selectedValues)
        setValueDate(null)
        setEndDate(null)
        setFlagDate(false)
        setFlagEndDate(false)
        setDateArray([])
    }

    const handleChangeOperator = (value) => {
        // selectedOperator?.default=false
        // const { value } = e?.target
        setSelectedOperator(value)
        setValueDate(null)
        setEndDate(null)
        setFlagDate(false)
        setFlagEndDate(false)
        setDateArray([])
        if (value.label == 'Filter list') {
            fetchFilterList()
        }
        //console.log(e,'.....event')
    }

    const handleRuleName = (e) => {
        const { value } = e?.target
        setRuleName(value)
    }

    const removeAppliedFilter = (index) => {
        let appliedFilterListCloned = _.cloneDeep(appliedFilterList)
        appliedFilterListCloned.splice(index, 1)
        setAppliedFilterList(appliedFilterListCloned)
    }

    const logicValidate = () => {

        let len = appliedFilterList?.length
        let value = filterLogic?.stringValue
        let lenOfValue = filterLogic?.stringValue?.length

        try {
            XRegExp.matchRecursive(value, '\\(', '\\)', 'g')
        }
        catch (err) {

            return false
        }

        if (len !== 1 && !newRegex.test(value))
            return false

        let regx = new RegExp(/(AND)|(OR)|[\)\(]/, 'g')
        var num = value.replaceAll(regx, '#').split('#').filter(String)

        const newarr = new Set(num)
        for (let i = 0; i < num.length; i++) {

            if (((_.inRange(num[i], 1, len + 1)) === false) || (newarr.size != len))
                return false
        }

        let str = value?.split(/AND|OR|/)
        // console.log(str,'..........str')
        for (let i = 0; i < str.length; i++) {
            if (str[i] === "" || (str[i].charCodeAt(0) >= 65 && str[i].charCodeAt(0) <= 90))
                return false
        }

        return true

    }

    const validate = () => {

        if (!logicValidate()) {
            setFlagCheck(false)
            toast.error("Enter a valid filter logic");
            return false;
        }
        else {
            setFlagValidation(true)
            setFlagValid(true)
            setFlagCheck(true)
            toast.success("Logic is valid")
            return true;
        }
    }

    const handleFilterValue = (e) => {
        // const { value } = e?.target
        const value = e?.target?.value
        let values = value ? value?.split('\n') : []
        setFilterArrayValues(values)
        setFilterValue(value)
        setFlagDate(false)
        setFlagValue(false)
    }

    const handleAddFilter = () => {

        if (flagDate) {
            dateArray.push(String(moment(valueDate).format('YYYY-MM-DD 00:00:00')))
        }
        if (flagEndDate) {
            dateArray.push(String(moment(endDate).format('YYYY-MM-DD 23:59:59')))
        }

        let tempFilterObj = {
            dataset: selectedDataSetObj,
            field: selectedFieldObj,
            operator: {
                // operatorLabel: selectedOperator,
                // operatorValue: selectedOperator
                selectedOperator
            },
            filterValue: flagDate ? dateArray :
                (flagValue ? [...selectedValue]?.map(item => item?.value) : filterArrayValues)
        }
        if (checked) {
            tempFilterObj["consecutive"] = concurrentValue;
            tempFilterObj["concurrent"] = true

        }


        if (validateValue(tempFilterObj)) {
            let appliedFilterListCloned = _.cloneDeep(appliedFilterList)
            appliedFilterListCloned.push(tempFilterObj)
            setAppliedFilterList(appliedFilterListCloned)

            setSelectedDataSetObj({})
            setSelectedFieldObj({})
            setFieldsList([])
            setSelectedOperator({})
            setFilterArrayValues([])
            setFilterValue([])
            setFlagCheck(false)
            setFlagDate(false)
            setFlagValue(false)
            setValueDate(null)
            setEndDate(null)
            setChecked(false)
            setConcurrentValue(0)

        }
    }

    const handleSelect = (e) => {
        setFlagValue(true)
        setSelectedValue(e)
        setFlagDate(false)
        setFlagEndDate(false)

    }

    const handleDateChange = (date) => {
        setDateArray([])
        setValueDate(date)
        setFlagDate(true)
        setFlagValue(false)
        setEndDate(null)
    }

    const handleEndDate = (date) => {
        setDateArray([])
        setEndDate(date)
        setFlagEndDate(true)
        setFlagValue(false)
    }

    const handleSaveRule = () => {
        if (!ruleName) {
            return toast.error('Enter Rule Name')
        }
        else if (filterLogic.stringValue === "") {
            return toast.error('Enter Filter Logic ')
        }
        else if (flagcheck === false) {
            toast.error("First validate  the Filter logic")
        }

        else if (flagValidation === true && flagvalid === true) {
            // console.log(appliedFilterList, 'this is applyed')
            let filters = appliedFilterList.map(obj => {
                obj.dataset = {
                    dataSetName: obj.dataset?.dataSetName,
                    displayName: obj.dataset?.displayName ?? obj.dataset?.dataSetName,
                    dataSetId: obj.dataset?._id,
                }

                obj.field = {
                    fieldName: obj?.field?.name ?? obj?.field?.fieldName,
                    displayName: obj.field?.displayName ?? obj.field?.name,
                    fieldId: obj.field?._id,
                }
                return obj
            })

            if (checked) {
                filters["consecutive"] = concurrentValue;
                filters["concurrent"] = true
            }

            let params = {
                ruleName,
                logic: filterLogic,
                filters,
                createdBy,
                createdBy_Uuid,
                modifiedBy,
                modifiedBy_Uuid,
            }

            if (ruleId) {
                params.ruleId = ruleId
            }

            if (ruleId) {
                return updateRule(params)
                    .then(res => {
                        if (res?.result) {
                            navigate('/authorised/rule-management/role-mapping', { state: { ...res?.result } })
                        }
                        else if (res?.data?.statusCode === 0) {
                            let { errorMessage } = res?.data?.error
                            toast.error(errorMessage)
                        }
                        else {
                            console.error(res);
                        }
                    })
            }

            createRule(params)
                .then(res => {
                    if (res?.result) {
                        navigate('/authorised/rule-management/role-mapping', { state: { ...res?.result } })
                    }
                    else if (res?.data?.statusCode === 0) {
                        let { errorMessage } = res?.data?.error
                        toast.error(errorMessage)
                    }
                    else {
                        console.error(res);
                    }
                })
        }

    }

    const fetchFilterList = () => {
        JourneyFilterList(sourceParameter)
            .then((res) => {
                // console.log(res, 'inside fetchFilterList')
                res?.loadResponses[0]?.data.map(filterObj => {
                    filterObj.label = filterObj?.[sourceParameter]
                    filterObj.value = filterObj?.[sourceParameter]
                    return filterObj
                })
                setFilterList(res?.loadResponses[0]?.data)
            })
            .catch(err => console.log(err))

    }
    const generateString = (data) => {
        if (Array.isArray(data)) {
            let str = data?.join(',');
            return str;
        }
        return data
    }

    const handleCheckbox = (e) => {
        setChecked(e.target.checked)
    }

    const handleConcurrentValue = (e) => {
        setConcurrentValue(e.target.value)
    }


    return (
        <>
            <div className="editRulePage">
                <div>
                    <Stack>
                        <Breadcrumbs className='create-journey-heading' separator={<img src={BreadcrumbArrow} alt="Arrow" />} aria-label="breadcrumb">
                            <Link className='box-col-pointer' color="inherit" onClick={() => navigate('/authorised/rule-management')}>
                                Manage Rule
                            </Link>

                            <Typography key="2" color="text.primary">
                                {ruleId ? "Update Rule" : "Create Rule"}
                            </Typography>
                        </Breadcrumbs>
                    </Stack>
                    <div className='containerMain'>

                        <Grid item xs={12} md={12}>
                            <Box className={classes.root}>
                                <Typography className='journey-name' variant='h5'>Rule Name</Typography>
                                <TextField
                                    className={classes.JourneyName + ` journey-Input-name `}
                                    type="text" placeholder='Rule Name'
                                    onChange={handleRuleName} value={ruleName}
                                />
                            </Box>
                        </Grid>
                        <div className='innerContainer'>
                            <div className="rule-sidebar" >
                                <Box>
                                    <Typography className="report-form-label font-weight-600 " variant="subtitle1" display="block"> Filter </Typography>
                                    {appliedFilterList?.map((filterObj, i) => (
                                        <Box className="filter_box">
                                            <Stack direction="row" width="100%" spacing={1}>
                                                <Typography variant="subtitle1" style={{ marginTop: '-5px' }}>{i + 1}.</Typography>
                                                <Typography className="report-form-label font-weight-normal" variant="subtitle1" display="block">{filterObj?.dataset?.displayName || filterObj?.dataset?.dataSetName}
                                                    {filterObj.concurrent && `( ${filterObj.consecutive} consecutive)`}
                                                </Typography>
                                                <Button onClick={() => removeAppliedFilter(i)} className='form_icon' ><img src={DeleteIcon} alt='' /></Button>
                                            </Stack>

                                            <span className="report-form-label font-weight-normal" variant="subtitle1"> {filterObj?.field?.displayName || filterObj?.field?.name} </span>
                                            <span className="report-form-label font-weight-normal" variant="subtitle1"> {filterObj?.operator?.selectedOperator?.label} </span>
                                            <span className="report-form-label font-weight-normal" variant="subtitle1"> {generateString(filterObj?.filterValue)} </span>
                                        </Box>))}
                                </Box>

                                {appliedFilterList?.length ? <Box>
                                    <Typography className="report-form-label font-weight-600 mt-1" variant="subtitle1" display="block"> Enter Logic </Typography>
                                    <TextareaAutosize
                                        className="cm_input_text_area"
                                        onChange={handleFilterLogic}
                                        value={filterLogic?.stringValue}
                                        placeholder="Enter like 1AND2OR3"
                                    />

                                    <Box className="modal-footer-simple">
                                        <Button className='validateButton' variant='contained' style={{ marginRight: '50px' }} onClick={validate}>Validate</Button>
                                        <Button color="primary" onClick={handleSaveRule} className="report_form_ui_btn mr-2 font-weight-600" variant="contained" > Save Rule </Button>
                                    </Box>
                                </Box> : null}
                            </div>


                            <div className="report-new-main-fields">
                                <Box>
                                    <Typography className="report-form-label font-weight-600" variant="subtitle1" display="block"> Dataset </Typography>
                                    <Autocomplete
                                        className="cm_rprt_setting_content report_form_ui_input_select pl-0 report_search_visual_dataset"
                                        classes={{ input: classes.autoCompleteInp }}
                                        size='small'
                                        ListboxProps={{ className: "visual-dataset-list" }}
                                        disablePortal
                                        disableClearable
                                        onChange={handleSelectDataset}
                                        value={selectedDataSetObj}
                                        options={dataSets}
                                        isOptionEqualToValue={(option) => option._id === selectedDataSetObj._id}
                                        getOptionLabel={(option) => option.displayName || option?.dataSetName || ""}
                                        renderInput={(params) => <TextField {...params} />}
                                        renderOption={(props, obj) => {
                                            return (
                                                <ListItem {...props} value={obj._id} button className={classes.searchFieldListItem + " report-list-item"} alignItems="flex-start">
                                                    <ListItemIcon sx={{ mt: '4px', mr: '8px' }}> <ParseSvgIcon component={VisualizeIcon} /> </ListItemIcon>
                                                    <Grid container >
                                                        <Grid item xs={12}>
                                                            <Typography variant="body2" className="text-plain"> {obj?.displayName} </Typography>
                                                        </Grid>
                                                        <Grid item xs={12} className="text-sub-grid">
                                                            <Typography variant="subtitle2" className="text-sub"> {obj.description ?? 'No description'} </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </ListItem>
                                            )
                                        }}
                                    />
                                </Box>


                                <Box>
                                    <Typography className="report-form-label font-weight-600 mt-1" variant="subtitle1" display="block"> Field Name </Typography>
                                    <Autocomplete
                                        className="cm_rprt_setting_content report_form_ui_input_select pl-0 report_search_visual_dataset"
                                        classes={{ input: classes.autoCompleteInp }}
                                        size='small'
                                        ListboxProps={{ className: "visual-dataset-list" }}
                                        disablePortal
                                        disableClearable
                                        onChange={handleSelectField}
                                        value={selectedFieldObj}
                                        options={fieldsList}
                                        isOptionEqualToValue={(option) => option._id === selectedFieldObj._id}
                                        getOptionLabel={(option) => option.displayName || option.name || ""}
                                        renderInput={(params) => <TextField {...params} />}
                                        renderOption={(props, measure) => {
                                            return (
                                                <ListItem {...props} button alignItems="flex-start">
                                                    <ListItemIcon sx={{ mt: '0px', mr: '8px' }}>
                                                        {measure.dataSetType === "MEASURE" ? <FunctionsOutlinedIcon className="cm_dimension_icon" /> : measure.type === "number" ? <Icon icon={hashFill} className="cm_measr_lbl num_icon" /> : measure.type === "time" ? <DateRangeIcon className="cm_measr_lbl" /> : <LabelOutlinedIcon className="cm_measr_lbl" />}
                                                    </ListItemIcon>

                                                    <Grid container>
                                                        <Grid item xs={12}>
                                                            <Typography className="text-plain"> {measure?.displayName || measure?.name}</Typography>
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <Typography variant="subtitle2" className={classes.listItemDescription + " text-sub"}>{measure?.description}  {(measure?.comment) ? `(${measure?.comment})` : ''} </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </ListItem>
                                            )
                                        }}
                                    />
                                </Box>

                                <Box>
                                    {/* {selectedFieldObj?._id ? <Typography className="report-form-label font-weight-normal" variant="subtitle1" display="block"> Operator </Typography> : null}
                                    {generateOperators()} */}
                                    <Typography className="report-form-label  font-weight-600 mt-1" variant="subtitle1" display="block"> Operator </Typography>
                                    <JourneyOperator
                                        onChangeFn={handleChangeOperator}
                                        selectedValue={selectedOperator}
                                        list={operatorList}

                                    />
                                </Box>
                                {!(selectedOperator?.value === "todayDate" || selectedOperator?.value === "last12hr" || selectedOperator?.value === "before12hr" || selectedOperator?.value === "last6hr" || selectedOperator?.value === "before6hr") &&
                                    <>

                                        <Box>

                                            <Typography className="report-form-label font-weight-600 mt-1" variant="subtitle1" display="block">{(selectedOperator?.label === 'In Date Range' || selectedOperator?.label === 'Not In Date Range') ? "Start Date" : "Value"} </Typography>
                                            <JourneyValuesElement
                                                onChangeFn={selectedFieldObj.type == 'time' ? handleDateChange : (selectedOperator && selectedOperator.label == 'Filter list' ? handleSelect : handleFilterValue)}
                                                selectedOperator={selectedOperator}
                                                selectedField={selectedFieldObj}
                                                valueDate={valueDate}
                                                selectedValue={selectedValue}
                                                list={filerList}
                                                filterValue={filterValue}

                                            />
                                        </Box>
                                        {
                                            (selectedOperator?.label === 'In Date Range' || selectedOperator?.label === 'Not In Date Range') &&
                                            <Box>
                                                <Typography className="report-form-label font-weight-600 mt-1" variant="subtitle1" display="block"> End Date </Typography>

                                                <DatePicker
                                                    className="dateInput"
                                                    disabled={valueDate ? false : true}
                                                    selected={endDate}
                                                    onChange={handleEndDate}
                                                    minDate={valueDate}
                                                    maxDate={new Date()}
                                                />
                                            </Box>

                                        }
                                    </>
                                }
                                <Box style={{ marginTop: '10px' }}>
                                    <label>Concurrent</label>
                                    <Checkbox type="checkbox" checked={checked} onChange={handleCheckbox} />
                                    <TextField className={classes.JourneyName + ` journey-Input-name `} style={{ width: '200px' }} type="number" value={concurrentValue} onChange={handleConcurrentValue} disabled={checked ? false : true} />
                                </Box>
                                <Box className="modal-footer-simple">
                                    <Button color="primary" onClick={handleAddFilter} className="report_form_ui_btn mr-2 font-weight-600 " variant="contained" > Apply Filter </Button>
                                    <Button color="primary" onClick={() => navigate('/authorised/rule-management')} > Cancel </Button>
                                </Box>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </ >
    )
}
