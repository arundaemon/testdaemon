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

const ContactLeadInfo = (props) => {

  let {data} = props
  const [loading, setLoading] = useState(false);
  const [uniqueInterestList, setUniqueInterestList] = useState([]);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));
  
  useEffect(()=> {
    let contactInfo = data?.contactDetails ? data?.contactDetails : []
    setUniqueInterestList(contactInfo)
  }, [data])


  return (
    <Box>
      {
        (uniqueInterestList === undefined || uniqueInterestList?.length === 0) ?
        <NoDataComponent message={'No Contact History Available.'} className="crm-school-lead-no-data" />
        :
        (
          <TableContainer component={Paper} className="crm-table-container crm-school-detail-accordion-table">
            <Table sx={{ minWidth: !isMobile ? 700 : '100%' }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="left">Name</StyledTableCell>
                  <StyledTableCell align="left">Designation</StyledTableCell>
                  <StyledTableCell align="left">Email ID</StyledTableCell>
                  <StyledTableCell align="left">Primary</StyledTableCell>

                  {/* <StyledTableCell align="left">Date</StyledTableCell> */}
                </TableRow>
              </TableHead>

              <TableBody>
                {uniqueInterestList?.filter(obj => obj?.name)?.map((row,index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell align="left">{row?.name}</StyledTableCell>
                    <StyledTableCell align="left">{row?.designation}</StyledTableCell>
                    <StyledTableCell align="left">{row?.emailId ? row?.emailId : "N/A"}</StyledTableCell>
                    <StyledTableCell align="left">{row?.isPrimary === true ? "Yes" : "No"}</StyledTableCell>
                    {/* <StyledTableCell align="left">{moment(row?.conatactDate).format('DD-MM-YYYY')}</StyledTableCell> */}
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

export default ContactLeadInfo