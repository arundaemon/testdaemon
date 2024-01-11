import { Box, Button, Grid, Typography } from "@mui/material";
import { useStyles } from "../../css/SiteSurvey-css";
import CheckSheetTable from "./CheckSheetTable";

export const CheckCheetForm = () => {
  const classes = useStyles();

  let data = {
    status: 1,
    checksheet_details: [
      {
        checksheet_no: "Check sheet/2023-24/0025858",
        implementation_form_no: "EM112023A68437",
        manual_document_no: "N/A",
        manual_document_date: "2023-11-16",
        checksheet_date: "2023-11-16",
        order_no: "Order/2023-24/0071350",
        school_name: "St. Anthonys convent School",
        product_name: "LED",
        hub_name: "Noida Main",
        item_details: [
          {
            item_id: "2761",
            item_code: "CPUN4UNOPSSEM",
            description: "CPU (OPS) For LED EM-800 (i5)",
            brand: "EM - Extramarks",
            uom: "Nos",
            quantity: "10",
          },
          {
            item_id: "2718",
            item_code: "STBL0UN5KVABPE",
            description: "Voltage Stabilizer (Electronic) 5 KVA",
            brand: "Best Power",
            uom: "Nos",
            quantity: "10",
          },
          {
            item_id: "271",
            item_code: "PVCUJNT3015LO",
            description: "PVC U Joint (30x15) Internal",
            brand: "LO - Local",
            uom: "Nos",
            quantity: "20",
          },
          {
            item_id: "272",
            item_code: "PVCVJNT3015LO",
            description: "PVC V Joint (30x15) External",
            brand: "LO - Local",
            uom: "Nos",
            quantity: "20",
          },
          {
            item_id: "256",
            item_code: "ELECFASM800LO",
            description: "Fastner M8 X 100",
            brand: "LO - Local",
            uom: "Nos",
            quantity: "100",
          },
        ],
      },
    ],
  };

  const onSubmitHandler = () => {};

  return (
    <>
      {data?.checksheet_details?.map((obj) => {
        return (
          <>
            <Box className={classes.BoxHeader}>{"CheckSheet"}</Box>
            <Box className={classes.borderBox}>
              <div>
                <Grid container>
                  <Grid item md={6} xs={12} className={classes.borderBx}>
                    <Box>
                      <Typography className={classes.labelhead}>
                        Check Sheet Number
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item md={6} xs={12} className={classes.borderBx}>
                    <Box>
                      <Typography className={classes.labelValue}>
                        {obj?.checksheet_no}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item md={6} xs={12} className={classes.borderBx}>
                    <Box>
                      <Typography className={classes.labelhead}>
                        Implementation Form Number
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item md={6} xs={12} className={classes.borderBx}>
                    <Box>
                      <Typography className={classes.labelValue}>
                        {obj?.implementation_form_no}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item md={6} xs={12} className={classes.borderBx}>
                    <Box>
                      <Typography className={classes.labelhead}>
                        Mannual Document No.
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item md={6} xs={12} className={classes.borderBx}>
                    <Box>
                      <Typography className={classes.labelValue}>
                        {obj?.manual_document_no}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item md={6} xs={12} className={classes.borderBx}>
                    <Box>
                      <Typography className={classes.labelhead}>
                        Mannual Document Date
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item md={6} xs={12} className={classes.borderBx}>
                    <Box>
                      <Typography className={classes.labelValue}>
                        {obj?.manual_document_date}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item md={6} xs={12} className={classes.borderBx}>
                    <Box>
                      <Typography className={classes.labelhead}>
                        Check Sheet Date
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item md={6} xs={12} className={classes.borderBx}>
                    <Box>
                      <Typography className={classes.labelValue}>
                        {obj?.checksheet_date}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item md={6} xs={12} className={classes.borderBx}>
                    <Box>
                      <Typography className={classes.labelhead}>
                        Order Number
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item md={6} xs={12} className={classes.borderBx}>
                    <Box>
                      <Typography className={classes.labelValue}>
                        {obj?.order_no}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item md={6} xs={12} className={classes.borderBx}>
                    <Box>
                      <Typography className={classes.labelhead}>
                        School Name
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item md={6} xs={12} className={classes.borderBx}>
                    <Box>
                      <Typography className={classes.labelValue}>
                        {obj?.school_name}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item md={6} xs={12} className={classes.borderBx}>
                    <Box>
                      <Typography className={classes.labelhead}>
                        Product Name
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item md={6} xs={12} className={classes.borderBx}>
                    <Box>
                      <Typography className={classes.labelValue}>
                        {obj?.product_name}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item md={6} xs={12} className={classes.borderBx}>
                    <Box>
                      <Typography className={classes.labelhead}>
                        Hub Name
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item md={6} xs={12} className={classes.borderBx}>
                    <Box>
                      <Typography className={classes.labelValue}>
                        {obj?.hub_name}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </div>
            </Box>
            <Box className={classes.BoxHeader}>{"Bill of Material"}</Box>
            <Box className={classes.borderBox}>
              <CheckSheetTable data={obj?.item_details} />
            </Box>
          </>
        );
      })}

      <div className={classes.flxButtonBox}>
        <Button className={classes.submitBtn} onClick={() => onSubmitHandler()}>
          Submit
        </Button>
        <Button className={classes.submitBtn} onClick={() => onSubmitHandler()}>
          Cancel
        </Button>
      </div>
    </>
  );
};
