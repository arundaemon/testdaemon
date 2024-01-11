import React from "react";
import { useState, useEffect } from "react";
import {
  TextField,
  InputAdornment,
  Paper,
  Alert,
} from "@mui/material";
import Loader from "../../pages/Loader";
import { makeStyles } from "@mui/styles";
import SearchIcon from "../../assets/icons/icon_search.svg";
import HardwarePartVariantTable from "./HardwarePartVariantTable";
import { Link } from "react-router-dom";
import Pagination from "../../pages/Pagination";
import { listHardwarePartVariants } from "../../config/services/hardwareManagement";
import _ from "lodash";
import { getUserData } from "../../helper/randomFunction/localStorage";

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
    fontWeight: "400 !important",
    backgroundColor: "#f45e29",
    border: "1px solid #f45e29",
    borderRadius: "4px !important",
    color: "#ffffff !important",
    padding: "6px 16px !important",
    marginLeft: "10px",
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },
  cusSelect: {
    width: "100%",
    fontSize: "14px",
    marginLeft: "1rem",
    borderRadius: "4px",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  mbForMob: {
    [theme.breakpoints.down("md")]: {
      marginBottom: "1rem",
    },
  },
  filterSection: {
    display: "flex",
    alignItems: "center",
  },
}));

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  // height: "100%",
  bgcolor: "background.paper",
  border: "1px solid #fff",
  boxShadow: "0px 0px 4px #0000001A",
  p: 4,
  borderRadius: "4px",
};

const HardwarePartVariantList = () => {
  const [pageNo, setPagination] = useState(1)
  const [itemsPerPage] = useState(10)
  const [search, setSearchValue] = useState('')
  const [lastPage, setLastPage] = useState(false)
  const [loader, setLoading] = useState(false)
  const [searchBy, setSearchBy] = useState('variant_name')
  const [hardwarePartVariantList, setHardWarePartList] = useState([])
  const classes = useStyles();
  const loginData = getUserData('loginData')
  const uuid = loginData?.uuid



  const getHardwarePartVariantList = () => {
    let params = {
      page_offset: (pageNo - 1),
      page_size: itemsPerPage,
      search_by: searchBy,
      search_val: search,
      status: [1],
      uuid: uuid,
      order_by: "variant_id", // part_id, variant_id, part_name, part_variant_name
      order: "DESC" // ASC/DESC 
    }
    setLoading(true)
    setLastPage(false)
    listHardwarePartVariants(params)
      .then((res) => {
        setHardWarePartList(res?.data?.part_variants)
        if (res?.data?.part_variants.length < itemsPerPage) setLastPage(true)
        setLoading(false)
      }).catch(err => console.error(err))
  }


  const handleSearch = _.debounce((e) => {
    let { value } = e?.target
    if (value.trim() !== '') {
      setPagination(1);
      setSearchValue(value, () => setPagination(1));
    } else
      setSearchValue("")
  }, 500)

  useEffect(() => {
    getHardwarePartVariantList()
  }, [pageNo, itemsPerPage, search]);


  return (
    <div className="tableCardContainer">
      <Paper
      >
        <div className="mainContainer">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 15,
              marginBottom: 15,
            }}
          >
            <div className="left">
              <h3>Manage Part Variant</h3>
            </div>
            <div className="right">
              <Link to={"/authorised/hardware-part-variant-form"}>
                <div className={classes.submitBtn}>Create</div>
              </Link>
            </div>
          </div>
          <TextField
            style={{ marginBottom: "20px" }}
            className={`inputRounded search-input width-auto`}
            type="search"
            placeholder="Search By Part Variant"
            // value={searchTextField}
            inputProps={{ maxLength: 100 }}
            onChange={handleSearch}
            InputLabelProps={{ style: { ...{ top: `${-7}px` } } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="end">
                  <img src={SearchIcon} alt="" />
                </InputAdornment>
              ),
            }}
          />
          {loader && <Loader />}
          {hardwarePartVariantList?.length ?
            <HardwarePartVariantTable hardwarePartVariantList={hardwarePartVariantList} itemsPerPage={itemsPerPage} pageNo={pageNo} getHardwareVariantList={getHardwarePartVariantList} /> :
            <Alert severity="error">No Content Available!</Alert>}
        </div>

        <div className='center cm_pagination'>
          <Pagination pageNo={pageNo} setPagination={setPagination} lastPage={lastPage} />
        </div>
      </Paper>
    </div>
  );
};

export default HardwarePartVariantList;
