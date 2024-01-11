import React, { useEffect, useCallback } from 'react'
import Page from "../components/Page";
import LeadTable from '../components/MyLeads/LeadTable';
import LeadCard from '../components/MyLeads/LeadCard';
import {
  Container, Button, Grid, Divider, FormControl, Typography, RadioGroup, Box, Radio, Modal, FormControlLabel,
  TextField, InputAdornment, Pagination, Grow, Paper, TablePagination, Menu, MenuItem, MenuList, Select
} from "@mui/material";
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { getRolesList } from '../config/services/hrmServices';
import ReactSelect from 'react-select';
import SearchIcon from '../assets/icons/icon_search.svg';
import { leadassign } from '../config/services/leadassign'
import { getConfigDetails } from '../config/services/config';
import { makeStyles } from '@mui/styles';
import Revenue from "../components/MyLeads/Revenue";
import Slider from "../components/MyLeads/Slider";
import FilterIcon from "../assets/image/filterIcon.svg"
import { LeadData } from '../helper/DataSetFunction';
import _debounce from 'lodash/debounce';
import _ from 'lodash';
import AssignTrialModal from '../components/MyLeads/AssignTrialModal';
import { DisplayLoader } from '../helper/Loader';
import settings from '../config/settings';
import LeadFilter from '../components/leadFilters/LeadFilter';
import LeadFilterMweb from '../components/leadFilterMweb/LeadFilterMweb';
import CubeDataset from "../config/interface"

const useStyles = makeStyles((theme) => ({
  cusCard: {
    padding: "2px",
    boxShadow: "0px 0px 8px #00000029",
    borderRadius: "8px",
  },
  RevenueCard: {
    padding: "0px",
    overflow: "hidden",
    [theme.breakpoints.up('md')]: {
      height: "134px",
    },
  },
  submitBtn: {
    fontWeight: "400 !important",
    backgroundColor: "#f45e29",
    border: "1px solid #f45e29",
    borderRadius: "4px !important",
    color: "#ffffff !important",
    padding: "6px 16px !important",
    marginLeft: "10px",
    minWidth: "6rem !important",
    "&:hover": {
      color: "#f45e29 !important",
    },
    [theme.breakpoints.down('md')]: {
      display: "none"
    },
  },
  filterSection: {
    display: "flex",
    alignItems: "center",
  },
  cusSelect: {
    width: "100%",
    fontSize: "14px",
    marginLeft: "1rem",
    borderRadius: "4px",
    [theme.breakpoints.up('md')]: {
      display: "none"
    },
  },
  mbForMob: {
    [theme.breakpoints.down('md')]: {
      marginBottom: "1rem",
    }
  }
}));

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '1px solid #fff',
  boxShadow: '0px 0px 4px #0000001A',
  p: 4,
  borderRadius: '4px',
};

