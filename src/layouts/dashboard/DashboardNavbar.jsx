import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Icon } from "@iconify/react";
import menu2Fill from "@iconify/icons-eva/menu-2-fill";
// material
import { alpha, styled } from "@mui/material/styles";
import {
  Box,
  Stack,
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Modal,
  Typography,
} from "@mui/material";
// components
import AccountPopover from "./AccountPopover";
import NotificationIcon from "../../assets/icons/icon_notification.svg";
import Avatar from "@mui/material/Avatar";
import useMediaQuery from "@mui/material/useMediaQuery";
import { ReactComponent as IconLogoMobile } from "./../../assets/icons/icon-logo-mobile.svg";
// import { ReactComponent as IconNotificationMobile } from "./../../assets/icons/icon-notification-mobile.svg";
import { ReactComponent as IconNotificationMobile } from "./../../assets/icons/icon-header-alert-icon.svg";
import { ReactComponent as IconNavSearch } from "./../../assets/icons/icon-nav-search.svg";
import { getAlertNotification } from "../../config/services/alertNotification";
import { getUserData } from "../../helper/randomFunction/localStorage";
import { useNavigate } from "react-router-dom";
import { fieldTab } from "../../constants/general";
import { NotificationPopover } from "./NotificationPopover";

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 182;
const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 80;

const RootStyle = styled(AppBar)(({ theme }) => ({
  boxShadow: "none",
  backdropFilter: "blur(6px)",
  WebkitBackdropFilter: "blur(6px)", // Fix on Mobile
  backgroundColor: alpha(theme.palette.background.default, 0.72),
  [theme.breakpoints.up("lg")]: {
    width: `calc(100% - ${DRAWER_WIDTH + 1}px)`,
  },
}));

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  minHeight: APPBAR_MOBILE,
  [theme.breakpoints.up("lg")]: {
    minHeight: APPBAR_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));

// ----------------------------------------------------------------------

DashboardNavbar.propTypes = {
  onOpenSidebar: PropTypes.func,
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "600px !important",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default function DashboardNavbar({ onOpenSidebar }) {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const profileImage = userData?.profile_image;
  const initials = userData?.name.substring(0, 1);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const [isNotification, setIsNotification] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationData, setNotifyData] = useState([]);
  const navigate = useNavigate()

  const handleNotificationClick = (event) => {
    setIsNotification(!isNotification);
    setAnchorEl(event.currentTarget);
  };

  // State for the notification count
  const [notificationCount, setNotificationCount] = useState(1); // Set your initial count

  const handleClose = () => {
    setIsNotification(false);
  };

  const getNotification = async () => {
    let query = getUserData("userData")?.username?.toUpperCase();
    try {
      let res = await getAlertNotification(query);
      if (res?.result?.length) {
        setNotifyData(res?.result);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getNotification();
  }, []);

  const redirectSideServer = (data) => {
    let _url = data?.redirectLink
    setIsNotification(false)
    navigate(_url, {state: {linkType: fieldTab?.Implementation}});
  }

  return (
    <>
      <RootStyle>
        <ToolbarStyle
          className={
            `main-header mobile-header ` +
            (isMobile ? ` crm-is-mobile-view` : ``)
          }
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={{ xs: 0.5, sm: 1.5 }}
          >
            <IconButton
              onClick={onOpenSidebar}
              sx={{ mr: 1, color: "text.primary" }}
              className="mob-menu"
            >
              <Icon icon={menu2Fill} />
            </IconButton>
            <div className="appHeader_left">
              <div className="appHeader_logo">
                {isMobile ? (
                  <IconLogoMobile
                    className="crm-logo-mobile"
                    onClick={isMobile ? onOpenSidebar : null}
                  />
                ) : (
                  <Avatar className="img-fluid">
                    {profileImage ? (
                      <img src={profileImage} alt="logo" />
                    ) : (
                      initials
                    )}
                  </Avatar>
                )}
              </div>
              <div className="d-none-mobile">
                <h2 className="text-50 fw-600">
                  Hello! {JSON.parse(localStorage.getItem("userData"))?.name}
                </h2>
              </div>
            </div>
          </Stack>
          <Box sx={{ flexGrow: 1 }} />
          <Stack
            direction="row"
            alignItems="center"
            spacing={{ xs: 0.5, sm: 1.5 }}
          >
            <div className="appHeader_right">
              <ul className="list-inline">
                <li className="list-inline-item">
                  {isMobile ? (
                    <IconNotificationMobile />
                  ) : (
                    <img
                      src={NotificationIcon}
                      alt="notification"
                      onClick={handleNotificationClick}
                      style={{ cursor: "pointer" }}
                    />
                  )}
                  {isNotification && <NotificationPopover anchorEl={anchorEl}/>}
                </li>
                {/* <li className="list-inline-item">
                  {isMobile ? <IconNavSearch /> : null}
                </li> */}
              </ul>
            </div>
            {!isMobile ? <AccountPopover /> : null}
          </Stack>
        </ToolbarStyle>
      </RootStyle>
    </>
  );
}
