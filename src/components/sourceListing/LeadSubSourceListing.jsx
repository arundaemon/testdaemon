import { React, useState } from "react";
import moment from 'moment';
import { useParams, useNavigate } from "react-router-dom";
// import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from "../../assets/icons/icon_trash.svg";

import Chip from '@mui/material/Chip';
import { sourceDetails, createSource, changeSubSourceStatus, removeSubSource, addSubSource } from "../../config/services/sources";
import { TableContainer, Box, Grid, TextField, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button, Switch } from '@mui/material';
import { useEffect } from "react";
import { Container } from "@mui/system";
import _ from 'lodash';
import { Alert } from "@mui/material";
import { InputAdornment } from "@mui/material";
//import SearchIcon from '../assets/icons/icon_search.svg';
import SearchIcon from '../../assets/icons/icon_search.svg';
import toast from "react-hot-toast";

export default function LeadSubSourceListing() {
    const [leadSource, setLeadSource] = useState();
    const [leadSubSourceList, setLeadSubSourceList] = useState([]);  //coming from backend
    const [recordForAdd, setRecordForAdd] = useState({});  //data which need to be saved
    const [subSourceList, setSubSourceList] = useState([]);  //array of subsource which is added from fe
    const [subSource, setSubSource] = useState({});  //sub source entered in textfield... {}
    const [search, setSearchValue] = useState('');
    const [leadSourceId, setLeadSourceId] = useState('');
    const [dataToRemove, setDataToRemove] = useState({});
    const [createdBy, setCreatedBy] = useState(JSON.parse(localStorage.getItem('userData'))?.name);
    const [createdBy_Uuid] = useState(JSON.parse(localStorage.getItem('userData'))?.uuid);
    const [modifiedBy, setModifiedBy] = useState(JSON.parse(localStorage.getItem('userData'))?.name);
    const [modifiedBy_Uuid] = useState(JSON.parse(localStorage.getItem('userData'))?.uuid);

    const { leadSource_id } = useParams();
    const navigate = useNavigate();
    const subSourceArray = [];

    const handleOnChange = (e) => {
        let filledDetails = _.clone(subSource);
        filledDetails.leadSubSourceName = e.target.value;
        setSubSource(filledDetails);
        //setSubSource(e.target.value)
    }

    const checkDuplicateSubSourceName = () => {
        let findSubSource = leadSubSourceList.some((item) => {
            return item.leadSubSourceName === subSource.leadSubSourceName
        })
        return findSubSource
    }

    const handleAddMore = () => {
        if (!subSource.leadSubSourceName) {
            toast.error('please fill sub source');
            return;
        }

        let leadSubSourceListCloned = _.clone(leadSubSourceList);
        let index = leadSubSourceListCloned.length - 1;
        let i = 1;
        if (checkDuplicateSubSourceName()) {
            toast.error('Sub Source already exists')
            return;
        }
        if (leadSubSourceListCloned[index]) {
            let lastElement = leadSubSourceListCloned[index];
            let lastElementSubSourceId = lastElement.leadSubSourceId.split('-')[1];
            i = parseInt(lastElementSubSourceId) + 1;
        }
        let newSubSource = { ...subSource, leadSubSourceId: `LSS-${i}`, status: 1, createdBy, modifiedBy }
        leadSubSourceListCloned.push(newSubSource);
        subSourceList.push(newSubSource);
        setSubSourceList([...subSourceList])
        setLeadSubSourceList(leadSubSourceListCloned)
        setSubSource({ ...subSource, leadSubSourceName: '' });
    }

    const handleStatusToggle = (e, subSourceDetails) => {
        let { status, leadSubSourceId } = subSourceDetails
        let newStatus = status === 0 ? 1 : 0

        changeSubSourceStatus({ _id: leadSource_id, status: newStatus, leadSubSourceId })
            .then(res => {
                if (res?.result) {
                    leadSourceDetails()
                    toast.success(res?.message)
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
    const handleSaveButton = () => {
        let filledDetails = _.cloneDeep(recordForAdd);
        filledDetails._id = leadSource_id;
        // filledDetails.subSource = leadSubSourceList;
        filledDetails.subSource = subSourceList;
        setRecordForAdd({ ...filledDetails });
        if (!subSourceList.length) {
            toast.error('Please fill sub source')
            return;
        }
        addLeadSubSource(filledDetails);
    }

    const addLeadSubSource = async (data) => {
        addSubSource(data)
            .then((res) => {
                if (res?.data) {
                    toast.success(res?.message);
                    setLeadSubSourceList(res?.data?.subSource)
                    setSubSourceList([]);
                    navigate('/authorised/source-management')
                }
            })
    }

    const removeLeadSubSource = async (data) => {
        removeSubSource(data)
            .then((res) => {
                if (res?.data) {
                    toast.success(res?.message);
                    //setLeadSubSourceList(res?.data?.subSource)
                }
            })
    }


    const leadSourceDetails = async () => {
        sourceDetails(leadSource_id, search)
            .then((res) => {
                if (res?.result) {
                    setLeadSource(res?.result);
                    res?.result?.subSource.map(value => {
                        subSourceArray.push(value);
                    })
                    setLeadSourceId(res?.result?.leadSourceId)
                    setLeadSubSourceList(subSourceArray);
                }
                else if (!res?.result) {
                    setLeadSubSourceList([])
                }
            })
            .catch((err) => console.log(err, '::error'))
    }

    const handleSearch = (e) => {
        let { value } = e.target
        setSearchValue(value);
    }

    const handleRemove = (i, row) => {
        let filledDetails = _.cloneDeep(dataToRemove);
        leadSubSourceList.splice(i, 1);
        var index = _.findIndex(subSourceList, { leadSubSourceId: row.leadSubSourceId })
        if (index > -1) {
            subSourceList.splice(index, 1);
            setSubSourceList([...subSourceList])
        }
        filledDetails._id = leadSource_id;
        filledDetails.leadSubSourceId = row.leadSubSourceId;
        setDataToRemove(filledDetails);
        setLeadSubSourceList([...leadSubSourceList])
        removeLeadSubSource(filledDetails);
    }

    useEffect(() => {
        if (leadSource_id) {
            leadSourceDetails()
        }
    }, [search])

    return (
        <>
            <div className="shadow">

                <h1><u>Lead Source: {`${leadSourceId}`}</u></h1>
                <h2>Lead Sub Source</h2>
                <Grid container alignItems="left" justifyContent="flex-start" mb={2} spacing={2.5} >
                    <Grid item xs={12} sm={6} md={6} lg={6} className="datasets_header" >
                        <TextField className={`inputRounded search-input`} type="search"
                            placeholder="Search By Sub Source Name"
                            onChange={handleSearch}
                            InputLabelProps={{ style: { ...({ top: `${-7}px` }) } }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <img src={SearchIcon} alt="" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                </Grid>
                <TableContainer component={Paper}>
                    {leadSubSourceList && leadSubSourceList.length > 0 ? (<Table aria-label="customized table" className="custom-table datasets-table">
                        <TableHead >
                            <TableRow className='cm_table_head'>
                                <TableCell >Lead Sub Source Id</TableCell>
                                <TableCell >Lead Sub Source Name</TableCell>
                                <TableCell >Created By & Date</TableCell>
                                <TableCell >Last Modified By & Date</TableCell>
                                <TableCell >Status</TableCell>
                                <TableCell >Remove</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {leadSubSourceList.map((row, i) => (
                                <TableRow key={i}>
                                    <TableCell className="datasetname-cell">{row.leadSubSourceId}</TableCell>
                                    <TableCell>{row?.leadSubSourceName ?? '-'}</TableCell>
                                    <TableCell>{row?.createdBy ?? '-'}<div><br />{moment(row?.createdAt).format('DD-MM-YY (HH:mm A)')}</div></TableCell>
                                    <TableCell>{row?.modifiedBy ?? '-'}<div><br /></div>{moment(row?.updatedAt).format('DD-MM-YY (HH:mm A)')}</TableCell>
                                    <TableCell onClick={(e) => handleStatusToggle(e, row)} >
                                        <span className={row.status === 1 ? "cm_active" : "cm_inactive"}>{row.status === 1 ? "Active" : "Inactive"}</span>
                                    </TableCell>
                                    <TableCell><Button className='form_icon' onClick={(e) => { handleRemove(i, row) }}><img src={DeleteIcon} alt='' /></Button></TableCell>
                                </TableRow>))}
                        </TableBody>
                    </Table>) : <Alert severity="error">No Content Available!</Alert>}
                </TableContainer>

                <Grid className="sub-name" container alignItems="flex-start" direction="row" item xs={12} sm={12} md={12} lg={12} spacing={1}>
                    <Grid item xs={2} sm={2} md={2} lg={4} display="flex" alignItems="center">
                        <p>Sub Source Name:</p>
                        <TextField className="report_form_ui_input sourceInput" value={subSource.leadSubSourceName} name="subSourceName" onChange={(e) => handleOnChange(e)} />
                    </Grid>
                    <Grid item xs={2} sm={2} md={2} lg={2}>
                        <Button className="addMore"
                            variant="contained"
                            color='primary'
                            size='small'
                            onClick={() => handleAddMore()}>
                            + Add more
                        </Button>
                    </Grid>
                    <Grid className="subSource-btnGroup" item xs={2} sm={2} md={2} lg={5} display="flex" justifyContent="flex-end">
                        <Button
                            variant="contained"
                            color='primary'
                            size='large'
                            onClick={() => handleSaveButton()}>
                            Save
                        </Button>
                        <Button
                            variant="outlined"
                            color='primary'
                            size='large'
                            onClick={() => navigate('/authorised/source-management')}>
                            Cancel
                        </Button>

                    </Grid>
                </Grid>
            </div>


        </>
    )

}