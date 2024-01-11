import {
  Box,
  Button,
  Grid,
  Paper,
  TableContainer,
  Typography,
  FormControl,
  ListItemText,
  Radio,
  Select,
  MenuItem,
  Checkbox,
  Container
} from "@mui/material";
import React, { useState, useEffect } from "react";
import Page from "../../components/Page";
import Pagination from "../Pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { makeStyles } from "@mui/styles";
import { Link, useNavigate, useLocation } from "react-router-dom";
import SelectWithRadio from "../../components/Pricing-Engine/RadioButton";
import { getUserData } from "../../helper/randomFunction/localStorage";
import { schoolLedgerVoucher } from "../../config/services/packageBundle";
import { DisplayLoader } from "../../helper/Loader";
import EditLedgerTable from "./EditLedgerTable";
import CubeDataset from "../../config/interface";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";



const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: '600px !important',
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,

};
const MenuProps = {
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'left',
  },
  transformOrigin: {
    vertical: 'top',
    horizontal: 'left',
  },
  getContentAnchorEl: null,
  style: { position: 'absolute', zIndex: 1000 },


};
const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    width: '400px'
  },
  label: {
    marginRight: theme.spacing(2),
  },
  select: {
    width: '200px', // Set the width to 100% or your desired value
  },
  submitBtn: {
    fontWeight: "400 !important",
    backgroundColor: "#f45e29",
    border: "1px solid #f45e29",
    borderRadius: "4px !important",
    color: "#ffffff !important",
    padding: "6px 16px !important",
    marginLeft: "10px",
    "&:hover": {
      color: "#f45e29 !important",
    },
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },


  tableCell: {
    border: "1px solid black",
    padding: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

  },
  icon: {
    marginRight: theme.spacing(1),
    color: "green",
  },
  fileInput: {
    display: "none",
  },
  centeredRow: {
    textAlign: "center",
  },

}));

