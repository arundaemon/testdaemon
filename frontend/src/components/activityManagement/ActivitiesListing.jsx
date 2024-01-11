import { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button } from '@mui/material';
import EditIcon from "../../assets/icons/edit-icon.svg";
import DeleteIcon from "../../assets/icons/icon_trash.svg";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import UpArrow from '../../assets/image/arrowUp.svg'
import DownArrow from '../../assets/image/arrowDown.svg'


export default function ActivitiesListing({ list, openInPopup, deleteActivityOne, pageNo, handleSort, sortObj, itemsPerPage, ...other }) {
    const handleSortIcons = (key) => {
        //   if (sortObj?.sortKey !== key) {
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
    };


    return (
        <TableContainer className=' activity-table' component={Paper} {...other}>
            <div className='journey-list-heading'>
                <h4>Activity Scoring Matrix</h4>
                {/* <p>Loremispum Loremispum Loremispum</p> */}
            </div>
            <Table aria-label="customized table" className="custom-table datasets-table">
                <TableHead >
                    <TableRow className='cm_table_head'>
                        {/* <TableCell >S.No.</TableCell> */}
                        <TableCell ><div className='tableHeadCell'> ID {handleSortIcons('ID')}</div></TableCell>
                        <TableCell >Activity Name</TableCell>
                        <TableCell ><div className='tableHeadCell'>User Type {handleSortIcons('userType')}</div></TableCell>
                        <TableCell ><div className='tableHeadCell'>Created By & Date {handleSortIcons('createdAt')}</div></TableCell>
                        <TableCell ><div className='tableHeadCell'>Last Modified By & Date {handleSortIcons('updatedAt')}</div></TableCell>
                        <TableCell >Score</TableCell>
                        <TableCell >Attendance</TableCell>
                        <TableCell >Task</TableCell>
                        <TableCell >Approval</TableCell>
                        <TableCell >Calling</TableCell>
                        <TableCell >Non-Calendar</TableCell>
                        <TableCell >Category</TableCell>
                        <TableCell >Action</TableCell>

                    </TableRow>
                </TableHead>

                <TableBody>
                    {list && list.length > 0 && list.map((row, i) => (
                        <TableRow key={i}>
                            {/* <TableCell>{(i + 1) + ((pageNo - 1) * itemsPerPage)}</TableCell> */}

                            <TableCell >{row?.ID ?? '-'}</TableCell>
                            <TableCell className='table-text-correction table-text-correction'>{row?.activityName ?? '-'}</TableCell>
                            <TableCell>{row?.userType ?? '-'}</TableCell>

                            <TableCell>{row?.createdBy ?? '-'}
                                <div>{moment(row?.createdAt).format('DD-MM-YY, hh:mm A')}</div>
                            </TableCell>

                            <TableCell>{row?.modifiedBy ?? '-'}
                                <div>{moment(row?.updatedAt).format('DD-MM-YY, hh:mm A')}</div>
                            </TableCell>





                            <TableCell>{row?.score ?? '-'}</TableCell>
                            <TableCell>{row?.attendance.toString() === "true" ? "Yes" : "No"}</TableCell>
                            <TableCell>{row?.task.toString() === "true" ? "Yes" : "No"}</TableCell>
                            <TableCell>{row?.approval.toString() === "true" ? "Yes" : "No"}</TableCell>
                            <TableCell>{row?.calling ? "Yes" : "No"}</TableCell>
                            <TableCell>{row?.nonCalendar ? "Yes" : "No"}</TableCell>
                            <TableCell>{row?.categoryName ?? '-'}</TableCell>



                            <TableCell className="edit-cell action-cell">

                                {row?.userType === "Customer" ?
                                    <Link className='link' to={{ pathname: `/authorised/update-customer-activity/${row?._id}` }}>
                                        <Button className='form_icon'><img src={EditIcon} alt='' /></Button>
                                    </Link>
                                    :
                                    <Link className='link' to={{ pathname: `/authorised/update-employee-activity/${row?._id}` }}>
                                        <Button className='form_icon'><img src={EditIcon} alt='' /></Button>
                                    </Link>
                                }

                                <Button className='form_icon' onClick={() => deleteActivityOne(row)}><img src={DeleteIcon} alt='' /></Button>
                            </TableCell>
                        </TableRow>))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

ActivitiesListing.propTypes = {
    list: PropTypes.array.isRequired
}





// onClick={() => openInPopup(row)}

// onClick={()=>handleNavigation(`/authorised/update-journey`)} 
// onClick={()=>handleNavigation('/authorised/get-journey')}
