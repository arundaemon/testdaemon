import { Card, Box, Button, Grid, Typography, CardActions, Divider } from '@mui/material';
import { makeStyles } from '@mui/styles';
import CardContent from '@mui/material/CardContent';
import CubeDataset from '../../config/interface';

const useStyles = makeStyles((theme) => ({

  taskBox : {
    [theme.breakpoints.up('md')]: {
      boxShadow: " 0px 0px 10px #00000029",
      borderRadius: '8px', 
      marginTop: '30px', 
      marginRight: '20px', 
      marginBottom: '40px'
		},
    boxShadow: "none",
    borderRadius: '0', 
    marginTop: 'auto', 
    marginRight: 'auto', 
    marginBottom: 'auto'
  },

  box: {
    display: "flex",
    justifyContent: "flex-end"
  },

  cardStyle : {
   height: '300px', width: '100%', boxShadow: 'none'
  },

  mainHead : {
    color: '#202124', fontSize: '18px', fontWeight: '600', marginBottom: '15px'
  },

  contentHead : {
    color: '#202124', fontSize: '14px', fontWeight: 'normal', padding: '15px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
  },

  contentPara : {
    fontSize: "18px",
    color: "#202124",
    fontWeight: '500'
  },
  tskPending: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    alignItems: "center",
    fontStyle: "italic"
  }
  
}));

export const TaskSummary = (props) => {

  const classes = useStyles();

  let {data} = props;

  return(
    <>
      <div className={classes.taskBox}>
        <Box className={classes.box}>
          <Card className={classes.cardStyle} >
            <CardContent>
              <Typography variant="h5" component="div" className={classes.mainHead}>
                Task Summary
              </Typography><Divider/>
              {
                data?.length > 0? data?.map((data) => {
                  
                  return(
                   ( data?.activityName ? <>
                    <Typography component="div" className={classes.contentHead}>
                      {data?.activityName}
                      <p className={classes.contentPara}>{data?.count}</p>
                    </Typography> <Divider/>
                    </> : "")
                  )
                }) : <div className={classes.tskPending}>
                "No Schedules tasks yet"
              </div>
              }                 
            </CardContent>
          </Card>
        </Box>
			</div>
    </>
  )
}