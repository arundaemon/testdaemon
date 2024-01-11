import { createSlice } from '@reduxjs/toolkit'
import { DecryptData, EncryptData } from '../../utils/encryptDecrypt'
import { getInitState } from '../../utils/utils'

const salesApprovalSlice = createSlice({
    name: 'salesApprovalState',
    initialState: localStorage.getItem('state')? getInitState('salesApprovalState'):{payloadObj: null,matrixType: null,},
    // initialState: {
    //     payloadObj: null,
    //     matrixType: null,
    // },
    reducers:{
        salesApprovalStateUpdate(state,action){
            let newObj = action.payload
            let stateObj = {
                ...state,
                payloadObj: newObj.payloadObj,
            }
            let globalState = JSON.parse(DecryptData(localStorage.getItem('state')))
            localStorage.setItem('state',EncryptData(JSON.stringify({...globalState,salesApprovalState:stateObj})))
            return stateObj
        },
        reset(state,action){
            let stateObj = {
                ...state,
                payloadObj: null,
            };
            let globalState = JSON.parse(DecryptData(localStorage.getItem('state')))
            localStorage.setItem('state',EncryptData(JSON.stringify({...globalState,salesApprovalState:stateObj})))
            return stateObj
        },
        approvalMatrixSelected(state, action) {
            let newObj = action.payload;
            let stateObj = {
                ...state,
                matrixType: newObj.type,
            }
            let globalState = JSON.parse(DecryptData(localStorage.getItem('state')))
            localStorage.setItem('state',EncryptData(JSON.stringify({...globalState,salesApprovalState:stateObj})))
            return stateObj

        },
        approvalMatrixReset(state,action){
            let stateObj = {
                ...state,
                matrixType: null,
            };
            let globalState = JSON.parse(DecryptData(localStorage.getItem('state')))
            localStorage.setItem('state',EncryptData(JSON.stringify({...globalState,salesApprovalState:stateObj})))
            return stateObj
        },
    }
})

export const salesApprovalAction = salesApprovalSlice.actions

export default salesApprovalSlice.reducer