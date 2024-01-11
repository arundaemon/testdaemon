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
  cusCard: {
    padding: "2px",
    boxShadow: "0px 0px 8px #00000029",
    borderRadius: "8px",
  },
  headerSection: {
    borderBottom: "1px solid #ccc",
  },
  title: {
    fontWeight: "600",
    fontSize: '18px',
    color: "#202124",

  },
  discBox: {
    display: "flex",
    justifyContent: "space-between",
  },
  subTitle: {
    fontSize: "12px",
  },
  viewAllBtn: {
    fontSize: "12px",
  },
  taskListSection: {
    maxHeight: "14.5rem",
    overflow: "auto",
  },
  taskList: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #ccc",
  },
  task: {
    fontSize: "14px",
    fontWeight: "600",
  },
  time: {
    fontSize: "14px",
    fontWeight: "400",
  },
  cusPaper: {
    boxShadow: "none",
    marginBottom: "10px",
  },
  tableHead: {
    fontWeight: "600",
    color: "#202124",

  },
  borderNone: {
    borderBottom: "none"
  }
}));

export default function ApprovalRequest() {
  const classes = useStyles();

  return (
    <>
      <Grid sx={{ px: "16px", py: "12px" }} className={classes.headerSection}>
        <Typography className={classes.title}>Approval Request (8)</Typography>
        <Grid className={classes.discBox}>
          <Typography className={classes.subTitle}></Typography>
          <a href='' className={classes.viewAllBtn}>View All</a>
        </Grid>
      </Grid>
      <Grid className={classes.taskListSection}>
        <TableContainer component={Paper} className={classes.cusPaper}>
          <Table className={classes.table} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell className={classes.tableHead}>Name</TableCell>
                <TableCell className={classes.tableHead} align="right">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell className={classes.borderNone} component="th" scope="row">
                  <a href=''>Demo Project</a>
                </TableCell>
                <TableCell className={classes.borderNone} align="right">Pending</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={classes.borderNone} component="th" scope="row">
                  <a href=''>Casual Leave</a>
                </TableCell>
                <TableCell className={classes.borderNone} align="right">Pending</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </>
  )
}
