import { Breadcrumbs, Divider, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Select from 'react-select';
import { Link, useNavigate, useParams } from 'react-router-dom';
import BredArrow from '../../assets/image/bredArrow.svg'
import TaggedCities from './TaggedCities';
import _ from 'lodash';
import { getCityData, getStateData } from "../../helper/DataSetFunction";
import toast from 'react-hot-toast';
import { DecryptData } from '../../utils/encryptDecrypt';
import moment from 'moment'
import {
  createTerritory,
  duplicateTerritoryByCity,
  getTerritoryCount,
  getTerritoryDetails,
  updateTerritory
} from '../../config/services/territoryMapping';
import { makeStyles } from "@mui/styles";


const useStyles = makeStyles(() => ({
  pageContainer: {
    boxShadow: "0px 0px 8px rgb(0 0 0 / 16%)",
    borderRadius: "8px",
    padding: "20px",
    paddingBottom: "30px",
    margin: "20px",
  },
  conatiner: {
    display: 'flex',
    marginTop: '-20px'
  },
  label: {
    font: "normal normal 600 14px/ 38px Open Sans",
    letterSpacing: "0px",
    color: "#85888A",
  },
  labelDivContainer: {
    width: "calc(33% - 30px)",
    marginRight: "100px",
  },
  labelDiv: {
    display: "flex",
    marginTop: "20px",
    flexDirection: "column",
  },
  inputField: {
    border: '1px solid #cccccc',
    borderRadius: '6px',
    padding: '8px 15px',
    fontSize: '18px',
  },
  addCityBtn: {
    fontWeight: "600",
    fontSize: "16px",
    lineHeight: "22px",
    cursor: "pointer",
    borderRadius: "4px",
    color: "white",
    border: "1px solid #F45E29",
    padding: "12px 24px",
    background: "#F45E29",
    marginLeft: "20px"
  },
  addCityBtnDiv: {
    display: "flex",
    justifyContent: "flex-end",
    paddingRight: "20px",
    marginTop: '10px'
  },
  btnDiv: {
    display: "flex",
    justifyContent: "flex-end",
    paddingRight: "20px",
    marginBottom: '10px'
  },
  submitBtn: {
    fontWeight: "600",
    fontSize: "16px",
    lineHeight: "22px",
    cursor: "pointer",
    borderRadius: "4px",
    color: "white",
    border: "1px solid #F45E29",
    padding: "12px 24px",
    background: "#F45E29",
    marginLeft: "20px"
  },
  cancelBtn: {
    border: "1px solid #F45E29",
    padding: "12px 24px",
    color: "#F45E29",
    borderRadius: "4px",
    fontWeight: "600",
    fontSize: "16px",
    lineHeight: "22px",
    cursor: "pointer"
  },
  colorLabel: {
    display: "flex",
    marginTop: "1px",
    flexDirection: "column",
    background: 'rgb(214 210 210)',
    padding: '2px 12px',
    minHeight: '40px'
  }
}))

const CreateTerritory = () => {
  const [territoryName, setterritoryName] = useState('')
  const [regionalSPOCList, setRegionalSPOCList] = useState([])
  const [regionalSPOCValue, setRegionalSPOCValue] = useState('')
  const [buHead1, setBuHead1] = useState('')
  const [buHead1List, setBuHead1List] = useState([])
  const [buHead2, setBuHead2] = useState('')
  const [buHead2List, setBuHead2List] = useState([])
  const [retailHead, setRetailHead] = useState('')
  const [retailHeadList, setRetailHeadList] = useState([])
  const [state, setState] = useState(null)
  const [inputCity, setInputCity] = useState("")
  const [selectedCity, setSelectedCity] = useState([])
  const [dataToAdd, setDataToAdd] = useState({});
  const [citySelectData, setCitySelectData] = useState([]);
  const [city, setCity] = useState({ label: 'Search City', value: null })
  const [getState, setStateData] = useState({ label: 'Search State', value: null })
  const [countryArray, setCountryArray] = useState([])
  const [createdBy] = useState(JSON.parse(localStorage.getItem('userData'))?.name);
  const [modifiedBy] = useState(JSON.parse(localStorage.getItem('userData'))?.name);
  // const [territoryCode, setTerritoryCode] = useState()
  const [territoryData, setTerritoryData] = useState({})
  const [active, setActive] = useState(false)
  const [inActive, setInActive] = useState(false)
  const classes = useStyles();
  const navigate = useNavigate();
  const { territoryId } = useParams();

  const breadcrumbs = [
    <Link
      underline="hover"
      key="1"
      color="inherit"
      to='/authorised/territory-listing'
      className={classes.breadcrumbsClass}
    >
      Listing
    </Link>,
    <Typography key="3" color="text.primary" fontWeight="600" fontSize="14px">
      {territoryId ? "Edit" : "Create New"}
    </Typography>
  ];


  const handleTerritoryName = (e) => {
    setterritoryName(e.target.value)
  }

  const handleRetailSPOC = (value) => {
    setRegionalSPOCValue(value)
  }
  const handleDropDownValues = (data) => {
    let buh1 = data.filter((item) => item.roleName.includes("BUH1"))
    let buh2 = data.filter((item) => item.roleName.includes("BUH2"))
    let rbuh = data.filter((item) => item.roleName.includes("RBUH"))

    setBuHead1List(buh1)
    setBuHead2List(buh2)
    setRetailHeadList(rbuh)
  }

  const handleBuHead1 = (value) => {
    setBuHead1(value)
  }
  const handleBuHead2 = (value) => {
    setBuHead2(value)
  }

  const handleRetailHead = (value) => {
    setRetailHead(value)
  }

  const getCityResult = async (cityName) => {
    try {
      let stateDataOption = []
      let res = await getCityData(getState?.value, cityName);
      res = res.rawData()
      res?.map(data => {
        stateDataOption.push({
          label: data?.['CountryCityStateMapping.cityName'],
          value: data?.['CountryCityStateMapping.cityName'],
          cityCode: data?.['CountryCityStateMapping.cityCode'],
        })
      })
      setCitySelectData(stateDataOption);
    } catch (err) {
      console.error(err?.response);
    }
  }

  const onCitySearch = (e) => {
    setInputCity(e)
  }

  const getStateResult = async () => {
    try {
      let stateDataOption = []
      let res = await getStateData();
      res = res?.loadResponses?.[0]?.data
      res?.map(data => {
        stateDataOption.push({
          label: data?.['CountryCityStateMapping.stateName'],
          value: data?.['CountryCityStateMapping.stateName'],
          countryCode: data?.['CountryCityStateMapping.countryCode'],
          stateName: data?.['CountryCityStateMapping.stateName'],
          stateCode: data?.['CountryCityStateMapping.stateCode'],
          countryName: data?.['CountryCityStateMapping.countryName'],
        })
      })
      setState(stateDataOption);
    } catch (err) {
      console.error(err?.response);
    }
  }

  const checkCityDuplicacy = (array, cityName) => {
    return array.some(item => item?.cityName === cityName)
  }

  const checkCityDuplicacyinDatabase = async () => {
    try {
      let data = { stateName: getState?.value, stateCode: getState?.stateCode, cityName: city?.value, cityCode: city?.cityCode };
      const res = await duplicateTerritoryByCity(data);
      let result = res?.result;
      if (result?.length > 0) {
        toast.error(res?.message);
        return 1;
      } else {
        return 0;
      }
    } catch (err) {
      console.error(err, 'Error while checking duplicate city in DB');
      throw err;
    }
  };

  const handleAddCity = async () => {
    try {
      if (city?.value !== null) {
        let data = await checkCityDuplicacyinDatabase()
        if (data == 1) {
          setCity({ label: 'Select City', value: null })
          return
        }
        let countryName = getState?.["countryName"]
        let countryCode = getState?.["countryCode"]
        let stateCode = getState?.['stateCode']
        let stateName = getState?.['stateName']
        let cityCode = city?.cityCode
        setCountryArray([...countryArray, { countryName, countryCode, stateCode, stateName }])
        let cityValue = city?.value
        if (!checkCityDuplicacy(selectedCity, cityValue)) { // check for duplicates
          setSelectedCity([...selectedCity, { cityName: cityValue, cityCode }])
          setCity({ label: 'Select City', value: null })
        }
        else {
          toast.error(cityValue + ' already Tagged')
          setCity({ label: 'Select City', value: null })
          return
        }
      }
      else {
        toast.dismiss()
        toast.error("Please select city")
        return
      }
    }
    catch (err) {
      console.error('Error while adding city')
    }
  }


  const addTerritory = async (data) => {
    createTerritory(data)
      .then((res) => {
        if (res?.result) {
          toast.success(res?.message)
          setTimeout(() => {
            navigate('/authorised/territory-listing');
          }, 800);
        }
        else if (res?.data?.statusCode === 0) {
          let { errorMessage } = res?.data?.error
          toast.error(errorMessage)
        }
      })
      .catch((error) => console.error(error, '...errror'))
  }

  const editTerritory = (data) => {
    updateTerritory(data)
      .then(res => {
        if (res?.data) {
          toast.success(res?.message)
          setTimeout(() => {
            navigate('/authorised/territory-listing');
          }, 800);
        }
      })
      .catch((err) => {
        console.error(err, '...error')
      })
  }


  // const territoryCountFunction = async () => {
  //   getTerritoryCount()
  //     .then((result) => {
  //       let count = result?.res + 1
  //       let totalDigits = count?.toString().length;
  //       let code;
  //       if (totalDigits < 2) {
  //         code = "TR00" + count
  //       }
  //       else if (totalDigits < 3) {
  //         code = "TR0" + count
  //       }
  //       else {
  //         code = "TR" + count
  //       }
  //       setTerritoryCode(code)
  //     })
  //     .catch((err) => {
  //       console.error(err, '...error')
  //     })
  // }

  const getTerritoryData = () => {
    getTerritoryDetails(territoryId)
      .then((res) => {
        let data = res?.result
        let citiesTagged = data?.map(item => ({ cityName: item?.cityName, cityCode: item?.cityCode }))
        let countryDetails = data?.map(item => ({ countryName: item?.countryName, countryCode: item?.countryCode, stateCode: item?.stateCode, stateName: item?.stateName }))
        setCountryArray(countryDetails)
        setTerritoryData(data[0])
        setterritoryName(data?.[0]?.territoryName)
        setRegionalSPOCValue(data?.[0]?.regionalSPOC)
        setBuHead1(data?.[0]?.buHead1)
        setBuHead2(data?.[0]?.buHead2)
        setRetailHead(data?.[0]?.retailHead)
        setSelectedCity(citiesTagged)
        if (data?.[0]?.status === 1) {
          setActive(1)
          setInActive(0)
        }
        else {
          setInActive(1)
          setActive(0)
        }
      })
      .catch((err) => {
        console.error(err, '...error')
      })
  }

  const handleSubmit = async () => {
    let filledDetails = _.cloneDeep(dataToAdd)
    if (!territoryName || !buHead2 || selectedCity?.length === 0) {
      toast.error('Please fill all the required fields');
      return;
    }
    // filledDetails.territoryCode = territoryCode
    filledDetails.territoryName = territoryName;
    filledDetails.regionalSPOC = regionalSPOCValue;
    filledDetails.buHead1 = buHead1;
    filledDetails.buHead2 = buHead2;
    filledDetails.retailHead = retailHead;
    filledDetails.citiesTagged = selectedCity
    filledDetails.createdBy = createdBy
    filledDetails.modifiedBy = modifiedBy
    filledDetails.countryDetails = countryArray
    addTerritory(filledDetails)
  }

  const handleUpdate = () => {
    let filledDetails = _.cloneDeep(dataToAdd)
    if (!territoryName || !buHead2 || selectedCity?.length === 0) {
      toast.error('Please fill all the required fields');
      return;
    }
    filledDetails.territoryName = territoryName;
    filledDetails.regionalSPOC = regionalSPOCValue;
    filledDetails.buHead1 = buHead1;
    filledDetails.buHead2 = buHead2;
    filledDetails.retailHead = retailHead;
    filledDetails.citiesTagged = selectedCity
    filledDetails.territoryCode = territoryId
    filledDetails.modifiedBy = modifiedBy
    filledDetails.createdAt = territoryData?.createdAt
    filledDetails.createdBy = territoryData?.createdBy
    filledDetails.countryDetails = countryArray
    if (inActive == 1) filledDetails.status = 0
    if (active == 1) filledDetails.status = 1
    editTerritory(filledDetails)
  }

  const handleActive = (e) => {
    setActive(e.target.checked)
    if (e.target.checked) setInActive(false)

  }
  const handleNotActive = (e) => {
    setInActive(e.target.checked)
    if (e.target.checked) setActive(false)
  }

  const toTerritoryListing = () => {
    navigate('/authorised/territory-listing')
  }

  useEffect(() => {
    let data = DecryptData(localStorage.getItem('childRoles'))
    let modifiedData = data?.map((obj) => {
      return {
        roleName: obj.roleName,
        displayName: obj.displayName
      };
    });
    getStateResult()
    setRegionalSPOCList(modifiedData)
    // if (!territoryId)
    //   territoryCountFunction()

    handleDropDownValues(modifiedData)
  }, [])




  useEffect(() => {
    if (getState && getState.value) {
      getCityResult();
      setCity({
        label: 'Select City',
        value: null
      })
    }
  }, [getState]
  );

  useEffect(
    () => {
      const getData = setTimeout(() => {
        if (getState && getState.value) {
          getCityResult(inputCity)
        }
      }, 500)

      return () => clearTimeout(getData)
    }, [inputCity]
  );

  useEffect(() => {
    if (territoryId) {
      getTerritoryData();
    }
  }, [territoryId])

  return (
    <>
      <div style={{ marginLeft: '10px' }}>
        <Breadcrumbs className={`listing-breadcrumbs ${classes.breadcrumbsBar}`}
          separator={<img src={BredArrow} />}
          aria-label="breadcrumb"
        >
          {breadcrumbs}
        </Breadcrumbs>
      </div>
      <div className={classes.pageContainer}>
        <div className={classes.conatiner}>
          <div className={classes.labelDivContainer}>
            <div className={classes.labelDiv}>
              <label className={classes.label}>Territory Name *</label>
              <input className={classes.inputField} type="text" id="outlined-basic" value={territoryName} onChange={handleTerritoryName} />
            </div>
            <div className={classes.labelDiv} >
              <label className={classes.label}>Regional SPOC</label>
              <Select
                className="basic-single"
                classNamePrefix="select"
                name="color"
                options={regionalSPOCList}
                getOptionLabel={(option) => (option.displayName + ' (' + option.roleName + ')')}
                getOptionValue={(option) => option}
                onChange={handleRetailSPOC}
                value={regionalSPOCValue}
                isClearable={true}
              />
            </div>
            <div className={classes.labelDiv}>
              <label className={classes.label} >BU Head-1</label>
              <Select
                className="basic-single"
                classNamePrefix="select"
                name="color"
                options={buHead1List}
                getOptionLabel={(option) => (option.displayName + ' (' + option.roleName + ')')}
                getOptionValue={(option) => option}
                onChange={handleBuHead1}
                value={buHead1}
                isClearable={true}
              />
            </div>
            <div className={classes.labelDiv}>
              <label className={classes.label}>BU Head-2 *</label>
              <Select
                className="basic-single"
                classNamePrefix="select"
                name="color"
                options={buHead2List}
                getOptionLabel={(option) => (option.displayName + ' (' + option.roleName + ')')}
                getOptionValue={(option) => option}
                onChange={handleBuHead2}
                value={buHead2}
                isClearable={true}
              />
            </div>
            <div className={classes.labelDiv}>
              <label className={classes.label}>Retail Head</label>
              <Select
                className="basic-single"
                classNamePrefix="select"
                name="color"
                options={retailHeadList}
                getOptionLabel={(option) => (option.displayName + ' (' + option.roleName + ')')}
                getOptionValue={(option) => option}
                onChange={handleRetailHead}
                value={retailHead}
                isClearable={true}
              />
            </div>
          </div>
          <div className={classes.labelDivContainer}>
            <div className={classes.labelDiv}>
              <label className={classes.label}>State</label>
              <Select
                className="basic-single"
                classNamePrefix="select"
                name="color"
                options={state}
                onChange={(e) => setStateData({
                  label: e.label,
                  value: e.value,
                  countryCode: e.countryCode,
                  stateCode: e.stateCode,
                  countryName: e.countryName,
                  stateName: e.stateName
                })}
                value={getState}
              />
            </div>

            <div className={classes.labelDiv}>
              <label className={classes.label}>City</label>
              <div style={{ display: 'block', alignItems: 'center' }}>
                {getState?.value === null ?
                  <Select value={city} />
                  :
                  <Select
                    classNamePrefix="select"
                    value={city}
                    options={citySelectData}
                    onInputChange={onCitySearch}
                    onBlur={(e) => setInputCity("")}
                    isClearable={true}
                    onChange={(e) =>
                      setCity({
                        label: e.label,
                        value: e.value,
                        cityCode: e.cityCode,
                      })
                    }
                  />
                }
                <div className={classes.addCityBtnDiv}>
                  <button className={classes.addCityBtn} onClick={() => { handleAddCity() }}>Add</button>
                </div>
              </div>
            </div>
            <div style={{ display: 'block' }} >
              <label className={classes.label}>Cities Tagged *</label>
              <TaggedCities selectedCity={selectedCity} setSelectedCity={setSelectedCity} handleAddCity={handleAddCity} />
            </div>
          </div>

        </div>
        {territoryId &&
          <>
            <Divider style={{ marginTop: '30px' }} />
            <div style={{ display: 'flex' }}>
              <div className={classes.labelDivContainer}>
                <div className={classes.labelDiv}>
                  <label className={classes.label}>Created by</label>
                  <div className={classes.colorLabel}>
                    <label className={classes.label}>{territoryData?.createdBy}</label>
                  </div>
                </div>

                <div className={classes.labelDiv} style={{ marginTop: '5px' }}>
                  <label className={classes.label}>Territory Code</label>
                  <div className={classes.colorLabel}>
                    <label className={classes.label}>{territoryData?.territoryCode}</label>
                  </div>
                </div>
                <div className={classes.colorLabel} style={{ marginTop: '20px' }}>
                  <label className={classes.label}>Last Modified Date: <b>{moment(territoryData?.updatedAt).format('DD-MM-YYYY (HH:mm A)')}</b></label>
                </div>
              </div>
              <div className={classes.labelDivContainer}>
                <div className={classes.labelDiv}>
                  <label className={classes.label}>Modified by</label>
                  <div className={classes.colorLabel}>
                    <label className={classes.label}>{territoryData?.modifiedBy}</label>
                  </div>
                </div>

                <div className={classes.labelDiv}>
                  <label className={classes.label}>Active</label>
                  <div style={{ display: 'flex' }}>
                    <label style={{ marginRight: '20px' }}>
                      <input type="checkbox" style={{ marginRight: "5px" }} checked={active} onChange={handleActive} />
                      Yes
                    </label>
                    <label>
                      <input type="checkbox" style={{ marginRight: "5px" }} checked={inActive} onChange={handleNotActive} />
                      No
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </>
        }
      </div >
      <div className={classes.btnDiv} >
        <div className={classes.cancelBtn} onClick={toTerritoryListing} variant='outlined'>Cancel</div>
        <div className={classes.submitBtn} onClick={territoryId ? handleUpdate : handleSubmit} variant='contained'>{territoryId ? "Update" : "Save"}</div>
      </div>
    </>
  )
}
export default CreateTerritory