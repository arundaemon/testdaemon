import {
  Box,
  Button,
  Checkbox,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { scheduleActions } from "../../redux/reducers/invoiceSchdeuler";
import toast from "react-hot-toast";
import moment from "moment";
import InputDatePicker from "../../theme/form/InputDatePicker";
import { getUserData } from "../../helper/randomFunction/localStorage";
import { getMasterList, getReasonMasterList,uploadFileData } from "../../config/services/gateway";
import { distributeProductAmount, generateSchedule, getMonths } from "../../utils/utils";
import { ReactComponent as DropDownIcon } from "../../assets/icons/icon-select-dropdown.svg"

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
const RaiseNPS = ({intervalList, isApproval}) => {
  const invoiceSchedule = useSelector((state) => state.invoiceSchedule);
  const [reasonList,setReasonList] = useState([])
  const [uploadData, setUpload] = useState(null);
  //const [npsDate,setNpsDate] = useState(invoiceSchedule?.nps_effective_date ?? null)
  const dispatch = useDispatch();
  
  //console.log(invoiceSchedule);
  let freeMonthsCount = invoiceSchedule?.freeMonthsCount;
  let monthsList = [];
  let pastMonths = []
  let totalAmount = invoiceSchedule?.invoice_collection_schedule_details?.invoice_schedule_month_details?.filter(obj => [1,4,null,''].indexOf(obj.invoice_status) > -1).reduce(
    (partialSum, obj) =>
      partialSum + parseFloat(obj.schedule_amount),
    0
  )
  let invoicedMonths = invoiceSchedule?.invoice_collection_schedule_details?.invoice_schedule_month_details?.filter(obj => [2,3].indexOf(obj.invoice_status) > -1).reduce(
    (partialSum, obj) =>
      partialSum + parseFloat(obj.product_details[0].total_month),
    0
  )
  //console.log(invoicedMonths,totalAmount)

  if (invoiceSchedule?.oldBillingDate) {
    let startDate = new Date(moment(invoiceSchedule?.oldBillingDate));
    /* let day = startDate.getDate()
        if(day > 20){
            const year = startDate.getFullYear();
            const month = startDate.getMonth();
            startDate = new Date(year, month + 1, 1);
        }  */
    const duration = invoiceSchedule?.poDetail?.agreementTenure ?? 0;
    const endDate = moment(startDate).add(duration, "months");
    const today = moment(new Date())
    monthsList = getMonths(moment(startDate), endDate);
    monthsList.pop();
    if(today > moment(startDate)){
      pastMonths = getMonths(moment(startDate),today)
    }else{
      pastMonths = getMonths(today,moment(startDate))
    }

  }

  if(invoiceSchedule.billingStartDate){
    let startDate = new Date(moment(invoiceSchedule.billingStartDate));
    //let billingStartDate = new Date(moment(invoiceSchedule.billingStartDate))
    /* let day = startDate.getDate()
        if(day > 20){
            const year = startDate.getFullYear();
            const month = startDate.getMonth();
            startDate = new Date(year, month + 1, 1);
        }  */
    const duration = invoiceSchedule?.poDetail?.agreementTenure ? invoiceSchedule?.poDetail?.agreementTenure - pastMonths.length:  0;
    const endDate = moment(startDate).add(duration, "months");
    //const today = moment(invoiceSchedule.billingStartDate)
    monthsList = getMonths(moment(startDate), endDate);
    monthsList.pop();    
  }
  const pastFreeMonths = pastMonths.map(obj => obj.dt).filter(obj => invoiceSchedule.freeMonths.indexOf(obj) > -1)
  freeMonthsCount = freeMonthsCount - pastFreeMonths.length
  //console.log(freeMonthsCount)
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
        //setNpsDate(null)
        dispatch(
          scheduleActions.updateBillingDate({
            value: moment(val).format("YYYY-MM-DD"),
          })
        );
        break;
      case "scheduleInterval":
        let masterObj = intervalList.find((obj) => obj.id === val);
        //console.log(masterObj)
        dispatch(
          scheduleActions.updateScheduleInterval({
            value: masterObj.month_count,
            id: val,
            isChanged: isApproval? true:false,
          })
        );
        break;
      case "npsDate":
        dispatch(scheduleActions.updateFreeMonths({ value: [] }));
        //setNpsDate(moment(val).format("YYYY-MM-DD"))
        dispatch(
          scheduleActions.updateNpsDate({
            value: moment(val).format("YYYY-MM-DD"),
          })
        );
        break;
      case "npsReason":
        dispatch(scheduleActions.updateNpsReason({ id: val }));
        break;
      case 'npsRemarks':
        dispatch(scheduleActions.updateNpsRemarks({ value: val }));
        break;
      default:
        break;
    }
  };

  const uploadPdf = async (e) => {
    const fileName = e.target.files[0].name
    const fileExtension = fileName.replace(/^.*\./, "")
    let file = e.target.files[0];
    if (fileExtension === 'pdf' || fileExtension === 'jpg' || fileExtension === 'png') {
      const formData = new FormData();
      formData.append("image", file);
      try {
        let res = await uploadFileData(formData);
        if (res?.data?.responseData?.result) {
          let uploadUrl = res?.data?.responseData?.result
          setUpload(uploadUrl);
          toast.success('File Added successfully')
        
        if(uploadUrl){
          dispatch(scheduleActions.updateNpsDocument({ nps_document_url: uploadUrl }));
        }else{
          toast.error("**Error in File Upload**")
          // return false
        }
        }
      } catch (err) {
        console.error(err);
      }

    }
    else {
      toast.error('File format not supported')
      return false
    }

  };

  const handleUploadFile = (e) => {
    if (e.target?.files[0]?.type === 'application/vnd.ms-excel' || e.target?.files[0]?.type === 'text/csv') {
      toast.error('Invalid file type');
      setUpload(null)
    }
    else {
      uploadPdf(e)
    }
  }
  const validation = () => {
    if(!invoiceSchedule.nps_effective_date){
        toast.error("Please select NPS Effective Date!")
        return false
    }else if(!invoiceSchedule.scheduleIntervalId){
        toast.error("Please select Invoice Schedule Mode")
        return false
    }else if(!invoiceSchedule.nps_reason_id){
        toast.error("Please select NPS Reason")
        return false
    }else if(!invoiceSchedule.nps_remarks){
        toast.error("Please enter Remarks")
        return false
    }else if(!invoiceSchedule.nps_document_url){
        toast.error("Please upload NPS Document")
        return false
    }else {
        return true
    }
}
  const createNpsSchedule = () => {
    let isValid = validation()
    if(!isValid) return

    let totalTenure = invoiceSchedule?.poDetail?.agreementTenure ? invoiceSchedule?.poDetail?.agreementTenure - invoicedMonths : 0
    let startDate = moment(invoiceSchedule.oldBillingDate).format('YYYY-MM-DD') > moment(invoiceSchedule.billingStartDate).format('YYYY-MM-DD') ? new Date(invoiceSchedule.oldBillingDate) : new Date(invoiceSchedule.billingStartDate);
    const duration = totalTenure
    /* let day = startDate.getDate()
        if(day > 20){
            const year = startDate.getFullYear();
            const month = startDate.getMonth();
            startDate = new Date(year, month + 1, 1);
        } */
    const endDate = new Date(
      moment(startDate).add(duration, "months").subtract(1, "days")
    );

    const agreementTenure = totalTenure
    const payableMonths = invoiceSchedule?.poDetail?.agreementPayableMonth ?? 0
    const intervalMonths = invoiceSchedule.scheduleInterval ?? 0;
    const skipMonths = JSON.parse(JSON.stringify(invoiceSchedule.freeMonths));
    skipMonths.sort();
    let masterObj = intervalList.find(obj => obj.id === invoiceSchedule.scheduleIntervalId)
    let schedule;
    let productList = JSON.parse(JSON.stringify(invoiceSchedule.orderList))
    if(masterObj.is_upfront){
      let paidMonths = moment(endDate).add(1,'days').diff(moment(startDate),'months') - skipMonths.length
      let totalAmount = invoiceSchedule.orderList.reduce((partialSum,obj) => partialSum + parseFloat(obj.productItemImpPrice),0);
      schedule = [
        {
          start: moment(startDate).format('YYYY-MM-DD'),
          products: productList.map(obj => {obj.productCost = parseFloat(obj.productItemImpPrice); return obj}),
          end:moment(endDate).format('YYYY-MM-DD'),
          freeMonths: skipMonths.length,
          amount: totalAmount,
          errorFlag:false
        }
      ]
      schedule = distributeProductAmount(schedule,productList)
    }else{
      schedule = generateSchedule(
        startDate,
        endDate,
        intervalMonths,
        skipMonths,
        productList
      );
    }

    if(skipMonths.length < (agreementTenure - payableMonths)){
      toast.dismiss()
      toast.error('Please select Free Months')
    }else{      
      if(moment(invoiceSchedule.oldBillingDate).format('YYYY-MM-DD') > moment(invoiceSchedule.billingStartDate).format('YYYY-MM-DD')){
        schedule.unshift({
          start: moment(invoiceSchedule.billingStartDate).format('YYYY-MM-DD'),
          products: [],
          end:moment(invoiceSchedule.oldBillingDate).subtract(1,'days').format('YYYY-MM-DD'),
          freeMonths: 0,
          amount: 0,
          errorFlag:false
        })
      }
      dispatch(
        scheduleActions.updateInvoiceSchedule({
          invoiceSchedule: schedule,
          step: 2,
        })
      );
    }
  }

  useEffect(() => {
    
    let paramObj = {
      uuid: getUserData("loginData")?.uuid,
      status: [1],
      reason_type:['NPS']
    }
    getReasonMasterList(paramObj)
    .then(
      res => {
        //console.log(res)
        if(res.data.reason_details){
          setReasonList([...res.data.reason_details])
        }
      }
    )
    .catch(
      err => {
        console.log(err)
        setReasonList([])
      }
    )
  }, []);
  return (
    <Grid className='crm-schedule-list-container'>
      <Box className="crm-page-schedule-billing-container">
        <Typography component={"h2"}>Billing Details</Typography>
        <Grid container spacing={2.5}>            
          <Grid item xs={12} md={6} lg={4}>
            <FormControl className="crm-form-control">
              <label className="crm-page-schedule-billing-form-label">Billing Start Date</label>
              <InputDatePicker
                className="crm-form-input dark"
                handleChange={(date) => handleChange(date, "billingStartDate")}
                format={"yyyy-MM-dd"}
                //disabled
                minDate={
                  new Date(
                    moment(invoiceSchedule?.poDetail?.agreementStartDate)
                      .subtract(1, "days")
                      .format("YYYY-MM-DD")
                  )
                }
                value={invoiceSchedule.billingStartDate ?? ""}
                //helperText={'Billing Start Date'}
                //labelName={"Billing Start Date"}
                disableLabel={true}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <FormControl className="crm-form-control">
              <label className="crm-page-schedule-billing-form-label">NPS Effective Date</label>
              <InputDatePicker
                className="crm-form-input dark"
                handleChange={(date) => handleChange(date, "npsDate")}
                format={"yyyy-MM-dd"}
                minDate={new Date()}
                value={invoiceSchedule.nps_effective_date ?? ""}
                //helperText={'Billing Start Date'}
                //labelName={"NPS Effective Date"}
                disableLabel={true}
              />
            </FormControl>
          </Grid>
          { freeMonthsCount > 0 ? ( 
              <Grid item xs={12} md={6} lg={4} style={{paddingTop:'0px'}}>
                <FormControl className="crm-form-control">
                  <label id="demo-multiple-checkbox-label" className="crm-page-schedule-billing-form-label">Set Free Months</label>
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
                      <MenuItem key={obj.dt} value={obj.dt} 
                      //disabled={pastMonths.map(obj => obj.dt).indexOf(obj.dt) > -1}
                      >
                        <Checkbox
                          checked={
                            invoiceSchedule.freeMonths
                              ? invoiceSchedule?.freeMonths.indexOf(obj.dt) > -1
                              : false
                          }
                          disabled={pastMonths.map(obj => obj.dt).indexOf(obj.dt) > -1}                 
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
      <Box className="crm-page-schedule-billing-container" style={{paddingTop:'20px'}}>
        <Typography  component={"h2"}>Set Invoice & Collection Schedule Mode</Typography>
        <Grid container spacing={2.5}>
          <Grid item xs={12} md={6} lg={4}>
            <FormControl className="crm-form-control">
              <label className="crm-page-schedule-billing-form-label">Invoice Schedule Mode *</label>
              <Select
                className="crm-form-select2 crm-form-mui-select dark"
                labelId="demo-multiple-checkbox-label"
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
          <Grid item xs={12} md={6} lg={4}>
            <FormControl className="crm-form-control">
              <label className="crm-page-schedule-billing-form-label">NPS Document (PDF/Image)</label>
              <TextField
                autoComplete="off"
                disabled
                className="crm-form-input dark"
                type="upload"
                placeholder={uploadData ? uploadData?.name : "Upload here"}
                value={invoiceSchedule?.nps_document_url?.split("_")?.pop()}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      component="label"
                      className="crm-form-input-upload"
                    >
                      <input
                        styles={{ display: "none" }}
                        type="file"
                        hidden
                        onChange={(e) => handleUploadFile(e)}
                      />
                      Browse
                    </IconButton>
                  ),
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <FormControl className="crm-form-control">
              <label className="crm-page-schedule-billing-form-label">NPS Reason</label>
              <Select
                className="crm-form-select2 crm-form-mui-select dark"
                labelId="nps-reason-label"
                id="nps-reason"
                value={invoiceSchedule.nps_reason_id}
                onChange={(e) => handleChange(e, "npsReason")}
                input={<OutlinedInput label="NPS Reason" />}
                MenuProps={MenuProps}
                IconComponent={DropDownIcon}
              >
                {reasonList
                  .map((obj) => (
                    <MenuItem key={obj.reason} value={obj.reason_id}>
                      <ListItemText primary={obj.reason} />
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <FormControl className="crm-form-control">
              <label className="crm-page-schedule-billing-form-label">Remarks</label>
              <textarea
                className="crm-form-input-textarea dark"
                id="outlined-multiline-static"
                //label="Remarks"
                multiline
                rows={4}
                sx={12}
                value={invoiceSchedule.nps_remarks}
                onChange={(e) => handleChange(e, "npsRemarks")}
              />
            </FormControl>
          </Grid>
            
        </Grid>
          
      </Box>
      <Box className="crm-form-actions text-right">
        <Button className="crm-btn crm-btn-lg" onClick={createNpsSchedule}>
          Save
        </Button>
      </Box>
    </Grid>
  );
};

export default memo(RaiseNPS);
