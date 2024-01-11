import React, { useState, useEffect, Fragment } from "react";
import {
  Grid,
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "react-datepicker/dist/react-datepicker.css";
import { makeStyles } from "@mui/styles";
import _ from "lodash";
import { toast } from "react-hot-toast";
import { ActivityFormLoader } from "../../helper/Loader";
import MaxmizeIcon from '../../assets/icons/icon-maximize.svg'
import { getReasonForPaPendingList, getReasonForPaRejectedList, getReasonForObPendingList, getReasonForObRejectedList, getReasonForFbPendingList, getReasonForFbRejectedList, getReasonForAckPendingList, getReasonForAckRejectedList } from "../../config/services/formChangesMasters";


import {
  conversationOptions,
  knownLanguageOptions,
  reasonForDQOptions,
  ACTIVITY_FORM_ORDER,
  userType,
  Verified_Documnets,
  Features_Explained
} from '../../constants/ActivityForm';

import Env_Config from '../../config/settings';
import FullVHRight from '../../theme/modal/FullVHRight';
import InputText from '../../theme/form/InputText';
import InputSelect from '../../theme/form/InputSelect';
import InputTextarea from '../../theme/form/InputTextarea';
import InputDatePicker from '../../theme/form/InputDatePicker';
import InputTimePicker from '../../theme/form/InputTimePicker';
import InputMultiSelect from '../../theme/form/InputMultiSelect';

import { getBoardList, getChildList } from "../../config/services/lead";
import { fetchInterestList, activityFormInterestData, getCallTarget } from "../../helper/DataSetFunction";
import settings from "../../config/settings";
import moment from 'moment'
import CubeDataset from "../../config/interface"
import { checkValidPhone } from "../../utils/utils";

const useStyles = makeStyles((theme) => ({
  containerBox: {
    marginBottom: "10px",
  },
  labelStyle: {
    marginBottom: "10px",
  },
}));

export default function ActivityFormComponent({
  requiredFieldValues,
  handleFormSubmit,
  activityObj,
  leadProfileData,
  open,
  handleModalClose,
  leadStageStatus,
  leadObj,
  formList,
  setOpen,
  contactList,
  ...props
}) {
  const currentDate = moment()
  const [subjectList, setSubjectList] = useState([]);
  const [stageName, setStageName] = useState([]);
  const [statusName, setStatusName] = useState([]);
  const [subjectName, setSubjectName] = useState({});
  const [customerResponse, setCustomerResponse] = useState({});
  const [customerResponseList, setCustomerResponseList] = useState([]);
  const [hideBody, setHideBody] = useState(false);
  const [conversationWith, setConversationWith] = useState({});
  const [knownLanguages, setknownLanguages] = useState([]);
  const [interestList, setInterestList] = useState([{ label: "Select Interest", value: "" }])
  const [interestedIn, setInterest] = useState({ label: "Select Interest", value: "" })
  const [name, setName] = useState('');
  const [followUpFlag, setFollowUpFlag] = useState(true);
  const [followUpValue, setFollowUpValue] = useState('FollowUp');
  const [followUpDate, setFollowUpDate] = useState("");
  const [followUpTime, setFollowUpTime] = useState("");
  const [defaultTime, setDefaultTime] = useState("")
  const [reasonForDQ, setReasonForDQ] = useState({ label: "Select reason for DQ", value: "" })
  const [comments, setComments] = useState('')
  const [school, setSchool] = useState('')
  const [email, setEmail] = useState(leadObj?.email)
  const [boardList, setBoardList] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState({});
  const [classList, setClassList] = useState({});
  const [selectedClass, setSelectedClass] = useState({});
  const [loader, setLoader] = useState(false);
  const [interestDetails, setInterestDetails] = useState({});
  const [reasonForDQFlag, setReasonForDQFlag] = useState(false);
  const [formNumber, setFormNumber] = useState('FORM7');
  const [verifiedDocuments, setVerifiedDocuments] = useState([]);
  const [featureList, setFeatureList] = useState([]);
  const [submitFlag, setDisableSubmit] = useState(false)
  const [isMinimize, setIsMinimize] = useState(false);
  const [alternateNumber,setAlternateNumber] = useState("")
  const [relation,setRelation] = useState(null)
  const [alternateName, setAlternateName] = useState("")
  const [paPendingList, setPaPendingList] = useState([]);
  const [paRejectedList, setPaRejectedList] = useState([]);
  const [obPendingList, setObPendingList] = useState([]);
  const [obRejectedList, setObRejectedList] = useState([]);
  const [fbPendingList, setFbPendingList] = useState([]);
  const [fbRejectedList, setFbRejectedList] = useState([]);
  const [ackPendingList, setAckPendingList] = useState([]);
  const [ackRejectedList, setAckRejectedList] = useState([]);
  const [reasonForPaPending, setReasonForPaPending] = useState({});
  const [reasonForPaRejected, setReasonForPaRejected] = useState({});
  const [reasonForFbPending, setReasonForFbPending] = useState({});
  const [reasonForFbRejected, setReasonForFbRejected] = useState({});
  const [reasonForObPending, setReasonForObPending] = useState({});
  const [reasonForObRejected, setReasonForObRejected] = useState({});
  const [reasonForAckPending, setReasonForAckPending] = useState({});
  const [reasonForAckRejected, setReasonForAckRejected] = useState({});
  const [paPendingFlag, setPaPendingFlag] = useState(false);
  const [paRejectedFlag, setPaRejectedFlag] = useState(false);
  const [fbPendingFlag, setFbPendingFlag] = useState(false);
  const [fbRejectedFlag, setFbRejectedFlag] = useState(false);
  const [obPendingFlag, setObPendingFlag] = useState(false);
  const [obRejectedFlag, setObRejectedFlag] = useState(false);
  const [ackPendingFlag, setAckPendingFlag] = useState(false);
  const [ackRejectedFlag, setAckRejectedFlag] = useState(false);


  const { LEAD_INTEREST } = settings;

  const classes = useStyles();

  const {
    SUBJECT = 0,
    CUSTOMER_RESPONSE,
    CONVERSATION_WITH,
    NAME,
    FOLLOWUP_DATE,
    REASONFOR_DQ,
    VERIFIED_DOCUMENTS = 0,
    FEATURE_EXPLAINED = 0
  } = ACTIVITY_FORM_ORDER[formNumber]

  const handleClose = () => {
    handleModalClose();
  };

  const handleCustomerResponseChange = (e) => {
    setCustomerResponse(e);
    if (e.value === 'Language Issue') {
      setHideBody(true)
    } else {
      setHideBody(false);
    }
    handleFolloupDateAndTimeFlag(e);
  }

  const handleFolloupDateAndTimeFlag = (customerResponse) => {
    if (!_.isEmpty(subjectName)) {
      let response = formList.filter((item) => item.subject === subjectName.value && item.customerResponse === customerResponse.value)[0];
      if (response) {
        setFollowUpFlag(response.type ? true : false);
        setFollowUpValue(response.type);
        setReasonForDQFlag(response.reasonForDQ);
        setPaPendingFlag(response?.reasonForPaPending);
        setPaRejectedFlag(response?.reasonForPaRejected);
        setFbPendingFlag(response?.reasonForFbPending);
        setFbRejectedFlag(response?.reasonForFbRejected);
        setObPendingFlag(response?.reasonForObPending);
        setObRejectedFlag(response?.reasonForObRejected);
        setAckPendingFlag(response?.reasonForAckPending);
        setAckRejectedFlag(response?.reasonForAckRejected);
        setStageName(formList?.[0]?.stageName);
        setStatusName(formList?.[0]?.statusName);
        setFormNumber(response.formId.toUpperCase().replace(' ', ''))
      } else {
        toast.error('No Mapping found for this compbination')
        setFollowUpFlag(false);
        setFollowUpValue('');
        setReasonForDQFlag(true);
        setDisableSubmit(true)
      }
    }
  }

  const handleConversationWith = (conversationObj) => {
    setConversationWith(conversationObj)
    if (conversationObj.value == 'Student') {
      setName(leadObj?.name);
      return
    }
    setName('');
  }

  const handleReasonForPaPending = (e) => {
    setReasonForPaPending(e)
  }

  const handleReasonForPaRejected = (e) => {
    setReasonForPaRejected(e)
  }

  const handleReasonForFbPending = (e) => {
    setReasonForFbPending(e)
  }

  const handleReasonForFbRejected = (e) => {
    setReasonForFbRejected(e)
  }

  const handleReasonForObPending = (e) => {
    setReasonForObPending(e)
  }

  const handleReasonForObRejected = (e) => {
    setReasonForFbRejected(e)
  }

  const handleReasonForAckPending = (e) => {
    setReasonForObPending(e)
  }

  const handleReasonForAckRejected = (e) => {
    setReasonForAckRejected(e)
  }

  const handleRationChange = (relationObj) => {
    setRelation(relationObj)
  }

  const handleBoardChange = (e) => {
    //console.log(e)
    setSelectedBoard(e);
    setSelectedClass({});
    fetchClassList(e)
  }

  const handleInterestChange = (e) => {    
    setInterest(e);
    //console.log(e)
    if (e?.value) {
      setLoader(true)
      activityFormInterestData(leadObj?.leadId, interestedIn.value.trim())
        .then((result) => {
          let res = result.rawData()
          let data = res?.[0];
          if(data){
            setInterestDetails(data);
            setSelectedBoard({ value: data?.[CubeDataset.Leadinterests.board], label: data?.[CubeDataset.Leadinterests.board] });
            setSelectedClass({ value: data?.[CubeDataset.Leadinterests.class], label: data?.[CubeDataset.Leadinterests.class] });
            setSchool(data?.[CubeDataset.Leadinterests.school])
          }          
          setLoader(false);
        })
        .catch((error) => {
          console.error(error);
          setLoader(false);
        })
    }
  }

  const checkInterestDisability = (name) => {

    if (name === 'school') {
      if (interestDetails?.[CubeDataset.Leadinterests.school]) {
        return true;
      }
      return false
    }

    if (name === 'email') {
      if (leadObj?.email) {
        return true
      }
      return false;
    }
  }

  const setIntialValues = () => {
    setConversationWith({});
    setknownLanguages([]);
    setFollowUpDate('');
    setFollowUpTime(null);
    setFollowUpValue('FollowUp');
    setFollowUpFlag(true);
    setHideBody(false);
    setReasonForDQ({});
    setComments('');
    setSelectedClass({});
    setSelectedBoard({});
    setSchool('');
    setEmail('');
    setReasonForPaPending({});
    setReasonForPaRejected({});
    setReasonForFbPending({});
    setReasonForFbRejected({});
    setReasonForObPending({});
    setReasonForObRejected({});
    setReasonForAckPending({});
    setReasonForAckRejected({});
  }

  const getFollupDateAndTime = () => {
    let hours = new Date(followUpTime).getHours()
    let mins = new Date(followUpTime).getMinutes()
    let followUpDate_Time = new Date(new Date(new Date(followUpDate).setHours(hours)).setMinutes(mins))
    return followUpDate_Time
  }


  const handleSubmit = (setSubmitting) => {
    let form = formList.find(obj => obj.customerResponse == customerResponse?.value && obj.subject == subjectName.value);
    let formFields = {
      subject: subjectName.value,
      customerResponse: customerResponse?.value ?? "",
      conversationWith: conversationWith?.value ?? "",
      conversationWithName:name,
      verifiedDocuments: verifiedDocuments.length > 0 ? verifiedDocuments.map(obj => obj.value):[],
      featureList:featureList.length > 0 ? featureList.map(obj => obj.value):[],
      followUpDate: followUpDate ? moment(followUpDate).format('YYYY-MM-DD'):"",
      followUpTime,
      reasonForDQ: reasonForDQ?.value ?? "",
      interestedIn: interestedIn?.value ?? "",
      comments,
      selectedBoard: selectedBoard?.value ?? "",
      board: selectedBoard?.label ?? "",
      class: selectedClass?.label ?? "",
      selectedClass: selectedClass?.value ?? "",
      school: school ?? "",
      knownLanguages,
      activityId: form?.activityId ?? "",
      futureActivityId: form?.futureActivityId ?? "",
      alternateNumber: alternateNumber,
      relation:relation?.value ?? "",
      alternateName: alternateName,
      reasonForPaPending: reasonForPaPending?.value ?? "",
      reasonForPaRejected: reasonForPaRejected?.value ?? "",
      reasonForFbPending: reasonForFbPending?.value ?? "",
      reasonForFbRejected: reasonForFbRejected?.value ?? "",
      reasonForObPending: reasonForObPending?.value ?? "",
      reasonForObRejected: reasonForObRejected?.value ?? "",
      reasonForAckPending: reasonForAckPending?.value ?? "",
      reasonForAckRejected: reasonForAckRejected?.value ?? "",
    }

    if (formValidations(formFields)) {
      handleFormSubmit(formFields, setIntialValues)
    } else {
      setSubmitting(false)
    }
  }

  const formValidations = (formFields) => {
    //console.log('follow Up',formFields,FOLLOWUP_DATE)
    const {
      customerResponse,
      conversationWith,
      conversationWithName,
      verifiedDocuments,
      reasonForPaPending,
      reasonForPaRejected,
      reasonForFbPending,
      reasonForFbRejected,
      reasonForObPending,
      reasonForObRejected,
      reasonForAckPending,
      reasonForAckRejected,
      featureList,
      followUpDate,
      followUpTime,
      reasonForDQ,
      comments,
      interestedIn,
      knownLanguages,
      selectedBoard,
      selectedClass,
      school
    } = formFields;

    if (!customerResponse && CUSTOMER_RESPONSE === 1) {
      toast.error('Fill Customer Response Fields!')
      return false
    }
    if(!reasonForPaPending && (paPendingFlag && CUSTOMER_RESPONSE === 1 ) ){
      toast.error('Please Select Reason for Pa Pending')
      return false
    }
    if (!reasonForPaRejected && (paRejectedFlag && CUSTOMER_RESPONSE === 1 )){
      toast.error('Please Select Reason for Pa Rejected')
      return false
    }
    if (!reasonForObPending && (obPendingFlag && CUSTOMER_RESPONSE === 1 )){
      toast.error('Please Select Reason for Ob Pending')
      return false
    }
    if (!reasonForObRejected && (obRejectedFlag && CUSTOMER_RESPONSE === 1 )){
      toast.error('Please Select Reason for Ob Rejected')
      return false
    }
    if (!reasonForFbPending && (fbPendingFlag && CUSTOMER_RESPONSE === 1 )){
      toast.error('Please Select Reason for Fd Pending')
      return false
    }
    if (!reasonForFbRejected && (fbRejectedFlag && CUSTOMER_RESPONSE === 1 )){
      toast.error('Please Select Reason for Fd Rejected')
      return false
    }
    if (!reasonForAckPending && (ackPendingFlag && CUSTOMER_RESPONSE === 1 )){
      toast.error('Please Select Reason for Acknowledgement Pending')
      return false
    }
    if (!reasonForAckRejected && (ackRejectedFlag && CUSTOMER_RESPONSE === 1 )){
      toast.error('Please Select Reason for Acknowledgement Rejected')
    }

    if (!hideBody) {
      if (!conversationWith) {
        toast.error('Fill Conversations With fields!')
        return false
      }

      if (!conversationWithName) {
        toast.error('Fill name  fields!')
        return false
      }

      if (!customerResponse && CUSTOMER_RESPONSE === 3) {
        toast.error('Fill Customer Response Fields!')
        return false
      }

      if(!reasonForPaPending && (paPendingFlag && CUSTOMER_RESPONSE === 3 ) ){
        toast.error('Please Select Reason for Pa Pending')
        return false
      }
      if (!reasonForPaRejected && (paRejectedFlag && CUSTOMER_RESPONSE === 3 )){
        toast.error('Please Select Reason for Pa Rejected')
        return false
      }
      if (!reasonForObPending && (obPendingFlag && CUSTOMER_RESPONSE === 3 )){
        toast.error('Please Select Reason for Ob Pending')
        return false
      }
      if (!reasonForObRejected && (obRejectedFlag && CUSTOMER_RESPONSE === 3 )){
        toast.error('Please Select Reason for Ob Rejected')
        return false
      }
      if (!reasonForFbPending && (fbPendingFlag && CUSTOMER_RESPONSE === 3 )){
        toast.error('Please Select Reason for Fd Pending')
        return false
      }
      if (!reasonForFbRejected && (fbRejectedFlag && CUSTOMER_RESPONSE === 3 )){
        toast.error('Please Select Reason for Fd Rejected')
        return false
      }
      if (!reasonForAckPending && (ackPendingFlag && CUSTOMER_RESPONSE === 3 )){
        toast.error('Please Select Reason for Acknowledgement Pending')
        return false
      }
      if (!reasonForAckRejected && (ackRejectedFlag && CUSTOMER_RESPONSE === 3 )){
        toast.error('Please Select Reason for Acknowledgement Rejected')
        return false
      }

      if (verifiedDocuments?.length === 0 && VERIFIED_DOCUMENTS === 4 ) {
        toast.error('Fill Verified Documents Fields!')
        return false
      }

      if (featureList?.length === 0 && (['PENDING','REJECTED'].indexOf(customerResponse?.toString().toUpperCase()) < 0) && FEATURE_EXPLAINED === 4) {
        toast.error('Fill Feature Explained Fields!')
        return false
      }

      if (!followUpDate && FOLLOWUP_DATE === 4 && followUpFlag) {
        toast.error(`Fill ${followUpValue} Date  fields!`)
        return false
      }

      if (!followUpTime && FOLLOWUP_DATE === 4 && followUpFlag) {
        toast.error(`Fill ${followUpValue} Time  fields!`)
        return false
      }

      if (reasonForDQFlag) {
        if (!reasonForDQ && REASONFOR_DQ === 4) {
          toast.error('Fill Reason For DQ fields!')
          return false;
        }
      }

      if (reasonForDQFlag) {
        if (!reasonForDQ && REASONFOR_DQ === 5) {
          toast.error('Fill Reason For DQ fields!')
          return false;
        }
      }

      if (!followUpDate && FOLLOWUP_DATE === 5 && followUpFlag) {
        toast.error(`Fill ${followUpValue} Date  fields!`)
        return false
      }

      if (!followUpTime && FOLLOWUP_DATE === 5 && followUpFlag) {
        toast.error(`Fill ${followUpValue} Time fields!`)
        return false
      }

      if (followUpDate && followUpTime) {
        let date = moment(followUpDate + ` ${followUpTime ?? "00:00:00"}`)
        if (date < moment().minute(moment().hour() + 1)) {
          toast.error(`Date & Time cannot be less than 1 hour difference from now!`)
          return false
        }
      }

      /* if (!reasonForDQFlag && !interestedIn) {
            toast.error('Fill InterestIn fields!')
            return false
      } */

      if (!comments) {
        toast.error('Fill comments fields!')
        return false
      }



      if (!reasonForDQFlag && interestedIn && !selectedBoard) {
        toast.error('Fill Board fields!')
        return false
      }

      if(alternateNumber && !checkValidPhone(alternateNumber)){
        toast.error('Please enter valid alternate number')
        return false
      }

      if(alternateNumber && !relation){
        toast.error('Fill Relation field!')
        return false
      }

      if(relation && !alternateNumber){
        console.log(relation,alternateNumber)
        toast.error('Fill alternate number first!')
        return false
      }

      if(relation && !alternateName){
        toast.error('Fill alternate contact\'s Name first!')
        return false
      }

      if (!reasonForDQFlag && interestedIn && !selectedClass) {
        toast.error('Fill class fields!')
        return false
      }

      if (!reasonForDQFlag && interestedIn && !school) {
        toast.error('Fill school fields!')
        return false
      }
    } else {
      if (knownLanguages.length === 0) {
        toast.error('Fill Known Language fields!')
        return false
      }
    }

    return true
  }

  const getInterestList = () => {
    return fetchInterestList()
  }

  const getInterestListData = () => {
    getInterestList()
      .then((res) => {
        let resData = res.tablePivot();
        if (resData) {
          let interestList = resData.map(obj => { return { label: obj[CubeDataset.LearningProfileMaster.profileName].trim(), userType: obj[CubeDataset.LearningProfileMaster.userTypeId], value: obj[CubeDataset.LearningProfileMaster.profileName].trim() } })
          let userTypeId = userType.find(obj => obj.label.toUpperCase() == leadObj.userType.toUpperCase())
          interestList = interestList?.filter(obj => obj.userType == userTypeId.value)
          interestList = [{ label: "Select Interest", value: "" }, ...interestList]
          setInterestList(interestList)
        }
      })
  }

  const fetchBoardList = async () => {
    let params = { params: { boardStage: 1, sapVisibility: 1 } };
    getBoardList(params)
      .then((res) => {
        let boardFormattedData = res?.data?.data.map(
          obj => {
            return {
              label: obj.name,
              value: obj.board_id
            }
          }
        );
        setBoardList(boardFormattedData);
      })
      .catch((err) => {
        if(err.response.status == 401){
          fetchBoardList()
        }
        setBoardList([])
        console.log(err, "..error");
      });
  };

  const fetchClassList = (board) => {
    let params = { params: { boardId: board.value, syllabusId: board.value } }
    getChildList(params)
      .then((res) => {
        let classFormattedData = res?.data?.data?.child_list.map(obj => {
          return {
            label: obj.name,
            value: obj.syllabus_id
          }
        })
        setClassList(classFormattedData);
      })
      .catch((err) => {
        if(err.response.status == 401){
          fetchClassList(board)
        }
        setClassList([])
        console.log(err, "..error");
      });
  };

  const fetchReasonForPaPendingList = () => {
		getReasonForPaPendingList()
			.then((res) => {

				if (res?.reasonList) {
					let list = res?.reasonList?.map(obj => {
						obj.label = obj?.reasonForPaPending
						obj.value = obj?.reasonForPaPending
						return obj
					})
					setPaPendingList(list)
				}
			})
			.catch(err => console.error(err))
	}

  const fetchReasonForPaRejectedList = () => {
		getReasonForPaRejectedList()
			.then((res) => {

				if (res?.reasonList) {
					let list = res?.reasonList?.map(obj => {
						obj.label = obj?.reasonForPaRejected
						obj.value = obj?.reasonForPaRejected
						return obj
					})
					setPaRejectedList(list)
				}
			})
			.catch(err => console.error(err))
	}

  const fetchReasonForObPendingList = () => {
		getReasonForObPendingList()
			.then((res) => {

				if (res?.reasonList) {
					res?.reasonList?.map(obj => {
						obj.label = obj?.reasonForObPending
						obj.value = obj?.reasonForObPending
						return obj
					})
					setObPendingList(res?.reasonList)
				}
			})
			.catch(err => console.error(err))
	}

  const fetchReasonForObRejectedList = () => {
		getReasonForObRejectedList()
			.then((res) => {

				if (res?.reasonList) {
					res?.reasonList?.map(obj => {
						obj.label = obj?.reasonForObRejected
						obj.value = obj?.reasonForObRejected
						return obj
					})
					setObRejectedList(res?.reasonList)
				}
			})
			.catch(err => console.error(err))
	}

  const fetchReasonForFbPendingList = () => {
		getReasonForFbPendingList()
			.then((res) => {

				if (res?.reasonList) {
					res?.reasonList?.map(obj => {
						obj.label = obj?.reasonForFbPending
						obj.value = obj?.reasonForFbPending
						return obj
					})
					setFbPendingList(res?.reasonList)
				}
			})
			.catch(err => console.error(err))
	}

  const fetchReasonForFbRejectedList = () => {
		getReasonForFbRejectedList()
			.then((res) => {

				if (res?.reasonList) {
					res?.reasonList?.map(obj => {
						obj.label = obj?.reasonForFbRejected
						obj.value = obj?.reasonForFbRejected
						return obj
					})
					setFbRejectedList(res?.reasonList)
				}
			})
			.catch(err => console.error(err))
	}

  const fetchReasonForAckPendingList = () => {
		getReasonForAckPendingList()
			.then((res) => {

				if (res?.reasonList) {
					res?.reasonList?.map(obj => {
						obj.label = obj?.reasonForAckPending
						obj.value = obj?.reasonForAckPending
						return obj
					})
					setAckPendingList(res?.reasonList)
				}
			})
			.catch(err => console.error(err))
	}

  const fetchReasonForAckRejectedList = () => {
		getReasonForAckRejectedList()
			.then((res) => {

				if (res?.reasonList) {
					res?.reasonList?.map(obj => {
						obj.label = obj?.reasonForAckRejected
						obj.value = obj?.reasonForAckRejected
						return obj
					})
					setAckRejectedList(res?.reasonList)
				}
			})
			.catch(err => console.error(err))
	}

  useEffect(() => {
    if (formList.length > 0) {
      
      { formList?.[0]?.subjectPreFilled && setSubjectName({ value: formList?.[0]?.subject, label: formList?.[0]?.subject }) }
      let customerResponseList = [...new Set(formList.map(cus => { return cus.customerResponse }))].map(cus => { return { label: cus, value: cus } });
      customerResponseList = customerResponseList.filter(obj => obj.value != 'Not Connected')
      setCustomerResponseList(customerResponseList);
      let subjectList = [...new Set(formList.map(obj => { return obj.subject }))].map(sub => { return { label: sub, value: sub } });
      setSubjectList(subjectList);
      //setStatusName(formList?.[0]?.statusName)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         )
    }
  }, [formList])

  useEffect(() => {
    getInterestListData();
    fetchBoardList();
    fetchReasonForPaPendingList();
    fetchReasonForPaRejectedList();
    fetchReasonForObPendingList();
    fetchReasonForObRejectedList();
    fetchReasonForFbPendingList();
    fetchReasonForFbRejectedList();
    fetchReasonForAckPendingList();
    fetchReasonForAckRejectedList();
  }, []);

  const handleMinimize = () => {
    setOpen(false)
    setIsMinimize(true)

  }

  const handleMaximize = () => {
    setIsMinimize(false)
    setOpen(true)

  }

  return (
    <>
      <FullVHRight
        openStatus={open}
        headerTitle=""
        submitFlag={submitFlag}
        handleSubmit={handleSubmit}
        handleModalClose={handleClose}
        disableHeader={true}
        minimizeModal={true}
        handleMinimize={handleMinimize}
      >

        {loader && <ActivityFormLoader />}
        {formList?.[0]?.subjectPreFilled ?
          <InputText
            labelName={'Subject'}
            handleChange={() => { }}
            value={formList?.[0]?.subject}
            disabled={true}
          />
          :
          <InputSelect
            labelName={'Subject'}
            options={subjectList}
            handleChange={setSubjectName}
            value={subjectName}
          />
        }


        {/* For 2nd Field starts*/}
        {CUSTOMER_RESPONSE === 1 && <InputSelect
          labelName={"Customer's Response"}
          options={customerResponseList}
          handleChange={handleCustomerResponseChange}
          value={customerResponse}
        />}
        {
          CONVERSATION_WITH === 1 && <InputSelect
            labelName={'Conversation With'}
            options={conversationOptions}
            handleChange={handleConversationWith}
            value={conversationWith}
          />
        }
        {          
          (CUSTOMER_RESPONSE === 1 && paPendingFlag  ) ?
          <InputSelect
            labelName={'Reason For PA Pending'}
            options={paPendingList}
            handleChange={handleReasonForPaPending}
            value={reasonForPaPending}/> : ""
        }
        {          
          (CUSTOMER_RESPONSE === 1 && paRejectedFlag ) ?
          <InputSelect
            labelName={'Reason For PA Rejected'}
            options={paRejectedList}
            handleChange={handleReasonForPaRejected}
            value={reasonForPaRejected}/> : ""
        }
        {          
          (CUSTOMER_RESPONSE === 1 && fbPendingFlag  ) ?
          <InputSelect
            labelName={'Reason For FD Pending'}
            options={fbPendingList}
            handleChange={handleReasonForFbPending}
            value={reasonForFbPending}/> : ""
        }
        {          
          (CUSTOMER_RESPONSE === 1 && fbRejectedFlag  ) ?
          <InputSelect
            labelName={'Reason For FD Rejected'}
            options={fbRejectedList}
            handleChange={handleReasonForFbRejected}
            value={reasonForFbRejected}/> : ""
        }
        {          
          (CUSTOMER_RESPONSE === 1 && obPendingFlag ) ?
          <InputSelect
            labelName={'Reason For OB Pending'}
            options={obPendingList}
            handleChange={handleReasonForObPending}
            value={reasonForObPending}/> : ""
        }
        {          
          (CUSTOMER_RESPONSE === 1 && obRejectedFlag  ) ?
          <InputSelect
            labelName={'Reason For OB Rejected'}
            options={obRejectedList}
            handleChange={handleReasonForObRejected}
            value={reasonForObRejected}/> : ""
        }
        {          
          (CUSTOMER_RESPONSE === 1 && ackPendingFlag ) ?
          <InputSelect
            labelName={'Reason For Acknowledgement Pending'}
            options={ackPendingList}
            handleChange={handleReasonForAckPending}
            value={reasonForAckPending}/> : ""
        }
        {          
          (CUSTOMER_RESPONSE === 1 && ackRejectedFlag ) ?
          <InputSelect
            labelName={'Reason For Acknowledgement Rejected'}
            options={ackRejectedList}
            handleChange={handleReasonForAckRejected}
            value={reasonForAckRejected}/> : ""
        }
        {/* For 2nd Field ends*/}

        {!hideBody ? <Fragment>

          {/* For 3rd Field starts*/}

          {
            CONVERSATION_WITH === 2 && <InputSelect
              labelName={'Conversation With'}
              options={conversationOptions}
              handleChange={handleConversationWith}
              value={conversationWith}
            />
          }
          {
            NAME === 2 && <InputText
              labelName={'Name'}
              handleChange={(e) => setName(e.target.value)}
              value={name}
            />
          }

          {/* For 3rd Field ends*/}

          {/* For 4th Field starts*/}
          {
            NAME === 3 && <InputText
              labelName={'Name'}
              handleChange={(e) => setName(e.target.value)}
              value={name}
            />
          }          

          {
            CUSTOMER_RESPONSE === 3 && <InputSelect
              labelName={"Customer's Response"}
              options={customerResponseList}
              handleChange={handleCustomerResponseChange}
              value={customerResponse}
            />
          }
          {
          
          (CUSTOMER_RESPONSE === 3 && paPendingFlag  ) ?
          <InputSelect
            labelName={'Reason For PA Pending'}
            options={paPendingList}
            handleChange={handleReasonForPaPending}
            value={reasonForPaPending}/> : ""
        }
        {
          
          (CUSTOMER_RESPONSE === 3 && paRejectedFlag  ) ?
          <InputSelect
            labelName={'Reason For PA Rejected'}
            options={paRejectedList}
            handleChange={handleReasonForPaRejected}
            value={reasonForPaRejected}/> : ""
        }
        {          
          (CUSTOMER_RESPONSE === 3 && fbPendingFlag  ) ?
          <InputSelect
            labelName={'Reason For FD Pending'}
            options={fbPendingList}
            handleChange={handleReasonForFbPending}
            value={reasonForFbPending}/> : ""
        }
        {          
          (CUSTOMER_RESPONSE === 3 && fbRejectedFlag  ) ?
          <InputSelect
            labelName={'Reason For FD Rejected'}
            options={fbRejectedList}
            handleChange={handleReasonForFbRejected}
            value={reasonForFbRejected}/> : ""
        }
    
        {          
          (CUSTOMER_RESPONSE === 3 && obPendingFlag ) ?
          <InputSelect
            labelName={'Reason For OB Pending'}
            options={obPendingList}
            handleChange={handleReasonForObPending}
            value={reasonForObPending}/> : ""
        }
        {          
          (CUSTOMER_RESPONSE === 3 && obRejectedFlag  ) ?
          <InputSelect
            labelName={'Reason For OB Rejected'}
            options={obRejectedList}
            handleChange={handleReasonForObRejected}
            value={reasonForObRejected}/> : ""
        }
        {          
          (CUSTOMER_RESPONSE === 3 && ackPendingFlag  ) ?
          <InputSelect
            labelName={'Reason For Acknowledgement Pending'}
            options={ackPendingList}
            handleChange={handleReasonForAckPending}
            value={reasonForAckPending}/> : ""
        }
        {          
          (CUSTOMER_RESPONSE === 3 && ackRejectedFlag  ) ?
          <InputSelect
            labelName={'Reason For Acknowledgement Rejected'}
            options={ackRejectedList}
            handleChange={handleReasonForAckRejected}
            value={reasonForAckRejected}/> : ""
        }
          {
            VERIFIED_DOCUMENTS === 4 && <InputMultiSelect
              labelName={'Verified Documnents'}
              options={Verified_Documnets}
              handleChange={setVerifiedDocuments}
              value={verifiedDocuments}
            />
          }
          {
            FEATURE_EXPLAINED === 4 && <InputMultiSelect
              labelName={'Features Explained'}
              options={Features_Explained}
              handleChange={setFeatureList}
              value={featureList}
            />
          }
          {/* For 4th Field ends*/}

          {/* For 5th Field starts*/}

          {
            FOLLOWUP_DATE === 4 &&
            (followUpFlag && <Box className={classes.containerBox}>
              <Typography variant="body2" className="form-input-label">{followUpValue} date / time</Typography>
              <Grid container spacing={2}>
                <Grid item md={6}>
                  <Box className="formactivitydatepicker">
                    <InputDatePicker
                      handleChange={date => setFollowUpDate(date)}
                      value={followUpDate}
                      disableLabel={true}
                    />
                  </Box>
                </Grid>
                <Grid item md={6}>
                  <InputTimePicker
                    handleChange={(value) => setFollowUpTime(value)}
                    timeVal={defaultTime}
                    disableLabel={true}
                  />
                </Grid>
              </Grid>
            </Box>)
          }
          {
            (REASONFOR_DQ === 4 && reasonForDQFlag) && <InputSelect
              labelName={"Reason For DQ"}
              options={reasonForDQOptions}
              handleChange={setReasonForDQ}
              value={reasonForDQ}
            />
          }

          {/* For 5th Field ends*/}


          {/* For 6th Field starts*/}

          {
            (REASONFOR_DQ === 5 && reasonForDQFlag) && <InputSelect
              labelName={"Reason For DQ"}
              options={reasonForDQOptions}
              handleChange={setReasonForDQ}
              value={reasonForDQ}
            />
          }

          {
            FOLLOWUP_DATE === 5 &&
            (followUpFlag && <Box className={classes.containerBox}>
              <Typography variant="body2" className="form-input-label">{followUpValue} date / time</Typography>
              <Grid container spacing={2}>
                <Grid item md={6}>
                  <Box className="formactivitydatepicker">
                    <InputDatePicker
                      handleChange={date => setFollowUpDate(date)}
                      value={followUpDate}
                      disableLabel={true}
                    />
                  </Box>
                </Grid>
                <Grid item md={6}>
                  <InputTimePicker
                    handleChange={(value) => setFollowUpTime(value)}
                    timeVal={defaultTime}
                    disableLabel={true}
                  />
                </Grid>
              </Grid>
            </Box>)
          }

          {(!reasonForDQFlag) && ['FORM5', 'FORM6', 'FORM7', 'FORM8', 'FORM9'].indexOf(formNumber) < 0 && <InputSelect
            labelName={'Interested In'}
            options={interestList}
            handleChange={handleInterestChange}
            value={interestedIn}
          />}
          <InputTextarea
            rows={3}
            labelName={'Comments'}
            handleChange={e => setComments(e.target.value)}
            value={comments}
          />
          {(!reasonForDQFlag) && <Accordion className="modal-accordian">
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              sx={{
                border: "1px solid lightgrey",
                borderRadius: "10px",
                backgroundColor: "#e2ebfe",
              }}
            >
              <Typography variant="body2" className="modal-accordian-label">More Details</Typography>
            </AccordionSummary>
            <AccordionDetails>
              { (!contactList || (contactList && contactList.length < 3)) && (
                <>
                  <InputSelect
                    labelName={'Relation'}
                    options={conversationOptions.filter(obj => obj.value != 'Student')}
                    handleChange={handleRationChange}
                    value={relation}
                  />
                  <InputText
                  labelName={'Name'}
                  handleChange={(e) => setAlternateName(e.target.value)}
                  value={alternateName}
                  />
                  <InputText
                  labelName={'Alternate Number'}
                  handleChange={(e) => setAlternateNumber(e.target.value)}
                  value={alternateNumber}
                  />
                </>
              )
          }

          {['FORM5', 'FORM6', 'FORM7', 'FORM8', 'FORM9'].indexOf(formNumber) < 0 && 
            <>
              {
                interestDetails?.[CubeDataset.Leadinterests.board] ?
                  <InputText
                    labelName={'Board'}
                    handleChange={e => setSchool(e.target.value)}
                    value={interestDetails?.[CubeDataset.Leadinterests.board]}
                    disabled={true}
                  />
                  :
                  <InputSelect
                    labelName={'Board'}
                    options={boardList}
                    handleChange={handleBoardChange}
                    value={selectedBoard}
                  />
              }
              {
                interestDetails?.[CubeDataset.Leadinterests.class] ?
                  <InputText
                    labelName={'Class'}
                    handleChange={e => setSchool(e.target.value)}
                    value={interestDetails?.[CubeDataset.Leadinterests.class]}
                    disabled={true}
                  />
                  :
                  <InputSelect
                    labelName={'Class'}
                    options={classList}
                    handleChange={setSelectedClass}
                    value={selectedClass}
                  />
              }
              <InputText
                labelName={'School'}
                handleChange={e => setSchool(e.target.value)}
                value={school}
                disabled={checkInterestDisability('school')}
              />
            </>
          }
              
            </AccordionDetails>
          </Accordion>}
        </Fragment>
          :
          <InputMultiSelect
            labelName={'Known Language'}
            options={knownLanguageOptions}
            handleChange={setknownLanguages}
            value={knownLanguages}
          />
        }
      </FullVHRight>
      {isMinimize ?
        <div className="minimizeCustomModal">
          <h4 style={{ color: 'white' }}>{formList.length > 0 && formList[0]?.subject ? formList[0].subject : 'First Call'}</h4>
          <img onClick={handleMaximize} style={{ height: 20, width: 20, cursor:'pointer' }} src={MaxmizeIcon} />
        </div> : null
      }
    </>
  );
}
