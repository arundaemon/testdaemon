import {
  Box,
  Button,
  IconButton,
  Modal,
  ModalManager,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

import { useStyles } from "../../css/SiteSurvey-css";
import ReactSelect from "react-select";
import {
  QCOPTIONS,
  QCSTATUS,
  QuoteType,
  fieldTab,
} from "../../constants/general";
import {
  createQc,
  getPrevQcFormData,
  updateActivity,
  updateImplementationByStatus,
  uploadQcImageToGcp,
} from "../../config/services/implementationForm";
import { getUserData } from "../../helper/randomFunction/localStorage";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import OtpInput from "react-otp-input";
import { ForgetPassword } from "../../config/services/forgetPassword";
import { OtpVerification } from "../../config/services/otpVerification";
import ReactDatePicker from "react-datepicker";
import moment from "moment";
import DownloadIcon from "../../assets/image/downloadIcon.svg";

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

const QcFormTable = ({ data, impCode }) => {
  const classes = useStyles();

  const navigate = useNavigate();
  const [shw_modal, setModalStatus] = useState(false);
  const [otpVerify, setOtpVerify] = useState("");
  const [isUpadateProfile, setUpdateUUId] = useState("");
  const [close_modal, setModalClose] = useState(true);
  const [requestStamp, setRequestStamp] = useState("");
  const formRef = useRef();
  const [isRemarkStatus, setRemarkStatus] = useState("");

  const handleOtpChange = (otp) => setOtpVerify(otp);

  const onhanDleClose = () => {
    setModalClose(false);
    setModalStatus(false);
  };

  const [fields, setFields] = useState([
    {
      itemName: "",
      variant: "",
      uploadImage: "",
      status: "",
      remarks: "",
      fileName: "",
      implementationDate: "",
    },
  ]);

  const handleChange = (index, attr, event) => {
    const newFields = [...fields];
    newFields[index][attr] = event;
    setFields(newFields);
  };

  const handleSelectChange = (index, selectedOption) => {
    const newFields = [...fields];
    newFields[index].status = selectedOption;
    setFields(newFields);
  };

  const handleUploadFile = (params) => {
    let { index, fileName, fileUrl } = params;
    const newFields = [...fields];
    newFields[index].uploadImage = fileUrl;
    newFields[index].fileName = fileName;
    setFields(newFields);
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: "250px",
    }),
    // ... other style overrides
  };

  var myArray = ["2"];

  const getImplementedUnit = (obj) => {
    let implementUnit = obj?.implementedUnit;
    let implementUnitArray = [];
    let data;
    for (var i = 0; i < implementUnit; i++) {
      data = {
        itemName: obj?.productItemName,
        variant: obj?.itemVariantName,
        implementedUnit: obj?.implementedUnit,
        hardwareId: obj?.implementedUnit,
        hardwareType: obj?.hardwareType,
        uploadImage: "",
        status: "",
        remarks: "",
        fileName: "",
      };
      implementUnitArray.push(data);
    }
    return implementUnitArray;
  };

  const addFieldData = (data) => {
    let fieldData;
    fieldData = data?.map((obj) => {
      return getImplementedUnit(obj);
    });

    if (fieldData?.length) {
      fieldData = fieldData?.flat();
      setFields(fieldData);
    }
  };

  useEffect(() => {
    if (data?.length) {
      addFieldData(data);
    }
  }, [data]);

  const uploadFile = async (index, event) => {
    let fileName = event.target.files[0].name;
    let file = event.target.files[0];
    let formData = new FormData();
    let params = {
      index: index,
      fileName: fileName,
      fileUrl: "",
    };

    formData.append("image", file);

    try {
      let res = await uploadQcImageToGcp(formData);
      if (res?.result) {
        params = {
          ...params,
          fileUrl: res?.result,
        };
        handleUploadFile(params);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getQCVerifyOtp = async () => {
    try {
      var res = await ForgetPassword();
      setRequestStamp(res?.data?.timestamp);
      setModalStatus(true);
    } catch (err) {
      console.error(err);
    }
  };

  const getPreFilledData = async () => {
    let fillData;
    let remarkStatus;

    let params = {
      leadId: impCode,
      leadType: fieldTab?.implementation,
    };

    try {
      let res = await getPrevQcFormData(params);
      if (res?.result?.length) {
        fillData = res?.result?.map((obj) => {
          return {
            implementationCode: obj?.implementationCode,
            itemName: obj?.itemName,
            hardwareId: obj?.hardwareId,
            variant: obj?.itemVariantName,
            uploadImage: obj?.image,
            status: { label: obj?.status, value: obj?.status },
            remarks: obj?.remarks,
            implementationDate: obj?.implementationDate,
            qcCode: obj?.qcCode,
          };
        });

        if (fillData?.length) {
          setFields(fillData);
          remarkStatus = res?.result?.map((obj) => obj?.status);
          setRemarkStatus(remarkStatus);
          if (
            !remarkStatus?.includes(QCSTATUS?.isImplementReady) &&
            !remarkStatus?.includes(QCSTATUS?.isReturn)
          ) {
            getQCVerifyOtp();
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const createQCForm = async () => {
    let fieldArray = [];

    for (const obj of fields) {
      if (!obj?.uploadImage) {
        toast.error("Please Add Image");
        fieldArray.push(false);
        break;
      }
      if (!obj?.status) {
        toast.error("Please Add Status");
        fieldArray.push(false);
        break;
      }
      if (!obj?.remarks) {
        toast.error("Please Add Remarks");
        fieldArray.push(false);
        break;
      }
    }

    if (fieldArray?.includes(false)) {
      return;
    }

    let Data = fields?.map((obj) => {
      return {
        implementationCode: impCode,
        itemName: obj?.itemName,
        hardwareId: obj?.hardwareId,
        itemVariantName: obj?.variant,
        image: obj?.uploadImage,
        status: obj?.status?.value,
        remarks: obj?.remarks,
        createdByRoleName: getUserData("userData")?.crm_role,
        createdByName: getUserData("userData")?.name,
        createdByProfileName: getUserData("userData")?.crm_profile,
        createdByEmpcode: getUserData("userData")?.employee_code,
        createdByUuid: getUserData("loginData")?.uuid,
        qcCode: obj?.qcCode ?? "",
        implementationDate: obj?.implementationDate,
      };
    });
    let params = {
      data: Data,
    };

    try {
      let res = await createQc(params);
      if (res?.result) {
        toast.success("QC Form has been Implemented");
        navigate("/authorised/quality-list");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const isRedirect = () => {
    navigate("/authorised/hardware-QCActivity");
  };

  
  const onVerifyOtp = async (event) => {
    event.preventDefault();
    let userName = getUserData("userData")?.username;
    let isUpdateQuotationStatus;
    let params = {
      username: userName,
      otpVerify: otpVerify,
      requestStamp: requestStamp,
    };
  
    let updateParams = {
      impFormNumber: fields?.[0]?.qcCode,
      status: QuoteType?.isQCComplete,
      modifiedByName: getUserData("userData")?.name,
      modifiedByRoleName: getUserData("userData")?.crm_role,
      modifiedByProfileName: getUserData("userData")?.crm_profile,
      modifiedByEmpCode: getUserData("userData")?.employee_code,
      modifiedByUuid: getUserData("loginData")?.uuid,
    };


    let updateQCStatus = {
      leadId: impCode,
      isQcSubmitted: true,
      createdByRoleName: getUserData("userData")?.crm_role,
    };

    try {
      const data = await OtpVerification(params);

      if (data?.status === 1) {
        await updateImplementationByStatus(updateParams);
        await updateActivity(updateQCStatus);
        toast.success(
          `QC for this implementation- ${impCode}  has been Completed`
        );
        navigate("/authorised/quality-list");

        setModalStatus(false);
      } else {
        setModalStatus(false);
        toast.error(data?.message);
      }
    } catch (err) {
      console.error(err);
      setModalStatus(false);
    }
  };

  const handleKeyPress = (event) => {
    // for submitting otp pop-up form on pressing enter key
    if (event.key === "Enter") {
      formRef.current.submit();
    }
  };

  useEffect(() => {
    if (impCode) {
      getPreFilledData();
    }
  }, [impCode]);

  const handleDownload = (e) => {
    toast.success("File downloaded successfully");
  };

  return (
    <>
      <Box className="">
        {fields?.length > 0 && data?.length > 0 ? (
          <TableContainer component={Paper}>
            <Table
              aria-label="simple table"
              className="custom-table datasets-table crm-sd-claims-table crm-table-header-left-aligned"
            >
              <TableHead>
                <TableRow className="cm_table_head">
                  <TableCell>
                    {/* {" "} */}
                    <div className="tableHeadCell">S.No</div>
                  </TableCell>
                  <TableCell>
                    {/* {" "} */}
                    <div className="tableHeadCell">Item Name</div>
                  </TableCell>
                  <TableCell>
                    {/* {" "} */}
                    <div className="tableHeadCell">Variant</div>
                  </TableCell>
                  <TableCell>
                    {/* {" "} */}
                    <div
                      className="tableHeadCell"
                      style={{ justifyContent: "center" }}
                    >
                      Upload Image
                    </div>
                  </TableCell>
                  <TableCell>
                    {/* {" "} */}
                    <div
                      className="tableHeadCell"
                      style={{ justifyContent: "center" }}
                    >
                      Status
                    </div>
                  </TableCell>
                  <TableCell>
                    {/* {" "} */}
                    <div className="tableHeadCell">Remarks</div>
                  </TableCell>
                  {fields
                    ?.map((obj) => obj?.status?.label)
                    ?.includes(QCSTATUS?.isImplemented) && (
                    <TableCell>
                      {/* {" "} */}
                      <div className="tableHeadCell">Date</div>
                    </TableCell>
                  )}
                  <TableCell />
                </TableRow>
              </TableHead>

              <TableBody>
                {fields?.map((field, index) => {
                  return (
                    <>
                      <TableRow key={index}>
                        <TableCell>{index}</TableCell>
                        <TableCell sx={{ minWidth: "100px !important" }}>
                          {field?.itemName}
                        </TableCell>
                        <TableCell sx={{ minWidth: "100px !important" }}>
                          {field?.variant}
                        </TableCell>
                        <TableCell
                          sx={
                            field?.uploadImage
                              ? {
                                  minWidth: "300px !important",
                                  display: "flex",
                                  width: "100%",
                                  gap: "10px",
                                }
                              : {
                                  minWidth: "150px !important",
                                }
                          }
                        >
                          <TextField
                            autoComplete="off"
                            disabled
                            className="crm-form-input  crm-form-input-height dark"
                            type="upload"
                            placeholder={field?.fileName ?? "Upload here"}
                            value=""
                            InputProps={{
                              endAdornment: (
                                <IconButton
                                  component="label"
                                  className="crm-form-input-upload"
                                >
                                  <input
                                    styles={{
                                      display: "none",
                                      height: "auto !important",
                                    }}
                                    type="file"
                                    hidden
                                    onChange={(event) =>
                                      uploadFile(index, event)
                                    }
                                    // accept=".png,.jpg,.pdf,!.csv,!.xlsx"
                                  />
                                  Browse
                                </IconButton>
                              ),
                            }}
                          />
                          {field?.uploadImage && (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
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
                                href={field?.uploadImage}
                                target="_blank"
                                onClick={handleDownload}
                              >
                                <img
                                  className="dndIcon"
                                  src={DownloadIcon}
                                  alt=""
                                  style={{ width: "20px", height: "20px" }}
                                />
                              </a>
                            </div>
                          )}
                        </TableCell>
                        <TableCell sx={{ minWidth: "150px !important" }}>
                          <ReactSelect
                            classNamePrefix="select"
                            options={QCOPTIONS}
                            value={field.status}
                            menuPortalTarget={document.body}
                            onChange={(selectedOption) =>
                              handleSelectChange(index, selectedOption)
                            }
                            // styles={{ ...customStyles }}
                          />
                        </TableCell>
                        <TableCell sx={{ minWidth: "150px !important" }}>
                          <input
                            className={classes.inputStyle}
                            name="remarks"
                            type="text"
                            placeholder="Remark"
                            value={field?.remarks}
                            onChange={(event) =>
                              handleChange(index, "remarks", event.target.value)
                            }
                          />
                        </TableCell>
                        {field?.status?.label === QCSTATUS?.isImplemented && (
                          <TableCell sx={{ minWidth: "150px !important" }}>
                            <ReactDatePicker
                              className={classes.customDateField}
                              selected={
                                field?.implementationDate
                                  ? new Date(field?.implementationDate)
                                  : null
                              }
                              onChange={(date) =>
                                handleChange(index, "implementationDate", date)
                              }
                              minDate={new Date()}
                              onKeyDown={(e) => {
                                e.preventDefault();
                              }}
                              onChangeRaw={(e) => e.preventDefault()}
                            />
                          </TableCell>
                        )}
                      </TableRow>
                    </>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <div className={classes.noData}>
            <p>No Data</p>
          </div>
        )}
        {fields?.length > 0 && data?.length > 0 && (
          <div className={classes.borderFlexBox}>
            <Button
              className={classes.submitBtn}
              onClick={() => createQCForm()}
            >
              Implement
            </Button>
            <Button className={classes.submitBtn} onClick={() => isRedirect()}>
              Cancel
            </Button>
          </div>
        )}
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
      </Box>
    </>
  );
};

export default QcFormTable;
