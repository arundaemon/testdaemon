import moment from "moment"
import { DecryptData } from "./encryptDecrypt"
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled as CustomStyled } from '@mui/material/styles';
import { Breadcrumbs, Typography } from "@mui/material";
import IconBreadcrumbArrow from "./../assets/icons/icon-breadcrumb-arrow.svg";
import { Link } from "react-router-dom";


export const getLoggedInRole = (query) => {
    return JSON.parse(localStorage.getItem('userData'))?.crm_role

}

export const getInitState = (type) => {
    let state = JSON.parse(DecryptData(localStorage.getItem('state')))
    switch(type){
        case 'invoiceSchedule':
            return state.invoiceSchedule ?? {}
        case 'salesApprovalState':
            return state.salesApprovalState ?? {}
        default:
            return {}
    }
}

export const getMonths = (startDate,endDate) => {
    let betweenMonths = []
    if (startDate < endDate){
        var date = startDate.startOf('month');
     
        while (date < endDate.endOf('month')) {
            let obj = {dt:date.format('YYYY-MM-DD'),label:date.format('MMMM YYYY')}
           betweenMonths.push(obj);
           date.add(1,'month');
        }
    }
    return betweenMonths
}

//productList will be the single schedule object in case of collectionFlag = true
export const generateSchedule = (startDate, endDate, intervalMonths, skipMonths, productList,collectionFlag=false,editFlag=false) => {
    let schedules = [];
    skipMonths = skipMonths.map(obj => moment(obj).format('YYYY-MM'))
    let currentStartDate = moment(startDate)
    //console.log(startDate,endDate)
    while (moment(currentStartDate).format('YYYY-MM-DD') < moment(endDate).format('YYYY-MM-DD')) {
        let counter = 1
        let freeMonths = 0
        let list = []
        let currentEndDate = moment(currentStartDate).add(1,'months')
        if(skipMonths.indexOf(moment(currentStartDate).format('YYYY-MM')) > -1){
            freeMonths++
            list.push(moment(currentStartDate).format('MMM YYYY'))
        }
        while(counter < intervalMonths){
            if(currentEndDate.format('YYYY-MM-DD') > moment(endDate).format('YYYY-MM-DD')){
                break;
            }
            if(skipMonths.indexOf(moment(currentEndDate).format('YYYY-MM')) > -1){
                freeMonths++
                list.push(moment(currentEndDate).format('MMM YYYY'))
            }
            counter++
            currentEndDate = moment(currentEndDate).add(1,'months')
        }
        schedules.push({start:currentStartDate.format('YYYY-MM-DD'),products:[],errorFlag:true,end:currentEndDate.subtract(1,'days').format('YYYY-MM-DD'),freeMonths:freeMonths,amount:0})
        currentStartDate = currentEndDate.add(1,'days')
    }
    if(collectionFlag){
        let monthCount = moment(endDate).add(1,'days').diff(moment(startDate),'months')
        let unitCost = productList.amount / (monthCount - productList.freeMonths) // as for collection productList is single schedule object
        for(let i = 0; i<schedules.length;i++){
            let scheduleObj = schedules[i]
            scheduleObj.amount = Math.round(((unitCost * (moment(scheduleObj.end).add(1,'days').diff(moment(scheduleObj.start),'months') - scheduleObj.freeMonths)) + Number.EPSILON) * 100) / 100
        }
        let scheduleAmount = productList.amount
        let collectionAmount = schedules.reduce((partialSum,obj) => partialSum + parseFloat(obj.amount),0)
        let diffAmount = Math.round((Math.abs(scheduleAmount - collectionAmount) + Number.EPSILON) * 100) / 100
        if(scheduleAmount > collectionAmount){
            for(let i = 0; i<schedules.length;i++){
                if(schedules[i].amount > 0){
                    schedules[i].amount = Math.round(((schedules[i].amount + diffAmount) + Number.EPSILON) * 100) / 100
                    break;
                }
            }            
        }else if(collectionAmount > scheduleAmount){
            for(let i = 0; i<schedules.length;i++){
                if(schedules[i].amount > 0){
                    schedules[i].amount = Math.round(((schedules[i].amount - diffAmount) + Number.EPSILON) * 100) / 100
                    break;
                }
            }
        }
    }else{
        schedules = distributeProductAmount(schedules,productList)
    }  
    return schedules;
  }

