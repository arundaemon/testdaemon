import {
    Box,
    Typography,
    TextField,
    InputAdornment,
    Grid,
    Autocomplete,
    Table,
    Paper,
    Stack,
    TableBody,
    TableContainer,
    TableCell,
    TableHead,
    TableRow,
    IconButton,
    Button,
    TablePagination,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getUserData } from '../../helper/randomFunction/localStorage'
import { listAddendumDetail } from '../../config/services/paymentCollectionManagment'
import { getSchoolBySchoolCode } from '../../config/services/school'

const styles = {
    borderShadow: {
        boxShadow: "0px 3px 6px #00000029",
        // borderRadius: "8px",
        width: "70%",
        "& input": { height: "0.5em !important" },
    },
    tableCell: {
        padding: "8px 0px 8px 16px !important",
        // border: "none",
    },
    tableContainer: {
        margin: "30px auto",
        // borderRadius: "8px",
        // boxShadow: "0px 3px 6px #00000029",
        paddingBottom: "20px",
    },
    loader: {
        height: "50vh",
        width: "90vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    }
}



const heading = ['Sr. No.', 'School Code', 'School Name', 'Total Outstanding Amount (INR)', 'Status', 'Action']

const PendingAddendumList = () => {

    let uuid = getUserData('loginData')?.uuid

    const [pageNo, setPagination] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [lastPage, setLastPage] = useState();
    const [addendumList, setAddendumList] = useState([])

    const listAddendumData = async () => {
        let list = await listAddendumDetail({ uuid, order: "ASC", page_offset: pageNo - 1, page_size: itemsPerPage })
        list = list?.data?.addendum_details
        let finalAddendumList = []

        for (let i = 0; i < list.length; i++) {
            let school = await getSchoolBySchoolCode(list[i]?.school_code)
            school = school?.result
            if (list[i].approval_status_id == 1) {
                finalAddendumList.push({ ...list[i], ...school, approval_status_value: "Pending" })
            }
            else if (list[i].approval_status_id == 2) {
                finalAddendumList.push({ ...list[i], ...school, approval_status_value: "Approved By Collection Head" })
            }
            else if (list[i].approval_status_id == 3) {
                finalAddendumList.push({ ...list[i], ...school, approval_status_value: "Rejected By Collection Head" })
            }
            else if (list[i].approval_status_id == 4) {
                finalAddendumList.push({ ...list[i], ...school, approval_status_value: "Approved By BUH" })
            }
            else if (list[i].approval_status_id == 5) {
                finalAddendumList.push({ ...list[i], ...school, approval_status_value: "Rejected By BUH" })
            }
            else if (list[i].approval_status_id == 6) {
                finalAddendumList.push({ ...list[i], ...school, approval_status_value: "Approved By Finance" })
            }
            else if (list[i].approval_status_id == 7) {
                finalAddendumList.push({ ...list[i], ...school, approval_status_value: "Rejected By Finance" })
            }
            else if (list[i].approval_status_id == 8) {
                finalAddendumList.push({ ...list[i], ...school, approval_status_value: "Deleted" })
            }
        }
        setAddendumList(finalAddendumList || [])
        if (list?.length < itemsPerPage) setLastPage(true)
    }

    useEffect(() => {
        listAddendumData()
    }, [pageNo, rowsPerPage])

    const handlePagination = (e, pageNumber) => {
        setPagination(pageNumber);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPagination(1);
        setItemsPerPage(event.target.value);
    };

    const navigate = useNavigate()

    return (
        <Box sx={{ margin: "20px" }}>
            <Box sx={{ boxShadow: "0px 0px 8px #00000029", padding: "20px", borderRadius: "8px" }}>
                <Box sx={{ fontWeight: "600", fontSize: "18px" }}>{'Pending Addendum Approvals'}</Box>
                <TableContainer component={Paper} sx={styles.tableContainer}>
                    <Table aria-label="customized table">
                        <TableHead>
                            <TableRow sx={{ borderTop: "1px solid #DEDEDE", borderBottom: "1px solid #DEDEDE", borderRadius: "0px !important" }}>
                                {heading.map((col, index) => (
                                    <TableCell
                                        align="left"
                                        key={index}
                                        sx={{ ...styles.tableCell, padding: "16px", }}
                                    >
                                        {col}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {addendumList.length > 0 && addendumList?.map((obj, index) => {
                                return (
                                    <TableRow sx={{ borderBottom: "1px solid #DEDEDE", "& td": styles.tableCell }}>
                                        <TableCell align="left">
                                            <Box sx={styles.productSec}>
                                                {index + 1}
                                            </Box>
                                        </TableCell>
                                        <TableCell align="left">
                                            <Box sx={styles.productSec}>
                                                {obj?.school_code}
                                            </Box>
                                        </TableCell>
                                        <TableCell align="left">
                                            <Box sx={styles.productSec}>
                                                {obj?.schoolName}
                                            </Box>
                                        </TableCell>
                                        <TableCell align="left">
                                            <Box sx={styles.productSec}>
                                                {obj?.total_due_amount}
                                            </Box>
                                        </TableCell>

                                        <TableCell align="left" sx={{ width: "20%" }}>
                                            <Box sx={styles.productSec}>
                                                {obj?.approval_status_value}
                                            </Box>
                                        </TableCell>

                                        <TableCell align="left" sx={{ width: "20%" }}>
                                            <Box sx={{ display: "flex" }}>
                                                <Box sx={{ color: "#4482FB", cursor: "pointer", textDecoration: "underline", fontWeight: "600", marginRight: "10px" }} onClick={() => {
                                                    navigate(`/authorised/edit-addendum-details/${obj?.addendum_auto_id}`, { state: { addendum_auto_id: obj?.addendum_auto_id } })
                                                }}>
                                                    {'Edit'}
                                                </Box>
                                                <Box sx={{ color: "#4482FB", cursor: "pointer", textDecoration: "underline", fontWeight: "600" }} onClick={() => {
                                                    navigate(`/authorised/view-addendum-details/${obj?.addendum_auto_id}`, { state: { addendum_auto_id: obj?.addendum_auto_id } })
                                                }}>
                                                    {'View'}
                                                </Box>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <div className="center cm_pagination">
                <TablePagination
                    component="div"
                    page={pageNo}
                    onPageChange={handlePagination}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={[10, 50, 100, 500, 1000]}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelDisplayedRows={({ page }) => {
                        return `Page: ${page}`;
                    }}
                    backIconButtonProps={{
                        disabled: pageNo === 1,
                    }}
                    nextIconButtonProps={{
                        disabled: lastPage,
                    }}
                />
            </div>
        </Box>
    )
}

export default PendingAddendumList