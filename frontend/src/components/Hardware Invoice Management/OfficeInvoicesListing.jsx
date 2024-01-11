import React, { useState } from 'react'
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button, TextField, Modal, Fade, Box, InputAdornment, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { getUserData } from '../../helper/randomFunction/localStorage';
import { cancelHardwareInvoice } from '../../config/services/packageBundle';
import moment from 'moment';
import toast from 'react-hot-toast';
import Pagination from '../../pages/Pagination';
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: '30%',
  bgcolor: "background.paper",
  border: "2px solid #fff",
  boxShadow: "0px 0px 4px #0000001A",
  p: 4,
  borderRadius: "4px",
};

const OfficeInvoicesListing = ({ list, pageNo, itemsPerPage, type, cancelInvoiceCheck, setCancelInvoiceCheck, setPagination, lastPage }) => {
  const [toggleCancelModal, setToggleCancelModal] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState()
  const navigate = useNavigate()
  const loginData = getUserData('loginData')
  const uuid = loginData?.uuid

  const columnNameArray =
    ["Sr.No",
      "Invoice ID",
      "Ship To",
      "Bill To",
      "Units",
      "Invoice Amount",
      "Date",
      "Action"
    ]

  const handleUpdateInvoice = (data) => {
    if (type === "saved") {
      let { hw_invoice_auto_id } = data
      navigate(`/authorised/update-office-invoice/${hw_invoice_auto_id}`, { state: { OfficeInvoiceRowData: data } })
    }
  }

  const handleCancel = async (id) => {
    try {
      let params = { uuid, hw_invoice_auto_id: id, hw_invoice_for: "OFFICE", invoice_status: 3 }
      let res = await cancelHardwareInvoice(params);
      let { message, status } = res?.data
      if (status == 1) {
        toast.success(message)
        setCancelInvoiceCheck(!cancelInvoiceCheck)
      }
      if (status == 0) toast.error(message)
      setToggleCancelModal(!toggleCancelModal)
    }
    catch (error) {
      console.error("An error occurred:", error);
    }
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table aria-label="simple table" className="custom-table datasets-table" >
          <TableHead>
            <TableRow className="cm_table_head">
              {columnNameArray?.map(columnName => <TableCell> <div className='tableHeadCell'> {columnName}</div></TableCell>)}
            </TableRow>
          </TableHead>
          <TableBody>
            {list && list?.length > 0 &&
              list.map((row, i) => (
                <TableRow
                  key={i}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {(i + 1) + ((pageNo - 1) * itemsPerPage)}
                  </TableCell>
                  <TableCell>{row?.invoice_number ?? "NA"} </TableCell>
                  <TableCell>{row?.bill_to_details?.address ?? "NA"}</TableCell>
                  <TableCell>{row?.consignee_details?.address ?? "NA"}</TableCell>
                  <TableCell >{row?.total_hw_units ?? "NA"}</TableCell>
                  <TableCell >
                    <CurrencyRupeeIcon
                      sx={{ position: "relative", top: "2px", fontSize: "18px" }}
                    />
                    {Number(row?.total_billing_amount)?.toLocaleString("en-IN", {
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell >{moment.unix(row?.created_on).format('DD-MM-YYYY')}</TableCell>
                  <TableCell>
                    {type == "saved" ?
                      <span style={{ cursor: 'pointer', color: '#4482FB', marginRight: '10px', textDecoration: 'underline' }} onClick={() => handleUpdateInvoice(row)}>{(type === "saved" && "Update")}</span>
                      :
                      <span style={{ cursor: row?.invoice_file_path ? 'pointer' : 'not-allowed', color: '#4482FB', textDecoration: 'underline' }}>
                        <a href={row?.invoice_file_path}>Download</a>
                      </span>

                    }

                    {type === "saved" &&
                      <span style={{ cursor: 'pointer', color: '#4482FB', textDecoration: 'underline' }} onClick={() => { setToggleCancelModal(!toggleCancelModal); setSelectedInvoice(row?.hw_invoice_auto_id) }}>{"Cancel"}</span>
                    }
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <div className='center cm_pagination'>
          <Pagination pageNo={pageNo} setPagination={setPagination} lastPage={lastPage} />
        </div>
      </TableContainer >
      <Modal
        hideBackdrop={true}
        open={toggleCancelModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="targetModal1"
      >

        <Box sx={style} >
          <div >
            <Typography variant="subtitle1"
            >
              {`Are you sure you want to cancel this invoice?`}
            </Typography>
          </div>
          <Box style={{ marginBottom: 0, marginRight: 0 }} className="modal-footer text-right" >
            <Button onClick={() => setToggleCancelModal(!toggleCancelModal)} className={" report_form_ui_btn cancel mr-2"} color="primary" variant="outlined" > No </Button>
            <Button onClick={() => handleCancel(selectedInvoice)} color="primary" autoFocus className={" report_form_ui_btn submit"} variant="contained"> Yes </Button>
          </Box>
        </Box>
      </Modal>
    </>
  )
}

export default OfficeInvoicesListing