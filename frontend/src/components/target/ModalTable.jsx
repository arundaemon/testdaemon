import { TableContainer, Paper, Table, TableBody, TableRow, TableCell } from "@mui/material";
import { CSVLink } from 'react-csv'


export default function ModalTable(props) {
  let { successFile, successFileLength, errorFile, errorFileLength } = props

  const fileHeader = [
    { label: 'Employee Name', key: 'Employee Name' },
    { label: 'Employee Code', key: 'Employee Code' },
    { label: 'Role Name', key: 'Role Name' },
    { label: 'Product Name', key: 'Product' },
    { label: 'Monthly Units', key: 'Monthly Units' },
    { label: 'Monthly Target Value', key: 'Monthly Target Value' },
    { label: 'Status', key: 'message' }

  ]

  const successExcel = {
    filename: 'Success_Target.csv',
    headers: fileHeader,
    data: successFile
  }
  const errorExcel = {
    filename: 'Error_Target.csv',
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
