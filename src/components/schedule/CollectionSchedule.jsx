import { Box, Button, FormControl, Grid, ListItemText, MenuItem, OutlinedInput, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material"
import moment from "moment"
import { memo, useDebugValue, useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useDispatch } from "react-redux"
import { scheduleActions } from "../../redux/reducers/invoiceSchdeuler"
import { salesApprovalAction } from "../../redux/reducers/salesApprovalReducer"
import { getUserData } from "../../helper/randomFunction/localStorage"
import CubeDataset from "../../config/interface"
import { addInvoiceCollectionSchedule } from "../../config/services/gateway"
import { updateScheduleStatus } from "../../config/services/implementationForm"
import { useNavigate } from "react-router-dom"
import { ReactComponent as DropDownIcon } from "./../../assets/icons/icon-select-dropdown.svg"
import { CurrenncyFormatter } from "../../utils/utils"
import useMediaQuery from "@mui/material/useMediaQuery";
import { assignApprovalRequest } from "../../config/services/salesApproval";


const CollectionSchedule = ({invoiceObj,handleChange, MenuProps,intervalList,scheduleList,scheduleInterval, handleFirstStepReturn, submitText="Generate"}) => {
    const [list,setList] = useState([])
    const [errorFlag,setErrorFlag] = useState(true)
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

    const checkDisabled = (collectionObj) => {
        if(!collectionObj){
            return true
        }
        let dateDiff = moment(collectionObj.start).diff(moment(collectionObj.end),'months')
        //console.log(dateDiff,collectionObj.freeMonths)
        if(collectionObj && (collectionObj.amount > 0 || dateDiff != collectionObj.freeMonths)){
            return false
        }else{
            return true
        }
    }

    const handleFunctionCall = (e, scheduleIndex,collectionIndex) => {
        if(invoiceObj?.isApproval === true){
            handleScheduleAmountForApproval(e, scheduleIndex,collectionIndex)
        }else{
            handleScheduleAmount(e, scheduleIndex,collectionIndex)
        }
    }

    const handleScheduleAmount = (e, scheduleIndex,collectionIndex) => {
        let actualAmount = scheduleList[scheduleIndex].amount
        scheduleList[scheduleIndex].collectionSchedule[collectionIndex].amount = e.target.value ? parseFloat(e.target.value):0
        let totalAmount = scheduleList[scheduleIndex].collectionSchedule.reduce(
            (partialSum, obj) => partialSum + obj.amount,
            0
        )
        
        if(totalAmount != actualAmount){
            scheduleList[scheduleIndex]['errorFlag'] = true    
        }else{
            scheduleList[scheduleIndex]['errorFlag'] = false
        }        
        setList([...scheduleList])
    }

    const handleScheduleAmountForApproval = (e, scheduleIndex,collectionIndex) => {
        let actualAmount = list[scheduleIndex].amount
        list[scheduleIndex].collectionSchedule[collectionIndex].amount = e.target.value ? parseFloat(e.target.value):0
        let totalAmount = list[scheduleIndex].collectionSchedule.reduce(
            (partialSum, obj) => partialSum + obj.amount,
            0
        )
        
        if(totalAmount != actualAmount){
            list[scheduleIndex]['errorFlag'] = true    
        }else{
            list[scheduleIndex]['errorFlag'] = false
        }   
        setList([...list])
    }
    
    const handleStepTwoFunctionCall = () => {
        if(invoiceObj?.isApproval){
            toast.success("Information saved successfully!")
            handleStepTwoForApproval()

        }else{
            handleStepTwo()
        }
    }
    const handleStepTwo = async() => {
        let dataObj
        let errorFlag = scheduleList.filter(obj => obj?.errorFlag)
        if(errorFlag.length > 0){
            toast.dismiss();
            toast.error('Collection Amount is not matching with Invoice Amount')
        }else{ 
            let softwareAmount = invoiceObj.orderList.reduce((partialSum,obj) => partialSum + parseFloat(obj.productItemImpPrice),0)
            let hardwareAmount = invoiceObj.hardwareDetails.reduce((partialSum, obj) => partialSum + obj.productItemSalePrice, 0)      
            // let paymentModeMapping = {
            //     "cash": 1,
            //     "demand draft": 2,
            //     "cheque": 3,
            //     "online": 4
            // }
            let payloadObj = {
                uuid: getUserData('loginData')?.uuid,
                request_type:invoiceObj.nps_effective_date ? 'NPS' : 'GENERAL',
                product_codes: [...new Set(invoiceObj.productDetails.map(obj => obj.productCode))],
                schedule_for: 'SW',
                po_code: invoiceObj.purchaseOrderCode,
                quotation_code: invoiceObj.quotationCode,
                implementation_form_id: invoiceObj.impFormNumber,
                school_code: invoiceObj.schoolCode,
                state_code: invoiceObj.schoolStateCode,
                territory_code: invoiceObj?.territoryDetails?.[`${CubeDataset.Territorymappings.territoryCode}`] ?? 'TR002',
                billing_start_date: invoiceObj.billingStartDate,
                billing_date_change_status: moment(invoiceObj.oldBillingDate).format('YYYY-MM-DD') > moment(invoiceObj.billingStartDate).format('YYYY-MM-DD') ? 0 : moment(invoiceObj.oldBillingDate).format('YYYY-MM-DD') < moment(invoiceObj.billingStartDate).format('YYYY-MM-DD') ? 1 : null,
                total_contract_months: invoiceObj.poDetail.agreementTenure,
                total_payable_months: invoiceObj.poDetail.agreementPayableMonth,
                total_contract_amount: softwareAmount + hardwareAmount,
                total_software_invoice_amount: softwareAmount,
                total_hardware_invoice_amount: hardwareAmount,
                user_hierarchy_json: JSON.stringify(invoiceObj.hierarchy),
                status: 1,
                invoice_collection_schedule_details:{
                    invoice_schedule_frequency_id: invoiceObj.scheduleIntervalId,
                    free_months: JSON.stringify(invoiceObj.freeMonths),
                    invoice_schedule_month_details: scheduleList.map(obj => {
                        return {
                            schedule_from: obj.start,
                            schedule_to: obj.end,
                            schedule_amount: obj.amount ?? 0,
                            no_of_units: "",
                            is_freezed: 1,
                            schedule_status: 1,
                            status: 1,
                            product_details: obj.products.map(productObj => {
                                return {
                                    package_id: productObj.productItemRefId,
                                    product_code: productObj.productCode ?? '',
                                    product_type: productObj?.productItemCategory ?? '',
                                    no_of_classroom: productObj?.implementedUnit ? productObj?.implementedUnit : 0,
                                    schedule_from: obj.start,
                                    schedule_to: obj.end,
                                    total_month:moment(obj.end).add(1,'days').diff(moment(obj.start),'months'),
                                    no_of_licence: 0,
                                    product_quantity: productObj?.productItemQuantity ?? 0,
                                    product_total_cost: Math.round((productObj.productCost + Number.EPSILON) * 100) / 100
                                }
                            }),
                            collection_schedule_month_details: obj.collectionSchedule.map(collectionObj => {
                                return {
                                    collection_schedule_frequency_id: obj.collectionIntervalId,
                                    schedule_from: collectionObj.start,
                                    schedule_to: collectionObj.end,
                                    schedule_amount: collectionObj.amount ?? 0,
                                    no_of_units: "",
                                    is_freezed: 1,
                                    schedule_status: 1,
                                    status: 1
                                }
                            })
                        }
                    })                    
                }
            }
            // if(invoiceObj?.poDetail?.advanceDetailsMode.length>0){//discussion required in case of array of object 
            //     payloadObj['advance_payment_details'] = {
            //         total_hw_advance_amount: invoiceObj?.poDetail?.totalAdvanceHardwareAmount.toString(),
            //         total_sw_advance_amount: invoiceObj?.poDetail?.totalAdvanceSoftwareAmount.toString(),
            //         advance_payment_mode: paymentModeMapping[invoiceObj?.poDetail?.advanceDetailsMode[0]?.paymentMode?.toLowerCase()].toString(),
            //         advance_reference_number: invoiceObj?.poDetail?.advanceDetailsMode[0]?.advanceDetailsRefNo,
            //         advance_payment_date:invoiceObj?.poDetail?.advanceDetailsMode[0]?.paymentDate?.split('T')[0]
            //     }
            // }
            
            if(invoiceObj.nps_effective_date){
                payloadObj['nps_details'] = {
                    billing_start_date: invoiceObj.billingStartDate,
                    nps_document_url: invoiceObj.nps_document_url,
                    nps_effective_date: invoiceObj.nps_effective_date,
                    nps_reason_id: invoiceObj.nps_reason_id,
                    nps_remarks: invoiceObj.nps_remarks,
                    approval_rejection_remarks: "",
                    nps_request_status: 1,
                    status: 1
                }
                dataObj = {
                    approvalType: "Invoice & Collection Schedule (Raise NPS)",
                    groupCode: invoiceObj.productDetails[0]?.groupCode,
                    groupName: '',
                    createdByRoleName: getUserData("userData")?.crm_role,
                    referenceCode: `NPS-${invoiceObj.schoolCode}`,
                    statusUpdate: false,
                    data: {
                      ...payloadObj,
                      schoolCityName: invoiceObj?.schoolCityName,
                      nps_document: invoiceObj.nps_document,
                      freeMonthsCount: invoiceObj?.freeMonthsCount,
                      orderList: invoiceObj?.orderList,
                      productDetails:invoiceObj?.productDetails,
                      serviceDetails: invoiceObj?.serviceDetails,
                      createdByName: getUserData("userData")?.name,
                      createdByProfileName: getUserData("userData")?.crm_profile,
                      createdByEmpcode: getUserData("userData")?.employee_code,
                      createdByUuid: getUserData("loginData")?.uuid,
                    },
                  };
                dataObj.data.status="Pending"
            }

            // console.log(payloadObj, '----------payloadObj normal')
            // console.log(dataObj, '---------dataObj')
            //return false
            toast.dismiss()
                addInvoiceCollectionSchedule(payloadObj)
                .then(
                    res => {
                        if(res){
                            updateScheduleStatus({impFormNumber:invoiceObj.impFormNumber})
                            .then(
                                statusRes => {
                                    if(invoiceObj.nps_effective_date){
                                        toast.success('NPS created Successfully')
                                        dataObj.referenceCode = `NPS-${invoiceObj.schoolCode}-${res.data.auto_id}`
                                        assignApprovalRequest(dataObj)
                                        .then(
                                            statusRes => {
                                                console.log(statusRes)
                                                dispatch(scheduleActions.reset())
                                                navigate("/authorised/nps-list");
                                            }
                                        )
                                        .catch(
                                            statusErr => {
                                                console.log(statusErr)
                                                toast.error('Something went wrong creating approval request')
                                            }
                                        )
                                    }else{
                                        toast.success('Schedule Added Successfully')
                                        navigate("/authorised/generate-schedule");
                                    }
                                }
                            )
                            .catch(
                                statusErr => {
                                    console.log(statusErr)
                                    toast.error('Something went wrong while adding the schedule')
                                }
                            )

                        }
                    }
                )
                .catch(
                    err => {
                        console.log(err.message)                    
                        toast.error('Something went wrong while adding the schedule')
                    }
                )
        }
    }

    const handleStepTwoForApproval = async() => {
        let errorFlag = list.filter(obj => obj?.errorFlag)
        if(errorFlag.length > 0){
            toast.dismiss();
            toast.error('Collection Amount is not matching with Invoice Amount')
        }else{            
            let payloadObj = {
                uuid: getUserData('loginData')?.uuid,
                billing_date_change_status: moment(invoiceObj.oldBillingDate).format('YYYY-MM-DD') > moment(invoiceObj.billingStartDate).format('YYYY-MM-DD') ? 0 : moment(invoiceObj.oldBillingDate).format('YYYY-MM-DD') < moment(invoiceObj.billingStartDate).format('YYYY-MM-DD') ? 1 : null,
                invoice_collection_schedule_details:{
                    invoice_schedule_frequency_id: invoiceObj.scheduleIntervalId,
                    free_months: JSON.stringify(invoiceObj.freeMonths),
                    invoice_schedule_month_details: list.map(obj => {
                        return {
                            schedule_from: obj.start,
                            schedule_to: obj.end,
                            schedule_amount: obj.amount ?? 0,
                            no_of_units: "",
                            is_freezed: 1,
                            schedule_status: 1,
                            status: 1,
                            product_details: obj.products.map(productObj => {
                                return {
                                    package_id: productObj.productItemRefId,
                                    product_code: productObj.productCode ?? '',
                                    product_type: productObj?.productItemCategory ?? '',
                                    no_of_classroom: 2,
                                    schedule_from: obj.start,
                                    schedule_to: obj.end,
                                    total_month:moment(obj.end).add(1,'days').diff(moment(obj.start),'months'),
                                    no_of_licence: productObj?.implementedUnit ?? 0,
                                    product_quantity: productObj?.productItemQuantity ?? 0,
                                    product_total_cost: Math.round((productObj.productCost + Number.EPSILON) * 100) / 100
                                }
                            }),
                            collection_schedule_month_details: obj.collectionSchedule.map(collectionObj => {
                                return {
                                    collection_schedule_frequency_id: obj.collectionIntervalId,
                                    schedule_from: collectionObj.start,
                                    schedule_to: collectionObj.end,
                                    schedule_amount: collectionObj.amount ?? 0,
                                    no_of_units: "",
                                    is_freezed: 1,
                                    schedule_status: 1,
                                    status: 1
                                }
                            })
                        }
                    })                    
                },
                nps_details: {
                    billing_start_date: invoiceObj.billingStartDate,
                    nps_document_url: invoiceObj.nps_document_url,
                    nps_effective_date: invoiceObj.nps_effective_date,
                    nps_reason_id: invoiceObj.nps_reason_id,
                    nps_remarks: invoiceObj.nps_remarks,
                    approval_rejection_remarks: "",
                    nps_request_status: 1,
                    status: 1
                }
            }
            // console.log(payloadObj, '-------------payloadObj fore approval')
            dispatch(salesApprovalAction.salesApprovalStateUpdate({payloadObj: payloadObj}))

        }
    }

    useEffect(() => {
        const invoiceScheduleObj = invoiceObj?.invoice_collection_schedule_details?.invoice_schedule_month_details
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
                        productCost: productObj?.product_total_cost
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
        if(invoiceObj?.isApproval === true && (invoiceObj?.scheduleIntervalChange === false || invoiceObj?.scheduleIntervalChange === undefined)){
            setList([...finalInvoiceSchule])
        }else{

        setList([...scheduleList])
        }
    },[scheduleList])

    return (
        <Grid className="crm-schedule-collection-container ">
                <Typography component="h2" className="crm-schedule-collection-heading">Collection Schedule Amount</Typography>
                {
                    !isMobile
                        ?   <TableContainer className="crm-table-container crm-table-md">
                                <Table>
                                    <TableHead className="crm-table-md">
                                        <TableRow key={'collection-header'}>
                                            <TableCell>
                                                Invoice Months
                                            </TableCell>
                                            <TableCell>
                                                Invoice Amount
                                            </TableCell>
                                            <TableCell>
                                                Collection Schedule
                                            </TableCell>
                                            <TableCell>
                                                Collection Months
                                            </TableCell>
                                            <TableCell>
                                                Collection Amount
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            list.map((scheduleObj,scheduleIndex) => (                                    
                                                <>
                                                <TableRow key={`${scheduleObj.start}-${scheduleIndex}`}>
                                                    <TableCell>
                                                        {`${scheduleObj.start} to ${scheduleObj.end}`}
                                                    </TableCell>
                                                    <TableCell>
                                                        {CurrenncyFormatter.format(scheduleObj.amount)}/-
                                                    </TableCell>
                                                    <TableCell>
                                                        <FormControl className="crm-form-control">
                                                            <Select
                                                                className="crm-form-input crm-form-input-mini dark width-130p"
                                                                labelId="demo-multiple-checkbox-label"
                                                                id="demo-multiple-checkbox"
                                                                value={scheduleObj.collectionIntervalId ?? null}
                                                                onChange={(e) => handleChange(e, "collectionInterval",scheduleObj,scheduleIndex)}
                                                                input={<OutlinedInput />}
                                                                MenuProps={MenuProps}
                                                                IconComponent={DropDownIcon}
                                                                // open={true}
                                                                >
                                                                {intervalList.filter(obj => (obj.month_count <= moment(scheduleObj.end).add(1,'days').diff(moment(scheduleObj.start),'months') || obj.month_count == 1) && obj.month_count > 0).map((obj,index) => (
                                                                    <MenuItem key={`${obj.name}-${index}`} value={obj.id}>
                                                                        <ListItemText primary={obj.name} />
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                    </TableCell>
                                                    <TableCell >
                                                        {
                                                            scheduleObj.collectionSchedule && scheduleObj.collectionSchedule.length > 0 && 
                                                            (`${moment(scheduleObj.collectionSchedule[0].start).format('DD MMM, YYYY')} to ${moment(scheduleObj.collectionSchedule[0].end).format('DD MMM, YYYY')}`)
                                                        }
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            className="crm-form-input crm-form-input-mini dark width-130p"
                                                            id="outlined"
                                                            placeholder="Amount"
                                                            disabled={checkDisabled(scheduleObj?.collectionSchedule?.[0])}
                                                            value={scheduleObj.collectionSchedule && scheduleObj.collectionSchedule.length > 0 ? scheduleObj.collectionSchedule[0].amount : 0}
                                                            onChange={(e) => handleFunctionCall(e,scheduleIndex,0)}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                                {
                                                    scheduleObj.collectionSchedule && scheduleObj.collectionSchedule.length > 1 &&
                                                    scheduleObj.collectionSchedule.map((obj,index) => (
                                                        index > 0 && 
                                                        <TableRow key={`${scheduleObj.start}-child-${index}`}>
                                                            <TableCell colSpan={3} > </TableCell>
                                                            <TableCell colSpan={1} >
                                                                {(`${moment(obj.start).format('DD MMM, YYYY')} to ${moment(obj.end).format('DD MMM, YYYY')}`)}
                                                            </TableCell>
                                                            <TableCell>
                                                                <TextField
                                                                    className="crm-form-input crm-form-input-mini dark width-130p"
                                                                    id="outlined"
                                                                    placeholder="Amount"
                                                                    disabled={checkDisabled(obj)}
                                                                    value={obj.amount}
                                                                    onChange={(e) => handleFunctionCall(e,scheduleIndex,index)}
                                                                />
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                }
                                                </>
                                            ))
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        
                        :   <Box className="crm-schedule-collection-list">
                                {
                                    list.map((scheduleObj,scheduleIndex) => (                                    
                                        <Box className="crm-schedule-collection-listitem"  key={`${scheduleObj.start}-${scheduleIndex}`}>
                                            <Box className="crm-schedule-collection-listitem-info">
                                                <Typography component={"h3"}>Invoice Months</Typography>
                                                <Typography component={"p"}>{`${scheduleObj.start} to ${scheduleObj.end}`}</Typography>
                                            </Box>
                                            <Box className="crm-schedule-collection-listitem-info">
                                                <Typography component={"h3"}>Invoice Amount</Typography>
                                                <Typography component={"p"}>{CurrenncyFormatter.format(scheduleObj.amount)}/-</Typography>
                                            </Box>
                                            <Box className="crm-schedule-collection-listitem-info">
                                                <Typography component={"h3"}>Collection Schedule</Typography>
                                                <Box className="crm-schedule-input-element">
                                                <Select
                                                    className="crm-form-input dark "
                                                    labelId="demo-multiple-checkbox-label"
                                                    id="demo-multiple-checkbox"
                                                    value={scheduleObj.collectionIntervalId ?? null}
                                                    onChange={(e) => handleChange(e, "collectionInterval",scheduleObj,scheduleIndex)}
                                                    input={<OutlinedInput />}
                                                    MenuProps={MenuProps}
                                                    IconComponent={DropDownIcon}
                                                    // open={true}
                                                    >
                                                    {intervalList.filter(obj => (obj.month_count < moment(scheduleObj.end).add(1,'days').diff(moment(scheduleObj.start),'months') || obj.month_count == 1) && obj.month_count > 0).map((obj,index) => (
                                                        <MenuItem key={`${obj.name}-${index}`} value={obj.id}>
                                                            <ListItemText primary={obj.name} />
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                                </Box>
                                            </Box>
                                            
                                            <Box className="crm-schedule-collection-listitem-info">
                                            {
                                                    scheduleObj.collectionSchedule && scheduleObj.collectionSchedule.length > 0 &&
                                                    scheduleObj.collectionSchedule.map((obj,index) => (
                                                        <>
                                                            <Box className="crm-schedule-collection-listitem-info" key={`collectionMonth-child-${index}`}>
                                                                <Typography component={"h3"}>Collection Months</Typography>
                                                                <Typography component={"p"}>
                                                                    {(`${moment(obj.start).format('DD MMM, YYYY')} to ${moment(obj.end).format('DD MMM, YYYY')}`)}
                                                                </Typography>
                                                            </Box>
                                                            <Box className="crm-schedule-collection-listitem-info" key={`collectionAmount-child-${index}`}>
                                                                <Typography component={"h3"}>Collection Amount</Typography>
                                                                <Box className="crm-schedule-input-element">
                                                                    <TextField
                                                                        className="crm-form-input dark "
                                                                        id="outlined"
                                                                        placeholder="Amount"
                                                                        disabled={checkDisabled(obj)}
                                                                        value={obj.amount}
                                                                        onChange={(e) => handleFunctionCall(e,scheduleIndex,index)}
                                                                    />
                                                                </Box>
                                                            </Box>
                                                        </>
                                                    ))
                                                }
                                            </Box>
                                        </Box>
                                    ))
                                }
                            </Box>
                }
                
                <Box className="crm-form-actions text-right ">
                    <Button className="crm-btn crm-btn-outline crm-btn-lg mr-1" onClick={() => handleFirstStepReturn(invoiceObj)}>Cancel</Button>
                    <Button className="crm-btn crm-btn-lg" onClick={handleStepTwoFunctionCall}>{submitText ?? 'Submit'}</Button>
                </Box>
            </Grid>
    )
}

export default memo(CollectionSchedule)