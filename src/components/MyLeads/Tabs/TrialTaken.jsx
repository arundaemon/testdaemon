import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import InfiniteScroll from 'react-infinite-scroll-component';
import { TableContainer, Box, TableHead, TableRow, Paper, Table, TableBody } from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import moment from 'moment'
import { getTrialTakenActivities } from '../../../helper/DataSetFunction';
import { DisplayLoader } from '../../../helper/Loader';
import NoDataComponent from '../NoDataComponent';
import CubeDataset from "../../../config/interface";

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

const TrialTaken = (props) => {

  const [trialTakenList, setTrialTakenList] = useState([])
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(4);
  const [hasMore, setHasMore] = useState(true);
  // const [leadUuid, setleadUuid] = useState(props?.leadDetails[`${ONLINE_LEADS}.uuid`])
  const leadObj = props?.leadObj
  const leadUuid = leadObj?.leadId
  const currentDate = moment.utc(new Date()).local().format('DD-MM-YYYY(hh:mm A')

  // const lead_Uuid = props?.leadDetails[`${ONLINE_LEADS}.uuid`]

  const TrialTakenActivityList = (id) => {
    // scroll = false
    // let updatedDays = days;
    // if(scroll){
    //   updatedDays = days + 30
    // }

    getTrialTakenActivities(id)
      .then((result) => {
        setTrialTakenList(result?.loadResponse?.results?.[0]?.data);
        setLoading(false);
        // setDays(updatedDays);
      })
      .catch((error) => {
        console.error(error);
      })
  }

  useEffect(() => {
    TrialTakenActivityList(leadUuid)
  }, [leadUuid]);




  return (
    <Box>
      {loading ?
        <DisplayLoader />
        :
        (
          (trialTakenList?.length === 0) ?
            // <h6>No Product Purchased History Available.</h6>
            <NoDataComponent message={'No Trial Taken Data Available.'} />
            :
            (
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Product Name</StyledTableCell>
                      <StyledTableCell align="right">Created On</StyledTableCell>
                      <StyledTableCell align="right">Expiry Date</StyledTableCell>
                      <StyledTableCell align="right">Status</StyledTableCell>

                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {trialTakenList?.map((row) => (
                      <StyledTableRow key={row.name}>
                        <StyledTableCell component="th" scope="row">{row?.[CubeDataset.TblUserfreetrial.utfProductname]}</StyledTableCell>
                        <StyledTableCell align="right">{row?.[CubeDataset.TblUserfreetrial.createdon] ? moment.utc(row?.[CubeDataset.TblUserfreetrial.createdon]).format('DD-MM-YYYY') : "NA"}</StyledTableCell>
                        <StyledTableCell align="right">{row?.[CubeDataset.TblUserfreetrial.utfExpiryDate] ? moment.utc(row?.[CubeDataset.TblUserfreetrial.utfExpiryDate]).format('DD-MM-YYYY') : "NA"}</StyledTableCell>
                        <StyledTableCell align="right">{row?.[CubeDataset.TblUserfreetrial.utfExpiryDate] ? (moment.utc(row?.[CubeDataset.TblUserfreetrial.utfExpiryDate]).local().format('DD-MM-YYYY(hh:mm A') >= currentDate ? "Active" : "Expired") : "Expired"}</StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )
        )
      }
    </Box>
  )
}

export default TrialTaken