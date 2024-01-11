import React, { useEffect, useState } from 'react';
import { getPurchaseOrderList } from '../../config/services/purchaseOrder';
import { DisplayLoader } from '../../helper/Loader';
import { Breadcrumbs, Button, Container, InputAdornment, TablePagination, TextField, Typography, Box } from "@mui/material";
import { makeStyles } from '@mui/styles';
import SearchIcon from '../../assets/icons/icon_search.svg';
import Page from "../../components/Page";
import PurchaseOrderTable from './PurchaseOrderTable';
import _ from 'lodash';
import FilterIcon from "../../assets/image/filterIcon.svg";
import LeadFilter from "../leadFilters/LeadFilter";
import { DecryptData, EncryptData } from "../../utils/encryptDecrypt";
import { toast } from "react-hot-toast";
import { getReportPurchaseOrderList } from '../../helper/DataSetFunction';
import { getLoggedInRole } from '../../utils/utils';
import { Link, useLocation } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import { ReactComponent as IconToastCancel } from '../../assets/icons/icon-toast-cancel.svg';
import IconBreadcrumbArrow from "./../../assets/icons/icon-breadcrumb-arrow.svg";
import { ReactComponent as IconSearchSetting } from "../../assets/icons/icon-listing-setting.svg";

const useStyles = makeStyles(() => ({
  noData: {
    height: "50vh",
    width: "90vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: 600,
    fontSize: 25
  },
  loader: {
    height: "50vh",
    width: "90vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  addClaimBtn: {
    fontWeight: "600",
    fontSize: "16px",
    lineHeight: "22px",
    cursor: "pointer",
    borderRadius: "4px",
    color: "white",
    border: "1px solid #F45E29",
    padding: "12px 24px",
    background: "#F45E29",
    marginLeft: "95px",
    marginBottom: '10px',
    width: "max-content"
  },
  header: {
    fontSize: '28px',
    fontWeight: '600',
    marginTop: '-35px'
  },
  buttonDiv: {
    display: 'grid',
    marginBottom: '10px'
  },
  filterSection: {
    display: "flex",
    alignItems: "center",
    marginBottom: '10px'
  },
  filterDiv: {
    border: '1px solid #DEDEDE',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '14px',
    width: '100px',
    height: '38px',
    borderRadius: '4px',
    color: '#85888A',
    marginBottom: '20px',
    cursor: 'pointer'
  }
}))

