import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { TableContainer, Box, TableHead, TableRow, Paper, Table, TableBody } from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import NoDataComponent from '../NoDataComponent';
import { Link } from 'react-router-dom';

import { LeadDetailsInterest, uniqueLeadInterest } from '../../../config/services/leadInterest';

import { useParams } from 'react-router-dom';
import { DisplayLoader } from '../../../helper/Loader';
import moment from 'moment';
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

const InterestShown = ({leadInterestList,...props}) => {
  const [loading, setLoading] = useState(false);
  const [uniqueInterestList, setUniqueInterestList] = useState([]);

  let leadId = props?.leadObj?.leadId

  const fetchUniqueInterest = async () => {
    uniqueLeadInterest(leadId)
      .then(res => {
        if(res?.result){
          setUniqueInterestList(res?.result)
        }
      })
      .catch(err => {
        console.log(err,':: error inside catch unique interest');
      })
  }

  useEffect(() => {
    fetchUniqueInterest();
  }, [])

  return (
    <Box>
      {loading ?
        <DisplayLoader />
        :
        (
          (uniqueInterestList === undefined || uniqueInterestList?.length === 0) ?
            <NoDataComponent message={'No Interest History Available.'} />
            :
            (
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
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
                      <StyledTableRow key={row?.[CubeDataset.Leadinterests.createdAt]}>
                        <StyledTableCell align="center">{<Link to={`/authorised/campaign-tracking/${leadId}/${row?.[CubeDataset.Leadinterests.learningProfile]}`}>
                        {row?.[CubeDataset.Leadinterests.learningProfile] ? row?.[CubeDataset.Leadinterests.learningProfile] : 'NA'}</Link>}
                          </StyledTableCell>
                        <StyledTableCell align="center">{row?.[CubeDataset.Leadinterests.board] ? row?.[CubeDataset.Leadinterests.board] : 'NA'}</StyledTableCell>
                        <StyledTableCell align="center">{row?.[CubeDataset.Leadinterests.class] ? row?.[CubeDataset.Leadinterests.class] : 'NA'}</StyledTableCell>
                        <StyledTableCell align="center">{row?.[CubeDataset.Leadinterests.school] ? row?.[CubeDataset.Leadinterests.school] : 'NA'}</StyledTableCell>
                        <StyledTableCell align="center">{row?.[CubeDataset.Leadinterests.sourceName] ? row?.[CubeDataset.Leadinterests.sourceName] : 'NA'}</StyledTableCell>
                        <StyledTableCell align="center">{row?.[CubeDataset.Leadinterests.subSourceName] ? row?.[CubeDataset.Leadinterests.subSourceName] : 'NA'}</StyledTableCell>
                        <StyledTableCell align="center">{row?.[CubeDataset.Leadinterests.campaignName] ? row?.[CubeDataset.Leadinterests.campaignName] : 'NA'}</StyledTableCell>
                        {/* <StyledTableCell align="right"></StyledTableCell> */}
                        <StyledTableCell align="center">{moment.utc(row?.[CubeDataset.Leadinterests.createdAt]).local().format('DD-MM-YYYY (hh:mm A)')}</StyledTableCell>
                        <StyledTableCell align="center">{moment.utc(row?.[CubeDataset.Leadinterests.updatedAt]).local().format('DD-MM-YYYY (hh:mm A)')}</StyledTableCell>


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

export default InterestShown