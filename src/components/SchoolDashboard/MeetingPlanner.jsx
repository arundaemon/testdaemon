import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormLabel,
  Grid,
  InputAdornment,
  Modal,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useStyles } from "../../css/Dasboard-css";
import { Link, useNavigate } from "react-router-dom";
import { EventCalendar } from "../Calendar/EvtCalendar";
import { useEffect, useState } from "react";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TimePicker from "rc-time-picker";
import moment from "moment";
import { getSchoolCodeList } from "../../config/services/school";
import { getUserData } from "../../helper/randomFunction/localStorage";
import {
  addActivity,
  getBdeActivitiesByDate,
} from "../../config/services/bdeActivities";
import {
  getMultipleSchoolInterests,
  getProductListData,
  getSchoolInterests,
} from "../../config/services/leadInterest";
import MultipleSelectCheckmarks from "../SchoolActivityForm/AutocompleteWithButton";
import { getDetails } from "../../config/services/activityFormMapping";
import { toast } from "react-hot-toast";
import { Divider } from "@material-ui/core";
import envData from "../../config/settings";

import useMediaQuery from "@mui/material/useMediaQuery";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from "@mui/lab";
import { ReactComponent as IconDateLeftArrow } from "./../../assets/icons/icon-date-left-arrow.svg";
import { ReactComponent as IconDateRightArrow } from "./../../assets/icons/icon-date-right-arrow.svg";
import { ReactComponent as IconDateLeftArrow2 } from "./../../assets/icons/icon-meetings-mobile-left-arrow.svg";
import { ReactComponent as IconDateRightArrow2 } from "./../../assets/icons/icon-meetings-mobile-right-arrow.svg";
import { ReactComponent as IconTimelineDotActive } from "./../../assets/icons/icon-timeline-dot-active.svg";
import { ReactComponent as IconTimelineDot } from "./../../assets/icons/icon-timeline-dot.svg";
import { ReactComponent as IconFormInputSearch } from "./../../assets/icons/icon-form-input-search.svg";
import { ReactComponent as IconFormInputSearchCancel } from "./../../assets/icons/icon-cancel.svg";
import { ReactComponent as IconCalendar } from "./../../assets/icons/icon-calendar-disabled.svg";
import { ReactComponent as IconTimepicker } from "./../../assets/icons/icon-calendar-time-disabled.svg";
import { ReactComponent as IconRadioChecked } from "./../../assets/icons/icon-form-radio-checked.svg";
import { ReactComponent as IconRadioUnchecked } from "./../../assets/icons/icon-form-radio-unchecked.svg";
import ModalCustom from "../../theme/ModalCustom";
import { getB2BDefaultStageStatus } from "../../config/services/journeys";
import { isLogDay, isDisabledDate } from "../../helper/randomFunction";
import { getAllProductList } from "../../config/services/packageBundle";
import FormDatePicker from "../../theme/form/theme2/FormDatePicker";
import { ReactComponent as IconCalendar3 } from "./../../assets/icons/icon-calendar-3.svg";

