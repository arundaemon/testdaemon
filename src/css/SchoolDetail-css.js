import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles((theme) => ({
  root: {
    boxShadow: "none",
  },
  stapper: {
    "& .Mui-disabled .MuiStepIcon-root": { color: "#dedede" },
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  gridContainer: {
    paddingLeft: "10px",
    paddingRight: "10px",
  },
  buttonW: {
    width: "100px",
    height: "30px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#000000",
  },
  headerContainer: {
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
    width: "100%",
    display: "flex",
    boxShadow: "0px 2px 15px #0000001A",
    padding: "20px",
    position: "fixed",
    top: "0",
    left: "0",
    zIndex: "1000",
    background: "white",
  },
  headerTitle: {
    fontSize: "18px",
    fontWeight: "600",
    marginLeft: "10px",
  },
  breadcrumbsClass: {
    textAlign: "left",
    fontSize: "14px",
  },
  bigFileName: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    alignItems: "center",
    justifyContent: "space-between",
    textAlign: "left",
    transition: "all .3s",
    color: "#85888a",
    fontSize: "14px",
  },
  placeholder: {
    color: "#85888a",
    fontSize: "14px",
    marginLeft: "10px",
  },
  dateInput: {
    height: "40px",
    width: "300px",
    padding: "5px 20px",
    borderRadius: "8px",
    // marginBottom: '10px'
    marginTop: "-20px",
    // border: 'transparent'
  },
  breadcrumbsBar: {
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },
  listingGrid: {
    marginBottom: 20,
    [theme.breakpoints.down("md")]: {
      height: "100%",
      // marginTop: "90px",
      marginBottom: '10px',
    },
  },
  alternativeLabelClass: {
    [theme.breakpoints.down("md")]: {
      "& .MuiStepLabel-alternativeLabel": {
        marginTop: "0px",
      },
      "& .listing-step-label-date": {
        fontSize: "12px",
      },
    },
  },
  uploaderFileBtn: {
    position: "relative",
    overflow: "hidden",
  },
  browse: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#4482FF",
    cursor: "pointer",
    textDecoration: "underline",
  },
  uploaderFile: {
    display: "flex",
    width: "300px",
    height: "44px",
    alignItems: "center",
    justifyContent: "space-between",
    border: "1px solid #dedede",
    padding: "9px 20px",
    borderRadius: "8px",
    textAlign: "left",
    transition: "all .3s",
    marginLeft: "70px",
  },
  subheading: {
    fontSize: "1rem",
    marginBottom: "12px",
    fontWeight: "400",
  },
  emptyPdf: {
    color: "black",
    fontSize: "19px",
    marginRight: "-14px",
    cursor: "default",
  },
  stapperBox: {
    width: "100%",
    paddingBottom: "20px",
    [theme.breakpoints.down("md")]: {
      paddingBottom: "10px",
    },
  },
  listingStudentAvtar: {
    [theme.breakpoints.down("md")]: {
      height: "50px",
      width: "50px",
    },
  },
  stpper2Class: {
    [theme.breakpoints.down("md")]: {
      overflowX: "auto",
      scrollbarWidth: "none",
    },
  },
  stpper2ClassInner: {
    [theme.breakpoints.down("md")]: {
      width: "750px",
    },
  },
  step2lebel: {
    [theme.breakpoints.down("md")]: {
      "& span": {
        fontSize: "12px",
        lineHeight: "19px",
      },
    },
  },
  lastContainer: {
    marginBottom: "30px",
  },
  inputStyle: {
    fontSize: "14px",
    padding: "8.8px",
    width: "100%",
    height: "38px",
    borderRadius: "4px",
    border: "1px solid #DEDEDE",
  },
  btnSection: {
    padding: "15px 5px 15px 5px",
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
    "&:disabled": {
      border: "2px solid grey",
      backgroundColor: "white",
      color: "black !important",
    },
  },
  inputStyle2: {
    fontSize: "14px",
    padding: "8.8px",
    width: "50%",
    height: "38px",
    borderRadius: "4px",
    border: "1px solid #DEDEDE",
  },
  iconStyle: {
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
  },
  registerBtn: {
    display: "flex",
    width: "40%",
    justifyContent: "end",
  },
  registerCreate: {
    border: "1px solid #f45e29",
    color: "#f45e29",
    padding: "5px 15px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  cold: {
    color: "#4481fb",
  },
  warm: {
    color: "#FA9E2D",
  },
  popupHeaderTitle: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 25,
  },
  callDetailContainer: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },
  userHeaderTitle: {
    fontSize: 14,
    fontWeight: 600,
    width: 160,
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  saveBtn: {
    border: "1px solid #F45E29",
    padding: "12px 24px",
    color: "#F45E29",
    borderRadius: "4px",
    fontWeight: "600",
    fontSize: "16px",
    lineHeight: "22px",
    cursor: "pointer",
  },
  cancelBtn: {
    fontWeight: "600",
    fontSize: "16px",
    lineHeight: "22px",
    cursor: "pointer",
    borderRadius: "4px",
    color: "white",
    border: "1px solid #F45E29",
    padding: "12px 24px",
    background: "#F45E29",
    marginLeft: "9px",
  },
  userHeaderSubTitle: {
    fontSize: 12,
    fontWeight: 400,
  },
  userDetailContainer: {
    marginLeft: 10,
    textAlign: "left",
  },
  mainCallPopupContainer: {
    display: "grid",
    gridTemplateColumns: "auto auto",
    gridGap: 30,
    [theme.breakpoints.down("md")]: {
      gridTemplateColumns: "auto",
    },
  },
  flexAddBox: {
    display: "flex",
    flexWrap: "wrap",
    width: "100%",
    rowGap: "5px",
    marginTop: "10px !important",
  },
  flexAddBoxChild: {
    width: "50%",
  },
  flexChatBox: {
    display: "flex",
    width: "100%",
    marginTop: "10px !important",
    gap: "20px",
    //   justifyContent: 'space-between'
  },
  flexChatChildBx: {
    display: "flex",
    width: "100%",
    flexDirection: "column",
  },
  uploadPO: {
    fontWeight: "600",
    fontSize: "16px",
    lineHeight: "22px",
    cursor: "pointer",
    borderRadius: "4px",
    color: "white",
    border: "1px solid #F45E29",
    padding: "12px 24px",
    background: "#F45E29",
    width: "max-content",
    height: "max-content",
  },
  quouteModal: {
    display: "flex",
    marginTop: '20px',
    justifyContent: 'center',
  },
  quouteModalBtn: {
    display: "flex",
    marginTop: '20px',
    justifyContent: 'center',
    borderTop: '1px solid #eee'
  },
  select: {
    width: '300px', // Adjust the width as needed
    height: '40px', // Adjust the height as needed
  },
  textAreainputStyle: {
    fontSize: "1rem",
    padding: "8.8px",
    width: "100%",
    borderRadius: "4px",
    border: "1px solid #DEDEDE",
    resize: 'none',
    height: '150px'
  },
  a: {
    color: "#4482FF",
  },
  flkGRIDBox: {
    display: 'flex',
    justifyContent: 'end',
    gap: '20px'
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
  flkInnerBoxGridNew: {
    display: "flex",
    width: '100%',
    justifyContent: 'space-between',
    height: '100%',
    alignItems: "right",
    flexDirection: "column"
  },
  checkbox: {
    display: "flex",
    width: '100%',
    justifyContent: 'space-between',
    height: '100%',
    alignItems: "left",
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
  rltBoxNew: {
    width: '1800rem',
    position: "relative",
    background: '#f45e29',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '20px',
    height: '5rem'
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
    width: '30%',
    justifyContent: 'space-between',
    height: '30%',
    alignItems: "center",

  },
  flkInnerChildBoxNew: {
    display: "flex",
    width: '100%',
    justifyContent: 'space-between',
    // height: '30%',
    alignItems: "center",

  },
  selectNew: {
    width: '440px', // Adjust the width as needed
    height: '40px', // Adjust the height as needed
  },
  selectForm: {
    width: '240px', // Adjust the width as needed
    height: '42px', // Adjust the height as needed
  },
  inputStyleNew: {
    fontSize: "14px",
    padding: "8.8px",
    width: "90%",
    height: "38px",
    borderRadius: "4px",
    border: "1px solid #DEDEDE",
  },
  dateNew: {
    fontSize: "14px",
    padding: "8.8px",
    width: '228px',
    height: '42px',
    borderRadius: "4px",
    border: "1px solid #DEDEDE",
  },

}));

export const ModalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: "calc(100% - 16px)",
  bgcolor: "background.paper",
  border: "2px solid #fff",
  boxShadow: "0px 0px 4px #0000001A",
  padding: "20px 40px",
  borderRadius: "8px",
};

export const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: '600px !important',
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export const POModalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export const modalUseStyles = makeStyles((theme) => ({
  heading: {
    fontSize: 18,
    fontWeight: 600,
    lineHeight: "24px",
    textAlign: "center",
  },
  contentText: {
    fontSize: "14px",
    lineHeight: "38px",
    fontWeight: "600",
    color: "#202124",
    marginRight: "15px",
  },


}));
