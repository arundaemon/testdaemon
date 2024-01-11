import { TableContainer, Paper, Table, TableBody, TableRow, TableCell } from "@mui/material";
import { CSVLink } from 'react-csv'


export default function PopupTable(props) {
    let { successFile, successFileLength, errorFile, errorFileLength } = props

    const fileHeader = [
        { label: 'Employee Code', key: 'empCode' },
        { label: 'Role Name', key: 'role_name' },
        { label: 'Profile Name', key: 'profile_name' },
        { label: 'Incentive', key: 'incentive' },
        { label: 'Target', key: 'target' },
        { label: 'Error', key: 'errorMessage' }
    ]

    const successExcel = {
        filename: 'Success.csv',
        headers: fileHeader,
        data: successFile
    }
    const errorExcel = {
        filename: 'Error.csv',
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
                        <TableCell align="left">Success File</TableCell>
                        <TableCell align="right">{successFileLength}</TableCell>
                        <TableCell align="right">{successFileLength > 0 ? <CSVLink CSVLink {...successExcel}>View</CSVLink> : "View"}</TableCell>
                    </TableRow>
                    <TableRow
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <TableCell align="left">Error File</TableCell>
                        <TableCell align="right">{errorFileLength}</TableCell>
                        <TableCell align="right">{errorFileLength > 0 ? <CSVLink CSVLink {...errorExcel}>View</CSVLink> : "View"}</TableCell>
                    </TableRow>

                </TableBody>
            </Table>
        </TableContainer >
    );
}
