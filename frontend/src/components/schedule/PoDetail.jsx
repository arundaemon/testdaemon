import { Box, Grid, Typography } from '@mui/material';
import { memo, useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { TooltipInterface } from '../../utils/utils';

import { getSchoolBySchoolCode } from "../../config/services/school";
import { getPurchaseOrderDetails } from "../../config/services/purchaseOrder";
import { getQuotationDetails } from "../../config/services/quotationCRM";
import { getTerritoryByCityState } from "../../helper/DataSetFunction";
import { getHierachyDetails } from "../../config/services/hierachy";
import { getUserData } from "../../helper/randomFunction/localStorage";
import { scheduleActions } from "../../redux/reducers/invoiceSchdeuler";
import { getImplementationById } from '../../config/services/implementationForm';

const PoDetails = () => {
    const [fetchHierarchyDetailFlag,setHierarchyFlag] = useState(false)
    const [fetchSchoolFlag,setSchoolFlag] = useState(false)
    const [fetchPoFlag,setPoFlag] = useState(false)
    const [fetchQuotationFlag,setQuotationFlag] = useState(false)
    const [fetchTerritoryFlag,setTerritoryFlag] = useState(false)
    const [fetchActivationFlag,setActivaationFlag] = useState(false)
    const dispatch = useDispatch()
    const invoiceSchedule = useSelector(state => state.invoiceSchedule)
    
    //console.log(invoiceSchedule, '-----------')
    const getClassText = (classes) => {
        //console.log(classes)
        if (classes.length > 1) {
        let firstClass = classes[0]?.label ?? "NA";
        let secondClass = classes[classes.length - 1]?.label ?? "NA";
        return `${firstClass} to ${secondClass}`;
        } else if (classes.length > 0) {
        return classes[0]?.label ?? "NA";
        } else {
        return "NA";
        }
    };    

    const fetchSchool = (schoolCode) => {
        //console.log('Fetch')
        setSchoolFlag(true)
        getSchoolBySchoolCode(schoolCode)
        .then((res) => {
            //console.log(res)
            if (res.result) {
                setSchoolFlag(false)
                dispatch(scheduleActions.updateSchool({ schoolDetail: res.result }));
            }
        })
        .catch((err) => {
            console.log(err);
        });
    };

    const fetchPoDetail = (poCode) => {
        setPoFlag(true)
        getPurchaseOrderDetails(poCode)
        .then((res) => {
            //console.log(res)
            if (res.result) {
                setPoFlag(false)
                dispatch(scheduleActions.updatePoDetail({ poDetail: res.result }));
            }
        })
        .catch((err) => {
            console.log(err);
        });
    };

    const fetchQuotationDetail = (quotationCode) => {
        setQuotationFlag(true)
        getQuotationDetails(quotationCode)
        .then((res) => {
            //console.log(res)
            if (res.result) {
                setQuotationFlag(false)
                dispatch(
                    scheduleActions.updateQuotationDetail({
                    quotationDetail: res.result,
                    })
                );
            }
        })
        .catch((err) => {
            console.log(err);
        });
    };

    const fetchTerritory = (cityName, stateName) => {
        setTerritoryFlag(true)
        getTerritoryByCityState(cityName, stateName)
        .then((res) => {
            let data = res.rawData();
            if (data.length > 0) {
                setTerritoryFlag(false)
                dispatch(
                    scheduleActions.updateTerritory({ territoryDetails: data[0] })
                );
            }
        })
        .catch((err) => {
            console.log(err);
        });
    };

    const fetchHierarchyDetail = (roleName) => {
        let params = {
        roleName: getUserData("userData").crm_role,
        };
        setHierarchyFlag(true)
        getHierachyDetails(params)
        .then((res) => {
            //console.log(res)
            if (res.result) {
                setHierarchyFlag(false)
                dispatch(scheduleActions.updateHierarchy({ hierarchy: res.result }));
            }
        })
        .catch((err) => {
            console.log(err);
        });
    };

    const fetchActivationDate = (impCode) => {
        setActivaationFlag(true)
        getImplementationById(impCode)
          .then((res) => {
            setActivaationFlag(false)
            dispatch(scheduleActions.setActivationDate({date: moment(res.result[0]?.createdAt).format('DD-MM-YYYY')}))
          })
          .catch((err) => {
            console.log(err)
          })
    }

    useEffect(() => {
        if (!invoiceSchedule.hierarchy && !fetchHierarchyDetailFlag) {
            fetchHierarchyDetail();
        }
    
        if (!invoiceSchedule.schoolDetail && !fetchSchoolFlag && invoiceSchedule.schoolCode) {
            fetchSchool(invoiceSchedule.schoolCode);
        }
    
        if (!invoiceSchedule.territoryDetails && !fetchTerritoryFlag && invoiceSchedule.schoolCityName && invoiceSchedule.schoolStateName) {
            fetchTerritory(
                invoiceSchedule.schoolCityName,
                invoiceSchedule.schoolStateName
            );
        }        
    
        if (!invoiceSchedule.poDetail && !fetchPoFlag && invoiceSchedule.purchaseOrderCode) {
            fetchPoDetail(invoiceSchedule.purchaseOrderCode);
        }
    
        if (!invoiceSchedule.quotationDetail && !fetchQuotationFlag && invoiceSchedule.quotationCode) {
            fetchQuotationDetail(invoiceSchedule.quotationCode);
        }
    
        if (!invoiceSchedule.activationDate && !fetchActivationFlag && invoiceSchedule.impFormNumber) {
            fetchActivationDate(invoiceSchedule.impFormNumber);
        }
    })

    return (        
        <>
            <Box className='crm-schedule-list-container'>
                <Typography component={"h1"} className='crm-page-heading'>School Details</Typography>
                <Grid container>
                    <Grid item xs={6} md={4} lg={2}>
                        <Box className='crm-schedule-list-item'>
                            <Typography className='' component={"h4"}>School Code</Typography>
                            <Typography component={"p"}>{invoiceSchedule?.schoolDetail?.schoolCode}</Typography>    
                        </Box>
                    </Grid>
                    <Grid item xs={6} md={4} lg={2}>
                        <Box className='crm-schedule-list-item'>
                            <Typography className='' component={"h4"}>Type of Institute</Typography>
                            <Typography component={"p"}>{invoiceSchedule?.schoolDetail?.typeOfInstitute}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={6} md={4} lg={2}>
                        <Box className='crm-schedule-list-item'>
                            <Typography className='' component={"h4"}>Board</Typography>
                            <Typography component={"p"}>{invoiceSchedule?.schoolDetail?.board}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={6} md={4} lg={2}>
                        <Box className='crm-schedule-list-item'>
                            <Typography className='' component={"h4"}>Classes</Typography>
                            <Typography component={"p"}>{invoiceSchedule?.schoolDetail?.classes.length > 0 ? getClassText(invoiceSchedule?.schoolDetail?.classes): 'NA'}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={6} md={4} lg={2}>
                        <Box className='crm-schedule-list-item'>
                            <Typography className='' component={"h4"}>Total Students</Typography>
                            <Typography component={"p"}>{invoiceSchedule?.schoolDetail?.totalStudent ?? 'NA'}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={6} md={4} lg={2}>
                        <Box className='crm-schedule-list-item'>
                            <Typography className='' component={"h4"}>Total Teachers</Typography>
                            <Typography component={"p"}>{invoiceSchedule?.schoolDetail?.totalTeacher ?? 'NA'}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={6} md={4} lg={2}>
                        <Box className='crm-schedule-list-item'>
                            <Typography className='' component={"h4"}>Email</Typography>
                            <Typography component={"p"}>{invoiceSchedule.schoolDetail?.schoolEmailId}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={6} md={4} lg={2}>
                        <Box className='crm-schedule-list-item'>
                            <Typography className='' component={"h4"}>Address</Typography>
                            <TooltipInterface className="crm-tooltip" title={invoiceSchedule?.schoolDetail?.address}  >
                                <Typography  component={"p"}>{invoiceSchedule?.schoolDetail?.address}</Typography>
                            </TooltipInterface>
                            {/* <Typography  component={"p"}>{invoiceSchedule?.schoolDetail?.address}</Typography> */}
                        </Box>
                    </Grid>
                    <Grid item xs={6} md={4} lg={2}>
                        <Box className='crm-schedule-list-item'>
                            <Typography className='' component={"h4"}>Pin Code</Typography>
                            <Typography component={"p"}>{invoiceSchedule?.schoolDetail?.pinCode}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={6} md={4} lg={2}>
                        <Box className='crm-schedule-list-item'>
                            <Typography className='' component={"h4"}>City</Typography>
                            <Typography component={"p"}>{invoiceSchedule?.schoolDetail?.city}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={6} md={4} lg={2}>
                        <Box className='crm-schedule-list-item'>
                            <Typography className='' component={"h4"}>State</Typography>
                            <Typography component={"p"}>{invoiceSchedule?.schoolDetail?.state}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={6} md={4} lg={2}>
                        <Box className='crm-schedule-list-item'>
                            <Typography className='' component={"h4"}>Country</Typography>
                            <Typography component={"p"}>{invoiceSchedule?.schoolDetail?.country}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={6} md={4} lg={2}>
                        <Box className='crm-schedule-list-item'>
                            <Typography className='' component={"h4"}>Implementation ID</Typography>
                            <Typography component={"p"}>{invoiceSchedule.impFormNumber}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={6} md={4} lg={2}>
                        <Box className='crm-schedule-list-item'>
                            <Typography className='' component={"h4"}>Implementation Date</Typography>
                            <Typography component={"p"}>{moment.utc(invoiceSchedule?.implementationStartDate).format('DD-MM-YYYY')}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={6} md={4} lg={2}>
                        <Box className='crm-schedule-list-item'>
                            <Typography className='' component={"h4"}>PO No.</Typography>
                            <Typography component={"p"}>{invoiceSchedule.purchaseOrderCode}</Typography>
                        </Box>
                    </Grid>

                
                </Grid>
            </Box>
            
            <Box className='crm-schedule-list-container'>
                <Typography component={"h1"} className='crm-page-heading'>PO Agreement Details</Typography>
                <Grid container spacing>
                    <Grid item xs={6} md={4} lg={12/5}>
                        <Box className='crm-schedule-list-item'>
                            <Typography className='' component={"h4"}>Agreement Start Date</Typography>
                            <Typography component={"p"}>{moment.utc(invoiceSchedule?.poDetail?.agreementStartDate).format('DD-MM-YYYY')}</Typography>    
                        </Box>
                    </Grid>
                    <Grid item xs={6} md={4} lg={12/5}>
                        <Box className='crm-schedule-list-item'>
                            <Typography className='' component={"h4"}>Agreement End Date</Typography>
                            <Typography component={"p"}>{moment.utc(invoiceSchedule?.poDetail?.agreementEndDate).format('DD-MM-YYYY')}</Typography>    
                        </Box>
                    </Grid>
                    <Grid item xs={6} md={4} lg={12/5}>
                        <Box className='crm-schedule-list-item'>
                            <Typography className='' component={"h4"}>Agreement Tenure </Typography>
                            <Typography component={"p"}>{invoiceSchedule?.poDetail?.agreementTenure}</Typography>    
                        </Box>
                    </Grid>
                    <Grid item xs={6} md={4} lg={12/5}>
                        <Box className='crm-schedule-list-item'>
                            <Typography className='' component={"h4"}>Total Contract Value</Typography>
                            <Typography component={"p"}>{invoiceSchedule?.poDetail?.overallContractValue}</Typography>    
                        </Box>
                    </Grid>
                    <Grid item xs={6} md={4} lg={12/5}>
                        <Box className='crm-schedule-list-item'>
                            <Typography className='' component={"h4"}>Schedule Amount</Typography>
                            <Typography component={"p"}>{invoiceSchedule.orderList.reduce((partialSum,obj) => partialSum + parseFloat(obj.productItemImpPrice),0)}</Typography>    
                        </Box>
                    </Grid>
                    <Grid item xs={6} md={4} lg={12/5}>
                        <Box className='crm-schedule-list-item'>
                            <Typography className='' component={"h4"}>Agreement Payable Month</Typography>
                            <Typography component={"p"}>{invoiceSchedule?.poDetail?.agreementPayableMonth}</Typography>    
                        </Box>
                    </Grid>
                    <Grid item xs={6} md={4} lg={12/5}>
                        <Box className='crm-schedule-list-item'>
                            <Typography className='' component={"h4"}>Payment Schedule & PDC's</Typography>
                            <Typography component={"p"}>{invoiceSchedule?.poDetail?.paymentScheduleAndPdc?.length > 0 ? (invoiceSchedule?.poDetail?.paymentScheduleAndPdc[0] ?? 'NA') : 'NA'}</Typography>    
                        </Box>
                    </Grid>
                    <Grid item xs={6} md={4} lg={12/5}>
                        <Box className='crm-schedule-list-item'>
                            <Typography className='' component={"h4"}>Activation Date</Typography>
                            <Typography component={"p"}>{invoiceSchedule?.activationDate}</Typography>    
                        </Box>
                    </Grid>
                    {invoiceSchedule?.isApproval && <Grid item xs={6} md={4} lg={12/5}>
                        <Box className='crm-schedule-list-item'>
                            <Typography className='' component={"h4"}>Free Period</Typography>
                            <Typography component={"p"}>{invoiceSchedule?.freeMonthsCount}</Typography>    
                        </Box>
                    </Grid>}
                </Grid>
            </Box>
        </>
    )
}

export default memo(PoDetails)