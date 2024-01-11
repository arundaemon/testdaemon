import React, { useEffect, useState } from 'react'
import { bulkUpdate, getMyClaimList } from '../../config/services/userClaim'
import SearchIcon from '../../assets/icons/icon_search.svg';
import Page from "../../components/Page";
import { Container, TextField, Button, Grid, InputAdornment, TablePagination } from "@mui/material";
import UserClaimFinanceTable from './UserClaimFinanceTable';
import Pagination from '../../pages/Pagination';
import { useNavigate, useParams } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import { DisplayLoader } from '../../helper/Loader';
import FilterIcon from "../../assets/image/filterIcon.svg";
import _ from "lodash";
import toast from "react-hot-toast";
import { DecryptData, EncryptData } from "../../utils/encryptDecrypt";
import LeadFilter from '../leadFilters/LeadFilter';
import { getUserClaimFinance } from '../../helper/DataSetFunction';
import CubeDataset from '../../config/interface';


const useStyles = makeStyles(() => ({
  noData: {
    height: "50vh",
    width: "90vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: 600,
    fontSize: 25
  },
  loader: {
    height: "50vh",
    width: "90vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  addClaimBtn: {
    fontWeight: "600",
    fontSize: "16px",
    lineHeight: "15px",
    cursor: "pointer",
    borderRadius: "4px",
    color: "white",
    border: "1px solid #F45E29",
    padding: "12px 24px",
    background: "#F45E29",
    marginLeft: "95px",
    marginBottom: '10px',
    width: "max-content",
  },
  header: {
    fontSize: '28px',
    fontWeight: '600',
    marginTop: '1px'

  },
  buttonDiv: {
    display: 'grid',
    marginBottom: '10px'
  },
  filterSection: {
    display: "flex",
    alignItems: "center",
    marginTop: '20px'
  },
  filterDiv: {
    border: '1px solid #DEDEDE',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '14px',
    width: '100px',
    height: '38px',
    borderRadius: '4px',
    color: '#85888A',
    marginBottom: '20px',
    cursor: 'pointer'
  }
}))

