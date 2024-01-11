import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  Grid,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  TablePagination,
  Typography
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Page from "../../components/Page";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import LedgerTable from "../../components/Ledger Management/LedgerTable";
import {
  getCityByTerritory,
  getLedgerData,
  getProductsFromSchool,
  getSchoolsByCity,
  getTerritoryData
} from "../../helper/DataSetFunction";
import { DisplayLoader } from "../../helper/Loader";
import { getUserData } from "../../helper/randomFunction/localStorage";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "600px !important",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};
const MenuProps = {
  anchorOrigin: {
    vertical: "bottom",
    horizontal: "left",
  },
  transformOrigin: {
    vertical: "top",
    horizontal: "left",
  },
  getContentAnchorEl: null,
  style: { position: "absolute", zIndex: 1000 },
};
const useStyles = makeStyles((theme) => ({
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

const Ledgerlist = () => {
  const classes = useStyles();
  const loginData = getUserData("loginData");
  const uuid = loginData?.uuid;
  const [lastPage, setLastPage] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [tdsList, setTdsList] = useState([]);
  const [pageNo, setPagination] = useState(1);
  const [loader, setLoading] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [businessUnit, setBusinessUnit] = useState([]);
  const [city, setCity] = useState([]);
  const [schoolLedgerList, setSchoolLedgerList] = useState([]);
  const [schoolDetails, setSchoolDetails] = useState(null);
  const [schoolList, setSchoolList] = useState([])
  const [school, setSchool] = useState([])
  const [territoryList, setTerritoryList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [product, setProduct] = useState([])
  const [cityList, setCityList] = useState([]);
  const [searchFlag, setSearchFlag] = useState(false);
  const navigate = useNavigate();




  const redirectPricingEngine = async () => {
    navigate("/authorised/EditLedger", {});
  };


  const fetchLedgerList = async (props) => {
    setLastPage(false)
    setLoading(true);
    try {
      const res = await getLedgerData(props);
      const arrayList = res?.loadResponses?.[0]?.data;
      if (arrayList?.length < itemsPerPage) setLastPage(true)
      setLoading(false)
      return arrayList;
    }
    catch (err) {
      console.error('An error occurred:', err);
      setLastPage(false)
      setLoading(false)
    }
  };


  const fetchSchoolByCity = async (cityNameArray) => {
    try {
      let schoolsArray = [];
      let res = await getSchoolsByCity(cityNameArray);
      let result = res?.loadResponses?.[0]?.data
      result?.map((data) => {
        schoolsArray.push({
          label: data?.["Ledger.schoolName"],
          value: data?.["Ledger.schoolCode"],
        });
      });
      setSchoolList(schoolsArray);
    } catch (err) {
      console.error(err?.response);
    }
  };


  const territoryListFunction = async () => {
    try {
      let countryDataOption = [];
      let res = await getTerritoryData("INDIA");
      res = res?.loadResponses?.[0]?.data;
      res?.map((data) => {
        countryDataOption.push({
          label: data?.["Territorymappings.territoryName"],
          value: data?.["Territorymappings.territoryCode"],
          code: data?.["Territorymappings.territoryCode"]
        });
      });
      setTerritoryList(countryDataOption);
    } catch (err) {
      console.error(err?.response);
    }
  };


  const cityByTerritory = async (territoryCode) => {
    try {
      let countryDataOption = [];
      let res = await getCityByTerritory(territoryCode);
      res = res?.loadResponses?.[0]?.data;
      res?.map((data) => {
        countryDataOption.push({
          label: data?.["Territorymappings.cityName"],
          value: data?.["Territorymappings.cityCode"],
          code: data?.["Territorymappings.cityCode"]
        });
      });
      return countryDataOption
    } catch (err) {
      console.error(err?.response);
    }
  };

  const getproductBySchool = async (schoolCodeArray) => {
    try {
      let productsArray = []
      let res = await getProductsFromSchool(schoolCodeArray);
      let list = res?.loadResponses?.[0]?.data;
      list?.map((data) => {
        productsArray.push({
          label: data?.["Ledger.productName"],
          value: data?.["Ledger.product"],
        });
      });
      setProductList(productsArray)
    } catch (err) {
      console.error(err?.response);
    }
  };




  useEffect(async () => {
    if (school?.length > 0) {
      const schoolCodeArray = school?.map(item => (item.value))
      await getproductBySchool(schoolCodeArray)
    }
  }, [school]);


  useEffect(async () => {
    if (city?.length > 0) {
      const cityNameArray = city?.map(item => (item.label))
      await fetchSchoolByCity(cityNameArray)
    }
  }, [city]);



  useEffect(() => {
    territoryListFunction();
  }, []);



  useEffect(async () => {
    if (businessUnit?.length > 0) {
      const businessUnitArray = businessUnit?.map(item => (item.value))
      let result = await cityByTerritory(businessUnitArray)
      setCityList(result)
    }
  }, [businessUnit]);


  const handlePagination = (e, pageNumber) => {
    setPagination(pageNumber);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPagination(1);
    setItemsPerPage(event.target.value);
  };


  const handleBusinessUnitChange = (item) => {
    const itemIndex = businessUnit.findIndex(obj => obj.code == item.code);
    if (itemIndex !== -1) {
      const updatedChannel = [...businessUnit];
      updatedChannel.splice(itemIndex, 1);
      setBusinessUnit(updatedChannel);
    } else {
      setBusinessUnit([...businessUnit, item]);
      setCity([])
      setSchool([])
    }
  };


  const handleCityChange = (item) => {
    const itemIndex = city.findIndex(obj => obj.code == item.code);
    if (itemIndex !== -1) {
      const updatedChannel = [...city];
      updatedChannel.splice(itemIndex, 1);
      setCity(updatedChannel);
    } else {
      setCity([...city, item]);
      setSchool([])
    }
  };

  const handleSchoolChange = (item) => {
    const itemIndex = school.findIndex(obj => obj.value == item.value);
    if (itemIndex !== -1) {
      const updatedChannel = [...school];
      updatedChannel.splice(itemIndex, 1);
      setSchool(updatedChannel);
    } else {
      setSchool([...school, item]);
    }
  };

  const handleProductChange = (item) => {
    const itemIndex = product.findIndex(obj => obj.value == item.value);
    if (itemIndex !== -1) {
      const updatedChannel = [...product];
      updatedChannel.splice(itemIndex, 1);
      setProduct(updatedChannel);
    } else {
      setProduct([...product, item]);
    }
  };



  const generateProps = () => {
    const props = {};
    const mapValues = (array, keyExtractor) =>
      array?.length > 0 ? array.map(obj => keyExtractor(obj)) : [];
    props.businessUnit = mapValues(businessUnit, obj => obj.label);
    props.city = mapValues(city, obj => obj.value);
    props.school = mapValues(school, obj => obj.value);
    props.product = mapValues(product, obj => obj.value);
    props.pageNo = pageNo;
    props.itemsPerPage = rowsPerPage;

    return props;
  };


  useEffect(async () => {
    const props = generateProps();
    let result = await fetchLedgerList(props);
    setSchoolLedgerList(result)
  }, [pageNo, itemsPerPage]);


  const handleSearch = async () => {
    const props = generateProps();
    let result = await fetchLedgerList(props);
    setSchoolLedgerList(result)
    setPagination(1)
  };

  const handleReset = async () => {
    setBusinessUnit([])
    setCity([])
    setSchool([])
    setProduct([])
    setPagination(1)
    let props = generateProps();

    props.businessUnit = []
    props.city = []
    props.school =[]
    props.product =[]
    props.pageNo = pageNo;
    props.itemsPerPage = rowsPerPage;
    let result = await fetchLedgerList(props);
    setSchoolLedgerList(result)
  }






  return (
    <Page
      title="Extramarks | Upload TDS"
      className="main-container myLeadPage datasets_container"
    >
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ backgroundColor: "rgb(230, 133, 92)" }}>
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Typography variant="h6" component="div">
              View Ledger
            </Typography>
            <Typography variancodet="h6" component="div">
              Total School
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
      <div className="tableCardContainer">
        <Paper>
          <Grid container alignItems="center" spacing={2}>
            <Grid item md={4} xs={12}>
              <Typography className={classes.label}>Business Unit *</Typography>
              <FormControl sx={{ m: 0.1, width: 250, position: 'relative', '& div': { height: "40px" } }}>
                <Select
                  className={classes.selectNew}
                  classNamePrefix="select"
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  multiple
                  value={businessUnit}
                  renderValue={(selected) => selected?.map((x) => x?.label).join(', ')}
                  MenuProps={MenuProps}
                >
                  {territoryList?.map((obj) => (
                    <MenuItem key={obj?.label} value={obj}>
                      <Checkbox checked={businessUnit?.findIndex(item => item.code === obj.code) !== -1}
                        onChange={() => handleBusinessUnitChange(obj)}
                      />
                      <ListItemText primary={obj?.label} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>


            <Grid item md={4} xs={12}>
              <Typography className={classes.label}>City *</Typography>
              <FormControl sx={{ m: 0.1, width: 250, position: 'relative', '& div': { height: "40px" } }}>
                <Select
                  className={classes.selectNew}
                  classNamePrefix="select"
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  multiple
                  value={city}
                  renderValue={(selected) => selected?.map((x) => x?.label).join(', ')}
                  MenuProps={MenuProps}
                >
                  {cityList?.map((obj) => (
                    <MenuItem key={obj?.label} value={obj}>
                      <Checkbox checked={city?.findIndex(item => item.code === obj.code) !== -1}
                        onChange={() => handleCityChange(obj)}
                      />
                      <ListItemText primary={obj?.label} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item md={4} xs={12}>
              <Typography className={classes.label}>
                School Name & Code *
              </Typography>
              <FormControl sx={{ m: 0.1, width: 250, position: 'relative', '& div': { height: "40px" } }}>
                <Select
                  className={classes.selectNew}
                  classNamePrefix="select"
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  multiple
                  value={school}
                  renderValue={(selected) => selected?.map((x) => x?.label).join(', ')}
                  MenuProps={MenuProps}
                >
                  {schoolList?.map((obj) => (
                    <MenuItem key={obj?.label} value={obj}>
                      <Checkbox checked={school?.findIndex(item => item.value === obj.value) !== -1}
                        onChange={() => handleSchoolChange(obj)}
                      />
                      <ListItemText primary={obj?.label} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item md={4} xs={12}>
              <Typography className={classes.label}>Product *</Typography>
              <FormControl sx={{ m: 0.1, width: 250, position: 'relative', '& div': { height: "40px" } }}>
                <Select
                  className={classes.selectNew}
                  classNamePrefix="select"
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  multiple
                  value={product}
                  renderValue={(selected) => selected?.map((x) => x?.label).join(', ')}
                  MenuProps={MenuProps}
                >
                  {productList?.map((obj) => (
                    <MenuItem key={obj?.label} value={obj}>
                      <Checkbox checked={product?.findIndex(item => item.value === obj.value) !== -1}
                        onChange={() => handleProductChange(obj)}
                      />
                      <ListItemText primary={obj?.label} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <div style={{ display: "flex", width: "25%" }}>
              <Button sx={{ marginTop: '35px', height: "40px", minWidth: "120px" }} variant='contained' onClick={handleSearch}>Search</Button>
              <Button sx={{ marginTop: '35px', height: "40px", marginLeft: '20px', minWidth: "120px" }} variant='outlined' onClick={handleReset}>Reset</Button>
            </div>



          </Grid>
        </Paper>
      </div>



      {!loader ?
        ((schoolLedgerList?.length > 0) ?
          <>
            <Container className='table_max_width'>
              <LedgerTable list={schoolLedgerList} pageNo={pageNo}
                itemsPerPage={itemsPerPage} />
            </Container>
            <div className='center cm_pagination'>
              <TablePagination
                component="div"
                page={pageNo}
                onPageChange={handlePagination}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[10, 50, 500, 1000]}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelDisplayedRows={({ page }) => {
                  return `Page: ${page}`;
                }}
                backIconButtonProps={{
                  disabled: pageNo === 1,
                }}
                nextIconButtonProps={{
                  disabled: lastPage,
                }}
              />
            </div>
          </>
          :
          <>
            <div className={classes.noData}>
              <p>No Ledger Found!</p>
            </div>
            <div className='center cm_pagination'>
              <TablePagination
                component="div"
                page={pageNo}
                onPageChange={handlePagination}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[10, 50, 500, 1000]}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelDisplayedRows={({ page }) => {
                  return `Page: ${page}`;
                }}
                backIconButtonProps={{
                  disabled: pageNo === 1,
                }}
                nextIconButtonProps={{
                  disabled: lastPage,
                }}
              />
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

export default Ledgerlist;
