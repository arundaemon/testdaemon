import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionDetails, AccordionSummary, Button, Typography } from '@mui/material';
import React, { createContext, useEffect, useState } from 'react';
import { useStyles } from "../../css/HardwareInvoice-css";
import AuthorizedSignatoryAccordion from "./Accordion/AuthorizedSignatoryAccordion";
import ConsigneeAccordionDetail from "./Accordion/ConsigneeAccordionDetail";
import InvoiceAccordionDetail from "./Accordion/InvoiceAccordionDetail";
import ProductsAccordion from "./Accordion/ProductsAccordion";
import SchoolAccordionDetails from './Accordion/SchoolAccordionDetails';
import ShippingAccordionDetail from "./Accordion/ShippingAccordionDetail";
import TransportationAccordionDetail from "./Accordion/TransportationAccordionDetail";
import { getImplementationById } from '../../config/services/implementationForm';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { addUpdateHardwareInvoice } from "../../config/services/packageBundle";
import toast from "react-hot-toast";
import OfficeShippingDetails from "./Accordion/OfficeAccordion/OfficeShippingDetails";
import OfficeConsigneeDetails from "./Accordion/OfficeAccordion/OfficeConsigneeDetails";
import { getUserData } from "../../helper/randomFunction/localStorage";
import Page from "../Page";
import moment from "moment";
import { BreadcrumbsFormatter } from "../../utils/utils";
import { ReactComponent as IconDropdown } from "./../../assets/icons/icon-dropdown-2.svg";

export const HardwareContext = createContext()

