import React, { useState, useEffect } from "react";
import { makeStyles } from '@mui/styles'
import PropTypes from "prop-types";
import { Tabs, Tab, Typography, Box, Grid } from "@mui/material";
import SchoolBDEActivities from "./SchoolBDEActivities";
import { getBdeActivities } from "../../config/services/school";
import { useParams } from "react-router-dom";
import SchoolInterestList from "./SchoolInterestList";
import { SchoolLeadActivityFilter } from "./Tabs/SchoolLeadActivityFilter";
import useMediaQuery from "@mui/material/useMediaQuery";

const schoolFilters = [
  {
    id: 1,
    displayName: 'Priority',
    optionType: 'OR',
    options: [
      {id: 1, label: 'Base Schools', value: 'Base Schools'},
      {id: 2, label: 'Pipeline', value: 'Pipeline'},
      {id: 3, label: 'Hots', value: 'Hots'},
    ]
  },
  {
    id: 2,
    displayName: 'Products',
    optionType: 'OR',
    options: [
      {id: 1, label: 'ESC+ Basic', value: 'ESC+ Basic'},
      {id: 2, label: 'SIP Empower', value: 'SIP Empower'},
      {id: 3, label: 'LA', value: 'LA'},
      {id: 3, label: 'AV', value: 'AV'},
    ]
  }
];

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


export default function LeadSchoolTabs({ interest }) {
  const classes = useStyles();

  const [value, setValue] = useState(0);
  const { school_id, interest_id } = useParams()
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  return ( 
    <Box className="listing-box1" >
      <Box className={`listing-basictabs-box2 ` + (isMobile ? `crm-tabs theme1-tabs` : `crm-tabs2`)}>
        <Tabs
          className="listing-tabs"
          value={value}
          variant="scrollable"
          onChange={handleChange}
          aria-label="basic tabs example"
          scrollButtons="auto"
          TabIndicatorProps={!isMobile 
              ? {
                  sx: {
                    backgroundColor: "transparent",
                  },
                  children: <span />,
                }
              : {}
          }
        >
          <Tab className="tab-item" 
            label={
              <Grid
                container
                alignItems="center"
                justify="center"
                className="tab-item-box"
              >
                <Box sx={{ width: "100%" }}>
                  <Typography variant="h5" className="tab-item-label">All activities</Typography>
                </Box>
              </Grid>
            }
            {...a11yProps(0)} 
          />
          <Tab className="tab-item" 
            label={
              <Grid
                container
                alignItems="center"
                justify="center"
                className="tab-item-box"
              >
                <Box sx={{ width: "100%" }}>
                  <Typography variant="h5" className="tab-item-label">BDE Activity</Typography>
                </Box>
              </Grid>
            } {...a11yProps(1)} 
          />
          {/* <Tab className="tab-item" 
            label={
              <Grid
                container
                alignItems="center"
                justify="center"
                className="tab-item-box"
              >
                <Box sx={{ width: "100%" }}>
                  <Typography variant="h5" className="tab-item-label">User Activity</Typography>
                </Box>
              </Grid>
            } {...a11yProps(2)} 
          /> */}
        </Tabs>
        {
          isMobile ? <div style={{ height: 3, background: "#DEDEDE", marginTop: -3 }}></div> : null
        }
      </Box>
      {/* <Box className="crm-school-lead-card-container">
        <SchoolLeadActivityFilter filters={schoolFilters} />
      </Box> */}
      
      <TabPanel value={value} index={0}>
        <div className="crm-school-lead-card-container">
          {interest_id ?
            <SchoolInterestList /> :
            <SchoolBDEActivities interest={interest} />
          }
        </div>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <div className="crm-school-lead-card-container">
          <div className="crm-no-results text-left">No Activity</div>
        </div>
        
      </TabPanel>

      <TabPanel value={value} index={2}>
        <div className="crm-school-lead-card-container">
          <div className="crm-no-results text-left">No Activity</div>
        </div>
      </TabPanel>
    </Box >
  );
}
