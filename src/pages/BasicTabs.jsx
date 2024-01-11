import * as React from "react";
import { Card, Grid } from "@mui/material";
import { makeStyles } from '@mui/styles'
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconPin from "../assets/icons/Icon-pin.svg"
import FilterIcon from "../assets/icons/flat_Filter.svg"
import IconFirstCall from "../assets/icons/Icon-firstCall.svg"
import IconSmsSent from "../assets/icons/Icon-smsSent.svg"
import IconUserLoggedIn from "../assets/icons/Icon-userLoggedIn.svg"
import IconFollowUpCall from "../assets/icons/Icon-followUpCall.svg"
import IconAccessedFreemiumContent from "../assets/icons/Icon-accessedFreemiumContent.svg"
import IconBookDemo from "../assets/icons/Icon-bookDemo.svg"
import IconDemoCompleted from "../assets/icons/Icon-demoCompleted.svg"
import IconEmailSent1 from "../assets/icons/Icon-emailSent1.svg"
import IconVisitedPackagePage from "../assets/icons/Icon-visitedPackagePage.svg"
import IconEmailSent2 from "../assets/icons/Icon-emailSent2.svg"
import PlayTrack from '../assets/image/playTrack.svg'

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
          <Typography>{children}</Typography>
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


export default function BasicTabs() {
  const classes = useStyles();

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box className="listing-box1" >
      <Box className="listing-basictabs-box2">
        <Tabs
          className="listing-tabs"
          value={value}
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
      <div className="listing-filter" >
        <img src={FilterIcon} alt="filter_icon" className="listing-filter-icon" /> <label
        >Filter</label>
      </div>
      <TabPanel value={value} index={0}>
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}
        >
          <div className="allCardContaienr">
            <section>
              <div className="listing-card">
                <div className="cardDataContainer">
                  <div className="left">
                    <img src={IconPin} className="listing-basic-icon1" alt="iconPin"></img>
                    <div className="cardData">
                      <div className="listing-tab-text1" >Website Visit to JEE Enquiry page </div>
                      <div className="listing-tab-hypertext">
                        <a rel="stylesheet" href="www.google.com"> WWW.extramarks.com/login/jee</a > <span className="subText">(00:01:30)</span>
                      </div>
                      <div className="listing-tab-text2" >Enquiry Submitted: YES <a href="">(enquiry form link)</a></div>
                    </div>
                  </div>
                  <div className="right">
                    <p className="listing-tabsDates">26-07-2022 - 4:30 pm</p>
                  </div>
                </div>
              </div>
            </section>
            <section>

              <div className="listing-card">
                <div className="cardDataContainer">
                  <div className="left">
                    <img src={IconFirstCall} alt="" className="listing-basic-icon1" ></img>
                    <div className="cardData">
                      <div className="listing-tab-text1">First Call   <img src={PlayTrack} alt="" /></div>
                      <div className="listing-tab-text2" >Call Connected to Rohit <span className="subText">(00:01:20) </span> |  Done by: Kaushal Singh <span className="subText">(BDE) </span></div>
                      <div className="listing-tab-text2" >Feedback/Comment: Rohit is interested in Extramarks K-12 Course...</div>
                    </div>
                  </div>
                  <div className="right">
                    <p className="listing-tabsDates">26-07-2022 - 4:30 pm</p>
                  </div>
                </div>
              </div>
            </section>
            <section>
              <div className="listing-card">
                <div className="cardDataContainer">
                  <div className="left">
                    <img src={IconSmsSent} alt="" className="listing-basic-icon1" ></img>
                    <div className="cardData">
                      <div className="listing-tab-text1">SMS Sent <span style={{ color: "#85888A", fontSize: '14px' }}>(Free trial)</span></div>
                      <div style={{fontSize:12}} className="listing-tab-text02">Welcome to Extramarks! <span style={{ color: "#80CC8C" }}>(Delivered)</span></div>
                    </div>
                  </div>
                  <div className="right">
                    <p className="listing-tabsDates">26-07-2022 - 4:30 pm</p>
                  </div>
                </div>
              </div>
            </section>
            <div className="listing-card" >
              <img src={IconUserLoggedIn} alt="" className="listing-basic-icon1" ></img>
              <div>
                <b className="listing-tab-text1">User Logged In</b>
                <p className="listing-tab-text02">Student App <span className="listing-tabs-text-color">(Android)</span></p>
                <div>
                  <p className="listing-tabs-dates listing-tabs-dates4">26-07-2022 - 4:30 pm</p>
                </div>
              </div>
            </div>

            <div className="listing-card">
              <img src={IconFollowUpCall} alt="" className="listing-basic-icon1" ></img>
              <div>
                <b className="listing-tab-text1">Follow Up Call</b>
                <p className="listing-tab-text02">Call Connected to Rohit <span className="listing-tabs-text-color">(00:01:20) </span> |  Done by: Kaushal Singh <span className="listing-tabs-text-color">(BDE) </span></p>
                <p className="listing-tab-text2">Feedback/Comment: Rohit is interested in Extramarks K-12 Course...</p>
                <div>
                  <p className="listing-tabs-dates listing-tabs-dates5"
                  >26-07-2022 - 4:30 pm</p>
                </div>
              </div>
            </div>

            <div className="listing-card">
              <img src={IconAccessedFreemiumContent} alt="" className="listing-basic-icon1" ></img>
              <div>
                <b className="listing-tab-text1">Access Freemium Content</b>
                <p className="listing-tab-text02">History . The Mughal Empire <span className="listing-tabs-text-color">(00:01:20) </span> </p>
                <div>
                  <p className="listing-tabs-dates listing-tabs-dates6"
                  >26-07-2022 - 4:30 pm</p>
                </div>
              </div>
            </div>
            <div className="listing-card">
              <img src={IconBookDemo} alt="" className="listing-basic-icon1" ></img>
              <div>
                <b className="listing-tab-text1">Book a Demo</b>
                <p className="listing-tab-text02">Demo Call . Home Demo</p>
                <div>
                  <p className="listing-tabs-dates listing-tabs-dates7"
                  >26-07-2022 - 4:30 pm</p>
                </div>
              </div>
            </div>

            <div className="listing-card">
              <img src={IconDemoCompleted} alt="" className="listing-basic-icon1" ></img>
              <div>
                <b className="listing-tab-text1">Demo Completed</b>
                <p className="listing-tab-text02">Demo Call . Home Demo . Ready to buy</p>
                <p className="listing-tab-text2" >Done by: Kushal Kumar</p>
                <div>
                  <p className="listing-tabs-dates listing-tabs-dates6">26-07-2022 - 4:30 pm</p>
                </div>

              </div>
            </div>

            <div className="listing-card">
              <img src={IconEmailSent1} alt="" className="listing-basic-icon1" ></img>
              <div>
                <b className="listing-tab-text1">Email Sent</b>
                <p className="listing-tab-text02">Discount Offers<span className="listing-tabs-text-color" >(Promotional) </span> </p>
                <div>
                  <p className="listing-tabs-dates listing-tabs-dates8">26-07-2022 - 4:30 pm</p>
                </div>
              </div>
            </div>

            <div className="listing-card">
              <img src={IconVisitedPackagePage} alt="" className="listing-basic-icon1" ></img>
              <div>
                <b className="listing-tab-text1">Visited Package Page</b>
                <p className="listing-tab-text02">JEE Premium . 12 Months selected </p>
                <p className="listing-tab-text2">CBSE - XII </p>
                <div>
                  <p className="listing-tabs-dates listing-tabs-dates9">26-07-2022 - 4:30 pm</p>
                </div>

              </div>
            </div>

            <div className="listing-card">
              <img src={IconEmailSent2} alt="" className="listing-basic-icon1" ></img>
              <div>
                <b sclassName="listing-tab-text1">Email Sent</b>
                <p className="listing-tab-text02">Discount Offers<span className="listing-tabs-text-color">(Promotional) </span> </p>
                <div>
                  <p className="listing-tabs-dates listing-tabs-dates8">26-07-2022 - 4:30 pm</p>
                </div>
              </div>
            </div>
          </div>
        </Grid>
        {/* //tab panel button */}
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
      <TabPanel value={value} index={3}>
        Item Four
      </TabPanel>
      <TabPanel value={value} index={4}>
        Item Four
      </TabPanel>
      <TabPanel value={value} index={5}>
        Item Four
      </TabPanel>
      <TabPanel value={value} index={6}>
        Item Four
      </TabPanel>
    </Box >
  );
}
