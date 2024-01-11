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
import CubeDataset from '../../config/interface';
import moment from 'moment';
import { Link } from 'react-router-dom';

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
    fontSize:'18px',
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
    borderBottom: "none",
  },
  itemAlign: {
    textAlign: 'center'
  },
  tskPending: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    height: "30vh",
    alignItems: "center",
    fontStyle: "italic"
  },
}));

function createData(name, demo, count) {
  return { name, demo, count };
}

const rows = [
  createData('Frozen', 159, 159),
  createData('Sandwich', 237, 159),
  createData('Eclair', 262, 237),
  createData('Cupcake', 305, 262),
  createData('Gingerbread', 356, 305),
  createData('Frozen', 159, 159),
  createData('Sandwich', 237, 159),
  createData('Eclair', 262, 237),
  createData('Cupcake', 305, 262),
  createData('Gingerbread', 356, 305),
];

export default function MissedEvent(props) {
  
  const classes = useStyles();

  let {data, getRoleName} = props
  


  let groupByName = data?.reduce((group, data) => {
    let date_value = data?.[CubeDataset.BdeactivitiesBq.createdByName]
    group[date_value] = group[date_value] ?? [];
    group[date_value].push(data);
    return group;
  }, {});


  groupByName = (Object.keys(groupByName ? groupByName : {})?.length > 0) ? Object.entries(groupByName) : []

  data = groupByName

  const setActivityData = (data) => {

    const Data = new Array(2).fill(0);
  
    let arr = data?.slice(1)?.[0]

    arr.forEach((a,d) =>{
      let subject = a?.[CubeDataset.BdeactivitiesBq.subject]


      let count = a?.[CubeDataset.BdeactivitiesBq.count]
       
      switch(subject){
        case 'Demo Call':
          Data[0] = {"demo": count}
          break;

        case 'Follow Up Call':
          Data[1] = {"followUp" : count}
          break;
       }

    })
  
    return Data
  }

  const renderView = (data) => {

    var Data = data.map((a,d) => {
      switch(true) {

        case Object.keys(a)?.includes('demo') : 
          
        return (
            <TableCell className={`${classes.borderNone} ${classes.itemAlign}`}>{a?.['demo']}</TableCell>
           )
      
        case Object.keys(a)?.includes('followUp') : 
          return (<TableCell className={`${classes.borderNone} ${classes.itemAlign}`}>{a?.['followUp']}</TableCell>)

        default : 
         return <TableCell className={`${classes.borderNone} ${classes.itemAlign}`}>{0}</TableCell>
         
      }
    })
    
    return Data
  }
  
 
  return (
    <>
      <Grid sx={{ px: "16px", py: "12px" }} className={classes.headerSection}>
        <Grid className={classes.discBox}>
        <Typography className={classes.title}>Missed Event {data?.length > 0 ? `(${data?.length})` : ""}</Typography>
        {data?.length > 0 ? <Link to='/authorised/all-activity' state={{ renderView: 'MissedBooking', getRoleName: getRoleName }} className={classes.viewAllBtn}>View All</Link> : ""}
        </Grid>
      </Grid>
      <Grid className={classes.taskListSection}>
        <TableContainer component={Paper} className={classes.cusPaper}>
          <Table className={classes.table} size="small" aria-label="a dense table">
            {data.length > 0 ? <>
              <TableHead>
              <TableRow>
                <TableCell className={classes.tableHead}>Name</TableCell>
                <TableCell className={classes.tableHead}>Demo</TableCell>
                <TableCell className={classes.tableHead} align="right">Follow Up</TableCell>
              </TableRow>
            </TableHead> 
            </> : ''}
            <TableBody>
              {data.length > 0 ? data?.map((row, index) => {
                let subjectCount = setActivityData(row)
              
                return(
                  <TableRow key={index}>
                    <TableCell className={classes.borderNone} component="th" scope="row">
                      {row?.[0]}
                    </TableCell>
                    {
                      renderView(subjectCount)
                    }
      
                  </TableRow>
                )
              }) : <div className={classes.tskPending}>
              "No Activity Yet"
            </div>
            }
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </>
  )
}
