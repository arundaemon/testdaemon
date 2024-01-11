import moment from 'moment';
import { React, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from "../../assets/icons/icon_trash.svg";

import { Alert, Button, Grid, InputAdornment, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import _ from 'lodash';
import { useEffect } from "react";
//import SearchIcon from '../assets/icons/icon_search.svg';
import toast from "react-hot-toast";
import SearchIcon from '../../assets/icons/icon_search.svg';
import { addUpdateNewSubSource, getAllSubSourcesList } from "../../config/services/packageBundle";
import { getUserData } from "../../helper/randomFunction/localStorage";

export default function LeadSubSourceListing() {
    const [leadSubSourceList, setLeadSubSourceList] = useState([]);  //coming from backend
    const [subSource, setSubSource] = useState({});  //sub source entered in textfield... {}
    const [searchBy, setSearchBy] = useState({
        subSourceName: "sub_source_name",
        SourceId: "source_id",
    });
    const [search, setSearchValue] = useState('');
    const data = getUserData('loginData')
    const uuid = data?.uuid
    const { source_id } = useParams();
    const navigate = useNavigate();



    const handleOnChange = (e) => {
        let filledDetails = _.clone(subSource);
        filledDetails.leadSubSourceName = [e.target.value]; 
        setSubSource(filledDetails);
      }

    const checkDuplicateSubSourceName = () => {
        let findSubSource = leadSubSourceList.some((item) => {
            return item.sub_source_name === subSource.leadSubSourceName
        })
        return findSubSource
    }

    const handleAddMore = async () => {
        if (!subSource.leadSubSourceName) {
            toast.error('please fill sub source');
            return;
        }

        if (checkDuplicateSubSourceName()) {
            toast.error('Sub Source already exists')
            return;
        }

        let newSubSource = {
            sub_source_name: subSource?.leadSubSourceName, 
            source_id: source_id,
            status: 1, 
            uuid: uuid
        }
        await addUpdateNewSubSource(newSubSource)
            .then((res) => {
                if (res?.data?.status === 1) {
                    leadSourceDetails()
                    toast.success("Sub-Source added successfully!")
                    setSubSource({ ...subSource, leadSubSourceName: '' });
                    navigate('/authorised/source-management')
                }
                else if (res?.data?.status === 0) {
                    toast.error(res?.data?.message)
                }
                else {
                    console.error(res);
                }
            })
            .catch((err) => {
                console.error(err, "::err");
            })

    }


    const leadSourceDetails = async () => {
        let params = {
            uuid: uuid,
            search_by: searchBy.subSourceName,
            source_id: source_id,
            search_val: search,
            order_by: "sub_source_id",
            order: "DESC",
            status: [1, 2]

        }
        await getAllSubSourcesList(params)
            .then((res) => {
                if (res?.data) {
                    let data = res?.data?.sub_source_list
                    setLeadSubSourceList(data)
                }
                else if (!res?.result) {
                    setLeadSubSourceList([])
                }


            })
            .catch(err => console.error(err))
    }


    const handleSearch = _.debounce((e) => {
        let { value } = e.target;
        if (value.trim() !== '') {
            setSearchValue(value.trim());

        } else
            setSearchValue("")

    }, 600);


    const handleStatusToggle = async (e, subSourceDetails) => {
        let { status, sub_source_id, sub_source_name } = subSourceDetails
        let newStatus = status === 1 ? 2 : 1

        await addUpdateNewSubSource({ sub_source_id: sub_source_id, status: newStatus, sub_source_name: [sub_source_name], uuid: uuid })
            .then((res) => {
                if (res?.data?.status === 1) {
                    leadSourceDetails()
                    toast.success("Sub-Source status changed successfully!")

                }
                else if (res?.data?.status === 0) {
                    toast.error(res?.data?.message)
                }
                else {
                    console.error(res);
                }
            })
            .catch((err) => {
                console.error(err, "::err");
            })
    }


    const handleRemove = async (i, row) => {
        let { sub_source_id, sub_source_name } = row
        let newStatus = 3

        await addUpdateNewSubSource({ sub_source_id: sub_source_id, status: newStatus, sub_source_name: [sub_source_name], uuid: uuid })
            .then((res) => {
                if (res?.data?.status === 1) {
                    leadSourceDetails()
                    toast.success("Sub-Source deleted successfully!")

                }
                else if (res?.data?.status === 0) {
                    toast.error(res?.data?.message)
                }
                else {
                    console.error(res);
                }
            })
            .catch((err) => {
                console.error(err, "::err");
            })

    }

    useEffect(() => {
        if (source_id) {
            leadSourceDetails()
        }
    }, [search])




    return (
        <>
            <div className="shadow">

                <h1><u>Lead Source: {`${source_id}`}</u></h1>
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
                                    <TableCell className="datasetname-cell">{row?.sub_source_id
                                    }</TableCell>
                                    <TableCell>{row?.sub_source_name ?? '-'}</TableCell>
                                    <TableCell>{row?.created_by ?? '-'}<div>{moment(row?.created_on * 1000).format(
                                        "DD-MM-YYYY (HH:mm A)"
                                    )}</div></TableCell>

                                    <TableCell>{row?.modified_by
                                        ? row?.modified_by : row?.created_by}<div>{row?.modified_on ? moment(row?.modified_on * 1000).format("DD-MM-YYYY (HH:mm A)")
                                            : moment(row?.created_on * 1000).format("DD-MM-YYYY (HH:mm A)")}</div></TableCell>


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
                    {/* <Grid item xs={2} sm={2} md={2} lg={2}>
                        <Button className="addMore"
                            variant="contained"
                            color='primary'
                            size='small'
                            onClick={() => handleAddMore()}>
                            + Add more
                        </Button>
                    </Grid> */}
                    <Grid className="subSource-btnGroup" item xs={2} sm={2} md={2} lg={5} display="flex" justifyContent="flex-end">
                        <Button
                            variant="contained"
                            color='primary'
                            size='large'
                            onClick={() => handleAddMore()}>
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