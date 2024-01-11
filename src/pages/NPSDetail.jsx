import { Box, Grid, Typography } from '@mui/material';
import { memo, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { ReactComponent as DownloadIcon} from '../assets/image/downloadIcon.svg'

const NPSDetail = () => {
    const dispatch = useDispatch()
    const invoiceSchedule = useSelector(state => state.invoiceSchedule)
    const npsRessonMap = {
        1: "Late Implementation",
        2: "Service Issue",
        3: "Others",
    }
    
    // console.log(invoiceSchedule, '-----------')


    return (        
        <>
            <Box className='crm-schedule-list-container'>
                <Typography component={"h1"} className='crm-page-heading'>NPS Details</Typography>
                <Grid container>
                    <Grid item xs={6} md={4} lg={2}>
                        <Box className='crm-schedule-list-item'>
                            <Typography className='' component={"h4"}>NPS Document</Typography>
                            <Box display='flex' alignContent='center' justifyContent='flex-start'>
                                <Typography component={"p"} mr={2}>{invoiceSchedule?.nps_details?.nps_document_url?.split("_")?.pop()}</Typography> 
                                <a href={invoiceSchedule?.nps_details?.nps_document_url} > <DownloadIcon style={{ cursor: 'pointer', width: '20px', height: '20px', }}/></a>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={6} md={4} lg={2}>
                        <Box className='crm-schedule-list-item'>
                            <Typography className='' component={"h4"}>Proposed Start Date</Typography>
                            <Typography component={"p"}>{invoiceSchedule?.nps_details?.nps_effective_date}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={6} md={4} lg={2}>
                        <Box className='crm-schedule-list-item'>
                            <Typography className='' component={"h4"}>NPS Reason</Typography>
                            <Typography component={"p"}>{npsRessonMap[invoiceSchedule?.nps_details?.nps_reason_id]}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={6} md={4} lg={2}>
                        <Box className='crm-schedule-list-item'>
                            <Typography className='' component={"h4"}>Remarks</Typography>
                            <Typography component={"p"}>{invoiceSchedule?.nps_details?.nps_remarks ? invoiceSchedule?.nps_details?.nps_remarks: 'NA'}</Typography>
                        </Box>
                    </Grid>

                
                </Grid>
            </Box>

        </>
    )
}

export default memo(NPSDetail)