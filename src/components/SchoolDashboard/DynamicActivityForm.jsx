import { useCallback, useEffect, useState } from "react";
import { useStyles } from "../../css/AddSchool-css";
import { Grid, Stack, TextField, Typography, Box } from "@mui/material";
import ReactSelect, { components } from "react-select";
import TimePicker from "rc-time-picker";
import moment from "moment";
import {
  handleKeyDown,
  handleKeyTextDown,
  handlePaste,
  handleTextPaste,
} from "../../helper/randomFunction";
import FormDatePicker from "../../theme/form/theme2/FormDatePicker";
import { ReactComponent as DropDownIcon } from "../../assets/icons/icon-dropdown-2.svg";

export const DynamicActivityFormLog = (props) => {
  let { data, filledData, getDynamicData, currentObj, indexNo } = props;

  const classes = useStyles();

  const [formData, setFormData] = useState({});

  const [isExistField, setExistDependentField] = useState(null);


  useEffect(() => {
    if (filledData) {
      setFormData(filledData);
    }
  }, [filledData]);

  useEffect(() => {
    if (Object.keys(formData)?.length > 0) {
      getDynamicData("dependentField", formData, currentObj);
    }
  }, [formData]);

  
  const DropdownIndicator = props => {
    return (
      <components.DropdownIndicator {...props}>
        <DropDownIcon />
      </components.DropdownIndicator>
    );
  };

  const getOptionData = (key) => {
    let option;
    let newOption = [];
    option = data ? data?.filter((obj) => obj?.key === key)?.[0]?.value : [];
    if (option?.length > 0) {
      option = option?.map((obj) => {
        newOption.push({
          label: obj,
          value: obj,
        });
      });
      return newOption;
    }
    return option;
  };

  const handleChange = (key, data, e) => {
    if (data?.type === "Pick-list") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [key]: {
          label: data.label,
          type: data.type,
          value: e.value,
          required: data.required,
        },
      }));
    } else if (data?.type === "Date") {
      let date = moment(new Date(e)).format("YYYY-MM-DD");
      setFormData((prevFormData) => ({
        ...prevFormData,
        [key]: {
          label: data.label,
          type: data.type,
          value: date,
          required: data.required,
        },
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [key]: {
          label: data.label,
          type: data.type,
          value: e.target.value,
          required: data.required,
        },
      }));
    }
  };

  const renderSelectTag = (key, obj) => {
    let labelText = obj.label?.replace("*", "")?.trim();
    return (
      <Grid item md={4} xs={12}>
        <Typography className={classes.label}>{obj.label}</Typography>
        <ReactSelect
          isSearchable={true}
          classNamePrefix="select"
          className="crm-form-input crm-react-select dark font-normal"
          options={getOptionData(labelText)}
          value={{ label: obj?.value, value: obj?.value } || ""}
          onChange={(e) => handleChange(key, obj, e)}
          components={{ DropdownIndicator }}
        />
      </Grid>
    );
  };

  const renderTextField = (key, obj) => {
    return (
      <Grid item md={4} xs={12}>
        <Grid>
          <Typography component="h4" className='crm-sd-log-form-label'>{obj.label}</Typography>
          <TextField
            className="crm-form-input dark"
            autoComplete="off"
            name="name"
            type="text"
            placeholder="Enter Value"
            value={obj?.value || ""}
            onChange={(e) => {
              handleChange(key, obj, e);
            }}
            onKeyDown={handleKeyTextDown}
            onPaste={handleTextPaste}
          />
        </Grid>
      </Grid>
    );
  };

  const renderNumberField = (key, obj) => {
    return (
      <Grid item md={4} xs={12}>
        <Grid>
          <Typography className={classes.label}>{obj.label}</Typography>
          <TextField
            className="crm-form-input dark"
            autoComplete="off"
            name="name"
            type="number"
            placeholder="Enter Numeric Value"
            value={obj?.value || ""}
            onChange={(e) => handleChange(key, obj, e)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
          />
        </Grid>
      </Grid>
    );
  };

  const renderDateField = (key, obj) => {
    return (
      <Grid item md={4} xs={12}>
        <Grid>
          <Typography className={classes.label}>{obj.label}</Typography>
          <FormDatePicker
            value={obj?.value || ""}
            minDateValue={new Date()}
            theme="dark"
            handleSelectedValue={(e) => handleChange(key, obj, e)}
          />
        </Grid>
      </Grid>
    );
  };

  const renderView = (key, data) => {
    if (data?.type === "Pick-list") {
      return renderSelectTag(key, data);
    } else if (data?.type === "Integer") {
      return renderNumberField(key, data);
    } else if (data?.type === "Date") {
      return renderDateField(key, data);
    } else {
      return renderTextField(key, data);
    }
  };

  return (
    <>
      <Box className="crm-sd-log-product-item-additional">
        <Grid container spacing={2.5}  >
            {Object.entries(formData)?.map(([key, value]) => {
              if (typeof value === "object") {
                return <>{renderView(key, value)}</>;
              }
            })}
          </Grid>
      </Box>
        
    </>
  );
};
