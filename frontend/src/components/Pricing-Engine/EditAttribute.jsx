
import React, { useEffect, useState } from "react";
import { Box, Grid, Autocomplete, TextField, Typography, Button } from "@mui/material";
import ReactSelect from "react-select";
import { useStyles } from "../../css/PricingEngine-css";
import { toast } from "react-hot-toast";
import { getBoardList, getChildList } from "../../config/services/lead";
import {
  getCountryCityData,
  getCountryData,
  getCountryStateData,
} from "../../helper/DataSetFunction";
import { getTerritoryList } from "../../config/services/territoryMapping";
import { getSourceName } from "../../config/services/Pricing Engine/sourceAttribute";
import { useLocation } from "react-router-dom";
import { ReactComponent as DropDownIcon } from "../../assets/icons/icon-dropdown-2.svg";


import MultiSelectWithCheckbox from "./CheckboxButton";
import ChartGrid from "./ChartGrid";
import EditChartGrid from "./EditChartGrid";


export const EditMatrixAttribute = ({
  productAttrData,
  packageMOP,
  packageMRP,
  getAttrValue,
  getAtrrShow,
  packageOption,
  onChildNextClick,
  updatedPackageData,
  setIsNextClicked,
  isNextClicked
}) => {
  const classes = useStyles();

  const [xaxis, setXAxis] = useState("");
  const [yaxis, setYAxis] = useState("");
  const [intervalXAxis, setIntervalXAxis] = useState([]);
  const [intervalYAxis, setIntervalYAxis] = useState([]);
  const [intervalXValue, setIntervalXValue] = useState("");
  const [intervalYValue, setIntervalYValue] = useState("");
  const [minIntervalX, setMinIntervalX] = useState("");
  const [maxIntervalX, setMaxIntervalX] = useState("");
  const [minIntervalY, setMinIntervalY] = useState("");
  const [maxIntervalY, setMaxIntervalY] = useState("");
  const [isIntervalValid, setIsIntervalValid] = useState(true);
  const [isMinIntervalValid, setIsMinIntervalValid] = useState(true);
  const [isMaxIntervalValid, setIsMaxIntervalValid] = useState(true);
  // const [isNextClicked, setIsNextClicked] = useState(false);
  const [boardSelectData, setBoardSelectData] = useState([]);
  const [classSelectData, setClassSelectData] = useState([]);
  const [countrySelectData, setCountrySelectData] = useState([]);
  const [territoryList, setTerritoryList] = useState([]);
  const [sourceOption, setSourceOption] = useState([]);
  const [matrixAttrData, setMatrixAttrData] = useState(null)
  // const [xaxislabel, setXaxislabel] = useState(null)

  // const [selectedLabel, setSelectedLabel] = useState("");
  // const [boardData, setBoardData] = useState([]);


  const location = useLocation();
  let { data } = location?.state ? location?.state : {};




  useEffect(() => {
    if (data) {
      getFilledOption11(data)
    }
  }, [data])



  const getFilledOption11 = (data) => {

    if (data?.x_axis_details) {
      let result1 = data?.x_axis_details?.matrix_attribute_name;
      let result = productAttrData.find(option => option.label === result1)
      setXAxis(result);

    }
    if (data?.x_axis_details?.matrix_sub_attributes_value?.length > 0 && data?.x_axis_details?.matrix_sub_attributes_value_input_type == "inputbox") {
      let result1 = parseInt(data?.matrix_details?.[0]?.['x-axis_details']?.[0]?.['x-axis_value']);
      let result2 = parseInt(data?.matrix_details?.[0]?.['x-axis_details']?.[1]?.['x-axis_value']);
      let interval = Math.abs(result2 - result1)
      setIntervalXValue(interval);

    }
    else if (data?.x_axis_details?.matrix_sub_attributes_value?.length > 0 && data?.x_axis_details?.matrix_sub_attributes_value_input_type == "dropdown") {

      let xchildDetails = []
      data?.x_axis_details?.matrix_sub_attributes_value
        ?.forEach((obj) => {
          const datax = {
            value: obj?.sub_attribute_id,
            label: obj?.sub_attribute_name,
          };

          xchildDetails.push(datax);
        });

      setIntervalXValue(xchildDetails)
    }


    if (data?.x_axis_details) {
      let result = data?.x_axis_details?.axis_max_val;
      setMaxIntervalX(result)
    }
    if (data?.x_axis_details) {
      let result = data?.x_axis_details?.axis_min_val;
      setMinIntervalX(result)
    }



    if (data?.y_axis_details?.matrix_sub_attributes_value?.length > 0 && data?.y_axis_details?.matrix_sub_attributes_value_input_type == "inputbox") {
      let result1 = parseInt(data?.matrix_details?.[0]?.["y-axis_value"]);
      let result2 = parseInt(data?.matrix_details?.[1]?.["y-axis_value"])
      let interval = Math.abs(result2 - result1)
      setIntervalYValue(interval)
    }
    else if (data?.y_axis_details?.matrix_sub_attributes_value?.length > 0 && data?.y_axis_details?.matrix_sub_attributes_value_input_type == "dropdown") {

      let ychildDetails = []
      data?.y_axis_details?.matrix_sub_attributes_value
        ?.forEach((obj) => {
          const datay = {
            value: obj?.sub_attribute_id,
            label: obj?.sub_attribute_name,
          };

          ychildDetails.push(datay);
        });

      setIntervalYValue(ychildDetails)
    }



    if (data?.y_axis_details) {
      let result1 = data?.y_axis_details?.matrix_attribute_name;
      let result = productAttrData.find(option => option.label === result1)
      setYAxis(result);
    }

    if (data?.y_axis_details) {
      let result = data?.y_axis_details?.axis_max_val;
      setMaxIntervalY(result)
    }
    if (data?.y_axis_details) {
      let result = data?.y_axis_details?.axis_min_val;
      setMinIntervalY(result)

    }
  }

  // console.log(intervalXValue, intervalYValue)


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
        });
        setBoardSelectData(boardFormattedData);

      })
      .catch((err) => {
        if (err.response.status === 401) {
          getBoardListHandler();
        }
        console.error(err?.response);
      });
  };

  //Class
  //
  const getChildListHandler = async () => {
    let params = { params: { boardId: 180, syllabusId: 180 } };
    await getChildList(params)
      .then((res) => {

        let classFormattedData = [];
        res?.data?.data?.child_list.forEach((element) => {
          classFormattedData.push({
            value: element.syllabus_id,
            label: element.name,
          });

        });
        setClassSelectData(classFormattedData);
      })
      .catch((err) => {
        if (err.response.status == 401) {
          getChildListHandler();
        }
        console.error(err?.response);
      });
  };

  //Country
  const getCountryResult = async () => {
    try {
      let countryDataOption = [];
      let res = await getCountryData();


      res = res?.loadResponses?.[0]?.data;
      res?.map((data) => {
        countryDataOption.push({
          label: data?.["CountryCityStateMapping.countryName"],
          value: data?.["CountryCityStateMapping.countryId"],
          code: data?.["CountryCityStateMapping.countryCode"]
        });
      });
      setCountrySelectData(countryDataOption);
    } catch (err) {
      console.error(err?.response);
    }
  };

  //Region
  const territoryListFunction = async () => {
    let params = { count: 100 };
    try {
      let res = await getTerritoryList(params);
      if (res?.result?.length) {
        let data = res?.result?.map((obj) => {
          return {
            label: obj?.territoryName,
            value: obj?.territoryCode,
          };
        });
        setTerritoryList(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  //Source
  const getSourceData = async () => {
    let params = {

      status: [1],
    };

    let res = await getSourceName(params);


    if (res?.data?.source_list) {
      let data = res?.data?.source_list?.map((obj) => {
        return {
          value: obj?.source_id,
          label: obj?.source_name,
          code: obj?.source_code,
        };
      });
      setSourceOption(data);
    }

  };

  useEffect(() => {
    // Call the functions here
    getBoardListHandler();
    getChildListHandler();
    getCountryResult();
    territoryListFunction();
    getSourceData();
  }, []);


  const handleXAxis = (value) => {
    let updatedData = [];
    if (value?.inputType === "dropdown") {

      if (value?.label === "Board") {
        getBoardListHandler();

      }
      if (value?.label === "Class") {
        getChildListHandler();

      }
      if (value?.label === "Country") {
        getCountryResult();

      }
      if (value?.label === "Region") {
        territoryListFunction();

      }
      if (value?.label === "Source") {
        getSourceData();

      }

      updatedData = value?.intervalData.map((item) => ({
        label: item.matrix_sub_attribute_name,
        value: item.matrix_sub_attribute_id,
      }));
    }

    setIntervalXAxis(updatedData);
    setXAxis(value);
  };


  const handleYAxis = async (value) => {
    try {
      let updatedData = [];

      if (value?.inputType === "dropdown") {
        if (value?.label === "Board") {

          await getBoardListHandler();
        }
        if (value?.label === "Class") {

          await getChildListHandler();
        }
        if (value?.label === "Country") {

          await getCountryResult();
        }
        if (value?.label === "Region") {

          await territoryListFunction();
        }
        if (value?.label === "Source") {

          await getSourceData();
        }

        updatedData = value?.intervalData.map((item) => ({
          label: item.matrix_sub_attribute_name,
          value: item.matrix_sub_attribute_id,
        }));
      }

      setIntervalYAxis(updatedData);
      setYAxis(value);
    } catch (error) {
      console.error("Error in handleYAxis:", error);
    }
  };


  const handleNextClick = () => {
    if (
      !isIntervalValid ||
      !isMinIntervalValid ||
      !isMaxIntervalValid ||
      packageMOP == "" ||
      packageMRP == "" ||
      intervalYValue === "" ||
      intervalXValue === ""

    ) {
      toast.error("Please fill the mandatory fields");
      setIsNextClicked(false)
      return false;
    }
    else if (xaxis?.inputType !== "dropdown" && (minIntervalX == "" || maxIntervalX == "" || intervalXValue == "")) {
      toast.error("Please fill X-axis details");
      setIsNextClicked(false)
      return false;
    }
    else if (yaxis?.inputType !== "dropdown" && (minIntervalY == "" || maxIntervalY == "" || intervalYValue == "")) {
      toast.error("Please fill Y-axis details");
      setIsNextClicked(false)
      return false;
    }
    else {
      setIsNextClicked(true);
      onChildNextClick();
      getAtrrShow(true);
    }
  };


  useEffect(() => {
    getDataVal();
  }, [intervalXValue, intervalYValue, maxIntervalY, minIntervalY]);


  const getDataVal = () => {
    let data = {
      matrix_attribute_id_x: xaxis?.value,
      matrix_attribute_id_y: yaxis?.value,
      matrix_sub_attribute_id_x: Array.isArray(intervalXValue)
        ? [
          intervalXValue.map((obj) => obj?.matrix_sub_attribute_id),
        ]
        : null,
      matrix_sub_attribute_id_y: Array.isArray(intervalYValue)
        ? [
          intervalYValue.map((obj) => obj?.matrix_sub_attribute_id),
        ]
        : null,
      matrix_sub_attribute_name_x: xaxis?.label,
      matrix_sub_attribute_name_y: yaxis?.label,
      matrix_sub_attribute_status_x: xaxis?.inputType,
      matrix_sub_attribute_status_y: yaxis?.inputType,
      value_x: Array.isArray(intervalXValue)
        ? intervalXValue.map((obj) => obj?.label) : [(intervalXValue).toString()],
      value_y: Array.isArray(intervalYValue)
        ? intervalYValue.map((obj) => obj?.label) : [(intervalYValue).toString()],
      min_interval_x: minIntervalX.toString(),
      maxval: maxIntervalY.toString(),
      max_interval_x: maxIntervalX.toString(),
      minval: minIntervalY.toString(),
    };

    setMatrixAttrData(data)
    getAttrValue(data);

  };

  const getFileUploadData = (data) => {
    const keys = Object.keys(data);

    if (keys.length > 0) {
      const lastKey = keys[keys.length - 1];
      delete data[lastKey];
    }

    // Rest of your code
    getAttrValue(matrixAttrData);
    updatedPackageData(data);
  };

  const handleUpdateData = (data) => {
    getAttrValue(matrixAttrData);
    updatedPackageData(data);
  }


  const getDefaultData = (data) => {
    getAttrValue(matrixAttrData);
    updatedPackageData(data);
  }






  return (
    <>
      <Grid item md={12} xs={12} sx={{ mt: 2 }}>
        <Box
          sx={{
            backgroundColor: "#FEE0D6",
            padding: "10px 15px 5px 15px",
            borderRadius: "4px",
          }}
        >
          <Typography>Attributes</Typography>
        </Box>
      </Grid>
      <Grid item md={12} xs={12} sx={{ mt: 2 }}>
        {numberChart(
          classes,
          handleXAxis,
          xaxis,
          productAttrData,
          handleYAxis,
          yaxis,
          intervalXAxis,
          intervalXValue,
          intervalYValue,
          boardSelectData,
          classSelectData,
          countrySelectData,
          territoryList,
          sourceOption,
          intervalYAxis,
          setIntervalXValue,
          setIntervalYValue,
          setMinIntervalX,
          setMaxIntervalX,
          minIntervalX,
          maxIntervalX,

          setMinIntervalY,
          setMaxIntervalY,
          minIntervalY,
          maxIntervalY,
          isIntervalValid,
          setIsIntervalValid,
          isNextClicked,
          setIsNextClicked
        )}
        {!isNextClicked ? (
          <Grid container justifyContent="flex-end" sx={{ mt: 4 }}>
            <Button className={classes.submitBtn} onClick={handleNextClick}
              disabled={isNextClicked} // Use the prop to disable the button
            >
              Next
            </Button>
          </Grid>
        ) : ""} {/* Use null to hide when isNextClicked is true */}
        {isNextClicked && (
          <EditChartGrid
            handleUpdateData={handleUpdateData}
            intervalX={intervalXValue}
            intervalY={intervalYValue}
            minIntervalX={minIntervalX}
            maxIntervalX={maxIntervalX}
            minIntervalY={minIntervalY}
            maxIntervalY={maxIntervalY}
            xaxisLabel={xaxis?.label}
            yaxisLabel={yaxis?.label}
            setXAxis={setXAxis}
            setYAxis={setYAxis}
            setIntervalXValue={setIntervalXValue}
            setIntervalYValue={setIntervalYValue}
            setMinIntervalX={setMinIntervalX}
            setMaxIntervalX={setMaxIntervalX}
            setMinIntervalY={setMinIntervalY}
            setMaxIntervalY={setMaxIntervalY}
            setIsNextClicked={setIsNextClicked}
            packageMOP={packageMOP}
            packageMRP={packageMRP}
            matrixAttrData={matrixAttrData}
            getFileUploadData={getFileUploadData}
            getDefaultData={getDefaultData}
          />
        )}
      </Grid>
    </>
  );
};



const numberChart = (
  data,

  handleXAxis,
  xaxis,
  productAttrData,
  handleYAxis,
  yaxis,
  intervalXAxis,
  intervalXValue,
  intervalYValue,
  boardSelectData,
  classSelectData,
  countrySelectData,
  territoryList,
  sourceOption,
  intervalYAxis,
  setIntervalXValue,
  setIntervalYValue,
  setMinIntervalX,
  setMaxIntervalX,
  minIntervalX,
  maxIntervalX,

  setMinIntervalY,
  setMaxIntervalY,
  minIntervalY,
  maxIntervalY,
  isIntervalValid,
  setIsIntervalValid,
  isNextClicked,
  setIsNextClicked,

) => {


  return (
    <>
      <Grid container spacing={2}>
        <Grid item md={3} xs={12}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Typography className={data.label} style={{ width: "25%" }}>
              X-axis
            </Typography>
            <Box sx={{ width: "70%" }}>
              <Autocomplete
                clearIcon={false}
                options={productAttrData}
                getOptionLabel={(option) => option.label}
                onChange={(e, value) => handleXAxis(value)}
                value={xaxis || ''}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Select X-axis" className="crm-form-input" />
                )}
                popupIcon={<DropDownIcon />}
              />
            </Box>
            {/* <ReactSelect
              options={productAttrData}
              onChange={handleXAxis}
              placeholder="Select X-axis"
              className="width-100 font-14"
              value={xaxis}
              styles={customStyles}
            // className="select-width"
            /> */}
          </div>
        </Grid>
        {xaxis?.inputType !== "dropdown" ? (
          <>
            <Grid item md={3} xs={12}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Typography className={data.label} style={{ width: "25%" }}>
                  Interval{" "}
                </Typography>
                <input
                  type="number"
                  className={`${data.inputStyle} ${!isIntervalValid ? "invalid" : ""}`}
                  value={intervalXValue}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    const sanitizedValue = inputValue.replace(/[^0-9]/g, '');

                    setIsIntervalValid(true);
                    setIntervalXValue(sanitizedValue);
                  }}
                  maxLength={10}
                />
                {Number(intervalXValue) > Number(maxIntervalX) && (
                  <div style={{ color: "red" }}>Interval must be less than or equal to Max Value.</div>
                )}
              </div>
            </Grid>



            <Grid item md={3} xs={12}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Typography className={data.label} style={{ width: "70%" }}>
                  Min Value
                </Typography>
                <input
                  type="number"
                  style={{ width: '100%' }}
                  className={`${data.inputStyle} ${!isIntervalValid ? 'invalid' : ''}`}
                  value={minIntervalX}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    const sanitizedValue = inputValue.replace(/[^0-9]/g, '');

                    setMinIntervalX(sanitizedValue);
                  }}
                  maxLength={10}
                />
                {Number(minIntervalX) > Number(maxIntervalX) && (
                  <div style={{ color: "red" }}>Min Value must be less than or equal to Max Value.</div>
                )}
              </div>
            </Grid>

            <Grid item md={3} xs={12}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Typography className={data.label} style={{ width: "70%" }}>
                  Max Value
                </Typography>
                <input
                  type="number"
                  style={{ width: '100%' }}
                  className={`${data.inputStyle} ${!isIntervalValid ? 'invalid' : ''}`}
                  value={maxIntervalX}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    const sanitizedValue = inputValue.replace(/[^0-9]/g, '');

                    setMaxIntervalX(sanitizedValue);
                  }}
                  maxLength={10}
                />
                {Number(minIntervalX) > Number(maxIntervalX) && (
                  <div style={{ color: "red" }}>Max Value must be greater than or equal to Min Value.</div>
                )}
              </div>
            </Grid>

          </>
        ) : (

          <Grid item md={3} xs={12}>
            <MultiSelectWithCheckbox
              options={
                xaxis.label === "Board"
                  ? (Array.isArray(boardSelectData)
                    ? boardSelectData.map((item) => ({
                      label: item.label,
                      value: item.value,
                    }))
                    : [])
                  : xaxis.label === "Class" // Check if "Class" is selected
                    ? (Array.isArray(classSelectData)
                      ? classSelectData.map((item) => ({
                        label: item.label,
                        value: item.value,
                      }))
                      : [])
                    : xaxis.label === "Country" // Check if "Class" is selected
                      ? (Array.isArray(countrySelectData)
                        ? countrySelectData.map((item) => ({
                          label: item.label,
                          value: item.value,
                        }))
                        : [])
                      : xaxis.label === "Region" // Check if "Class" is selected
                        ? (Array.isArray(territoryList)
                          ? territoryList.map((item) => ({
                            label: item.label,
                            value: item.value,
                          }))
                          : [])
                        : xaxis.label === "Source" // Check if "Class" is selected
                          ? (Array.isArray(sourceOption)
                            ? sourceOption.map((item) => ({
                              label: item.label,
                              value: item.value,
                            }))
                            : [])
                          : intervalXAxis // Use your existing options for other cases
              }
              value={xaxis.inputType === "dropdown" ? intervalXValue : intervalXAxis}
              onChange={(selected) =>
                setIntervalXValue(xaxis.inputType === "dropdown" ? selected : selected.value)
              }
              type={"XAxis"}

            />

          </Grid>


        )}

        <Grid item md={3} xs={12}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Typography className={data.label} style={{ width: "25%" }}>
              Y-axis
            </Typography>
            <Box sx={{ width: "70%" }}>
              <Autocomplete
                clearIcon={false}
                options={productAttrData}
                getOptionLabel={(option) => option.label}
                onChange={(e, value) => handleYAxis(value)}
                value={yaxis || ''}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Select Y-axis" className="crm-form-input" />
                )}
                popupIcon={<DropDownIcon />}
              />
            </Box>
            {/* <ReactSelect
              options={productAttrData}
              onChange={handleYAxis}
              placeholder="Select Y-axis"
              value={yaxis}
              styles={customStyles}
              className="width-100 font-14"// Add this class for width
            /> */}
          </div>
        </Grid>
        {(yaxis?.inputType != "dropdown") ? (
          <>

            <Grid item md={3} xs={12}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Typography className={data.label} style={{ width: "25%" }}>
                  Interval{" "}
                </Typography>
                <input
                  type="number"
                  className={`${data.inputStyle} ${!isIntervalValid ? "invalid" : ""}`}
                  value={intervalYValue}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    const sanitizedValue = inputValue.replace(/[^0-9]/g, '');

                    setIsIntervalValid(true);
                    setIntervalYValue(sanitizedValue);
                  }}
                  maxLength={10}
                />
                {Number(intervalYValue) > Number(maxIntervalY) && (
                  <div style={{ color: "red" }}>Interval must be less than or equal to Max Value.</div>
                )}
              </div>
            </Grid>


            <Grid item md={3} xs={12}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Typography className={data.label} style={{ width: "70%" }}>
                  Min Value
                </Typography>
                <input
                  type="number"
                  style={{ width: '100%' }}
                  className={`${data.inputStyle} ${!isIntervalValid ? 'invalid' : ''}`}
                  value={minIntervalY}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    const sanitizedValue = inputValue.replace(/[^0-9]/g, '');

                    setMinIntervalY(sanitizedValue);
                  }}
                  maxLength={10}
                />
                {Number(minIntervalY) > Number(maxIntervalY) && (
                  <div style={{ color: "red" }}>Min Value must be less than or equal to Max Value.</div>
                )}
              </div>
            </Grid>

            <Grid item md={3} xs={12}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Typography className={data.label} style={{ width: "70%" }}>
                  Max Value
                </Typography>
                <input
                  type="number"
                  style={{ width: '100%' }}
                  className={`${data.inputStyle} ${!isIntervalValid ? 'invalid' : ''}`}
                  value={maxIntervalY}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    const sanitizedValue = inputValue.replace(/[^0-9]/g, '');

                    setMaxIntervalY(sanitizedValue);
                  }}
                  maxLength={10}
                />
                {Number(minIntervalY) > Number(maxIntervalY) && (
                  <div style={{ color: "red" }}>Max Value must be greater than or equal to Min Value.</div>
                )}
              </div>
            </Grid>
          </>
        ) : (
          <Grid item md={3} xs={12}>
            <MultiSelectWithCheckbox
              options={
                yaxis.label === "Board"
                  ? (Array.isArray(boardSelectData)
                    ? boardSelectData.map((item) => ({
                      label: item.label,
                      value: item.value,
                    }))
                    : [])
                  : yaxis.label === "Class" // Check if "Class" is selected
                    ? (Array.isArray(classSelectData)
                      ? classSelectData.map((item) => ({
                        label: item.label,
                        value: item.value,
                      }))


                      : [])
                    : yaxis.label === "Country" // Check if "Class" is selected
                      ? (Array.isArray(countrySelectData)
                        ? countrySelectData.map((item) => ({
                          label: item.label,
                          value: item.value,
                        }))


                        : [])
                      : yaxis.label === "Region" // Check if "Class" is selected
                        ? (Array.isArray(territoryList)
                          ? territoryList.map((item) => ({
                            label: item.label,
                            value: item.value,
                          }))


                          : [])
                        : yaxis.label === "Source" // Check if "Class" is selected
                          ? (Array.isArray(sourceOption)
                            ? sourceOption.map((item) => ({
                              label: item.label,
                              value: item.value,
                            }))

                            : [])
                          : intervalYAxis // Use your existing options for other cases
              }
              value={yaxis.inputType === "dropdown" ? intervalYValue : intervalYAxis}
              onChange={(selected) =>
                setIntervalYValue(yaxis.inputType === "dropdown" ? selected : selected.value)
              }
              type={"YAxis"}
            />
          </Grid>
        )}
      </Grid>
    </>
  );
};


export default EditMatrixAttribute;
