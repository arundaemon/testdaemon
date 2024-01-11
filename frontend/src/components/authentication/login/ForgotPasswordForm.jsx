import * as Yup from "yup";
import axios from "axios";
import md5 from "md5";
import { useEffect } from "react";
// import { useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from "formik";
import { Grid, Link, Stack, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import settings from "../../../config/settings";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import OtpInput from "react-otp-input";
var axiosInstance = axios.create();

// ----------------------------------------------------------------------

export default function ForgotPasswordForm(props) {
  const [getOtp, setVerifyOtp] = useState(false);

  const [otp, setOtp] = useState("");

  const [minutes, setMinutes] = useState(1);

  const [seconds, setSeconds] = useState(30);

  const navigate = useNavigate();

  const [otpVerify, setOtpVerify] = useState("");

  let { isOtpVerify } = props;

  const LoginSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
  });

  const OtpVerifySchema = Yup.object().shape({
    otp: Yup.string().required("Otp is required"),
  });

  const ClearLocalStorage = () => localStorage.clear();
  useEffect(() => ClearLocalStorage(), []);

  const getChecksum = (action, username, password) => {
    let checksum = md5(
      action +
        ":" +
        settings.WEBSITE_API_KEY +
        ":" +
        username +
        ":" +
        settings.WEBSITE_SALT_KEY
    );
    return checksum;
  };

  const getOtpCheckSum = (action, username) => {
    let mobile_number = "null";
    let email = "null";

    let checksum = md5(
      `${action}:${username}:${mobile_number}:${email}:${settings.API_GATEWAY_API_KEY}:${settings.API_GATEWAY_SALT_KEY}`
    );

    return checksum;
  };

  const formik = useFormik({
    initialValues: { username: "", password: "" },
    validationSchema: LoginSchema,

    onSubmit: (values, actions) => {
      let { username } = values;
      let data = {
        action: "cognito_forgot_password",
        apikey: settings.WEBSITE_API_KEY,
        checksum: getChecksum("cognito_forgot_password", username),
        username: username,
        otp_via: "sms",
        app_hash: "73hf874",
      };
      let config = {};
      let url = `${settings.WEBSITE_URL}cognito-login-service/auth/forgotPassword  `;

      axiosInstance
        .post(url, data, config)
        .then((res) => {
          let { status_code, errors, mobile_number, message } = res?.data;
          let { data } = res?.data;
          if (data && data?.mobile_number) {
            setVerifyOtp(true);
            toast.success(message);
            actions.setSubmitting(false);
          } else {
            let { message } = res?.data?.errors?.[0];
            toast.error(message);
            setVerifyOtp(false);
            localStorage.clear();
            actions.setFieldError("username", errors?.[0]?.message);
            actions.setSubmitting(false);
          }
        })
        .catch((e) => {
          localStorage.clear();
          actions.setSubmitting(false);
        });
    },
  });

  const handleOtpChange = (otp) => setOtpVerify(otp);

  const onSubmitHandler = (e) => {
    e.preventDefault();
    let username = getFieldProps("username")?.value;
    let data = {
      action: "verify_otp",
      apikey: settings.API_GATEWAY_API_KEY,
      username: username,
      checksum: getOtpCheckSum("verify_otp", username),
      otp_code: otpVerify,
      type: "mobile_verification",
      request_timestamp: new Date().getTime(),
    };

    let config = {};
    let url = `${settings.WEBSITE_URL}cognito-login-service/auth/verifyOtp?v=2 `;

    axiosInstance
      .post(url, data, config)
      .then((res) => {
        let { status, errors, message } = res?.data;

        if (status == 1) {
          toast.success(message);
          navigate("/reset-password", {
            state: { otp: otpVerify, username: username },
          });
        } else {
          toast.error(message);
          localStorage.clear();
        }
      })
      .catch((e) => {
        localStorage.clear();
      });
    setOtpVerify("");
  };

  const resendOTP = async () => {
    setOtpVerify("");
    let username = getFieldProps("username")?.value;
    let data = {
      action: "cognito_forgot_password",
      apikey: settings.WEBSITE_API_KEY,
      checksum: getChecksum("cognito_forgot_password", username),
      username: username,
      otp_via: "sms",
      app_hash: "73hf874",
    };
    let config = {};
    let url = `${settings.WEBSITE_URL}cognito-login-service/auth/forgotPassword`;

    var Data = await axiosInstance
      .post(url, data, config)
      .then((res) => {
        let { status, errors, message } = res?.data;
        toast.success(message);
        if (status == 1) {
          return res?.data;
        } else {
          return res?.data;
        }
      })
      .catch((err) => {
        let message = err?.response?.data?.errors[0]?.message;
        toast.error(message);
      });

    return Data;
  };

  useEffect(() => {
    isOtpVerify(getOtp);
  }, [getOtp]);

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

  // const { errors: isError, touched: isTouched, isSubmitting: IsSubmit, handleSubmit: ishandleSubmit, getFieldProps: isGetFieldProps } = verifyOtp

  return (
    <>
      {!getOtp ? (
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                autoComplete="email"
                type="text"
                label="Enter Your Official Username"
                {...getFieldProps("username")}
                error={Boolean(touched.username && errors.username)}
                helperText={touched.username && errors.username}
              />
            </Stack>

            <Stack
              alignItems="center"
              justifyContent="space-between"
              sx={{ my: 2 }}
            >
              <LoadingButton
                mt={2}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                loading={isSubmitting}
              >
                Submit
              </LoadingButton>
            </Stack>
          </Form>
        </FormikProvider>
      ) : (
        <div className="ctsm_otp_modal">
          <form style={{width: '100%'}}>
            <div className="isOtpVerify">
              <OtpInput
                numInputs={6}
                value={otpVerify}
                onChange={handleOtpChange}
                isInputNum={true}
                shouldAutoFocus={true}
                className=""
                separator={
                  <span>
                    {" "}
                    <div className="mdlboxGap" />
                  </span>
                }
              />
            </div>
            <div className="cstmFlxBox">
              <Grid className="linkRow" container>
                <Grid item xs sx={{ textAlign: "right" }}>
                  <Link
                    className="forgot-link"
                    style={{ fontSize: "18px" }}
                    onClick={resendOTP}
                  >
                    Resend OTP
                  </Link>
                </Grid>
              </Grid>
              <div className="cstm_btn_flk" style={{ width: "100%" }}>
                <Stack
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ my: 2 }}
                >
                  <LoadingButton
                    mt={2}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    sx={{ width: "100px" }}
                    onClick={onSubmitHandler}
                  >
                    Verify
                  </LoadingButton>
                </Stack>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
