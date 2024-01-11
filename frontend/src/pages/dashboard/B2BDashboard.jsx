import { SchoolDashboard } from "../../components/Dashboard/SchoolDashboard";
import { getUserData } from "../../helper/randomFunction/localStorage";

export default function B2BSchoolDashboard() {

  
  const renderView = () => {
    let profile = getUserData('userData')?.crm_profile
    let dashboard

    switch (profile) {
      case 'BDE' : 
        dashboard = <SchoolDashboard/>
        break;

      case 'BDM' : 
        dashboard =  <SchoolDashboard/>
        break;

      default : 
      dashboard = <SchoolDashboard/>
    }
    return dashboard
  }

  return (
    <>
     {renderView()}
    </>
  )
}
