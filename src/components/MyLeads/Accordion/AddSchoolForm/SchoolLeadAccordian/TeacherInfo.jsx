import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { TableContainer, Box, TableHead, TableRow, Paper, Table, TableBody } from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { Link } from 'react-router-dom';

import { useParams } from 'react-router-dom';
import moment from 'moment';
import CubeDataset from "../../../../../config/interface"
import NoDataComponent from '../../../NoDataComponent';
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
  '&:nth-of-type(odd)': {
    backgroundColor: "#fff",
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const TeacherInfo = () => {
  const [loading, setLoading] = useState(false);
  const [uniqueInterestList, setUniqueInterestList] = useState([]);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

  return (
    <Box>
      {
        (uniqueInterestList === undefined || uniqueInterestList?.length === 0) ?
        <NoDataComponent message={'No Teacher History Available.'} className="crm-school-lead-no-data" />
        :
        (
          <TableContainer component={Paper} className="crm-table-container crm-school-detail-accordion-table">
            <Table sx={{ minWidth: !isMobile ? 700 : '100%' }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">Interest</StyledTableCell>
                  <StyledTableCell align="center">Board</StyledTableCell>
                  <StyledTableCell align="center">Class</StyledTableCell>
                  <StyledTableCell align="center">School</StyledTableCell>
                  <StyledTableCell align="center">Source</StyledTableCell>
                  <StyledTableCell align="center">Sub Source</StyledTableCell>
                  <StyledTableCell align="center">Campaign Name</StyledTableCell>
                  {/* <StyledTableCell align="right">Landing Page</StyledTableCell> */}
                  <StyledTableCell align="center">Created At</StyledTableCell>
                  <StyledTableCell align="center">Updated At</StyledTableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {uniqueInterestList?.map((row) => (
                  <StyledTableRow>
                    <StyledTableCell align="right">1</StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )
      }
    </Box>
  )
}

export default TeacherInfo