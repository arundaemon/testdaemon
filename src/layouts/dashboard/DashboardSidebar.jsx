import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { Box, Button, Drawer, Grid, Stack, Typography } from '@mui/material';
import ReactSelect from 'react-select';
import Logo from '../../components/Logo';
import Scrollbar from '../../components/Scrollbar';
import NavSection from '../../components/NavSection';
import { MHidden } from '../../components/@material-extend';
import { getAllSideBarMenus } from '../../config/services/menus';
import { getAllMenus, getAllGroupedMenu } from '../../config/services/menus';
import { EncryptData,DecryptData } from '../../utils/encryptDecrypt';
import { getAllChildRoles } from '../../config/services/hrmServices';
import { makeStyles } from '@mui/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {ReactComponent as IconCancel } from './../../assets/icons/icon_close.svg';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { styled as CustomStyled } from '@mui/material/styles';

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 182;
const DRAWER_WIDTH_MOBILE = '100vw';

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    width: DRAWER_WIDTH
  },
}));

const customStyles = {
  control: (base, state) => ({
    ...base,
    background: "#fff",
    borderRadius:4,
    // match with the menu
    // borderRadius: state.isFocused ? "3px 3px 0 0" : 3,
    // Overwrittes the different states of border
    borderColor: state.isFocused ? "#dedede" : "#dedede",
    // Removes weird border around container
    // boxShadow: state.isFocused ? null : null,
    "&:hover": {
      // Overwrittes the different states of border
      // borderColor: state.isFocused ? "red" : "blue"
    }
  }),
  menu: base => ({
    ...base,
    // override border radius to match the box
    borderRadius: 3,
    // kill the gap
    marginTop: 0,
    color: "#000",
    border: "none",
  }),
  menuList: base => ({
    ...base,
    // kill the white space on first and last option
    padding: 0,
    backgroundColor: "#fff",
    borderRadius:4,

  })
};

// ----------------------------------------------------------------------

DashboardSidebar.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func
};

const useStyles = makeStyles((theme) => ({
  
  boxItem : {
    fontSize: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    cursor: 'pointer'
  },
  active : {
    fontWeight: 'bold'
  }, 
  ImgAttr : {
    width: '30px',
    margin: '0 auto'  
  },
  headBox : {
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
    gap: '5px',
    padding: '10px 20px 20px',
    borderBottom: '1px solid #dedede',
    alignItems: 'center',
    marginBottom: '20px',
    [theme.breakpoints.down('md')]: {
      padding: '0 0 30px 20px',
      marginBottom: '20px',
      gap: '10px',
    },
  },
  headBoxImg : {
    width: '20px',
    [theme.breakpoints.down('md')]: {
      width: '40px',
    },
  },
  btnClass : {
    color: '#f45e29',
    fontSize: '14px',
    cursor: 'pointer',
    textAlign: 'right',
    padding: '10px 0',
    marginRight: '10px'
  },
  paraBreak: {
    wordBreak: 'break-word'
  }
}))

