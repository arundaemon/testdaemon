import React, { useEffect, useState } from "react";
import Page from "../../components/Page";
import {
  TextField,
  InputAdornment,
  Button,
  Modal,
  Paper,
  Typography,
  ListItemText,
  MenuItem,
  Divider,
  Select,
  FormControl,
  Grid,
  Box,
  TablePagination,
  Checkbox,
} from "@mui/material";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import ReactSelect from "react-select";

import { makeStyles } from "@mui/styles";
import { getLoggedInRole } from "../../utils/utils";
import { useNavigate } from "react-router-dom";
import FilterIcon from "../../assets/image/filterIcon.svg";
import SearchIcon from "../../assets/icons/icon_search.svg";
import _ from "lodash";
import moment from "moment";
import { fetchImplementationList } from "../../config/services/implementationForm";
import { DisplayLoader } from "../../helper/Loader";
import { getAllChildRoles } from "../../config/services/hrmServices";
import { getUserData } from "../../helper/randomFunction/localStorage";
import { DecryptData, EncryptData } from "../../utils/encryptDecrypt";
import { getSchoolList } from "../../config/services/school";
import { assignedEngineer } from "../../config/services/leadassign";
import { toast } from "react-hot-toast";
import {
  getLeadInterestData,
  getReportImplementationList,
  getReportSchoolList,
} from "../../helper/DataSetFunction";

import useMediaQuery from "@mui/material/useMediaQuery";
import { ImplementationTableList } from "../../components/Implementation/ImplementationTable";
import { useStyles } from "../../css/Implementation-css";
import { ReactComponent as IconInputSearch } from "./../../assets/icons/icon-input-search-light.svg";
import { url } from "../../config/urls";
import { addAlertNotification } from "../../config/services/alertNotification";
import { getPurchaseOrderDetails } from "../../config/services/purchaseOrder";
import LeadFilter from "../../components/leadFilters/LeadFilter";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "600px !important",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};
const MenuProps = {
  anchorOrigin: {
    vertical: "bottom",
    horizontal: "left",
  },
  transformOrigin: {
    vertical: "top",
    horizontal: "left",
  },
  getContentAnchorEl: null,
  style: { position: "absolute", zIndex: 1000 },
};