const MyLeads = () => {
  const classes = useStyles();
  const user = settings.ONLINE_LEADS
  const [empCode] = useState(JSON.parse(localStorage.getItem("userData"))?.employee_code);
  const [assignModal, setAssignModal] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState("180");
  const [selectedClass, setSelectedClass] = useState("1582621");
  const [selectedProduct, setSelectedProduct] = useState("154");
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [batchDate, setBatchDate] = useState(null);
  const [formattedReqBody, setFormattedReqBody] = useState(null);
  const [leadList, setLeadList] = useState([])
  const [changeOwner, setChangeOwner] = useState(false)
  const [selectUserModal, setSelectUserModal] = useState(false)
  const [owner, setOwner] = useState()
  const navigate = useNavigate();
  const [filteredRoles, setFilteredRoles] = useState([])
  const [rolesList, setRoleslist] = useState([]);
  const [pageNo, setPagination] = useState(1)
  const [cycleTotalCount, setCycleTotalCount] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [search, setSearchValue] = useState('')
  const [sortObj, setSortObj] = useState({ sortLeadKey: CubeDataset.Leads.createdAt, sortUserKey: CubeDataset.OnlineLeads.createTime, sortOrder: 'asc' })
  const [selectedUser, setSelectedUser] = useState()
  const [selectedLeads, setSelectedLeads] = useState([])
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [loader, setLoader] = useState(false)
  const debounceFn = useCallback(_debounce(handleDebounceFn, 4000), []);
  const [configDetails, setConfigDetails] = useState({})
  const [filterAnchor, setFilterAnchor] = useState(null);
  const [filters, setFilters] = useState([]);
  const [filtersApplied, setFiltersApplied] = useState([]);
  const [leadSize, setLeadSize] = useState(false)
  const [activeAction, setActiveAction] = useState("")


  const toggleChangeOwnerModal = () => {
    setChangeOwner(!changeOwner)
  }
  const toggleSelectUserModal = () => {
    setSelectUserModal(!selectUserModal)
  }

  const handlePagination = (e, pageNumber) => {
    setPagination(pageNumber)
  }

  const handleChangeRowsPerPage = (event) => {
    setLoader(!loader)
    setRowsPerPage(parseInt(event.target.value, 10));
    setPagination(pageNo);
    setItemsPerPage(event.target.value)
  };

  let totalPages = Number((cycleTotalCount / itemsPerPage).toFixed(0))
  if ((totalPages * itemsPerPage) < cycleTotalCount)
    totalPages = totalPages + 1;

  const handleSearch = (e) => {
    let { value } = e.target
    setPagination(1)
    setSearchValue(value, () => setPagination(1))
    debounceFn(e.target.value);
  }

  function handleDebounceFn(inputValue) {
    LeadData(itemsPerPage, inputValue, pageNo, sortObj)
  }

  const handleSubmit = () => {
    if (owner === -1) {
      toast.error('Select owner')
      return false
    }
    toggleChangeOwnerModal()
    toggleSelectUserModal()
  }

  const handleOwner = (e) => {
    let { value } = e.target;
    if (value === 'single') {
      setOwner(1)
    }
    else {
      setOwner(0)
    }
  }

  const fetchLeadList = () => {
    setLoader(false)
    LeadData(itemsPerPage, search, pageNo, sortObj, filtersApplied)
      .then((res) => {
        let leadList = res?.loadResponses[0]?.data
        let userList = res?.loadResponses[1]?.data;
        const list = _.merge(leadList, userList)
        setLeadList(list)
        if (list.length > 0) {
          setLoader(true)
          setLeadSize(true)
        }
      })
      .catch((err) => {
        console.log(err, 'error')
      })
  }

  const fetchRolesList = () => {
    let params = { action: "role" }
    getRolesList(params)
      .then(res => {
        if (res?.data?.response?.data) {
          res?.data?.response?.data.map(filteredRoles => {
            filteredRoles.label = filteredRoles?.role_name
            filteredRoles.value = filteredRoles?.role_name
          })
          setRoleslist(res?.data?.response?.data);
        }
        else {
          console.error(res)
        }
      })
  }

  const getRowIds = (data) => {
    setSelectedLeads(data)

  }

  const handleFilterByRole = (value) => {
    let filteredRolesArray = []
    if (value?.length) {
      filteredRolesArray = value?.map(obj => obj.role_code)
    }
    setFilteredRoles(filteredRolesArray)
    setSelectedUser(value)
  }

  const addList = async (data, assign) => {

    let modifiedData = data?.map((item) => {
      item.type = item?.[CubeDataset.Leads.Id] ? 'offline' : 'online';
      if (item.type == 'offline') {
        item.leadId = item?.[CubeDataset.Leads.Id]
        delete item?.[CubeDataset.Leads.Id]

        item.name = item?.[CubeDataset.Leads.name]
        delete item?.[CubeDataset.Leads.name]

        item.mobile = item?.[CubeDataset.Leads.mobile]
        delete item?.[CubeDataset.Leads.mobile]

        item.createdAt = item?.[CubeDataset.Leads.createdAt]
        delete item?.[CubeDataset.Leads.createdAt]

        item.userType = item?.[CubeDataset.Leads.userType]
        delete item?.[CubeDataset.Leads.userType]

        item.sourceId = item?.[CubeDataset.Leads.sourceId]
        delete item?.[CubeDataset.Leads.sourceId]

        item.subSourceId = item?.[CubeDataset.Leads.subSourceId]
        delete item?.[CubeDataset.Leads.subSourceId]

        item.city = item?.[CubeDataset.Leads.city]
        delete item?.[CubeDataset.Leads.city]

        item.sourceName = item?.[CubeDataset.Leads.sourceName]
        delete item?.[CubeDataset.Leads.sourceName]

        item.subSourceName = item?.[CubeDataset.Leads.subSourceName]
        delete item?.[CubeDataset.Leads.subSourceName]

        item.sourceName = item?.[CubeDataset.Leads.sourceName]
        delete item?.[CubeDataset.Leads.sourceName]
        delete item?.['Leads.createdAt.week']

        item.updatedAt = item?.[CubeDataset.Leads.updatedAt]
        delete item?.[CubeDataset.Leads.updatedAt]

        item.campaignId = item?.[CubeDataset.Leads.campaignId]
        delete item?.[CubeDataset.Leads.campaignId]

        item.countryCode = item?.[CubeDataset.Leads.countryCode]
        delete item?.[CubeDataset.Leads.countryCode]

        item.status = item?.[CubeDataset.Leads.status]
        delete item?.[CubeDataset.Leads.status]

        item.email = item?.[CubeDataset.Leads.email]
        delete item?.[CubeDataset.Leads.email]
        delete item?.[CubeDataset.OnlineLeads.uuid]
        delete item?.[CubeDataset.OnlineLeads.email]
        delete item?.[CubeDataset.OnlineLeads.username]
        delete item?.[CubeDataset.OnlineLeads.displayName]
        delete item?.[CubeDataset.OnlineLeads.gender]
        delete item?.[CubeDataset.OnlineLeads.uuid]
        delete item?.[CubeDataset.OnlineLeads.mobile]
        delete item?.[CubeDataset.OnlineLeads.phone]
        delete item?.[CubeDataset.OnlineLeads.city]
        delete item?.[CubeDataset.OnlineLeads.userPhoto]
        delete item?.[CubeDataset.OnlineLeads.classId]
        delete item?.[CubeDataset.OnlineLeads.boardId]
        delete item?.[CubeDataset.OnlineLeads.schoolName]
        delete item?.[CubeDataset.OnlineLeads.createdOn]
        delete item?.[CubeDataset.OnlineLeads.week]
        delete item?.[CubeDataset.OnlineLeads.createTime]
        delete item?.[CubeDataset.OnlineLeads.pin]
        delete item?.[`${user}.postalcode`]
        delete item?.[`${user}.userTypeId`]
        delete item?.[`${user}.dob`]
        delete item?.[`${user}.schoolId`]
        delete item?.[`${user}.productType`]
        delete item?.[`${user}.parentId`]
        delete item?.[`${user}.age`]
        delete item?.[`${user}.address`]
        delete item?.[`${user}.ip`]
        delete item?.[`${user}.subscribeMe`]
        delete item?.[`${user}.allowedEmailCategory`]
        delete item?.[`${user}.allowedSmsCategory`]
        delete item?.[`${user}.allowedSendOtp`]
        delete item?.[`${user}.newsletter`]
        delete item?.[`${user}.validEmail`]
        delete item?.[`${user}.mobileVerificationStatus`]
        delete item?.[`${user}.allowschedule`]
        delete item?.[`${user}.hygieneCheck`]
        delete item?.[`${user}.customBoardRackId`]
        delete item?.[`${user}.datalakeTimestamp`]
        delete item?.[`${user}.stateName`]
        delete item?.[`${user}.stateTinNumber`]
        delete item?.[`${user}.stateCode`]
        delete item?.[`${user}.countryName`]
        delete item?.[`${user}.nicename`]
        delete item?.[`${user}.numcode`]
        delete item?.[`${user}.phonecode`]
        delete item?.[`${user}.countryOrder`]
        delete item?.[`${user}.platform`]
        delete item?.[`${user}.updatedOn`]
        delete item?.[`${user}.userStatus`]
        delete item?.[`${user}.userUserId`]
      }
      else {
        item.leadId = item?.[CubeDataset.OnlineLeads.uuid]
        delete item?.[CubeDataset.OnlineLeads.uuid]

        item.email = item?.[CubeDataset.OnlineLeads.email]
        delete item?.[CubeDataset.OnlineLeads.email]

        item.name = item?.[CubeDataset.OnlineLeads.username]
        delete item?.[CubeDataset.OnlineLeads.username]

        item.displayName = item?.[CubeDataset.OnlineLeads.displayName]
        delete item?.[CubeDataset.OnlineLeads.displayName]

        item.gender = item?.[CubeDataset.OnlineLeads.gender]
        delete item?.[CubeDataset.OnlineLeads.gender]

        item.sourceId = item?.[CubeDataset.OnlineLeads.uuid]
        delete item?.[CubeDataset.OnlineLeads.uuid]

        item.mobile = item?.[CubeDataset.OnlineLeads.mobile]
        delete item?.[CubeDataset.OnlineLeads.mobile]

        item.phone = item?.[CubeDataset.OnlineLeads.phone]
        delete item?.[CubeDataset.OnlineLeads.phone]

        item.city = item?.[CubeDataset.OnlineLeads.city]
        delete item?.[CubeDataset.OnlineLeads.city]

        item.userPhoto = item?.[CubeDataset.OnlineLeads.userPhoto]
        delete item?.[CubeDataset.OnlineLeads.userPhoto]

        item.classId = item?.[CubeDataset.OnlineLeads.classId]
        delete item?.[CubeDataset.OnlineLeads.classId]

        item.boardId = item?.[CubeDataset.OnlineLeads.boardId]
        delete item?.[CubeDataset.OnlineLeads.boardId]

        item.school = item?.[CubeDataset.OnlineLeads.schoolName]
        delete item?.[CubeDataset.OnlineLeads.schoolName]

        item.createdOn = item?.[CubeDataset.OnlineLeads.createdOn]
        delete item?.[CubeDataset.OnlineLeads.createdOn]

        delete item?.[CubeDataset.OnlineLeads.week]

        item.createTime = item?.[CubeDataset.OnlineLeads.createTime]
        delete item?.[CubeDataset.OnlineLeads.createTime]

        item.pinCode = item?.[CubeDataset.OnlineLeads.pin]
        delete item?.[CubeDataset.OnlineLeads.pin]

        item.postalcode = item?.[`${user}.postalcode`]
        delete item?.[`${user}.postalcode`]
        item.userTypeId = item?.[`${user}.userTypeId`]

        delete item?.[`${user}.userTypeId`]
        item.dob = item?.[`${user}.dob`]

        delete item?.[`${user}.dob`]
        item.schoolId = item?.[`${user}.schoolId`]

        delete item?.[`${user}.schoolId`]
        item.productType = item?.[`${user}.productType`]

        delete item?.[`${user}.productType`]
        item.parentId = item?.[`${user}.parentId`]

        delete item?.[`${user}.parentId`]
        item.age = item?.[`${user}.age`]

        delete item?.[`${user}.age`]
        item.address = item?.[`${user}.address`]

        delete item?.[`${user}.address`]
        item.ip = item?.[`${user}.ip`]

        delete item?.[`${user}.ip`]
        item.subscribeMe = item?.[`${user}.subscribeMe`]

        delete item?.[`${user}.subscribeMe`]
        item.allowedEmailCategory = item?.[`${user}.allowedEmailCategory`]

        delete item?.[`${user}.allowedEmailCategory`]
        item.allowedSmsCategory = item?.[`${user}.allowedSmsCategory`]

        delete item?.[`${user}.allowedSmsCategory`]
        item.allowedSendOtp = item?.[`${user}.allowedSendOtp`]

        delete item?.[`${user}.allowedSendOtp`]
        item.newsletter = item?.[`${user}.newsletter`]

        delete item?.[`${user}.newsletter`]
        item.validEmail = item?.[`${user}.validEmail`]

        delete item?.[`${user}.validEmail`]
        item.mobileVerificationStatus = item?.[`${user}.mobileVerificationStatus`]

        delete item?.[`${user}.mobileVerificationStatus`]
        item.allowschedule = item?.[`${user}.allowschedule`]

        delete item?.[`${user}.allowschedule`]
        item.hygieneCheck = item?.[`${user}.hygieneCheck`]

        delete item?.[`${user}.hygieneCheck`]
        item.customBoardRackId = item?.[`${user}.customBoardRackId`]

        delete item?.[`${user}.customBoardRackId`]
        item.datalakeTimestamp = item?.[`${user}.datalakeTimestamp`]

        delete item?.[`${user}.datalakeTimestamp`]
        item.state = item?.[`${user}.stateName`]

        delete item?.[`${user}.stateName`]
        item.stateTinNumber = item?.[`${user}.stateTinNumber`]

        delete item?.[`${user}.stateTinNumber`]
        item.stateId = item?.[`${user}.stateCode`]

        delete item?.[`${user}.stateCode`]
        item.countryName = item?.[`${user}.countryName`]

        delete item?.[`${user}.countryName`]
        item.nicename = item?.[`${user}.nicename`]

        delete item?.[`${user}.nicename`]
        item.numcode = item?.[`${user}.numcode`]

        delete item?.[`${user}.numcode`]
        item.phonecode = item?.[`${user}.phonecode`]

        delete item?.[`${user}.phonecode`]
        item.countryOrder = item?.[`${user}.countryOrder`]

        delete item?.[`${user}.countryOrder`]
        item.platform = item?.[`${user}.platform`]

        delete item?.[`${user}.platform`]
        item.updatedOn = item?.[`${user}.updatedOn`]

        delete item?.[`${user}.updatedOn`]
        item.userStatus = item?.[`${user}.userStatus`]

        delete item?.[`${user}.userStatus`]
        item.userUserId = item?.[`${user}.userUserId`]

        delete item?.[`${user}.userUserId`]
      }
      return item
    })

    const sampleData = { 'leadsData': modifiedData, 'roleData': assign }
    leadassign(sampleData)
      .then((res) => {
        if (res?.result) {
          toast.success(res?.message)
          fetchLeadList()
        }
        else if (res?.data?.statusCode === 0) {
          let { errorMessage } = res?.data?.error
          toast.error(errorMessage)
        }
        else {
          console.error(res);
        }
      })
      .catch((error) => console.log(error, '...errror'))

  }
  const handleTransfer = () => {
    addList(selectedLeads, selectedUser)
    toggleSelectUserModal()
    navigate('/authorised/all-leads')
    setSelectedUser('')
  }

  const getConfigs = () => {
    getConfigDetails()
      .then((res) => {
        setConfigDetails(res?.data?.[0])
      })
  }

  const handleSort = (leadKey, userKey) => {
    let newOrder = sortObj?.sortOrder === 'asc' ? 'desc' : 'asc'
    setSortObj({ sortLeadKey: leadKey, sortUserKey: userKey, sortOrder: newOrder })
  }

  useEffect(() => {
    fetchLeadList()
  }, [pageNo, search, itemsPerPage, sortObj, filtersApplied])

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

  // let trialLeadReqBody = {
  //   empcode: empCode,
  //   action: "crmTrialActivation",
  //   apikey: "2832FSTDT7237DHDDH338HH",
  //   trial_activation_request: formattedReqBody,
  // };

  let trialLeadReqBody = {
    empcode: empCode,
    action: configDetails?.my_leads_action,
    apikey: configDetails?.my_leads_api_key,
    trial_activation_request: formattedReqBody,
  };


  const handleFilter = (e) => {
    setFilterAnchor(e.currentTarget)
  }

  const addFilter = () => {
    let filtersCopy = _.cloneDeep(filters)
    if (filters.find((fltObj) => fltObj?.label === "Select Filter")) {
      toast.error("First fill empty filter");
      return;
    }
    filtersCopy?.unshift({ label: 'Select Filter' })
    setFilters(filtersCopy)
  }

  const removeFilter = (filterIndex) => {
    let filtersCopy = _.cloneDeep(filters)
    filtersCopy?.splice(filterIndex, 1)
    setFilters(filtersCopy)
    if (filtersApplied.length == 1) {
      setFiltersApplied(filtersCopy)
    }
  }

  const removeAllFilters = () => {
    setFilters([])
    setFiltersApplied([])
  }

  const applyFilters = () => {
    let filtersLength = filters.length;
    if (filters[filtersLength - 1]?.['label'] === 'Select Filter') {
      toast.error('Select valid filter')
      return
    }
    let filtersCopy = _.cloneDeep(filters)
    setFiltersApplied(filtersCopy)
    setFilterAnchor(null)
  }

  useEffect(() => fetchRolesList(), [owner]);
  useEffect(() => getConfigs(), [])

  return (
    <>
      <Page title="Extramarks | All Leads" className="main-container myLeadPage datasets_container">
        <Container className='table_max_width'>
          <Grid container spacing={2} sx={{ mt: "0px", mb: "16px" }}>
            <Grid item xs={12} md={6}>
              <Grid className={`${classes.cusCard} ${classes.RevenueCard}`}>
                <Revenue />
              </Grid>
            </Grid>
            <Grid item xs={12} md={6}>
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
                <h3 className={classes.mbForMob}>All Leads</h3>
              </div>
              <div className="right">
                <TextField
                  className={`inputRounded search-input w100 width-auto`}
                  type="search"
                  placeholder="Search"
                  value={search}
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
                {selectedLeads.length > 0 && (
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
                      selectedBoard={selectedBoard}
                      setSelectedBoard={setSelectedBoard}
                      selectedClass={selectedClass}
                      setSelectedClass={setSelectedClass}
                      selectedProduct={selectedProduct}
                      setSelectedProduct={setSelectedProduct}
                      selectedLanguage={selectedLanguage}
                      setSelectedLanguage={setSelectedLanguage}
                      batchDate={batchDate}
                      setBatchDate={setBatchDate}
                      reqBody={trialLeadReqBody}
                    />
                  </>
                )}
                <Button
                  className={classes.submitBtn}
                  onClick={() => navigate('/authorised/add-lead')}
                >
                  Add Lead
                </Button>
                {selectedLeads.length > 0 && (
                  <Button
                    className={classes.submitBtn}
                    onClick={() => {
                      toggleChangeOwnerModal();
                      setOwner(-1);
                    }}
                  >
                    Change Owner
                  </Button>
                )}


              </div>
              {changeOwner && (
                <Modal
                  open={changeOwner}
                  // style={{"document.body.style.overflow":hidden}}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={style}>
                    <Typography align="center">
                      <div style={{ fontWeight: 600, fontSize: 18 }}>
                        Change Owner
                      </div>
                    </Typography>
                    <Typography
                      id="modal-modal-description"
                      align="center"
                      sx={{ mt: 2 }}
                    >
                      <FormControl>
                        <RadioGroup
                          row
                          aria-labelledby="demo-row-radio-buttons-group-label"
                          name="row-radio-buttons-group"
                        >
                          <FormControlLabel
                            checked={owner === 1 ? true : false}
                            onChange={(e) => handleOwner(e)}
                            value="single"
                            control={<Radio />}
                            label="Single User"
                          />
                          {/* <FormControlLabel checked={owner === 0 ? true : false} onChange={(e) => handleOwner(e)} value="multiple" control={<Radio />} label="Multiple User" /> */}
                        </RadioGroup>
                      </FormControl>
                    </Typography>
                    <Typography>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          marginTop: 25,
                        }}
                      >
                        <Button
                          style={{ marginRight: "20px", borderRadius: 4 }}
                          onClick={toggleChangeOwnerModal}
                          variant="outlined"
                        >
                          Cancel
                        </Button>
                        <Button
                          style={{ borderRadius: 4 }}
                          onClick={handleSubmit}
                          variant="contained"
                        >
                          Submit
                        </Button>
                      </div>
                    </Typography>
                  </Box>
                </Modal>
              )}
              {selectUserModal && owner === 1 && (
                <Modal
                  // open={toggleChangeOwnerModal}
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
                          // getOptionLabel={(option) => option.role_name}
                          // getOptionValue={(option) => option.role_id}
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
                            setChangeOwner(false)
                            setSelectedUser('')
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

            <div className={classes.filterSection}>
              {window.innerWidth >= 768 ?
                <span onClick={handleFilter}>
                  <div className="filterContainer mt-1">
                    <img src={FilterIcon} alt="FilterIcon" /> Filter
                  </div>
                </span> :
                <span>
                  <div className="filterContainer mt-1">
                    <LeadFilterMweb />
                  </div>
                </span>
              }
              <Select
                className={classes.cusSelect}
                defaultValue="none"
                sx={{
                  height: 39,
                }}
                onChange={(e) => setActiveAction(e.target.value)}
              >
                <MenuItem value="none" selected={activeAction == "none"}>Select Action</MenuItem>
                {selectedLeads.length > 0 &&
                  <MenuItem value="bulk-trial" selected={activeAction == "bulk-trial"} onClick={() => setAssignModal(!assignModal)}>Bulk Trial</MenuItem>
                }
                {selectedLeads.length > 0 &&
                  <MenuItem value="change-owner" selected={activeAction == "change-owner"} onClick={() => { toggleChangeOwnerModal(); setOwner(-1); }}>Change Owner</MenuItem>
                }
                {leadSize &&
                  <MenuItem value="add-lead" selected={activeAction == "add-lead"} onClick={() => navigate('/authorised/add-lead')}>Add Lead</MenuItem>
                }
              </Select>
            </div>
            <LeadFilter applyFilters={applyFilters} filterAnchor={filterAnchor} setFilterAnchor={setFilterAnchor} addFilter={addFilter} filters={filters} setFilters={setFilters} removeAllFilters={removeAllFilters} removeFilter={removeFilter} />

            {loader && leadSize &&
              <>
                {window.innerWidth >= 1024 ?
                  <Box>
                    <LeadTable filtersApplied={filtersApplied} getRowIds={getRowIds} pageNo={pageNo} itemsPerPage={itemsPerPage} list={leadList} handleSort={handleSort} sortObj={sortObj} />
                  </Box> :
                  <Box>
                    <LeadCard filtersApplied={filtersApplied} getRowIds={getRowIds} pageNo={pageNo} itemsPerPage={itemsPerPage} list={leadList} handleSort={handleSort} sortObj={sortObj} />
                  </Box>
                }
                {/* <Box display={{ xs: "none", sm: "block" }}>
                  <LeadTable filtersApplied={filtersApplied} getRowIds={getRowIds} pageNo={pageNo} itemsPerPage={itemsPerPage} list={leadList} handleSort={handleSort} sortObj={sortObj} />
                </Box>
                <Box display={{ xs: "block", sm: "none" }}>
                  <LeadCard filtersApplied={filtersApplied} getRowIds={getRowIds} pageNo={pageNo} itemsPerPage={itemsPerPage} list={leadList} handleSort={handleSort} sortObj={sortObj} />
                </Box> */}
              </>
            }
            {!loader &&
              <div
                style={{
                  height: "50vh",
                  width: "90vw",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: 'red'
                }}>
                {DisplayLoader()}
              </div>
            }
            {loader && !leadSize &&
              <div
                style={{
                  // position: "absolute",
                  height: "50vh",
                  width: "90vw",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontWeight: 600,
                  fontSize: 18
                }}>
                <p>No Data Available</p>
              </div>
            }
            {loader && leadSize &&
              <div className='center cm_pagination'>
                <TablePagination
                  count={itemsPerPage}
                  component="div"
                  page={pageNo}
                  onPageChange={handlePagination}
                  rowsPerPage={rowsPerPage}
                  rowsPerPageOptions={[10, 50, 500, 1000]}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  labelDisplayedRows={({ page }) => {
                    return `Page: ${page}`;
                  }} />
              </div>
            }
          </Paper >
        </div >
        <Grid />
      </Page >
    </>
  );
}
export default MyLeads