import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import moment from 'moment'
import Button from "@mui/material/Button";
import EditIcon from "../../assets/icons/edit-icon.svg";
import DeleteIcon from "../../assets/icons/icon_trash.svg";
import { Link } from 'react-router-dom'

export default function MappingList(props) {
  let { list, pageNo, itemsPerPage, handleUpdate, deleteMappingObject, handleCopyFormMapping } = props


  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table" className="custom-table datasets-table">
        <TableHead>
          <TableRow className="cm_table_head">
            <TableCell> <div className='tableHeadCell'> Sr.No </div></TableCell>
            <TableCell> <div className='tableHeadCell'> Product </div></TableCell>
            <TableCell> <div className='tableHeadCell'> Pre Stage </div></TableCell>
            <TableCell> <div className='tableHeadCell'> Pre Status </div></TableCell>
            <TableCell> <div className='tableHeadCell'> Customer Response </div></TableCell>
            <TableCell> <div className='tableHeadCell'> Subject </div></TableCell>
            <TableCell> <div className='tableHeadCell'> Activity </div></TableCell>
            <TableCell> <div className='tableHeadCell'> Future Activity </div></TableCell>
            <TableCell> <div className='tableHeadCell'> Subject Prefilled </div></TableCell>
            <TableCell> <div className='tableHeadCell'> Type </div></TableCell>
            <TableCell> <div className='tableHeadCell'> Reason For DQ </div></TableCell>
            <TableCell> <div className='tableHeadCell'> Verified Documents </div></TableCell>
            <TableCell> <div className='tableHeadCell'> Feature Explained </div></TableCell>
            <TableCell> <div className='tableHeadCell'> Form </div></TableCell>
            {/* <TableCell> <div className='tableHeadCell'> Active/Deactive </div></TableCell> */}
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
                <TableCell>{row?.product ?? '-'}</TableCell>
                <TableCell>{row?.stageName ?? '-'}</TableCell>
                <TableCell>{row?.statusName ?? '-'}</TableCell>
                <TableCell>{row?.customerResponse ?? '-'}</TableCell>
                <TableCell>{row?.subject ?? '-'}</TableCell>
                <TableCell>{row?.activityName ?? '-'}</TableCell>
                <TableCell>{row?.futureActivityName ?? '-'}</TableCell>
                <TableCell>{(row?.subjectPreFilled === true ? 'Yes' : 'No')}</TableCell>
                <TableCell>{row?.type ?? '-'}</TableCell>
                <TableCell>{(row?.reasonForDQ === true ? 'Yes' : 'No')}</TableCell>
                <TableCell>{(row?.verifiedDoc === true ? 'Yes' : 'No')}</TableCell>
                <TableCell>{(row?.featureExplained === true ? 'Yes' : 'No')}</TableCell>
                <TableCell>{row?.formId ?? '-'}</TableCell>
                <TableCell className="edit-cell action-cell">
                  <div className="button-row" style={{ display: 'flex' }}>
                    <Button className="form_icon" onClick={() => handleCopyFormMapping(row)}>
                      <div style={{ color: "#f45e29", cursor: 'pointer', marginLeft: '5px' }}>
                        <ContentCopyIcon style={{ width: '20px', marginTop: '6px' }} />
                      </div>
                    </Button>
                    <Button className="form_icon" onClick={() => handleUpdate(row)}>
                      <img src={EditIcon} alt="" />
                    </Button>
                    <Button className="form_icon" onClick={() => deleteMappingObject(row)}>
                      <img src={DeleteIcon} alt="" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
