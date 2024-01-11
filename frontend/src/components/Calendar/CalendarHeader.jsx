import { makeStyles } from '@mui/styles';
import { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import ReactSelect from 'react-select';
import moment from 'moment';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({

	toggleButton : {
		width: '20%'
	},
  Width: {
    width: '30%', display: 'flex', height: '100%', alignItems: 'center'
  },
  headFont : {
		fontSize: '18px', color: "#202124", fontWeight: '600'
	},
  demoBtn : {
    borderRadius: '4px !important', color: "#fff !important", padding: '8px 15px !important', backgroundColor: "#F45E29"
  },

  LinkDemobtn : {
    borderRadius: '4px !important', color: "#fff !important", padding: '8px 15px !important', backgroundColor: "#F45E29",
    textDecoration: "none"
  },
  selectWidth: {
    width: '40%'
  },
  toggleClass : {margin: '0 auto', cursor: 'pointer'}

  
}));

export const CalendarHeader = ({getData}) => {

  const classes = useStyles();
  const [change_toggle, setChange] = useState(true)
  const [change_view, setChangeView] = useState({value:'day',label:'Day'})

  const options = [
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' }
  ]

  useEffect(
    () => {
      getData(change_toggle, change_view);
    }, [change_toggle, change_view]
  )

  return(
    <>
      <div className='cstm_box'>
        <div>
          <p className={classes.headFont}>MY CALENDAR</p>
        </div>
        <div className={classes.Width} >
          <div className={classes.selectWidth}>
            <Link to ="/authorised/my-calendar/events" className={classes.LinkDemobtn}>
              All Events
            </Link>
          </div>
          <div className={classes.selectWidth}>
            <ReactSelect
              classNamePrefix="select"
              options={options}
              value={change_view}
              onChange={(e) => {
                setChangeView({label:e.label, value: e.value})
              }}
            />
          </div>
          <div className={classes.toggleButton}>
              <img src="/arrow_toggle.svg" className={classes.toggleClass } onClick={(e) => setChange(!change_toggle)}/>
            </div>
        </div>  
			</div>
    </>
  )
}