const EditLedger = () => {
  const classes = useStyles();
  const loginData = getUserData('loginData')
  const location = useLocation();
  const uuid = loginData?.uuid
  const [lastPage, setLastPage] = useState(false)
  const [pageNo, setPagination] = useState(1);
  const [loader, setLoading] = useState(true);
  const [itemsPerPage] = useState(10);
  let serialNumber = 0;
  const [paymentType, setPaymentType] = useState([])
  const [voucherType, setVoucherType] = useState([])
  const [schoolLedgerVoucherList, setSchoolLedgerVoucherList] = useState([]);
  const navigate = useNavigate()
  let { data } = location?.state ? location?.state : {};
  let schoolCode = data?.[CubeDataset?.Ledger?.schoolCode]


  const paymentTypeOptions = [
    { label: "All", value: "All", id: 1 },
    { label: "Credit", value: "CR", id: 2 },
    { label: "Debit", value: "DR", id: 3 },
  ];

  const voucherTypeOptions = [
    { label: "All", value: "All", id: 1 },
    { label: "Credit Note", value: "CRN", id: 2 },
    { label: "Debit Note", value: "DBN", id: 3 },
    { label: "Bad Debt", value: "BDR", id: 4 },
    { label: "Reciept", value: "RCT", id: 5 },
    { label: "TDS", value: "TDS", id: 6 },
  ];



  const redirectPricingEngine = async () => {

  };


  const fetchSchoolVoucherLedger = async (props) => {
    console.log(props)
    setLastPage(false)
    setLoading(true);
    try {
      let params = {
        uuid,
        school_code: schoolCode,
        // data?.school_code,
        product_code: [],
        payment_type: props?.paymentTypeArray?.length > 0 ? props?.paymentTypeArray : [],
        voucher_type_code: props?.voucherTypeArray?.length > 0 ? props?.voucherTypeArray : [],
        order_by: "voucher_type_code",
        order: "ASC",
        page_offset: (props.pageNo) - 1,
        page_size: props.itemsPerPage
      };
      const res = await schoolLedgerVoucher(params);
      let data = res?.data?.ledger_voucher_details;
      setLoading(false)
      return data
    }
    catch (err) {
      console.error('An error occurred:', err);
      setLastPage(false)
      setLoading(false)
    }
  };

  const handlePaymentTypeChange = (item) => {
    if (item.id === 1) {
      if (paymentType?.length === paymentTypeOptions?.length) {
        setPaymentType([])
      }
      else {
        setPaymentType([...paymentTypeOptions]);
      }

    }
    else {
      const itemIndex = paymentType.findIndex(obj => obj.id == item.id);
      if (itemIndex !== -1) {
        const updatedChannel = [...paymentType];
        updatedChannel.splice(itemIndex, 1);
        setPaymentType(updatedChannel);
      } else {
        setPaymentType([...paymentType, item]);
      }
    }
  };




  const handleVoucherTypeChange = (item) => {
    if (item.id === 1) {
      if (voucherType?.length === voucherTypeOptions?.length) {
        setVoucherType([])
      }
      else {
        setVoucherType([...voucherTypeOptions]);
      }
    }
    else {
      const itemIndex = voucherType.findIndex(obj => obj.id == item.id);
      if (itemIndex !== -1) {
        const updatedChannel = [...voucherType];
        updatedChannel.splice(itemIndex, 1);
        setVoucherType(updatedChannel);
      } else {
        setVoucherType([...voucherType, item]);
      }
    }
  };



  const generateProps = () => {
    const props = {};
    if (voucherType?.length > 0) {
      props.voucherTypeArray = voucherType?.map(item => (item.value !== 'All' ? item.value : null)).filter(Boolean)
    }
    else {
      props.voucherTypeArray = []
    }
    if (paymentType?.length > 0) {
      props.paymentTypeArray = paymentType?.map(item => (item.value !== 'All' ? item.value : null)).filter(Boolean)
    }
    else {
      props.paymentTypeArray = []
    }
    props.pageNo = pageNo;
    props.itemsPerPage = itemsPerPage;

    return props;
  };



  const handleSearch = async () => {
    const props = generateProps();
    let result = await fetchSchoolVoucherLedger(props);
    setSchoolLedgerVoucherList(result)
    setPagination(1)
  }

  const handleReset = async () => {
    setVoucherType([])
    setPaymentType([])
    let props = generateProps();
    props.voucherTypeArray = []
    props.paymentTypeArray = []
    props.pageNo = pageNo;
    props.itemsPerPage = itemsPerPage;
    let result = await fetchSchoolVoucherLedger(props);
    setSchoolLedgerVoucherList(result)
    setPagination(1)
  }


  useEffect(async () => {
    const props = generateProps();
    let result = await fetchSchoolVoucherLedger(props);
    setSchoolLedgerVoucherList(result)
  }, [data, pageNo]);



  return (

    <Page
      title="Extramarks | Upload TDS"
      className="main-container myLeadPage datasets_container"
    >
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ backgroundColor: 'rgb(230, 133, 92)' }}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Typography variant="h6" component="div">
              View Ledger
            </Typography>
            <Typography variant="h6" component="div">
              Total School
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
      <div className="tableCardContainer">

        <Grid className={classes.cusCard}>


          <Box
            sx={{
              // backgroundColor: "#E2EBFF",
              padding: "30px 40px",
              borderRadius: "4px",
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Typography className={classes.subTitle}>
                  <b>School Name :</b>
                </Typography>
                <div className={classes.subTitleNew} sx={{ mb: 1.5 }}>
                  {data?.[CubeDataset?.Ledger.schoolName] || "N/A"}
                </div>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography className={classes.subTitle}>
                  <b>City :</b>
                </Typography>
                <div className={classes.subTitleNew} sx={{ mb: 1.5 }}>
                  {data?.[CubeDataset?.Ledger.city] || "N/A"}
                </div>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography className={classes.subTitle}>
                  <b>Business Unit :</b>
                </Typography>
                <div className={classes.subTitleNew} sx={{ mb: 1.5 }}>
                  {data?.[CubeDataset?.Ledger.businessUnit] || "N/A"}
                </div>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography className={classes.subTitle}>
                  <b>School Code :</b>
                </Typography>
                <div className={classes.subTitleNew} sx={{ mb: 1.5 }}>
                  {data?.[CubeDataset?.Ledger.schoolCode] || "N/A"}
                </div>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography className={classes.subTitle}>
                  <b>Outstanding Amount :</b>
                </Typography>
                <div className={classes.subTitleNew} sx={{ mb: 1.5 }}>
                  {data?.[CubeDataset?.Ledger.osAmount] !== null ? (
                    <>
                      <CurrencyRupeeIcon
                        sx={{
                          position: "relative",
                          top: "2px",
                          fontSize: "16px",
                        }}
                      />
                      {Number(data?.[CubeDataset?.Ledger.osAmount])?.toLocaleString("en-IN", {
                        maximumFractionDigits: 2,
                      })}
                      / -{" "}
                    </>
                  ) : (
                    "N/A"
                  )}



                </div>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography className={classes.subTitle}>
                  <b>Outstanding Months:</b>
                </Typography>
                <Typography className={classes.subTitle} >
                  <div className={classes.subTitleNew} sx={{ mb: 1.5 }}>
                    {data?.[CubeDataset?.Ledger.osMonths] || "N/A"}
                  </div>
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography className={classes.subTitle}>
                  <b>Contract Value:</b>
                </Typography>
                <div className={classes.subTitleNew} sx={{ mb: 1.5 }}>
                  {data?.[CubeDataset?.Ledger.totalContractValue] !== null ? (
                    <>
                      <CurrencyRupeeIcon
                        sx={{
                          position: "relative",
                          top: "2px",
                          fontSize: "16px",
                        }}
                      />
                      {Number(data?.[CubeDataset?.Ledger.totalContractValue])?.toLocaleString("en-IN", {
                        maximumFractionDigits: 2,
                      })}
                      / -{" "}
                    </>
                  ) : (
                    "N/A"
                  )}




                </div>
              </Grid>

            </Grid>
          </Box>

        </Grid>
        <Paper>
        </Paper>
      </div>

      <Grid container justifyContent="flex-end" style={{ maxWidth: '98%' }}>
        <Grid item>
          <Button className={classes.submitBtn}
          //onClick={resetForm}
          >
            Add Note
          </Button>
        </Grid>
        <Grid item>
          <Button className={classes.submitBtn}
          //  onClick={() => uploadFile()}
          >
            Add Payment
          </Button>
        </Grid>

        <Grid item>
          <Button className={classes.submitBtn}
          //  onClick={() => uploadFile()}
          >
            View Ledger
          </Button>
        </Grid>

      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableBody>

            <TableRow sx={{ display: 'flex', padding: '10px' }}>
              <TableCell className={classes.tableCell} style={{ borderRight: '1px solid #000', width: '100%' }}>
                <Grid container>
                  <Grid item md={4} xs={12}>
                    {/* <div className={classes.container}> */}
                    <Typography className={classes.label}>
                      Payment Type*:
                    </Typography>
                    <FormControl sx={{ m: 0.1, width: 250, position: 'relative' }}>
                      <Select
                        className={classes.selectNew}
                        classNamePrefix="select"
                        labelId="demo-multiple-checkbox-label"
                        id="demo-multiple-checkbox"
                        multiple
                        value={paymentType}
                        // onChange={handlePaymentTypeChange}
                        // renderValue={(selected) => selected?.label}
                        renderValue={(selected) => selected?.map((x) => x?.label).join(', ')}
                        MenuProps={MenuProps}

                      >
                        {paymentTypeOptions?.map((payment) => (
                          <MenuItem key={payment?.id} value={payment}>
                            <Checkbox checked={paymentType?.findIndex(obj => obj.id == payment.id) !== -1}
                              onChange={() => handlePaymentTypeChange(payment)}
                            />
                            <ListItemText primary={payment?.label} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>


              </TableCell>

              <TableCell className={classes.tableCell} style={{ borderRight: '1px solid #000', width: '100%' }}>
                <Grid container>
                  <Grid item md={4} xs={12}>
                    {/* <div className={classes.container}> */}
                    <Typography className={classes.label}>
                      Voucher Type*:
                    </Typography>
                    <FormControl sx={{ m: 0.1, width: 250, position: 'relative' }}>
                      <Select
                        className={classes.selectNew}
                        classNamePrefix="select"
                        labelId="demo-multiple-checkbox-label"
                        id="demo-multiple-checkbox"
                        multiple
                        value={voucherType}
                        renderValue={(selected) => selected?.map((x) => x?.label).join(', ')}
                        MenuProps={MenuProps}

                      >
                        {voucherTypeOptions?.map((voucher) => (
                          <MenuItem key={voucher?.id} value={voucher}>
                            <Checkbox checked={voucherType?.findIndex(obj => obj.id == voucher.id) !== -1}
                              onChange={() => handleVoucherTypeChange(voucher)}
                            />
                            <ListItemText primary={voucher?.label} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {/* </div> */}
                  </Grid>
                </Grid>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>


      <Grid container justifyContent="center" style={{ maxWidth: '100%' }}>
        <Grid item>
          <Button className={classes.submitBtn}
            onClick={() => handleSearch()}
          >
            Search
          </Button>
        </Grid>
        <Grid item>
          <Button className={classes.submitBtn}
            onClick={() => handleReset()}
          >
            Reset
          </Button>
        </Grid>
      </Grid>
      {!loader ?
        (schoolLedgerVoucherList?.length > 0 ?
          <>
            <Container className='table_max_width'>
              <EditLedgerTable list={schoolLedgerVoucherList} pageNo={pageNo} itemsPerPage={itemsPerPage} />
            </Container>
            <div className='center cm_pagination'>
              <Pagination pageNo={pageNo} setPagination={setPagination} lastPage={lastPage} />
            </div>
          </>
          :
          <>
            <div className={classes.noData}>
              <p>No Data Available</p>
            </div>
            <div className='center cm_pagination'>
              <Pagination pageNo={pageNo} setPagination={setPagination} lastPage={lastPage} />
            </div>
          </>
        )
        :
        <div className={classes.loader}>
          {DisplayLoader()}
        </div>
      }
    </Page>

  );
};

export default EditLedger;