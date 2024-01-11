import React, { useState } from 'react'
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Checkbox } from '@mui/material';
import moment from 'moment';
import toast from 'react-hot-toast';
import { stateCodeMapping } from '../../config/interface/local';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';

const GenerateInvoiceListTable = ({ list, checkedRows, setCheckedRows, pageNo, itemsPerPage }) => {

  const [selectAll, setSelectAll] = useState(false);

  const handleValidation = (row, type) => {
    let { schoolName, address, state, pinCode, stateCode, contactDetails } = row?.schoolDetails
    let { mobileNumber } = row?.schoolDetails?.contactDetails?.[0]

    let errorString = ""
    if (!schoolName || schoolName?.length == 0) {
      errorString += "School Code, "
    }
    if (!address || address?.length == 0) {
      errorString += "School Address , "
    }

    if (!state || state?.length == 0) {
      errorString += "State Name, "
    }

    if (!pinCode || pinCode?.length == 0) {
      errorString += "Pincode, "
    }
    if (!stateCode || stateCode?.length == 0 || !stateCodeMapping[stateCode]) {
      errorString += "State code, "
    }

    if (!contactDetails || contactDetails?.length == 0 || !mobileNumber || mobileNumber?.length == 0) {
      errorString += "Contact Number, "
    }

    if (errorString?.length > 0) {
      errorString = errorString.replace(/,([^,]*)$/, '$1')
      errorString += "not found!"
      toast.dismiss()
      if (type == "showAlert")
        toast.error(errorString)
      return false
    }
    return true

  }

  const handleSelectAll = (event) => {
    let validData = list?.filter(item => {
      if (handleValidation(item)) return item;
    })
    const newSelectAll = !selectAll;
    if (validData?.length == list?.length)
      setSelectAll(newSelectAll);
    if (event.target.checked) {
      setCheckedRows(validData)
    }
    else {
      setCheckedRows([])
    }
  };


  const handleRowCheck = (event, row) => {
    const checkValidation = handleValidation(row, "showAlert")
    if (!checkValidation) return

    if (event.target.checked) {
      setCheckedRows([...checkedRows, row]);
    } else {
      setCheckedRows(checkedRows.filter((checkedRow) => checkedRow !== row));
    }
  }

  const isChecked = (row) => {
    return checkedRows.includes(row);
  };

  return (
    <TableContainer component={Paper} className='crm-table-container'>
      <Table aria-label="simple table" className="" >
        <TableHead className='crm-table-head-size-md'>
          <TableRow >
            <TableCell align='left'>
              <Checkbox
                checked={selectAll}
                onChange={(event) => handleSelectAll(event)}
              />
            </TableCell>
            <TableCell align='left'>Sr.No.</TableCell>
            <TableCell align='left'>Implementation ID</TableCell>
            <TableCell align='left'>School Name</TableCell>
            <TableCell align='left'>School Code</TableCell>
            <TableCell align='left'>Product</TableCell>
            <TableCell align='left'>EMI Date</TableCell>
            <TableCell align='left'>EMI Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {list?.length > 0 &&
            list.map((row, i) => (
              <TableRow
                key={i}
              >
                <TableCell >
                  <Checkbox
                    checked={isChecked(row)}
                    onChange={(event) => handleRowCheck(event, row)}
                  />
                </TableCell>
                <TableCell >{(i + 1) + ((pageNo - 1) * itemsPerPage)}</TableCell>
                <TableCell >{row?.implementation_form_id}</TableCell>
                <TableCell >{row?.schoolDetails?.schoolName ?? "NA"}</TableCell>
                <TableCell >{row?.school_code}</TableCell>
                <TableCell >{row?.product_group_key ?? "NA"}</TableCell>
                <TableCell >{moment(row?.schedule_to).format('DD-MM-YYYY')}</TableCell>
                <TableCell >
                  <CurrencyRupeeIcon
                    sx={{ position: "relative", top: "2px", fontSize: "14px" }}
                  />
                  {Number(row?.schedule_amount)?.toLocaleString("en-IN", {
                    maximumFractionDigits: 2,
                  })}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer >
  );
}

export default GenerateInvoiceListTable