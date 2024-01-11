import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import moment from 'moment'
import { Link } from 'react-router-dom';
import UpArrow from '../../assets/image/arrowUp.svg'
import DownArrow from '../../assets/image/arrowDown.svg'
import CubeDataset from "../../config/interface";


export default function LeadTable(props) {
  let { list, pageNo, itemsPerPage, handleUpdate, handleSort, sortObj } = props

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
    <div>
      <TableContainer>
        <Table
          aria-label="customized table"
          className="custom-table datasets-table"
        >
          <TableHead>
            <TableRow className="cm_table_head">
              <TableCell><div className='tableHeadCell'>Sr.No</div></TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Owner</TableCell>
              <TableCell>Source</TableCell>
              <TableCell>Sub Source</TableCell>
              <TableCell >Stage</TableCell>
              <TableCell >Status</TableCell>
              <TableCell>City</TableCell>
              <TableCell >
                <div class="tableHeadCell">
                  Created Date {handleSortIcons("createdAt")}
                </div>
              </TableCell>
              <TableCell>
                <div class="tableHeadCell">
                  Last Modified Date {handleSortIcons("updatedAt")}
                </div>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list && list.length > 0 &&
              list.map((row, i) => {
                return <TableRow key={i}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }} >
                  <TableCell>
                    <div className='tableHeadCell'>
                      {(i + 1) + ((pageNo - 1) * itemsPerPage)}</div></TableCell>
                  <TableCell
                    style={{
                      color: '#488109', cursor: 'pointer',
                      fontWeight: 'bold',
                    }}> {<Link to={`/authorised/listing-details/${row[CubeDataset.Leadassigns.leadId]}`}>
                      {row[CubeDataset.Leadassigns.name]}</Link>}
                  </TableCell>
                  <TableCell>{row[CubeDataset.Leadassigns.assignedToDisplayName]}</TableCell>
                  <TableCell>{row[CubeDataset.Leadassigns.sourceName]}</TableCell>
                  <TableCell>{row?.[CubeDataset.Leadassigns.subSourceName]}</TableCell>
                  <TableCell>{row?.[CubeDataset.Leadassigns.stageName]}</TableCell>
                  <TableCell>{row?.[CubeDataset.Leadassigns.statusName]}</TableCell>
                  <TableCell>{row?.[CubeDataset.Leadassigns.city]}</TableCell>
                  <TableCell>{moment.utc(row[CubeDataset.Leadassigns.createdAt]).local().format('DD-MM-YYYY (hh:mm A)')}</TableCell>
                  <TableCell>{moment.utc(row[CubeDataset.Leadassigns.updatedAt]).local().format('DD-MM-YYYY (hh:mm A)')}</TableCell>
                </TableRow>
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
