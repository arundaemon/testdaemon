import {
  Box,
  Button,
  Grid,
  Modal,
  Radio,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import moment from "moment";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import IconFire from "../../assets/icons/Icon-fire.svg";
import BredArrow from "../../assets/image/bredArrow.svg";
import { style, useStyles } from "../../css/SchoolDetail-css";
import { DecryptData, EncryptData } from "../../utils/encryptDecrypt";
import { getLoggedInRole } from "../../utils/utils";
import Page from "../Page";

import {
  getLeadInterestId,
  getProductInterest,
} from "../../config/services/Product/getProductData";
import { getAllChildRoles } from "../../config/services/hrmServices";
import { getMenusList } from "../../config/services/menus";
import { getAllProductList } from "../../config/services/packageBundle";
import { getPOListBySchoolCode } from "../../config/services/purchaseOrder";
import { getBdeActivity, updateSchool } from "../../config/services/school";
import { getSchoolDetail } from "../../config/services/schoolRegister";
import { getUserData } from "../../helper/randomFunction/localStorage";
import { MeetingLog } from "../SchoolActivityForm/MeetingLog";
import { PurchaseOrderModal } from "../purchaseOrder/PurchaseOrderModal";
import LeadSchoolTabs from "./ListSchoolTabs";
import PODialogueBox from "./PODialogueBox";
import ProductListModal from "./ProductListModal";
import SchoolDetailAccordian from "./SchoolDetailAccordian";
import SchoolDetailsTabs from "./SchoolDetailTabs";
import { ReactComponent as IconCancel } from '../../assets/icons/icon_close.svg';
import { ReactComponent as IconSchoolProfile } from '../../assets/icons/icon-school-card.svg';
import useMediaQuery from "@mui/material/useMediaQuery";
import { ReactComponent as IconNavLeft } from "./../../assets/icons/icon-nav-left-arrow.svg";
import { ReactComponent as IconLogMeeting } from "./../../assets/icons/icon-school-details-log-meeting.svg";
import { ReactComponent as IconFreeTrail } from "./../../assets/icons/icon-school-details-free-trail.svg";
import { ReactComponent as IconSentEmail } from "./../../assets/icons/icon-school-details-sent-email.svg";

const SchoolProfile = (props) => {
  let { leadProfileData, address, schoolId, leadStatus, data } = props;
  const [recentActivityDetails, setRecentActivityDetails] = useState({});
  const navigate = useNavigate();
  const userRole = getLoggedInRole();
  const [roleNameList, setRoleName] = useState([]);
  const classes = useStyles();
  let step1 = ["Created", "Verified", "Registered"];
  let step2 = ["Fresh", "Qualified", "Demo", "EM Connect"];
  const [isProfile, setProfile] = useState(null);
  const [rolesList, setRoleslist] = useState([]);
  const [isMeeting, setMeetingStatus] = useState(false);
  const [leadStageStatus, setStageStatus] = useState({});
  const [newVerifyDate, setNewVerifyDate] = useState("");
  const [lastActivity, setLastActivity] = useState("");
  const [leadObj, setLeadObj] = useState(null);
  const [editAddressModal, setEditAddressModal] = useState(false);
  const [updatedAddress, setUpdatedAddress] = useState();
  const [menuItem, setMenuItem] = useState(null);
  const [quotationPathURL, setQuotationURL] = useState(null);
  const { interest_id } = useParams();
  const [interestData, setInterestData] = useState(null);
  const [modal1, setModal1] = useState(false);
  const [modal2, setModal2] = useState(false);
  const [isQuote, setQuoteStatus] = useState(false);
  const [isQuoteType, setQuoteType] = useState("ACTUAL");
  const [interestType, setInterestType] = useState("");
  const [quoteData, setQuoteData] = useState(null);
  const [gstNumber, setGSTNumber] = useState("");
  const [tanNumber, setTANNumber] = useState("");
  const [index, setIndex] = useState();

  const [quotationList, setQuotationList] = useState(null);

  const loginData = getUserData("loginData");
  const uuid = loginData?.uuid;
  const [interestOption, setOptions] = useState(null);
  const [selectInterest, setSelectInterest] = useState([]);
  const [interestId, setInterestId] = useState([]);
  const [schoolInterest, setSchoolInterest] = useState([]);
  const [groupInterestKey, setGroupInterestKey] = useState([]);
  const [productList, setProductList] = useState([]);
  const [formData, setFormData] = useState([]);
  const [ownerInterest, setOwnerInterest] = useState([]);
  const [checkedRows, setCheckedRows] = useState([]);
  const [isFormSubmit, setFormSubmit] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const userData = getUserData("userData")?.crm_role;

  let step1Date = ["1"];
  const [selectedProductValue, setSelectedProductValue] = React.useState(null);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

  const handleModalProductChange = (e, index) => {
    setSelectedProductValue(e.target.value);
    setIndex(index);
  };

  const location = useLocation()
  const handleProductSubmit = () => {
    //setQuoteStatus(!isQuote);

    if (selectedProductValue) {
      setQuoteStatus(false);
      setModal2(!modal2);
    }
  };

  const handleClose = () => {
    setQuoteStatus(false);
  };

  const fetchLead = async (school_id) => {
    let params = { school_id };
    try {
      let res = await getSchoolDetail(params);
      if (res?.result) {
        setLeadObj(res?.result?.[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getMenuData = async () => {
    try {
      let res = await getMenusList();
      if (res) {
        setMenuItem(res?.result);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getBdActivityInterest = (data) => {
    if (data) {
      let Data = {
        lead_id: interest_id, //Mandatory
        school_code: leadObj?.schoolCode, // Mandatory
        billing_cycle: data?.paymentSchedule ? data?.paymentSchedule : "",
        sw_contract_months: data?.contactDurationInMonths
          ? data?.contactDurationInMonths
          : "",
        product_type: data?.productType ? data?.productType : "",
        cost_per_student_per_months: data?.ratePerStudent
          ? data?.ratePerStudent
          : "",
        total_package: data?.escUnit ? data?.escUnit : "",
        total_student: data?.studentUnit ? data?.studentUnit : "",
        total_teacher: data?.teacherUnits ? data?.teacherUnits : "",
        total_rc: 1,
      };
      setInterestData(Data);
    } else {
      let Data = {
        lead_id: interest_id, //Mandatory
        school_code: leadObj?.schoolCode, // Mandatory
        billing_cycle: "",
        sw_contract_months: "",
        product_type: "",
        cost_per_student_per_months: "",
        total_package: "",
        total_student: "",
        total_teacher: "",
        total_rc: "",
      };
      setInterestData(Data);
    }
  };

  const menuItemCheck = () => {
    let userName = JSON.parse(localStorage.getItem("userData"))?.username;
    let access_token = JSON.parse(
      localStorage.getItem("loginData")
    )?.access_token;

    const itemList = menuItem?.find((obj) => obj?.name === "Sales ERP");

    const navigateRoute = `username/${userName}/redirectpage/quotation/token/${access_token}/lead_id/${interestData?.lead_id}/school_code/${interestData?.school_code}/billing_cycle/${interestData?.billing_cycle}/sw_contract_months/${interestData?.sw_contract_months}/product_type/${interestData?.product_type}/cost_per_student_per_months${interestData?.cost_per_student_per_months}/total_package${interestData?.total_package}/total_student/${interestData?.total_student}/total_teacher/${interestData?.total_teacher}/total_rc/${interestData?.total_rc}`;

    let quotationPath = `${itemList?.route}/${navigateRoute}`;

    setQuotationURL(quotationPath);
  };

  useEffect(() => {
    if (menuItem?.length) {
      menuItemCheck();
    }
  }, [menuItem, interestData]);

  const breadcrumbs = [
    <Link
      underline="hover"
      key="1"
      color="inherit"
      to="/authorised/school-list"
      className={classes.breadcrumbsClass}
    >
      Listing
    </Link>,
    <Typography key="3" color="text.primary" fontWeight="600" fontSize="14px">
      Listing Detail
    </Typography>,
  ];

  const getUserChildRoles = async () => {
    getAllChildRoles({ role_name: userRole })
      .then((childRoles) => {
        let { all_child_roles } = childRoles?.data?.response?.data ?? {
          childs: [],
        };
        setRoleslist(all_child_roles);
        let childRoleNames = all_child_roles
          ? all_child_roles?.map((roleObj) => roleObj?.roleName)
          : [];
        childRoleNames.push(userRole);
        setRoleName(childRoleNames);
        localStorage.setItem("childRoles", EncryptData(all_child_roles ?? []));
      })
      .catch((err) => {
        console.log(err, "error");
      });
  };

  const handleVerifyDateNew = (value) => {
    let verifyDate = moment.utc(value).local().format("DD/MM/YYYY ");
    setNewVerifyDate(verifyDate);
  };

  const handleLastActivity = (data) => {
    let activity = data?.[0]?.["created_at"];
    setLastActivity(activity);
  };

  const getAllParentRoles = () => {
    if (localStorage?.getItem("childRoles")) {
      let childRoleNames = DecryptData(localStorage?.getItem("childRoles"));
      setRoleslist(childRoleNames);
      childRoleNames.push(userRole);
      setRoleName(childRoleNames);
    } else {
      getUserChildRoles();
    }
  };

  const editAddress = () => {
    setEditAddressModal(!editAddressModal);
    setUpdatedAddress(address);
  };

  const handleUpdateAddress = () => {
    let data = {
      leadId: schoolId,
      address: updatedAddress,
    };

    updateSchool(data)
      .then((res) => {
        toast.success(res?.message);
        editAddress();
        window.location.reload(false);
      })
      .catch((err) => {
        console.error(err, "Error in updating school");
      });
  };

  const handleInterestName = () => {
    let selectedInterest = leadObj?.interest?.filter(
      (item) => item?.leadId == interest_id
    );

    let name = selectedInterest?.[0]?.learningProfile;
    return name;
  };

  const handleUploadPO = () => {
    setModal1(!modal1);
  };

  useEffect(() => {
    getAllParentRoles();
  }, []);

  const visibleIsMeeting = (status) => {
    setMeetingStatus(status);
  };

  useEffect(() => {
    if (data) {
      setLeadObj(data);
    }
  }, [data]);

  useEffect(() => {
    // fetchLead(schoolId);
  }, [leadStatus, interestType]);

  const changedMeetingStatus = () => {
    setMeetingStatus(false);
  };

  useEffect(() => {
    getMenuData();
  }, []);

  const redirectPageURL = () => {
    var win = window.open(quotationPathURL, "_blank");
    win.focus();
  };

  let interstTypeData;
  let quotationData;

  const getQuoteInterest = async (data) => {
    let leadId = data?.leadId;
    var selectedData = data;
    try {
      let res = await getBdeActivity({ leadId });
      interstTypeData = await res?.result;
      interstTypeData = interstTypeData[0]?.learningProfileCode;
      let data = res?.result;
      quotationData = data?.filter(
        (item) => item?.priority === "HOTS" || item?.priority === "Pipeline"
      );
      let isInterestType = false;

      if (interstTypeData) {
        isInterestType = checkedRows
          ?.map((obj) => obj?.interestType)
          ?.includes(interstTypeData);
      }

      if (!isInterestType) {
        return {
          interestCode: interstTypeData
            ? interstTypeData
            : selectedData?.learningProfileCode,
          activityData: quotationData ? quotationData : [],
        };
      } else {
        return [];
      }

      // if(!isInterestType) {
      //   setFormData([...formData, {
      //     interestType: interstTypeData,
      //     quotaionData: quotationData
      //   }])
      // }
    } catch (err) {
      console.error(err);
    }
  };

  const getQuoteStatus = () => {
    setQuoteStatus(true);
  };

  const redirectQuotePage = async () => {
    let Data = await getBDActivityInterest();
    navigate("/authorised/add-quotation", {
      state: {
        data: leadObj,
        interest: checkedRows,
        quotationData: Data,
        isQuoteType: isQuoteType,
      },
    });
  };

  const [open, setOpen] = useState(false);
  const [purchaseOrderArray, setPurchaseOrderArray] = useState([]);

  const checkStatusValue = (arr, val_one, val_two) => {
    for (let i = 0; i < arr.length; i++) {
      if (Number(i[val_one]) !== Number(i[val_two])) {
        return false;
      }
    }
    return true;
  };

  const purchaseOrderList = async (schoolCode) => {
    await getPOListBySchoolCode(schoolCode)
      .then(async (res) => {
        let data = res?.result;
        let finalPOList = data?.filter((obj) => obj.approvalStatus === "Approved")
        setPurchaseOrderArray(finalPOList);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const getProductInterestList = async () => {
    let params = {
      userDetail: leadObj,
      interestOption: interestOption,
    };

    let { interestedId, interest } = await getProductInterest(params);

    if (interest) {
      setSelectInterest(interest);
    }

    if (interest && interestedId) {
      let { filteredArray } = await getLeadInterestId(
        interestedId?.concat(interest)
      );
      if (filteredArray?.length) {
        setInterestId(filteredArray);
      }
    }
  };

  const getBDActivityInterest = async (data) => {
    var productData = [];
    try {
      await Promise.all(
        checkedRows?.map(async (obj) => {
          let data = await getQuoteInterest(obj);
          productData.push(data);
          setFormData(data);
        })
      );
    } catch (err) {
      console.error("An error occurred in Promise.all:", err);
    }
    return productData;
  };

  const getInterestgroupKey = () => {
    var Data = ownerInterest
      ?.filter((obj) => obj?.learningProfileGroupName)
      ?.reduce((group, data) => {
        let date_value = data?.learningProfileGroupName;
        group[date_value] = group[date_value] ?? [];
        group[date_value].push(data);
        return group;
      }, {});
    setGroupInterestKey(Data);
  };

  const getSelectedInterest = async () => {
    let flattenedData;
    const selectedData = leadObj?.interest?.map((obj) => {
      return getProductData([obj]);
    });
    try {
      flattenedData = await Promise.all(selectedData);
    } catch (err) {
      console.error(err);
    }

    flattenedData = flattenedData?.flat().filter((obj) => obj?.leadId);
    setOwnerInterest(flattenedData);
  };

  useEffect(() => {
    if (leadObj) {
      let data = leadObj?.interest?.filter(
        (obj) => obj?.assignedTo_role_name === userData
      );
      setOwnerInterest(data);
      // getInterestgroupKey()
      // getSelectedInterest();
    }
  }, [leadObj]);

  useEffect(() => {
    if (ownerInterest?.length > 0) {
      getInterestgroupKey();
    }
  }, [ownerInterest]);

  // useEffect(() => {
  //   if (interestOption?.length) {
  //     getProductInterestList();
  //   }
  // }, [interestOption]);

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

  const getProductData = async (data) => {
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
          schoolLeadId: leadObj?.leadId,
          productCode: obj?.productCode,
          learningProfileGroupCode: obj?.learningProfileGroupCode,
          learningProfileRefId: obj?.learningProfileRefId,
        });
      }
    });

    return newArray;
  };

  useEffect(() => {
    if (isFormSubmit) {
      redirectQuotePage();
    }
  }, [isFormSubmit]);

  useEffect(() => {
    getProductList();
  }, []);

  const handleRowCheck = (event, row) => {
    const groupCode = checkedRows?.length
      ? checkedRows
        ?.map((obj) => obj?.learningProfileGroupCode)
        ?.includes(row?.learningProfileGroupCode)
      : true;

    if (!groupCode) {
      setCheckedRows([row]);
      return;
    }

    if (event.target.checked) {
      setCheckedRows([...checkedRows, row]);
    } else {
      setCheckedRows(checkedRows.filter((checkedRow) => checkedRow !== row));
    }
  };

  const isChecked = (row) => {
    if (checkedRows.includes(row)) {
      return checkedRows.includes(row);
    } else {
      return false;
    }
  };

  let intrestData = leadObj?.interest?.find(
    (obj) => obj?.leadId === interest_id
  )?.learningProfile;

  const getQuoteByPOCodeHandler = async (item) => {
    console.log("ooo", item)
    navigate("/authorised/implementation-form", {
      state: {
        quotationCode: item.quotationCode,
        schoolCode: item.schoolCode,
        purchaseOrderDetail: item,
        schoolPath: location?.pathname,
        schoolId: item?.leadId
      },
    });
  };
  useEffect(() => {
    document.body.classList.add("crm-is-inner-page");
    return () => document.body.classList.remove("crm-is-inner-page");
  }, []);

  return (
    <div className="crm-school-wrapper crm-school-details-wrapper">
      <div className={classes.headerContainer}>
        <img onClick={() => navigate(-1)} src="/back arrow.svg" />
        <div className={classes.headerTitle}>My Lead</div>
      </div>
      <div className="listing-containerPage schoollist-container">
        <Breadcrumbs
          className={`listing-breadcrumbs ${classes.breadcrumbsBar}`}
          separator={<img src={BredArrow} />}
          aria-label="breadcrumb"
        >
          {breadcrumbs}
        </Breadcrumbs>
        <Page
          title="Extramarks | Listing Details"
          className="main-container listing-container datasets_container"
        >
          <Grid
            container
            direction="row"
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            spacing={2.5}
          >
            <Grid
              className={`${classes.listingGrid} mb-0`}
              item
              xs={12}
              sm={12}
              md={4.5}
              lg={4.5}
            >
              <Card
                className={`${`${classes.root}  ${classes.stapper}`} crm-school-card`}
                variant="outlined"
              >
                {
                  !isMobile
                    ? <>
                      <Box className={classes.stapperBox}>
                        <Stepper
                          activeStep={2}
                          alternativeLabel
                          className={classes.alternativeLabelClass + ` crm-school-details-profile-stepper`}
                        >
                          {step1.map((label, i) => (
                            <Step key={label}>
                              <StepLabel>
                                <p className="listing-step-label">{label}</p>
                                <p className="listing-step-label-date">{'21/01/2022'}</p>
                              </StepLabel>
                            </Step>
                          ))}
                        </Stepper>
                      </Box>
                      <Divider />
                    </>
                    : null

                }
                <div className="profileContainer">
                  <Box className={classes.title} color="textSecondary">
                    <div className="listing-student-details">
                      {isProfile ? (
                        <Avatar
                          className={`listing - student - avatar ${classes.listingStudentAvtar}`}
                        >
                          <img src={isProfile} />
                          {/* {leadObj?.schoolName?.substring(0, 1)} */}
                        </Avatar>
                      ) : (
                        <IconSchoolProfile />
                      )}

                      <div className="listing-student-name">
                        <h2 className="name-head">{leadObj?.schoolName}</h2>
                        <p className="name-head-sub">
                          School
                          {/* <span
                            className="hotLead"
                            style={{ marginLeft: "10px" }}
                          >
                            <img src={IconFire} />
                            Hot Lead
                          </span> */}
                        </p>
                      </div>
                    </div>
                    <div>
                      <SchoolDetailsTabs data={leadObj} editAddress={editAddress} />
                    </div>
                  </Box>

                  {/* <Box className="listing-activity-details">
                    <div className={classes.flexChatBox}>
                      <div
                        style={{ cursor: "pointer" }}
                        onClick={() => setMeetingStatus(!isMeeting)}
                      >
                        <img
                          src="/log_meeting.svg"
                          style={{ margin: "0 auto" }}
                        />
                        <p
                          style={{
                            marginTop: "10px",
                            fontSize: "14px",
                            color: "#000",
                          }}
                        >
                          Log Meeting
                        </p>
                      </div>
                      {interest_id ? (
                        <>
                          <div
                            style={{ display: "flex", marginTop: "-0.5px" }}
                          >
                            <div
                              style={{
                                cursor: "pointer",
                                marginBottom: "-400px",
                              }}
                              onClick={redirectPageURL}
                            >
                              <img
                                src="/trialUser.svg"
                                style={{ margin: "0 auto" }}
                              />
                              <p
                                style={{
                                  marginTop: "10px",
                                  fontSize: "14px",
                                  color: "#000",
                                }}
                              >
                                Generate Quotation
                              </p>
                            </div>
                          </div>
                        </>
                      ) : (
                        ""
                      )}
                    </div>
                  </Box> */}
                  <Box className="crm-school-lead-card-container mb-0">
                    {isMobile ? <Typography className="crm-school-lead-card-title" component="h3">Last Activity: NA</Typography> : null}

                    {
                      !isMobile
                        ? <Box className="crm-school-details-todo-items">
                          <Box className="crm-school-details-todo-item" onClick={() => { return false }}>
                            <Box className="crm-school-details-todo-item"><IconLogMeeting /></Box>
                            <Typography component={"p"} className="crm-school-details-todo-item-title">Log Meeting</Typography>
                          </Box>
                          <Box className="crm-school-details-todo-item" onClick={() => { return false }}>
                            <Box className="crm-school-details-todo-item"><IconFreeTrail /></Box>
                            <Typography component={"p"} className="crm-school-details-todo-item-title">Assign Free Trial</Typography>
                          </Box>
                          <Box className="crm-school-details-todo-item" onClick={() => { return false }}>
                            <Box className="crm-school-details-todo-item"><IconSentEmail /></Box>
                            <Typography component={"p"} className="crm-school-details-todo-item-title">Sent Mail</Typography>
                          </Box>
                        </Box>
                        : null
                    }

                    <Box className="listitem-inline crm-school-details-action-items">
                      {ownerInterest?.length > 0 ? (
                        <Button
                          className={isMobile ? "crm-anchor crm-anchor-small p-0" : 'crm-btn crm-btn-small'}
                          onClick={() => getQuoteStatus()}
                        >
                          Generate Quote
                        </Button>
                      ) : (
                        ""
                      )}
                      {/* {interest_id && ( */}
                      <Button
                        className={isMobile ? "crm-anchor crm-anchor-small p-0" : 'crm-btn crm-btn-small'}
                        onClick={() => handleUploadPO()}
                      >
                        Upload PO
                      </Button>

                      <Button
                        className={isMobile ? "crm-anchor crm-anchor-small p-0" : 'crm-btn crm-btn-small'}
                        onClick={async () => {
                          await purchaseOrderList(leadObj?.schoolCode)
                          setOpen(true)
                        }}
                      >
                        Fill Implementation
                      </Button>
                    </Box>

                  </Box>

                  <Box className="crm-school-lead-card-container crm-school-details-lead-source">
                    <div className={isMobile ? 'crm-school-lead-card-lead' : 'listing-lead'}>
                      <h3 className={isMobile ? "crm-school-lead-card-title" : "crm-school-details-lead-source-title"}>Lead Source</h3>
                      <div className={isMobile ? "crm-school-lead-card-lead-contianer" : "textContainer"}>
                        <p>
                          <b> First source / Sub source:</b>{" "}
                          {leadObj?.sourceName ? leadObj?.sourceName : "NA"}
                        </p>
                        <p>
                          <b> Latest source / Sub source:</b>{" "}
                          {leadObj?.subSourceName
                            ? leadObj?.subSourceName
                            : "NA"}
                        </p>
                      </div>
                    </div>
                  </Box>
                </div>
              </Card>
            </Grid>



            <Grid className="card2Container crm-school-lead-card-wrapper" item xs={12} md={7.5} lg={7.5}>

              <Card
                className={`${classes.root}  ${classes.stapper} ${classes.lastContainer} accordion-root-card`}
                variant="outlined"
              >
                <CardContent className="crm-school-lead-card-content">
                  <Box className="crm-school-lead-card-container ">
                    <Box className={classes.title} color="textSecondary">
                      <Box className="crm-school-details-accordion-steps">
                        <Stepper
                          activeStep={2}
                          className={''}
                        >
                          {step2?.map((label, i) => {
                            const labelProps = {};
                            return (
                              <Step key={label}>
                                <StepLabel  {...labelProps}>
                                  {label}
                                </StepLabel>
                              </Step>
                            )
                          })}
                        </Stepper>
                      </Box>


                      <div >
                        <SchoolDetailAccordian
                          data={leadObj}
                          roleNameList={roleNameList}
                          getBdActivityInterest={getBdActivityInterest}
                        />
                      </div>

                    </Box>

                  </Box>
                  <div className="crm-school-lead-activity"><LeadSchoolTabs interest={leadObj?.interest} /></div>
                </CardContent>
              </Card>


            </Grid>

          </Grid>
        </Page>
      </div>
      {isMeeting ? (
        <div>
          <MeetingLog
            isMeeting={isMeeting}
            data={leadObj}
            visibleIsMeeting={visibleIsMeeting}
            minimizePopUP={changedMeetingStatus}
          />
        </div>
      ) : (
        ""
      )}

      {isQuote && (
        <Modal
          open={isQuote}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          className="crm-school-generate-quote-modal"
        >
          <Box className="crm-modal-basic-content">
            <Box className="crm-modal-close" onClick={handleClose}>
              <IconCancel />
            </Box>
            <Typography
              component={"h3"}
              className="crm-quotes-modal-form-label"
            >
              Select interest to generate contract
            </Typography>
            <Box sx={{ mb: 3.5 }} className="crm-school-generate-quote-modal-list">

              {Object.entries(groupInterestKey)?.length > 0 ? (
                Object.entries(groupInterestKey).map((obj, index) => (
                  <Box className="crm-quotes-form-radio-item" key={index}>
                    <Radio
                      checked={selectedProductValue === obj?.[0]}
                      onChange={(e) => handleModalProductChange(e, index)}
                      value={obj?.[0]}
                      name="radio-buttons-product-modal"
                      inputProps={{ "aria-label": obj?.[0] }}
                    />
                    <span className="crm-quotes-form-radio-item-label">
                      {obj?.[0]}
                    </span>
                  </Box>
                ))
              ) : (
                <p
                  style={{
                    fontSize: "18px",
                    textAlign: "center",
                    marginTop: "20px",
                  }}
                >
                  No Product List available
                </p>
              )}
            </Box>
            {
              (Object.entries(groupInterestKey)?.length > 0)
                ? <Box className={"crm-flex-content-center"}>
                  <Button
                    className="crm-btn crm-btn-primary"
                    onClick={() => handleProductSubmit()}
                  >
                    Submit
                  </Button>
                </Box>
                : null
            }

          </Box>
        </Modal>
      )}

      {editAddressModal && (
        <>
          {
            isMobile
              ? <Modal
                hideBackdrop={true}
                open={editAddressModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                className="crm-theme-modal-full"
              >
                <Box className="crm-theme-modal-full-container" >
                  <Box className="crm-theme-modal-full-header">
                    <Link
                      key="99"
                      color="inherit"
                      to={".."}
                      onClick={(e) => {
                        e.preventDefault();
                        setEditAddressModal(false)
                      }}
                      className=""
                    >
                      <IconNavLeft className="crm-inner-nav-left" />{" "}
                    </Link>
                    <Typography component="h2" className="">
                      Edit Address
                    </Typography>
                  </Box>
                  <Box className="crm-theme-modal-full-content">
                    <Typography component="h3" className="">
                      Address
                    </Typography>
                    <Box className="crm-form-input2 dark">
                      <TextField
                        id="Pincode"
                        label="Pincode"
                        defaultValue=""
                        InputLabelProps={{
                          shrink: true,
                        }}
                        autoFocus={true}
                      />
                    </Box>
                    <Box className="crm-form-input2 dark">
                      <TextField
                        id="HouseNo"
                        label="Address (House No. Building, Street, Area"
                        defaultValue=""
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Box>
                    <Box className="crm-form-input2 dark">
                      <TextField
                        id="City"
                        label="City"
                        defaultValue=""
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Box>
                    <Box className="crm-form-input2 dark">
                      <TextField
                        id="State"
                        label="State"
                        defaultValue=""
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Box>
                    <Box className="crm-form-input2 dark">
                      <TextField
                        id="Country"
                        label="Country"
                        defaultValue=""
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Box>
                  </Box>
                  {/* <Grid container spacing={3} sx={{ py: "8px" }}>
                      <Grid item md={12} xs={12}>
                        <Typography className={classes.label}>Address</Typography>
                        <textarea
                          className={classes.textAreainputStyle}
                          name={"updatedAddress"}
                          type="text"
                          placeholder="Enter New Address"
                          value={updatedAddress}
                          onChange={(e) => setUpdatedAddress(e.target.value)}
                        />
                      </Grid>
                    </Grid> */}
                  <div className="crm-theme-modal-full-footer">
                    <Button
                      onClick={handleUpdateAddress}
                      className="crm-btn crm-btn-primary crm-btn-full"
                    >
                      Save Address
                    </Button>
                  </div>
                </Box>
              </Modal>

              : <Modal
                hideBackdrop={true}
                open={editAddressModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                className="targetModal1"
              >
                <Box
                  sx={style}
                  className="modalContainer"
                  style={{ borderRadius: "8px", width: "min-content" }}
                >
                  <Box sx={{ padding: "30px 0", marginTop: "-44px" }}>
                    <div style={{ textAlign: "center" }}>
                      <h3>Update Address</h3>
                    </div>
                  </Box>
                  <Grid container spacing={3} sx={{ py: "8px" }}>
                    <Grid item md={12} xs={12}>
                      <Typography className={classes.label}>Address</Typography>
                      <textarea
                        className={classes.textAreainputStyle}
                        name={"updatedAddress"}
                        type="text"
                        placeholder="Enter New Address"
                        value={updatedAddress}
                        onChange={(e) => setUpdatedAddress(e.target.value)}
                      />
                    </Grid>
                  </Grid>
                  <div style={{ display: "flex", float: "right", marginTop: "25px" }}>
                    <div
                      onClick={editAddress}
                      style={{
                        border: "1px solid #F45E29",
                        padding: "12px 24px",
                        color: "#F45E29",
                        borderRadius: "4px",
                        fontWeight: "600",
                        fontSize: "16px",
                        lineHeight: "22px",
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </div>
                    <div
                      onClick={handleUpdateAddress}
                      style={{
                        fontWeight: "600",
                        fontSize: "16px",
                        lineHeight: "22px",
                        cursor: "pointer",
                        borderRadius: "4px",
                        color: "white",
                        border: "1px solid #F45E29",
                        padding: "12px 24px",
                        background: "#F45E29",
                        marginLeft: "9px",
                      }}
                    >
                      Update
                    </div>
                  </div>
                </Box>
              </Modal>

          }
        </>

      )}
      {leadObj != null && (
        <PurchaseOrderModal
          leadObj={leadObj}
          modal1={modal1}
          setModal1={setModal1}
        />
      )}
      <PODialogueBox
        open={open}
        setOpen={setOpen}
        purchaseOrderArray={purchaseOrderArray}
        getQuoteByPOCodeHandler={getQuoteByPOCodeHandler}
      />
      <ProductListModal
        data={groupInterestKey}
        index={index}
        modal2={modal2}
        setModal2={setModal2}
        handleRowCheck={handleRowCheck}
        isChecked={isChecked}
        setQuoteStatus={setQuoteStatus}
        isQuote={isQuote}
        setCheckedRxows={setCheckedRows}
        setFormSubmit={setFormSubmit}
        checkedRows={checkedRows}
        isQuoteType={isQuoteType}
        setQuoteType={setQuoteType}
      />
    </div>
  );
};
export default SchoolProfile;
