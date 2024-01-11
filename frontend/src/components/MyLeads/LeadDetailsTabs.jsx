import * as React from "react";
import { makeStyles } from '@mui/styles'
import PropTypes from "prop-types";
import { Tabs, Tab, Typography, Box } from "@mui/material";
//icons
import FilterIcon from "../../assets/icons/flat_Filter.svg"
//Tabs
import AllActivities from "./Tabs/AllActivities";
import BdeActivities from "./Tabs/BdeActivities";
import UserActivity from "./Tabs/UserActivity";
import MarketingActivity from "./Tabs/MarketingActivity";
import TrialTaken from "./Tabs/TrialTaken";
import EventAttended from "./Tabs/EventAttended";

const useStyles = makeStyles({
  a: {
    color: '#4482FF',
  }
})

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 6 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}


export default function LeadDetailsTabs(props) {
  const classes = useStyles();

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  console.log(props, 'this is prop1')





  return (
    <Box className="listing-box1" >
      <Box className="listing-basictabs-box2">
        <Tabs
          className="listing-tabs"
          value={value}
          variant="scrollable"
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab className="tabItem" label="All activities" {...a11yProps(0)} />
          <Tab className="tabItem" label="BDE Activity" {...a11yProps(1)} />
          <Tab className="tabItem" label="User Activity" {...a11yProps(2)} />
          {/* <Tab className="tabItem" label="Marketing Activity" {...a11yProps(3)} /> */}
          <Tab className="tabItem" label="Trial taken" {...a11yProps(3)} />
          {/* <Tab className="tabItem" label="Event attended" {...a11yProps(5)} /> */}
        </Tabs>
        <div style={{ height: 3, background: '#DEDEDE', marginTop: -3 }}></div>
      </Box>
      {/* <div className="listing-filter" >
        <img src={FilterIcon} alt="filter_icon" className="listing-filter-icon" />
        <label>Filter</label>
      </div> */}
      <TabPanel value={value} index={0}>

        {/* //tab panel button */}
        <AllActivities {...props} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <BdeActivities {...props} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <UserActivity {...props} />
      </TabPanel>
      {/* <TabPanel value={value} index={3}>
        <MarketingActivity />
      </TabPanel> */}
      <TabPanel value={value} index={3}>
        <TrialTaken {...props} />
      </TabPanel>
      {/* <TabPanel value={value} index={5}>
        <EventAttended />
      </TabPanel> */}
    </Box >
  );
}
