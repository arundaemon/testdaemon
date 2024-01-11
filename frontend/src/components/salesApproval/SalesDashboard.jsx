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
  Alert,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Switch,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import CubeDataset from "../../config/interface";
import SearchIcon from "../../assets/icons/icon_search.svg";
// import Pagination from "../../pages/Pagination";
import _ from "lodash";
import Loader from "../../pages/Loader";
// import ApprovalListingTable from "./ApprovalListingTable";
import { getSalesApprovalListAll } from "../../config/services/salesApproval";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import RefreshIcon from '@mui/icons-material/Refresh';

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

const SalesDashboard = () => {
  const classes = useStyles();
  const [approvalList, setApprovalList] = useState([]);
  const [loader, setLoading] = useState(false);
  const [searchParam, setSearchParam] = useState("");
  const [pageNo, setPagination] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100)
  const [lastPage, setLastPage] = useState(false)
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate()

  const fetchApprovalList = async () => {
    setLoading(true);

    try {
      const response = await getSalesApprovalListAll(`search=${searchParam}&pageNo=${pageNo-1}&count=${rowsPerPage}`);
      setApprovalList(response?.data?.responseData?.result);
      setLoading(false);
    } catch (e) {
      console.log("Error while fetching : ", e);
    }
  };

  const searchByReferenceCode = (param) => {
    setSearchParam(param);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPagination(1);
    setItemsPerPage(event.target.value);
};

const navigateToRoleDash = (role) => {
  navigate(`/authorised/role-dashboard`, {state: { role: role }})
} 

  useEffect(() => {
    fetchApprovalList();
  }, [searchParam, pageNo, rowsPerPage]);

  return (
    <div className="tableCardContainer">
      <Paper>
        <div className="mainContainer">
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              marginTop: 15,
              marginBottom: 15,
            }}
          >
            <div className="left" style={{marginRight: 15}}>
              <h3>Approval Listing</h3>
            </div>
            <div className="left" onClick={(e)=>searchByReferenceCode('')}>
            <RefreshIcon sx={{cursor: 'pointer', color: '#f45e29'}}/>
            </div>
          </div>

          {loader && <Loader />}
          {approvalList?.length > 0 ? (
            <TableContainer component={Paper}>
              <Table
                aria-label="customized table"
                className="custom-table datasets-table"
              >
                <TableHead>
                  <TableRow className="cm_table_head">
                    <TableCell>S.No</TableCell>
                    <TableCell>
                      <div className="tableHeadCell">Reference Code</div>
                    </TableCell>
                    <TableCell>
                      <div className="tableHeadCell">Created By</div>
                    </TableCell>
                    <TableCell>
                      <div className="tableHeadCell">Created By Role</div>
                    </TableCell>
                    <TableCell>
                      <div className="tableHeadCell">Relevant Id</div>
                    </TableCell>
                    <TableCell>
                      <div className="tableHeadCell">Assigned To Role</div>
                    </TableCell>
                    <TableCell>
                      <div className="tableHeadCell">Emp Code</div>
                    </TableCell>
                    <TableCell>
                      <div className="tableHeadCell">Name</div>
                    </TableCell>
                    <TableCell>
                      <div className="tableHeadCell">Status</div>
                    </TableCell>
                    <TableCell>
                      <div className="tableHeadCell">Updated At</div>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {approvalList.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell>{i + 1 + (pageNo-1)*rowsPerPage}.</TableCell>
                      <TableCell className='crm-anchor crm-anchor-small'
                        onClick={(e) =>
                          searchByReferenceCode(row?.referenceCode)
                        }
                      >
                        {row?.referenceCode ??
                          row?.["Approvalmappings.referenceCode"] ??
                          "-"}
                      </TableCell>
                      <TableCell>
                        {row?.createdByName ??
                          row?.["Approvalmappings.createdByName"] ??
                          "-"}
                      </TableCell>
                      <TableCell className='crm-anchor crm-anchor-small' onClick={(e)=>navigateToRoleDash(row?.createdByRoleName)}>
                        {row?.createdByRoleName ??
                          row?.["Approvalmappings.createdByRoleName"] ??
                          "-"}
                      </TableCell>
                      <TableCell>
                        {row?.relevantId ??
                          row?.["Approvalmappings.relevantId"] ??
                          "-"}
                      </TableCell>
                      <TableCell>
                        {row?.assignedToRoleName ??
                          row?.["Approvalmappings.assignedToRoleName"] ??
                          "-"}
                      </TableCell>
                      <TableCell>
                        {row?.assignedToEmpId ??
                          row?.["Approvalmappings.assignedToEmpId"] ??
                          "-"}
                      </TableCell>
                      <TableCell>
                        {row?.assignedToName ??
                          row?.["Approvalmappings.assignedToName"] ??
                          "-"}
                      </TableCell>
                      <TableCell>
                        {row?.status ?? row?.["Approvalmappings.status"] ?? "-"}
                      </TableCell>
                      <TableCell>
                        <div>
                          {row?.updatedAt
                            ? moment(row?.updatedAt).format(
                                "DD-MM-YY (HH:mm A)"
                              )
                            : moment(
                                row?.[CubeDataset.Approvalmappings.updatedAt]
                              ).format("DD-MM-YY (HH:mm A)")}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Alert severity="error">No Content Available!</Alert>
          )}
              <div className="center cm_pagination">
                <TablePagination
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
                //   nextIconButtonProps={{
                //     disabled: lastPage,
                //   }}
                />
              </div>
        </div>
        {/* <div className='center cm_pagination'>
            <Pagination pageNo={pageNo} setPagination={setPagination} lastPage={lastPage}/>
        </div> */}
      </Paper>
    </div>
  );
};

export default SalesDashboard;
