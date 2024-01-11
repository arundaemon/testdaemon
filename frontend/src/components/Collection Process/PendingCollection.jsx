import React, { useEffect, useState } from "react";
import Page from "../Page";
import {
  TextField,
  InputAdornment,
  Button,
  Modal,
  Paper,
  Typography,
  ListItemText,
  MenuItem,
  Divider,
  Select,
  FormControl,
  Container,
  Grid,
  Box,
  TablePagination,
  Checkbox,
} from "@mui/material";

import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

import ReactSelect from "react-select";

import { makeStyles } from "@mui/styles";
import { getLoggedInRole } from "../../utils/utils";
import { useNavigate } from "react-router-dom";
import FilterIcon from "../../assets/image/filterIcon.svg";
import SearchIcon from "../../assets/icons/icon_search.svg";
import _ from "lodash";
import moment from "moment";
import { DisplayLoader } from "../../helper/Loader";
import { getUserData } from "../../helper/randomFunction/localStorage";
import { DecryptData, EncryptData } from "../../utils/encryptDecrypt";
import { toast } from "react-hot-toast";
import Pagination from "../../pages/Pagination";

import useMediaQuery from "@mui/material/useMediaQuery";
import { listPendingCollection } from "../../config/services/packageBundle";
import PendingCollectionTable from "./PendingCollectionTable";
import { useStyles } from "../../css/Collection-css";
import { getSchoolBySchoolCode, getSchoolsByCode } from "../../config/services/school";

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

const PendingCollectionList = () => {
  const classes = useStyles();
  //const [searchTextField, setSearchTextField] = useState("");
  const [search, setSearchValue] = useState("");
  const [searchBy, setSearchBy] = useState("dsc_date");

  const userRole = getLoggedInRole();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  //const [empName,setEmpName] = useState("")
  const loginData = getUserData("loginData");
  const uuid = loginData?.uuid;
  const [lastPage, setLastPage] = useState(false);
  const [pageNo, setPagination] = useState(1);
  const [loader, setLoading] = useState(false);
  const [itemsPerPage] = useState(10);
  const [pendingCollectionList, setPendingCollectionList] = useState([]);
  const [schoolDetails, setSchoolDetails] = useState(null);
  let serialNumber = 0;
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

  const handleSearch = _.debounce((e) => {
    let { value } = e.target;
    value = value.trim();
    if (value !== "") {
      setPagination(1);
      setSearchValue(value, () => setPagination(1));
    } else {
      setSearchValue("");
    }
  }, 700);

  const fetchPendingTask = () => {
    let params = {
      uuid,
      page_offset: pageNo - 1,
      page_size: itemsPerPage,
      search_by: search ? "school_code" : null,
      search_val: search ?? null,
    };
    setLoading(true);
    listPendingCollection(params)
      .then((res) => {
        setLoading(false);
        if (res?.data?.pending_collection_details?.length) {
          let data = res?.data?.pending_collection_details;
          setPendingCollectionList(data);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.error(err, "Error while fetching Pending Tasks");
      });
  };



  const getSchoolDetails = (school_code) => {
    let params = {
      schoolCodeList:school_code
    } 
    getSchoolsByCode(params)
      .then((res) => {
        let details = res?.result;
        setSchoolDetails(details);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if(pendingCollectionList?.length) {
      let data = pendingCollectionList?.map(obj => obj?.school_code)
      getSchoolDetails(data)
    }
  }, [pendingCollectionList])
  

  useEffect(() => {
    fetchPendingTask();
  }, [pageNo, itemsPerPage, search]);

  return (
    <Page
      title="Collection List | Extramarks"
      className="crm-page-wrapper"
    >
      <Box className="crm-page-listing">
        
        <div className="crm-page-listing-header">
          <div className="crm-page-listing-header-label">
      
              <div className="left">
                  <h3>Pending Collection Tasks</h3>
              </div>
              {
                  !isMobile
                  ? <div className="right">
                      <form>
                        <TextField
                          className={`crm-form-input medium-dark`}
                          type="search"
                          placeholder="Search"
                          // value={searchTextField}
                          onChange={handleSearch}
                          InputLabelProps={{ style: { top: `${-7}px` } }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <img src={SearchIcon} alt="" />
                              </InputAdornment>
                            ),
                          }}
                        />
                          
                      </form>
                      
                      </div>
                  : null
              }
          </div>
        </div>

          {!loader ? (
            pendingCollectionList?.length > 0 ? (
              <PendingCollectionTable
                list={pendingCollectionList}
                schoolDetails={schoolDetails}
                pageNo={pageNo}
                itemsPerPage={itemsPerPage}
              />
            ) : (
              <div className={classes.noData}>
                <p>No Data</p>
              </div>
            )
          ) : (
            <div className={classes.loader}>{DisplayLoader()}</div>
          )}
      </Box>
      <div className="center cm_pagination">
        <Pagination
          pageNo={pageNo}
          setPagination={setPagination}
          lastPage={lastPage}
        />
      </div>
    </Page>
  );
};

export default PendingCollectionList;
