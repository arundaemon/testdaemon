import { ActivityData } from "../../helper/DataSetFunction";
import { activityMissed } from "../../helper/randomFunction/activityData";
import { makeStyles } from '@mui/styles';
import Page from "../../components/Page";
import PendingTask from "../../components/bdeDashboard/PendingTask";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";


const useStyles = makeStyles((theme) => ({

	cusCard: {
		margin: "20px",
		background: '#FFFFFF 0% 0% no-repeat padding-box',
		boxShadow: '0px 0px 8px #00000029',
		borderRadius: '8px',
		padding: '20px',
		[theme.breakpoints.down('md')]: {
			marginTop: '70px',
			boxShadow: 'none',
			margin: '0'
		}
	},
	headerContainer: {
		[theme.breakpoints.up('md')]: {
			display: 'none'
		},
		width: "100%",
		display: 'flex',
		boxShadow: '0px 1px 4px #20212429',
		padding: '20px',
		position: 'fixed',
		top: '0',
		left: '0',
		zIndex: '1000',
		background: 'white'
	},
	headerTitle: {
		fontSize: '18px',
		fontWeight: '600',
		marginLeft: '10px'

	},
	
}));



const EventPendingTask = () => {

  const classes = useStyles();

	const location = useLocation()

	console.log(location)
	
  const navigate = useNavigate();

	let { data } = location?.state	

  const activityPending = activityMissed(data)

  useEffect(() => {
		let top_header = document.querySelector('.main-header.mobile-header')
		if (top_header && window.innerWidth <= 1024) top_header.style.display = 'none'
	}, [])

  return (
    <>
      <Page title="Extramarks | PendingMwebtask" className="main-container datasets_container">
        <div className={classes.cusCard}>
          <div className={classes.headerContainer}>
            <img src='/back arrow.svg' onClick={() => navigate(-1)}/>
            <div className={classes.headerTitle}>
              Calendar
            </div>
          </div>
          <PendingTask data={activityPending} title="Pending" mobile_view="true"/>
        </div>
      </Page>
    </>
  )
}

export default EventPendingTask;