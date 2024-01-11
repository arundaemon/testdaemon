import React, { useState, useEffect } from 'react';
import { Grid } from "@mui/material";
import InfiniteScroll from 'react-infinite-scroll-component';

import { getBdeActivitiesList } from '../../../config/services/bdeActivities';
import { getUserActivities } from '../../../config/services/bdeActivities';
import { DisplayLoader } from '../../../helper/Loader';
import NoDataComponent from '../NoDataComponent';
import settings from '../../../config/settings';
import BdeActivityList from './BdeActivityList';
import UserActivityList from './UserActivityList';
import moment from 'moment';
import CubeDataset from "../../../config/interface";

const AllActivities = (props) => {
  let {handleLastActivity}=props
  const [allActivitiesList, setAllActivitiesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(4);
  const [hasMore, setHasMore] = useState(true);
  const [verifiedDate, setVerifiedDate] = useState('');

  const { BDE_ACTIVITIES } = settings;
  const leadObj = props?.leadObj;
  const lead_Uuid = leadObj?.leadId;


  const fetchAllActivities = async (scroll = false) => {
    let updatedDays = days;
    if (scroll) {
      updatedDays = days + 30
    }
    let params = { user_id: lead_Uuid };
    let newParams={ leadId: leadObj.leadId}

    try {
      const bdeActivitiesLists = await getBdeActivitiesList(newParams);
       let newbdelist = bdeActivitiesLists?.result
       let copybdeActivitiesLists = [...newbdelist]
       sorting(copybdeActivitiesLists)
       VerifiedDate(copybdeActivitiesLists)


      const userActivitiesList = await getUserActivities(params);
      handleLastActivity(userActivitiesList?.result)


      // console.log(userActivitiesList,'....userActivitiesList')

      let updatedBdeList = bdeActivitiesLists?.result?.map((a) => { return { ...a, type: "BDE", date: new Date(a[CubeDataset.Bdeactivities.startDateTime]) } });
      let updatedUserList = userActivitiesList?.result?.map((a) => { return { ...a, type: "USER", date: new Date(a['created_at']) } });
      let updatedMergeList = [...updatedUserList, ...updatedBdeList]?.sort((a, b) => b['date'] - a['date']);
      setAllActivitiesList(updatedMergeList)
      if (updatedMergeList?.length < 10 || updatedMergeList.length === allActivitiesList.length) {
        setHasMore(false);
      }
      setLoading(false);

    } catch (error) {
      console.log(error)
      setLoading(false);

    }
  }

  const allActivityScrollFunction = () => {
    fetchAllActivities(true)
  }

  useEffect(() => {
    fetchAllActivities()
  }, [props.leadStageStatus]);


  const sorting = (copybdeActivitiesLists) => {
    copybdeActivitiesLists.sort(function (a, b) {
      var keyA = moment.utc(new Date(a?.[CubeDataset.Bdeactivities.createdAt])).local().format('DD-MM-YYYY (hh:mm A)'),
        keyB = moment.utc(new Date(b?.[CubeDataset.Bdeactivities.createdAt])).local().format('DD-MM-YYYY (hh:mm A)');
      // Compare the 2 dates
      if (keyA < keyB) return -1;
      if (keyA > keyB) return 1;
      return 0;
    });
  }


  const VerifiedDate = (copybdeActivitiesLists) => {
    copybdeActivitiesLists.forEach(item => {
      if (item?.[CubeDataset.Bdeactivities.callRecording] !== null) {
        setVerifiedDate(item?.[CubeDataset.Bdeactivities.createdAt]);
        props?.handleVerifyDateNew(item?.[CubeDataset.Bdeactivities.createdAt])
        return
      }
    });
  }


  return (
    <Grid item xs={12} sm={12} md={12} lg={12}>
      <div className="allCardContaienr">
        {
          loading
            ?
            <DisplayLoader />
            :
            (allActivitiesList?.length === 0 ?
              <NoDataComponent message={'No Activity Available'} />
              :
              <InfiniteScroll
                dataLength={allActivitiesList.length}
                next={allActivityScrollFunction}
                hasMore={hasMore}
                loader={<h4>Loading...</h4>}
                endMessage={
                  <p style={{ textAlign: 'center' }}>
                    <b>No More Activities Available!</b>
                  </p>
                }
              >
                <section>
                  {
                    allActivitiesList?.map((list, index) => {
                      if (list?.['type'] === "BDE") {
                        //console.log("BDE")
                        return <BdeActivityList key={index} list={list} index={index} />
                      } else {
                        //console.log("USER")
                        return <UserActivityList key={index} list={list} index={index} />
                      }
                    })
                  }
                </section>
              </InfiniteScroll>
            )
        }
      </div>
    </Grid>
  )
}

export default AllActivities
