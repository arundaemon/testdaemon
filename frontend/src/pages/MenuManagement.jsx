import { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Alert,
  Pagination,
  Grid,
  InputAdornment,
  Modal,
  Fade,
  Box,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import toast from "react-hot-toast";
import Page from "../components/Page";
import Loader from "./Loader";
import Controls from "../components/controls/Controls";
import {
  getMenusList,
  deleteMenu,
  createMenu,
  updateMenu,
  getAllMenus,
  getAllGroupedMenu,
} from "../config/services/menus";
import { getAllProjects } from "../config/services/project";
import SearchIcon from "../assets/icons/icon_search.svg";
import { getRolesList } from "../config/services/hrmServices";
import _ from "lodash";
import { MenuTable, MenuPopup } from "../components/menuManagement";
import ReactSelect from "react-select";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "auto",
  },
  modalPaper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #fff",
    boxShadow: "0px 0px 4px #0000001A",
    minWidth: "300px",
    borderRadius: "4px",
    textAlign: "center",
  },
  modalTitle: {
    fontSize: "18px",
  },
}));

export default function MenuManagement() {
  const [openPopup, setOpenPopup] = useState(false);
  const [userTypeList, setUserTypeList] = useState([]);
  const [recordForEdit, setRecordForEdit] = useState({});
  const [userTypeTotalCount, setUserTypeListCount] = useState(0);
  const [search, setSearchValue] = useState("");
  const [sortObj] = useState({ sortKey: "createdAt", sortOrder: "-1" });
  const [loader, setLoading] = useState(false);
  const [pageNo, setPagination] = useState(1);
  const [itemsPerPage] = useState(10);
  const [deleteObj, setDeleteObj] = useState({});
  const [deletePopup, setDeletePopup] = useState(false);
  const [allMenusList, setAllMenusList] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [allProjectsList, setAllProjectsList] = useState([]);
  const [rolesList, setRoleslist] = useState([]);

  const navigate = useNavigate();
  const classes = useStyles();

  const validateAddMenu = (filledDetails) => {
    let { name, route, iconUrl, projectId } = filledDetails;

    if (!name) {
      toast.error("Fill Menu Name");
      return false;
    } else if (!route) {
      toast.error("Fill Route");
      return false;
    } else if (!projectId?.value) {
      toast.error("Select Project");
      return false;
    } else {
      return true;
    }
  };

  const addOrEdit = () => {
    if (validateAddMenu(recordForEdit)) {
      let paramsObj = { ...recordForEdit };
      if (paramsObj?._id) {
        paramsObj.menuId = paramsObj?._id;

        updateMenu(paramsObj).then((res) => {
          if (res?.result) {
            handleCloseEditPopup();
            fetchMenusList();
            // fetchAllGroupedMenusList()
            toast.success(res?.message);
          } else if (res?.data?.statusCode === 0) {
            let { errorMessage } = res?.data?.error;
            toast.error(errorMessage);
          } else {
            console.error(res);
          }
        });
      } else {
        createMenu(paramsObj)
          .then((res) => {
            if (res?.result) {
              handleCloseEditPopup();
              fetchMenusList();
              // fetchAllGroupedMenusList()
              toast.success(res?.message);
            } else if (res?.data?.statusCode === 0) {
              let { errorMessage } = res?.data?.error;
              toast.error(JSON.stringify(errorMessage));
            } else {
              console.error(res);
            }
          })
          .catch((err) => {
            console.log(err, ":::err");
          });
      }
    }
  };

  const handleOnChange = (e) => {
    let { value, name, checked } = e.target;
    let filledDetails = _.cloneDeep(recordForEdit);

    switch (name) {
      case "externalRedirection":
      case "isHrmMenu":
        filledDetails[name] = checked;
        setRecordForEdit(filledDetails);
        break;

      default:
        filledDetails[name] = value;
        setRecordForEdit(filledDetails);
        break;
    }
  };

  const handleSelectParentMenu = (newSelectValue) => {
    let filledDetails = _.cloneDeep(recordForEdit);
    filledDetails.parentMenu = newSelectValue;
    setRecordForEdit(filledDetails);
  };

  const handleSelectProject = (newSelectValue) => {
    let filledDetails = _.cloneDeep(recordForEdit);
    filledDetails.projectId = newSelectValue;
    setRecordForEdit(filledDetails);
  };

  const handleOtpVerify = () => {
    let filledDetails = _.cloneDeep(recordForEdit);
    let checked = filledDetails.otpVerify;
    filledDetails.otpVerify = !checked;
    setRecordForEdit(filledDetails);
  };

  const handleSelectMenuOrder = (newSelectValue) => {
    let { value } = newSelectValue;
    let filledDetails = _.cloneDeep(recordForEdit);
    filledDetails["menuOrderIndex"] = value;
    setRecordForEdit(filledDetails);
  };
  // console.log('recordForEdit...12', recordForEdit);

  const handleCloseEditPopup = () => {
    setOpenPopup(false);
    setRecordForEdit({});
  };

  let totalPages = Number((userTypeTotalCount / itemsPerPage).toFixed(0));
  if (totalPages * itemsPerPage < userTypeTotalCount)
    totalPages = totalPages + 1;

  const fetchMenusList = () => {
    let params = {
      pageNo: pageNo - 1,
      count: itemsPerPage,
      search,
      ...sortObj,
      rolesAllowedFilter: filteredRoles,
      projectIdFilter: filteredProjects,
    };
    setLoading(true);
    getMenusList(params)
      .then((res) => {
        console.log(res, "getTestReposne");
        setUserTypeList(res?.result);
        setUserTypeListCount(res?.totalCount);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  };

  const fetchAllMenusList = () => {
    getAllMenus()
      .then((res) => {
        if (res?.result) {
          res?.result?.map((menuObj) => {
            menuObj.label = menuObj?.name;
            menuObj.value = menuObj._id;
            return menuObj;
          });
          res.result[0] = [{ name: "None", _id: null }];
          setAllMenusList(res?.result);
        }
      })
      .catch((err) => console.error(err));
  };

  const fetchAllGroupedMenusList = () => {
    getAllGroupedMenu()
      .then((res) => {
        if (res?.result) {
          // console.log("result after fetch all grouped list", res.result);
        }
      })
      .catch((err) => console.error(err));
  };

  const fetchAllProjectsList = () => {
    getAllProjects()
      .then((res) => {
        if (res?.result) {
          res?.result?.map((menuObj) => {
            menuObj.label = menuObj?.projectName;
            menuObj.value = menuObj._id;
            return menuObj;
          });
          setAllProjectsList(res?.result);
        }
      })
      .catch((err) => console.error(err));
  };

  const fetchRolesList = () => {
    let params = { action: "role" };
    getRolesList(params).then((res) => {
      if (res?.data?.response?.data) {
        setRoleslist(res?.data?.response?.data);
      } else {
        console.error(res);
      }
    });
  };

  const openInPopup = (userTypeEdit) => {
    if (userTypeEdit && userTypeEdit?.parentMenu) {
      let { parentMenu } = userTypeEdit;
      userTypeEdit.parentMenu.label = parentMenu?.name;
      userTypeEdit.parentMenu.value = parentMenu?._id;
    }

    if (userTypeEdit && userTypeEdit?.projectId) {
      let { projectId } = userTypeEdit;
      userTypeEdit.projectId.label = projectId?.projectName;
      userTypeEdit.projectId.value = projectId?._id;
    }

    setRecordForEdit(userTypeEdit);
    setOpenPopup(true);
  };

  const deleteMenuF = (params) => {
    setDeleteObj({ menuId: params?._id, name: params?.name });
    setDeletePopup(true);
  };

  const submitDeleteMenu = () => {
    let { menuId } = deleteObj;
    deleteMenu({ menuId }).then((res) => {
      if (res?.result) {
        handleCancelDelete();
        fetchMenusList();
        toast.success(res?.message);
      } else if (res?.data?.statusCode === 0) {
        let { errorMessage } = res?.data?.error;
        toast.error(errorMessage);
      } else {
        console.error(res);
      }
    });
  };

  const handlePagination = (e, pageNumber) => {
    setPagination(pageNumber);
  };

  const handleSearch = (e) => {
    let { value } = e.target;
    setPagination(1);
    setSearchValue(value, () => setPagination(1));
  };

  const handleCancelDelete = () => {
    setDeletePopup(false);
    setDeleteObj({});
  };

  const handleAddMenu = () => {
    setOpenPopup(true);
    setRecordForEdit({});
  };

  const handleNavigation = (route) => {
    navigate(route);
  };

  const handleFilterByRole = (value) => {
    //   console.log("filter value",value)
    let filteredRolesArray = [];
    if (value?.length) {
      filteredRolesArray = value?.map((obj) => obj.role_code);
    }
    setFilteredRoles(filteredRolesArray);
  };

  const handleFilterByProjects = (value) => {
    let filteredProjectIdsArray = [];
    if (value?.length) {
      filteredProjectIdsArray = value?.map((obj) => obj.value);
      // console.log(filteredProjectIdsArray)
    }
    setFilteredProjects(filteredProjectIdsArray);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(
    () => fetchMenusList(),
    [search, sortObj, pageNo, itemsPerPage, filteredRoles, filteredProjects]
  );
  useEffect(() => {
    fetchAllProjectsList();
    fetchAllMenusList();
    fetchAllGroupedMenusList();
  }, [openPopup]);
  useEffect(() => fetchRolesList(), []);

  // console.log(filteredRoles,'..........filteredRoles')

  return (
    <>
      <Page
        title="Extramarks | User Management"
        className="main-container datasets_container"
      >
        <Container className="table_max_width">
          <Grid
            container
            alignItems="left"
            justifyContent="flex-start"
            mb={2}
            spacing={2.5}
          >
            <Grid item xs={12} sm={4} md={4} lg={4} className="datasets_header">
              <TextField
                className={`inputRounded search-input`}
                type="search"
                placeholder="Search By Menu Name"
                onChange={handleSearch}
                InputLabelProps={{ style: { ...{ top: `${-7}px` } } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <img src={SearchIcon} alt="" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={8} md={8} lg={8}>
              <Grid container justifyContent="flex-end" spacing={2.5}>
                <Grid
                  item
                  xs={6}
                  sm={6}
                  md={6}
                  lg={3}
                  display="flex"
                  justifyContent="flex-end"
                >
                  <ReactSelect
                    sx={{ fontSize: "14px" }}
                    classNamePrefix="select"
                    options={allProjectsList}
                    onChange={handleFilterByProjects}
                    placeholder="Filter By Project"
                    isMulti
                    className="width-100 font-14"
                  />
                </Grid>

                <Grid
                  item
                  xs={6}
                  sm={6}
                  md={6}
                  lg={3}
                  display="flex"
                  justifyContent="flex-end"
                >
                  <ReactSelect
                    sx={{ fontSize: "14px" }}
                    classNamePrefix="select"
                    // options={ROLES_LIST}
                    options={rolesList}
                    getOptionLabel={(option) => option.role_name}
                    getOptionValue={(option) => option.role_id}
                    onChange={handleFilterByRole}
                    placeholder="Filter By Role"
                    isMulti
                    className="width-100 font-14"
                  />
                </Grid>

                <Grid
                  item
                  xs={6}
                  sm={6}
                  md={6}
                  lg={3}
                  justifyContent="flex-end"
                >
                  <Controls.Button
                    text="Role Mapping"
                    variant="contained"
                    className="cm_ui_button"
                    onClick={() =>
                      handleNavigation("/authorised/role-management")
                    }
                  />
                </Grid>
                <Grid
                  item
                  xs={6}
                  sm={6}
                  md={6}
                  lg={3}
                  display="flex"
                  justifyContent="flex-end"
                >
                  <Controls.Button
                    text="New Menu"
                    variant="contained"
                    startIcon={<AddIcon />}
                    className="cm_ui_button"
                    onClick={() => handleAddMenu()}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          {loader && <Loader />}
          {userTypeList?.length ? (
            <MenuTable
              list={userTypeList}
              openInPopup={openInPopup}
              deleteUserType={deleteMenuF}
              pageNo={pageNo}
              itemsPerPage={itemsPerPage}
            />
          ) : (
            <Alert severity="error">No Content Available!</Alert>
          )}
        </Container>

        <div className="center cm_pagination">
          <Pagination
            count={totalPages}
            variant="outlined"
            color="primary"
            onChange={handlePagination}
            page={pageNo}
          />
        </div>
      </Page>

      <MenuPopup
        handleSelectParentMenu={handleSelectParentMenu}
        handleOnChange={handleOnChange}
        openPopup={openPopup}
        recordForEdit={recordForEdit}
        addOrEdit={addOrEdit}
        handleCloseEditPopup={handleCloseEditPopup}
        allMenusList={allMenusList}
        allProjectsList={allProjectsList}
        handleSelectProject={handleSelectProject}
        handleSelectMenuOrder={handleSelectMenuOrder}
        handleOtpVerify={handleOtpVerify}
      />

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={deletePopup}
        closeAfterTransition
      >
        <Fade in={deletePopup}>
          <Box
            className={classes.modalPaper + " modal-box modal-md"}
            id="transition-modal-title"
          >
            <Box className="modal-header p-1">
              <Typography
                variant="subtitle1"
                className={classes.modalTitle + " modal-header-title"}
              >
                {`Are you sure to delete "${deleteObj?.name}" ?`}
              </Typography>
            </Box>
            {/* <Box className="modal-content text-left"> */}
            <Box className="modal-footer text-right">
              <Button
                onClick={handleCancelDelete}
                className={" report_form_ui_btn cancel mr-2"}
                color="primary"
                variant="outlined"
              >
                {" "}
                Cancel{" "}
              </Button>
              <Button
                onClick={submitDeleteMenu}
                color="primary"
                autoFocus
                className={" report_form_ui_btn submit"}
                variant="contained"
              >
                {" "}
                Submit{" "}
              </Button>
            </Box>
            {/* </Box> */}
          </Box>
        </Fade>
      </Modal>
    </>
  );
}
