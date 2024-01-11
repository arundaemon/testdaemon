import {
  Box,
  Paper,
  Grid,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TableBody,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { getSiteSurveyDetails } from "../../config/services/siteSurvey";

const styles = {
  // dividerLine: {
  //     borderWidth: "1.4px",
  //     borderColor: "grey",
  //     width: "98%",
  //     margin: "20px 5px 20px 16px",
  //   },
  flex: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  BoxHeader: {
    margin: "50px 0px 20px 0px",
    padding: "10px 16px",
    fontWeight: "700",
    fontSize: "18px",
    backgroundColor: "#FECB98",
    borderRadius: "8px !important",
  },
  BoxHeaderSecondary: {
    // margin: '20px',
    padding: "10px 16px",
    fontWeight: "700",
    fontSize: "18px",
    backgroundColor: "#FECB98",
    borderRadius: "8px !important",
  },
  primaryStyle: {
    display: "flex",
    padding: "20px",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  subText: {
    fontSize: "10px !important",
    color: "#FFFF !important",
  },
  textField: {
    boxShadow: "1px 3px 5px 1px rgba(0, 0, 0, 0.15)",
    "& input": {
      textAlign: "center",
    },
  },
  textAlignment: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};

const StandaloneConfig = ({ standaloneConfig }) => {
  return (
    <div
      style={{
        border: "1px solid #e0e0e0",
        borderRadius: "10px",
        marginTop: "50px",
        boxShadow: "1px 3px 5px 1px rgba(0, 0, 0, 0.15)",
      }}
    >
      <Grid item xs={12} sx={styles.BoxHeaderSecondary}>
        {"Standalone and online Configuration"}
      </Grid>
      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table
            aria-label="customized table"
            className="custom-table datasets-table"
          >
            <TableHead>
              <TableRow>
                <TableCell
                  style={{
                    borderRight: "1px solid #e0e0e0",
                    textAlign: "center",
                  }}
                >
                  Processor
                </TableCell>
                <TableCell
                  style={{
                    borderRight: "1px solid #e0e0e0",
                    textAlign: "center",
                  }}
                >
                  Generation
                </TableCell>
                <TableCell
                  style={{
                    borderRight: "1px solid #e0e0e0",
                    textAlign: "center",
                  }}
                >
                  HDD
                </TableCell>
                <TableCell
                  style={{
                    borderRight: "1px solid #e0e0e0",
                    textAlign: "center",
                  }}
                >
                  RAM
                </TableCell>
                <TableCell
                  style={{
                    borderRight: "1px solid #e0e0e0",
                    textAlign: "center",
                  }}
                >
                  Operating System
                </TableCell>
                <TableCell
                  style={{
                    borderRight: "1px solid #e0e0e0",
                    textAlign: "center",
                  }}
                >
                  CPU Core
                </TableCell>
                <TableCell
                  style={{
                    borderRight: "1px solid #e0e0e0",
                    textAlign: "center",
                  }}
                >
                  Internet in CPU/OPS
                </TableCell>
                <TableCell
                  style={{
                    borderRight: "1px solid #e0e0e0",
                    textAlign: "center",
                  }}
                >
                  Count of CPU
                </TableCell>
                <TableCell
                  style={{
                    borderRight: "1px solid #e0e0e0",
                    textAlign: "center",
                  }}
                >
                  UPS (Y/N)
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>Remarks</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {standaloneConfig?.map((row, index) => (
                <TableRow key={index}>
                  <TableCell align="center">{row?.processor}</TableCell>
                  <TableCell align="center">{row?.generation}</TableCell>
                  <TableCell align="center">{row?.HDD}</TableCell>
                  <TableCell align="center">{row?.RAM}</TableCell>
                  <TableCell align="center">{row?.OperatingSystem}</TableCell>
                  <TableCell align="center">{row?.CPUCore}</TableCell>
                  <TableCell align="center">{row?.Internet}</TableCell>
                  <TableCell align="center">{row?.CPUCount}</TableCell>
                  <TableCell align="center">{row?.UPS}</TableCell>
                  <TableCell align="center">{row?.Remarks}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </div>
  );
};

const IFPConfiguration = ({ IFPConfig }) => {
  return (
    <div
      style={{
        border: "1px solid #e0e0e0",
        borderRadius: "10px",
        marginTop: "50px",
        boxShadow: "1px 3px 5px 1px rgba(0, 0, 0, 0.15)",
      }}
    >
      <Grid item xs={12} sx={styles.BoxHeaderSecondary}>
        {"IFP and online Configuration"}
      </Grid>
      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table
            aria-label="customized table"
            className="custom-table datasets-table"
          >
            <TableHead>
              <TableRow>
                <TableCell
                  style={{
                    borderRight: "1px solid #e0e0e0",
                    textAlign: "center",
                  }}
                >
                  Operating System
                </TableCell>
                <TableCell
                  style={{
                    borderRight: "1px solid #e0e0e0",
                    textAlign: "center",
                  }}
                >
                  HDD
                </TableCell>
                <TableCell
                  style={{
                    borderRight: "1px solid #e0e0e0",
                    textAlign: "center",
                  }}
                >
                  RAM
                </TableCell>
                <TableCell
                  style={{
                    borderRight: "1px solid #e0e0e0",
                    textAlign: "center",
                  }}
                >
                  Mic
                </TableCell>
                <TableCell
                  style={{
                    borderRight: "1px solid #e0e0e0",
                    textAlign: "center",
                  }}
                >
                  Count of IFP
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>Remarks</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {IFPConfig?.map((row, index) => (
                <TableRow key={index}>
                  <TableCell style={{ textAlign: "center" }}>
                    {row?.OperatingSystem}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {row?.HDD}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {row?.RAM}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {row?.Mic}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {row?.IFPCount}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {row?.Remarks}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </div>
  );
};

const ClassRoomDetailsForm = ({ classRoomDetails }) => {
  return (
    <div
      style={{
        border: "1px solid #e0e0e0",
        borderRadius: "10px",
        marginTop: "50px",
        boxShadow: "1px 3px 5px 1px rgba(0, 0, 0, 0.15)",
      }}
    >
      <Grid item xs={12} sx={styles.BoxHeaderSecondary}>
        {"Class Room Details"}
      </Grid>
      <Grid item xs={12}>
        <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
          <Table
            aria-label="customized table"
            className="custom-table datasets-table"
          >
            <TableHead>
              <TableRow>
                <TableCell
                  style={{
                    borderRight: "1px solid #e0e0e0",
                    textAlign: "center",
                  }}
                >
                  Class room number
                </TableCell>
                <TableCell
                  style={{
                    borderRight: "1px solid #e0e0e0",
                    textAlign: "center",
                  }}
                >
                  Room Dimension
                </TableCell>
                <TableCell
                  style={{
                    borderRight: "1px solid #e0e0e0",
                    textAlign: "center",
                  }}
                >
                  Grade
                </TableCell>
                <TableCell
                  style={{
                    borderRight: "1px solid #e0e0e0",
                    textAlign: "center",
                  }}
                >
                  Wall Type
                </TableCell>
                <TableCell
                  style={{
                    borderRight: "1px solid #e0e0e0",
                    textAlign: "center",
                  }}
                >
                  Podium Location
                </TableCell>
                <TableCell
                  style={{
                    borderRight: "1px solid #e0e0e0",
                    textAlign: "center",
                  }}
                >
                  Dedicated connection for SLC
                </TableCell>
                <TableCell
                  style={{
                    borderRight: "1px solid #e0e0e0",
                    textAlign: "center",
                  }}
                >
                  Phase neutral(220V-230V)
                </TableCell>
                <TableCell
                  style={{
                    borderRight: "1px solid #e0e0e0",
                    textAlign: "center",
                  }}
                >
                  Neutral Earth(0V-5V)
                </TableCell>
                <TableCell
                  style={{
                    borderRight: "1px solid #e0e0e0",
                    textAlign: "center",
                  }}
                >
                  Voltage Variation (Yes/No) Range
                </TableCell>
                <TableCell
                  style={{
                    borderRight: "1px solid #e0e0e0",
                    textAlign: "center",
                  }}
                >
                  Distance from server
                </TableCell>
                <TableCell
                  style={{
                    borderRight: "1px solid #e0e0e0",
                    textAlign: "center",
                  }}
                >
                  Site ready
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {classRoomDetails?.map((row, index) => (
                <TableRow key={index}>
                  <TableCell style={{ textAlign: "center" }}>
                    {row?.classRoomNumber}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {row?.roomDimension}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {row?.grade}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {row?.wallType}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {row?.podiumLocation}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {row?.dedicatedConnectionForSlc}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {row?.phaseNeutral}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {row?.neutralEarth}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {row?.VoltageVariation}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {row?.distanceFromServer}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {row?.siteReady}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </div>
  );
};

const SiteSurveyDetailPage = ({ siteSurveyCode }) => {
  const [siteSurveyDetail, setSiteSurveyDetail] = useState();

  const fetchSiteSurveryDetail = async () => {
    let response;
    try {
      response = await getSiteSurveyDetails({implementationCode:siteSurveyCode});
      setSiteSurveyDetail(response?.result);
    } catch (error) {
      console.error("Error: ", error);
    }
  };
  useEffect(() => {
    fetchSiteSurveryDetail();
  }, []);
  return (
    <div>
      <Grid container spacing={2} sx={styles.primaryStyle}>
        <Grid item xs={5}>
          Internet Availability in school?
          <span style={{ color: "red" }}>*</span>
        </Grid>
        <Grid item xs={5}>
          {siteSurveyDetail?.internetAvailability ? "Yes" : "No"}
        </Grid>

        <Grid item xs={5}>
          Internet Bandwidth download speed
          <span style={{ color: "red" }}>*</span>
        </Grid>
        <Grid item xs={5}>
          {siteSurveyDetail?.downloadSpeed}
        </Grid>

        <Grid item xs={5}>
          Internet Bandwidth upload speed<span style={{ color: "red" }}>*</span>
        </Grid>
        <Grid item xs={5}>
          {siteSurveyDetail?.uploadSpeed}
        </Grid>

        <Grid item xs={5}>
          Networking (Wired/WiFi)<span style={{ color: "red" }}>*</span>
        </Grid>
        <Grid item xs={5}>
          {siteSurveyDetail?.networkType}
        </Grid>

        <Grid item xs={5}>
          School Internet details along with service provider
          <span style={{ color: "red" }}>*</span>
        </Grid>
        <Grid item xs={5}>
          {siteSurveyDetail?.serviceProviderDetails}
        </Grid>

        <Grid xs={12} sx={styles.BoxHeader}>
          {"Server Configuration"}
        </Grid>

        <Grid item xs={3}>
          Available in school
        </Grid>
        <Grid item xs={7} sx={styles.flex}>
          <Typography>
            {siteSurveyDetail?.serverAvailablility ? "Yes" : "No"}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <hr className={styles.divider} />
        </Grid>

        {siteSurveyDetail?.serverConfiguration?.serverNumber?.mode && (
          <>
            <Grid item xs={3}>
              No. of Server
            </Grid>
            <Grid item xs={7} sx={styles.flex}>
              <Grid item xs={2}>
                <Typography>Mode: </Typography>
              </Grid>
              <Grid item xs={4}>
                {siteSurveyDetail?.serverConfiguration?.serverNumber?.mode}
              </Grid>
              <Grid item xs={2}>
                <Typography>Quantity: </Typography>
              </Grid>
              <Grid item xs={4}>
                {siteSurveyDetail?.serverConfiguration?.serverNumber
                  ?.quantity ?? "0"}
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <hr className={styles.divider} />
            </Grid>
          </>
        )}

        {siteSurveyDetail?.serverConfiguration?.HDD?.mode && (
          <>
            <Grid item xs={3}>
              HDD (4 TB)
            </Grid>
            <Grid item xs={7} sx={styles.flex}>
              {siteSurveyDetail?.serverConfiguration?.HDD?.mode && (
                <>
                  <Grid item xs={2}>
                    <Typography>Mode: </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    {siteSurveyDetail?.serverConfiguration?.HDD?.mode}
                  </Grid>
                  <Grid item xs={2}>
                    <Typography>Quantity: </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    {siteSurveyDetail?.serverConfiguration?.HDD?.quantity ??
                      "0"}
                  </Grid>
                </>
              )}
            </Grid>

            <Grid item xs={12}>
              <hr className={styles.divider} />
            </Grid>
          </>
        )}

        {siteSurveyDetail?.serverConfiguration?.processorI5?.mode && (
          <>
            <Grid item xs={3}>
              <div>Processor: </div>
              <div style={{ fontSize: "13px", color: "grey" }}>
                core i5 9th Gen or above, <br /> Ram 16GB,
                <br />
                HDD- 4TB storage 7200
              </div>
            </Grid>
            <Grid item xs={7} sx={styles.flex}>
              <Grid item xs={2}>
                <Typography>Mode: </Typography>
              </Grid>
              <Grid item xs={4}>
                {siteSurveyDetail?.serverConfiguration?.processorI5?.mode}
              </Grid>
              <Grid item xs={2}>
                <Typography>Quantity: </Typography>
              </Grid>
              <Grid item xs={4}>
                {siteSurveyDetail?.serverConfiguration?.processorI5?.quantity ??
                  "0"}
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <hr className={styles.divider} />
            </Grid>
          </>
        )}

        {siteSurveyDetail?.serverConfiguration?.processorXeon?.mode && (
          <>
            <Grid item xs={3}>
              <div>Processor: </div>
              <div style={{ fontSize: "13px", color: "grey" }}>
                Xeon 4 Core, <br /> Ram 16GB,
                <br />
                HDD- 4TB storage 7200
              </div>
            </Grid>
            <Grid item xs={7} sx={styles.flex}>
              <Grid item xs={2}>
                <Typography>Mode: </Typography>
              </Grid>
              <Grid item xs={4}>
                {siteSurveyDetail?.serverConfiguration?.processorXeon?.mode}
              </Grid>
              <Grid item xs={2}>
                <Typography>Quantity: </Typography>
              </Grid>
              <Grid item xs={4}>
                {siteSurveyDetail?.serverConfiguration?.processorXeon
                  ?.quantity ?? "0"}
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <hr className={styles.divider} />
            </Grid>
          </>
        )}

        {siteSurveyDetail?.serverConfiguration?.otherServer?.mode && (
          <>
            <Grid item xs={3}>
              <div>Server(Any Other)</div>
              <div style={{ fontSize: "13px", color: "grey" }}>
                RAM + Processor
              </div>
            </Grid>
            <Grid item xs={7} sx={styles.flex}>
              <Grid item xs={2}>
                <Typography>Mode: </Typography>
              </Grid>
              <Grid item xs={4}>
                {siteSurveyDetail?.serverConfiguration?.otherServer?.mode}
              </Grid>
              <Grid item xs={2}>
                <Typography>Quantity: </Typography>
              </Grid>
              <Grid item xs={4}>
                {siteSurveyDetail?.serverConfiguration?.otherServer?.quantity ??
                  "0"}
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <hr className={styles.divider} />
            </Grid>
          </>
        )}

        {siteSurveyDetail?.serverConfiguration?.outputDevice?.mode && (
          <>
            <Grid item xs={3}>
              Output Device <br />
              (Monitor)Y/N
            </Grid>
            <Grid item xs={7} sx={styles.flex}>
              <Grid item xs={2}>
                <Typography>Mode: </Typography>
              </Grid>
              <Grid item xs={4}>
                {siteSurveyDetail?.serverConfiguration?.outputDevice?.mode}
              </Grid>
              <Grid
                item
                xs={4}
                sx={{ ...styles.flex, justifyContent: "flex-start !important" }}
              >
                {siteSurveyDetail?.serverConfiguration?.outputDevice?.quantity}
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <hr className={styles.divider} />
            </Grid>
          </>
        )}

        {siteSurveyDetail?.serverConfiguration?.ups?.mode && (
          <>
            <Grid item xs={3}>
              UPS 1 KV (Y/N)
            </Grid>
            <Grid item xs={7} sx={styles.flex}>
              <Grid item xs={2}>
                <Typography>Mode: </Typography>
              </Grid>
              <Grid item xs={4}>
                {siteSurveyDetail?.serverConfiguration?.ups?.mode}
              </Grid>
              <Grid item xs={4}>
                {siteSurveyDetail?.serverConfiguration?.ups?.quantity}
              </Grid>
            </Grid>

            <Grid item xs={12} sx={{ margin: "30px 0px 30px 0px" }}>
              <hr className={styles.divider} />
            </Grid>
          </>
        )}

        <Grid item xs={12}>
          <Typography
            style={{
              textDecoration: "underline",
              margin: "0 0 10px 20px",
              fontWeight: "600",
              fontSize: "18px",
            }}
          >
            Networking Details
          </Typography>
        </Grid>

        <Grid item xs={5}>
          No. of switch 8 Port (1 Gbps)
          <br /> (Managed/unmanaged)
        </Grid>
        <Grid item xs={5}>
          {siteSurveyDetail?.numOfSwitchEightPort}
        </Grid>

        <Grid item xs={5}>
          No. of switch 16 Port (1 Gbps)
          <br /> (Managed/unmanaged)
        </Grid>
        <Grid item xs={5}>
          {siteSurveyDetail?.numOfSwitchSixteenPort}
        </Grid>

        <Grid item xs={5}>
          No. of switch 24 Port (1 Gbps)
          <br /> (Managed/unmanaged)
        </Grid>
        <Grid item xs={5}>
          {siteSurveyDetail?.numOfSwitchTwentyFourPort}
        </Grid>

        {siteSurveyDetail?.standaloneOnlineConfiguration.length > 0 && (
          <Grid item xs={12}>
            <StandaloneConfig
              standaloneConfig={siteSurveyDetail?.standaloneOnlineConfiguration}
            />
          </Grid>
        )}

        {siteSurveyDetail?.IFPOnlineConfiguration.length > 0 && (
          <Grid item xs={12}>
            <IFPConfiguration
              IFPConfig={siteSurveyDetail?.IFPOnlineConfiguration}
            />
          </Grid>
        )}

        {siteSurveyDetail?.classRoomDetails.length > 0 && (
          <Grid item xs={12}>
            <ClassRoomDetailsForm
              classRoomDetails={siteSurveyDetail?.classRoomDetails}
            />
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default SiteSurveyDetailPage;
