import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchLeadOwner } from "../../config/services/leadDetails";
import { DisplayLoader } from "../../helper/Loader";
import moment from "moment";
import CubeDataset from "../../config/interface";
import SchoolProfile from "./SchoolProfile";
import { getSchoolDetail } from "../../config/services/schoolRegister";
import { checkLeadStageStatus } from "../../config/services/bdeActivities";
import { fieldTab } from "../../constants/general";

export default function SchoolDetail() {
  const [leadObj, setLeadObj] = useState(null);
  const [owner, setOwner] = useState(null);
  const { school_id } = useParams();
  const [leadStatus, setLeadStatus] = useState(false);

  const fetchLead = async () => {
    let params = { school_id };
    try {
      let res = await getSchoolDetail(params);
      if (res?.result) {
        setLeadObj(res?.result?.[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const createStageStatus = async () => {
    let params = {...leadObj, leadInterestType: fieldTab?.interest};
    try {
      let res = await checkLeadStageStatus(params);
      if (res) {
        setLeadStatus(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLead();
  }, []);

  useEffect(() => {
    if (leadObj) {
      createStageStatus();
    }
  }, [leadObj]);

  return (
    <>
      <SchoolProfile
        leadProfileData={owner}
        address={leadObj?.address}
        leadStatus={leadStatus}
        schoolId={school_id}
        data={leadObj}
        isLeadObj={leadObj}
      />
    </>
  );
}
