import React from 'react';
import Select, { components } from 'react-select';

const MultiSelectWithCheckbox = ({ options, value, onChange, type, isDisabled}) => {

  const handleChange = (selectedOptions) => {
    const updatedSelectedOptions = handleSelectAllOption(selectedOptions);
    onChange(updatedSelectedOptions, type);
  };



  const handleSelectAllOption = (selectedOptions) => {
    const isAllOptionsSelected = selectedOptions.length === options.length;

    if (isAllOptionsSelected) {
      // If all options are selected, remove the "Select All" option from the selected options
      return selectedOptions.filter((option) => option.value !== 'select-all');
    } else if (selectedOptions.some((option) => option.value === 'select-all')) {
      // If "Select All" option is present in the selected options, select all options
      return options;
    } else {
      return selectedOptions;
    }
  };

  const Option = (props) => {
    return (
      <components.Option {...props}>
        {props.label}
      </components.Option>
    );
  };

  const selectAllOption = { value: 'select-all', label: 'Select All' };
  let optionsWithSelectAll = []
  if (options?.length) {
    optionsWithSelectAll = [selectAllOption, ...options];
  }

  return (
    <Select
      options={optionsWithSelectAll}
      isMulti
      isDisabled={isDisabled}
      components={{ Option: Option }}
      onChange={handleChange}
      value={value}
    />
  );
};

export default MultiSelectWithCheckbox;
