import { Alert, InputAdornment, Paper, TextField } from "@mui/material";
import { makeStyles } from "@mui/styles";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SearchIcon from "../../assets/icons/icon_search.svg";
import { listPackageBundles } from "../../config/services/packageBundle";
import Loader from "../../pages/Loader";
import Pagination from "../../pages/Pagination";
import PackageBundleTable from "./PackageBundleTable";
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

const ManagePackageHeader = () => {
  const [pageNo, setPagination] = useState(1);
  const [itemsPerPage] = useState(10);
  const [search, setSearchValue] = useState("");
  const [lastPage, setLastPage] = useState(false);
  const [loader, setLoading] = useState(false);
  const [searchBy, setSearchBy] = useState("package_name");
  const [packageList, setPackageList] = useState([]);
  const [mergedList, setMergedList] = useState([]);
  const classes = useStyles();
  const data = getUserData("loginData");
  let uuid = data?.uuid;

  const getPackageList = () => {
    let params = {
      uuid: uuid,
      page_offset: pageNo - 1,
      page_size: itemsPerPage,
      search_by: searchBy,
      search_val: search,
      status: [1],
      order_by:"package_id",
      order:"DESC"
    };
    setLoading(true);
    setLastPage(false);
    listPackageBundles(params)
      .then((res) => {
        let list = res?.data?.package_list_details;
        setMergedList(list);
        const finalPackageList = list.map((obj) => obj.package_information);
        setPackageList(finalPackageList);
        if (res?.data?.package_list_details?.length < itemsPerPage)
          setLastPage(true);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err, "..error");
        setLoading(true);
      });
  };

  const handleSearch = _.debounce((e) => {
    let { value } = e.target;
    value = value.trim();
    if (value !== "") {
      setPagination(1);
      setSearchValue(value, () => setPagination(1));
    } else {
      setSearchValue("");
    }
  }, 600);

  useEffect(() => {
    getPackageList();
  }, [pageNo, itemsPerPage, search]);

  return (
    <div className="tableCardContainer">
      <Paper>
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
              <h3>Manage Package Bundles</h3>
            </div>
            <div className="right">
              <Link to={"/authorised/package-form"}>
                <div className={classes.submitBtn}>Create</div>
              </Link>
            </div>
          </div>
          <TextField
            style={{ marginBottom: "20px" }}
            className={`inputRounded search-input width-auto`}
            type="search"
            placeholder="Search By Package Name"
            // value={searchTextField}
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
          {packageList?.length ? (
            <PackageBundleTable
              packageList={packageList}
              itemsPerPage={itemsPerPage}
              pageNo={pageNo}
              mergedList={mergedList}
              getPackageList={getPackageList}
            />
          ) : (
            <Alert severity="error">No Content Available!</Alert>
          )}
        </div>

        <div className="center cm_pagination">
          <Pagination
            pageNo={pageNo}
            setPagination={setPagination}
            lastPage={lastPage}
          />
        </div>
      </Paper>
    </div>
  );
};

export default ManagePackageHeader;
