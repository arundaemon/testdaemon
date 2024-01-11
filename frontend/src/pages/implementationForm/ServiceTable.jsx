import {
  Box,
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import TableCell from "@mui/material/TableCell";
import moment from "moment";
import React, { Fragment } from "react";

const styles = {
  tableContainer: {
    margin: "30px auto",
    borderRadius: "8px",
    boxShadow: "0px 3px 6px #00000029",
    paddingBottom: "20px",
  },
  dividerLine: {
    borderWidth: "1.4px",
    borderColor: "grey",
    width: "98%",
    margin: "20px 5px 20px 16px",
  },
  tableCell: {
    padding: "8px 0px 8px 16px !important",
    border: "none",
  },
  typo: {
    padding: "10px 16px",
    fontWeight: "700",
    fontSize: "18px",
    textDecoration: "underline",
    backgroundColor: "#FECB98",
  },
  dateSec: {
    borderRadius: "4px !important",
    boxShadow: "0px 3px 6px #00000029",
    paddingBottom: "50px",
    marginTop: "50px",
  },
  spocSec: {
    borderRadius: "8px !important",
    boxShadow: "0px 3px 6px #00000029",
    paddingBottom: "50px",
  },
};

const ServiceTable = ({ serviceData }) => {
  const LicenseTable = [
    "Product Details",
    "Duration",
    "Units To Be Implemented",
  ];
  return (
    <>
      {serviceData?.length > 0 && (
        <TableContainer component={Paper} sx={styles.tableContainer}>
          <Typography
            sx={{ ...styles.typo, borderRadius: "8px 8px 0 0 !important" }}
          >
            {"Service Details"}
          </Typography>
          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                {LicenseTable.map((heading, index) => (
                  <TableCell
                    align="left"
                    key={index}
                    sx={{ ...styles.tableCell, padding: "16px" }}
                  >
                    {heading}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {serviceData?.map((obj, index) => {
                return (
                  <TableRow
                    key={index}
                    sx={{
                      borderTop: "1px solid grey",
                      "& td": styles.tableCell,
                    }}
                  >
                    <TableCell align="left">
                      <Box sx={styles.productSec}>{obj?.productItemName}</Box>
                    </TableCell>
                    <TableCell align="left">
                      <Box sx={styles.productSec}>
                        {obj?.productItemDuration}
                      </Box>
                    </TableCell>
                    <TableCell align="left">
                      <Box sx={styles.productSec}>{obj?.implementedUnit}</Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
};

export default ServiceTable;
