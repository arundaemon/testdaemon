import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import moment from 'moment'
import Button from "@mui/material/Button";
import Tooltip from '@mui/material/Tooltip';
import EditIcon from "../../assets/icons/edit-icon.svg";
import { Link } from 'react-router-dom'
import UpArrow from '../../assets/image/arrowUp.svg'
import DownArrow from '../../assets/image/arrowDown.svg'
import DeleteIcon from "../../assets/icons/icon_trash.svg";

export default function CrmMasterTable(props) {
  let { list, pageNo, itemsPerPage, handleUpdate, deleteCrmMasterObject,handleSort, sortObj } = props

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table" className="custom-table datasets-table">
        <TableHead>
          <TableRow className="cm_table_head">
            <TableCell> <div className='tableHeadCell'> Sr.No </div></TableCell>
            <TableCell> <div className='tableHeadCell'> Type </div></TableCell>
            <TableCell> <div className='tableHeadCell'> Value </div></TableCell>
            <TableCell> <div className='tableHeadCell'> Created by & date </div></TableCell>
            <TableCell> <div className='tableHeadCell'> Modified by & date </div></TableCell>
            <TableCell> <div className='tableHeadCell'> Action </div></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {list && list.length > 0 &&
            list.map((row, i) => (
              <TableRow
                key={i}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {(i + 1) + ((pageNo - 1) * itemsPerPage)}
                </TableCell>
                
                <TableCell>{row?.type}</TableCell>
                <TableCell>{row?.value}</TableCell>
                <TableCell>{row?.createdBy ?? '-'}<div>{moment(row?.createdAt).format('DD-MM-YY (HH:mm A)')}</div></TableCell>
                <TableCell >{row?.modifiedBy ?? '-'}<div>{moment(row?.updatedAt).format('DD-MM-YY (HH:mm A)')}</div></TableCell>
                <TableCell className="edit-cell action-cell">
                  <Button className='form_icon' onClick={() => handleUpdate(row)}><img src={EditIcon} alt='' /></Button>
                  <Button className='form_icon' onClick={() => deleteCrmMasterObject(row)}><img src={DeleteIcon} alt='' /></Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
