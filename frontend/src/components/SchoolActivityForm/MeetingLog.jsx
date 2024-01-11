import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import { Grid, Stack, TextField, Typography } from "@mui/material";
import { useStyles } from "../../css/AddSchool-css";
import MultipleSelectCheckmarks from "../../components/SchoolActivityForm/AutocompleteWithButton";
import ReactSelect from "react-select";
import {
  updateContactDetails,
} from "../../config/services/school";
import { toast } from "react-hot-toast";
import { getUserData } from "../../helper/randomFunction/localStorage";
import {
  handleKeyTextDown,
  handleTextPaste,
} from "../../helper/randomFunction";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TimePicker from "rc-time-picker";
import { useNavigate } from "react-router-dom";
import { logMeetingActivity } from "../../config/services/bdeActivities";
import moment from "moment";
import { getDetails } from "../../config/services/activityFormMapping";
import { getAllKeyValues } from "../../config/services/crmMaster";
import { getAllProductList } from "../../config/services/packageBundle";
import RemoveIcon from "@mui/icons-material/Remove";
import CloseIcon from "@mui/icons-material/Close";

const style = {
  overflow: "scroll !important",
  position: "absolute",
  top: "50%",
  left: "70%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  bgcolor: "background.paper",
  border: "none !important",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
  borderRadius: "4px",
};

