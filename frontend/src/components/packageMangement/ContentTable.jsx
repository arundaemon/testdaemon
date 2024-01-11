import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import EditIcon from "../../assets/icons/edit-icon.svg";


export default function ContentTable(props) {
  let { tableData, handleDeleteRow } = props
 
  const handleDelete = (row) => {
    handleDeleteRow(row)
  }
 
  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table" className="custom-table datasets-table">
        <TableHead>
          <TableRow className="cm_table_head">
            <TableCell> <div className='tableHeadCell'> Sr.No </div></TableCell>
            <TableCell> <div className='tableHeadCell'> Board Indicator</div></TableCell>
            <TableCell> <div className='tableHeadCell'> Board  </div></TableCell>
            <TableCell> <div className='tableHeadCell'> Class </div></TableCell>
            <TableCell> <div className='tableHeadCell'> Action </div></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData && tableData.length > 0 && tableData.map((data, i) => (
            <TableRow key={i}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">{i + 1}</TableCell>
              <TableCell>{data?. board_indicator_name}</TableCell>
              <TableCell>{data?.board_name ? data?.board_name : "All"}</TableCell>
              <TableCell>{data?.class?.length > 0 ? data?.class?.join(",") : "All"}</TableCell>
              <TableCell className="edit-cell action-cell">
                <Button className='form_icon' onClick={() => handleDelete(data)}>X</Button>
              </TableCell>
            </TableRow>

          ))}
          


        </TableBody>
      </Table>
    </TableContainer>
  );
}
