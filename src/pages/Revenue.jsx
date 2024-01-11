import React, { useEffect } from 'react'
import Card from "@mui/material/Card";
//import RevenueCarousel from './RevenueCarousel';
import { Container, Button, Grid, Divider, Box } from "@mui/material";
import { getCubeData } from '../utils/CubeUtils'

function Revenue() {

  // const fetchDataFromCube = async () => {
  //   let query = {}

  //   return getCubeData(query)
  //     .then(response => {
  //       console.log(response, "::responseee");
  //     })

  // }

  // useEffect(() => fetchDataFromCube(), [])


  return (
    <>
      <Box className='revenue-parent'>
        <Grid container spacing={2}>
          <Grid item lg={6} style={{ display: 'flex', marginBottom: '10px' }} >
            <Card className='revenue-card'>
              <div className='revenue_heading'>
                <b>Revenue</b>
              </div>
              <Divider color="#FFFFFF" sx={{ borderBottomWidth: 1.5 }}></Divider>
              <div className='content'>
                <div>
                  <p>Target</p>
                  <b>10,000</b>
                </div>
                <Divider color="#FFFFFF" flexItem orientation="vertical" sx={{ borderRightWidth: 1.5 }} ></Divider>
                <div>
                  <p>Realised</p>
                  <b style={{ marginLeft: '5px' }}>60,000</b>
                </div>
                <Divider color="#FFFFFF" flexItem orientation="vertical" sx={{ borderRightWidth: 1.5 }} ></Divider>

                <div>
                  <p> Net of invoice</p>
                  <b style={{ marginLeft: '20px' }}>48,000</b>
                </div>
                <Divider color="#FFFFFF" flexItem orientation="vertical" sx={{ borderRightWidth: 1.5 }} ></Divider>

                <div>
                  <p>Punched</p>
                  <b style={{ marginLeft: '10px' }}>80,000</b>
                </div>
                <Divider color="#FFFFFF" flexItem orientation="vertical" sx={{ borderRightWidth: 1.5 }} ></Divider>

                <div>
                  <p>Incentive</p>
                  <b style={{ marginLeft: '10px' }}>6,000</b>
                </div>

              </div>

            </Card>
          </Grid>
          <Grid item lg={6}>
            <Card className=''>
              {/* <RevenueCarousel /> */}
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

export default Revenue;
