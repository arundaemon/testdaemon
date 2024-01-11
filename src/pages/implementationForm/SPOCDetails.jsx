import {
    Box,
    Divider,
    Grid,
    Paper,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import TableCell from "@mui/material/TableCell";
import moment from "moment";
import React, { Fragment } from "react";

const styles = {
    tableContainer: {
        margin: "30px auto",
        borderRadius: "8px",
        boxShadow: "0px 3px 6px #00000029",
        paddingBottom: "20px",
    },
    dividerLine: {
        borderWidth: "1.4px",
        borderColor: "grey",
        width: "98%",
        margin: "20px 5px 20px 16px",
    },
    tableCell: {
        padding: "8px 0px 8px 16px !important",
        border: "none",
    },
    typo: {
        padding: "10px 16px",
        fontWeight: "700",
        fontSize: "18px",
        textDecoration: "underline",
        backgroundColor: "#FECB98",
    },
    dateSec: {
        borderRadius: "4px !important",
        boxShadow: "0px 3px 6px #00000029",
        paddingBottom: "50px",
        marginTop: "50px",
    },
    spocSec: {
        borderRadius: "8px !important",
        boxShadow: "0px 3px 6px #00000029",
        paddingBottom: "50px",
    },
};

const SPOCDetails = ({ implementationData }) => {
    const SPOCDetails = ({ heading, name, phn, email }) => {
        return (
            <>
                <Grid
                    container
                    sx={{
                        padding: "10px 16px",
                        marginTop: "20px",
                    }}
                >
                    <Grid xs={12} sx={{ fontSize: "20px", fontWeight: 600 }}>
                        {heading}
                    </Grid>
                </Grid>
                <Grid
                    container
                    sx={{
                        padding: "10px 16px",
                        marginTop: "0px",
                    }}
                >
                    <Grid
                        sx={{
                            width: "70px",
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        {"Name :"}
                    </Grid>
                    <Grid xs={2} sx={{ marginRight: "30px" }}>
                        {name}
                    </Grid>
                    <Grid
                        sx={{
                            width: "105px",
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        {"Phone No. :"}
                    </Grid>
                    <Grid xs={2} sx={{ marginRight: "30px" }}>
                        {phn}
                    </Grid>
                    <Grid
                        sx={{
                            width: "70px",
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        {"Email :"}
                    </Grid>
                    <Grid xs={2}>{email}</Grid>
                </Grid>
            </>
        );
    };

    const ImportantDate = ({ dateType, dateValue }) => {
        return (
            <>
                <Grid xs={3} sx={{ padding: "10px 16px", marginTop: "10px" }}>
                    {dateType}
                </Grid>
                <Grid xs={9} sx={{ marginTop: "10px", padding: "10px 16px" }}>
                    {dateValue}
                </Grid>
            </>
        );
    };
    return (
        <div>
            <Grid container sx={styles.spocSec}>
                <Grid
                    xs={12}
                    sx={{
                        ...styles.typo,
                        borderRadius: "8px 8px 0 0 !important",
                    }}
                >
                    {"SPOC Details"}
                </Grid>
                <SPOCDetails
                    heading={"School Admin Details*"}
                    name={implementationData?.schoolAdminSPOCName}
                    phn={implementationData?.schoolAdminSPOCPhnNo}
                    email={implementationData?.schoolAdminSPOCEmail}
                />
                <Divider sx={styles.dividerLine} />
                <SPOCDetails
                    heading={"School Implementation SPOC*"}
                    name={implementationData?.schoolImplementationSPOCName}
                    phn={implementationData?.schoolImplementationSPOCPhnNo}
                    email={implementationData?.schoolImplementationSPOCEmail}
                />
                <Divider sx={styles.dividerLine} />
                <SPOCDetails
                    heading={"School Payment SPOC*"}
                    name={implementationData?.schoolPaymentSPOCName}
                    phn={implementationData?.schoolPaymentSPOCPhnNo}
                    email={implementationData?.schoolPaymentSPOCEmail}
                />
                <Divider sx={styles.dividerLine} />
                <Grid xs={3} sx={{ fontSize: "20px", fontWeight: 600, padding: "10px 16px", marginTop: "10px" }}>
                    {"No. Of Co-Ordinators"}
                </Grid>
                <Grid xs={9} sx={{ marginTop: "15px", padding: "10px 16px" }}>
                    {implementationData?.noOfCordinators}
                </Grid>
            </Grid>
            <Grid container sx={styles.dateSec}>
                <Grid
                    xs={12}
                    sx={{
                        ...styles.typo,
                        borderRadius: "8px 8px 0 0 !important",
                        marginBottom: "30px",
                    }}
                >
                    {"Important Dates"}
                </Grid>
                {/* <ImportantDate
          dateType={"Contact Signing Date"}
          dateValue={
            implementationData?.contractSigningdate
              ? moment(implementationData?.contractSigningdate).format(
                  "DD/MM/YYYY"
                )
              : "NA"
          }
        /> */}
                {/* <ImportantDate
          dateType={"Billing Date"}
          dateValue={moment(implementationData?.billingDate).format(
            "DD/MM/YYYY"
          )}
        /> */}
                <ImportantDate
                    dateType={"Implementation Start Date"}
                    dateValue={moment(implementationData?.implementationStartDate).format(
                        "DD/MM/YYYY"
                    )}
                />
                <ImportantDate
                    dateType={"Implementation End Date"}
                    dateValue={moment(implementationData?.implementationEndDate).format(
                        "DD/MM/YYYY"
                    )}
                />
            </Grid>
        </div>
    )
}

export default SPOCDetails