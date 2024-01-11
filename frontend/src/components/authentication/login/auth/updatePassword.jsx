import * as Yup from 'yup';
import axios from 'axios';
import md5 from "md5";
import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import { useFormik, Form, Formik } from 'formik';
import { Stack, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import settings from '../../../../config/settings';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { isError } from '../../../../helper/randomFunction/isError';
var axiosInstance = axios.create()
// ----------------------------------------------------------------------

export default function UpdatePassword(props) {



  const [userName, setUserName] = useState(props.data)
  const [getOtp, setVerifyOtp] = useState(false);

  const navigate = useNavigate();

  const re = new RegExp('^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$');

  const websiteKey = '2832FSTDT7237DHDDH338HH'
  const websiteMsaSalt = '$crMNewST@2022'


  const LoginSchema = Yup.object().shape({
    password: Yup.string()
      // .min(6, 'Password must be atleast 6 characters')
      .max(50, 'Too Long!')
      .required('Password is required')
      .matches(
        /^.*(?=.{6,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
        "Password must contain at least 6 characters, one uppercase, one number and one special case character"
      ),

    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Password must match')
      .required('Confirm password is required')
  });

  const ClearLocalStorage = () => localStorage.clear()
  useEffect(() => ClearLocalStorage(), []);


  const getChecksum = (action, username, password) => {

    let checksum = md5(`${action}:${websiteKey}:${username}:${password}:${websiteMsaSalt}`)

    return checksum
  }
  
  const formik = useFormik({
    initialValues: { password: '', confirmPassword: '' },
    validationSchema: LoginSchema,

    onSubmit: (values, actions) => {
      let { password } = values
      
      let data = {
        action: "update_password",
        apikey: websiteKey,
        checksum: getChecksum("update_password", userName, password),
        username: userName,
        password: password
      };
      let config = {}
      let url = `${settings.WEBSITE_URL}cognito-login-service/auth/updatePassword  `

      axiosInstance.post(url, data, config)
        .then(res => {
          let { data } = res

          if (data) {
            actions.setSubmitting(false);
            toast.success(data.message);
            setTimeout(
              () => {
                navigate('/login')
              }, 1000
            )
          }

        }
        )
        .catch(error => {
          isError(error)
          localStorage.clear()
          actions.setSubmitting(false);
        })
    }
  });

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik

  return (
    <>
      <Formik value={formik}>
        <Form autoComplete="off" onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              sx={{ marginBottom: 4 }}
              fullWidth
              autoComplete="Password"
              label="New Password"
              name="password"
              type="password"
              {...getFieldProps('password')}
              error={Boolean(touched.password && errors.password)}
              helperText={touched.password && errors.password}
            />
          </Stack>

          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Confirm Password"
              autoComplete="Password"
              name="confirmpassword"
              type="password"
              {...getFieldProps('confirmPassword')}
              error={Boolean(touched.confirmPassword && errors.confirmPassword)}
              helperText={touched.confirmPassword && errors.confirmPassword}
            />
          </Stack>


          <Stack alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
            <LoadingButton mt={2} fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>Reset</LoadingButton>
          </Stack>
        </Form>
      </Formik>
    </>
  );
}
// getFieldProps('password')?.value