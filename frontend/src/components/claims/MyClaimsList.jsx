import React, { useEffect, useState } from 'react'
import { getMyClaimList } from '../../config/services/userClaim'
import SearchIcon from '../../assets/icons/icon_search.svg';
import Page from "../../components/Page";
import { Container, TextField, Button, Grid, InputAdornment, TablePagination } from "@mui/material";
import UserClaimFinanceTable from './UserClaimFinanceTable';
import Pagination from '../../pages/Pagination';
import { useNavigate } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import { DisplayLoader } from '../../helper/Loader';
import _ from "lodash";
import FilterIcon from "../../assets/image/filterIcon.svg";
import toast from "react-hot-toast";
import { DecryptData, EncryptData } from "../../utils/encryptDecrypt";
import LeadFilter from '../leadFilters/LeadFilter';
import { getUserClaimFinance } from '../../helper/DataSetFunction';
import { bulkDelete } from '../../config/services/userClaim';
import CubeDataset from '../../config/interface';
import MyClaimTable from './MyClaimTable';

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
    lineHeight: "22px",
    cursor: "pointer",
    borderRadius: "4px",
    color: "white",
    border: "1px solid #F45E29",
    padding: "12px 24px",
    background: "#F45E29",
    marginLeft: "95px",
    marginBottom: '10px',
    width: "max-content"
  },
  header: {
    fontSize: '28px',
    fontWeight: '600',
    marginBottom: '35px'
  },
  buttonDiv: {
    display: 'grid',
    marginBottom: '10px'
  },
  filterSection: {
    display: "flex",
    alignItems: "center",
    marginTop: '-10px'
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

const MyClaimsList = () => {
  const [myClaimList, setMyClaimList] = useState([])
  const [reportUserClaimList, setReportUserClaimList] = useState([])
  const [pageNo, setPagination] = useState(1);
  const [search, setSearchValue] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [lastPage, setLastPage] = useState(false)
  const [loader, setLoader] = useState(false)
  const [childRoles] = useState(DecryptData(localStorage?.getItem("childRoles")));
  const [userName] = useState(JSON.parse(localStorage.getItem("userData"))?.username);
  const [filterAnchor, setFilterAnchor] = useState(null);
  const [filters, setFilters] = useState([]);
  const [filtersApplied, setFiltersApplied] = useState([]);
  const [role] = useState('EMPLOYEE_CLAIMS')
  const [selectedRows, setSelectedRows] = useState([])
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate()
  const classes = useStyles()

  const handleFilter = (e) => {
    setFilterAnchor(e.currentTarget);
  };

  const applyFilters = () => {
    if (filters.find((fltObj) => fltObj?.label === "Select Filter")) {
      toast.error("Select Valid Filter");
      return;
    }
    // sortObj.sortKey = dataSetIndex.updatedAt;
    // sortObj.sortOrder = "desc";
    let filtersCopy = _.cloneDeep(filters);
    localStorage.setItem("myClaimFilter", EncryptData(filtersCopy));
    setFiltersApplied(filtersCopy);
    setFilterAnchor(null);
  };
  const addFilter = () => {
    let filtersCopy = _.cloneDeep(filters);
    if (filters.find((fltObj) => fltObj?.label === "Select Filter")) {
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
    localStorage.setItem("myClaimFilter", EncryptData(filtersCopy));
    if (filtersCopy?.length == 0) {
      // sortObj.sortKey = dataSetIndex.updatedAt;
      // sortObj.sortOrder = -1;
      localStorage.removeItem("myClaimFilter");
    }
  };

  const removeAllFilters = () => {
    // sortObj.sortKey = dataSetIndex.updatedAt;
    // sortObj.sortOrder = -1;
    setFilters([]);
    setFiltersApplied([]);
    // setCheckedLeads([]);
    localStorage.removeItem("myClaimFilter");
  };

  const fetchCubeUserClaimList = () => {
    let userNameUpperCase = userName.toUpperCase()
    let params = { pageNo, itemsPerPage, search, filtersApplied, userName: userNameUpperCase }
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
        console.error(err, 'Error while fetching Myclaim list from report engine')
      })
  }

  const fetchUserClaimList = () => {
    // let childDisplayName = childRoles?.map(obj => obj.displayName)
    // childDisplayName.push(userName)
    let userNameUpperCase = userName.toUpperCase()
    let queryData = { pageNo: (pageNo - 1), count: itemsPerPage, search, childRoleNames: userNameUpperCase }
    setLastPage(false)
    setLoader(false)
    getMyClaimList(queryData)
      .then((res) => {
        if (res?.result) {
          let data = res?.result
          setMyClaimList(data)
          setLoader(true)
          if (data?.length < itemsPerPage) setLastPage(true)
        }
      })
      .catch((err) => {
        console.error(err, '..error')
        setLoader(true)
      })
  }

  const handleSearch = (e) => {
    let { value } = e.target
    setPagination(1)
    setSearchValue(value, () => setPagination(1))
  }

  const toAddClaim = () => {
    navigate('/authorised/add-claim')
  }

  const checkedUserClaimRows = (data) => {
    setSelectedRows(data);
  };

  const handlePagination = (e, pageNumber) => {
    setPagination(pageNumber);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPagination(1);
    setItemsPerPage(event.target.value);
  };

  const deleteSelectedRows = () => {
    let claimList = [];
    //selectedRows
    selectedRows?.map(item => {
      let obj = {
        _id: item?._id ?? item?.[CubeDataset.EmployeeClaim.MongoID],
        claimStatus: item?.claimStatus ?? item?.[CubeDataset.EmployeeClaim.claimStatus],
        claimId: item?.claimId ?? item?.[CubeDataset.EmployeeClaim.claimId]
      }
      claimList.push(obj);
    })
    let params = { claimList };
    // console.log(claimList, selectedRows, '......................................claim list');
    bulkDelete(params)
      .then(res => {
        // console.log(res,'.............................................res from be');
        if (res?.result) {
          toast.success('Claims deleted successfully')
          fetchUserClaimList()
          window.location.reload()
        }
        else {
          toast.error('Something went wrong')
        }
      })
      .catch(err => {
        console.log(err, ':: error inside delete claim catch');
      })
  }

  useEffect(() => {
    const applyFilter = DecryptData(localStorage?.getItem("myClaimFilter"));
    if (applyFilter === null) {
      setReportUserClaimList([])
      fetchUserClaimList()
    }
    else if (filtersApplied?.length > 0) {
      setMyClaimList([])
      fetchCubeUserClaimList()
    }
  }, [pageNo, search, filtersApplied, itemsPerPage])

  useEffect(() => {
    const applyFilter = DecryptData(localStorage?.getItem("myClaimFilter"));
    if (applyFilter) {
      setFiltersApplied(applyFilter)
      let tempFilter = [];
      applyFilter.map((item) => {
        tempFilter.push(item);
      });
      setFilters(tempFilter);
    }
  }, [])



  return (
    <Page title="Extramarks | My Claim" className="main-container ApprovalRequestPage_Page datasets_container">
        <p className={classes.header}>All Claims</p>

      {selectedRows?.length > 0 &&
        <div style={{ float: 'right' }}>
          <div style={{ lineHeight: '15px' }} className={classes.addClaimBtn} onClick={deleteSelectedRows}>Delete {selectedRows?.length} claims</div>
        </div>

      }
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



      {loader ?
        ((myClaimList?.length > 0 || reportUserClaimList?.length > 0) ?
          <>
            <Container className='table_max_width'>
              <MyClaimTable list={myClaimList} pageNo={pageNo} itemsPerPage={itemsPerPage} reportUserClaimList={reportUserClaimList} checkedClaimRows={checkedUserClaimRows} />
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
          rowsPerPageOptions={[10, 50, 500, 1000]}
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
    </Page>
  );
}

export default MyClaimsList