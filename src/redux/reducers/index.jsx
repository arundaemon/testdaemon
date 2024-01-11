import { combineReducers } from 'redux'
import loginReducers from './loginReducers/LoginReducers'
import loginMessageReducers from './loginReducers/message'
import hardwareBundleVariantFormSlice from '../slice/hardwareBundleVariantFormSlice'
import invoiceScheduleReducer from './invoiceSchdeuler'
import appReducer from './appReducer'
import salesApprovalReducer from './salesApprovalReducer'

const rootReducer = combineReducers({
    loginReducers,
    loginMessageReducers,
    invoiceSchedule:invoiceScheduleReducer,
    hardwareBundleVariantFormSlice,
    appEvents:appReducer,
    salesApprovalState: salesApprovalReducer,

})

export default rootReducer
