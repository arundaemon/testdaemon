import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { NavLink as RouterLink, matchPath, useLocation } from 'react-router-dom';
import arrowIosForwardFill from '@iconify/icons-eva/arrow-ios-forward-fill';
import arrowIosDownwardFill from '@iconify/icons-eva/arrow-ios-downward-fill';
// material
import { alpha, useTheme, styled } from '@mui/material/styles';
import { Box, List, Collapse, ListItemText, ListItemIcon, ListItem, Button, Typography, Modal, ListItemButton, } from '@mui/material';
import { makeStyles } from '@mui/styles'
import { useNavigate } from 'react-router-dom';
import OtpInput from 'react-otp-input';
import { ForgetPassword } from '../config/services/forgetPassword';
import { OtpVerification } from '../config/services/otpVerification';
import { toast } from "react-hot-toast";
import { convertLength } from '@mui/material/styles/cssUtils';
import { ReactComponent as IconSignout } from './../assets/icons/icon-signout.svg';
import { logout } from '../config/services/lead';
import Env_Config from "../config/settings"
import md5 from "md5"
import { getUserData } from '../helper/randomFunction/localStorage';
import { sendEventToAppPlatform } from '../helper/randomFunction/activityData';
import useMediaQuery from '@mui/material/useMediaQuery';

// ----------------------------------------------------------------------
const useStyles = makeStyles((theme) => ({
  imageClose: {
    transform: "rotate(90deg)",
  }, imageOpen: {
    transform: "rotate(270deg)"
  },
  childContaienr: {
    marginLeft: "60px",
    transition: " all 0.3s ease-in-out 0s, visibility 0s linear 0.3s, z-index 0s linear 0.01s;"
  },
  childItem: {
    fontSize: "12px",
    lineHeight: "17px",
    marginTop: "8px",
    marginBottom: "8px",
    color: "#202124",
    cursor: "pointer",
    '&:hover': { color: "#f45e29" }
  }
}))
const ListItemStyle = styled((props) => <ListItem className='main-nav-item' disableGutters {...props} />)(
  ({ theme }) => ({
    ...theme.typography.body2,
    height: 48,
    position: 'relative',
    textTransform: 'capitalize',
    paddingLeft: theme.spacing(2.5),
    paddingRight: theme.spacing(2),
    color: theme.palette.text.secondary,
    cursor: 'pointer',
    '&:before': {
      top: 0,
      right: 0,
      width: 3,
      bottom: 0,
      content: "''",
      display: 'none',
      position: 'absolute',
      borderTopLeftRadius: 4,
      borderBottomLeftRadius: 4,
      backgroundColor: theme.palette.theme_color.dark
    }
  })
);

const ListItemIconStyle = styled(ListItemIcon)({
  width: 22,
  height: 22,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
});

// ----------------------------------------------------------------------

NavItem.propTypes = {
  item: PropTypes.object,
  active: PropTypes.func
};

