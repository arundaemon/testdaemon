import React, { useEffect, useState } from 'react'
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Checkbox, Button } from '@mui/material';
import { ReactComponent as FeatherDownloadIcon } from './../../assets/image/downloadIcon.svg'
import moment from 'moment'
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';

const GeneratedInvoiceListTable = ({ list }) => {

  const handleClick = (type) => {
    if (type === 'action') {
      console.log('action')
    }
    else if (type === 'reason') {
      console.log('reason')
    }
  }

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table" className="custom-table datasets-table">
        <TableHead>
          <TableRow className="cm_table_head">
            <TableCell align="left" style={{ width: '10%' }}>Implementation ID</TableCell>
            <TableCell align="left" style={{ width: '15%', whiteSpace: 'normal' }}>Invoice ID</TableCell>
            <TableCell align="left" style={{ width: '15%' }}>School Name</TableCell>
            <TableCell align="left" style={{ width: '10%' }}>School Code</TableCell>
            <TableCell align="left" style={{ width: '10%' }}>EMI Amount</TableCell>
            <TableCell align="left" style={{ width: '10%' }}>Realized Amount</TableCell>
            <TableCell align="left" style={{ width: '5%' }}>Freeze</TableCell>
            <TableCell align="left" style={{ width: '10%' }}>EMI Date</TableCell>
            <TableCell align="left" style={{ width: '10%' }}>Due Amount</TableCell>
            <TableCell align="left" style={{ width: '5%' }}>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {list?.length > 0 &&
            list.map((row, i) => (
              <TableRow key={i}>
                <TableCell>{row?.implementation_form_id ?? "NA"}</TableCell>
                <TableCell>{row?.invoice_number ?? "NA"}</TableCell>
                <TableCell>{row?.schoolDetails?.schoolName ?? "NA"}</TableCell>
                <TableCell>{row?.school_code ?? "NA"}</TableCell>
                <TableCell>
                  <CurrencyRupeeIcon
                    sx={{ position: "relative", top: "2px", fontSize: "15px" }}
                  />
                  {Number(row?.invoice_amount)?.toLocaleString("en-IN", {
                    maximumFractionDigits: 2,
                  })}
                </TableCell>
                <TableCell>
                  <CurrencyRupeeIcon
                    sx={{ position: "relative", top: "2px", fontSize: "15px" }}
                  />
                  {Number(row?.invoice_realize_amount)?.toLocaleString("en-IN", {
                    maximumFractionDigits: 2,
                  })}
                </TableCell>
                <TableCell>{row?.is_freezed === 1 ? "Yes" : "No"}</TableCell>
                <TableCell>{moment(row?.invoice_month).format('DD-MM-YYYY') ?? "NA"}</TableCell>
                <TableCell>
                  <CurrencyRupeeIcon
                    sx={{ position: "relative", top: "2px", fontSize: "15px" }}
                  />
                  {Number(row?.due_amount)?.toLocaleString("en-IN", {
                    maximumFractionDigits: 2,
                  })}
                </TableCell>
                <TableCell>
                  <Button style={{ cursor: row?.invoice_file_path ? "pointer" : "not-allowed" }}>
                    {row?.invoice_file_path ? (
                      <a href={row?.invoice_file_path} target="_blank" rel="noopener noreferrer">
                        <FeatherDownloadIcon />
                      </a>
                    ) : (
                      <FeatherDownloadIcon style={{ opacity: 0.5 }} />
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>

  );
}

export default GeneratedInvoiceListTable