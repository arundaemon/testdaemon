import { memo, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getImplementationById } from "../config/services/implementationForm";
import { useDispatch, useSelector } from "react-redux";
import { scheduleActions } from "../redux/reducers/invoiceSchdeuler";
import PoDetail from "../components/schedule/PoDetail";
import ProductDetails from "../components/schedule/ProductDetails";
import CollectionDetail from "../components/schedule/CollectionDetail";
import RaiseNPS from "../components/schedule/RaiseNPS";
import { getUserData } from "../helper/randomFunction/localStorage";
import { getMasterList } from "../config/services/gateway";
import CollectionSchedule from "../components/schedule/CollectionSchedule";
import { generateSchedule } from "../utils/utils";
import Page from "../components/Page";
import { Box, Breadcrumbs, Typography } from "@mui/material";
import IconBreadcrumbArrow from "./../assets/icons/icon-breadcrumb-arrow.svg";
import useMediaQuery from "@mui/material/useMediaQuery";
import NPSDetail from "./NPSDetail";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      marginTop: '2px'
      // width: 250,
    },
  },
};
const ScheduleDetail = ({rowObj, isApprovalFlow}) => {
  const [intervalList, setIntervalList] = useState([]);
  const [implementationObj, setImplementation] = useState(null);
  const dispatch = useDispatch();
  const invoiceSchedule = useSelector((state) => state.invoiceSchedule);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));
  //console.log(invoiceSchedule)
  useEffect(() => {
    if(isMobile) document.body.classList.add('crm-page-header-plain');
  }, [isMobile]);

  const handleChange = (event, type, refObj = null, refIndex = null) => {
    let val = event.target ? event.target.value : event;
    switch (type) {
      case "collectionInterval":
        let masterObj1 = intervalList.find((obj) => obj.id === val);
        const skipMonths = JSON.parse(
          JSON.stringify(invoiceSchedule.freeMonths)
        );
        skipMonths.sort();
        let schedule = generateSchedule(
          refObj.start,
          refObj.end,
          masterObj1.month_count,
          skipMonths,
          refObj,
          true
        );
        dispatch(
          scheduleActions.updateCollectionScheduleInterval({
            index: refIndex,
            value: masterObj1.month_count,
            id: val,
            collectionSchedule: schedule,
          })
        );
        break;
      default:
        console.log(type, val);
        break;
    }
  };

  useEffect(()=> {
    if(rowObj!==undefined) {
      const invoiceScheduleObj = rowObj?.invoice_collection_schedule_details?.invoice_schedule_month_details
      const finalInvoiceSchule = invoiceScheduleObj?.map((obj)=> 
      {
          return {
            start:obj?.schedule_from,
            end:obj?.schedule_to,
            collectionIntervalId:obj?.collection_schedule_month_details[0]?.collection_schedule_frequency_id,
            amount:obj?.schedule_amount,
            products: obj.product_details.map(productObj => {
                return {
                    productItemRefId: productObj.package_id,
                    productCode: productObj.product_code,
                    productItemCategory: productObj?.product_type,
                    no_of_classroom: 2,
                    start: obj.schedule_from,
                    end: obj.schedule_to,
                    implementedUnit: productObj?.no_of_licence,
                    productItemQuantity: productObj?.product_quantity ?? 0,
                }
            }),
            collectionSchedule: obj.collection_schedule_month_details.map(collectionObj => {
                return {
                    collectionIntervalId: obj.collection_schedule_frequency_id,
                    start: collectionObj.schedule_from,
                    end: collectionObj.schedule_to,
                    amount: collectionObj.schedule_amount,
                    no_of_units: "",
                    is_freezed: 1,
                    schedule_status: 1,
                    status: 1
                }
            })
          }
      })

      let obj={
        schoolCode: rowObj?.school_code,
        schoolCityName: rowObj?.schoolCityName,
        schoolStateCode: rowObj?.state_code,
        purchaseOrderCode: rowObj?.po_code,
        quotationCode: rowObj?.quotation_code,
        freeMonths: JSON.parse(rowObj?.invoice_collection_schedule_details?.free_months),
        freeMonthsCount:rowObj?.freeMonthsCount,
        billingStartDate:rowObj?.billing_start_date,
        nps_effective_date:rowObj?.nps_effective_date ?? rowObj?.nps_details?.nps_effective_date,
        nps_reason_id:rowObj?.nps_details?.nps_reason_id,
        nps_document_url:rowObj?.nps_details?.nps_document_url,
        nps_remarks:rowObj?.nps_details?.nps_remarks,
        scheduleIntervalId: rowObj?.invoice_collection_schedule_details?.invoice_schedule_frequency_id,
        invoice_collection_schedule_details: rowObj?.invoice_collection_schedule_details,
        impFormNumber: rowObj?.implementation_form_id,
        implementation_form_id: rowObj?.implementation_form_id,
        productDetails: rowObj?.productDetails,
        type: "view",
        step: 1,
        invoiceSchedule: finalInvoiceSchule,
        isApproval: true,
        scheduleObj: rowObj,
        nps_details: rowObj?.nps_details,
      }  

      dispatch(scheduleActions.init({obj:obj}))
    }
  },[rowObj])


  useEffect(() => {
    if(invoiceSchedule?.implementation_form_id )
    {
      getImplementationById(invoiceSchedule.implementation_form_id)
      .then((res) => {
        if (res.result && res.result.length > 0 ) {
          setImplementation(res.result[0]);
          if(isApprovalFlow!==true){
              dispatch(
              scheduleActions.init({
                obj: {
                  ...res.result[0],
                  ...JSON.parse(JSON.stringify(invoiceSchedule)),
                },
              })
            )
          }
          dispatch(
            scheduleActions.updateFreeMonths({
              value: JSON.parse(
                invoiceSchedule.invoice_collection_schedule_details.free_months
              ),
            })
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
    let params = {
      uuid: getUserData("loginData")?.uuid,
      master_data_type: "payment_schedule",
      status: [1],
    };
    getMasterList(params)
      .then((res) => {
        if (res?.data?.master_data_list) {
          let list = res.data.master_data_list.sort(
            (a, b) => b.month_count - a.month_count
          );
          setIntervalList([...list]);          
        }
      })
      .catch((err) => {
        console.log("Master List Error", err);
      });}
  }, [invoiceSchedule?.implementation_form_id]);

  useEffect(() => {
    let masterObj = intervalList.find((obj) => obj.id === invoiceSchedule.scheduleIntervalId);
    if(masterObj){
        dispatch(scheduleActions.updateScheduleInterval({
            value: masterObj.month_count,
            id: masterObj.id,
        }))
    }
            
  },[intervalList])

  const handleFirstStepReturn = (schedule) => {
    dispatch(
      scheduleActions.updateInvoiceSchedule({
        invoiceSchedule: schedule,
        step: 1,
      })
    );
  }

  return (
    <Page title="Schedule Detail | CRM">
      {
        (!isMobile && !rowObj)
        ? <Breadcrumbs
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
                to="/authorised/schedule-list"
                className="crm-breadcrumbs-item breadcrumb-link"
                
              >
                Details
              </Link>
              <Typography
                key="3"
                component="span"
                className="crm-breadcrumbs-item breadcrumb-active"
              >
                {
                  (invoiceSchedule.step == 2) ? 'Modify' : 'View Payment'
                }
                
              </Typography>
            </Breadcrumbs>
          : null
      }
      <Box className="crm-page-wrapper crm-create-schedule-page">
        {
          implementationObj ? (
          <>
            {invoiceSchedule.type === "view" && (
              <>
                <PoDetail />
                <ProductDetails />
                <NPSDetail />
                <CollectionDetail />
              </>
            )}
            {invoiceSchedule.type === "edit" &&
              (invoiceSchedule.step == 2 ? (
                <>
                  <CollectionSchedule
                    invoiceObj={invoiceSchedule}
                    scheduleInterval={invoiceSchedule.scheduleInterval}
                    scheduleList={JSON.parse(
                      JSON.stringify(invoiceSchedule.invoiceSchedule)
                    )}
                    MenuProps={MenuProps}
                    intervalList={intervalList}
                    handleChange={handleChange}
                    handleFirstStepReturn={handleFirstStepReturn}
                    submitText={isApprovalFlow ? "Save":"Submit"}
                  />
                </>
              ) : (
                <>
                  <PoDetail />
                  <ProductDetails />
                  <RaiseNPS intervalList={intervalList} isApproval={isApprovalFlow}/>
                </>
              ))}
          </>
          ) : (
            <>Unable to fetch the Implementation Details</>
          )
        }
      </Box>
    </Page>
  )
    
};

export default memo(ScheduleDetail);
