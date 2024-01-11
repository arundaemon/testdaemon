import PropTypes from 'prop-types';
import { useState } from 'react';
import moment from 'moment';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button } from '@mui/material';
import EditIcon from "../../assets/icons/edit-icon.svg";
import DeleteIcon from "../../assets/icons/icon_trash.svg";
import { Link } from 'react-router-dom'
import _ from 'lodash';
import UpArrow from '../../assets/image/arrowUp.svg'
import DownArrow from '../../assets/image/arrowDown.svg'
import { Box } from '@mui/system';





export default function JourneyList({ list, openInPopup, deleteJourneyOne, pageNo, itemsPerPage, handleJourneyStatus, handleSort, sortObj, toggleJourneyModal, handleSubmit, ...other }) {

    // const[statusLabel,setStatusLabel]=useState(false);


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
        <TableContainer className='table-container' component={Paper} {...other}>
            <div className='journey-list-heading'>
                <h4>Journey list</h4>
                {/* <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p> */}
            </div>

            <Table aria-label="customized table" className="custom-table datasets-table">
                <TableHead >
                    <TableRow className='cm_table_head'>
                        <TableCell >S.No.</TableCell>
                        <TableCell ><div className='tableHeadCell'>Journey Name {handleSortIcons('journeyName')}</div></TableCell>
                        <TableCell ><div className='tableHeadCell'>Created By & Date {handleSortIcons('createdAt')} </div></TableCell>
                        <TableCell ><div className='tableHeadCell'>Last Modified by & Date {handleSortIcons('updatedAt')}</div></TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell >Action</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {list && list.length > 0 && list.map((row, i) => (
                        <TableRow key={i}>
                            <TableCell>{(i + 1) + ((pageNo - 1) * itemsPerPage)}.</TableCell>

                            <TableCell>{row?.journeyName ?? '-'}</TableCell>
                            <TableCell>{row?.createdBy ?? '-'}<div>{moment(row?.createdAt).format('DD-MM-YY (HH:mm A)')}</div></TableCell>
                            <TableCell>{row?.modifiedBy ?? '-'}<div>{moment(row?.updatedAt).format('DD-MM-YY (HH:mm A)')}</div></TableCell>
                            <TableCell>
                                <span onClick={(e) => { handleSubmit(e, row); toggleJourneyModal() }} className={row.status === 1 ? "cm_active" : "cm_inactive"}>{row.status === 1 ? "Active" : "Inactive"}
                                </span>
                            </TableCell>

                            <TableCell className="edit-cell action-cell">
                                <Link to={{ pathname: `/authorised/update-journey/${row?._id}` }}>
                                    <Button className='form_icon'><img src={EditIcon} alt='' /></Button>
                                </Link>

                                <Button className='form_icon' onClick={() => deleteJourneyOne(row)}><img src={DeleteIcon} alt='' /></Button>
                            </TableCell>
                        </TableRow>))}
                </TableBody>
            </Table>

        </TableContainer>

    )
}

JourneyList.propTypes = {
    list: PropTypes.array.isRequired
}





