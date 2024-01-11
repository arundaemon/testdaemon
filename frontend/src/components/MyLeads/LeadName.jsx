import React from 'react'
import Iframe from 'react-iframe'
import { Link } from 'react-router-dom'; 
import settings from '../../config/settings';
import { Typography } from '@mui/material';
import Breadcrumbs from "@mui/material/Breadcrumbs";
import BredArrow from '../../assets/image/bredArrow.svg'
import { useLocation } from 'react-router-dom';


const LeadName = () => {
    const location = useLocation();
    const redirect = `${settings.REDIRECT_LEAD_NAME_URL}/setcreds/62988928-2129-4a1d-9f85-5d203d585687?role=STUDENT&amp;redirectURL=/studentReport&amp;lang=en`
   

    const breadcrumbs = [
        <Link
            underline="hover"
            key="1"
            color="inherit"
            to='/authorised/lead-Assignment'
        >
            Listing
        </Link>,

        <Link
            underline="hover"
            key="2"
            color="inherit"
            to={`/authorised/listing-details/${location?.state?.id}`}
        >
            Lead Page
        </Link>,
        
        <Typography key="3" color="text.primary" fontWeight="600" fontSize="14px">
            Lead Detail
        </Typography>
    ];

    return (
        <div>
            <Breadcrumbs
                separator={<img src={BredArrow} alt=""/>}
                aria-label="breadcrumb"
            >
                {breadcrumbs}
            </Breadcrumbs>

            <Iframe src={redirect} width="100%" height="100%" styles={{ border: 'none', minHeight: '800px' }} />
        </div>
    )

}
export default LeadName