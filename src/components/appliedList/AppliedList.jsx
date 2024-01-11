import React, { useEffect, useState } from "react";
import Page from "../Page";
import {
  TextField,
  InputAdornment,
  Box
} from "@mui/material";
import Pagination from "../../pages/Pagination";
import {useNavigate } from "react-router-dom";
import { DisplayLoader } from "../../helper/Loader";
import _ from "lodash";
import FilterIcon from "../../assets/image/filterIcon.svg";
import toast from "react-hot-toast";
import { DecryptData, EncryptData } from "../../utils/encryptDecrypt";
import LeadFilter from "../leadFilters/LeadFilter";
import {
  appliedClaimList,
  getClaimListNew,
} from "../../helper/DataSetFunction";
import { useStyles } from "../../css/ClaimForm-css";
import { ReactComponent as IconInputSearch } from './../../assets/icons/icon-input-search-light.svg';
import { AppliedTable } from "./AppliedTable";

const ClaimList = () => {
  const [myClaimList, setMyClaimList] = useState([]);
  const [reportClaimList, setReportClaimList] = useState([]);
  const [pageNo, setPagination] = useState(1);
  const [search, setSearchValue] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [lastPage, setLastPage] = useState(false);
  const [loader, setLoader] = useState(false);

  const [filterAnchor, setFilterAnchor] = useState(null);
  const [filters, setFilters] = useState([]);
  const [filtersApplied, setFiltersApplied] = useState([]);
  const [role] = useState("APPROVAL_REQUEST");
  const [hasInternalData, setHasInternalData] = useState(false);
  const [selectedClaimType, setSelectedClaimType] = useState('My Claims');
  const classes = useStyles();

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
    let params = { pageNo, itemsPerPage, search, filtersApplied }
    setLastPage(false)
    setLoader(true)
    appliedClaimList(params)
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
    let params = { search, pageNo, itemsPerPage }
    appliedClaimList(params)
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
  }, [pageNo, search, filtersApplied, itemsPerPage]);

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

        <Box className='crm-table-container'>
          {loader ? (
            <div className={classes.loader}>
              {DisplayLoader()}
            </div>
          ) : (
            myClaimList?.length > 0 ? (
              <AppliedTable list={myClaimList} handleHasInternalData={handleHasInternalData}  />
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
