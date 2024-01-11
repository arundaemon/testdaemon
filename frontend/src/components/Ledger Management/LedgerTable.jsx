import React, { useEffect, useState } from "react";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import LedgerViewModal from "./LedgerViewModal";
import CubeDataset from "../../config/interface";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";

const LedgerTable = ({ list, pageNo, itemsPerPage }) => {
  const navigate = useNavigate();
  const [modal1, setModal1] = useState(false);
  const [ledgerDetails, setledgerDetails] = useState({});


  const isRedirectView = async (obj) => {
    setModal1(true)
    setledgerDetails(obj)
  };


  const isRedirect = async (obj) => {
    navigate("/authorised/EditLedger", {
      state: {
        data: obj,
      },
    });
  };



  return (
    <>
      <TableContainer component={Paper}>
        <Table
          aria-label="simple table"
          className="custom-table datasets-table crm-sd-claims-table crm-table-header-left-aligned"
        >
          <TableHead>
            <TableRow className="cm_table_head">
              <TableCell>S.No.</TableCell>
              <TableCell>School Code</TableCell>
              <TableCell>School Name</TableCell>
              <TableCell>City</TableCell>
              <TableCell>Contract Value</TableCell>
              <TableCell>OS Months</TableCell>
              <TableCell>OS Amount</TableCell>
              <TableCell>View</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list &&
              list?.length > 0 &&
              list.map((row, i) => (
                <TableRow
                  key={i}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {i + 1 + (pageNo - 1) * itemsPerPage}
                  </TableCell>
                  <TableCell>{row?.[CubeDataset?.Ledger.schoolCode]}</TableCell>
                  <TableCell>{
                    row?.[CubeDataset?.Ledger.schoolName]
                  }
                  </TableCell>
                  <TableCell>{
                    row?.[CubeDataset?.Ledger.city]
                  }</TableCell>
                  <TableCell>
                    <>
                      {row?.[CubeDataset?.Ledger.totalContractValue] !== null ? (
                        <>
                          <CurrencyRupeeIcon
                            sx={{
                              position: "relative",
                              top: "2px",
                              fontSize: "14px",
                            }}
                          />
                          {Number(row?.[CubeDataset?.Ledger.totalContractValue])?.toLocaleString("en-IN", {
                            maximumFractionDigits: 2,
                          })}
                          / -
                        </>
                      ) : (
                        "N/A"
                      )}
                    </>
                  </TableCell>

                  <TableCell>{
                    row?.[CubeDataset?.Ledger.osMonths] ? row?.[CubeDataset?.Ledger.osMonths] : "N/A"
                  }</TableCell>
                  <TableCell>
                    {row?.[CubeDataset?.Ledger.osAmount] !== null ? (
                      <>
                        <CurrencyRupeeIcon
                          sx={{
                            position: "relative",
                            top: "2px",
                            fontSize: "14px",
                          }}
                        />
                        {Number(row?.[CubeDataset?.Ledger.osAmount])?.toLocaleString("en-IN", {
                          maximumFractionDigits: 2,
                        })}
                        / -
                      </>
                    ) : (
                      "N/A"
                    )}
                  </TableCell>
                  <TableCell className="crm-sd-table-cell-anchor">
                    <div onClick={() => isRedirectView(row)}>
                      View Ledger
                    </div>
                  </TableCell>
                  <TableCell className="crm-sd-table-cell-anchor">
                    <div onClick={() => isRedirect(row)}>
                      Edit Ledger
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {
        (modal1) ?
          <LedgerViewModal
            ledgerDetails={ledgerDetails}
          />
          : null
      }

    </>





  );
};

export default LedgerTable;