const PurchaseOrderManagement = () => {

  const [pageNo, setPagination] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [search, setSearchValue] = useState('')
  const [purchaseOrderArray, setPurchaseOrderArray] = useState([])
  const [loader, setLoader] = useState(false)
  const [lastPage, setLastPage] = useState(false)
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRows, setSelectedRows] = useState([]);
  const [filterAnchor, setFilterAnchor] = useState(null);
  const [filters, setFilters] = useState([]);
  const [filtersApplied, setFiltersApplied] = useState([]);
  const [role] = useState('PO_FILTER')
  const userRole = getLoggedInRole();
  const classes = useStyles()
  let location = useLocation();

  let { message } = location?.state ?? {};
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

  // useEffect(() => {

  //   if (message) {
  //     toast(<div className='crm-toast-message-info'>message</div>,
  //       {
  //         duration: 5000,
  //         position: 'bottom-center',
  //         className: 'crm-toast-message',
  //         icon: <div className='crm-toast-icon'><IconToastCancel /></div>
  //       }
  //     )
  //   }
  // }, [message]);

  const handleSearch = _.debounce((e) => {
    let { value } = e?.target;
    if (value.trim() !== '') {
      setPagination(1);
      setSearchValue(value, () => setPagination(1));
    } else
      setSearchValue("")
  }, 600);


  const handlePagination = (e, pageNumber) => {
    setPagination(pageNumber);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPagination(1);
    setItemsPerPage(event.target.value);
  };



  const purchaseOrderList = (childRoleNames) => {
    let params = { pageNo: (pageNo - 1), count: itemsPerPage, search, childRoleNames }
    setLastPage(false)
    setLoader(false)
    getPurchaseOrderList(params)
      .then((res) => {
        let data = res?.result
        for (const item of data) {
          const uniqueGroupCodes = [];

          const products = item.product;
          
          if(products && products.length > 0){
            for (const product of products) {
              const groupCode = product.groupCode;
              if (!uniqueGroupCodes.includes(groupCode)) {
                uniqueGroupCodes.push(groupCode);
              }
            }
          }
          
          item.uniqueProducts = uniqueGroupCodes
        }

        setPurchaseOrderArray(data)
        if (data?.length < itemsPerPage) setLastPage(true)
        setLoader(true)
      })
      .catch((err) => {
        console.error(err, '..error')
        setLoader(true)
      })
  }

  const fetchReportPurchaseOrderList = async (childRoleNames) => {
    try {
      let params = { pageNo, itemsPerPage, search, filtersApplied, childRoleNames };
      setLastPage(false);
      setLoader(false);
      let res = await getReportPurchaseOrderList(params);
      let data = res?.loadResponses?.[0]?.data;
      let formattedData = await formatReportData(data, "Purchaseorders.")
      setPurchaseOrderArray(formattedData);
      setLoader(true);
      if (data?.length < itemsPerPage) {
        setLastPage(true);
      }
    } catch (err) {
      setLastPage(true);
      console.error(err, 'Error while fetching po from report engine');
      setLoader(true);
    }
  }

  const formatReportData = async (data, prevKey) => {
    let convertedArray = await data.map(item => {
      let convertedItem = {};
      for (let key in item) {
        let newKey = key.replace(prevKey, "");
        if (newKey === 'product') {
          convertedItem[newKey] = JSON.parse(item[key]);
        }
        else convertedItem[newKey] = item[key];
      }
      return convertedItem;
    });
    return convertedArray
  }

  const handleSelectClick = (event, rowId) => {
    if (event?.target?.checked) {
      setSelectedRows((prevSelected) => [...prevSelected, rowId]);
    } else {
      setSelectedRows((prevSelected) =>
        prevSelected?.filter((id) => id !== rowId)
      );
    }
  };

  const handleFilter = (e) => {
    setFilterAnchor(e.currentTarget);
  };

  const applyFilters = () => {
    if (filters.find((fltObj) => fltObj?.label === "Select Filter")) {
      toast.error("Select Valid Filter");
      return;
    }
    let filtersCopy = _.cloneDeep(filters);
    localStorage.setItem("POFilter", EncryptData(filtersCopy));
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
    if (filters[0]?.label === 'Select Filter') {
      filtersCopy?.splice(filterIndex, 1);
      setFilters(filtersCopy);
    }
    else {
      filtersCopy?.splice(filterIndex, 1);
      setFilters(filtersCopy);
      setFiltersApplied(filtersCopy);
    }
    localStorage.setItem("POFilter", EncryptData(filtersCopy));
    if (filtersCopy?.length == 0) {
      localStorage.removeItem("POFilter");
    }
  };

  const removeAllFilters = () => {
    setFilters([]);
    setFiltersApplied([]);
    localStorage.removeItem("POFilter");
  };

  useEffect(() => {
    const applyFilter = DecryptData(localStorage?.getItem("POFilter"));
    if (applyFilter) {
      setFiltersApplied(applyFilter)
      let tempFilter = [];
      applyFilter.map((item) => {
        tempFilter.push(item);
      });
      setFilters(tempFilter);
    }
  }, [])

  useEffect(() => {
    const applyFilter = DecryptData(localStorage?.getItem("POFilter"));
    let childRoleNames = DecryptData(localStorage?.getItem("childRoles"))
    // setRoleslist(childRoleNames)
    childRoleNames = childRoleNames?.map((roleObj) => roleObj?.roleName)
    childRoleNames.push(userRole)
    if (applyFilter === null) {
      purchaseOrderList(childRoleNames)
    }
    else if (filtersApplied?.length > 0) {
      fetchReportPurchaseOrderList(childRoleNames)
    }
  }, [pageNo, search, rowsPerPage, filtersApplied])


  return (
    <Page title="Purchase Order | Extramarks" className="crm-page-wrapper crm-page-listing-container">

      <Breadcrumbs
        className="crm-breadcrumbs"
        separator={<img src={IconBreadcrumbArrow} />}
        aria-label="breadcrumbs"
      >
        <Link
          underline="hover"
          key="1"
          color="inherit"
          to={`/authorised/school-dashboard`}
          className="crm-breadcrumbs-item breadcrumb-link"
        >
          Dashboard
        </Link>

        <Typography
          key="3"
          component="span"
          className="crm-breadcrumbs-item breadcrumb-active"
        >
          Purchase Order
        </Typography>
      </Breadcrumbs>

      <div className="crm-page-container">
        <Box className="crm-page-listing">

          <div className="crm-page-listing-header">
            <div className="crm-page-listing-header-label">
        
              <div className="left">
                  <h3>Purchase Order</h3>
              </div>
              {
                  !isMobile
                  ? <div className="right">
                      <form>
                          <TextField
                              className={`crm-form-input`}
                              type="search"
                              placeholder="Search"
                              onChange={handleSearch}
                              InputLabelProps={{ style: { ...{ top: `${-7}px` } } }}
                              InputProps={{
                                  endAdornment: (
                                  <InputAdornment position="start">
                                      <img src={SearchIcon} alt="" />
                                  </InputAdornment>
                                  ),
                              }}
                          />
                          
                      </form>
                      <Button className="crm-search-settings">
                          <IconSearchSetting />
                      </Button>
                      </div>
                  : null
              }
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
                    <div className="filterContainer">
                    <img src={FilterIcon} alt="FilterIcon" /> Filters
                    </div>
                </span>
                </div>
            </div>
              
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
            {/* <>
              <div className="right">
                <Button variant="outlined" color="error"
                  style={{ marginRight: "15px" }}
                >
                  Approve
                </Button>
              </div>

              <div className="right">
                <Button variant="outlined" color="error"
                >
                  Reject
                </Button>
              </div>
            </> */}
          </div>

        </Box>


        {loader ?
          ((purchaseOrderArray?.length > 0) ?
            <>
              <PurchaseOrderTable list={purchaseOrderArray} selectedRows={selectedRows} handleSelectClick={handleSelectClick} />
              
              <div className='center cm_pagination'>
                <TablePagination
                  component="div"
                  count={-1}
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
                <p>No Purchase Order Found!</p>
              </div>
              <div className='center cm_pagination'>
                <TablePagination
                  component="div"
                  count={-1}
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
      </div>

    </Page>
  );
}

export default PurchaseOrderManagement