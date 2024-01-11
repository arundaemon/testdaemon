import React, { useState } from 'react'
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { getUserData } from '../../helper/randomFunction/localStorage';
import { cancelHardwareInvoice } from '../../config/services/packageBundle';
import moment from 'moment';
import toast from 'react-hot-toast';
import Pagination from '../../pages/Pagination';
import MaxHeightMenu from './MaxHeightMenu';
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";

const HardwareInvoicesListing = ({ list, pageNo, itemsPerPage, type, cancelInvoiceCheck, setCancelInvoiceCheck, setPagination, lastPage }) => {
  const navigate = useNavigate()
  const loginData = getUserData('loginData')
  const [menuOptions] = useState(["Generate Voucher", "Update", "Cancel"])
  const uuid = loginData?.uuid

  const columnNameArray =
    ["Sr.No",
      "Implementation ID",
      "Invoice ID",
      "School Name",
      "School Code",
      "Product Name",
      "Units",
      "Realized Amount",
      "Invoice Amount",
      "Due Amount",
      "Date",
      "Action"
    ]

  const handleUpdateInvoice = (data) => {
    let { implementation_id } = data
    navigate(`/authorised/update-invoice/${implementation_id}`, { state: { hardwareInvoiceRowData: data } })
  }

  const handleCancel = async (id) => {
    try {
      let params = { uuid, hw_invoice_auto_id: id, hw_invoice_for: "SCHOOL", invoice_status: 3 }
      let res = await cancelHardwareInvoice(params);
      let { message } = res?.data
      toast.success(message)
      setCancelInvoiceCheck(!cancelInvoiceCheck)
    }
    catch (error) {
      console.error("An error occurred:", error);
    }
  }

  return (
    <TableContainer component={Paper} className='crm-table-container'>
      <Table aria-label="simple table" >
        <TableHead>
          <TableRow className="cm_table_head">
            {columnNameArray?.map((columnName, i) => <TableCell key={i} >  {columnName}</TableCell>)}
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
                <TableCell >{row?.implementation_id}</TableCell>
                <TableCell > {row?.invoice_number ?? "NA"}</TableCell>
                <TableCell >{row?.consignee_details?.name} </TableCell>
                <TableCell >{row?.school_code}</TableCell>
                <TableCell >{row?.particular_details?.map(item => item?.particular_name).join(",")}</TableCell>
                <TableCell >{row?.total_hw_units}</TableCell>
                <TableCell >
                  <CurrencyRupeeIcon
                    sx={{ position: "relative", top: "2px", fontSize: "14px" }}
                  />
                  {Number(row?.total_realized_amount)?.toLocaleString("en-IN", {
                    maximumFractionDigits: 2,
                  })}
                </TableCell>
                <TableCell >
                  <CurrencyRupeeIcon
                    sx={{ position: "relative", top: "2px", fontSize: "14px" }}
                  />
                  {Number(row?.total_billing_amount)?.toLocaleString("en-IN", {
                    maximumFractionDigits: 2,
                  })}
                </TableCell>
                <TableCell >
                  <CurrencyRupeeIcon
                    sx={{ position: "relative", top: "2px", fontSize: "14px" }}
                  />
                  {Number(row?.total_due_amount)?.toLocaleString("en-IN", {
                    maximumFractionDigits: 2,
                  })}
                </TableCell>
                <TableCell style={{minWidth: '100px'}}>{row?.invoice_date ? moment.unix(row?.created_on).format('DD-MM-YYYY') : "NA"}</TableCell>
                {(type == 2 || type == "generate") ?
                  <TableCell >

                    <a className='crm-anchor crm-anchor-small' href={row?.invoice_file_path}>Download</a>
                  </TableCell>

                  :
                  <TableCell width="20%" style={{ display: 'flex', padding: '10px 50px' }} >

                    <MaxHeightMenu menuOptions={menuOptions} rowData={row} handleUpdateInvoice={handleUpdateInvoice} handleCancel={handleCancel} />
                  </TableCell>

                }
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

export default HardwareInvoicesListing