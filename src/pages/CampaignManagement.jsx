import { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Pagination,
  Grid,
  InputAdornment,
  Typography,
  Divider,
  Card,
  Link,
  Breadcrumbs,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Page from "../components/Page";
import SearchIcon from "../assets/icons/icon_search.svg";
import _ from "lodash";
import CreateCampaign from "../components/campaignManagement/CreateCampaign";
import { getCampaignList } from "../config/services/campaign";
import CampaignTable from "../components/campaignManagement/CampaignTable";
import { makeStyles } from "@mui/styles";
import Revenue from "../components/MyLeads/Revenue";
import Slider from "../components/MyLeads/Slider";
import { useRef } from "react";
import { DisplayLoader } from "../helper/Loader";

const useStyles = makeStyles((theme) => ({
  cusCard: {
    padding: "2px",
    boxShadow: "0px 0px 8px #00000029",
    borderRadius: "8px",
    height: "100%",
  },
  RevenueCard: {
    padding: "0px",
    overflow: "hidden",
  },
}));

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function CampaignManagement() {
  const classes = useStyles();
  const [createCampaign, setCreateCampaign] = useState(false);
  const [pageNo, setPagination] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [search, setSearchValue] = useState("");
  const [sortObj, setSortObj] = useState({
    sortKey: "createdAt",
    sortOrder: "-1",
  });
  const [cycleTotalCount, setCycleTotalCount] = useState(0);
  const [campaignList, setCampaignList] = useState([]);
  const [campaignName, setCampaignName] = useState();
  const [loggedInUser] = useState(
    JSON.parse(localStorage.getItem("loginData"))?.uuid
  );
  const [leadSize, setLeadSize] = useState(false);
  const [loader, setLoader] = useState(false);
  const divRef = useRef();

  const navigate = useNavigate();

  const showCreateCampaign = () => {
    setCreateCampaign(!createCampaign);
  };
  function handleClick(event) {
    event.preventDefault();
  }
  const handleCampaignName = (e) => {
    setCampaignName(e.target.value);
  };

  const handleSearch = (e) => {
    let { value } = e.target;
    setPagination(1);
    setSearchValue(value, () => setPagination(1));
  };
  const handlePagination = (e, pageNumber) => {
    setPagination(pageNumber);
  };
  const handleSort = (key) => {
    let newOrder = sortObj?.sortOrder === "-1" ? "1" : "-1";
    setSortObj({ sortKey: key, sortOrder: newOrder });
  };

  let totalPages = Number((cycleTotalCount / itemsPerPage).toFixed(0));
  if (totalPages * itemsPerPage < cycleTotalCount) totalPages = totalPages + 1;

  const handleUpdate = (id) => {
    if (id) {
      navigate("/authorised/update/" + id);
    } else {
      navigate("/authorised/update");
    }
  };

  const fetchCampaignList = async (scrollFlag = false) => {
    let params = {
      pageNo: pageNo - 1,
      count: itemsPerPage,
      ...sortObj,
      search,
      loggedInUser,
    };
    setLoader(false);
    setLeadSize(false);
    getCampaignList(params)
      .then((res) => {
        let list = res?.result;
        setCycleTotalCount(res?.totalCount);
        setCampaignList(list);
        setLoader(true);
        if (scrollFlag) {
          divRef.current.scrollIntoView();
        }
        if (list.length > 0) {
          setLeadSize(true);
        } else {
          setLeadSize(false);
        }
      })
      .catch((err) => {
        console.log(err, "..error");
        setLoader(true);
        setLeadSize(false);
      });
  };

  const breadcrumbs = [
    <Link
      underline="hover"
      key="1"
      color="inherit"
      href="/"
      onClick={handleClick}
    >
      Dummy
    </Link>,

    <Typography key="2" color="text.primary">
      Lorem Ipsum
    </Typography>,
  ];

  useEffect(() => {
    fetchCampaignList();
  }, [search, sortObj, pageNo, itemsPerPage, loggedInUser]);

  return (
    <>
      <Page
        title="Extramarks | Campaign Management"
        className="main-container compaignManagenentPage datasets_container"
      >
        <div>
          <Grid container spacing={2} sx={{ p: "16px" }}>
            <Grid item xs={6}>
              <Grid className={`${classes.cusCard} ${classes.RevenueCard}`}>
                <Revenue />
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <Grid className={` ${classes.cusCard} ${classes.RevenueCard}`}>
                <Slider />
              </Grid>
            </Grid>
          </Grid>
          <div>
            {createCampaign && (
              <div className="createCampaign">
                <CreateCampaign
                  fetchCampaignList={fetchCampaignList}
                  showCreateCampaign={showCreateCampaign}
                />
              </div>
            )}

            {!createCampaign && (
              <div style={{ textAlign: "right" }}>
                <div className="createNew_button" onClick={showCreateCampaign}>
                  Create New
                </div>
              </div>
            )}
          </div>

          <div className="tableCardContainer">
            <div ref={divRef}>
              <div className="contaienr">
                <h4 className="heading">Manage Campaign</h4>
              </div>
              {(leadSize || search) && (
                <TextField
                  className={`inputRounded search-input`}
                  type="search"
                  placeholder="Search By Campaign Name"
                  onChange={handleSearch}
                  InputLabelProps={{ style: { ...{ top: `${-7}px` } } }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <img src={SearchIcon} alt="" />
                      </InputAdornment>
                    ),
                  }}
                />
              )}

              {loader ? (
                leadSize ? (
                  <>
                    <CampaignTable
                      handleUpdate={handleUpdate}
                      list={campaignList}
                      pageNo={pageNo}
                      itemsPerPage={itemsPerPage}
                      search={search}
                      handleSort={handleSort}
                      sortObj={sortObj}
                    />

                    <div className="center cm_pagination">
                      <Pagination
                        count={totalPages}
                        variant="outlined"
                        color="primary"
                        onChange={handlePagination}
                        page={pageNo}
                      />
                    </div>
                  </>
                ) : (
                  <div
                    style={{
                      height: "50vh",
                      width: "90vw",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontWeight: 600,
                      fontSize: 18,
                    }}
                  >
                    <p>No Data Available</p>
                  </div>
                )
              ) : (
                <div
                  style={{
                    height: "50vh",
                    width: "90vw",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {DisplayLoader()}
                </div>
              )}
            </div>
          </div>
        </div>
      </Page>
    </>
  );
}
