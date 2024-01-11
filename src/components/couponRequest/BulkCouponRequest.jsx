import {
  Breadcrumbs,
  Divider,
  LinearProgress,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BredArrow from "../../assets/image/bredArrow.svg";
import _ from "lodash";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import TextArea from "antd/es/input/TextArea";
import CouponRequestTable from "./CouponRequestTable";
import md5 from "md5";
import settings from "../../config/settings";
import { createRequest } from "../../config/services/approvalRequest";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  loader: {
    marginBottom: "-17px",
    marginLeft: "25px",
    marginRight: "25px",
  },
  header: {
    fontSize: "larger",
    fontWeight: "400",
    marginBottom: "inherit",
    marginTop: "-9px",
  },
  label: {
    font: "normal normal 600 14px/ 38px Open Sans",
    letterSpacing: "0px",
    color: "#85888A",
  },
  input: {
    // borderColor: '#85888A',
    border: "1px solid #cccccc",
    borderRadius: "6px",
    padding: "8px 15px",
    fontSize: "18px",
  },
  container: {
    display: "flex",
    marginTop: "20px",
    flexDirection: "column",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end",
    paddingRight: "20px",
    marginBottom: "10px",
  },
  submitButton: {
    fontWeight: "600",
    fontSize: "16px",
    lineHeight: "22px",
    cursor: "pointer",
    borderRadius: "4px",
    color: "white",
    border: "1px solid #F45E29",
    padding: "12px 24px",
    background: "#F45E29",
    marginLeft: "20px",
  },
  cancelButton: {
    border: "1px solid #F45E29",
    padding: "12px 24px",
    color: "#F45E29",
    borderRadius: "4px",
    fontWeight: "600",
    fontSize: "16px",
    lineHeight: "22px",
    cursor: "pointer",
  },
  newRequestButton: {
    border: "1px solid #F45E29",
    padding: "8px 15px",
    color: "#F45E29",
    borderRadius: "4px",
    fontWeight: "600",
    fontSize: "16px",
    lineHeight: "22px",
    cursor: "pointer",
    float: "right",
    position: "absolute",
    right: "0",
  },
  textArea: {
    border: "1px solid #cccccc",
    borderRadius: "6px",
    padding: "8px 15px",
    fontSize: "18px",
  },
  pageContainer: {
    width: "calc(33% - 30px)",
    marginRight: "100px",
  },
  page: {
    boxShadow: "0px 0px 8px rgb(0 0 0 / 16%)",
    borderRadius: "8px",
    padding: "20px",
    paddingBottom: "50px",
    margin: "20px",
  },
  emptyArray: {
    marginLeft: "600px",
    color: "rgb(244, 94, 41)",
    fontWeight: "500",
  },
}));

