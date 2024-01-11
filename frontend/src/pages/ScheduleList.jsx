import { memo, useEffect, useState } from "react";
import { getScheduleList } from "../config/services/gateway";
import { getUserData } from "../helper/randomFunction/localStorage";
import {
  Box,
  Grid,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  Button,
  Typography,
  Alert,
  TablePagination
} from "@mui/material";
import { makeStyles } from "@mui/styles"
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { scheduleActions } from "../redux/reducers/invoiceSchdeuler";
import SearchIcon from "../assets/icons/icon_search.svg";
import Page from "../components/Page";
import useMediaQuery from "@mui/material/useMediaQuery";
import { ReactComponent as IconSearchSetting } from "../assets/icons/icon-listing-setting.svg";
import FilterIcon from "../assets/image/filterIcon.svg";
import Loader from "../pages/Loader";
import InvoiceFilter from "../components/invoiceFilter/InvoiceFilter"
import _debounce from 'lodash/debounce';
import _ from "lodash";


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

const ScheduleList = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [filterAnchor, setFilterAnchor] = useState(null);
  const classes = useStyles();
  const [scheduleList, setScheduleList] = useState([]);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const [loader, setLoader] = useState(false)
  const [searchValue, setSearchValue] = useState(null)
  const [pageNo, setPagination] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [optionalPayload, setOptionalPayload] = useState({})
  const statusMap ={
    1: "Active"
  }

  useEffect(() => {
    if(isMobile) document.body.classList.add('crm-page-header-plain');
  }, [isMobile]);

  const handleFilter = (e) => {
    setFilterAnchor(e.currentTarget)
  }

  const handleApplyFilter = (data) => {
    setSearchValue("")
    setOptionalPayload(data)
  }

  const handleSearchField = _.debounce((e) => {
    let { value } = e.target;
    let payloadObj = {};
  
    if (value?.trim() !== '') {
      setSearchValue(value);
  
      if (value.startsWith('IMP')) {
        payloadObj['implementation_id'] = value;
      } else if (!isNaN(value)) {
        payloadObj['master_schedule_auto_id'] = parseInt(value, 10);
      } else if (/^[A-Za-z]{2}\d+$/.test(value)) {
        payloadObj['school_code'] = value;
      } else {
        payloadObj['product_group_key'] = value;
      }
    } else {
      setSearchValue('');
    }
    setOptionalPayload(payloadObj)  
  }, 600);

  const handleRedirect = (obj,type) => {
    let freeMonths_val = obj.invoice_collection_schedule_details.free_months.replace(/'/g, '"'); // replaced quotes of date string inside array
    let initObj = {
      type,
      scheduleIntervalId:obj.invoice_collection_schedule_details.invoice_schedule_frequency_id,
      billingStartDate:obj.billing_start_date,
      oldBillingDate:obj.billing_start_date,
      billing_date_change_status:null,
      scheduleObj:{...obj},
      freeMonths:JSON.parse(freeMonths_val),
      ...obj
    }
    dispatch(scheduleActions.init({obj:initObj}))
    navigate("/authorised/schedule-detail")
  };

  const fetchInvoiceListing = () => {
    let params = {
      uuid: getUserData("loginData")?.uuid,
      status: [1],
      data_source: "invoice",
      request_type: "GENERAL",
      schedule_data_type: ["invoice"],
      schedule_for: ["SW",'SSP'],
      page_offset: (itemsPerPage*(pageNo-1)),
      page_size: (itemsPerPage),
      order_by: "master_schedule_auto_id", 
      order: "desc", 
    };
    params['optional_search_params']=optionalPayload
    getScheduleList(params)
      .then((res) => {
        if (res?.data?.invoice_collection_schedules) {
          setLoader(false)
          setScheduleList((prevState) => [
            ...res.data.invoice_collection_schedules,
          ]);
        } else {
          setScheduleList([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  useEffect(() => {
    setLoader(true)
    fetchInvoiceListing()
  }, [rowsPerPage, pageNo, itemsPerPage, optionalPayload]);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPagination(1);
    setItemsPerPage(event.target.value);
  };


  return (
    <Page title="Generate Schedule | CRM">
      <Box className="crm-page-wrapper crm-page-schedule-listing">
        <Box className="crm-page-listing">
          <div className="crm-page-schedule-header">
            <div className="crm-page-schedule-header-label">
        
              <div className="left">
                <h3>Raise NPS Request</h3>
              </div>
              {
                !isMobile
                  ? <div className="right">
                      <form>
                        <TextField
                          className={`crm-form-input`}
                          type="search"
                          placeholder="Search"
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
                  <span 
                    onClick={handleFilter}
                  >
                    <div className="filterContainer">
                      <img src={FilterIcon} alt="FilterIcon" /> Filters
                    </div>
                  </span>
                </div>
              </div>
            </div>
            
            <InvoiceFilter filterAnchor={filterAnchor} setFilterAnchor={setFilterAnchor} handleApplyFilter={handleApplyFilter} isClear={searchValue? true:false}/>

          </div>
          
          {
            !isMobile
              ? <Grid>
                  <TableContainer className="crm-table-container">
                    {loader && <Loader />}
                    {scheduleList.length>0 ? <Table>
                      <TableHead className="cm_table_head">
                        <TableRow>
                          <TableCell>Schedule ID</TableCell>
                          <TableCell>School Code</TableCell>
                          <TableCell>Product</TableCell>
                          <TableCell>Implementation ID</TableCell>
                          <TableCell>Status</TableCell>
                          {/* <TableCell>Request Status</TableCell> */}
                          <TableCell>Created Date</TableCell>
                          <TableCell>Last Updated Date</TableCell>
                          <TableCell>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {scheduleList.map((scheduleObj, index) => (
                          <TableRow key={`schedule-${index}`}>
                            <TableCell>{scheduleObj.master_schedule_auto_id}</TableCell>
                            <TableCell>{scheduleObj.school_code}</TableCell>
                            <TableCell>{scheduleObj.product_group_key!==""? scheduleObj.product_group_key: "NA"}</TableCell>
                            <TableCell>{scheduleObj.implementation_form_id}</TableCell>
                            <TableCell>{statusMap[scheduleObj.status]}</TableCell>
                            {/* <TableCell>{scheduleObj?.request_status ?? "NA"}</TableCell> */}
                            <TableCell>
                              {moment(scheduleObj.created_on).format("DD MMM, YYYY")}
                            </TableCell>
                            <TableCell>
                              {scheduleObj.updated_on ? moment(scheduleObj.updated_on).format("DD MMM, YYYY") : 'NA'}
                            </TableCell>
                            <TableCell>
                              <Box>
                                <Box>
                                  <Link className="crm-anchor crm-anchor-small" onClick={(e) => handleRedirect(scheduleObj,'view')}>
                                    View Details
                                  </Link>
                                  {" | "}
                                    <Link className="crm-anchor crm-anchor-small" onClick={(e) => handleRedirect(scheduleObj,'edit')}>
                                        Modify
                                    </Link>
                                </Box>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    : <Alert severity="error">No Content Available!</Alert>}
                  </TableContainer>
                  {
                            <div className="center cm_pagination">
                                <TablePagination
                                    component="div"
                                    page={pageNo}
                                    onPageChange={(e, pageNumber)=>setPagination(pageNumber)}
                                    rowsPerPage={rowsPerPage}
                                    rowsPerPageOptions={[10, 50, 100, 500]}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    labelDisplayedRows={({ page }) => {
                                        return `Page: ${page}`;
                                    }}
                                    backIconButtonProps={{
                                        disabled: pageNo === 1,
                                    }}
                                    // nextIconButtonProps={{
                                    //     disabled: lastPage,
                                    // }}
                                />
                            </div>
                }
                </Grid>

              : <Box className="crm-g-schedule-list-wrapper">
                  
                  {scheduleList.map((scheduleObj, index) => (
                      <Box className="crm-g-schedule-listitem" key={index}>
                        <Grid container spacing={2.5}>
                          <Grid item xs={6}>
                            <Typography component={"h3"}>Schedule ID</Typography>
                            <Typography component={"p"}>{scheduleObj.master_schedule_auto_id}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography component={"h3"}>School Code</Typography>
                            <Typography component={"p"}>{scheduleObj.school_code || "NA"}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography component={"h3"}>Product	</Typography>
                            <Typography component={"p"}>{scheduleObj.product_group_key || "NA"}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography component={"h3"}>Implementation ID</Typography>
                            <Typography component={"p"}>{scheduleObj.implementation_form_id || "NA"}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography component={"h3"}>Status</Typography>
                            <Typography component={"p"}>{statusMap[scheduleObj.status] || "NA"}</Typography>
                          </Grid>
                          {/* <Grid item xs={6}>
                            <Typography component={"h3"}>Request Status	</Typography>
                            <Typography component={"p"}>{scheduleObj?.request_status ?? "NA"}</Typography>
                          </Grid> */}
                          <Grid item xs={6}>
                            <Typography component={"h3"}>Created Date		</Typography>
                            <Typography component={"p"}>{moment(scheduleObj.created_on).format("DD MMM, YYYY")}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography component={"h3"}>Last Updated Date		</Typography>
                            <Typography component={"p"}>{moment(scheduleObj.updated_on).format("DD MMM, YYYY")}</Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography component={"h3"}>Action</Typography>
                            <Typography component={"p"}>
                              <Link className="crm-anchor crm-anchor-small" onClick={(e) => handleRedirect(scheduleObj,'view')}>
                                View Details
                              </Link>
                              {" | "}
                              <Link className="crm-anchor crm-anchor-small" onClick={(e) => handleRedirect(scheduleObj,'edit')}>
                                  Modify
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

export default memo(ScheduleList);
