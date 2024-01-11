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
import EditIcon from "../../assets/icons/edit-icon.svg";
import DeleteIcon from "../../assets/icons/icon_trash.svg";



export default function CustomerResponseTable(props) {
    let { list, pageNo, itemsPerPage, deleteJourneyOne,updateJourneyOne} = props
    return (
        <TableContainer component={Paper}>
            <Table aria-label="simple table" className="custom-table datasets-table">
                <TableHead>
                    <TableRow className="cm_table_head">
                        <TableCell> <div className='tableHeadCell'> Sr.No </div></TableCell>
                        <TableCell> <div className='tableHeadCell'> Customer Response </div></TableCell>
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
                                <TableCell>{row?.customerResponse}</TableCell>
                                <TableCell className="edit-cell action-cell">
                                    <Button className='form_icon' onClick={() => updateJourneyOne(row)}><img src={EditIcon} alt='' /></Button>
                                    <Button className='form_icon' onClick={() => deleteJourneyOne(row)}><img src={DeleteIcon} alt='' /></Button>
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}