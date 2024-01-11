import React, { useState, useEffect } from "react";
import DialCall from "../../assets/icons/DialCall.svg";
import ActivityFormComponent from "../activityForm/ActivityForm";
import { FORMS_LIST } from "../../constants/ActivityForm";
import toast from "react-hot-toast";
import moment from "moment";
import {
  updateBdeActivity,
  getPendingBdeActivity,
  closePendingActivities,
} from "../../config/services/bdeActivities";
import { getAlternateContacts } from "../../config/services/leadassign";
import { getActivityFormNumber } from "../../config/services/activityFormMapping";
import MinimalModal from "../../theme/modal/MinimalModal";
import { useStyles } from "../../css/ProfileData-css";
import { ReactComponent as CallIcon } from "../../assets/icons/callIcon.svg";
import { Box, Typography } from "@mui/material";
import { ReactComponent as PhoneIcon } from "../../assets/icons/phone-dial-icon.svg";
import { activityLogger } from "../../config/services/activities";
import { CALL_DETAILS } from "../../constants/Call";

const Dialer = ({
  leadObj,
  leadProfileData,
  loginUserData,
  leadStageStatus,
  fetchLeadStageStatus,
  queryParams,
  setSearchParams,
  CubeDataset,
}) => {
  const classes = useStyles();
  const [dialerText, setDialerText] = useState(
    "Please wait while we connect your call to…"
  );
  const [activityForm, setActivityForm] = useState(false);
  const [formNumber, setFormNumber] = useState("");
  const [formList, setFormList] = useState([]);
  const [callId, setCallId] = useState("");
  const [activityObj, setActivityObj] = useState({});
  const [bdeObj, setBdeActivityObj] = useState(null);
  const [isLoader, setIsLoader] = useState(false);
  const [startDialModalStatus, setStartDialModalStatus] = useState(false);
  const [dialerFlag, setDialerFlag] = useState(true);
  const [socketWorker, setWorker] = useState(null);
  const [updateActivity, setUpdateActivity] = useState(null);
  const [alternateContacts, setAlternateContacts] = useState([]);
  const [contactPopupFlag, setContactPopupFlag] = useState(false);
  //console.log(queryParams.get('id'))
  const handleCallEvent = (eventData) => {
    //console.log('Call Event',eventData)
    switch (eventData.status) {
      case "Connected":
        setDialerText("Your call is Connected now with ...");
        setTimeout(() => {
          setStartDialModalStatus(false);
          setActivityForm(true);
        }, 1000);
        break;
      case "Agent Missed":
        setDialerText(
          "You need to pick your call, in order to connect with ..."
        );
        setTimeout(() => {
          setStartDialModalStatus(false);
        }, 8000);
        setTimeout(() => {
          fetchLeadStageStatus();
        }, 7000);
        break;
      case "Customer Missed":
        //fetchLeadStageStatus()
        setDialerText("It seems, we are not able to connect with ...");
        setTimeout(() => {
          setStartDialModalStatus(false);
        }, 8000);
        setTimeout(() => {
          fetchLeadStageStatus();
        }, 7000);
        break;
      case "AGENT_CALL":
        setDialerText("Please pick the call, whenever you receive a call ...");
        break;
      case "CUSTOMER_CALL":
        setDialerText(
          "Thanks! for picking your call, Please wait while we forward your call to ..."
        );
        break;
      default:
        //console.log('unhandled', eventData)
        break;
    }
  };

  const initWorker = (worker) => {
    worker.onmessage = ({ data }) => {
      switch (data.type) {
        case "connection":
          console.log("socket worker socket id", data.data);
          break;
        case "callEvent":
          //console.log('Call Event',data.data)
          handleCallEvent(data.data);
          break;
        case "callId":
          //console.log('Call ID',data.data)
          setCallId(data.data);
          break;
        case "callFailed":
          if (data.data.status) {
            setStartDialModalStatus(false);
            //console.log(data)
            toast.error(data.data.error);
          } else {
            setStartDialModalStatus(false);
            console.log(data);
            toast.error(
              "OOPS! Something went wrong, while trying to connect your call"
            );
          }
          break;
        default:
          console.log("socket unhandled", data);
          break;
      }
    };
    worker.onerror = (err) => {
      console.log("Socket error", err);
    };
  };

  const handleFormSubmit = (data, resetValues) => {
    data["callId"] = callId;
    let obj = {
      ...leadObj,
      ...data,
      //status:"Complete",
      callStatus: "Connected",
      //conversationWithName: data.conversationWithName,
      startDate: new Date(),
      createdBy: loginUserData?.userData?.username,
      createdByRoleName: loginUserData?.userData?.crm_role,
      createdByProfileName: loginUserData?.userData?.crm_profile,
      createdByName: loginUserData?.userData?.name,
    };
    obj.knownLanguages = obj.knownLanguages.join(",");
    obj["followUpDateTime"] = obj.followUpDate
      ? moment(obj.followUpDate + ` ${obj.followUpTime ?? "00:00:00"}`)
          .utc()
          .format("YYYY-MM-DDTHH:mm:ssZ")
      : null;
    obj["verifiedDocuments"] = obj.verifiedDocuments
      ? obj.verifiedDocuments.join(", ")
      : "";
    obj["featureList"] = obj.featureList ? obj.featureList.join(", ") : "";
    //console.log(obj)
    if (updateActivity) {
      obj["updateActivity"] = updateActivity;
    }
    if (bdeObj) {
      obj["updateActivity"] = bdeObj._id;
    }
    updateBdeActivity(obj)
      .then((res) => {
        setUpdateActivity(null);
        toast.success("Activity Logged Successfully");
        return fetchLeadStageStatus();
      })
      .then((res) => {
        let date = new Date(moment().format("YYYY-MM-DD") + "T23:59:59Z");
        let obj = {
          status: "Pending",
          //startDateTime:{$lt:date.toISOString()},
          leadId: leadObj.leadId,
        };
        return fetchBdeActivity(obj);
      })
      .then((res) => {
        resetValues();
        setActivityForm(false);
        setCallId("");
      })
      .catch((err) => {
        console.log("Error", err);
        resetValues();
        setActivityForm(false);
        setCallId("");
        setUpdateActivity(null);
        fetchLeadStageStatus();
        let date = new Date(moment().format("YYYY-MM-DD") + "T23:59:59Z");
        let obj = {
          status: "Pending",
          //startDateTime:{$lt:date.toISOString()},
          leadId: leadObj.leadId,
        };
        fetchBdeActivity(obj);
        toast.error(
          "OOPS! Something went wrong, Please try again after sometime"
        );
      });
  };

  const getAlternateContactsList = async (obj) => {
    //console.log(obj)
    return getAlternateContacts({ leadId: leadObj.leadId })
      .then((res) => {
        let list = res.result;
        setAlternateContacts(list);
        let resObj = { ...obj, contactList: list };
        //console.log(resObj)
        return resObj;
        //setContactPopupFlag(true)
      })
      .catch((err) => {
        console.warn(err);
        setAlternateContacts([]);
        let resObj = { ...obj, contactList: [] };
        return resObj;
      });
  };

  const showContactPopup = (
    bdeObj = null,
    leadStage = null,
    contactList = []
  ) => {
    let stageStatus = leadStage ? leadStage : leadStageStatus;
    let skipStageName = `${stageStatus?.stageName?.toUpperCase()} ${stageStatus?.statusName?.toUpperCase()}`;
    if (
      stageStatus &&
      CALL_DETAILS.notAuthorized.skipStageStatus.indexOf(skipStageName) > -1 &&
      CALL_DETAILS.notAuthorized.profileList.indexOf(
        loginUserData?.userData?.crm_profile
      ) > -1
    ) {
      toast.error("You are not Authorized to make this call");
      return false;
    }
    if (
      (alternateContacts && alternateContacts.length > 0) ||
      contactList.length > 0
    ) {
      setContactPopupFlag(true);
    } else {
      if (leadObj.dndStatus && leadObj.dndStatus == "activate") {
        toast.error("Cannot place call, Lead is on DND status");
      } else {
        startCall(bdeObj, leadStage, leadObj.mobile);
      }
    }
  };

  const handleContactNumber = (mobile) => {
    setContactPopupFlag(false);
    if (leadObj.dndStatus && leadObj.dndStatus == "activate") {
      toast.error("Cannot place call, Lead is on DND status");
    } else {
      startCall(bdeObj, leadStageStatus, mobile);
    }
  };

  const startCall = async (bdeObj = null, leadStage = null, mobile = null) => {
    //console.log(leadStage)
    const worker = new Worker(
      new URL("../../socketWorker.js", import.meta.url)
    );
    try {
      setWorker(worker);
      setStartDialModalStatus(true);
      setDialerText("Please wait while we connect your call to…");
      let roleObj = {
        roleName: loginUserData?.userData?.crm_role,
      };
      let stageStatus = leadStage ? leadStage : leadStageStatus;
      let obj = bdeObj?._id
        ? {
            bdeObj,
            leadObj,
            leadStageStatus: stageStatus,
            loginUserData,
            roleObj,
            mobile,
          }
        : {
            leadObj,
            leadStageStatus: stageStatus,
            loginUserData,
            roleObj,
            mobile,
          };
      //console.log(obj)
      let data = loginUserData.userData;
      let activityData = {
        empCode: data.employee_code,
        landing_page: "Lead Detail Page",
        action: "Dial Call",
        event_type: "Dial Call",
        eventStep: "Dial Call",
        click_type: "Dial Call",
        eventData: obj,
      };
      activityLogger(activityData);
      worker.postMessage({ type: "onCall", value: JSON.stringify(obj) });
      initWorker(worker);
    } catch (err) {
      setStartDialModalStatus(false);
      console.log(err);
    }
  };

  const fetchBdeActivity = (reqObj, leadStageStatus = {}, contactList = []) => {
    getPendingBdeActivity(reqObj).then((res) => {
      if (res.result && res.result.length > 0) {
        setDialerFlag(false);
        let resData = res.result[0];
        if (reqObj._id) {
          //setPendingBdeObj()
          if (
            ["HOME DEMO", "VIRTUAL DEMO"].indexOf(
              resData.category.toUpperCase()
            ) > -1
          ) {
            setUpdateActivity(resData._id);
            setActivityForm(true);
          } else {
            setBdeActivityObj(res.result[0]);
            showContactPopup(res.result[0], leadStageStatus, contactList);
            //startCall(res.result[0], leadStageStatus)
          }
        }
      } else {
        setDialerFlag(true);
      }
      //console.log('Pending',res)
    });
  };

  const fetchInitActivity = ({ stageStatus, list, contactList }) => {
    //console.log('Init Activity')
    let reqObj = {
      status: "Init",
      leadId: leadObj.leadId,
      createdByRoleName: loginUserData.userData.crm_role,
    };
    getPendingBdeActivity(reqObj).then((res) => {
      //console.log(res)
      if (res.result && res.result.length > 0) {
        //console.log(list)
        if (list.length > 0) {
          setCallId(res.result[0].callId);
          setActivityForm(true);
        } else {
          toast.error("Form Mapping not found for current stage & status");
        }
      } else {
        let date = new Date(moment().format("YYYY-MM-DD") + "T23:59:59Z");
        let obj = {
          status: "Pending",
        };
        let bdeActivityId = queryParams.get("id");
        queryParams.delete("id");
        setSearchParams(queryParams);
        if (bdeActivityId) {
          obj["_id"] = bdeActivityId;
        } else {
          //obj['startDateTime'] = {$lt:date.toISOString()}
          obj["leadId"] = leadObj.leadId;
        }
        return fetchBdeActivity(obj, stageStatus, contactList);
      }
    });
  };

  const fetchActivityFormList = (leadStageStatus) => {
    //console.log('Lead Stage',leadStageStatus)
    if (leadStageStatus?.stageName) {
      let obj = {
        stageName: leadStageStatus?.stageName?.trim(),
        statusName: leadStageStatus?.statusName?.trim(),
        isDeleted: false,
      };
      return getActivityFormNumber(obj).then((res) => {
        let data = res.result;
        setFormList(data);
        return { stageStatus: leadStageStatus, list: data };
      });
    } else {
      return { stageStatus: leadStageStatus, list: [] };
    }
  };

  const initDialer = async () => {
    fetchActivityFormList(leadStageStatus)
      .then((res) => {
        return getAlternateContactsList(res);
      })
      .then((res) => {
        return fetchInitActivity(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const checkStageStatus = () => {
    setDialerFlag(false);
    let stageStatus = leadStageStatus.stageName
      ? `${leadStageStatus.stageName.trim()} ${leadStageStatus.statusName.trim()}`
      : "";
    //console.log(stageStatus)
    if (CALL_DETAILS.skipStageStatus.indexOf(stageStatus.toUpperCase()) > -1) {
      closePendingActivities({ leadId: leadObj.leadId })
        .then((res) => {
          return initDialer();
        })
        .catch((err) => {
          console.log("Err:- Dialer", err);
          return initDialer();
        });
    } else if (leadStageStatus.stageName) {
      initDialer();
    }
  };

  useEffect(() => {
    checkStageStatus();

    return () => {
      if (socketWorker) {
        socketWorker.terminate();
        setWorker(null);
      }
    };
  }, [leadStageStatus]);

  return (
    <>
      <span
        className={"user-dial-item"}
        onClick={
          dialerFlag && leadStageStatus.stageName && formList.length > 0
            ? showContactPopup
            : () => {}
        }
      >
        <img
          className={`${
            leadStageStatus.stageName &&
            dialerFlag &&
            formList.length > 0 &&
            (leadProfileData?.[CubeDataset.Leadassigns.dndStatus] ===
              "de_activate" ||
              leadProfileData?.[CubeDataset.Leadassigns.dndStatus] === null ||
              leadProfileData?.[CubeDataset.Leadassigns.dndStatus] ===
                undefined)
              ? "addCursorPointer"
              : "disAbleCursor"
          }`}
          styles={{ CursorEvent: "none" }}
          src={DialCall}
          alt="dial"
          title={`${
            leadStageStatus.stageName &&
            dialerFlag &&
            formList.length > 0 &&
            (leadProfileData?.[CubeDataset.Leadassigns.dndStatus] ===
              "de_activate" ||
              leadProfileData?.[CubeDataset.Leadassigns.dndStatus] === null ||
              leadProfileData?.[CubeDataset.Leadassigns.dndStatus] ===
                undefined)
              ? ""
              : "Please refer to upcoming/pending task on Dashboard to place further call"
          }`}
        />
        <label>Dial Call</label>
      </span>
      {startDialModalStatus && (
        <MinimalModal openStatus={startDialModalStatus}>
          <Box className="start-dial-loader-modal">
            <PhoneIcon className="start-dial-loader-icon" />
            <Typography className="start-dial-loader-subtitle" variant="body2">
              {dialerText}
            </Typography>
            <Typography className="start-dial-loader-title" variant="h3">
              {leadObj?.name ?? ""}
            </Typography>
          </Box>
        </MinimalModal>
      )}
      {contactPopupFlag && (
        <MinimalModal openStatus={contactPopupFlag}>
          <div className={classes.popupHeaderTitle}>
            Who do you want to call ?
          </div>
          <div className={classes.mainCallPopupContainer}>
            <Box
              className={classes.callDetailContainer}
              onClick={(e) => handleContactNumber(leadObj.mobile)}
            >
              <CallIcon />
              <div className={classes.userDetailContainer}>
                <div className={classes.userHeaderTitle}>{leadObj.name}</div>
                <div className={classes.userHeaderSubTitle}>
                  {leadObj?.userType ?? ""}
                </div>
              </div>
            </Box>

            {alternateContacts.map((obj) => {
              return (
                <Box
                  className={classes.callDetailContainer}
                  onClick={(e) => handleContactNumber(obj.alternateNumber)}
                >
                  <CallIcon />
                  <div className={classes.userDetailContainer}>
                    <div className={classes.userHeaderTitle}>
                      {obj.alternateName}
                    </div>
                    <div className={classes.userHeaderSubTitle}>
                      {obj?.relation ?? ""}
                    </div>
                  </div>
                </Box>
              );
            })}
          </div>
        </MinimalModal>
      )}
      <ActivityFormComponent
        {...FORMS_LIST[formNumber]}
        open={activityForm}
        setOpen={setActivityForm}
        handleFormSubmit={handleFormSubmit}
        contactList={alternateContacts}
        id={formNumber}
        formList={formList}
        activityObj={activityObj}
        leadProfileData={leadProfileData}
        leadStageStatus={leadStageStatus}
        leadObj={leadObj}
      />
    </>
  );
};
export default Dialer;