function NavItem({ item, active }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const isActiveRoot = active(item.path);
  const { title, path, icon, info, children, externalRedirection, otpVerify } = item;
  const [open, setOpen] = useState(isActiveRoot);
  const [otpModal, setOtpModal] = useState(false);
  const [newOtpVerify, setOtpVerify] = useState('')
  const [close_modal, setModalClose] = useState(true)
  const [requestStamp, setRequestStamp] = useState('')
  const [menuItem, setMenuItem] = useState(null)
  const formRef = useRef();

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };

  const handleOpen = () => {
    setOpen((prev) => !prev);
  };



  const activeRootStyle = {
    color: 'theme_color.dark',
    fontWeight: 'fontWeightMedium',
    bgcolor: alpha(theme.palette.theme_color.dark, theme.palette.action.selectedOpacity),
    '&:before': { display: 'block' }
  };

  const activeSubStyle = {
    color: 'text.primary',
    fontWeight: 'fontWeightMedium'
  };

  const classes = useStyles();

  const handleOtpChange = (otp) => setOtpVerify(otp);

  const onHandleClose = () => {
    setModalClose(false)
    setOtpModal(false)
    setOtpVerify('')
  }

  const renderComponentType = () => {
    if (item?.isHrmMenu) {
      return { component: null, href: null, to: null }
    }
    else if (externalRedirection && otpVerify) {
      return { component: 'a', href: path, to: path }
    }
    else {
      return { component: RouterLink, href: null, to: path }
    }
  }

  const RedirectMenuClick = (item) => {
    let userName = JSON.parse(localStorage.getItem('userData'))?.username
    let access_token = JSON.parse(localStorage.getItem('loginData'))?.access_token
    let landingPage = item?.landingPage
    let routeAuthBase64 = btoa(`${userName}:${access_token}:${landingPage}`)
    let _url = `${item.path}/${routeAuthBase64}`
    var win = window.open(_url, '_blank');
    win.focus();
  }


  const handleRouteClick = async () => {
    setMenuItem(item)
    if (item?.externalRedirection && !item?.otpVerify) {
      RedirectMenuClick(item)
    }
    else if (item?.externalRedirection && item?.otpVerify) {
      var Data = await ForgetPassword()
      setRequestStamp(Data?.data?.timestamp)
      setOtpModal(true)
    }
  }


  const handleChildRouteClick = async (itemObj) => {
    setMenuItem(itemObj)
    if (itemObj?.externalRedirection && !item?.otpVerify) {
      RedirectMenuClick(itemObj)
    }
    else if (item?.externalRedirection && item?.otpVerify) {
      var Data = await ForgetPassword()
      setRequestStamp(Data?.data?.timestamp)
      setOtpModal(true)
    }
  }

  const onVerifyOtp = async (event) => {

    event.preventDefault();
    let userName = JSON.parse(localStorage.getItem('userData'))?.username
    let access_token = JSON.parse(localStorage.getItem('loginData'))?.access_token
    let landingPage = menuItem?.landingPage
    let path = menuItem?.path
    let params = {
      "username": userName,
      "otpVerify": newOtpVerify,
      "requestStamp": requestStamp
    }


    const data = await OtpVerification(params)

    if (data?.status === 1) {
      toast.success(data?.message)
      if (landingPage !== "conveyance") {
        let routeAuthBase64 = btoa(`${userName}:${access_token}:${landingPage}`)
        let _url = `${path}/${routeAuthBase64}`
        var win = window.open(_url, '_blank');
        win.focus();

      }
      else {
        let route = `username/${userName}/redirectpage/conveyance/token/${access_token}`
        let _url = `${path}/${route}`
        var win = window.open(_url, '_blank');
        win.focus();

      }
    }
    else {
      toast.error(data?.message)
    }
    setOtpModal(false)
    setMenuItem(null)
    setOtpVerify('')
  }

  function handleKeyPress(event) {   // for submitting otp modal on pressing enter key
    if (event.key === 'Enter') {
      formRef.current.submit();
    }
  }





  if (children) {
    return (
      <>
        <ListItemStyle
          className="crm-nav-menuitem"
          onClick={handleOpen}
          sx={{
            ...(isActiveRoot && activeRootStyle)
          }}
        >
          <ListItemIconStyle>{icon && icon}</ListItemIconStyle>
          <ListItemText disableTypography primary={title} />
          {info && info}
          <Box
            className={`box-col-pointer crm-nav-menuitem-icon ` + (open ? `crm-menu-nav-open`: ``)}
            component={Icon}
            icon={open ? arrowIosDownwardFill : arrowIosForwardFill}
            sx={{ width: 16, height: 16, ml: 1 }}
          />
        </ListItemStyle>

        <Collapse in={open} timeout="auto" unmountOnExit className='menu-collapse' >
          <List component="div" disablePadding className='crm-nav-menu-list'>
            {children.map((item, i) => {
              const { title, path } = item;
              const isActiveSub = active(path);

              return (
                <ListItemStyle key={i} component={RouterLink}
                  to={path} sx={{ ...(isActiveRoot && activeRootStyle) }}
                  onClick={() => handleChildRouteClick(item)}
                >
                  {/* <ListItemIconStyle>{item?.icon}</ListItemIconStyle> */}
                  {/* <ListItemIconStyle>
                    <Box
                      component="span"
                      sx={{
                        width: 4,
                        height: 4,
                        display: 'flex',
                        borderRadius: '50%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'text.disabled',
                        transition: (theme) => theme.transitions.create('transform'),
                        ...(isActiveSub && {
                          transform: 'scale(2)',
                          bgcolor: 'primary.main'
                        })
                      }}
                    />
                  </ListItemIconStyle> */}
                  <ListItemText disableTypography primary={title} />
                </ListItemStyle>
              );
            })}
          </List>
        </Collapse>
      </>
    );
  }



  return (
    <>
      <ListItemStyle
        className="crm-nav-menuitem"
        component={renderComponentType()?.component}
        href={renderComponentType()?.href}
        to={renderComponentType()?.to}
        sx={{ ...(isActiveRoot && activeRootStyle) }}
        onClick={handleRouteClick}
      >
        <ListItemIconStyle>{icon && icon}</ListItemIconStyle>
        <ListItemText disableTypography primary={title} />
        {info && info}
      </ListItemStyle>

      {
        otpModal ? <Modal
          open={otpModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <form onSubmit={onVerifyOtp} ref={formRef}>
              <div className='mdl_close'>
                <img src="/cancel_icon.svg" onClick={onHandleClose} />
              </div>
              <Typography id="modal-modal-title" sx={{ textAlign: 'center' }} variant="h6" component="h2">
                Enter OTP
              </Typography>
              <Typography id="modal-modal-description" sx={{ padding: "30px 0" }} >
                <OtpInput
                  numInputs={6}
                  value={newOtpVerify}
                  onChange={handleOtpChange}
                  className="testOtpBox"
                  onKeyPress={handleKeyPress}
                  isInputNum={true}
                  shouldAutoFocus={true}
                  separator={<span> <div className='mdlboxGap' /> </span>
                  }
                />
              </Typography>
              <div className='' style={{ marginLeft: "125px" }}>
                <button className="verifyOtpbtn" type="submit" >Verify
                </button>
              </div>
            </form>
          </Box>
        </Modal> : ""
      }
    </>
  );
}

