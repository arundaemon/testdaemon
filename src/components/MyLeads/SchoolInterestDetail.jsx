import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBdeActivity } from "../../config/services/school";
import { DisplayLoader } from "../../helper/Loader";
import moment from "moment";
import { Box, Grid } from "@mui/material";
import { BDEACTIVITYKEYLABEL } from "../../constants/general";
import useMediaQuery from "@mui/material/useMediaQuery";

const SchoolInterestDetail = ({
  interestName,
  priority,
  stageName,
  statusName,
  getBdActivityInterest,
}) => {

  const { interest_id } = useParams();
  const [selectedActivity, setSelectedActivity] = useState([]);
  const [loading, setLoading] = useState(false);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));
  

  const fetchBdeActivity = () => {
    let leadId = interest_id;
    setLoading(true);

    if (leadId) {
      getBdeActivity({ leadId  })
        .then((res) => {
          let data = res?.result;
          let priorityData = data?.filter(
            (item) => item?.priority === priority
          )?.[0];
          delete priorityData?.contactDetails;
          delete priorityData?.category;
          let priorityHotsData = data?.filter(
            (item) => item?.priority === "HOTS"
          )?.[0];
          getBdActivityInterest(priorityHotsData);
          setSelectedActivity(priorityData);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err, "Error while Fetching bde Activity");
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBdeActivity();
  }, [priority != undefined]);

  // useEffect(() => {
  //   if (selectedActivity?.length) {
  //     getBdActivityInterest(selectedActivity)
  //   }
  // }, [selectedActivity])

  return (
    <div>
      {loading ? (
        DisplayLoader()
      ) : selectedActivity ? (
        <>
          <Grid container className="crm-school-lead-interest-shown-container">
            {
              isMobile
                ? <Grid
                    item
                    xs="12"
                    md="6"
                    
                    className="crm-school-lead-interest-shown-item-header"
                  >
                    Timing
                  </Grid>
                : null
            }
            <Grid
              item
              xs="12"
              md="6"
              
              className="crm-school-lead-interest-shown-item"
            >
              Stage : <b>{stageName}</b>
            </Grid>
            <Grid
              item
              xs="12"
              md="6"
              className="crm-school-lead-interest-shown-item"
            >
              Status : <b>{statusName}</b>
            </Grid>
          </Grid>
          <Grid container className="crm-school-lead-interest-shown-container2">
            {Object.entries(selectedActivity)?.map(([key, value]) => {
              // console.log(`${key}: ${typeof value}`, "getType");
              return (
                <>
                  {BDEACTIVITYKEYLABEL[key] && value ? (
                    <Grid item md={6} xs={12}>
                      {!(
                        BDEACTIVITYKEYLABEL[key] === "EDC" ||
                        BDEACTIVITYKEYLABEL[key] === "Meeting Date"
                      ) ? (
                        <Box className="crm-school-lead-interest-shown-item">
                          <p>{BDEACTIVITYKEYLABEL[key]} : </p>
                          <p><b>{value}</b></p>
                        </Box>
                      ) : (
                        <Box className="crm-school-lead-interest-shown-item">
                          <p>{BDEACTIVITYKEYLABEL[key]} : </p>
                          <p><b>{moment(value).format("DD-MM-YYYY")}</b></p>
                        </Box>
                      )}
                    </Grid>
                  ) : (
                    ""
                  )}
                </>
              );
            })}
          </Grid>
        </>
      ) : (
        <div style={{ marginLeft: "310px" }}>
          {`No Data Found for ${interestName}`}
        </div>
      )}
    </div>
  );
};

export default SchoolInterestDetail;
