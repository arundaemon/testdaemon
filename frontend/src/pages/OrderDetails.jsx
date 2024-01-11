import React from 'react';
import Page from "../components/Page";
import { Grid, Typography } from "@mui/material";
import { makeStyles } from '@mui/styles';
import CustomerDetails from "../components/orderDetails/CustomerDetails";
import StatusBar from "../components/orderDetails/StatusBar";
import History from "../components/orderDetails/History";
import ProductDetails from "../components/orderDetails/ProductDetails";
import PaymentDetails from "../components/orderDetails/PaymentDetails";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import BredArrow from '../assets/image/bredArrow.svg'
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  prevPointer: {
    fontSize: "14px",
    textDecoration: "none",
    cursor: "pointer",
  },
  activePointer: {
    fontSize: "14px",
    fontWeight: "600"
  },
  cusCard: {
    padding: "2px",
    boxShadow: "0px 0px 8px #00000029",
    borderRadius: "8px",
    marginTop: "16px",
  },
  RevenueCard: {
    padding: "0px",
    overflow: "hidden",
  },
  subTitle: {
    fontSize: "14px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#000000",
  },
  selectSection: {
    borderRadius: "0",
    paddingBottom: "0",
    paddingTop: "1px"
  },
  borderRight: {
    borderRight: "1px solid #DEDEDE",
  },
  leftSection: {
    paddingTop: "8px !important",
    [theme.breakpoints.down('md')]: {
      paddingTop: "60px !important"
    }
  },
  statusBarMobile: {
    marginTop: "0px",
    [theme.breakpoints.up('md')]: {
      display: "none",
    }
  },
  statusBarWeb: {
    marginTop: "0px",
    [theme.breakpoints.down('md')]: {
      display: "none",
    }
  },
  mt0_web: {
    [theme.breakpoints.up('md')]: {
      marginTop: "0px !important",
    }
  }
}));

export default function OrderDetails() {
  const classes = useStyles();

  const breadcrumbs = [
    <Link
      underline="hover"
      key="1"
      color="inherit"
      to='/authorised/lead-Assignment'
      className={classes.breadcrumbsClass}
    >
      Listing
    </Link>,
    <Typography key="3" color="text.primary" fontWeight="600" fontSize="14px">
      Purchases
    </Typography>
  ];

  return (
    <>
      <Page title="Order Details">
        <Grid sx={{ px: "16px", pb: "12px" }}>
          <Breadcrumbs className={`listing-breadcrumbs ${classes.breadcrumbsBar}`}
            separator={<img src={BredArrow} />}
            aria-label="breadcrumb"
          >
            {breadcrumbs}
          </Breadcrumbs>
          <Grid container spacing={2} sx={{ mt: "0px" }}>
            <Grid item xs={12} md={4} className={classes.leftSection}>
              {/* StatusBar for Mobile */}
              <Grid className={`${classes.cusCard} ${classes.statusBarMobile}`}>
                <StatusBar />
              </Grid>
              <Grid className={`${classes.cusCard} ${classes.mt0_web}`}>
                <CustomerDetails />
              </Grid>
              <Grid className={classes.cusCard}>
                <History />
              </Grid>
            </Grid>
            <Grid item xs={12} md={8} sx={{ pt: "8px !important" }}>
              {/* StatusBar for Web */}
              <Grid className={`${classes.cusCard} ${classes.statusBarWeb}`}>
                <StatusBar />
              </Grid>
              <Grid className={classes.cusCard}>
                <ProductDetails />
              </Grid>
              <Grid className={classes.cusCard}>
                <PaymentDetails />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Page>
    </>
  )
}
