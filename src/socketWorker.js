/* eslint-disable no-restricted-globals */
import { getConfigDetails, makeCall } from './config/services/config'
import { getHierachyDetails } from './config/services/hierachy'
import { url } from './config/urls'
import { EncryptData } from './utils/encryptDecrypt'
const connectedPorts = []
let callId = '';
const recursiveSearch = (obj, searchKey, results = []) => {
  const r = results;
  Object.keys(obj).forEach(key => {
    const value = obj[key];
    if (key === searchKey) {
      r.push(value);
      if (Object.keys(value).indexOf(searchKey) > 0) {
        recursiveSearch(value, searchKey, r);
      }
    }
  });
  return r;
};

self.onmessage = ({ data }) => {
  const { type, value } = data
  switch (type) {
    case 'onCall':
      let valObj = JSON.parse(value)
      //console.log('Obj',valObj)
      let loginUserData = valObj.loginUserData
      let phoneNumber = '+91' + loginUserData?.userData?.phoneNumber?.slice(-10)
      let mobile = valObj.mobile.slice(-10)
      let customerNumber = `+91${mobile}`;
      let leadStageStatus = valObj.leadStageStatus
      let leadObj = valObj.leadObj
      let roleObj = valObj.roleObj
      let bdeObj = valObj.bdeObj

      return getHierachyDetails(roleObj)
        .then(res => {
          if (res.data.responseData.result) {
            let managerObj = {}
            let roleList = recursiveSearch(res.data.responseData.result, 'parents')
            //console.log(res.result,roleList)
            let counter = 1
            roleList.forEach(
              (obj, index) => {
                let roleName = obj.roleName.toUpperCase()
                if (roleName.includes('BUH')) {
                  managerObj['Buh'] = obj.roleName
                  managerObj['BuhName'] = obj.displayName
                } else if (roleName.includes('RUH') || roleName.includes('RBUH')) {
                  managerObj['Ruh'] = obj.roleName
                  managerObj['RuhName'] = obj.displayName
                } else if (roleName.includes('INDIAHEAD') || roleName.includes('IBH')) {
                  managerObj['InHead'] = obj.roleName
                  managerObj['InHeadName'] = obj.displayName
                } else {
                  managerObj[`manager${counter}`] = obj.roleName
                  managerObj[`manager${counter}Name`] = obj.displayName
                  counter++
                }
              }
            )
            return managerObj
          } else {
            return {}
          }
        }
        )
        .then(
          managerObj => {
            //console.log(managerObj)
            let obj = {
              ...leadObj,
              ...managerObj,
              leadStage: leadStageStatus?.stageName?.trim(),
              leadStatus: leadStageStatus?.statusName?.trim(),
              leadJourney: leadStageStatus?.journeyName?.trim(),
              leadCycle: leadStageStatus?.cycleName?.trim(),
              customerNumber,
              phoneNumber,
              createdBy: loginUserData?.loginData?.uuid,
              createdByRoleName: loginUserData?.userData?.crm_role,
              createdByProfileName: loginUserData?.userData?.crm_profile,
              createdByName: loginUserData?.userData?.name,
              update: (bdeObj?._id) ? true : false,
              updateId: bdeObj ? bdeObj._id : "",
              activityId:bdeObj ? bdeObj.activityId:""              
            }
            //console.log(obj)
            let encryptedData = EncryptData(obj)
            return makeCall(encryptedData)
          }
        )
        .then(
          res => {
            //console.log(res)
            if(res.data.status == 'DND'){
              postMessage({ type: 'callFailed', data: res.data })
            }else{
              callId = res.data.callId
              postMessage({ type: 'callId', data: res.data.callId })
            }            
          }
        )
        .catch(
          err => {
            //console.log(err)
            postMessage({ type: 'callFailed', data: err })
          }
        )
      break;
    case 'connect':
      postMessage({ type: 'connect', data: 'connect' })
      break;
    case 'unload':
      callId = ''
      console.log('abcd')
      //const index = connectedPorts.indexOf(port);
      //connectedPorts.splice(index, 1)
      break;
    default:
      break;
  }
}

getConfigDetails()
  .then(
    dbConfig => {
      console.log('DB Config',dbConfig)
      let URL = `${url.knowlarityUrl}/update-stream/${dbConfig.data.responseData.data[0].Authorization}/konnect`
      const source = new EventSource(URL);
      console.log('Knowlarity URL', URL)
      source.onmessage = function (event) {
        let data = JSON.parse(event.data)
        console.log('Local CallId', callId, 'Event', data)
        switch (data.type) {
          case 'AGENT_CALL':
            if (callId == data.uuid) {
              postMessage({ type: 'callEvent', data: { status: data.type, ...data } })
            }
            break;
          case 'AGENT_ANSWER':
            if (callId == data.uuid) {
              postMessage({ type: 'callEvent', data: { status: data.type, ...data } })
            }
            break;
          case 'CUSTOMER_CALL':
            if (callId == data.uuid) {
              postMessage({ type: 'callEvent', data: { status: data.type, ...data } })
            }
            break;
          case 'CUSTOMER_ANSWER':
            if (callId == data.uuid) {
              postMessage({ type: 'callEvent', data: { status: data.type, ...data } })
            }
            break;
          case 'BRIDGE':
            if (callId == data.uuid) {
              postMessage({ type: 'callEvent', data: { status: 'Connected', ...data } })
            }
            break;
          case 'HANGUP':
            if (callId == data.uuid) {
              postMessage({ type: 'callEvent', data: { status: data.business_call_type, ...data } })
            }
            break;
          case 'CDR':
            if (callId == data.uuid) {
              postMessage({ type: 'callEvent', data: { status: data.business_call_type, ...data } })
            }
            break;
          default:
            console.log('Default', data);
            break;
        }
      }
      source.onerror = (err) => {
        console.log('Knowlarity Error', err)
      }
    }
  )
  .catch(
    err => {
      console.log('Error', err)
    }
  )
