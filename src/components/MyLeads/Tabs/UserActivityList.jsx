import React from 'react';
import moment from 'moment';

import IconFirstCall from "../../../assets/icons/Icon-firstCall.svg";

const flattenData = (data) => {
  let finalObj = {}
  data?.forEach((item) => {
    finalObj[item.Attribute] = item?.Value
  })
  return finalObj
};

const UserActivityList = ({ list, index }) => {
  let data = flattenData(list?.request_json?.activityList?.[0]?.itemValues);

  // console.log(list, 'list')
  // console.log(data, '..data')

  return (
    <div className="listing-card" key={index}>
      <div className="cardDataContainer">
        <div className="left">
          <img src={IconFirstCall} alt="" className="listing-basic-icon1" ></img>
          <div className="cardData">
            <div className="listing-tab-text1">
              {data?.['activity_type'] ?? data?.['sf_name']}
            </div>

            {data?.['sf_name'] === "User Login" &&
              <>
                <div className="listing-tab-text2" >Platform :
                  <span className="subText"> {data?.['platform'] ? data?.['platform'] : 'NA'} </span>
                </div>
                <div className="listing-tab-text2" >Portal :
                  <span className="subText"> {data?.['portal'] ? data?.['portal'] : 'NA'} </span>
                </div>
                <div className="listing-tab-text2" >Login Time :
                  <span className="subText"> {moment.utc(list[`created_at`]).local().format('DD-MM-YYYY (hh:mm A)')} </span>
                </div>
                {/* <p className="listing-tabsDates">
                  {moment.utc(list[`created_at`]).local().format('DD-MM-YYYY (hh:mm A)')}
                </p> */}
              </>
            }
            {data?.['activity_type'] === "Accessed Content Learn" &&
              <>
                <div className="listing-tab-text2" >Platform :
                  <span className="subText"> {data?.['platform'] ? data?.['platform'] : 'NA'} </span>
                </div>
                <div className="listing-tab-text2" >Video Name :
                  <span className="subText"> {data?.['video_name'] ? data?.['video_name'] : 'NA'} </span>
                </div>
                <div className="listing-tab-text2" >Path :
                  <span className="subText"> {data?.['path'] ? data?.['path'] : 'NA'} </span>
                </div>
                <div className="listing-tab-text2" >Duration :
                  <span className="subText"> {data?.['duration'] ? data?.['duration'] : 'NA'} </span>
                </div>
                <div className="listing-tab-text2" >Portal :
                  <span className="subText"> {data?.['portal'] ? data?.['portal'] : 'NA'} </span>
                </div>
                <div className="listing-tab-text2" >Created At :
                  <span className="subText"> {moment.utc(list[`created_at`]).local().format('DD-MM-YYYY (hh:mm A)')} </span>
                </div>
                {/* <div className="listing-tab-text2" >Subject :
                  <span className="subText"> {data?.['subject'] ? data?.['subject'] : 'NA'} </span>
                </div> */} 
              </>
            }

            {data?.['activity_type'] === "Accessed Content Practice" &&
              <>
                <div className="listing-tab-text2" >Platform :
                  <span className="subText"> {data?.['platform'] ? data?.['platform'] : 'NA'} </span>
                </div>
                <div className="listing-tab-text2" >Path :
                  <span className="subText"> {data?.['path'] ? data?.['path'] : 'NA'} </span>
                </div>
                <div className="listing-tab-text2" >Duration :
                  <span className="subText"> {data?.['duration'] ? data?.['duration'] : 'NA'} </span>
                </div>
                <div className="listing-tab-text2" >Portal :
                  <span className="subText"> {data?.['portal'] ? data?.['portal'] : 'NA'} </span>
                </div>
                <div className="listing-tab-text2" >Created At :
                  <span className="subText"> {moment.utc(list[`created_at`]).local().format('DD-MM-YYYY (hh:mm A)')} </span>
                </div>
                {/* <div className="listing-tab-text2" >Subject :
                  <span className="subText"> {data?.['subject'] ? data?.['subject'] : 'NA'} </span>
                </div> */} 
              </>
            }

            {data?.['activity_type'] === "Accessed Content Practice" &&
              <>
                <div className="listing-tab-text2" >Platform :
                  <span className="subText"> {data?.['platform'] ? data?.['platform'] : 'NA'} </span>
                </div>
                <div className="listing-tab-text2" >Path :
                  <span className="subText"> {data?.['path'] ? data?.['path'] : 'NA'} </span>
                </div>
                <div className="listing-tab-text2" >Duration :
                  <span className="subText"> {data?.['duration'] ? data?.['duration'] : 'NA'} </span>
                </div>
                <div className="listing-tab-text2" >Portal :
                  <span className="subText"> {data?.['portal'] ? data?.['portal'] : 'NA'} </span>
                </div>
                <div className="listing-tab-text2" >Created At :
                  <span className="subText"> {moment.utc(list[`created_at`]).local().format('DD-MM-YYYY (hh:mm A)')} </span>
                </div>
                {/* <div className="listing-tab-text2" >Subject :
                  <span className="subText"> {data?.['subject'] ? data?.['subject'] : 'NA'} </span>
                </div> */} 
              </>
            }

            {data?.['activity_type'] === "Accessed Content Test" &&
              <>
                <div className="listing-tab-text2" >Platform :
                  <span className="subText"> {data?.['platform'] ? data?.['platform'] : 'NA'} </span>
                </div>
                <div className="listing-tab-text2" >Video Name :
                  <span className="subText"> {data?.['video_name'] ? data?.['video_name'] : 'NA'} </span>
                </div>
                <div className="listing-tab-text2" >Path :
                  <span className="subText"> {data?.['path'] ? data?.['path'] : 'NA'} </span>
                </div>
                <div className="listing-tab-text2" >Duration :
                  <span className="subText"> {data?.['duration'] ? data?.['duration'] : 'NA'} </span>
                </div>
                <div className="listing-tab-text2" >Portal :
                  <span className="subText"> {data?.['portal'] ? data?.['portal'] : 'NA'} </span>
                </div>
                <div className="listing-tab-text2" >Created At :
                  <span className="subText"> {moment.utc(list[`created_at`]).local().format('DD-MM-YYYY (hh:mm A)')} </span>
                </div>
                {/* <div className="listing-tab-text2" >Subject :
                  <span className="subText"> {data?.['subject'] ? data?.['subject'] : 'NA'} </span>
                </div> */} 
              </>
            }




          </div>

        </div>
      </div>
    </div>
  )
}

export default UserActivityList