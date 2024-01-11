import { makeStyles } from "@mui/styles";
import { Modal } from "@material-ui/core";
import { color } from "echarts";

export const useStyles = makeStyles((theme) => ({
  cusCard: {
    padding: "18px",
    boxShadow: "0px 0px 8px #00000029",
    borderRadius: "8px",
    margin: "0.5rem 1rem",
  },
  title: {
    fontSize: "16px",
    fontWeight: "600",
    lineHeight: "16px",
  },
  heading: {
    fontSize: "16px",
    fontWeight: "bold",
    lineHeight: "16px",
    paddingBottom: '10px'
  },
  subTitle: {
    fontSize: "13px",
    lineHeight: "16px",
  },
  subText: {
    fontSize: "14px",
    lineHeight: "16px",
    fontWeight: "600",
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
    minWidth: "150px",
  },
  inputBorderStyle: {
    fontSize: "1rem",
    padding: "8.8px",
    width: "100%",
    borderRadius: "4px",
    border: "1px solid red",
    minWidth: "150px",
  },
  textAreainputStyle: {
    fontSize: "1rem",
    padding: "8.8px",
    width: "100%",
    borderRadius: "4px",
    border: "1px solid #DEDEDE",
    resize: "none",
  },
  btnSection: {
    padding: "15px 5px 15px 5px",
    textAlign: "right",
  },
  btnBox: {
    display: "flex",
    gap: "45px",
    [theme.breakpoints.down("md")]: {
      gap: "10px",
    },
  },
  submitBtn: {
    backgroundColor: "#f45e29",
    border: "1px solid #f45e29",
    borderRadius: "4px !important",
    color: "#ffffff !important",
    padding: "6px 16px !important",
    "&:hover": {
      color: "#f45e29 !important",
    },
  },
  hardwareBtn: {
    width:"135px",
    backgroundColor: "#f45e29",
    border: "1px solid #f45e29",
    borderRadius: "4px !important",
    color: "#ffffff !important",
    padding: "6px 16px !important",
    "&:hover": {
      color: "#f45e29 !important",
    },
  },
  serviceBtn: {
    width:"135px",
    backgroundColor: "#f45e29",
    marginLeft: "20px",
    border: "1px solid #f45e29",
    borderRadius: "4px !important",
    color: "#ffffff !important",
    padding: "6px 16px !important",
    "&:hover": {
      color: "#f45e29 !important",
    },
  },
  approvalBtn: {
    width:"200px",
    backgroundColor: "#f45e29",
    marginTop: "10px",
    border: "1px solid #f45e29",
    borderRadius: "4px !important",
    color: "#ffffff !important",
    padding: "6px 16px !important",
    textAlign: "center",
    textDecoration: 'none',
    "&:hover": {
      color: "#f45e29 !important",
      background: '#fff !important'
    },
  },

  disableContact: {
    width:"200px",
    backgroundColor: "#f45e29",
    marginTop: "10px",
    border: "1px solid #f45e29",
    borderRadius: "4px !important",
    color: "#ffffff !important",
    padding: "6px 16px !important",
    textDecoration: 'none',
    textAlign: "center",
    "&:hover": {
      color: "#f45e29 !important",
      background: '#fff !important'
    },
    pointerEvents: "none"
  },

  submitActyBtn: {
    borderRadius: "4px !important",
    padding: "6px 16px !important",
    "&:hover": {
      color: "#f45e29 !important",
    },
  },
  rowBtn: {
    position: "absolute",
    right: "-1.7rem",
    top: "2.1rem",
    width: "1.2rem !important",
    cursor: "pointer",
    opacity: "0.3",
    "&:hover": {
      opacity: "0.6",
    },
  },
  CstmBoxGrid: {
    padding: "0 !important",
    position: "relative",
  },
  accordianPadding: {
    padding: "0 10px",
  },
  flxBoxContainer: {
    display: "flex",
    height: "100%",
    marginTop: "10px",
    gap: "30px",
    width: "0",
  },
  contactDetailBx: {
    display: "flex",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "right",
    paddingBottom: "20px",
  },
  contactBox: {
    maxHeight: "140px",
    overflowY: "scroll",
    borderTop: "1px solid #DEDEDE",
    paddingTop: "10px",
    marginTop: "10px",
  },
  ContactbtnSection: {
    borderTop: "1px solid #DEDEDE",
    display: "flex",
    justifyContent: "right",
  },
  customMenu: {
    overflow: "hidden",
    minWidth: "350px !important",
    left: "44% !important",
    [theme.breakpoints.down("md")]: {
      left: "10% !important",
      minWidth: "320px !important",
    },
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    // overflowY: 'scroll', // Add the overflow scroll property here
  },
  modalStyle: {
    position: "absolute",
    top: "50%",
    left: "70%",
    transform: "translate(-50%, -50%)",
    width: "40%",
    maxHeight: "90%",
    overflowY: "auto",
    backgroundColor: "#fff",
    border: "none !important",
    // boxShadow: 24,
    padding: "10px 25px",
    borderRadius: "4px",
    boxShadow: "0 0 24px rgba(0, 0, 0, 0.3)",
    [theme.breakpoints.down("md")]: {
      width: "100%",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    },
  },
  modalContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    outline: "none",
  },
  minimizeContent: {
    width: "30%",
    border: "2px solid #000",
    borderRadius: "4px",
    padding: "10px 20px",
    fontWeight: "bold",
    cursor: "pointer",
    textAlign: "center",
    position: "fixed",
    bottom: 0,
    backgroundColor: "#fff",
    zIndex: "9999999",
    right: "20px",
    [theme.breakpoints.down("md")]: {
      width: "100%",
      right: "0",
    },
  },
  customContactModal: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "50%",
    backgroundColor: "#fff",
    border: "2px solid #000",
    padding: "10px 25px",
    borderRadius: "4px",
    boxShadow: "0 0 24px rgba(0, 0, 0, 0.3)",
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
  },
  customHeadCls: {
    padding: "0 30px",
  },
  customSelectBox: {
    height: "40px",
  },
  customInputLabel: {
    fontSize: "14px",
    marginTop: "-5px",
  },
  customRenderLabel: {
    fontSize: "14px",
  },
  iconWidth: {
    width: "12px",
  },
  scrollableTable: {
    width: "100%",
    borderCollapse: "collapse",
    tableLayout: "fixed",
  },
  scrollableRow: {
    display: "flex",
    overflowX: "auto",
    whiteSpace: "nowrap",
    // overflow-x: auto;
    // white-space: nowrap;
  },
  linkColor: {
    color: '#f45e29',
    cursor: 'pointer',
    display: 'inline'
  },
  flkBoxContent: {
   display: 'flex',
   border: '2px solid #eee',
   borderRadius: '8px',
   padding: '10px',
   gap: '10px'
  },
  boxLabel: {
    background: '#F45E29',
    textAlign: 'center',
    borderRadius: '50px',
    color: '#fff',
    fontSize: '14px'
  },
  paraStyle: {
    fontSize: '13px',
  },
  flkBoxGrid: {
    display: "flex",
    width: '100%',
    gap: '50px'
  },
  gridBox: {
    display: "flex",
    width: '100%',
    gap: '50px',
    flexDirection: "column",
    height: '400px',
    overflow: "auto"
  },
  flkInnerBoxGrid: {
    display: "flex",
    width: '100%',
    justifyContent: 'space-between',
    height: '100%',
    alignItems: "center",
    flexDirection: "column"
  },
  rltBox: {
    width: '40%', 
    position: "relative",
    background: '#f45e29',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '14px'
  },
  absBox: {
    display: "flex",
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: "center"
  },
  flkInnerChildBox: {
    display: "flex",
    width: '100%',
    justifyContent: 'space-between',
    height: '100%',
    alignItems: "center",
  },
  isError: {
    color: 'red',
    fontSize: '12px',
    width: '100%',
    whiteSpace: 'pre',
    marginTop: '15px',
    position: 'relative',
    left: '-100%',
    top: '30px'
  },
  loader: {
    height: "50vh",
    width: "90vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  subTitleNew: {
    fontSize: "16px",
    lineHeight: "16px",
    marginTop:'10px'
  },
  table: {
    marginBottom: theme.spacing(1), // Add margin between rows
  },
  tableRow: {
    // You can use padding or margin to create a gap between rows
    marginBottom: theme.spacing(2), // Add margin at the bottom of each row
  },
  tableContainerBox: {
    display: 'flex',
    width: '100%'
  },
  noData: {
    height: "50vh",
    width: "90vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: 600,
    fontSize: 25
  },
  quotationLink: {
    cursor: "pointer",
    color: "#f45e29",
    textDecoration: "underline",
  },
}));

