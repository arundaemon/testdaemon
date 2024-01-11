import { Box, Button, Grid, Typography } from "@mui/material";
import { useStyles } from "../../css/SiteSurvey-css";
import { NavigateTab } from "../../components/Calendar/NavigateTab";

export const DoDInvoiced = () => {
  const classes = useStyles();

  let data = {
    status: 1,
    tracking_details: [
      {
        eta_date: "2023-11-10",
        dispatch_date: "2023-11-16",
        tracking_link: "NA",
        docket_no: "100008423934",
        shipping_address: "Capture from the implementation form",
        courier_partner: "Safeexpress",
        status: "Delivered",
      },
    ],
  };

  const onSubmitHandler = () => {};

  return (
    <>
      <div className="tableCardContainer">
        <Box>
          <NavigateTab />
        </Box>
        {data?.tracking_details?.map((obj) => {
          return (
            <>
              <Box className={classes.BoxHeader}>{"INVOICED DETAIL"}</Box>
              <Box className={classes.borderBox}>
                <div>
                  <Grid container>
                    <Grid item md={6} xs={12} className={classes.borderBx}>
                      <Box>
                        <Typography className={classes.labelhead}>
                          ETA
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item md={6} xs={12} className={classes.borderBx}>
                      <Box>
                        <Typography className={classes.labelValue}>
                          {obj?.eta_date}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item md={6} xs={12} className={classes.borderBx}>
                      <Box>
                        <Typography className={classes.labelhead}>
                          Dispatch Date
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item md={6} xs={12} className={classes.borderBx}>
                      <Box>
                        <Typography className={classes.labelValue}>
                          {obj?.dispatch_date}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item md={6} xs={12} className={classes.borderBx}>
                      <Box>
                        <Typography className={classes.labelhead}>
                          Tracking Link
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item md={6} xs={12} className={classes.borderBx}>
                      <Box>
                        <Typography className={classes.labelValue}>
                          {obj?.tracking_link}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item md={6} xs={12} className={classes.borderBx}>
                      <Box>
                        <Typography className={classes.labelhead}>
                          Docket Number
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item md={6} xs={12} className={classes.borderBx}>
                      <Box>
                        <Typography className={classes.labelValue}>
                          {obj?.docket_no}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item md={6} xs={12} className={classes.borderBx}>
                      <Box>
                        <Typography className={classes.labelhead}>
                          Shipping Address
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item md={6} xs={12} className={classes.borderBx}>
                      <Box>
                        <Typography className={classes.labelValue}>
                          {obj?.shipping_address}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item md={6} xs={12} className={classes.borderBx}>
                      <Box>
                        <Typography className={classes.labelhead}>
                          Courier Patner
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item md={6} xs={12} className={classes.borderBx}>
                      <Box>
                        <Typography className={classes.labelValue}>
                          {obj?.courier_partner}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item md={6} xs={12} className={classes.borderBx}>
                      <Box>
                        <Typography className={classes.labelhead}>
                          Status
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item md={6} xs={12} className={classes.borderBx}>
                      <Box>
                        <Typography className={classes.labelValue}>
                          {obj?.status}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </div>
              </Box>
            </>
          );
        })}

        <div className={classes.flxButtonBox}>
          <Button
            className={classes.submitBtn}
            onClick={() => onSubmitHandler()}
          >
            Submit
          </Button>
          <Button
            className={classes.submitBtn}
            onClick={() => onSubmitHandler()}
          >
            Cancel
          </Button>
        </div>
      </div>
    </>
  );
};
