import React, { useState, useEffect } from 'react';
import { TextField, Typography, Button, Box, Grid, Alert, Breadcrumbs, Link, List, ListItemIcon, ListItem, Autocomplete, MenuItem, Select, ThemeProvider } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { createJourney, updateJourney, getJourney } from '../config/services/journeys';
import { getDataSets, getMeasuresList } from '../config/services/reportEngineApis';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import _ from 'lodash';
import { useParams } from 'react-router-dom';
import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as VisualizeIcon } from "../assets/icons/icon-visualize.svg"
import FunctionsOutlinedIcon from '@mui/icons-material/FunctionsOutlined';
import hashFill from '@iconify/icons-eva/hash-fill';
import { Icon } from '@iconify/react';
import DateRangeIcon from '@mui/icons-material/DateRange';
import LabelOutlinedIcon from '@mui/icons-material/LabelOutlined';
import DatePicker from "react-datepicker";
import moment from 'moment';
import ReactSelect from 'react-select'
import { JourneyFilterList } from '../helper/DataSetFunction';
import BreadcrumbArrow from '../assets/image/bredArrow.svg';
import XRegExp from 'xregexp';
import { numOperator, strOperator, timeOperator, defaultOperator } from '../constants/JourneyOperator';
import JourneyOperator from '../components/journeyOperator';
import JourneyValuesElement from '../components/journeyValueElement';

const ParseSvgIcon = ({ component }) => <SvgIcon component={component} width={100} height={100} />
const useStyles = makeStyles((theme) => ({
    container: {
        margin: '0px 20px',
        maxWidth: '1900px',
        height: 'auto',
        background: '#FFFFFF 0% 0% no-repeat padding-box',
        boxShadow: '0px 0px 8px #00000029',
        borderRadius: '8px',
        opacity: '1',
        paddingBottom: "30px"
    },
    root: {
        margin: '0px 10px 0px 21px',
    },
    name: {
        display: "flex",

    },
    submitbtn: {

    },
    itemMapping: {
        display: "flex",
        justifyContent: 'space-between',
    },
    searchCondition: {
        display: "flex",
        justifyContent: 'space-between',
        padding: "0 0px 0 40px",

    },
    itemmapped: {
        // display: "flex",
        // justifyContent: 'space-between',

    },
    conditionTerms: {
        // marginRight: "350px",
        fontWeight: "600",
        fontSize: "14px",

    },
    box: {
        backgroundColor: "#FFEEDA",
        // border: "1px solid red"
        height: "40px",
        padding: "10px",
        borderRadius: "8px 8px 0 0",
        marginBottom: "20px",
        display: "flex",
        justifyContent: 'space-between',

    },
    selectParameter: {
        width: "100%",
        maxWidth: "320px",
        marginRight: "20px",
        fontSize: "14px",
        fontWeight: "600",
        lineHeight: "24px",
        maxHeight: "38px",
        marginBottom: "20px",
    },

    condition: {

    },
    conditionText: {
        // width: "30%",
        // margin: "5px"
    },
    deleteBtn: {
        // maxHeight: "38px",
        // marginLeft:"20px",
        // fontSize:"20px",
        // marginBottom:"20px",
        //margin: "5px 0px 0px 10px",
    },
    textFld: {
        width: "150px",
        marginLeft: "50px"

    }

}));

