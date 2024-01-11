import React, { useEffect, useState } from "react";
import Page from "../../components/Page";
import {
  Container,
  Button,
  Grid,
  Divider,
  TextField,
  InputAdornment,
  Paper,
  TablePagination,
  Box,
  Typography,
  Radio,
  RadioGroup,
  Checkbox,
  FormControlLabel,
  FormControl,
  MenuItem,
  Select,
  LinearProgress,
} from "@mui/material";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

import { makeStyles } from "@mui/styles";

import ReactSelect from "react-select";
import { useSelector } from "react-redux";
import { getAllChildRoles } from "../../config/services/hrmServices";
import { getLoggedInRole } from "../../utils/utils";
import { DecryptData, EncryptData } from "../../utils/encryptDecrypt";
import { changeleadowner } from "../../config/services/leadassign";
import { useNavigate } from "react-router-dom";
import { Toast, toast } from "react-hot-toast";
import settings from "../../config/settings";
import { DisplayLoader } from "../../helper/Loader";
import FilterIcon from "../../assets/image/filterIcon.svg";
import SearchIcon from "../../assets/icons/icon_search.svg";
import _ from "lodash";

import LeadFilter from "../../components/leadFilters/LeadFilter";

//import { Tabs } from "../../components/Calendar/Tabs";
import {
  getQuotationList,
  deleteQuotationList,
  getQuotationDetails,
  updateQuotationStatus,
} from "../../config/services/quotationCRM";
import moment from "moment";
import {
  CurrencySymbol,
  ProductQuoteType,
  QuoteType,
} from "../../constants/general";
import QuotationDetailForm from "./QuotationDetailForm";
import { PurchaseOrderModal } from "../../components/purchaseOrder/PurchaseOrderModal";
import { getReportQuotationList } from "../../helper/DataSetFunction";
import CubeDataset from "../../config/interface";
import Pagination from "../../pages/Pagination";
import { getUserData } from "../../helper/randomFunction/localStorage";
import { assignApprovalRequest } from "../../config/services/salesApproval";
import { QuotationTableGrid } from "./QuotationTableGrid";

