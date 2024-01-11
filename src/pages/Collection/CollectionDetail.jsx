import { Box, Breadcrumbs, Typography } from "@mui/material";
import Page from "../../components/Page";
import { useStyles } from "../../css/Collection-css";
import { CollectionList } from "../../components/Collection Process/CollectionDetail";
import { useEffect, useState } from "react";
import { getUserData } from "../../helper/randomFunction/localStorage";
import { getpendingCollectionDetail } from "../../config/services/packageBundle";
import { Link, useParams } from "react-router-dom";
import BredArrow from "../../assets/image/bredArrow.svg";
import { getSchoolsByCode } from "../../config/services/school";

const CollectionDetail = () => {
  const classes = useStyles();
  const loginData = getUserData("loginData");
  const uuid = loginData?.uuid;
  const [lastPage, setLastPage] = useState(false);
  const [pageNo, setPagination] = useState(1);
  const [loader, setLoading] = useState(false);
  const [itemsPerPage] = useState(10);
  const [pendingCollectionList, setPendingCollectionList] = useState([]);
  const [search, setSearchValue] = useState("");
  const [searchBy, setSearchBy] = useState("dsc_date");
  const { schoolCode } = useParams();
  const [schoolDetail, setSchoolDetails] = useState(null);

  const fetchPendingTask = () => {
    let params = {
      uuid,
      // page_offset: pageNo - 1,
      // page_size: itemsPerPage,
      search_by: "school_code",
      search_val: schoolCode,
    };
    setLoading(true);
    getpendingCollectionDetail(params)
      .then((res) => {
        setLoading(false);
        if (res?.data) {
          let data = res?.data;
          setPendingCollectionList(data);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.error(err, "Error while fetching Pending Tasks");
      });
  };

  const getSchoolDetails = () => {
    let params = {
      schoolCodeList: [schoolCode],
    };
    getSchoolsByCode(params)
      .then((res) => {
        let details = res?.result;
        setSchoolDetails(details);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (schoolCode) getSchoolDetails()
  }, [schoolCode]);

  useEffect(() => {
    if (schoolCode) fetchPendingTask();
  }, [pageNo, itemsPerPage, search, schoolCode]);

  const breadcrumbs = [
    <Link
      underline="hover"
      key="1"
      color="inherit"
      to="/authorised/pending-collection"
      className={classes.breadcrumbsClass}
    >
      Pending Collection
    </Link>,
    <Typography key="3" color="text.primary" fontWeight="600" fontSize="14px">
      Detail
    </Typography>,
  ];

  return (
    <>
      <Page
        title="Collection List | Extramarks"
        className="crm-page-wrapper"
      >
        <Box >
          <CollectionList data={pendingCollectionList} schoolDetail={schoolDetail}/>
        </Box>
      </Page>
    </>
  );
};

export default CollectionDetail;
