import React, { useEffect, useCallback } from "react";
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
  Modal,
  Box,
  Typography,
  MenuItem,
  Select,
} from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import SearchIcon from "../../assets/icons/icon_search.svg";
import { getConfigDetails } from "../../config/services/config";
import { makeStyles } from "@mui/styles";
import Revenue from "../../components/MyLeads/Revenue";
import Slider from "../../components/MyLeads/Slider";
import FilterIcon from "../../assets/image/filterIcon.svg";
import { leadAssignmentData } from "../../helper/DataSetFunction";
import _debounce from "lodash/debounce";
import _ from "lodash";
import AssignTrialModal from "./AssignTrialModal";
import { DisplayLoader } from "../../helper/Loader";
import settings from "../../config/settings";
import LeadAssignmentTable from "./LeadAssignmentTable";
import LeadFilter from "../../components/leadFilters/LeadFilter";
import ReactSelect from "react-select";
import toast from "react-hot-toast";
import {
  assignMyLeads,
  getLeadAssignList,
} from "../../config/services/leadassign";
import { useNavigate } from "react-router-dom";
import { getAllChildRoles } from "../../config/services/hrmServices";
import { getLoggedInRole } from "../../utils/utils";
import LeadCard from "./LeadCard";
import CubeDataset from "../../config/interface";
import RefurbishLeadsModal from "./RefurbishLeadsModal";

import LeadFilterMweb from "../leadFilterMweb/LeadFilterMweb";
import { DecryptData, EncryptData } from "../../utils/encryptDecrypt";

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

