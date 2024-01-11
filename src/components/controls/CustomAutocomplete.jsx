/* eslint-disable no-use-before-define */
import React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

export default function CustomAutocomplete({ label, data, defaultValue, onChange, keyValue, renderOption, className }) {
  return (
    <Autocomplete
      className={className ?? ''}
      size='small'
      id={label}
      freeSolo
      disableClearable
      defaultValue={data.find((item) => item.value === defaultValue)}
      options={data}
      onChange={onChange}
      renderOption={(props, obj) => renderOption(props, obj)}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          margin="normal"
          variant="filled"
          size="small"
        />
      )}
    />
  );
}