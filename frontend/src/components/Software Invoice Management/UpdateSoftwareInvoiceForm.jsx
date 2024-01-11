import React, { createContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import SchoolDetails from './softwareInvoiceDetails/SchoolDetails';
import { Accordion, AccordionDetails, AccordionSummary, Button, Divider, Typography } from '@mui/material';
import ShipOrBillToAccordion from './softwareInvoiceDetails/ShipOrBillToAccordion';
import { useStyles } from "../../css/HardwareInvoice-css";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import _ from 'lodash';
import { updateInvoiceDetails } from '../../config/services/packageBundle';
import { getUserData } from '../../helper/randomFunction/localStorage';
import toast from 'react-hot-toast';
import InvoiceAccordionDetail from '../Hardware Invoice Management/Accordion/InvoiceAccordionDetail';
import InvoiceDetails from './softwareInvoiceDetails/InvoiceDetails';

export const SoftwareContext = createContext()

const UpdateSoftwareInvoiceForm = () => {
  const [softwareInvoiceData, setSoftwareInvoiceData] = useState({})
  let location = useLocation();
  const classes = useStyles();
  const loginData = getUserData('loginData')
  const uuid = loginData?.uuid
  const navigate = useNavigate()
  let { softwareInvoiceRowData } = location?.state
  let accordionsList = [
    { id: 1, title: `Ship to`, content: <ShipOrBillToAccordion type={"edit"} /> },
    { id: 2, title: `Bill to`, content: <ShipOrBillToAccordion type={"noEdit"} /> },
  ];

  const fillInvoicesData = (data) => {
    setSoftwareInvoiceData(data)
    handleDeliveryDetails(data)
  }

  const handleDeliveryDetails = (data) => {
    setSoftwareInvoiceData(prevData => {
      return {
        ..._.cloneDeep(prevData),
        shipTo_details: {
          address: data?.schoolDetails?.address,
          state_name: data?.schoolDetails?.state,
          state_code: data?.schoolDetails?.stateCode,
          pincode: data?.schoolDetails?.pinCode,
          schoolCountryName: data?.schoolDetails?.country,
          schoolCityName: data?.schoolDetails?.city,
        },
        billto_details: {
          address: data?.schoolDetails?.address,
          state_name: data?.schoolDetails?.state,
          state_code: data?.schoolDetails?.stateCode,
          pincode: data?.schoolDetails?.pinCode,
          schoolCountryName: data?.schoolDetails?.country,
          schoolCityName: data?.schoolDetails?.city,
        }
      }
    })
  }

  const handleUpdate = async () => {
    try {
      let params = {
        uuid,
        invoice_status: softwareInvoiceData?.invoice_status,
        invoice_auto_id: softwareInvoiceData?.invoice_auto_id,
        shipping_address: softwareInvoiceData?.shipTo_details?.address,
        shipping_pin_code: softwareInvoiceData?.shipTo_details?.pinCode,
        shipping_state: softwareInvoiceData?.shipTo_details?.state_name
      };
      const res = await updateInvoiceDetails(params);
      let { message, status } = res?.data
      if (status == 1) {
        toast.success(message)
        navigate(`/authorised/update-software-invoice`)
      }
      else if (status == 0) {
        toast.dismiss()
        toast.error(message)
      }
    } catch (err) {
      console.error('An error occurred:', err);
    }
  }

  const handleCancel=()=>{
    navigate("/authorised/update-software-invoice")
  }

  useEffect(() => {
    fillInvoicesData(softwareInvoiceRowData)
  }, [softwareInvoiceRowData])

  return (
    <SoftwareContext.Provider value={{ softwareInvoiceData, setSoftwareInvoiceData }}>

      <div className="tableCardContainer">
        <p className={classes.swHeader}> Update Software Invoice</p>
        <SchoolDetails />
        <InvoiceDetails />
        {accordionsList?.map((item, index) => {
          return (
            <Accordion key={index} className="cm_collapsable" >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                className="table-header"
              >
                <div className={classes.accordionDiv}>
                  <Typography className={classes.accordionTitle}>
                    {item?.title}
                  </Typography>
                </div>
              </AccordionSummary>
              <AccordionDetails className="listing-accordion-details">
                {item?.content}
              </AccordionDetails>
            </Accordion>
          );
        })}
      </div>
      <div className={classes.btnContainer}>
        <Button
          style={{ marginRight: "20px", borderRadius: 4 }}
          onClick={handleCancel}
          variant="outlined"
        >
          Cancel
        </Button>


        <Button
          name={"Save"}
          className={classes.actionBtn}
          onClick={() => {
            handleUpdate()
          }}
          variant="contained"
        >
          Update
        </Button>
      </div>
    </SoftwareContext.Provider>
  )
}
export default UpdateSoftwareInvoiceForm