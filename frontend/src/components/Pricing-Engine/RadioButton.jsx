import React from 'react';
import Select from 'react-select';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup from '@mui/material/RadioGroup';

const SelectWithRadio = ({ options, value, onChange, type, isDisabled }) => {
  const handleChange = (selectedOption) => {
    console.log(selectedOption,"..............selectedOption"); // Check if the selected option is received correctly

    onChange(selectedOption, type);
  };

  return (
    <Select
      options={options}
      value={value}
      onChange={handleChange}
      isDisabled={isDisabled}
      components={{
        Option: RadioOption,
      }}
    />
  );
};

const RadioOption = ({ children, isSelected, innerProps }) => {
  return (
    <div {...innerProps}>
      <Radio checked={isSelected} readOnly />
      {children}
    </div>
  );
};

export default SelectWithRadio;
