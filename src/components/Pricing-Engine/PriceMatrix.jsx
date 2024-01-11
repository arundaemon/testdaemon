import {
  Autocomplete,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  ListItemText,
  Menu,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { getBoardList, getChildList } from "../../config/services/lead";
import { addUpdateMatrix, getAllSourcesList, getAllSubSourcesList, getCampaignName, getPackageName, getProductAttribute, getProductName, listPackageBundles } from "../../config/services/packageBundle";
import {
  getSchoolList
} from "../../config/services/school";
import { useStyles } from "../../css/PricingEngine-css";
import {
  getCountryCityData,
  getCountryData,
  getStateDataAccordingToRegion,
  getTerritoryData
} from "../../helper/DataSetFunction";
import { getUserData } from "../../helper/randomFunction/localStorage";
import Page from "../Page";
import { MatrixAttribute } from "./Attribute";
import CheckboxAutocomplete from "./Autocomplete";
import SelectWithRadio from "./RadioButton";
import { DisplayLoader } from "../../helper/Loader";


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 4;

//

const MenuProps = {
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'left',
  },
  transformOrigin: {
    vertical: 'top',
    horizontal: 'left',
  },
  getContentAnchorel: null,
  style: { position: 'absolute', zIndex: 1000 },


}

export const PriceMatrix = () => {
  const [xAxisDetails, setXAxisDetails] = useState({
    matrix_attribute_id: "",
    matrix_sub_attribute_id: "",
    matrix_sub_attributes_source: "",
    matrix_sub_attributes_value_input_type: "",
    matrix_sub_attributes_value: "",
    axis_min_val: "",
    axis_max_val: ""
  });

  const [yAxisDetails, setYAxisDetails] = useState({
    matrix_attribute_id: "",
    matrix_sub_attribute_id: "",
    matrix_sub_attributes_source: "",
    matrix_sub_attributes_value_input_type: "",
    matrix_sub_attributes_value: "",
    axis_min_val: "",
    axis_max_val: "",
  });



  const classes = useStyles();
  const [isNextClicked, setIsNextClicked] = useState(false);
  const [loading, setLoading] = useState(false)
  const [isMatrixType, setMatrixType] = useState();
  const [selectedPackage, setPackage] = useState("packageBundle");
  const [productName, setProductName] = useState([]);
  const [packageName, setPackageName] = useState([]);
  const [boardData, setBoardData] = useState([]);
  const [classData, setClassData] = useState([]);
  const [sourceData, setSourceData] = useState([]);
  const [subsourceData, setSubsourceData] = useState([]);
  const [campaignData, setCampaignData] = useState([]);
  const [countryData, setCountryData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [regionData, setRegionData] = useState([]);
  const [channelData, setChannelData] = useState([]);
  const [productOption, setProductOption] = useState([]);
  const [packageOption, setPackageOption] = useState([]);
  const [sourceOption, setSourceOption] = useState([]);
  const [subsourceOption, setSubsourceOption] = useState([]);
  const [campaignOption, setCampaignOption] = useState([]);
  const [boardSelectData, setBoardSelectData] = useState([]);
  const [boardList, setBoardList] = useState([])
  const [classList, setClassList] = useState([])
  const [classSelectData, setClassSelectData] = useState([]);
  const [countrySelectData, setCountrySelectData] = useState([]);
  const [stateSelectData, setStateSelectData] = useState([]);
  const [citySelectData, setCitySelectData] = useState([]);
  const [territoryList, setTerritoryList] = useState([]);
  const [matrixName, setMatrixName] = useState(null);
  const [matrixTypeOption, setMatrixTypeOption] = useState(null);
  const [channelOption, setChannelOptions] = useState(null);
  const [showMatrixForm, setMatrixForm] = useState(false);
  const [productAttrData, setProductAttrData] = useState([]);
  const [packageMOP, setPackageMOP] = useState([]);
  const [packageMRP, setPackageMRP] = useState([]);
  const [schoolList, setSchoolList] = useState([]);
  const [search, setSearch] = useState("");
  const [boardOpen, setBoardOpen] = useState(false);
  const [classOpen, setClassOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [regionOpen, setRegionOpen] = useState(false);
  const [stateOpen, setStateOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [sourceOpen, setSourceOpen] = useState(false);
  const [subSourceOpen, setSubSourceOpen] = useState(false);
  const [campaignOpen, setCampaignOpen] = useState(false);
  const [schoolDetail, setSchoolDetail] = useState([])
  const [shwAttrchart, setAttrChart] = useState(false)
  const [citySearch, setCitySearch] = useState('')
  const [isUpdatePrice, setUpdatePrice] = useState([])
  const loginData = getUserData('loginData')
  const uuid = loginData?.uuid
  const [newCode, setNewCode] = useState([]);
  const navigate = useNavigate()
  const [channelOpen, setChannelOpen] = useState(false);
  const disabledStyle = {
    color: 'grey',
  };


  const checkMatrixDetail = () => {
    if (matrixName?.trim() === "" || !matrixName) {
      toast.error("Please Select Matrix Name");
      return;
    }

    if (!isMatrixType?.value || !isMatrixType) {
      toast.error("Please Select Matrix Type");
      return;
    }
    setMatrixForm(true);
  };


  const checkMainProduct = (data) => {

    let { pricing_matrix_details } = data

    if (pricing_matrix_details?.matrix_details?.product_id) {
      toast.error("Please Select Product Type");
      return false;
    }
    else if (pricing_matrix_details?.matrix_details?.package_id) {
      toast.error("Please Select Package Type");
      return false;
    }
    else if (pricing_matrix_details?.channel_ids?.length === 0) {
      toast.error("Please Select Channel");
      return false;
    }
    else {
      return true
    }

  };



  const handleChange = (selectedOption, type) => {


    if (type === "MatrixType") {
      setMatrixType(selectedOption);
    } else if (type === "productName") {
      setProductName(selectedOption);
      setPackageName(null);
    } else if (type === "packageName") {
      setPackageName(selectedOption);
    } else if (type === "boardData") {
      setBoardData(selectedOption);
    } else if (type === "classData") {
      setClassData(selectedOption);
    } else if (type === "countryData") {
      setStateData(null);
      setCityData(null);
      setStateSelectData([]);
      setCitySelectData([]);
      setCountryData(selectedOption);
    } else if (type === "stateData") {
      setStateData(selectedOption);
      setCityData(null);
      setCitySelectData([]);
    } else if (type === "regionData") {
      setRegionData(selectedOption);
    } else if (type === "cityData") {
      setCityData(selectedOption);
    } else if (type === "channelData") {
      setChannelData(selectedOption);
    } else if (type === "sourceData") {
      setSourceData(selectedOption);
    }
  };



  const handleClose = (type) => {
    if (type === "boardData") {
      setBoardOpen(false);
    } else if (type === "classData") {
      setClassOpen(false);
    } else if (type === "countryData") {
      setCountryOpen(false);
    } else if (type === "stateData") {
      setStateOpen(false);
    } else if (type === "regionData") {
      setRegionOpen(false);
    } else if (type === "cityData") {
      setCityOpen(false);
    } else if (type === "channelData") {
      setChannelOpen(false);
    } else if (type === "sourceData") {
      setSourceOpen(false);
    } else if (type === "subsourceData") {
      setSubSourceOpen(false);
    } else if (type === "campaignData") {
      setCampaignOpen(false);
    } else {
      setBoardOpen(false);

      setClassOpen(false);

      setCountryOpen(false);

      setStateOpen(false);

      setRegionOpen(false);

      setCityOpen(false);

      setChannelOpen(false);

      setSourceOpen(false);

      setSubSourceOpen(false);

      setCampaignOpen(false);
    }
  };

  const handleOpen = (type) => {
    if (type === "boardData") {
      setBoardOpen(true);
    } else if (type === "classData") {
      setClassOpen(true);
    } else if (type === "countryData") {
      setCountryOpen(true);
    } else if (type === "stateData") {
      setStateOpen(true);
    } else if (type === "regionData") {
      setRegionOpen(true);
    } else if (type === "cityData") {
      setCityOpen(true);
    } else if (type === "channelData") {
      setChannelOpen(true);
    } else if (type === "sourceData") {
      setSourceOpen(true);
    } else if (type === "subsourceData") {
      setSubSourceOpen(true);
    } else if (type === "campaignData") {
      setCampaignOpen(true);
    }
  };

  const handleNextClick = () => {
    setIsNextClicked(true);
  };



  const handleProductChange = (event) => {
    const selectedValue = event?.target?.value;
    const updatedSelectedValue = selectedValue.filter(
      (value) => value !== "select_all"
    );
    setProductName(updatedSelectedValue);
  };


  const handleChannelChange = (event) => {
    const selectedValue = event.target.value;

    if (selectedValue.includes("select_all")) {

      if (channelData.length === channelOption.length) {

        setChannelData([]);
      } else {

        setChannelData(channelOption);
      }
    } else {

      const updatedSelectedValue = selectedValue.filter(
        (value) => value !== "select_all"
      );
      setChannelData(updatedSelectedValue);
    }
  };


  const handleCampaignChange = (event) => {
    const selectedValue = event.target.value;

    if (selectedValue.includes("select_all")) {

      if (campaignData.length === campaignOption.length) {

        setCampaignData([]);
      } else {

        setCampaignData(campaignOption);
      }
    } else {

      const updatedSelectedValue = selectedValue.filter(
        (value) => value !== "select_all"
      );
      setCampaignData(updatedSelectedValue);
    }
  };



  const handleSourceChange = (event) => {
    const selectedValue = event.target.value;

    if (selectedValue.includes("select_all")) {

      if (sourceData.length === sourceOption.length) {

        setSourceData([]);
      } else {

        setSourceData(sourceOption);
      }
    } else {

      const updatedSelectedValue = selectedValue.filter(
        (value) => value !== "select_all"
      );
      setSourceData(updatedSelectedValue);
    }
  };

  const handleSubsourceChange = (event) => {
    const selectedValue = event.target.value;

    if (selectedValue.includes("select_all")) {

      if (subsourceData.length === subsourceOption.length) {

        setSubsourceData([]);
      } else {

        setSubsourceData(subsourceOption);
      }
    } else {

      const updatedSelectedValue = selectedValue.filter(
        (value) => value !== "select_all"
      );
      setSubsourceData(updatedSelectedValue);
    }
  };



  const handleBoardChange = (event) => {

    const selectedValue = event.target.value;

    if (selectedValue.includes("select_all")) {

      if (boardData.length === boardList.length) {

        setBoardData([]);
      } else {

        setBoardData(boardList);
      }
    } else {
      const updatedSelectedValue = selectedValue.filter(
        (value) => value !== "select_all"
      );
      setBoardData(updatedSelectedValue);
      if (selectedValue?.length === 1) {
        let selectdBoardId = selectedValue[0]?.value
        let allClasses = []
        for (let i = 0; i < packageContent?.length; i++) {
          if (packageContent[i]?.board_id === selectdBoardId && packageContent[i]?.package_content_classes.length > 0) {
            packageContent[i]?.package_content_classes?.map((item) => {
              allClasses.push({ value: item?.class_id })
            })
          }
        }
        if (!allClasses?.length) {
          allClasses = [...classSelectData]
        }
        allClasses = removeDuplicateObjects(allClasses)
        const allClassIds = allClasses.map(classItem => classItem.value);
        const filteredClassesData = classSelectData?.filter(item => allClassIds?.includes(item?.value));
        setClassList(filteredClassesData)
      }

    }
  };


  const handleClassChange = (event) => {
    const selectedValue = event.target.value;

    if (selectedValue.includes("select_all")) {

      if (classData?.length === classList?.length) {

        setClassData([]);
      } else {

        setClassData(classList);
      }
    } else {

      const updatedSelectedValue = selectedValue.filter(
        (value) => value !== "select_all"
      );
      setClassData(updatedSelectedValue);
    }
  };

  const handleCountryChange = (event) => {
    const selectedValue = event.target.value;

    if (selectedValue.includes("select_all")) {
      if (countryData.length === countrySelectData.length) {
        setCountryData([]);
      } else {
        setCountryData(countrySelectData);
      }
    } else {
      const updatedSelectedValue = selectedValue.filter(
        (value) => value !== "select_all"
      );
      setCountryData(updatedSelectedValue);
    }
  };

  const handleRegionChange = (event) => {
    const selectedValue = event.target.value;

    if (selectedValue.includes("select_all")) {
      if (regionData.length === territoryList.length) {
        setRegionData([]);
      } else {
        setRegionData(territoryList);
      }
    } else {
      const updatedSelectedValue = selectedValue.filter(
        (value) => value !== "select_all"
      );
      setRegionData(updatedSelectedValue);
    }
  };

  const handleStateChange = (event) => {
    const selectedValue = event.target.value;

    if (selectedValue.includes("select_all")) {

      if (stateData.length === stateSelectData.length) {

        setStateData([]);
      } else {
        setStateData(stateSelectData);
      }
    } else {
      const updatedSelectedValue = selectedValue.filter(
        (value) => value !== "select_all"
      );
      setStateData(updatedSelectedValue);
    }
  };


  const handleCityChange = (event, newValue) => {
    setCityData(newValue);

  };




  const getSourceData = async () => {
    let params = {
      uuid: uuid,
      status: [1],
    };

    let res = await getAllSourcesList(params);

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

  //Subsource
  const getSubsourceData = async (sourceData) => {
    let params = {
      source_id: sourceData[0]?.value,
      order_by: "sub_source_id",
      order: "DESC",
      uuid: uuid,
      status: [1],
    };

    let res = await getAllSubSourcesList(params);
    if (res?.data?.sub_source_list) {
      let data = res?.data?.sub_source_list?.map((obj) => {
        return {
          value: obj?.sub_source_id,
          label: obj?.sub_source_name,
          code: obj?.sub_source_code

        };
      });
      setSubsourceOption(data);
    }

  };


  const getCampaigneData = async () => {
    let params = {
      uuid: uuid,
      status: [1],
    };

    let res = await getCampaignName(params);


    if (res?.data?.campaign_list) {
      let data = res?.data?.campaign_list?.map((obj) => {
        return {
          value: obj?.campaign_id,
          label: obj?.campaign_name,
          code: obj?.campaign_code,
        };
      });
      setCampaignOption(data);
    }
  };

  const getProductData = async () => {
    let params = {
      uuid: uuid,
      master_data_type: "package_products",
      status: [1],
    };

    let res = await getProductName(params);

    if (res?.data?.master_data_list) {
      let data = res?.data?.master_data_list?.map((obj) => {
        return {
          label: obj?.name,
          value: obj?.id,
        };
      });
      setProductOption(data);
    }
  };

  const getAllSchList = async () => {
    try {
      let res = await getSchoolList();

      if (res?.result) {
        setSchoolList(res?.result);
        setLoading(true)
      }
    } catch (err) {
      console.error(err);
    }
  };

  function removeDuplicateObjects(array) {
    const uniqueArray = array.filter((item, index, self) =>
      index === self.findIndex((t) => (
        JSON.stringify(t) === JSON.stringify(item)
      ))
    );
    return uniqueArray;
  }



  const [packageContent, setPackageContent] = useState([])


  const getPackageListBundle = async () => {
    let params = {
      uuid: uuid,
      search_by: "package_id",
      search_val: packageName?.value,
      status: [1],

    };

    let res = await listPackageBundles(params);


    if (res?.data?.package_list_details) {
      let packageMOPValue = res?.data?.package_list_details[0]?.package_information?.package_mop;
      let packageMRPValue = res?.data?.package_list_details[0]?.package_information?.package_mrp;
      setPackageMRP(packageMRPValue);
      setPackageMOP(packageMOPValue);
    }
    if (res?.data?.package_list_details[0]?.package_contents?.length > 0) {
      setPackageContent(res?.data?.package_list_details[0]?.package_contents)
      const objectsToStoreForBoard = [];
      res.data.package_list_details[0].package_contents.map((item) => {
        if (item?.board_indicator_id === 1 && !item?.board_id) {
          boardSelectData?.map(obj => {
            if (obj.value !== 596 && obj.value !== 606) {
              objectsToStoreForBoard.push(obj);
            }
          });
        }
        else if (item?.board_indicator_id === 2 && !item?.board_id) {
          boardSelectData?.map(obj => {
            if (obj.value === 596 || obj.value === 606) {
              objectsToStoreForBoard.push(obj);
            }
          });
        }
        else if (item?.board_indicator_id === 3 && !item?.board_id) {
          boardSelectData?.map(obj => {
            objectsToStoreForBoard.push(obj);
          });
        }
      })
      let uniqueArray = removeDuplicateObjects(objectsToStoreForBoard)
      const boardIds = res.data.package_list_details[0].package_contents.map(item => item.board_id);
      const filteredArray = boardSelectData?.filter(item => boardIds.includes(item?.value));
      uniqueArray = [...uniqueArray, ...filteredArray]
      uniqueArray = removeDuplicateObjects(uniqueArray)
      setBoardList(uniqueArray)
    }
    if (res?.data?.package_list_details[0]?.package_contents?.length > 0) {
      let data = res?.data?.package_list_details[0]?.package_contents
      const allClassIds = [];
      data?.forEach(item => {
        const classIds = item.package_content_classes.map(classItem => classItem.class_id);
        allClassIds.push(...classIds);
      });
      const filteredClassesData = classSelectData?.filter(item => allClassIds?.includes(item?.value));
      setClassList(filteredClassesData)
    }

  };

  const getProductAttrDetail = async () => {
    let params = {
      uuid: uuid,
      search_by: "matrix_type_id",
      search_val: isMatrixType?.value,
      status: [1],

    };

    let res = await getProductAttribute(params);
    if (res?.data?.matrix_attributes) {
      let data = res?.data?.matrix_attributes?.map((obj) => {
        return {
          label: obj?.matrix_attribute_name,
          value: obj?.matrix_attribute_id,
          inputType: obj?.matrix_sub_attributes_value_input_type,
          intervalData: obj?.matrix_sub_attributes,
        };
      });
      setProductAttrData(data);
    }
  };

  useEffect(() => {
    const getData = setTimeout(() => {
      if (search) {
        getAllSchList();
      }
    }, 500);

    return () => clearTimeout(getData);
  }, [search]);

  useEffect(() => {
    if (isMatrixType?.value) {
      getProductAttrDetail();
    }
  }, [isMatrixType]);

  useEffect(() => {
    if (packageName?.value) {
      getPackageListBundle();
      setClassData([])
      setBoardData([])
    }
  }, [packageName]);

  const getMatrixType = async () => {
    let params = {
      uuid: uuid,
      master_data_type: "pricing_matrix_type",
      status: [1],

    };
    let res = await getProductName(params);
    if (res?.data?.master_data_list) {
      let data = res?.data?.master_data_list?.map((obj) => {
        return {
          label: obj?.name,
          value: obj?.id,
        };
      });
      setMatrixTypeOption(data);
    }
  };

  const getChannelData = async () => {
    let params = {
      uuid: uuid,
      master_data_type: "package_channels",
      status: [1],

    };
    let res = await getProductName(params);
    if (res?.data?.master_data_list) {
      let data = res?.data?.master_data_list?.map((obj) => {
        return {
          label: obj?.name,
          value: obj?.id,
        };
      });
      setChannelOptions(data);
    }
  };


  const getPackageData = async () => {
    let params = {
      uuid: uuid,
      status: [1],
      search_by: "product_id",
      search_val: productName?.value,
    };
    let res = await getPackageName(params);
    if (res?.data?.package_list_details) {
      let data = res?.data?.package_list_details?.map((obj) => {
        return {
          label: obj?.package_information?.package_name,
          value: obj?.package_information?.package_id,
        };
      });
      setPackageOption(data);
    }
  };


  const territoryListFunction = async (countryName) => {
    try {
      let countryDataOption = [];
      let res = await getTerritoryData(countryName);
      res = res?.loadResponses?.[0]?.data;
      res?.map((data) => {
        countryDataOption.push({
          label: data?.["Territorymappings.territoryName"],
          value: data?.["Territorymappings.territoryCode"],
          code: data?.["Territorymappings.territoryCode"]
        });
      });
      setTerritoryList(countryDataOption);
    } catch (err) {
      console.error(err?.response);
    }
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

  const getStateResult = async (countryName, territoryName) => {
    try {
      let stateDataOption = [];
      let res = await getStateDataAccordingToRegion(countryName, territoryName);
      res = res?.loadResponses?.[0]?.data;

      res?.map((data) => {
        stateDataOption.push({
          label: data?.["CountryCityStateMapping.stateName"],
          value: data?.["CountryCityStateMapping.stateId"],
          code: data?.["CountryCityStateMapping.stateCode"],

        });
      });
      setStateSelectData(stateDataOption);
    } catch (err) {
      console.error(err?.response);
    }
  };

  const getCityResult = async (stateName, countryCode) => {
    try {
      let stateDataOption = [];
      let res = await getCountryCityData(stateName, countryCode, citySearch);
      res = res.rawData();

      res?.map((data) => {
        stateDataOption.push({
          label: data?.["CountryCityStateMapping.cityName"],
          value: data?.["CountryCityStateMapping.cityId"],
          code: data?.["CountryCityStateMapping.cityCode"],

        });
      });
      setCitySelectData(stateDataOption);
    } catch (err) {
      console.error(err?.response);
    }
  };

  useEffect(() => {
    getProductData();
    getSourceData();
    getBoardListHandler();
    getChildListHandler();
    getCountryResult();
    getMatrixType();
    getCampaigneData();
    getChannelData();
  }, []);

  useEffect(() => {
    if (Object.keys(productName)?.length > 0) {
      getPackageData();
    }

  }, [productName]);


  useEffect(() => {
    if (sourceData?.length > 0 && sourceData?.length === 1) {
      getSubsourceData(sourceData);
    }
  }, [sourceData]);


  useEffect(() => {
    if (countryData?.length && countryData?.length < 2 && regionData?.length === 0) {
      setStateData([])
      getStateResult(countryData?.[0]?.label, null);
    } else if (countryData?.length > 0 && regionData?.length > 0 && countryData?.length < 2) {
      getStateResult(countryData?.[0]?.label, regionData?.[0]?.label);
      setStateData([])
    }
  }, [countryData, regionData]);


  useEffect(() => {
    const getData = setTimeout(() => {
      if (
        countryData?.length &&
        countryData?.length < 2 &&
        stateData?.length &&
        stateData?.length < 2
      ) {
        let countryCode = countryData?.[0]?.value;
        let stateName = stateData?.[0]?.label;

        getCityResult(stateName, countryCode);
      }
    }, 200);

    return () => clearTimeout(getData);
  }, [stateData, citySearch]);


  useEffect(() => {
    if (boardData?.length >= 2) {
      setClassData([]);
    }
  }, [boardData]);


  useEffect(() => {
    if (countryData?.length == 1) {
      territoryListFunction(countryData[0]?.label);
    }
    else if (countryData?.length >= 2) {
      setRegionData([]);
      setStateData([]);
      setCityData([]);
    }
  }, [countryData]);

  useEffect(() => {
    if (regionData?.length >= 2) {
      setStateData([]);
      setCityData([]);
    }
  }, [regionData]);

  useEffect(() => {
    if (stateData?.length >= 2) {
      setCityData([]);
    }
  }, [stateData]);

  const getBoardClassLstNode = () => {
    if (classData?.length > 0) {
      return "class_ids";
    } else {
      return "board_ids";
    }
  };
  const getSourceLstNode = () => {
    if (subsourceData?.length > 0) {
      return "sub_source_details";
    } else {
      return "source_details";
    }
  };

  const getCountryCityLstNode = () => {
    if (countryData?.length > 0) {
      return "country_ids";
    } else if (regionData?.length > 0) {
      return "region_ids";
    } else if (stateData?.length > 0) {
      return "state_ids";
    } else {
      return "city_ids";
    }
  };


  const getSchoolData = (data) => {
    setSchoolDetail(data)
  }


  const countryDetailsArray = [];
  countryData?.forEach((obj) => {
    const countryDetails = {
      country_id: (obj.value),
      country_code: (obj.code),
    };
    countryDetailsArray.push(countryDetails);
  });

  const regionDetailsArray = [];
  regionData?.forEach((obj) => {
    const regionDetails = {
      region_code: obj.code,
    };
    regionDetailsArray.push(regionDetails);
  });


  const stateDetailsArray = [];
  stateData?.forEach((obj) => {
    const stateDetails = {
      state_id: obj.value,
      state_code: obj.code,
    };
    stateDetailsArray.push(stateDetails);
  });

  const cityDetailsArray = [];
  cityData?.forEach((obj) => {
    const cityDetails = {
      city_id: obj.value,
      city_code: obj.code,
    };
    cityDetailsArray.push(cityDetails);
  });


  const campaignDetailsArray = [];
  campaignData?.forEach((obj) => {
    const campaignDetails = {
      campaign_id: obj.value,
      campaign_code: obj.code,
    };
    campaignDetailsArray.push(campaignDetails);
  });


  const sourceDetailsArray = [];
  sourceData?.forEach((obj) => {
    const sourceDetails = {
      source_id: obj.value,
      source_code: obj.code,
    };
    sourceDetailsArray.push(sourceDetails);
  });




  const subSourceDetailsArray = [];
  subsourceData?.forEach((obj) => {
    const subSourceDetails = {
      sub_source_id: obj.value,
      sub_source_code: obj.code,
    };

    subSourceDetailsArray.push(subSourceDetails);
  });


  const getAttrValue = (data) => {

    const updatedXAxisDetails = {
      matrix_attribute_id: data?.matrix_attribute_id_x, // Convert to string
      matrix_sub_attributes_source: data?.matrix_sub_attribute_name_x,
      matrix_sub_attributes_value_input_type: data?.matrix_sub_attribute_status_x,
      axis_min_val: data?.min_interval_x,
      axis_max_val: data?.max_interval_x,
      matrix_sub_attributes_value: (data?.value_x),
      matrix_sub_attribute_id: data?.matrix_sub_attribute_id_x,
    };
    const updatedYAxisDetails = {
      matrix_attribute_id: data?.matrix_attribute_id_y,
      matrix_sub_attributes_source: data?.matrix_sub_attribute_name_y,
      matrix_sub_attributes_value_input_type: data?.matrix_sub_attribute_status_y,
      axis_min_val: data?.minval,
      axis_max_val: data?.maxval,
      matrix_sub_attributes_value: (data?.value_y),
      matrix_sub_attribute_id: data?.matrix_sub_attribute_id_y


    };
    setXAxisDetails(updatedXAxisDetails);
    setYAxisDetails(updatedYAxisDetails);
    return data;
  };


  const updatedPackageData = (data) => {
    const packageData = data?.filter(item => item !== null);
    if (packageData) {
      setUpdatePrice(packageData)
    }
  }




  const getMRPPrice = (obj) => {
    const mrpValues = [];
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const match = obj[key].match(/MRP: (\d+)/);
        if (match) {
          const mrp = parseInt(match[1]);
          mrpValues.push(mrp);
        }
      }
    }
    return mrpValues;
  }


  const getMOPPrice = (obj) => {
    const mopValues = [];
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const match = obj[key].match(/MOP: (\d+)/);
        if (match) {
          const mop = parseInt(match[1]);
          mopValues?.push(mop);
        }
      }
    }
    return mopValues;
  }



  const modifySchoolData = (schoolDetail) => {
    const transformedArray = schoolDetail?.map(item => ({
      "school_code": item.schoolCode
    }));
    return transformedArray;
  }






  const addNewMatrix = async () => {
    let updateMatrixData = []


    updateMatrixData = isUpdatePrice?.map((obj, i) => {
      const mrp = getMRPPrice(obj);
      const mop = getMOPPrice(obj);
      const value = xAxisDetails?.matrix_sub_attributes_value?.map((val) => val)
      const valueY = yAxisDetails?.matrix_sub_attributes_value?.map((val) => val)
      const subIdX = xAxisDetails?.matrix_sub_attribute_id ? xAxisDetails?.matrix_sub_attribute_id?.[0]?.map((id) => id) : null
      const subIdY = yAxisDetails?.matrix_sub_attribute_id ? yAxisDetails?.matrix_sub_attribute_id?.[0]?.map((id) => id) : null


      const x_axis_details = mrp?.map((mrpValue, index) => ({
        "x-axis_matrix_attribute_id": xAxisDetails?.matrix_attribute_id,
        "x-axis_matrix_attribute_name": xAxisDetails?.matrix_sub_attributes_source,
        "x-axis_matrix_sub_attribute_id": subIdX ? parseFloat(subIdX[index]) : null,
        "x-axis_value": xAxisDetails?.matrix_sub_attributes_value_input_type == "inputbox" ?
          (parseInt(xAxisDetails?.axis_min_val) + parseInt(index * parseInt(xAxisDetails?.matrix_sub_attributes_value?.[0]))).toString() : value[index],
        "x-axis_mrp": mrpValue,
        "x-axis_mop": mop[index],
      }));

      return {
        "y-axis_matrix_attribute_id": yAxisDetails?.matrix_attribute_id,
        "y-axis_matrix_attribute_name": yAxisDetails?.matrix_sub_attributes_source,
        "y-axis_matrix_sub_attribute_id": subIdY ? parseFloat(subIdY[i]) : null,
        "y-axis_value": yAxisDetails?.matrix_sub_attributes_value_input_type == "inputbox" ?
          (parseInt(yAxisDetails?.axis_min_val) + parseInt(i * parseInt(yAxisDetails?.matrix_sub_attributes_value?.[0]))).toString() : valueY[i],
        "x-axis_details": x_axis_details,
      };
    });


    delete xAxisDetails?.matrix_sub_attribute_id;
    delete yAxisDetails?.matrix_sub_attribute_id



    let params = {
      uuid: uuid,
      matrix_status: "1",
      pricing_matrix_details: {
        matrix_name: matrixName?.toString(),
        matrix_type_id: parseInt(isMatrixType?.value),
        product_id: productName?.value,
        package_id: packageName?.value,
        syllabus_details: [
          {
            board_ids: boardData?.map((obj) => obj?.value),
            class_ids: classData?.map((obj) => obj?.value),
            syllabus_child_attribute: getBoardClassLstNode(),

          },
        ],
        location_details: [
          {
            country_details: countryDetailsArray,

            state_details: stateDetailsArray,
            city_details: cityDetailsArray,

            region_details: regionDetailsArray,


            location_child_attribute: getCountryCityLstNode(),
          },
        ],
        school_details: modifySchoolData(schoolDetail),
        campaign_details: campaignDetailsArray,
        source_details: [
          {
            source: sourceDetailsArray,

            sub_source_details: subSourceDetailsArray,

            source_child_attribute: getSourceLstNode(),
          },
        ],

        channel_ids: channelData?.map((obj) => obj?.value),


        x_axis_details: xAxisDetails,
        y_axis_details: yAxisDetails,
        matrix_details: updateMatrixData,
      },
    };

    if (checkMainProduct(params)) {
      addUpdateMatrix(params)
        .then(res => {
          if (res?.data?.status === 1) {
            toast.success(res?.data?.message)
            navigate('/authorised/matrix-list');
          }
          else if (res?.data?.status === 0) {
            let { errorMessage } = res?.data?.message
            toast.error(errorMessage)
          }
          else {
            console.error(res);
          }
        }).catch(error => {
          console.error('An error occurred:', error);
        });

    }

  }

  const priceMatrixCancelHandler = () => {
    navigate("/authorised/matrix-list");
  };

  const getAtrrShow = (data) => {
    if (data) {
      setAttrChart(true)
    }
  }
  useEffect(() => {
    const handleScroll = () => {
      if (
        boardOpen ||
        classOpen ||
        countryOpen ||
        cityOpen ||
        stateOpen ||
        regionOpen ||
        sourceOpen ||
        subSourceOpen ||
        campaignOpen ||
        channelOpen
      ) {
        handleClose(); // Close the options list when scrolling
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [
    boardOpen,
    classOpen,
    countryOpen,
    cityOpen,
    stateOpen,
    regionOpen,
    sourceOpen,
    subSourceOpen,
    campaignOpen,
    channelOpen,
  ]);

  useEffect(() => {
    getAllSchList();
  }, []);



  return (
    <>
      <Page
        title="Extramarks | Pricing Matrix"
        className="main-container myLeadPage datasets_container"
      >
        {!loading ?

          <div className={classes.loader}>
            {DisplayLoader()}
          </div>

          :

          <>
            <Grid className={classes.cusCard}>

              <Grid container spacing={3} sx={{ pt: "8px", pb: "24px" }}>
                <Grid item xs={12}>
                  <Typography className={classes.title}>Pricing Engine</Typography>
                </Grid>
              </Grid>

              <Grid container spacing={3} sx={{ py: "8px" }}>
                <Grid item md={6} xs={12}>
                  <Typography className={classes.label}>Matrix Name * </Typography>
                  <input
                    className={classes.inputStyle}
                    name="matrixName"
                    type="text"
                    readOnly={showMatrixForm}
                    placeholder="Name"
                    value={matrixName}
                    onChange={(e) => setMatrixName(e.target.value)}
                    maxLength={50}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <Typography className={classes.label}>Matrix Type *</Typography>
                  <SelectWithRadio
                    options={matrixTypeOption}
                    value={isMatrixType}
                    isDisabled={showMatrixForm}
                    onChange={handleChange}
                    type={"MatrixType"}
                  />
                </Grid>
                {!showMatrixForm ? (
                  <>
                    <Grid item md={12} xs={12}>
                      <RadioGroup
                        row
                        aria-label="selectedPackage"
                        name="selectedPackage"
                        value={selectedPackage}
                        onChange={(event) => setPackage(event.target.value)}
                      >
                        <FormControlLabel
                          value="packageBundle"
                          control={<Radio />}
                          label="Package Building"
                        />
                      </RadioGroup>
                    </Grid>
                    <Grid className={classes.btnSectionbtm}>
                      <Button
                        className={classes.submitBtn}
                        onClick={() => checkMatrixDetail()}
                      >
                        Next
                      </Button>
                    </Grid>
                  </>

                ) : (
                  ""
                )}
                {showMatrixForm ? (
                  <>


                    <Grid item md={4} xs={12}>
                      <Typography className={classes.label}>
                        Product Name *
                      </Typography>
                      <SelectWithRadio
                        options={productOption}
                        value={productName}
                        onChange={handleChange}
                        type={"productName"}
                      />
                    </Grid>
                    <Grid item md={4} xs={12}>
                      <Typography className={classes.label}>
                        Package Name *
                      </Typography>
                      <SelectWithRadio
                        options={packageOption}
                        value={packageName}
                        onChange={handleChange}
                        type={"packageName"}
                      />
                    </Grid>

                    {/* Board update */}
                    <Grid item md={4} xs={12}>
                      <Grid container direction="column">
                        <Typography className={classes.label}>Board*</Typography>
                        <FormControl fullWidth sx={{ '& div': { height: "40px", borderRadius: "4px" } }}>
                          <Select
                            labelId="demo-multiple-checkbox-label"
                            id="demo-multiple-checkbox"
                            multiple
                            value={boardData}
                            onChange={handleBoardChange}
                            renderValue={(selected) =>
                              selected?.map((x) => x?.label).join(", ")
                            }
                            MenuProps={{ ...MenuProps }}
                            open={boardOpen}
                            onOpen={() => handleOpen("boardData")} // Call the handleOpen function to open the options list
                            onClose={() => handleClose("boardData")}
                          >
                            {/* Add "Select All" option */}
                            <MenuItem value="select_all">
                              <Checkbox
                                checked={
                                  boardData?.length === boardList?.length
                                }
                              />
                              <ListItemText primary="Select All" />
                            </MenuItem>
                            {boardList.map((item) => (
                              <MenuItem key={item?.value} value={item}>
                                <Checkbox checked={boardData?.indexOf(item) > -1} />
                                <ListItemText primary={item?.label} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>


                    <Grid item md={4} xs={12}>
                      <Typography className={classes.label}>School </Typography>
                      <CheckboxAutocomplete data={schoolList} getSchoolData={getSchoolData} />
                    </Grid>
                    {/* Class update */}
                    <Grid item md={4} xs={12}>
                      <Grid container direction="column">
                        <Typography className={classes.label}>Class</Typography>
                        <FormControl fullWidth className={(boardData?.length >= 2 || !boardData.length) ? classes.disabledField : ''} sx={{ '& div': { height: "40px", borderRadius: "4px" } }}>
                          <Select
                            labelId="demo-multiple-checkbox-label"
                            id="demo-multiple-checkbox"
                            multiple
                            value={classData}
                            onChange={handleClassChange}
                            disabled={boardData?.length >= 2 || !boardData.length}
                            renderValue={(selected) => selected?.map((x) => x?.label).join(', ')}
                            MenuProps={MenuProps}
                            open={classOpen}
                            onOpen={() => handleOpen('classData')}
                            onClose={() => handleClose('classData')}
                          >
                            {/* Add "Select All" option */}
                            <MenuItem value="select_all">
                              <Checkbox checked={classData?.length === classList?.length} />
                              <ListItemText primary="Select All" />
                            </MenuItem>
                            {/* Render other class options */}
                            {classList?.map((item) => (
                              <MenuItem key={item?.value} value={item}>
                                <Checkbox checked={classData?.indexOf(item) > -1} />
                                <ListItemText primary={item?.label} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>



                    {/* Country */}
                    <Grid item md={4} xs={12}>
                      <Grid>
                        <Typography className={classes.label}>Country</Typography>
                        <FormControl fullWidth sx={{ '& div': { height: "40px", borderRadius: "4px" } }}>
                          <Select
                            labelId="demo-multiple-checkbox-label"
                            id="demo-multiple-checkbox"
                            multiple
                            value={countryData}
                            onChange={handleCountryChange}
                            // isDisabled={boardData?.length >= 2}
                            type={"countryData"}
                            renderValue={(selected) =>
                              selected?.map((x) => x?.label).join(", ")
                            }
                            MenuProps={MenuProps}
                            open={countryOpen}
                            onOpen={() => handleOpen("countryData")}
                            onClose={() => handleClose("countryData")}
                          >
                            {/* Add "Select All" option */}
                            <MenuItem value="select_all">
                              <Checkbox
                                checked={
                                  countryData.length === countrySelectData.length
                                }
                              />
                              <ListItemText primary="Select All" />
                            </MenuItem>

                            {/* Render other country options */}
                            {countrySelectData.map((item) => (
                              <MenuItem key={item?.id} value={item}>
                                <Checkbox
                                  checked={countryData?.indexOf(item) > -1}
                                />
                                <ListItemText primary={item?.label} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>


                    <Grid item md={4} xs={12}>
                      <Grid container direction="column">
                        <Typography className={classes.label}>Region</Typography>
                        <FormControl fullWidth className={countryData.length >= 2 ? classes.disabledField : ''} sx={{ '& div': { height: "40px", borderRadius: "4px" } }}>
                          <Select
                            labelId="demo-multiple-checkbox-label"
                            id="demo-multiple-checkbox"
                            multiple
                            value={regionData}
                            onChange={handleRegionChange}
                            disabled={countryData.length >= 2}
                            renderValue={(selected) => selected.map((x) => x.label).join(', ')}
                            MenuProps={MenuProps}
                            open={regionOpen}
                            onOpen={() => handleOpen('regionData')}
                            onClose={() => handleClose('regionData')}
                          >
                            {/* Add "Select All" option */}
                            <MenuItem value="select_all">
                              <Checkbox checked={regionData.length === territoryList.length} />
                              <ListItemText primary="Select All" />
                            </MenuItem>
                            {/* Render other region options */}
                            {territoryList.map((item) => (
                              <MenuItem key={item.id} value={item}>
                                <Checkbox checked={regionData.indexOf(item) > -1} />
                                <ListItemText primary={item.label} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>


                    <Grid item md={4} xs={12}>
                      <Grid>
                        <Typography className={classes.label}>State</Typography>
                        <FormControl fullWidth className={stateSelectData.length === 0 || countryData.length >= 2 || regionData.length >= 2 ? classes.disabledField : ''} sx={{ '& div': { height: "40px", borderRadius: "4px" } }}>
                          <Select
                            labelId="demo-multiple-checkbox-label"
                            id="demo-multiple-checkbox"
                            multiple
                            value={stateData}
                            onChange={handleStateChange}
                            type={'stateData'}
                            renderValue={(selected) => selected.map((x) => x.label).join(', ')}
                            MenuProps={MenuProps}
                            open={stateOpen}
                            onOpen={() => handleOpen('stateData')}
                            onClose={() => handleClose('stateData')}
                            disabled={stateSelectData.length === 0 || countryData.length >= 2 || regionData.length >= 2}
                          >
                            {/* Add "Select All" option */}
                            <MenuItem value="select_all">
                              <Checkbox checked={stateData.length === stateSelectData.length} />
                              <ListItemText primary="Select All" />
                            </MenuItem>

                            {/* Render other state options */}
                            {stateSelectData.map((item) => (
                              <MenuItem key={item.id} value={item}>
                                <Checkbox checked={stateData.indexOf(item) > -1} />
                                <ListItemText primary={item.label} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>


                    <Grid item md={4} xs={12}>
                      <Typography className={classes.label}>City</Typography>
                      <FormControl fullWidth className={citySelectData.length === 0 || countryData.length >= 2 || regionData.length >= 2 || stateData.length >= 2 ? classes.disabledField : ''}>
                        <Autocomplete
                          multiple
                          id="checkboxes-tags-demo"
                          options={citySelectData}
                          disableCloseOnSelect
                          getOptionLabel={(option) => option.label}
                          value={cityData}
                          onChange={handleCityChange}
                          renderOption={(props, option, { selected }) => (
                            <li {...props}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    style={{ marginRight: 8 }}
                                    checked={selected}
                                  />

                                }

                              //label={option.label}
                              />
                              <ListItemText primary={option.label} />
                            </li>

                          )}
                          renderInput={(params) => (
                            <TextField {...params} variant="outlined" label="Select City" />
                          )}

                        />
                      </FormControl>
                    </Grid>


                    <Grid item md={4} xs={12}>
                      <Grid>
                        <Typography className={classes.label}>Source</Typography>
                        <FormControl fullWidth sx={{
                          '& div': { height: "40px", borderRadius: "4px" }
                        }}>
                          <Select
                            labelId="demo-multiple-checkbox-label"
                            id="demo-multiple-checkbox"
                            multiple
                            value={sourceData}
                            onChange={handleSourceChange}
                            type={"sourceData"}
                            renderValue={(selected) =>
                              selected?.map((x) => x?.label).join(", ")
                            }
                            MenuProps={{
                              anchorOrigin: {
                                vertical: 'bottom',
                                horizontal: 'left',
                              },
                              transformOrigin: {
                                vertical: 'top',
                                horizontal: 'left',
                              },
                              getContentAnchorel: null,
                              style: { position: 'absolute', zIndex: 1000, height: "300px" },
                            }}
                            open={sourceOpen}
                            onOpen={() => handleOpen("sourceData")}
                            onClose={() => handleClose("sourceData")}
                            style={{ transform: 'none' }}
                          >
                            <MenuItem value="select_all">
                              <Checkbox
                                checked={sourceData.length === sourceOption.length}
                              />
                              <ListItemText primary="Select All" />
                            </MenuItem>
                            {sourceOption.map((item) => (
                              <MenuItem key={item?.id} value={item}>
                                <Checkbox
                                  checked={sourceData?.indexOf(item) > -1}
                                />
                                <ListItemText primary={item?.label} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>



                    <Grid item md={4} xs={12}>
                      <Grid container direction="column">
                        <Typography className={classes.label}>Sub-Source</Typography>
                        <FormControl fullWidth className={sourceData?.length >= 2 ? classes.disabledField : ''} sx={{ '& div': { height: "40px", borderRadius: "4px" } }}>
                          <Select
                            labelId="demo-multiple-checkbox-label"
                            id="demo-multiple-checkbox"
                            multiple
                            value={subsourceData}
                            onChange={handleSubsourceChange}
                            disabled={sourceData?.length >= 2}
                            renderValue={(selected) => selected?.map((x) => x?.label).join(', ')}
                            MenuProps={MenuProps}
                            open={subSourceOpen}
                            onOpen={() => handleOpen('subsourceData')}
                            onClose={() => handleClose('subsourceData')}
                          >
                            {/* Add "Select All" option */}
                            <MenuItem value="select_all">
                              <Checkbox checked={subsourceData?.length === subsourceOption?.length} />
                              <ListItemText primary="Select All" />
                            </MenuItem>
                            {/* Render other class options */}
                            {subsourceOption.map((item) => (
                              <MenuItem key={item?.id} value={item}>
                                <Checkbox checked={subsourceData?.indexOf(item) > -1} />
                                <ListItemText primary={item?.label} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>


                    {/* listCampaign */}

                    <Grid item md={4} xs={12}>
                      <Grid>
                        <Typography className={classes.label}>Campaign</Typography>
                        <FormControl fullWidth sx={{ '& div': { height: "40px", borderRadius: "4px" } }}>
                          <Select
                            labelId="demo-multiple-checkbox-label"
                            id="demo-multiple-checkbox"
                            multiple
                            value={campaignData}
                            onChange={handleCampaignChange}
                            type={"campaignData"}
                            renderValue={(selected) =>
                              selected?.map((x) => x?.label).join(", ")
                            }
                            MenuProps={MenuProps}
                            open={campaignOpen}
                            onOpen={() => handleOpen("campaignData")}
                            onClose={() => handleClose("campaignData")}
                          >
                            {/* Add "Select All" option */}
                            <MenuItem value="select_all">
                              <Checkbox
                                checked={
                                  campaignData?.length === campaignOption?.length
                                }
                              />
                              <ListItemText primary="Select All" />
                            </MenuItem>

                            {/* Render other channel options */}
                            {campaignOption.map((item) => (
                              <MenuItem key={item?.id} value={item}>
                                <Checkbox
                                  checked={campaignData?.indexOf(item) > -1}
                                />
                                <ListItemText primary={item?.label} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>

                    <Grid item md={4} xs={12}>
                      <Grid>
                        <Typography className={classes.label}>Channel *</Typography>
                        <FormControl fullWidth sx={{ '& div': { height: "40px", borderRadius: "4px" } }}>
                          <Select
                            labelId="demo-multiple-checkbox-label"
                            id="demo-multiple-checkbox"
                            multiple
                            value={channelData}
                            onChange={handleChannelChange}
                            type={"channelData"}
                            renderValue={(selected) =>
                              selected?.map((x) => x?.label).join(", ")
                            }
                            MenuProps={MenuProps}
                            open={channelOpen}
                            onOpen={() => handleOpen("channelData")}
                            onClose={() => handleClose("channelData")}
                          >
                            {/* Add "Select All" option */}
                            <MenuItem value="select_all">
                              <Checkbox
                                checked={
                                  channelData?.length === channelOption?.length
                                }
                              />
                              <ListItemText primary="Select All" />
                            </MenuItem>

                            {/* Render other channel options */}
                            {channelOption?.map((item) => (
                              <MenuItem key={item?.id} value={item}>
                                <Checkbox
                                  checked={channelData?.indexOf(item) > -1}
                                />
                                <ListItemText primary={item?.label} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </>
                ) : (
                  ""
                )}
              </Grid>

              {showMatrixForm ? (
                <>
                  <MatrixAttribute
                    productAttrData={productAttrData}
                    packageMOP={packageMOP}
                    packageMRP={packageMRP}
                    packageOption={packageOption}
                    getAttrValue={getAttrValue}
                    getAtrrShow={getAtrrShow}
                    onChildNextClick={handleNextClick}
                    updatedPackageData={updatedPackageData}
                    setIsNextClicked={setIsNextClicked}
                    isNextClicked={isNextClicked}
                  />

                  <Grid className={classes.btnSection}>
                    {isNextClicked && (
                      <>

                        <Button
                          style={{
                            marginRight: "10px",
                          }}
                          className={classes.submitBtn}
                          onClick={() => addNewMatrix()}
                        >
                          Submit
                        </Button>

                        <Button
                          className={classes.submitBtn}
                          onClick={() => priceMatrixCancelHandler()}
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                  </Grid>
                </>
              ) : (
                ""
              )}

            </Grid>
          </>
        }
      </Page>
    </>
  );
};
