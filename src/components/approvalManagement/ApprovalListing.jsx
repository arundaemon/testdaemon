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
import { makeStyles } from "@mui/styles";
import SearchIcon from "../../assets/icons/icon_search.svg";
// import Pagination from "../../pages/Pagination";
import _ from "lodash";
import Loader from "../../pages/Loader";
import ApprovalListingTable from "./ApprovalListingTable";
import { getApprovalMatrixList } from "../../config/services/approvalMatrix";
import { Link } from "react-router-dom";

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


const ApprovalListing = () => {
  const classes = useStyles();
  const [approvalList, setApprovalList] = useState([])
  const [loader, setLoading] = useState(false)

  
  const fetchApprovalList = async() => {
    setLoading(true)

    try{
      const response = await getApprovalMatrixList()
      setApprovalList(response?.result)
      setLoading(false)
    }catch(e){
      console.log('Error while fetching : ', e)
    }
  }

  useEffect(() => {
    fetchApprovalList()
}, []);

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
              <h3>Approval Matrix Listing</h3>
              <p>

              </p>
            </div>
            <div className="right">
              <Link to={"/authorised/add-approval"}>
                <div className={classes.submitBtn}>Create</div>
              </Link>
            </div>
          </div>
          

            
          {loader && <Loader />} 
          {approvalList?.length ? <ApprovalListingTable approvalList={approvalList} fetchApprovalList={fetchApprovalList}/>:
          <Alert severity="error">No Content Available!</Alert>} 
        </div>
        {/* <div className='center cm_pagination'>
            <Pagination pageNo={pageNo} setPagination={setPagination} lastPage={lastPage}/>
        </div> */}
      </Paper>
    </div>
  );
};

export default ApprovalListing;
