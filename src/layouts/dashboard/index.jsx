import { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Outlet, useParams } from 'react-router-dom';
import DashboardNavbar from './DashboardNavbar';
import DashboardSidebar from './DashboardSidebar';

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 80;

const RootStyle = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden'
});

const MainStyle = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  // paddingTop: APP_BAR_MOBILE + 30,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 10,
    paddingLeft: theme.spacing(0),
    paddingRight: theme.spacing(0)
  }
}));

// ----------------------------------------------------------------------
//const socketWorker = new SharedWorker('../socketWorker.js')
export default function DashboardLayout() {
  const [open, setOpen] = useState(false);

  return (
    <RootStyle>
      <DashboardNavbar onOpenSidebar={() => setOpen(true)} />

      <DashboardSidebar isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />

      <MainStyle id='main-content' className='main-content'>
        <Outlet />
      </MainStyle>
    </RootStyle>


  );

}
