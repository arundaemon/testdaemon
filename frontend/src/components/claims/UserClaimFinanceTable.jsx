import React, { useEffect, useState } from 'react'
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button, Checkbox } from '@mui/material';
import DeleteIcon from "../../assets/icons/icon_trash.svg";
import EditIcon from "../../assets/icons/edit-icon.svg";
import { Link, useNavigate, useParams } from 'react-router-dom'
import moment from 'moment'
import { toast } from 'react-hot-toast';
import CubeDataset from '../../config/interface';

const UserClaimFinanceTable = ({ list, checkedClaimRows, reportUserClaimList }) => {
  const navigate = useNavigate();
  const [checkedRows, setCheckedRows] = useState([]);
  const pattern = /\/([^/]+)$/;
  const currentUrl = window.location.href

  const handleEdit = (row) => {
    if (row?.claimStatus === 'Approved' || row?.claimStatus === 'APPROVED' || row?.[CubeDataset.EmployeeClaim.claimStatus] === 'Approved' || row?.[CubeDataset.EmployeeClaim.claimStatus] === 'APPROVED') return null
    let id = row?._id ?? row?.[CubeDataset.EmployeeClaim.MongoID]
    navigate('/authorised/update-userClaim/' + id, { state: { id: 1, url: currentUrl } })
  }

  const handleRowCheck = (event, row) => {
    if (row?.claimStatus === 'Approved' || row?.claimStatus === 'APPROVED' || row?.[CubeDataset.EmployeeClaim.claimStatus] === 'Approved' || row?.[CubeDataset.EmployeeClaim.claimStatus] === 'APPROVED') {
      toast.dismiss()
      toast.error(`${row?.claimStatus ?? row?.[CubeDataset.EmployeeClaim.claimStatus]} can not be selected`)
      return
    }
    else if (event.target.checked) {
      setCheckedRows([...checkedRows, row]);
    } else {
      setCheckedRows(checkedRows.filter((checkedRow) => checkedRow !== row));
    }

  }

  const isChecked = (row) => {
    return checkedRows.includes(row);
  };

  const handleSelectAllUserClaim = (event) => {
    let newList = []
    if (reportUserClaimList?.length > 0) {
      newList = reportUserClaimList
    }
    else newList = list

    let data = newList?.filter(item => {
      if ((item?.claimStatus === 'Approved' || item?.claimStatus === 'APPROVED') || (item?.[CubeDataset.EmployeeClaim.claimStatus] === 'Approved' || item?.[CubeDataset.EmployeeClaim.claimStatus] === 'APPROVED')) {
      }
      else return item
    })
    if (event.target.checked) {
      setCheckedRows(data);
    } else {
      setCheckedRows([]);
    }
  };

  const isSelectAllChecked = () => {
    return (
      (list?.length > 0 && list.length === checkedRows.length) ||
      (reportUserClaimList?.length > 0 &&
        reportUserClaimList.length === checkedRows.length)
    );
  };

  useEffect(() => {
    checkedClaimRows(checkedRows);
  }, [checkedRows]);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table" className="custom-table datasets-table"  >
        <TableHead >
          <TableRow className="cm_table_head">
            <TableCell><Checkbox
              checked={isSelectAllChecked()}
              onChange={handleSelectAllUserClaim}
            /></TableCell>
            <TableCell > <div className='tableHeadCell' style={{ marginRight: '-10px' }} > Claim ID </div></TableCell>
            <TableCell> <div className='tableHeadCell'>Req by Emp Code </div></TableCell>
            <TableCell> <div className='tableHeadCell'>Req by Emp Name </div></TableCell>
            <TableCell > <div className='tableHeadCell'>Visit Date</div></TableCell>
            <TableCell> <div className='tableHeadCell'>Visit No.</div></TableCell>
            <TableCell> <div className='tableHeadCell'> School Name </div></TableCell>
            <TableCell> <div className='tableHeadCell'> Type of Expense</div></TableCell>
            <TableCell> <div className='tableHeadCell'>Claim Amount </div></TableCell>
            <TableCell> <div className='tableHeadCell'>Claim Status </div></TableCell>
            <TableCell> <div className='tableHeadCell'>Bill file </div></TableCell>
            <TableCell > <div className='tableHeadCell' style={{ marginRight: '-10px' }}> Raised Date </div></TableCell>
            <TableCell > <div className='tableHeadCell'> Action </div></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reportUserClaimList && reportUserClaimList.length > 0 ?
            reportUserClaimList.map((row, i) => (
              <TableRow
                key={i}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell><Checkbox
                  checked={isChecked(row)}
                  onChange={(event) => handleRowCheck(event, row)}

                /></TableCell>
                <TableCell component="th" scope="row">
                  {row?.[CubeDataset.EmployeeClaim.claimId] ?? "-"}
                </TableCell>
                <TableCell >{row?.[CubeDataset.EmployeeClaim.requestByEmpCode] ?? '-'}</TableCell >
                <TableCell>{row?.[CubeDataset.EmployeeClaim.requestByName] ?? "-"}</TableCell>
                <TableCell>{row?.[CubeDataset.EmployeeClaim.visitDate] ? moment(row?.[CubeDataset.EmployeeClaim.visitDate]).format('DD-MM-YYYY') : "-"}</TableCell>
                <TableCell>{row?.[CubeDataset.EmployeeClaim.visitNumber] ?? '-'}</TableCell>
                <TableCell>{row?.[CubeDataset.EmployeeClaim.schoolName] ?? "-"}</TableCell>
                <TableCell>{row?.[CubeDataset.EmployeeClaim.expenseType] ?? "-"}</TableCell>
                <TableCell>{row?.[CubeDataset.EmployeeClaim.claimAmount] ?? "-"}</TableCell>
                <TableCell>{row?.[CubeDataset.EmployeeClaim.claimStatus] ?? "-"}</TableCell>
                <TableCell>
                  {
                    <a href={row?.[CubeDataset.EmployeeClaim.billFile]} target='_blank'>{row?.[CubeDataset.EmployeeClaim.billFile] && row?.[CubeDataset.EmployeeClaim.billFile]?.match(pattern)?.[1]}</a>
                  }
                </TableCell>
                <TableCell>{moment(row?.[CubeDataset.EmployeeClaim.createdAt]).format('DD-MM-YYYY') ?? "-"}</TableCell>
                <TableCell className="edit-cell action-cell">
                  <Button style={{ cursor: (row?.[CubeDataset.EmployeeClaim.claimStatus] === 'APPROVED' || row?.[CubeDataset.EmployeeClaim.claimStatus] === 'Approved') ? 'not-allowed' : null, }} className='form_icon' onClick={() => handleEdit(row)} ><img src={EditIcon} alt='' /></Button>
                </TableCell>

              </TableRow>
            ))
            :
            (list && list?.length > 0) &&
            list?.map((row, i) => (
              <TableRow
                key={i}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell><Checkbox
                  checked={isChecked(row)}
                  onChange={(event) => handleRowCheck(event, row)}
                />
                </TableCell>
                <TableCell component="th" scope="row">
                  {row?.claimId}
                </TableCell>
                <TableCell>{row?.requestBy_empCode ?? "-"}</TableCell>
                <TableCell>{row?.requestBy_name ?? "-"}</TableCell>
                <TableCell>{row?.visitDate ? moment(row?.visitDate).format('DD-MM-YYYY') : "-"}</TableCell>
                <TableCell align='center'>{row?.visitNumber ?? "-"}</TableCell>
                <TableCell>{row?.schoolName ?? "-"}</TableCell>
                <TableCell>{row?.expenseType ?? "-"}</TableCell>
                <TableCell>{row?.claimAmount ?? "-"}</TableCell>
                <TableCell>{row?.claimStatus ?? "-"}</TableCell>
                <TableCell>
                  {
                    <a href={row?.billFile} target='_blank'>{row?.billFile.match(pattern)?.[1]}</a>
                  }
                </TableCell>
                <TableCell>{moment(row?.createdAt).format('DD-MM-YYYY') ?? "-"}</TableCell>
                <TableCell className="edit-cell action-cell">
                  <Button style={{ cursor: (row?.claimStatus === 'APPROVED' || row?.claimStatus === 'Approved') ? 'not-allowed' : null, }} className='form_icon' onClick={() => handleEdit(row)} ><img src={EditIcon} alt='' /></Button>
                </TableCell>
              </TableRow>
            )
            )}
        </TableBody>
      </Table>
    </TableContainer >
  );
}

export default UserClaimFinanceTable
