import { useEffect, useState } from 'react';
import { Grid, Typography, Box, } from "@mui/material";
import useMediaQuery from '@mui/material/useMediaQuery';

export const Statistics = () => {
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
    const [statisticsList, setStatisticsList] = useState([]);

    useEffect(() => {
        setStatisticsList([
            {label: 'Count of deal closed', value: '03'},
            {label: 'Closure from Hots', value: '02'},
            {label: 'No. of active students', value: '80'},
            {label: 'Booked revenue', value: '₹ 3,00,000'},
            {label: 'Invoiced revenue', value: '₹ 1,00,000'},
            {label: 'Pending to Invoiced', value: '05'},
            {label: 'EDC change count', value: '09'},
            {label: 'NA to Pipeline', value: '20'},
            {label: 'Pipeline to Hots', value: '06'},
            {label: 'Hots to Pipeline', value: '20'},
            {label: 'Pipeline to NA', value: '25'},
            {label: 'Hots to NA', value: '25'},
        ])
    }, []);
 
  return (
    <>
      <Box className='crm-sd-statistics'>

        <Grid container spacing={isMobile ? 2 : 2} className='crm-sd-statistics-list'>
            {
              statisticsList?.map((item, i) => (
                  <Grid key={i} item xs={6} md={3}  >
                    <Box className='crm-sd-statistics-list-item'>
                      <Box className='crm-sd-statistics-list-item-label'>{item.label}</Box>
                      <Box className='crm-sd-statistics-list-item-value'>{item.value} </Box>
                    </Box>
                  </Grid>
                ))
            }
        </Grid>
      
      </Box>
    </>
  );
};
