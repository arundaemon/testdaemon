const { CubejsApi } = require('@cubejs-client/core');
const axios = require('axios');
const WebSocketTransport = require('@cubejs-client/ws-transport');
const responseHandler = require('../utils/responseHandler');
const { envConfig } = require('./env');
const { getCubeInstance } = require('../../server/utils/utils')

const ROLE = 'EM_CRM'
let CUBE_TOKEN;
let cubeApi;

const createCubeTokenCrm = async () => {
    const requestOptions = {
        url: envConfig.REPORTING_TOOL_API+'/getToken',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },

    };
    const params = { role: ROLE }
    const response = await axios.get(requestOptions.url, { params });
    CUBE_TOKEN = response?.data?.cubeToken;
   
    //return cubeSocket();
    return getCubeInstance(CUBE_TOKEN);

}

// const cubeSocket = async () => {

//     cubeApi = new CubejsApi({
//         transport: new WebSocketTransport({
//             authorization: CUBE_TOKEN,
//             apiUrl: envConfig.CUBE_API_URL,
//         }),
//     });

//     return cubeApi;

// }
const getCubeTokenCrm = async (res, req) => {

    cubeApi = await createCubeTokenCrm();
    const boardData =  getBoards();
    const classData = getClasses();
    const countryData = getCountryCodes();
    const stateData = getStates();
    const cityData = getCities();
    const stateWiseCityList = stateList();
    const boardWiseClassList = classList();
    const learningProfileList = getLearningProfile();
    const masters = await Promise.all([boardData,classData,countryData,stateData,cityData, stateWiseCityList, boardWiseClassList, learningProfileList])
    
    return masters;
}


const getBoards = async () => {
    
    
    let boardSample = [];
    let allBoards = {};
   
    let query = {
        "measures": [],
        "order": {
            [`${envConfig.USER_MAPPING_MASTER}.board`]: "asc",
            [`${envConfig.USER_MAPPING_MASTER}.boardId`]: "asc",
        },
        "dimensions": [
            `${envConfig.USER_MAPPING_MASTER}.board`,
            `${envConfig.USER_MAPPING_MASTER}.boardId`,
        ],
        "timezone": "UTC",
        "timeDimensions": [],
        "filters": [
            {
                "member":`${envConfig.USER_MAPPING_MASTER}.board`,
                "operator":"set"
            },
            {
                "member":`${envConfig.USER_MAPPING_MASTER}.board`,
                "operator":"notEquals",
                "values":["None"]
            }
        ],
        "renewQuery": true
    };
    
    let boardData = await cubeApi.load(query)
  
    boardData.loadResponses.map(item => {
        item.data.map(boardObj => {
            let tempBoard = {};
            tempBoard.board = boardObj?.[`${envConfig.USER_MAPPING_MASTER}.board`];
            tempBoard.boardId = boardObj?.[`${envConfig.USER_MAPPING_MASTER}.boardId`];
            boardSample.push(tempBoard);            
        })
    })
   
    allBoards.boards = boardSample
    return allBoards;
}

const getClasses = async () => {
    let classSample = [];
    let allClasses = {};
    let query = {
        "measures": [],
        "order": {
            [`${envConfig.USER_MAPPING_MASTER}.userClassName`]: "asc",
            [`${envConfig.USER_MAPPING_MASTER}.classId`]: "asc",
        },
        "dimensions": [
            `${envConfig.USER_MAPPING_MASTER}.userClassName`,
            `${envConfig.USER_MAPPING_MASTER}.classId`,
            `${envConfig.USER_MAPPING_MASTER}.boardId`,
            `${envConfig.USER_MAPPING_MASTER}.board`,
        ],
        "timezone": "UTC",
        "timeDimensions": [],
        "filters": [{"member":`${envConfig.USER_MAPPING_MASTER}.userClassName`,"operator":"set"}],
        "renewQuery": true
    }
    const classData = await cubeApi.load(query)

    classData.loadResponses.map(item => {
        item.data.map(classObj => {
            let tempClass = {};
            tempClass.class = classObj?.[`${envConfig.USER_MAPPING_MASTER}.userClassName`];
            tempClass.classId = classObj?.[`${envConfig.USER_MAPPING_MASTER}.classId`];
            tempClass.boardId = classObj?.[`${envConfig.USER_MAPPING_MASTER}.boardId`];
            tempClass.board = classObj?.[`${envConfig.USER_MAPPING_MASTER}.board`];
            classSample.push(tempClass);            
        })
    })
    classSample.map(obj => {

    })
    allClasses.classes = classSample
    return allClasses;

}

