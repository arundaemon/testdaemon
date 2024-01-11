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
import { listSchoolLedger } from "../../config/services/packageBundle";
import { useStyles } from "../../css/Collection-css";
import { getSchoolBySchoolCode } from "../../config/services/school";
import LedgerTable from "./LedgerTable";

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

const LedgerListDetail = () => {
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
  const [schoolLedgerList, setSchoolLedgerList] = useState([]);
  const [schoolDetails, setSchoolDetails] = useState(null);
  let serialNumber = 0;

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
      // page_offset: pageNo - 1,
      // page_size: itemsPerPage,
      school_code: "",
      product_code: [],
      // search_val: search,
      is_published: 1,
      order_by: "school_code",
      order: "ASC",
    };
    setLoading(true);
    listSchoolLedger(params)
      .then((res) => {
        setLoading(false);
        if (res?.data?.ledger_details?.length) {
          let data = res?.data?.ledger_details;
          setSchoolLedgerList(data);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.error(err, "Error while fetching Pending Tasks");
      });
  };

  const getSchoolDetails = (school_code) => {
    let params = {
      schoolCodeList: school_code
    }
    getSchoolBySchoolCode(params)
      .then((res) => {
        let details = res?.result;
        setSchoolDetails(details);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (schoolLedgerList?.length) {
      let data = schoolLedgerList?.map((obj) => obj?.school_code);
      getSchoolDetails(data);
    }
  }, [schoolLedgerList]);

  useEffect(() => {
    fetchPendingTask();
  }, [pageNo, itemsPerPage, search]);

  return (
    <Page
      title="Extramarks | Collection List"
      className="main-container myLeadPage datasets_container"
    >
      <div className="tableCardContainer">
        <Paper>
          
          {!loader ? (
            schoolLedgerList?.length > 0 ? (
              <LedgerTable
                list={schoolLedgerList}
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
        </Paper>
      </div>
    
    </Page>
  );
};

export default LedgerListDetail;
