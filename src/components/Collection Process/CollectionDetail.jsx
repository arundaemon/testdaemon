import {
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useStyles } from "../../css/Collection-css";
import Page from "../Page";
import { CustomTable } from "./CommonTable";
import { CurrencySymbol } from "../../constants/general";

const headerOption = [
  "S.NO",
  "Invoice Number",
  "Product",
  "Invoice Amount",
  "Late Fees",
  "OutStanding Amount",
  "Collection Date",
  "Collection Amount",
  "Collected Amount",
  "Due Amount",
  "Actual Collection Date",
];

export const CollectionList = ({ data, schoolDetail }) => {
  const classes = useStyles();

  return (
    <>
    <Typography component="h2" style={{marginBottom: '20px'}}>Detailed View</Typography>
      {data?.pending_collection_details?.length > 0 ? (
        <>
          
          <Grid container spacing={2.5} mb={3}>
            <Grid item xs={12} md={3} className='crm-page-payment-adjusted-form-detail-item'>
                <Typography component="h6">Total Invoice</Typography>
                <Typography component="h4" >
                {CurrencySymbol?.India + Number(
                  data?.total_invoice_amount
                )?.toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                })}/-
              </Typography>
            </Grid>
            <Grid  item xs={12} md={3} className='crm-page-payment-adjusted-form-detail-item'> 
                <Typography component="h6">Total Outstanding</Typography>
                <Typography component="h4" >
                  {CurrencySymbol?.India + Number(
                    data?.total_outstanding_amount
                  )?.toLocaleString("en-IN", {
                    maximumFractionDigits: 2,
                  })}/-
                  </Typography>
            </Grid>
            <Grid  item xs={12} md={3} className='crm-page-payment-adjusted-form-detail-item'>
                <Typography component="h6">Total Contract Value</Typography>
                <Typography component="h4" >
                  {CurrencySymbol?.India + Number(
                    0
                  )?.toLocaleString("en-IN", {
                    maximumFractionDigits: 2,
                  })}/-
                  </Typography>
            </Grid>
          </Grid>

          <Box >
            <CustomTable
              header={headerOption}
              data={data}
              schoolDetail={schoolDetail}
            />
          </Box>

        </>
      ) : (
        <div className={classes.noData}>
          <p>No Data</p>
        </div>
      )}
    </>
  );
};
