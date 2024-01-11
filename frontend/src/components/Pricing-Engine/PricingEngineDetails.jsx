import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { getBoardList, getChildList } from "../../config/services/lead";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Grid, Typography, Alert, Divider, Breadcrumbs } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Page from "../Page";
import BredArrow from '../../assets/image/bredArrow.svg';
import { useStyles } from "../../css/Quotation-css";
import { useEffect } from "react";
import { getSchoolList } from "../../config/services/school";
import { getCountryName, getCountryNameData, getRegionData } from "../../helper/DataSetFunction";
import ChartGridView from "./ChartGridView";
import SchoolList from "./SchoolNameView";
import { DisplayLoader } from "../../helper/Loader";


export const PricingEngineDetails = () => {

  const classes = useStyles();
  const location = useLocation();
  const [boardList, setBoardList] = useState([])
  const [board, setBoard] = useState([])
  const [schoolList, setSchoolList] = useState([])
  const [school, setSchool] = useState([])
  const [classList, setClassList] = useState([])
  const [clas, setClas] = useState([])
  const [source, setSource] = useState([])
  const [subSource, setSubSource] = useState([])
  const [channel, setChannel] = useState([])
  const [countryCode, setCountryCode] = useState([])
  const [cityCode, setCityCode] = useState([])
  const [stateCode, setStateCode] = useState([])
  const [regionCode, setRegionCode] = useState([])
  const [details, setDetails] = useState([{}])
  const [region, setRegion] = useState([])
  const [loader, setLoader] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState(0);
  const [xaxis, setXAxis] = useState("");
  const [yaxis, setYAxis] = useState("");
  const [tableData, setTableData] = useState([])
  const [intervalXValue, setIntervalXValue] = useState("");
  const [intervalYValue, setIntervalYValue] = useState("");
  const [minIntervalX, setMinIntervalX] = useState("");
  const [maxIntervalX, setMaxIntervalX] = useState("");
  const [minIntervalY, setMinIntervalY] = useState("");
  const [maxIntervalY, setMaxIntervalY] = useState("");
  let { data } = location?.state ? location?.state : {};



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
          setBoardList(boardFormattedData);
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
          setClassList(classFormattedData)
        });
      })
      .catch((err) => {
        if (err.response.status == 401) {
          getChildListHandler();
        }
        console.error(err?.response);
      });
  };




  const getAllSchoolList = async () => {
    try {
      let res = await getSchoolList();
      if (res?.result) {
        let list = []
        let data = res?.result?.forEach((obj) => {
          const schoolDetail = {
            schoolCode: obj?.school_info?.schoolCode,
            schoolName: obj?.school_info?.schoolName,
          };
          list.push(schoolDetail)
        })
        setSchoolList(list);
        setLoader(true)
      }

    }
    catch (err) {
      console.error(err);
    }
  }


  const getCountryResult = async (countryId, stateId, cityId) => {
    try {
      let countryDataOption = [];
      let res = await getCountryName(countryId, stateId, cityId);
      res = res?.loadResponses?.[0]?.data;
      res?.map((data) => {
        countryDataOption.push({
          country: data?.["CountryCityStateMapping.countryName"],
          state: data?.["CountryCityStateMapping.stateName"],
          city: data?.["CountryCityStateMapping.cityName"]
        });
      });
      setDetails(countryDataOption);
    } catch (err) {
      console.error(err?.response);
    }
  };



  const getCountryFinalName = async (countryId) => {
    try {
      let countryDataOption = [];
      let res = await getCountryNameData(countryId);
      res = res?.loadResponses?.[0]?.data;
      res?.map((data) => {
        countryDataOption.push({
          country: data?.["CountryCityStateMapping.countryName"],
        });
      });
      setDetails(countryDataOption);
    } catch (err) {
      console.error(err?.response);
    }
  };


  const getRegionResult = async (territoryCode) => {
    try {
      let regionData = [];
      let res = await getRegionData(territoryCode);
      res = res?.loadResponses?.[0]?.data;
      res?.map((data) => {
        regionData.push({
          regionName: data?.["Territorymappings.territoryName"],
        });
      });
      setRegion(regionData);
    } catch (err) {
      console.error(err?.response);
    }
  };



  const updateGraphData = async (matrixDetails) => {

    let details = matrixDetails?.matrix_details


    let data = []
    details?.forEach(item => {
      const rowData = {};
      let val = item["y-axis_matrix_attribute_name"]
      rowData[val] = item["y-axis_value"];

      item?.["x-axis_details"]?.forEach(detail => {
        const xAxisValue = detail["x-axis_value"];
        const mrp = detail["x-axis_mrp"];
        const mop = detail["x-axis_mop"];


        const cellValue = `MRP: ${mrp}, MOP: ${mop}`;
        rowData[xAxisValue] = cellValue;
      });

      data.push(rowData);
    });

    setTableData(data)


  };


  useEffect(() => {
    if (data?.matrix_details?.length > 0) {
      updateGraphData(data);
    }
  }, [data]);




  useEffect(() => {
    if (data) {
      getFilledOption11(data)
    }
  }, [data])



  const getFilledOption11 = (data) => {

    if (data?.x_axis_details) {
      let result1 = data?.x_axis_details?.matrix_attribute_name;
      setXAxis(result1);

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
      setYAxis(result1);
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



  useEffect(() => {
    if (data?.board_details?.length) {
      const matchingBoards = [];
      data?.board_details?.forEach(obj => {
        const matches = boardList.filter(board => board?.value === obj?.board_id);
        matchingBoards.push(...matches);
      });
      setBoard(matchingBoards)
    }
    if (data?.school_details?.length > 0) {
      const matchingSchool = [];
      data?.school_details?.forEach(obj => {
        const matches = schoolList.filter(school => school?.schoolCode
          === obj?.school_code);
        matchingSchool.push(...matches);
      });
      setSchool(matchingSchool)
    }
    if (data?.class_details?.length > 0) {
      const matchingClass = []
      data?.class_details?.forEach(obj => {
        const matches = classList?.filter(clas => clas?.value === obj?.class_id)
        matchingClass.push(...matches)

      })
      setClas(matchingClass)
    }
    if (data?.source_details?.length > 0) {
      let list = []
      data?.source_details?.forEach((obj) => {
        const source = {
          // sourceCode: obj?.source_code,
          sourceName: obj?.source_name,
        };
        list.push(source)
      })
      setSource(list)
    }

    if (data?.sub_source_details?.length > 0) {
      let list = []
      data?.sub_source_details?.forEach((obj) => {
        const subSource = {
          // sourceCode: obj?.source_code,
          subSourceName: obj?.sub_source_name,
        };
        list.push(subSource)
      })
      setSubSource(list)
    }
    if (data?.channel_details?.length > 0) {
      let list = []
      data?.channel_details?.forEach((obj) => {
        const channel = {
          channelName: obj?.channel_name,
        };
        list.push(channel)
      })
      setChannel(list)
    }

    if (data?.country_details?.length > 0) {
      let list = []
      data?.country_details?.forEach((obj) => {
        list.push(obj?.country_id)
      })
      setCountryCode(list)
    }

    if (data?.region_details?.length > 0) {
      let list = []
      data?.region_details?.forEach((obj) => {
        list.push(obj?.region_code)
      })
      setRegionCode(list)
    }

    if (data?.state_details?.length > 0) {
      let list = []
      data?.state_details?.forEach((obj) => {
        list.push(obj?.state_id)
      })
      setStateCode(list)
    }

    if (data?.city_details?.length > 0) {
      let list = []
      data?.city_details?.forEach((obj) => {
        list.push(obj?.city_id)
      })
      setCityCode(list)
    }


  }, [boardList, schoolList, classList]);


  useEffect(() => {
    getBoardListHandler()
    getAllSchoolList()
    getChildListHandler()
  }, []);

  useEffect(() => {
    if (countryCode?.length > 0 && stateCode?.length > 0 && cityCode?.length > 0) {
      getCountryResult(countryCode, stateCode, cityCode)
    }
    else if(countryCode?.length > 0)
    {
      getCountryFinalName(countryCode)
    }
    if (regionCode?.length > 0) {
      getRegionResult(regionCode)
    }

  }, [countryCode]);


  const uniqueStates = [...new Set(details?.map((obj) => obj?.state))];
  const uniqueCountry = [...new Set(details?.map((obj) => obj?.country))]

  const breadcrumbs = [
    <Link
      underline="hover"
      key="1"
      color="inherit"
      to="/authorised/matrix-list"
      className={classes.breadcrumbsClass}
    >
      Pricing Engine List
    </Link>,
    <Typography key="3" color="text.primary" fontWeight="600" fontSize="14px">
      Pricing Engine Detail
    </Typography>,
  ];

  const accordionData = [
    {
      title: "Attribute",
      detail: <ChartGridView
        minIntervalX={minIntervalX}
        maxIntervalX={maxIntervalX}
        minIntervalY={minIntervalY}
        maxIntervalY={maxIntervalY}
        tableData={tableData}
        intervalX={intervalXValue}
        intervalY={intervalYValue}
        xaxisLabel={xaxis}
        yaxisLabel={yaxis}
      />,
    },

  ];

 

  return (

    <div className="listing-containerPage">
      <Breadcrumbs className={`listing-breadcrumbs ${classes.breadcrumbsBar}`}
        separator={<img src={BredArrow} />}
        aria-label="breadcrumb"
      >
        {breadcrumbs}
      </Breadcrumbs>


      <Page
        title="Extramarks | Purchase Order Detail"
        className="main-container myLeadPage datasets_container"
      >
        {!loader ?

          <div className={classes.loader}>
            {DisplayLoader()}
          </div>

          :
          <>
            <Grid className={classes.cusCard}>


              <Box
                sx={{
                  // backgroundColor: "#E2EBFF",
                  padding: "30px 40px",
                  borderRadius: "4px",
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Typography className={classes.subTitle}>
                      <b>Product Name :</b>
                    </Typography>
                    <div className={classes.subTitleNew} sx={{ mb: 1.5 }}>
                      {data?.product_name || "N/A"}
                    </div>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography className={classes.subTitle}>
                      <b>Package Name :</b>
                    </Typography>
                    <div className={classes.subTitleNew} sx={{ mb: 1.5 }}>
                      {data?.package_name || "N/A"}
                    </div>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography className={classes.subTitle}>
                      <b>Board :</b>
                    </Typography>
                    <div className={classes.subTitleNew} sx={{ mb: 1.5 }}>
                      {board?.map((obj) => obj?.label).join(", ") || "N/A"}
                    </div>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography className={classes.subTitle}>
                      <b>Class :</b>
                    </Typography>
                    <div className={classes.subTitleNew} sx={{ mb: 1.5 }}>
                      {clas?.map((obj) => obj?.label).join(", ") || "N/A"}
                    </div>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography className={classes.subTitle}>
                      <b>School :</b>
                    </Typography>
                    <div className={classes.subTitleNew} sx={{ mb: 1.5 }}>
                      <SchoolList school={school} />
                    </div>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography className={classes.subTitle}>
                      <b>Country:</b>
                    </Typography>
                    {uniqueCountry?.map((item, index) => (
                      <Typography className={classes.subTitle} key={index}>
                        <div className={classes.subTitleNew} sx={{ mb: 1.5 }}>
                          {item ? (Array.isArray(item) ? item.join(", ") : item) : "N/A"}
                        </div>
                      </Typography>
                    ))}
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography className={classes.subTitle}>
                      <b>Region:</b>
                    </Typography>
                    <div className={classes.subTitleNew} sx={{ mb: 1.5 }}>
                      {region?.map((obj) => obj?.regionName).join(", ") || "N/A"}
                    </div>
                  </Grid>

                  <Grid item xs={6} sm={3}>
                    <Typography className={classes.subTitle}>
                      <b>State:</b>
                    </Typography>
                    {uniqueStates?.map((item, index) => (
                      <Typography className={classes.subTitle} key={index}>
                        <div className={classes.subTitleNew} sx={{ mb: 1.5 }}>
                          {item ? (Array.isArray(item) ? item.join(", ") :  item) : "N/A"}
                        </div>
                      </Typography>
                    ))}
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography className={classes.subTitle}>
                      <b>City:</b>
                    </Typography>
                    <div className={classes.subTitleNew} sx={{ mb: 1.5 }}>
                      {details?.map((obj) => obj?.city).join(", ") || "N/A"}
                    </div>
                  </Grid>

                  <Grid item xs={6} sm={3}>
                    <Typography className={classes.subTitle}>
                      <b>Source :</b>
                    </Typography>
                    <div className={classes.subTitleNew} sx={{ mb: 1.5 }}>
                      {source?.map((obj) => obj?.sourceName).join(", ") || "N/A"}
                    </div>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography className={classes.subTitle}>
                      <b>Subsource :</b>
                    </Typography>
                    <div className={classes.subTitleNew} sx={{ mb: 1.5 }}>
                      {subSource?.map((obj) => obj?.subSourceName).join(", ") || "N/A"}
                    </div>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography className={classes.subTitle}>
                      <b>Channel:</b>
                    </Typography>
                    <div className={classes.subTitleNew} sx={{ mb: 1.5 }}>
                      {channel?.map((obj) => obj?.channelName).join(", ") || "N/A"}
                    </div>
                  </Grid>
                </Grid>
              </Box>

            </Grid>




            <div className={classes.accordianPadding}>
              {accordionData?.map((data, index) => {
                return (
                  <Accordion
                    key={index}
                    className="cm_collapsable"
                    expanded={activeAccordion === index}
                    onChange={(prev) => {
                      setActiveAccordion(index);
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                      className="table-header"
                    >
                      <Typography style={{ fontSize: 14, fontWeight: 600 }}>
                        {data?.title}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails className="listing-accordion-details">
                      {data?.detail}
                    </AccordionDetails>
                  </Accordion>
                );
              })}
            </div>

          </>
        }
      </Page>
    </div>
  );
};
