import * as React from "react";
import { makeStyles } from "@mui/styles";
import PropTypes from "prop-types";
import CrossIcon from "../../assets/image/crossIcn.svg";
import {
  Tabs,
  Tab,
  Typography,
  Box,
  Modal,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Grid,
  Button,
} from "@mui/material";
//icons
//Tabs
import AllActivities from "./Tabs/AllActivities";
import BdeActivities from "./Tabs/BdeActivities";
import UserActivity from "./Tabs/UserActivity";
import MarketingActivity from "./Tabs/MarketingActivity";
import TrialTaken from "./Tabs/TrialTaken";
import EventAttended from "./Tabs/EventAttended";
import { Link } from "react-router-dom";
import { updateSchool } from "../../config/services/school";
import { toast } from "react-hot-toast";
import ReactSelect from "react-select";
import { useStyles } from "../../css/SchoolDetail-css";
import { handleAlphaNumericPaste, handleAlphaNumericText, handleKeyDown, handlePaste } from "../../helper/randomFunction";
import { ReactComponent as IconNavLeft } from "./../../assets/icons/icon-nav-left-arrow.svg";
import useMediaQuery from "@mui/material/useMediaQuery";


const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  border: "2px solid #fff",
  boxShadow: "0px 0px 4px #0000001A",
  p: 4,
  borderRadius: "4px",
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 6 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function SchoolDetailsTabs(props) {
  const classes = useStyles();
  const [editDemographyDetails, setEditDemographyDetails] =
    React.useState(false);

  let { data, editAddress } = props;
  const [value, setValue] = React.useState(0);
  const [tutionFee, setTutionFee] = React.useState("");
  const [leadId, setLeadId] = React.useState("");
  const [schoolWebsite, setSchoolWeb] = React.useState("");
  const [admissionFee, setAddFee] = React.useState("");
  const [internetImplement, setInternet] = React.useState("");
  const [offeredSubject, setOfferSubject] = React.useState([]);
  const [gstNumber, setGSTNumber] = React.useState("");
  const [tanNumber, setTANNumber] = React.useState("");
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const options = [
    { value: "selectAll", label: "Select All" },
    { value: "Maths", label: "Maths" },
    { value: "Biology", label: "Biology" },
    { value: "Commerce", label: "Commerce" },
    { value: "Humanities", label: "Humanities" },
  ];

  const handleMultiSelect = (selected) => {
    if (selected.some((option) => option.value === "selectAll")) {
      setOfferSubject(options.filter((option) => option.value !== "selectAll"));
    } else {
      setOfferSubject(selected);
    }
  };

  const isSelectAllSelected = () =>
    offeredSubject.length === options.length - 1;

  React.useEffect(() => {
    if (data) {
      setTutionFee(data?.tutionFee);
      setAddFee(data?.admissionFee);
      setInternet(data?.internet);
      setSchoolWeb(data?.schoolWebsite);
      setLeadId(data?.leadId);
      setGSTNumber(data?.gstNumber)
      setTANNumber(data?.tanNumber)
      addSubjectData();
    }
  }, [data]);

  const addSubjectData = () => {
    let subjectData = [];
    if (Array.isArray(data?.subjectOffered)) {
      data?.subjectOffered?.map((obj) => {
        subjectData.push({
          label: obj,
          value: obj,
        });
      });
      setOfferSubject(subjectData);
    }
  };

  const handleUpdate = () => {

    if (gstNumber && gstNumber?.length < 15) {
      toast.error("GSTIN Must Be 15 Digit AlphaNumeric")
      return false
    }
  
    if (tanNumber && tanNumber?.length < 10) {
      toast.error("TAN Must Be 10 Digit AlphaNumeric")
      return false
    }

    let data = {
      leadId: leadId,
      tutionFee: tutionFee,
      schoolWebsite: schoolWebsite,
      admissionFee: admissionFee,
      internet: internetImplement,
      subjectOffered: offeredSubject?.map((obj) => obj?.value),
      gstNumber: gstNumber,
      tanNumber: tanNumber
    };
    updateSchool(data)
      .then((res) => {
        toast.success(res?.message);
        handleEdit();
        window.location.reload(false);
      })
      .catch((err) => {
        console.error(err, "Error in updating school");
      });
  };

  const handleEdit = () => {
    setEditDemographyDetails(!editDemographyDetails);
  };

  const getUniqueOptions = () => {
    let result = options?.filter(
      (item) => !offeredSubject?.find((x) => x.value === item.value)
    );
    return result;
  };

  const SchoolLocationElement = () => {
    return (
      <div className="listing-school-location">
        <Box className="listing-activity-details">
          <div className="activity-details">
            <div className="crm-space-between width-100">
              <h5>School Address</h5>
              <p className={'align-right'}>
                  <Link
                  className="crm-anchor crm-anchor-xs"
                    onClick={editAddress}
                  >
                    Edit
                  </Link>
                </p>
            </div>
            <div className={classes.flexAddBox}>
              <p className={classes.flexAddBoxChild}>
                Country: <b>{data?.country}</b>{" "}
              </p>
              <p className={classes.flexAddBoxChild}>
                State: <b>{data?.state}</b>
              </p>
              <p className={classes.flexAddBoxChild}>
                Pin Code: <b>{data?.pinCode}</b>
              </p>
              <p className={classes.flexAddBoxChild}>
                City: <b>{data?.city}</b>
              </p>
              <p className={''}>
                Address: <b>{data?.address}</b>
              </p>
              
            </div>
          </div>

          <h5>Last Activity: NA</h5>
        </Box>
      </div>
    )
  }


  return (
    <Box className="listing-box1">
      <Box className="listing-basictabs-box2">
        <Tabs
          className="listing-tabs"
          value={value}
          variant="scrollable"
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab className="tabItem" label="Primary Details" {...a11yProps(0)} />
          <Tab
            className="tabItem"
            label="Demographic Details"
            {...a11yProps(1)}
          />
          {/* <Tab className="tabItem" label="Event attended" {...a11yProps(5)} /> */}
        </Tabs>
        <div style={{ height: 3, background: "#DEDEDE", marginTop: -3 }}></div>
      </Box>
      {/* <div className="listing-filter" >
        <img src={FilterIcon} alt="filter_icon" className="listing-filter-icon" />
        <label>Filter</label>
      </div> */}
      <TabPanel value={value} index={0}>
        <div className="listing-school-info">
          <div
            className="listing-school-details"
          >
            <div className="listing-school-details-context">
              {`School Code: ${data?.schoolCode}`} | 
              {`Type of Institute : ${data?.typeOfInstitute || 'NA'}`} | 
              {data?.associateInstitute && (
                <>
                  {`Associate Schools : ${data?.associateInstitute}`} | 
                </>
              )}
              {
                data?.schoolEmailId?.trim()?.length > 0 && (
                  <>
                    {`Email: ${data?.schoolEmailId}`} | 
                  </>
                )
              }
              {`Total Students: ${data?.totalStudent || 'NA'}`} | 
              {`Total Teacher: ${data?.totalTeacher || 'NA'}`} | 
              {`Competitor Name: ${data?.competitorName || 'NA'}`} | 
              {`Board: ${data?.board}`}
              {
                data?.classes?.length > 0 && (
                  <>
                {
                  `| Classes: ${
                    data?.classes
                      ? data?.classes?.map((obj) => obj?.label)?.join()
                      : "NA"
                  }`
                }
              </>
                )
                }
            </div>
          </div>
          <SchoolLocationElement  />
        </div>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <div className="listing-school-info">
          <div
            className="listing-school-details"
          >
            <div className="listing-school-details-context">
              <div className="listing-school-details-context-info">
                {`Website: ${data?.schoolWebsite?.[0] || 'NA'}`} | 
                {`Internet Facility : ${data?.internet}`} | 
                {`Admission Fee: ${data?.admissionFee || 'NA'}`} | 
                {`Tution Fee: ${data?.tutionFee || 'NA'}`} | 
                {`Subject Offered: ${
                  Array.isArray(data?.subjectOffered)
                    ? data?.subjectOffered?.join()
                    : "MA"
                }`} | 
                { data?.gstNumber && (
                  <>
                  {
                    `GST No: ${data?.gstNumber || 'NA'}`
                  }
                </>
                )} | 
                { data?.tanNumber && (
                  <>
                  {
                    `TAN No: ${data?.tanNumber || 'NA'}`
                  }
                </>
                )}
              </div>
              <div className="listing-school-details-context-info-anchor" >
                <Link className="crm-anchor crm-anchor-xs" onClick={handleEdit}>Edit</Link>
              </div>
            </div>
          </div>
          <SchoolLocationElement />
        </div>
      </TabPanel>
      {editDemographyDetails && (
        <>
          {
            isMobile
              ? <Modal
                  hideBackdrop={true}
                  open={editDemographyDetails}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                  className="crm-theme-modal-full"
                >
                  <Box className="crm-theme-modal-full-container" >
                    <Box className="crm-theme-modal-full-header">
                        <Link
                          key="99"
                          color="inherit"
                          to={".."}
                          onClick={(e) => {
                            e.preventDefault();
                            setEditDemographyDetails(false)
                          }}
                          className=""
                        >
                          <IconNavLeft className="crm-inner-nav-left" />{" "}
                        </Link>
                        <Typography component="h2" className="">
                          Update Demographic Details
                        </Typography>
                      </Box>
                    <Box className="crm-theme-modal-full-content">
                      
                      <Grid container spacing={2.5} >
                        <Grid item md={4} xs={12}>
                          <Typography className="crm-theme-modal-full-form-label">School Website</Typography>
                          <input
                            className="crm-form-input dark"
                            name={schoolWebsite}
                            type="text"
                            placeholder="Enter School Website"
                            value={schoolWebsite}
                            onChange={(e) =>
                              setSchoolWeb(e.target.value)
                            }
                          />
                        </Grid>
                        <Grid item md={4} xs={12}>
                          <Typography className="crm-theme-modal-full-form-label mb-0">Internet Implementation</Typography>
                          <RadioGroup
                            row
                            aria-label="internetImplement"
                            name={internetImplement}
                            value={internetImplement}
                            onChange={(e) => setInternet(e.target.value)}
                          >
                            <FormControlLabel
                              value="Yes"
                              control={<Radio />}
                              label="Yes"
                            />
                            <FormControlLabel
                              value="No"
                              control={<Radio />}
                              label="No"
                            />
                          </RadioGroup>
                        </Grid>
                        <Grid item md={4} xs={12}>
                          <Typography className="crm-theme-modal-full-form-label">Subject Offered 10th & 12th</Typography>
                          <Box className="crm-theme-modal-full-select-items">
                            <ReactSelect
                              className="crm-form-input crm-react-select dark width-150p"
                              classNamePrefix="select"
                              options={
                                offeredSubject?.length > 0
                                  ? getUniqueOptions()
                                  : options
                              }
                              isMulti
                              value={offeredSubject}
                              onChange={handleMultiSelect}
                              placeholder={(offeredSubject?.length > 0) ? `Subjects (${offeredSubject?.length})` : `Subjects`}
                              isOptionSelected={isSelectAllSelected}
                              getOptionLabel={(option) => option.label}
                              getOptionValue={(option) => option.value}
                              sx={{ width: "100%" }}
                              controlShouldRenderValue={false} 
                              isClearable={true}
                            />
                            {
                              (offeredSubject?.length > 0)
                                ? offeredSubject?.map((item, i) => (
                                    <Box key={i} className="crm-form-select-selected-value-box" onClick={() => {setOfferSubject(offeredSubject?.filter(obj => obj !== item))}}>
                                      <span>{item?.value}</span>
                                    </Box>
                                  ))
                                : null
                            }
                          </Box>
                        </Grid>
                        <Grid item md={4} xs={12}>
                          <Typography className="crm-theme-modal-full-form-label">Admission Fee</Typography>
                          <input
                            className="crm-form-input dark"
                            name={admissionFee}
                            type="number"
                            placeholder="INR"
                            value={admissionFee}
                            onChange={(e) => setAddFee(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onPaste={handlePaste}
                          />
                        </Grid>
                        <Grid item md={4} xs={12}>
                          <Typography className="crm-theme-modal-full-form-label">Tution Fee</Typography>
                          <input
                            className="crm-form-input dark"
                            name={tutionFee}
                            type="number"
                            placeholder="INR"
                            value={tutionFee}
                            onChange={(e) => setTutionFee(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onPaste={handlePaste}
                          />
                        </Grid>
                        <Grid item md={4} xs={12}>
                          <Typography className="crm-theme-modal-full-form-label">GSTIN</Typography>
                          <input
                            className="crm-form-input dark"
                            name={gstNumber}
                            type="text"
                            placeholder="Enter GST Number"
                            value={gstNumber}
                            onChange={(e) =>
                              setGSTNumber(e.target.value)
                            }
                            onKeyDown={handleAlphaNumericText}
                            onPaste={handleAlphaNumericPaste}
                            maxLength={15}
                          />
                        </Grid>
                        <Grid item md={4} xs={12}>
                          <Typography className="crm-theme-modal-full-form-label">TAN Number</Typography>
                          <input
                            className="crm-form-input dark"
                            name={tanNumber}
                            type="text"
                            placeholder="Enter Number"
                            value={tanNumber}
                            onChange={(e) =>
                              setTANNumber(e.target.value)
                            }
                            onKeyDown={handleAlphaNumericText}
                            onPaste={handleAlphaNumericPaste}
                            maxLength={10}
                          />
                        </Grid>
                      </Grid>
        
                      <Box className={'crm-theme-modal-full-footer-relative'} sx={{display: 'flex', justifyContent: 'center', padding: '20px'}}>
                        <Button
                          className='crm-btn crm-btn-outline crm-btn-lg mr-1'
                          onClick={() => handleEdit()}
                        >
                          Cancel
                        </Button>
                        <Button
                          className='crm-btn crm-btn-primary crm-btn-lg'
                          onClick={() => handleUpdate()}
                        >
                          Update
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </Modal>

              : <Modal
                  hideBackdrop={true}
                  open={editDemographyDetails}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                  className="targetModal1"
                >
                  <Box
                    sx={style}
                    className="modalContainer"
                    style={{ 
                      borderRadius: "8px",
                      width: (window.innerWidth < 1024) ? '90%' : "800px",
                      height: (window.innerWidth < 1024) ? '80%' : "auto",
                      overflow: 'auto',
                      padding: '20px'
                    }}
                  >
                    <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                      <Box sx={{ padding: "20px 0" }}>
                        <div style={{ textAlign: "center" }}>
                          <h2>Update Demographic Details</h2>
                        </div>
                      </Box>
                      <Grid container spacing={3} >
                        <Grid item md={4} xs={12}>
                          <Typography className={classes.label}>School Website</Typography>
                          <input
                            className={classes.inputStyle}
                            name={schoolWebsite}
                            type="text"
                            placeholder="Enter School Website"
                            value={schoolWebsite}
                            onChange={(e) =>
                              setSchoolWeb(e.target.value)
                            }
                          />
                        </Grid>
                        <Grid item md={4} xs={12}>
                          <Typography className={classes.label}>Internet Implementation</Typography>
                          <RadioGroup
                            row
                            aria-label="internetImplement"
                            name={internetImplement}
                            value={internetImplement}
                            onChange={(e) => setInternet(e.target.value)}
                          >
                            <FormControlLabel
                              value="Yes"
                              control={<Radio />}
                              label="Yes"
                            />
                            <FormControlLabel
                              value="No"
                              control={<Radio />}
                              label="No"
                            />
                          </RadioGroup>
                        </Grid>
                        <Grid item md={4} xs={12}>
                          <Typography className={classes.label}>Subject Offered 10th & 12th</Typography>
                          <ReactSelect
                              classNamePrefix="select"
                              options={
                                offeredSubject?.length > 0
                                  ? getUniqueOptions()
                                  : options
                              }
                              isMulti
                              value={offeredSubject}
                              onChange={handleMultiSelect}
                              placeholder="Select Subjects"
                              isOptionSelected={isSelectAllSelected}
                              getOptionLabel={(option) => option.label}
                              getOptionValue={(option) => option.value}
                              sx={{ width: "100%" }}
                            />
                        </Grid>
                        <Grid item md={4} xs={12}>
                          <Typography className={classes.label}>Admission Fee</Typography>
                          <input
                            className={classes.inputStyle}
                            name={admissionFee}
                            type="number"
                            placeholder="INR"
                            value={admissionFee}
                            onChange={(e) => setAddFee(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onPaste={handlePaste}
                          />
                        </Grid>
                        <Grid item md={4} xs={12}>
                          <Typography className={classes.label}>Tution Fee</Typography>
                          <input
                            className={classes.inputStyle}
                            name={tutionFee}
                            type="number"
                            placeholder="INR"
                            value={tutionFee}
                            onChange={(e) => setTutionFee(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onPaste={handlePaste}
                          />
                        </Grid>
                        <Grid item md={4} xs={12}>
                          <Typography className={classes.label}>GSTIN</Typography>
                          <input
                            className={classes.inputStyle}
                            name={gstNumber}
                            type="text"
                            placeholder="Enter GST Number"
                            value={gstNumber}
                            onChange={(e) =>
                              setGSTNumber(e.target.value)
                            }
                            onKeyDown={handleAlphaNumericText}
                            onPaste={handleAlphaNumericPaste}
                            maxLength={15}
                          />
                        </Grid>
                        <Grid item md={4} xs={12}>
                          <Typography className={classes.label}>TAN Number</Typography>
                          <input
                            className={classes.inputStyle}
                            name={tanNumber}
                            type="text"
                            placeholder="Enter Number"
                            value={tanNumber}
                            onChange={(e) =>
                              setTANNumber(e.target.value)
                            }
                            onKeyDown={handleAlphaNumericText}
                            onPaste={handleAlphaNumericPaste}
                            maxLength={10}
                          />
                        </Grid>
                      </Grid>
        
                      <Grid className={classes.flkGRIDBox}>
                        <Button
                          className={classes.submitBtn}
                          onClick={() => handleEdit()}
                        >
                          Cancel
                        </Button>
                        <Button
                          className={classes.submitBtn}
                          onClick={() => handleUpdate()}
                        >
                          Update
                        </Button>
                      </Grid>
                    </Box>
                  </Box>
                </Modal>
          }
        </>
        
      )}
    </Box>
  );
}
