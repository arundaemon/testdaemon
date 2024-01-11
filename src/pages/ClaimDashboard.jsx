import React, { useState } from "react";
import Iframe from "react-iframe";
import settings from "../config/settings";
import Page from "../components/Page";

const ClaimDashboard = () => {
  const [crm_role] = useState(JSON.parse(localStorage.getItem('userData'))?.crm_role);


  //childRoles
  const url = `${settings.REPORT_ENGINE_URL}/setcreds/${crm_role}?role=EM_CRM&redirectURL=/embedDashboard/${settings.CLAIM_DASHBOARD_KEY}&lang=en`;

  return (
    <Page title="Extramarks | Claim Dashboard" >
      <Iframe
        src={url}
        width="100%"
        height="100%"
        styles={{
          border: "none",
          minHeight: "800px",
          marginLeft: "10px",
          marginRight: "25px",
        }}
      />
    </Page>
  );
};
export default ClaimDashboard;
