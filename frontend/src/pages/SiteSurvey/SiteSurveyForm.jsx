import {
  Paper,
  Divider,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  TableBody,
  Select,
  MenuItem,
  Button,
  IconButton,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { getUserData } from "../../helper/randomFunction/localStorage";
import {
  processorOptionsStandalone,
  generationOptionsStandalone,
  hddOptionsStandalone,
  ramOptionsStandalone,
  osOptionsStandalone,
  cpuCoreOptionsStandalone,
  internetOptionsStandalone,
  osOptionsIFP,
  hddOptionsIFP,
  ramOptionsIFP,
  micOptionsIFP,
  isRadioCheck,
  QuoteType,
} from "../../constants/general";
import {
  createSiteSurvey,
  updateApprovalStatus,
} from "../../config/services/siteSurvey";
import toast from "react-hot-toast";
import { handleKeyTextNum, handleKeyTextNumPaste, handleNumberKeyDown } from "../../helper/randomFunction";
import { useNavigate } from "react-router-dom";
import { useStyles } from "../../css/SiteSurvey-css";
import DownloadIcon from "../../assets/image/downloadIcon.svg";
import { assignApprovalRequest } from "../../config/services/salesApproval";

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
    justifyContent: "space-around",
    alignItems: "center",
  },
  flexRadio: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
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
    borderRadius: "8px",
  },
  customStyles: {
    width: "100%",
  },
  flexDiv: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
  },
};

