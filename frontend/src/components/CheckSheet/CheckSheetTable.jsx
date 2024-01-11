import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";

import { useStyles } from "../../css/SiteSurvey-css";

const CheckSheetTable = ({ data }) => {
  return (
    <>
      <Box className="crm-table-container">
        <TableContainer component={Paper}>
          <Table
            aria-label="simple table"
            className="custom-table datasets-table crm-sd-claims-table crm-table-header-left-aligned"
          >
            <TableHead>
              <TableRow className="cm_table_head">
                <TableCell>
                  {/* {" "} */}
                  <div className="tableHeadCell">S.No</div>
                </TableCell>
                <TableCell>
                  {/* {" "} */}
                  <div className="tableHeadCell">Item Code</div>
                </TableCell>
                <TableCell>
                  {/* {" "} */}
                  <div className="tableHeadCell">Description</div>
                </TableCell>
                <TableCell>
                  {/* {" "} */}
                  <div className="tableHeadCell">Brand</div>
                </TableCell>
                <TableCell>
                  {/* {" "} */}
                  <div className="tableHeadCell">VOM</div>
                </TableCell>
                <TableCell>
                  {/* {" "} */}
                  <div className="tableHeadCell">Quantity</div>
                </TableCell>
                <TableCell />
              </TableRow>
            </TableHead>

            <TableBody>
              {data?.map((row, index) => {
                return (
                  <TableRow
                    key={index}
                    // sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row?.item_code}</TableCell>
                    <TableCell>{row?.description}</TableCell>
                    <TableCell>{row?.brand}</TableCell>
                    <TableCell>{row?.uom}</TableCell>
                    <TableCell>{row?.quantity}</TableCell>
                    <TableCell />
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default CheckSheetTable;
