import { getUserData } from "../../helper/randomFunction/localStorage";
import BDERevenue from "./BDERevenue";
import BDMRevenue from "./BDMRevenue";

export default function Revenue() {

  
  const renderView = () => {
    let profile = getUserData('userData')?.crm_profile
    let dashboard

    switch (profile) {
      case 'BDE' : 
        dashboard = <BDERevenue/>
        break;

      case 'BDM' : 
        dashboard =  <BDERevenue/>
        break;

      default : 
      dashboard = <BDERevenue/>
    }
    return dashboard
  }

  return (
    <>
     {renderView()}
    </>
  )
}