export const distributeProductAmount = (schedules,productList) => {
    for(let i = 0;i<schedules.length;i++){
        let scheduleObj = schedules[i]
        let paidMonths = moment(scheduleObj.end).add(1,'days').diff(moment(scheduleObj.start),'months') - scheduleObj.freeMonths
        for(let j = 0;j<productList.length;j++){
            let amount = 0
            productList[j].paidMonths = paidMonths
            if(productList[j].productItemDuration > paidMonths){
                amount = (paidMonths * productList[j].perMonthCost)                   
                productList[j].productItemDuration = productList[j].productItemDuration - paidMonths
            }else{
                amount = productList[j].productItemDuration * productList[j].perMonthCost
                productList[j].productItemDuration = 0
            }
            scheduleObj.amount = Math.round(((scheduleObj.amount + amount) + Number.EPSILON) * 100) / 100
            if(productList[j].productItemDuration >= 0){
                scheduleObj.products.push({...productList[j],productCost:amount})                
            }                
        }
    }
    return schedules
}
  

export const checkValidPhone = (value) => {
    let regex = new RegExp('^[6-9][0-9]{9}$')

    if (value) {
        if (!regex.test(value)) {
            return false;
        } else {
            return true
        }
    }

}

export const checkValidEmail = (value) => {
    let regex = new RegExp('^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})|(^[0-9]{10})+$');

    if (value) {
        if (!regex.test(value)) {
            return false;
        } else {
            return true
        }
    }

}

export const checkValidName = (value) => {
    let regex = new RegExp('^[a-zA-Z ]*$')

    if (value) {
        if (!regex.test(value)) {
            return false;
        } else {
            return true;
        }
    }
}

export const TooltipInterface = CustomStyled(({ ...props }) => (
    <Tooltip {...props} arrow classes={{ popper: 'crm-tooltip-wrapper' }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: '#CFE0FF',
      fontSize: 16,
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#CFE0FF',
      color: '#202124',
      padding: '6px',
      fontSize: '10px',
      borderRadius: '4px',
      // marginTop: '4px',
    },
  }));

export const CurrenncyFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
});

export const CurrenncyFormat = (value, decimals = 0, symbol = true) => {
    const currency = 'INR';
    var currencyInstance = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: decimals,
        currencyDisplay: symbol ? "symbol" : 'code' 
    })
    .format(value);
    
    if(!symbol) {
        currencyInstance = currencyInstance.replace(currency, '').trim();
    }
    return currencyInstance;
}

export const BreadcrumbsFormatter = ({crumbs = []}) => {
    return crumbs?.length 
        ?   <Breadcrumbs
                className="crm-breadcrumbs"
                separator={<img src={IconBreadcrumbArrow} />}
                aria-label="breadcrumbs"
            >
                {
                    crumbs.map((item, index) => {
                        if((index + 1) !== crumbs?.length) {
                            return <Link
                                underline="hover"
                                key={index+1}
                                color="inherit"
                                to={item?.route}
                                className="crm-breadcrumbs-item breadcrumb-link"
                            >
                                {item?.label}
                            </Link>
                        }
                    })
                }
                <Typography
                    key={crumbs?.length}
                    component="span"
                    className="crm-breadcrumbs-item breadcrumb-active"
                    >
                    {crumbs[crumbs?.length-1]?.label}
                </Typography>
            
            
            </Breadcrumbs>
        :   null
}