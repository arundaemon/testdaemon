import eyeFill from "@iconify/icons-eva/eye-fill";
import eyeOffFill from "@iconify/icons-eva/eye-off-fill";
import { Icon } from "@iconify/react";
import { LoadingButton } from "@mui/lab";
import {
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  TextField
} from "@mui/material";
import axios from "axios";
import { Form, FormikProvider, useFormik } from "formik";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { activityLogger } from "../../../config/services/activities";
import { getAllChildRoles } from "../../../config/services/hrmServices";
import { getCubeTokenCrm } from "../../../config/services/reportEngineApis";
import { generateUserToken } from "../../../config/services/users";
import {
  getUserInfoAction,
  login,
} from "../../../redux/actions/loginActions/LoginActions";
import { LOGIN_SUCCESS } from "../../../redux/constants/LoginConstants";
import { EncryptData } from "../../../utils/encryptDecrypt";
import { sendEventToAppPlatform } from "../../../helper/randomFunction/activityData";

// ---------------------------------------------------------------------- //

export default function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  const LoginSchema = Yup.object().shape({
    username: Yup.string().required("User Id is required"),
    password: Yup.string().required("Password is required"),
  });

  const fetchAllChildRoles = () => {
    let userData = JSON.parse(localStorage.getItem('userData'))
    let role_name = !userData?.crm_role?.includes(",")
      ? userData?.crm_role?.trim()
      : userData?.crm_role?.split(",")?.[0]?.trim();
    return getAllChildRoles({ role_name }).then((res) => {
      //console.log(res)
      let { all_child_roles } = res?.data?.response?.data ?? { childs: [] };
      //console.log(all_child_roles)
      localStorage.setItem("childRoles", EncryptData(all_child_roles ?? []));
      return userData;
    });
  };

  const ClearLocalStorage = () => localStorage.clear();
  useEffect(() => ClearLocalStorage(), []);

  let redirectTo = "/authorised/";

  const formik = useFormik({
    initialValues: { username: "", password: "" },
    validationSchema: LoginSchema,

    onSubmit: (values, { setSubmitting }) => {
      let { username, password } = values;

      dispatch(login(username, password))
        .then((res) => {
          if (res?.type === LOGIN_SUCCESS && res.payload.user) {
            localStorage.setItem(
              "loginData",
              JSON.stringify(res?.payload?.user)
            );
            return dispatch(
              getUserInfoAction(username, res?.payload?.user?.access_token)
            );
          } else {
            throw Error("Invalid Username/Password");
          }
        })
        .then((userInfo) => {
          //console.log(userInfo)
          if (userInfo?.type === LOGIN_SUCCESS && userInfo.payload.user) {
            let { data } = userInfo?.payload?.user ?? { data: {} };
            let roleList = data?.crm_role?.split(",");
            data.crm_role = roleList[0];
            let eventObj = {
              uuid: data.employee_code ?? data.lead_id,
              role: data.crm_role,
              login:true
            }
            sendEventToAppPlatform('loginEvent',eventObj);
            localStorage.setItem("userRoles", JSON.stringify(roleList));
            localStorage.setItem("userData", JSON.stringify(data));
            let activityData = {
              empCode: data.employee_code,
              landing_page: "Login Page",
              action: "login",
              event_type: "Login",
              eventStep: "Login",
              click_type: "Login",
              eventData: data,
            };
            activityLogger(activityData);
            if (["BDE", "BDM"].indexOf(data?.crm_profile) > -1) {
              redirectTo = "/authorised/school-dashboard";
            } else {
              redirectTo = "/authorised/school-dashboard";
            }
            return generateUserToken(data);            
          } else {
            throw Error("Some Error Occurred, while fethcing User info");
          }
        })
        .then((userData) => {
          if (userData.result) {
            if (userData?.result?.menusAllowed?.length > 0) {
              let routeObj = userData?.result?.menusAllowed?.find(
                (x) => x.route == redirectTo
              );
              redirectTo = routeObj
                ? redirectTo
                : userData?.result?.menusAllowed?.[0]?.route;
            }
            //axios.defaults.headers.common['AccessToken'] = userData?.result?.UserToken;
            localStorage.setItem("UserToken", userData.result.UserToken);
            if(userData?.result?.UserToken){
              axios.defaults.headers.common["AccessToken"] = userData.result.UserToken
            }
            localStorage.setItem(
              "menusAllowed",
              JSON.stringify(userData.result.menusAllowed)
            ); 
            return getCubeTokenCrm();                     
          } else {
            throw Error("Some Error Occurred, while fethcing access Token");
          }          
        })
        .catch((err) => {
          setSubmitting(false);
          toast.error(err?.data?.message);
          return false
        })
        .then((cubeToken) => {
          localStorage.setItem("cubeToken", cubeToken?.data?.cubeToken); 
          return fetchAllChildRoles();
        })        
        .then(() => {
          /* if (localStorage.getItem("UserToken")) {
            axios.defaults.headers.common["AccessToken"] =
              localStorage.getItem("UserToken");
          } */
          setSubmitting(false);                   
          navigate(redirectTo);
        })
        .catch((err) => {
          console.log(err);
          setSubmitting(false);
          toast.error(err?.data?.message);
        });
    },
  });

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;
  const handleShowPassword = () => setShowPassword((show) => !show);
  const [checked, setChecked] = useState(true);
  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            className="signin-email"
            size="small"
            fullWidth
            autoComplete="email"
            type="text"
            label="Enter Your User Id"
            {...getFieldProps("username")}
            error={Boolean(touched.username && errors.username)}
            helperText={touched.username && errors.username}
          />
          <TextField
            className="signin-password"
            size="small"
            fullWidth
            autoComplete="current-password"
            type={showPassword ? "text" : "password"}
            label="Enter Password"
            {...getFieldProps("password")}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
                    <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />
          <Grid className="linkRow" container>
            <FormControlLabel
              control={<Checkbox size="small" onChange={handleChange} />}
              label="Remember me"
            />
            <Grid item xs sx={{ textAlign: "right" }}>
              <Link
                className="forgot-link"
                to="/forgot-password"
                variant="body2"
              >
                Forgot password?
              </Link>
            </Grid>
          </Grid>
        </Stack>

        <Stack
          alignItems="center"
          justifyContent="space-between"
          sx={{ my: 2 }}
        >
          <LoadingButton
            className="signin-btn"
            mt={2}
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Sign&nbsp;In
          </LoadingButton>
        </Stack>

        {/* <Stack>
          <Divider sx={{ fontSize: "12px", color: "#85888A" }}>OR</Divider>
        </Stack>
        
        <div className='withOtp center'>
          <span>Sign In with OTP?</span>
          <Link to="/">Get OTP</Link>
        </div> */}
      </Form>
    </FormikProvider>
  );
}
