import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  ClickAwayListener,
  Fade,
  Grid,
  Paper,
  Popper,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  getAlertNotification,
  updateAlertNotificationStatus,
} from "../../config/services/alertNotification";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as IconNotificationMobile } from "./../../assets/icons/icon-notification-mobile.svg";
import { getUserData } from "../../helper/randomFunction/localStorage";
import { fieldTab } from "../../constants/general";
import moment from 'moment';

export const NotificationPopover = ({ anchorEl }) => {
  // const userData
  const [allAlerts, setAllAlerts] = useState([]);
  const navigate = useNavigate();
  const [show, setShow] = useState(true);

  const getAllAlertNotification = async () => {
    try {
      const alerts = await getAlertNotification(
        getUserData("userData")?.username?.toUpperCase()
      );
      setAllAlerts(alerts?.result);
    } catch (err) {
      console.error("Error while fetching notification", err);
    }
  };

  useEffect(() => {
    getAllAlertNotification();
  }, []);

  const handleClickAway = () => {
    setShow(false);
  };

  const TruncatedText = ({ text, maxLength }) => {
    return (
      <Typography
        gutterBottom
        sx={{ width: "100%", overflow: "hidden", textOverflow: "ellipsis" }}
        color="text.secondary"
        className="crm-notification-sub-title"
      >
        {text.length > maxLength ? `${text.substring(0, maxLength)}...` : text}
      </Typography>
    );
  };

  const redirectSideServer = async (data) => {
    let _url = data?.redirectLink;
    let params = {
      _id: data?._id,
    };
    
    try {
      let res = await updateAlertNotificationStatus(params);
      if (res?.result) {
        handleClickAway()
        navigate(_url, { state: { linkType: fieldTab?.Implementation } });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <ClickAwayListener onClickAway={handleClickAway}>
        <Popper
          open={show}
          anchorEl={anchorEl}
          sx={{ p: 2 }}
          transition
          disablePortal
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              {allAlerts.length > 0 ? (
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    backgroundColor: "#FFF",
                    borderRadius: "8px",
                    maxHeight: 500,
                    overflow: "auto",
                    boxShadow: 'none'
                  }}
                >
                  <Card
                    className="crm-notification-header"
                    sx={{
                      width: 450,
                      display: "flex",
                      borderBottom: "1px solid #dedede",
                      marginBottom: "10px",
                      borderRadius: "7px",
                      position: "relative",
                      boxShadow: 'none',
                    }}
                  >
                    <CardContent
                      sx={{
                        p: 0,
                        display: "flex",
                        flexDirection: "column",
                        width: '100%'
                      }}
                    >
                      <Box className="crm-space-between">
                        <Typography
                          gutterBottom
                          variant="h5"
                          component="div"
                          className="crm-notification-title"
                        >
                          Alerts!
                        </Typography>
                        <a className="crm-anchor crm-anchor-small">View More</a>
                      </Box>
                      
                      <Typography component={"div"} className="crm-notification-sub-title">These alerts are system generated.</Typography>
                      <Typography component={"p"} className="crm-notification-day">Today</Typography>
                    </CardContent>
                  </Card>
                  {allAlerts.length > 0 &&
                    allAlerts?.map((alert) => (
                      <Card
                        className="crm-notification-item"
                        sx={{
                          width: 450,
                          display: "flex",
                          borderBottom: "1px solid #dedede",
                          marginBottom: "10px",
                          borderRadius: "7px",
                          position: "relative",
                          boxShadow: 'none',
                        }}
                      >
                        {/* <Box
                          sx={{
                            minWidth: 100,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <IconNotificationMobile />
                        </Box> */}
                        <Box>
                          <CardContent
                            sx={{
                              p: 0,
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            <Typography
                              gutterBottom
                              variant="h5"
                              component="div"
                              className="crm-notification-title"
                            >
                              {alert.title}
                            </Typography>
                            <TruncatedText
                              text={alert.description}
                              maxLength={100}
                            />
                            <Box className="crm-space-between">
                            <p className="crm-notification-sub-title">{moment.utc(alert.createdAt).local().format('hh:mm A')}</p>
                            <p onClick={() => redirectSideServer(alert)} className="crm-anchor crm-anchor-small text-right">Take Action</p>
                            </Box>
                          </CardContent>
                          
                        </Box>
                      </Card>
                    ))}
                </Paper>
              ) : (
                <Alert severity="error" color="info">
                  <strong>No notification present!</strong>
                </Alert>
              )}
            </Fade>
          )}
        </Popper>
      </ClickAwayListener>
    </>
  );
};
