import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Breadcrumbs,
  Button,
  Grid,
  LinearProgress,
  Typography,
} from "@mui/material";
import Page from "../Page";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useStyles } from "../../css/AddSchool-css";
import { PrimaryDetail } from "./Accordion/AddSchoolForm/PrimaryDetail";
import BredArrow from "../../assets/image/bredArrow.svg";
import { useEffect, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { CommonActivityForm } from "./Accordion/AddSchoolForm/SchoolActivityForm/CommonActivityForm";
import { getAllKeyValues } from "../../config/services/crmMaster";
import {
  getActivityMappingDetails,
  getDependentFields,
} from "../../config/services/activityFormMapping";
import { DynamicActivityForm } from "./Accordion/AddSchoolForm/SchoolActivityForm/DynamicActivityForm";
import { getUserData } from "../../helper/randomFunction/localStorage";
import { logMeetingActivity } from "../../config/services/bdeActivities";
import { toast } from "react-hot-toast";

export const SchoolActivityForm = (props) => {
  const classes = useStyles();

  const location = useLocation();

  let { data, productList, contactList, meetingStatus } = location?.state
    ? location?.state
    : {};

  const [activeAccordion, setActiveAccordion] = useState(0);
  const [crmMasterKey, setMasterKey] = useState([]);
  const [productData, setProductData] = useState([]);
  const [productTabOne, setProductTabOne] = useState({});
  const [productTabTwo, setProductTabTwo] = useState({});
  const [productTabThree, setProductTabThree] = useState({});
  const [productTabFour, setProductTabFour] = useState({});
  const [productTabFive, setProductTabFive] = useState({});
  const [productDependentOne, setDependentOne] = useState([]);
  const [productDependentTwo, setDependentTwo] = useState([]);
  const [productDependentThree, setDependentThree] = useState([]);
  const [productDependentFour, setDependentFour] = useState([]);
  const [productDependentFive, setDependentFive] = useState([]);
  const [productDynamicOne, setDynamicOne] = useState({});
  const [productDynamicTwo, setDynamicTwo] = useState({});
  const [productDynamicThree, setDynamicThree] = useState({});
  const [productDynamicFour, setDynamicFour] = useState({});
  const [productDynamicFive, setDynamicFive] = useState({});
  const [productDynamicKey, setDynamicKey] = useState([]);
  const [comment, setComment] = useState("");
  const [shw_loader, setDisplayLoader] = useState(false);
  const [productfinal, setfinalProduct] = useState([]);
  const [productfinalDependent, setfinalProductDepend] = useState([]);
  const [productfinalDynamic, setfinalProductDynamic] = useState([]);

  const userData = {
    createdBy: getUserData("loginData")?.uuid,
    createdByRoleName: getUserData("userData")?.crm_role,
    createdByProfileName: getUserData("userData")?.crm_profile,
    createdByName: getUserData("userData")?.name,
    empCode: getUserData("userData")?.employee_code,
    contactDetails: contactList,
    leadType: "B2B",
    meetingStatus: meetingStatus,
  };

  const navigate = useNavigate();

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
    <Link
      underline="hover"
      key="1"
      color="inherit"
      to={`/authorised/school-details/${data?.leadId}`}
      className={classes.breadcrumbsClass}
    >
      Details
    </Link>,
    <Typography key="3" color="text.primary" fontWeight="600" fontSize="14px">
      Products
    </Typography>,
  ];


  const checkDependentField = () => {
    if (productfinalDynamic?.length > 0) {
      let fieldArray = [];
      var Data = productfinalDynamic?.map(obj => {
        Object.entries(obj).forEach(([key, Value]) => {
          if (Value.required && Value.value === "") {
            fieldArray.push(Value);
          }
        });
        if (fieldArray?.length > 0) {
          toast.error("Please Add Mandatory Fields");
          setActiveAccordion(obj?.activeFilledTab);
          return false;
        }else {
          return true
        }
      })
      return Data;
    }
    return true;
  };

  const validateFieldInArray = (arr, fieldNames) => {
    arr.forEach((obj, index) => {
      fieldNames.forEach((fieldName) => {
        if (!obj.hasOwnProperty(fieldName) || obj[fieldName] === undefined || obj[fieldName] === '') {
          setActiveAccordion(index);
          toast.error("Please Add Correct Mapping");
          throw new Error(
            `Field "${fieldName}" not found in object at index ${index}`
          );
        }
      });
    });
  };

  const dynamicKeyObj = (data) => {
    let dynamicKeyVal = {};
    if (data) {
      data = Object.entries(data);
      dynamicKeyVal = data?.reduce((result, [key, value]) => {
        return {
          ...result,
          [key]: value,
        };
      }, {});
    }
    return dynamicKeyVal;
  };

  const createActivity = async () => {
    const finalResult = productfinal?.map((obj) => {
      let dynamicKey = obj?.dynamicKey;
      let dynamicKeyVal = dynamicKeyObj(dynamicKey);
      return {
        ...obj,
        ...dynamicKeyVal,
      };
    });

    if (finalResult?.length === productList.length) {
      let activityObj = finalResult?.map((obj) => {
        return {
          ...obj,
          minutesOfMeeting: comment,
          schoolName: data?.schoolName,
          schoolCode: data?.schoolCode,
          schoolCity: data?.city,
          schoolState: data?.state,
          schoolAddress: data?.address,
        };
      });

      let params = { activityObj };

      try {
        validateFieldInArray(finalResult, ["activityId", "futureActivityId"]);
        let isValidateField = checkDependentField()?.includes(false)
        if (comment?.trim() === "") {
          toast.error("Please Add Minutes Of Meeting");
          return false
        }
        if (
          !isValidateField
        ) {
          setDisplayLoader(true);
          try {
            let res = await logMeetingActivity(params);
            if (res?.result) {
              setDisplayLoader(false);
              toast.success(res?.message);
              navigate(`/authorised/school-details/${data?.leadId}`);
              // setOpen(false)
            } else {
              setDisplayLoader(false);
              toast.error(res?.data?.error?.message);
              return false;
            }
          } catch (err) {
            setDisplayLoader(false);
            console.error(err);
          }
        }
      } catch (error) {
        console.error(error.message);
      }
    } else {
      toast.error(`To Fill All Product Is Mandatory`);
    }
  };

  const getProductData = (data) => {
    let existObj = productfinal?.some(
      (obj) => obj?.activeTab === activeAccordion
    );

   
    if (!existObj) {
      setfinalProduct([
        ...productfinal,
        { ...data, activeTab: activeAccordion },
      ]);
    } else {
      let Data = productfinal?.map((obj) => {
        if (obj?.activeTab === activeAccordion) {
          return {
            ...obj,
            ...data,
          };
        }
        return obj;
      });
      setfinalProduct(Data);
    }
    getDynamicField(data);
  };

  const getDynamicResult = () => {
    let updatedDynamicList = productfinalDependent?.filter(
      (obj) => obj?.activeFilledTab != activeAccordion
    );
    let updateDynamicField = productfinalDynamic?.filter(
      (obj) => obj?.activeFilledTab != activeAccordion
    );

    setfinalProductDepend(updatedDynamicList);
    setfinalProductDynamic(updateDynamicField);
  };


  const getUpdateProduct = () => {
    let updateProduct = []
    if (productfinal?.length > 0) {
      updateProduct = productfinal?.map((obj) => {
        let { activeDynamicTab, activeFilledTab } = obj?.dynamicKey ? obj?.dynamicKey : {}
        if (
          obj?.activeTab === activeAccordion &&
          activeDynamicTab === activeAccordion &&
          activeFilledTab === activeAccordion &&
          obj.activityId && obj?.futureActivityId && obj?.dynamicKey
        ) {
          obj.activityId = '';
          obj.futureActivityId = '';
          obj.dynamicKey = ''
          return obj
        }
      }).filter(obj => obj);
      
      if (updateProduct?.length >0) {
        updateProduct = updateProduct?.[0]
        let updatedData = productfinal?.map(obj => {
          if (obj?.activeTab === updateProduct?.activeTab && obj?.activeTab === activeAccordion) {
              return {
                ...obj,
                ...updateProduct
              }
          }
          return obj
        })
        setfinalProduct(updatedData)
      }
     
     }
  }


  const accordionData = productList?.map((obj, index) => {
    return {
      title: obj?.profileName,
      listTab: `Tab${index + 1}`,
      detail: (
        <CommonActivityForm
          name={obj?.profileName}
          leadId={obj?.leadId}
          leadStage={obj?.leadStage}
          leadStatus={obj?.leadStatus}
          schoolId={obj?.schoolId}
          schoolLeadId={obj.schoolLeadId}
          listTab={`Tab${index + 1}`}
          data={crmMasterKey}
          getProductData={getProductData}
          getDynamicResult={getDynamicResult}
        />
      ),
    };
  });

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

  useEffect(() => {
    getOptionsData();
  }, []);

  useEffect(() => {
    if (!location?.state) {
      toast.error("You Cannot Access Without Product");
      navigate("/authorised/school-list");
    }
  }, []);

  const dynamicFieldData = (data) => {
    if (data) {
      let existObj = productfinalDependent?.some(
        (obj) => obj?.activeFilledTab === activeAccordion
      );

      if (!existObj) {
        setfinalProductDepend([
          ...productfinalDependent,
          { ...data, activeFilledTab: activeAccordion },
        ]);
      } else {
        let Data = productfinalDependent?.map((obj) => {
          if (obj?.activeFilledTab === activeAccordion) {
            return { ...data, activeFilledTab: activeAccordion };
          }
          return obj;
        });
        setfinalProductDepend(Data);
      }
    }else {
      getUpdateProduct();
    }
  };

  const dynamicFieldKey = () => {
    return {
      productData: productfinalDependent,
      productFilledData: productfinalDynamic,
    };
  };

  const getDynamicField = async (data) => {
    try {
      let res = await getDependentFields(data);

      if (res?.result) {
        dynamicFieldData(res?.result?.[0]?.value);
      } else {
        dynamicFieldData(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const dynamicFieldMethod = () => {
    return getDynamicData;
  };

  const getDynamicData = (data, activityObj) => {
    let { activityId, futureActivityId } = activityObj;

    if (activityId && futureActivityId) {
      let existObj = productfinalDynamic?.some(
        (obj) => obj?.activeFilledTab === activeAccordion
      );
      const entries = Object.entries(data);
      const dynamicKey = entries?.reduce((result, [key, value]) => {
        return {
          ...result,
          [key]: value?.value ? value?.value : "",
          activeDynamicTab: activeAccordion,
          activeFilledTab: activeAccordion,
        };
      }, {});

      let updateProduct = productfinal?.map((obj) => {
        if (obj?.activeTab === dynamicKey?.activeDynamicTab) {
          return {
            ...obj,
            dynamicKey
          };
        } else {
          return obj;
        }
      });

      updateProduct = updateProduct?.map((obj) => {
        return {
          ...obj,
          ...userData,
          ...activityObj,
        };
      });

      setfinalProduct(updateProduct);

      if (!existObj) {
        setfinalProductDynamic([
          ...productfinalDynamic,
          { ...data, activeFilledTab: activeAccordion },
        ]);
      } else {
        let Data = productfinalDynamic?.map((obj) => {
          if (obj?.activeFilledTab === activeAccordion) {
            return { ...obj, ...data };
          }
          return obj;
        });
        setfinalProductDynamic(Data);
      }
    }
  };

  const renderContent = (data, activityObj) => {
    return (
      <DynamicActivityForm
        data={crmMasterKey}
        productFormData={dynamicFieldKey()}
        getData={dynamicFieldMethod()}
        activeAccordion={activeAccordion}
      />
    );
  };

  return (
    <div className="listing-containerPage">
      <Breadcrumbs
        className={`listing-breadcrumbs ${classes.breadcrumbsBar}`}
        separator={<img src={BredArrow} />}
        aria-label="breadcrumb"
      >
        {breadcrumbs}
      </Breadcrumbs>
      <Page
        title="Extramarks | Add School"
        className="main-container myLeadPage datasets_container"
      >
        <div>{shw_loader ? <LinearProgress /> : ""}</div>
        <Grid className={classes.cusCard}>
          <div className={classes.accordianPadding}>
            {accordionData?.map((data, index) => {
              return (
                <Accordion
                  key={index}
                  className="cm_collapsable"
                  expanded={activeAccordion === index}
                  // expanded={true}
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
                    {renderContent(data)}
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </div>
          <Box sx={{ padding: "40px 15px" }}>
            <Grid item md={12} xs={12}>
              <Grid>
                <Typography className={classes.label}>
                  Minutes of Meetings *
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
                  // maxLength={100}
                />
              </Grid>
            </Grid>
          </Box>
          {!shw_loader ? (
            <Grid className={classes.btnSection}>
              <Button className={classes.submitBtn} onClick={createActivity}>
                Submit
              </Button>
            </Grid>
          ) : (
            ""
          )}
        </Grid>
      </Page>
    </div>
  );
};
