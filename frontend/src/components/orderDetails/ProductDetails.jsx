import React from 'react';
import { Grid, Typography } from "@mui/material";
import { makeStyles } from '@mui/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
  headerSection: {
    borderBottom: "1px solid #ccc",
  },
  title: {
    fontWeight: "600",
  },
  discBox: {
    display: "flex",
    justifyContent: "space-between",
  },
  cusPaper: {
    boxShadow: "none",
    marginBottom: "10px",
  },
  tableHead: {
    fontWeight: "600",
    color: "#555555",
  },
  borderNone: {
    borderBottom: "none"
  }
}));

function createData(productName, mrp, sellingPrice, status, expiryDate, action) {
  return { productName, mrp, sellingPrice, status, expiryDate, action };
}

const rows = [
  createData('Frozen', 159, 6.0, 24, 4.0, 159),
  createData('sandwich', 237, 9.0, 37, 4.3, 237),
  createData('Eclair', 262, 16.0, 24, 6.0, 262),
  createData('Cupcake', 305, 3.7, 67, 4.3, 305),
  createData('Gingerbread', 356, 16.0, 49, 3.9, 356),
];

export default function ProductDetails() {
  const classes = useStyles();

  return (
    <>
      <Grid sx={{ px: "16px", py: "12px" }} className={classes.headerSection}>
        <div className={classes.discBox}>
          <div>
            <Typography className={classes.title}>Product Details :</Typography>
          </div>
        </div>
      </Grid>
      <Grid>
        <TableContainer component={Paper} className={classes.cusPaper}>
          <Table className={classes.table} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell className={classes.tableHead}>S.No.</TableCell>
                <TableCell className={classes.tableHead}>Product Name</TableCell>
                <TableCell className={classes.tableHead} align="right">MRP</TableCell>
                <TableCell className={classes.tableHead} align="right">Selling Price</TableCell>
                <TableCell className={classes.tableHead} align="right">Status</TableCell>
                <TableCell className={classes.tableHead} align="right">Expiry Date</TableCell>
                <TableCell className={classes.tableHead} align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, i) => (
                <TableRow key={row.name}>
                  <TableCell className={classes.borderNone} component="th" scope="row">{i + 1}.</TableCell>
                  <TableCell className={classes.borderNone}>{row.productName}</TableCell>
                  <TableCell className={classes.borderNone} align="right">{row.mrp}</TableCell>
                  <TableCell className={classes.borderNone} align="right">{row.sellingPrice}</TableCell>
                  <TableCell className={classes.borderNone} align="right">{row.status}</TableCell>
                  <TableCell className={classes.borderNone} align="right">{row.expiryDate}</TableCell>
                  <TableCell className={classes.borderNone} align="right">{row.action}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </>
  )
}
