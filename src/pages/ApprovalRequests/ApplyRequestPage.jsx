import { useState, useEffect } from 'react';
import { Container, TextField, Alert, Pagination, Grid, InputAdornment, Box, Tabs, Tab, Typography } from "@mui/material";
import _ from 'lodash';

import Page from "../../components/Page";
import Loader from "../Loader";
import { getRequestList } from '../../config/services/approvalRequest';
import SearchIcon from '../../assets/icons/icon_search.svg';
import { RequestTable } from '../../components/approvalRequestManagement';
import { getHierachyDetails } from '../../config/services/hierachy';

export default function ApplyRequestPage() {
    const [reqStatus, setReqStatus] = useState("NEW");
    const [pageNo, setPagination] = useState(1);
    const [search, setSearchValue] = useState('');
    const [loader, setLoading] = useState(false);
    const [itemsPerPage] = useState(10);
    const [sortObj, setSortObj] = useState({ sortKey: 'createdAt', sortOrder: '-1' });
    const [requestList, setRequestList] = useState([]);
    const [requesterRequestList, setRequesterRequestList] = useState([]);
    const [requestTotalCount, setRequestTotalCount] = useState(0);
    const [createdBy] = useState(JSON.parse(localStorage.getItem('userData'))?.username);
    const [createdBy_Uuid] = useState(JSON.parse(localStorage.getItem('loginData'))?.uuid);
    const [modifiedBy] = useState(JSON.parse(localStorage.getItem('userData'))?.username);
    const [modifiedBy_Uuid] = useState(JSON.parse(localStorage.getItem('loginData'))?.uuid);
    const [loggedInId] = useState(JSON.parse(localStorage.getItem('loginData'))?.uuid);
    const [requestBy_empCode] = useState(JSON.parse(localStorage.getItem('userData'))?.employee_code);

    const handleTabChange = (event, newValue) => {
        setReqStatus(newValue);
    };

    const fetchRequestList = (reqStatus) => {


        let params = { pageNo: (pageNo - 1), count: itemsPerPage, search, ...sortObj, reqStatus, requestBy_empCode, type: 'requester' }
        setLoading(true)
        getRequestList(params)
            .then((res) => {
                setRequestList(res?.result);
                setRequestTotalCount(res?.totalCount)
                setLoading(false)
            })
            .catch(err => console.error(err))
    }


    let totalPages = Number((requestTotalCount / itemsPerPage).toFixed(0))
    if ((totalPages * itemsPerPage) < requestTotalCount)
        totalPages = totalPages + 1;

    const handlePagination = (e, pageNumber) => {
        setPagination(pageNumber)
    }

    const handleSearch = (e) => {
        let { value } = e.target
        setPagination(1)
        setSearchValue(value, () => setPagination(1))
    }

    useEffect(() => {
        fetchRequestList(reqStatus)
    }, [search, sortObj, pageNo, itemsPerPage, reqStatus]);


    return (
        <Page title="Extramarks | Approval Request Management" className="main-container ApplyRequestPage_Page datasets_container">
            <Grid display='flex' justifyContent='space-between' alignItems='center' className="datasets_header" >
                <div className='requestHeading'>{reqStatus} REQUEST ({requestTotalCount})</div>
                <TextField className={`inputRounded search-input width-auto`} type="search"
                    placeholder="Search By Request ID"
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

            <Box sx={{ width: '100%' }}>
                <Tabs
                    value={reqStatus}
                    onChange={handleTabChange}
                    aria-label="secondary tabs example"
                    textColor='inherit'
                    
                >
                    <Tab style={{fontWeight:600}} value="NEW" label="New" />
                    <Tab style={{fontWeight:600}} value="APPROVED" label="Approved" />
                    <Tab style={{fontWeight:600}} value="REJECTED" label="Rejected" />
                </Tabs>
            </Box>
            <Container className='table_max_width'>
                {loader && <Loader />}
                {requestList && requestList.length > 0 ?
                    <RequestTable list={requestList} pageNo={pageNo} itemsPerPage={itemsPerPage} request={true} requestPage={true}/>
                    :
                    <div style={{ marginTop: 20 }}>
                        <Alert severity="error">No Content Available!</Alert>
                    </div>
                }
            </Container>

            {requestTotalCount > 0 ? <div className='center cm_pagination'>
                                            <Pagination
                                                count={totalPages}
                                                variant="outlined"
                                                color="primary"
                                                onChange={handlePagination}
                                                page={pageNo}
                                            />
                                      </div>
                                      :
                                      null
                                    }
        </Page>
    );
}

