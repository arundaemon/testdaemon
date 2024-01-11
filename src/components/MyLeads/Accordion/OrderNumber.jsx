import React, { useRef } from 'react'
import Iframe from 'react-iframe'
import { useLocation } from 'react-router-dom';

const OrderNumber = () => {
    const location = useLocation();
    const url = location?.state?.url;

    return (
        <div>
            <Iframe src={url} width="100%" height="100%" styles={{ border: 'none', minHeight: '800px' }} />
        </div>
    )

}
export default OrderNumber