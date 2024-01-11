import { Container, Grid, InputAdornment, Paper, styled, Table, TableBody, TableContainer, TableHead, TablePagination, TableRow, TextField } from "@mui/material";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import Slider from "../../components/MyLeads/Slider";
import Page from "../../components/Page";
import { makeStyles } from '@mui/styles';
import { Button, Typography } from '@mui/material';
import { useEffect, useState } from "react";
import SearchIcon from '../../assets/icons/icon_search.svg'
import { useLocation } from "react-router-dom";
import { getMonthlyBooking , getMonthlyMissed} from "../../helper/DataSetFunction";
import CubeDataset from "../../config/interface";
import moment from "moment";
import Pagination from "../Pagination";
import Revenue from "../../components/MyLeads/Revenue";


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.action.hover,
      color: theme.palette.common.black,
  },
  [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
  },
}));


const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
      backgroundColor: "#fff",
  },
  // hide last border
  '&:last-child td, &:last-child th': {
      border: 0,
  },
}));


const useStyles = makeStyles((theme) => ({
  
  cusCard: {
    padding: "2px",
    boxShadow: "0px 0px 8px #00000029",
    borderRadius: "8px",
  },
  RevenueCard: {
    padding: "0px",
    overflow: "hidden",
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
		[theme.breakpoints.down('md')]: {
			fontSize: "12px !important",
			padding: '4px !important',
			height: 36
		}
	},
  flkBx : {
    position: "relative",
    left: '-10px'
  },
  tskPending: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    height: "50vh",
    alignItems: "center",
    fontStyle: "italic"
  },
}));


const ViewTask = (props) => {

  const classes = useStyles();


  const [order_item, setOrderList] = useState([]);

  const [pageNo, setPagination] = useState(1)

  const [itemsPerPage, setItemsPerPage] = useState(10)

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [search, setSearchValue] = useState('')

  const [searchTextField, setSearchTextField] = useState('')

  const [lastPage, setLastPage] = useState(false)

  const location = useLocation();
  
  let { renderView, getRoleName } = location?.state


  let totalPages = Number((order_item / itemsPerPage).toFixed(0))

  if ((totalPages * itemsPerPage) < order_item)
    totalPages = totalPages + 1;

  const getTodayBooking = async () => {
    let params = { data : getRoleName , pageNo: pageNo , count: itemsPerPage, search }
    setLastPage(false)
    try {
      const res = await getMonthlyBooking(params);
      setOrderList(res?.loadResponses?.[0]?.data);
      if (res?.loadResponses?.[0]?.data?.length < itemsPerPage) setLastPage(true)
    }catch(err) {
      console.error(err)
    }
  }

  const getMissedEvent = async () => {
    let params = { data : getRoleName , pageNo: pageNo , count: itemsPerPage, search }
    setLastPage(false)
    try {
      const res = await getMonthlyMissed(params);
      setOrderList(res?.loadResponses?.[0]?.data);
      if (res?.loadResponses?.[0]?.data?.length < itemsPerPage) setLastPage(true)
    }catch(err) {
      console.error(err)
    }
  }


  const handlePagination = (e, pageNumber) => {
    setPagination(pageNumber)
  }

  const renderViewFunc = () => {
    if (renderView === 'TodayBooking') {
      getTodayBooking();
    }
    if (renderView === 'Booking Scheduled') {
      getTodayBooking();
    }
    if (renderView === 'MissedBooking') {
      getMissedEvent();
    }
  }

  useEffect( () => {
    renderViewFunc();
  }, [search, pageNo, itemsPerPage])


  const handleSearch = (e) => {
    e.preventDefault();
    setSearchValue(searchTextField, () => setPagination(1))
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPagination(1);
    setItemsPerPage(event.target.value)
};

  return (
    <Page title="Extramarks | Lead Assignment" className="main-container myLeadPage datasets_container">
      <Container className='table_max_width'>
        <Grid container spacing={2} sx={{ mt: "0px", mb: "16px" }}>
          <Grid item xs={12} lg={6}>
            <Grid className={`${classes.cusCard} ${classes.RevenueCard}`}>
              <Revenue />
            </Grid>
          </Grid>
          <Grid item xs={12} lg={6}>
            <Grid className={`${classes.cusCard} ${classes.RevenueCard}`}>
              <Slider />
            </Grid>
          </Grid>
        </Grid>
        <div className="tableCardContainer">
          <div className="mainContainer">
            <div className="left">
             <h3>Booking</h3>
            </div>
            <div className={classes.flkBx}>
              <form>
                <TextField
                  className={`inputRounded search-input width-auto ${classes.flkBx}`}
                  type="search"
                  placeholder="Search"
                  value={searchTextField}
                  onChange={(e) => {
                    setSearchTextField(e.target.value)
                  }}
                  InputLabelProps={{ style: { ...{ top: `${-7}px` } } }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <img src={SearchIcon} alt="" />
                      </InputAdornment>
                      ),
                  }}
                />
                <Button className={classes.submitBtn} type="submit" onClick={handleSearch}>Search</Button>
              </form>
            </div>
          </div>
          {order_item?.length > 0 ? <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Sr. No</StyledTableCell>
                  <StyledTableCell>Owner Name</StyledTableCell>
                  <StyledTableCell>Created Date</StyledTableCell>
                  <StyledTableCell>Scheduled Date</StyledTableCell>
                  <StyledTableCell>Lead Name</StyledTableCell>
                  {/* <StyledTableCell>Last Modified</StyledTableCell>   */}
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  order_item?.map((obj,index) => (
                    <StyledTableRow>
                      <StyledTableCell >{index + 1}</StyledTableCell>
                      <StyledTableCell >{obj?.[CubeDataset.BdeactivitiesBq.createdByName]}</StyledTableCell>
                      <StyledTableCell >{moment.utc(obj?.[CubeDataset.BdeactivitiesBq.createdAt]).local().format('DD-MM-YYYY (hh:mm A)')}</StyledTableCell>
                      <StyledTableCell >{moment.utc(obj?.[CubeDataset.BdeactivitiesBq.startDateTime]).local().format('DD-MM-YYYY (hh:mm A)')}</StyledTableCell>
                      <StyledTableCell >{obj?.[CubeDataset.BdeactivitiesBq.name]}</StyledTableCell>
                    </StyledTableRow>
                    
                  ))
                }
              </TableBody>
            </Table>
          </TableContainer> : <div className={classes.tskPending}>
          "No Booking Activity Yet"
        </div>}
        </div>
      </Container>

      <div className='center cm_pagination'>
          {/* <TablePagination
              // count={itemsPerPage}
              component="div"
              page={pageNo}
              onPageChange={handlePagination}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={[10, 50, 500, 1000]}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelDisplayedRows={({ page }) => {
                  return `Page: ${page}`;
              }} /> */}
              <Pagination pageNo={pageNo} setPagination={setPagination} lastPage={lastPage} />
      </div>

    </Page>
  )
}


export default ViewTask;