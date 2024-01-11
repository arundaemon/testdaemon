import React, { useState } from "react";
import Select, { components } from "react-select";

// const options = [
//   { value: "apple", label: "Apple" },
//   { value: "banana", label: "Banana" },
//   { value: "orange", label: "Orange" },
// ];

// const CheckboxOption = (props) => {
//   const { children, isSelected, onChange } = props;
//   return (
//     <div>
//       <label>
//         <input type="checkbox" checked={isSelected} onChange={onChange} />
//         {children}
//       </label>
//     </div>
//   );
// };

// export const CustomSelect = ({options,value,onChange}) => {
//   const [selectedOptions, setSelectedOptions] = useState([]);
//   const handleChange = (option) => {
//     const selectedValues = selectedOptions.map((selectedOption) => selectedOption.value);
//     if (selectedValues.includes(option.value)) {
//       setSelectedOptions(selectedOptions.filter((selectedOption) => selectedOption.value !== option.value));
//     } else {
//       setSelectedOptions([...selectedOptions, option]);
//     }
//   };
//   const CheckboxMultiValue = (props) => {
//     const { data } = props;
//     return (
//       <components.MultiValueContainer {...props}>
//         <CheckboxOption isSelected={true} onChange={() => handleChange(data)}>
//           {data.label}
//         </CheckboxOption>
//       </components.MultiValueContainer>
//     );
//   };
//   const CheckboxOptionComponent = (props) => {
//     const { data } = props;
//     const isSelected = selectedOptions.map((selectedOption) => selectedOption.value).includes(data.value);
//     return (
//       <components.Option {...props}>
//         <CheckboxOption isSelected={isSelected} onChange={() => handleChange(data)}>
//           {data.label}
//         </CheckboxOption>
//       </components.Option>
//     );
//   };
//   return (
//     <Select
//       isMulti
//       options={options}
//       value={selectedOptions}
//       components={{ Option: CheckboxOptionComponent, MultiValue: CheckboxMultiValue }}
//     />
//   );
// };


export const CustomSelect = ({options, value, onChange, isMulti}) => {

  const defaultValue = (options, value) => {
    return options ? options.find(option => option.value === value) :''
  }

  return (
    <div>
      <Select
        value ={value}
        options={options}
        onChange={onChange}
        isMulti={isMulti}
      />
    </div>
  )
}