export const MeetingLog = (props) => {
  let { isMeeting, visibleIsMeeting, data, minimizePopUP } = props;



  const [userDetail, setUserDetail] = useState(null);
  const [isContact, setContact] = useState(false);
  const [selectInterest, setSelectInterest] = useState([]);
  const userRole = getUserData("userData")?.crm_role;
  const [comment, setComment] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [interestId, setInterestId] = useState([]);
  const [productList, setProductList] = useState([]);
  const [contactList, setContactList] = useState([]);
  const navigate = useNavigate();
  const [crmMasterKey, setMasterKey] = useState([]);

  const [shw_loader, setDisplayLoader] = useState(false);

  const [timeIn, setTimeIn] = useState(null);

  const classes = useStyles();

  const [open, setOpen] = useState(true);

  const [isVisible, setContentVisible] = useState(false);

  const [isMeetType, setSchedule] = useState({
    label: "Meeting Status",
    value: "",
  });

  const [interestOption, setOptions] = useState(null);

  const handleClose = () => {
    setContentVisible(true);
    setOpen(false);
  };

  const handleMinimize = () => {
    setContentVisible(!isVisible);
  };

  const meetOptions = [
    { label: "Meeting didn’t happened", value: "Meeting didn’t happened" },
    { label: "Meeting happened", value: "Meeting happened" },
  ];

  useEffect(() => {
    visibleIsMeeting(open);
    if (data) {
      setUserDetail(data);
    }
  }, [open, data, isVisible]);

  useEffect(() => {
    getProductList();
  }, []);

 
  useEffect(() => {
    if (interestOption) {
      getProductInterest();
    }
  }, [interestOption]);

  const getLeadInterestId = (data) => {
    const uniqueValues = new Set();
    const filteredArray = data?.filter((item) => {
      if (!uniqueValues.has(item.profileName)) {
        uniqueValues.add(item.profileName);
        return true;
      }
      return false;
    });

    setInterestId(filteredArray);
  };


  const getProductInterest = () => {
    let optionArray = interestOption?.map((obj) => obj?.label);

    let interest = userDetail?.interest
      ?.filter((obj) => !(obj?.assignedTo_role_name === userRole))
      ?.map((obj) => obj?.learningProfile);

    let interestedId = userDetail?.interest?.map((obj) => {
      return {
        profileName: obj?.learningProfile,
        leadId: obj?.leadId,
        leadStage: obj?.stageName,
        leadStatus: obj?.statusName,
        schoolId: obj?.schoolId,
        schoolLeadId: userDetail?.leadId,
      };
    });

    interest = optionArray
      ?.map((obj) => {
        if (!interest?.includes(obj)) {
          return {
            profileName: obj,
            leadId: "",
            leadStage: "",
            leadStatus: "",
            schoolId: "",
            schoolLeadId: "",
          };
        }
      })
      .filter((obj) => obj);

    getLeadInterestId(interestedId?.concat(interest));

    setSelectInterest(interest);
  };

  const getContactData = (data) => {
    setContactList(data);
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
        });
      }
    });
    setProductList(newArray);
  };

  const addNewContact = (data) => {
    let params = {};
    let { name, designation, mobileNumber, emailId, isValid } = data;
    if (name && designation && mobileNumber && emailId && isValid) {
      params = {
        name: name,
        designation: designation,
        mobileNumber: mobileNumber,
        emailId: emailId,
      };
      handleUpdate(params);
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

  const getOptionData = (key) => {
    let option;
    let newOption = [];
    option = crmMasterKey
      ? crmMasterKey?.filter((obj) => obj?.key === key)?.[0]?.value
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


  const handleUpdate = (data) => {
    let params = {
      contactDetails: data,
      leadId: userDetail?.leadId,
    };

    updateContactDetails(params)
      .then((res) => {
        if (!(res?.statusCode === 0)) {
          toast.success(res?.message);
          if (res?.data) {
            setUserDetail(res?.data);
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

  const getProductList = () => {
    let params = {
      status: [1],
      uuid: getUserData('loginData')?.uuid,
      master_data_type: 'package_products'
    }
    getAllProductList(params)
      .then(res => {
        let data = res?.data?.master_data_list
        let tempArray = data?.map(obj => ({
          label: obj?.name,
          value: obj?.name,
          groupkey: obj?.group_key,
          groupName: obj?.group_name,
          productID: obj?.id,
          productCode: obj?.product_key
        }))
        tempArray = tempArray?.filter(obj => ((obj?.groupName) && (obj?.groupkey)))
        setOptions(tempArray);
      })
      .catch((err) => {
        console.error(err, "Error while fetching product list");
      });
  };

  const validateField = () => {
    if (!contactList?.length > 0) {
      toast.error("Please Select User For Conversation");
      return false;
    }

    if (!productList?.length > 0) {
      toast.error("Please Select Product");
      return false;
    }

    if (!(isMeetType?.value === "Meeting Happened")) {
      if (!isMeetType?.value) {
        toast.error("Please Select Outcomes of Visit");
        return false;
      }

      if (!comment?.trim()) {
        toast.error("Please Add Comments");
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
    }

    return true;
  };

  useEffect(() => {
    getOptionsData();
  }, []);

  const validateFieldInArray = (arr, fieldNames) => {
    arr.forEach((obj, index) => {
      fieldNames.forEach((fieldName) => {
        if (
          !obj.hasOwnProperty(fieldName) ||
          obj[fieldName] === "" ||
          obj[fieldName] === undefined ||
          obj[fieldName] === null
        ) {
          toast.error("Please Add Correct Mapping");
          throw new Error(
            `Field "${fieldName}" not found in object at index ${index}`
          );
        }
      });
    });
  };

  const logDefaultActivity = async () => {
    let data = productList?.map((obj) => {
      return {
        meetingStatus: isMeetType?.value,
        leadStage: obj?.leadStage,
        leadStatus: obj?.leadStatus,
        profileName: obj?.profileName,
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

  const createActivity = async () => {
    const { finalResult } = await logDefaultActivity();
    let followUpDate = moment(new Date(startDate)).format("YYYY-MM-DD");
    let followUpTime = moment(timeIn).format("hh:mm A");

    let followUpDateTime = `${followUpDate} ${followUpTime}`;

    try {
      validateFieldInArray(finalResult, ["activityId", "futureActivityId"]);

      let Data = productList?.map((data) => {
        let newArray = [];
        let { activityId, futureActivityId } = finalResult?.find(
          (obj) => obj?.product === data?.profileName
        );
        let newObj = {
          ...data,
          activityId: activityId,
          futureActivityId: futureActivityId,
        };
        newArray.push(newObj);
        return newArray;
      });

      if (validateField()) {
        let params = {
          activityObj: Data?.flat()?.map((obj) => {
            return {
              leadId: obj?.leadId,
              name: obj?.profileName,
              createdBy: getUserData("loginData")?.uuid,
              createdByRoleName: getUserData("userData")?.crm_role,
              createdByProfileName: getUserData("userData")?.crm_profile,
              createdByName: getUserData("userData")?.name,
              leadType: "B2B",
              meetingStatus: isMeetType?.value,
              empCode: getUserData("userData")?.employee_code,
              ownerLeadId: userDetail?.leadId,
              comments: comment,
              followUpDateTime: followUpDateTime,
              meetingDate: followUpDateTime,
              leadStage: obj?.leadStage,
              leadStatus: obj?.leadStatus,
              schoolId: obj?.schoolId ? obj?.schoolId : obj?.schoolLeadId,
              activityId: obj?.activityId,
              futureActivityId: obj?.futureActivityId,
              contactDetails: contactList,
              leadType: "B2B",
              schoolName: data?.schoolName,
              schoolCode: data?.schoolCode,
              schoolCity: data?.city,
              schoolState: data?.state,
              schoolAddress: data?.address,
            };
          }),
        };

        setDisplayLoader(true);

        try {
          let res = await logMeetingActivity(params);
          if (res?.result) {
            setDisplayLoader(false);
            toast.success(res?.message);
            window.location.reload(false);
            setOpen(false);
          } else {
            setDisplayLoader(false);
            toast.error(res?.data?.error?.message);
            return false;
          }
        } catch (err) {
          console.error(err);
        }
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const isContactModal = () => {
    setContact(false);
  };

  const handleAllActivity = (data) => {
    if (isMeetType?.value === "Meeting Happened") {
      if (validateField()) {
        navigate("/authorised/add-activity", {
          state: {
            data: userDetail,
            contactList: contactList,
            productList: productList,
            meetingStatus: isMeetType?.value,
          },
        });
      }
    } else {
      createActivity();
    }
  };

  const currentTime = moment();

  const disabledHours = () => {
    const currentDate = moment();
    const isCurrentDateGreater = startDate?.isAfter(currentDate, "day");
    const currentHour = moment().hours();
    if (!isCurrentDateGreater) {
      return Array.from({ length: currentHour }, (_, index) => index);
    } else {
      return [];
    }
  };

  const disabledMinutes = (selectedHour) => {
    const currentDate = moment();
    const isCurrentDateGreater = startDate?.isAfter(currentDate, "day");
    if (!isCurrentDateGreater) {
      if (selectedHour === moment().hours()) {
        const currentMinute = moment().minutes();
        return Array.from({ length: currentMinute }, (_, index) => index);
      }
      return [];
    } else {
      return [];
    }
  };

  return (
    <>
      {!isVisible ? (
        <Modal
          open={isMeeting && open}
          onClose={handleClose}
          aria-labelledby="child-modal-title"
          aria-describedby="child-modal-description"
          className={classes.modal}
        >
          <Box className={classes.modalStyle}>
            <div
              style={{
                width: "100%",
                justifyContent: "space-between",
                display: "flex",
                gap: "10px",
                marginBottom: "20px",
                marginTop: "15px",
              }}
            >
              <div>
                <h3 id="child-modal-title" style={{ paddingBottom: "20px" }}>
                  Activity Form
                </h3>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <RemoveIcon
                  sx={{ cursor: "pointer" }}
                  onClick={handleMinimize}
                />
                <CloseIcon sx={{ cursor: "pointer" }} onClick={handleClose} />
              </div>
            </div>
            <p id="child-modal-description">
              <Grid container spacing={2}>
                <Grid item md={12} xs={12}>
                  <Typography
                    className={classes.label}
                    sx={{
                      marginBottom: "20px !important",
                      fontSize: "15px !important",
                    }}
                  >
                    Conversation with Name
                  </Typography>
                  <MultipleSelectCheckmarks
                    label={"Select User"}
                    getInputData={getContactData}
                    addNewContact={addNewContact}
                    data={userDetail?.contactDetails}
                    isUpdated={isContact}
                    contactData={contactList}
                    isDisabled={false}
                    isContactModal={isContactModal}
                    type={"userContact"}
                  />
                </Grid>
                <Grid item md={12} xs={12}>
                  <Typography
                    className={classes.label}
                    sx={{
                      marginBottom: "20px !important",
                      fontSize: "15px !important",
                    }}
                  >
                    Products
                  </Typography>
                  <MultipleSelectCheckmarks
                    label={"Select Products"}
                    productData={productList}
                    getInputData={getProductData}
                    data={selectInterest}
                    isDisabled={false}
                    type={"productList"}
                  />
                </Grid>
                <Grid item md={12} xs={12}>
                  <Typography
                    className={classes.label}
                    sx={{
                      marginBottom: "12px !important",
                      fontSize: "15px !important",
                    }}
                  >
                    Outcomes of Visit
                  </Typography>
                  <ReactSelect
                    isSearchable={false}
                    classNamePrefix="select"
                    options={getOptionData("Meeting Status")}
                    // options={meetOptions}
                    value={isMeetType}
                    onChange={(e) => {
                      setSchedule({
                        label: e.label,
                        value: e.value,
                      });
                    }}
                  />
                </Grid>
                {isMeetType?.value === "Meeting didn't Happened" ? (
                  <>
                    <Grid item md={12} xs={12}>
                      <Grid>
                        <Typography
                          className={classes.label}
                          sx={{
                            marginBottom: "12px !important",
                            fontSize: "15px !important",
                          }}
                        >
                          Comments *
                        </Typography>
                        <textarea
                          className={classes.textAreainputStyle}
                          name={"Comments"}
                          rows="4"
                          cols="50"
                          type="text"
                          placeholder=""
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          // onKeyDown={handleKeyTextDown}
                          // onPaste={handleTextPaste}
                          // maxLength={100}
                        />
                      </Grid>
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <Typography
                        className={classes.label}
                        sx={{
                          marginBottom: "12px !important",
                          fontSize: "15px !important",
                        }}
                      >
                        Follow-up date / time
                      </Typography>

                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Stack spacing={3}>
                          <DatePicker
                            className="customDatePicker"
                            value={startDate}
                            inputProps={{ readOnly: true }}
                            onChange={(newValue) => setStartDate(newValue)}
                            renderInput={(params) => <TextField {...params} />}
                            minDate={new Date()}
                          />
                        </Stack>
                      </LocalizationProvider>
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TimePicker
                        className={"customMPickerNew"}
                        value={timeIn}
                        onChange={(value) => setTimeIn(value)}
                        showSecond={false}
                        use24Hours
                        inputReadOnly
                        disabledHours={disabledHours}
                        disabledMinutes={disabledMinutes}
                        defaultValue={moment()}
                      />
                    </Grid>
                  </>
                ) : (
                  ""
                )}
              </Grid>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "20px 0",
                }}
              >
                <Grid className={classes.btnSection}>
                  <Button className={classes.submitBtn} onClick={handleClose}>
                    Cancel
                  </Button>
                </Grid>
                <Grid className={classes.btnSection}>
                  <Button
                    className={classes.submitActyBtn}
                    onClick={handleAllActivity}
                    disabled={!isMeetType?.value && !shw_loader ? true : false}
                    sx={
                      !isMeetType?.value && !shw_loader
                        ? {
                            backgroundColor: "#DEDEDE",
                            color: "#85888A !important",
                          }
                        : {
                            backgroundColor: "#f45e29",
                            color: "#ffffff !important",
                            border: "1px solid #f45e29",
                          }
                    }
                  >
                    Continue
                  </Button>
                </Grid>
              </div>
            </p>
          </Box>
        </Modal>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "right",
            position: "relative",
            top: "-70px",
          }}
        >
          <div
            className={classes.minimizeContent}
            onClick={() => setContentVisible(!isVisible)}
          >
            View Activity
          </div>
        </Box>
      )}
    </>
  );
};