const CheckSheetList = () => {
  const classes = useStyles();
  const [searchTextField, setSearchTextField] = useState("");
  const [search, setSearchValue] = useState("");
  const userRole = getLoggedInRole();
  const navigate = useNavigate();
  const [role] = useState("IMPLEMENTATION_FILTER");
  const [implementationData, setImplementationData] = useState([]);
  const [invalidSearch, setInvalidSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectUserModal, setSelectUserModal] = useState(false);
  const [changeOwner, setChangeOwner] = useState(false);
  const [selectedUser, setSelectedUser] = useState();
  const [ownerChanged, setOwnerChanged] = useState(false);
  const [schoolList, setSchoolList] = useState([]);

  const [rolesList, setRoleslist] = useState([]);
  const [roleNameList, setRoleName] = useState([]);
  const [loader, setLoader] = useState(false);

  const [pageNo, setPagination] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [lastPage, setLastPage] = useState();
  const [checkedLeads, setCheckedLeads] = useState([]);
  const [filterAnchor, setFilterAnchor] = useState(null);
  const [filters, setFilters] = useState([]);
  const [filtersApplied, setFiltersApplied] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [reportSchoolList, setReportSchoolList] = useState([]);
  const [implementationNo, setImplementationNo] = useState([]);
  const [empName, setEmpName] = useState("");
  const [empCode, setEmpCode] = useState("");
  const [rolenewName, setRolenewName] = useState("");
  const [profileName, setProfileName] = useState("");
  const [modifiedByName, setModifiedByName] = useState("");
  const [modifiedByUuid, setModifiedByUuid] = useState("");
  const [modifiedByRoleName, setModifiedByRoleName] = useState("");
  const [modifiedByProfileName, setModifiedByProfileName] = useState("");
  const [modifiedByEmpCode, setModifiedByEmpCode] = useState("");

  const [draftImpList, setDraftImpList] = useState([]);

  //const [empName,setEmpName] = useState("")
  const [uuidname] = useState(
    JSON.parse(localStorage.getItem("userData"))?.name
  );

  const [uuidid] = useState(
    JSON.parse(localStorage.getItem("userData"))?.lead_id
  );
  const [uuidrole] = useState(
    JSON.parse(localStorage.getItem("userData"))?.crm_role
  );
  const [uuidprofilename] = useState(
    JSON.parse(localStorage.getItem("userData"))?.crm_profile
  );
  const [uuidempcode] = useState(
    JSON.parse(localStorage.getItem("userData"))?.employee_code
  );

  const [openDialog, setOpenDialog] = useState(false); // Set the initial state to false
  const loginData = getUserData("loginData");

  // function doesObjectExistInArray(array, objectToFind) {
  //   return array.some(
  //     (item) => JSON.stringify(item) === JSON.stringify(objectToFind)
  //   );
  // }

  // let draftListArr = [];
  const getImplementationList = async (childRoleNames) => {
    try {
      if (isLoading) {
        return;
      }
      let params = { pageNo: pageNo - 1, count: itemsPerPage, search };
      setLastPage(false);
      setIsLoading(true);
      // let poCodeArr = [];

      let res = await fetchImplementationList(params);
      // let impList = res?.result;

      // const draftData = impList.filter((obj) => obj.status === "Draft");

      // draftData.map((obj) => {
      //   if (!poCodeArr.includes(obj.purchaseOrderCode)) {
      //     poCodeArr.push(obj.purchaseOrderCode);
      //   }
      // });

      // for (let i = 0; i < poCodeArr.length; i++) {
      //   let dataImp = await getPurchaseOrderDetails(poCodeArr[i]);
      //   dataImp = dataImp?.result;
      //   for (let j = 0; j < draftData.length; j++) {
      //     if (
      //       draftData[j].purchaseOrderCode === dataImp.purchaseOrderCode &&
      //       !doesObjectExistInArray(draftListArr, draftData[j])
      //     ) {
      //       draftListArr.push({
      //         ...draftData[j],
      //         validity: dataImp.agreementEndDate.slice(0, 10),
      //       });
      //     }
      //   }
      // }
      // setDraftImpList(draftListArr);

      if (res && res.result) {
        // let impObj = {};
        // res?.result?.map((obj) => {
        //   if (obj.purchaseOrderCode in impObj) {
        //     impObj[obj.purchaseOrderCode]?.push(obj);
        //   } else {
        //     impObj[obj.purchaseOrderCode] = [{ ...obj }];
        //   }
        // });
        setImplementationData(res.result);
      }
      if (res.result.length < itemsPerPage) setLastPage(true);
    } catch (error) {
      setLastPage(true);
      console.error("An error occurred:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReportImplementationList = async (childRoleNames) => {
    try {
      let params = {
        pageNo,
        itemsPerPage,
        search,
        filtersApplied,
        childRoleNames,
      };
      setLastPage(false);
      setIsLoading(true);
      let res = await getReportImplementationList(params);
      let data = res?.loadResponses?.[0]?.data;
      let formattedData = await formatReportData(data);
      setImplementationData(formattedData);
      setIsLoading(false);
      if (data?.length < itemsPerPage) setLastPage(true);
    } catch (err) {
      setLastPage(true);
      console.error(
        err,
        "Error while fetching implementation data from report engine"
      );
      setIsLoading(false);
    }
  };

  const formatReportData = async (data) => {
    let convertedArray = await data.map((item) => {
      let convertedItem = {};
      for (let key in item) {
        let newKey = key.replace("Implementationforms.", "");
        if (newKey === "productDetails") {
          convertedItem[newKey] = JSON.parse(item[key]);
        } else convertedItem[newKey] = item[key];
      }
      return convertedItem;
    });
    return convertedArray;
  };

  // useEffect(async () => {
  //   await getImplementationList();
  // }, [pageNo, itemsPerPage, search, rowsPerPage]);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

  const getLeadData = (data) => {
    setCheckedLeads(data);
  };

  const handleSearchField = (e) => {
    let { value } = e.target;
    setSearchTextField(value);
  };

  const getImplementationLeads = async () => {
    if (localStorage?.getItem("childRoles")) {
      let childRoleNames = DecryptData(localStorage?.getItem("childRoles"));
      setRoleslist(childRoleNames);
      childRoleNames = childRoleNames?.map((roleObj) => roleObj?.roleName);
      childRoleNames.push(userRole);
      setRoleName(childRoleNames);
      fetchCrmList(childRoleNames);
    } else {
      getUserChildRoles();
    }
  };

  const handleFilter = (e) => {
    setFilterAnchor(e.currentTarget);
  };

  const applyFilters = () => {
    if (filters.find((fltObj) => fltObj?.label === "Select Filter")) {
      toast.error("Select Valid Filter");
      return;
    }
    let filtersCopy = _.cloneDeep(filters);
    localStorage.setItem("implementationFilters", EncryptData(filtersCopy));
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
    if (filters[0]?.label === "Select Filter") {
      filtersCopy?.splice(filterIndex, 1);
      setFilters(filtersCopy);
    } else {
      filtersCopy?.splice(filterIndex, 1);
      setFilters(filtersCopy);
      setFiltersApplied(filtersCopy);
    }
    setCheckedLeads([]);
    localStorage.setItem("implementationFilters", EncryptData(filtersCopy));
    if (filtersCopy?.length == 0) {
      localStorage.removeItem("implementationFilters");
    }
  };

  const removeAllFilters = () => {
    setFilters([]);
    setFiltersApplied([]);
    localStorage.removeItem("implementationFilters");
  };

  const toggleSelectUserModal = () => {
    setSelectUserModal(!selectUserModal);
  };

  const toggleChangeOwnerModal = () => {
    setSelectUserModal(!selectUserModal);
  };

  const handleFilterByRole = (value) => {
    setSelectedUser(value, () => {
      setEmpName(value?.displayName);
      setEmpCode(value?.profileCode);
      setRolenewName(value?.roleName);
      setProfileName(value?.profileDisplayName);
    });
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
        fetchCrmList(childRoleNames);
        localStorage.setItem("childRoles", EncryptData(all_child_roles ?? []));
      })
      .catch((err) => {
        console.log(err, "error");
      });
  };
  const fetchCrmList = (data) => {
    let queryData = {
      search,
      count: itemsPerPage,
      pageNo: pageNo - 1,
      childRoleNames: data ? data : roleNameList,
      sortKey: "createdAt",
      sortOrder: "-1",
    };
    getImplementationList(queryData);
  };

  const handleSearch = _.debounce((value) => {
    if (value.trim() !== "") {
      // setPagination(1);
      setSearchValue(value);
      setInvalidSearch(false); // Reset invalidSearch when there is a search term
    } else {
      setSearchValue("");
      setInvalidSearch(true); // Set invalidSearch to true when the input is empty
    }
  }, 500);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleAssignEngineer = () => {
    handleCloseDialog();
  };

  const handlePagination = (e, pageNumber) => {
    setPagination(pageNumber);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPagination(1);
    setItemsPerPage(event.target.value);
  };

  useEffect(() => {
    const applyFilter = DecryptData(
      localStorage?.getItem("implementationFilters")
    );
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
    const applyFilter = DecryptData(
      localStorage?.getItem("implementationFilters")
    );
    let childRoleNames = DecryptData(localStorage?.getItem("childRoles"));
    setRoleslist(childRoleNames);
    childRoleNames = childRoleNames?.map((roleObj) => roleObj?.roleName);
    childRoleNames.push(userRole);
    setRoleName(childRoleNames);
    if (applyFilter === null) {
      getImplementationList(childRoleNames);
    } else if (filtersApplied?.length > 0) {
      fetchReportImplementationList(childRoleNames);
    }
  }, [pageNo, search, rowsPerPage, filtersApplied, ownerChanged]);

  const assignEngineer = async () => {
    try {
      let params = {
        impFormCodeList: implementationNo,
        assignedEngineerName: (selectedUser?.displayName).toString(),
        assignedEngineerEmpCode: (selectedUser?.userName).toString(),
        assignedEngineerRoleName: (selectedUser?.roleName).toString(),
        assignedEngineerProfileName: (selectedUser?.profileName).toString(),
        modifiedByName: getUserData("userData")?.name,
        modifiedByRoleName: getUserData("userData")?.crm_role,
        modifiedByProfileName: getUserData("userData")?.crm_profile,
        modifiedByEmpCode: getUserData("userData")?.employee_code,
        modifiedByUuid: getUserData("loginData")?.uuid,
      };

      let notifyParams = implementationNo?.map((obj) => {
        let impFormNumber = obj;
        let productTitle = implementationData
          ?.find((obj) => obj?.impFormNumber === impFormNumber)
          ?.productDetails?.map((obj) => obj?.productName);

        let uniqueSet = new Set(productTitle);
        let uniqueProductArray = Array.from(uniqueSet);

        return {
          title: uniqueProductArray?.map((obj) => obj)?.join(", "),
          description: `This implementation (${impFormNumber}) has  Assigned to ${(selectedUser?.displayName).toString()} `,
          redirectLink: `/authorised/site-survey-activity/${impFormNumber}`,
          empCode: [selectedUser?.userName],
          notificationDate: moment().format("YYYY-MM-DD"),
        };
      });

      let res = await assignedEngineer(params);
      if (res?.result?.length) {
        let responseNotify = await addAlertNotification(notifyParams);
        if (responseNotify?.data?.statusCode === 0) {
          toast.error("Network Error");
          return;
        }
        toast.success("Engineer Assigned Successfully");
        setOwnerChanged(true);
        setSelectedUser("");
        // Close the
        toggleSelectUserModal();
        setImplementationNo([]);

        // Refresh the implementation list
        // getImplementationList(roleNameList);
      }
    } catch (error) {
      console.error(error, "...error");
      toast.error("Error assigning lead");
    }
  };

  const getSelectedItem = (item) => {
    setImplementationNo(item);
  };

  return (
    <Page
      title="Extramarks | Quotation Table"
      className="main-container myLeadPage datasets_container"
    >
      <div className="tableCardContainer">
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
        </div>
        <div className={classes.btnApproval}>
          {implementationNo.length > 0 && (
            <Button
              className={classes.submitBtn}
              onClick={() => {
                toggleChangeOwnerModal();
              }}
            >
              Assign Engineer
            </Button>
          )}
        </div>

        {!isLoading ? (
          implementationData.length ? (
            <>
              <ImplementationTableList
                data={implementationData}
                getSelectedItem={getSelectedItem}
                // draftImpList={draftImpList}
              />
            </>
          ) : (
            <>
              <div className={classes.noData}>
                <p>{"No Data Available"}</p>
              </div>
            </>
          )
        ) : (
          <div className={classes.loader}>{DisplayLoader()}</div>
        )}
      </div>

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
            disabled: pageNo === 1,
          }}
          nextIconButtonProps={{
            disabled: lastPage,
          }}
        />
      </div>

      <Modal
        open={selectUserModal} // Control the modal open/close state
        aria-labelledby="modal-modal-title"
        sx={{ mt: 10 }}
      >
        <Box sx={style}>
          <Typography align="center" id="modal-modal-title">
            <div style={{ fontWeight: 600, fontSize: 18 }}>
              {" "}
              Select Service Engineer{" "}
            </div>
          </Typography>
          <Typography
            id="modal-modal-description"
            align="center"
            sx={{ mt: 2 }}
          >
            <Grid item xs={6} sm={6} md={6} lg={12} justifyContent="flex-end">
              <ReactSelect
                sx={{ fontSize: "20px" }}
                classNamePrefix="select"
                options={rolesList}
                getOptionLabel={(option) =>
                  option.displayName + " (" + option.roleName + ")"
                }
                getOptionValue={(option) => option}
                onChange={handleFilterByRole}
                placeholder="Select"
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
                onClick={() => assignEngineer()}
                variant="contained"
              >
                Assign Engineer
              </Button>
            </div>
          </Typography>
        </Box>
      </Modal>
    </Page>
  );
};

export default CheckSheetList;
