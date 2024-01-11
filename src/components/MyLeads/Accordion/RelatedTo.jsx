import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { TableContainer, Box, TableHead, TableRow, Paper, Table, TableBody, Typography } from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';

import { leadRelatedTo } from '../../../config/services/leadassign';
import { DisplayLoader } from '../../../helper/Loader';
import NoDataComponent from '../NoDataComponent';
import settings from '../../../config/settings';
import CubeDataset from "../../../config/interface";
import { DecryptData, EncryptData } from '../../../utils/encryptDecrypt';


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


const RelatedTo = (props) => {

  const [relatedToList, setRelatedToList] = useState([]);
  const [loading, setLoading] = useState(true);
  let currentLeadId = props.leadObj.leadId

  const fetchRelatedToList = () => {
    let params = {
      mobile: props.leadObj.actualMobile,
      leadId: props.leadObj.leadId
    }

    let obj = {
      EncryptData: EncryptData(params)
    }

    if (props.leadObj.actualMobile && props.leadObj.leadId) {
      leadRelatedTo(obj)
        .then((result) => {
          let data = result?.result?.filter(data => data?.[CubeDataset.Leadassigns.leadId] != currentLeadId);
          setRelatedToList(data);
        })
        .catch((error) => {
          console.error("error", error);
        })
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchRelatedToList()
  }, [props.leadObj]);


  return (
    <Box>
      {loading ?
        <DisplayLoader />
        :
        (
          (relatedToList && relatedToList?.length === 0) ?
            <NoDataComponent message={'No Related Activity Data Available.'} />
            :
            (
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Name</StyledTableCell>
                      <StyledTableCell align="right">City</StyledTableCell>
                      <StyledTableCell align="right">State</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {relatedToList?.map((row, index) => (

                      <StyledTableRow key={index}>
                        <StyledTableCell component="th" scope="row">{row?.[CubeDataset.Leadassigns.name]}</StyledTableCell>
                        <StyledTableCell align="right">{row?.[CubeDataset.Leadassigns.city]}</StyledTableCell>
                        <StyledTableCell align="right">{row?.[CubeDataset.Leadassigns.state]}</StyledTableCell>
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

export default RelatedTo