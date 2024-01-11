import { createSlice } from '@reduxjs/toolkit'
import { getInitState } from '../../utils/utils'
import { DecryptData, EncryptData } from '../../utils/encryptDecrypt'
const initObj = {
    eventFlag: false,
    permissionFlag: false,
    appPlatForm: false
}
const appReducerSlice = createSlice({
    name: 'appEvents',
    initialState: localStorage.getItem('state')? getInitState('appEvents'):initObj,
    reducers:{
        eventTrigger(state,action){
            let newObj = action.payload
            let obj = JSON.parse(JSON.stringify(state))
            let stateObj = {
                ...obj,
                eventFlag: newObj.eventFlag
            }
            let globalState = JSON.parse(DecryptData(localStorage.getItem('state')))
            localStorage.setItem('state',EncryptData(JSON.stringify({...globalState,appEvents:stateObj})))
            return stateObj
        },
        appPlatform(state,action){
            let newObj = action.payload
            let obj = JSON.parse(JSON.stringify(state))
            let stateObj = {
                ...obj,
                appPlatform: newObj.appPlatform
            }
            let globalState = JSON.parse(DecryptData(localStorage.getItem('state')))
            localStorage.setItem('state',EncryptData(JSON.stringify({...globalState,appEvents:stateObj})))
            return stateObj
        },
        permissionFlag(state,action){
            let newObj = action.payload
            let obj = JSON.parse(JSON.stringify(state))
            let stateObj = {
                ...obj,
                permissionFlag: newObj.permissionFlag
            }
            let globalState = JSON.parse(DecryptData(localStorage.getItem('state')))
            localStorage.setItem('state',EncryptData(JSON.stringify({...globalState,appEvents:stateObj})))
            return stateObj
        }
    }
})

export const appReducerActions = appReducerSlice.actions

export default appReducerSlice.reducer