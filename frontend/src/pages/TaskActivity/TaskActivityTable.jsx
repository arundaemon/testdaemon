import React from 'react'
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Checkbox,
} from "@mui/material";
import EditIcon from "../../../src/assets/icons/icon_edit.svg"
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };


function TaskActivityTable(props) {
  let { sortObj, handleSort, list, pageNo, itemsPerPage, handleStatusToggle } = props
  

  const handleSortIcons = (key) => {


    if (sortObj?.sortKey !== key) {
      return <>

        <ArrowDropUpIcon onClick={() => handleSort(key)} />
        <ArrowDropDownIcon onClick={() => handleSort(key)} />
      </>
    }
    else if (sortObj?.sortOrder === '-1') {
      return <ArrowDropUpIcon onClick={() => handleSort(key)} />
    }
    else if (sortObj?.sortOrder === '1') {
      return <ArrowDropDownIcon onClick={() => handleSort(key)} />
    }
  }


  return (
    <TableContainer className='table-container' component={Paper}>
      <div className='journey-list-heading'>
        <h4>Task Activity Mapping</h4>

      </div>
      {list && list.length > 0 && (<Table aria-label="customized table" className="custom-table datasets-table">
        <TableHead >
          <TableRow className='cm_table_head'>
            <TableCell>Sr.No</TableCell>
            <TableCell>Activity Name {handleSortIcons('activityName')}</TableCell>
            <TableCell>Task Name {handleSortIcons('taskName')}</TableCell>
            <TableCell>Calling Enabled</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>


        <TableBody>

          {list.map((row, i) => (
            <TableRow key={i}>
              <TableCell>{(i + 1) + ((pageNo - 1) * itemsPerPage)}.</TableCell>
              <TableCell align="centre">{row?.activityId?.activityName}</TableCell>
              <TableCell className='table-text-correction' align="centre">{row?.taskId?.taskName}</TableCell>
              <TableCell align="centre"><Checkbox {...label} checked={row?.callingEnabled} /></TableCell>
              <TableCell onClick={(e) => handleStatusToggle(e, row)} >
                <span className={row.status === 1 ? "cm_active" : "cm_inactive"}>{row.status === 1 ? "Active" : "Inactive"}</span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>)}
    </TableContainer>
  )
}

export default TaskActivityTable
