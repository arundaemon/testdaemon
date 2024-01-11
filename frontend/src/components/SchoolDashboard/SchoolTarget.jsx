import { useState } from 'react';
import {
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography, Tabs, Tab, Box,
} from "@mui/material";
import { useStyles } from "../../css/Dasboard-css";
import { Link } from "react-router-dom";
import useMediaQuery from '@mui/material/useMediaQuery';

export const SchoolTarget = () => {
  const classes = useStyles();
  const [currentCategoryTab, setCurrentCategoryTab] = useState(1);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));

  const handleCategoryTabChange = (event, newValue) => {
    setCurrentCategoryTab(newValue);
  };

  return (
    <>
      <Box className='crm-sd-target'>
        <Box className='crm-sd-target-tabs'>
          <Box className="crm-tabs theme2-tabs">
            <Tabs
                //ref={tabsRef}
                value={currentCategoryTab}
                onChange={handleCategoryTabChange}
                indicatorColor="primary"
                textColor="primary"
                variant="scrollable"
                scrollButtons="auto"
                TabIndicatorProps={{
                  sx: {
                      backgroundColor: 'transparent',
                  },
                  children: <span />
                }}
                allowScrollButtonsMobile
              >
                {[{tabName: 'Hots ', id: 1}, {tabName: 'Base Schools', id: 2}, 
                  {tabName: 'EM Schools', id: 3}, {tabName: 'Pipeline', id: 4}]?.map((tab, i) => (
                  <Tab
                    key={i}
                    className="tab-item"
                    value={tab.id}
                    label={
                      <Grid container alignItems="center" justify="center" className="tab-item-box" >
                        <Box sx={{width: '100%'}}>
                            <Typography variant='h5' className='tab-item-label' > {tab.tabName}</Typography>
                        </Box>
                      </Grid>
                      
                    }
                  />
                ))}
            </Tabs>
          </Box>
        </Box>
        

        <Grid >
          <Typography component='h6' className='crm-sd-target-label'>Total Counts: 07</Typography>
        </Grid>
        <Grid container spacing={isMobile ? 0 : 2} className='crm-sd-target-list'>
            {
              [{owner: 'Shashank', id: 1}, {owner: 'Shahtayu', id: 2}, 
                {owner: 'Shrishti', id: 3}, {owner: 'Abhishek', id: 4}].map((item, i) => (
                  <Grid key={i} item xs={12} md={6} >
                    <Box className='crm-sd-target-list-item'>
                      <Box className='crm-sd-target-list-item-label'>Owner : {item.owner}</Box>
                      <Box className='crm-sd-target-list-item-content'>
                        School Name: DPS Noida | Product: ESC+ | EDC: 20-05-2023 | Count of EDC: 05 | Units: 05 | Expected CV: ₹ 50,000/-
                      </Box>
                    </Box>
                  </Grid>
                ))
            }
        </Grid>
        <Box  className='crm-anchor crm-sd-target-viewmore' onClick={() => null}>View More</Box>
      
      </Box>
    </>
  );
};
