import { TableContainer, Paper, Table, TableBody, TableRow, TableCell } from "@mui/material";
import { CSVLink } from 'react-csv'

export default function PopupTable(props) {
    let { successFile, successFileLength, errorFile, errorFileLength } = props

    const fileHeader = [
        { label: 'Name', key: 'name' },
        { label: 'Mobile', key: 'mobile' },
        { label: 'Email', key: 'email' },
        { label: 'User_Type', key: 'userType' },
        { label: 'City', key: 'city' },
        { label: 'State', key: 'state'},
        { label: 'Learning Profile ', key: 'learningProfile'},
        { label: 'Reference', key: 'reference' },
        { label: 'Error Message', key: 'errorMessage' }
    ]

    const successExcel = {
        filename: 'Success.xls',
        headers: fileHeader,
        data: successFile
    }
    const errorExcel = {
        filename: 'Error.xls',
        headers: fileHeader,
        data: errorFile
    }
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 65 }} aria-label="simple table">
                <TableBody>
                    <TableRow
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <TableCell component="th" scope="row" />
                        <TableCell align="left">Success File</TableCell>
                        <TableCell align="left">{successFileLength}</TableCell>
                        <TableCell align="left">{successFileLength > 0 ? <CSVLink {...successExcel}>View</CSVLink> : "View"}</TableCell>
                    </TableRow>

                    <TableRow
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <TableCell component="th" scope="row" />
                        <TableCell align="left">Error File</TableCell>
                        <TableCell align="left">{errorFileLength}</TableCell>
                        <TableCell align="left">{errorFileLength > 0 ? <CSVLink {...errorExcel}>View</CSVLink> : "View"}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
}
