import md5 from "md5";
import moment from "moment";
import CubeDataset from "../config/interface";
import Cookies from "js-cookie";
import Env_Config from "../config/settings";
import { getUserData } from "./randomFunction/localStorage";

let userData = JSON.parse(localStorage.getItem("userData"));
let loginData = JSON.parse(localStorage.getItem("loginData"));
let empId = userData?.employee_code;

export const setCookieData = () => {
  let userData = JSON.parse(localStorage.getItem("userData"));
  let empId = userData?.employee_code;
  let promise = new Promise((resolve, reject) => {
    let encodeUrl = btoa(`SET!==!${empId}!==!${userData?.username}`);
    let url = `${Env_Config.OMS_API_URL}/setcrmuserinfo/${encodeUrl}`;
    resolve(<iframe src={url}></iframe>);
  });
  return promise;
};

// export const setCookieOnLogin = () => {
//   let encodeUrl = btoa(`SET!==!${empId}!==!${userData?.username}`)
//   let url = `${Env_Config.OMS_API_URL}/setcrmuserinfo/${encodeUrl}`
//   Cookies.set('CRMUSER', url, { domain: `${Env_Config.OMS_API_URL}` })
// }

export const getLoginUserData = () => {
  let userData = JSON.parse(localStorage.getItem("userData"));
  let loginData = JSON.parse(localStorage.getItem("loginData"));
  return { userData, loginData };
};

export const redirectPage = (params) => {
  let loginData = JSON.parse(localStorage.getItem("loginData"));
  let encodeUrl = btoa(`${empId}!==!${loginData?.uuid}`);
  let url = `${Env_Config.OMS_API_URL}/orderpunch/${encodeUrl}`;
  return url;
};

export const getOnlinePaymentValue = () => {
  let apiKey = Env_Config.API_GATEWAY_API_KEY;
  let saltKey = Env_Config.API_GATEWAY_SALT_KEY;
  let empId = getLoginUserData()?.userData?.employee_code;
  let checkSum = md5(`${apiKey}:${saltKey}:${empId}`);
  return { checkSum, empId };
};

export const getDays = (data) => {
  let dayCount;

  dayCount = moment(new Date()).diff(
    moment(data?.[CubeDataset.Bdeactivities.startDateTime]),
    "days"
  );
  dayCount = dayCount > 0 ? dayCount : "";
  return dayCount;
};

export const getActivityTime = (data) => {
  let time;

  time = moment
    .utc(data?.[CubeDataset.Bdeactivities.startDateTime])
    .local()
    .format("h:mm a, Do MMM YYYY");
  return time;
};

export const getStarDateTime = (data) => {
  let startDate;

  startDate = moment
    .utc(data?.[CubeDataset.Bdeactivities.startDateTime])
    .local()
    .format(" HH:mm a");

  return startDate;
};

export const getEndDateTime = (data) => {
  let endDate;

  endDate = moment
    .utc(data?.[CubeDataset.Bdeactivities.endDateTime])
    .local()
    .format(" HH:mm a");

  return endDate;
};

export const getTimeDuration = (data) => {
  let duration;
  let start_date = data?.[CubeDataset.Bdeactivities.startDateTime];
  let end_date = data?.[CubeDataset.Bdeactivities.endDateTime];
  let hours = moment(end_date).diff(moment(start_date), "hours");
  let minutes = moment(end_date).diff(moment(start_date), "minutes");
  if (hours && minutes) {
    if (minutes < 60) {
      duration = `${hours}:${minutes} minutes`;
    } else {
      duration = `${hours}:00 hours`;
    }
  } else if (hours) {
    duration = `${hours} hours`;
  } else {
    duration = `${minutes} minutes`;
  }

  return duration;
};

export const numberIntlformate = (number) => {
  let numberObj = new Intl.NumberFormat("en-US");
  number = number.toFixed(1);
  number = numberObj.format(number);
  return number;
};