const getCountryCodes = async () => {
    let countryCodeSample = [];
    let allCountryCodes = {};
    let query = {
        "measures": [],
        "order": {
            [`${envConfig.COUNTRY_STATE_CITY_MAPPING}.countryCode`]: "asc",
            [`${envConfig.COUNTRY_STATE_CITY_MAPPING}.countryId`]: "asc",
        },
        "dimensions": [
            `${envConfig.COUNTRY_STATE_CITY_MAPPING}.countryCode`,
            `${envConfig.COUNTRY_STATE_CITY_MAPPING}.countryId`,
            `${envConfig.COUNTRY_STATE_CITY_MAPPING}.countryName`,
        ],
        "filters": [{
            "member": `${envConfig.COUNTRY_STATE_CITY_MAPPING}.countryName`,
            "operator": "equals",
            "values": ["India"]
          }],
        "timezone": "UTC",
        "timeDimensions": [],
        "renewQuery": true

    };

    const countryCodeData = await cubeApi.load(query)   
    
    countryCodeData.loadResponses.map(item => {
        item.data.map(classObj => {
            let tempCountryCode = {};
            tempCountryCode.countryCode = classObj?.[`${envConfig.COUNTRY_STATE_CITY_MAPPING}.countryCode`];
            tempCountryCode.countryId = classObj?.[`${envConfig.COUNTRY_STATE_CITY_MAPPING}.countryId`];
            //tempCountryCode.countryName = classObj?.['CountryCityStateMapping.countryName'];
            countryCodeSample.push(tempCountryCode);            
        })
    })
    allCountryCodes.countryCodes = countryCodeSample
    return allCountryCodes;
}

const getStates = async () => {
    let stateSample = [];
    let allStates = {};
    let query = {
        "measures": [],
        "order": {
            [`${envConfig.COUNTRY_STATE_CITY_MAPPING}.stateName`]: "asc",
            [`${envConfig.COUNTRY_STATE_CITY_MAPPING}.stateId`]: "asc",
        },
        "dimensions": [
            `${envConfig.COUNTRY_STATE_CITY_MAPPING}.stateName`,
            `${envConfig.COUNTRY_STATE_CITY_MAPPING}.stateId`,
            `${envConfig.COUNTRY_STATE_CITY_MAPPING}.countryId`,            
        ],
        "filters": [{
            "member": `${envConfig.COUNTRY_STATE_CITY_MAPPING}.countryName`,
            "operator": "equals",
            //"values": ["INDIA"]
            "values": ["India"]
          }],
        "timezone": "UTC",
        "timeDimensions": [],
        "renewQuery": true

    }

    const stateData = await cubeApi.load(query)

    stateData.loadResponses.map(item => {
        item.data.map(stateObj => {
            let tempState = {};
            tempState.state = stateObj?.[`${envConfig.COUNTRY_STATE_CITY_MAPPING}.stateName`];
            tempState.stateId = stateObj?.[`${envConfig.COUNTRY_STATE_CITY_MAPPING}.stateId`];
            tempState.countryId = stateObj?.[`${envConfig.COUNTRY_STATE_CITY_MAPPING}.countryId`];
            stateSample.push(tempState);            
        })
    })
    allStates.states = stateSample
    return allStates;
}

