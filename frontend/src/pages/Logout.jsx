import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { styled } from '@mui/material/styles';
import Page from '../components/Page';
import { DecryptData } from '../utils/encryptDecrypt';
import { getUserData } from '../helper/randomFunction/localStorage';
import { sendEventToAppPlatform } from '../helper/randomFunction/activityData';
// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        display: 'flex'
    }
}));
// ----------------------------------------------------------------------

export default function Login() {
    const navigate = useNavigate()

    useEffect(() => {
        let loginPath = DecryptData(localStorage.getItem('loginSource'))
        let eventObj = {
            uuid: getUserData('userData').employee_code?? getUserData('userData').lead_id,
            role: getUserData('userData').crm_role,
            login: false
        }
        sendEventToAppPlatform('loginEvent', eventObj)
        localStorage.clear();
        if (loginPath)
            navigate(`/${loginPath}`)
        else
            navigate('/login')
    });

    return (
        <RootStyle title="Admin Login">
            Logging Out....
        </RootStyle>
    );
}