const LeadAssignment = () => {
  const classes = useStyles();
  const user = settings.ONLINE_LEADS;
  const [empCode] = useState(
    JSON.parse(localStorage.getItem("userData"))?.employee_code
  );
  const [assignModal, setAssignModal] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState("180");
  const [selectedClass, setSelectedClass] = useState("1582621");
  const [selectedProduct, setSelectedProduct] = useState("154");
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [batchDate, setBatchDate] = useState(null);
  const [formattedReqBody, setFormattedReqBody] = useState(null);
  const [leadList, setLeadList] = useState([]);
  const [pageNo, setPagination] = useState(1);
  const [cycleTotalCount, setCycleTotalCount] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [leadSize, setLeadSize] = useState(false);
  const [search, setSearchValue] = useState("");
  const [searchTextField, setSearchTextField] = useState("");
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [changeOwner, setChangeOwner] = useState(false);
  const [owner, setOwner] = useState(1);
  const [loader, setLoader] = useState(false);
  const [configDetails, setConfigDetails] = useState({});
  const userRole = getLoggedInRole();
  const [filterAnchor, setFilterAnchor] = useState(null);
  const [filters, setFilters] = useState([]);
  const [filtersApplied, setFiltersApplied] = useState([]);
  const [selectUserModal, setSelectUserModal] = useState(false);
  const [refurbishModal, setRefurbishModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState();
  const [rolesList, setRoleslist] = useState([]);
  const [activeAction, setActiveAction] = useState("");
  const [checkedLeads, setCheckedLeads] = useState([]);
  const [dataSetIndex, setDataSetIndex] = useState(CubeDataset.Leadassigns);
  const [sortObj, setSortObj] = useState({
    sortKey: CubeDataset.Leadassigns.updatedAt,
    sortOrder: "-1",
  });
  const [ownerChanged, setOwnerChanged] = useState(false);

  const navigate = useNavigate();

  let selectedRole = useSelector(
    (state) => state?.ChildRolesReducer?.selectedRoles
  );

  let totalPages = Number((cycleTotalCount / itemsPerPage).toFixed(0));
  if (totalPages * itemsPerPage < cycleTotalCount) totalPages = totalPages + 1;

  const handlePagination = (e, pageNumber) => {
    setCheckedLeads([]);
    setPagination(pageNumber);
    //fetchCrmLeadAssignmentList([...rolesList, userRole])
  };

  const handleChangeRowsPerPage = (event) => {
    setCheckedLeads([]);
    setLoader(!loader);
    setRowsPerPage(parseInt(event.target.value, 10));
    setPagination(1);
    setItemsPerPage(event.target.value);
  };

  const toggleSelectUserModal = () => {
    setSelectUserModal(!selectUserModal);
  };

  const toggleChangeOwnerModal = () => {
    setSelectUserModal(!selectUserModal);
  };

  const handleRefurbishModal = () => {
    const filterData = selectedLeads
      .filter((item) => {
        if (
          item["Leadassigns.stageName"] === "Order" ||
          item["Leadassigns.stageName"] === "Payment"
        ) {
          return true;
        }
      })
      .map((item) => {
        return item["Leadassigns.name"];
      });
    if (selectedLeads.length === 0) {
      toast.error("Please Select leads to refurbish");
      return;
    }
    if (filterData.length !== 0) {
      const leadNames = filterData.join(", ");
      toast.error(
        `You can not refurbish leads with stage Order and Payment. Please de-select leads - ${leadNames}`
      );
      //setCheckedLeads([])
    } else {
      setRefurbishModal(!refurbishModal);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    let { value } = e.target;
    setPagination(1);
    setSearchValue(searchTextField);
  };

  const handleSearchField = (e) => {
    let { value } = e.target;
    setSearchTextField(value);
  };

  const addList = async () => {
    let modifiedData = checkedLeads?.map((item) => {
      item.leadId = item?.[dataSetIndex.leadId];
      item.name = item?.[dataSetIndex.name];
      item.displayName = item?.[dataSetIndex.displayName];

      delete item?.[dataSetIndex.Id];
      delete item?.[dataSetIndex.assignedToRoleName];
      delete item?.[dataSetIndex.assignedToDisplayName];
      delete item?.[dataSetIndex.sourceName];
      delete item?.[dataSetIndex.subSourceName];
      delete item?.[dataSetIndex.updatedAt];
      delete item?.[dataSetIndex.mobile];
      delete item?.[dataSetIndex.email];
      delete item?.[dataSetIndex.createdAt];
      delete item?.[dataSetIndex.city];
      delete item?.[dataSetIndex.name];
      delete item?.[dataSetIndex.leadId];

      return item;
    });

    const sampleData = { leadsData: modifiedData, roleData: selectedUser };
    setCheckedLeads([]);
    setOwnerChanged(false);
    assignMyLeads(sampleData)
      .then((res) => {
        if (res?.result) {
          toast.success(res?.message);
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

  const handleCheckedData = (data) => {
    setCheckedLeads(data);
  };

  const handleTransfer = () => {
    addList();
    toggleSelectUserModal();
    navigate("/authorised/lead-assignment");
    setSelectedUser("");
  };

  //get all child roles
  const fetchAllChildRoles = () => {
    if (rolesList.length === 0) {
      //let role_name = getLoggedInRole()
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
          fetchCrmLeadAssignmentList(childRoleNames);
          localStorage.setItem(
            "childRoles",
            EncryptData(all_child_roles ?? [])
          );
        })
        .catch((err) => {
          console.log(err, "error");
        });
    } else {
      fetchCrmLeadAssignmentList([...rolesList, userRole]);
    }
  };

  //when filter is applied
  const fetchCubeLeadAssignmentList = () => {
    if (filtersApplied?.length > 0) {
      setDataSetIndex(CubeDataset.LeadassignsBq);
      sortObj.sortKey =
        CubeDataset.LeadassignsBq[sortObj.sortKey.split(".")[1]];
      let queryData = {
        userRole,
        search,
        itemsPerPage,
        pageNo,
        sortObj,
        filtersApplied,
        childRoles: rolesList,
      };
      setLoader(false);
      setLeadSize(false);
      leadAssignmentData(queryData)
        .then((res) => {
          let data = res?.loadResponses[0]?.data;
          setLeadList(data);

          if (data?.length > 0) {
            setLeadSize(true);
          } else {
            setLeadSize(false);
          }
          setLoader(true);
        })
        .catch((err) => {
          console.log(err, "error");
          setLoader(true);
          setLeadSize(false);
        });
    }
  };
  //when filter is not applied
  const fetchCrmLeadAssignmentList = (roleList) => {
    setDataSetIndex(CubeDataset.Leadassigns);
    sortObj.sortKey = CubeDataset.Leadassigns[sortObj.sortKey.split(".")[1]];
    const applyFilter = DecryptData(localStorage?.getItem("filtersCopy"));

    if (
      filtersApplied?.length === 0 &&
      (applyFilter?.length === 0 || !applyFilter)
    ) {
      setLoader(false);
      setLeadSize(false);
      if (settings.ADMIN_ROLES.indexOf(userRole) >= 0) {
        roleList = [];
      }
      let queryData = {
        search,
        itemsPerPage,
        pageNo: pageNo - 1,
        filtersApplied,
        childRoleNames: roleList,
        ...sortObj,
      };
      getLeadAssignList(queryData)
        .then((res) => {
          let data = res?.result;
          let totalCount = res?.totalCount;
          setLeadList(data);
          setCycleTotalCount(totalCount);

          if (data?.length > 0) {
            setLeadSize(true);
          } else {
            setLeadSize(false);
          }
          setLoader(true);
        })
        .catch((err) => {
          console.log(err, "error");
          setLoader(true);
          setLeadSize(false);
        });
    }
  };

  const handleFilterByRole = (value) => {
    setSelectedUser(value);
  };

  const getRowIds = (data) => {
    setSelectedLeads(data);
  };

  const getConfigs = () => {
    getConfigDetails().then((res) => {
      setConfigDetails(res?.data?.[0]);
    });
  };

  const handleSort = (key) => {
    if (filtersApplied?.length > 0) {
      sortObj.sortKey = dataSetIndex[key];
      if (sortObj.sortOrder === -1 || sortObj.sortOrder === 1)
        sortObj.sortOrder = "desc";
      let newOrder = sortObj?.sortOrder === "desc" ? "asc" : "desc";
      setSortObj({ sortKey: key, sortOrder: newOrder });
    } else {
      let newOrder = sortObj?.sortOrder === "1" ? "-1" : "1";
      setSortObj({ sortKey: key, sortOrder: newOrder });
    }
  };

  let trialLeadReqBody = {
    empcode: empCode,
    action: configDetails?.my_leads_action,
    apikey: configDetails?.my_leads_api_key,
    trial_activation_request: formattedReqBody,
  };

  const handleFilter = (e) => {
    setFilterAnchor(e.currentTarget);
  };

  const applyFilters = () => {
    if (filters.find((fltObj) => fltObj?.label === "Select Filter")) {
      toast.error("Select Valid Filter");
      return;
    }
    sortObj.sortKey = dataSetIndex.updatedAt;
    sortObj.sortOrder = "desc";
    let filtersCopy = _.cloneDeep(filters);
    localStorage.setItem("filtersCopy", EncryptData(filtersCopy));
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
    setCheckedLeads([]);
    localStorage.setItem("filtersCopy", EncryptData(filtersCopy));
    if (filtersCopy?.length == 0) {
      sortObj.sortKey = dataSetIndex.updatedAt;
      sortObj.sortOrder = -1;
      localStorage.removeItem("filtersCopy");
    }
  };

  const removeAllFilters = () => {
    sortObj.sortKey = dataSetIndex.updatedAt;
    sortObj.sortOrder = -1;
    setFilters([]);
    setFiltersApplied([]);
    setCheckedLeads([]);
    localStorage.removeItem("filtersCopy");
  };

  const reRenderLeadList = () => {
    if (rolesList) {
      let childRoleNames = rolesList
        ? rolesList?.map((roleObj) => roleObj?.roleName)
        : [];
      childRoleNames.push(userRole);
      fetchCrmLeadAssignmentList(childRoleNames);
    }
  };

  useEffect(() => {
    //getConfigs()
    let childRoles = localStorage.getItem("childRoles");
    if (filtersApplied.length === 0 && !childRoles) {
      fetchAllChildRoles();
    } else {
      let roles = DecryptData(childRoles);
      setRoleslist(roles);
    }
  }, []);
  useEffect(() => {
    let childRoles = localStorage.getItem("childRoles");
    if (filtersApplied?.length > 0) {
      sortObj.sortKey = dataSetIndex.updatedAt;
      sortObj.sortOrder = "desc";
      fetchCubeLeadAssignmentList();
    } else if (childRoles && filtersApplied?.length === 0) {
      let roles = DecryptData(childRoles);
      let childRoleNames = roles?.map((roleObj) => roleObj?.roleName);
      childRoleNames.push(userRole);
      fetchCrmLeadAssignmentList(childRoleNames);
    }
  }, [search, sortObj, pageNo, itemsPerPage, filtersApplied, ownerChanged]);

  useEffect(() => {
    let selectedLeadsFormattedData = [];
    selectedLeads?.forEach((element) => {
      selectedLeadsFormattedData.push({
        uuid: "d6c66aff-dd04-4308-8780-da0b5669e113",
        email: element?.email,
        mobile: element?.phoneNumber,
        name: element?.name,
        board_id: selectedBoard,
        syllabus_id: selectedClass,
        product_id: selectedProduct,
        city: element?.city,
        state: element?.state,
        batch_id: batchDate,
        freetrail_approval: "No",
      });
    });
    setFormattedReqBody(selectedLeadsFormattedData);
  }, [selectedLeads]);

  useEffect(() => {
    const applyFilter = DecryptData(localStorage?.getItem("filtersCopy"));
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
    if (selectedRole) {
      fetchCrmLeadAssignmentList([selectedRole]);
    }
  }, [selectedRole]);

  return (
    <>
      <Page
        title="Extramarks | Lead Assignment"
        className="main-container myLeadPage datasets_container"
      >
        <Container className="table_max_width">
          <Grid container spacing={2} sx={{ mt: "0px", mb: "16px" }}>
            <Grid item xs={12} lg={6}>
              <Grid className={`${classes.cusCard} ${classes.RevenueCard}`}>
                <Revenue />
              </Grid>
            </Grid>
            <Grid item xs={12} lg={6}>
              <Grid className={`${classes.cusCard} ${classes.RevenueCard}`}>
                <Slider />
              </Grid>
            </Grid>
          </Grid>
        </Container>
        <div className="tableCardContainer">
          <Paper>
            <div className="mainContainer">
              <div className="left">
                <h3>My Leads</h3>
              </div>
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

                {checkedLeads.length > 0 && (
                  <>
                    <Button
                      className={classes.submitBtn}
                      onClick={() => setAssignModal(!assignModal)}
                    >
                      Bulk Trial
                    </Button>
                    <AssignTrialModal
                      assignModal={assignModal}
                      setAssignModal={setAssignModal}
                      // name={profileData?.name}
                      isBulk={true}
                      bulkLeads={selectedLeads}
                    />
                  </>
                )}

                {checkedLeads.length > 0 && rolesList.length !== 0 && (
                  <Button
                    className={classes.submitBtn}
                    onClick={() => {
                      toggleChangeOwnerModal();
                    }}
                  >
                    Change Owner
                  </Button>
                )}
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
                {/* <div
                                    style={{
                                        marginLeft: "10px",
                                        border: "1px solid #DEDEDE",
                                        padding: 7,
                                        borderRadius: 4,
                                    }}
                                >
                                    <img
                                        style={{ width: 33, height: 22 }}
                                        src={IconSettings}
                                        alt=""
                                    />
                                </div> */}
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
                  <div style={{ marginTop: "15px" }}>
                    <Button
                      className={classes.submitBtn}
                      onClick={() => handleRefurbishModal()}
                    >
                      Refurbish
                    </Button>
                  </div>
                </div>
                {checkedLeads?.length > 0 ? (
                  <div style={{ width: "100%", textAlign: "right" }}>
                    <p style={{ fontSize: "14px", color: "#000" }}>
                      Total No.of Count :{" "}
                      {checkedLeads?.length < 10
                        ? `0${checkedLeads?.length}`
                        : checkedLeads?.length}
                    </p>
                  </div>
                ) : (
                  ""
                )}
              </div>

              <RefurbishLeadsModal
                reRenderLeadList={reRenderLeadList}
                selectedLeads={selectedLeads}
                setCheckedLeads={setCheckedLeads}
                setSelectedLeads={setSelectedLeads}
                refurbishModal={refurbishModal}
                setRefurbishModal={setRefurbishModal}
              />
              {/* <span>
                                    <div className="filterContainer mt-1">
                                        <LeadFilterMweb />
                                    </div>
                                </span> */}
              <Select
                className={classes.cusSelect}
                defaultValue="none"
                sx={{
                  height: 39,
                }}
                onChange={(e) => setActiveAction(e.target.value)}
              >
                <MenuItem value="none" selected={activeAction == "none"}>
                  Select Action
                </MenuItem>
                {selectedLeads.length > 0 && (
                  <MenuItem
                    value="bulk-trial"
                    selected={activeAction == "bulk-trial"}
                    onClick={() => setAssignModal(!assignModal)}
                  >
                    Bulk Trial
                  </MenuItem>
                )}
                {selectedLeads.length > 0 && (
                  <MenuItem
                    value="change-owner"
                    selected={activeAction == "change-owner"}
                    onClick={() => {
                      toggleChangeOwnerModal();
                      setOwner(-1);
                    }}
                  >
                    Change Owner
                  </MenuItem>
                )}
              </Select>
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
            />

            {loader && leadSize && (
              <>
                {window.innerWidth >= 1024 ? (
                  <Box>
                    <LeadAssignmentTable
                      filtersApplied={filtersApplied}
                      getRowIds={getRowIds}
                      pageNo={pageNo}
                      itemsPerPage={itemsPerPage}
                      list={leadList}
                      handleSort={handleSort}
                      sortObj={sortObj}
                      rolesList={rolesList}
                      handleCheckedData={handleCheckedData}
                      checkedLeads={checkedLeads}
                    />
                  </Box>
                ) : (
                  <Box>
                    <LeadCard
                      filtersApplied={filtersApplied}
                      getRowIds={getRowIds}
                      pageNo={pageNo}
                      itemsPerPage={itemsPerPage}
                      list={leadList}
                      handleSort={handleSort}
                      sortObj={sortObj}
                      isMyLeadPage={true}
                    />
                  </Box>
                )}

                {/* <Box display={{ xs: "none", sm: "block" }}>
                                <LeadAssignmentTable
                                    filtersApplied={filtersApplied}
                                    getRowIds={getRowIds}
                                    pageNo={pageNo}
                                    itemsPerPage={itemsPerPage}
                                    list={leadList}
                                    handleSort={handleSort}
                                    sortObj={sortObj}
                                    rolesList={rolesList}
                                />
                            </Box>
                            <Box display={{ xs: "block", sm: "none" }}>
                                <LeadCard
                                    filtersApplied={filtersApplied}
                                    getRowIds={getRowIds}
                                    pageNo={pageNo}
                                    itemsPerPage={itemsPerPage}
                                    list={leadList}
                                    handleSort={handleSort} sortObj={sortObj}
                                    isMyLeadPage={true}
                                />
                            </Box> */}
              </>
            )}
            {!loader && (
              <div
                style={{
                  height: "50vh",
                  width: "90vw",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "red",
                }}
              >
                {DisplayLoader()}
              </div>
            )}
            {loader && !leadSize && (
              <div
                style={{
                  height: "50vh",
                  width: "90vw",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontWeight: 600,
                  fontSize: 18,
                }}
              >
                <p>No Data Available</p>
              </div>
            )}

            {loader && (
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
                />
              </div>
            )}
          </Paper>
        </div>
        <Grid />
      </Page>
    </>
  );
};
export default LeadAssignment;