const useStyles = makeStyles((theme) => ({
  cusCard: {
    padding: "18px",
    boxShadow: "0px 0px 8px #00000029",
    borderRadius: "8px",
    margin: "0.5rem 1rem",
  },
  RevenueCard: {
    padding: "0px",
    overflow: "hidden",
  },
  submitBtn: {
    fontWeight: "bold !important",
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
  noData: {
    height: "50vh",
    width: "90vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: 600,
    fontSize: 25,
  },
  loader: {
    height: "50vh",
    width: "90vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  customBorder: {
    padding: "10px 16px",
    border: "1px solid #eee",
    fontSize: "15px",
  },
  btnSection: {
    padding: "15px 5px 15px 5px",
    textAlign: "right",
  },
}));

const QuotationTable = () => {
  const classes = useStyles();
  const [schoolList, setSchoolList] = useState([]);

  const [checkedLeads, setCheckedLeads] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loader, setLoader] = useState(false);
  const [searchTextField, setSearchTextField] = useState("");
  const [search, setSearchValue] = useState("");
  const [selectUserModal, setSelectUserModal] = useState(false);
  const [changeOwner, setChangeOwner] = useState(false);
  const [selectedUser, setSelectedUser] = useState();
  const [ownerChanged, setOwnerChanged] = useState(false);
  const [leadSize, setLeadSize] = useState(false);
  const userRole = getLoggedInRole();
  const navigate = useNavigate();
  const [roleNameList, setRoleName] = useState([]);
  const [lastPage, setLastPage] = useState();
  const [itemsToDelete, setItemsToDelete] = useState([]);
  const [sortObj, setSortObj] = useState({
    sortKey: "createdAt",
    sortOrder: "-1",
  });
  const [filterAnchor, setFilterAnchor] = useState(null);
  const [filters, setFilters] = useState([]);
  const [filtersApplied, setFiltersApplied] = useState([]);
  const [reportSchoolList, setReportSchoolList] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [role] = useState("QUOTATION_FILTER");
  const [quotationData, setQuotationData] = useState([]);
  const [totalProductSalePrice, setTotalProductSalePrice] = useState(0);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [noResults, setNoResults] = useState(false);
  const [invalidSearch, setInvalidSearch] = useState(false);
  const [filteredQuotationData, setFilteredQuotationData] = useState([]);
  const [pageNo, setPageNo] = useState(1); // Current page number
  const [itemsPerPage, setItemsPerPage] = useState(10); // Items per page
  const [isLoading, setIsLoading] = useState(false);
  const [quotationListDetail, setQuotationDetail] = useState([]);
  const [shwQuotationDTL, setQuotationDetails] = useState(true);
  const [isQuotationID, setQuotationID] = useState(null);
  const [modal1, setModal1] = useState(false);
  const [leadObj, setLeadObj] = useState({});
  const [quotationList, setQuotationList] = useState([]);
  const [shw_loader, setDisplayLoader] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  const previousButtonStyle = {
    borderRadius: "4px",
    color: pageNo <= 1 ? "#cbc5c5" : "black",
    padding: "6px 24px",
    lineHeight: "24px",
    cursor: "pointer",
    display: "inline-block",
    marginRight: "-24px",
    height: "38px",
    marginBottom: "10px",
    fontSize: "25px",
    border: "transparent",
    backgroundColor: "inherit",
  };

  const nextButtonStyle = {
    borderRadius: "4px",
    color: lastPage ? "#cbc5c5" : "black",
    padding: "6px 24px",
    marginBottom: "10px",
    lineHeight: "24px",
    cursor: "pointer",
    display: "inline-block",
    marginRight: "20px",
    height: "38px",
    fontSize: "25px",
    border: "transparent",
    backgroundColor: "inherit",
    // cursor: lastPage ? "not-allowed" : "pointer",
  };

  const [TAB_1] = [
    {
      label: "",
    },
  ];

  const [activeTab, setActiveTab] = useState(TAB_1);

  const getQuotationDataList = async (childRoleNames) => {
    let params = {
      pageNo: pageNo - 1,
      count: itemsPerPage,
      ...sortObj,
      search,
      childRoleNames,
    };
   
    setLastPage(false);
    setIsLoading(true);
    try {
      let res = await getQuotationList(params);
      if (res && res.result) {
        if (res?.result?.length < itemsPerPage) setLastPage(true);
        else setLastPage(false);

        setQuotationList(res?.result);

        const listData = res.result.map((item) => {
          // Calculate the sum of productSalePrice from all item.data arrays
          const productItemSalePriceSum = item.data.reduce(
            (sum, dataItem) =>
              sum + parseFloat(dataItem.productItemSalePrice || 0),
            0
          );

          return {
            quotationCode: item.data[0].quotationCode,
            schoolCode: item.data[0].schoolCode,
            leadId: item.data[0].leadId,
            schoolName: item.data[0].schoolName,
            productName: item.data[0].productName,
            createdAt: item.data[0].createdAt,
            status: item.data[0].status,
            approvalStatus: item.data[0].approvalStatus,
            productItemSalePriceSum: productItemSalePriceSum, // Set the sum here
            createdByName: item.data?.[0].createdByName,
          };
        });

        // Calculate the totalProductSalePrice by summing up all productSalePrice values
        const total = listData.reduce(
          (sum, item) => sum + parseFloat(item.productItemSalePriceSum || 0),
          0
        );
        // Update the state with the totalProductSalePrice
        setTotalProductSalePrice(total);
        if (listData.length > 0) {
          setQuotationData(listData);
        } else {
          setQuotationData([]);
        }
        if (listData?.length < itemsPerPage) setLastPage(true);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setLastPage(true);
    } finally {
      setIsLoading(false); // Reset isLoading when the call is complete
    }
  };

  const fetchReportQuotationList = async (childRoleNames) => {
    try {
      let params = {
        pageNo,
        itemsPerPage,
        search,
        filtersApplied,
        childRoleNames,
      };
      setLastPage(false);
      setIsLoading(true);
      let res = await getReportQuotationList(params);
      let data = res?.loadResponses?.[0]?.data;
      let formattedData = await formatReportData(data, "Quotations.");
      setQuotationData(formattedData);
      setIsLoading(false);
      if (data?.length < itemsPerPage) setLastPage(true);
    } catch (err) {
      setLastPage(true);
      console.error(err, "Error while fetching po from report engine");
      setIsLoading(false);
    }
  };

  const formatReportData = async (data, prevKey) => {
    let totalQuotationValue = 0;
    let convertedArray = await data.map((item) => {
      let convertedItem = {};
      for (let key in item) {
        let newKey = key.replace(prevKey, "");
        if (newKey === "TotalSalePrice") {
          convertedItem["productItemSalePriceSum"] = item[key];
          totalQuotationValue += item[key];
        }
        if (newKey === "FormatedCreatedDate") {
          convertedItem["createdAt"] = item[key];
        } else convertedItem[newKey] = item[key];
      }
      return convertedItem;
    });
    setTotalProductSalePrice(totalQuotationValue);
    return convertedArray;
  };

  const handleChangePage = (event, newPage) => {
    setPageNo(newPage + 1);
    getQuotationDataList(newPage + 1);
  };

  const handlePrevious = () => {
    if (pageNo > 1) {
      setPageNo(pageNo - 1);
    }
  };
  const handleNext = () => {
    if (!lastPage) {
      setPageNo(pageNo + 1);
    }
  };

  const handleSearch = _.debounce((value) => {
    if (value.trim() !== "") {
      setPageNo(1);
      setSearchValue(value);
      // setInvalidSearch(false); // Reset invalidSearch when there is a search term
    } else {
      setSearchValue("");
      // setInvalidSearch(true); // Set invalidSearch to true when the input is empty
    }
  }, 700);

  const handleDelete = async () => {
    try {
      if (selectedItems.length === 0) {
        return;
      }

      const res = await deleteQuotationList(selectedItems);

      if (res?.message) {
        toast.success(res?.message);
        window.location.reload();
      }
    } catch (error) {
      console.error("An error occurred:", error);
      window.location.reload();
    }
  };


  //Filter
  const handleFilter = (e) => {
    setFilterAnchor(e.currentTarget);
  };

  const applyFilters = () => {
    if (filters.find((fltObj) => fltObj?.label === "Select Filter")) {
      toast.error("Select Valid Filter");
      return;
    }
    let filtersCopy = _.cloneDeep(filters);
    localStorage.setItem("quotationFilter", EncryptData(filtersCopy));
    setFiltersApplied(filtersCopy);
    setFilterAnchor(null);
  };

  const addFilter = () => {
    let filtersCopy = _.cloneDeep(filters);
    if (filters.find((fltObj) => fltObj?.label === "Select Filter")) {
      toast.error("First fill empty filter");
      return;
    }
    filtersCopy?.unshift({ label: "Select Filter" });
    setFilters(filtersCopy);
  };

  const removeFilter = (filterIndex) => {
    let filtersCopy = _.cloneDeep(filters);
    if (filters[0]?.label === "Select Filter") {
      filtersCopy?.splice(filterIndex, 1);
      setFilters(filtersCopy);
    } else {
      filtersCopy?.splice(filterIndex, 1);
      setFilters(filtersCopy);
      setFiltersApplied(filtersCopy);
    }
    localStorage.setItem("quotationFilter", EncryptData(filtersCopy));
    if (filtersCopy?.length == 0) {
      localStorage.removeItem("quotationFilter");
    }
  };

  const removeAllFilters = () => {
    setFilters([]);
    setFiltersApplied([]);
    localStorage.removeItem("quotationFilter");
  };

  useEffect(() => {
    const applyFilter = DecryptData(localStorage?.getItem("quotationFilter"));
    if (applyFilter) {
      setFiltersApplied(applyFilter);
      let tempFilter = [];
      applyFilter.map((item) => {
        tempFilter.push(item);
      });
      setFilters(tempFilter);
    }
  }, []);

  useEffect(() => {
    const applyFilter = DecryptData(localStorage?.getItem("quotationFilter"));
    let childRoleNames = DecryptData(localStorage?.getItem("childRoles"));
    childRoleNames = childRoleNames?.map((roleObj) => roleObj?.roleName);
    childRoleNames.push(userRole);
    if (applyFilter === null) {
      getQuotationDataList(childRoleNames);
    } else if (filtersApplied?.length > 0) {
      fetchReportQuotationList(childRoleNames);
    }
  }, [pageNo, search, rowsPerPage, filtersApplied]);

  
  const getSelectedItem = (data) => {
    if (data) {
      setSelectedItems(data);
    }
  };

  return (
    <>
      <Page
        title="Extramarks | Quotation Table"
        className="main-container myLeadPage datasets_container"
      >
        <>
          <div>{shw_loader ? <LinearProgress /> : ""}</div>
          {shwQuotationDTL && (
            <div>
              <div className="tableCardContainer">
                <Paper>
                  <div className="mainContainer">
                    {activeTab ? (
                      <div className={classes.customBorder}>
                        {`Total ${
                          activeTab ? activeTab?.label : ""
                        } Quotation Value :  ${CurrencySymbol?.India}${Number(
                          totalProductSalePrice
                        )?.toLocaleString("en-IN", {
                          maximumFractionDigits: 2,
                        })}`}
                      </div>
                    ) : (
                      <div></div>
                    )}
                    <div className="right">
                      <TextField
                        className={`inputRounded search-input width-auto`}
                        type="search"
                        placeholder="Search"
                        // value={searchTextField}
                        onChange={(e) => {
                          const { value } = e.target;
                          setSearchTextField(value);
                          handleSearch(value, e);
                        }}
                        InputLabelProps={{ style: { top: `${-7}px` } }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <img src={SearchIcon} alt="" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </div>
                  </div>
                  <div className={classes.filterSection}>
                    <div style={{ width: "100%", height: "100%" }}>
                      <div
                        style={{
                          display: "flex",
                          width: "100%",
                          justifyContent: "space-between",
                        }}
                      >
                        <span onClick={handleFilter}>
                          <div className="filterContainer mt-1">
                            <img src={FilterIcon} alt="FilterIcon" /> Filter
                          </div>
                        </span>
                        <LeadFilter
                          applyFilters={applyFilters}
                          filterAnchor={filterAnchor}
                          setFilterAnchor={setFilterAnchor}
                          addFilter={addFilter}
                          filters={filters}
                          setFilters={setFilters}
                          removeAllFilters={removeAllFilters}
                          removeFilter={removeFilter}
                          role={role}
                        />
                      </div>
                    </div>
                    {selectedItems?.length > 0 && (
                      <div className="right">
                        <Button
                          // variant="outlined"
                          // color="error"
                          className={classes.submitBtn}
                          onClick={() => handleDelete()}
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>

                  {!isLoading ? (
                    quotationData?.length > 0 ? (
                      <QuotationTableGrid
                        data={quotationData}
                        getSelectedItem={getSelectedItem}
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
              <Grid />
              <div className="center cm_pagination">
                <Pagination
                  pageNo={pageNo}
                  setPagination={setPageNo}
                  lastPage={lastPage}
                />
              </div>
            </div>
          )}

          {Object.keys(leadObj)?.length > 0 && (
            <PurchaseOrderModal
              modal1={modal1}
              setModal1={setModal1}
              leadObj={leadObj}
            />
          )}
        </>
      </Page>
    </>
  );
};

export default QuotationTable;
