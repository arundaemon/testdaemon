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

export default function CampaignTable(props) {
  let { list, pageNo, itemsPerPage, handleUpdate, handleSort, sortObj } = props



  const parseSubSource = (subSourceId, subSources) => {
    let subSourceName = subSources?.find(item => item?._id === subSourceId)
    return subSourceName

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

  const handleCampaignStatus = (startDate, endDate) => {
    startDate = moment.utc(startDate).local().format('X')
    endDate = moment.utc(endDate).local().format('X')
    if (startDate > moment().format('X')) {
      return 'PLANNED'
    }
    else if (endDate < moment().format('X')) {
      return 'COMPLETED'
    }
    else if ((startDate <= moment().format('X')) && (endDate) >= moment().format('X')) {
      return 'IN PROGRESS'
    }

  }

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table" className="custom-table datasets-table">
        <TableHead>
          <TableRow className="cm_table_head">
            <TableCell> <div className='tableHeadCell'> Sr.No </div></TableCell>
            <TableCell> <div className='tableHeadCell'> Campaign Name {handleSortIcons('campaignName')} </div></TableCell>
            <TableCell> <div className='tableHeadCell'> Type </div></TableCell>
            <TableCell> <div className='tableHeadCell'> Source </div></TableCell>
            <TableCell> <div className='tableHeadCell'> Sub Source </div></TableCell>
            <TableCell> <div className='tableHeadCell'> Status </div></TableCell>
            <TableCell> <div className='tableHeadCell'> Created on {handleSortIcons('createdAt')}</div></TableCell>
            <TableCell> <div className='tableHeadCell'> Active/Deactive </div></TableCell>
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
                <TableCell>
                  <Tooltip title={row?.campaignName} placement="top-start">
                    <Link style={{ color: "#4482FF" }} to={{ pathname: `/authorised/update/${row?._id}` }}>
                      {row?.campaignName}
                    </Link>
                  </Tooltip>
                </TableCell>
                <TableCell>{row?.type}</TableCell>
                <TableCell>{row?.source?.leadSourceName}</TableCell>
                <TableCell>{parseSubSource(row?.subSource, row?.source?.subSource)?.leadSubSourceName} </TableCell>
                <TableCell>{handleCampaignStatus(row.startDate, row.endDate)}</TableCell>
                {/* <TableCell>{moment(row.endDate).format('X') < moment().format('X') ? 'COMPLETED' : 'IN PROGRESS'}</TableCell> */}
                <TableCell>{moment(row?.createdAt).format('DD-MM-YYYY (HH:mm A)')}</TableCell>
                <TableCell>{row.status === 1 ? 'Active' : 'Inactive'}</TableCell>
                <TableCell className="edit-cell action-cell">
                  <Button className='form_icon' onClick={() => handleUpdate(row?._id)}><img src={EditIcon} alt='' /></Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