import { ReactComponent as IconLogDay } from "./../../assets/icons/icon-planner-log-day-btn-mobile.svg";
import { ReactComponent as IconScheduleMeeting } from "./../../assets/icons/icon-planner-add-meeting-btn-mobile.svg";
import { getActivitiesDetail } from "../../config/services/activities";
import {
  FieldLabel,
  UserProfileName,
  fieldKey,
  fieldTab,
} from "../../constants/general";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "45%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export const MeetingPlanner = ({
  getPlannerActivity,
  schoolMeeting,
  isLogActivityStatus,
  referenceCode,
  referenceType,
  productRefCode,
  schoolReferenceCode,
  currentTabType = null,
  allSchool
}) => {
  const classes = useStyles();
  const [isActivity, setActivity] = useState(false);
  const [isMeetType, setMeetType] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [timeIn, setTimeIn] = useState(null);
  const [schoolCode, setSchoolCode] = useState("");
  const [search, setSearch] = useState("");
  const [schoolList, setSchoolList] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [leadId, setLeadID] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [interestOption, setOptions] = useState(null);
  const [userDetail, setUserDetail] = useState(null);
  const [interestId, setInterestId] = useState([]);
  const [interestMultiId, setMultiInterestId] = useState([]);
  const [selectInterest, setSelectInterest] = useState([]);
  const [selectMultiInterest, setSelectMultiInterest] = useState([]);
  const [productList, setProductList] = useState([]);
  const [meetingDate, setMeetingDate] = useState(new Date());
  const [isLogToday, setMeetingLog] = useState(false);
  const userRole = getUserData("userData")?.crm_role;
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [schoolInterest, setSchoolInterest] = useState([]);
  const [isMeetHappen, setMeetStatus] = useState("");
  const [schoolMultiInterest, setMultiInterest] = useState([]);
  const [selectedSchoolProduct, setSchoolProduct] = useState([]);
  const [multiProductList, setMultiProductList] = useState([]);
  const [productListData, setProductListData] = useState([]);
  const [stageName, setStageName] = useState(null);
  const [statusName, setStatusName] = useState(null);
  const [isMeetingAgenda, setMeetingAgenda] = useState("");
  const [isReferenceCode, setReferenceCode] = useState(null);
  const [isReferenceType, setReferenceType] = useState("");
  const [isMobileLogActivity, setMobileLogActivity] = useState(false);
  const [isSchoolRefereceCode, setSchoolReferenceCode] = useState("");
  const [isProductRefCode, setProductRefCode] = useState(false);
  const [isProfileInterest, setProfileInterest] = useState([]);
  const [isShowAllSchool, setAllSchoolFlag] = useState(false)

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

  const handleOpen = () => setActivity(true);
  const isShowCalendar = () => setMobileLogActivity(true);

  const handleCloseModal = () => setMobileLogActivity(false);

  const handleClose = () => {
    setSchoolName("");
    setSchoolList([]);
    setProductList([]);
    setStartDate("");
    setTimeIn("");
    setMeetType("");
    setActivity(false);
    setMeetingAgenda("");
    setSelectedSchool(null);
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (!isActivity) {
      handleClose();
    }
  }, [isActivity]);

  useEffect(() => {
    if (referenceCode && referenceType) {
      setReferenceCode(referenceCode);
      setReferenceType(referenceType);
      setActivity(true);
    }
  }, [referenceCode, referenceType, interestOption]);

  useEffect(() => {
    if (schoolReferenceCode && referenceType) {
      setSearch(schoolReferenceCode);
      setSchoolReferenceCode(schoolReferenceCode);
      setReferenceType(referenceType);
      getProfileBasedInterest();
      setTimeout(() => {
        setActivity(true);
      }, 1000);
    }
  }, [schoolReferenceCode, referenceType, interestOption]);

  // useEffect(() => {
  //   if (isActivity) {
  //     document.body.classList.add(classes.bodyNoScroll);
  //   } else {
  //     document.body.classList.remove(classes.bodyNoScroll);
  //   }
  // }, [isActivity, classes.bodyNoScroll]);

  const handleLogMeeting = () => {
    navigate("/authorised/logActivity", {
      state: {
        data: schoolMeeting,
        productListData: productListData,
        activityLogDate: moment(meetingDate).format("YYYY-MM-DD"),
      },
    });
  };

  const handleCloseMeeting = (status) => {
    setActivity(status);
  };

  const [fields, setFields] = useState([]);

  const getAllSchList = async () => {
    let roleName = getUserData("userData")?.crm_role;
    let params = {
      childRoleNames: [roleName],
      allSchool,
      search,
      count: 300,
    };
    try {
      let res = await getSchoolCodeList(params);
      if (res?.result) {
        setSchoolList(res?.result);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getProductList = () => {
    let params = {
      status: [1],
      uuid: getUserData("loginData")?.uuid,
      master_data_type: "package_products",
    };
    getAllProductList(params)
      .then((res) => {
        let data = res?.data?.master_data_list;
        let tempArray = data?.map((obj) => ({
          label: obj?.name,
          value: obj?.name,
          groupkey: obj?.group_key,
          groupName: obj?.group_name,
          productID: obj?.id,
          productCode: obj?.product_key,
        }));
        tempArray = tempArray?.filter((obj) => obj?.groupName && obj?.groupkey);
        setOptions(tempArray);
      })
      .catch((err) => {
        console.error(err, "Error while fetching product list");
      });
  };

  useEffect(() => {
    if (productRefCode) {
      setProductRefCode(productRefCode);
    }
  }, [productRefCode]);

  useEffect(() => {
    if (isProductRefCode) {
      setProductRefCode(productRefCode);
    }
  }, [isProductRefCode]);

  const getProductInterest = () => {
    let optionArray = interestOption?.map((obj) => obj);

    let interest = schoolInterest
      ?.filter((obj) => !(obj?.assignedTo_role_name === userRole))
      ?.map((obj) => obj?.learningProfile);

    let interestedId = schoolInterest?.map((obj) => {
      return {
        profileName: obj?.learningProfile,
        leadId: obj?.leadId,
        leadStage: obj?.stageName,
        leadStatus: obj?.statusName,
        schoolId: obj?.schoolId,
        schoolLeadId: userDetail?.leadId,
        productCode: obj?.learningProfileCode,
        learningProfileGroupCode: obj?.learningProfileGroupCode,
        learningProfileRefId: obj?.learningProfileRefId,
        learningProfileGroupName: obj?.learningProfileGroupName,
      };
    });

    interest = optionArray
      ?.map((obj) => {
        if (!interest?.includes(obj?.label)) {
          return {
            profileName: obj?.label,
            leadId: "",
            leadStage: "",
            leadStatus: "",
            schoolId: "",
            schoolLeadId: "",
            productCode: obj?.productCode,
            learningProfileGroupCode: obj?.groupkey,
            learningProfileRefId: obj?.productID,
            learningProfileGroupName: obj?.groupName,
          };
        }
      })
      .filter((obj) => obj);

    getLeadInterestId(interestedId?.concat(interest));
    setSelectInterest(interest);
  };

  const getLeadInterestId = (data) => {
    const uniqueValues = new Set();
    const filteredArray = data?.filter((item) => {
      if (!uniqueValues.has(item?.profileName)) {
        uniqueValues.add(item?.profileName);
        return true;
      }
      return false;
    });

    setInterestId(filteredArray);
  };

  const getSchoolCode = (data) => {
    setSchoolList([]);
    setSelectedSchool(data);
    setSchoolCode(data?.schoolCode);
    setSchoolName(data?.schoolName);
    setLeadID(data?.leadId);
  };

  const getProductData = (data) => {
    data = data?.map((obj) => obj?.profileName);
    let newArray = [];
    interestId?.map((obj) => {
      if (data?.includes(obj?.profileName)) {
        newArray.push({
          profileName: obj?.profileName,
          leadId: obj?.leadId,
          leadStage: obj?.leadStage,
          leadStatus: obj?.leadStatus,
          schoolId: obj?.schoolId,
          schoolLeadId: userDetail?.leadId,
          productCode: obj?.productCode,
          learningProfileGroupCode: obj?.learningProfileGroupCode,
          learningProfileRefId: obj?.learningProfileRefId,
          learningProfileGroupName: obj?.learningProfileGroupName,
        });
      }
    });
    setProductList(newArray);
  };

  const isCreatedInterest = () => {
    let isExistProduct = [];
    let selectedProductList = [];
    let productName;
    let productSchoolID;
    interestMultiId?.map((obj) => {
      productSchoolID = obj?.productSchoolID;

      return Object.entries(obj)?.map(([key, value]) => {
        if (typeof value === "object") {
          selectedProductList.push(value);
        }
      });
    });

    if (schoolMeeting?.length && selectedProductList?.length) {
      schoolMeeting?.map((data) => {
        selectedProductList?.map((obj) => {
          if (
            data?.name?.includes(obj?.profileName) &&
            obj?.schoolId === data?._id
          ) {
            isExistProduct.push({
              profileName: obj?.profileName,
              leadId: obj?.leadId,
              leadStage: obj?.leadStage,
              leadStatus: obj?.leadStatus,
              schoolId: obj?.schoolId,
              schoolLeadId: userDetail?.leadId,
              productCode: obj?.productCode,
              learningProfileGroupCode: obj?.learningProfileGroupCode,
              learningProfileRefId: obj?.learningProfileRefId,
              learningProfileGroupName: obj?.learningProfileGroupName,
            });
          }
        });
      });
    }

    if (isExistProduct?.length) {
      setMultiProductList(isExistProduct);
    }
  };

  const getProfileBasedInterest = () => {
    let interstArray = [];
    let data;
    if (interestOption?.length) {
      interestOption?.map((obj) => {
        data = {
          profileName: obj?.label,
          leadId: "",
          leadStage: "",
          leadStatus: "",
          schoolId: "",
          schoolLeadId: "",
          productCode: obj?.productCode,
          learningProfileGroupCode: obj?.groupkey,
          learningProfileRefId: obj?.productID,
          learningProfileGroupName: obj?.groupName,
        };
        interstArray.push(data);
      });
      if (UserProfileName?.includes(getUserData("userData")?.crm_profile)) {
        setProfileInterest(interstArray);
      }
    }
  };

  useEffect(() => {
    if (interestMultiId?.length) {
      isCreatedInterest();
    }
  }, [interestMultiId]);

  const getSchoolInterest = async () => {
    let params = {
      schoolId: leadId,
    };
    try {
      const res = await getSchoolInterests(params);
      if (res?.result?.length > 0) {
        setSchoolInterest(res?.result);
      } else {
        setSchoolInterest([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (leadId) {
      getSchoolInterest();
    }
  }, [leadId]);

  useEffect(() => {
    getProductList();
  }, []);

  useEffect(() => {
    getPlannerActivity(meetingDate);
    if (schoolMultiInterest.length) {
      setMultiInterest([]);
    }
    if (selectMultiInterest?.length) {
      setSelectMultiInterest([]);
    }
    if (interestMultiId?.length) {
      setMultiInterestId([]);
    }

    if (multiProductList?.length) {
      setMultiProductList([]);
    }
  }, [meetingDate]);

  useEffect(() => {
    if (interestOption) {
      getProductInterest();
    }
  }, [interestOption, schoolInterest]);

  useEffect(() => {
    if (selectedSchool) {
      setUserDetail(selectedSchool);
    }
  }, [selectedSchool]);

  useEffect(() => {
    const getData = setTimeout(() => {
      if (search) {
        getAllSchList();
      }
    }, 500);

    return () => clearTimeout(getData);
  }, [search, allSchool]);

  useEffect(() => {
    if (interestId) {
      getProductData();
    }
  }, [interestId]);

  const logDefaultActivity = async () => {
    let data;

    data = productList?.map((obj) => {
      return {
        meetingType: isMeetType,
        leadStage: obj?.leadStage ? obj?.leadStage : stageName,
        leadStatus: obj?.leadStatus ? obj?.leadStatus : statusName,
        profileName: obj?.profileName,
        productCode: obj?.productCode,
      };
    });

    if (isReferenceCode) {
      data = [
        {
          meetingType: isMeetType,
          leadStage: stageName,
          leadStatus: statusName,
          profileName: isReferenceCode,
          productCode: "",
          type: fieldTab?.Implementation,
        },
      ];
    }

    let params = { data };
    try {
      let res = await getDetails(params);
      return res;
    } catch (err) {
      console.error(err);
    }
  };

  const validateFieldInArray = (arr, fieldNames) => {
    arr.forEach((obj, index) => {
      fieldNames.forEach((fieldName) => {
        if (!obj.hasOwnProperty(fieldName) || obj[fieldName] === "") {
          toast.error("Please Add Correct Mapping");
          throw new Error(
            `Field "${fieldName}" not found in object at index ${index}`
          );
        }
      });
    });
  };

  const getLogActivity = () => {
    let Data = schoolMeeting?.map((obj) => {
      return {
        isMeeting: "",
        startDate: "",
        timeIn: "",
        comment: "",
        schoolProduct: obj?.name,
        schoolCity: obj?.schoolCity,
        schoolState: obj?.schoolState,
        schoolName: obj?.schoolName,
        schoolID: obj?._id,
      };
    });

    let schoolData = schoolMeeting?.map((obj) => {
      return {
        schoolProductName: obj?.name,
        schoolID: obj?._id,
      };
    });

    if (Data?.length) {
      setFields(Data);
    }

    if (schoolData?.length) {
      setSchoolProduct(schoolData);
    }
  };

  useEffect(() => {
    if (schoolMeeting?.length) {
      getMultipleActivity();
    }
    getLogActivity();
  }, [schoolMeeting]);

  const getMultipleActivity = async () => {
    let schoolIdArr = schoolMeeting?.map((obj) => obj?.schoolId);
    let params = { schoolIdArr };
    try {
      const res = await getMultipleSchoolInterests(params);
      if (res?.result?.length) {
        setMultiInterest(res?.result);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const validateField = () => {

    if (!selectedSchool?.schoolName) {
      toast.error("Please Select School");
      return false;
    }

    if (!productList?.length > 0 && !isReferenceCode) {
      toast.error("Please Select Product");
      return false;
    }

    if (!startDate) {
      toast.error("Please Select Follow Up Date");
      return false;
    }

    if (!timeIn) {
      toast.error("Please Select Follow Up Time");
      return false;
    }
    
    if (!isMeetType) {
      toast.error("Please Select Meeting Type");
      return false;
    }

    return true;
  };

  const getLeadID = (data) => {
    let { activityID, isActivityID, leadID, referenceCode, referenceType } =
      data;

    let leadId = isActivityID?.find((obj) => obj?.ID === activityID);

    if (fieldTab?.collection === referenceType) {
      return leadID;
    }

    if (leadId[fieldKey?.Implementation] && referenceCode) {
      return isReferenceCode;
    }
    return leadID;
  };

  const getLeadType = (data) => {
    let { activityID, isActivityID, referenceType } = data;

    if (referenceType) {
      return fieldTab?.implementation;
    }

    return fieldTab?.interest;
  };

  const createActivity = async () => {
    const { finalResult } = await logDefaultActivity();

    let followUpDate = moment(new Date(startDate)).format("YYYY-MM-DD");
    let followUpTime = moment(timeIn).format("hh:mm A");

    let followUpDateTime = `${followUpDate} ${followUpTime}`;

    if (validateField()) {
      try {
        validateFieldInArray(finalResult, ["activityId", "futureActivityId"]);
        let params;
        // const result = finalResult?.map((obj) => obj?.activityId);

        // let params = {
        //   activityIdArr: result,
        // };

        // let isActivityRes = await getActivitiesDetail(params);

        // isActivityRes = isActivityRes?.result;

        if (productList?.length > 0 && !isReferenceCode) {
          let Data = productList?.map((data) => {
            let newArray = [];
            let { activityId, futureActivityId, stageName, statusName } =
              finalResult?.find((obj) => obj?.product === data?.profileName);
            let newObj = {
              ...data,
              activityId: activityId,
              futureActivityId: futureActivityId,
              leadStage: stageName,
              leadStatus: statusName,
            };
            newArray.push(newObj);
            return newArray;
          });

          params = {
            activityObj: Data?.flat()?.map((obj) => {
              let isActivityParams = {
                referenceType: isReferenceType,
              };
              return {
                leadId: obj?.leadId,
                name: obj?.profileName,
                createdBy: getUserData("loginData")?.uuid,
                createdByRoleName: getUserData("userData")?.crm_role,
                createdByProfileName: getUserData("userData")?.crm_profile,
                createdByName: getUserData("userData")?.name,
                leadType: getLeadType(isActivityParams),
                meetingType: isMeetType,
                empCode: getUserData("userData")?.employee_code,
                ownerLeadId: userDetail?.leadId,
                startDateTime: followUpDateTime,
                leadStage: obj?.leadStage,
                leadStatus: obj?.leadStatus,
                schoolId: obj?.schoolId ? obj?.schoolId : obj?.schoolLeadId,
                activityId: obj?.activityId,
                futureActivityId: obj?.futureActivityId,
                schoolName: selectedSchool?.schoolName,
                schoolCode: selectedSchool?.schoolCode,
                schoolCity: selectedSchool?.city,
                schoolState: selectedSchool?.state,
                schoolAddress: selectedSchool?.address,
                learningProfileGroupCode: obj?.learningProfileGroupCode,
                learningProfileRefId: obj?.learningProfileRefId,
                learningProfileCode: obj?.productCode,
                learningProfileGroupName: obj?.learningProfileGroupName,
                meetingAgenda: isMeetingAgenda,
                ownerType: FieldLabel?.interest,
              };
            }),
          };
        } else {
          let isActivityParams = {
            referenceType: isReferenceType,
          };
          params = {
            activityObj: finalResult?.map((obj) => {
              return {
                leadId: !(UserProfileName?.includes(getUserData("userData")))
                  ?.crm_profile
                  ? isReferenceCode
                  : obj?.leadId,
                name: !(UserProfileName?.includes(getUserData("userData")))
                ?.crm_profile
                ? isReferenceCode
                : obj?.profileName,
                createdBy: getUserData("loginData")?.uuid,
                createdByRoleName: getUserData("userData")?.crm_role,
                createdByProfileName: getUserData("userData")?.crm_profile,
                createdByName: getUserData("userData")?.name,
                leadType: getLeadType(isActivityParams),
                meetingType: isMeetType,
                empCode: getUserData("userData")?.employee_code,
                ownerLeadId: userDetail?.leadId,
                startDateTime: followUpDateTime,
                leadStage: obj?.leadStage,
                leadStatus: obj?.leadStatus,
                schoolId: selectedSchool?.leadId,
                activityId: obj?.activityId,
                futureActivityId: obj?.futureActivityId,
                schoolName: selectedSchool?.schoolName,
                schoolCode: selectedSchool?.schoolCode,
                schoolCity: selectedSchool?.city,
                schoolState: selectedSchool?.state,
                schoolAddress: selectedSchool?.address,
                learningProfileGroupCode: "",
                learningProfileRefId: "",
                learningProfileCode: "",
                learningProfileGroupName: "",
                meetingAgenda: isMeetingAgenda,
                ownerType: FieldLabel?.interest,
              };
            }),
          };
        }

        try {
          let res = await addActivity(params);
          if (res?.result) {
            toast.success(res?.message);
            //window.location.reload(false);
            getPlannerActivity(meetingDate);
            handleClose();
            isLogActivityStatus(true);
            //setOpen(false)
          } else {
            toast.error(res?.data?.error?.message);
            return false;
          }
        } catch (err) {
          console.error(err);
        }
      } catch (error) {
        console.error(error.message);
      }
    }
  };

  const handleFieldData = (index, attr, event) => {
    const newFields = [...fields];
    newFields[index][attr] = event;
    setFields(newFields);
  };

  const createSchoolProduct = async () => {
    let params;
    let data = schoolMeeting?.map((obj) => {
      return {
        schoolId: obj?.schoolId,
        roleName: getUserData("userData")?.crm_role,
      };
    });
    params = { data };
    try {
      let res = await getProductListData(params);
      if (res?.data?.length) {
        setProductListData(res?.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (schoolMeeting?.length) {
      createSchoolProduct();
    }
  }, [schoolMeeting]);

  const meetingSchedule = (obj, index) => {
    return (
      <>
        <Grid item md={4} xs={4} sx={{ mt: "10px" }}>
          <Typography className={classes.label}>
            <p>Next Meeting :</p>
            (Date / Time)
          </Typography>
        </Grid>
        <Grid item md={4} xs={4}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Stack spacing={3}>
              <DesktopDatePicker
                className="customDatePicker"
                id={`fields[${index}].startDate`}
                value={obj?.startDate}
                inputProps={{ readOnly: true }}
                onChange={(event) => handleFieldData(index, "startDate", event)}
                renderInput={(params) => <TextField {...params} />}
              />
            </Stack>
          </LocalizationProvider>
        </Grid>
        <Grid item md={4} xs={4}>
          <TimePicker
            id={`fields[${index}].timeIn`}
            className={"customTPicker"}
            value={obj?.timeIn}
            onChange={(value) => handleFieldData(index, "timeIn", value)}
            showSecond={false}
            use24Hours
            inputReadOnly
            // disabledHours={disabledHours}
            // disabledMinutes={disabledMinutes}
            defaultValue={moment()}
          />
        </Grid>
        <Grid item md={4} xs={4}>
          <Typography
            className={classes.label}
            sx={{
              marginBottom: "12px !important",
              fontSize: "15px !important",
            }}
          >
            Comments *
          </Typography>
        </Grid>
        <Grid item md={8} xs={8}>
          <textarea
            className={classes.textAreainputStyle}
            id={`fields[${index}].comment`}
            name={obj?.comment}
            rows="4"
            cols="50"
            type="text"
            placeholder=""
            value={obj?.comment}
            onChange={(event) =>
              handleFieldData(index, "comment", event.target.value)
            }
            // onKeyDown={handleKeyTextDown}
            // onPaste={handleTextPaste}
            // maxLength={100}
          />
        </Grid>
      </>
    );
  };

  const isCreatedProduct = (obj, pd) => {
    let schoolProduct = selectedSchoolProduct?.find(
      (data) => data?.schoolID === obj?.schoolID
    );
    let checkProduct = schoolProduct?.schoolProductName;
    let productName = pd?.profileName;
    checkProduct = checkProduct?.includes(productName) ? true : false;
    return checkProduct;
  };

  const disabledHours = () => {
    const currentDate = moment();
    // const isCurrentDateGreater = startDate?.isAfter(currentDate, "day");

    let strDate = moment(new Date(startDate)).format("YYYY-MM-DD");
    strDate = moment(strDate);
    const isSameDay = currentDate.isSame(strDate, "day");

    const currentHour = moment().hours();
    if (isSameDay) {
      return Array.from({ length: currentHour }, (_, index) => index);
    } else {
      return [];
    }
  };

  const disabledMinutes = (selectedHour) => {
    const currentDate = moment();

    let strDate = moment(new Date(startDate)).format("YYYY-MM-DD");
    strDate = moment(strDate);
    const isSameDay = currentDate.isSame(strDate, "day");

    if (isSameDay) {
      if (selectedHour === moment().hours()) {
        const currentMinute = moment().minutes();
        return Array.from({ length: currentMinute }, (_, index) => index);
      }
      return [];
    } else {
      return [];
    }
  };

  const isLogActivityDay = isLogDay(meetingDate);

  const isDisabledLog = isDisabledDate(meetingDate);

  const getDefaultStageStatus = async () => {
    try {
      const res = await getB2BDefaultStageStatus();
      if (res?.data) {
        let journeyStage = res?.data?.stageName;
        let journeyStatus = res?.data?.statusName;
        setStageName(journeyStage);
        setStatusName(journeyStatus);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getDefaultStageStatus();
  }, []);

  const LeftNavigation = () => {
    return isMobile ? (
      <IconDateLeftArrow2
        className={
          isDisabledLog
            ? `${classes.isDiabledBtn} crm-sd-planner-date-arrows left`
            : "crm-sd-planner-date-arrows left"
        }
        onClick={() => {
          if (!isDisabledLog) {
            setMeetingDate(
              moment(
                meetingDate ? meetingDate : moment(),
                "YYYY-MM-DD"
              ).subtract(1, "days")
            );
          }
        }}
      />
    ) : (
      <IconDateLeftArrow
        className={
          isDisabledLog
            ? `${classes.isDiabledBtn}`
            : "crm-sd-planner-date-arrows"
        }
        onClick={() => {
          if (!isDisabledLog) {
            setMeetingDate(
              moment(
                meetingDate ? meetingDate : moment(),
                "YYYY-MM-DD"
              ).subtract(1, "days")
            );
          }
        }}
      />
    );
  };

  const RightNavigation = () => {
    return isMobile ? (
      <IconDateRightArrow2
        className="crm-sd-planner-date-arrows"
        onClick={() =>
          setMeetingDate(
            moment(meetingDate ? meetingDate : moment(), "YYYY-MM-DD").add(
              1,
              "days"
            )
          )
        }
      />
    ) : (
      <IconDateRightArrow
        className="crm-sd-planner-date-arrows"
        onClick={() =>
          setMeetingDate(
            moment(meetingDate ? meetingDate : moment(), "YYYY-MM-DD").add(
              1,
              "days"
            )
          )
        }
      />
    );
  };

  const HeaderTitle = () => {
    return (
      <Typography component="span" className="crm-sd-planner-timeline-date">
        {moment(meetingDate ? meetingDate : moment()).format("Do MMM YYYY")}
      </Typography>
    );
  };

  const getSelectedDate = (date) => {
    let selectedDate = moment(date).format("YYYY-MM-DD");
    setMeetingDate(selectedDate);
  };

  return (
    <>
      {currentTabType === "planner-mobile" ? (
        <>
          <Box className="crm-sd-planner-actions">
            <Button
              className="crm-sd-planner-action-logday"
              onClick={isShowCalendar}
            >
              <IconLogDay className="crm-sd-planner-action-icon" />
              <Box className="crm-sd-planner-action-title">Log My Day</Box>
            </Button>
            <Button
              className="crm-sd-planner-action-schedule"
              onClick={handleOpen}
            >
              <IconScheduleMeeting className="crm-sd-planner-action-icon" />
              <Box className="crm-sd-planner-action-title">
                Schedule Meeting
              </Box>
            </Button>
          </Box>
        </>
      ) : null}

      <Box className="crm-sd-heading">
        {isMobile ? (
          <>
            {currentTabType === "planner-mobile" ? (
              <>
                <Typography component="h2">Calendar</Typography>
                <Typography component="p">
                  Browse important events with a click
                </Typography>
              </>
            ) : (
              <>
                <Typography component="h2">Tasks for the Day</Typography>
                <Typography component="p">
                  Browse important upcoming tasks with a click
                </Typography>
              </>
            )}
          </>
        ) : (
          <>
            {/* <Typography component="h2">Today’s Meetings</Typography>
            <Typography component="p">
              Collaboration in Action: Building for Tomorrow
            </Typography> */}
            <Typography component="h2">Calendar</Typography>
            <Typography component="p">
              Browse important events with a click
            </Typography>
          </>
        )}
      </Box>
      <Box
        className={
          `crm-sd-planner-timeline ` +
          (isMobile ? `crm-sd-planner-timeline2 ` : ``)
        }
      >
        <Box className="crm-sd-planner-timeline-container">
          {isMobile ? (
            <Box className="crm-sd-planner-date-scroller">
              <Box className="">
                <IconCalendar3 />
                <HeaderTitle />
              </Box>
              {currentTabType !== "dashboard-mobile" ? (
                <Box className="">
                  <LeftNavigation />
                  <RightNavigation />
                </Box>
              ) : null}
            </Box>
          ) : (
            <Box className="crm-sd-planner-date-scroller">
              <LeftNavigation />
              <HeaderTitle />
              <RightNavigation />
            </Box>
          )}
          <Box className="crm-sd-planner-meeting-list">
            {schoolMeeting?.length ? (
              schoolMeeting?.map((item, i) => {
                if (isMobile) {
                  return (
                    <Box className="crm-sd-planner-meeting-list-item" key={i}>
                      <Box className="crm-space-between crm-heading-space">
                        <Box className="crm-sd-planner-meeting-list-item-content-location">
                          {item?.schoolName}
                          {/* {item?.schoolCity} */}
                        </Box>
                        <Box className="crm-sd-planner-meeting-list-item-content-time">
                          {moment.utc(item?.meetingDate?.[0]).format("hh:mm A")}
                        </Box>
                      </Box>
                      <Box className="crm-sd-planner-meeting-list-item-content-title">
                        {item?.meetingAgenda}
                      </Box>
                      <Box className="crm-sd-planner-meeting-list-item-content-product">
                        {item?.name?.join(", ")}
                      </Box>
                    </Box>
                  );
                } else {
                  return (
                    <Box className="crm-sd-planner-meeting-list-item" key={i}>
                      <Timeline>
                        <TimelineItem>
                          <TimelineOppositeContent color="text.secondary">
                            <Box className="crm-sd-planner-meeting-list-item-content-time">
                              {moment
                                .utc(item?.meetingDate?.[0])
                                .format("hh:mm A")}
                            </Box>
                          </TimelineOppositeContent>
                          <TimelineSeparator>
                            {i === 0 ? (
                              <IconTimelineDotActive className="crm-sd-planner-meeting-list-item-dot" />
                            ) : (
                              <IconTimelineDot className="crm-sd-planner-meeting-list-item-dot" />
                            )}
                            <TimelineConnector />
                          </TimelineSeparator>
                          <TimelineContent>
                            <Box className="crm-sd-planner-meeting-list-item-content">
                              <Box className="crm-sd-planner-meeting-list-item-content-product">
                                {item?.name?.join(", ")}
                              </Box>
                              <Box className="crm-sd-planner-meeting-list-item-content-title">
                                {item?.schoolName}
                              </Box>
                              <Box className="crm-sd-planner-meeting-list-item-content-location">
                                {item?.schoolCity}
                              </Box>
                            </Box>
                          </TimelineContent>
                        </TimelineItem>
                      </Timeline>
                    </Box>
                  );
                }
              })
            ) : (
              <Box className="crm-no-results">"No Meetings"</Box>
            )}
          </Box>

          {/* {
            (currentTabType === 'planner-mobile')
              ? <>
                  <Box className="crm-sd-planner-action-mobile">
                      <Button className="crm-btn crm-btn-primary crm-btn-fluid">View All</Button>
                  </Box>
                  
                </>
              : null
          } */}
        </Box>

        {!isMobile ? (
          <Box className="crm-sd-planner-timeline-actions">
            {isLogActivityDay && (
              <Button
                className="crm-btn crm-btn-outline"
                onClick={handleLogMeeting}
              >
                {" "}
                Log my day{" "}
              </Button>
            )}
            <Button className="crm-btn crm-btn-primary" onClick={handleOpen}>
              {" "}
              Add{" "}
            </Button>
          </Box>
        ) : null}
      </Box>

      {isActivity ? (
        // <Modal
        //   open={isActivity}
        //   onClose={handleClose}
        //   aria-labelledby="modal-modal-title"
        //   aria-describedby="modal-modal-description"
        //   className={classes.modal}
        // >

        // </Modal>

        <ModalCustom
          isModalOpened={isActivity}
          handleClose={handleClose}
          modalTitle="Create Meeting"
          headerAligment="center"
          headerMobileAlignment="left"
          handleModalSubmit={createActivity}
          handleCloseMeeting={handleCloseMeeting}
          submitText="Create"
          modalMobileSize="full"
          mobileActionButtonSize="lg"
        >
          <Box>
            <Grid container spacing={2}>
              <Grid item md={6} xs={12}>
                <Typography
                  className="crm-sd-add-meeting-form-label"
                  component="h6"
                >
                  School Code/Name{" "}
                </Typography>
                <TextField
                  autoComplete="off"
                  className="crm-form-input medium-dark"
                  name="schoolName"
                  placeholder="Search"
                  value={schoolName}
                  InputProps={{
                    readOnly: productRefCode ? true : false,
                    endAdornment:
                      !productRefCode &&
                      (schoolName ? (
                        <IconFormInputSearchCancel
                          onClick={() => setSchoolName("")}
                          className="crm-form-input-clearicon"
                        />
                      ) : (
                        <IconFormInputSearch className="crm-form-input-endicon" />
                      )),
                  }}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setSchoolName(e.target.value);
                    setSchoolList([]);
                    setSchoolCode("");
                    setLeadID("");
                    setSelectedSchool("");
                  }}
                />
                {!selectedSchool ? (
                  <div
                    style={
                      schoolList?.length > 0
                        ? {
                            height: "220px",
                            overflow: "scroll",
                            position: "absolute",
                            background: "#fff",
                            width: isMobile
                              ? "calc(100% - 20px)"
                              : "calc(50% - 30px)",
                            zIndex: "99999999",
                            boxShadow: "0 0 4px #00000029",
                            borderBottomLeftRadius: "4px",
                            borderBottomRightRadius: "4px",
                          }
                        : { height: "0" }
                    }
                  >
                    {schoolList?.map((obj, key) => {
                      if (search === schoolReferenceCode) {
                        getSchoolCode(obj);
                      }
                      return (
                        <div
                          key={key}
                          className="crm-sd-add-meeting-select-dropdown"
                          onClick={() => getSchoolCode(obj)}
                          style={{ cursor: "pointer" }}
                        >
                          {`${obj?.schoolCode}-${obj?.schoolName}`}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  ""
                )}
              </Grid>
              {referenceCode ? (
                <Grid item md={6} xs={12}>
                  <Typography
                    className="crm-sd-add-meeting-form-label"
                    component="h6"
                  >
                    Implementation Number{" "}
                  </Typography>
                  <TextField
                    autoComplete="off"
                    className="crm-form-input medium-dark"
                    name="schoolName"
                    placeholder="Search"
                    value={isReferenceCode}
                    readOnly={true}
                  />
                </Grid>
              ) : (
                <Grid item md={6} xs={12}>
                  <Typography className="crm-sd-add-meeting-form-label">
                    Products {/* <br/> */}(
                    <span style={{ fontSize: "11px" }}>
                      Products that you would like to pitch
                    </span>
                    )
                  </Typography>
                  <MultipleSelectCheckmarks
                    label={"Select Products"}
                    productData={productList}
                    getInputData={getProductData}
                    data={
                      !(isProfileInterest?.length > 0)
                        ? selectInterest
                        : isProfileInterest
                    }
                    isDisabled={selectedSchool ? false : true}
                    type={"productList"}
                  />
                </Grid>
              )}

              <Grid item md={6} xs={12}>
                <Typography className="crm-sd-add-meeting-form-label">
                  Date{" "}
                </Typography>

                <FormDatePicker
                  value={startDate}
                  minDateValue={
                    new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000)
                  }
                  theme="medium-dark"
                  handleSelectedValue={(newValue) => {
                    setStartDate(newValue);
                    setTimeIn(null);
                  }}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <Typography className="crm-sd-add-meeting-form-label">
                  Time{" "}
                </Typography>
                <TimePicker
                  className="crm-form-input medium-dark position-relative"
                  value={timeIn}
                  onChange={(value) => setTimeIn(value)}
                  showSecond={false}
                  use24Hours
                  inputReadOnly
                  disabledHours={disabledHours}
                  disabledMinutes={disabledMinutes}
                  defaultValue={moment()}
                  inputIcon={
                    <IconTimepicker className="crm-form-timepicker-icon" />
                  }
                />
              </Grid>
              <Grid item md={6} xs={12} sx={{ mt: "10px" }}>
                <Typography className="crm-sd-add-meeting-form-Label">
                  Meeting Agenda
                </Typography>
                <TextField
                  autoComplete="off"
                  className="crm-form-input medium-dark"
                  name="customerName"
                  type="text"
                  placeholder="Enter Meeting Agenda"
                  value={isMeetingAgenda}
                  onChange={(e) => setMeetingAgenda(e.target.value)}
                />
              </Grid>
              <Grid item md={6} xs={12} sx={{ mt: "10px" }}>
                <Typography className="crm-sd-add-meeting-form-label">
                  Meeting Type{" "}
                </Typography>
                <RadioGroup
                  row
                  className={classes.schoolRadioFont}
                  aria-label="referredBy"
                  name="meetingType"
                  value={isMeetType}
                  onChange={(e) => setMeetType(e.target.value)}
                >
                  <FormControlLabel
                    className="crm-form-input-radio"
                    value="Virtual"
                    control={
                      <Radio
                        uncheckedIcon={<IconRadioUnchecked />}
                        checkedIcon={
                          <IconRadioChecked className="crm-form-radio-checked-icon" />
                        }
                      />
                    }
                    label="Virtual"
                  />
                  <FormControlLabel
                    className="crm-form-input-radio"
                    value="Physical"
                    control={
                      <Radio
                        uncheckedIcon={<IconRadioUnchecked />}
                        checkedIcon={
                          <IconRadioChecked className="crm-form-radio-checked-icon" />
                        }
                      />
                    }
                    label="Physical"
                  />
                </RadioGroup>
              </Grid>
            </Grid>
          </Box>
        </ModalCustom>
      ) : null}
      {isMobileLogActivity && (
        // <Modal
        //   open={isMobileLogActivity}
        //   onClose={handleCloseModal}
        //   aria-labelledby="modal-modal-title"
        //   aria-describedby="modal-modal-description"
        // >
        <ModalCustom
          isModalOpened={isMobileLogActivity}
          handleClose={handleCloseModal}
          modalTitle="Log My Day"
          headerAligment="center"
          headerMobileAlignment="center"
          handleModalSubmit={handleLogMeeting}
          handleCloseMeeting={handleCloseModal}
          submitText="Submit"
          modalMobileSize="full"
          mobileActionButtonSize="sm"
          submitActionEnabled={false}
          className={"crm-modal-calendar-static"}
        >
          <Box>
            <EventCalendar getSelectedDate={getSelectedDate} />
            <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
              {isLogActivityDay && (
                <Button
                  className="crm-btn crm-btn-primary"
                  onClick={handleLogMeeting}
                >
                  Submit
                </Button>
              )}
            </Box>
          </Box>
        </ModalCustom>
      )}
    </>
  );
};
