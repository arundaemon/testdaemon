import { makeStyles } from '@mui/styles';
import { Modal } from '@material-ui/core';

export const useStyles = makeStyles((theme) => ({
  prevPointer: {
    fontSize: "14px",
    textDecoration: "none",
    cursor: "pointer",
  },
  activePointer: {
    fontSize: "14px",
    fontWeight: "600"
  },
  cusCard: {
    padding: "2px",
    boxShadow: "0px 0px 8px #00000029",
    borderRadius: "8px",
  },
  cusCardLog: {
    padding: "2px",
    boxShadow: "0px 0px 8px #00000029",
    borderRadius: "8px",
    margin: '10px'
  },
  RevenueCard: {
    padding: "0px",
    overflow: "hidden",
  },
  subTitle: {
    fontSize: "14px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#000000",
  },
  selectSection: {
    borderRadius: "0",
    paddingBottom: "0",
    paddingTop: "1px"
  },
  borderRight: {
    borderRight: "1px solid #DEDEDE",
  },
  title: {
    fontWeight: "600",
    color: "#202124",
    fontSize: '16px',
    marginLeft: '10px'
  },
  headtitle: {
    fontWeight: "600",
    color: "#202124",
    fontSize: '16px',
    borderBottom: '3px solid #eee',
    paddingBottom: '10px'
  },
  discBox: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    height: "100%",
    alignItems: 'center',
    paddingBottom: '20px'
  },
  subTitle: {
    fontSize: "12px",
  },
  viewAllBtn: {
    fontSize: "12px",
  },
  taskListSection: {
    maxHeight: "12.5rem",
    overflow: "auto",
  },

  taskListSectionParent: {
    maxHeight: "12.5rem",
    overflow: "auto",
  },
  
  taskListCalendar: {
    maxHeight: "9rem",
    overflow: "auto",
  },
  taskList: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #ccc",
  },
  task: {
    fontSize: "14px",
    fontWeight: "600",
  },
  time: {
    fontSize: "14px",
    fontWeight: "400",
  },
  cusPaper: {
    boxShadow: "none",
    marginBottom: "10px",
  },
  tableHead: {
    fontWeight: "600",
    color: "#202124",
    padding: '6px 16px'
  },
  borderNone: {
    borderBottom: "none",
    paddingTop: '16px'
  },
  tskPending: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    height: "10vh",
    alignItems: "center",
    fontStyle: "italic"
  },
  submitBtn: {
    backgroundColor: "#f45e29",
    border: "1px solid #f45e29",
    borderRadius: "4px !important",
    color: "#ffffff !important",
    padding: "5px 10px !important",
    "&:hover": {
      color: "#f45e29 !important",
    }
  },
  ContentContainer: {
    [theme.breakpoints.down('md')]: {
      boxShadow: "0px 0px 8px #00000029",
      borderRadius: '8px'

    }
  },
  headerSection: {
    borderBottom: "1px solid #ccc",
    [theme.breakpoints.down('md')]: {
      borderBottom: 'none',
      paddingLeft: '0',
      paddingRight: "0",
    }
  },
  customButtomFlx: {
    display: 'flex',
    justifyContent: 'right',
    width: '100%',
    gap: '10px',
    marginTop: '25px'
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    marginBottom: "6px",
  },
  inputStyle: {
    fontSize: "1rem",
    padding: "8.8px",
    width: "100%",
    borderRadius: "4px",
    border: "1px solid #DEDEDE",
  },
  schoolAddress: {
    fontSize: '13.5px',
  },
  schoolProduct: {
    fontSize: '14px',
    fontWeight: '600',
  },
  schoolHead: {
    fontSize: '15px',
    fontWeight: '500'
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // overflowY: 'scroll', // Add the overflow scroll property here
  },
  modalStyle: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "45%",
    maxHeight: '90%',
    overflowY: 'auto',
    backgroundColor: "#fff",
    border: "none !important",
    // boxShadow: 24,
    padding: '10px 25px',
    borderRadius: "4px",
    boxShadow: '0 0 24px rgba(0, 0, 0, 0.3)',
    [theme.breakpoints.down('md')]: {
      width: "100%",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    }
  },

  bodyNoScroll: {
    overflow: 'hidden !important',
  },
  modalContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    outline: 'none',
  },
  textAreainputStyle: {
    fontSize: "1rem",
    padding: "8.8px",
    width: "100%",
    borderRadius: "4px",
    border: "1px solid #DEDEDE",
    resize: 'none'
  },
  schoolTitle: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#000'
  },
  schoolRadioFont: {
    color: '#000'
  },
  flkFlexBox: {
   display: 'flex',
   gap: '20px',
   alignItems: 'center',
   width: '100%',
   height: '100%',
   padding: '20px 20px'
  },
  textBoxWdth: {
    width: '15%'
  },
  isDiabledBtn: {
    cursor: 'no-drop'
  },
  loader: {
    height: "50vh",
    width: "90vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  
}));