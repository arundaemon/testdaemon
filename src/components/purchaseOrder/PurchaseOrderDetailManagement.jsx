import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Breadcrumbs, Grid, Typography } from '@mui/material';
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import { makeStyles } from "@mui/styles";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import BredArrow from '../../assets/image/bredArrow.svg';
import QuotationDetailForm from '../../pages/Quotation/QuotationDetailForm';
import Page from "../Page";
import PurchaseOrderDetail from './PurchaseOrderDetail';
import CubeDataset from "../../config/interface";
import IconBreadcrumbArrow from "./../../assets/icons/icon-breadcrumb-arrow.svg";
import { ReactComponent as IconDropdown } from "./../../assets/icons/icon-dropdown-2.svg";

const useStyles = makeStyles((theme) => ({
    cusCard: {
        padding: "18px",
        boxShadow: "0px 0px 8px #00000029",
        borderRadius: "8px",
        margin: "0.5rem 1rem",
    },
    title: {
        fontSize: "16px",
        fontWeight: "600",
        lineHeight: "16px",
    },
    label: {
        fontSize: "14px",
        fontWeight: "600",
        marginBottom: "6px",
    },
    inputStyle: {
        fontSize: "1rem",
        padding: "8.8px",
        width: "100%",
        borderRadius: "4px",
        border: "1px solid #DEDEDE",
    },
    btnSection: {
        padding: "1rem 1rem 2rem 1rem",
        textAlign: "right",
    },
    submitBtn: {
        backgroundColor: "#f45e29",
        border: "1px solid #f45e29",
        borderRadius: "4px !important",
        color: "#ffffff !important",
        padding: "6px 16px !important",
        "&:hover": {
            color: "#f45e29 !important",
        },
    },
    rowBtn: {
        position: "absolute",
        right: "-1.7rem",
        top: "2.1rem",
        width: "1.2rem !important",
        cursor: "pointer",
        opacity: "0.3",
        "&:hover": {
            opacity: "0.6",
        },
    },
    CstmBoxGrid: {
        padding: "0 !important",
        position: "relative",
    },
}));

const PurchaseOrderDetailManagement = () => {
    const classes = useStyles();
    let location = useLocation();
    const data = location.state?.data;
    const [activeAccordion, setActiveAccordion] = useState(0);

    const accordionData = [
        {
            title: "Quotation Details",
            detail: <QuotationDetailForm isQuotationID={data?.quotationCode} />,
        },
        {
            title: "Purchase Order Detail",
            detail: <PurchaseOrderDetail code={data?.purchaseOrderCode} />
        },

    ];

    const breadcrumbs = [
        <Link
            underline="hover"
            key="1"
            color="inherit"
            to="/authorised/purchase-order-list"
            className={classes.breadcrumbsClass}
        >
            Listing
        </Link>,
        <Typography key="3" color="text.primary" fontWeight="600" fontSize="14px">
            Purchase Order Detail
        </Typography>,
    ];





    return (
        <Page
            title="Purchase Order Detail | Extramarks"
            className="crm-page-wrapper crm-page-listing-container crm-page-purchase-order-details-wrapper"
        >
            <Breadcrumbs
                className="crm-breadcrumbs"
                separator={<img src={IconBreadcrumbArrow} />}
                aria-label="breadcrumbs"
            >
                <Link
                underline="hover"
                key="1"
                color="inherit"
                to={`/authorised/purchase-order-list`}
                className="crm-breadcrumbs-item breadcrumb-link"
                >
                Listing
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
                <div className={classes.accordianPadding}>
                    {accordionData?.map((data, index) => {
                        return (
                            <Accordion
                                key={index}
                                className="cm_collapsable crm-page-accordion-container"
                                expanded={activeAccordion === index}
                                onChange={(prev) => {
                                    setActiveAccordion(index);
                                }}
                            >
                                <AccordionSummary
                                    expandIcon={<IconDropdown className="" />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                    className="table-header"
                                >
                                    <Typography style={{ fontSize: 14, fontWeight: 600 }}>
                                        {data?.title}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails className="listing-accordion-details">
                                    {data?.detail}
                                </AccordionDetails>
                            </Accordion>
                        );
                    })}
                </div>
            </div>
        </Page>
        

    )
}

export default PurchaseOrderDetailManagement
