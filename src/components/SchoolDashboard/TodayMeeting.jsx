import {
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useStyles } from "../../css/Dasboard-css";
import { Link } from "react-router-dom";

export const TodayMeeting = () => {
  const classes = useStyles();

  return (
    <>
      <Grid sx={{ px: "5px", py: "16px" }}>
        <Grid className={classes.discBox}>
          <Typography className={classes.title}>
            Meetings Planned For Today
          </Typography>
          <Link
              to="/authorised/dashboard"
              className={classes.viewAllBtn}
            >
              View More
            </Link>
        </Grid>
        <Grid className={classes.taskListSection}>
          <TableContainer component={Paper} className={classes.cusPaper}>
            <Table
              className={classes.table}
              size="small"
              aria-label="a dense table"
            >
              <TableHead
                sx={{
                  borderTop: "1.5px solid #f1f3f4",
                  borderBottom: "1.5px solid #f1f3f4",
                }}
              >
                <TableRow>
                  <TableCell className={classes.tableHead}>
                    School Name
                  </TableCell>
                  <TableCell className={classes.tableHead}>Product</TableCell>
                  <TableCell className={classes.tableHead}>Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell className={classes.borderNone} scope="row">
                    SPS
                  </TableCell>
                  <TableCell className={classes.borderNone} scope="row">
                    ESC+
                  </TableCell>
                  <TableCell className={classes.borderNone} scope="row">
                    8:30 am
                  </TableCell>
                  <TableCell className={classes.borderNone} scope="row">
                    
                    <Button
                    className={classes.submitBtn}
                    >
                    Log
                  </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={classes.borderNone} scope="row">
                    SPS
                  </TableCell>
                  <TableCell className={classes.borderNone} scope="row">
                    ESC+
                  </TableCell>
                  <TableCell className={classes.borderNone} scope="row">
                    8:30 am
                  </TableCell>
                  <TableCell className={classes.borderNone} scope="row">
                  <Button
                    className={classes.submitBtn}
                    >
                    Log
                  </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </>
  );
};
