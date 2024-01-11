import React, { useEffect, useState } from "react";
import Page from "../Page";
import moment from "moment";
import DatePicker from "react-datepicker";
import { Container, TextField, Button, Grid, Checkbox } from "@mui/material";
import Select from "react-select";
import _ from "lodash";
import { createCampaign } from "../../config/services/campaign";
import { getAllSources, getAllSubSource } from "../../config/services/sources";
import toast from "react-hot-toast";
import link_icon from "../../assets/image/link_icon.svg";

const CreateCampaign = ({ showCreateCampaign, fetchCampaignList }) => {
  const [campaignName, setCampaignName] = useState();
  const [campaignOwner, setCampaignOwner] = useState();
  const [source, setSource] = useState({});
  const [subSource, setSubSource] = useState({});
  const [type, setType] = useState();
  const [dataToAdd, setDataToAdd] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [value, setValue] = React.useState("");
  const [dropValue, setDropValue] = useState();
  const [sourceList, setSourceList] = useState([]);
  const [subSourceList, setSubSourceList] = useState([]);
  const [campOwner] = useState(
    JSON.parse(localStorage.getItem("userData"))?.name
  );
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

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleCampaignName = (e) => {
    setCampaignName(e.target.value);
  };

  const handleCampaignOwner = (e) => {
    setCampaignOwner(e.target.value);
  };

  const handleSubSource = (e) => {
    setSubSource(e);
  };

  const handleStartDate = (date) => {
    setStartDate(date);
    setEndDate();
  };

  const addList = async (data) => {
    createCampaign(data)
      .then((res) => {
        if (res?.result) {
          toast.success(res?.message);
          fetchCampaignList(true);
        } else if (res?.data?.statusCode === 0) {
          let { errorMessage } = res?.data?.error;
          toast.error(errorMessage);
        } else {
          console.error(res);
        }
      })
      .catch((error) => console.log(error, "...errror"));
  };

  const fetchAllSourceList = () => {
    getAllSources({ activeSource: true })
      .then((res) => {
        if (res?.result) {
          res?.result?.map((sourceObj) => {
            sourceObj.label = sourceObj?.leadSourceName;
            sourceObj.value = sourceObj._id;
            return sourceObj;
          });
          setSourceList(res?.result);
        }
      })
      .catch((err) => console.error(err));
  };

  const fetchAllSubSourceList = () => {
    let id = source.value;
    getAllSubSource(id)
      .then((res) => {
        if (res?.result) {
          res?.result?.subSource.map((sourceObj) =>
            console.log("SubSource", sourceObj)
          );
          let activeSubSource = res?.result?.subSource?.filter((sourceObj) => {
            if (sourceObj.status === 1) {
              sourceObj.label = sourceObj?.leadSubSourceName;
              sourceObj.value = sourceObj._id;
              return sourceObj;
            }
          });
          setSubSourceList(activeSubSource);
        }
      })
      .catch((err) => console.error(err));
  };

  const handleSource = (e) => {
    setSource(e);
    setSubSource(null);
  };

  const handleEndDate = (date) => {
    if (startDate) {
      setEndDate(date);
    } else {
      toast.error("Fill start Date first");
    }
  };

	console.log(moment(startDate).format("YYYY-MM-DD"), "test StartData")

  const handleSubmit = () => {
    if (startDate > endDate) {
      toast.error("Start Date can not be greater than End Date");
      return;
    } else if (
      campaignName &&
      typeof source.value !== "undefined" &&
      startDate &&
      endDate
    ) {
      let filledDetails = _.cloneDeep(dataToAdd);
      filledDetails.campaignName = campaignName;
      filledDetails.campaignOwner = campOwner;
      filledDetails.source = source.value;
      filledDetails.subSource = subSource.value;
      filledDetails.type = value;
      filledDetails.startDate = moment(startDate).format("YYYY-MM-DD");
      filledDetails.endDate = moment(endDate).format("YYYY-MM-DD 23:59:59");
      filledDetails.createdBy = createdBy;
      filledDetails.createdBy_Uuid = createdBy_Uuid;
      filledDetails.modifiedBy = modifiedBy;
      filledDetails.modifiedBy_Uuid = modifiedBy_Uuid;
      addList(filledDetails);
      setCampaignName("");
      setCampaignOwner("");
      setSource({});
      setSubSource({});
      setStartDate();
      setEndDate();
      setValue("");
    } else {
      toast.error("Please fill all mandatory fields");
    }
  };

  useEffect(() => {
    fetchAllSourceList();
  }, []);

  useEffect(() => {
    if (!_.isEmpty(source)) {
      fetchAllSubSourceList();
    }
  }, [source]);

  return (
    <Page
      title="Extramarks | Create Campaign"
      className="main-container  datasets_container"
    >
      <div className="baner-boxcontainer ">
        <h4 className="heading">Manage Campaign</h4>
        {/* <p className='subheading'>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p> */}

        <div className="lableContainer">
          <div className="containerCol">
            <div div className="box">
              <label className="boxLabel">Campaign Name</label>
              <TextField
                className="label-text"
                required
                name="campaignName"
                type="text"
                id="outlined-basic"
                variant="outlined"
                value={campaignName}
                onChange={handleCampaignName}
              />
            </div>
            <div className="box">
              <label className="boxLabel">Sub source</label>
              <div>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  name="color"
                  options={subSourceList}
                  onChange={handleSubSource}
                  value={subSource}
                />
              </div>
            </div>
            <div className="box">
              <label className="boxLabel">Type</label>
              <select
                value={value}
                onChange={handleChange}
                style={{
                  padding: "8px 16px",
                  borderRadius: "4px",
                  marginTop: "5px",
                }}
              >
                <option value="" disabled>
                  Select
                </option>
                <option value="SEMINAR">SEMINAR</option>
              </select>
            </div>
          </div>
          <div className="containerCol">
            <div div className="box">
              <label className="boxLabel">Campaign Owner</label>
              <TextField
                disabled
                className="label-text"
                name="campaignOwner"
                type="text"
                id="outlined-basic"
                variant="outlined"
                value={campOwner}
                onChange={handleCampaignOwner}
              />
            </div>
            <div div className="box">
              <label className="boxLabel">Start Date</label>
              <DatePicker
                className="dateInput"
                selected={startDate}
                onChange={(date) => handleStartDate(date)}
                minDate={new Date()}
              />
            </div>
          </div>
          <div className="containerCol">
            <div className="box">
              <label className="boxLabel">Source</label>
              <Select
                className="basic-single"
                classNamePrefix="select"
                name="color"
                options={sourceList}
                onChange={handleSource}
                value={source}
              />
            </div>
            <div className="box">
              <label className="boxLabel">End Date</label>
              <DatePicker
                className="dateInput"
                selected={endDate}
                startDate={startDate}
                onChange={(date) => handleEndDate(date)}
                minDate={startDate}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="btnContainer">
        <div
          className="cancleBtn"
          onClick={showCreateCampaign}
          variant="outlined"
        >
          Cancel
        </div>
        <div className="saveBtn" onClick={handleSubmit} variant="contained">
          Save
        </div>
      </div>
    </Page>
  );
};
export default CreateCampaign;