export default function DashboardSidebar({ isOpenSidebar, onCloseSidebar }) {
  const classes = useStyles();
  const { pathname } = useLocation();
  const [sidebarConfig, setSidebarConfig] = useState([])
  const userProfile = JSON.parse(localStorage.getItem('userData'))?.crm_profile
  const [role, setRole] = useState(null);
  const [roleList, setRoleList] = useState(JSON.parse(localStorage.getItem('userRoles')));
  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('userData')));
  const [active, setActive] = useState(null)
  const [toggle, setToggleStatus] = useState(true)
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));

  let roleListOptions = roleList?.map((role) =>{
                            return{
                              label: role,
                              value: role
                            }
                        });
                        
  const TooltipInterface = CustomStyled(({ ...props }) => (
    <Tooltip {...props} arrow classes={{ popper: 'crm-tooltip-wrapper' }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: '#CFE0FF',
      fontSize: 16,
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#CFE0FF',
      color: '#202124',
      padding: '6px',
      fontSize: '10px',
      borderRadius: '4px',
      // marginTop: '4px',
    },
  }));

  const updateMenu = (menu) => {
    let menuUpdated = {
      title: menu?.name,
      path: menu?.route,
      label: menu?.name,
      value: menu?.value,
      icon: <img src={menu?.iconUrl} alt='' />,
      accessRole: menu?.rolesAllowed,
      externalRedirection: menu?.externalRedirection,
      isHrmMenu: menu?.isHrmMenu,
      landingPage: menu?.landingPage,
      menuOrderIndex: menu?.menuOrderIndex,
      otpVerify:menu?.otpVerify
    }
    return menuUpdated
  }

  const getSidebarConfigList = () => {
    if(localStorage.getItem('menus')){
      let menuItems = DecryptData(localStorage.getItem('menus'))
      formatMenuItems(menuItems)    
    }else{
      getAllGroupedMenu()
      .then((res) => {
        if (res?.result) {          
          localStorage.setItem('menus',EncryptData(res?.result))
          formatMenuItems(res?.result)    
        }
      })
      .catch(err => console.error(err))
    }
    
  }

  const formatMenuItems = (menuItems) => {
    let MenusArray = []
    menuItems.forEach(menuObj => {
      if (menuObj?._id?.parentId) {
        let menu1 = updateMenu(menuObj?.parentDetails[0]);
        let childMenu = menuObj?.menus.map((menu) => updateMenu(menu));
        menu1.children = childMenu;
        //sort to apply on childMenu based on menuOrderIndex key...
        childMenu.sort(function (a, b) {
          var keyA = a.menuOrderIndex
          var keyB = b.menuOrderIndex

          if (keyA < keyB) return -1;
          if (keyA > keyB) return 1;
          return 0;
        });
        // console.log(childMenu,"chide menu to see..;;")

        MenusArray = [...MenusArray, menu1];
        return
      }

      let modiFiedMenus = menuObj?.menus.map((menu) => updateMenu(menu));
      // console.log(modiFiedMenus,"modifiedmenus.....")

      MenusArray.map(menuObj => {
        // console.log(menuObj,"menu obect...///...")
        let menuExistIndex = modiFiedMenus.findIndex(obj => obj?.title === menuObj?.title)
        if (menuExistIndex >= 0) {
          modiFiedMenus.splice(menuExistIndex, 1)
        }
      })

      MenusArray = [...MenusArray, ...modiFiedMenus];
    })
    const key = 'title'
    MenusArray = [...new Map(MenusArray.map(item => [item[key], item])).values()]
    setSidebarConfig(MenusArray) 
  }

  const handleRoleChange = async(e) =>{
    let data = {...userData,crm_role: active};
    localStorage.setItem('userData',JSON.stringify(data));
    const response = await getAllChildRoles({role_name: active});
    let childs = response?.data?.response?.data?.all_child_roles;
    localStorage.setItem('childRoles', EncryptData(childs ?? []))

    // console.log("finalData",finalData)
    setRole(active);
    window.location.reload()
    // window.dispatchEvent(new Event('storage'))
  }




  const setInitial = () =>{
    const { crm_role } = userData;
    setRole(crm_role)
  }



  useEffect(() =>{
    setInitial();
  },[])

  useEffect( () => {
    if (active) {
      handleRoleChange()
    }
  }, [active])

  useEffect(() => {
    getSidebarConfigList()
  }, [])

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: '100%',
        '& .simplebar-content': { height: '100%', display: 'flex', flexDirection: 'column' }
      }}
      className={`sidebar-main ` + (isMobile ? `crm-sidebar-main-mobile` : ``)}
    >
      <Box >
        <Box component={RouterLink} to={'/authorised/school-dashboard'} sx={{ display: 'inline-flex' }} className='main_logo'>
          <Logo />
        </Box>
        <Box className='crm-mobile-menu-close'>
          <IconCancel className='crm-mobile-menu-close-icon' onClick={onCloseSidebar} />
        </Box>
        <Box>
          <div className={classes.headBox}>
            <img src="/Round.png" className={classes.headBoxImg}/>
            <Box >
              <p className={classes.paraBreak + ` crm-menu-user-role`}>{role}</p>
              {/* {
                isMobile ?  <p className={classes.paraBreak + ` crm-menu-user-subtext`}>You have 3 events Today.</p> : null
              } */}
            </Box>
          </div>
        </Box>
        <Box className='crm-menu-nav-roles'>
          {roleList?.length > 1 ? <Grid container spacing={2}>
            { 
            toggle ? 
              roleList?.slice(0,2)?.map((data, i) => {
                return (
                  <Grid item key={i} xs={6} >
                    <div className={`${classes.boxItem} ${data == role && classes.active}`}
                    onClick={() => setActive(data)}
                    >
                      <img src="/Round.png" className={classes.ImgAttr}/>
                      <TooltipInterface className="crm-tooltip" title={data}  ><p className='crm-nav-role-title'>{data}</p></TooltipInterface>
                    </div>
                  </Grid>
                )
              }) 
              : roleList?.map((data, i) => {
                return (
                  <Grid item key={i} xs={6} sx={{ px: "8px", py: "8px" }}>
                    <div className={`${classes.boxItem} ${data == role && classes.active}`}
                    onClick={() => setActive(data)}
                    >
                      <img src="/Round.png" className={classes.ImgAttr}/>
                      <TooltipInterface title={data} className="crm-tooltip"  ><p className='crm-nav-role-title'>{data}</p></TooltipInterface>
                    </div>
                  </Grid>
                )
              }) 
            }
          </Grid> : ''}
        
          {roleList?.length > 2 ? <Box sx={{my: 2}}>
            <p onClick={() => setToggleStatus(!toggle)} className={`crm-anchor crm-anchor-small text-right`}>{toggle ? "Show More" : "Show Less"}</p>
          </Box> : ''}
        </Box>
        {/* {roleListOptions?.length > 1 ? <Stack direction={'column'}>
           <Typography sx={{marginBottom: "5px", color: "#637381"}}>Select Role</Typography>
            <ReactSelect 
                styles={customStyles} 
                className="header-role-list" 
                options={roleListOptions}
                onChange={handleRoleChange}
                value={role}
            />
        </Stack> : ''} */}
      </Box>
      <NavSection navConfig={sidebarConfig} />
      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );





  return (
    <RootStyle>
      <MHidden width="lgUp">
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{
            sx: { width: isMobile ? DRAWER_WIDTH_MOBILE : DRAWER_WIDTH }
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden>

      <MHidden width="lgDown">
        <Drawer
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              bgcolor: 'background.default'
            }
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden>
    </RootStyle>
  );
}
