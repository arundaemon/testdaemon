import { makeStyles } from '@mui/styles';

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
  btnSection: {
    marginTop: '10px'
  },
  btnSectionbtm: {
    marginTop: '30px',
    marginBottom: '40px',
    textAlign: 'right'
  },
  submitBtn: {
    backgroundColor: "#f45e29",
    border: "1px solid #f45e29",
    borderRadius: "4px !important",
    color: "#ffffff !important",
    padding: "6px 16px !important",
    "&:hover": {
      color: "#f45e29 !important",
    }
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
    }
  },
  CstmBoxGrid: {
    padding: "0 !important",
    position: 'relative'
  },
  dateInput: {
		// height: "48px",
		width: "100%",
		padding: "10px 20px",
		[theme.breakpoints.down('md')]: {
			padding: "5px 10px",
			width: 100,
			// height: 36,
		}
	},
  searchBox : {
    height: "100px",
    overflow: "scroll",
    position: "absolute",
    background: "rgb(238, 238, 238)",
    width: "25%",
    padding: "10px 20px",
    zIndex: "9999",
    [theme.breakpoints.down('md')]: {
      width: "80%",
    }
  },
  filterSection: {
    display: "flex",
    alignItems: "center",
    marginTop: "-10px",
  },
  filterDiv: {
    border: "1px solid #DEDEDE",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "14px",
    width: "100px",
    height: "38px",
    borderRadius: "4px",
    color: "#85888A",
    marginBottom: "20px",
    cursor: "pointer",
  },
  flkClaimBtn: {
    display: 'flex',
    justifyContent: 'end',
    gap: '10px',
    padding: '20px 0'
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
  loader: {
    height: "50vh",
    width: "90vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'auto'
  },
  modalPaper: {
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #fff',
      boxShadow: '0px 0px 4px #0000001A',
      minWidth: '300px',
      borderRadius: '4px',
      textAlign: 'center',
      padding: "20px"
  },
  modalTitle: {
      fontSize: "20px",
      fontWeight: "600",
      marginBottom: "10px",
      textAlign: 'centre'
  },
  customCheckbox: {
    '&.Mui-disabled .MuiSvgIcon-root': {
      fill: '#ced4da'
    }
    }
  
}));