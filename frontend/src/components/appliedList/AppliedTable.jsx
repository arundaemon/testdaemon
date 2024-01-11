import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import CubeDataset from "../../config/interface";
import { useEffect, useState } from "react";
import { AppliedListTable } from "./AppliedListTable";
import Env_Config from '../../config/settings'



export const AppliedTable = (props) => {
  let {list, handleHasInternalData=null } = props

  const [indexNo, setIndexNumber] = useState(null)
  const [reqStatus, setReqStatus] = useState()
  const userData = JSON.parse(localStorage.getItem('userData'))
  const financeProfile = Env_Config.FINANCE_PROFILES
  const [profileMatch, setProfileMatch] = useState(financeProfile.indexOf(userData?.crm_profile) > -1)


  const getClaimAmtList = (row, index, type) => {
    setIndexNumber(index)
    setReqStatus(type)
    handleHasInternalData(type);
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table
          aria-label="simple table"
          className="custom-table datasets-table crm-sd-claims-table crm-table-header-left-aligned"
        >
          <TableHead>
            <TableRow className="cm_table_head">
              <TableCell>
                <div className="tableHeadCell">E code</div>
              </TableCell>
              <TableCell>
                <div className="tableHeadCell">E name</div>
              </TableCell>
              <TableCell>
                <div className="tableHeadCell">Month</div>
              </TableCell>
              <TableCell>
                <div className="tableHeadCell">Total Count</div>
              </TableCell>
              <TableCell>
                <div className="tableHeadCell">
                  Total<br/>Claim amount
                </div>
              </TableCell>
              <TableCell>
                Pending<br/> Claim Amount
              </TableCell>
              <TableCell>
                Approved<br/> Claim Amount
              </TableCell>
              <TableCell>
                Rejected<br/> Claim Amount
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody >
            {list && list?.length && (list?.map((row, index) => {
              return (
                <>
                  <TableRow key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    // style={{display: 'flex'}}
                    >
                    <TableCell>
                      {row?.[CubeDataset?.UserClaim.requestByEmpCode]}
                    </TableCell>
                    <TableCell>
                      {row?.[CubeDataset?.UserClaim.requestByName]}
                    </TableCell>
                    <TableCell>{new Date(row[CubeDataset.UserClaim.visitDate]).toLocaleString('default', { month: 'long' })}</TableCell>
                    <TableCell>{row?.[CubeDataset?.UserClaim.totalRecords]}</TableCell>
                    <TableCell className="crm-sd-table-cell-anchor" sx={{textDecoration: 'underline', cursor: "pointer"}} >
                      <p onClick={() => getClaimAmtList(row, index, profileMatch? 'ALL':undefined)}>
                      {row?.[CubeDataset?.UserClaim.TotalClaimAmount]}
                      </p></TableCell>
                    <TableCell className="crm-sd-table-cell-anchor" sx={{textDecoration: 'underline', cursor: "pointer"}} >
                      <p onClick={() => getClaimAmtList(row, index, profileMatch? 'PENDING':'NEW')}>
                        {row?.[CubeDataset?.UserClaim.TotalPendingAmount]}
                      </p></TableCell>
                    <TableCell className="crm-sd-table-cell-anchor" sx={{textDecoration: 'underline', cursor: "pointer"}} >
                      <p onClick={() => getClaimAmtList(row, index, 'APPROVED')}>
                        {row?.[CubeDataset?.UserClaim.TotalApprovedAmount]}
                      </p></TableCell>
                    <TableCell className="crm-sd-table-cell-anchor" sx={{textDecoration: 'underline', cursor: "pointer"}} >
                      <p onClick={() => getClaimAmtList(row, index, 'REJECTED')}>
                        {row?.[CubeDataset?.UserClaim.TotalRejectedAmount]}
                      </p></TableCell>
                  </TableRow>
                  { index === indexNo ? <TableRow>
                    <AppliedListTable  requestByEmpCode={row?.[CubeDataset?.UserClaim?.requestByEmpCode]} reqDate={row[`${CubeDataset.UserClaim.visitDate}.month`]} reqStatus={reqStatus}/>
                  </TableRow> : ''}
                </>
              )
            }))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
