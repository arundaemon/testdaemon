import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import {
  TableContainer,
  Box,
  TableHead,
  TableRow,
  Paper,
  Table,
  TableBody,
} from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { Link } from "react-router-dom";

import { useParams } from "react-router-dom";
import moment from "moment";
import CubeDataset from "../../../../../config/interface";
import NoDataComponent from "../../../NoDataComponent";
import { getEdcCount } from "../../../../../config/services/school";
import { getLoginUserData } from "../../../../../helper/randomFunction";
import useMediaQuery from "@mui/material/useMediaQuery";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.action.hover,
    color: theme.palette.common.black,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "#fff",
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const SchoolInterestShown = (props) => {
  let { data, roleNameList, getInteestCount } = props;
  const [loading, setLoading] = useState(false);
  const [uniqueInterestList, setUniqueInterestList] = useState([]);
  const [edcCount, setEdcCount] = useState([])
  const loginUserData = getLoginUserData()
  const roleName = loginUserData?.userData?.crm_role;
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

  const edcCountFunction = () => {
    let leadIds = data?.interest?.map(item => item?.leadId)
    let params = { leadIds, roleName }
    getEdcCount(params)
      .then(res => {
        let data = res?.result
        setEdcCount(data)
      })
      .catch(err => {
        console.log(err, 'Error while getting EDC Count Data')
      })
  }


  roleNameList =
    roleNameList?.length > 0
      ? roleNameList?.map((roleObj) => roleObj?.roleName)
      : roleNameList;



  useEffect(() => {
    let interest = data?.interest
      ? data?.interest?.filter((obj) =>
        roleNameList?.includes(obj?.assignedTo_role_name)
      )
      : [];
    let countLength = interest?.length > 0 ? interest?.length : "";
    getInteestCount(countLength);
    setUniqueInterestList(interest);
    edcCountFunction()
  }, [data]);

  return (
    <Box>
      {uniqueInterestList === undefined || uniqueInterestList?.length === 0 ? (
        <NoDataComponent message={"No Interest History Available."} />
      ) : (
        <TableContainer component={Paper} className="crm-table-container crm-school-detail-accordion-table">
          <Table sx={{ minWidth: !isMobile ? 700 : '100%' }} aria-label="customized table" >
            <TableHead>
              <TableRow>
                <StyledTableCell align="left">ID</StyledTableCell>
                <StyledTableCell align="left">Product Name</StyledTableCell>
                <StyledTableCell align="left">Stage</StyledTableCell>
                <StyledTableCell align="left">Status</StyledTableCell>
                <StyledTableCell align="left">EDC</StyledTableCell>
                <StyledTableCell align="left">EDC Shifted</StyledTableCell>
                <StyledTableCell align="left">Owner Name</StyledTableCell>
                <StyledTableCell align="left">
                  Last Updated Date
                </StyledTableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {uniqueInterestList?.map((row, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell align="left">{index + 1}</StyledTableCell>
                  <StyledTableCell align="left">
                    <Link to={`/authorised/interest-details/${row?.schoolId}/${row?.leadId}`}>{row?.learningProfile}</Link>
                  </StyledTableCell>
                  <StyledTableCell align="left">{row?.stageName}</StyledTableCell>
                  <StyledTableCell align="left">{row?.statusName}</StyledTableCell>
                  <StyledTableCell align="left">{row?.edcCount}</StyledTableCell>
                  <StyledTableCell align="left">{edcCount?.[index]?.edcShiftedCount}</StyledTableCell>
                  <StyledTableCell align="left">
                    {row?.assignedTo_displayName}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {moment
                      .utc(row?.updatedAt)
                      .local()
                      .format("DD-MM-YYYY (hh:mm A)")}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )
      }
    </Box >
  );
};

export default SchoolInterestShown;
