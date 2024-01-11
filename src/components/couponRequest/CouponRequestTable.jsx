import React from 'react'
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import EditIcon from "../../assets/icons/edit-icon.svg";
import Paper from "@mui/material/Paper";
import moment from 'moment'
import Button from "@mui/material/Button";
import { Tooltip } from '@mui/material';

const CouponRequestTable = (props) => {
  let { list, couponRequestForm, setCouponRequestForm, handleEditIndex } = props

  const handleEdit = (i) => {
    setCouponRequestForm(!couponRequestForm)
    handleEditIndex(i)
  }

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table" className="custom-table datasets-table">
        <TableHead>
          <TableRow className="cm_table_head">
            <TableCell> <div className='tableHeadCell'> Coupon Percentage </div></TableCell>
            <TableCell> <div className='tableHeadCell'> Quantity </div></TableCell>
            <TableCell> <div className='tableHeadCell'> Remarks </div></TableCell>
            <TableCell> <div className='tableHeadCell'> Valid Till </div></TableCell>
            <TableCell> <div className='tableHeadCell'> Action </div></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {list && list?.length > 0 &&
            list?.map((row, i) => (
              <TableRow
                key={i}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>{row?.From_Percentage + " to " + row?.To_Percentage}</TableCell>
                <TableCell>{row?.Quantity}</TableCell>
                <TableCell>{row?.Remarks} </TableCell>
                <TableCell>{moment(row?.Valid_Till_Date).format('DD-MM-YYYY')}</TableCell>
                <TableCell className="edit-cell action-cell">
                  <Button className='form_icon' onClick={() => handleEdit(i)}><img src={EditIcon} alt='' /></Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer >
  );
}

export default CouponRequestTable