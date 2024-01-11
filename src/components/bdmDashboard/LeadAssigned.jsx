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
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  cusCard: {
    boxShadow: "0px 0px 4px #00000029",
    borderRadius: "8px",
    width: "13rem",
    marginBottom: "0.4rem",
    flexGrow: "0",
    flexShrink: "0",
    marginRight: "1rem",
    overflow: 'hidden',
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
  taskCompleted: {
    width: "100%",
  },
  submitBtn: {
    backgroundColor: "#f45e29",
    border: "1px solid #f45e29",
    color: "#ffffff !important",
    padding: '6px 12px',
    borderRadius: '4px',
    fontSize: '14px',
    cursor:'pointer',
    fontWeight: 600,
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
  },
  tskPending: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    height: "30vh",
    alignItems: "center",
    fontStyle: "italic"
  },
  colorWhite : {
    color: '#fff',
    textDecoration: 'none'
  }
}));

function createData(name, enquiry, follow_up, demo, order, payment, cw, cl, total) {
  return { name, enquiry, follow_up, demo, order, payment, cw, cl, total };
}

const rows = [
  createData('Frozen', 159, 6.0, 24, 4.0, 159, 6.0, 24, 4.0),
  createData('sandwich', 237, 9.0, 37, 4.3, 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0, 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3, 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9, 356, 16.0, 49, 3.9),
  createData('Frozen', 159, 6.0, 24, 4.0, 159, 6.0, 24, 4.0),
  createData('Ice cream', 237, 9.0, 37, 4.3, 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0, 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3, 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9, 356, 16.0, 49, 3.9),
];

export default function LeadAssigned(props) {
  const classes = useStyles();

  let {data} = props
 
  let groupByName = data?.reduce((group, data) => {
    let date_value = data?.[CubeDataset.BdeactivitiesBq.createdByName]
    group[date_value] = group[date_value] ?? [];
    group[date_value].push(data);
    return group;
  }, {});

 
  groupByName = (Object.keys(groupByName ? groupByName : {})?.length > 0) ? Object.entries(groupByName) : []


  data = groupByName

  const setActivityData = (data) => {

    const Data = new Array(4).fill(0);
    
    let arr = data?.slice(1)?.[0]
    
    arr?.forEach((a,d) =>{
      let leadStage = a?.[CubeDataset.BdeactivitiesBq.leadStage]

      let count = a?.[CubeDataset.BdeactivitiesBq.count]
       
      switch(leadStage){
        case 'Enquiry':
          Data[0] = {"Enquiry": count}
          break;

        case 'Demo':
          Data[1] = {"Demo" : count}
          break;

          case 'Order':
            Data[2] = {"Order" : count}
            break;

          case 'Payment':
          Data[3] = {"Payment" : count}
          break;
       }

    })

    return Data

  }



  const renderView = (data) => {

  
    var Data = data.map((a,d) => {
      switch(true) {

        case Object.keys(a)?.includes('Enquiry') : 
          
        return (
            <TableCell className={classes.borderNone}>{a?.['Enquiry']}</TableCell>
           )
      
        case Object.keys(a)?.includes('Demo') : 
          return (<TableCell className={classes.borderNone}>{a?.['Demo']}</TableCell>)

        case Object.keys(a)?.includes('Order') : 
          return (<TableCell className={classes.borderNone}>{a?.['Order']}</TableCell>)
        
        case Object.keys(a)?.includes('Payment') : 
          return (<TableCell className={classes.borderNone}>{a?.['Payment']}</TableCell>)

        default : 
         return <TableCell className={classes.borderNone}>{0}</TableCell>
         
      }
    })
    
    return Data
  }

  

  return (
    <>
      <Grid sx={{ px: "16px", py: "12px" }} className={classes.headerSection}>
        <div className={classes.discBox}>
          <div>
            <Typography className={classes.title}>Lead Assigned</Typography>
            <Grid className={classes.discBox}>
              {/* <Typography className={classes.subTitle}>Loremsipum Loremsipum</Typography> */}
            </Grid>
          </div>
          <div>
            <div className={classes.submitBtn}>
              <Link to ="/authorised/lead-Assignment" className={classes.colorWhite} >
                Lead Transfer
              </Link>
            </div>
          </div>
        </div>
      </Grid>
      <Grid>
        <TableContainer component={Paper} className={classes.cusPaper}>
          <Table className={classes.table} size="small" aria-label="a dense table">
            {
              data?.length > 0 ? <>
                <TableHead>
              <TableRow>
                <TableCell className={classes.tableHead}>S.No.</TableCell>
                <TableCell className={classes.tableHead}>Name</TableCell>
                <TableCell className={classes.tableHead}>Enquiry</TableCell>
                {/* <TableCell className={classes.tableHead} style={{ minWidth: "7rem" }}>Follow Up</TableCell> */}
                <TableCell className={classes.tableHead}>Demo</TableCell>
                <TableCell className={classes.tableHead}>Order</TableCell>
                <TableCell className={classes.tableHead}>Payment</TableCell>
                {/* <TableCell className={classes.tableHead}>CW</TableCell>
                <TableCell className={classes.tableHead}>CL</TableCell>
                <TableCell className={classes.tableHead}>Total</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.map((row, i) => {
                let stageCount = setActivityData(row)
                return (
                  <TableRow key={i}>
                    <TableCell className={classes.borderNone}>{i + 1}.</TableCell>
                    <TableCell className={classes.borderNone} component="th" scope="row">
                      {row?.[0]}
                    </TableCell>
                    {
                      renderView(stageCount)
                    }
                  </TableRow>
                )
              })}
            </TableBody> 
              </> : <div className={classes.tskPending}>
                "No Activity Yet"
              </div>
            }
          </Table>
        </TableContainer>
      </Grid>
    </>
  )
}
