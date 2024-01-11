import { styled } from '@mui/material/styles';
import { Stack, Container, Typography } from '@mui/material';
import OutsideHeader from '../layouts/OutsideHeader';
import Page from '../components/Page';
import { LoginForm } from '../components/authentication/login';
// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        display: 'flex'
    }
}));

const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: 410,
    margin: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
}));


// ----------------------------------------------------------------------

export default function Login() {
    return (
        <RootStyle className='sign-in-section' title="Login">
            <Stack> <OutsideHeader /> </Stack>
            <Container style={{maxWidth:'460px'}}>
                <ContentStyle className='sign-in-card' >
                    <Stack>
                        <Typography variant="h4" gutterBottom> Sign In </Typography>
                        <Typography className='enter-detail'>Enter Details Below.</Typography>
                    </Stack>
                    <LoginForm />
                </ContentStyle>
            </Container>
        </RootStyle>
    );
}
