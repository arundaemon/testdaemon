import Page from "../../components/Page"
import { Grid } from "@mui/material";
import { styled } from '@mui/material/styles';
import { Container } from '@mui/system';
import Paper from '@mui/material/Paper';
import { useState, useRef } from 'react';
import { useEffect } from 'react';
import { EventCalendar } from '../../components/Calendar/EvtCalendar';
import PendingTask from '../../components/bdeDashboard/PendingTask';
import { makeStyles } from '@mui/styles';
import { CalendarRender } from '../../components/Calendar/Schedules/Common';
import { CalendarHeader } from '../../components/Calendar/CalendarHeader';
import { TaskSummary } from "../../components/Calendar/Summary";
import { MobViewCalendar } from "../../components/Calendar/mobCalendar";
import CubeSocket from "../../helper/CubeSocket";
import { CalendarActivityData, getActivityCount } from "../../helper/DataSetFunction";
import { getAttribute } from "../../helper/randomFunction/attributeFunction";
import { activityPending } from "../../helper/randomFunction/activityData";
import { getBdeActivitiesByRoleName } from "../../config/services/bdeActivities";
import { getUserData } from "../../helper/randomFunction/localStorage";
import { getActivityWithCount } from "../../helper/randomFunction";



const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
	...theme.typography.body2,
	padding: theme.spacing(1),
	//textAlign: 'center',
	color: theme.palette.text.secondary,
}));


const useStyles = makeStyles((theme) => ({

	cusCard: {
		boxShadow: "0px 0px 4px #00000029",
		borderRadius: "8px",
		margin: "20px",
		// marginTop: "30px"
	},
	toggleButton: {
		width: '20%'
	},
	headFont: {
		fontSize: '18px'
	},
	contentSec: {
		display: "flex", width: '100%', justifyContent: 'space-between'
	},
	calenderBox: {
		boxShadow: " 0px 0px 10px #00000029", borderRadius: '8px', marginTop: '30px', marginRight: '20px'
	},
	fullWidth: {
		width: '100%'
	},
	rhtContainer: {
		width: '60%'
	},

}));



export default function MyCalendar() {

	const classes = useStyles();
	const [view, setView] = useState({ value: '', label: '' })
	const [prvValue, setPrvValue] = useState('timeGridDay')
	const [toggle, setToggle] = useState(true)
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);
	const [activityData, setActivityData] = useState([])
	const [getCount, setActivityCount] = useState([])

	// const activityData = CalendarActivityData(startDate, endDate) ? activityPending(CalendarActivityData(startDate, endDate)?.resultSet?.tablePivot()) : ''


	// const getCount = getActivityCount(startDate, endDate) ? activityPending(getActivityCount(startDate, endDate)?.resultSet?.tablePivot()) : ""

	const getData = (status, view) => {
		setToggle(status)
		setView(view)
	}

	const getChangeDate = (start_date, end_date) => {
		setStartDate(start_date);
		setEndDate(end_date);
	}
	
	const getActivityByRoleNameStartDate = async () => {
		let countRes
    let params = {
      createdByRoleName: getUserData('userData')?.crm_role,
      startDateTime: {$gt:new Date(startDate), $lt:new Date(endDate)},
      status: {$in: ["Complete", "Pending"]},
			limit: 100
    }

    try {
     let res = await getBdeActivitiesByRoleName(params)
		  setActivityData(res?.result);
			if (res?.result?.length > 0) {
				let data = getActivityWithCount(res?.result);
				data.length > 0 ? setActivityCount(data) : setActivityCount([])
			}
    }catch(err) {
      console.error(err)
    }
  }


	useEffect(() => {
		let top_header = document.querySelector('.main-header.mobile-header')
		if (top_header && window.innerWidth <= 1024) top_header.style.display = 'none'
	}, [])

	useEffect( () => {
		setActivityCount([])
		getActivityByRoleNameStartDate();
	}, [startDate, endDate])

	return (
		<>
			<Page title="Extramarks | My Calendar" className="main-container datasets_container cstm_addCls myCalendarExpendPage">
				<>
					{window.innerWidth >= 1024 ?
						<div className={classes.cusCard}>
							<CalendarHeader getData={getData} />
							<div className='cstm_table_box'>
								<div className={classes.contentSec}>
									<div className={!toggle ? classes.fullWidth : classes.rhtContainer} >
										<CalendarRender view={view.value} data={activityData} getChangeDate={getChangeDate} />
									</div>
									{toggle ? <div style={{ width: "35%" }} className="lft_cal">
										<div>
											<TaskSummary data={getCount} />
										</div>
									</div> : ""}
								</div>
							</div>
						</div	>
						:
						<MobViewCalendar data={activityData} getChangeDate={getChangeDate} />
					}
				</>
			</Page>
		</>
	);
}
