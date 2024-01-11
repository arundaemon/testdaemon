import React, { useState } from 'react'
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Checkbox, Modal, Fade, TextField, Typography, Grid, Button } from '@mui/material';
import { useStyles } from "../../css/ClaimForm-css";
import { invoiceProcessAction, updateInvoiceDetails } from '../../config/services/packageBundle';
import { getUserData } from '../../helper/randomFunction/localStorage';
import { ReactComponent as FeatherDownloadIcon } from './../../assets/image/downloadIcon.svg'
import toast from 'react-hot-toast';

const InvoiceEmailList = ({ list, fetchpendingInvoicesList }) => {
  const classes = useStyles()
  const [isModelReason, setIsModelReason] = useState(false)
  const [isModelAction, setIsModelAction] = useState(false)
  const [reason, setReason] = useState()
  const [updateInfo, setUpdateInfo] = useState()
  const loginData = getUserData('loginData')
  const uuid = loginData?.uuid

  const handleInvoiceAction = async (data) => {
    setIsModelAction(false)
    try {
      let params = {
        uuid,
        invoice_for: "SW",
        territory_code: data?.territory_code,
        invoice_status: "1",
        action_name: data?.invoiceAction,
        mail_to_emailids: ["abc@extramarks.com"]
      };

      const res = await invoiceProcessAction(params);
      let { message, status } = res?.data
      if (status == 1) {
        toast.dismiss()
        toast.success(message)
        fetchpendingInvoicesList()
      }
      else if (status == 0) {
        toast.dismiss()
        toast.error(message)
      }
    } catch (err) {
      console.error('An error occurred:', err);
    }
  }

 

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table" className="custom-table datasets-table" >
        <TableHead>
          <TableRow className="cm_table_head">
            <TableCell align='left'>BU Name</TableCell>
            <TableCell align='left'>S/W Amount</TableCell>
            <TableCell align='left'>Total Invoice</TableCell>
            <TableCell align='left'>EM Invoice</TableCell>
            <TableCell align='left'>E-Invoice</TableCell>
            <TableCell align='left'>IRN Generated</TableCell>
            <TableCell align='left'>Pending for IRN</TableCell>
            <TableCell align='left'>IRN Error</TableCell>
            <TableCell align='left'>PDF File</TableCell>
            <TableCell align='left'>Zip File</TableCell>
            <TableCell align='left'>Status</TableCell>
            <TableCell align='left'>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {list?.length > 0 &&
            list.map((row, i) => (
              <TableRow
                key={i}
              >
                <TableCell >{row?.territoryDetails?.territoryName ?? "NA"}</TableCell>
                <TableCell >{row?.total_invoice_amount}</TableCell>
                <TableCell >{row?.total_invoice_count}</TableCell>
                <TableCell >{row?.total_em_invoice_count}</TableCell>
                <TableCell >{row?.total_e_invoice_count}</TableCell>
                <TableCell >{row?.total_irn_generated_invoice_count}</TableCell>
                <TableCell >{row?.total_invoice_pending_for_irn_generation}</TableCell>
                <TableCell >{row?.total_irn_generation_fail_invoice_count}</TableCell>
                <TableCell >{row?.total_pdf_generated_invoice_count}</TableCell>
                <TableCell >
                  <Button style={{ cursor: row?.invoice_zip_file_path ? "cursor" : "not-allowed" }}>
                    <a href={row?.invoice_zip_file_path}>
                      <FeatherDownloadIcon />
                    </a>
                  </Button>
                </TableCell>
                <TableCell >{row?.total_invoice_count === row?.total_pdf_generated_invoice_count ? "Generated" : "Pending"}</TableCell>
                <TableCell >
                  <div onClick={() => handleInvoiceAction(row)} style={{ color: '#4482FB', textDecoration: 'underline', cursor: 'pointer' }}>{row?.invoiceAction}</div>
                </TableCell>
                {/* <TableCell >{row?.state_code}</TableCell> */}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default InvoiceEmailList