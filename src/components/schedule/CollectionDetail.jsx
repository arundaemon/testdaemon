import { memo } from "react";
import {
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import moment from "moment";
import useMediaQuery from "@mui/material/useMediaQuery";
import { ReactComponent as DownloadIcon} from '../../assets/image/downloadIcon.svg'

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
});

const CollectionDetail = () => {
  const invoiceSchedule = useSelector((state) => state.invoiceSchedule);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const collectionScheduleMap = {
    1: "Monthly",
    2: "Quarterly",
    3: "Half Yearly",
    4: "Yearly"
  }
  const statusMap = {
    1: 'Active'
  }

  // console.log(invoiceSchedule, '--------');
  return (
    <Grid className='crm-schedule-list-container crm-schedule-collection-detail-invoice'>
      <Typography  component={"h1"} className='crm-page-heading'>Invoice Schedule</Typography>
      {
        !isMobile
          ? <TableContainer className="crm-table-container crm-table-md">
              <Table>
                <TableHead className="crm-table-md">
                  <TableRow key={"schedule-header"}>
                    <TableCell>Invoice Months</TableCell>
                    <TableCell>Invoice Amount</TableCell>
                    <TableCell>Invoice Status</TableCell>
                    <TableCell>Collection Schedule</TableCell>
                    <TableCell align="center">Collection Months</TableCell>
                    <TableCell>Collection Amount</TableCell>
                    <TableCell>Collection Status</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {invoiceSchedule.scheduleObj &&
                    invoiceSchedule.scheduleObj.invoice_collection_schedule_details &&
                    invoiceSchedule.scheduleObj.invoice_collection_schedule_details
                      .invoice_schedule_month_details &&
                    invoiceSchedule.scheduleObj.invoice_collection_schedule_details.invoice_schedule_month_details.map(
                      (obj, index) => (
                        <>
                          <TableRow key={`${obj.schedule_from}-${index}`}>
                            <TableCell>
                              {`${moment(obj.schedule_from).format(
                                "DD MMM, YYYY"
                              )} to ${moment(obj.schedule_to).format(
                                "DD MMM, YYYY"
                              )}`}
                            </TableCell>
                            <TableCell>
                              {currencyFormatter.format(obj.schedule_amount)}
                            </TableCell>
                            <TableCell>{statusMap[obj.schedule_status]}</TableCell>
                            <TableCell >
                              {obj.collection_schedule_month_details &&
                                obj.collection_schedule_month_details.length > 0 &&
                                collectionScheduleMap[obj.collection_schedule_month_details[0]
                                  .collection_schedule_frequency_id]}
                            </TableCell>
                            <TableCell align="right">
                              {obj.collection_schedule_month_details &&
                                obj.collection_schedule_month_details.length > 0 &&
                                `${moment(
                                  obj.collection_schedule_month_details[0]
                                    .schedule_from
                                ).format("DD MMM, YYYY")} to ${moment(
                                  obj.collection_schedule_month_details[0].schedule_to
                                ).format("DD MMM, YYYY")}`}
                            </TableCell>
                            <TableCell >
                              {obj.collection_schedule_month_details &&
                                obj.collection_schedule_month_details.length > 0 &&
                                currencyFormatter.format(obj.collection_schedule_month_details[0].schedule_amount)}
                            </TableCell>
                            <TableCell >
                              {obj.collection_schedule_month_details &&
                                obj.collection_schedule_month_details.length > 0 &&
                                statusMap[obj.collection_schedule_month_details[0]
                                  .schedule_status]}
                            </TableCell>
                            <TableCell >
                              { obj.collection_schedule_month_details &&
                                obj.collection_schedule_month_details.length > 0 &&
                                obj.collection_schedule_month_details[0].invoice_file_url && 
                                obj.collection_schedule_month_details[0].invoice_file_url !== "" ? 
                                <DownloadIcon style={{
                                  cursor: 'pointer',
                                  width: '20px',
                                  height: '20px',
                                }}/>  : ' '}
                            </TableCell>
                          </TableRow>
                          {obj.collection_schedule_month_details &&
                            obj.collection_schedule_month_details.length > 1 &&
                            obj.collection_schedule_month_details.map(
                              (collectionObj, childIndex) => childIndex > 0 && 
                              <TableRow key={`${collectionObj.schedule_from}-child-${childIndex}`}>
                                  <TableCell colSpan={5} align="right">
                                      {(`${moment(collectionObj.schedule_from).format('DD MMM, YYYY')} to ${moment(collectionObj.schedule_to).format('DD MMM, YYYY')}`)}
                                  </TableCell>
                                  <TableCell>
                                      {currencyFormatter.format(collectionObj.schedule_amount)}
                                  </TableCell>
                                  <TableCell>
                                      {statusMap[collectionObj.schedule_status]}
                                  </TableCell>
                                  <TableCell>
                                      { collectionObj.invoice_file_url  && 
                                        collectionObj.invoice_file_url !== "" ? 
                                        <DownloadIcon style={{
                                          cursor: 'pointer',
                                          width: '20px',
                                          height: '20px',
                                        }}/>  : ' '}
                                  </TableCell>
                              </TableRow>
                            )}
                        </>
                      )
                    )}
                </TableBody>
              </Table>
            </TableContainer>


          : <Box className="crm-schedule-collection-detail-invoice-list">
               {invoiceSchedule.scheduleObj &&
                    invoiceSchedule.scheduleObj.invoice_collection_schedule_details &&
                    invoiceSchedule.scheduleObj.invoice_collection_schedule_details
                      .invoice_schedule_month_details &&
                    invoiceSchedule.scheduleObj.invoice_collection_schedule_details.invoice_schedule_month_details.map(
                      (obj, index) => (
                        <Box className="crm-schedule-collection-detail-invoice-listitem">
                          <Box className="crm-schedule-collection-detail-invoice-listitem-info">
                            <Typography component={"h3"}>Invoice Months</Typography>
                            <Typography component={"p"}>
                              {`${moment(obj.schedule_from).format(
                                  "DD MMM, YYYY"
                                )} to ${moment(obj.schedule_to).format(
                                  "DD MMM, YYYY"
                                )}`}
                            </Typography>
                          </Box>
                          <Box className="crm-schedule-collection-detail-invoice-listitem-info">
                            <Typography component={"h3"}>Invoice Amount	</Typography>
                            <Typography component={"p"}>{currencyFormatter.format(obj.schedule_amount)}</Typography>
                          </Box>
                          <Box className="crm-schedule-collection-detail-invoice-listitem-info">
                            <Typography component={"h3"}>Invoice Status	</Typography>
                            <Typography component={"p"}>{obj.schedule_status}</Typography>
                          </Box>

                          <Box className="crm-schedule-collection-detail-invoice-listitem-info">
                            <Typography component={"h3"}>Collection Schedule	</Typography>
                            <Typography component={"p"}>
                              {obj.collection_schedule_month_details &&
                                  obj.collection_schedule_month_details.length > 0 &&
                                  [obj.collection_schedule_month_details[0].collection_schedule_frequency_id]}
                            </Typography>
                          </Box>
                          <Box className="crm-schedule-collection-detail-invoice-listitem-info">
                            <Typography component={"h3"}>Collection Months	</Typography>
                            <Typography component={"p"}>
                              {obj.collection_schedule_month_details &&
                                  obj.collection_schedule_month_details.length > 0 &&
                                  `${moment(
                                    obj.collection_schedule_month_details[0]
                                      .schedule_from
                                  ).format("DD MMM, YYYY")} to ${moment(
                                    obj.collection_schedule_month_details[0].schedule_to
                                  ).format("DD MMM, YYYY")}`}
                            </Typography>
                          </Box>
                          <Box className="crm-schedule-collection-detail-invoice-listitem-info">
                            <Typography component={"h3"}>Collection Amount	</Typography>
                            <Typography component={"p"}>
                              {obj.collection_schedule_month_details &&
                                  obj.collection_schedule_month_details.length > 0 &&
                                  obj.collection_schedule_month_details[0].schedule_amount &&
                                  currencyFormatter.format(obj.collection_schedule_month_details[0].schedule_amount)}
                            </Typography>
                          </Box>
                          <Box className="crm-schedule-collection-detail-invoice-listitem-info">
                            <Typography component={"h3"}>Collection Status	</Typography>
                            <Typography component={"p"}>
                              {obj.collection_schedule_month_details &&
                                  obj.collection_schedule_month_details.length > 0 &&
                                  obj.collection_schedule_month_details[0]
                                    .schedule_status}
                            </Typography>
                          </Box>
                          <Box className="crm-schedule-collection-detail-invoice-listitem-info">
                            <Typography component={"h3"}>Action</Typography>
                            <Typography component={"p"}>
                                        {(obj.invoice_file_url && 
                                        obj.invoice_file_url !== "") ? 
                                        <DownloadIcon style={{
                                          cursor: 'pointer',
                                          width: '20px',
                                          height: '20px',
                                        }}/>  : ' '}
                            </Typography>
                          </Box>
                        </Box>
                      ))
              }
            </Box>
      }
      
    </Grid>
  );
};

export default memo(CollectionDetail);
