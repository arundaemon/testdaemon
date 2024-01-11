import { useCallback, useEffect, useState } from "react";
import { useStyles } from "../../css/Quotation-css";
import { Grid, Stack, TextField, Typography } from "@mui/material";
import ReactSelect from "react-select";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TimePicker from "rc-time-picker";
import moment from "moment";
import {
  handleKeyDown,
  handleKeyTextDown,
  handlePaste,
  handleTextPaste,
} from "../../helper/randomFunction";

export const DynamicSoftwareActivity = (props) => {
  let { data, filledData, getDynamicData, currentObj } = props;

  const classes = useStyles();

  const [formData, setFormData] = useState({});

  const [isExistField, setExistDependentField] = useState(null);

  useEffect(() => {
    if (filledData) {
      setFormData(filledData);
    }
  }, [filledData]);

  useEffect(() => {
    if (filledData) {
      getDynamicData("dependentField", formData, currentObj);
    }
  }, [formData]);

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
          classNamePrefix="select"
          options={getOptionData(labelText)}
          value={{ label: obj?.value, value: obj?.value } || ""}
          onChange={(e) => handleChange(key, obj, e)}
        />
      </Grid>
    );
  };

  const renderTextField = (key, obj) => {
    return (
      <Grid item md={4} xs={12}>
        <Grid>
          <Typography className={classes.label}>{obj.label}</Typography>
          <input
            className={classes.inputStyle}
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
          <input
            className={classes.inputStyle}
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
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Stack spacing={3}>
              <DatePicker
                className="customDatePicker"
                value={obj?.value || ""}
                inputProps={{ readOnly: true }}
                onChange={(e) => handleChange(key, obj, e)}
                renderInput={(params) => <TextField {...params} />}
              />
            </Stack>
          </LocalizationProvider>
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
      <Grid className={classes.cusCard}>
        <Grid container spacing={3} sx={{ py: "8px" }}>
          {Object.entries(formData)?.map(([key, value]) => {
            if (typeof value === "object") {
              return <>{renderView(key, value)}</>;
            }
          })}
        </Grid>
      </Grid>
    </>
  );
};
