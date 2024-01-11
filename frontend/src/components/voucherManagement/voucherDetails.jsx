import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { Box, Breadcrumbs, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import BredArrow from '../../assets/image/bredArrow.svg';
import { voucherViewDetails } from "../../config/services/packageBundle";
import { getSchoolBySchoolCode } from "../../config/services/school";
import { useStyles } from "../../css/Quotation-css";
import { DisplayLoader } from "../../helper/Loader";
import { getUserData } from "../../helper/randomFunction/localStorage";
import Page from "../Page";
import VoucherDetailsList from "./voucherDetailsTable";


export const VoucherDetails = () => {
    const classes = useStyles();
    const location = useLocation();
    const [loader, setLoader] = useState(false);
    const [schoolName, setSchoolName] = useState("");
    const [voucherDetails, setVoucherDetails] = useState({})
    const loginData = getUserData('loginData')
    const uuid = loginData?.uuid
    let { data } = location?.state ? location?.state : {};
    let schoolCodeList = data?.school_code





    const breadcrumbs = [
        <Link
            underline="hover"
            key="1"
            color="inherit"
            to="/authorised/voucher-list"
            className={classes.breadcrumbsClass}
        >
            Voucher Management
        </Link>,
        <Typography key="3" color="text.primary" fontWeight="600" fontSize="14px">
            Voucher Details
        </Typography>,
    ];


    const getVoucherDetails = async () => {
        let params = {
            uuid: uuid,
            voucher_status: [data?.voucher_status],
            voucher_auto_id: data?.voucher_auto_id,
            crn_drn_for: "SW"
        }
        await voucherViewDetails(params)
            .then((res) => {
                if (res) {
                    setVoucherDetails(res?.data?.voucher_details)
                    setLoader(true)
                }
                else {
                    setVoucherDetails({})
                }
            })
            .catch((err) => console.error(err));
    };


    const getSchoolDetails = async () => {
        await getSchoolBySchoolCode(schoolCodeList)
            .then((res) => {
                let details = res?.result?.schoolName;
                setSchoolName(details)
            })
            .catch((err) => console.error(err));
    };

    useEffect(() => {
        getSchoolDetails()
        getVoucherDetails()
    }, []);





    return (

        <div className="listing-containerPage">
            <Breadcrumbs className={`listing-breadcrumbs ${classes.breadcrumbsBar}`}
                separator={<img src={BredArrow} />}
                aria-label="breadcrumb"
            >
                {breadcrumbs}
            </Breadcrumbs>


            <Page
                title="Extramarks | Voucher Details"
                className="main-container myLeadPage datasets_container"
            >
                {!loader ?

                    <div className={classes.loader}>
                        {DisplayLoader()}
                    </div>

                    :
                    <>
                        <Grid className={classes.cusCard}>


                            <Box
                                sx={{
                                    // backgroundColor: "#E2EBFF",
                                    padding: "30px 40px",
                                    borderRadius: "4px",
                                }}
                            >
                                <Box sx={{ padding: "25px 0", marginTop: "-44px", marginBottom: '10px' }}>
                                    <h3>VOUCHER DETAILS</h3>
                                </Box>

                                <Grid container spacing={2}>
                                    <Grid item xs={6} sm={3}>
                                        <Typography className={classes.subTitle}>
                                            <b>Voucher Type :</b>
                                        </Typography>
                                        <div className={classes.subTitleNew} sx={{ mb: 1.5 }}>
                                            {voucherDetails?.voucher_type || "N/A"}
                                        </div>
                                    </Grid>
                                    <Grid item xs={6} sm={3}>
                                        <Typography className={classes.subTitle}>
                                            <b>Voucher Based :</b>
                                        </Typography>
                                        <div className={classes.subTitleNew} sx={{ mb: 1.5 }}>
                                            {voucherDetails?.voucher_based || "N/A"}

                                        </div>
                                    </Grid>
                                    <Grid item xs={6} sm={3}>
                                        <Typography className={classes.subTitle}>
                                            <b>Product :</b>
                                        </Typography>
                                        <div className={classes.subTitleNew} sx={{ mb: 1.5 }}>
                                            {voucherDetails?.product_name || "N/A"}

                                        </div>
                                    </Grid>
                                    <Grid item xs={6} sm={3}>
                                        <Typography className={classes.subTitle}>
                                            <b>School Name :</b>
                                        </Typography>
                                        <div className={classes.subTitleNew} sx={{ mb: 1.5 }}>
                                            {schoolName || "N/A"}

                                        </div>
                                    </Grid>
                                    <Grid item xs={6} sm={3}>
                                        <Typography className={classes.subTitle}>
                                            <b>Amount :</b>
                                        </Typography>
                                        <div className={classes.subTitleNew} sx={{ mb: 1.5 }}>
                                            {voucherDetails?.invoice_total_amount !== null ? (
                                                <>
                                                    <CurrencyRupeeIcon
                                                        sx={{
                                                            position: "relative",
                                                            top: "2px",
                                                            fontSize: "16px",
                                                        }}
                                                    />
                                                    {Number(voucherDetails?.invoice_total_amount)?.toLocaleString("en-IN", {
                                                        maximumFractionDigits: 2,
                                                    })}
                                                    / -{" "}
                                                </>
                                            ) : (
                                                "N/A"
                                            )}
                                        </div>
                                    </Grid>
                                    <Grid item xs={6} sm={3}>
                                        <Typography className={classes.subTitle}>
                                            <b>Deposit Date</b>
                                        </Typography>
                                        <div className={classes.subTitleNew} sx={{ mb: 1.5 }}>
                                            {voucherDetails?.deposit_date || "N/A"}
                                        </div>
                                    </Grid>
                                    <Grid item xs={6} sm={3}>
                                        <Typography className={classes.subTitle}>
                                            <b>Type:</b>
                                        </Typography>
                                        <div className={classes.subTitleNew} sx={{ mb: 1.5 }}>
                                            {voucherDetails?.type || "N/A"}
                                        </div>
                                    </Grid>

                                    <Grid item xs={6} sm={3}>
                                        <Typography className={classes.subTitle}>
                                            <b>Comment:</b>
                                        </Typography>
                                        <div className={classes.subTitleNew} sx={{ mb: 1.5 }}>
                                            {voucherDetails?.remark_text || "N/A"}
                                        </div>
                                    </Grid>


                                </Grid>
                            </Box>


                            <VoucherDetailsList list={voucherDetails?.credit_debit_details} voucherDetails={voucherDetails} />

                        </Grid>

                    </>
                }
            </Page>
        </div>
    );
};
