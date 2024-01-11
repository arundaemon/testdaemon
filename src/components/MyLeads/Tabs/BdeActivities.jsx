import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import moment from 'moment';
import { getBdeActivitiesList } from '../../../config/services/bdeActivities';
import { DisplayLoader } from '../../../helper/Loader';
import NoDataComponent from '../NoDataComponent';
import BdeActivityList from './BdeActivityList';
import { EndMessage, LoadingMessage } from './Message';
import _ from "lodash";

const BdeActivities = (props) => {
  const [bdeActivitiesLists, setBdeActivitiesLists] = useState([])
  const [sortedbdeActivitiesLists, setSortedBdeActivitiesLists] = useState([])
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(4);
  const [hasMore, setHasMore] = useState(true);
  const leadObj = props?.leadObj


  const bdeActivityList = (scroll = false) => {
    let updatedDays = days;
    if (scroll) {
      updatedDays = days + 30
    }
    let params = { leadId: leadObj?.leadId }
    getBdeActivitiesList(params)
      .then((result) => {
        let data = result?.result;
        setBdeActivitiesLists(data);
        if (data?.length < 10 || data?.length === bdeActivitiesLists.length) {
          setHasMore(false)
        }
        setLoading(false);

      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
        setHasMore(false)
      })
  }



  const bdeScrollFunction = () => {
    bdeActivityList(true);
  }

  useEffect(() => {
    bdeActivityList()
  }, [props.leadStageStatus]);

  return (
    <div className="allCardContaienr">
      {
        loading
          ?
          <DisplayLoader />
          :
          (bdeActivitiesLists?.length === 0 ?
            <NoDataComponent message={'No BDE Activity Available'} />
            :
            <InfiniteScroll
              dataLength={bdeActivityList.length}
              next={bdeScrollFunction}
              hasMore={hasMore}
              loader={<LoadingMessage />}
              endMessage={<EndMessage />}
            >
              <section>
                {
                  bdeActivitiesLists?.map((list, index) => <BdeActivityList list={list} index={index} />)
                }
              </section>
            </InfiniteScroll>
          )
      }
    </div>
  )
}

export default BdeActivities

