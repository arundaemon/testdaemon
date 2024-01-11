import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles((theme) => ({
  labelDivContainer: {
    width: "calc(23% - 30px)",
    marginRight: "30%",
  },
  consigneelabelDivContainer: {
    width: "calc(23% - 30px)",
    marginRight: "10%",
  },
  labelDiv: {
    display: "flex",
    marginTop: "20px",
    flexDirection: "column",
  },
  inputField: {
    border: '1px solid #cccccc',
    borderRadius: '6px',
    padding: '8px 15px',
    fontSize: '18px',
    height: '45px'
  },
  label: {
    font: "normal normal 600 14px/ 38px Open Sans",
    letterSpacing: "0px",
    color: "#85888A",
  },
  accordionDiv: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    padding: "0 10px",
  },
  accordionTitle: {
    fontSize: 14,
    fontWeight: 600,
    display: "flex",
    gap: "15px",
  },
  header: {
    font: "normal normal 600 18px/24px Open Sans",
    letterSpacing: "0px",
    color: "#202124",
    // marginTop: "-40px",
    marginBottom: "40px",
    fontSize: '21px',
    fontWeight: '600'
  },
  swHeader: {
    font: "normal normal 600 18px/24px Open Sans",
    letterSpacing: "0px",
    color: "#202124",
    // marginTop: "-40px",
    marginBottom: "20px",
    fontSize: '21px',
    fontWeight: '600'
  },
  textField: {
    padding: '2px',
    width: '100%',
    fontSize: '14px',
    display: 'inline-flex',
    marginBottom: '1px'
  },
  alert: {
    color: 'red',
    fontSize: '15px'
  },
  labelDivProduct: {
    width: "calc(23% - 30px)",
    display: "flex",
    margin: "10px 10px 10px 20px",
    flexDirection: "column",
  },
  labelDivProductBtn: {
    display: "flex",
    marginTop: '10px',
    flexDirection: "column",
  },
  labelDivShipping: {
    display: "flex",
    marginTop: "20px",
    flexDirection: "column",
    width: '200%'
  },
  loader: {
    height: "50vh",
    width: "90vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
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
  btnContainer: {
    display: "flex",
    justifyContent: "right",
    margin: '25px 10px 10px'
  },
  actionBtn: {
    marginRight: "20px",
    borderRadius: 4
  },
  increDecreTextField: {
    display: 'flex',
    width: 'fit-content',
    height: '45px',
    border: '1px solid #F45E29',
    padding: '4px',
    alignItems: 'center',
    borderRadius: '4px'
  },
  icreBtn: {
    cursor: 'pointer',
    marginRight: '8px',
    fontSize: '38px',
    padding: '2px',
    color: '#F45E29',
    borderRadius: '50%',
    marginBottom: '8px'
  },
  count: {
    marginRight: '8px',
    fontSize: '16px'
  },
  decreBtn: {
    cursor: 'pointer',
    padding: '4px',
    fontSize: '28px',
    color: '#F45E29',
    borderRadius: '50%'
  },
  tableTextField: {
    width: '200px',
    border: '1px solid #cccccc',
    borderRadius: '6px',
    paddingLeft: '15px',
    fontSize: '18px',
    height: '45px'
  },
  searchDiv: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '25px',
    padding: '10px',
    marginLeft: '-10px'
  },
  searchTextField: {
    width: '400px',
    border: '1px solid #cccccc',
    borderRadius: '6px',
    paddingLeft: '15px',
    fontSize: '18px',
    height: '45px'
  },
  noProduct: {
    margin: "30px auto",
    width: "80vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    // marginLeft: '10px',
    fontWeight: 600,
    fontSize: 18
  },
  container:{
    boxShadow: "0px 0px 8px rgb(0 0 0 / 16%)",
    borderRadius: "8px",
    padding: "20px",
    // paddingBottom: "30px",
    // margin: "20px"
  }
}))
