import { useCallback, useEffect, useState } from "react";
import { useStyles } from "../../../../../css/AddSchool-css";
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
} from "../../../../../helper/randomFunction";

export const DynamicActivityForm = (props) => {
  let { data, productFormData, getData, checkStatus, activeAccordion } = props;

  let { productData, productFilledData } = productFormData;

  const classes = useStyles();

  const [formData, setFormData] = useState({});
  const [isFilledData, setFilledData] = useState([])

  const createDynamicObj = (data) => {
    if (data) {
      let singleObject;
      var Data = data?.dependentFields?.map((obj) => {
        return {
          [obj?.fieldCode]: {
            type: obj?.fieldType,
            label: obj?.required ? `${obj?.label} *` : obj?.label,
            value: "",
            required: obj?.required,
          },
        };
      });
      singleObject = Data?.length > 0 ? Object.assign({}, ...Data) : {};
      setFormData(singleObject);
    }
  };

  const searchArray = async () => {
    return new Promise((resolve) => {
      const result = productData?.find(obj => obj?.activeFilledTab === activeAccordion);
      if (result) {
        resolve(result);
      }
    });
  };

  const searchIsExist = async () => {
    return new Promise((resolve) => {
      const result = productFilledData?.find(obj => obj?.activeFilledTab === activeAccordion);
      if (result) {
        resolve(result);
      }
    });
  };
  
  useEffect(() => {
    const continuousSearch = async () => {
      let result = null;
  
      while (!result) {
        result = await searchArray();
      }
  
      let activityObj = {
        activityId: result?.activityId,
        futureActivityId: result?.futureActivityId,
      };
      getData(formData, activityObj);
    };
  
    continuousSearch();
  }, [formData, productData]);



  useEffect(() => {
    let Data = productData?.find(obj => obj?.activeFilledTab === activeAccordion)
    let filledDate = null

    filledDate = productFilledData?.find(obj => obj?.activeFilledTab === activeAccordion)
    
    if (!(filledDate)) {
      createDynamicObj(Data);
    } else {
      setFormData(filledDate);
    }
  }, [productData, activeAccordion]);

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
        [key]: { label: data.label, type: data.type, value: date, required: data.required },
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [key]: { label: data.label, type: data.type, value: e.target.value, required: data.required },
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

  const isFieldVisible = () => {
    let isVisible
    
    isVisible = productData?.find(obj => obj.activeFilledTab === activeAccordion)

    isVisible = isVisible ? true : false
    return isVisible
  }

  return (
    <>
      {productData?.length > 0 && isFieldVisible() ? (
        <Grid className={classes.cusCard}>
          <Grid container spacing={3} sx={{ py: "8px" }}>
            {Object.entries(formData)?.map(([key, value]) => {
              if (typeof value === "object") {
                return <>{renderView(key, value)}</>;
              }
            })}
          </Grid>
        </Grid>
      ) : (
        ""
      )}
    </>
  );
};