const logoutFunction = async () => {
  let eventObj = {
    uuid: getUserData('userData').employee_code?? getUserData('userData').lead_id,
    role: getUserData('userData').crm_role,
    login:false
  }
  const getCheckSum = (action, apikey, username, saltKey) => {
    let checksum = md5(`${action}:${apikey}:${username}:${saltKey}`)
    return checksum
  }
  let action = 'cognito_logout'
  let apikey = Env_Config.WEBSITE_API_KEY
  let saltKey = Env_Config.WEBSITE_SALT_KEY
  let username = getUserData('userData')?.username
  let refresh_token = getUserData('loginData')?.refresh_token
  let em_user_id = getUserData('userData')?.em_user_id
  let gts_user_id = getUserData('userData')?.gts_user_id
  let checksum = getCheckSum(action, apikey, username, saltKey)

  sendEventToAppPlatform('loginEvent', eventObj)
  let params = {
    action,
    apikey,
    checksum,
    refresh_token,
    username,
    em_user_id,
    gts_user_id
  }
  try {
    let res = await logout(params)
    if (res) {
      return;
    }
  } catch (err) {
    console.error(err)
  }
}

NavSection.propTypes = {
  navConfig: PropTypes.array
};

export default function NavSection({ navConfig, ...other }) {
  //console.log(navConfig)
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleAccountMenuSelect = (e) => {
    //const id = e?.target.id
    navigate('/logout')
    logoutFunction()
  }

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));

  const match = (path) => (path ? !!matchPath({ path, end: false }, pathname) : false);

  return (

    <Box {...other} className='main-navigation'>
      <List disablePadding>
        {navConfig.map((item) => <NavItem  key={item.title} item={item} active={match} />)}
        {
          isMobile
            ? <ListItem className='crm-nav-menuitem' onClick={handleAccountMenuSelect}>
                <ListItemIcon>
                  <IconSignout />
                </ListItemIcon>
                <ListItemText primary="Signout" />
              </ListItem>
            : null
        }
      </List>
    </Box>

  );
}
