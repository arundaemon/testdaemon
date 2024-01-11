import React, { useEffect, useState } from "react";
import { getMyClaimList } from "../../config/services/userClaim";
// import SearchIcon from "../../assets/icons/icon_search.svg";
import Page from "../Page";
import {
  Container,
  TextField,
  Button,
  Grid,
  InputAdornment,
  TablePagination,
  Breadcrumbs,  
  Typography,
  Box
} from "@mui/material";
import Pagination from "../../pages/Pagination";
import { Link, useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import { DisplayLoader } from "../../helper/Loader";
import _ from "lodash";
import FilterIcon from "../../assets/image/filterIcon.svg";
import toast from "react-hot-toast";
import { DecryptData, EncryptData } from "../../utils/encryptDecrypt";
import LeadFilter from "../leadFilters/LeadFilter";
import {
  getClaimList,
  getClaimListNew,
  getUserClaimFinance,
} from "../../helper/DataSetFunction";
import { bulkDelete } from "../../config/services/userClaim";
import CubeDataset from "../../config/interface";
import { ClaimTable } from "./ClaimTable";
import { useStyles } from "../../css/ClaimForm-css";
import { approveClaimRequest, approveReject, updateBulk } from "../../config/services/approvalRequest";
import { getUserData } from "../../helper/randomFunction/localStorage";
import IconBreadcrumbArrow from "./../../assets/icons/icon-breadcrumb-arrow.svg";
import { ReactComponent as IconInputSearch } from './../../assets/icons/icon-input-search-light.svg';
import Env_Config from '../../config/settings'

const ClaimList = () => {
  const [myClaimList, setMyClaimList] = useState([]);
  const [reportClaimList, setReportClaimList] = useState([]);
  const [pageNo, setPagination] = useState(1);
  const [search, setSearchValue] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [lastPage, setLastPage] = useState(false);
  const [loader, setLoader] = useState(false);
  const [loginData] = useState(
    JSON.parse(localStorage?.getItem("loginData"))
  );
  const [userData] = useState(
    JSON.parse(localStorage.getItem("userData"))
  );
  const [filterAnchor, setFilterAnchor] = useState(null);
  const [filters, setFilters] = useState([]);
  const [filtersApplied, setFiltersApplied] = useState([]);
  const [role] = useState("APPROVAL_REQUEST");
  const [selectedRows, setSelectedRows] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [checkedRows, setCheckedRows] = useState([]);
  const [actionType, setActionType] = useState()
  const [remark, setRemark] = useState()
  const [successFlag, setSuccessFlag] = useState(false)
  let [isModel, setIsModel] = useState(false);
  const [hasInternalData, setHasInternalData] = useState(false);
  const [selectedClaimType, setSelectedClaimType] = useState('My Claims');
  const financeProfile = Env_Config.FINANCE_PROFILES
  const [profileMatch, setProfileMatch] = useState(financeProfile.indexOf(userData?.crm_profile) > -1)
  const navigate = useNavigate();
  const classes = useStyles();
  const [sortBy, setSortBy] = useState(CubeDataset.UserClaim.visitDate);
  const [sortOrder, setSortOrder] = useState('desc');

  const handleFilter = (e) => {
    setFilterAnchor(e.currentTarget);
  };

  const applyFilters = () => {
    if (filters.find((fltObj) => fltObj?.label === "Select Filter")) {
      toast.error("Select Valid Filter");
      return;
    }
    let filtersCopy = _.cloneDeep(filters);
    localStorage.setItem("claimListFilter", EncryptData(filtersCopy));
    setFiltersApplied(filtersCopy);
    setPagination(1)
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
    if (filters[0]?.label === "Select Filter") {
      filtersCopy?.splice(filterIndex, 1);
      setFilters(filtersCopy);
    } else {
      filtersCopy?.splice(filterIndex, 1);
      setFilters(filtersCopy);
      setFiltersApplied(filtersCopy);
    }
    localStorage.setItem("claimListFilter", EncryptData(filtersCopy));
    if (filtersCopy?.length == 0) {
      localStorage.removeItem("claimListFilter");
    }
  };

  const removeAllFilters = () => {
    setFilters([]);
    setFiltersApplied([]);
    localStorage.removeItem("claimListFilter");
  };

  const fetchReportClaimList = () => {
    let params = { pageNo, itemsPerPage, search, filtersApplied, sortBy, sortOrder}
    setLastPage(false)
    setLoader(true)
    getClaimListNew(params)
      .then(res => {
        let data = res?.loadResponses?.[0]?.data
        setMyClaimList(data)
        if (data?.length < itemsPerPage) setLastPage(true)
        setLoader(false)
      })
      .catch(err => {
        setLastPage(true)
        setLoader(false)
        console.error(err, 'Error while fetching Myclaim list from report engine')
      })
      .catch((err) => {
        setLastPage(true);
        console.error(
          err,
          "Error while fetching Myclaim list from report engine"
        );
      });
  };

  const fetchUserClaimList = () => {
    setLastPage(false)
    setLoader(true)
    let params = { search, pageNo, itemsPerPage, sortBy, sortOrder }
    getClaimListNew(params)
      .then((res) => {
        if (res) {
          let data = res?.loadResponses?.[0]?.data
          setMyClaimList(data)
          setLoader(false)
        }
      })
      .catch((err) => {
        setLoader(false)
        console.error(err, '..error')
      })
  }

  const handleSearch = (e) => {
    let { value } = e.target
    setPagination(1)
    setSearchValue(value, () => setPagination(1))
  }

  useEffect(() => {
    const applyFilter = DecryptData(localStorage?.getItem("claimListFilter"));
    if (applyFilter === null) {
      fetchUserClaimList();
    } else if (filtersApplied?.length > 0) {
      fetchReportClaimList();
    }
  }, [pageNo, search, filtersApplied, itemsPerPage, sortBy, sortOrder]);

  useEffect(() => {
    const applyFilter = DecryptData(localStorage?.getItem("claimListFilter"));
    if (applyFilter) {
      setFiltersApplied(applyFilter);
      let tempFilter = [];
      applyFilter.map((item) => {
        tempFilter.push(item);
      });
      setFilters(tempFilter);
    }
  }, []);

  const getParentRowData = (data) => {
    if (data) {
      setSelectedRows(data);
    }
  };

  const handleApproveReject = async(type) => {
    setIsModel(true)
    setActionType(type)
  }

  const handlePopupAction = async(type) => {
    
    if(type === 'cancel'){
      setIsModel(false)
      setRemark('')
      return false
    }
    if((remark && remark.trim() == '') || !remark){
      toast.error('Enter Remarks First')
      return false
    }
    let params
    const extractedEmpIds = checkedRows.map((item) => item[CubeDataset.UserClaim.requestByEmpCode]);
    if(!profileMatch){
      params={
        empCodeList: extractedEmpIds,
        remarks: remark,
        loggedInUser: getUserData('userData')?.crm_role,
      }
    }else {
      const date = new Date();
      const formattedDate = date.toISOString()
      params={
        empCodeList: extractedEmpIds,
        remarks: remark,
        approvedDate: formattedDate,
        modifiedBy: userData?.username,
        modifiedBy_Uuid: loginData?.uuid,
        statusModifiedByRoleName: userData?.crm_role,
        statusModifiedByEmpCode: userData?.username.toUpperCase(),
      }
    }
     
    try{
      setIsModel(false)
      setRemark('')
      let response
      if(profileMatch){
        if(type==='approve'){
          params.claimStatus='APPROVED'
          response = await updateBulk(params)
        }
        else if(type==='reject'){
          params.claimStatus='REJECTED'
          response = await updateBulk(params)
        }
      }else {
        if(type==='approve')
          response = await approveClaimRequest(params)
        else if(type==='reject')
          response = await approveReject(params)
      }
      if(response && response?.status === 'success'  || response?.message === 'Claims updated successfully')
        toast.success("Success!")
      else if(response)
        toast.error("**Error**")

        setSuccessFlag(!successFlag)
    }catch(error){
      console.log("Error:", error);
    }
  }

  const handleHasInternalData = (type) => {
    setHasInternalData(true);
    let claimsType;
    if(type === undefined) {
      claimsType = 'Total Claims'
    } else if(type === 'NEW') {
      claimsType = 'Pending Claims'
    } else if(type === 'APPROVED') {
      claimsType = 'Approved Claims'
    } else if(type === 'REJECTED') {
      claimsType = 'Rejected Claims'
    }
    setSelectedClaimType(claimsType);
  }

  return (
    <Page
      title="Extramarks | My Claim"
      className=""
    >

      <Breadcrumbs
        className="crm-breadcrumbs"
        separator={<img src={IconBreadcrumbArrow} />}
        aria-label="breadcrumbs"
      >
        <Link
          underline="hover"
          key="1"
          color="inherit"
          to={hasInternalData ? `/authorised/claim-list` : `/authorised/school-dashboard`}
          className="crm-breadcrumbs-item breadcrumb-link"
        >
          {hasInternalData ? `My Claims` : `Dashboard`}
        </Link>
        <Typography
          key="2"
          component="span"
          className="crm-breadcrumbs-item breadcrumb-active"
        >
          {hasInternalData ? selectedClaimType : `My Claims`}
        </Typography>
      </Breadcrumbs>

      

      <div className={'crm-sd-page-container ' + (hasInternalData ? ` crm-page-has-data` : ``)}>
        <div className="crm-sd-claims-header">
          <div >
            <span onClick={handleFilter}>
              <div className={classes.filterDiv + ` mb-0`}>
                <img
                  style={{ marginRight: "10px" }}
                  src={FilterIcon}
                  alt="FilterIcon"
                />{" "}
                Filters
              </div>
            </span>
          </div>
          <TextField
            autoComplete="off"
            className={`crm-form-input light width-200p`}
            type="search"
            placeholder="Search"
            // value={searchTextField}
            onChange={handleSearch}
            inputProps={{ maxLength: 100 }}
            InputLabelProps={{ style: { ...{ top: `${-7}px` } } }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconInputSearch />
                </InputAdornment>
              ),
            }}
          />
        </div>

        {selectedRows?.length > 0 && (<div className={classes.flkClaimBtn + ` crm-sd-claims-table-action pt-0`}>
          <Button
            className={'crm-btn crm-btn-outline crm-btn-sm'}
            onClick={()=>handleApproveReject('approve')}
          >
            Approve
          </Button>
          <Button
            className={'crm-btn crm-btn-outline crm-btn-sm'}
            onClick={()=>handleApproveReject('reject')}
          >
            Reject
          </Button>
        </div>)}

          <Box className='crm-table-container'>
          {loader ? (
            <div className={classes.loader}>
              {DisplayLoader()}
            </div>
          ) : (
            myClaimList?.length > 0 ? (
              <ClaimTable list={myClaimList} getParentRowData={getParentRowData} checkedRows={checkedRows} setCheckedRows={setCheckedRows} isModel={isModel} 
                actionType={actionType} remark={remark} setRemark={setRemark} handlePopupAction={handlePopupAction} successFlag={successFlag}
                handleHasInternalData={handleHasInternalData}  filtersApplied={filtersApplied} sortBy={sortBy} setSortBy={setSortBy} sortOrder={sortOrder} setSortOrder={setSortOrder}/>
            ) : (
              <div className={classes.noData}>
                <p>No Data</p>
              </div>
            )
          )}
          <div className='center cm_pagination'>
            <Pagination pageNo={pageNo} setPagination={setPagination} lastPage={lastPage} />
          </div>
        </Box>

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

      </div>
    </Page>
  );
};

export default ClaimList;
