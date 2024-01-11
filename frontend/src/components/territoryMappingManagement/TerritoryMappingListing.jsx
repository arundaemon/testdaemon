import * as React from "react";
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button } from '@mui/material';
import moment from 'moment'
import EditIcon from "../../assets/icons/edit-icon.svg";
import { Link, useNavigate } from 'react-router-dom'
import UpArrow from '../../assets/image/arrowUp.svg'
import DownArrow from '../../assets/image/arrowDown.svg'

const TerritoryMappingListing = ({ list, pageNo, itemsPerPage, search, handleSort, sortObj }) => {
  const navigate = useNavigate();

  const handleUpdate = (territoryId) => {
    navigate('/authorised/updateTerritory/' + territoryId)
  }

  const handleSortIcons = (key) => {
    return (
      <div className="arrowFilterDesign">
        <div className="upArrow" onClick={() => handleSort(key)}>
          {sortObj?.sortKey !== key || sortObj?.sortOrder === "-1" ? <img src={UpArrow} alt="" /> : null}
        </div>
        <div className="downArrow" onClick={() => handleSort(key)}>
          {sortObj?.sortKey !== key || sortObj?.sortOrder === "1" ? <img src={DownArrow} alt="" /> : null}
        </div>
      </div>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table" className="custom-table datasets-table" >
        <TableHead>
          <TableRow className="cm_table_head">
            <TableCell> <div className='tableHeadCell'> Sr.No </div></TableCell>
            <TableCell> <div className='tableHeadCell'> ID {handleSortIcons('territoryCode')}</div></TableCell>
            <TableCell> <div className='tableHeadCell'> Territory {handleSortIcons('territoryName')} </div></TableCell>
            <TableCell> <div className='tableHeadCell'> Created Date {handleSortIcons('createdAt')}</div></TableCell>
            <TableCell> <div className='tableHeadCell'> Last Modified by & Date {handleSortIcons('modifiedBy')}</div></TableCell>
            <TableCell> <div className='tableHeadCell'> Status </div></TableCell>
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
                <TableCell>{row?.territoryCode}</TableCell>
                <TableCell>{row?.territoryName}</TableCell>
                <TableCell>{moment(row?.createdAt).format('DD-MM-YYYY (HH:mm A)')} </TableCell>
                <TableCell>{row?.modifiedBy + " "}{moment(row?.updatedAt).format('DD-MM-YYYY (HH:mm A)')}</TableCell>
                <TableCell>{row?.status === 1 ? "Active" : "Inactive"}</TableCell>
                <TableCell className="edit-cell action-cell">
                  <Button className='form_icon' onClick={() => handleUpdate(row?._id)}><img src={EditIcon} alt='' /></Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer >
  );
}

export default TerritoryMappingListing