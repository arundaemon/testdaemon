import { Box, Button, Grid, Modal, Typography } from "@mui/material";
import { useStyles } from "../../css/Collection-css";
import { fieldTab } from "../../constants/general";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import FormDatePicker from "../../theme/form/theme2/FormDatePicker";
import { ReactComponent as IconTimepicker } from "./../../assets/icons/icon-calendar-time-disabled.svg";
import TimePicker from "rc-time-picker";
import moment from "moment";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid transparent",
  boxShadow: 24,
  p: 4,
};

export const Notification = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [isError, setError] = useState(true);
  const [isMeetingDate, setMeetingDate] = useState(null);
  const [isMeetingtimeIn, setMeetingTimeIn] = useState(null);

  const handleISError = () => {
    setError(false);
  };

  const disabledHours = () => {
    const currentDate = moment();
    // const isCurrentDateGreater = startDate?.isAfter(currentDate, "day");

    let strDate = moment(new Date(isMeetingDate)).format("YYYY-MM-DD");
    strDate = moment(strDate);
    const isSameDay = currentDate.isSame(strDate, "day");

    const currentHour = moment().hours();
    if (isSameDay) {
      return Array.from({ length: currentHour }, (_, index) => index);
    } else {
      return [];
    }
  };

  const disabledMinutes = (selectedHour) => {
    const currentDate = moment();

    let strDate = moment(new Date(isMeetingDate)).format("YYYY-MM-DD");
    strDate = moment(strDate);
    const isSameDay = currentDate.isSame(strDate, "day");

    if (isSameDay) {
      if (selectedHour === moment().hours()) {
        const currentMinute = moment().minutes();
        return Array.from({ length: currentMinute }, (_, index) => index);
      }
      return [];
    } else {
      return [];
    }
  };

  const isMeetingSchedule = () => {
    navigate("/authorised/school-dashboard", {
      state: {
        referenceCode: "12222",
        referenceType: fieldTab?.Collection,
      },
    });
  };

  return (
    <>
      <Box>
        <Grid container spacing={3}>
          <Grid item md={4} xs={12} sx={{ display: "flex", gap: "10px" }}>
            <Typography className={classes.label}>{`School Name:`}</Typography>
            <Typography
              className={classes.labelData}
            >{`DPS School`}</Typography>
          </Grid>
          <Grid item md={4} xs={12} sx={{ display: "flex", gap: "10px" }}>
            <Typography className={classes.label}>{`School Code:`}</Typography>
            <Typography className={classes.labelData}>{`DPT110044`}</Typography>
          </Grid>
          <Grid item md={4} xs={12} sx={{ display: "flex", gap: "10px" }}>
            <Typography className={classes.label}>{`Email ID:`}</Typography>
            <Typography
              className={classes.labelData}
            >{`DPS@gmail.com`}</Typography>
          </Grid>
          <Grid item md={4} xs={12} sx={{ display: "flex", gap: "10px" }}>
            <Typography
              className={classes.label}
            >{`OutStanding Amount:`}</Typography>
            <Typography className={classes.labelData}>{`1222222`}</Typography>
          </Grid>
          <Grid item md={4} xs={12} sx={{ display: "flex", gap: "10px" }}>
            <Typography className={classes.label}>{`Due date:`}</Typography>
            <Typography
              className={classes.labelData}
            >{`30 August 2023`}</Typography>
          </Grid>
          <Grid item md={4} xs={12} sx={{ display: "flex", gap: "10px" }}>
            <Typography className={classes.label}>{`Invoice ID:`}</Typography>
            <Typography
              className={classes.labelData}
            >{`INV-2023-08-21`}</Typography>
          </Grid>
        </Grid>

        <Box className={classes.flkBoxNotify}>
          <Button className={classes.alertBtn} onClick={""}>
            Send Reminder
          </Button>
          <Button className={classes.alertBtn} onClick={isMeetingSchedule}>
            Schedule Meeting
          </Button>
          <Button className={classes.alertBtn} onClick={""}>
            Escalate the case
          </Button>
        </Box>
      </Box>

      {/* Modal Start */}

      {isError && (
        <Modal
          open={true}
          onClose={handleISError}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Box className={classes.isErrorBox}>
              The date you have selected has already a meeting scheduled with
              same school! <br/>

               <span className={classes.labelText}>Select different date/time</span>
            </Box>
            <Box sx={{ m: 2, textAlign: "center" }}>
              <Grid container spacing={3} sx={{ py: "8px" }}>
                <Grid item md={6} xs={12}>
                  <Typography className="crm-sd-add-meeting-form-label">
                    Date{" "}
                  </Typography>

                  <FormDatePicker
                    value={isMeetingDate}
                    minDateValue={
                      new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000)
                    }
                    theme="medium-dark"
                    handleSelectedValue={(newValue) => {
                      setMeetingDate(newValue);
                      setMeetingTimeIn(null);
                    }}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <Typography className="crm-sd-add-meeting-form-label">
                    Time{" "}
                  </Typography>
                  <TimePicker
                    className="crm-form-input medium-dark position-relative"
                    value={isMeetingtimeIn}
                    onChange={(value) => setMeetingTimeIn(value)}
                    showSecond={false}
                    use24Hours
                    inputReadOnly
                    disabledHours={disabledHours}
                    disabledMinutes={disabledMinutes}
                    defaultValue={moment()}
                    inputIcon={
                      <IconTimepicker className="crm-form-timepicker-icon" />
                    }
                  />
                </Grid>
                <Grid md={12} xs={12} sx={{pt:5}}>
                  <Button className={classes.submitBtn} onClick={""}>
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Modal>
      )}
    </>
  );
};
