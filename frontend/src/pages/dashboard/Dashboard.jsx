import { BDEDashboard } from "../../components/Dashboard/BDEDashboard";
import { BDMDashboard } from "../../components/Dashboard/BDMDashboard";
import { SchoolDashboard } from "../../components/Dashboard/SchoolDashboard";
import { getUserData } from "../../helper/randomFunction/localStorage";

export default function Dashboard() {

  
  const renderView = () => {
    let profile = getUserData('userData')?.crm_profile
    let dashboard

    switch (profile) {
      case 'BDE' : 
        dashboard = <BDEDashboard/>
        break;

      case 'BDM' : 
        dashboard =  <BDEDashboard/>
        break;

      default : 
      dashboard = <BDEDashboard/>
    }
    return dashboard
  }

  return (
    <>
     {renderView()}
    </>
  )
}
