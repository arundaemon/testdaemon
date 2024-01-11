import { useState, memo, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import PoDetail from "../components/schedule/PoDetail";
import ProductDetails from "../components/schedule/ProductDetails";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
  Checkbox,
  ListItemText,
  TextField,
  Grid,
  Typography,
  Button,
} from "@mui/material";
import { generateSchedule, getMonths } from "../utils/utils";
import moment from "moment";
import { scheduleActions } from "../redux/reducers/invoiceSchdeuler";
import toast from "react-hot-toast";
import InputDatePicker from "../theme/form/InputDatePicker";
import { useNavigate } from "react-router-dom";
import CollectionSchedule from "../components/schedule/CollectionSchedule";
import { getMasterList } from "../config/services/gateway";

import { getUserData } from '../helper/randomFunction/localStorage'
import Page from "../components/Page";
import { ReactComponent as DropDownIcon } from "../assets/icons/icon-select-dropdown.svg"
import useMediaQuery from "@mui/material/useMediaQuery";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      // width: 250,
    },
  },
};

const CreateSchedule = () => {
  const invoiceSchedule = useSelector((state) => state.invoiceSchedule);
  const [intervalList, setIntervalList] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const freeMonthsCount = invoiceSchedule?.freeMonthsCount;
  let monthsList = [];
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

  useEffect(() => {
    if(isMobile) document.body.classList.add('crm-page-header-plain');
  }, [isMobile]);

  if (Object.keys(invoiceSchedule).length < 1) {
    navigate("/authorised/generate-schedule");
  }
  //console.log("Schedule ", invoiceSchedule);

  if (invoiceSchedule.billingStartDate) {
    let startDate = new Date(moment(invoiceSchedule.billingStartDate));
    /* let day = startDate.getDate()
        if(day > 20){
            const year = startDate.getFullYear();
            const month = startDate.getMonth();
            startDate = new Date(year, month + 1, 1);
        }  */
    const duration = invoiceSchedule?.poDetail?.agreementTenure ?? 0;
    const endDate = moment(startDate).add(duration, "months");
    monthsList = getMonths(moment(startDate), endDate);
    monthsList.pop();
  }

  const handleChange = (event, type, refObj = null, refIndex = null) => {
    let val = event.target ? event.target.value : event;
    switch (type) {
      case "freeMonths":
        if (val.length <= freeMonthsCount) {
          dispatch(scheduleActions.updateFreeMonths({ value: val }));
        } else {
          toast.dismiss();
          toast.error("Free Months Exceeded");
        }
        break;
      case "billingStartDate":
        dispatch(scheduleActions.updateFreeMonths({ value: [] }));
        dispatch(
          scheduleActions.updateBillingDate({
            value: moment(val).format("YYYY-MM-DD"),
          })
        );
        break;
      case "scheduleInterval":
        let masterObj = intervalList.find((obj) => obj.id === val);
        dispatch(
          scheduleActions.updateScheduleInterval({
            value: masterObj.month_count,
            id: val,
          })
        );
        break;
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
        //console.log(schedule,skipMonths)
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
        break;
    }
  };

  const validation = () => {
    if(!invoiceSchedule.billingStartDate){
      toast.error("Please select billing start date!")
      return false
    } else if(!invoiceSchedule.scheduleIntervalId){
      toast.error("Please select invoice schedule mode!")
      return false
    } else {return true}
  }

  const handleStepOne = () => {
    if(!validation()) return

    let startDate = new Date(invoiceSchedule.billingStartDate);
    const duration = invoiceSchedule?.poDetail?.agreementTenure ?? 0;
    /* let day = startDate.getDate()
        if(day > 20){
            const year = startDate.getFullYear();
            const month = startDate.getMonth();
            startDate = new Date(year, month + 1, 1);
        } */
    const endDate = new Date(
      moment(startDate).add(duration, "months").subtract(1, "days")
    );

    const agreementTenure = invoiceSchedule?.poDetail?.agreementTenure ?? 0
    const payableMonths = invoiceSchedule?.poDetail?.agreementPayableMonth ?? 0
    const intervalMonths = invoiceSchedule.scheduleInterval ?? 0;
    const skipMonths = JSON.parse(JSON.stringify(invoiceSchedule.freeMonths));
    skipMonths.sort();
    let masterObj = intervalList.find(obj => obj.id === invoiceSchedule.scheduleIntervalId)
    let schedule;
    if(masterObj.is_upfront){
      schedule = [
        {
          start: moment(startDate).format('YYYY-MM-DD'),
          products: JSON.parse(JSON.stringify(invoiceSchedule.orderList)).map(obj => {obj.productCost = parseFloat(obj.productItemImpPrice); return obj}),
          end:moment(endDate).format('YYYY-MM-DD'),
          freeMonths: skipMonths.length,
          amount: invoiceSchedule.orderList.reduce((partialSum,obj) => partialSum + parseFloat(obj.productItemImpPrice),0),
          errorFlag:false
        }
      ]
    }else{
      schedule = generateSchedule(
        startDate,
        endDate,
        intervalMonths,
        skipMonths,
        JSON.parse(JSON.stringify(invoiceSchedule.orderList))
      );
    }
    //console.log(skipMonths,Math.ceil(agreementTenure - payableMonths))
    if(skipMonths.length < Math.floor(agreementTenure - payableMonths)){
      toast.dismiss()
      toast.error('Please select Free Months')
    }else{
      dispatch(
        scheduleActions.updateInvoiceSchedule({
          invoiceSchedule: schedule,
          step: 2,
        })
      );
    }   
  };

  const handleFirstStepReturn = (schedule) => {
    dispatch(
      scheduleActions.updateInvoiceSchedule({
        invoiceSchedule: schedule,
        step: 1,
      })
    );
  }

  useEffect(() => {
    let params = {
      uuid: getUserData("loginData")?.uuid,
      master_data_type: "payment_schedule",
      status: [1],
    };
    getMasterList(params)
      .then((res) => {
        //console.log(res)
        if (res?.data?.master_data_list) {
          let list = res.data.master_data_list.sort(
            (a, b) => b.month_count - a.month_count
          );
          setIntervalList([...list]);
        }
      })
      .catch((err) => {
        console.log("Master List Error", err);
      });
  }, []);
  return (
    <Page title="Create Schedule | CRM">
      <Box className="crm-page-wrapper crm-create-schedule-page">
        <>
          {invoiceSchedule.step == 2 ? (
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
              />
            </>
          ) : (
            Object.keys(invoiceSchedule).length > 0 && (
              <>
                <PoDetail />
                <ProductDetails />
                <Box className="crm-page-schedule-billing-container">
                  <Typography component={"h2"}>Start Billing Date</Typography>
                  <Grid container spacing={2.5}>
                    <Grid item xs={12} md={6} lg={4}>
                      <FormControl className="crm-form-control">
                        <label className="crm-page-schedule-billing-form-label">Billing Start Date *</label>
                        <InputDatePicker
                          className="crm-form-input dark"
                          handleChange={(date) =>
                            handleChange(date, "billingStartDate")
                          }
                          format={"yyyy-MM-dd"}
                          minDate={
                            new Date(
                              moment(invoiceSchedule?.poDetail?.agreementStartDate)
                                .subtract(1, "days")
                                .format("YYYY-MM-DD")
                            )
                          }
                          value={invoiceSchedule.billingStartDate ?? ""}
                          //helperText={'Billing Start Date'}
                          disableLabel={true}
                        />
                      </FormControl>
                    </Grid>
                    
                    {freeMonthsCount > 0 ? (
                      <Grid item xs={12} md={6} lg={4}>
                        <FormControl className="crm-form-control">
                          <label className="crm-page-schedule-billing-form-label">Set Free Months</label>
                          <Select
                            className="crm-form-select2 crm-form-mui-select dark"
                            labelId="demo-multiple-checkbox-label"
                            id="demo-multiple-checkbox"
                            multiple
                            //disabled={freeMonthsCount == 0}
                            value={invoiceSchedule.freeMonths ?? []}
                            onChange={(e) => handleChange(e, "freeMonths")}
                            input={<OutlinedInput label="Set Free Months" />}
                            renderValue={(selected) =>
                              selected
                                .map((val) => moment(val).format("MMMM YYYY"))
                                .join(", ")
                            }
                            MenuProps={MenuProps}
                            IconComponent={DropDownIcon}
                          >
                            {monthsList.map((obj) => (
                              <MenuItem key={obj.dt} value={obj.dt}>
                                <Checkbox
                                  checked={
                                    invoiceSchedule.freeMonths
                                      ? invoiceSchedule?.freeMonths.indexOf(obj.dt) >
                                        -1
                                      : false
                                  }
                                />
                                <ListItemText primary={obj.label} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    ) : (
                      ""
                    )}
                    
                  </Grid>
                </Box>

                <Box className="crm-page-schedule-billing-container">
                  <Typography component={"h2"}>Set Invoice & Collection Schedule Mode</Typography>
                  <Grid container spacing={2.5}>
                    <Grid item xs={12} md={6} lg={4}>
                      <FormControl className="crm-form-control">
                        <label id="schedule-interval-label" className="crm-page-schedule-billing-form-label">
                          Invoice Schedule Mode *
                        </label>
                        <Select
                          className="crm-form-select2 crm-form-mui-select dark"
                          labelId="schedule-interval-label"
                          id="demo-multiple-checkbox"
                          value={invoiceSchedule.scheduleIntervalId}
                          onChange={(e) => handleChange(e, "scheduleInterval")}
                          input={<OutlinedInput label="Invoice Schedule Mode" />}
                          MenuProps={MenuProps}
                          IconComponent={DropDownIcon}
                        >
                          {intervalList
                            .filter(
                              (obj) =>
                                obj.month_count <=
                                parseInt(invoiceSchedule?.poDetail?.agreementTenure)
                            )
                            .map((obj) => (
                              <MenuItem key={obj.name} value={obj.id}>
                                <ListItemText primary={obj.name} />
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Box>

                <Box className="crm-form-actions text-right">
                  <Button className="crm-btn crm-btn-lg" onClick={handleStepOne}>Save</Button>
                </Box>
              </>
            )
          )}
        </>
      </Box>
    </Page>
  );
};

export default memo(CreateSchedule);
