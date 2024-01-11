import {
  Box,
  Breadcrumbs,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  Modal,
  Fade,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import moment from "moment";
import TimePicker from "rc-time-picker";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ReactSelect, { components } from "react-select";
import {
  getActivityMappingDetails,
  getDependentFields,
  getDetails,
} from "../../config/services/activityFormMapping";
import {
  getBdeActivitiesByDate,
  logMeetingActivity,
} from "../../config/services/bdeActivities";
import { getAllKeyValues } from "../../config/services/crmMaster";
import { getAllProductList } from "../../config/services/packageBundle";
import { getB2BDefaultStageStatus } from "../../config/services/journeys";
import {
  getMultipleSchoolInterests,
  getSchoolInterests,
} from "../../config/services/leadInterest";
import { updateContactDetails } from "../../config/services/school";
import { useStyles } from "../../css/Dasboard-css";
import { getUserData } from "../../helper/randomFunction/localStorage";
import Page from "../Page";
import MultipleSelectContact from "../SchoolActivityForm/MultiSelectAutoComplete";
import IconBreadcrumbArrow from "./../../assets/icons/icon-breadcrumb-arrow.svg";
import { ReactComponent as IconTimepicker } from "./../../assets/icons/icon-calendar-time-disabled.svg";
import { ReactComponent as IconNavLeft } from "./../../assets/icons/icon-nav-left-arrow.svg";
import { DynamicActivityFormLog } from "./DynamicActivityForm";
import FormDatePicker from "../../theme/form/theme2/FormDatePicker";
import { ReactComponent as DropDownIcon } from "../../assets/icons/icon-dropdown-2.svg";
import { DisplayLoader } from "../../helper/Loader";
import {
  FieldLabel,
  PAYMENTMODE,
  UserProfileName,
  fieldKey,
  fieldTab,
  subjectType,
} from "../../constants/general";
import ModalCustom from "../../theme/ModalCustom";
import { getActivitiesDetail } from "../../config/services/activities";
import { handleKeyDown, handlePaste } from "../../helper/randomFunction";
import FormMultiSelect from "../../theme/form/theme2/FormMultiSelect";

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

export const LogDayActivity = () => {
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
  const [meetingLogDate, setMeetingDate] = useState(null);
  const [schoolMeeting, setSchoolMeeting] = useState([]);
  const [isLogToday, setMeetingLog] = useState(false);
  const userRole = getUserData("userData")?.crm_role;
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [schoolInterest, setSchoolInterest] = useState([]);
  const [isMeetHappen, setMeetStatus] = useState("");
  const [schoolMultiInterest, setMultiInterest] = useState([]);
  const [selectedSchoolProduct, setSchoolProduct] = useState([]);
  const [multiProductList, setMultiProductList] = useState([]);
  const [customList, setCustomList] = useState([]);
  const [dbState, setConstant] = useState([]);
  const [crmMasterKey, setMasterKey] = useState([]);
  const [dynamicfield, setDynamicFields] = useState([]);
  const [finalProductData, setFinalProductData] = useState([]);
  const navigate = useNavigate();
  const [productCount, setCount] = useState([]);
  const [multiPrdList, setMultiPrdList] = useState([]);
  const [schoolProductList, setSchoolListPrd] = useState([]);
  const [storageList, setStorageData] = useState(null);
  const [isApp, setIsApp] = useState(localStorage.getItem("IS_APP"));
  const [stageName, setStageName] = useState(null);
  const [statusName, setStatusName] = useState(null);
  const [schoolSelectProduct, setschoolSelectProduct] = useState([
    {
      selectedProduct: null,
    },
  ]);
  const [reload, setReload] = useState(0);
  let isSelectedSubmit = true;

  const [isContact, setContact] = useState(false);
  const [isExistDependentField, setExistDependentField] = useState(null);
  const [isValidArray, setValidArray] = useState(null);
  const [isValidInputField, setValidField] = useState(null);
  const handleOpen = () => setActivity(true);
  const handleClose = () => setActivity(false);

  const handleLogMeeting = () => setMeetingLog(true);
  const handleCloseMeeting = () => setMeetingLog(false);

  const [fields, setFields] = useState([]);

  const location = useLocation();

  const [shw_loader, setDisplayLoader] = useState(true);

  const [isProfileInterest, setProfileInterest] = useState([]);

  let { data, productListData, activityLogDate, selectedActivity } =
    location?.state ? location?.state : {};

  const [hasStorageData, setHasStorageData] = useState(false);
  //const [productDatepickerStatus, setProductDatepickerStatus] = useState([])
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const [productModalStatus, setProductModalStatus] = useState(false);
  const [activeproductAccordionItem, setActiveproductAccordionItem] =
    useState(0);

  const [paymentmode, setPaymentmode] = useState([]);
  const isCollectionProfile = UserProfileName?.includes(
    getUserData("userData")?.crm_profile
  );

  const loginData = getUserData("loginData");
  const uuid = loginData?.uuid;

  useEffect(() => {
    document.body.classList.add("crm-is-inner-page");
    return () => document.body.classList.remove("crm-is-inner-page");
  }, []);

  useEffect(() => {
    if (activityLogDate) {
      setMeetingDate(activityLogDate);
    }
    if (productListData?.length) {
      setSchoolListPrd(productListData);
    }
  }, [data, productListData, activityLogDate]);

  useEffect(() => {
    if (meetingLogDate) {
      let paramObj = {
        roleName: getUserData("userData")?.crm_role,
        meetingDate: moment(meetingLogDate).format("YYYY-MM-DD"),
      };
      getPlannerActivity(paramObj);
    }
  }, [meetingLogDate]);

  useEffect(() => {
    const isValid = isValidArray?.includes(false);

    if (!isValidArray?.includes(false) && isValidArray) {
      addActivityDetails();
    }
  }, [isValidArray]);

  const handleProductModalClose = () => {
    setProductModalStatus(false);
  };

  const DropdownIndicator = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        <DropDownIcon />
      </components.DropdownIndicator>
    );
  };

  const validateFieldInArray = (arr, fieldNames) => {
    arr.forEach((obj, index) => {
      fieldNames.forEach((fieldName) => {
        if (
          !obj.hasOwnProperty(fieldName) ||
          obj[fieldName] === "" ||
          obj[fieldName] === null ||
          obj[fieldName] === undefined
        ) {
          toast.error(
            `Please Add Correct Mapping ${
              obj?.profileName ? obj?.profileName : ""
            }`
          );
          // return false
          throw new Error(
            `Field "${fieldName}" not found in object at index ${index}${JSON.stringify(
              obj
            )}`
          );
        }
      });
    });
  };

  const createActivity = async (data, isSelectedSubmit) => {
    let isField = await checkValidAttr([data]);

    if (isField?.includes(false) && isField?.length) {
      return;
    }

    const isValidateProduct = isProductValidate(data);

    if (!isValidateProduct?.length) {
      toast.error(`Please Select Product of ${data?.schoolName}`);
      return false;
    }

    let resultData = {
      schoolData: data,
      productDataList: isValidateProduct,
    };

    if (data?.isMeeting === "Yes") {
      try {
        validateFieldInArray(isValidateProduct, [
          "activityId",
          "futureActivityId",
        ]);

        // const result = isValidateProduct?.map((obj) => obj?.activityId);

        // let params = {
        //   activityIdArr: result,
        // };

        // let isActivityRes = await getActivitiesDetail(params);

        // isActivityRes = isActivityRes?.result;

        let isFieldValid = isFieldValidate(isValidateProduct, data);

        isFieldValid = isFieldValid?.includes(false);

        let isFieldTimeValid = isFieldTimeValidate(isValidateProduct, data);

        isFieldTimeValid = isFieldTimeValid?.includes(false);

        if (!isSelectedSubmit) {
          if (!isFieldValid && !isFieldTimeValid) {
            let finalData = isProductMerged(data);

            if (finalData?.length) {
              let getResponse = await isActivitySubmit(finalData);
              return getResponse;
            }
          } else {
            return false;
          }
        } else {
          addStorageData();
        }
      } catch (error) {
        console.error(error.message);
      }
    } else {
      let result = await isMeetNotHappen(resultData);

      try {
        validateFieldInArray(result, ["activityId", "futureActivityId"]);

        // const result = isValidateProduct?.map((obj) => obj?.activityId);

        // let params = {
        //   activityIdArr: result,
        // };

        // let isActivityRes = await getActivitiesDetail(params);

        // isActivityRes = isActivityRes?.result;

        let Data = resultData?.productDataList?.map((data) => {
          let newArray = [];
          let { activityId, futureActivityId } = !(
            data?.type === fieldTab?.Implementation
          )
            ? result?.find((obj) => obj?.product === data?.profileName)
            : result?.[0];

          let newObj = {
            ...data,
            activityId: activityId,
            futureActivityId: futureActivityId,
          };
          newArray.push(newObj);
          return newArray;
        });

        if (!(data?.comment?.trim() == "") && data?.startDate && data?.timeIn) {
          let followUpDate = moment(new Date(data?.startDate)).format(
            "YYYY-MM-DD"
          );
          let followUpTime = moment(data?.timeIn).format("hh:mm A");

          let followUpDateTime = `${followUpDate} ${followUpTime}`;

          let responseData = Data?.flat()
            ?.map((obj) => {
              if (
                obj?.schoolId === data?.schoolID &&
                obj?.activityDate === data?.activityDate
              ) {
                let isActivityParams = {
                  // activityID: obj?.activityId,
                  // isActivityID: isActivityRes,
                  // leadID: obj?.leadId,
                  referenceType: obj?.type,
                };

                return {
                  leadId: obj?.leadId,
                  name: obj?.profileName,
                  createdBy: getUserData("loginData")?.uuid,
                  createdByRoleName: getUserData("userData")?.crm_role,
                  createdByProfileName: getUserData("userData")?.crm_profile,
                  createdByName: getUserData("userData")?.name,
                  leadType: getLeadType(isActivityParams),
                  meetingStatus:
                    data?.isMeeting === "Yes"
                      ? "Meeting Happened"
                      : "Meeting didn't Happened",
                  empCode: getUserData("userData")?.employee_code,
                  comments: data?.comment,
                  followUpDateTime: followUpDateTime,
                  startDateTime: moment
                    .utc(obj?.activityDate)
                    .format("YYYY-MM-DD hh:mm A"),
                  leadStage: obj?.leadStage ? obj?.leadStage : stageName,
                  leadStatus: obj?.leadStatus ? obj?.leadStatus : statusName,
                  schoolId: obj?.schoolId,
                  activityId: obj?.activityId,
                  futureActivityId: obj?.futureActivityId,
                  schoolName: data?.schoolName,
                  schoolCode: data?.schoolCode,
                  schoolCity: data?.schoolCity,
                  schoolState: data?.schoolState,
                  raisedClaim: data?.raisedClaim ?? false,
                  contactDetails: data?.contactDetail,
                  learningProfileGroupCode: obj?.learningProfileGroupCode,
                  learningProfileRefId: obj?.learningProfileRefId,
                  learningProfileCode: obj?.productCode,
                  meetingAgenda: data?.meetingAgenda,
                  learningProfileGroupName: obj?.learningProfileGroupName,
                  isCollection: data?.isCollection ?? false,
                  collectedPayment: Number(data?.collectedPayment) ?? "",
                  collectedFor: data?.collectedFor ?? null,
                  paymentMode: data?.paymentMode ?? null,
                  ownerType: FieldLabel?.interest,
                };
              }
            })
            ?.filter((obj) => obj);
          if (!isSelectedSubmit) {
            if (responseData?.length) {
              let getResponse = await isActivitySubmit(responseData);
              return getResponse;
            }
          } else {
            addStorageData();
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const addStorageData = () => {
    localStorage.setItem("SchoolFieldData", JSON.stringify(fields));
    localStorage.setItem("SchoolProductData", JSON.stringify(dynamicfield));
    toast.success("Saved as draft");
  };

  const isMeetNotHappen = async (data) => {
    const { finalResult } = await logDefaultActivity(data);
    return finalResult;
  };

  const logDefaultActivity = async (resultData) => {
    let { schoolData, productDataList } = resultData;

    let data = productDataList?.map((obj) => {
      return {
        meetingStatus: "Meeting didn't Happened",
        leadStage: obj?.leadStage ? obj?.leadStage : stageName,
        leadStatus: obj?.leadStatus ? obj?.leadStatus : statusName,
        profileName: obj?.profileName,
        productCode: obj?.productCode,
        type: obj?.type,
      };
    });

    let params = { data };
    try {
      let res = await getDetails(params);
      return res;
    } catch (err) {
      console.error(err);
    }
  };

  const isActivitySubmit = async (data) => {
    let params = { activityObj: data };

    try {
      let res = await logMeetingActivity(params);
      if (res?.result) {
        return true;
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addActivityDetails = () => {
    var fieldData = fields?.filter(
      (obj) => obj?.isMeeting === "Yes" || obj?.isMeeting != ""
    );

    let fieldArray = [];
    Promise.all(
      fieldData?.map(async (obj) => {
        const data_1 = await createActivity(obj);
        fieldArray.push(data_1);
        return fieldArray;
      })
    )
      .then((resolvedData) => {
        let checkArray = resolvedData?.[0];
        let validData = resolvedData?.[0];
        checkArray = checkArray?.includes(false);
        validData = validData?.includes(undefined);
        if (!checkArray && !validData) {
          localStorage.removeItem("SchoolFieldData");
          localStorage.removeItem("SchoolProductData");
          if (fieldData?.length) {
            toast.success("Meeting Successfully Logged");
          }
          fetchClaimActivity();
        }
      })
      .catch((error) => {
        console.error(error, "testError");
      });
  };

  const fetchClaimActivity = () => {
    let paramObj = {
      roleName: getUserData("userData")?.crm_role,
      meetingDate: moment(meetingLogDate).format("YYYY-MM-DD"),
      raisedClaim: true,
    };
    getPlannerActivity(paramObj, false)
      .then((res) => {
        let data = res.result;
        if (data.length > 0) {
          navigate("/authorised/add-claim", {
            state: {
              meetingList: data,
              dateTime: moment(meetingLogDate).format("YYYY-MM-DD"),
            },
          });
        } else {
          navigate("/authorised/school-dashboard");
        }
      })
      .catch((err) => {
        //console.log(err,'fetch Claim Activity Error')
        navigate("/authorised/school-dashboard");
      });
  };

  const isSubmitActivity = async (cancelFlag = false) => {
    if (cancelFlag) {
      navigate("/authorised/school-dashboard");
      return;
    }
    let Data = fields?.filter(
      (obj) => obj?.isMeeting === "Yes" || obj?.isMeeting != ""
    );

    let isValidField = checkValidAttr(Data);

    isValidField
      .then((resolvedData) => {
        setValidArray(resolvedData);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const checkDependentField = (data, schoolData) => {
    if (data?.length > 0) {
      let fieldArray = [];
      var Data = data?.map((obj) => {
        Object.entries(obj).forEach(([key, Value]) => {
          if (Value.required && Value.value === "") {
            fieldArray.push(Value);
          }
        });
        if (fieldArray?.length > 0) {
          toast.error(
            `Please Add Mandatory Fields of ${schoolData?.schoolName}`
          );
          return false;
        } else {
          return true;
        }
      });
      return Data;
    }
    return [];
  };

  const isBlankObject = (obj) => {
    return Object.keys(obj).length === 0;
  };

  const checkValidAttr = async (data) => {
    let fieldArray = [];
    var isValidDependentField;

    for (const obj of data) {
      if (obj?.isMeeting === "") {
        toast.error("Please Select Meeting");
        fieldArray.push(false);
        break; // Exit the loop
      }

      const isValidateProduct = isProductValidate(obj);

      if (!isValidateProduct?.length) {
        toast.error(`Please Select Product of ${obj?.schoolName}`);
        fieldArray.push(false);
        break;
      }

      if (obj?.isMeeting === "Yes") {
        if (!obj?.contactDetail?.length) {
          toast.error(`Please Select Conversation With of ${obj?.schoolName}`);
          fieldArray.push(false);
          break; // Exit the loop
        }

        let dataObj = isValidateProduct
          ?.map((obj) => obj?.dependentField)
          ?.filter((obj) => obj);

        dataObj = dataObj?.filter((obj) => !isBlankObject(obj));

        let isCustomerResponse = isValidateResponse(isValidateProduct, obj);

        isCustomerResponse = isCustomerResponse?.includes(false);

        if (isCustomerResponse) {
          fieldArray.push(false);
          break;
        }

        let isFieldSubject = isValidateSubject(isValidateProduct, obj);

        isFieldSubject = isFieldSubject?.includes(false);

        if (isFieldSubject) {
          fieldArray.push(false);
          break;
        }

        let isFieldValidDate = isFieldValidate(isValidateProduct, obj);

        isFieldValidDate = isFieldValidDate?.includes(false);

        if (isFieldValidDate) {
          fieldArray.push(false);
          break;
        }

        let isFieldTimeValid = isFieldTimeValidate(isValidateProduct, obj);

        isFieldTimeValid = isFieldTimeValid?.includes(false);

        if (isFieldTimeValid) {
          fieldArray.push(false);
          break;
        }

        // let isFieldPriority = isValidatePriority(isValidateProduct, obj);

        // isFieldPriority = isFieldPriority?.includes(false);

        // if (!(isFieldPriority) && !(obj?.type === fieldTab?.implementation)) {
        //   fieldArray.push(false);
        //   break;
        // }

        // let isValidateField = checkDependentField(dataObj, obj)?.includes(
        //   false
        // );

        // if (isValidateField) {
        //   fieldArray.push(false);
        //   break;
        // }
      }

      if (obj?.isMeeting === "No") {
        if (!obj?.contactDetail?.length) {
          toast.error(`Please Select Conversation With of ${obj?.schoolName}`);
          fieldArray.push(false);
          break; // Exit the loop
        }

        if (!obj?.startDate) {
          toast.error(`Please Select Next Meeting Date of ${obj?.schoolName}`);
          fieldArray.push(false);
          break;
        }

        if (!obj?.timeIn) {
          toast.error(`Please Select Next Meeting Time of ${obj?.schoolName}`);
          fieldArray.push(false);
          break;
        }

        if (!obj?.comment) {
          toast.error(`Please Add Comment of ${obj?.schoolName}`);
          fieldArray.push(false);
          break;
        }
      }
    }
    return fieldArray;
  };

  const isFieldValidate = (data, schoolData) => {
    let isFieldValid = true;
    const Data = data?.map((obj) => {
      if (!obj?.meetingDate) {
        toast.error(`Please Select Meeting Date of ${schoolData?.schoolName} `);
        isFieldValid = false;
        return isFieldValid;
      } else {
        return isFieldValid;
      }
    });
    return Data;
  };

  const isFieldTimeValidate = (data, schoolData) => {
    let isFieldValid = true;
    const Data = data?.map((obj) => {
      if (!obj?.timeIn) {
        toast.error(`Please Select Meeting Time of ${schoolData?.schoolName}`);
        isFieldValid = false;
        return isFieldValid;
      } else {
        return isFieldValid;
      }
    });
    return Data;
  };

  const isValidateResponse = (data, schoolData) => {
    let isFieldValid = true;
    const Data = data?.map((obj) => {
      if (!obj?.customerResponse) {
        toast.error(
          `Please Select Meeting Outcomes of ${schoolData?.schoolName}`
        );
        isFieldValid = false;
        return isFieldValid;
      } else {
        return isFieldValid;
      }
    });
    return Data;
  };

  const isValidateSubject = (data, schoolData) => {
    let isFieldValid = true;
    const Data = data?.map((obj) => {
      if (!obj?.subject) {
        toast.error(`Please Select Subject of ${schoolData?.schoolName}`);
        isFieldValid = false;
        return isFieldValid;
      } else {
        return isFieldValid;
      }
    });
    return Data;
  };

  const isValidatePriority = (data, schoolData) => {
    let isFieldValid = true;
    const Data = data?.map((obj) => {
      if (!obj?.priority) {
        toast.error(`Please Select Priority of ${schoolData?.schoolName}`);
        isFieldValid = false;
        return isFieldValid;
      } else {
        return isFieldValid;
      }
    });
    return Data;
  };

  const isProductValidate = (data) => {
    let schoolID = data?.schoolID;
    let schoolProduct = data?.schoolProduct;
    let activityDate = data?.activityDate;
    let selectedProduct;

    selectedProduct = dynamicfield?.filter(
      (obj) =>
        schoolProduct?.includes(obj?.profileName) &&
        obj?.schoolId === schoolID &&
        obj?.activityDate === activityDate
    );

    return selectedProduct;
  };

  const addDynamicField = (obj) => {
    let updateObj = obj?.dependentField
      ? Object.entries(obj?.dependentField)
      : [];
    updateObj = updateObj?.reduce((result, [key, Value]) => {
      return {
        ...result,
        [key]: Value?.value,
      };
    }, {});
    return updateObj;
  };

  const getLeadID = (data) => {
    let { activityID, isActivityID, leadID, referenceCode, referenceType } =
      data;

    let leadId = isActivityID?.find((obj) => obj?.ID === activityID);

    if (fieldTab?.collection === referenceType) {
      return leadID;
    }

    if (leadId[fieldKey?.Implementation] && referenceCode) {
      return referenceCode;
    }

    return leadID;
  };

  const getLeadType = (data) => {
    let { activityID, isActivityID, referenceType } = data;

    // let leadType = isActivityID?.find((obj) => obj?.ID === activityID);

    if (referenceType === fieldTab?.Implementation) {
      return fieldTab?.implementation;
    }

    return fieldKey?.Interest;
  };

  const isProductMerged = (data, isActivityRes) => {
    const isProductArray = [];

    const dependentData = dynamicfield?.map((obj) => {
      let followUpDate = moment(new Date(obj?.meetingDate)).format(
        "YYYY-MM-DD"
      );
      let followUpTime = moment(obj?.timeIn).format("hh:mm A");
      let followUpDateTime = `${followUpDate} ${followUpTime}`;

      if (
        obj?.schoolId === data?.schoolID &&
        obj?.activityDate === data?.activityDate
      ) {
        let isActivityParams = {
          // activityID: obj?.activityId,
          // isActivityID: isActivityRes,
          // leadID: obj?.leadId,
          referenceType: obj?.type,
        };

        isProductArray.push({
          leadId: obj?.leadId,
          comment: data?.comment,
          meetingStatus:
            data?.isMeeting === "Yes"
              ? "Meeting Happened"
              : "Meeting didn't Happened",
          schoolId: data?.schoolID,
          schoolName: data?.schoolName,
          activityId: obj?.activityId,
          followUpDateTime: followUpDateTime,
          startDateTime: moment
            .utc(obj?.activityDate)
            .format("YYYY-MM-DD hh:mm A"),
          futureActivityId: obj?.futureActivityId,
          createdBy: getUserData("loginData")?.uuid,
          createdByRoleName: getUserData("userData")?.crm_role,
          createdByProfileName: getUserData("userData")?.crm_profile,
          createdByName: getUserData("userData")?.name,
          leadType: getLeadType(isActivityParams),
          name: obj?.profileName,
          leadStage: obj?.leadStage ? obj?.leadStage : stageName,
          leadStatus: obj?.leadStatus ? obj?.leadStatus : statusName,
          customerResponse: obj?.customerResponse?.value,
          subject: obj?.subject?.value,
          priority: obj?.priority?.value,
          schoolCode: data?.schoolCode,
          schoolCity: data?.schoolCity,
          schoolState: data?.schoolState,
          raisedClaim: data?.raisedClaim ?? false,
          minutesOfMeeting: data?.minutesOfMeeting,
          contactDetails: data?.contactDetail,
          dependentFieldData: obj?.dependentField,
          learningProfileGroupCode: obj?.learningProfileGroupCode,
          learningProfileRefId: obj?.learningProfileRefId,
          learningProfileCode: obj?.productCode,
          meetingAgenda: data?.meetingAgenda,
          learningProfileGroupName: obj?.learningProfileGroupName,
          isCollection: data?.isCollection ?? false,
          collectedPayment: Number(data?.collectedPayment) ?? "",
          collectedFor: data?.collectedFor ?? null,
          paymentMode: data?.paymentMode ?? null,
          ownerType: FieldLabel?.interest,
          // isSiteVisited: (obj?.isSiteSurveyType === "Yes") ? true : false,
          ...addDynamicField(obj),
        });
        return isProductArray;
      }
    });

    return isProductArray;
  };

  const getDynamicField = async (data) => {
    if (!data?.priority && !(data?.type === fieldTab?.Implementation)) {
      return;
    }
    let updateObj = Object.entries(data);
    updateObj = updateObj?.reduce((result, [key, Value]) => {
      key = key === "profileName" ? "name" : key;
      return {
        ...result,
        [key]: Value?.value ? Value?.value : Value,
      };
    }, {});

    try {
      let res = await getDependentFields(updateObj);

      if (res?.result) {
        let dataResult = {
          result: res?.result,
          schoolData: updateObj,
        };
        dynamicFieldData(dataResult);
      } else {
        dynamicFieldData(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getDynamicAttrValue = (field, isExistfield) => {
    let isField = "";
    isField = isExistfield[field] ? isExistfield[field] : "";
    return isField;
  };

  const dynamicFieldData = (data) => {
    let { result, schoolData } = data;

    const isExistfield = result?.[1]?.value?.length
      ? result?.[1]?.value?.[0]
      : null;

    result = result?.[0]?.value;

    let dynamicResult = Object.keys(result ? result : {}).length > 0;

    if (dynamicResult && isExistfield) {
      let singleObject;
      var Data = result?.dependentFields?.map((obj) => {
        return {
          [obj?.fieldCode]: {
            type: obj?.fieldType,
            label: obj?.required ? `${obj?.label} *` : obj?.label,
            value: getDynamicAttrValue(obj?.fieldCode, isExistfield),
            required: obj?.required,
          },
        };
      });
      singleObject = Data?.length > 0 ? Object.assign({}, ...Data) : {};

      let updatedArray = multiProductList?.map((obj) => {
        if (
          obj?.profileName === schoolData?.name &&
          obj?.schoolId === schoolData?.schoolId &&
          obj?.activityDate === schoolData?.activityDate
        ) {
          return {
            ...obj,
            activityId: result?.activityId,
            futureActivityId: result?.activityId,
            dependentField: singleObject,
            isPriorityApplicable: result?.isPriorityApplicable,
          };
        } else {
          return obj;
        }
      });

      if (updatedArray?.length) {
        setMultiProductList(updatedArray);
        setDynamicFields(updatedArray);
      }
    } else if (dynamicResult) {
      let singleObject;
      var Data = result?.dependentFields?.map((obj) => {
        return {
          [obj?.fieldCode]: {
            type: obj?.fieldType,
            label: obj?.required ? `${obj?.label} *` : obj?.label,
            value: "",
            required: obj?.required,
          },
        };
      });
      singleObject = Data?.length > 0 ? Object.assign({}, ...Data) : {};

      let updatedArray = multiProductList?.map((obj) => {
        if (
          obj?.profileName === schoolData?.name &&
          obj?.schoolId === schoolData?.schoolId &&
          obj?.activityDate === schoolData?.activityDate
        ) {
          return {
            ...obj,
            activityId: result?.activityId,
            futureActivityId: result?.activityId,
            dependentField: singleObject,
            isPriorityApplicable: result?.isPriorityApplicable,
          };
        } else {
          return obj;
        }
      });

      if (updatedArray?.length) {
        setMultiProductList(updatedArray);
        setDynamicFields(updatedArray);
      }
    } else {
      let updatedArray = multiProductList?.map((obj) => {
        if (
          obj?.profileName === schoolData?.name &&
          obj?.schoolId === schoolData?.schoolId &&
          obj?.activityDate === schoolData?.activityDate
        ) {
          return {
            ...obj,
            activityId: result?.activityId,
            futureActivityId: result?.activityId,
            dependentField: null,
            isPriorityApplicable: result?.isPriorityApplicable,
          };
        } else {
          return obj;
        }
      });

      if (updatedArray?.length) {
        setMultiProductList(updatedArray);
        setDynamicFields(updatedArray);
      }
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
        if (res?.data?.master_data_list) {
          let data = res?.data?.master_data_list;
          let tempArray = data?.map((obj) => ({
            label: obj?.name,
            value: obj?.name,
            groupkey: obj?.group_key,
            groupName: obj?.group_name,
            productID: obj?.id,
            productCode: obj?.product_key,
          }));
          tempArray = tempArray?.filter(
            (obj) => obj?.groupName && obj?.groupkey
          );
          setOptions(tempArray);
          setDisplayLoader(false);
        }
      })
      .catch((err) => {
        console.error(err, "Error while fetching product list");
      });
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
      setProfileInterest(interstArray);
    }
  };

  const getMultiInterest = (data) => {
    let optionArray = interestOption?.map((obj) => obj);

    let interest = data?.documents
      ?.filter((obj) => !(obj?.assignedTo_role_name === userRole))
      ?.map((obj) => obj?.learningProfile);

    let interestedId = data?.documents?.map((obj) => {
      return {
        profileName: obj?.learningProfile,
        leadId: obj?.leadId,
        leadStage: obj?.stageName,
        leadStatus: obj?.statusName,
        schoolId: obj?.schoolId,
        customerResponse: "",
        meetingDate: null,
        priority: "",
        subject: "",
        isSiteSurveyType: "",
        activityId: null,
        futureActivityId: null,
        isPriorityApplicable: null,
        dependentField: null,
        fillData: false,
        timeIn: null,
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
            customerResponse: "",
            meetingDate: null,
            priority: "",
            subject: "",
            isSiteSurveyType: "",
            activityId: null,
            futureActivityId: null,
            dependentField: null,
            isPriorityApplicable: null,
            fillData: false,
            timeIn: null,
            productCode: obj?.productCode,
            learningProfileGroupCode: obj?.groupkey,
            learningProfileRefId: obj?.productID,
            learningProfileGroupName: obj?.groupName,
          };
        }
      })
      .filter((obj) => obj);

    let interestConcat = interestedId?.concat(interest);

    return {
      interest: interest,
      interestConcat: interestConcat,
      productSchoolID: data?._id,
      activityDate: data?.activityDate,
    };
  };

  const getMultiInterestId = (data, productSchoolID) => {
    const uniqueValues = new Set();
    let filteredArray = data?.filter((item) => {
      if (!uniqueValues.has(item?.profileName)) {
        uniqueValues.add(item?.profileName);
        return true;
      }
      return false;
    });

    return { filteredArray: filteredArray };
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
            obj?.schoolId === data?.schoolId
          ) {
            isExistProduct.push({
              profileName: obj?.profileName,
              leadId: obj?.leadId,
              leadStage: obj?.leadStage ? obj?.leadStage : stageName,
              leadStatus: obj?.leadStatus ? obj?.leadStatus : statusName,
              schoolId: obj?.schoolId,
              customerResponse: "",
              meetingDate: null,
              priority: "",
              isSiteSurveyType: "",
              subject: "",
              activityId: null,
              futureActivityId: null,
              isPriorityApplicable: null,
              dependentField: null,
              fillData: false,
              timeIn: null,
              contactOptions: obj?.contactDetails,
              contactDetail: [],
              activityDate: data?.activityDate,
              userRoleName: getUserData("userData")?.crm_role,
              schoolCode: data?.schoolCode,
              productCode: obj?.productCode,
              learningProfileGroupCode: obj?.learningProfileGroupCode,
              learningProfileRefId: obj?.learningProfileRefId,
              learningProfileGroupName: obj?.learningProfileGroupName,
              type: UserProfileName?.includes(
                getUserData("userData")?.crm_profile
              )
                ? fieldTab?.Implementation
                : fieldTab?.Interest,
            });
          } else if (
            data?.leadType?.[0] === fieldTab?.implementation &&
            obj?.schoolId === data?.schoolId &&
            !UserProfileName?.includes(getUserData("userData")?.crm_profile)
          ) {
            isExistProduct.push({
              profileName: data?.name?.[0],
              leadId: data?.name?.[0],
              leadStage: stageName,
              leadStatus: statusName,
              schoolId: data?.schoolId,
              customerResponse: "",
              meetingDate: null,
              priority: "",
              isSiteSurveyType: "",
              subject: "",
              activityId: null,
              futureActivityId: null,
              isPriorityApplicable: null,
              dependentField: null,
              fillData: false,
              timeIn: null,
              contactOptions: obj?.contactDetails,
              contactDetail: [],
              activityDate: data?.activityDate,
              userRoleName: getUserData("userData")?.crm_role,
              schoolCode: data?.schoolCode,
              productCode: "",
              learningProfileGroupCode: "",
              learningProfileRefId: "",
              learningProfileGroupName: "",
              type: fieldTab?.Implementation,
            });
          }
        });
      });
    }

    const uniqueData = [];
    const uniqueCombinations = {};

    isExistProduct?.forEach((item) => {
      const key = `${item.leadId}_${item.schoolId}`;
      if (!uniqueCombinations[key]) {
        uniqueCombinations[key] = true;
        uniqueData.push(item);
      }
    });

    if (uniqueData?.length) {
      setDynamicFields(uniqueData);
      setMultiProductList(uniqueData);
    }
  };

  useEffect(() => {
    let schoolProductData = JSON.parse(
      localStorage.getItem("SchoolProductData")
    );

    schoolProductData = schoolProductData?.filter((obj) => {
      let Data = moment(obj?.activityDate).utc().format("YYYY-MM-DD");
      let activityDate = moment(activityLogDate).format("YYYY-MM-DD");
      Data = Data === activityDate;
      return Data;
    });

    if (!schoolProductData?.length) {
      if (interestMultiId?.length) {
        isCreatedInterest();
      }
    }
  }, [interestMultiId]);

  useEffect(() => {
    if (stageName && statusName) {
      isCreatedInterest();
    }
  }, [stageName, statusName]);

  useEffect(() => {
    if (
      interestOption?.length &&
      UserProfileName?.includes(getUserData("userData")?.crm_profile)
    ) {
      getProfileBasedInterest();
    }
  }, [interestOption]);

  const addMultiProductData = (obj, pd) => {
    let schoolId = obj?.schoolID;
    let schoolActivityDate = obj?.activityDate;
    let selectedProductInterest = [];
    let createdProductInterest = [];
    let schoolProductInterest = interestMultiId?.find(
      (obj) => obj?.productSchoolID === schoolId
    );

    Object.entries(schoolProductInterest)?.map(([key, value]) => {
      if (typeof value === "object") {
        selectedProductInterest.push(value);
      }
    });

    selectedProductInterest = selectedProductInterest?.filter(
      (obj) =>
        obj?.profileName === pd?.profileName && obj?.schoolId === schoolId
    );

    selectedProductInterest = selectedProductInterest?.map((obj) => {
      return {
        ...obj,
        activityDate: schoolActivityDate,
      };
    });

    if (!selectedProductInterest?.length) {
      createdProductInterest.push({
        profileName: pd?.profileName,
        leadId: "",
        leadStage: pd?.leadStage ? pd?.leadStage : stageName,
        leadStatus: pd?.leadStatus ? pd?.leadStatus : statusName,
        schoolId: schoolId,
        customerResponse: "",
        meetingDate: null,
        priority: "",
        subject: "",
        isSiteSurveyType: "",
        activityId: null,
        futureActivityId: null,
        isPriorityApplicable: null,
        dependentField: null,
        fillData: false,
        timeIn: null,
        activityDate: schoolActivityDate,
        productCode: pd?.productCode,
        learningProfileGroupCode: pd?.learningProfileGroupCode,
        learningProfileRefId: pd?.learningProfileRefId,
        learningProfileGroupName: pd?.learningProfileGroupName,
      });
    }

    if (selectedProductInterest?.length) {
      return selectedProductInterest;
    } else {
      return createdProductInterest;
    }
  };

  // const disabledHours = (obj) => {
  //   const currentDate = moment();
  //   const strtDate = obj?.startDate;
  //   if (strtDate) {
  //     const isCurrentDateGreater = strtDate?.isAfter(currentDate, "day");
  //     const currentHour = moment().hours();
  //     if (!isCurrentDateGreater) {
  //       return Array.from({ length: currentHour }, (_, index) => index);
  //     } else {
  //       return [];
  //     }
  //   }
  // };

  const disabledHours = (obj) => {
    const currentDate = moment();
    const startDate = obj?.startDate;
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

  // const disabledMinutes = (selectedHour, obj) => {
  //   const currentDate = moment();
  //   const strtDate = obj?.startDate;

  //   if (strtDate) {
  //     const isCurrentDateGreater = strtDate?.isAfter(currentDate, "day");
  //     if (!isCurrentDateGreater) {
  //       if (selectedHour === moment().hours()) {
  //         const currentMinute = moment().minutes();
  //         return Array.from({ length: currentMinute }, (_, index) => index);
  //       }
  //       return [];
  //     } else {
  //       return [];
  //     }
  //   }
  // };

  const disabledMinutes = (selectedHour, obj) => {
    const currentDate = moment();
    const startDate = obj?.startDate;

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

  const disabledMeetingHours = (obj) => {
    const currentDate = moment();
    const strtDate = obj?.meetingDate;

    if (strtDate) {
      const isCurrentDateGreater = moment(strtDate)?.isAfter(
        currentDate,
        "day"
      );
      const currentHour = moment().hours();
      if (!isCurrentDateGreater) {
        return Array.from({ length: currentHour }, (_, index) => index);
      } else {
        return [];
      }
    }
  };

  const disabledMeetingMinutes = (selectedHour, obj) => {
    const currentDate = moment();
    const strtDate = obj?.meetingDate;
    if (strtDate) {
      const isCurrentDateGreater = moment(strtDate)?.isAfter(
        currentDate,
        "day"
      );
      if (!isCurrentDateGreater) {
        if (selectedHour === moment().hours()) {
          const currentMinute = moment().minutes();
          return Array.from({ length: currentMinute }, (_, index) => index);
        }
        return [];
      } else {
        return [];
      }
    }
  };

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

  const getPaymentMode = async () => {
    let params = {
      status: [1],
      uuid: uuid,
      master_data_type: "payment_mode",
    };
    await getAllProductList(params)
      .then((res) => {
        let data = res?.data?.master_data_list?.map((obj) => {
          return {
            label: obj?.name,
            value: obj?.name,
          };
        });
        setPaymentmode(data);
      })
      .catch((err) => {
        console.error(err, "Error while fetching product list");
      });
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
    getOptionsData();
  }, []);

  useEffect(() => {
    if (interestId) {
      getProductData();
    }
  }, [interestId]);

  useEffect(() => {
    if (isCollectionProfile) {
      getPaymentMode();
    }
  }, []);

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
        schoolID: obj?.schoolId,
        schoolCode: obj?.schoolCode,
        schoolCity: obj?.schoolCity,
        schoolState: obj?.schoolState,
        activityDate: obj?.activityDate,
        contactOptions: obj?.contactDetails,
        contactDetail: [],
        minutesOfMeeting: "",
        userRoleName: getUserData("userData")?.crm_role,
        meetingAgenda: obj?.meetingAgenda,
        type: obj?.leadType?.[0],
      };
    });

    let schoolData = schoolMeeting?.map((obj) => {
      return {
        schoolProductName: obj?.name,
        schoolID: obj?.schoolId,
        activityDate: obj?.activityDate,
      };
    });

    let schoolFieldData = JSON.parse(localStorage.getItem("SchoolFieldData"));

    schoolFieldData = schoolFieldData?.filter((obj) => {
      let Data = moment(obj?.activityDate).utc().format("YYYY-MM-DD");
      let activityDate = moment(activityLogDate).format("YYYY-MM-DD");
      Data = Data === activityDate;
      return Data;
    });

    let schoolProductData = JSON.parse(
      localStorage.getItem("SchoolProductData")
    );

    schoolProductData = schoolProductData?.filter((obj) => {
      let Data = moment(obj?.activityDate).utc().format("YYYY-MM-DD");
      let activityDate = moment(activityLogDate).format("YYYY-MM-DD");
      Data = Data === activityDate;
      return Data;
    });

    var productData = JSON.parse(localStorage.getItem("SchoolProductData"));

    if (schoolFieldData?.length && schoolProductData?.length) {
      let filledSchool = localStorage.getItem("SchoolFieldData");
      let filledProductData = localStorage.getItem("SchoolProductData");
      filledSchool = JSON.parse(filledSchool);
      filledProductData = JSON.parse(filledProductData);

      let finalAttrData = [];
      let finalProductData = [];
      let finalMultiproduct = [];

      if (filledSchool?.length) {
        Data?.map((obj) => {
          filledSchool?.map((data) => {
            if (
              obj?.activityDate === data?.activityDate &&
              obj?.schoolID === data?.schoolID &&
              obj?.userRoleName === data?.userRoleName
            ) {
              finalAttrData.push(data);
            }
          });
          return finalAttrData;
        });
      }

      if (finalAttrData?.length) {
        let filterIDS = finalAttrData?.map((obj) => obj?.schoolID);
        filterIDS = Data?.filter((obj) => !filterIDS?.includes(obj?.schoolID));
        let finalObjArray = [...finalAttrData, ...filterIDS];
        setFields(finalObjArray);
      }

      let schoolFilledData = filledSchool?.map((obj) => {
        return {
          schoolProductName: obj?.schoolProduct,
          schoolID: obj?.schoolID,
          activityDate: obj?.activityDate,
        };
      });

      schoolData?.map((obj) => {
        schoolFilledData?.map((data) => {
          if (
            obj?.activityDate === data?.activityDate &&
            obj?.userRoleName === data?.userRoleName &&
            obj?.schoolID === data?.schoolID
          ) {
            finalProductData.push(data);
          }
        });
        return finalProductData;
      });

      if (finalProductData?.length) {
        let filterPrdIDS = finalProductData?.map((obj) => obj?.schoolID);
        filterPrdIDS = schoolData?.filter(
          (obj) => !filterPrdIDS?.includes(obj?.schoolID)
        );
        let finalPrdObjArray = [...finalProductData, ...filterPrdIDS];
        setSchoolProduct(finalPrdObjArray);
      }

      if (localStorage.getItem("SchoolProductData")) {
        // setStorageData(JSON.parse((localStorage.getItem("SchoolProductData"))))

        schoolData?.map((obj) => {
          productData?.map((data) => {
            if (
              obj?.schoolID === data?.schoolId &&
              obj?.activityDate === data?.activityDate
            ) {
              finalMultiproduct.push(data);
            }
          });
        });

        if (finalMultiproduct?.length) {
          setDynamicFields(
            JSON.parse(localStorage.getItem("SchoolProductData"))
          );
          setMultiProductList(
            JSON.parse(localStorage.getItem("SchoolProductData"))
          );
        }
      }
    } else {
      if (Data?.length) {
        setFields(Data);
      }

      if (schoolData?.length) {
        setSchoolProduct(schoolData);
      }
    }

    // if (Data?.length) {
    //   setFields(Data);
    // }

    // if (schoolData?.length) {
    //   setSchoolProduct(schoolData);
    // }
  };

  // const getMultiProductList = () => {
  //   let finalMultiproduct = []
  //   schoolMeeting?.map((obj) => {
  //     storageList?.map((data) => {
  //       if (
  //         obj?.schoolID === data?.schoolId &&
  //         obj?.activityDate === data?.activityDate
  //       ) {
  //         finalMultiproduct.push(data);
  //       }
  //     });
  //   });

  //   if (finalMultiproduct?.length) {
  //     setDynamicFields(JSON.parse((localStorage.getItem("SchoolProductData"))));
  //     setMultiProductList(JSON.parse((localStorage.getItem("SchoolProductData"))));
  //   }
  // }

  // useEffect(() => {
  //   if (storageList) {
  //     // getMultiProductList()
  //   }
  // }, [storageList])

  useEffect(() => {
    if (schoolMeeting?.length) {
      getMultipleActivity();
      getLogActivity();
    }
  }, [schoolMeeting]);

  const getMultipleActivity = async () => {
    let schoolIdArr = schoolMeeting?.map((obj) => obj?.schoolId);
    let params = { schoolIdArr };
    let Data;
    try {
      const res = await getMultipleSchoolInterests(params);

      if (res?.result?.length) {
        Data = schoolMeeting?.map((obj) => {
          return res?.result
            ?.map((interest) => {
              if (obj?.schoolId === interest?._id) {
                return {
                  ...interest,
                  activityDate: obj?.activityDate,
                };
              }
            })
            .filter((obj) => obj);
        });
        if (Data?.flat()?.length) {
          setMultiInterest(Data?.flat());
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getOptionsData = async () => {
    try {
      let res = await getAllKeyValues();
      if (res?.result?.length > 0) {
        setMasterKey(res?.result);
      } else {
        setMasterKey([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const isSchoolProduct = (data) => {
    let interestData = data?.map((obj) => {
      let { interest, interestConcat, productSchoolID, activityDate } =
        getMultiInterest(obj);
      let { filteredArray } = getMultiInterestId(
        interestConcat,
        productSchoolID
      );
      return { interest, filteredArray, productSchoolID, activityDate };
    });

    let interestArray = interestData?.map((obj) => {
      return {
        interestProduct: obj?.interest,
        productSchoolID: obj?.productSchoolID,
        activityDate: obj?.activityDate,
      };
    });

    let filterArray = interestData?.map((obj) => {
      return {
        ...obj?.filteredArray,
        productSchoolID: obj?.productSchoolID,
        activityDate: obj?.activityDate,
      };
    });

    setSelectMultiInterest(interestArray);
    setMultiInterestId(filterArray);
  };

  useEffect(() => {
    if (schoolMultiInterest?.length) {
      isSchoolProduct(schoolMultiInterest);
    }
  }, [schoolMultiInterest, interestOption]);

  const handleFieldData = (index, attr, event, obj) => {
    const newFields = [...fields];
    newFields[index][attr] = event;
    if (attr === "startDate" && event) {
      newFields[index]["timeIn"] = "";
    }
    setFields(newFields);
  };

  
  const handleProductFielddData = (index, attr, event, currentObj) => {
    let indexNo = multiProductList?.indexOf(currentObj);
    const newFields = [...multiProductList];
    newFields[indexNo][attr] = event;
    if(attr === 'meetingDate' && event) {
      newFields[indexNo]['timeIn'] = '';
    }
    setMultiProductList(newFields);
  };

  const handleDynamicFielddData = (attr, event, currentObj) => {
    let indexNo = dynamicfield?.indexOf(currentObj);
    if (indexNo != -1) {
      const newFields = [...dynamicfield];
      newFields[indexNo][attr] = event;
      setDynamicFields(newFields);
    }
  };

  const handleProduct = (obj, pd, event) => {
    if (event.target.checked) {
      let addProduct = selectedSchoolProduct?.map((data) => {
        if (
          data?.schoolID === obj?.schoolID &&
          data?.activityDate === obj?.activityDate
        ) {
          let upadateProductList = data?.schoolProductName;
          upadateProductList.push(pd?.profileName);
          return {
            ...data,
            schoolProductName: upadateProductList,
          };
        } else {
          return data;
        }
      });
      setSchoolProduct(addProduct);

      let updateFieldVal = fields?.map((data) => {
        if (
          data?.schoolID === obj?.schoolID &&
          data?.activityDate === obj?.activityDate
        ) {
          let upadateProductList = data?.schoolProduct;
          upadateProductList.push(pd?.profileName);
          return {
            ...data,
            schoolProduct: upadateProductList,
          };
        } else {
          return data;
        }
      });

      setFields(updateFieldVal);

      const productInterest = addMultiProductData(obj, pd);
      if (productInterest?.length) {
        setMultiProductList([...multiProductList, ...productInterest]);
        setDynamicFields([...multiProductList, ...productInterest]);
      }
    } else {
      let updateProduct = selectedSchoolProduct?.map((data) => {
        if (
          data?.schoolID === obj?.schoolID &&
          data?.activityDate === obj?.activityDate
        ) {
          let upadateProductList = data?.schoolProductName;
          let newUpdateList = upadateProductList?.filter(
            (data) => data != pd?.profileName
          );
          return {
            ...data,
            schoolProductName: newUpdateList,
          };
        } else {
          return data;
        }
      });

      const updateMultiList = multiProductList?.filter(
        (data) =>
          !(
            data?.profileName === pd?.profileName &&
            data?.schoolId === obj?.schoolID &&
            data?.activityDate === obj?.activityDate
          )
      );

      let updateFieldProduct = fields?.map((data) => {
        if (
          data?.schoolID === obj?.schoolID &&
          data?.activityDate === obj?.activityDate
        ) {
          let upadateProductList = data?.schoolProduct;
          let newUpdateList = upadateProductList?.filter(
            (data) => data != pd?.profileName
          );
          return {
            ...data,
            schoolProduct: newUpdateList,
          };
        } else {
          return data;
        }
      });

      setFields(updateFieldProduct);
      setMultiProductList(updateMultiList);
      setDynamicFields(updateMultiList);
      setSchoolProduct(updateProduct);
      // addMultiProductData(obj, pd);
    }
  };

  const isCreatedProduct = (obj, pd) => {
    let schoolProduct = selectedSchoolProduct?.find(
      (data) =>
        data?.schoolID === obj?.schoolID &&
        data?.activityDate === obj?.activityDate
    );

    let checkProduct = schoolProduct?.schoolProductName;
    let productName = pd?.profileName;
    checkProduct = checkProduct?.includes(productName) ? true : false;
    return checkProduct;
  };

  // const meetingSchedule = (obj, index) => {
  //   let schoolId = obj?.schoolID;
  //   let schoolActivityDate = obj?.activityDate;

  //   let selectedProductListData = [];

  //   let schoolProduct = selectMultiInterest?.find(
  //     (obj) =>
  //       obj?.productSchoolID === schoolId &&
  //       obj?.activityDate === schoolActivityDate
  //   );

  //   if (schoolProduct) {
  //     if (!schoolProduct?.interestProduct?.length) {
  //       isSchoolProduct(schoolMultiInterest);
  //       meetingSchedule(obj, index);
  //       return;
  //     }
  //   }

  //   return (
  //     <>
  //       <Grid item md={12} xs={12}>
  //         <Typography component={"h4"} className="crm-sd-log-form-label">
  //           Product Pitched
  //         </Typography>
  //         <Grid container >
  //           {schoolProduct
  //             ? schoolProduct?.interestProduct?.map((pd, i) => {
  //                 return (
  //                   <Grid item xs={6} md={'auto'} key={i}>
  //                     <Checkbox
  //                       checked={isCreatedProduct(obj, pd)}
  //                       onChange={(event) => handleProduct(obj, pd, event)}
  //                     />
  //                     <FormLabel className={classes.schoolTitle}>
  //                       {pd?.profileName}
  //                     </FormLabel>
  //                   </Grid>
  //                 );
  //               })
  //             : ""}
  //         </Grid>
  //       </Grid>
  //       {/* <div className={classes.flkFlexBox}>
  //         <div className={classes.textBoxWdth}>
  //           <Typography className={classes.label}>
  //             Next Meeting <br />
  //             (Date / Time):
  //           </Typography>
  //         </div>
  //         <div>
  //           <LocalizationProvider dateAdapter={AdapterDayjs}>
  //             <Stack spacing={3}>
  //               <DatePicker
  //                 className="customDatePicker"
  //                 id={`fields[${index}].startDate`}
  //                 value={obj?.startDate}
  //                 inputProps={{ readOnly: true }}
  //                 onChange={(event) =>
  //                   handleFieldData(index, "startDate", event)
  //                 }
  //                 renderInput={(params) => <TextField {...params} />}
  //                 minDate={new Date()}
  //               />
  //             </Stack>
  //           </LocalizationProvider>
  //         </div>
  //         <div>
  //           <TimePicker
  //             id={`fields[${index}].timeIn`}
  //             className={"customTPicker"}
  //             value={obj?.timeIn ? moment(obj?.timeIn) : undefined}
  //             onChange={(value) => handleFieldData(index, "timeIn", value)}
  //             showSecond={false}
  //             use24Hours
  //             inputReadOnly
  //             disabledHours={() => disabledHours(obj)}
  //             disabledMinutes={(event) => disabledMinutes(event, obj)}
  //             defaultValue={moment()}
  //           />
  //         </div>
  //       </div>
  //       <Grid item md={2} xs={2}>
  //         <Typography
  //           className={classes.label}
  //           sx={{
  //             marginBottom: "12px !important",
  //             fontSize: "15px !important",
  //           }}
  //         >
  //           Comments *
  //         </Typography>
  //       </Grid>
  //       <Grid item md={10} xs={10}>
  //         <textarea
  //           className={classes.textAreainputStyle}
  //           id={`fields[${index}].comment`}
  //           name={obj?.comment}
  //           rows="4"
  //           cols="50"
  //           type="text"
  //           placeholder=""
  //           value={obj?.comment}
  //           onChange={(event) =>
  //             handleFieldData(index, "comment", event.target.value)
  //           }
  //           // onKeyDown={handleKeyTextDown}
  //           // onPaste={handleTextPaste}
  //           // maxLength={100}
  //         />
  //       </Grid> */}
  //     </>
  //   );
  // };

  const activityMapDetail = async () => {
    var result = Promise.all(
      multiProductList?.map(async (data, index) => {
        let leadStage = data?.leadStage ? data?.leadStage : stageName;
        let leadStatus = data?.leadStatus ? data?.leadStatus : statusName;
        let productName = data?.profileName;
        let productCode = data?.productCode;
        let indexId = data?.schoolId;
        let type = data?.type;
        let isExistList = [];

        let params = {
          stageName: !(type === fieldTab?.Implementation)
            ? leadStage
            : stageName,
          statusName: !(type === fieldTab?.Implementation)
            ? leadStatus
            : statusName,
          product: productName,
          productCode: productCode,
          type: type,
        };

        var resultData = await getActivityMappingDetails(params)
          .then((res) => {
            if (res?.result?.length > 0) {
              let Data = res?.result;
              Data = Data?.map((obj) => {
                return {
                  ...obj,
                  productSchoolId: indexId,
                  productName: productName,
                };
              });
              return Data;
            }
          })
          .catch((err) => {
            console.log(err, "Error");
          });
        return resultData?.flat();
      })
    );

    result
      .then((resolvedResult) => {
        let data = resolvedResult?.flat();
        setCustomList(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(async () => {
    if (multiProductList?.length) {
      let data = activityMapDetail();
    }
  }, [multiProductList?.length, stageName, statusName]);

  const getPlannerActivity = async (params, setFlag = true) => {
    try {
      if (setFlag) {
        let data;
        let res = await getBdeActivitiesByDate(params);
        data = res?.result;

        if (selectedActivity && selectedActivity?.length) {
          data = data?.filter(
            (obj) =>
              obj?.schoolId === selectedActivity?.[0]?.schoolId &&
              obj?.activityDate === selectedActivity?.[0]?.activityDate
          );
        }

        if (data?.length > 0) {
          setSchoolMeeting(data);
        } else {
          setSchoolMeeting([]);
          fetchClaimActivity();
        }
      } else {
        return getBdeActivitiesByDate(params);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    let schoolFieldData = JSON.parse(localStorage.getItem("SchoolFieldData"));

    let schoolProductData = JSON.parse(
      localStorage.getItem("SchoolProductData")
    );

    if (
      schoolMeeting?.length &&
      schoolFieldData?.length &&
      schoolProductData?.length
    ) {
      updateStorageData();
      setHasStorageData(true);
    }
  }, [schoolMeeting]);

  const updateStorageData = () => {
    let updatedArray = [];
    let updateContactOptions;
    let schoolFieldData = JSON.parse(localStorage.getItem("SchoolFieldData"));

    schoolFieldData = schoolFieldData?.filter((obj) => {
      let Data = moment(obj?.activityDate).utc().format("YYYY-MM-DD");
      let activityDate = moment(activityLogDate).format("YYYY-MM-DD");
      Data = Data === activityDate;
      return Data;
    });

    if (schoolFieldData?.length) {
      schoolMeeting?.map((obj) => {
        return schoolFieldData?.map((data) => {
          if (
            obj?.activityDate === data?.activityDate &&
            obj?.schoolId === data?.schoolID
          ) {
            updateContactOptions = {
              ...data,
              contactDetail: data?.contactDetail,
              contactOptions: obj?.contactDetails,
            };
            updatedArray.push(updateContactOptions);
          }
          return updatedArray;
        });
      });
    }

    if (updatedArray?.length) {
      localStorage.setItem("SchoolFieldData", JSON.stringify(updatedArray));
      getLogActivity();
    }
  };

  const isMeetingDone = (obj, index) => {
    let schoolId = obj?.schoolID;
    let schoolActivityDate = obj?.activityDate;
    let selectedProductList = [];
    let isImplementedType = obj?.type === fieldTab?.implementation;
    let isCollectionProfileExist = UserProfileName?.includes(
      getUserData("userData")?.crm_profile
    );

    let schoolProduct = selectMultiInterest?.find(
      (obj) =>
        obj?.productSchoolID === schoolId &&
        obj?.activityDate === schoolActivityDate
    );

    if (!isImplementedType) {
      if (schoolProduct) {
        if (
          schoolProduct?.interestProduct &&
          !schoolProduct?.interestProduct?.length
        ) {
          getProductList();
          isSchoolProduct(schoolMultiInterest);
          isMeetingDone(obj, index);
          return;
        }
      }
    }

    const updateProductList = multiProductList?.filter(
      (obj) =>
        obj?.schoolId === schoolId && obj?.activityDate === schoolActivityDate
    );

    const getSelectedOption = (key, productName, productSchoolID) => {
      let option;
      let newOption = [];
      option = customList
        ? customList?.filter(
            (obj) =>
              obj?.key === key &&
              obj?.productSchoolId === productSchoolID &&
              obj?.productName === productName
          )?.[0]?.value
        : [];
      if (option?.length > 0) {
        option = option?.map((obj) => {
          newOption.push({
            label: obj,
            value: obj,
          });
        });
        return newOption;
      }
      return option;
    };

    return (
      <>
        <Grid item md={12} xs={12} className="crm-sd-log-item">
          {!isImplementedType ? (
            <>
              <Typography component={"h4"} className="crm-sd-log-form-label">
                Product Pitched*
              </Typography>
              <Grid container>
                {schoolProduct
                  ? schoolProduct?.interestProduct?.map((pd, i) => {
                      return (
                        <Grid item xs={6} md="auto" key={i}>
                          <FormControlLabel
                            className="crm-form-input-checkbox"
                            control={<Checkbox />}
                            label={pd?.profileName}
                            checked={isCreatedProduct(obj, pd)}
                            onChange={(event) => handleProduct(obj, pd, event)}
                          />
                        </Grid>
                      );
                    })
                  : ""}
              </Grid>
            </>
          ) : (
            ""
          )}
        </Grid>
        {updateProductList?.length ? (
          <Grid
            container
            spacing={0}
            className="crm-sd-log-product-list crm-sd-log-item"
          >
            <Grid item container className="crm-sd-log-product-header">
              <Grid item md={2} xs={12}>
                <Typography className="crm-sd-log-product-header-cell">
                  Product*
                </Typography>
              </Grid>
              <Grid item md={2} xs={12}>
                <Typography className="crm-sd-log-product-header-cell">
                  Meeting Outcomes*
                </Typography>
              </Grid>
              <Grid item md={2} xs={12}>
                <Typography className="crm-sd-log-product-header-cell">
                  Subject*
                </Typography>
              </Grid>
              <Grid item md={2} xs={12}>
                <Typography className="crm-sd-log-product-header-cell">
                  Next Meeting Date*
                </Typography>
              </Grid>
              <Grid item md={2} xs={12}>
                <Typography className="crm-sd-log-product-header-cell">
                  Meeting Time*
                </Typography>
              </Grid>
              {!isImplementedType ? (
                <Grid item md={2} xs={12}>
                  <Typography className="crm-sd-log-product-header-cell">
                    Priority*
                  </Typography>
                </Grid>
              ) : (
                ""
              )}
            </Grid>

            {updateProductList?.map((obj, index) => {
              let productName = obj?.profileName;
              let productSchoolID = obj?.schoolId;
              return (
                <Grid
                  key={index}
                  item
                  md={12}
                  xs={12}
                  className="crm-sd-log-product-item"
                >
                  <Box className="crm-sd-log-product-item-wrapper">
                    <Grid
                      container
                      spacing={isMobile ? 0 : 2.5}
                      className="crm-sd-log-product-item-inner-wrapper"
                    >
                      <Grid
                        item
                        md={2}
                        xs={12}
                        className="crm-sd-log-product-item-cell"
                      >
                        <Typography className="crm-sd-log-product-item-info">
                          {isMobile ? `Product: ` : ``} {obj?.profileName}
                        </Typography>
                      </Grid>

                      <Grid
                        item
                        md={2}
                        xs={12}
                        className="crm-sd-log-product-item-cell"
                      >
                        <Typography
                          component={"h4"}
                          className="crm-sd-log-product-item-label d-none-web"
                        >
                          Meeting Outcome
                        </Typography>
                        <ReactSelect
                          isSearchable={false}
                          // defaultMenuIsOpen={true}
                          // menuIsOpen={true}
                          className="crm-form-input crm-form-input-mini crm-react-select dark crm-form-input-mobile-standard"
                          classNamePrefix="select"
                          placeholder="Select"
                          id={`multiProductList[${index}].customerResponse`}
                          options={getSelectedOption(
                            "customerResponse",
                            productName,
                            productSchoolID
                          )}
                          // options={getOptionData("Customer Response")}
                          value={obj?.customerResponse}
                          onChange={(event) => {
                            handleProductFielddData(
                              index,
                              "customerResponse",
                              event,
                              obj
                            );
                            obj.priority = "";
                            getDynamicField(obj);
                          }}
                          components={{ DropdownIndicator }}
                        />
                      </Grid>
                      <Grid
                        item
                        md={2}
                        xs={12}
                        className="crm-sd-log-product-item-cell"
                      >
                        <Typography
                          component={"h4"}
                          className="crm-sd-log-product-item-label d-none-web"
                        >
                          Subject
                        </Typography>
                        <ReactSelect
                          isSearchable={false}
                          className="crm-form-input crm-react-select dark crm-form-input-mini crm-form-input-mobile-standard"
                          classNamePrefix="select"
                          placeholder="Select"
                          id={`multiProductList[${index}].subject`}
                          options={getSelectedOption(
                            "subject",
                            productName,
                            productSchoolID
                          )}
                          // options={getOptionData("Customer Response")}
                          value={obj?.subject}
                          onChange={(event) => {
                            handleProductFielddData(
                              index,
                              "subject",
                              event,
                              obj
                            );
                            obj.priority = "";
                            getDynamicField(obj);
                          }}
                          components={{ DropdownIndicator }}
                        />
                      </Grid>
                      <Grid
                        item
                        md={2}
                        xs={12}
                        className="crm-sd-log-product-item-cell"
                      >
                        <Typography
                          component={"h4"}
                          className="crm-sd-log-product-item-label d-none-web"
                        >
                          Next Meeting Date
                        </Typography>

                        <FormDatePicker
                          value={obj?.meetingDate}
                          minDateValue={new Date()}
                          theme="dark"
                          className="crm-form-input-mini crm-form-input-mobile-standard"
                          handleSelectedValue={(event) =>
                            handleProductFielddData(
                              index,
                              "meetingDate",
                              moment(new Date(event)).format("YYYY-MM-DD"),
                              obj
                            )
                          }
                        />
                      </Grid>
                      <Grid
                        item
                        md={2}
                        xs={12}
                        className="crm-sd-log-product-item-cell"
                      >
                        <Typography
                          component={"h4"}
                          className="crm-sd-log-product-item-label d-none-web"
                        >
                          Meeting Time
                        </Typography>
                        <TimePicker
                          className="crm-form-input crm-form-input-mini dark crm-form-input-mobile-standard"
                          value={obj?.timeIn ? moment(obj?.timeIn) : undefined}
                          onChange={(event) => {
                            handleProductFielddData(
                              index,
                              "timeIn",
                              event,
                              obj
                            );
                          }}
                          showSecond={false}
                          use24Hours
                          inputReadOnly
                          disabledHours={() => disabledMeetingHours(obj)}
                          disabledMinutes={(event) =>
                            disabledMeetingMinutes(event, obj)
                          }
                          defaultValue={moment()}
                          components={{
                            OpenPickerIcon: "null",
                          }}
                        />
                      </Grid>
                      {!isImplementedType ? (
                        <Grid
                          item
                          md={2}
                          xs={12}
                          className="crm-sd-log-product-item-cell"
                        >
                          <Typography
                            component={"h4"}
                            className="crm-sd-log-product-item-label d-none-web"
                          >
                            Priority
                          </Typography>
                          <ReactSelect
                            isSearchable={false}
                            className="crm-form-input crm-react-select dark crm-form-input-mini crm-form-input-mobile-standard"
                            classNamePrefix="select"
                            placeholder="Select"
                            id={`multiProductList[${index}].priority`}
                            options={getSelectedOption(
                              "priority",
                              productName,
                              productSchoolID
                            )}
                            // isDisabled={!obj?.isPriorityApplicable ? true : false}
                            // options={getOptionData("Customer Response")}
                            value={obj?.priority}
                            onChange={(event) => {
                              handleProductFielddData(
                                index,
                                "priority",
                                event,
                                obj,
                                updateProductList
                              );
                              getDynamicField(obj);
                            }}
                            components={{ DropdownIndicator }}
                          />
                        </Grid>
                      ) : (
                        ""
                      )}
                      {Object.keys(
                        obj?.dependentField ? obj?.dependentField : {}
                      ).length > 0 ? (
                        <Grid item md={12} xs={12}>
                          <DynamicActivityFormLog
                            data={crmMasterKey}
                            isExistDependentField={isExistDependentField}
                            filledData={obj?.dependentField}
                            getDynamicData={handleDynamicFielddData}
                            currentObj={obj}
                          />
                        </Grid>
                      ) : (
                        ""
                      )}
                    </Grid>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        ) : (
          ""
        )}
      </>
    );
  };

  const renderMeetingForm = (obj, index) => {
    if (obj?.isMeeting == "Yes") {
      return isMeetingDone(obj, index);
    }
    // else if (obj?.isMeeting == "No") {
    //   return meetingSchedule(obj, index);
    // }
    else {
      return <></>;
    }
  };

  const handleUpdate = (data, schoolId, indexNo) => {
    let params = {
      contactDetails: data,
      leadId: schoolId,
    };

    updateContactDetails(params)
      .then((res) => {
        if (!(res?.statusCode === 0)) {
          toast.success(res?.message);
          if (res?.data) {
            let paramObj = {
              roleName: getUserData("userData")?.crm_role,
              meetingDate: moment(meetingLogDate).format("YYYY-MM-DD"),
            };

            let contactData = res?.data?.contactDetails;
            handleContactUpdate(contactData, indexNo);
            // getPlannerActivity(paramObj);
            setContact(true);
          }
        } else {
          setContact(false);
          toast.error(res?.message);
        }
      })
      .catch((err) => {
        console.error(err, "Error in updating Contact");
      });
  };

  const isContactModal = () => {
    setContact(false);
  };

  const handleContactUpdate = useCallback((data, index) => {
    const newFields = [...fields];
    newFields[index]["contactOptions"] = data;
    setFields(newFields);
  });

  const handleRaiseFlag = useCallback((event, meetingObj, index) => {
    const newFields = [...fields];
    newFields[index]["raisedClaim"] = event.target.checked;
    setFields(newFields);
  });

  const handleCollectedFlag = useCallback((event, meetingObj, index) => {
    const newFields = [...fields];
    newFields[index]["isCollection"] = event.target.checked;
    if (!event.target.checked) {
      newFields[index]["collectedPayment"] = "";
      newFields[index]["collectedFor"] = "";
      newFields[index]["paymentMode"] = "";
    }
    setFields(newFields);
  });

  const handleCollectedAmount = useCallback(
    (event, meetingObj, index, fieldType) => {
      const newFields = [...fields];
      if (fieldType === "collectedPayment") {
        newFields[index][fieldType] = event.target.value;
      } else {
        newFields[index][fieldType] = event;
      }
      setFields(newFields);
    }
  );

  const addNewContact = (data, schoolId, indexNo) => {
    let params = {};
    let { name, designation, mobileNumber, emailId, isValid, isPrimary } = data;
    if (
      isPrimary == true &&
      name &&
      designation &&
      mobileNumber &&
      emailId &&
      isValid
    ) {
      params = {
        name: name,
        designation: designation,
        mobileNumber: mobileNumber,
        emailId: emailId,
        isPrimary: isPrimary,
      };
    } else if (isPrimary == false && name && designation && isValid) {
      params = {
        name: name,
        designation: designation,
        mobileNumber: mobileNumber,
        emailId: emailId,
        isPrimary: isPrimary,
      };
    }

    handleUpdate(params, schoolId, indexNo);
  };

  const MinutesOfMeetingEl = () => {
    return (
      <Grid className="crm-sd-log-item">
        <Typography component="h4" className="crm-sd-log-form-label">
          Minutes of Meetings *
        </Typography>
        <textarea
          className="crm-form-input-textarea medium-dark"
          id={`minutesofmeeting`}
          name={"minutesofmeeting"}
          rows="4"
          cols="50"
          type="text"
          placeholder=""
          value={""}
          onChange={(event) => {
            return null;
          }}
        />
      </Grid>
    );
  };

  const ProductModalActionEl = () => {
    return (
      <Grid
        className="crm-sd-log-action"
        sx={{ px: 2.5, my: "30px !important" }}
      >
        <Button
          className="crm-btn crm-btn-outline crm-btn-lg crm-btn-mobile-lg"
          onClick={() => setProductModalStatus(false)}
        >
          Do It Later
        </Button>
        <Button
          className="crm-btn crm-btn-primary crm-btn-lg crm-btn-mobile-lg"
          onClick={() => {
            return null;
          }}
        >
          Submit
        </Button>
      </Grid>
    );
  };


  const allObjectsHaveFirstMeetingSubject = multiProductList.every(
    (obj) => obj?.subject?.label === "First Meeting"
  );

  return (
    <>
      <Page className="crm-sd-log">
        {productModalStatus ? (
          <>
            <Breadcrumbs
              className="crm-breadcrumbs"
              separator={<img src={IconBreadcrumbArrow} />}
              aria-label="breadcrumbs"
            >
              <Link
                underline="hover"
                key="1"
                color="inherit"
                to="/authorised/school-dashboard"
                className="crm-breadcrumbs-item breadcrumb-link"
              >
                Dashboard
              </Link>
              <Link
                underline="hover"
                key="2"
                color="inherit"
                to="/authorised/logActivity"
                className="crm-breadcrumbs-item breadcrumb-link"
                onClick={(e) => {
                  e.preventDefault();
                  setProductModalStatus(false);
                }}
              >
                Log my day
              </Link>
              <Typography
                key="3"
                component="span"
                className="crm-breadcrumbs-item breadcrumb-active"
              >
                Products
              </Typography>
            </Breadcrumbs>
          </>
        ) : (
          <>
            <Breadcrumbs
              className="crm-breadcrumbs"
              separator={<img src={IconBreadcrumbArrow} />}
              aria-label="breadcrumbs"
            >
              <Link
                underline="hover"
                key="1"
                color="inherit"
                to="/authorised/school-dashboard"
                className="crm-breadcrumbs-item breadcrumb-link"
              >
                Dashboard{" "}
              </Link>
              <Typography
                key="2"
                component="span"
                className="crm-breadcrumbs-item breadcrumb-active"
              >
                Log my day
              </Typography>
            </Breadcrumbs>
          </>
        )}

        {!shw_loader ? (
          <Box
            className={
              `crm-sd-log-wrapper ` +
              (productModalStatus ? ` product-list-selected ` : ``)
            }
          >
            <Box className="crm-page-innner-header">
              {isMobile ? (
                <Link
                  key="99"
                  color="inherit"
                  to={".."}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(-1);
                  }}
                  className=""
                >
                  <IconNavLeft className="crm-inner-nav-left" />{" "}
                </Link>
              ) : null}
              <Typography component="h2" className="crm-sd-log-heading">
                Log meeting for day
              </Typography>
            </Box>

            <Grid container className="crm-sd-log-list" spacing={2.5}>
              {fields?.length
                ? fields?.map((obj, index) => {
                    let updateProductList = multiProductList?.filter(
                      (data) =>
                        data?.schoolId === obj?.schoolID &&
                        data?.activityDate === obj?.activityDate
                    );

                    updateProductList =
                      updateProductList?.length > 0
                        ? updateProductList?.map((obj) => {
                            return {
                              label: obj?.profileName,
                              value: obj?.leadId,
                              groupCode: obj?.learningProfileGroupCode,
                              groupName: obj?.learningProfileGroupName,
                              leadStage: obj?.leadStage,
                              leadStatus: obj?.leadStatus,
                              learningProfileRefId: obj?.learningProfileRefId,
                            };
                          })
                        : [];
                    return (
                      <Grid container item key={index}>
                        <Grid item container spacing={2.5}>
                          <Grid item md={4} xs={12} className="crm-sd-log-item">
                            <Typography
                              component="h4"
                              className="crm-sd-log-form-label"
                            >
                              {obj?.meetingAgenda
                                ? obj?.meetingAgenda + "*"
                                : "Follow up Meeting*"}
                            </Typography>
                            <TextField
                              disabled
                              autoComplete="off"
                              className="crm-form-input medium-dark input-disabled"
                              placeholder=""
                              value={obj?.schoolName}
                              name="schoolName"
                            />
                          </Grid>
                          <Grid item md={4} xs={12} className="crm-sd-log-item">
                            <Typography
                              component="h4"
                              className="crm-sd-log-form-label"
                            >
                              Conversation with*
                            </Typography>

                            <MultipleSelectContact
                              label={"Select User"}
                              getInputData={handleFieldData}
                              addNewContact={addNewContact}
                              data={obj?.contactOptions}
                              isUpdated={isContact}
                              contactData={obj?.contactDetail}
                              isDisabled={false}
                              indexNo={index}
                              schoolId={obj?.schoolID}
                              schoolActivityDate={obj?.activityDate}
                              isContactModal={isContactModal}
                              type={"userContact"}
                            />
                          </Grid>
                          <Grid item md={4} xs={12} className="crm-sd-log-item">
                            <Typography
                              component="h4"
                              className="crm-sd-log-form-label"
                            >
                              Meeting Happened*
                            </Typography>
                            <RadioGroup
                              row
                              className={classes.schoolRadioFont}
                              aria-label="referredBy"
                              id={`fields[${index}].isMeeting`}
                              name={obj?.isMeeting}
                              value={obj?.isMeeting}
                              onChange={(event) => {
                                handleFieldData(
                                  index,
                                  "isMeeting",
                                  event.target.value,
                                  obj
                                );
                                renderMeetingForm(obj, index);
                              }}
                            >
                              <FormControlLabel
                                className="crm-form-input-radio"
                                value="Yes"
                                control={
                                  <Radio sx={{ color: "rgba(0,0,0,0.8)" }} />
                                }
                                label="Yes"
                              />
                              <FormControlLabel
                                className="crm-form-input-radio"
                                value="No"
                                control={
                                  <Radio sx={{ color: "rgba(0,0,0,0.8)" }} />
                                }
                                label="No"
                              />
                            </RadioGroup>
                          </Grid>
                          {obj?.isMeeting === "No" ? (
                            <>
                              <Grid
                                item
                                md={4}
                                xs={12}
                                className="crm-sd-log-item"
                              >
                                <Typography
                                  component="h4"
                                  className="crm-sd-log-form-label"
                                >
                                  Next Meeting Date*
                                </Typography>

                                <FormDatePicker
                                  value={obj?.startDate}
                                  minDateValue={new Date()}
                                  theme="medium-dark"
                                  handleSelectedValue={(event) =>
                                    handleFieldData(index, "startDate", event)
                                  }
                                />
                              </Grid>
                              <Grid
                                item
                                md={4}
                                xs={12}
                                className="crm-sd-log-item"
                              >
                                <Typography
                                  component="h4"
                                  className="crm-sd-log-form-label"
                                >
                                  Next Meeting Time*
                                </Typography>
                                <TimePicker
                                  className="crm-form-input medium-dark position-relative"
                                  id={`fields[${index}].timeIn`}
                                  value={
                                    obj?.timeIn
                                      ? moment(obj?.timeIn)
                                      : undefined
                                  }
                                  onChange={(value) =>
                                    handleFieldData(index, "timeIn", value)
                                  }
                                  showSecond={false}
                                  use24Hours
                                  inputReadOnly
                                  disabledHours={() => disabledHours(obj)}
                                  disabledMinutes={(event) =>
                                    disabledMinutes(event, obj)
                                  }
                                  defaultValue={moment()}
                                  placeholder="Select Time"
                                  inputIcon={
                                    <IconTimepicker className="crm-form-timepicker-icon" />
                                  }
                                />
                              </Grid>
                            </>
                          ) : null}
                        </Grid>
                        <Grid item container xs={12} md={12} className="pt-0">
                          <>{renderMeetingForm(obj, index)}</>

                          {hasStorageData && obj?.isMeeting === "Yes" ? (
                            <updateStorageData />
                          ) : null}

                          <Grid item container>
                            <Grid
                              item
                              md={4}
                              xs={12}
                              className="crm-sd-log-item"
                            >
                              <FormGroup>
                                <FormControlLabel
                                  className="crm-form-input-checkbox"
                                  required
                                  control={<Checkbox />}
                                  label="Raise a claim"
                                  checked={obj?.raisedClaim ?? false}
                                  onChange={(e) =>
                                    handleRaiseFlag(e, obj, index)
                                  }
                                />
                              </FormGroup>
                            </Grid>

                            {/* {!allObjectsHaveFirstMeetingSubject && (
                              <>
                                <Grid
                                  item
                                  md={8}
                                  xs={12}
                                  className="crm-sd-log-item"
                                >
                                  <FormGroup>
                                    <FormControlLabel
                                      className="crm-form-input-checkbox"
                                      required
                                      control={<Checkbox />}
                                      label={FieldLabel?.collectedAmount}
                                      checked={obj?.isCollection ?? false}
                                      onChange={(e) =>
                                        handleCollectedFlag(e, obj, index)
                                      }
                                    />
                                  </FormGroup>
                                </Grid>
                              </>
                            )} */}

                            {isCollectionProfile && (
                              <>
                                <Grid
                                  item
                                  md={8}
                                  xs={12}
                                  className="crm-sd-log-item"
                                >
                                  <FormGroup>
                                    <FormControlLabel
                                      className="crm-form-input-checkbox"
                                      required
                                      control={<Checkbox />}
                                      label={FieldLabel?.collectedAmount}
                                      checked={obj?.isCollection ?? false}
                                      onChange={(e) =>
                                        handleCollectedFlag(e, obj, index)
                                      }
                                    />
                                  </FormGroup>
                                </Grid>
                              </>
                            )}

                            {obj?.isCollection && (
                              <>
                                <Grid
                                  item
                                  container
                                  spacing={2.5}
                                  sx={{ mt: 0 }}
                                >
                                  <Grid
                                    item
                                    md={4}
                                    xs={12}
                                    className="crm-sd-log-item"
                                  >
                                    <Typography
                                      component="h4"
                                      className="crm-sd-log-form-label"
                                    >
                                      Amount Collected
                                    </Typography>
                                    <FormGroup className="width-100p">
                                      <TextField
                                        className="crm-form-input dark"
                                        autoComplete="off"
                                        name="name"
                                        type="number"
                                        placeholder="Enter Numeric Value"
                                        value={obj?.collectedPayment || ""}
                                        onChange={(e) =>
                                          handleCollectedAmount(
                                            e,
                                            obj,
                                            index,
                                            "collectedPayment"
                                          )
                                        }
                                        onKeyDown={handleKeyDown}
                                        onPaste={handlePaste}
                                      />
                                    </FormGroup>
                                  </Grid>
                                  <Grid
                                    item
                                    md={4}
                                    xs={12}
                                    className="crm-sd-log-item"
                                  >
                                    <Typography
                                      component="h4"
                                      className="crm-sd-log-form-label"
                                    >
                                      Payment Collected for
                                    </Typography>
                                    {/* <ReactSelect
                                      isSearchable={false}
                                      isMulti
                                      className=""
                                      classNamePrefix="select"
                                      placeholder="Select"
                                      options={updateProductList}
                                      value={obj?.collectedFor || ""}
                                      onChange={(e) =>
                                        handleCollectedAmount(
                                          e,
                                          obj,
                                          index,
                                          "collectedFor"
                                        )
                                      }
                                      components={{ DropdownIndicator }}
                                    /> */}
                                    <FormMultiSelect
                                      placeholder={"Select"}
                                      options={updateProductList}
                                      optionsLabels={{
                                        label: "label",
                                        value: "value",
                                      }}
                                      handleSelectedValue={(e) =>
                                        handleCollectedAmount(
                                          e,
                                          obj,
                                          index,
                                          "collectedFor"
                                        )
                                      }
                                      returnType="string"
                                      value={obj?.collectedFor || ""}
                                    />
                                  </Grid>

                                  <Grid
                                    item
                                    md={4}
                                    xs={12}
                                    className="crm-sd-log-item"
                                  >
                                    <Typography
                                      component="h4"
                                      className="crm-sd-log-form-label"
                                    >
                                      Mode of Payment
                                    </Typography>
                                    {/* <ReactSelect
                                      isSearchable={false}
                                      isMulti
                                      className=""
                                      classNamePrefix="select"
                                      placeholder="Select"
                                      options={PAYMENTMODE}
                                      value={obj?.paymentMode || ""}
                                      onChange={(e) =>
                                        handleCollectedAmount(
                                          e,
                                          obj,
                                          index,
                                          "paymentMode"
                                        )
                                      }
                                      components={{ DropdownIndicator }}
                                    /> */}
                                    <FormMultiSelect
                                      placeholder={"Select"}
                                      options={paymentmode}
                                      optionsLabels={{
                                        label: "label",
                                        value: "value",
                                      }}
                                      handleSelectedValue={(e) =>
                                        handleCollectedAmount(
                                          e,
                                          obj,
                                          index,
                                          "paymentMode"
                                        )
                                      }
                                      returnType="string"
                                      value={obj?.paymentMode || ""}
                                    />
                                  </Grid>
                                </Grid>
                              </>
                            )}

                            <Grid
                              item
                              md={12}
                              xs={12}
                              className="crm-sd-log-item"
                            >
                              <Typography
                                component="h4"
                                className="crm-sd-log-form-label"
                              >
                                Comments*
                              </Typography>

                              <textarea
                                className="crm-form-input-textarea medium-dark"
                                id={`fields[${index}].comment`}
                                name={obj?.comment}
                                rows="4"
                                cols="50"
                                type="text"
                                placeholder=""
                                value={obj?.comment}
                                onChange={(event) =>
                                  handleFieldData(
                                    index,
                                    "comment",
                                    event.target.value
                                  )
                                }
                                // onKeyDown={handleKeyTextDown}
                                // onPaste={handleTextPaste}
                                // maxLength={100}
                              />
                            </Grid>
                          </Grid>
                          <Grid item xs={12} className="crm-sd-log-item ">
                            <Box className="crm-flex-end">
                              <Button
                                className="crm-btn crm-btn-primary crm-btn-md "
                                onClick={() =>
                                  createActivity(obj, isSelectedSubmit)
                                }
                              >
                                Save
                              </Button>
                            </Box>
                          </Grid>
                          <Grid
                            item
                            md={12}
                            xs={12}
                            className="crm-sd-log-item"
                          >
                            <Divider />
                          </Grid>
                        </Grid>
                      </Grid>
                    );
                  })
                : ""}
              <Grid className="crm-sd-log-action">
                <Button
                  className="crm-btn crm-btn-outline crm-btn-lg crm-btn-mobile-lg"
                  onClick={() => isSubmitActivity(true)}
                >
                  Cancel
                </Button>
                <Button
                  className="crm-btn crm-btn-primary crm-btn-lg crm-btn-mobile-lg"
                  onClick={() => isSubmitActivity()}
                >
                  Submit{" "}
                </Button>
              </Grid>
            </Grid>
          </Box>
        ) : (
          <div className={classes.loader}>{DisplayLoader()}</div>
        )}

        {isMobile ? (
          <div className="crm-modal-inner-container">
            <Modal
              className={classes.modal + ` crm-modal-inner-page`}
              open={productModalStatus}
              closeAfterTransition
            >
              <Fade in={productModalStatus}>
                <Box className="crm-modal-inner-page-wrapper">
                  <Box className="crm-modal-inner-page-header">
                    {isMobile ? (
                      <Link
                        key="98"
                        color="inherit"
                        to={".."}
                        onClick={(e) => {
                          e.preventDefault();
                          handleProductModalClose(false);
                        }}
                        className=""
                      >
                        <IconNavLeft className="crm-inner-nav-left" />{" "}
                      </Link>
                    ) : null}
                    <Typography
                      component="h2"
                      className="crm-modal-inner-page-title"
                    >
                      Products
                    </Typography>
                  </Box>
                  <Box className="crm-modal-inner-page-content">
                    {dynamicfield
                      ?.filter((obj) => obj?.dependentField)
                      ?.map((obj, index) => (
                        <div className="" key={index}>
                          <DynamicActivityFormLog
                            data={crmMasterKey}
                            isExistDependentField={isExistDependentField}
                            filledData={obj?.dependentField}
                            getDynamicData={handleDynamicFielddData}
                            currentObj={obj}
                            indexNo={index}
                            activeAccordionItem={activeproductAccordionItem}
                            setActiveAccordionItem={(i) =>
                              setActiveproductAccordionItem(i)
                            }
                          />
                        </div>
                      ))}
                  </Box>

                  <Box sx={{ mx: 2.5 }}>
                    <MinutesOfMeetingEl />
                  </Box>

                  <ProductModalActionEl />
                </Box>
              </Fade>
            </Modal>
          </div>
        ) : (
          <>
            {productModalStatus ? (
              <>
                <Box className="crm-sd-log-product-wrapper">
                  {dynamicfield
                    ?.filter((obj) => obj?.dependentField)
                    ?.map((obj, index) => (
                      <div className="" key={index}>
                        <DynamicActivityFormLog
                          data={crmMasterKey}
                          isExistDependentField={isExistDependentField}
                          filledData={obj?.dependentField}
                          getDynamicData={handleDynamicFielddData}
                          currentObj={obj}
                          indexNo={index}
                          activeAccordionItem={activeproductAccordionItem}
                          setActiveAccordionItem={(i) =>
                            setActiveproductAccordionItem(i)
                          }
                        />
                      </div>
                    ))}

                  <MinutesOfMeetingEl />
                </Box>
                <ProductModalActionEl />
              </>
            ) : null}
          </>
        )}
      </Page>
    </>
  );
};
