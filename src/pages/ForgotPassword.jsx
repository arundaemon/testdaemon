import { styled } from "@mui/material/styles";
import { Stack, Container, Typography } from "@mui/material";
import OutsideHeader from "../layouts/OutsideHeader";
import Page from "../components/Page";
import { ForgotPasswordForm } from "../components/authentication/login";
import { useState } from "react";
// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "flex",
  },
}));

const ContentStyle = styled("div")(({ theme }) => ({
  maxWidth: 480,
  margin: "auto",
  display: "flex",
  minHeight: "100vh",
  flexDirection: "column",
  justifyContent: "center",
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function ForgotPassword() {
  const [isVerify, setVerifyOtp] = useState(false);

  const isOtpVerify = (status) => {
    setVerifyOtp(status);
  };

  return (
    <RootStyle title="Login">
      <Stack>
        {" "}
        <OutsideHeader />{" "}
      </Stack>
      <Container maxWidth="sm">
        <ContentStyle>
          <Stack sx={{ mb: 5 }}>
            <Typography variant="h4" gutterBottom>
              {" "}
              {isVerify ? "Please Verify Your Otp" : "Forgot Password"}{" "}
            </Typography>
            <Typography sx={{ color: "text.secondary" }}>
              Enter Details Below.
            </Typography>
          </Stack>
          <ForgotPasswordForm isOtpVerify={isOtpVerify} />
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
