import { Box, Breadcrumbs, Typography } from "@mui/material";
import Page from "../../components/Page";
import { useStyles } from "../../css/Collection-css";
import { useEffect, useState } from "react";
import { getUserData } from "../../helper/randomFunction/localStorage";
import { getschoolLedgerDetails } from "../../config/services/packageBundle";
import { Link, useParams } from "react-router-dom";
import BredArrow from "../../assets/image/bredArrow.svg";
import { SchoolInvoiceDetail } from "./schoolInvoiceDetail";
import { InvoiceDetailBox } from "./InvoiceDetailBox";

const SchoolLedgerDetail = () => {
  const classes = useStyles();
  const loginData = getUserData("loginData");
  const uuid = loginData?.uuid;
  const [lastPage, setLastPage] = useState(false);
  const [pageNo, setPagination] = useState(1);
  const [loader, setLoading] = useState(false);
  const [itemsPerPage] = useState(10);
  const [schoolInvoiceList, setSchoolInvoiceDetail] = useState([]);
  const [search, setSearchValue] = useState("");
  const [searchBy, setSearchBy] = useState("dsc_date");
  const { schoolCode } = useParams();

  const fetchPendingTask = () => {
    let params = {
      uuid,
      // page_offset: pageNo - 1,
      // page_size: itemsPerPage,
      school_code: schoolCode,
      product_code: [],
    };
    setLoading(true);
    getschoolLedgerDetails(params)
      .then((res) => {
        setLoading(false);
        if (res?.data) {
          let data = res?.data;
          setSchoolInvoiceDetail(data);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.error(err, "Error while fetching Pending Tasks");
      });
  };

  useEffect(() => {
    if (schoolCode) fetchPendingTask();
  }, [pageNo, itemsPerPage, search, schoolCode]);

  const breadcrumbs = [
    <Link
      underline="hover"
      key="1"
      color="inherit"
      to="/authorised/ledger-list"
      className={classes.breadcrumbsClass}
    >
      Ledger List
    </Link>,
    <Typography key="3" color="text.primary" fontWeight="600" fontSize="14px">
      Detail
    </Typography>,
  ];

  return (
    <>
      <Page
        title="Extramarks | Collection List"
        className="main-container myLeadPage datasets_container"
      >
        <Breadcrumbs
          className={`listing-breadcrumbs ${classes.breadcrumbsBar}`}
          separator={<img src={BredArrow} />}
          aria-label="breadcrumb"
        >
          {breadcrumbs}
        </Breadcrumbs>

        <Box sx={{px: 2, py: 2}}>
          <InvoiceDetailBox schoolCode={schoolCode} data={schoolInvoiceList} />
        </Box>

        <Box className={classes.cusCard}>
          <SchoolInvoiceDetail
            data={schoolInvoiceList}
            schoolCode={schoolCode}
          />
        </Box>
      </Page>
    </>
  );
};

export default SchoolLedgerDetail;
