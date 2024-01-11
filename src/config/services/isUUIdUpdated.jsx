import {updateUUID } from "./leadassign"

export const isUUidUpdate = async (params) => {
  
  var Data = await updateUUID(params).then(res => {
    return res
  }).catch(err => {
    console.error(err);
  })

  return Data
}