const cityQuery = async (offset) => {
    let query = {
        "measures": [],
        "order": {
            [`${envConfig.COUNTRY_STATE_CITY_MAPPING}.cityName`]: "asc",
            [`${envConfig.COUNTRY_STATE_CITY_MAPPING}.cityId`]: "asc"
        },
        "dimensions": [
            `${envConfig.COUNTRY_STATE_CITY_MAPPING}.cityName`,
            `${envConfig.COUNTRY_STATE_CITY_MAPPING}.cityId`,
            `${envConfig.COUNTRY_STATE_CITY_MAPPING}.stateId`,
        ],
        "limit": 1000,
        "filters": [{
            "member": `${envConfig.COUNTRY_STATE_CITY_MAPPING}.countryName`,
            "operator": "equals",
            //"values": ["INDIA"]
            "values": ["India"]
          }],
        "offset": offset,
        "timezone": "UTC",
        "timeDimensions": [],
        "renewQuery": true,
    };
    return cubeApi.load(query)
}

const getCities = async () => {
    let citySample = [];
    let allCities = {};
   const cityCount = await cubeApi.load({
    "measures" : [`${envConfig.COUNTRY_STATE_CITY_MAPPING}.count`]
   });
  let dt = 0;
  cityCount.loadResponses.map(item => {
     item.data.map(dt1 => {
        dt=  dt1[`${envConfig.COUNTRY_STATE_CITY_MAPPING}.count`];
    })
  });

  let promise = [];
  for(let i=0; i<= dt; i+=1000) {
        promise.push(cityQuery(i));
  }
 let promiseData =  await Promise.all(promise);
    promiseData.forEach(cityData => {
        cityData.loadResponses.map(item => {
            item.data.map(cityObj => {
                let tempCity = {};
                tempCity.city = cityObj?.[`${envConfig.COUNTRY_STATE_CITY_MAPPING}.cityName`];
                tempCity.cityId = cityObj?.[`${envConfig.COUNTRY_STATE_CITY_MAPPING}.cityId`];
                tempCity.stateId = cityObj?.[`${envConfig.COUNTRY_STATE_CITY_MAPPING}.stateId`];
                citySample.push(tempCity);            
            })
        })
    })
    allCities.cities = citySample   
    return allCities;
}

const stateList = async () => {
    let stateSample = [];
    let citySample = [];
    let stateCitySample = {}
    
    let query = {
        "measures": [],
        "order": {
            [`${envConfig.COUNTRY_STATE_CITY_MAPPING}.stateName`]: "asc",
            //[`${envConfig.COUNTRY_STATE_CITY_MAPPING}.stateId`]: "asc",
        },
        "dimensions": [
            `${envConfig.COUNTRY_STATE_CITY_MAPPING}.stateName`,
            //`${envConfig.COUNTRY_STATE_CITY_MAPPING}.stateId`,
            //`${envConfig.COUNTRY_STATE_CITY_MAPPING}.countryId`,            
        ],
        "filters": [{
            "member": `${envConfig.COUNTRY_STATE_CITY_MAPPING}.countryName`,
            "operator": "equals",
            //"values": ["INDIA"]
            "values": ["India"]
          }],
        "timezone": "UTC",
        "timeDimensions": [],
        "renewQuery": true

    }
    const stateData = await cubeApi.load(query)
    stateData.loadResponses.map(item => {
        item.data.map(stateObj => {
            let tempState = {};
            tempState.state = stateObj?.[`${envConfig.COUNTRY_STATE_CITY_MAPPING}.stateName`];
            // tempState.stateId = stateObj?.[`${envConfig.COUNTRY_STATE_CITY_MAPPING}.stateId`];
            // tempState.countryId = stateObj?.[`${envConfig.COUNTRY_STATE_CITY_MAPPING}.countryId`];
            stateSample.push(tempState);            
        })
    })
    for(let item of stateSample){
        
        let tempCities = [];
        let query1 = {
            "measures": [],
            "order": {
                [`${envConfig.COUNTRY_STATE_CITY_MAPPING}.stateName`]: "asc",
                [`${envConfig.COUNTRY_STATE_CITY_MAPPING}.cityName`]: "asc",
            },
            "dimensions": [
                `${envConfig.COUNTRY_STATE_CITY_MAPPING}.stateName`,
                `${envConfig.COUNTRY_STATE_CITY_MAPPING}.cityName`,
                //`${envConfig.COUNTRY_STATE_CITY_MAPPING}.countryId`,            
            ],
            "filters": [{
                "member": `${envConfig.COUNTRY_STATE_CITY_MAPPING}.stateName`,
                "operator": "equals",
                "values": [`${item.state}`]
              }],
            "timezone": "UTC",
            "timeDimensions": [],
            "renewQuery": true
    
        };
        const stateCities = await cubeApi.load(query1)
        for(let obj of stateCities.loadResponses[0].data){
            tempState = {}
            tempState = obj?.[`${envConfig.COUNTRY_STATE_CITY_MAPPING}.cityName`];
            if(!citySample[item.state]) {
                citySample[item.state] = [];
            }
            citySample[item.state].push(obj?.[`${envConfig.COUNTRY_STATE_CITY_MAPPING}.cityName`]);
        }
        
    }
    
    stateCitySample.stateCity = citySample
    return stateCitySample


}