const FillOrEditInvoiceDetails = () => {
  const [implementationDetails, setImplementationDetails] = useState([]);
  const [hardwareInvoiceData, setHardwareInvoiceData] = useState({})
  const [errorData, setErrorData] = useState({})
  const [errorCheck, setErrorCheck] = useState(false)
  const [search, setSearch] = useState({})
  const [selectedProducts, setSelectedProducts] = useState([])
  const { impFormCode } = useParams()
  const classes = useStyles();
  const navigate = useNavigate()
  let location = useLocation();
  const loginData = getUserData('loginData')
  const uuid = loginData?.uuid
  let currentUrl = window.location.pathname;
  let hardwareInvoiceUrl = currentUrl.includes('/authorised/fill-hardware-invoice')
  let UpdatehardwareInvoiceUrl = currentUrl.includes('/authorised/update-invoice')
  let officeInvoiceUrl = currentUrl.includes('/authorised/fill-office-invoice')
  let updateOfficeInvoiceUrl = currentUrl.includes('/authorised/update-office-invoice');
  const [pageTitle, setPageTitle] = useState('Invoice');

  useEffect(()=> {

    if(currentUrl) {
      if(currentUrl.includes('/authorised/fill-hardware-invoice')) {
        setPageTitle('Generate Hardware Invoice');
      } else if(currentUrl.includes('/authorised/update-invoice')) {
        setPageTitle('Update Hardware Invoice');
      } else if(currentUrl.includes('/authorised/fill-office-invoice')) {
        setPageTitle('Generate Invoice Office To Office');
      } else if(currentUrl.includes('/authorised/update-office-invoice')) {
        setPageTitle('Update Invoice Office To Office');
      } 
    }

  }, [currentUrl]);

  let accordionsList = [
    { id: 1, title: `SCHOOL DETAIL`, content: <SchoolAccordionDetails /> },
    { id: 2, title: `INVOICE DETAIL`, content: <InvoiceAccordionDetail /> },
    { id: 3, title: "SHIPPING DETAILS", content: <ShippingAccordionDetail /> },
    { id: 3, title: "TRANSPORTATION DETAILS", content: <TransportationAccordionDetail /> },
    { id: 4, title: "CONSIGNEE DETAILS", content: <ConsigneeAccordionDetail /> },
    { id: 5, title: "AUTHORIZED SIGNATORY", content: <AuthorizedSignatoryAccordion /> },
    { id: 6, title: "PRODUCTS", content: <ProductsAccordion /> },
  ];

  if (currentUrl.includes('fill-office-invoice') || currentUrl.includes("update-office-invoice")) {
    accordionsList = [
      { id: 1, title: `INVOICE DETAIL`, content: <InvoiceAccordionDetail /> },
      { id: 2, title: "SHIPPING DETAILS", content: <OfficeShippingDetails /> },
      { id: 3, title: "TRANSPORTATION DETAILS", content: <TransportationAccordionDetail /> },
      { id: 4, title: "CONSIGNEE DETAILS", content: <OfficeConsigneeDetails /> },
      { id: 5, title: "PRODUCTS", content: <ProductsAccordion /> },
    ]
  }

  const getImplementationDetails = async (id) => {
    await getImplementationById(id)
      .then((res) => {
        if (res?.result) {
          let details = res?.result?.[0];
          setImplementationDetails(details);
        }
      })
      .catch((err) => console.error(err));
  };

  const validateInvoiceData = (data, type) => {
    const errors = {}
    let requiredString = " is required!"

    if (!data?.particular_details) {
      errors.particular_details = "Atleast 1 Product" + requiredString
    }

    if (!data?.transportation_details?.mode_of_transport) {
      errors.mode_of_transport = "Mode of Transport" + requiredString
    }

    if (!data?.bill_from_office_id) {
      errors.bill_from_office_id = "Select Sender!"
    }

    if (type === "OFFICE") {
      if (!data?.bill_to_office_id) {
        errors.bill_to_office_id = "Select office Address!"
      }
      if (!data?.consignee_details) {
        errors.consignee_details = "Select Office Address!"
      }
    }

    else if (type === "SCHOOL") {
      if (!data?.invoice_date) {
        errors.invoice_date = "Invoice Date" + requiredString
      }

      if (!data?.total_billing_amount) {
        errors.total_billing_amount = "Total Billing Amount" + requiredString
      }

      if (!data.consignee_details?.name) {
        errors.name = "Name" + requiredString
      }

      if (!data.consignee_details?.address) {
        errors.address = "Address" + requiredString
      }

      if (!data.consignee_details?.state_name) {
        errors.state_name = "State" + requiredString
      }

      if (!data.consignee_details?.state_code) {
        errors.state_code = "State Code" + requiredString
      }

      if (!data.billto_details?.state_code) {
        errors.billing_state_code = "Billing State Code" + requiredString
      }

      if (!data.consignee_details?.pincode) {
        errors.pincode = "Pin Code " + requiredString
      }

      if (!data.billto_details?.pincode) {
        errors.billing_pincode = "Billing Pin Code " + requiredString
      }

      if (!data.consignee_details?.contact_number) {
        errors.contact_number = "Contact Number" + requiredString
      }

      if (!data.billto_details?.contact_number) {
        errors.billing_contact_number = "Billing Contact Number" + requiredString
      }
    }
    if (Object.keys(errors)?.length > 0) setErrorCheck(true)
    else setErrorCheck(false)
    return errors;
  }

  const addHardwareInvoices = (e) => {
    let params = hardwareInvoiceData
    let buttonType = e.target.name

    if (hardwareInvoiceUrl || UpdatehardwareInvoiceUrl) params.hw_invoice_for = "SCHOOL"
    if (officeInvoiceUrl || updateOfficeInvoiceUrl) params.hw_invoice_for = "OFFICE"

    if (buttonType === "Save") {
      params = {
        ...params,
        invoice_action: "SAVE",
        group_key: implementationDetails?.productDetails?.[0]?.groupCode,
        uuid
      }
    }
    if (buttonType === "Generate") {
      params = {
        ...params,
        invoice_action: "GENERATE",
        group_key: implementationDetails?.productDetails?.[0]?.groupCode,
        uuid

      }
    }
    let invoiceFor = hardwareInvoiceData?.hw_invoice_for
    let validate = validateInvoiceData(hardwareInvoiceData, invoiceFor)
    if (Object.keys(validate).length > 0) {
      setErrorData(validate)
      setErrorCheck(true)
      toast.dismiss()
      toast.error('Fill all fields')
      return
    }
    setErrorCheck(false)
    addUpdateHardwareInvoice(params)
      .then(res => {
        let { message, status } = res?.data
        if (status == 1) {
          toast.success(message)
          handleAfterSubmit(buttonType)
        }
        else if (status == 0) {
          toast.dismiss()
          toast.error(message)
        }
      })
      .catch(err => {
        toast.dismiss()
        toast.error('Something went wrong!')
        console.error(err, 'Error while adding Invoices')
      })
  }

  const handleAfterSubmit = (type) => {
    if (officeInvoiceUrl || updateOfficeInvoiceUrl) {
      if (type === "Save")
        navigate('/authorised/office-invoices-list-saved')
      else if (type === "Generate")
        navigate('/authorised/office-invoices-list-generated')
      return
    }
    if (hardwareInvoiceUrl||UpdatehardwareInvoiceUrl) {
      if (type === "Generate")
        navigate('/authorised/hardware-invoices-list-generated')
      else if (type === "Save")
        navigate('/authorised/hardware-invoices-list-saved')
      return
    }
    // if (UpdatehardwareInvoiceUrl) {
    //   navigate('/authorised/hardware-invoices-list-saved')
    //   return
    // }
  }

  const handleCancel = () => {
    if (hardwareInvoiceUrl) {
      navigate('/authorised/generate-hardware-invoice')
      return
    }
    if (UpdatehardwareInvoiceUrl) {
      navigate('/authorised/hardware-invoices-list-saved')
      return
    }
    if (updateOfficeInvoiceUrl) {
      navigate('/authorised/office-invoices-list-saved')
      return
    }
  }

  const fillInvoicesData = (data) => {
    let invoiceDate = moment(new Date(data?.invoice_date)?.toDateString()).format('YYYY-MM-DD')
    data.invoice_date = invoiceDate
    setHardwareInvoiceData(data)
    setSelectedProducts(data?.particular_details)
  }

  useEffect(() => {
    validateInvoiceData(hardwareInvoiceData)
  }, [hardwareInvoiceData])

  useEffect(() => {
    getImplementationDetails(impFormCode)
  }, [impFormCode])

  useEffect(() => {
    if (location?.state) {
      let invoiceData = location?.state?.hardwareInvoiceRowData ?? location.state.OfficeInvoiceRowData;
      if (!invoiceData) return
      fillInvoicesData(invoiceData)
    }
  }, [location.state])


  return (
    <Page title="Extramarks | Generate HW Invoice" className="crm-page-wrapper crm-page-listing-container">

      <BreadcrumbsFormatter
        crumbs={[{label: 'Home', route: '/authorised/school-dashboard'}, {label: pageTitle}]}
      />

      <HardwareContext.Provider value={{ implementationDetails, hardwareInvoiceData, setHardwareInvoiceData, selectedProducts, setSelectedProducts, errorData, errorCheck, search }}>
        <div className="crm-page-accordion-type2">
          {accordionsList?.map((item, index) => {
            return (
              <Accordion key={index} className="cm_collapsable crm-page-accordion-container"
                defaultExpanded={index===0} >
                <AccordionSummary
                  expandIcon={<IconDropdown className="" />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                  className="table-header"
                >
                  <div>
                    <Typography className={'crm-page-accordion-title'}>
                      {item?.title}
                    </Typography>
                  </div>
                </AccordionSummary>
                <AccordionDetails className="crm-page-accordion-details">
                  {item?.content}
                </AccordionDetails>
              </Accordion>
            );
          })}


          <div className={classes.btnContainer} style={{marginRight: '0', marginBottom: '24px'}}>
            {officeInvoiceUrl ?
              null
              :
              <Button
                className="crm-btn crm-btn-lg crm-btn-outline mr-1"
                onClick={handleCancel}
              >
                Cancel
              </Button>

            }
            <Button
              name={"Save"}
              className="crm-btn crm-btn-lg mr-1"
              onClick={(e) => {
                addHardwareInvoices(e)
              }}
            >
              {(hardwareInvoiceUrl || officeInvoiceUrl) ? "Save" : "Update"}
            </Button>
            <Button
              name={"Generate"}
              className='crm-btn crm-btn-lg'
              onClick={(e) => {
                addHardwareInvoices(e)
              }}
            >
              Generate
            </Button>
          </div>
        </div>
      </HardwareContext.Provider >
    </Page>
  )
}

export default FillOrEditInvoiceDetails