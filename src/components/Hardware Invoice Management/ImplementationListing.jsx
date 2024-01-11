import React, { useContext } from 'react'
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import Pagination from '../../pages/Pagination';
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import toast from 'react-hot-toast';
import { stateCodeMapping } from '../../config/interface/local';

const ImplementationListing = ({ list, pageNo, itemsPerPage, setPagination, lastPage }) => {
  const navigate = useNavigate()

  const handleGenerate = async (data) => {
    let { sumProductItemImpPrice, impFormNumber, schoolCode, schoolName, purchaseOrderCode, schoolPinCode, schoolAddress, schoolStateName, schoolStateCode } = data
    let errorString = ""
    if (!schoolCode || schoolCode?.length == 0) {
      errorString += "School code, "
    }
    if (!schoolName || schoolName?.length == 0) {
      errorString += "School Name, "
    }
    if (!purchaseOrderCode || purchaseOrderCode?.length == 0) {
      errorString += "PO code, "
    }

    if (!schoolPinCode || schoolPinCode?.length == 0) {
      errorString += "Pin code, "
    }

    if (!schoolAddress || schoolAddress?.length == 0) {
      errorString += "Address, "
    }
    if (!schoolStateName || schoolStateName?.length == 0) {
      errorString += "State Name, "
    }

    if (!schoolStateCode || schoolStateCode?.length == 0) {
      errorString += "State code, "
    }

    if (!stateCodeMapping[schoolStateCode] || stateCodeMapping[schoolStateCode]?.length == 0) {
      toast.dismiss()
      toast.error('State Code is not valid!')
      return
    }

    if (errorString?.length > 0) {
      errorString = errorString.replace(/,([^,]*)$/, '$1')
      errorString += "not found!"
      toast.dismiss()
      toast.error(errorString)
      return
    }

    if (sumProductItemImpPrice > 0)
      navigate('/authorised/fill-hardware-invoice/' + impFormNumber)
  }

  return (
    <TableContainer component={Paper} className='crm-table-container'>
      <Table aria-label="simple table" >
        <TableHead className='crm-table-head-size-md'>
          <TableRow >
            <TableCell > Sr.No </TableCell>
            <TableCell >  Implementation ID</TableCell>
            <TableCell >  School Name </TableCell>
            <TableCell >  School Code</TableCell>
            <TableCell >  Product Group</TableCell>
            <TableCell >  Units</TableCell>
            <TableCell >  HW Contract Amount </TableCell>
            <TableCell >  HW Invoiced Amount </TableCell>
            <TableCell >  Invoicing Due Amount </TableCell>
            <TableCell >  Action </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {list && list?.length > 0 &&
            list.map((row, i) => (
              <TableRow
                key={i}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row" >
                  {(i + 1) + ((pageNo - 1) * itemsPerPage)}
                </TableCell>
                <TableCell >{row?.impFormNumber}</TableCell>
                <TableCell >{row?.schoolName}</TableCell>
                <TableCell align='center'>{row?.schoolCode} </TableCell>
                <TableCell >{row?.uniqueProducts?.map(item => item)?.join(",")}</TableCell>
                <TableCell >{row?.sumImplementedUnit}</TableCell>
                <TableCell align='center' >

                  <CurrencyRupeeIcon
                    sx={{ position: "relative", top: "2px", fontSize: "18px" }}
                  />
                  {Number(row?.sumProductItemImpPrice)?.toLocaleString("en-IN", {
                    maximumFractionDigits: 2,
                  })}
                </TableCell>
                <TableCell align='center'>{"NA"}</TableCell>
                <TableCell align='center'>{"NA"}</TableCell>
                <TableCell align='center'>
                  <div onClick={() => handleGenerate(row)} className='crm-anchor crm-anchor-small' style={{ cursor: row?.sumProductItemImpPrice > 0 ? 'pointer' : 'not-allowed' }}>Generate</div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <div className='center cm_pagination'>
        <Pagination pageNo={pageNo} setPagination={setPagination} lastPage={lastPage} />
      </div>
    </TableContainer >
  )
}
export default ImplementationListing