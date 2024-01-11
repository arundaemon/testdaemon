import React, { useEffect, useState } from "react";
import Page from "../../components/Page";
import {
  Container,
  Button,
  Grid,
  Divider,
  TextField,
  InputAdornment,
  Paper,
  TablePagination,
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  MenuItem,
  Select,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import Revenue from "../MyLeads/Revenue";
import Slider from "../MyLeads/Slider";
import { getSchoolList } from "../../config/services/school";
import SchoolListTable from "./SchoolListTable";
import SearchIcon from "../../assets/icons/icon_search.svg";
import ReactSelect from "react-select";
import { useSelector } from "react-redux";
import { getAllChildRoles } from "../../config/services/hrmServices";
import { getLoggedInRole } from "../../utils/utils";
import { DecryptData, EncryptData } from "../../utils/encryptDecrypt";
import { changeleadowner } from "../../config/services/leadassign";
import { useNavigate } from "react-router-dom";
import { Toast, toast } from "react-hot-toast";
import settings from "../../config/settings";
import { DisplayLoader } from "../../helper/Loader";
import FilterIcon from "../../assets/image/filterIcon.svg";
import LeadFilter from "../leadFilters/LeadFilter";
import _ from "lodash";
import { getReportSchoolList } from "../../helper/DataSetFunction";
import { Tabs } from "../Calendar/Tabs";
import SchoolLeadPipeline from "./SchoolLeadPipeline";
import { getOwnerInterestList } from "../../config/services/leadInterest";

const useStyles = makeStyles((theme) => ({
  cusCard: {
    padding: "2px",
    boxShadow: "0px 0px 8px #00000029",
    borderRadius: "8px",
  },
  RevenueCard: {
    padding: "0px",
    overflow: "hidden",
  },
  submitBtn: {
    fontWeight: "400 !important",
    backgroundColor: "#f45e29",
    border: "1px solid #f45e29",
    borderRadius: "4px !important",
    color: "#ffffff !important",
    padding: "6px 16px !important",
    marginLeft: "10px",
    "&:hover": {
      color: "#f45e29 !important",
    },
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },
  cusSelect: {
    width: "100%",
    fontSize: "14px",
    marginLeft: "1rem",
    borderRadius: "4px",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  mbForMob: {
    [theme.breakpoints.down("md")]: {
      marginBottom: "1rem",
    },
  },
  filterSection: {
    display: "flex",
    alignItems: "center",
  },
  noData: {
    height: "50vh",
    width: "90vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: 600,
    fontSize: 25,
  },
  loader: {
    height: "50vh",
    width: "90vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  customBorder: {
    padding: '10px 16px',
    border: '1px solid #eee',
    fontSize: '15px'
  }

}));


const LeadInterest = () => {
  const classes = useStyles();
  const [schoolList, setSchoolList] = useState([]);
  const [pageNo, setPagination] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [checkedLeads, setCheckedLeads] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loader, setLoader] = useState(false);
  const [searchTextField, setSearchTextField] = useState("");
  const [search, setSearchValue] = useState("");
  const [selectUserModal, setSelectUserModal] = useState(false);
  const [changeOwner, setChangeOwner] = useState(false);
  const [selectedUser, setSelectedUser] = useState();
  const [ownerChanged, setOwnerChanged] = useState(false);
  const [rolesList, setRoleslist] = useState([]);
  const [leadSize, setLeadSize] = useState(false);
  const userRole = getLoggedInRole();
  const navigate = useNavigate();
  const [roleNameList, setRoleName] = useState([]);
  const [lastPage, setLastPage] = useState();
  const [sortObj, setSortObj] = useState({
    sortKey: "createdAt",
    sortOrder: "-1",
  });
  const [filterAnchor, setFilterAnchor] = useState(null);
  const [filters, setFilters] = useState([]);
  const [filtersApplied, setFiltersApplied] = useState([]);
  const [reportSchoolList, setReportSchoolList] = useState([]);
  const [totalValue, setTotalValue] = useState(0)
  const [role] = useState('SCHOOL_FILTER')

  const [TAB_1, TAB_2] = [
    {
      label: "HOTS",
    },
    {
      label: "PIPELINE",
    },
  ];

  const [activeTab, setActiveTab] = useState(TAB_1);

  const handlePagination = (e, pageNumber) => {
    setPagination(pageNumber);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPagination(1);
    setItemsPerPage(event.target.value);
  };


  const getLeadData = (data) => {
    setCheckedLeads(data);
  };

  const handleSearchField = (e) => {
    let { value } = e.target;
    setSearchTextField(value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    let { value } = e.target;
    setPagination(1);
    setSearchValue(searchTextField);
  };


  const getUserChildRoles = async () => {
    getAllChildRoles({ role_name: userRole })
      .then((childRoles) => {
        let { all_child_roles } = childRoles?.data?.response?.data ?? {
          childs: [],
        };
        setRoleslist(all_child_roles);
        let childRoleNames = all_child_roles
          ? all_child_roles?.map((roleObj) => roleObj?.roleName)
          : [];
        childRoleNames.push(userRole);
        setRoleName(childRoleNames);
        // const applyFilter = DecryptData(localStorage?.getItem("LEAD_INTEREST"));
        // if (applyFilter === null) {
        //   setReportSchoolList([]);
        //   fetchCrmSchoolList(childRoleNames);
        // } else if (filtersApplied?.length > 0) {
        //   setSchoolList([]);
        //   fetchReportSchools(childRoleNames);
        // }
        localStorage.setItem("childRoles", EncryptData(all_child_roles ?? []));
      })
      .catch((err) => {
        console.log(err, "error");
      });
  };

  const getSchoolLeads = async () => {
    if (localStorage?.getItem("childRoles")) {
      let childRoleNames = DecryptData(localStorage?.getItem("childRoles"));
      setRoleslist(childRoleNames);
      childRoleNames = childRoleNames?.map((roleObj) => roleObj?.roleName);
      childRoleNames.push(userRole);
      setRoleName(childRoleNames);
      // fetchCrmSchoolList(childRoleNames);
    } else {
      getUserChildRoles();
    }
  };

  const fetchReportSchools = async (data) => {
    try {
      let params = { pageNo, itemsPerPage, search, filtersApplied, priority: activeTab?.label === 'PIPELINE' ? 'Pipeline' : activeTab?.label, childRoleNames: data ?? roleNameList };
      setLastPage(false);
      setLoader(false);
      setTotalValue(0)
      let res = await getReportSchoolList(params);
      setReportSchoolList(res);
      calculateTotalValue(res)
      setLoader(true);
      if (res?.length < itemsPerPage) setLastPage(true);
    } catch (err) {
      setLastPage(true);
      console.error(err, "Error while fetching claim list from report engine");
      setLoader(true);
    }
  };

  const fetchCrmSchoolList = (data) => {
    let queryData = {
      search,
      count: itemsPerPage,
      priority: activeTab?.label === 'PIPELINE' ? 'Pipeline' : activeTab?.label,
      pageNo: pageNo - 1,
      childRoleNames: data ? data : roleNameList,
      sortKey: "createdAt",
      sortOrder: "-1",
    };
    getIneterestList(queryData)
  };

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
    localStorage.setItem("LEAD_INTEREST", EncryptData(filtersCopy));
    setFiltersApplied(filtersCopy);
    setFilterAnchor(null);
  };

  const addFilter = () => {
    let filtersCopy = _.cloneDeep(filters);
    filtersCopy?.push({ label: "Select Filter" });
    setFilters(filtersCopy);
  };

  const removeFilter = (filterIndex) => {
    let filtersCopy = _.cloneDeep(filters);
    filtersCopy?.splice(filterIndex, 1);
    setFilters(filtersCopy);
    setFiltersApplied(filtersCopy);
    setCheckedLeads([]);
    localStorage.setItem("LEAD_INTEREST", EncryptData(filtersCopy));
    if (filtersCopy?.length == 0) {
      // sortObj.sortKey = dataSetIndex.updatedAt;
      // sortObj.sortOrder = -1;
      localStorage.removeItem("LEAD_INTEREST");
    }
  };

  const removeAllFilters = () => {
    // sortObj.sortKey = dataSetIndex.updatedAt;
    // sortObj.sortOrder = -1;
    setFilters([]);
    setFiltersApplied([]);
    localStorage.removeItem("LEAD_INTEREST");
  };

  const getIneterestList = async (data) => {
    try {
      setTotalValue(0)
      setLastPage(false);
      setLoader(false);
      let res = await getOwnerInterestList(data)
      setSchoolList(res?.result)
      calculateTotalValue(res?.result)
      setLoader(true);
      if (res?.result?.length < itemsPerPage) setLastPage(true)
    } catch (err) {
      console.error(err)
    }
  }

  const calculateTotalValue = (list) => {
    let applyFilter = DecryptData(localStorage?.getItem("LEAD_INTEREST"));

    let totalContractValue = 0
    for (let i = 0; i < list?.length; i++) {
      if (list[i]?.softwareContractValue)
        totalContractValue += list[i]?.softwareContractValue
    }
    setTotalValue(totalContractValue)

  }

  useEffect(() => {
    const applyFilter = DecryptData(localStorage?.getItem("LEAD_INTEREST"));
    getSchoolLeads()
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
    const applyFilter = DecryptData(localStorage?.getItem("LEAD_INTEREST"));
    let childRoleNames = DecryptData(localStorage?.getItem("childRoles"));
    setRoleslist(childRoleNames);
    childRoleNames = childRoleNames?.map((roleObj) => roleObj?.roleName);
    childRoleNames.push(userRole);
    if (applyFilter === null) {
      setReportSchoolList([]);
      fetchCrmSchoolList(childRoleNames);
    } else if (filtersApplied?.length > 0) {
      setSchoolList([]);
      fetchReportSchools(childRoleNames);
    }

  }, [search, itemsPerPage, ownerChanged, pageNo, rowsPerPage, filtersApplied, activeTab]);


  return (
    <>
      <Page
        title="Extramarks | Lead Interest"
        className="main-container myLeadPage datasets_container"
      >
        <Tabs renderType="leadInterest">
          {[TAB_1, TAB_2].map((item, index) => {
            return (
              <>
                <Tabs.Item
                  key={index}
                  active={item.label === activeTab.label}
                  renderType="leadInterest"
                  onClick={() => {
                    setActiveTab(item);
                  }}
                >
                  {item.label}
                </Tabs.Item>
              </>
            );
          })}
        </Tabs>

        <div className="tableCardContainer">
          <Paper>
            <div className="mainContainer">
              {activeTab ? <div className={classes.customBorder}>
                {`Total ${activeTab ? activeTab?.label : ''} Value : ${totalValue}`}
              </div> : <div></div>}
              <div className="right">
                <form>
                  <TextField
                    className={`inputRounded search-input width-auto`}
                    type="search"
                    placeholder="Search"
                    value={searchTextField}
                    onChange={handleSearchField}
                    InputLabelProps={{ style: { ...{ top: `${-7}px` } } }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <img src={SearchIcon} alt="" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Button
                    className={classes.submitBtn}
                    type="submit"
                    onClick={handleSearch}
                  >
                    Search
                  </Button>
                </form>
              </div>
            </div>
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
                    <div className="filterContainer mt-1">
                      <img src={FilterIcon} alt="FilterIcon" /> Filter
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
            {loader ? (
              schoolList?.length > 0 || reportSchoolList?.length > 0 ? (
                <>
                  <Container className="table_max_width">
                    <SchoolLeadPipeline
                      list={schoolList}
                      getLeadData={getLeadData}
                      reportSchoolList={reportSchoolList}
                    />
                  </Container>
                </>
              ) : (
                <>
                  <div className={classes.noData}>
                    <p>No Data Available</p>
                  </div>
                </>
              )
            ) : (
              <div className={classes.loader}>{DisplayLoader()}</div>
            )}
          </Paper>
        </div>
        <Grid />

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
              disabled: pageNo === 1,
            }}
            nextIconButtonProps={{
              disabled: lastPage,
            }}
          />
        </div>
      </Page>
    </>
  );
};

export default LeadInterest;