const classList = async () => {
    let boardSample = [];
    let classSample = [];
    let boardClassSample = {}
    
    let query = {
        "measures": [],
        "order": {
            [`${envConfig.USER_MAPPING_MASTER}.board`]: "asc",
        },
        "dimensions": [
            `${envConfig.USER_MAPPING_MASTER}.board`            
        ],
        "filters": [{
            "member":`${envConfig.USER_MAPPING_MASTER}.board`,
            "operator":"set"
          },],
        "timezone": "UTC",
        "timeDimensions": [],
        "renewQuery": true

    }
    const boardData = await cubeApi.load(query)

    boardData.loadResponses.map(item => {
        item.data.map(boardObj => {
            let tempBoard = {};
            tempBoard.board = boardObj?.[`${envConfig.USER_MAPPING_MASTER}.board`];
            
            boardSample.push(tempBoard);            
        })
    })
    for(let item of boardSample){
        let tempClasses = [];
        let query1 = {
            "measures": [],
            "order": {
                [`${envConfig.USER_MAPPING_MASTER}.userClassName`]: "asc",
            },
            "dimensions": [
                `${envConfig.USER_MAPPING_MASTER}.userClassName`,
                `${envConfig.USER_MAPPING_MASTER}.board`,            
            ],
            "filters": [{
                "member": `${envConfig.USER_MAPPING_MASTER}.board`,
                "operator": "equals",
                "values": [`${item.board}`]
              },
              {
                "member":`${envConfig.USER_MAPPING_MASTER}.userClassName`,
                "operator":"set"
              },
            ],
            "timezone": "UTC",
            "timeDimensions": [],
            "renewQuery": true
    
        }
        const boardClass = await cubeApi.load(query1)
        for(let obj of boardClass.loadResponses[0].data){
            tempBoard = {}
            tempBoard = obj?.[`${envConfig.USER_MAPPING_MASTER}.userClassName`];
            if(!classSample[item.board]) {
                classSample[item.board] = [];
            }
            if(obj?.[`${envConfig.USER_MAPPING_MASTER}.userClassName`]){
                classSample[item.board].push(obj?.[`${envConfig.USER_MAPPING_MASTER}.userClassName`]);
            }
        }
        
    }
    
    boardClassSample.boardClass = classSample
    return boardClassSample


}

const getLearningProfile = async () => {
    let profileSample = [];
    let allProfiles = {};
    let query = {
        "measures": [],
        "order": {
            [`${envConfig.LEARNING_PROFILE_MASTER}.profileName`]: "asc",
        },
        "dimensions": [
            `${envConfig.LEARNING_PROFILE_MASTER}.profileName`,            
        ],
        "filters": [],
        "timezone": "UTC",
        "timeDimensions": [],
        "renewQuery": true

    }

    const profileData = await cubeApi.load(query)
   
    profileData.loadResponses.map(item => {
        item.data.map(profileObj => {
            let tempProfile = {};
            tempProfile.learningProfile = profileObj?.[`${envConfig.LEARNING_PROFILE_MASTER}.profileName`];
            profileSample.push(tempProfile);            
        })
    })
    allProfiles.profiles = profileSample
    return allProfiles;
}




module.exports = {
    getCubeTokenCrm,
    //cubeSocket,
    createCubeTokenCrm
    //getUsers
}









