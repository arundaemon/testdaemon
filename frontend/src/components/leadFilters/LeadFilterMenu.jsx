import {
    Divider, Paper, Menu, MenuItem, MenuList, ListItemText, InputLabel, Box, IconButton, Stack, Typography, Button,
    Autocomplete, TextField, ListItem, ListItemIcon, Grid, Popover
} from "@mui/material";
import { useEffect, useState } from 'react'
import { makeStyles, styled } from '@mui/styles';
import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as VisualizeIcon } from "../../assets/icons/icon-visualize.svg"
import { getDataSets, getMeasuresList } from '../../config/services/reportEngineApis';
import FunctionsOutlinedIcon from '@mui/icons-material/FunctionsOutlined';
import hashFill from '@iconify/icons-eva/hash-fill';
import { Icon } from '@iconify/react';
import DateRangeIcon from '@mui/icons-material/DateRange';
import LabelOutlinedIcon from '@mui/icons-material/LabelOutlined';
import JourneyOperator from '../../components/journeyOperator';
import JourneyValuesElement from '../../components/journeyValueElement';
import { numOperator, strOperator, timeOperator, defaultOperator } from '../../constants/JourneyOperator';
import { JourneyFilterList } from '../../helper/DataSetFunction';
import _, { find } from 'lodash';
import moment from 'moment';
import { toast } from "react-hot-toast";
import DatePicker from "react-datepicker";
import ReactSelect from "react-select";
import useMediaQuery from "@mui/material/useMediaQuery";

const ParseSvgIcon = ({ component }) => <SvgIcon component={component} width={100} height={100} />

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
    filterMainContainer: {
        '& .MuiPaper-root.MuiPaper-elevation.MuiPaper-root.MuiPopover-paper': {
            overflow: 'visible',
            width: '350px',
            marginLeft: '5px',
            boxShadow: '0px 0px 6px #20212429',
            '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 30,
                left: -10,
                width: 18,
                height: 18,
                background: 'white',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
                // filter: 'drop-shadow(0px 0px 6px #20212429)',
                boxShadow: '-1px 1px 2px #20212429',
            },
            [theme.breakpoints.down('sm')]: {
                '&:before': {
                    top: 0,
                    left: 30,
                    transform: 'translateY(-50%) rotate(135deg)',

                },
                marginTop: '10px'
            }

        },
        '& .report-new-main-fields': {
            height: '300px',
            overflowY: 'auto',
            padding: "20px",
            scrollbarWidth: 'thin'
        }
    },
    modalFooter: {
        padding: '10px 20px 5px 20px',
        borderTop: '1px solid #dedede',

    }
}));


