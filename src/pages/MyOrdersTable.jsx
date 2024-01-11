import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { TableContainer, Table, TableHead, TableRow, TableBody, Checkbox, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import UpArrow from '../assets/image/arrowUp.svg'
import DownArrow from '../assets/image/arrowDown.svg'
import CubeDataset from "../config/interface";
import { Tooltip } from '@material-ui/core';
import settings from '../config/settings';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.action.hover,
        color: theme.palette.common.black,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));


const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: "#fff",
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

export default function MyOrderTable(props) {
    let { myOrdersList, empCode, toOrderNumber, pageNo, itemsPerPage, handleSort, sortObj, } = props

    const handleSortIcons = (key) => {
        return (
            <div className="arrowFilterDesign">
                <div className="upArrow" onClick={() => handleSort(key)}>
                    {sortObj?.sortKey !== key || sortObj?.sortOrder === "desc" ? <img src={UpArrow} alt="" /> : null}
                </div>

                <div className="downArrow" onClick={() => handleSort(key)}>
                    {sortObj?.sortKey !== key || sortObj?.sortOrder === "asc" ? <img src={DownArrow} alt="" /> : null}
                </div>
            </div>
        );
    }

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell>Sr. No</StyledTableCell>
                        <StyledTableCell >Name</StyledTableCell>
                        <StyledTableCell >
                            <div className="tableHeadCell">
                                Order Id  {handleSortIcons(CubeDataset.EmployeeLeadsOrder.Ordno)}
                            </div></StyledTableCell>
                        <StyledTableCell >Amount</StyledTableCell>
                        <StyledTableCell style={{ width: '14%' }}>
                            <div className="tableHeadCell"> Status {handleSortIcons(CubeDataset.EmployeeLeadsOrder.orderStatus)}
                            </div></StyledTableCell>
                        <StyledTableCell >Owner</StyledTableCell>
                        <StyledTableCell style={{ width: '14%' }}>Owner Id</StyledTableCell>
                        <StyledTableCell style={{ width: '14%' }}>
                            <div className="tableHeadCell">
                                Created Date {handleSortIcons(CubeDataset.EmployeeLeadsOrder.updatedOn)}
                            </div></StyledTableCell>

                    </TableRow>
                </TableHead>
                <TableBody>
                    {myOrdersList?.map((row, index) => {
                        let orderUrl = `${settings.OMS_API_URL}/view-order-detail/${btoa(`${empCode}!==!${row?.[CubeDataset.EmployeeLeadsOrder.lUuid]}!==!${row?.[CubeDataset.EmployeeLeadsOrder.Ordno]}`)}`;
                        return (
                            <StyledTableRow key={index}>
                                <StyledTableCell component="th" scope="row">
                                    <div className='tableHeadCell'>
                                        {(index + 1) + ((pageNo - 1) * itemsPerPage)}</div></StyledTableCell>
                                <StyledTableCell
                                    style={{
                                        color: '#488109', cursor: 'pointer',
                                        fontWeight: 'bold',
                                    }}>
                                    <Tooltip title={row?.[CubeDataset.EmployeeLeadsOrder.lStudentName]} placement="top-start">
                                        {<Link to={`/authorised/listing-details/${row?.[CubeDataset.EmployeeLeadsOrder.lUuid]}`}>
                                            {row?.[CubeDataset.EmployeeLeadsOrder.lStudentName]}</Link>}
                                    </Tooltip>
                                </StyledTableCell>
                                {/* <StyledTableCell component="th" scope="row">{row?.[CubeDataset.EmployeeLeadsOrder.lStudentName]}</StyledTableCell> */}
                                <StyledTableCell >
                                    <button
                                        onClick={() => toOrderNumber(orderUrl)}
                                        style={{ border: 'none', textDecoration: 'underline', cursor: 'pointer', color: '#4482FF', backgroundColor: 'white' }}
                                    >
                                        {row?.[CubeDataset.EmployeeLeadsOrder.Ordno]}
                                    </button>
                                </StyledTableCell>
                                <StyledTableCell >{row?.[CubeDataset.EmployeeLeadsOrder.orderTotalAmount]}</StyledTableCell>
                                <StyledTableCell >{row?.[CubeDataset.EmployeeLeadsOrder.orderStatus]}</StyledTableCell>
                                <StyledTableCell >{row?.[CubeDataset.EmployeeLeadsOrder.eName]}</StyledTableCell>
                                <StyledTableCell >{row?.[CubeDataset.EmployeeLeadsOrder.eEmpid]}</StyledTableCell>
                                <StyledTableCell >{moment(row?.[CubeDataset.EmployeeLeadsOrder.updatedOn]).format('DD-MM-YYYY (hh:mm A)')}</StyledTableCell>
                            </StyledTableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}