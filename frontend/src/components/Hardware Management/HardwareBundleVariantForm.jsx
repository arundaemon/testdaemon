import { useRef, useState, useEffect } from "react";
import { useStyles } from "../../css/AddSchool-css";
import { Breadcrumbs, Button, Grid, LinearProgress, Typography } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Page from "../Page";
import { toast } from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import BredArrow from '../../assets/image/bredArrow.svg'
import HardwareBundleFormPartSpecification from "./HardwareBundleVariantFormPartSpecification";
import HardwareBundleFormInformation from "./HardwareBundleVariantFormInformation";
import { createHardwareBundleVariant } from "../../config/services/hardwareManagement";
import { getUserData } from "../../helper/randomFunction/localStorage";


export const HardwareBundleVariantForm = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [activeAccordion, setActiveAccordion] = useState(0);
  const prevCountRef = useRef();
  const [information, setInformation] = useState({})
  const [specification, setSpecification] = useState({})
  const location = useLocation()
  const [isUpdate, setisUpdate] = useState(false)
  const updateData = location.state?.rowData;
  const loginData = getUserData('loginData')
  const loggedInUser=loginData?.uuid



  const FormValidation = (formdata) => {
    let { bundle_id, bundle_variant_name, bundle_variant_mrp, bundle_variant_mop ,bundle_hsn_code, bundle_variant_cgst_rate, bundle_variant_sgst_rate, bundle_variant_uom_id } = formdata

    if (!bundle_id) {
      toast.error('Bundle Name is Mandatory !')
      return false
    }
    else if (!bundle_variant_name) {
      toast.error('Bundle Variant is Mandatory !')
      return false
    }
    else if (!bundle_hsn_code) {
      toast.error('HSN code is Mandatory !')
      return false
    }
    else if (!bundle_variant_mrp) {
      toast.error('MRP is Mandatory !')
      return false
    }

    else if (!bundle_variant_mop) {
      toast.error('MOP is Mandatory !')
      return false
    }

    else if(parseFloat(bundle_variant_mrp)< parseFloat(bundle_variant_mop))
    {
      toast.error('MRP should be greater than MOP !')
      return false
    } 
    else if (!bundle_variant_uom_id) {
      toast.error('Product UOM is Mandatory !')
      return false
    }
    else if (!bundle_variant_cgst_rate) {
      toast.error('CGST is Mandatory !')
      return false
    }
    else if (!bundle_variant_sgst_rate) {
      toast.error('SGST is Mandatory !')
      return false
    }

    else 
    {
      return true
    }

  }

  useEffect(() => {
    if (updateData) {
      setisUpdate(true)
    }
  }, [updateData])

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isUpdate) {
      var variantId = updateData?.bundle_variant_id
    }
    const combinedData = {
      ...information,
      ...specification,
      bundle_variant_id: variantId,
      uuid:loggedInUser
    };
    if (FormValidation(combinedData)) {
      createHardwareBundleVariant(combinedData)
        .then(res => {
          if (res?.data?.status === 1) {
            toast.success(res?.data?.message)
            navigate('/authorised/hardware-bundle-variant-list');
          }
          else if (res?.data?.status === 0) {
            let { errorMessage } = res?.data?.message
            toast.error(errorMessage)
          }
          else {
            console.error(res);
          }
        }) .catch(error => {
          console.error('An error occurred:', error);
        });
    }
  }

  const handleCancelButton = () => {
    navigate('/authorised/hardware-bundle-variant-list');
  };


  useEffect(() => {
    prevCountRef.current = activeAccordion;
  }, [activeAccordion]);


  const getPartSpecification = (data) => {
    setSpecification(data);
  };

  const getBundleInfo = (data) => {
    setInformation(data);
  };




  const accordionData = [
    {
      title: "Information",
      detail: <HardwareBundleFormInformation getBundleInfo={getBundleInfo} updateInformation={updateData}/>,
    },
    {
      title: "Part Specifications",
      detail: <HardwareBundleFormPartSpecification getPartSpecification={getPartSpecification} updateSpecification={updateData}/>
    },

  ];

  const breadcrumbs = [
    <Link
      underline="hover"
      key="1"
      color="inherit"
      to="/authorised/hardware-bundle-variant-list"
      className={classes.breadcrumbsClass}
    >
      Listing
    </Link>,
    <Typography key="3" color="text.primary" fontWeight="600" fontSize="14px">
      Hardware Bundle Variant Form
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

        <Grid className={classes.cusCard}>

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
          <Grid className={classes.btnSection}>

              <Button
                  style={{
                      marginRight: '10px',
                  }}
                  className={classes.submitBtn}
                  onClick={handleCancelButton}
              >
                  Cancel
              </Button>

              <Button
                  className={classes.submitBtn}
                  onClick={handleSubmit}
              >
                  Save
              </Button>
          </Grid>

        </Grid>
      </Page>
    </div>
  );
};
