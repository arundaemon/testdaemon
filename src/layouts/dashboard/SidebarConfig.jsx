import dashboardIcon from '../../assets/icons/icon_dashboard.svg';
import reportIcon from '../../assets/icons/icon_report.svg';
// ----------------------------------------------------------------------


const sidebarConfig = [
  {
    title: 'My CRM',
    path: '/authorised/my-crm',
    label: 'My CRM',
    value: 'myCrm',
    icon: <img src={dashboardIcon} alt='my crm icon' />,
    accessRole: ["superadmin"]
  },
  {
    title: 'Menu',
    path: '/authorised/menu-management',
    label: 'Menu',
    value: 'menu',
    icon: <img src={reportIcon} alt='menu icon'/>,
    accessRole: ["superadmin"]
  }
];




export default sidebarConfig;
