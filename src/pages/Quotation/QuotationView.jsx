import { Link, useLocation, useParams } from "react-router-dom";
import QuotationDetailForm from "./QuotationDetailForm";
import { useStyles } from "../../css/Quotation-css";
import Page from "../../components/Page";
import { DisplayLoader } from "../../helper/Loader";
import { Breadcrumbs, Typography } from "@mui/material";
import BredArrow from "../../assets/image/bredArrow.svg";
import IconBreadcrumbArrow from './../../assets/icons/icon-breadcrumb-arrow.svg';

const QuotationView = () => {
  const classes = useStyles();
  const { id } = useParams();

  const location = useLocation();
  const { isQuotaion, isQuoteSchoolDetail } = location?.state
    ? location?.state
    : {};

  const breadcrumbs = [
    <Link
      underline="hover"
      key="1"
      color="inherit"
      to="/authorised/quotation-list"
      className={classes.breadcrumbsClass}
    >
     Quotation List
    </Link>,
    <Typography key="3" color="text.primary" fontWeight="600" fontSize="14px">
      Detail
    </Typography>,
  ];

  return (
    <>
      <Page
        title="Quotation View | Extramarks"
        className="crm-page-wrapper crm-page-quotation"
      >
       
        <Breadcrumbs className='crm-breadcrumbs' separator={<img src={IconBreadcrumbArrow} />} aria-label="breadcrumbs" >
          <Link underline="hover" key="1" color="inherit" to="/authorised/quotation-list" className='crm-breadcrumbs-item breadcrumb-link' >
          Quotation List
          </Link>
          <Typography key="2" component="span"  className='crm-breadcrumbs-item breadcrumb-active'> Detail </Typography>
      </Breadcrumbs>
        <div >
          {id && isQuotaion && isQuoteSchoolDetail ? (
            <QuotationDetailForm
              isQuotationID={id}
              isQuotaion={isQuotaion}
              isQuoteSchoolDetail={isQuoteSchoolDetail}
            />
          ) : (
            <div className={classes.loader}>{DisplayLoader()}</div>
          )}
        </div>
      </Page>
    </>
  );
};

export default QuotationView;
