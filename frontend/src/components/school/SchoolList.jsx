import React, { useEffect, useRef, useState } from "react";
import Page from "../../components/Page";
import {
  Container,
  Button,
  Grid,
  Divider,
  TextField,
  InputAdornment,
  Paper,
  Modal,
  Box,
  Typography,
  TablePagination,
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
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import settings from "../../config/settings";
import { DisplayLoader } from "../../helper/Loader";
import FilterIcon from "../../assets/image/filterIcon.svg";
import LeadFilter from "../leadFilters/LeadFilter";
import _, { ceil } from "lodash";
import {
  getLeadInterestData,
  getReportSchoolList,
  schoolsConverted,
  fetchSchoolList,
  getReportSchoolListMobile,
} from "../../helper/DataSetFunction";
import useMediaQuery from "@mui/material/useMediaQuery";
import { ReactComponent as IconNavLeft } from "./../../assets/icons/icon-nav-left-arrow.svg";
import { ViewportFilterModal } from "../Modals/ViewportFilterModal";
import moment from "moment";
import CubeDataset from "../../config/interface/test";

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
    marginBottom: "20px",
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
}));

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "1px solid #fff",
  boxShadow: "0px 0px 4px #0000001A",
  p: 4,
  borderRadius: "4px",
};

const SchoolList = (props) => {
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
  const location = useLocation();
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
  const [role] = useState("SCHOOL_FILTER");
  const activeTabType =
    location?.state?.currentTabType || props?.currentTabType;
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const [paginationLimit, setPaginationLimit] = useState(5);
  const schoolsListRef = useRef();
  useEffect(() => {
    if (
      activeTabType !== "dashboard-schools-mobile" ||
      activeTabType === "schools-mobile"
    )
      document.body.classList.add("crm-is-inner-page");
    return () => document.body.classList.remove("crm-is-inner-page");
  }, [activeTabType]);

  const handlePagination = (e, pageNumber) => {
    setPagination(pageNumber);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPagination(1);
    setItemsPerPage(event.target.value);
  };

  const getSchools = async (data) => {
    try {
      setLastPage(false);
      setLoader(false);
      let res;
      if (!isMobile) {
        res = await getSchoolList(data);
        setSchoolList(res?.result);
        setLoader(true);
        if (res?.result?.length < itemsPerPage) setLastPage(true);
      } else if (isMobile) {
        res = await fetchSchoolList(data.childRoleNames);
        setSchoolList(res?.loadResponses[0]?.data);
        setLoader(true);

      }
    } catch (err) {
      console.error(err);
      setLoader(true);
    }
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

  const toggleSelectUserModal = () => {
    setSelectUserModal(!selectUserModal);
  };

  const toggleChangeOwnerModal = () => {
    setSelectUserModal(!selectUserModal);
  };

  const handleFilterByRole = (value) => {
    setSelectedUser(value);
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
        fetchCrmSchoolList(childRoleNames);
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
      fetchCrmSchoolList(childRoleNames);
    } else {
      getUserChildRoles();
    }
  };


  const fetchReportSchools = async (childRoleNames) => {
    try {
      let params = { pageNo, itemsPerPage, search, filtersApplied, childRoleNames };
      setLastPage(false);
      setLoader(false);
      let res
      if(isMobile){
        res = await getReportSchoolListMobile(params);
      }else{
        res = await getReportSchoolList(params);
      }
      
      let data = res.rawData();
      setReportSchoolList(data);
      setLoader(true);
      if (data?.length < itemsPerPage) setLastPage(true);
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
      pageNo: pageNo - 1,
      childRoleNames: data,
      sortKey: "createdAt",
      sortOrder: "-1",
      parentRole: userRole
    };
    getSchools(queryData);
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
    localStorage.setItem("schoolFilters", EncryptData(filtersCopy));
    setFiltersApplied(filtersCopy);
    setFilterAnchor(null);
    setPagination(1);
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
    setCheckedLeads([]);
    localStorage.setItem("schoolFilters", EncryptData(filtersCopy));
    if (filtersCopy?.length == 0) {
      // sortObj.sortKey = dataSetIndex.updatedAt;
      // sortObj.sortOrder = -1;
      localStorage.removeItem("schoolFilters");
    }
  };

  const removeAllFilters = () => {
    // sortObj.sortKey = dataSetIndex.updatedAt;
    // sortObj.sortOrder = -1;
    setFilters([]);
    setFiltersApplied([]);
    localStorage.removeItem("schoolFilters");
  };

  const addList = async () => {
    let leadId = checkedLeads?.map((obj) => obj?.school_info?.leadId);

    let {
      userID,
      roleName,
      profileName,
      roleID,
      profileID,
      userName,
      displayName,
      profileCode,
      roleCode,
    } = selectedUser;

    const sampleData = {
      leadId: leadId,
      userID: userID,
      userName: userName,
      displayName: displayName,
      role_id: roleID,
      role_code: roleCode,
      role_name: roleName,
      profile_id: profileID,
      profile_code: profileCode,
      profile_name: profileName,
      leadType: "BTB",
    };

    setCheckedLeads([]);
    setOwnerChanged(false);
    changeleadowner(sampleData)
      .then((res) => {
        if (res?.statusCode === 1) {
          toast.success("Lead Assigned Successfully");
          setOwnerChanged(true);
        } else if (res?.data?.statusCode === 0) {
          let { errorMessage } = res?.data?.error;
          toast.error(errorMessage);
        } else {
          console.error(res);
        }
      })
      .catch((error) => console.log(error, "...errror"));
  };

  const handleTransfer = () => {
    addList();
    toggleSelectUserModal();
    navigate("/authorised/school-list");
    setSelectedUser("");
  };

  useEffect(() => {

    if (localStorage?.getItem("childRoles")) {
      let childRoleNames = DecryptData(localStorage?.getItem("childRoles"));
      setRoleslist(childRoleNames);
      childRoleNames = childRoleNames?.map((roleObj) => roleObj?.roleName);
      childRoleNames.push(userRole);
      setRoleName(childRoleNames);
    }

    const applyFilter = DecryptData(localStorage?.getItem("schoolFilters"));
    if (applyFilter) {
      setFiltersApplied(applyFilter);
      let tempFilter = [];
      applyFilter.map((item) => {
        tempFilter.push(item);
      });
      setFilters(tempFilter);
    }
  }, []);

  useEffect(() => {
    if (roleNameList?.length == 0) return
    const applyFilter = DecryptData(localStorage?.getItem("schoolFilters"));
    setPaginationLimit(5)
    if (applyFilter?.length === 0 || applyFilter === null) {
      setReportSchoolList([]);
      setSchoolList([])
      fetchCrmSchoolList(roleNameList)
    } else if (filtersApplied?.length > 0) {
      setSchoolList([]);
      setReportSchoolList([]);
      fetchReportSchools(roleNameList);
    }
    // else if (filtersApplied?.length > 0 && isMobile) {
    //   setReportSchoolList([]);
    //   getSchoolLeads();
    // }
  }, [
    search,
    itemsPerPage,
    ownerChanged,
    pageNo,
    rowsPerPage,
    filtersApplied,
    isMobile,
    roleNameList
  ]);


  const handleViewMore = () => {
    //console.log("vvv", schoolsListRef?.current, schoolsListRef?.current?.children)
    let newPaginationLimit = paginationLimit + 3;
    if ((schoolList?.length > 0 && newPaginationLimit > schoolList?.length)) {
      newPaginationLimit = schoolList?.length;
    }
    else if (reportSchoolList?.length > 0 && newPaginationLimit > reportSchoolList?.length) {
      newPaginationLimit = reportSchoolList?.length;
    }
    if ((schoolList?.length > 0 && paginationLimit < schoolList?.length) || (reportSchoolList?.length > 0 && paginationLimit < reportSchoolList?.length)) {
      setPaginationLimit(newPaginationLimit);
      setTimeout(() => {
        schoolsListRef?.current?.children
          .item(newPaginationLimit - 3)
          .scrollIntoView({
            behavior: "smooth",
          });
      }, 500);
    }
  };

  //console.log(roleNameList, 'roleNameList')

  return (
    <>
      <Page
        title="Extramarks | School Leads"
        data-tab={activeTabType}
        className={
          `crm-schools-container main-container myLeadPage datasets_container mt-0 ` +
          (activeTabType === "dashboard-schools-mobile" ? `schools-in-tab` : ``)
        }
      >
        <>
          <Box className="crm-page-innner-header">
            {isMobile ? (
              <Link
                key="99"
                color="inherit"
                to={".."}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(-1);
                }}
                className=""
              >
                <IconNavLeft className="crm-inner-nav-left" />{" "}
              </Link>
            ) : null}
            <Typography component="h2" className="crm-sd-log-heading">
              My Schools
            </Typography>
          </Box>

          {!isMobile ? (
            <>
              <Container className="table_max_width">
                <Grid container spacing={2} sx={{ mt: "0px", mb: "16px" }}>
                  <Grid item xs={12} lg={6}>
                    <Grid
                      className={`${classes.cusCard} ${classes.RevenueCard}`}
                    >
                      <Revenue />
                    </Grid>
                  </Grid>
                  <Grid item xs={12} lg={6}>
                    <Grid
                      className={`${classes.cusCard} ${classes.RevenueCard}`}
                    >
                      <Slider />
                    </Grid>
                  </Grid>
                </Grid>
              </Container>
              <div className="tableCardContainer">
                <Paper>
                  <div className="mainContainer mb-0">
                    <div className="crm-sd-schools-header">
                      <div className="crm-sd-schools-header-label">
                        {!isMobile ? (
                          <>
                            <div className="left">
                              <h3>My Schools</h3>
                            </div>
                            <div className="right">
                              <form>
                                <TextField
                                  className={`inputRounded search-input width-auto`}
                                  type="search"
                                  placeholder="Search"
                                  value={searchTextField}
                                  onChange={handleSearchField}
                                  InputLabelProps={{
                                    style: { ...{ top: `${-7}px` } },
                                  }}
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
                              {checkedLeads?.length > 0 &&
                                rolesList?.length > 0 && (
                                  <Button
                                    className={classes.submitBtn}
                                    onClick={() => {
                                      toggleChangeOwnerModal();
                                    }}
                                  >
                                    Change Owner
                                  </Button>
                                )}
                            </div>
                          </>
                        ) : null}
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
                              <div className="filterContainer">
                                <img src={FilterIcon} alt="FilterIcon" /> Filter
                              </div>
                            </span>
                          </div>
                        </div>
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
                        <Container className="table_max_width px-0">
                          <SchoolListTable
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

                  <div className="center cm_pagination" data-pageno={pageNo} data-rows={rowsPerPage} data-lastPage={lastPage}
                    data-count={ceil(schoolList?.length / rowsPerPage)} data-length={schoolList?.length} >
                    <TablePagination
                      //count={ceil(schoolList?.length/rowsPerPage)}
                      component="div"
                      page={pageNo}
                      onPageChange={(e, pageNumber) => setPagination(pageNumber)}
                      rowsPerPage={rowsPerPage}
                      rowsPerPageOptions={[10, 50, 100, 500]}
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
                </Paper>
              </div>
            </>
          ) : (
            <>
              <Box className="crm-schools-wrapper">
                {/* <ViewportFilterModal filters={filters} /> */}
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
                        <div className="filterContainer">
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

                {
                    loader ?  
                      (schoolList?.length > 0 || reportSchoolList?.length > 0 ?
                          <Box className="crm-sd-tab-schools-container">
                            {/* {!loader ? DisplayLoader() : null} */}
                            <Box
                              className="crm-sd-tab-schools-list"
                              data-limit={paginationLimit}
                              data-count={schoolList?.length}
                              ref={schoolsListRef}
                            >
                              {schoolList?.length > 0
                                ? schoolList
                                  ?.slice(0, paginationLimit)
                                  ?.map((item, i) => (
                                    <Box
                                      className="crm-sd-tab-schools-listitem"
                                      key={i}
                                      onClick={() =>
                                        navigate(
                                          `/authorised/school-details/${item[CubeDataset.Schools.leadId]
                                          }`
                                        )
                                      }
                                    >
                                      <Box className="crm-sd-tab-schools-listitem-container">
                                        <Box className="crm-sd-tab-schools-listitem-name">
                                          <span>School Name:</span>{" "}
                                          {/* {item[CubeDataset.Schools.schoolName]} */}
                                          {item[CubeDataset.Schools.schoolName] !== null &&
                                            item[CubeDataset.Schools.schoolName] !== "" ?
                                            item[CubeDataset.Schools.schoolName] : "NA"}
                                        </Box>
                                        <Box className="crm-sd-tab-schools-listitem-info">
                                          <span>Product:</span>{" "}
                                          {item[CubeDataset.Leadinterests.LearningProfileGroupedName] !== null &&
                                            item[CubeDataset.Leadinterests.LearningProfileGroupedName] !== "" ?
                                            item[CubeDataset.Leadinterests.LearningProfileGroupedName] : "NA"}
                                        </Box>
                                        <Box className="crm-sd-tab-schools-listitem-info">
                                          <span>EDC:</span>{" "}
                                          {item[CubeDataset.Leadinterests.MaxEdc]
                                            ? moment
                                              .utc(
                                                item[CubeDataset.Leadinterests.MaxEdc]
                                              )
                                              .local()
                                              .format("DD-MM-YYYY")
                                            : "NA"}
                                        </Box>
                                        <Box className="crm-sd-tab-schools-listitem-info">
                                          <span>Count of EDC:</span>{" "}
                                          {item[CubeDataset.Leadinterests.EdcCountSum] !== null &&
                                            item[CubeDataset.Leadinterests.EdcCountSum] !== "" ?
                                            item[CubeDataset.Leadinterests.EdcCountSum] : "NA"}
                                        </Box>
                                        {/* <Box className="crm-sd-tab-schools-listitem-info">
                                            <span>Expected CV:</span> NA
                                          </Box> */}
                                      </Box>
                                    </Box>
                                  ))
                                : reportSchoolList
                                  ?.slice(0, paginationLimit)
                                  ?.map((item, i) => (
                                    <Box
                                      className="crm-sd-tab-schools-listitem"
                                      key={i}
                                      onClick={() =>
                                        navigate(
                                          `/authorised/school-details/${item[CubeDataset.Schools.leadId]
                                          }`
                                        )
                                      }
                                    >
                                      <Box className="crm-sd-tab-schools-listitem-container">
                                        <Box className="crm-sd-tab-schools-listitem-name">
                                          <span>School Name:</span>{" "}
                                          {/* {item[CubeDataset.Schools.schoolName]} */}
                                          {item[CubeDataset.Schools.schoolName] !== null &&
                                            item[CubeDataset.Schools.schoolName] !== "" ?
                                            item[CubeDataset.Schools.schoolName] : "NA"}
                                        </Box>
                                        <Box className="crm-sd-tab-schools-listitem-info">
                                          <span>Product:</span>{" "}
                                          {item[CubeDataset.Leadinterests.LearningProfileGroupedName] !== null &&
                                            item[CubeDataset.Leadinterests.LearningProfileGroupedName] !== "" ?
                                            item[CubeDataset.Leadinterests.LearningProfileGroupedName] : "NA"}
                                        </Box>
                                        <Box className="crm-sd-tab-schools-listitem-info">
                                          <span>EDC:</span>{" "}
                                          {item[CubeDataset.Leadinterests.MaxEdc]
                                            ? moment
                                              .utc(
                                                item[CubeDataset.Leadinterests.MaxEdc]
                                              )
                                              .local()
                                              .format("DD-MM-YYYY")
                                            : "NA"}
                                        </Box>
                                        <Box className="crm-sd-tab-schools-listitem-info">
                                          <span>Count of EDC:</span>{" "}
                                          {item[CubeDataset.Leadinterests.EdcCountSum] !== null &&
                                            item[CubeDataset.Leadinterests.EdcCountSum] !== "" ?
                                            item[CubeDataset.Leadinterests.EdcCountSum] : "NA"}
                                        </Box>
                                        {/* <Box className="crm-sd-tab-schools-listitem-info">
                                        <span>Expected CV:</span> NA
                                      </Box> */}
                                      </Box>
                                    </Box>
                                  ))
                              }
                            </Box>
                          </Box>
                          : 
                          <div className={classes.noData}>
                            <p>No Data Available</p>
                          </div>)
                    : DisplayLoader()
                }
              </Box>
              {(schoolList?.length > paginationLimit || reportSchoolList?.length > paginationLimit) ? (
                <Box className="crm-view-more-action-schools">
                  <Button
                    className="crm-btn crm-btn-primary"
                    onClick={handleViewMore}
                  >
                    View More
                  </Button>
                </Box>
              ) : null}
            </>
          )}
        </>

        <Grid />

        <div>
          {selectUserModal && (
            <Modal
              open={true}
              aria-labelledby="modal-modal-title"
              sx={{ mt: 10 }}
            >
              <Box sx={style}>
                <Typography align="center" id="modal-modal-title">
                  <div style={{ fontWeight: 600, fontSize: 18 }}>
                    {" "}
                    Select User{" "}
                  </div>
                </Typography>
                <Typography
                  id="modal-modal-description"
                  align="center"
                  sx={{ mt: 2 }}
                >
                  <Grid
                    item
                    xs={6}
                    sm={6}
                    md={6}
                    lg={12}
                    justifyContent="flex-end"
                  >
                    <ReactSelect
                      sx={{ fontSize: "20px" }}
                      classNamePrefix="select"
                      options={rolesList}
                      getOptionLabel={(option) =>
                        option.displayName + " (" + option.roleName + ")"
                      }
                      getOptionValue={(option) => option}
                      onChange={handleFilterByRole}
                      placeholder="Filter By Role"
                      className="width-100 font-14"
                      value={selectedUser}
                    />
                  </Grid>
                </Typography>
                <Typography>
                  <Divider />
                </Typography>
                <Typography
                  id="modal-modal-description"
                  align="center"
                  sx={{ mt: 2 }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: 25,
                    }}
                  >
                    <Button
                      style={{ marginRight: "20px", borderRadius: 4 }}
                      onClick={() => {
                        setChangeOwner(false);
                        setSelectedUser("");
                        toggleSelectUserModal();
                      }}
                      variant="outlined"
                    >
                      Cancel
                    </Button>
                    <Button
                      style={{ borderRadius: 4 }}
                      onClick={handleTransfer}
                      variant="contained"
                    >
                      Transfer
                    </Button>
                  </div>
                </Typography>
              </Box>
            </Modal>
          )}
        </div>
      </Page>
    </>
  );
};

export default SchoolList;
