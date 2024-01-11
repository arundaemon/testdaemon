import { useState, useCallback, useEffect, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Button,
  InputAdornment,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Grid
} from "@mui/material";
import toast from "react-hot-toast";
import moment from "moment";
import { makeStyles } from "@mui/styles"
import { scheduleActions } from "../redux/reducers/invoiceSchdeuler";
import { fetchImplementationListByApprovalStatus } from "../config/services/implementationForm";
import { useNavigate } from "react-router-dom";
import Page from "../components/Page";
import SearchIcon from "../assets/icons/icon_search.svg";
import FilterIcon from "../assets/image/filterIcon.svg";
import { ReactComponent as IconSearchSetting } from "../assets/icons/icon-listing-setting.svg";
import LeadFilter from "../components/leadFilters/LeadFilterMenu";
import _ from "lodash";
import { DecryptData, EncryptData } from "../utils/encryptDecrypt";
import useMediaQuery from "@mui/material/useMediaQuery";

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
    marginBottom: '20px',
  },
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
  }
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

const GenerateSchedule = ({}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [implementationList, setImplementationList] = useState([]);
  const [searchTextField, setSearchTextField] = useState("");
  const [pageNo, setPagination] = useState(1);
  const [search, setSearchValue] = useState("");
  const [filterAnchor, setFilterAnchor] = useState(null);
  const [filters, setFilters] = useState([]);
  const [filtersApplied, setFiltersApplied] = useState([]);
  const [role] = useState("SCHEDULE_FILTER");
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

  useEffect(() => {
    if(isMobile) document.body.classList.add('crm-page-header-plain');
  }, [isMobile]);

  const generateSchedule = useCallback((implmentationObj) => {
    dispatch(scheduleActions.init({ obj: implmentationObj }));
    navigate("/authorised/create-schedule");
  });

  useEffect(() => {
    let params = {
      search: "",
      pageNo: 0,
      limit: 10,
      sortKey: "updatedAt",
      sortOrder: "desc",
      approvalStatus: "Approved",
      scheduleStatus: "Pending"
    };
    fetchImplementationListByApprovalStatus(params)
      .then((res) => {
        //console.log(res)
        if (res.result) {
          setImplementationList([...res.result]);
        } else {
          setImplementationList([]);
        }
      })
      .catch((err) => {
        console.log(err);
        setImplementationList([]);
        toast.error("Something went wrong, while fetching the list");
      });
  }, []);

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

  const handleFilter = (e) => {
    setFilterAnchor(e.currentTarget);
  };

  const applyFilters = () => {
    if (filters.find((fltObj) => fltObj?.label === "Select Filter")) {
      toast.error("Select Valid Filter");
      return;
    }
    let filtersCopy = _.cloneDeep(filters);
    localStorage.setItem("scheduleFilters", EncryptData(filtersCopy));
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
    //setCheckedLeads([]);
    localStorage.setItem("schoolFilters", EncryptData(filtersCopy));
    if (filtersCopy?.length == 0) {
      localStorage.removeItem("scheduleFilters");
    }
  };

  const removeAllFilters = () => {
    setFilters([]);
    setFiltersApplied([]);
    localStorage.removeItem("scheduleFilters");
  };

  return (
    <Page title="Generate Schedule | CRM">
      <Box className="crm-page-wrapper crm-page-schedule-listing">
        <Box className="crm-page-listing">
          <div className="crm-page-schedule-header">
            <div className="crm-page-schedule-header-label">
        
              <div className="left">
                <h3>Generate Schedule</h3>
              </div>
              {
                !isMobile
                  ? <div className="right">
                      <form>
                        <TextField
                          className={`crm-form-input`}
                          type="search"
                          placeholder="Search"
                          value={searchTextField}
                          onChange={handleSearchField}
                          InputLabelProps={{ style: { ...{ top: `${-7}px` } } }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="start">
                                <img src={SearchIcon} alt="" />
                              </InputAdornment>
                            ),
                          }}
                        />
                        
                      </form>
                      <Button className="crm-search-settings">
                        <IconSearchSetting />
                      </Button>
                    </div>
                  : null
              }
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
                      <img src={FilterIcon} alt="FilterIcon" /> Filters
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

          </div>

          {
            !isMobile
              ? <TableContainer className="crm-table-container">
                  <Table>
                    <TableHead className="crm-table-head-size-md">
                      <TableRow >
                        <TableCell>
                          <div className="tableHeadCell">PO No.</div>
                        </TableCell>
                        <TableCell>
                          <div className="tableHeadCell">School Code</div>
                        </TableCell>
                        <TableCell>
                          <div className="tableHeadCell">School Name</div>
                        </TableCell>
                        <TableCell>
                          <div className="tableHeadCell">Implementation ID</div>
                        </TableCell>
                        <TableCell>
                          <div className="tableHeadCell">Schedule Amount</div>
                        </TableCell>
                        <TableCell>
                          <div className="tableHeadCell">Implementation Date</div>
                        </TableCell>
                        <TableCell>
                          <div className="tableHeadCell">Action</div>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {implementationList.map((record, index) => (
                        <TableRow
                          key={record._id}
                          sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                        >
                          <TableCell>{record?.purchaseOrderCode || "NA"}</TableCell>
                          <TableCell>{record?.schoolCode || "NA"}</TableCell>
                          <TableCell>{record?.schoolName || "NA"}</TableCell>
                          <TableCell>{record?.impFormNumber || "NA"}</TableCell>
                          <TableCell>
                            {(record?.serviceDetails && record?.serviceDetails.length > 0
                              ? [...record?.productDetails, ...record?.serviceDetails]
                              : [...record?.productDetails]
                            ).reduce(
                              (partialSum, obj) => obj.productItemImpPrice ? partialSum + parseFloat(obj.productItemImpPrice) : partialSum + 0,
                              0
                            )}
                          </TableCell>
                          <TableCell>
                            {moment
                              .utc(record?.implementationStartDate)
                              .format("DD-MM-YYYY")}
                          </TableCell>
                          <TableCell>
                            <Link onClick={(e) => generateSchedule(record)} className="crm-table-action-link">
                              Generate Schedule
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              
              : <Box className="crm-g-schedule-list-wrapper">
                  
                  {implementationList.map((record, index) => (
                      <Box className="crm-g-schedule-listitem" key={index}>
                        <Grid container spacing={2.5}>
                          <Grid item xs={6}>
                            <Typography component={"h3"}>PO No.</Typography>
                            <Typography component={"p"}>{record?.purchaseOrderCode || "NA"}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography component={"h3"}>School Code</Typography>
                            <Typography component={"p"}>{record?.schoolCode || "NA"}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography component={"h3"}>School Name</Typography>
                            <Typography component={"p"}>{record?.schoolName || "NA"}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography component={"h3"}>Implementation ID</Typography>
                            <Typography component={"p"}>{record?.impFormNumber || "NA"}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography component={"h3"}>Schedule Amount</Typography>
                            <Typography component={"p"}>
                              {(record?.serviceDetails
                                ? [...record?.productDetails, ...record?.serviceDetails]
                                : [...record?.productDetails]
                              ).reduce(
                                (partialSum, obj) => partialSum + parseFloat(obj.productItemImpPrice),
                                0
                              ) || "NA"}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography component={"h3"}>Implementation Date</Typography>
                            <Typography component={"p"}>
                              {moment
                                .utc(record?.implementationStartDate)
                                .format("DD-MM-YYYY")}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography component={"h3"}>Action</Typography>
                            <Typography component={"p"}>
                              <Link onClick={(e) => generateSchedule(record)} className="crm-anchor crm-anchor-small">
                                Generate Schedule
                              </Link>
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    ))
                  }
                </Box> 
          }
        
          

        </Box>
      </Box>
      
    </Page>
  );
};

export default memo(GenerateSchedule);
