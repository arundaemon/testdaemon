import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import {
  Divider,
  Grid,
  Typography
} from "@mui/material";
import React from "react";
import { useStyles } from "../../css/SiteSurvey-css";

const headerOption = ["Date", "", "Particular", "Vch Type", "Debit", "Credit"];

export const SchoolInvoiceDetail = ({ data }) => {
  const classes = useStyles();

  return (
    <>
      {data?.school_ledger_details?.length > 0 ? (
        <>
          <Grid container spacing={2}>
            <Grid item md={12}>
              <Divider />
            </Grid>
            {headerOption?.map((headerMenu) => {
              return (
                <Grid item md={headerMenu === "Particular" ? 4 : (headerMenu === "Date" ? 1.5 : (headerMenu === "" ? 0.5 : 2))}>
                  <Typography className={classes.labelhead}>
                    {headerMenu}
                  </Typography>
                </Grid>
              );
            })}
            <Grid item md={12}>
              <Divider />
            </Grid>

            {data?.school_ledger_details?.map((obj) => {
              return (
                <>
                  <Grid item md={1.5}>
                    <Typography className={classes.label}>
                      {`${obj?.opening_balance_details?.date}`}
                    </Typography>
                  </Grid>
                  <Grid item md={0.5}>
                    <Typography className={classes.label}>
                      {`${obj?.opening_balance_details?.to_by}`}
                    </Typography>
                  </Grid>

                  <Grid item md={4}>
                    <Typography className={classes.label} sx={{ fontWeight: '800 !important' }}>
                      {`${obj?.opening_balance_details?.particulars}`}
                    </Typography>
                  </Grid>
                  <Grid item md={2}>
                    <Typography className={classes.label} sx={{ fontWeight: '800 !important' }}>
                      {obj?.opening_balance_details?.voucher_type}
                    </Typography>
                  </Grid>
                  <Grid item md={2}>
                    <Typography className={classes.label} sx={{ fontWeight: '800 !important' }}>
                      {obj?.opening_balance_details?.debit_amount !== null ? (
                        <>
                          <CurrencyRupeeIcon
                            sx={{
                              position: "relative",
                              top: "2px",
                              fontSize: "14px",
                            }}
                          />
                          {Number(obj?.opening_balance_details?.debit_amount)?.toLocaleString("en-IN", {
                            maximumFractionDigits: 2,
                          })}
                          / -{" "}
                        </>
                      ) : (
                        "N/A"
                      )}
                    </Typography>
                  </Grid>
                  <Grid item md={2}>
                    <Typography className={classes.label} sx={{ fontWeight: '800 !important' }}>
                      {obj?.opening_balance_details?.credit_amount !== null ? (
                        <>
                          <CurrencyRupeeIcon
                            sx={{
                              position: "relative",
                              top: "2px",
                              fontSize: "14px",
                            }}
                          />
                          {Number(obj?.opening_balance_details?.credit_amount)?.toLocaleString("en-IN", {
                            maximumFractionDigits: 2,
                          })}
                          / -{" "}
                        </>
                      ) : (
                        "N/A"
                      )}

                    </Typography>
                  </Grid>

                  {obj?.ledger_voucher_details?.map((obj) => {
                    return (
                      <>
                        <Grid item md={1.5}>
                          <Typography className={classes.label}>
                            {obj?.date}
                          </Typography>
                        </Grid>
                        <Grid item md={0.5}>
                          <Typography className={classes.label}>
                            {obj?.to_by}
                          </Typography>
                        </Grid>
                        <Grid item md={4}>
                          <Typography className={classes.label}>
                            {/* {obj?.to_by && (
                              <React.Fragment>
                                {obj.to_by}
                                :
                              </React.Fragment>
                            )} */}
                            {obj?.narration.split('\n').map((line, index) => (
                              <React.Fragment key={`line-${index}`}>
                                <span> {line}</span>
                                <br key={`br-${index}`} />
                              </React.Fragment>
                            ))}
                          </Typography>
                        </Grid>
                        <Grid item md={2}>
                          <Typography className={classes.label} sx={{ fontWeight: '800 !important' }}>
                            {obj?.voucher_type}
                          </Typography>
                        </Grid>
                        <Grid item md={2}>
                          <Typography className={classes.label} sx={{ fontWeight: '800 !important' }}>
                            {obj?.debit_amount !== null ? (
                              <>
                                <CurrencyRupeeIcon
                                  sx={{
                                    position: "relative",
                                    top: "2px",
                                    fontSize: "14px",
                                  }}
                                />
                                {Number(obj?.debit_amount)?.toLocaleString("en-IN", {
                                  maximumFractionDigits: 2,
                                })}
                                / -{" "}
                              </>
                            ) : (
                              "N/A"
                            )}
                          </Typography>
                        </Grid>
                        <Grid item md={2}>
                          <Typography className={classes.label} sx={{ fontWeight: '800 !important' }}>
                            {obj?.credit_amount !== null ? (
                              <>
                                <CurrencyRupeeIcon
                                  sx={{
                                    position: "relative",
                                    top: "2px",
                                    fontSize: "14px",
                                  }}
                                />
                                {Number(obj?.credit_amount)?.toLocaleString("en-IN", {
                                  maximumFractionDigits: 2,
                                })}
                                / -{" "}
                              </>
                            ) : (
                              "N/A"
                            )}
                          </Typography>
                        </Grid>
                      </>
                    );
                  })}

                  <Grid item md={1.5} sx={{ marginTop: "10px", borderBottom: "1px solid rgba(145, 158, 171, 0.24)", borderTop: "1px solid rgba(145, 158, 171, 0.24)" }}>
                    <Typography className={classes.label}>
                      {`${obj?.closing_balance_details?.date}`}
                    </Typography>
                  </Grid>
                  <Grid item md={0.5} sx={{ marginTop: "10px", borderBottom: "1px solid rgba(145, 158, 171, 0.24)", borderTop: "1px solid rgba(145, 158, 171, 0.24)" }}>
                    <Typography className={classes.label}>
                      {`${obj?.closing_balance_details?.to_by}`}
                    </Typography>
                  </Grid>
                  <Grid item md={4} sx={{ marginTop: "10px", borderBottom: "1px solid rgba(145, 158, 171, 0.24)", borderTop: "1px solid rgba(145, 158, 171, 0.24)" }}>
                    <Typography className={classes.label} sx={{ fontWeight: '800 !important' }}>
                      {`${obj?.closing_balance_details?.particulars}`}
                    </Typography>
                  </Grid>
                  <Grid item md={2} sx={{ marginTop: "10px", borderBottom: "1px solid rgba(145, 158, 171, 0.24)", borderTop: "1px solid rgba(145, 158, 171, 0.24)" }}>
                    <Typography className={classes.label} sx={{ fontWeight: '800 !important' }}>
                      {obj?.closing_balance_details?.voucher_type}
                    </Typography>
                  </Grid>
                  <Grid item md={2} sx={{ marginTop: "10px", borderBottom: "1px solid rgba(145, 158, 171, 0.24)", borderTop: "1px solid rgba(145, 158, 171, 0.24)" }} >
                    <Typography className={classes.label} sx={{ fontWeight: '800 !important' }}>
                      {obj?.closing_balance_details?.debit_amount !== null ? (
                        <>
                          <CurrencyRupeeIcon
                            sx={{
                              position: "relative",
                              top: "2px",
                              fontSize: "14px",
                            }}
                          />
                          {Number(obj?.closing_balance_details?.debit_amount)?.toLocaleString("en-IN", {
                            maximumFractionDigits: 2,
                          })}
                          / -{" "}
                        </>
                      ) : (
                        "N/A"
                      )}


                    </Typography>
                  </Grid>
                  <Grid item md={2} sx={{ marginTop: "10px", borderBottom: "1px solid rgba(145, 158, 171, 0.24)", borderTop: "1px solid rgba(145, 158, 171, 0.24)" }} >
                    <Typography className={classes.label} sx={{ fontWeight: '800 !important' }}>
                      {obj?.closing_balance_details?.credit_amount !== null ? (
                        <>
                          <CurrencyRupeeIcon
                            sx={{
                              position: "relative",
                              top: "2px",
                              fontSize: "14px",
                            }}
                          />
                          {Number(obj?.closing_balance_details?.credit_amount)?.toLocaleString("en-IN", {
                            maximumFractionDigits: 2,
                          })}
                          / -{" "}
                        </>
                      ) : (
                        "N/A"
                      )}
                    </Typography>
                  </Grid>
                </>
              );
            })}
          </Grid>
        </>
      ) : (
        <div className={classes.noData}>
          <p>No Data</p>
        </div>
      )}
    </>
  );
};
