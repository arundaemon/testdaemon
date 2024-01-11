import { useEffect, useState } from "react";
import { useStyles } from "../../../../../css/AddSchool-css";
import { Grid, Stack, TextField, Typography } from "@mui/material";
import ReactSelect from "react-select";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TimePicker from "rc-time-picker";
import moment from "moment";
import { getActivityMappingDetails } from "../../../../../config/services/activityFormMapping";

export const CommonActivityForm = (props) => {
  let {
    data,
    getProductData,
    leadId,
    listTab,
    leadStage,
    leadStatus,
    name,
    getDynamicResult,
    schoolId,
    schoolLeadId,
  } = props;

  const classes = useStyles();

  const currentTime = moment();

  const disabledHours = () => {
    const currentDate = moment();
    const isCurrentDateGreater = formData?.meetingDate?.isAfter(currentDate, 'day');
    const currentHour = moment().hours();
    if (!isCurrentDateGreater) {
      return Array.from({ length: currentHour }, (_, index) => index);
    }else {
      return []
    }
  };

  const disabledMinutes = (selectedHour) => {
    const currentDate = moment();
    const isCurrentDateGreater = formData?.meetingDate?.isAfter(currentDate, 'day');
    if (!isCurrentDateGreater) {
      if (selectedHour === moment().hours()) {
        const currentMinute = moment().minutes();
        return Array.from({ length: currentMinute }, (_, index) => index);
      }
      return [];
    }else {
      return []
    }
  };

  const [formData, setFormData] = useState({
    customerResponse: { label: "Select", value: null },
    subject: { label: "Select", value: null },
    productInterest: { label: "Select", value: null },
    meetingDate: null,
    meetingTime: null,
    meetingType: { label: "Select", value: null },
    priority: { label: "Select", value: null },
  });

  const [customList, setCustomList] = useState([]);


  const options = [
    { value: "Private", label: "Private" },
    { value: "Government", label: "Government" },
    { value: "Semi Government", label: "Semi Government" },
  ];

  const fetchActivityMappingDetails = async () => {
    leadStage = leadStage
    leadStatus = leadStatus

    let params = { stageName: leadStage, statusName: leadStatus, product: name };
    getActivityMappingDetails(params)
      .then((res) => {
        if (res?.result?.length > 0) {
          setCustomList(res?.result);
        }
      })
      .catch((err) => {
        console.log(err, "Error");
      });
  };

  useEffect(() => {
    fetchActivityMappingDetails();
  }, []);

  const getSelectedOption = (key) => {
    let option;
    let newOption = [];
    option = customList
      ? customList?.filter((obj) => obj?.key === key)?.[0]?.value
      : [];
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

  useEffect(() => {
    getDynamicResult();
    let params;
    const isAllFieldsFilled = Object.values(formData)?.every(
      (field) => field && field.value !== null
    );
    if (isAllFieldsFilled) {
      let meetingData = moment(new Date(formData.meetingDate)).format(
        "YYYY-MM-DD"
      );
      let meetingTime = moment(formData.meetingTime).format("hh:mm A");
      params = {
        customerResponse: formData?.customerResponse?.value,
        subject: formData?.subject?.value,
        priority: formData?.priority?.value,
        productInterest: formData?.productInterest?.value,
        meetingType: formData?.meetingType?.value,
        meetingDate: `${meetingData} ${meetingTime}`,
      };
      getProductData({
        ...params,
        name: name,
        leadId: leadId,
        listTab: listTab,
        leadStage: leadStage,
        leadStatus: leadStatus,
        schoolId: schoolId ? schoolId : schoolLeadId,
      });
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

  return (
    <>
      <Grid className={classes.cusCard}>
        <Grid container spacing={3} sx={{ py: "8px" }}>
          <Grid item md={4} xs={12}>
            <Grid>
              <Typography className={classes.label}>
                Customer Response *
              </Typography>
              <ReactSelect
                classNamePrefix="select"
                options={getSelectedOption("customerResponse")}
                // options={getOptionData("Customer Response")}
                value={formData.customerResponse}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    customerResponse: {
                      label: e.label,
                      value: e.value,
                    },
                  })
                }
              />
            </Grid>
          </Grid>

          <Grid item md={4} xs={12}>
            <Grid>
              <Typography className={classes.label}>Subject *</Typography>
              <ReactSelect
                classNamePrefix="select"
                options={getSelectedOption("subject")}
                // options={getOptionData("Subject")}
                value={formData.subject}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    subject: {
                      label: e.label,
                      value: e.value,
                    },
                  })
                }
              />
            </Grid>
          </Grid>

          <Grid item md={4} xs={12}>
            <Grid>
              <Typography className={classes.label}>
                Product Interest *
              </Typography>
              <ReactSelect
                classNamePrefix="select"
                options={getOptionData("Product Interest")}
                value={formData.productInterest}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    productInterest: {
                      label: e.label,
                      value: e.value,
                    },
                  })
                }
              />
            </Grid>
          </Grid>

          <Grid item md={4} xs={12}>
            <Grid>
              <Typography className={classes.label}>
                Next Meeting Date *
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Stack spacing={3}>
                  <DatePicker
                    className="customDatePicker"
                    value={formData.meetingDate}
                    inputProps={{ readOnly: true }}
                    onChange={(newValue) =>
                      setFormData({ ...formData, meetingDate: newValue })
                    }
                    renderInput={(params) => <TextField {...params} />}
                    minDate={new Date()}
                    // minDate={formatISO(startOfToday())}
                  />
                </Stack>
              </LocalizationProvider>
            </Grid>
          </Grid>

          <Grid item md={4} xs={12}>
            <Grid>
              <Typography className={classes.label}>
                Next Meeting Time *
              </Typography>
              <TimePicker
                disabledHours={disabledHours}
                disabledMinutes={disabledMinutes}
                className={"customTPicker"}
                value={formData.meetingTime}
                onChange={(value) =>
                  setFormData({ ...formData, meetingTime: value })
                }
                defaultValue={moment()}
                showSecond={false}
                use24Hours
                inputReadOnly
              />
            </Grid>
          </Grid>

          <Grid item md={4} xs={12}>
            <Grid>
              <Typography className={classes.label}>
                Type of Meeting *
              </Typography>
              <ReactSelect
                classNamePrefix="select"
                options={getOptionData("Type of Meeting")}
                value={formData.meetingType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    meetingType: {
                      label: e.label,
                      value: e.value,
                    },
                  })
                }
              />
            </Grid>
          </Grid>

          <Grid item md={4} xs={12}>
            <Grid>
              <Typography className={classes.label}>Priority *</Typography>
              <ReactSelect
                classNamePrefix="select"
                options={getSelectedOption("priority")}
                // options={getOptionData("Priority")}
                value={formData.priority}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    priority: {
                      label: e.label,
                      value: e.value,
                    },
                  })
                }
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};
