import React, { useEffect, useState } from 'react'
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  assignBtn: {
    fontWeight: "600",
    fontSize: "16px",
    lineHeight: "15px",
    borderRadius: "4px",
    color: "rgb(244, 94, 41)",
    border: "1px solid #F45E29",
    padding: "12px 24px",
    background: 'white',
    marginLeft: "95px",
    marginTop: '10px',
    width: "max-content",
    float: 'right',
  },
  viewBtn: {
    marginTop: "10px",
    lineHeight: "19px",
    color: "#4482FF",
    fontSize: "14px",
    fontWeight: "600",
    textDecorationColor: "#4482FF",
    cursor: 'pointer'
  }
}))

const UploadTargetTable = ({ list, itemsPerPage, pageNo, timeRange }) => {
  const navigate = useNavigate();
  const classes = useStyles();
  let range = timeRange?.value

  const viewMoreDetails = (roleName) => {
    navigate(`/authorised/targetDetails/${roleName}/${range}`)
  }

  const handleAssignTarget = (data) => {
    if (data?.firstRecord?.targetAmount === 'NA') {
      let roleName = data?.firstRecord?.roleName
      let targetData = data?.firstRecord
      navigate(`/authorised/target-assign/${roleName}/${range}`, { state: { data: targetData } })
    }
  }


  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table" className="custom-table datasets-table" >
        <TableHead>
          <TableRow className="cm_table_head">
            <TableCell> <div className='tableHeadCell'> Sr.No </div></TableCell>
            <TableCell sx={{ width: '20%' }}> <div className='tableHeadCell'> Owner </div></TableCell>
            <TableCell sx={{ width: '15%' }}> <div className='tableHeadCell'> Designation  </div></TableCell>
            <TableCell > <div className='tableHeadCell'> Hots Value </div></TableCell>
            <TableCell> <div className='tableHeadCell'> Pipeline Value </div></TableCell>
            <TableCell > <div className='tableHeadCell'> Set Target </div></TableCell>
            <TableCell > <div className='tableHeadCell'></div></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {list && list?.length > 0 &&
            list.map((row, i) => (
              <TableRow
                key={i}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {(i + 1) + ((pageNo - 1) * itemsPerPage)}
                </TableCell>

                <TableCell>{row?.firstRecord?.displayName}</TableCell>
                <TableCell>{row?.firstRecord?.roleName}</TableCell>
                <TableCell>{row?.hotsValue}</TableCell>
                <TableCell>{row?.pipelineValue}</TableCell>
                <TableCell>{row?.targetAmount}</TableCell>
                <TableCell>
                  <button className={classes.assignBtn} style={{ cursor: row?.targetAmount !== "NA" ? 'not-allowed' : 'pointer' }} onClick={() => handleAssignTarget(row)}>Assign</button>
                </TableCell>
                <TableCell><Link className={classes.viewBtn} onClick={() => viewMoreDetails(row?.firstRecord?.roleName)}>View More Details</Link></TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer >)
}

export default UploadTargetTable