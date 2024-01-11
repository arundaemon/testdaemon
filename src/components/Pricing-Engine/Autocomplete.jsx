import Autocomplete from '@mui/lab/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import React, { useEffect, useState } from 'react';



const CheckboxAutocomplete = ({ data, getSchoolData, schoolDetail }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [loadedOptions, setLoadedOptions] = useState([]);
  const [allOptionsLoaded, setAllOptionsLoaded] = useState(false);


  const handleOptionChange = (event, newSelectedOptions) => {
    setSelectedOptions(newSelectedOptions);
  };


  useEffect(() => {
    if (schoolDetail?.length > 0) {
      setSelectedOptions(schoolDetail)
    }
  }, [schoolDetail])


  useEffect(() => {
    loadOptions(0, 10);
  }, []);


  useEffect(() => {
    if (selectedOptions?.length) {
      getSchoolData(selectedOptions)
    }
  }, [selectedOptions])

  const loadOptions = async (startIndex, endIndex) => {
    if (endIndex > data?.length) {
      setAllOptionsLoaded(true);
    } else {

      const nextBatch = data?.slice(startIndex, endIndex);
      const optionsData = await extractSchoolInfo(nextBatch)
      setLoadedOptions([...loadedOptions, ...optionsData]);
    }
  };


  const extractSchoolInfo = async (dataArray) => dataArray?.map(item => ({
    schoolName: item?.school_info?.schoolName,
    schoolCode: item?.school_info?.schoolCode
  }));


  const handleScroll = (event) => {
    const target = event.target;

    if (
      target.scrollHeight - target.scrollTop === target.clientHeight &&
      !allOptionsLoaded
    ) {
      // Load the next batch of options
      const startIndex = loadedOptions.length;
      const endIndex = startIndex + 50;
      loadOptions(startIndex, endIndex);
    }
  };



  return (
    <Autocomplete
      multiple
      id="checkbox-autocomplete"
      options={loadedOptions}
      disableCloseOnSelect
      getOptionLabel={(option) => option?.schoolName}
      onChange={handleOptionChange}
      value={selectedOptions}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox color="primary" checked={selected} />
          {`${option.schoolName} - ${option.schoolCode}`}        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          sx={{ "& div": { borderRadius: "4px" } }}
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            type: 'search',
          }}
        />
      )}
      filterOptions={(options, { inputValue }) =>
        options.filter((option) =>
          option?.schoolName?.toLowerCase().includes(inputValue.toLowerCase())
        )
      }
      PaperProps={{
        onScroll: handleScroll, // Attach scroll event listener
      }}
    />
  );
};

export default CheckboxAutocomplete;
