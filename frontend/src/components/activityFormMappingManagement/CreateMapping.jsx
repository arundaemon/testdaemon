import React, { useEffect, useState } from "react";
import Page from "../Page";
import DatePicker from "react-datepicker";
import {
  Container,
  TextField,
  Button,
  Grid,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Divider,
  Typography,
  RadioGroup,
  Radio,
  Box,
} from "@mui/material";
import Select from "react-select";
import _ from "lodash";
import { getAllStages } from "../../config/services/stages";
import { getAllStatus } from "../../config/services/status";
import { getSubjectList } from "../../config/services/subject";
import { getCustomerResponseList } from "../../config/services/customerResponse";
import { getAllActivities } from "../../config/services/activities";
import Switch from "@mui/material/Switch";
import CrossIcon from "../../assets/image/crossIcn.svg";
import { getCrmFieldMasterList } from "../../config/services/crmFieldMaster";
import { getAllKeyValues } from "../../config/services/crmMaster";
import { createGlobalStyle } from "styled-components";
import { mappingType } from "../../constants/general";

const CreateMapping = ({
  showCreateMapping,
  productList,
  handleSelectCustomerResponse,
  handleSelectHardware,
  handleSelectMeetingStatus,
  handleB2BDropDown,
  handleSelectActivity,
  handleSelectFutureActivity,
  recordForEdit,
  setRecordForEdit,
  handleSelectType,
  handleOnChange,
  handleSelectForm,
  handleSelectSubject,
  handleSelectStage,
  handleSelectStatus,
  handleSelectBuyingDesposition,
  handleSelectAppointmentStatus,
  handleSelectProduct,
  handleSelectPriority,
  addOrEdit,
  stageList,
  statusList,
  activityList,
  handleMappingType,
  handlePriorityApplicable
}) => {
  const [customerResponseList, setCustomerResponseList] = useState([]);
  const [subjectList, setSubjectList] = useState([]);
  const [hardwareList, setHardwareList] = useState([]);
  const [priorityList, setPriorityList] = useState([]);
  const [createdBy] = useState(
    JSON.parse(localStorage.getItem("userData"))?.username
  );
  const [createdBy_Uuid] = useState(
    JSON.parse(localStorage.getItem("loginData"))?.uuid
  );
  const [modifiedBy] = useState(
    JSON.parse(localStorage.getItem("userData"))?.username
  );
  const [modifiedBy_Uuid] = useState(
    JSON.parse(localStorage.getItem("loginData"))?.uuid
  );
  const [b2BFieldList, setB2BFieldList] = useState([]);
  const [selectedB2BValues, setSelectedB2BValues] = useState([]);
  const [meetingStatus, setMeetingStatus] = useState([]);
  const [priorityApplicable, setPriorityApplicable] = useState(true);


  const formList = [
    { label: "Form 1", value: "FORM1" },
    { label: "Form 2", value: "FORM2" },
    { label: "Form 3", value: "FORM3" },
    { label: "Form 4", value: "FORM4" },
    { label: "Form 5", value: "FORM5" },
    { label: "Form 6", value: "FORM6" },
    { label: "Form 7", value: "FORM7" },
    { label: "Form 8", value: "FORM8" },
  ];

  const typeList = [
    { label: "Follow Up", value: "Follow Up" },
    { label: "Demo", value: "Demo" },
    { label: "None", value: "" },
  ];

  const Styles = {
    priorityBox: {
      margin: "0.5rem 1rem",
      padding: "18px",
      borderTop: '1px solid #eee',
      paddingTop: '30px'
    }
  }

  const getAllDropDownValues = () => {
    getAllKeyValues()
      .then((res) => {
        let data = res?.result;
        for (let item of data) {
          // if (item?.key === 'Products') {
          // 	let dataArray = item?.value.map(obj => ({ label: obj, value: obj }))
          // 	setProductList(dataArray)
          // }
          if (item?.key === "Customer Response") {
            let dataArray = item?.value.map((obj) => ({
              label: obj,
              value: obj,
            }));
            setCustomerResponseList(dataArray);
          }
          if (item?.key === "Subject") {
            let dataArray = item?.value.map((obj) => ({
              label: obj,
              value: obj,
            }));
            setSubjectList(dataArray);
          }
          if (item?.key === "Priority") {
            let dataArray = item?.value.map((obj) => ({
              label: obj,
              value: obj,
            }));
            setPriorityList(dataArray);
          }
          if (item?.key === "Hardware") {
            let dataArray = item?.value.map((obj) => ({
              label: obj,
              value: obj,
            }));
            setHardwareList(dataArray);
          }
          if (item?.key === "Meeting Status") {
            let dataArray = item?.value.map((obj) => ({
              label: obj,
              value: obj,
            }));
            setMeetingStatus(dataArray);
          }
        }
      })
      .catch((err) => {
        console.error(err, "Error while fetching all dropdown values");
      });
  };

  // const fetchAllCustomerResponseList = () => {
  // 	getCustomerResponseList()
  // 		.then((res) => {

  // 			if (res?.responseList) {
  // 				res?.responseList?.map(stageObj => {
  // 					stageObj.label = stageObj?.customerResponse
  // 					stageObj.value = stageObj.customerResponse
  // 					return stageObj
  // 				})
  // 				setCustomerResponseList(res?.responseList)
  // 			}
  // 		})
  // 		.catch(err => console.error(err))
  // }

  const getB2BFieldOption = () => {
    getCrmFieldMasterList()
      .then((res) => {
        let data = res?.result;
        let arr = data
          ?.filter((obj) => obj?.type === "DEPENDENT")
          ?.map((item) => ({
            label: item?.fieldName,
            value: item?.fieldName,
            required: false,
            fieldCode: item?.fieldCode,
            fieldName: item?.fieldName,
            fieldType: item?.fieldType,
          }));
        setB2BFieldList(arr);
      })
      .catch((err) => {
        console.error("Error while fetching getCrmFieldMasterList", err);
      });
  };

  const removeSelectedB2BFieldValue = (optionToRemove) => {
    let filledDetails = _.cloneDeep(recordForEdit);
    const updatedOptions = recordForEdit?.b2BFields.filter(
      (option) => option.value !== optionToRemove.value
    );
    filledDetails.b2BFields = updatedOptions;
    setRecordForEdit(filledDetails);
  };

  const handleToggleB2BField = (e, i) => {
    let updatedValue = [...recordForEdit?.b2BFields];
    let filledDetails = _.cloneDeep(recordForEdit);
    updatedValue[i].required = e.target.checked;
    filledDetails.b2BFields = updatedValue;
    setRecordForEdit(filledDetails);
  };





  useEffect(() => {
    getB2BFieldOption();
    getAllDropDownValues();
  }, []);


  return (
    <Page
      title="Extramarks | Manage Mapping"
      className="main-container  datasets_container"
    >
      <div className="baner-boxcontainer ">
        <h4 className="heading">Manage Mapping</h4>
        <div className="lableContainer">
          <div className="containerCol">
            <div div className="box">
              <label className="boxLabel">Form Mapping Type</label>
              <div>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  name="color"
                  options={mappingType}
                  onChange={handleMappingType}
                  value={recordForEdit?.mappingType}
                />
              </div>
            </div>
            <div div className="box">
              <label className="boxLabel">Pre Stage</label>
              <div>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  name="color"
                  options={stageList}
                  onChange={handleSelectStage}
                  value={recordForEdit?.stageName }
                />
              </div>
            </div>
            <div className="box">
              <label className="boxLabel">Subject</label>
              <div>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  name="color"
                  options={subjectList}
                  onChange={handleSelectSubject}
                  value={recordForEdit?.subject}
                />
              </div>
            </div>
            <div className="box">
              <label className="boxLabel">Activity</label>
              <div>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  name="color"
                  options={activityList}
                  onChange={handleSelectActivity}
                  value={recordForEdit?.activityId}
                />
              </div>
            </div>
            <div className="box">
              <label className="boxLabel">Priority</label>
              <div>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  name="color"
                  options={priorityList}
                  onChange={handleSelectPriority}
                  value={recordForEdit?.priority}
                />
              </div>
            </div>
            <div className="box">
              <FormGroup>
                <FormControlLabel
                  onChange={handleOnChange}
                  name="subjectPreFilled"
                  control={
                    <Checkbox checked={recordForEdit?.subjectPreFilled} />
                  }
                  label="Subject Pre-Filled"
                />
              </FormGroup>
            </div>
            <div className="box">
              <FormGroup>
                <FormControlLabel
                  onChange={handleOnChange}
                  name="reasonForPaPending"
                  control={
                    <Checkbox checked={recordForEdit?.reasonForPaPending} />
                  }
                  label="Reason for PA Pending"
                />
              </FormGroup>
            </div>
            <div className="box">
              <FormGroup>
                <FormControlLabel
                  onChange={handleOnChange}
                  name="reasonForPaRejected"
                  control={
                    <Checkbox checked={recordForEdit?.reasonForPaRejected} />
                  }
                  label="Reason for PA Rejected"
                />
              </FormGroup>
            </div>
            <div className="box">
              <FormGroup>
                <FormControlLabel
                  onChange={handleOnChange}
                  name="reasonForAckPending"
                  control={
                    <Checkbox checked={recordForEdit?.reasonForAckPending} />
                  }
                  label="Reason for AK Pending"
                />
              </FormGroup>
            </div>
          </div>
          <div className="containerCol">
            <div div className="box">
              <label className="boxLabel">Pre Status</label>
              <div>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  name="color"
                  options={statusList}
                  onChange={handleSelectStatus}
                  value={recordForEdit?.statusName}
                />
              </div>
            </div>
            <div div className="box">
              <label className="boxLabel">Type</label>
              <div>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  name="color"
                  options={typeList}
                  onChange={handleSelectType}
                  value={recordForEdit?.type}
                />
              </div>
            </div>
            <div div className="box">
              <label className="boxLabel">Future Activity</label>
              <div>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  name="color"
                  options={activityList}
                  onChange={handleSelectFutureActivity}
                  value={recordForEdit?.futureActivityId}
                />
              </div>
            </div>
            <div div className="box">
              <label className="boxLabel">Meeting Status</label>
              <div>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  name="color"
                  options={meetingStatus}
                  onChange={handleSelectMeetingStatus}
                  value={recordForEdit?.meetingStatus}
                />
              </div>
            </div>

            <div style={{ marginTop: "120px" }}>
              <div className="box">
                <FormGroup>
                  <FormControlLabel
                    onChange={handleOnChange}
                    name="reasonForDQ"
                    control={<Checkbox checked={recordForEdit?.reasonForDQ} />}
                    label="Reason For DQ"
                  />
                </FormGroup>
              </div>
              <div className="box">
                <FormGroup>
                  <FormControlLabel
                    onChange={handleOnChange}
                    name="reasonForFbPending"
                    control={
                      <Checkbox checked={recordForEdit?.reasonForFbPending} />
                    }
                    label="Reason For FD Pending"
                  />
                </FormGroup>
              </div>
              <div className="box">
                <FormGroup>
                  <FormControlLabel
                    onChange={handleOnChange}
                    name="reasonForFbRejected"
                    control={
                      <Checkbox checked={recordForEdit?.reasonForFbRejected} />
                    }
                    label="Reason For FD Rejected"
                  />
                </FormGroup>
              </div>
              <div className="box">
                <FormGroup>
                  <FormControlLabel
                    onChange={handleOnChange}
                    name="reasonForAckRejected"
                    control={
                      <Checkbox checked={recordForEdit?.reasonForAckRejected} />
                    }
                    label="Reason for AK Rejected"
                  />
                </FormGroup>
              </div>
            </div>
          </div>
          <div className="containerCol">
            <div className="box">
              <label className="boxLabel">Product</label>
              <Select
                className="basic-single"
                classNamePrefix="select"
                name="color"
                options={productList}
                onChange={handleSelectProduct}
                value={recordForEdit?.product}
              />
            </div>
            <div className="box">
              <label className="boxLabel">Customer Response</label>
              <Select
                className="basic-single"
                classNamePrefix="select"
                name="color"
                options={customerResponseList}
                onChange={handleSelectCustomerResponse}
                value={recordForEdit?.customerResponse}
              />
            </div>
            <div className="box">
              <label className="boxLabel">Form</label>
              <div>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  name="color"
                  options={formList}
                  onChange={handleSelectForm}
                  value={recordForEdit?.formId}
                />
              </div>
            </div>
            <div div className="box">
              <label className="boxLabel">Hardware</label>
              <div>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  name="color"
                  options={hardwareList}
                  onChange={handleSelectHardware}
                  value={recordForEdit?.hardware}
                />
              </div>
            </div>
            <div style={{ marginTop: '120px' }}>
              <div className="box">
                <FormGroup>
                  <FormControlLabel
                    onChange={handleOnChange}
                    name="verifiedDoc"
                    control={<Checkbox checked={recordForEdit?.verifiedDoc} />}
                    label="Verified Document"
                  />
                </FormGroup>
              </div>
              <div className="box">
                <FormGroup>
                  <FormControlLabel
                    onChange={handleOnChange}
                    name="featureExplained"
                    control={
                      <Checkbox checked={recordForEdit?.featureExplained} />
                    }
                    label="Feature Explained"
                  />
                </FormGroup>
              </div>
              <div className="box">
                <FormGroup>
                  <FormControlLabel
                    onChange={handleOnChange}
                    name="reasonForObPending"
                    control={
                      <Checkbox checked={recordForEdit?.reasonForObPending} />
                    }
                    label="Reason for OB Pending"
                  />
                </FormGroup>
              </div>
              <div className="box">
                <FormGroup>
                  <FormControlLabel
                    onChange={handleOnChange}
                    name="reasonForObRejected"
                    control={
                      <Checkbox checked={recordForEdit?.reasonForObRejected} />
                    }
                    label="Reason for OB Rejected"
                  />
                </FormGroup>
              </div>
            </div>
          </div>
        </div>

        <Box sx={Styles.priorityBox}>
          <div className="box">
            <Grid container spacing={3} sx={{ py: "8px" }}>
              <Grid>
                <Typography>Priority Applicable</Typography>
                <RadioGroup
                  row
                  aria-label="priorityApplicable"
                  value={recordForEdit?.isPriorityApplicable}
                  onChange={handlePriorityApplicable}
                >
                  <FormControlLabel
                    value={true}
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel
                    value={false}
                    control={<Radio />}
                    label="No"
                  />
                </RadioGroup>
              </Grid>
            </Grid>
          </div>
        </Box>

        <div className="box" style={{ marginTop: "10px" }}>
          <label
            className="boxLabel"
            style={{
              font: "normal normal 600 14px/38px Open Sans",
              letterSpacing: "0px",
              color: "#85888A",
            }}
          >
            Dependent Field
          </label>
          <div>
            <Select
              className="basic-single"
              classNamePrefix="select"
              name="color"
              options={b2BFieldList}
              isMulti
              value={recordForEdit?.b2BFields}
              onChange={handleB2BDropDown}
              closeMenuOnSelect={false}
            />
            <div
              style={{
                display: "flex",
                paddingTop: "10px",
                flexWrap: "wrap",
                marginRight: "20px",
              }}
            >
              {recordForEdit?.b2BFields?.map((option, i) => (
                <div
                  key={option.value}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "5px",
                    border: "1px solid #ccc",
                    marginRight: "15px",
                    borderRadius: "8px",
                    marginTop: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <span style={{ marginRight: "10px", marginLeft: "10px" }}>
                    {option.label}
                  </span>
                  <Switch
                    checked={option.required}
                    onChange={(e) => handleToggleB2BField(e, i)}
                  />
                  <Divider
                    orientation="vertical"
                    flexItem
                    style={{
                      marginLeft: "10px",
                      marginRight: "10px",
                      fontWeight: "700",
                    }}
                  />
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "black",
                    }}
                    onClick={() => removeSelectedB2BFieldValue(option)}
                  >
                    <img className="crossIcon" src={CrossIcon} alt="" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="btnContainer">
        <div
          className="cancleBtn"
          onClick={showCreateMapping}
          variant="outlined"
        >
          Cancel
        </div>
        <div className="saveBtn" onClick={addOrEdit} variant="contained">
          Save
        </div>
      </div>
    </Page>
  );
};

export default CreateMapping;
