import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { TableContainer, Box, TableHead, TableRow, Paper, Table, TableBody } from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { useNavigate } from 'react-router-dom';
import { getProductPurchasedList } from '../../../helper/DataSetFunction';
import { DisplayLoader } from '../../../helper/Loader';
import NoDataComponent from '../NoDataComponent';
import settings from '../../../config/settings';
import CubeDataset from "../../../config/interface";
import moment from 'moment';



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


const ProductPurchased = (props) => {
    const [productPurchasedList, setProductPurchasedList] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [luuid, setluuid] = useState(props.leadObj.leadId)
    const [empCode] = useState(JSON.parse(localStorage.getItem("userData"))?.employee_code);


    const fetchProductPurchasedList = () => {
        if (luuid) {
            getProductPurchasedList(luuid)
                .then((result) => {
                    setProductPurchasedList(result?.loadResponse?.results?.[0]?.data);
                })
                .catch((error) => {
                    console.error(error);
                })
        }
        setLoading(false)
        // details()

    }

    const toOrderNumber = (orderUrl) => {
        navigate('/authorised/order-number', { state: { id: 1, url: orderUrl } })
    }

    useEffect(() => {
        fetchProductPurchasedList()
    }, [luuid]);



    return (
        <Box>
            {loading ?
                <DisplayLoader />
                :
                (
                    (productPurchasedList === undefined || productPurchasedList?.length === 0) ?
                        <NoDataComponent message={'No Product Purchased History Available.'} />
                        :
                        (
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell>E Name</StyledTableCell>
                                            <StyledTableCell align="right">Order Number</StyledTableCell>
                                            <StyledTableCell align="right">Order Date</StyledTableCell>
                                            <StyledTableCell align="right">Order Status</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {productPurchasedList?.map((row) => {
                                            let orderUrl = `${settings.OMS_API_URL}/view-order-detail/${btoa(`${empCode}!==!${luuid}!==!${row?.[CubeDataset.EmployeeLeadsOrder.Ordno]}`)}`
                                            return (
                                                <StyledTableRow key={row.name}>
                                                    <StyledTableCell component="th" scope="row">{row?.[CubeDataset.EmployeeLeadsOrder.eName]}</StyledTableCell>
                                                    <StyledTableCell align="right">
                                                        <button onClick={() => toOrderNumber(orderUrl)} style={{ border: 'none', textDecoration: 'underline', cursor: 'pointer', color: '#4482FF', backgroundColor: 'white' }}>{row?.[CubeDataset.EmployeeLeadsOrder.Ordno]}</button>
                                                        {/* <a href={orderUrl} target="_blank">
                                                            {row?.[`${settings?.EMPLOYEE_LEADS_ORDER}.oOrdno`]}
                                                        </a> */}
                                                    </StyledTableCell>
                                                    <StyledTableCell align="right">{moment(row?.[CubeDataset.EmployeeLeadsOrder.Orderdate]).format('DD-MM-YYYY (hh:mm A)')}</StyledTableCell>
                                                    <StyledTableCell align="right">{row?.[CubeDataset.EmployeeLeadsOrder.orderStatus]}</StyledTableCell>
                                                </StyledTableRow>

                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )
                )
            }
        </Box>
    )
}

export default ProductPurchased