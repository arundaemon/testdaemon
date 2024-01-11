import Page from "../../components/Page";
import { useStyles } from "../../css/SiteSurvey-css";
import {
  Container,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import SSRActivityTable from "./SiteSurveyActivityTable";
import { useEffect, useState } from "react";
import SearchIcon from "../../assets/icons/icon_search.svg";
import _ from "lodash";
import { getActivitiesByType } from "../../config/services/bdeActivities";
import Pagination from "../Pagination";
import { DisplayLoader } from "../../helper/Loader";
import { siteSurveyConstant } from "../../constants/general";
import { DecryptData } from "../../utils/encryptDecrypt";
import { getLoggedInRole } from "../../utils/utils";
import QualityActivityTable from "./QualityActivity";

const HardwareQCList = () => {
  const classes = useStyles();
  const [pageNo, setPagination] = useState(1);
  const [itemsPerPage, setItemPerPage] = useState(10);
  const [search, setSearchValue] = useState("");
  const [lastPage, setLastPage] = useState(false);
  const [loader, setLoading] = useState(true);
  const [userActivity, setUserActivity] = useState([]);
  const userRole = getLoggedInRole();

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

  const getSSRActivity = async () => {
    let childRoleNames = DecryptData(localStorage?.getItem("childRoles"));
    childRoleNames = childRoleNames?.map((roleObj) => roleObj?.roleName);
    childRoleNames.push(userRole);

    let params = {
      meetingStatus: siteSurveyConstant?.isMeeting,
      customerResponse: [
        siteSurveyConstant?.isQCCustomerResponse,
      ],
      childRoleNames: [userRole],
      page_offset: pageNo - 1,
      page_size: itemsPerPage,
      search: search,
      status: [1],
      qcFlag: true
    };
    setLoading(true);
    setLastPage(false);
    try {
      let res = await getActivitiesByType(params);
      if (res?.result?.length < itemsPerPage) {
        setLastPage(true);
        setLoading(false);
      }
      if (res?.result?.length) {
        let data = res?.result;
        setUserActivity(data);
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  };

  useEffect(() => {
    getSSRActivity();
  }, [pageNo, itemsPerPage, search]);

  return (
    <>
      <Page
        title="Extramarks | Site Survey Activity"
        className="main-container myLeadPage datasets_container mt-0"
      >
        <Grid className={classes.cusCard}>
          <Grid item md={12} xs={12} py={4}>
            {/* <Typography className={classes.heading}>QC Tasks</Typography> */}
            <TextField
              style={{ padding: "20px 0" }}
              className={`inputRounded search-input width-auto`}
              type="search"
              placeholder="Search"
              // value={searchTextField}
              onChange={handleSearch}
              InputLabelProps={{
                style: { ...{ top: `${-7}px`, left: "10px" } },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="end">
                    <img src={SearchIcon} alt="" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          {!loader ? (
            userActivity?.length > 0 ? (
              <Container className="table_max_width px-0">
                <QualityActivityTable data={userActivity} />

                <div className="center cm_pagination">
                  <Pagination
                    pageNo={pageNo}
                    setPagination={setPagination}
                    lastPage={lastPage}
                  />
                </div>
              </Container>
            ) : (
              <div className={classes.noData}>
                <p>No Data</p>
              </div>
            )
          ) : (
            <div className={classes.loader}>{DisplayLoader()}</div>
          )}
        </Grid>
      </Page>
    </>
  );
};

export default HardwareQCList;
