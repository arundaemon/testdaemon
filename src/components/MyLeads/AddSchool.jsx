import { Field, Form, Formik } from "formik";
import { useRef, useState, useEffect } from "react";
import Select from "react-select";
import { useStyles } from "../../css/AddSchool-css";
import { Breadcrumbs, Button, Grid, LinearProgress, Typography } from "@mui/material";
import * as Yup from "yup";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Page from "../Page";
import { CustomSelect } from "./Tabs/CustomSelect";
import { accordionFields } from "../../helper/AddSchool/SchoolFormData";
import AutoCompleteAddress from "./Accordion/AddSchoolForm/SchoolAddress";
import { StudentValidation } from "../../helper/AddSchool/StudenValidation";
import { PrimaryDetail } from "./Accordion/AddSchoolForm/PrimaryDetail";
import { DemographyDetails } from "./Accordion/AddSchoolForm/DemographicDetails";
import { ContactAddress } from "./Accordion/AddSchoolForm/ContactDetail";
import { InterestDetail } from "./Accordion/AddSchoolForm/InterestDetail";
import { createSchool } from "../../config/services/schoolRegister";
import { registerSchool } from "../../config/services/createSchool";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import BredArrow from '../../assets/image/bredArrow.svg'

const initialValues = {
  schoolName: "",
  board: { label: "Select Board", value: undefined },
  boardClass: { label: "Select Class", value: undefined },
  schEmailId: "",
  institueType: { label: "Select Type of Institute", value: undefined },
  competitorName: "",
  totalStudent: null,
  totalTeacher: null,
  associateInstitute: "",
  schWebsite: "",
  offeredSubject: { label: "Select Subject", value: undefined },
  addMissionfee: null,
  tutionFee: null,
  internetImplement: "Yes",
  contacts: [
    {
      userName: "",
      designation: { label: "Select Designation", value: undefined },
      mobileNumber: "",
      emailId: "",
    },
  ],
  interestedItem: null,
};

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

const LoginSchema = Yup.object().shape({
  schoolName: Yup.string().required(),
  schEmailId: Yup.string().required(),
});

