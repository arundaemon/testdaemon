import { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Alert,
  Grid,
  InputAdornment,
  Modal,
  Fade,
  Box,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { makeStyles } from "@mui/styles";
import toast from "react-hot-toast";
import Page from "../components/Page";
import Loader from "./Loader";
import { Link, useNavigate } from "react-router-dom";
import Controls from "../components/controls/Controls";
import { getCampaignList, changeStatus } from "../config/services/sources";
import SearchIcon from "../assets/icons/icon_search.svg";
import _ from "lodash";
import { SourceListTable } from "../components/sourceListing";
import Pagination from "./Pagination";
import SubSourceListingTable from "../components/SubSourceListingTable";
import MatrixCampaignTable from "../components/MatrixCampaignTable";
import { getCampaignManagementList } from "../config/services/campaigManagement";
import { getSubSourceList } from "../config/services/matrixSubSource";

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
    // "&:hover": {
    //   color: "#f45e29 !important",
    // },
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
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "auto",
  },
  modalPaper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #fff",
    boxShadow: "0px 0px 4px #0000001A",
    minWidth: "300px",
    borderRadius: "4px",
    textAlign: "center",
  },
  modalTitle: {
    fontSize: "18px",
  },
  outlineButton: {
    color: "#85888A",
    fontSize: "14px",
    border: "1px solid #DEDEDE",
    borderRadius: "4px",
    fontWeight: "normal",
    marginRight: "10px",
    padding: "0.5rem 1.5rem",
  },
  containedButton: {
    color: "#fff",
    fontSize: "14px",
    border: "1px solid #F45E29",
    borderRadius: "4px",
    fontWeight: "normal",
    padding: "0.5rem 1.5rem",
  },
}));

export default function SubSourceListing() {
  const [pageNo, setPagination] = useState(1);
  const [search, setSearchValue] = useState("");
  const [deletePopup, setDeletePopup] = useState(false);
  const [deleteObj, setDeleteObj] = useState({});
  const [loader, setLoading] = useState(false);
  const [itemsPerPage] = useState(10);
  const [sortObj, setSortObj] = useState({
    sortKey: "createdAt",
    sortOrder: "-1",
  });
  const [searchBy, setSearchBy] = useState({
    partName: "sub_source_name",
    partId: "sub_source_id",
  });
  const [sourceList, setSourceList] = useState([]);
  const [lastPage, setLastPage] = useState(false);
  const [loggedInUser] = useState(
    JSON.parse(localStorage.getItem("loginData"))?.uuid
  );
  const classes = useStyles();
  const navigate = useNavigate();

  const handleSearch = _.debounce((e) => {
    let { value } = e.target;
    if (value.trim() !== '') {
      setPagination(1);
      setSearchValue(value.trim(), () => setPagination(1));
    } else
      setSearchValue("")
  }, 600);
  const fetchSourceList = async () => {
    setLoading(true)

    let obj = {
      uuid: loggedInUser,
      page_offset: pageNo - 1,
      page_size: itemsPerPage,
      search_by: searchBy.partName,
      search_val: search,
      status: [1, 2]
    }

    try {
      const response = await getSubSourceList(obj);
      setLastPage(false)
      setSourceList(response?.data?.sub_source_list)
      if (response?.data?.sub_source_list?.length < itemsPerPage) setLastPage(true)
      setLoading(false)
    }
    catch (err) {
      console.log("error in getSubSourceList: ", err);
      toast.error("***Error***");
    }

  };


  useEffect(() => fetchSourceList(), [search, pageNo, itemsPerPage, sortObj]); //removed sortObj

  return (
    <div className="tableCardContainer">
      <Page
        title="Extramarks | SubSource Management"
        className="main-container datasets_container"
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
              <h3>SubSource Listing</h3>
              <p></p>
            </div>
            <div className="right">
              <Link to={"/authorised/add-pricematrix-sub-source"}>
                <div className={classes.submitBtn}>Create</div>
              </Link>
            </div>
          </div>
        </div>

        <TextField
          style={{ marginBottom: "20px" }}
          className={`inputRounded search-input`}
          type="search"
          placeholder=" Search by SubSource Name"
          onChange={handleSearch}
          inputProps={{ maxLength: 100 }}
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
        {sourceList && sourceList.length > 0 ? <SubSourceListingTable list={sourceList} pageNo={pageNo} itemsPerPage={itemsPerPage} fetchSourceList={fetchSourceList} /> :
          <Alert severity="error">No Content Available!</Alert>}

        <div className="center cm_pagination">
          <Pagination
            pageNo={pageNo}
            setPagination={setPagination}
            lastPage={lastPage}
          />
        </div>
      </Page>
    </div>
  );
}