export const getActivityWithCount = (activityData) => {
  var Data = [];
  for (var data of activityData) {
    var entryFound = false;
    var tempObj = {
      activityName: data?.[CubeDataset.BdeactivitiesBq.activityName],
      count: 1,
    };

    for (var item of Data) {
      if (item.activityName === tempObj.activityName) {
        item.count++;
        entryFound = true;
        break;
      }
    }

    if (!entryFound) {
      Data.push(tempObj);
    }
  }
  return Data;
};

export const getBDMEmpRoleName = (data) => {
  let empList = data ? data?.map((obj) => obj.roleName) : [];

  empList = [...empList];

  return {
    getRoleName: empList,
    empData: data,
  };
};

export const getBDMEmpID = (data) => {
  let empList = data ? data?.map((obj) => obj.userName) : [];

  empList = [...empList];

  return empList;
};

export const getBookingDate = (data) => {
  let startDate;
  let endDate;

  var days = [];

  var currentDate = moment();

  var weekStart = currentDate.clone().startOf("isoWeek");

  for (var i = 0; i <= 6; i++) {
    days.push(moment(weekStart).add(i, "days").format("YYYY-MM-DD 00:00:00"));
  }

  if (data === "This Week") {
    startDate = days[2];
    endDate = days[4];

    return {
      startDate: startDate,
      endDate: endDate,
    };
  } else {
    startDate = days[5];
    endDate = days[6];

    return {
      startDate: startDate,
      endDate: endDate,
    };
  }
};

export const getRevenueCalc = (data) => {
  var Data = data?.reduce(function (x, y) {
    let sum;
    sum = x + y;
    return parseFloat(sum.toFixed(2));
  }, 0);

  return Data;
};

export const getSortData = (data) => {
  data = data?.filter(
    (data) =>
      data?.[CubeDataset.BdeactivitiesBq.activityId] &&
      data?.[CubeDataset.BdeactivitiesBq.activityName] &&
      data?.[CubeDataset.BdeactivitiesBq.category] &&
      data?.[CubeDataset.BdeactivitiesBq.buAverage] &&
      data?.[CubeDataset.BdeactivitiesBq.nationalAverage] &&
      data?.[CubeDataset.BdeactivitiesBq.inHead] &&
      data?.[CubeDataset.BdeactivitiesBq.buh]
  );

  return data;
};

export const getTaskSortData = (data) => {
  data = data?.filter(
    (data) =>
      data?.[CubeDataset.BdeactivitiesBq.activityId] &&
      data?.[CubeDataset.BdeactivitiesBq.activityName] &&
      data?.[CubeDataset.BdeactivitiesBq.buAverage] &&
      data?.[CubeDataset.BdeactivitiesBq.nationalAverage] &&
      data?.[CubeDataset.BdeactivitiesBq.inHead] &&
      data?.[CubeDataset.BdeactivitiesBq.buh]
  );

  return data;
};

export const handleNumberKeyDown = (event) => {
  const allowedKeys = ["Backspace", "ArrowLeft", "ArrowRight", "Delete"];
  const regex = /[0-9]/;
  if (!allowedKeys.includes(event.key) && !regex.test(event.key)) {
    event.preventDefault();
  }
};

export const handleNumberInputFieldWithDecimal = (event) => {
  const allowedKeys = ["Backspace", "ArrowLeft", "ArrowRight", "Delete"];
  const regex = /[0-9.]/;
  if (!allowedKeys.includes(event.key) && !regex.test(event.key)) {
    event.preventDefault();
  }
};

export const handleKeyDown = (event) => {
  const allowedKeys = ["Backspace", "ArrowLeft", "ArrowRight", "Delete"];
  if (!allowedKeys.includes(event.key) && /[\E\e\+\-\.]/.test(event.key)) {
    event.preventDefault();
  }
  const inputValue = event.target.value;
  if (!allowedKeys.includes(event.key)) {
    console.log(event.target, 'inputValue')
    // Check if the pressed key is "0" and the current value is not "0" or doesn't start with "0."
    if(!inputValue) {
      if (
        event.key === "0" &&
        !/^(0|\d*\.\d+)$/.test(inputValue) // Allows "0" or decimal numbers but not single "0"
      ) {
        console.log(inputValue, 'inputValue')
        event.preventDefault();
      }
    }
  }
};

