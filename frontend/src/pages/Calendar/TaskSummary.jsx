import { useEffect } from "react";
import { makeStyles } from '@mui/styles';
import { useLocation, useNavigate } from "react-router-dom";
import Page from "../../components/Page";
import { TaskSummary } from "../../components/Calendar/Summary";
import { getActivityCount } from "../../helper/DataSetFunction";
import { getActivityWithCount } from "../../helper/randomFunction";


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

const EventSummary = () => {

  const classes = useStyles();
  
  const navigate = useNavigate();

	const location = useLocation();

	let { data } = location?.state	

  const getCount = getActivityWithCount(data)

  useEffect(() => {
		let top_header = document.querySelector('.main-header.mobile-header')
		if (top_header && window.innerWidth <= 1024) top_header.style.display = 'none'
	}, [])

  return (
    <>
    <Page title="Extramarks | EventMwebSummary" className="main-container datasets_container">
        <div className={classes.cusCard}>
          <div className={classes.headerContainer}>
            <img src='/back arrow.svg' onClick={() => navigate(-1)}/>
            <div className={classes.headerTitle}>
              Calendar
            </div>
          </div>
          <TaskSummary data={getCount}/>
        </div>
      </Page>
    </>
  )
}


export default EventSummary;