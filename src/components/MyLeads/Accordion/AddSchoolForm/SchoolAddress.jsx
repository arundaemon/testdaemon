import React, { useState } from "react";
import PlacesAutocomplete, {
  geocodeByAddress,
} from "react-places-autocomplete";
import { useStyles } from "../../../../css/AddSchool-css";
import { Grid, Typography } from "@mui/material";
import { useEffect } from "react";
import {
  handleKeyDown,
  handleKeyTextDown,
  handlePaste,
  handleTextPaste,
} from "../../../../helper/randomFunction";
import { getCityData, getStateData } from "../../../../helper/DataSetFunction";
import ReactSelect from "react-select";

function AutoCompleteAddress(props) {
  const classes = useStyles();
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState({
    label: "Select City",
    value: null,
  });
  const [state, setState] = useState({
    label: "Select State",
    value: null,
  });
  const [zipcode, setZipcode] = useState("");
  const [country, setCountry] = useState("");
  const [stateCode, setStateCode] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [placeId, setPlaceId] = useState(null);
  const [stateSelectData, setStateSelectData] = useState(null);
  const [citySelectData, setCitySelectData] = useState(null);
  const [inputCity, setInputCity] = useState("");
  const [isDisabledState, setDisabledState] = useState(false);
  const [isDisabledCity, setDisabledCity] = useState(false);
  const [isDisabledCountry, setDisabledCountry] = useState(false);
  const [isDisabledCode, setDisabledCode] = useState(false);
  const [isFetchState, setFetchState] = useState(false);
  const [isFetchCity, setFetchCity] = useState(false);
  const [isFetchCountry, setFetchCountry] = useState(false);
  const [isFetchCode, setFetchCode] = useState(false);
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const maxCodeLength = 6;

  let { getSchoolAddress } = props;

  const handleSelect = async (value) => {
    setAddress(value);
    const results = await geocodeByAddress(value);
    const selectedAddress = results.find((result) =>
      result.types.includes("school")
    );
    const { lat, lng } = selectedAddress?.geometry?.location
      ? selectedAddress?.geometry?.location
      : {};
    if (lat && lng) {
      setCoordinates({
        lat: lat(),
        lng: lng(),
      });
    }

    let placeID = selectedAddress
      ? selectedAddress?.place_id
      : results?.[0]?.place_id;

    setPlaceId(placeID);
    setLocation(value);

    if (!selectedAddress) {
      setCountry("India");
      setDisabledCountry(true);
    }

    selectedAddress.address_components.forEach((component) => {
      if (component.types.includes("locality")) {
        setCity({
          label: component.long_name,
          value: component.long_name,
        });
      } else if (component.types.includes("administrative_area_level_1")) {
        addCountryState(component.long_name);
        setStateCode(component.short_name);
      } else if (component.types.includes("postal_code")) {
        setZipcode(component.long_name);
        setDisabledCode(true);
      } else if (component.types.includes("country")) {
        setCountry(component.long_name);
        setDisabledCountry(true);
        setCountryCode(component.short_name);
      }
    });
  };

  const addCountryState = (data) => {
    var stateData = stateSelectData?.find((obj) => obj?.label === data);

    if (stateData) {
      setState({
        label: stateData?.label,
        value: stateData?.value,
      });
      setDisabledState(true);
    } else {
      setState({
        label: "Select State",
        value: null,
      });
      setDisabledState(false);
    }
  };

  useEffect(() => {
    if (city?.value) {
      setDisabledCity(true);
    }
  }, [city]);

  useEffect(() => {
    if (address === "") {
      setCity({
        label: "Select City",
        value: null,
      });
      setState({
        label: "Select State",
        value: null,
      });
      setZipcode("");
      setCountry("");
      setLocation("");
      setDisabledState(false);
      setDisabledCity(false);
      setDisabledCountry(false);
      setDisabledCode(false);
    }
  }, [address]);

  useEffect(() => {
    let formData = {};
    formData = {
      country: country,
      state: state?.value ? state?.label : state?.value,
      city: city?.value,
      zipcode: zipcode,
      address: location,
      stateCode: state?.value,
      countryCode: countryCode,
      geoTagId: placeId,
      latitude: coordinates?.lat,
      longitude: coordinates?.lng,
    };

    getSchoolAddress(formData);
  }, [country, state, zipcode, location, country, placeId, city]);

  const getStateResult = async () => {
    try {
      let stateDataOption = [];
      let res = await getStateData();
      res = res?.loadResponses?.[0]?.data;
      res?.map((data) => {
        stateDataOption.push({
          label: data?.["CountryCityStateMapping.stateName"],
          value: data?.["CountryCityStateMapping.stateCode"],
        });
      });
      setStateSelectData(stateDataOption);
    } catch (err) {
      console.error(err?.response);
    }
  };

  const getCityResult = async (cityName) => {
    try {
      let stateDataOption = [];
      let res = await getCityData(state?.label, cityName);
      res = res.rawData();
      res?.map((data) => {
        stateDataOption.push({
          label: data?.["CountryCityStateMapping.cityName"],
          value: data?.["CountryCityStateMapping.cityName"],
        });
      });
      setCitySelectData(stateDataOption);
    } catch (err) {
      console.error(err?.response);
    }
  };

  useEffect(() => {
    const getData = setTimeout(() => {
      if (state && state.label) {
        getCityResult(inputCity);
      }
    }, 500);

    return () => clearTimeout(getData);
  }, [inputCity]);

  useEffect(() => {
    if (city?.value) {
      setDisabledCity(true);
    }
  }, [city]);

  useEffect(() => {
    if (!isDisabledCity && !isDisabledState) {
      if (state && state?.label) {
        getCityResult();
        setCity({
          label: "Select City",
          value: null,
        });
      }
    }
  }, [state]);

  useEffect(() => {
    getStateResult();
  }, []);

  const onCitySearch = (e) => {
    let str = "";
    const charArr =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
    if (e.key == "Backspace") {
      str = inputCity.slice(0, -1);
    } else if (charArr.indexOf(e.key) > -1) {
      str = inputCity + e.key;
    } else {
      //console.log(e)
    }
    setInputCity(str);
  };

  return (
    <div>
      <PlacesAutocomplete
        value={address}
        onChange={setAddress}
        onSelect={handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => {
          return (
            <div>
              <Grid className={classes.cusCard}>
                <Grid container spacing={3}>
                  <Grid item md={4} xs={12}>
                    <Grid>
                      <Typography className={classes.label}>
                        Location*
                      </Typography>
                      <input
                        {...getInputProps({ placeholder: "Location" })}
                        className={classes.inputStyle}
                      />
                    </Grid>
                    <div>
                      {loading ? <div>Loading...</div> : null}
                      {suggestions
                        ?.filter(
                          (suggestion) =>
                           ( suggestion?.types?.includes("school") ||
                            suggestion?.types?.includes("primary_school") ||
                            suggestion?.types?.includes("secondary_school")
                            )
                        )
                        ?.map((suggestion) => {
                          const style = {
                            backgroundColor: suggestion.active
                              ? "#41b6e6"
                              : "#fff",
                            cursor: "pointer",
                          };

                          return (
                            <div
                              {...getSuggestionItemProps(suggestion, { style })}
                            >
                              {suggestion.description}
                            </div>
                          );
                        })}
                    </div>
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <Grid>
                      <Typography className={classes.label}>
                        Country*
                      </Typography>
                      <input
                        className={classes.inputStyle}
                        name="country"
                        type="text"
                        placeholder="Country Name"
                        value={country}
                        readOnly={isDisabledCountry}
                        onChange={(e) => {
                          setCountry(e.target.value);
                        }}
                        onKeyDown={handleKeyTextDown}
                        onPaste={handleTextPaste}
                      />
                    </Grid>
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <Grid>
                      <Typography className={classes.label}>State*</Typography>
                      {/* <input
                        className={classes.inputStyle}
                        name="state"
                        type="text"
                        placeholder="State Name"
                        value={state}
                        readOnly={true}
                        onChange={(e) => {
                          setState(e.target.value);
                        }}
                        onKeyDown={handleKeyTextDown}
                        onPaste={handleTextPaste}
                      /> */}
                      <ReactSelect
                        classNamePrefix="select"
                        value={state}
                        isDisabled={isDisabledState}
                        options={stateSelectData}
                        onChange={(e) => {
                          setState({
                            label: e.label,
                            value: e.value,
                          });
                          setDisabledCity(false);
                        }}
                      />
                    </Grid>
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <Grid>
                      <Typography className={classes.label}>City*</Typography>
                      {/* <input
                        className={classes.inputStyle}
                        name="City Name"
                        type="text"
                        placeholder="Name"
                        readOnly={true}
                        value={city}
                        onChange={(e) => {
                          setCity(e.target.value);
                        }}
                        onKeyDown={handleKeyTextDown}
                        onPaste={handleTextPaste}
                      /> */}
                      <ReactSelect
                        classNamePrefix="select"
                        value={city}
                        isDisabled={isDisabledCity}
                        options={citySelectData}
                        onKeyDown={onCitySearch}
                        onBlur={(e) => setInputCity("")}
                        onChange={(e) =>
                          setCity({
                            label: e.label,
                            value: e.value,
                          })
                        }
                      />
                    </Grid>
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <Grid>
                      <Typography className={classes.label}>
                        Pin Code*
                      </Typography>
                      <input
                        className={classes.inputStyle}
                        name="zipCode"
                        type="number"
                        placeholder="Pin Code"
                        value={zipcode}
                        readOnly={isDisabledCode}
                        onChange={(e) => {
                          if (e.target.value?.length <= maxCodeLength) {
                            setZipcode(e.target.value);
                          }
                        }}
                        onKeyDown={handleKeyDown}
                        onPaste={handlePaste}
                      />
                    </Grid>
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <Grid>
                      <Typography className={classes.label}>
                        Address*
                      </Typography>
                      <input
                        className={classes.inputStyle}
                        name="location"
                        type="text"
                        placeholder="Address"
                        value={location}
                        onChange={(e) => {
                          setLocation(e.target.value);
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </div>
          );
        }}
      </PlacesAutocomplete>
    </div>
  );
}

export default AutoCompleteAddress;