export const handlePaste = (event) => {
  const clipboardData = event.clipboardData || window.clipboardData;
  const pastedData = clipboardData.getData("text");

  if (/[\E\e\+\-]/.test(pastedData)) {
    event.preventDefault();
  }
};

export const handleKeyTextDown = (event) => {
  const allowedKeys = ["Backspace", "ArrowLeft", "ArrowRight", "Delete"];
  if (
    !allowedKeys.includes(event.key) &&
    /[0-9\@\$\[\]\^\%\*\(\)\}\{\_\=\#\+\-]/.test(event.key)
  ) {
    event.preventDefault();
  }
};

export const handleKeyTextDownWithSpecialCharacters = (event) => {
  const allowedKeys = ["Backspace", "ArrowLeft", "ArrowRight", "Delete"];
  if (
    !allowedKeys.includes(event.key) &&
    /\d/.test(event.key) // Check if the key is a number
  ) {
    event.preventDefault();
  }
};

export const handleTextPaste = (event) => {
  const clipboardData = event.clipboardData || window.clipboardData;
  const pastedData = clipboardData.getData("text");

  if (/[0-9\@\$\[\]\^\%\*\(\)\}\{\_\=\#\+\-]/.test(pastedData)) {
    event.preventDefault();
  }
};

export const handleEmailTextDown = (event) => {
  const allowedKeys = ["Backspace", "ArrowLeft", "ArrowRight", "Delete"];
  if (
    !allowedKeys.includes(event.key) &&
    /[\[\]\^\%\*\(\)\}\{\=\#\+]/.test(event.key)
  ) {
    event.preventDefault();
  }
};

export const handleEmailPaste = (event) => {
  const clipboardData = event.clipboardData || window.clipboardData;
  const pastedData = clipboardData.getData("text");

  if (/[\[\]\^\%\*\(\)\}\{\=\#\+]/.test(pastedData)) {
    event.preventDefault();
  }
};

export const handleAlphaNumericText = (event) => {
  const allowedKeys = ["Backspace", "ArrowLeft", "ArrowRight", "Delete"];
  if (
    !allowedKeys.includes(event.key) &&
    /[\>\<\,\.\!\&\@\$\[\]\^\%\*\(\)\}\{\_\=\#\+\-]/.test(event.key)
  ) {
    event.preventDefault();
  }
};

export const handleAlphaNumericPaste = (event) => {
  const clipboardData = event.clipboardData || window.clipboardData;
  const pastedData = clipboardData.getData("text");

  if (/[\>\<\,\.\!\&\@\$\[\]\^\%\*\(\)\}\{\_\=\#\+\-]/.test(pastedData)) {
    event.preventDefault();
  }
};

export const isLogDay = (date) => {
  let isSmaeOrTwoDaysBefore
  let strDate = moment.utc(new Date(date)).format("YYYY-MM-DD");
  strDate = moment(strDate);
  const currentDate = moment();
  const oneDayBefore = moment(currentDate).subtract(1, "days");
  const twoDaysBefore = moment(currentDate).subtract(2, "days");
  const isOneDayBefore = oneDayBefore.isSame(strDate, "day");
  const isTwoDaysBefore = twoDaysBefore.isSame(strDate, "day");
  const isSameDay = currentDate.isSame(strDate, "day");
  isSmaeOrTwoDaysBefore = (isSameDay || isOneDayBefore || isTwoDaysBefore)
  return isSmaeOrTwoDaysBefore
};

export const isDisabledDate = (date) => {
  let strDate = moment(new Date(date)).format("YYYY-MM-DD");
  strDate = moment(strDate);
  const currentDate = moment();
  const threeDaysBefore = moment(currentDate).subtract(2, "days");
  const isThreeDaysBefore = threeDaysBefore.isSame(strDate, "day");
  return isThreeDaysBefore
}

export const handleStartMonth = (range) => {
  let startMonth;
  let targetMonthArray = []
  let currentDate = new Date()
  let currentMonth = currentDate.getMonth()
  let currentYear = currentDate.getFullYear()
  let curentQuarter = Math.ceil((currentMonth + 1) / 3)

  if (range === 'This Month') {
    return 'This Month'
  }
  else if (range === 'This Year') {
    let financialMonth = 3
    for (let i = 0; i < 12; i++) {
      if (i == 0) {
        let startingDate = moment(new Date(currentYear, financialMonth, 1)).format('DD MMMM YYYY')
        //setStartDate(startingDate)
        targetMonthArray.push(startingDate)

      }
      if (i == 11) {
        let endingDate = moment(new Date(currentYear, financialMonth + 1, 0)).format('DD MMMM YYYY')
        //setEndDate(endingDate)
        targetMonthArray.push(endingDate)

      }
      financialMonth++;
      if (financialMonth === 12) {
        financialMonth = 0
        currentYear++
      }
    }
  }
  else {
    return 'This Quarter'
  }
  return targetMonthArray
}


export const dataForSubmit = async (data, uuid) => {

  const countryDetailsArray = [];
  data?.country_details.forEach((obj) => {

    const countryDetails = {
      country_id: (obj.country_id),
      country_code: (obj.country_code),
    };
    countryDetailsArray.push(countryDetails);
  });

  const regionDetailsArray = [];

  // Iterate through the selected cityData
  data?.region_details.forEach((obj) => {
    // Create an object for each city
    const regionDetails = {
      city_id: obj.value,
      city_code: obj.code,
    };

    // Push the object to the cityDetailsArray
    regionDetailsArray.push(regionDetails);
  });



  const stateDetailsArray = [];
  data?.state_details.forEach((obj) => {
    const stateDetails = {
      state_id: obj.state_id,
      state_code: obj.state_code,
    };
    stateDetailsArray.push(stateDetails);
  });


  const cityDetailsArray = [];
  data?.city_details.forEach((obj) => {
    const cityDetails = {
      city_id: obj.city_id,
      city_code: obj.city_code,
    };


    cityDetailsArray.push(cityDetails);
  });



  const campaignDetailsArray = [];
  data?.campaign_details.forEach((obj) => {
    const campaignDetails = {
      campaign_id: obj.campaign_id,
      campaign_code: obj.campaign_code,
    };
    campaignDetailsArray.push(campaignDetails);
  });



  const sourceDetailsArray = [];
  data?.source_details.forEach((obj) => {
    const sourceDetails = {
      source_id: obj.source_id,
      source_code: obj.source_code,
    };
    sourceDetailsArray.push(sourceDetails);
  });



  const subSourceDetailsArray = [];
  data?.sub_source_details.forEach((obj) => {

    const subSourceDetails = {
      sub_source_id: obj.sub_source_id,
      sub_source_code: obj.sub_source_code,
    };

    subSourceDetailsArray.push(subSourceDetails);
  });


  if (data) {
    let params = {
      uuid: uuid,
      matrix_status: 1,
      pricing_matrix_details: {
        matrix_name: `Clone_${data?.matrix_name}`,
        matrix_type_id: data?.matrix_type_id,
        product_id: data?.product_id,
        package_id: data?.package_id,
        syllabus_details: [
          {
            board_ids: data?.board_details.map(item => item.board_id),
            class_ids: data?.class_details.map(item => item.class_id),
            syllabus_child_attribute: "class_ids",

          },
        ],
        location_details: [
          {
            country_details: countryDetailsArray,


            state_details: stateDetailsArray,
            city_details: cityDetailsArray,

            region_details: [
              {
                region_id: 10,
                region_code: "",
              },
            ],


            location_child_attribute: "city_details",
          },
        ],
        school_details: [

        ],
        campaign_details: campaignDetailsArray,
        source_details: [
          {
            source: sourceDetailsArray,

            sub_source_details: subSourceDetailsArray,

            source_child_attribute: "sub_source_details",
          },
        ],

        channel_ids: data?.channel_details.map(item => item.channel_id),



        "x_axis_details": {
          "matrix_attribute_id": data?.x_axis_details?.matrix_attribute_id,
          "matrix_attribute_name": data?.x_axis_details?.matrix_attribute_name,
          "matrix_sub_attributes_source": data?.x_axis_details?.matrix_sub_attributes_source,
          "matrix_sub_attributes_value_input_type": data?.x_axis_details?.matrix_sub_attributes_value_input_type,
          "axis_min_val": data?.x_axis_details?.axis_min_val,
          "axis_max_val": data?.x_axis_details?.axis_max_val,
          "matrix_sub_attributes_value": (data?.x_axis_details?.matrix_sub_attributes_value.map(item => item.sub_attribute_id)),
        },
        "y_axis_details": {
          "matrix_attribute_id": data?.y_axis_details?.matrix_attribute_id,
          "matrix_attribute_name": data?.y_axis_details?.matrix_attribute_name,
          "matrix_sub_attributes_source": data?.y_axis_details?.matrix_sub_attributes_source,
          "matrix_sub_attributes_value_input_type": data?.y_axis_details?.matrix_sub_attributes_value_input_type,
          "axis_min_val": data?.y_axis_details?.axis_min_val,
          "axis_max_val": data?.y_axis_details?.axis_max_val,
          "matrix_sub_attributes_value": (data?.y_axis_details?.matrix_sub_attributes_value.map(item => item.sub_attribute_id)),

        },

        matrix_details: data?.matrix_details,
      },
    };

    return params
  }


}


export const statusChangeDataForSubmit = async (data, uuid) => {

  const countryDetailsArray = [];
  data?.country_details.forEach((obj) => {

    const countryDetails = {
      country_id: (obj.country_id),
      country_code: (obj.country_code),
    };
    countryDetailsArray.push(countryDetails);
  });


  const stateDetailsArray = [];
  data?.state_details.forEach((obj) => {
    const stateDetails = {
      state_id: obj.state_id,
      state_code: obj.state_code,
    };
    stateDetailsArray.push(stateDetails);
  });


  const cityDetailsArray = [];
  data?.city_details.forEach((obj) => {
    const cityDetails = {
      city_id: obj.city_id,
      city_code: obj.city_code,
    };


    cityDetailsArray.push(cityDetails);
  });



  const campaignDetailsArray = [];
  data?.campaign_details.forEach((obj) => {
    const campaignDetails = {
      campaign_id: obj.campaign_id,
      campaign_code: obj.campaign_code,
    };
    campaignDetailsArray.push(campaignDetails);
  });



  const sourceDetailsArray = [];
  data?.source_details.forEach((obj) => {
    const sourceDetails = {
      source_id: obj.source_id,
      source_code: obj.source_code,
    };
    sourceDetailsArray.push(sourceDetails);
  });



  const subSourceDetailsArray = [];
  data?.sub_source_details.forEach((obj) => {

    const subSourceDetails = {
      sub_source_id: obj.sub_source_id,
      sub_source_code: obj.sub_source_code,
    };

    subSourceDetailsArray.push(subSourceDetails);
  });


  if (data) {
    let params = {
      uuid: uuid,
      matrix_status: data?.matrix_status == 1 ? 2 : 1,
      pricing_matrix_id: data?.pricing_matrix_id,
      pricing_matrix_details: {
        matrix_name: data?.matrix_name,
        matrix_type_id: data?.matrix_type_id,
        product_id: data?.product_id,
        package_id: data?.package_id,
        syllabus_details: [
          {
            board_ids: data?.board_details.map(item => item.board_id),
            class_ids: data?.class_details.map(item => item.class_id),
            syllabus_child_attribute: "class_ids",

          },
        ],
        location_details: [
          {
            country_details: countryDetailsArray,


            state_details: stateDetailsArray,
            city_details: cityDetailsArray,

            region_details: [
              {
                // region_id: 10,
                // region_code: "",

              },
            ],


            location_child_attribute: "city_details",
          },
        ],
        school_details: [

        ],
        campaign_details: campaignDetailsArray,
        source_details: [
          {
            source: sourceDetailsArray,

            sub_source_details: subSourceDetailsArray,

            source_child_attribute: "sub_source_details",
          },
        ],

        channel_ids: data?.channel_details.map(item => item.channel_id),



        "x_axis_details": {
          "matrix_attribute_id": data?.x_axis_details?.matrix_attribute_id,
          "matrix_attribute_name": data?.x_axis_details?.matrix_attribute_name,
          "matrix_sub_attributes_source": data?.x_axis_details?.matrix_sub_attributes_source,
          "matrix_sub_attributes_value_input_type": data?.x_axis_details?.matrix_sub_attributes_value_input_type,
          "axis_min_val": data?.x_axis_details?.axis_min_val,
          "axis_max_val": data?.x_axis_details?.axis_max_val,
          "matrix_sub_attributes_value": (data?.x_axis_details?.matrix_sub_attributes_value.map(item => item.sub_attribute_id)),
        },
        "y_axis_details": {
          "matrix_attribute_id": data?.y_axis_details?.matrix_attribute_id,
          "matrix_attribute_name": data?.y_axis_details?.matrix_attribute_name,
          "matrix_sub_attributes_source": data?.y_axis_details?.matrix_sub_attributes_source,
          "matrix_sub_attributes_value_input_type": data?.y_axis_details?.matrix_sub_attributes_value_input_type,
          "axis_min_val": data?.y_axis_details?.axis_min_val,
          "axis_max_val": data?.y_axis_details?.axis_max_val,
          "matrix_sub_attributes_value": (data?.y_axis_details?.matrix_sub_attributes_value.map(item => item.sub_attribute_id)),

        },

        matrix_details: data?.matrix_details,
      },
    };

    return params
  }


}


export const handleHsnCodeValidation = (event) => {
  const allowedKeys = ["Backspace", "ArrowLeft", "ArrowRight", "Delete"];
  const regex = /[0-9]/;
  const inputValue = event.target.value

  if (!allowedKeys.includes(event.key) && !regex.test(event.key)) {
    event.preventDefault();
  }
  if (inputValue.length >= 10 && !allowedKeys.includes(event.key)) {
    event.preventDefault();
  }
};

export const itemCodeValidation = (event) => {
  const allowedKeys = ["Backspace", "ArrowLeft", "ArrowRight", "Delete"];
  const inputValue = event.target.value
  if (
    !allowedKeys.includes(event.key) &&
    /[\>\<\,\.\!\&\@\$\[\]\^\%\*\(\)\}\{\_\=\#\+\-]/.test(event.key)
  ) {
    event.preventDefault();
  }
  if (inputValue.length > 31 && !allowedKeys.includes(event.key)) {
    event.preventDefault();
  }

};

export const handleNumKeyDown = (event) => {
  const allowedKeys = ["Backspace", "ArrowLeft", "ArrowRight", "Delete"];
  if (!allowedKeys.includes(event.key) && /[\E\e\+\-\.]/.test(event.key)) {
    event.preventDefault();
  }
};

export const handleNumKeyPaste = (event) => {
  const clipboardData = event.clipboardData || window.clipboardData;
  const pastedData = clipboardData.getData("text");

  if (/[\E\e\+\-]/.test(pastedData)) {
    event.preventDefault();
  }
};


export const handleKeyTextNum = (event) => {
  const allowedKeys = ["Backspace", "ArrowLeft", "ArrowRight", "Delete"];
  if (
    !allowedKeys.includes(event.key) &&
    /[\|\\\'\"\:\&\<\>\!\.\@\$\[\]\^\%\*\(\)\}\{\_\=\#\+\-]/.test(event.key)
  ) {
    event.preventDefault();
  }
};


export const handleKeyTextNumPaste = (event) => {
  const clipboardData = event.clipboardData || window.clipboardData;
  const pastedData = clipboardData.getData("text");

  if (/[\|\\\'\"\:\&\<\>\!\.\@\$\[\]\^\%\*\(\)\}\{\_\=\#\+\-]/.test(pastedData)) {
    event.preventDefault();
  }
};






