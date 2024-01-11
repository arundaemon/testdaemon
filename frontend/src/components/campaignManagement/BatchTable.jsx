import { TableContainer, Paper, Table, TableBody, TableRow, TableCell } from "@mui/material";
import { CSVLink } from 'react-csv'
import TableHead from "@mui/material/TableHead";
import moment from 'moment'
import Tooltip from '@mui/material/Tooltip';
import { useState } from "react";

export default function BatchTable(props) {
  let { batchList } = props;


  const fileHeader = [
    { label: 'Name', key: 'name' },
    { label: 'Mobile', key: 'mobile' },
    { label: 'Email', key: 'email' },
    { label: 'State', key: 'state' },
    { label: 'City', key: 'city' },
    { label: 'Reference', key: 'reference' },
    { label: 'User_Type', key: 'userType' },
    { label: 'Error Message', key: 'errorMessage' }
  ]

  let downloadErrorExcel = (data) => {
    const errorExcel = {
      filename: 'Error.csv',
      headers: fileHeader,
      data
    }

    if (!data?.length) {
      return 0
    }

    return <CSVLink {...errorExcel}>{data?.length}</CSVLink>
  }

  let downloadSuccessExcel = (data) => {
    const successExcel = {
      filename: 'Success.csv',
      headers: fileHeader,
      data
    }

    if (!data?.length) {
      return 0
    }

    return <CSVLink {...successExcel}>{data?.length}</CSVLink>
  }

  return (
    <TableContainer component={Paper} sx={{ height: "95%" }}>
      <Table aria-label="simple table" className="custom-table datasets-table">
        <TableHead>
          <TableRow className="cm_table_head">
            <TableCell> <div className='tableHeadCell'> Batch </div></TableCell>
            <TableCell> <div className='tableHeadCell'> File Name </div></TableCell>
            {/* <TableCell><div className='tableHeadCell'>File</div></TableCell> */}
            <TableCell> <div className='tableHeadCell'> Status </div></TableCell>
            <TableCell> <div className='tableHeadCell'> Success </div></TableCell>
            <TableCell> <div className='tableHeadCell'> Error </div></TableCell>
            <TableCell> <div className='tableHeadCell'> Uploaded On </div></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {batchList && batchList.length > 0 &&
            batchList.map((row, i) => (
              <TableRow
                key={i}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              > 
              <Tooltip title={row?.batch} placement="top-start">
                <TableCell>{row?.batch}</TableCell>
              </Tooltip>
                <TableCell>{row?.fileName}</TableCell>
                <TableCell>{row?.batchStatus} </TableCell>
                <TableCell>{downloadSuccessExcel(row?.successFile)}</TableCell>
                <TableCell>{downloadErrorExcel(row?.errorFile)}</TableCell>
                {/* <TableCell>{moment(row.endDate).format('X') < moment().format('X') ? 'COMPLETED' : 'IN PROGRESS'}</TableCell> */}
                <TableCell>{moment(row?.createdAt).format('DD-MM-YYYY (HH:mm A)')}</TableCell>


              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
