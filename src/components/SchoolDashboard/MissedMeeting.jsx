import {
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography, Box
} from "@mui/material";
import { useStyles } from "../../css/Dasboard-css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Select, { components } from "react-select";
import { getBdeActivitiesByDate } from "../../config/services/bdeActivities";
import { getUserData } from "../../helper/randomFunction/localStorage";
import moment from "moment";
import FormSelect from "../../theme/form/theme2/FormSelect";
import { isLogDay } from "../../helper/randomFunction";
import { ReactComponent as DropDownIcon } from "../../assets/icons/icon-dropdown-2.svg";
import useMediaQuery from "@mui/material/useMediaQuery";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import 'swiper/swiper.min.css'
// import 'swiper/modules/navigation/navigation.min.css';
import { ReactComponent as IconMissedMeetingCardInfo } from "../../assets/icons/icon-dashboard-mm-card-icon-mobile.svg";


export const MissedMeeting = ({isLogActivityStatus, isLogActivity, listType='carousel'}) => {
  const classes = useStyles();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const options = [
    { value: "This Week", label: "This Week" },
    { value: "This Month", label: "This Month" },
  ];

  const [change_view, setValue] = useState({
    label: "This Month",
    value: "This Month",
  });

  const [schoolMeeting, setSchoolMeeting] = useState([]);
  const [isViewAllEnabled, setIsViewAllEnabled] = useState((listType === 'list') ? true : false);
  const navigate = useNavigate();

  const DropdownIndicator = props => {
    return (
      <components.DropdownIndicator {...props}>
        <DropDownIcon />
      </components.DropdownIndicator>
    );
  };

  const getPlannerActivity = async () => {
    let params = {
      roleName: getUserData("userData")?.crm_role,
      // meetingDate: meetingDate,
      granularity: change_view?.value,
    };

    try {
      let data;
      let res = await getBdeActivitiesByDate(params);
      data = res?.result;
      if (data?.length > 0) {
        setSchoolMeeting(data);
        isLogActivityStatus(false)
      } else {
        setSchoolMeeting([]);
        isLogActivityStatus(false)
      }
    } catch (err) {
      console.log(typeof isLogActivityStatus)
      console.error(err);
    }
  };

  useEffect(() => {
    if (isLogActivity || change_view) {
      getPlannerActivity()
    }
  }, [change_view, isLogActivity]);

  
  
  const handleLogMeeting = (data) => {
    const selectedActivity = schoolMeeting?.filter(
      (obj) => obj?._id === data?._id && obj?.name?.length
    );

    if (selectedActivity?.length) {
      navigate("/authorised/logActivity", {
        state: {
          data: selectedActivity,
          selectedActivity:selectedActivity,
          activityLogDate: moment.utc(data?.activityDate).format("YYYY-MM-DD"),
        },
      });
    }
  };

  const MissedMeetingItemEl = ({item}) => {
    return (
      <Box className="crm-sd-mm-mobile-listitem">
        <Box className="crm-sd-mm-mobile-listitem-container">
          <Box className="crm-sd-mm-mobile-listitem-info">
            <Box className="crm-sd-mm-mobile-listitem-details">
              <IconMissedMeetingCardInfo className="crm-sd-mm-mobile-listitem-icon" />
              <Box className="crm-sd-mm-mobile-listitem-title">
                <Typography component={"h3"} >{item?.schoolName}</Typography>
                <Typography component={"p"} >{item?.name?.map((obj) => obj)?.join(",")}</Typography>
              </Box>
            </Box>
            <Box className="crm-sd-mm-mobile-listitem-context">{item.activityName}</Box>
            <Box className="crm-sd-mm-mobile-listitem-time">Date: {moment.utc(item?.activityDate).format("DD MMM YYYY, hh:mm A")}</Box>
          </Box>
          <Box className="crm-sd-mm-mobile-listitem-action">           
            {isLogDay(moment(item?.activityDate)) ? 
              <>
                <Box className="crm-sd-mm-mobile-listitem-description">Because you have a missed meeting log your meeting now.</Box>
                <Button 
                  className="crm-btn crm-btn-primary crm-btn-sm" 
                  onClick={() => handleLogMeeting(item)}
                >
                    Log Now
                </Button>
              </>: ''}
          </Box>
        </Box>
      </Box>
    )
  }

  return (
    <>
      <Grid className="crm-sd-missed-meeting" >
        {
          (listType !== 'list')
            ? <Box className="crm-sd-missed-meeting-header">
                <Box className="crm-space-between">
                  <Typography className='crm-sd-missed-meeting-title'>Missed Meetings</Typography>
                  {(isMobile && (schoolMeeting?.length > 0)) && <Link to="/authorised/missed-meetings" className='crm-anchor crm-anchor-xs'>
                    {isViewAllEnabled ?   'View Less' : 'View All'}
                  </Link>}
                </Box>
                {isMobile
                  ? <Typography component="p" className="crm-sd-missed-meeting-description">Browse through missed meetings for the past days</Typography>
                  // : <Typography component="p" className="crm-sd-missed-meeting-description">Missed Opportunities: Turning Absence into Action</Typography>
                  : <Typography component="p" className="crm-sd-missed-meeting-description">Browse through missed meetings for the past days</Typography>
                  }
              </Box>
            : null
        }
        {
          !isMobile && <Box className='crm-sd-missed-meeting-filters'>
            <Select
              isSearchable={false}
              classNamePrefix="select"
              className="crm-form-input crm-react-select light"
              options={options}
              value={change_view}
              onChange={(e) =>
                setValue({
                  label: e.label,
                  value: e.value,
                })
              }
              components={{ DropdownIndicator }}
            />
        
          </Box>
        }
        {
          isMobile
            ? <>
                {
                  schoolMeeting?.length ?
                    <Box className={`crm-sd-missed-meetings-list ` + (isViewAllEnabled ? `view-all-enabled`: ``)}>
                      {
                        isViewAllEnabled
                          ? schoolMeeting?.map((item, i) => (
                            <MissedMeetingItemEl key={`list1-${i}`} item={item} />
                            ))

                          : <>
                              <Swiper
                                  spaceBetween={10}
                                  slidesPerView="1.3"
                                >
                                  {schoolMeeting?.map((item, i) => (
                                      <SwiperSlide key={`list2-${i}`}>
                                        <MissedMeetingItemEl item={item} />
                                      </SwiperSlide>
                                  ))}
                                
                                </Swiper>
                            </>
                      }
                      
                    </Box>
                  : (
                    <div className='crm-no-results'>"No Missed Meetings"</div>
                  )
                }
              </>

            :  <Grid className='crm-sd-missed-meeting-list' >
                  {schoolMeeting?.length > 0 ? (
                    <>
                      <TableContainer component={Paper} className={classes.cusPaper}>
                        <Table
                          className={classes.table}
                          size="small"
                          aria-label="a dense table"
                        >
        
                          <TableHead
                            className="crm-sd-missed-meeting-list-header"
                          >
                            <TableRow>
                              <TableCell className='crm-sd-missed-meeting-list-header-cell'>
                                School Name
                              </TableCell>
                              <TableCell className='crm-sd-missed-meeting-list-header-cell'>
                                Product
                              </TableCell>
                              <TableCell className='crm-sd-missed-meeting-list-header-cell'>Date</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <>
                              {schoolMeeting?.map((obj, i) => {
                                return (
                                  <TableRow key={`list3-${i}`}>
                                    <TableCell
                                      className='crm-sd-missed-meeting-list-column-cell'
                                      scope="row"
                                    >
                                      {obj?.schoolName}
                                    </TableCell>
                                    <TableCell
                                      className='crm-sd-missed-meeting-list-column-cell'
                                      scope="row"
                                    >
                                      {obj?.name?.map((obj) => obj)?.join(",")}
                                    </TableCell>
                                    <TableCell
                                      className='crm-sd-missed-meeting-list-column-cell'
                                      scope="row"
                                    >
        
                                      {moment.utc(obj?.activityDate).format("DD-MM-YYYY")}
                                    </TableCell>
                                    <TableCell
                                      className='crm-sd-missed-meeting-list-column-cell p-0 crm-sd-meeting-table-action-cell'
                                      scope="row"
                                    >
                                      {isLogDay(moment(obj?.activityDate)) ? <Button
                                        className='crm-anchor crm-anchor-small p-0'
                                        onClick={() => handleLogMeeting(obj)}
                                      >
                                        Log
                                      </Button> : ''}
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </>
                          </TableBody>
        
                        </Table>
                      </TableContainer>
                    </>
                  ) : (
                    <div className='crm-no-results'>"No Missed Meetings"</div>
                  )}
        
                  
                </Grid>
        }
        
      </Grid>
    </>
  );
};
