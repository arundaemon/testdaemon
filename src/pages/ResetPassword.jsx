import { styled } from '@mui/material/styles';
import { Stack, Container, Typography } from '@mui/material';
import OutsideHeader from '../layouts/OutsideHeader';
import Page from '../components/Page';
// import { ForgotPasswordForm } from '../components/authentication/login';
import UpdatePassword from '../components/authentication/login/auth/updatePassword';
import { useLocation, useNavigate, useHistory } from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';
// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        display: 'flex'
    }
}));

const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: 480,
    margin: 'auto',
    display: 'flex',
    minHeight: '100vh',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: theme.spacing(12, 0)
}));

// ----------------------------------------------------------------------

export default function ResetPassword() {

    
	 const data = useLocation();
	 const navigate = useNavigate()
     
     const [userName, setUserName] = useState(data?.state?.username)
     
		useEffect( () => {
			let checkOtp = data?.state?.otp
            // console.log(data, "test otp")
			if (!checkOtp) {
			  navigate('/forgot-password')
			}

		}, [])
		
        // console.log(userName, "test name")
    return (
        <RootStyle title="Login">
            <Stack> <OutsideHeader /> </Stack>
            <Container maxWidth="sm">
                <ContentStyle>
                    <Stack sx={{ mb: 5 }}>
                    <Typography variant="h4" gutterBottom> Reset Password</Typography>
                    <Typography sx={{ color: 'text.secondary' }}>Enter Details Below.</Typography>
                    </Stack>
                <UpdatePassword data={userName}/>
                </ContentStyle>
            </Container>
        </RootStyle>
    );
}
