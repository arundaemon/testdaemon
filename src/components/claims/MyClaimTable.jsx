import React, { useEffect, useState } from 'react'
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Checkbox } from '@mui/material';
import moment from 'moment'
import { toast } from 'react-hot-toast';
import CubeDataset from '../../config/interface';


const MyClaimTable = ({ list, pageNo, itemsPerPage, checkedClaimRows, reportUserClaimList }) => {
  const [checkedRows, setCheckedRows] = useState([]);

  const handleRowCheck = (event, row) => {
    if (row?.claimStatus === 'PENDING AT BUH' || row?.claimStatus === 'PENDING AT L1' || row?.[CubeDataset.EmployeeClaim.claimStatus] === 'PENDING AT BUH' || row?.[CubeDataset.EmployeeClaim.claimStatus] === 'PENDING AT L1') {
      if (event.target.checked) {
        setCheckedRows([...checkedRows, row]);
      } else {
        setCheckedRows(checkedRows.filter((checkedRow) => checkedRow !== row));
      }
    }
    else {
      toast.dismiss()
      toast.error(`${row?.claimStatus ?? row?.[CubeDataset.EmployeeClaim.claimStatus]} can not be selected`)
      return
    }
  }

  const isChecked = (row) => {
    if (row?.claimStatus === 'PENDING AT BUH' || row?.claimStatus === 'PENDING AT L1' || row?.[CubeDataset.EmployeeClaim.claimStatus] === 'PENDING AT BUH' || row?.[CubeDataset.EmployeeClaim.claimStatus] === 'PENDING AT L1') {
      return checkedRows.includes(row);
    }
    else return false

  };

  const handleSelectAllMyClaim = (event) => {
    let newList = []
    if (reportUserClaimList?.length > 0) {
      newList = reportUserClaimList
    }
    else newList = list
    let data = newList?.filter(item => {
      if (item?.claimStatus === 'PENDING AT BUH' || item?.claimStatus === 'PENDING AT L1' || item?.[CubeDataset.EmployeeClaim.claimStatus] === 'PENDING AT BUH' || item?.[CubeDataset.EmployeeClaim.claimStatus] === 'PENDING AT L1') {
        return item
      }
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
      <Table aria-label="simple table" className="custom-table datasets-table" >
        <TableHead>
          <TableRow className="cm_table_head">
            <TableCell><Checkbox
              checked={isSelectAllChecked()}
              onChange={handleSelectAllMyClaim}
            /></TableCell>
            <TableCell> <div className='tableHeadCell' > Claim ID </div></TableCell>
            <TableCell> <div className='tableHeadCell'>Requested By </div></TableCell>
            <TableCell> <div className='tableHeadCell'> School Name </div></TableCell>
            <TableCell> <div className='tableHeadCell'> Type of Expense</div></TableCell>
            <TableCell> <div className='tableHeadCell'> Status </div></TableCell>
            <TableCell> <div className='tableHeadCell'> Raised Date </div></TableCell>
            <TableCell> <div className='tableHeadCell'> Approved Date/Rejected Date </div></TableCell>
            <TableCell> <div className='tableHeadCell'> Amount </div></TableCell>
            <TableCell> <div className='tableHeadCell'> Approved Amount </div></TableCell>

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
                  {row?.['EmployeeClaim.claimId'] ?? "-"}
                </TableCell>
                <TableCell>{row?.[CubeDataset.EmployeeClaim.requestByName] ?? '-'}</TableCell>
                <TableCell>{row?.[CubeDataset.EmployeeClaim.schoolName] ?? "-"}</TableCell>
                <TableCell>{row?.[CubeDataset.EmployeeClaim.expenseType] ?? "-"}</TableCell>
                <TableCell>{row?.[CubeDataset.EmployeeClaim.claimStatus] ?? '-'}</TableCell>
                <TableCell>{row?.[CubeDataset.EmployeeClaim.createdAt] ? moment(row?.[CubeDataset.EmployeeClaim.createdAt]).format('DD-MM-YYYY') : "-"}</TableCell>
                <TableCell>{(row?.[CubeDataset.EmployeeClaim.approvedDate] && (row?.[CubeDataset.EmployeeClaim.claimStatus] === 'Approved' || row?.[CubeDataset.EmployeeClaim.claimStatus] === 'APPROVED' || row?.[CubeDataset.EmployeeClaim.claimStatus] === 'Rejected' || row?.[CubeDataset.EmployeeClaim.claimStatus] === 'REJECTED')) ? moment(row?.['EmployeeClaim.approvedDate']).format('DD-MM-YYYY') : "-"}</TableCell>
                <TableCell>{row?.[CubeDataset.EmployeeClaim.claimAmount] ?? '-'}</TableCell>
                <TableCell ><div style={{ marginRight: '54px' }}> {(row?.[CubeDataset.EmployeeClaim.claimStatus] === 'Approved' || row?.[CubeDataset.EmployeeClaim.claimStatus] === 'APPROVED') ? row?.[CubeDataset.EmployeeClaim.approvedAmount] : '-'} </div></TableCell>

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

                /></TableCell>

                <TableCell component="th" scope="row">
                  {row?.claimId}
                </TableCell>
                <TableCell>{row?.requestBy_name ?? "-"}</TableCell>
                <TableCell>{row?.schoolName ?? "-"}</TableCell>
                <TableCell>{row?.expenseType ?? "-"}</TableCell>
                <TableCell>{row?.claimStatus ?? "-"}</TableCell>
                <TableCell>{moment(row?.createdAt).format('DD-MM-YYYY') ?? "-"}</TableCell>
                {row?.approvedDate ?
                  <TableCell>{moment(row?.approvedDate).format('DD-MM-YYYY')}</TableCell>
                  : <div style={{ marginLeft: '54px', marginTop: '20px' }}>-</div>
                }
                <TableCell>{row?.claimAmount ?? "-"}</TableCell>
                <TableCell ><div style={{ marginRight: '54px' }}> {(row?.claimStatus === 'Approved' || row?.claimStatus === 'APPROVED') ? row?.approvedAmount : "-"} </div></TableCell>

              </TableRow>
            )
            )}
        </TableBody>
      </Table>
    </TableContainer >
  );
}

export default MyClaimTable