const LeadFilter = (props) => {
    let { filterMenuAnchor, setFilterMenuAnchor, selectedFilterIndex, filters, setFilters, filledData, role } = props
    const classes = useStyles()
    const [dataSets, setDataSets] = useState([]);
    const [selectedDataSetObj, setSelectedDataSetObj] = useState({});
    const [selectedFieldObj, setSelectedFieldObj] = useState({});
    const [fieldsList, setFieldsList] = useState([]);
    const [selectedValue, setSelectedValue] = useState({})
    const [selectedOperator, setSelectedOperator] = useState({});
    const [operatorList, setOperatorList] = useState([{}])
    const [valueDate, setValueDate] = useState(null);
    const [endDate, setEndDate] = useState(null)
    const [dateArray, setDateArray] = useState([])
    const [filterArrayValues, setFilterArrayValues] = useState([])
    const [filterValue, setFilterValue] = useState([]);
    const [filerList, setFilterList] = useState([{}])
    const [sourceParameter, setSourceParameter] = useState('')
    const [flagDate, setFlagDate] = useState(false);
    const [flagValue, setFlagValue] = useState(false)
    const [flagEndDate, setFlagEndDate] = useState(false);
    const [searchedValue, setSearchedValue] = useState('')
    const [currentRole] = useState(JSON.parse(localStorage.getItem('userData'))?.crm_role);
    const isSmallDevice = useMediaQuery((theme) => theme.breakpoints.down("sm"));

    const fetchDatasetsList = () => {
        getDataSets({ role: role ?? 'CRM_LEAD_FILTER', uuid: currentRole })
            .then(resp => {
                if (resp?.result)
                    setDataSets(resp?.result)
                else
                    console.error(resp)
            })
    }

    const handleSelectDataset = (e, selectedDataSet) => {
        setSelectedDataSetObj(selectedDataSet)
        setSelectedFieldObj({})
        // setFilterList([{}])
        setValueDate(null)
        setEndDate(null)
        setFlagEndDate(false)
        setFlagDate(false)
        setDateArray([])
        setSelectedOperator({})
        setSelectedValue({})
        setFilterValue([])

        getMeasuresList({ dataSetId: selectedDataSet?._id, uuid: currentRole })
            .then(resp => {
                if (resp?.result) {
                    let data = resp?.result.filter(obj => !obj.isHidden && !obj.isDeleted && !obj.joinHiddenField)
                    let filteredData = data
                    if (role === 'EMPLOYEE_CLAIMS') {
                        filteredData = filteredData.filter(item => item?.name !== "Id" && item?.name !== "totalRecords" && item?.name !== "FivetranDeleted" && item?.name !== "FivetranSynced" && item?.name !== "V" && item?.name !== "isDeleted");
                    }
                    else if (role === 'SCHOOL_FILTER' || role === 'APPROVAL_MAPPING') {
                        filteredData = filteredData.filter(item => item?.name !== "totalRecords" && item?.name !== "FivetranDeleted" && item?.name !== "FivetranSynced" && item?.name !== "V" && item?.name !== "isDeleted");
                    }
                    setFieldsList(filteredData)
                }
                else
                    console.error(resp)
            })
    }


    const handleSelectField = (e, selectedField) => {
        setSelectedFieldObj(selectedField)
        //console.log(selectedField)
        let selectedValues = `${selectedDataSetObj.dataSetName}.${selectedField.name}`
        let dataType = selectedField.dataSetType == 'MEASURE' ? 'number' : selectedField.type
        let defaultParam = null

        switch (dataType) {
            case 'string':
                defaultParam = strOperator.filter(obj => obj.default)
                setOperatorList(strOperator)
                break;
            case 'time':
                defaultParam = timeOperator.filter(obj => obj.default)
                setOperatorList(timeOperator)
                break;
            case 'number':
                defaultParam = numOperator.filter(obj => obj.default)
                setOperatorList(numOperator)
                break;
            default:
                defaultParam = defaultOperator.filter(obj => obj.default)
                setOperatorList(defaultOperator)
                break;
        }
        if(defaultParam){
            setSelectedOperator(defaultParam[0])
        }else{
            setSelectedOperator({})
        }        
        setSourceParameter(selectedValues)
        setValueDate(null)
        setEndDate(null)
        setFlagEndDate(false)
        setFlagDate(false)
        setDateArray([])
    }


    const handleChangeOperator = (value) => {

        setSelectedOperator(value)
        setValueDate(null)
        setEndDate(null)
        setFlagEndDate(false)
        setFlagDate(false)
        setDateArray([])
        setFilterArrayValues([])
        setFilterValue([])

        if (value.label === 'Filter list') {
            fetchFilterList()
        }
    }


    const handleDateChange = (date) => {
        setValueDate(date)
        setFlagDate(true)
        setFlagValue(false)
        setEndDate(null)
        setDateArray([])
    }

    const handleEndDate = (date) => {
        setEndDate(date)
        setFlagEndDate(true)
        setFlagValue(false)
        setDateArray([])
    }


    const handleSelect = (e) => {
        setSelectedValue(e)
        setFlagValue(true)
        setFlagDate(false)
        setFlagEndDate(false)
    }

    const handleFilterValue = (e) => {
        const value = e?.target?.value
        let values = value ? value?.split('\n') : []
        setFilterArrayValues(values)
        setFilterValue(value)
        setFlagDate(false)
        setFlagValue(false)
        setFlagEndDate(false)
    }

    const addFilterObj = () => {
        let filtersCopy = _.cloneDeep(filters)

        if (_.isEmpty(selectedDataSetObj)) {
            toast.dismiss()
            toast.error('Fill Dataset')
            return
        }
        if (_.isEmpty(selectedFieldObj)) {
            toast.dismiss()
            toast.error('Fill field Name')
            return
        }
        if (_.isEmpty(selectedOperator)) {
            toast.dismiss()
            toast.error('Select operator')
            return
        }

        //push date value into array
        if (flagDate) {
            dateArray.push(String(moment(valueDate).format('YYYY-MM-DD 00:00:00')))
        }

        if ((selectedOperator.label === 'In Date Range' || selectedOperator.label === 'Not In Date Range') && flagEndDate) {
            dateArray.push(String(moment(endDate).format('YYYY-MM-DD 23:59:59')))
        }
        //console.log(selectedOperator)
        let tempFilterObj = {
            dataset: selectedDataSetObj,
            field: selectedFieldObj,
            operator: {
                ...selectedOperator
            },
            filterValue: flagDate ? dateArray :
                (flagValue ? [...selectedValue]?.map(item => item?.value) : filterArrayValues)
        }

        if ((selectedOperator.label === 'In Date Range' || selectedOperator.label === 'Not In Date Range') && valueDate && endDate == null) {
            toast.dismiss()
            toast.error('Select End Date')
            return
        }

        if (tempFilterObj?.filterValue?.length === 0) {
            if ((selectedOperator.label === 'In Date Range' || selectedOperator.label === 'Not In Date Range')) {
                if (valueDate === null) {
                    toast.dismiss()
                    toast.error('Select Start Date')
                    return
                }
            }
            else {
                toast.dismiss()
                toast.error('Select Value')
                return
            }
        }
        //console.log(tempFilterObj,filtersCopy)
        filtersCopy?.splice(selectedFilterIndex, 1, tempFilterObj)
        setFilters(filtersCopy)
        handleMenuClose()
    }

    const handleMenuClose = () => {
        setFilterMenuAnchor(null)

        setSelectedDataSetObj({})
        setSelectedFieldObj({})
        setFieldsList([])
        setSelectedOperator({})
        setFilterArrayValues([])
        setFilterValue([])
        setValueDate(null)
        setEndDate(null)
        setDateArray([])
    }

    const fetchFilterList = () => {
        if (Boolean(filterMenuAnchor) === true) {
            let filterMember = `${selectedDataSetObj?.tableAlias}.${selectedFieldObj?.name}`
            JourneyFilterList(sourceParameter, filterMember, searchedValue)
                .then((res) => {
                    res?.rawData().map(filterObj => {
                        filterObj.label = filterObj?.[sourceParameter]
                        filterObj.value = filterObj?.[sourceParameter]
                        return filterObj
                    })
                    setFilterList(res?.rawData())
                })
                .catch(err => console.log(err))
        }
    }

    const filledValues = () => {
        if (filledData?.dataset) {
            setSelectedDataSetObj(filledData?.dataset)
        }
        if (filledData?.field) {
            setSelectedFieldObj(filledData?.field)
        }
        if (filledData?.operator) {
            setSelectedOperator(filledData?.operator)
        }
        if (filledData?.filterValue) {
            if (selectedOperator?.label == 'Filter list') {
                setSelectedValue(filledData?.filterValue)
                setFlagValue(true)
                setFlagDate(false)
            }
            else {
                setValueDate(new Date(filledData?.filterValue?.[0]))
                setEndDate(new Date(filledData?.filterValue?.[1]))
                setFilterArrayValues(filledData?.filterValue)
                setFilterValue(filledData?.filterValue)
                setFlagDate(false)
                setFlagValue(false)
                setFlagEndDate(false)
            }
        }

        else {
            setSelectedDataSetObj({})
            setSelectedFieldObj({})
            setFieldsList([])
            setSelectedOperator(null)
            setFilterArrayValues([])
            setFilterValue([])
            setValueDate(null)
            setEndDate(null)

        }
    }

    useEffect(() => fetchDatasetsList(), []);
    useEffect(() => filledValues(), [filledData, Boolean(filterMenuAnchor)])
    useEffect(() => fetchFilterList(), [searchedValue])

    return (
        <Popover
            anchorEl={filterMenuAnchor}
            open={Boolean(filterMenuAnchor)}
            onClose={() => handleMenuClose()}
            className={classes.filterMainContainer}
            
            transformOrigin={{ horizontal: isSmallDevice ? 'center' : 'left', vertical: isSmallDevice ? 'top' : 'top' }}
            anchorOrigin={{ horizontal: isSmallDevice ? 'center' : 'right', vertical: isSmallDevice ? 'bottom' : 'top' }}
            // anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            // transformOrigin={{ vertical: 'top', horizontal: 'center', }}

        >
            <Paper >
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
                    {
                       Object.keys(selectedFieldObj).length > 0 && 
                       <>
                            <Box>
                                <Typography className="report-form-label  font-weight-600 mt-1" variant="subtitle1" display="block"> Operator </Typography>
                                <JourneyOperator
                                    onChangeFn={handleChangeOperator}
                                    selectedValue={selectedOperator}
                                    list={operatorList}
                                />
                            </Box>
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
                                    searchedValue={searchedValue}
                                    setSearchedValue={setSearchedValue}

                                />
                            </Box>
                        </>
                       
                    }
                    
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
                </div>

                <Box className={classes.modalFooter}>
                    <Button color="primary" className="report_form_ui_btn mr-2 font-weight-600 " variant="contained" onClick={addFilterObj} > Done </Button>
                </Box>
            </Paper>
        </Popover >
    )
}

export default LeadFilter;
