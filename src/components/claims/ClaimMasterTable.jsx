import React from 'react'
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button } from '@mui/material';
import DeleteIcon from "../../assets/icons/icon_trash.svg";
import EditIcon from "../../assets/icons/edit-icon.svg";
import { useNavigate } from 'react-router-dom'


const ClaimMasterTable = ({ list, pageNo, itemsPerPage, deleteRow }) => {
  const navigate = useNavigate();

  const handleEdit = (id) => {
    navigate('/authorised/update-claim/' + id)
  }

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table" className="custom-table datasets-table" >
        <TableHead>
          <TableRow className="cm_table_head">
            <TableCell> <div className='tableHeadCell'> S.No </div></TableCell>
            <TableCell> <div className='tableHeadCell'>Type of expense </div></TableCell>
            <TableCell> <div className='tableHeadCell'> Field </div></TableCell>
            <TableCell> <div className='tableHeadCell'> Value</div></TableCell>
            <TableCell> <div className='tableHeadCell'> Unit </div></TableCell>
            <TableCell> <div className='tableHeadCell'> Price Per unit </div></TableCell>
            <TableCell> <div className='tableHeadCell'> Profile </div></TableCell>
            <TableCell> <div className='tableHeadCell'> Action </div></TableCell>
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
                <TableCell>{row?.expenseType}</TableCell>
                <TableCell>{row?.field?.field ?? "-"}</TableCell>
                <TableCell>{row?.field?.subField ?? "-"} </TableCell>
                <TableCell>{row?.unit ?? "-"}</TableCell>
                <TableCell>{row?.unitPrice}</TableCell>
                <TableCell>{row?.profile}</TableCell>
                <TableCell className="edit-cell action-cell">
                  <Button className='form_icon' ><img src={EditIcon} onClick={() => handleEdit(row?._id)} alt='' /></Button>
                  <Button className='form_icon' onClick={() => deleteRow(row?._id)}><img src={DeleteIcon} alt='' /></Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer >
  );
}

export default ClaimMasterTable