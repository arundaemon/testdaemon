import React, {useEffect, useState} from 'react';

import { getUserActivities } from '../../../config/services/bdeActivities';
import { DisplayLoader } from '../../../helper/Loader';
import NoDataComponent from '../NoDataComponent';
import UserActivityList from './UserActivityList';

const UserActivity = (props) => {

  const [userActivitiesList, setUserActivitiesList] = useState([]);
  const [loading, setLoading] = useState(true)
  const leadObj = props?.leadObj
  const lead_Uuid = leadObj?.leadId

  const getUserActivitiesList = () =>{
    let params = {user_id: lead_Uuid}
    getUserActivities(params)
    .then((res) =>{
      let sortedData = res?.result?.sort((a,b) => (new Date(b['created_at']) - new Date(a['created_at'])))
      setUserActivitiesList(sortedData)
      setLoading(false);
    })
    .catch((error) =>{
      console.error(error);
      setLoading(false);
    })
  }

  // console.log(userActivitiesList,'...list')

  useEffect(() =>{
    getUserActivitiesList()
  },[])
  
 
  return (
    <div className="allCardContaienr">
      
        {
          loading?
          <DisplayLoader />
          :
          (userActivitiesList?.length === 0 ?
            <NoDataComponent message={'No User Activity Available'} />
          :
          <section>
            {
              userActivitiesList?.map((list,index) => <UserActivityList list={list} index={index} />)
            }
          </section>)
        }
    </div>
  )
}

export default UserActivity