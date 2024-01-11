const territoryMappingControls = require('../controllers/territoryMappingControls');
const customExceptions = require('../responseModels/customExceptions')

const createTerritory = async (params) => {
  let { citiesTagged } = params
  let { countryDetails } = params
  const territoryCode = await territoryMappingControls.getTerritoryListCount()
  params["territoryCode"] = territoryCode

  let territoryEntries = citiesTagged.map((city, i) => {
    return {
      ...params,
      cityName: city?.['cityName'], countryName: countryDetails?.[i]?.['countryName'],
      countryCode: countryDetails?.[i]?.['countryCode'],
      stateCode: countryDetails?.[i]?.['stateCode'],
      stateName: countryDetails?.[i]?.['stateName'],
      cityCode: city?.['cityCode']
    }
  })

  return territoryMappingControls.isDuplicateTerritory(params.territoryName)
    .then(result => {
      if (result) {
        throw customExceptions.territoryExists()
      }
      return territoryMappingControls.createTerritory(territoryEntries)
    })
    .then(result => {
      return { message: `Territory is created`, result }
    })
    .catch(error => {
      throw error
    })
}

const getTerritoryList = async (params) => {
  let TerritoryList = territoryMappingControls.getTerritoryList(params);
  return Promise.all([TerritoryList])
    .then(response => {
      let [result] = response
      return { message: 'Territory List', result }
    })
    .catch(error => {
      throw { errorMessage: error }
    })
}

const updateTerritory = async (params) => {
  let { citiesTagged } = params
  let { countryDetails } = params
  let territoryEntries = citiesTagged.map((city, i) => {
    return {
      ...params,
      cityName: city?.['cityName'], countryName: countryDetails?.[i]?.['countryName'],
      countryCode: countryDetails?.[i]?.['countryCode'],
      stateCode: countryDetails?.[i]?.['stateCode'],
      stateName: countryDetails?.[i]?.['stateName'],
      cityCode: city?.['cityCode']
    }
  })

  return territoryMappingControls.updateTerritory(territoryEntries)
    .then(data => {
      return { message: `Territory updated successfully`, data }
    })
    .catch(error => {
      throw { errorMessage: error }
    })
}

const countTerritory = () => {
  return territoryMappingControls.getTerritoryListCount()
    .then(res => {
      return { message: `Territory count`, res }
    })
    .catch(error => {
      throw { errorMessage: error }
    })
}

const isDuplicateTerritoryByCityName = async (stateName, stateCode, cityName, cityCode) => {
  return territoryMappingControls.isDuplicateTerritoryByCityName(stateName, stateCode, cityName, cityCode)
    .then(result => {
      return { message: `${cityName} ${result?.length > 0 ? "already" : "not"} assigned`, result }
    })
    .catch(error => {
      throw { errorMessage: error }
    })

}

const getTerritoryDetails = async (id) => {
  return territoryMappingControls.getTerritoryDetails(id)
    .then(result => {
      return { message: `Territory details`, result }
    })
    .catch(error => {
      throw { errorMessage: error }
    })
}

const getTerritory = async (params) => {
  return territoryMappingControls.getTerritory(params)
    .then(result => {
      return { message: `Territory details`, result }
    })
    .catch(error => {
      throw { errorMessage: error }
    })
}

const getTerritoryByCode = async (params) => {
  return territoryMappingControls.getTerritoryByCode(params)
    .then(result => {
      return { message: `Territory details by territory code`, result }
    })
    .catch(error => {
      throw { errorMessage: error }
    })
}


module.exports = {
  createTerritory,
  getTerritoryList,
  getTerritoryDetails,
  updateTerritory,
  countTerritory,
  isDuplicateTerritoryByCityName,
  getTerritory,
  getTerritoryByCode
}