const UserClaimFinance = () => {
  const [userClaimList, setUserClaimList] = useState([])
  const [reportUserClaimList, setReportUserClaimList] = useState([])
  const [pageNo, setPagination] = useState(1);
  const [search, setSearchValue] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(100)
  const [lastPage, setLastPage] = useState(false)
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [loader, setLoader] = useState(false)
  const [filterAnchor, setFilterAnchor] = useState(null);
  const [filters, setFilters] = useState([]);
  const [filtersApplied, setFiltersApplied] = useState([]);
  const [selectedRows, setSelectedRows] = useState([])
  const [role] = useState('EMPLOYEE_CLAIMS')
  const navigate = useNavigate()
  const classes = useStyles()
  const [empCode] = useState(JSON.parse(localStorage.getItem('userData'))?.employee_code);
  const [roleName] = useState(JSON.parse(localStorage.getItem('userData'))?.crm_role);
  const [modifiedBy, setModifiedBy] = useState(JSON.parse(localStorage.getItem('userData'))?.username);
  const [modifiedBy_Uuid] = useState(JSON.parse(localStorage.getItem('loginData'))?.uuid);
  const { requestedBy, fromDate, toDate } = useParams();


  const handlePagination = (e, pageNumber) => {
    setPagination(pageNumber);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPagination(1);
    setItemsPerPage(event.target.value);
  };

  const handleFilter = (e) => {
    setFilterAnchor(e.currentTarget);
  };

  const applyFilters = () => {
    if (filters.find((fltObj) => fltObj?.label === "Select Filter")) {
      toast.dismiss()
      toast.error("Select Valid Filter");
      return;
    }
    // sortObj.sortKey = dataSetIndex.updatedAt;
    // sortObj.sortOrder = "desc";
    let filtersCopy = _.cloneDeep(filters);
    localStorage.setItem("userClaimFilter", EncryptData(filtersCopy));
    setFiltersApplied(filtersCopy);
    setFilterAnchor(null);
  };

  const addFilter = () => {
    let filtersCopy = _.cloneDeep(filters);
    // console.log(filtersCopy, 'this is copy Filter')
    if (filters.find((fltObj) => fltObj?.label === "Select Filter")) {
      toast.dismiss()
      toast.error("First fill empty filter");
      return;
    }
    filtersCopy?.unshift({ label: "Select Filter" });
    setFilters(filtersCopy);
  };

  const removeFilter = (filterIndex) => {
    let filtersCopy = _.cloneDeep(filters);
    if (filters[0]?.label === 'Select Filter') {
      filtersCopy?.splice(filterIndex, 1);
      setFilters(filtersCopy);
    }
    else {
      filtersCopy?.splice(filterIndex, 1);
      setFilters(filtersCopy);
      setFiltersApplied(filtersCopy);
    }
    localStorage.setItem("userClaimFilter", EncryptData(filtersCopy));
    if (filtersCopy?.length == 0) {
      // sortObj.sortKey = dataSetIndex.updatedAt;
      // sortObj.sortOrder = -1;
      localStorage.removeItem("userClaimFilter");
    }
  };

  const removeAllFilters = () => {
    // sortObj.sortKey = dataSetIndex.updatedAt;
    // sortObj.sortOrder = -1;
    setFilters([]);
    setFiltersApplied([]);
    localStorage.removeItem("userClaimFilter");
  };

  const customFilterFunction = () => {
    let customFilter = [{
      "dataset": {
        "displayName": "EmployeeClaim",
        "dataSetName": "EmployeeClaim",
      },
      "field": {
        "name": "requestByEmpCode",
      },
      "operator": {
        "label": "Custom filter list",
        "value": "equals",
      },
      "filterValue": [
        requestedBy
      ]
    }]

    let visitDateCustomFilterObject = {
      "dataset": {
        "displayName": "EmployeeClaim",
        "dataSetName": "EmployeeClaim"
      },
      "field": {
        "name": "visitDate",
      },
      "operator": {
        "label": "In Date Range",
        "value": "inDateRange"
      },
      "filterValue": [fromDate + ' 00:00:00', toDate + ' 23:59:59']
    }

    if (fromDate && toDate) {
      customFilter.push(visitDateCustomFilterObject)
    }

    if (requestedBy) {
      setFilters(customFilter)
      setFiltersApplied(customFilter)
      localStorage.setItem("userClaimFilter", EncryptData(customFilter));
    }
    else {
      setFiltersApplied([])
      setFilters([])
      localStorage.removeItem("userClaimFilter")
    }

  }

  const fetchCubeUserClaimList = () => {
    let params = { pageNo, itemsPerPage, search, status: ['PENDING AT FINANCE', 'Approved', 'APPROVED'], filtersApplied }
    setLastPage(false)
    setLoader(false)
    getUserClaimFinance(params)
      .then(res => {
        let data = res?.loadResponses?.[0]?.data
        setReportUserClaimList(data)
        setLoader(true)
        if (data?.length < itemsPerPage) setLastPage(true)
        setLoader(true)
      })
      .catch(err => {
        setLastPage(true)
        console.error(err, 'Error while fetching claim list from report engine')
      })
  }


  const fetchUserClaimList = () => {
    if (requestedBy == undefined) {
      let params = { pageNo: (pageNo - 1), count: itemsPerPage, search, status: ['PENDING AT FINANCE', 'Approved', 'APPROVED'] }
      setLastPage(false)
      setLoader(false)
      getMyClaimList(params)
        .then((res) => {
          if (res?.result) {
            let data = res?.result
            setUserClaimList(data)
            setLoader(true)
            if (data?.length < itemsPerPage) setLastPage(true)
          }
        })
        .catch((err) => {
          console.error(err, '..error')
          setLoader(true)
        })
    }
  }

  const handleSearch = (e) => {
    let { value } = e.target
    setPagination(1)
    setSearchValue(value, () => setPagination(1))
  }

  const checkedUserClaimRows = (data) => {
    setSelectedRows(data);
  };

  const approveSelectedRows = () => {
    let checkApprovedStatus = selectedRows?.filter(item => {
      if (item?.claimStatus === 'APPROVED' || item?.claimStatus === 'Approved' || item?.[CubeDataset.EmployeeClaim.claimStatus] === 'APPROVED' || item?.[CubeDataset.EmployeeClaim.claimStatus] === 'Approved') return item
    })
    if (checkApprovedStatus?.length > 0) {
      toast.dismiss()
      toast.error('Claim already Approved')
      return
    }
    const updatedData = selectedRows?.map(item => {
      return {
        // ...item,
        claimStatus: 'APPROVED',
        approvedDate: new Date(),
        approvedByRoleName: roleName,
        approvedByEmpCode: empCode,
        _id: item?._id ?? item?.[CubeDataset.EmployeeClaim.MongoID],
        claimId: item?.claimId ?? item?.[CubeDataset.EmployeeClaim.claimId],
        approvedAmount: item?.approvedAmount ?? item?.[CubeDataset.EmployeeClaim.approvedAmount],
        modifiedBy: modifiedBy,
        modifiedBy_Uuid: modifiedBy_Uuid,
        statusModifiedByRoleName: roleName,
        statusModifiedByEmpCode: empCode
      };
    });
    let params = { claimList: updatedData }
    bulkUpdate(params)
      .then(res => {
        if (res?.result) {
          toast.success(res?.message)
          window.location.reload()
        }
        else {
          let data = res?.data
          let { statusCode } = data
          if (statusCode === 0) {
            let { message } = data?.error
            toast.dismiss()
            toast.error(message)
          }
        }
      })
      .catch(err => {
        console.error(err, 'Error while approving')
      })

  }

  const rejectSelectedRows = () => {
    let checkApprovedStatus = selectedRows?.filter(item => {
      if (item?.claimStatus === 'APPROVED' || item?.claimStatus === 'Approved' || item?.[CubeDataset.EmployeeClaim.claimStatus] === 'APPROVED' || item?.[CubeDataset.EmployeeClaim.claimStatus] === 'Approved') return item
    })
    if (checkApprovedStatus?.length > 0) {
      toast.dismiss()
      toast.error('Approved Status can not be Rejected')
      return
    }
    const updatedData = selectedRows?.map(item => {
      return {
        // ...item,
        claimStatus: 'REJECTED',
        approvedDate: new Date(),
        _id: item?._id ?? item?.[CubeDataset.EmployeeClaim.MongoID],
        claimId: item?.claimId ?? item?.[CubeDataset.EmployeeClaim.claimId],
        approvedAmount: item?.approvedAmount ?? item?.[CubeDataset.EmployeeClaim.approvedAmount],
        modifiedBy: modifiedBy,
        modifiedBy_Uuid: modifiedBy_Uuid,
        statusModifiedByRoleName: roleName,
        statusModifiedByEmpCode: empCode
      };
    });

    let params = { claimList: updatedData }

    bulkUpdate(params)
      .then(res => {
        if (res?.result) {
          toast.success(res?.message)
          window.location.reload()
        }
        else {
          let data = res?.data
          let { statusCode } = data
          if (statusCode === 0) {
            let { message } = data?.error
            toast.dismiss()
            toast.error(message)
          }
        }
      })
      .catch(err => {
        console.error(err, 'Error while approving')
      })
  }


  useEffect(() => {
    const applyFilter = DecryptData(localStorage?.getItem("userClaimFilter"));

    if (applyFilter?.length === 0 || applyFilter === null) {
      setReportUserClaimList([])
      fetchUserClaimList()
    }
    else if (filtersApplied?.length > 0) {
      setUserClaimList([])
      fetchCubeUserClaimList()
    }
  }, [pageNo, search, filtersApplied, itemsPerPage])

  useEffect(() => {
    const applyFilter = DecryptData(localStorage?.getItem("userClaimFilter"));

    if (applyFilter) {
      setFiltersApplied(applyFilter)
      let tempFilter = [];
      applyFilter.map((item) => {
        tempFilter.push(item);
      });
      setFilters(tempFilter);
    }

  }, [])

  useEffect(() => {
    customFilterFunction()
  }, [requestedBy != undefined])


  return (
    <Page title="Extramarks | Claim At Finance" className="main-container ApprovalRequestPage_Page datasets_container">
      <p className={classes.header}>All Claims</p>
      {selectedRows?.length > 0 &&
        <div style={{ float: 'right', display: 'flex', marginTop: '10px' }}>
          <div className={classes.addClaimBtn} style={{ marginRight: '-80px' }} onClick={approveSelectedRows}>Approve</div>
          <div className={classes.addClaimBtn} onClick={rejectSelectedRows}>Reject</div>
        </div>
      }
      {requestedBy == undefined &&
        <div className={classes.filterSection}>
          <div style={{ width: "100%", height: "100%" }}>
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <span onClick={handleFilter}>
                <div className={classes.filterDiv}>
                  <img style={{ marginRight: '10px' }} src={FilterIcon} alt="FilterIcon" /> Filter
                </div>
              </span>
            </div>
          </div>
        </div>
      }

      <LeadFilter
        applyFilters={applyFilters}
        filterAnchor={filterAnchor}
        setFilterAnchor={setFilterAnchor}
        addFilter={addFilter}
        filters={filters}
        setFilters={setFilters}
        removeAllFilters={removeAllFilters}
        removeFilter={removeFilter}
        role={role}
      />
      {
        loader ?
          ((userClaimList?.length > 0 || reportUserClaimList?.length > 0) ?
            <>
              <Container className='table_max_width'>
                <UserClaimFinanceTable list={userClaimList} pageNo={pageNo} itemsPerPage={itemsPerPage} reportUserClaimList={reportUserClaimList} checkedClaimRows={checkedUserClaimRows} />
              </Container>
              {/* <div className='center cm_pagination'>
                <Pagination pageNo={pageNo} setPagination={setPagination} lastPage={lastPage} />
              </div> */}
            </>
            :
            <>
              <div className={classes.noData}>
                <p>No Claims</p>
              </div>
              {/* <div className='center cm_pagination'>
                <Pagination pageNo={pageNo} setPagination={setPagination} lastPage={lastPage} />
              </div> */}
            </>
          )
          :
          <div className={classes.loader}>
            {DisplayLoader()}
          </div>
      }
      <div className="center cm_pagination">

        <TablePagination
          component="div"
          page={pageNo}
          onPageChange={handlePagination}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[10, 50, 100, 500, 1000]}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelDisplayedRows={({ page }) => {
            return `Page: ${page}`;
          }}
          backIconButtonProps={{
            disabled: pageNo === 1
          }}
          nextIconButtonProps={{
            disabled: lastPage
          }}
        />
      </div>
    </Page >
  );
}

export default UserClaimFinance