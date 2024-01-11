import React, { useEffect, useState } from "react";
import { Alert, InputAdornment, Paper, TextField, Tab, Tabs, Box, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import _ from "lodash";
import { Link, useNavigate } from "react-router-dom";
import SearchIcon from "../../assets/icons/icon_search.svg";
import { getVoucherList } from "../../config/services/packageBundle";
import { getUserData } from "../../helper/randomFunction/localStorage";
import Loader from "../../pages/Loader";
import Pagination from "../../pages/Pagination";
import VoucherList from "./voucherList";
import { DisplayLoader } from "../../helper/Loader";

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
  tabMainContainer: {
    display: 'flex',
    padding: 10,
    // justify-content: center is excluded here
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

const VoucherManagement = () => {
  const classes = useStyles();
  const [pageNo, setPagination] = useState(1);
  const [itemsPerPage] = useState(10);
  const [search, setSearchValue] = useState("");
  const [lastPage, setLastPage] = useState(false);
  const [loader, setLoading] = useState(false);
  const [searchBy, setSearchBy] = useState("voucher_based");
  const [voucherList, setVoucherList] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const loginData = getUserData('loginData')
  const uuid = loginData?.uuid


  const handleTabChange = (event, newValue) => {
    setPagination(1);
    setVoucherList([])
    setTabValue(newValue);
  }

  const getAllVoucherList = () => {
    let params = {
      page_offset: pageNo - 1,
      page_size: itemsPerPage,
      search_by: searchBy,
      search_val: search,
      voucher_status: tabValue === 0 ? [1] : [2],
      crn_dbn_for: "SW",
      order_by: "voucher_auto_id",
      order: "desc",
      uuid: uuid
    };
    setLoading(true);
    setLastPage(false);
    getVoucherList(params)
      .then((res) => {
        let list = res?.data?.voucher_details
        setVoucherList(list)
        if (list?.length < itemsPerPage) setLastPage(true);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  };

  const handleSearch = _.debounce((e) => {
    let { value } = e?.target;
    if (value.trim() !== '') {
      setPagination(1);
      setSearchValue(value, () => setPagination(1));
    } else
      setSearchValue("")
  }, 500);

  useEffect(() => {
    getAllVoucherList();
  }, [pageNo, itemsPerPage, search, tabValue]);



  return (
    <div className="tableCardContainer">
      <Paper>
        <div className="mainContainer">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 15,
              marginBottom: 15,
            }}
          >
            <div className="left">
              <h3>Voucher Management</h3>
            </div>
            <div className="right">
              <Link to={"/authorised/add-voucher"}>
                <div className={classes.submitBtn}>Create</div>
              </Link>
            </div>
          </div>
          <TextField
            style={{ marginBottom: "20px" }}
            className={`inputRounded search-input width-auto`}
            type="search"
            placeholder="Search By Voucher Based"
            onChange={handleSearch}
            inputProps={{ maxLength: 100 }}
            InputLabelProps={{ style: { ...{ top: `${-7}px` } } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="end">
                  <img src={SearchIcon} alt="" />
                </InputAdornment>
              ),
            }}
          />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="basic tabs example">
              <Tab label="Active Voucher" {...a11yProps(0)} />
              <Tab label="Cancelled Voucher" {...a11yProps(1)} />
            </Tabs>
          </Box>

          <CustomTabPanel value={tabValue} index={0} style={{
             overflow:"auto"
            }}>
            <AllTab tabValue={tabValue} loader={loader} listData={voucherList} page={pageNo} setPage={setPagination} lastPage={lastPage} getAllVoucherList={getAllVoucherList} />
          </CustomTabPanel>
          <CustomTabPanel value={tabValue} index={1}>
            <AllTab tabValue={tabValue} loader={loader} listData={voucherList} page={pageNo} setPage={setPagination} lastPage={lastPage} getAllVoucherList={getAllVoucherList} />
          </CustomTabPanel>
        </div>

      </Paper>
    </div>
  );
};

export default VoucherManagement;


function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}



function AllTab({ loader, listData, page, setPage, tabValue, lastPage, getAllVoucherList }) {
  const [list, setList] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [checkedRows, setCheckedRows] = useState([]);
  const loginData = getUserData('loginData')
  const uuid = loginData?.uuid
  const navigate = useNavigate()
  const classes = useStyles()

  useEffect(() => {
    if (listData?.length <= 0) {
      setList([])
      return
    } else {
      setList(listData)
    }

  }, [listData])

  if (!listData) return null;

  return (
    <Box sx={{ width: '100%' }}>
      {loader ?
        <div className={classes.loader}>
          {DisplayLoader()}
        </div>
        :
        listData?.length === 0 ?
          (
            <Alert severity="error">No Content Available!</Alert>
          ) :
          <>
            <Paper sx={{ width: '100%', mb: 2 }}>

              <VoucherList
                voucherList={list}
                itemsPerPage={rowsPerPage}
                pageNo={page}
                getAllVoucherList={getAllVoucherList}
                tabValue={tabValue}
              />

              <div className='center cm_pagination'>
                <Pagination pageNo={page} setPagination={setPage} lastPage={lastPage} />
              </div>
            </Paper>
          </>
      }
    </Box>
  )
}

