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
  amountSection: {
    display: "flex",
    padding: "1rem",
    borderBottom: "1px solid rgba(224, 224, 224, 1)",
    [theme.breakpoints.down('md')]: {
      display: "block",
    }
  },
  amountBox: {
    display: "flex",
    alignItems: "baseline",
    marginRight: "1rem",
    [theme.breakpoints.down('md')]: {
      marginLeft: "4px",
      marginBottom: "4px",
    }
  },
  amountLabel: {
    fontSize: "14px",
    fontWeight: "600",
  },
  amountInput: {
    width: "6rem",
    padding: "3px",
    fontWeight: "600",
    textAlign: "center",
    margin: "0 6px",
    border: "1px solid rgba(224, 224, 224, 1)",
    borderRadius: "5px",
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

function createData(paymentMode, amount, status) {
  return { paymentMode, amount, status };
}

const rows = [
  createData('Cash', 159, "Approved"),
  createData('UPI', 237, "Pending"),
  createData('NEFT', 262, "Approved"),
  createData('UPI', 305, "Failed"),
];

export default function PaymentDetails() {
  const classes = useStyles();

  return (
    <>
      <Grid sx={{ px: "16px", py: "12px" }} className={classes.headerSection}>
        <div className={classes.discBox}>
          <div>
            <Typography className={classes.title}>Payment Details :</Typography>
          </div>
        </div>
      </Grid>
      <Grid>
        <Grid className={classes.amountSection}>
          <Grid className={classes.amountBox}>
            <Typography className={classes.amountLabel}>Total Amount :</Typography>
            <input className={classes.amountInput} type="number" value={100000}/>
          </Grid>
          <Grid className={classes.amountBox}>
            <Typography className={classes.amountLabel}>Received Amount :</Typography>
            <input className={classes.amountInput} type="number" value={80000} />
          </Grid>
          <Grid className={classes.amountBox}>
            <Typography className={classes.amountLabel}>Due Amount :</Typography>
            <input className={classes.amountInput} type="number" value={20000} />
          </Grid>
        </Grid>
        <TableContainer component={Paper} className={classes.cusPaper}>
          <Table className={classes.table} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell className={classes.tableHead}>S.No.</TableCell>
                <TableCell className={classes.tableHead}>Payment Mode</TableCell>
                <TableCell className={classes.tableHead}>Amount</TableCell>
                <TableCell className={classes.tableHead} align="right">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, i) => (
                <TableRow key={row.name}>
                  <TableCell className={classes.borderNone} component="th" scope="row">{i + 1}.</TableCell>
                  <TableCell className={classes.borderNone}>{row.paymentMode}</TableCell>
                  <TableCell className={classes.borderNone}>{row.amount}</TableCell>
                  <TableCell className={classes.borderNone} align="right">{row.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </>
  )
}
