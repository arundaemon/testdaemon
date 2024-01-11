import React, { useEffect, useState } from "react";

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
  TableCell,
  TableContainer,
  Table,
  TableHead,
  Alert,
} from "@mui/material";
// import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button } from '@mui/material';
import { makeStyles } from "@mui/styles";
import SearchIcon from "../../assets/icons/icon_search.svg";
import HardwarePartTable from "./HardwarePartTable";
import { Link } from "react-router-dom";
import { listHardwareParts } from "../../config/services/hardwareBundleAndPart";
import Pagination from "../../pages/Pagination";
import _ from "lodash";
import Loader from "../../pages/Loader";
import { toast } from "react-hot-toast";
import { getUserData } from "../../helper/randomFunction/localStorage";

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
}));

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  // height: "100%",
  bgcolor: "background.paper",
  border: "1px solid #fff",
  boxShadow: "0px 0px 4px #0000001A",
  p: 4,
  borderRadius: "4px",
};

const HardwarePartList = () => {
  const classes = useStyles();
  const [searchValue, setSearchValue] = useState("");
  const [lastPage, setLastPage] = useState(false)
  const [searchBy, setSearchBy] = useState({
    partName: "part_name",
    partId: "part_id",
  });
  const [pageNo, setPagination] = useState(1);
  const [itemsPerPage] = useState(10);
  const [responseText, setResponseText] = useState([])
  const [loader, setLoading] = useState(false)
  const loginData = getUserData('loginData')
  const uuid=loginData?.uuid

  let obj ={}

  const handleSearch = _.debounce((e) => {
    let { value } = e.target
    if (value.trim() !== ''){
      setPagination(1);
      setSearchValue(value, () => setPagination(1));
    } else
    setSearchValue("")
  }, 600)

const getHardwarePartList = async() => {
    
  setLoading(true)

      obj = {
        page_offset: (pageNo-1),
        page_size: itemsPerPage,
        search_by: searchBy.partName,
        search_val: searchValue,
        status:[1],
        uuid:uuid
      }

    try {
      const response = await listHardwareParts(obj);
      setLastPage(false)
      setResponseText(response?.data.part_list)
      if(response.data.part_list.length<itemsPerPage) setLastPage(true)
      setLoading(false)
    }
    catch (err) {
      console.log("error in getHardwarePartList: ", err);
      toast.error("***Error***");
    }
    
  }

  useEffect(() => {
    getHardwarePartList()
  },[pageNo, itemsPerPage, searchValue]);



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
              <h3>Manage Hardware Parts</h3>
              <p>

              </p>
            </div>
            <div className="right">
              <Link to={"/authorised/hardware-part-form"}>
                <div className={classes.submitBtn}>Create</div>
              </Link>
            </div>
          </div>
          <TextField
            style={{ marginBottom: "20px" }}
            className={`inputRounded search-input width-auto`}
            type="search"
            placeholder="Search By Part Name"
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

          {loader && <Loader />}
          {responseText?.length ? <HardwarePartTable response={responseText} pageNo={pageNo} itemsPerPage={itemsPerPage} getHardwarePartList={getHardwarePartList}/>:
          <Alert severity="error">No Content Available!</Alert>}
        </div>
        <div className='center cm_pagination'>
            <Pagination pageNo={pageNo} setPagination={setPagination} lastPage={lastPage}/>
        </div>
      </Paper>
    </div>
  );
};

export default HardwarePartList;