export const AddSchool = () => {
  const classes = useStyles();

  const navigate = useNavigate();

  const [activeAccordion, setActiveAccordion] = useState(0);

  const [primaryDetail, setPrimaryDetail] = useState(null);

  const [schoolDetail, setSchoolDetail] = useState(null);

  const [schoolAddress, setSchoolAddress] = useState(null);

  const [contactDetail, setContactDetail] = useState([]);

  const [isValidateEmail, setValidateEmail] = useState([]);

  const [interestDetail, setInterestDetail] = useState(null);

  const [registerForm, setRegisterForm] = useState([]);

  const [shw_loader, setDisplayLoader] = useState(false)

  const prevCountRef = useRef();

  const addRegisterDetail = () => {
    setRegisterForm([
      primaryDetail,
      schoolDetail,
      schoolAddress,
      contactDetail,
      interestDetail,
    ]);
  };

  const schoolRegister = async (data) => {
    let params = {
      data: data,
      contactDetail: contactDetail,
    };
    setDisplayLoader(true)
    const res = await registerSchool(params);
 
    if (res?.statusCode == 1) {
      setDisplayLoader(false)
      navigate("/authorised/school-list");
    } else if (res?.statusCode == 0) {
      setDisplayLoader(false)
      setActiveAccordion(0);
      if (res?.message) {
        toast.error(res?.message);
      }else {
        toast.error("Please Add Valid GeoTag School");
      }
    } else {
      setDisplayLoader(false)
      toast.error("Oops! Something went wrong");
    }
  };

  const onSubmitHandler = () => {
    const { validate, attrName, result } = StudentValidation(registerForm);

    if (validate) {
      if (isContactValidate()) {
        schoolRegister(result);
      }
    } else {
      let index = checkFormValidate(attrName);
      setActiveAccordion(index);
    }
  };

  const isContactValidate = () => {
    let isFieldBlank;
    
    if (contactDetail?.length > 0) {
      if(contactDetail?.length <= 10) {
        contactDetail?.map((obj) => {
          if (obj?.name?.trim() == "") {
            toast.error("Please Add Name");
            setActiveAccordion(3);
            isFieldBlank = true;
            return false;
          } else if (!obj?.designation) {
            toast.error("Please Add Designation");
            setActiveAccordion(3);
            isFieldBlank = true;
            return false;
          } else if (!(obj?.mobileNumber)) {
            toast.error("Please Add Valid Mobile Number");
            setActiveAccordion(3);
            isFieldBlank = true;
            return false;
          } else if (obj?.emailId?.trim() == "") {
            toast.error("Please Add Email");
            setActiveAccordion(3);
            isFieldBlank = true;
            return false;
          }else if (!(Number(obj?.mobileNumber?.length) === 10)) {
            toast.error("Please Add Valid Mobile Number");
            setActiveAccordion(3);
            isFieldBlank = true;
            return false;
          }
           else {
            isFieldBlank = false;
            return false;
          }
        });

      
        if (!isFieldBlank) {

          let isPrimaryContact = contactDetail?.map(obj => obj.isPrimary)
          
          isPrimaryContact = isPrimaryContact?.includes(true) 

          if (!isPrimaryContact) {
            toast.error("Please Select One Contact As Primary");
            setActiveAccordion(3);
            return false
          }

          let checkValidaEmail = isValidateEmail?.map((obj) => obj?.isValid);
    
          checkValidaEmail = checkValidaEmail?.includes(false);
    
          if (!checkValidaEmail) {
            const hasUniqueKeyValue =
              contactDetail?.length ===
              new Set(contactDetail?.map((obj) => obj.mobileNumber))?.size;
            if (!hasUniqueKeyValue) {
              toast.error("Phone Number Must Be Unique In Contact Details");
              setActiveAccordion(3);
            }
            return hasUniqueKeyValue;
          } else {
            toast.error("Please Add Valid Email In Contact Details");
            setActiveAccordion(3);
          }
        }
      }else {
        toast.error("You Cannot Add More than 10 Contacts")
        setActiveAccordion(3)
        return false
      }
    }
  };

  const checkFormValidate = (attrName) => {
    const index = registerForm?.findIndex((obj) =>
      obj.hasOwnProperty(attrName)
    );
    return index;
  };

  useEffect(() => {
    prevCountRef.current = activeAccordion;
  }, [activeAccordion]);

  useEffect(() => {
    addRegisterDetail();
  }, [
    primaryDetail,
    schoolDetail,
    schoolAddress,
    contactDetail,
    interestDetail,
  ]);

  const getPrimaryDetail = (data) => {
    setPrimaryDetail(data);
  };

  const getSchoolDetail = (data) => {
    setSchoolDetail(data);
  };

  const getSchoolAddress = (data) => {
    setSchoolAddress(data);
  };

  const getContactDetail = (data, emails) => {
    setValidateEmail(emails);
    setContactDetail(data);
  };

  const getInterestDetail = (data) => {
    let interestObj = { interestInfo: data };
    setInterestDetail(interestObj);
  };

  const accordionData = [
    {
      title: "Primary Details of School",
      detail: <PrimaryDetail getPrimaryDetail={getPrimaryDetail} />,
    },
    {
      title: "Demographic Details",
      detail: <DemographyDetails getSchoolDetail={getSchoolDetail} />,
    },
    {
      title: "School Address",
      detail: <AutoCompleteAddress getSchoolAddress={getSchoolAddress} />,
    },
    {
      title: `Contact`,
      detail: <ContactAddress getContactDetail={getContactDetail} />,
    },
    {
      title: "Interest Shown",
      detail: <InterestDetail getInterestDetail={getInterestDetail} />,
    },
  ];

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
      Add School
    </Typography>,
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
        title="Extramarks | Add School"
        className="main-container myLeadPage datasets_container"
      >
        <div>
          {shw_loader ? <LinearProgress /> : ""}
        </div>
        <Grid className={classes.cusCard}>
          <Grid container spacing={3} sx={{ px: "8px", py: "20px" }}>
            <Grid item xs={12}>
              <Typography className={classes.title}>Add School</Typography>
            </Grid>
          </Grid>

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
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </div>
          {!(shw_loader) ? <Grid className={classes.btnSection}>
            <Button
              className={classes.submitBtn}
              onClick={() => onSubmitHandler()}
            >
              Submit
            </Button>
          </Grid> : ''}
        </Grid>
      </Page>
    </div>
  );
};
