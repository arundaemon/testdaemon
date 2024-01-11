import React from "react";
import { Grid, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import CubeDataset from "../../config/interface";
import { Link } from "react-router-dom";

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
    color: "#202124",
    fontSize: "16px",
  },
  discBox: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    height: "100%",
    alignItems: "center",
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
    borderBottom: "none",
  },
  tskPending: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    height: "30vh",
    alignItems: "center",
    fontStyle: "italic",
  },
}));

function createData(name, count) {
  return { name, count };
}

const rows = [
  createData("Frozen", 159),
  createData("Sandwich", 237),
  createData("Eclair", 262),
  createData("Cupcake", 305),
  createData("Gingerbread", 356),
  createData("Frozen", 159),
  createData("Sandwich", 237),
  createData("Eclair", 262),
  createData("Cupcake", 305),
  createData("Gingerbread", 356),
];

export default function TodayBooking(props) {
  let { data, getRoleName } = props;

  const classes = useStyles();

  return (
    <>
      <Grid sx={{ px: "16px", py: "12px" }} className={classes.headerSection}>
        <Grid className={classes.discBox}>
          <Typography className={classes.title}>
            Booking Done Today {data?.length > 0 ? `(${data?.length})` : ""}
          </Typography>
          {data?.length > 0 ? (
            <Link
              to="/authorised/all-activity"
              state={{ renderView: "TodayBooking", getRoleName: getRoleName }}
              className={classes.viewAllBtn}
            >
              View All
            </Link>
          ) : (
            ""
          )}
        </Grid>
      </Grid>
      <Grid className={classes.taskListSection}>
        <TableContainer component={Paper} className={classes.cusPaper}>
          <Table
            className={classes.table}
            size="small"
            aria-label="a dense table"
          >
            {data?.length > 0 ? (
              <>
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.tableHead}>Name</TableCell>
                    <TableCell className={classes.tableHead} align="right">
                      Count
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell
                        className={classes.borderNone}
                        component="th"
                        scope="row"
                      >
                        {row?.[CubeDataset.BdeactivitiesBq.createdByName]}
                      </TableCell>
                      <TableCell className={classes.borderNone} align="right">
                        {row?.[CubeDataset.BdeactivitiesBq.count]}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </>
            ) : (
              <div className={classes.tskPending}>"No Booking Today Yet"</div>
            )}
          </Table>
        </TableContainer>
      </Grid>
    </>
  );
}
