import { createSlice } from '@reduxjs/toolkit'
import { DecryptData, EncryptData } from '../../../utils/encryptDecrypt'
import { getInitState } from '../../../utils/utils'

const invoiceScheduleReducer = createSlice({
    name: 'invoiceSchedule',
    initialState: localStorage.getItem('state')? getInitState('invoiceSchedule'):{},
    reducers:{
        init(state,action){
            let newObj = action.payload
            let softwareList = newObj?.obj?.productDetails ? newObj?.obj?.productDetails?.map(elem => {elem.productItemCategory = elem.productItemCategory ?? 'Software'; return elem;}):[]
            let serviceList = newObj?.obj?.serviceDetails ? newObj.obj?.serviceDetails.map(elem => {elem.productItemCategory = elem.productItemCategory ?? 'Service';elem.productCode = 'service'; return elem;}) : []
            let stateObj = {
                //...state,
                ...newObj.obj,
                orderList: [...softwareList,...serviceList].map(obj => {obj.productItemImpPrice = obj.productItemImpPrice ?? 0; return obj})
            }
            let list = {}
            for(let productObj of stateObj.orderList){
                if(list[productObj.productItemRefId]){
                    list[productObj.productItemRefId] = {
                        ...list[productObj.productItemRefId],
                        implementedUnit: list[productObj.productItemRefId].implementedUnit + (productObj?.implementedUnit ? productObj?.implementedUnit : 0),
                        productItemQuantity: list[productObj.productItemRefId].productItemQuantity + productObj?.productItemQuantity ?? 0,
                        productItemImpPrice: list[productObj.productItemRefId].productItemImpPrice + productObj.productItemImpPrice ?? 0
                    }
                }else{
                    list[productObj.productItemRefId] = {
                        productItemRefId: productObj.productItemRefId,
                        productCode: productObj.productCode ?? '',
                        productItemCategory: productObj.productItemCategory ?? '',
                        productItemName: productObj.productItemName ?? '',
                        productItemDuration: productObj.productItemDuration,
                        implementedUnit: productObj?.implementedUnit ? productObj?.implementedUnit : 0,
                        productItemQuantity: productObj?.productItemQuantity ?? 0,
                        productItemImpPrice: productObj.productItemImpPrice ?? 0
                    }
                }
            }
            stateObj.orderList = Object.values(list)
            //console.log(stateObj.orderList)
            stateObj.orderList = stateObj.orderList.map(obj => {obj.perMonthCost = parseFloat(obj.productItemImpPrice) / obj.productItemDuration ; return obj})            
            //console.log(stateObj.orderList)
            let globalState = JSON.parse(DecryptData(localStorage.getItem('state')))
            localStorage.setItem('state',EncryptData(JSON.stringify({...globalState,invoiceSchedule:stateObj})))
            return stateObj
        },
        reset(state,action){
            let globalState = JSON.parse(DecryptData(localStorage.getItem('state')))
            localStorage.setItem('state',EncryptData(JSON.stringify({...globalState,invoiceSchedule:{}})))
            return {}
        },
        updateSchool(state,action){
            let newObj = action.payload
            let obj = JSON.parse(JSON.stringify(state))
            let stateObj = {
                ...obj,
                schoolDetail: newObj.schoolDetail
            }
            let globalState = JSON.parse(DecryptData(localStorage.getItem('state')))
            localStorage.setItem('state',EncryptData(JSON.stringify({...globalState,invoiceSchedule:stateObj})))
            return stateObj
        },
        updateTerritory(state,action){
            let newObj = action.payload
            let obj = JSON.parse(JSON.stringify(state))
            let stateObj = {
                ...obj,
                territoryDetails: newObj.territoryDetails
            }
            let globalState = JSON.parse(DecryptData(localStorage.getItem('state')))
            localStorage.setItem('state',EncryptData(JSON.stringify({...globalState,invoiceSchedule:stateObj})))
            return stateObj
        },
        updateHierarchy(state,action){
            let newObj = action.payload
            let obj = JSON.parse(JSON.stringify(state))
            let stateObj = {
                ...obj,
                hierarchy: newObj.hierarchy
            }
            let globalState = JSON.parse(DecryptData(localStorage.getItem('state')))
            localStorage.setItem('state',EncryptData(JSON.stringify({...globalState,invoiceSchedule:stateObj})))
            return stateObj
        },
        updatePoDetail(state,action){
            let newObj = action.payload
            let obj = JSON.parse(JSON.stringify(state))
            let stateObj = {
                ...obj,
                poDetail: newObj.poDetail,
                freeMonthsCount: newObj.poDetail.agreementTenure - newObj.poDetail.agreementPayableMonth
            }
            let globalState = JSON.parse(DecryptData(localStorage.getItem('state')))
            localStorage.setItem('state',EncryptData(JSON.stringify({...globalState,invoiceSchedule:stateObj})))
            return stateObj
        },
        setActivationDate(state,action){
            let newObj = action.payload
            let obj = JSON.parse(JSON.stringify(state))
            let stateObj = {
                ...obj,
                activationDate: newObj.date
            }
            let globalState = JSON.parse(DecryptData(localStorage.getItem('state')))
            localStorage.setItem('state',EncryptData(JSON.stringify({...globalState,invoiceSchedule:stateObj})))
            return stateObj
        },
        updateFreeMonths(state,action){
            let newObj = action.payload
            let obj = JSON.parse(JSON.stringify(state))
            let stateObj = {
                ...obj,
                freeMonths: [...newObj.value],
                step:1
            }
            let globalState = JSON.parse(DecryptData(localStorage.getItem('state')))
            localStorage.setItem('state',EncryptData(JSON.stringify({...globalState,invoiceSchedule:stateObj})))
            return stateObj
        },
        updateBillingDate(state,action){
            let newObj = action.payload
            let obj = JSON.parse(JSON.stringify(state))
            let stateObj = {
                ...obj,
                billingStartDate: newObj.value
            }
            let globalState = JSON.parse(DecryptData(localStorage.getItem('state')))
            localStorage.setItem('state',EncryptData(JSON.stringify({...globalState,invoiceSchedule:stateObj})))
            return stateObj
        },
        updateNpsDate(state,action){
            let newObj = action.payload
            let obj = JSON.parse(JSON.stringify(state))
            let stateObj = {
                ...obj,
                nps_effective_date: newObj.value
            }
            let globalState = JSON.parse(DecryptData(localStorage.getItem('state')))
            localStorage.setItem('state',EncryptData(JSON.stringify({...globalState,invoiceSchedule:stateObj})))
            return stateObj
        },
        updateNpsReason(state,action){
            let newObj = action.payload
            let obj = JSON.parse(JSON.stringify(state))
            let stateObj = {
                ...obj,
                nps_reason_id: newObj.id
            }
            let globalState = JSON.parse(DecryptData(localStorage.getItem('state')))
            localStorage.setItem('state',EncryptData(JSON.stringify({...globalState,invoiceSchedule:stateObj})))
            return stateObj
        },
        updateNpsRemarks(state,action){
            let newObj = action.payload
            let obj = JSON.parse(JSON.stringify(state))
            let stateObj = {
                ...obj,
                nps_remarks: newObj.value
            }
            let globalState = JSON.parse(DecryptData(localStorage.getItem('state')))
            localStorage.setItem('state',EncryptData(JSON.stringify({...globalState,invoiceSchedule:stateObj})))
            return stateObj
        },
        updateNpsDocument(state,action){
            let newObj = action.payload
            let obj = JSON.parse(JSON.stringify(state))
            let stateObj = {
                ...obj,
                nps_document_url: newObj.nps_document_url
            }
            let globalState = JSON.parse(DecryptData(localStorage.getItem('state')))
            localStorage.setItem('state',EncryptData(JSON.stringify({...globalState,invoiceSchedule:stateObj})))
            return stateObj
        },
        updateScheduleInterval(state,action){
            //console.log('update schedule')
            let newObj = action.payload
            let obj = JSON.parse(JSON.stringify(state))
            let stateObj = {
                ...obj,
                scheduleInterval: newObj.value,
                scheduleIntervalId: newObj.id,
                scheduleIntervalChange: newObj.isChanged
            }
            let globalState = JSON.parse(DecryptData(localStorage.getItem('state')))
            localStorage.setItem('state',EncryptData(JSON.stringify({...globalState,invoiceSchedule:stateObj})))
            return stateObj
        },
        updateCollectionScheduleInterval(state,action){
            let newObj = action.payload
            let obj = JSON.parse(JSON.stringify(state))
            obj.invoiceSchedule[newObj.index]['errorFlag'] = false
            obj.invoiceSchedule[newObj.index]['collectionInterval'] = newObj.value
            obj.invoiceSchedule[newObj.index]['collectionIntervalId'] = newObj.id
            obj.invoiceSchedule[newObj.index]['collectionSchedule'] = [...JSON.parse(JSON.stringify(newObj.collectionSchedule))]
            let stateObj = {
                ...obj,
                invoiceSchedule:[...obj.invoiceSchedule]
            }
            let globalState = JSON.parse(DecryptData(localStorage.getItem('state')))
            localStorage.setItem('state',EncryptData(JSON.stringify({...globalState,invoiceSchedule:stateObj})))
            return stateObj
        },
        updateInvoiceSchedule(state,action){
            let newObj = action.payload
            let obj = JSON.parse(JSON.stringify(state))
            let stateObj = {
                ...obj,
                invoiceSchedule: newObj.invoiceSchedule,
                step:newObj.step
            }
            let globalState = JSON.parse(DecryptData(localStorage.getItem('state')))
            localStorage.setItem('state',EncryptData(JSON.stringify({...globalState,invoiceSchedule:stateObj})))
            return stateObj
        },
        updateQuotationDetail(state,action){
            let newObj = action.payload
            let obj = JSON.parse(JSON.stringify(state))
            let stateObj = {
                ...obj,
                quotationDetail: newObj.quotationDetail
            }
            let globalState = JSON.parse(DecryptData(localStorage.getItem('state')))
            localStorage.setItem('state',EncryptData(JSON.stringify({...globalState,invoiceSchedule:stateObj})))
            return stateObj
        },
        updateType(state,action){
            let newObj = action.payload
            let obj = JSON.parse(JSON.stringify(state))
            let stateObj = {
                ...obj,
                type: newObj.type
            }
            let globalState = JSON.parse(DecryptData(localStorage.getItem('state')))
            localStorage.setItem('state',EncryptData(JSON.stringify({...globalState,invoiceSchedule:stateObj})))
            return stateObj
        }
    }
})

export const scheduleActions = invoiceScheduleReducer.actions

export default invoiceScheduleReducer.reducer