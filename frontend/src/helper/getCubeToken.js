import { getCubeTokenCrm } from "../config/services/reportEngineApis";

export const fetchCubeToken = async () => {
  try{
    let res = await getCubeTokenCrm()
    return res.data.cubeToken
  }catch(err){
    return ""
  }
}