const StandaloneConfig = ({
  standaloneConfig,
  setStandaloneConfig,
  standaloneObj,
  standaloneConfigActual,
  setStandaloneConfigActual,
}) => {
  const handleAddStandalone = (index) => {
    const updatedRows = [
      ...standaloneConfig.slice(0, index + 1),
      standaloneObj,
      ...standaloneConfig.slice(index + 1),
    ];
    setStandaloneConfig(updatedRows);
    setStandaloneConfigActual(updatedRows);
  };

  const handleDeleteStandalone = (index) => {
    const updatedRows = standaloneConfig.filter((row, i) => i !== index);
    setStandaloneConfig(updatedRows);
    setStandaloneConfigActual(updatedRows);
  };

  const handleFieldChange = (index, field, value) => {
    const updatedRows = standaloneConfig.map((row, i) =>
      i === index ? { ...row, [field]: value } : row
    );
    setStandaloneConfig(updatedRows);
    setStandaloneConfigActual(updatedRows);
  };

  return (
    <div
      style={{
        border: "1px solid #e0e0e0",
        borderRadius: "10px",
        marginTop: "50px",
        boxShadow: "1px 3px 5px 1px rgba(0, 0, 0, 0.15)",
      }}
    >
      <Grid item md={12} xs={12} sx={styles.BoxHeaderSecondary}>
        {"Standalone and online Configuration"}
      </Grid>
      <Grid item md={12} xs={12}>
        <TableContainer component={Paper}>
          <Table
            aria-label="customized table"
            className="custom-table datasets-table"
          >
            <TableHead>
              <TableRow className="cm_table_head">
                <TableCell
                  style={{ borderRight: "1px solid #e0e0e0", width: "300px" }}
                >
                  Processor
                </TableCell>
                <TableCell
                  style={{
                    borderRight: "1px solid #e0e0e0",
                    width: "300px !important",
                  }}
                >
                  Generation
                </TableCell>
                <TableCell
                  style={{ borderRight: "1px solid #e0e0e0", width: "300px" }}
                >
                  HDD
                </TableCell>
                <TableCell
                  style={{ borderRight: "1px solid #e0e0e0", width: "300px" }}
                >
                  RAM
                </TableCell>
                <TableCell
                  style={{ borderRight: "1px solid #e0e0e0", width: "300px" }}
                >
                  Operating System
                </TableCell>
                <TableCell
                  style={{ borderRight: "1px solid #e0e0e0", width: "300px" }}
                >
                  CPU Core
                </TableCell>
                <TableCell style={{ borderRight: "1px solid #e0e0e0" }}>
                  Internet in CPU/OPS
                </TableCell>
                <TableCell style={{ borderRight: "1px solid #e0e0e0" }}>
                  Count of CPU
                </TableCell>
                <TableCell style={{ borderRight: "1px solid #e0e0e0" }}>
                  UPS (Y/N)
                </TableCell>
                <TableCell>Remarks</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {standaloneConfig.map((row, index) => (
                <TableRow>
                  <TableCell sx={{ minWidth: "150px" }}>
                    <Select
                      fullWidth
                      value={row.processor}
                      onChange={(e) =>
                        handleFieldChange(index, "processor", e.target.value)
                      }
                      sx={styles.customStyles}
                    >
                      {processorOptionsStandalone.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell sx={{ minWidth: "150px" }}>
                    <Select
                      fullWidth
                      value={row.generation}
                      onChange={(e) =>
                        handleFieldChange(index, "generation", e.target.value)
                      }
                      sx={styles.customStyles}
                    >
                      {generationOptionsStandalone.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell sx={{ minWidth: "150px" }}>
                    <Select
                      fullWidth
                      value={row.HDD}
                      onChange={(e) =>
                        handleFieldChange(index, "HDD", e.target.value)
                      }
                      sx={styles.customStyles}
                    >
                      {hddOptionsStandalone.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell sx={{ minWidth: "150px" }}>
                    <Select
                      fullWidth
                      value={row.RAM}
                      onChange={(e) =>
                        handleFieldChange(index, "RAM", e.target.value)
                      }
                      sx={styles.customStyles}
                    >
                      {ramOptionsStandalone.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell sx={{ minWidth: "150px" }}>
                    <Select
                      fullWidth
                      value={row.OperatingSystem}
                      onChange={(e) =>
                        handleFieldChange(
                          index,
                          "OperatingSystem",
                          e.target.value
                        )
                      }
                      sx={styles.StandaloneConfig}
                    >
                      {osOptionsStandalone.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell sx={{ minWidth: "150px" }}>
                    <Select
                      fullWidth
                      value={row.CPUCore}
                      onChange={(e) =>
                        handleFieldChange(index, "CPUCore", e.target.value)
                      }
                      sx={styles.customStyles}
                    >
                      {cpuCoreOptionsStandalone.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell sx={{ minWidth: "150px" }}>
                    <Select
                      fullWidth
                      value={row.Internet}
                      onChange={(e) =>
                        handleFieldChange(index, "Internet", e.target.value)
                      }
                      sx={styles.customStyles}
                    >
                      {internetOptionsStandalone.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell sx={{ minWidth: "150px" }}>
                    <TextField
                      value={row.CPUCount}
                      onChange={(e) =>
                        handleFieldChange(index, "CPUCount", e.target.value)
                      }
                      sx={styles.customStyles}
                      onKeyDown={handleNumberKeyDown}
                    />
                  </TableCell>
                  <TableCell sx={{ minWidth: "150px" }}>
                    <Select
                      fullWidth
                      value={row.UPS}
                      onChange={(e) =>
                        handleFieldChange(index, "UPS", e.target.value)
                      }
                      sx={styles.customStyles}
                    >
                      <MenuItem value={"yes"}>Yes</MenuItem>
                      <MenuItem value={"no"}>No</MenuItem>
                    </Select>
                  </TableCell>

                  <TableCell sx={{ minWidth: "150px" }}>
                    <TextField
                      value={row.Remarks}
                      onChange={(e) =>
                        handleFieldChange(index, "Remarks", e.target.value)
                      }
                      sx={styles.customStyles}
                    />
                  </TableCell>

                  <TableCell>
                    <AddIcon
                      fontSize="large"
                      color="primary"
                      onClick={() => handleAddStandalone(index)}
                      style={{ cursor: "pointer" }}
                    />
                    {index !== 0 && (
                      <RemoveIcon
                        fontSize="large"
                        color="primary"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleDeleteStandalone(index)}
                      />
                    )}
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

const IFPConfiguration = ({
  IFPConfig,
  setIFPConfig,
  IFPObj,
  setIFPConfigActual,
}) => {
  const handleAddIFP = (index) => {
    const updatedRows = [
      ...IFPConfig.slice(0, index + 1),
      IFPObj,
      ...IFPConfig.slice(index + 1),
    ];
    setIFPConfig(updatedRows);
    setIFPConfigActual(updatedRows);
  };

  const handleDeleteIFP = (index) => {
    const updatedRows = IFPConfig.filter((row, i) => i !== index);
    setIFPConfig(updatedRows);
    setIFPConfigActual(updatedRows);
  };

  const handleFieldChange = (index, field, value) => {
    const updatedRows = IFPConfig.map((row, i) =>
      i === index ? { ...row, [field]: value } : row
    );
    setIFPConfig(updatedRows);
    setIFPConfigActual(updatedRows);
  };

  return (
    <div
      style={{
        border: "1px solid #e0e0e0",
        borderRadius: "10px",
        marginTop: "50px",
        boxShadow: "1px 3px 5px 1px rgba(0, 0, 0, 0.15)",
      }}
    >
      <Grid item md={12} xs={12} sx={styles.BoxHeaderSecondary}>
        {"IFP and online Configuration"}
      </Grid>
      <Grid item md={12} xs={12}>
        <TableContainer component={Paper}>
          <Table
            aria-label="customized table"
            className="custom-table datasets-table"
          >
            <TableHead>
              <TableRow>
                <TableCell style={{ borderRight: "1px solid #e0e0e0" }}>
                  Operating System
                </TableCell>
                <TableCell style={{ borderRight: "1px solid #e0e0e0" }}>
                  HDD
                </TableCell>
                <TableCell style={{ borderRight: "1px solid #e0e0e0" }}>
                  RAM
                </TableCell>
                <TableCell style={{ borderRight: "1px solid #e0e0e0" }}>
                  Mic
                </TableCell>
                <TableCell style={{ borderRight: "1px solid #e0e0e0" }}>
                  Count of IFP
                </TableCell>
                <TableCell>Remarks</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {IFPConfig.map((row, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ minWidth: "150px" }}>
                    <Select
                      fullWidth
                      value={row.OperatingSystem}
                      onChange={(e) =>
                        handleFieldChange(
                          index,
                          "OperatingSystem",
                          e.target.value
                        )
                      }
                      sx={styles.textField}
                    >
                      {osOptionsIFP.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell sx={{ minWidth: "150px" }}>
                    <Select
                      fullWidth
                      value={row.HDD}
                      onChange={(e) =>
                        handleFieldChange(index, "HDD", e.target.value)
                      }
                      sx={styles.textField}
                    >
                      {hddOptionsIFP.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell sx={{ minWidth: "150px" }}>
                    <Select
                      fullWidth
                      value={row.RAM}
                      onChange={(e) =>
                        handleFieldChange(index, "RAM", e.target.value)
                      }
                      sx={styles.textField}
                    >
                      {ramOptionsIFP.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell sx={{ minWidth: "150px" }}>
                    <Select
                      fullWidth
                      value={row.Mic}
                      onChange={(e) =>
                        handleFieldChange(index, "Mic", e.target.value)
                      }
                      size="large"
                      sx={styles.textField}
                    >
                      {micOptionsIFP.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell sx={{ minWidth: "150px" }}>
                    <TextField
                      value={row.IFPCount}
                      onChange={(e) =>
                        handleFieldChange(index, "IFPCount", e.target.value)
                      }
                      sx={styles.textField}
                      onKeyDown={handleNumberKeyDown}
                    />
                  </TableCell>
                  <TableCell sx={{ minWidth: "150px" }}>
                    <TextField
                      value={row.Remarks}
                      onChange={(e) =>
                        handleFieldChange(index, "Remarks", e.target.value)
                      }
                      sx={styles.textField}
                    />
                  </TableCell>
                  <TableCell>
                    <AddIcon
                      fontSize="large"
                      color="primary"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleAddIFP(index)}
                    />
                    {index !== 0 && (
                      <RemoveIcon
                        fontSize="large"
                        color="primary"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleDeleteIFP(index)}
                      />
                    )}
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

const ClassRoomDetailsForm = ({
  classRoomDetails,
  setClassRoomDetails,
  classRoomObj,
  setClassRoomDetailsActual,
}) => {
  const handleAddClassroomDetail = (index) => {
    const updatedRows = [
      ...classRoomDetails.slice(0, index + 1),
      classRoomObj,
      ...classRoomDetails.slice(index + 1),
    ];
    setClassRoomDetails(updatedRows);
    setClassRoomDetailsActual(updatedRows);
  };

  const handleDeleteClassroomDetail = (index) => {
    const updatedRows = classRoomDetails.filter((row, i) => i !== index);
    setClassRoomDetails(updatedRows);
    setClassRoomDetailsActual(updatedRows);
  };

  const handleFieldChange = (index, field, value) => {
    const updatedRows = classRoomDetails.map((row, i) =>
      i === index ? { ...row, [field]: value } : row
    );
    setClassRoomDetails(updatedRows);
    setClassRoomDetailsActual(updatedRows);
  };

  return (
    <div
      style={{
        border: "1px solid #e0e0e0",
        borderRadius: "10px",
        marginTop: "50px",
        boxShadow: "1px 3px 5px 1px rgba(0, 0, 0, 0.15)",
      }}
    >
      <Grid item md={12} xs={12} sx={styles.BoxHeaderSecondary}>
        {"Class Room Details"}
      </Grid>
      <Grid item md={12} xs={12}>
        <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
          <Table
            aria-label="customized table"
            className="custom-table datasets-table"
          >
            <TableHead>
              <TableRow className="cm_table_head">
                <TableCell
                  style={{ borderRight: "1px solid #e0e0e0", width: "300px" }}
                >
                  Class room number
                </TableCell>
                <TableCell
                  style={{ borderRight: "1px solid #e0e0e0", width: "300px" }}
                >
                  Room Dimension
                </TableCell>
                <TableCell
                  style={{ borderRight: "1px solid #e0e0e0", width: "300px" }}
                >
                  Grade
                </TableCell>
                <TableCell
                  style={{ borderRight: "1px solid #e0e0e0", width: "300px" }}
                >
                  Wall Type
                </TableCell>
                <TableCell
                  style={{ borderRight: "1px solid #e0e0e0", width: "300px" }}
                >
                  Podium Location
                </TableCell>
                <TableCell
                  style={{ borderRight: "1px solid #e0e0e0", width: "300px" }}
                >
                  Dedicated connection for SLC
                </TableCell>
                <TableCell
                  style={{ borderRight: "1px solid #e0e0e0", width: "300px" }}
                >
                  Phase neutral(220V-230V)
                </TableCell>
                <TableCell
                  style={{ borderRight: "1px solid #e0e0e0", width: "300px" }}
                >
                  Neutral Earth(0V-5V)
                </TableCell>
                <TableCell
                  style={{ borderRight: "1px solid #e0e0e0", width: "300px" }}
                >
                  Voltage Variation (Yes/No) Range
                </TableCell>
                <TableCell
                  style={{ borderRight: "1px solid #e0e0e0", width: "300px" }}
                >
                  Distance from server
                </TableCell>
                <TableCell style={{ borderRight: "1px solid #e0e0e0" }}>
                  Site ready
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {classRoomDetails.map((row, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ minWidth: "150px" }}>
                    <TextField
                      value={row.classRoomNumber}
                      onChange={(e) =>
                        handleFieldChange(
                          index,
                          "classRoomNumber",
                          e.target.value
                        )
                      }
                      sx={styles.textField}
                    />
                  </TableCell>
                  <TableCell sx={{ minWidth: "150px" }}>
                    <TextField
                      value={row.roomDimension}
                      onChange={(e) =>
                        handleFieldChange(
                          index,
                          "roomDimension",
                          e.target.value
                        )
                      }
                      sx={styles.textField}
                    />
                  </TableCell>
                  <TableCell sx={{ minWidth: "150px" }}>
                    <TextField
                      value={row.grade}
                      onChange={(e) =>
                        handleFieldChange(index, "grade", e.target.value)
                      }
                      sx={styles.textField}
                    />
                  </TableCell>
                  <TableCell sx={{ minWidth: "150px" }}>
                    <TextField
                      value={row.wallType}
                      onChange={(e) =>
                        handleFieldChange(index, "wallType", e.target.value)
                      }
                      sx={styles.textField}
                    />
                  </TableCell>
                  <TableCell sx={{ minWidth: "150px" }}>
                    <TextField
                      value={row.podiumLocation}
                      onChange={(e) =>
                        handleFieldChange(
                          index,
                          "podiumLocation",
                          e.target.value
                        )
                      }
                      sx={styles.textField}
                    />
                  </TableCell>
                  <TableCell sx={{ minWidth: "150px" }}>
                    <TextField
                      value={row.dedicatedConnectionForSlc}
                      onChange={(e) =>
                        handleFieldChange(
                          index,
                          "dedicatedConnectionForSlc",
                          e.target.value
                        )
                      }
                      sx={styles.textField}
                    />
                  </TableCell>
                  <TableCell sx={{ minWidth: "150px" }}>
                    <TextField
                      value={row.phaseNeutral}
                      onChange={(e) =>
                        handleFieldChange(index, "phaseNeutral", e.target.value)
                      }
                      sx={styles.textField}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={row.neutralEarth}
                      onChange={(e) =>
                        handleFieldChange(index, "neutralEarth", e.target.value)
                      }
                      sx={styles.textField}
                    />
                  </TableCell>
                  <TableCell sx={{ minWidth: "150px" }}>
                    <RadioGroup
                      aria-label="voltage"
                      name="controlled-radio-buttons-group"
                      sx={styles.flexRadio}
                      value={row.VoltageVariation}
                      onChange={(e) =>
                        handleFieldChange(
                          index,
                          "VoltageVariation",
                          e.target.value
                        )
                      }
                    >
                      <FormControlLabel
                        value="yes"
                        control={<Radio />}
                        label="Yes"
                      />
                      <FormControlLabel
                        value="no"
                        control={<Radio />}
                        label="No"
                      />
                    </RadioGroup>
                  </TableCell>
                  <TableCell sx={{ minWidth: "150px" }}>
                    <TextField
                      value={row.distanceFromServer}
                      onChange={(e) =>
                        handleFieldChange(
                          index,
                          "distanceFromServer",
                          e.target.value
                        )
                      }
                      sx={styles.textField}
                    />
                  </TableCell>
                  <TableCell sx={{ minWidth: "150px" }}>
                    <RadioGroup
                      aria-label="gender"
                      name="controlled-radio-buttons-group"
                      sx={styles.flexRadio}
                      value={row.siteReady}
                      onChange={(e) =>
                        handleFieldChange(index, "siteReady", e.target.value)
                      }
                    >
                      <FormControlLabel
                        value="yes"
                        control={<Radio />}
                        label="Yes"
                      />
                      <FormControlLabel
                        value="no"
                        control={<Radio />}
                        label="No"
                      />
                    </RadioGroup>
                  </TableCell>
                  <TableCell>
                    <AddIcon
                      fontSize="large"
                      color="primary"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleAddClassroomDetail(index)}
                    />
                    {index !== 0 && (
                      <RemoveIcon
                        fontSize="large"
                        color="primary"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleDeleteClassroomDetail(index)}
                      />
                    )}
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

const SiteSurvey = ({ implementationData, isSiteSurveyExist }) => {
  const classes = useStyles();

  const standaloneObj = {
    processor: "",
    generation: "",
    HDD: "",
    RAM: "",
    OperatingSystem: "",
    CPUCore: "",
    Internet: "",
    CPUCount: "",
    UPS: "",
    Remarks: "",
  };
  const IFPObj = {
    OperatingSystem: "",
    HDD: "",
    RAM: "",
    Mic: "",
    IFPCount: "",
    Remarks: "",
  };
  const classRoomObj = {
    classRoomNumber: "",
    roomDimension: "",
    grade: "",
    wallType: "",
    podiumLocation: "",
    dedicatedConnectionForSlc: "",
    phaseNeutral: "",
    neutralEarth: "",
    VoltageVariation: "",
    distanceFromServer: "",
    siteReady: "",
  };
  const [internetAvailability, setInternetAvailability] = useState("");
  const [downloadSpeed, setDownloadSpeed] = useState("");
  const [uploadSpeed, setUploadSpeed] = useState("");
  const [networking, setNetworking] = useState("");
  const [internetDetail, setInternetDetail] = useState("");
  const [serverAvailablility, setServerAvailablility] = useState("");
  const [serverNumber, setServerNumber] = useState("");
  const [HDD, setHDD] = useState("");
  const [processorI5, setProcessorI5] = useState("");
  const [processorXeon, setProcessorXeon] = useState("");
  const [otherServer, setOtherServer] = useState("");
  const [outputDevice, setOutputDevice] = useState("");
  const [ups, setUps] = useState("");
  const [port8, setPort8] = useState("");
  const [port16, setPort16] = useState("");
  const [port24, setPort24] = useState("");
  const [standaloneConfig, setStandaloneConfig] = useState([standaloneObj]);
  const [standaloneConfigActual, setStandaloneConfigActual] = useState([]);
  const [IFPConfig, setIFPConfig] = useState([IFPObj]);
  const [IFPConfigActual, setIFPConfigActual] = useState([]);
  const [classRoomDetails, setClassRoomDetails] = useState([classRoomObj]);
  const [classRoomDetailsActual, setClassRoomDetailsActual] = useState([]);
  const [serverQty, setServerQty] = useState("");
  const [HDDQty, setHDDQty] = useState("");
  const [processorI5Qty, setProcessorI5Qty] = useState("");
  const [processorXeonQty, setProcessorXeonQty] = useState("");
  const [otherServerQty, setotherServerQty] = useState("");
  const [outputDeviceInput, setOutputDeviceInput] = useState("");
  const [upsInput, setUpsInput] = useState("");
  const [uploadConsent, setUploadConsent] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState(null);
  const navigate = useNavigate();
  const [isConsentFile, setConcentFile] = useState(null);

  const validation = ({
    internetAvailability,
    downloadSpeed,
    uploadSpeed,
    networking,
    internetDetail,
    uploadConsent,
  }) => {
    // if (
    //   !internetAvailability ||
    //   !downloadSpeed ||
    //   !uploadSpeed ||
    //   !networking ||
    //   !internetDetail ||
    //   !uploadConsent
    // ) {
    //   toast.error("Please Fill Mandatory Fields!");
    //   return false;
    // }
    if (!internetAvailability) {
      toast.error("Please Select Internet Availability");
      return false;
    }
    if (downloadSpeed?.trim() === '') {
      toast.error("Please Add Internet Download Speed");
      return false;
    }
    if (uploadSpeed?.trim() === '') {
      toast.error("Please Add Internet uploadSpeed Speed");
      return false;
    }
    if (!networking) {
      toast.error("Please Select Network");
      return false;
    }
    if (!internetDetail) {
      toast.error("Please Add School Internet Detail");
      return false;
    }

    if (!uploadConsent && !isSiteSurveyExist) {
      toast.error("Please Upload  Consent File");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    const serverConfigurationObj = {
      serverAvailablility: serverAvailablility,
      serverNumber: { mode: serverNumber, quantity: serverQty },
      HDD: { mode: HDD, quantity: HDDQty },
      processorI5: { mode: processorI5, quantity: processorI5Qty },
      processorXeon: { mode: processorXeon, quantity: processorXeonQty },
      otherServer: { mode: otherServer, quantity: otherServerQty },
      outputDevice: { mode: outputDevice, quantity: outputDeviceInput },
      ups: { mode: ups, quantity: upsInput },
    };

    const formDataObj = {
      implementationCode: implementationData?.impFormNumber,
      quotationCode: implementationData?.quotationCode,
      purchaseOrderCode: implementationData?.purchaseOrderCode,
      schoolId: implementationData?.schoolId,
      schoolCode: implementationData?.schoolCode,
      schoolName: implementationData?.schoolName,
      schoolPinCode: implementationData?.schoolPinCode,
      schoolAddress: implementationData?.schoolAddress,
      schoolEmailId: implementationData?.schoolEmailId,
      schoolCountryCode: implementationData?.schoolCountryCode,
      schoolCountryName: implementationData?.schoolCountryName,
      schoolType: implementationData?.schoolType,
      schoolStateCode: implementationData?.schoolStateCode,
      schoolStateName: implementationData?.schoolStateName,
      schoolCityCode: implementationData?.schoolCityCode,
      schoolCityName: implementationData?.schoolCityName,
      productDetails: JSON.stringify(implementationData?.productDetails),
      internetAvailability: internetAvailability,
      downloadSpeed: downloadSpeed,
      uploadSpeed: uploadSpeed,
      networkType: networking,
      serviceProviderDetails: internetDetail,
      serverConfiguration: JSON.stringify(serverConfigurationObj),
      numOfSwitchEightPort: port8 ?? 0,
      numOfSwitchSixteenPort: port16 ?? 0,
      numOfSwitchTwentyFourPort: port24 ?? 0,
      classRoomDetails: JSON.stringify(classRoomDetailsActual),
      standaloneOnlineConfiguration: JSON.stringify(standaloneConfigActual),
      IFPOnlineConfiguration: JSON.stringify(IFPConfigActual),
      createdByName: getUserData("userData")?.name,
      createdByRoleName: getUserData("userData")?.crm_role,
      createdByProfileName: getUserData("userData")?.crm_profile,
      createdByEmpCode: getUserData("userData")?.employee_code,
      createdByUuid: getUserData("loginData")?.uuid,
      modifiedByName: getUserData("userData")?.name,
      modifiedByRoleName: getUserData("userData")?.crm_role,
      modifiedByProfileName: getUserData("userData")?.crm_profile,
      modifiedByEmpCode: getUserData("userData")?.employee_code,
      modifiedByUuid: getUserData("loginData")?.uuid,
      consentFile: uploadConsent,
      siteSurveyCode: isSiteSurveyExist
        ? isSiteSurveyExist?.siteSurveyCode
        : "",
    };

    const isValid = validation({
      internetAvailability,
      downloadSpeed,
      uploadSpeed,
      networking,
      internetDetail,
      uploadConsent,
    });
    if (!isValid) return;

    const formData = new FormData();

    for (const key in formDataObj) {
      if (formDataObj.hasOwnProperty(key) && formDataObj[key] !== undefined && formDataObj[key] !== null) {
        formData.append(`${key}`, formDataObj[key]);
      }
    }

    let response;
    let requestApprovalParams;
    let approvalResponse;
    let isUpdateQuotationStatus;
    let isApprovalError;

    let updateParams = {
      referenceCode: implementationData?.impFormNumber,
      status: QuoteType?.isSSRPENDING,
      modifiedByName: getUserData("userData")?.name,
      modifiedByRoleName: getUserData("userData")?.crm_role,
      modifiedByProfileName: getUserData("userData")?.crm_profile,
      modifiedByEmpCode: getUserData("userData")?.employee_code,
      modifiedByUuid: getUserData("loginData")?.uuid,
    };

    try {
      response = await createSiteSurvey(formData);

      if (response?.result) {
        requestApprovalParams = {
          approvalType: QuoteType?.isSSRIMPLEMENTATIONTYPE,
          groupCode: response?.result?.productDetails?.[0]?.groupCode,
          groupName: response?.result?.productDetails?.[0]?.groupName,
          createdByRoleName: getUserData("userData")?.crm_role,
          referenceCode: response?.result?.siteSurveyCode,
          data: {
            createdByName: getUserData("userData")?.name,
            createdByProfileName: getUserData("userData")?.crm_profile,
            createdByEmpcode: getUserData("userData")?.employee_code,
            createdByUuid: getUserData("loginData")?.uuid
          },
        };


        approvalResponse = await assignApprovalRequest(requestApprovalParams);
        if (approvalResponse?.data?.statusCode === 0) {
          isApprovalError =
            approvalResponse?.data?.error?.errorMessage ?? "Approval Error";
          toast.error(isApprovalError);
          isUpdateQuotationStatus = await updateApprovalStatus(updateParams);
        }
      }
    } catch (e) {
      console.error("Error: ", e);
    }

    if (response?.data?.status === 400) toast.error("**Error!**");
    else {
      toast.success("Success!");
      navigate(`/authorised/site-survey-list`);
    }
  };


  const handleUploadFile = (e) => {
    setSelectedFileName(e.target.files[0].name);
    setUploadConsent(e.target.files[0]);
  };

  const getSSRFormData = (data) => {
    let isAvailability = data?.internetAvailability
      ? isRadioCheck?.isBoolean
      : isRadioCheck?.isNotBoolean;
    let isDownloadSpeed = data?.downloadSpeed;
    let isUploadSpeed = data?.uploadSpeed;
    let isNetworkType = data?.networkType;
    let isInternetDetail = data?.serviceProviderDetails;
    let isServerAvailability = data?.serverConfiguration?.serverAvailablility;
    let isServerMode = data?.serverConfiguration?.serverNumber?.mode;
    let isServerQuantity = data?.serverConfiguration?.serverNumber?.quantity;
    let isHDDMode = data?.serverConfiguration?.HDD?.mode;
    let isHDDQuantity = data?.serverConfiguration?.HDD?.quantity;
    let isProcessorMode = data?.serverConfiguration?.processorI5?.mode;
    let isProcessorQty = data?.serverConfiguration?.processorI5?.quantity;
    let isProcessorXeonMode = data?.serverConfiguration?.processorXeon?.mode;
    let isProcessorXeonQty = data?.serverConfiguration?.processorXeon?.quantity;
    let isOtherServerMode = data?.serverConfiguration?.otherServer?.mode;
    let isOtherServerQty = data?.serverConfiguration?.otherServer?.quantity;
    let isOutputDeviceMode = data?.serverConfiguration?.outputDevice?.mode;
    let isOutputDeviceQty = data?.serverConfiguration?.outputDevice?.quantity;
    let isUpsMode = data?.serverConfiguration?.ups?.mode;
    let isUpsQty = data?.serverConfiguration?.ups?.quantity;
    let isPortEight = data?.numOfSwitchEightPort;
    let isPortSixteen = data?.numOfSwitchSixteenPort;
    let isPortTwentyFour = data?.numOfSwitchTwentyFourPort;
    let isStandaloneOnlineConfiguration = data?.standaloneOnlineConfiguration;
    let isIFPOnlineConfiguration = data?.IFPOnlineConfiguration;
    let isClassRoomDetails = data?.classRoomDetails;
    let isConsentUrl = data?.consentFile;

    if (data) {
      setInternetAvailability(isAvailability);
      setDownloadSpeed(isDownloadSpeed);
      setUploadSpeed(isUploadSpeed);
      setNetworking(isNetworkType);
      setInternetDetail(isInternetDetail);
      setServerAvailablility(isServerAvailability);
      setServerNumber(isServerMode);
      setServerQty(isServerQuantity);
      setHDD(isHDDMode);
      setHDDQty(isHDDQuantity);
      setProcessorI5(isProcessorMode);
      setProcessorI5Qty(isProcessorQty);
      setProcessorXeon(isProcessorXeonMode);
      setProcessorXeonQty(isProcessorXeonQty);
      setOtherServer(isOtherServerMode);
      setotherServerQty(isOtherServerQty);
      setOutputDevice(isOutputDeviceMode);
      setOutputDeviceInput(isOutputDeviceQty);
      setUps(isUpsMode);
      setUpsInput(isUpsQty);
      setPort8(isPortEight);
      setPort16(isPortSixteen);
      setPort24(isPortTwentyFour);
      if (isStandaloneOnlineConfiguration?.length) {
        setStandaloneConfig(isStandaloneOnlineConfiguration);
      }
      setStandaloneConfigActual(isStandaloneOnlineConfiguration);
      if (isIFPOnlineConfiguration?.length) {
        setIFPConfig(isIFPOnlineConfiguration);
      }
      setIFPConfigActual(isIFPOnlineConfiguration);
      if (isClassRoomDetails?.length) {
        setClassRoomDetails(isClassRoomDetails);
      }
      setClassRoomDetailsActual(isClassRoomDetails);
      setConcentFile(isConsentUrl);
    }
  };

  useEffect(() => {
    if (isSiteSurveyExist) {
      getSSRFormData(isSiteSurveyExist);
    }
  }, [isSiteSurveyExist]);

  const handleDownload = (e) => {
    toast.success("Consent downloaded successfully");
  };

  return (
    <div>
      <Grid container spacing={2} sx={styles.primaryStyle}>
        <Grid item md={5} xs={12}>
          Internet Availability in school?
          <span style={{ color: "red" }}>*</span>
        </Grid>
        <Grid item md={5} xs={12}>
          <RadioGroup
            value={internetAvailability}
            onChange={(event) => setInternetAvailability(event.target.value)}
            sx={styles.flexRadio}
          >
            <FormControlLabel value="true" control={<Radio />} label="Yes" />
            <FormControlLabel value="false" control={<Radio />} label="No" />
          </RadioGroup>
        </Grid>

        <Grid item md={5} xs={12}>
          Internet Bandwidth download speed
          <span style={{ color: "red" }}>*</span>
        </Grid>
        <Grid item md={5} xs={12}>
          <TextField
            id="upload-speed"
            variant="outlined"
            value={downloadSpeed}
            onChange={(event) => setDownloadSpeed(event.target.value)}
            fullWidth
            sx={{ ...styles.textField, border: "0px !important" }}
            onKeyDown={handleKeyTextNum}
            onPaste={handleKeyTextNumPaste}
          />
        </Grid>

        <Grid item xs={5}>
          Internet Bandwidth upload speed<span style={{ color: "red" }}>*</span>
        </Grid>
        <Grid item xs={5}>
          <TextField
            id="upload-speed"
            variant="outlined"
            value={uploadSpeed}
            onChange={(event) => setUploadSpeed(event.target.value)}
            fullWidth
            sx={styles.textField}
            onKeyDown={handleKeyTextNum}
            onPaste={handleKeyTextNumPaste}
          />
        </Grid>

        <Grid item md={5} xs={5}>
          Networking (Wired/WiFi)<span style={{ color: "red" }}>*</span>
        </Grid>
        <Grid item md={5} xs={12}>
          <RadioGroup
            value={networking}
            onChange={(event) => setNetworking(event.target.value)}
            sx={styles.flexRadio}
          >
            <FormControlLabel value="Wifi" control={<Radio />} label="Wifi" />
            <FormControlLabel value="Wired" control={<Radio />} label="Wired" />
          </RadioGroup>
        </Grid>

        <Grid item xs={5}>
          School Internet details along with service provider
          <span style={{ color: "red" }}>*</span>
        </Grid>
        <Grid item xs={5}>
          <TextField
            id="upload-speed"
            variant="outlined"
            value={internetDetail}
            onChange={(event) => setInternetDetail(event.target.value)}
            fullWidth
            sx={styles.textField}
            // onKeyDown={handleKeyTextDown}
            // onPaste={handleTextPaste}
          />
        </Grid>

        <Grid item xs={5}>
          Upload Consent
          <span style={{ color: "red" }}>*</span>
        </Grid>
        <Grid item xs={5}>
          <TextField
            autoComplete="off"
            disabled
            className="crm-form-input dark"
            type="upload"
            placeholder={selectedFileName ?? "Upload here"}
            value=""
            InputProps={{
              endAdornment: (
                <IconButton component="label" className="crm-form-input-upload">
                  <input
                    styles={{ display: "none" }}
                    type="file"
                    hidden
                    onChange={(e) => handleUploadFile(e)}
                    // accept=".png,.jpg,.pdf,!.csv,!.xlsx"
                  />
                  Browse
                </IconButton>
              ),
            }}
          />
          {isConsentFile && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "20px",
              }}
            >
              <img
                className="dndIcon"
                src={DownloadIcon}
                alt=""
                style={{ width: "20px", height: "20px" }}
              />
              <a
                style={{
                  cursor: "pointer",
                  color: "rgb(68, 130, 255)",
                  lineHeight: "19px",
                  fontSize: "17px",
                  whiteSpace: "nowrap",
                  fontWeight: "600",
                  textDecorationColor: "rgb(68, 130, 255)",
                  marginRight: "5px",
                  marginLeft: "10px",
                }}
                href={isConsentFile}
                target="_blank"
                onClick={handleDownload}
              >
                Download
              </a>
            </div>
          )}
        </Grid>

        <Grid xs={12} sx={styles.BoxHeader}>
          {"Server Configuration"}
        </Grid>

        <Grid item md={3} xs={12}>
          Available in school
        </Grid>
        <Grid item md={7} xs={12}>
          <RadioGroup
            value={serverAvailablility}
            onChange={(event) => setServerAvailablility(event.target.value)}
            sx={styles.flexRadio}
          >
            <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
            <FormControlLabel value="No" control={<Radio />} label="No" />
          </RadioGroup>
        </Grid>

        <Grid item xs={12}>
          <Divider />
        </Grid>

        <Grid item md={3} xs={3}>
          No. of Server
        </Grid>
        <Grid item md={9} xs={7} sx={styles.flex}>
          <Grid item md={1} xs={1}>
            <Typography>Mode: </Typography>
          </Grid>
          <Grid item md={8} xs={8}>
            <RadioGroup
              value={serverNumber}
              onChange={(event) => setServerNumber(event.target.value)}
              sx={styles.flex}
            >
              <FormControlLabel
                value="Online"
                control={<Radio />}
                label="Online"
              />
              <FormControlLabel
                value="OnCall"
                control={<Radio />}
                label="On call"
              />
              <FormControlLabel
                value="Checksheet"
                control={<Radio />}
                label="Checksheet"
              />
            </RadioGroup>
          </Grid>
          <Grid item md={3} xs={3}>
            <TextField
              id="serverNumberQty"
              variant="outlined"
              placeholder="Add qty"
              value={serverQty}
              onChange={(event) => setServerQty(event.target.value)}
              fullWidth
              size="small"
              sx={styles.textField}
              onKeyDown={handleNumberKeyDown}
            />
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Divider />
        </Grid>

        <Grid item md={3} xs={3}>
          HDD (4 TB)
        </Grid>
        <Grid item md={9} xs={7} sx={styles.flex}>
          <Grid item xs={1}>
            <Typography>Mode: </Typography>
          </Grid>
          <Grid item md={8} xs={8}>
            <RadioGroup
              value={HDD}
              onChange={(event) => setHDD(event.target.value)}
              sx={styles.flex}
            >
              <FormControlLabel
                value="Online"
                control={<Radio />}
                label="Online"
              />
              <FormControlLabel
                value="OnCall"
                control={<Radio />}
                label="On call"
              />
              <FormControlLabel
                value="Checksheet"
                control={<Radio />}
                label="Checksheet"
              />
              <FormControlLabel
                value="RemoteAccess"
                control={<Radio />}
                label="Remote Access"
              />
            </RadioGroup>
          </Grid>
          <Grid item xs={3}>
            <TextField
              id="HDDQty"
              variant="outlined"
              placeholder="Add qty"
              value={HDDQty}
              onChange={(event) => setHDDQty(event.target.value)}
              fullWidth
              size="small"
              sx={styles.textField}
              onKeyDown={handleNumberKeyDown}
            />
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Divider />
        </Grid>

        <Grid item md={3} xs={3}>
          <div>Processor: </div>
          <div style={{ fontSize: "13px", color: "grey" }}>
            core i5 9th Gen or above, <br /> Ram 16GB,
            <br />
            HDD- 4TB storage 7200
          </div>
        </Grid>
        <Grid item md={9} xs={7} sx={styles.flex}>
          <Grid item xs={1}>
            <Typography>Mode: </Typography>
          </Grid>
          <Grid item md={8} xs={8}>
            <RadioGroup
              value={processorI5}
              onChange={(event) => setProcessorI5(event.target.value)}
              sx={styles.flex}
            >
              <FormControlLabel
                value="Online"
                control={<Radio />}
                label="Online"
              />
              <FormControlLabel
                value="OnCall"
                control={<Radio />}
                label="On call"
              />
              <FormControlLabel
                value="Checksheet"
                control={<Radio />}
                label="Checksheet"
              />
              <FormControlLabel
                value="RemoteAccess"
                control={<Radio />}
                label="Remote Access"
              />
            </RadioGroup>
          </Grid>
          <Grid item md={3} xs={3}>
            <TextField
              id="processorI5Qty"
              variant="outlined"
              // label="Add qty"
              placeholder="Add qty"
              value={processorI5Qty}
              onChange={(event) => setProcessorI5Qty(event.target.value)}
              fullWidth
              size="small"
              sx={styles.textField}
              onKeyDown={handleNumberKeyDown}
            />
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Divider />
        </Grid>

        <Grid item md={3} xs={3}>
          <div>Processor: </div>
          <div style={{ fontSize: "13px", color: "grey" }}>
            Xeon 4 Core, <br /> Ram 16GB,
            <br />
            HDD- 4TB storage 7200
          </div>
        </Grid>
        <Grid item md={9} xs={7} sx={styles.flex}>
          <Grid item xs={1}>
            <Typography>Mode: </Typography>
          </Grid>
          <Grid item xs={8}>
            <RadioGroup
              value={processorXeon}
              onChange={(event) => setProcessorXeon(event.target.value)}
              sx={styles.flex}
            >
              <FormControlLabel
                value="Online"
                control={<Radio />}
                label="Online"
              />
              <FormControlLabel
                value="OnCall"
                control={<Radio />}
                label="On call"
              />
              <FormControlLabel
                value="Checksheet"
                control={<Radio />}
                label="Checksheet"
              />
              <FormControlLabel
                value="RemoteAccess"
                control={<Radio />}
                label="Remote Access"
              />
            </RadioGroup>
          </Grid>
          <Grid item md={3} xs={3}>
            <TextField
              id="processorXeonQty"
              variant="outlined"
              placeholder="Add qty"
              value={processorXeonQty}
              onChange={(event) => setProcessorXeonQty(event.target.value)}
              fullWidth
              size="small"
              sx={styles.textField}
              onKeyDown={handleNumberKeyDown}
            />
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Divider />
        </Grid>

        <Grid item md={3} xs={3}>
          <div>Server(Any Other)</div>
          <div style={{ fontSize: "13px", color: "grey" }}>RAM + Processor</div>
        </Grid>
        <Grid item md={9} xs={7} sx={styles.flex}>
          <Grid item xs={1}>
            <Typography>Mode: </Typography>
          </Grid>
          <Grid item md={8} xs={8}>
            <RadioGroup
              value={otherServer}
              onChange={(event) => setOtherServer(event.target.value)}
              sx={styles.flex}
            >
              <FormControlLabel
                value="Online"
                control={<Radio />}
                label="Online"
              />
              <FormControlLabel
                value="OnCall"
                control={<Radio />}
                label="On call"
              />
              <FormControlLabel
                value="Checksheet"
                control={<Radio />}
                label="Checksheet"
              />
              <FormControlLabel
                value="RemoteAccess"
                control={<Radio />}
                label="Remote Access"
              />
            </RadioGroup>
          </Grid>
          <Grid item md={3} xs={3}>
            <TextField
              id="otheServerQty"
              variant="outlined"
              placeholder="Add qty"
              value={otherServerQty}
              onChange={(event) => setotherServerQty(event.target.value)}
              fullWidth
              size="small"
              sx={styles.textField}
              onKeyDown={handleNumberKeyDown}
            />
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Divider />
        </Grid>

        <Grid item md={3} xs={3}>
          Output Device <br />
          (Monitor)Y/N
        </Grid>
        <Grid item md={9} xs={7} sx={styles.flex}>
          <Grid item md={1} xs={1}>
            <Typography>Mode: </Typography>
          </Grid>
          <Grid item md={8} xs={8}>
            <RadioGroup
              value={outputDevice}
              onChange={(event) => setOutputDevice(event.target.value)}
              sx={styles.flex}
            >
              <FormControlLabel
                value="Online"
                control={<Radio />}
                label="Online"
              />
              <FormControlLabel
                value="OnCall"
                control={<Radio />}
                label="On call"
              />
              <FormControlLabel
                value="Checksheet"
                control={<Radio />}
                label="Checksheet"
              />
            </RadioGroup>
          </Grid>
          <Grid
            item
            md={3}
            xs={5}
            sx={{ ...styles.flex, justifyContent: "flex-start !important" }}
          >
            <Grid item md={12} xs={3}>
              <Select
                value={outputDeviceInput}
                onChange={(e) => setOutputDeviceInput(e.target.value)}
                size="small"
                sx={styles.customStyles}
              >
                <MenuItem value={"yes"}>Yes</MenuItem>
                <MenuItem value={"no"}>No</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={2} sx={{ margin: "10px" }}>
              <Typography>Y/N </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Divider />
        </Grid>

        <Grid item md={3} xs={3}>
          UPS 1 KV (Y/N)
        </Grid>
        <Grid item md={9} xs={7} sx={styles.flex}>
          <Grid item xs={1}>
            <Typography>Mode: </Typography>
          </Grid>
          <Grid item md={8} xs={8}>
            <RadioGroup
              value={ups}
              onChange={(event) => setUps(event.target.value)}
              sx={styles.flex}
            >
              <FormControlLabel
                value="Online"
                control={<Radio />}
                label="Online"
              />
              <FormControlLabel
                value="OnCall"
                control={<Radio />}
                label="On call"
              />
              <FormControlLabel
                value="Checksheet"
                control={<Radio />}
                label="Checksheet"
              />
            </RadioGroup>
          </Grid>
          <Grid
            item
            md={3}
            xs={5}
            sx={{ ...styles.flex, justifyContent: "flex-start !important" }}
          >
            <Grid item md={12} xs={3}>
              <Select
                fullWidth
                value={upsInput}
                onChange={(e) => setUpsInput(e.target.value)}
                size="small"
                sx={styles.customStyles}
              >
                <MenuItem value={"yes"}>Yes</MenuItem>
                <MenuItem value={"no"}>No</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={2} sx={{ margin: "10px" }}>
              <Typography>Y/N </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} sx={{ margin: "30px 0px 30px 0px" }}>
          <Divider />
        </Grid>

        <Grid item xs={12} className={classes.lineRelative}>
          <Typography className={classes.heading}>
            Networking Details
          </Typography>
          <span className={classes.underLine} />
        </Grid>

        <Grid item md={5} xs={5}>
          No. of switch 8 Port (1 Gbps)
          <br /> (Managed/unmanaged)
        </Grid>
        <Grid item md={5} xs={5}>
          <TextField
            id="port8"
            variant="outlined"
            value={port8}
            onChange={(event) => setPort8(event.target.value)}
            fullWidth
            sx={styles.textField}
            onKeyDown={handleNumberKeyDown}
          />
        </Grid>

        <Grid item md={5} xs={5}>
          No. of switch 16 Port (1 Gbps)
          <br /> (Managed/unmanaged)
        </Grid>
        <Grid item md={5} xs={5}>
          <TextField
            id="port16"
            variant="outlined"
            value={port16}
            onChange={(event) => setPort16(event.target.value)}
            fullWidth
            sx={styles.textField}
            onKeyDown={handleNumberKeyDown}
          />
        </Grid>

        <Grid item xs={5}>
          No. of switch 24 Port (1 Gbps)
          <br /> (Managed/unmanaged)
        </Grid>
        <Grid item xs={5}>
          <TextField
            id="port24"
            variant="outlined"
            value={port24}
            onChange={(event) => setPort24(event.target.value)}
            fullWidth
            sx={styles.textField}
            onKeyDown={handleNumberKeyDown}
          />
        </Grid>

        <Grid item md={12} xs={12}>
          <StandaloneConfig
            standaloneConfig={standaloneConfig}
            setStandaloneConfig={setStandaloneConfig}
            standaloneObj={standaloneObj}
            standaloneConfigActual={standaloneConfigActual}
            setStandaloneConfigActual={setStandaloneConfigActual}
          />
        </Grid>

        <Grid item xs={12}>
          <IFPConfiguration
            IFPConfig={IFPConfig}
            setIFPConfig={setIFPConfig}
            IFPObj={IFPObj}
            setIFPConfigActual={setIFPConfigActual}
          />
        </Grid>

        <Grid item xs={12}>
          <ClassRoomDetailsForm
            classRoomDetails={classRoomDetails}
            setClassRoomDetails={setClassRoomDetails}
            classRoomObj={classRoomObj}
            setClassRoomDetailsActual={setClassRoomDetailsActual}
          />
        </Grid>

        <Grid item xs={12} sx={styles.flexDiv}>
          <Button
            className={classes.submitBtn}
            variant="outlined"
            type="submit"
            onClick={handleSubmit}
          >
            Submit
          </Button>
          <Button
            className={classes.submitBtn}
            variant="outlined"
            type="submit"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default SiteSurvey;
