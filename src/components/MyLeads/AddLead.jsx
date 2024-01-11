import { RegisterUser } from "../../config/services/studentRegister.jsx";
import { UserOtpVerify } from "../../config/services/verifyOtp.jsx";
import OtpInput from "react-otp-input";
import React, { useState, useEffect, useRef } from "react";
import Page from "../../components/Page";
import {
  Grid,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  Modal,
  Box,
  LinearProgress,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import ReactSelect from "react-select";
import { getBoardList, getChildList } from "../../config/services/lead";
import Env_Config from "../../../src/config/settings";
import { getUserData } from "../../helper/randomFunction/localStorage";
import { toast } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { UserRegisterValidate } from "../../helper/UserRegsiterValidation";
import {
  getCityData,
  getLearningProfile,
  getStateData,
} from "../../helper/DataSetFunction";
import { userAddLeadAssign } from "../../config/services/createLeadAssign";
import { createInterest } from "../../config/services/createInterest";
import { UpdateTnc } from "../../config/services/tncUpdated";
import { isUserExist } from "../../helper/ProfileData";
import { USER_TYPE } from "../../constants/general.jsx";
import { getLoginUserData } from "../../helper/randomFunction.js";
import { activityLogger } from "../../config/services/activities.jsx";

const useStyles = makeStyles((theme) => ({
  cusCard: {
    padding: "18px",
    boxShadow: "0px 0px 8px #00000029",
    borderRadius: "8px",
    margin: "0.5rem 1rem",
  },
  title: {
    fontSize: "16px",
    fontWeight: "600",
    lineHeight: "16px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    marginBottom: "6px",
  },
  inputStyle: {
    fontSize: "1rem",
    padding: "8.8px",
    width: "100%",
    borderRadius: "4px",
    border: "1px solid #DEDEDE",
  },
  btnSection: {
    padding: "1rem 1rem 2rem 1rem",
    textAlign: "right",
  },
  submitBtn: {
    backgroundColor: "#f45e29",
    border: "1px solid #f45e29",
    borderRadius: "4px !important",
    color: "#ffffff !important",
    padding: "6px 16px !important",
    "&:hover": {
      color: "#f45e29 !important",
    },
  },
  rowBtn: {
    position: "absolute",
    right: "-1.7rem",
    top: "2.1rem",
    width: "1.2rem !important",
    cursor: "pointer",
    opacity: "0.3",
    "&:hover": {
      opacity: "0.6",
    },
  },
  CstmBoxGrid: {
    padding: "0 !important",
    position: "relative",
  },
}));

export default function AddLead() {
  const classes = useStyles();
  const [customerType, setCustomerType] = useState({
    label: "Select Customer",
    value: null,
  });
  const [name, setName] = useState("");
  const [selectedInterest, setSelectedInterest] = useState({
    label: "Select Interest",
    value: null,
  });
  const loginData = getLoginUserData();
  const [phone, setPhone] = useState("");
  const [isMobParams, setUrlParam] = useState(false);
  const [isUserName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [isdCode, setIsdCode] = useState("91");
  const [referredBy, setReferredBy] = useState("employee");
  const [employeeCode, setEmployeeCode] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [shw_modal, setModalStatus] = useState(false);
  const [otpVerify, setOtpVerify] = useState("");
  const [isUpadateProfile, setUpdateUUId] = useState("");
  const [close_modal, setModalClose] = useState(true);
  const [shw_loader, setDisplayLoader] = useState(false);
  const [requestStamp, setRequestStamp] = useState("");

  const [interestSelectData, setInterestSelectData] = useState([]);
  const [isQueryParam, setQueryParam] = useState(null);
  const [boardSelectData, setBoardSelectData] = useState([]);
  const [classSelectData, setClassSelectData] = useState([]);
  const [stateSelectData, setStateSelectData] = useState(null);
  const [citySelectData, setCitySelectData] = useState(null);
  const navigate = useNavigate();
  const formRef = useRef();
  const [boardClassData, setBoardClassData] = useState([
    {
      selectedBoard: null,
      selectedClass: null,
    },
  ]);

  const [board, setBoard] = useState({
    label: "Select Board",
    value: null,
  });

  const [boardClass, setBoardClass] = useState({
    label: "Select Class",
    value: null,
  });

  const [getState, setStateData] = useState({
    label: "Select State",
    value: null,
  });

  const [city, setCity] = useState({
    label: "Select City",
    value: null,
  });

  const [inputCity, setInputCity] = useState("");

  const options = [
    { value: 1, label: "Student" },
    { value: "parent", label: "Parent" },
    { value: "home-tuition", label: "Home Tuition" },
    { value: "institute", label: "Institute" },
    { value: "teacher", label: "Teacher" },
  ];

  useEffect(() => {
    getStateResult();
    getInterestData();
    getBoardListHandler();
  }, []);

  useEffect(() => {
    getChildListHandler();
    console.log(city);
    if (city && city.value) {
      setCity({
        label: "Select City",
        value: null,
      });
    }
  }, [boardClass, board]);

  useEffect(() => {
    if (getState && getState.value) {
      getCityResult();
      setCity({
        label: "Select City",
        value: null,
      });
    }
  }, [getState]);

  useEffect(() => {
    const getData = setTimeout(() => {
      if (getState && getState.value) {
        getCityResult(inputCity);
      }
    }, 500);

    return () => clearTimeout(getData);
  }, [inputCity]);

  let location = useLocation();

  const redirectPage = (order_id) => {
    let empId = getUserData("userData")?.employee_code;
    let orderNumber = atob(`${order_id}`);
    let encodeUrl = btoa(`${empId}!==!${isUpadateProfile}!==!${orderNumber}`);

    let url = `${Env_Config.OMS_API_URL}/orderpunch/${encodeUrl}`;
    return { url };
  };

  useEffect(() => {
    let queryParams = new URLSearchParams(location?.search);

    let mobile_params = queryParams.get("mobile");
    queryParams = queryParams.get("orderId");
    if (mobile_params) {
      try {
        mobile_params = atob(`${mobile_params}`)?.slice(-10);
        setPhone(mobile_params);
        setUrlParam(true);
      } catch (err) {
        setPhone("");
        setUrlParam(true);
      }
    } else {
      setPhone("");
      setUrlParam(false);
    }

    setQueryParam(queryParams);

    if (isUpadateProfile) {
      if (isQueryParam) {
        let getorderPunchUrl = redirectPage(isQueryParam)?.url;
        navigate("/authorised/create-order", {
          state: { id: 1, redirectUrl: getorderPunchUrl },
        });
      } else {
        navigate(`/authorised/listing-details/${isUpadateProfile}`);
      }
    }
  }, [close_modal]);

  const getInterestData = async () => {
    getLearningProfile()
      .then((res) => {
        res = res?.loadResponses?.[0]?.data;
        let IntrestData = [];
        res?.forEach((data) => {
          IntrestData.push({
            value: data?.["LearningProfileMaster.profileName"],
            label: data?.["LearningProfileMaster.profileName"],
          });
          setInterestSelectData(IntrestData);
        });
      })
      .catch((err) => {
        console.error(err?.response);
      });
  };

  const getBoardListHandler = async () => {
    let params = { params: { boardStage: 1, sapVisibility: 1 } };
    getBoardList(params)
      .then((res) => {
        let boardFormattedData = [];
        res?.data?.data?.forEach((element) => {
          boardFormattedData.push({
            value: element.board_id,
            label: element.name,
          });
          setBoardSelectData(boardFormattedData);
        });
      })
      .catch((err) => {
        if (err.response.status == 401) {
          getBoardListHandler();
        }
        console.error(err?.response);
      });
  };

  const getChildListHandler = async () => {
    let params = { params: { boardId: 180, syllabusId: 180 } };
    getChildList(params)
      .then((res) => {
        let classFormattedData = [];
        res?.data?.data?.child_list.forEach((element) => {
          classFormattedData.push({
            value: element.syllabus_id,
            label: element.name,
          });
          setClassSelectData(classFormattedData);
        });
      })
      .catch((err) => {
        if (err.response.status == 401) {
          getChildListHandler();
        }
        console.error(err?.response);
      });
  };

  const getStateResult = async () => {
    try {
      let stateDataOption = [];
      let res = await getStateData();
      res = res?.loadResponses?.[0]?.data;
      res?.map((data) => {
        stateDataOption.push({
          label: data?.["CountryCityStateMapping.stateName"],
          value: data?.["CountryCityStateMapping.stateName"],
        });
      });
      setStateSelectData(stateDataOption);
    } catch (err) {
      console.error(err?.response);
    }
  };

  const onCitySearch = (e) => {
    console.log(e.key, "testKey");
    let str = "";
    const charArr =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
    if (e.key == "Backspace") {
      str = inputCity.slice(0, -1);
    } else if (charArr.indexOf(e.key) > -1) {
      str = inputCity + e.key;
    } else {
      //console.log(e)
    }
    setInputCity(str);
  };

  const getCityResult = async (cityName) => {
    try {
      let stateDataOption = [];
      let res = await getCityData(getState?.value, cityName);
      res = res.rawData();
      res?.map((data) => {
        stateDataOption.push({
          label: data?.["CountryCityStateMapping.cityName"],
          value: data?.["CountryCityStateMapping.cityName"],
        });
      });
      setCitySelectData(stateDataOption);
    } catch (err) {
      console.error(err?.response);
    }
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  };

  const handleOtpChange = (otp) => setOtpVerify(otp);

  const onhanDleClose = () => {
    setModalClose(false);
    setModalStatus(false);
  };

  const onSubmitHandler = async () => {
    let params = {
      name: name,
      phone: phone,
      employeeCode: employeeCode ? employeeCode : customerName,
      board: board,
      boardClass: boardClass,
      selectedInterest: selectedInterest,
      city: city,
      referredBy: referredBy,
      getState: getState,
      userType: "STUDENT",
    };
    let checkValidtion = UserRegisterValidate(params);
    let activityData = {};
    if (!checkValidtion) {
      setDisplayLoader(true);
      var isExist = await isUserExist({ actualMobile: phone, mobile: phone });

      switch (isExist?.message_code) {
        case "LO002":
          let userTypeId = USER_TYPE.find(
            (obj) => obj.label.toUpperCase() == params.userType.toUpperCase()
          );
          if (userTypeId) {
            if (userTypeId.id == isExist.user_type) {
              if (isMobParams) {
                addSibling(params);
              } else {
                activityData = {
                  empCode: loginData?.userData?.employee_code,
                  landing_page: "Add User Page",
                  action: "Add User",
                  event_type: "Add User",
                  eventStep: "Already Exists",
                  click_type: "Add User",
                  eventData: { payload: params, response: isExist },
                };
                activityLogger(activityData);
                setDisplayLoader(false);
                toast.error("User Already Exist!!");
              }
            } else {
              addSibling(params);
            }
          } else {
            setDisplayLoader(false);
            toast.error("User Already Exist!!");
          }

          break;

        case "LO010":
          activityData = {
            empCode: loginData?.userData?.employee_code,
            landing_page: "Add User Page",
            action: "Add User",
            event_type: "Add User",
            eventStep: "Error While Adding",
            click_type: "Add User",
            eventData: { payload: params, response: isExist },
          };
          activityLogger(activityData);
          setDisplayLoader(false);
          toast.error(isExist?.entity_message);
          break;

        default:
          const data = await isRegisterExitUser();
          activityData = {
            empCode: loginData?.userData?.employee_code,
            landing_page: "Add User Page",
            action: "Add User",
            event_type: "Add User",
            eventStep: "Success",
            click_type: "Add User",
            eventData: { payload: params, response: data },
          };
          activityLogger(activityData);
          if (data?.status === 1) {
            setUpdateUUId(data?.uuid);
            setModalStatus(true);
          }
      }
    } else {
      toast.error(checkValidtion);
    }
  };

  const addSibling = async (params) => {
    let is_sibling = true;
    const data = await isRegisterExitUser(is_sibling);
    let activityData = {
      empCode: loginData?.userData?.employee_code,
      landing_page: "Add User Page",
      action: "Add User",
      event_type: "Add Sibling",
      eventStep: "Sibling Success",
      click_type: "Add Sibling",
      eventData: { payload: params, response: data },
    };
    activityLogger(activityData);
    if (data?.status === 1) {
      setUpdateUUId(data?.uuid);
      setModalStatus(true);
    }
  };

  const isRegisterExitUser = async (is_sibling) => {
    var date = new Date().getTime();
    const Data = {
      name: name,
      username: `${phone}${date}`,
      email: email,
      mobile: phone,
      employeeCode: employeeCode,
      city: city?.value,
      state: getState?.value,
      registerType: 1,
      is_sibling: is_sibling ? "1" : "",
      referredBy: referredBy,
      customerName: customerName,
      userType: "STUDENT",
    };

    setUserName(Data?.username);

    const data = await RegisterUser(Data);
    if (data?.status === 1) {
      let uuid = data?.uuid;
      let request_timestamp = data?.request_timestamp;

      let InterestParams = {
        lead_id: uuid,
        board: board?.label,
        classData: boardClass?.label,
        selectedInterest: selectedInterest?.label,
        referredBy: referredBy,
      };

      let addLeadRes = await userAddLeadAssign(Data, uuid);
      let interestRes = await createInterest(InterestParams);

      if (addLeadRes === "fulfilled" && interestRes === 1) {
        toast.success(data?.message);
        setDisplayLoader(false);
        setUpdateUUId(uuid);
        setRequestStamp(request_timestamp);
        setModalStatus(true);
      } else {
        toast.error("API RESPONSE ERROR");
        setDisplayLoader(false);
        navigate("/authorised/add-lead");
      }
    } else {
      toast.error(data?.message);
      setDisplayLoader(false);
    }
  };

  const onVerifyOtp = async (event) => {
    event.preventDefault();
    let params = {
      username: isUserName,
      otpVerify: otpVerify,
      requestStamp: requestStamp,
    };
    const data = await UserOtpVerify(params);

    if (data?.status === 1) {
      UpdateTnc(isUpadateProfile);
      toast.success(data?.message);
      setModalStatus(false);

      if (isQueryParam) {
        let getorderPunchUrl = redirectPage(isQueryParam)?.url;
        navigate("/authorised/create-order", {
          state: { id: 1, redirectUrl: getorderPunchUrl },
        });
      } else {
        navigate(`/authorised/listing-details/${isUpadateProfile}`);
      }
    } else {
      toast.error(data?.message);
    }
  };

  /* const isUserExist = async () => {
    const data = await isUserRegister(phone,isdCode)
    return data
  } */

  function handleKeyPress(event) {
    // for submitting otp pop-up form on pressing enter key
    if (event.key === "Enter") {
      formRef.current.submit();
    }
  }

  return (
    <>
      <Page
        title="Extramarks | Add Lead"
        className="main-container myLeadPage datasets_container"
      >
        <div>{shw_loader ? <LinearProgress /> : ""}</div>
        <div>
          <Grid className={classes.cusCard}>
            <Grid container spacing={3} sx={{ pt: "8px", pb: "24px" }}>
              <Grid item xs={12}>
                <Typography className={classes.title}>
                  Manual Lead Creation
                </Typography>
              </Grid>
            </Grid>

            <>
              <Grid container spacing={3} sx={{ py: "8px" }}>
                <Grid item md={4} xs={12}>
                  <Grid>
                    <Typography className={classes.label}>Name*</Typography>
                    <input
                      className={classes.inputStyle}
                      name="name"
                      type="text"
                      placeholder="Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Grid>
                </Grid>

                <Grid item md={4} xs={12}>
                  <Grid>
                    <Typography className={classes.label}>Interest*</Typography>
                    <ReactSelect
                      classNamePrefix="select"
                      options={interestSelectData}
                      value={selectedInterest}
                      onChange={(e) =>
                        setSelectedInterest({
                          label: e.label,
                          value: e.value,
                        })
                      }
                    />
                  </Grid>
                </Grid>

                <Grid item md={4} xs={12}>
                  <p className={classes.label}>Board *</p>
                  <ReactSelect
                    classNamePrefix="select"
                    value={board}
                    options={boardSelectData}
                    onChange={(e) =>
                      setBoard({ label: e.label, value: e.value })
                    }
                  />
                </Grid>
              </Grid>

              <Grid container spacing={3} sx={{ pb: "8px" }}>
                <Grid item md={4} xs={12}>
                  <p className={classes.label}>Class *</p>
                  <ReactSelect
                    classNamePrefix="select"
                    value={boardClass}
                    options={classSelectData}
                    onChange={(e) =>
                      setBoardClass({
                        label: e.label,
                        value: e.value,
                      })
                    }
                  />
                </Grid>

                <Grid item md={4} xs={12}>
                  <p className={classes.label}>Phone*</p>
                  <input
                    className={classes.inputStyle}
                    name="phone"
                    type="number"
                    placeholder="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    readOnly={isMobParams}
                  />
                </Grid>

                <Grid item md={4} xs={12}>
                  <Grid>
                    <Typography className={classes.label}>State *</Typography>
                    <ReactSelect
                      classNamePrefix="select"
                      value={getState}
                      options={stateSelectData}
                      onChange={(e) =>
                        setStateData({
                          label: e.label,
                          value: e.value,
                        })
                      }
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid container spacing={3} sx={{ py: "8px" }}>
                <Grid item md={4} xs={12}>
                  <Grid>
                    <Typography className={classes.label}>City *</Typography>
                    <ReactSelect
                      classNamePrefix="select"
                      value={city}
                      options={citySelectData}
                      onKeyDown={onCitySearch}
                      onBlur={(e) => setInputCity("")}
                      onChange={(e) =>
                        setCity({
                          label: e.label,
                          value: e.value,
                        })
                      }
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid container spacing={3} sx={{ py: "8px" }}>
                {/* <Grid item md={4} xs={12}>
                    <Grid>
                      <Typography className={classes.label}>ISD Code*</Typography>
                      <RadioGroup row aria-label="isdCode" name="isdCode" value={isdCode} onChange={(e) => setIsdCode(e.target.value)}>
                        <FormControlLabel value="91" control={<Radio />} label="+91" />
                        <FormControlLabel value="971" control={<Radio />} label="+971" />
                      </RadioGroup>
                    </Grid>
                  </Grid> */}
              </Grid>
              <Grid container spacing={3} sx={{ py: "8px" }}>
                <Grid item md={4} xs={12}>
                  <Grid>
                    <Typography className={classes.label}>
                      Referred by*
                    </Typography>
                    <RadioGroup
                      row
                      aria-label="referredBy"
                      name="referredBy"
                      value={referredBy}
                      onChange={(e) => setReferredBy(e.target.value)}
                    >
                      <FormControlLabel
                        value="employee"
                        control={<Radio />}
                        label="Employee"
                      />
                      <FormControlLabel
                        value="customer"
                        control={<Radio />}
                        label="Customer"
                      />
                    </RadioGroup>
                  </Grid>
                </Grid>
              </Grid>
              <Grid container spacing={3} sx={{ py: "8px" }}>
                <Grid item md={4} xs={12}>
                  {referredBy == "employee" ? (
                    <Grid>
                      <Typography className={classes.label}>
                        Employee Code*
                      </Typography>
                      <input
                        className={classes.inputStyle}
                        name="employeeCode"
                        type="text"
                        placeholder="Employee Code"
                        value={employeeCode}
                        onChange={(e) => setEmployeeCode(e.target.value)}
                      />
                    </Grid>
                  ) : (
                    <Grid>
                      <Typography className={classes.label}>
                        Customer Name*
                      </Typography>
                      <input
                        className={classes.inputStyle}
                        name="customerName"
                        type="text"
                        placeholder="Customer Name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                      />
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </>
          </Grid>

          {!shw_loader ? (
            <Grid className={classes.btnSection}>
              <Button
                className={classes.submitBtn}
                onClick={() => onSubmitHandler()}
              >
                Submit
              </Button>
            </Grid>
          ) : (
            ""
          )}
        </div>

        {shw_modal ? (
          <Modal
            open={shw_modal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <form onSubmit={onVerifyOtp} ref={formRef}>
                <div className="mdl_close">
                  <img src="/cancel_icon.svg" onClick={onhanDleClose} />
                </div>
                <Typography
                  id="modal-modal-title"
                  sx={{ textAlign: "center" }}
                  variant="h6"
                  component="h2"
                >
                  Enter OTP
                </Typography>
                <Typography
                  id="modal-modal-description"
                  sx={{ padding: "30px 0" }}
                >
                  <OtpInput
                    numInputs={6}
                    value={otpVerify}
                    onChange={handleOtpChange}
                    onKeyPress={handleKeyPress}
                    className="testOtpBox"
                    isInputNum={true}
                    shouldAutoFocus={true}
                    separator={
                      <span>
                        {" "}
                        <div className="mdlboxGap" />{" "}
                      </span>
                    }
                  />
                </Typography>
                <div className="" style={{ marginLeft: "125px" }}>
                  <button className="verifyOtpbtn" type="submit">
                    Verify
                  </button>
                </div>
              </form>
            </Box>
          </Modal>
        ) : (
          ""
        )}
      </Page>
    </>
  );
}
