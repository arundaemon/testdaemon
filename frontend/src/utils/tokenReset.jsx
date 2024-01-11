import { getBoardList } from "../config/services/lead";

export const TokenReset = async (routeObj) => {
  //console.log(routeObj)
  let params = { params: { boardStage: 1, sapVisibility: 1 } };
  try {
    if(routeObj.pathname != "/logout"){
      getBoardList(params);
    }    
  }catch(err) {
    console.error(err)
  }
} 