const BulkCouponRequest = () => {
  const [userData] = useState(JSON.parse(localStorage.getItem("userData")));
  const [loginData] = useState(JSON.parse(localStorage.getItem("loginData")));
  const [fromPercentage, setFromPercentage] = useState("");
  const [toPercentage, setToPercentage] = useState("");
  const [quantity, setQuantity] = useState("");
  const [validTillDate, setValidTillDate] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [couponRequestData, setCouponRequestData] = useState([]);
  const [couponRequestForm, setCouponRequestForm] = useState(false);
  const [loader, setLoader] = useState(false);
  const classes = useStyles();
  const [index, setIndex] = useState(-1);
  const navigate = useNavigate();

  const {
    employee_code: empCode,
    crm_role: requestBy_roleId,
    name: requestBy_name,
    crm_profile: requestBy_ProfileName,
  } = userData;
  const { uuid: requestBy_uuid } = loginData;
  const { TRIAL_ACTIVATION_ACTION, API_GATEWAY_API_KEY, API_GATEWAY_SALT_KEY } =
    settings;

  const breadcrumbs = [
    <Link
      underline="hover"
      key="1"
      color="inherit"
      to="/authorised/apply-request-management"
      className={classes.breadcrumbsClass}
    >
      Listing
    </Link>,
    <Typography key="3" color="text.primary" fontWeight="600" fontSize="14px">
      {"Request for coupon"}
    </Typography>,
  ];

  const trialInfoCreator = () => {
    return {
      requestBy_roleId,
      requestBy_name,
      requestBy_uuid,
      requestBy_ProfileName,
      requestBy_empCode: empCode,
    };
  };

  const handleFromPercentage = (e) => {
    setFromPercentage(e.target.value);
  };

  const handleToPercentage = (e) => {
    setToPercentage(e.target.value);
  };

  const handleQuantity = (e) => {
    setQuantity(e.target.value);
  };

  const handleRemarks = (e) => {
    setRemarks(e.target.value);
  };

  const handleValidTill = (date) => {
    setValidTillDate(date);
  };

  const handleEditIndex = (i) => {
    setIndex(i);

    let editData = couponRequestData[i];
    setFromPercentage(editData?.From_Percentage);
    setToPercentage(editData?.To_Percentage);
    setQuantity(editData?.Quantity);
    setValidTillDate(editData?.Valid_Till_Date);
    setRemarks(editData?.Remarks);
  };

  const resetAllFields = () => {
    setFromPercentage("");
    setToPercentage("");
    setQuantity("");
    setRemarks("");
    setValidTillDate(null);
    setIndex(-1);
  };

  const handleValidation = () => {
    if (
      !fromPercentage ||
      !toPercentage ||
      !quantity ||
      !remarks ||
      validTillDate == null
    ) {
      toast.error("Please fill all fields");
      return false;
    }
    if (fromPercentage > toPercentage) {
      toast.error("From percentage can not be greater than To percentage");
      return false;
    }
    if (toPercentage == 0) {
      toast.error("To percentage can not be zero");
      return false;
    }
    if (fromPercentage == 0) {
      toast.error("From percentage can not be zero");
      return false;
    }
    if (quantity == 0) {
      toast.error("Quantity can not be 0");
      return false;
    }
    return true;
  };

  const handleAdd = () => {
    let validation = handleValidation();
    if (validation) {
      let requestDetails = {
        From_Percentage: fromPercentage,
        To_Percentage: toPercentage,
        Quantity: quantity,
        Remarks: remarks,
        Valid_Till_Date: validTillDate,
      }; //modify object
      if (index === -1)
        setCouponRequestData([...couponRequestData, requestDetails]);
      else {
        let newArray = [...couponRequestData];
        newArray[index] = requestDetails;
        setCouponRequestData(newArray);
        setIndex(-1);
      }
      resetAllFields();
      setCouponRequestForm(!couponRequestForm);
    }
  };

  const handleSubmitButton = async () => {
    if (couponRequestForm) {
      handleAdd();
    } else {
      setLoader(true);
      if (couponRequestData.length > 0) {
        let data = await handleSubmitData();
        setLoader(false);
      } else {
        toast.error("Please add request");
        setLoader(false);
      }
    }
  };

  const handleSubmitData = async () => {
    const checkSumUpdated = md5(
      `${API_GATEWAY_API_KEY}:${API_GATEWAY_SALT_KEY}:${empCode}`
    );
    const timestamp = new Date().getTime();

    let userDetails = JSON.stringify({
      empcode: empCode,
      checksum: checkSumUpdated,
      action: TRIAL_ACTIVATION_ACTION,
      apikey: API_GATEWAY_API_KEY,
    });

    let new_data = {
      trialCreatorDetails: trialInfoCreator(),
      requestBy_empCode: empCode,
      trialType: "bulk",
      requestType: "Special Coupon",
      //trialData: userDetails,
      remarks: "",
      requestStatus: "NEW",
      metaInfo: couponRequestData,
      requestId: timestamp,
      requestBy_roleId,
      requestBy_name,
      requestBy_uuid,
      requestBy_ProfileName,
    };

    createRequest(new_data)
      .then((result) => {
        let { message } = result;
        toast.success(message);
        setCouponRequestData([]);
        navigate("/authorised/apply-request-management");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      <div style={{ marginLeft: "10px" }}>
        <Breadcrumbs
          className={`listing-breadcrumbs ${classes.breadcrumbsBar}`}
          separator={<img src={BredArrow} />}
          aria-label="breadcrumb"
        >
          {breadcrumbs}
        </Breadcrumbs>
      </div>
      {loader && (
        <div className={classes.loader}>
          <LinearProgress />
        </div>
      )}
      <div
        className={classes.page}
        style={{
          minHeight: couponRequestData?.length > 0 ? "initial" : "80px",
        }}
      >
        <p className={classes.header}>Coupon Request</p>
        {couponRequestForm ? (
          <>
            <div style={{ display: "flex", marginTop: "-20px" }}>
              <div className={classes.pageContainer}>
                <div className={classes.container}>
                  <label className={classes.label}>From Percentage (%)</label>
                  <input
                    className={classes.input}
                    type="text"
                    id="outlined-basic"
                    value={fromPercentage}
                    onChange={handleFromPercentage}
                  />
                </div>
                <div className={classes.container}>
                  <label className={classes.label}>Quantity</label>
                  <input
                    className={classes.input}
                    type="number"
                    id="outlined-basic"
                    value={quantity}
                    onChange={handleQuantity}
                  />
                </div>
              </div>
              <div className={classes.pageContainer}>
                <div className={classes.container}>
                  <label className={classes.label}>To percentage (%)</label>
                  <input
                    className={classes.input}
                    type="text"
                    id="outlined-basic"
                    value={toPercentage}
                    onChange={handleToPercentage}
                  />
                </div>
                <div className={classes.container}>
                  <label className={classes.label}>Valid till</label>
                  <DatePicker
                    selected={validTillDate}
                    onChange={(date) => handleValidTill(date)}
                    minDate={new Date()}
                  />
                </div>
              </div>
            </div>
            <div className={classes.container}>
              <label className={classes.label}>Remarks</label>
              <TextArea
                className={classes.textArea}
                value={remarks}
                onChange={handleRemarks}
              />
            </div>
          </>
        ) : (
          <>
            {couponRequestData?.length > 0 ? (
              <>
                <CouponRequestTable
                  list={couponRequestData}
                  couponRequestForm={couponRequestForm}
                  setCouponRequestForm={setCouponRequestForm}
                  handleEditIndex={handleEditIndex}
                />
                <Divider style={{ marginBottom: "20px" }} />
              </>
            ) :
              <p className={classes.emptyArray}>No Request Added</p>
            }
            <div style={{ position: 'relative' }}>
              <div className={classes.newRequestButton} onClick={() => { setCouponRequestForm(!couponRequestForm); resetAllFields() }}>{"Add New Request"}</div>
            </div>
          </>
        )}
      </div>
      <div className={classes.buttonContainer}>
        <div
          className={classes.cancelButton}
          onClick={() => {
            setCouponRequestForm(!couponRequestForm);
            resetAllFields();
          }}
          variant="outlined"
        >
          Cancel
        </div>
        <div
          className={classes.submitButton}
          onClick={handleSubmitButton}
          variant="contained"
        >
          {couponRequestForm ? (index === -1 ? "Add" : "Update") : "Submit"}
        </div>
      </div>
    </>
  );
};

export default BulkCouponRequest;
