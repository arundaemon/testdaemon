import React, { useState } from 'react';
// material
import { IconButton, Menu, MenuItem } from '@mui/material';
import { json, useNavigate } from 'react-router-dom';
import ArrowDown from "../../assets/icons/icon-dropdown.svg";
import { logout } from '../../config/services/lead';
import Env_Config from "../../config/settings"
import md5 from "md5"
import { getUserData } from '../../helper/randomFunction/localStorage';
import { sendEventToAppPlatform } from '../../helper/randomFunction/activityData';
import { salesApprovalAction } from '../../redux/reducers/salesApprovalReducer';
import { useDispatch } from 'react-redux';



// ----------------------------------------------------------------------

export default function AccountPopover() {
  
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

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [anchorAccountDropdownEl, setAccountDropdownEl] = useState(null);
  const accountDropdownOpen = Boolean(anchorAccountDropdownEl);


  const handleAccountDropdownClick = (event) => {
    setAccountDropdownEl(event?.currentTarget);
  };
  const handleAccountDropdownClose = () => {
    setAccountDropdownEl(null);
  };

  const handleAccountMenuSelect = (e) => {
    const id = e?.target.id
    if (id === 'logout') {
      dispatch(salesApprovalAction.approvalMatrixReset())
      navigate('/logout')
      logoutFunction()
    }
  }
  const logoutFunction = async () => {
    let eventObj = {
      uuid: getUserData('userData').employee_code?? getUserData('userData').lead_id,
      role: getUserData('userData').crm_role,
      login:false
    }
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



  return (
    <>
      <IconButton className="form-icon-btn" onClick={handleAccountDropdownClick}>
        <img src={ArrowDown} className="arrow-details" alt='icon' />
      </IconButton>
      <Menu
        className="account-navigation"
        anchorEl={anchorAccountDropdownEl}
        open={accountDropdownOpen}
        onClose={handleAccountDropdownClose}
        onClick={handleAccountMenuSelect}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 2,
            ml: { xs: '15px', sm: '25px' },
            borderRadius: '8px',
            width: { xs: '160px', sm: '185px', md: '185px' },
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: 0,
              mr: 0,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 30,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* <MenuItem className='text-anchor'>My Account</MenuItem>
          <MenuItem className='text-anchor'>Dashboard</MenuItem>  
          <MenuItem className='text-anchor'>Subscription</MenuItem>
          <MenuItem className='text-anchor'>Redeem Voucher</MenuItem> 
          <MenuItem className='text-anchor'>T&C/Privacy Policy</MenuItem>
          <MenuItem className='text-anchor'>FAQs</MenuItem>  */}
        <MenuItem className='text-anchor' id="logout" >Logout</MenuItem>
      </Menu>
    </>
  );
}


