import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Button } from '@mui/material';
import Paper from '@mui/material/Paper';
import UpArrow from '../../assets/image/arrowUp.svg'
import DownArrow from '../../assets/image/arrowDown.svg'
import EditIcon from "../../assets/icons/edit-icon.svg";
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';


export default function TaskTable ({ list, handleStatusToggle, pageNo, itemsPerPage, sortObj, handleSort, ...other }) {

  // let { list, handleStatusToggle, pageNo, itemsPerPage, sortObj, handleSort, ...others } = props
  const navigate = useNavigate();

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
    )
  }

  const handleNavigation = (row) => {
    let url = `/authorised/update-task/${row._id}`
    navigate(url)
  }

  return (
    <TableContainer component={Paper}>
      <div className='journey-list-heading' >
        <h4>Task List</h4>
      </div>
      <Table aria-label="customized table" className="custom-table datasets-table">
        <TableHead>
          <TableRow className="cm_table_head">
            <TableCell><div className='tableHeadCell'>Task Id {handleSortIcons('taskId')}</div></TableCell>
            <TableCell><div className='tableHeadCell'>Task Name {handleSortIcons('taskName')}</div></TableCell>
            <TableCell><div className='tableHeadCell'>Category {handleSortIcons('category')}</div></TableCell>
            <TableCell><div className='tableHeadCell'>Created by & Date {handleSortIcons('createdAt')}</div></TableCell>
            <TableCell><div className='tableHeadCell'>Modified by & Date {handleSortIcons('updatedAt')}</div></TableCell>
            <TableCell >Status</TableCell>
            <TableCell align='right'>Action</TableCell>
          </TableRow>

        </TableHead>
        <TableBody>
          {list &&
            list.length > 0 &&
            list.map((row, i) => (
              <TableRow key={i}>
                <TableCell >
                  {row.taskId}
                </TableCell>
                <TableCell className='table-text-correction' >{row.taskName}</TableCell>
                <TableCell >{row.category}</TableCell>
                <TableCell >{row?.createdBy ?? '-'}<div>{moment(row?.createdAt).format('DD-MM-YY (HH:mm A)')}</div></TableCell>
                <TableCell >{row?.modifiedBy ?? '-'}<div>{moment(row?.updatedAt).format('DD-MM-YY (HH:mm A)')}</div></TableCell>
                <TableCell onClick={(e) => handleStatusToggle(e, row)} >
                  <span className={row.status === 1 ? "cm_active" : "cm_inactive"}>{row.status === 1 ? "Active" : "Inactive"}</span>
                </TableCell>
                <TableCell className="edit-cell action-cell">
                  <Button className="form_icon" onClick={() => handleNavigation(row)}>
                    <img src={EditIcon} alt="edit icon" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}



TaskTable.propTypes = {
  list: PropTypes.array.isRequired
}