export default function CreateJourney() {
    // const {getJourneysList}=props
    // const [recordForEdit, SetRecordForEdit]=useState({});
    const [journeyName, setJourneyName] = useState("");
    const [filterSql, setFilterSql] = useState("");
    const [dataSets, setDataSets] = useState([]);
    const [selectedDataSetObj, setSelectedDataSetObj] = useState({});
    const [selectedFieldObj, setSelectedFieldObj] = useState({});
    const [selectedOperator, setSelectedOperator] = useState({});
    const [operatorList, setOperatorList] = useState([{}])
    const [createdBy, setCreatedBy] = useState(JSON.parse(localStorage.getItem('userData'))?.name);
    const [createdBy_Uuid] = useState(JSON.parse(localStorage.getItem('userData'))?.uuid);
    const [modifiedBy, setModifiedBy] = useState(JSON.parse(localStorage.getItem('userData'))?.name);
    const [modifiedBy_Uuid] = useState(JSON.parse(localStorage.getItem('userData'))?.uuid);
    const [filterArrayValues, setFilterArrayValues] = useState([])
    const [fieldsList, setFieldsList] = useState([]);
    const [filterValue, setFilterValue] = useState([]);
    const [valueDate, setValueDate] = useState(null);
    const [endDate, setEndDate] = useState(null)
    const [dateArray, setDateArray] = useState([])
    const [flagDate, setFlagDate] = useState(false);
    const [flagEndDate, setFlagEndDate] = useState(false)
    // const [submitData, setSubmitData] = useState({});
    const [condition, setCondition] = useState([]);
    const [flagValidation, setFlagValidation] = useState(false);
    const [flagvalid, setFlagValid] = useState(false);  // to check if logic is validated
    const [flagcheck, setFlagCheck] = useState(false)   // for validating first and error msg before submit after onchange
    const [selectedValue, setSelectedValue] = useState({})
    const [flagValue, setFlagValue] = useState(false)
    const [filerList, setFilterList] = useState([{}])
    const [sourceParameter, setSourceParameter] = useState('')
    const CHARACTER_LIMIT = 20;
    const classes = useStyles();
    const navigate = useNavigate();
    const { id } = useParams();


    const validJourneyName = new RegExp('^[A-Za-z0-9 ]+$');
    const newRegex = new RegExp('^[0-9\(][ANDOR0-9\(\)]*[\)0-9]$')
    const mobileRegex = new RegExp('^[0-9]{10}$');
    const emailRegex = new RegExp('^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$');
    const reg = new RegExp('^[0-9]+$');


    const validateValue = (valueDataObj) => {

        let dataType = selectedFieldObj.type;

        if (valueDataObj.dataset.dataset === undefined || valueDataObj.dataset.dataset === "") {
            toast.error('Please select the Dataset')
        }
        else if (valueDataObj.parameter.name === undefined || valueDataObj.parameter.name === "") {
            toast.error('Please select a parameter');
        }
        else if (valueDataObj.operator.selectedOperator.label === undefined || valueDataObj.operator.selectedOperator.label === "") {
            toast.error('Please select an operator');
        }
        else if ((selectedOperator.label === 'In Date Range' || selectedOperator.label === 'Not In Date Range') && valueDate && endDate == null) {
            toast.error('Select End Date')
            return
        }

        else if (valueDataObj.value.length === 0) {
            if ((selectedOperator.label === 'In Date Range' || selectedOperator.label === 'Not In Date Range')) {
                if (valueDate === null) {
                    toast.error('Select Start Date')
                    return
                }
            }
            else {
                toast.error('Please fill the value')
            }
        }
        else {

            if (dataType === "number" && valueDataObj?.value?.map(value => reg.test(value)).includes(false)) {
                toast.error("Enter a valid number")
                return false
            }
            else if (dataType === "sum" && valueDataObj?.value?.map(value => reg.test(value)).includes(false)) {
                toast.error("Enter a valid Number")
                return false
            }
            else if (dataType === "count" && valueDataObj?.value?.map(value => reg.test(value)).includes(false)) {
                toast.error("Enter a valid Number")
                return false
            }
            else if (dataType === "countDistinct" && valueDataObj?.value?.map(value => reg.test(value)).includes(false)) {
                toast.error("Enter a valid Number")
                return false
            }
            else if (dataType === "max" && valueDataObj?.value?.map(value => reg.test(value)).includes(false)) {
                toast.error("Enter a valid Number")
                return false
            }
            else if (dataType === "min" && valueDataObj?.value?.map(value => reg.test(value)).includes(false)) {
                toast.error("Enter a valid Number")
                return false
            }
            else if (valueDataObj?.parameter?.name === "mobile" && valueDataObj?.operator?.selectedOperator?.label
                !== "Filter list" && valueDataObj?.value?.map(value => mobileRegex.test(value)).includes(false)) {
                toast.error("Enter a valid Mobile Number")
                return false
            }
            else if (valueDataObj?.parameter?.name === "email" && valueDataObj?.operator?.selectedOperator?.label !== "Filter list" && valueDataObj?.value?.map(value => emailRegex.test(value)).includes(false)) {
                toast.error("Enter a valid email")
                return false
            }
            else {
                return true;
            }
        }
    }

    const logicValidate = () => {
        let len = condition?.length
        let value = filterSql
        let lenOfValue = filterSql?.length

        try {
            XRegExp.matchRecursive(value, '\\(', '\\)', 'g')
        }
        catch (err) {

            return false
        }

        if (len !== 1 && !newRegex.test(value)) {

            return false
        }

        let regx = new RegExp(/(AND)|(OR)|[\)\(]/, 'g')
        var num = value.replaceAll(regx, '#').split('#').filter(String)


        const newarr = new Set(num)

        for (let i = 0; i < num.length; i++) {

            if (((_.inRange(num[i], 1, (len + 1))) === false) || (newarr.size != len))
                return false
        }


        let str = value?.split(/AND|OR|/)

        for (let i = 0; i < str.length; i++) {
            if (str[i] === "" || (str[i].charCodeAt(0) >= 65 && str[i].charCodeAt(0) <= 90))
                return false
        }

        return true

    }

    const validate = () => {

        if (!logicValidate()) {
            toast.error("Enter a valid filter logic");
            setFlagCheck(false)
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

    const validateAddJourney = (filledDetails) => {
        let { journeyName, condition, filterSql, createdBy, modifiedBy } = filledDetails

        if (!journeyName) {
            toast.error('Fill Journey Name !')
            return false
        }
        else if (!/^[^\s].*/.test(journeyName)) {
            toast.error('Enter a valid Journey Name !')
            return false
        }
        else if (!validJourneyName.test(journeyName)) {
            toast.error('Enter a valid Journey Name !')
            return false
        }
        else if (condition.length === 0) {
            toast.error('Fill all conditions !')
            return false
        }
        else if (!filterSql) {
            toast.error('Fill filter logic !')
            return false
        }
        else if (!createdBy) {
            toast.error('Fill who created this journey !')
            return false
        }
        else if (!modifiedBy) {
            toast.error('Fill who modified the journey !')
            return false
        }

        else {
            return true
        }
    }
    const handleSelectDataset = (e, selectedDataSet) => {
        setSelectedDataSetObj(selectedDataSet)
        setSelectedFieldObj("")
        setFilterList([{}])
        setSelectedValue({})
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

        setSelectedFieldObj(selectedField)
        setValueDate(null)
        setEndDate(null)
        setFlagDate(false)
        setFlagEndDate(false)
        setDateArray([])
        let selectedValues = `${selectedDataSetObj.dataSetName}.${selectedField.name}`
        let dataType = selectedField.dataSetType == 'MEASURE' ? 'number' : selectedField.type
        let defaultParam = {}
        switch (dataType) {
            case 'string':
                defaultParam = strOperator.find(obj => obj.default)
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

        setSelectedOperator(defaultParam)
        setSourceParameter(selectedValues)
    }
    const handleChangeOperator = (value) => {
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


    }
    const handleFilterValue = (e) => {
        const value = e?.target?.value
        let values = value ? value?.split('\n') : []
        setFilterArrayValues(values)  // for submitt
        setFilterValue(value)
        setFlagDate(false)
        setFlagValue(false)
        setEndDate(null)
        setFlagEndDate(false)
        setDateArray([])
    }

    const handleDateChange = (date) => {
        setValueDate(date)
        setFlagDate(true)
        setFlagValue(false)
        setEndDate(null)
        setFlagEndDate(false)
        setDateArray([])
    }

    const handleEndDate = (date) => {
        setEndDate(date)
        setFlagEndDate(true)
        setFlagValue(false)
        setDateArray([])
    }

    const checkForDuplicate = (value) => {

        let flag = true;
        condition.forEach((item) => {
            if (value?.dataset?.dataset == item?.dataset?.dataset && _.isEqual(value?.value, item?.value) && value?.operator?.selectedOperator?.label == item?.operator?.selectedOperator?.label && value?.parameter?.name == item?.parameter?.name) {
                flag = false;
            }
        })
        return flag;
    }

    const addCondition = () => {
        //push date value into array
        if (flagDate) {
            dateArray.push(String(moment(valueDate).format('YYYY-MM-DD 00:00:00')))
        }
        if (flagEndDate) {
            dateArray.push(String(moment(endDate).format('YYYY-MM-DD 23:59:59')))
        }
        let newObj = {
            dataset: {
                dataset: selectedDataSetObj?.dataSetName,
                databaseName: selectedDataSetObj?.databaseName,
                displayName: selectedDataSetObj?.displayName,
                refreshKey: selectedDataSetObj?.refreshKey,
                sql: selectedDataSetObj?.sql,
                tableAlias: selectedDataSetObj?.tableAlias,
                tableName: selectedDataSetObj?.tableName

            },
            parameter: {
                ...selectedFieldObj
            },
            operator: {
                selectedOperator
            },


            value: flagDate ? dateArray :
                (flagValue ? [...selectedValue]?.map(item => item?.value) : filterArrayValues)
        };

        if (validateValue(newObj)) {
            if (checkForDuplicate(newObj)) {
                let conditionArrayCloned = _.cloneDeep(condition);
                conditionArrayCloned.push(newObj);
                setCondition(conditionArrayCloned)
                setFieldsList([])
                setSelectedDataSetObj({})
                setSelectedFieldObj({})
                setSelectedOperator(null)
                setFilterArrayValues([])
                setFilterValue([])
                setFlagCheck(false)
            }
            else {
                toast.error("This Condition already exists")
            }
        }
    }

    const removeCondition = (e, objIndex) => {
        let conditionArrayClone = _.cloneDeep(condition);
        conditionArrayClone.splice(objIndex, 1);
        setCondition(conditionArrayClone);
        setFlagCheck(false)
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        let paramsObj = {
            journeyName,
            condition,
            filterSql,
            createdBy,
            modifiedBy,
            createdBy_Uuid,
            modifiedBy_Uuid,
        }

        if (id) {
            paramsObj.journeyId = id
        }

        submitJourney(paramsObj)
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

    const submitJourney = (data) => {

        if (flagcheck === false) {
            toast.error("First validate  the Filter logic")
        }
        else if (validateAddJourney(data) && flagValidation === true && flagvalid === true) {
            let paramsObj = { ...data }

            if (paramsObj?.journeyId) {
                delete paramsObj?.createdBy
                delete paramsObj?.createdBy_Uuid

                updateJourney(paramsObj)
                    .then(res => {
                        if (res?.result) {
                            toast.success(res?.message)
                            navigate('/authorised/journey-management');
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
            else {
                createJourney(paramsObj)
                    .then(res => {


                        if (res?.result) {

                            toast.success(res?.message)
                            navigate('/authorised/journey-management');
                        }
                        else if (res?.data.statusCode === 0) {
                            let { errorMessage } = res?.data?.error
                            toast.error(errorMessage)
                        }
                        else {
                            console.error(res);
                        }
                    })
            }

        }

    };

    const handleSelect = (e) => {
        setFlagValue(true)
        setSelectedValue(e)
        setFlagDate(false)
        setValueDate(null)
        setEndDate(null)
        setFlagEndDate(false)
        setDateArray([])
    }

    const fetchJourneyDetails = async () => {
        if (!id)
            return

        getJourney({ journeyId: id })
            .then((res) => {
                setJourneyName(res?.result?.journeyName);
                setFilterSql(res?.result?.filterSql);
                setCreatedBy(res?.result?.createdBy);
                setModifiedBy(res?.result?.modifiedBy);
                setCondition(res?.result?.condition)
            })
            .catch((err) => {
                console.log(err);
            })

    }

    const handleNavigate = (route) => {
        navigate(route)
    };


    const handleChange = (e) => {
        if (e.target.value.length >= 30) {
            toast.error('Journey name  should be in limited character')
        }
        setJourneyName(e.target.value)
    }

    const handlefiltersql = (e) => {
        setFilterSql(e.target.value)
        setFlagValid(false)
        setFlagCheck(false)
    }


    useEffect(() => {
        fetchJourneyDetails();
    }, []);
    useEffect(() => fetchDatasetsList(), [])

    const fetchFilterList = () => {
        JourneyFilterList(sourceParameter)
            .then((res) => {
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
            let str = data?.join(' , ');
            return str;
        }
        return data
    }

    return (
        <>
            <div className='Create-Journey' >
                <Box>
                    <Breadcrumbs className='create-journey-heading' separator={<img src={BreadcrumbArrow} alt="Arrow" />} aria-label="breadcrumb">
                        <Link underline="hover" key="1" color="inherit" onClick={() => navigate('/authorised/journey-management')}>
                            Manage Journey
                        </Link>

                        <Typography key="2" color="text.primary">
                            {id ? "Update Journey" : "Create New Journey"}
                        </Typography>
                    </Breadcrumbs>

                    {/* <Typography className='create-journey-heading' variant='h4  ' marginLeft={"25px"}>{id ? "Update Journey" : "Create A New Journey"}</Typography> */}

                    <Box >
                        <Box className={classes.container} >
                            <Box className={classes.root} >
                                <Typography className='journey-name' variant='h5'  >Journey Name</Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <TextField
                                            className={classes.JourneyName + ` journey-Input-name `}
                                            type="text"
                                            placeholder='Journey name'
                                            onChange={handleChange}
                                            value={journeyName}
                                            inputProps={{ maxLength: 30 }}

                                        />
                                    </Grid>

                                    <Grid item xs={6}>
                                    </Grid>
                                </Grid>

                                <Typography className='condition-subheading' variant='h5'>Condition</Typography>

                                <div className='conditionForm' >
                                    <Box className={classes.box}>
                                        <Grid container>
                                            <Grid item lg={3}>
                                                <span className={classes.conditionTerms}>Dataset</span>
                                            </Grid>
                                            <Grid item lg={3}>
                                                <span className={classes.conditionTerms}>Parameter</span>
                                            </Grid>
                                            <Grid item lg={3}>
                                                <span className={classes.conditionTerms}>Operator</span>
                                            </Grid>
                                            <Grid item lg={3}>
                                                <span className={classes.conditionTerms}>Value</span>
                                            </Grid>
                                        </Grid>
                                    </Box>


                                    <div className=''>
                                        <Box className={classes.searchCondition + ' top-selectInput-group'}>
                                            <Grid container spacing={1}>
                                                <Grid className='input-row' item lg={11} md={11}>
                                                    <Grid container spacing={1}>

                                                        <Grid item lg={3} >
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
                                                        </Grid>

                                                        <Grid item lg={3}>
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

                                                        </Grid>
                                                        <Grid item lg={3}>
                                                            <Box >
                                                                <JourneyOperator
                                                                    onChangeFn={handleChangeOperator}
                                                                    selectedValue={selectedOperator}
                                                                    list={operatorList}

                                                                />
                                                            </Box>
                                                        </Grid>

                                                        <Grid item lg={3}>
                                                            <Box sx={{ display: 'flex' }}>
                                                                <JourneyValuesElement
                                                                    onChangeFn={selectedFieldObj.type == 'time' ? handleDateChange : (selectedOperator && selectedOperator.label == 'Filter list' ? handleSelect : handleFilterValue)}
                                                                    selectedOperator={selectedOperator}
                                                                    selectedField={selectedFieldObj}
                                                                    valueDate={valueDate}
                                                                    selectedValue={selectedValue}
                                                                    list={filerList}
                                                                    filterValue={filterValue}

                                                                />
                                                                {
                                                                    (selectedOperator?.label === 'In Date Range' || selectedOperator?.label === 'Not In Date Range') &&

                                                                    <DatePicker
                                                                        className="dateInput"
                                                                        disabled={valueDate ? false : true}
                                                                        selected={endDate}
                                                                        onChange={handleEndDate}
                                                                        minDate={valueDate}
                                                                        maxDate={new Date()}
                                                                    />

                                                                }
                                                            </Box>

                                                        </Grid>
                                                    </Grid>
                                                </Grid>

                                                <Grid className='btn-grid' item lg={1}>
                                                    <Button className='addBotton'
                                                        variant='contained'
                                                        onClick={addCondition}
                                                    >+</Button>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                        <Box className={classes.itemmapped + ' botom-input-group'}>
                                            {condition?.map((e, i) => {
                                                return (
                                                    <div className='minusInput-parent'>
                                                        <Box >
                                                            <span>{i + 1}.</span>
                                                            <Grid style={{ marginRight: 8 }} container spacing={1}>
                                                                <Grid className='input-row' item lg={11} md={11}>
                                                                    <Grid className='input-top-pading' container spacing={1}>
                                                                        <Grid item lg={3}>
                                                                            <TextField
                                                                                style={{ paddingLeft: 5 }}
                                                                                className={classes.conditionText + ' minus valueInput'}
                                                                                disabled
                                                                                value={e?.dataset?.displayName}
                                                                            />
                                                                        </Grid>
                                                                        <Grid item lg={3}>
                                                                            <TextField

                                                                                className={classes.conditionText + ' minus valueInput'}
                                                                                disabled
                                                                                value={e?.parameter?.name}
                                                                            />
                                                                        </Grid>
                                                                        <Grid item lg={3}>
                                                                            <TextField
                                                                                className={classes.conditionText + ' minus valueInput'}
                                                                                disabled
                                                                                value={e?.operator?.selectedOperator?.label}
                                                                            />
                                                                        </Grid>
                                                                        <Grid item lg={3}>
                                                                            <TextField
                                                                                className={classes.conditionText + ' minus valueInput'}
                                                                                disabled
                                                                                value={generateString(e?.value)}

                                                                            />
                                                                        </Grid>
                                                                    </Grid>
                                                                </Grid>
                                                                <Grid className='btn-grid' item lg={1}>
                                                                    <Button
                                                                        className={classes.deleteBtn + ' addBotton minus-btn'}
                                                                        variant='contained'
                                                                        onClick={(e) => { removeCondition(e, i) }}
                                                                    >-</Button>
                                                                </Grid>
                                                            </Grid>
                                                        </Box>
                                                    </div>
                                                )
                                            })
                                            }
                                        </Box>
                                    </div>
                                </div>


                                <Typography className='addFilter' variant='h5'>Add Filter Logic</Typography>


                                <Box>
                                    <TextField className='logicInputBox' type="text" placeholder='Ex: 1AND2OR3 or 1AND(2OR3)'
                                        onChange={(e) => handlefiltersql(e)}
                                        value={filterSql} />
                                    <Button className='validateButton' variant='contained' onClick={() => validate()}>Validate</Button>

                                </Box>


                                <Box className={classes.name}>
                                    <Box>
                                        <Typography className='addFilter' variant='h5'>Created by</Typography>
                                        <TextField className='created-modify' type='text' placeholder='created by'
                                            onChange={(e) => { setCreatedBy(e.target.value) }}
                                            value={createdBy} disabled />
                                    </Box>
                                    <Box>
                                        <Typography className='addFilter' variant='h5'>Last Modified By</Typography>
                                        <TextField className='created-modify' type='text' placeholder='last modified by'
                                            onChange={(e) => { setModifiedBy(e.target.value) }}
                                            value={modifiedBy} disabled />
                                    </Box>

                                </Box>
                            </Box>
                        </Box>
                        <Grid item xs={12}>
                            <Box className={classes.submitbtn + ` cancelSubmitBtn`}>
                                <Button className='Cancel' variant='outlined' onClick={() => handleNavigate('/authorised/journey-management')} >Cancel</Button>
                                <Button className='Submit' type='submit'
                                    color="primary" variant="contained"
                                    onClick={handleSubmit}>{id ? 'Update' : 'Submit'}</Button>
                            </Box>
                        </Grid>
                    </Box>
                </Box>
            </div>
        </>
    )
}


